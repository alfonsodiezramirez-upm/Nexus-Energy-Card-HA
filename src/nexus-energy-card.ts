import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, state } from "lit/decorators.js";
import { buildEnergyGraph, type HistoryCache } from "./energy-graph";
import { DEFAULT_CONFIG, EMPTY_CONFIG } from "./default-config";
import { edgePath, layoutGraph } from "./layout";
import { calculateEdgeWidth } from "./flow-style";
import { formatPercent, formatValue } from "./format";
import { resolveLanguage, t, type NexusTranslationKey, type ResolvedNexusLanguage } from "./i18n";
import { normalizeVisualScale } from "./visual-scale";
import type {
  GraphBuildResult,
  GraphLayout,
  HomeAssistantLike,
  NexusEnergyCardConfig,
  NexusMode,
  PositionedEdge,
  PositionedNode
} from "./types";

const STORE_VERSION = 1;
const TOOLTIP_HOVER_DELAY = 250;
const TOOLTIP_CACHE_TTL = 60_000;
const TOOLTIP_WIDTH = 189;
const TOOLTIP_HEIGHT = 158;
const COMPACT_BREAKPOINT = 600;
const ULTRA_COMPACT_BREAKPOINT = 380;
const BREAKPOINT_HYSTERESIS = 20;
const RESIZE_DEBOUNCE = 100;
const WIDE_GRAPH_HEIGHT = 540;
const COMPACT_GRAPH_HEIGHT = 390;
const ULTRA_COMPACT_GRAPH_HEIGHT = 360;
const WIDE_FRAME_HORIZONTAL_PADDING = 46;
const COMPACT_FRAME_HORIZONTAL_PADDING = 20;
const ULTRA_FRAME_HORIZONTAL_PADDING = 18;

type NexusBreakpoint = "wide" | "compact" | "ultra-compact";

interface HistoryPoint {
  time: number;
  value: number;
}

interface TooltipState {
  nodeId: string;
  entityId?: string;
  name: string;
  icon: string;
  valueLabel: string;
  parentName: string;
  parentPercent: number;
  color: string;
  x: number;
  y: number;
  history: HistoryPoint[];
  loading: boolean;
  historySource: "home-assistant" | "local";
  error?: string;
}

interface TooltipHistoryCacheEntry {
  expiresAt: number;
  points: HistoryPoint[];
  pending?: Promise<HistoryPoint[]>;
}

@customElement("nexus-energy-card")
export class NexusEnergyCard extends LitElement {
  @state() private _config: NexusEnergyCardConfig = DEFAULT_CONFIG;
  @state() private _graph: GraphBuildResult = buildEnergyGraph(DEFAULT_CONFIG, undefined, "power");
  @state() private _mode: NexusMode = "power";
  @state() private _width = 1180;
  @state() private _breakpoint: NexusBreakpoint = "wide";
  @state() private _tooltip?: TooltipState;
  @state() private _expandedIds = new Set<string>();
  @state() private _collapsedIds = new Set<string>();

  private _hass?: HomeAssistantLike;
  private _resizeObserver?: ResizeObserver;
  private _historyCache: HistoryCache = new Map();
  private _tooltipHistoryCache = new Map<string, TooltipHistoryCacheEntry>();
  private _lastValues = new Map<string, number>();
  private _tooltipTimer?: number;
  private _resizeTimer?: number;
  private _pendingHostWidth = 1180;
  private _tooltipRequestId = 0;

  public static async getConfigElement(): Promise<HTMLElement> {
    await import("./nexus-energy-card-editor");
    return document.createElement("nexus-energy-card-editor");
  }

  public static getStubConfig(): NexusEnergyCardConfig {
    return {
      ...EMPTY_CONFIG,
      thresholds: {
        ...EMPTY_CONFIG.thresholds
      },
      sources: [],
      nodes: []
    };
  }

  public setConfig(config: NexusEnergyCardConfig): void {
    if (!config.entities && !config.nodes && !config.sources) {
      throw new Error("Missing minimum 'entities', 'sources', or 'nodes' parameters.");
    }

    const configWithoutLegacyHeight = { ...config } as NexusEnergyCardConfig & { height?: number };
    delete configWithoutLegacyHeight.height;
    this._config = {
      ...DEFAULT_CONFIG,
      ...configWithoutLegacyHeight,
      thresholds: {
        ...DEFAULT_CONFIG.thresholds,
        ...configWithoutLegacyHeight.thresholds
      }
    };
    this._mode = "power";
    this._restoreBranchState();
    this._rebuildGraph(true);
    this._scheduleResize(this.getBoundingClientRect().width || this._width, 0);
  }

  public set hass(hass: HomeAssistantLike) {
    this._hass = hass;
    this._rebuildGraph(false);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._restoreBranchState();
  }

  public override disconnectedCallback(): void {
    this._resizeObserver?.disconnect();
    window.clearTimeout(this._tooltipTimer);
    window.clearTimeout(this._resizeTimer);
    super.disconnectedCallback();
  }

  protected override firstUpdated(): void {
    if ("ResizeObserver" in window) {
      this._resizeObserver = new ResizeObserver(([entry]) => {
        this._scheduleResize(entry.contentRect.width);
      });
      this._resizeObserver.observe(this);
    }
    this._scheduleResize(this.getBoundingClientRect().width || this._width, 0);
  }

  private _scheduleResize(hostWidth: number, delay = RESIZE_DEBOUNCE): void {
    if (!Number.isFinite(hostWidth) || hostWidth <= 0) {
      return;
    }

    this._pendingHostWidth = Math.max(1, Math.round(hostWidth));
    window.clearTimeout(this._resizeTimer);
    this._resizeTimer = window.setTimeout(() => {
      const nextHostWidth = this._pendingHostWidth;
      const nextBreakpoint = this._nextBreakpoint(nextHostWidth);
      const nextLayoutWidth = this._contentWidthForBreakpoint(nextHostWidth, nextBreakpoint);
      if (this._width !== nextLayoutWidth) {
        this._width = nextLayoutWidth;
      }
      if (this._breakpoint !== nextBreakpoint) {
        this._breakpoint = nextBreakpoint;
      }
    }, delay);
  }

  private _nextBreakpoint(hostWidth: number): NexusBreakpoint {
    if (this._breakpoint === "ultra-compact") {
      return hostWidth >= ULTRA_COMPACT_BREAKPOINT + BREAKPOINT_HYSTERESIS ? "compact" : "ultra-compact";
    }

    if (this._breakpoint === "compact") {
      if (hostWidth <= ULTRA_COMPACT_BREAKPOINT) {
        return "ultra-compact";
      }
      return hostWidth >= COMPACT_BREAKPOINT + BREAKPOINT_HYSTERESIS ? "wide" : "compact";
    }

    if (hostWidth <= ULTRA_COMPACT_BREAKPOINT) {
      return "ultra-compact";
    }

    return hostWidth <= COMPACT_BREAKPOINT ? "compact" : "wide";
  }

  private _contentWidthForBreakpoint(hostWidth: number, breakpoint: NexusBreakpoint): number {
    const scale = this._visualScale();
    const framePadding =
      breakpoint === "ultra-compact"
        ? ULTRA_FRAME_HORIZONTAL_PADDING
        : breakpoint === "compact"
          ? COMPACT_FRAME_HORIZONTAL_PADDING
          : WIDE_FRAME_HORIZONTAL_PADDING;
    return Math.max(280, Math.round(hostWidth - framePadding * scale));
  }

  private _visualScale(): number {
    return normalizeVisualScale(this._config.visual_scale);
  }

  private _language(): ResolvedNexusLanguage {
    return resolveLanguage(this._config.language, this._hass?.language);
  }

  private _t(key: NexusTranslationKey): string {
    return t(this._language(), key);
  }

  private _tooltipWidth(): number {
    return TOOLTIP_WIDTH * this._visualScale();
  }

  private _tooltipHeight(): number {
    return TOOLTIP_HEIGHT * this._visualScale();
  }

  protected override render() {
    const scale = this._visualScale();
    const language = this._language();
    const orientation = this._breakpoint === "ultra-compact" ? "stacked" : this._breakpoint === "compact" ? "vertical" : "horizontal";
    const graphHeight =
      orientation === "stacked" ? ULTRA_COMPACT_GRAPH_HEIGHT : orientation === "vertical" ? COMPACT_GRAPH_HEIGHT : WIDE_GRAPH_HEIGHT;
    const layout = layoutGraph(this._graph, {
      width: this._width,
      height: graphHeight * scale,
      orientation,
      expandedIds: this._expandedIds,
      collapsedIds: this._collapsedIds,
      defaultExpandedDepth: this._config.default_expanded_depth ?? 2,
      hideZeroNodes: this._config.hide_zero_nodes ?? false,
      scale
    });
    const primary = layout.primaryRoot;
    const solarSources = this._graph.sources.filter((source) => this._isSolarSource(source));
    const hasSolarSource = solarSources.length > 0;
    const solarBalance =
      hasSolarSource && this._graph.total > 0
        ? Math.min(1, solarSources.reduce((sum, source) => sum + source.value, 0) / this._graph.total)
        : 0;

    return html`
      <ha-card class=${`nexus-shell bg-${this._config.background_style ?? "glass"}`} style=${`--nexus-scale:${scale};`}>
        <section class=${`nexus-card-frame ${this._breakpoint}`} data-breakpoint=${this._breakpoint} @pointerleave=${this._clearTooltip}>
          <header class="topbar">
            <div class="brand">
              <span class="brand-icon"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon></span>
              <div>
                <h2>${this._config.title ?? "Nexus Energy"}</h2>
                <p>
                  ${t(language, "totalInHome")}
                  <span class="live-dot"></span>
                  <strong>${t(language, "now")}</strong>
                </p>
              </div>
            </div>
          </header>

          <section class="summary-strip" aria-label=${t(language, "energySummary")}>
            <div class="primary-metric">
              <span>${t(language, "currentConsumption")}</span>
              <strong>${formatValue(this._graph.total, this._mode, this._config.precision)}</strong>
            </div>
            <div class="health-pill ${this._graph.overflowNodes.length ? "warning" : ""}">
              <ha-icon icon=${this._graph.overflowNodes.length ? "mdi:alert-circle-outline" : "mdi:shield-check-outline"}></ha-icon>
              ${this._graph.overflowNodes.length
                ? `${this._graph.overflowNodes.length} ${t(
                    language,
                    this._graph.overflowNodes.length === 1 ? "overflowSingular" : "overflowPlural"
                  )}`
                : t(language, "systemNormal")}
            </div>
          </section>

          <section class=${`graph-stage ${orientation} ${this._breakpoint}`} style=${`height:${layout.height}px`} @click=${this._clearTooltip}>
            ${this._renderSvg(layout)}
            <div class="node-layer">
              ${layout.nodes.map((node) => this._renderNode(node, primary, solarBalance, hasSolarSource))}
            </div>
            ${this._renderTooltip()}
          </section>
        </section>
      </ha-card>
    `;
  }

  private _renderSvg(layout: GraphLayout) {
    const maxFlowValue = Math.max(0.05, ...layout.edges.map((edge) => edge.value));

    return svg`
      <svg
        class="flow-layer"
        viewBox=${`0 0 ${layout.width} ${layout.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          ${layout.edges.map(
            (edge) => svg`
              <linearGradient id=${this._gradientId(edge.id)} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color=${this._edgeStart(edge)} stop-opacity="0.2"></stop>
                <stop offset="48%" stop-color=${this._edgeColor(edge)} stop-opacity="0.94"></stop>
                <stop offset="100%" stop-color=${this._edgeColor(edge)} stop-opacity="0.22"></stop>
              </linearGradient>
            `
          )}
        </defs>
        ${layout.edges.map((edge) => {
          const path = edgePath(edge, layout.orientation);
          const width = this._edgeWidth(edge, maxFlowValue);
          return svg`
            <g class=${`flow-edge ${edge.severity} ${edge.direction}`}>
              <path class="flow-halo" d=${path} stroke-width=${width + 6}></path>
              <path
                id=${this._pathId(edge.id)}
                class=${`flow-path ${this._mode}`}
                d=${path}
                stroke=${`url(#${this._gradientId(edge.id)})`}
                stroke-width=${width}
              ></path>
              ${this._mode === "power" && this._config.animation !== false
                ? svg`
                  <circle class="particle" r=${Math.max(1.8, width / 2.2)} fill=${this._edgeColor(edge)}>
                    <animateMotion
                      dur=${this._particleDuration(edge)}
                      repeatCount="indefinite"
                      rotate="auto"
                      calcMode=${edge.direction === "reverse" ? "linear" : nothing}
                      keyPoints=${edge.direction === "reverse" ? "1;0" : nothing}
                      keyTimes=${edge.direction === "reverse" ? "0;1" : nothing}
                    >
                      <mpath href=${`#${this._pathId(edge.id)}`}></mpath>
                    </animateMotion>
                  </circle>
                `
                : nothing}
            </g>
          `;
        })}
      </svg>
    `;
  }

  private _renderNode(node: PositionedNode, primary: PositionedNode | undefined, solarBalance: number, hasSolarSource: boolean) {
    const isRoot = primary?.id === node.id;
    const isContainer = node.children.length > 0;
    const isCollapsed = this._collapsedIds.has(node.id);
    const classes = [
      "flow-node",
      `role-${node.role}`,
      node.severity,
      isRoot ? "is-root" : "",
      isContainer ? "is-container" : "",
      isCollapsed ? "is-collapsed" : ""
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <article
        class=${classes}
        style=${`left:${node.x}px;top:${node.y}px;width:${node.width}px;height:${node.height}px;--node-accent:${this._nodeAccent(node)};`}
        data-node-id=${node.id}
        tabindex="0"
        @mouseenter=${() => this._queueTooltip(node)}
        @mouseleave=${() => this._hideTooltipFromNode(node)}
        @focusin=${() => this._queueTooltip(node, 0)}
        @focusout=${() => this._hideTooltipFromNode(node)}
        @click=${(event: Event) => this._handleNodeClick(event, node)}
      >
        ${isRoot ? this._renderRootNode(node, solarBalance, hasSolarSource) : this._renderCompactNode(node)}
      </article>
    `;
  }

  private _renderRootNode(node: PositionedNode, solarBalance: number, hasSolarSource: boolean) {
    const rootStats = this._rootStats();

    return html`
      <div class="root-heading">
        <span class="node-icon root-icon"><ha-icon icon=${node.icon}></ha-icon></span>
        <button class="collapse-button" type="button" title=${this._t("expandCollapse")} @click=${(event: Event) => this._toggleNode(event, node)}>
          <ha-icon icon=${this._collapsedIds.has(node.id) ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
        </button>
      </div>
      <div class="root-title">${node.name}</div>
      <div class="root-value">${formatValue(node.value, this._mode, this._config.precision)}</div>
      <div class="root-subtitle">${this._t("currentConsumption")}</div>
      <div class=${`gauge ${hasSolarSource ? "" : "is-hidden"}`} style=${`--gauge:${Math.round(solarBalance * 100)}%`}>
        <span>${Math.round(solarBalance * 100)}%</span>
        <small>${this._t("solarAutonomy")}</small>
      </div>
      ${rootStats.length
        ? html`
            <dl class="root-stats">
              ${rootStats.map((stat) => html`<div><dt>${stat.label}</dt><dd>${stat.value}</dd></div>`)}
            </dl>
          `
        : nothing}
    `;
  }

  private _rootStats(): Array<{ label: string; value: string }> {
    return [
      this._entityStat(this._config.voltage_entity, this._t("voltage")),
      this._entityStat(this._config.frequency_entity, this._t("frequency")),
      this._entityStat(this._config.power_factor_entity, this._t("powerFactor"))
    ].filter((stat): stat is { label: string; value: string } => Boolean(stat));
  }

  private _entityStat(entityId: string | undefined, label: string): { label: string; value: string } | undefined {
    const normalizedEntityId = entityId?.trim();
    if (!normalizedEntityId) {
      return undefined;
    }

    const state = this._hass?.states[normalizedEntityId];
    if (!state) {
      return undefined;
    }

    const rawState = String(state.state ?? "").trim();
    if (!rawState) {
      return undefined;
    }

    const parsed = Number.parseFloat(rawState.replace(",", "."));
    const formattedValue = Number.isFinite(parsed) ? formatRawNumber(parsed) : rawState;
    const unit = String(state.attributes.unit_of_measurement ?? "").trim();

    return {
      label,
      value: `${formattedValue} ${unit}`.trim()
    };
  }

  private _renderCompactNode(node: PositionedNode) {
    const statusText = this._nodeStatus(node);
    const scale = this._visualScale();
    return html`
      <div class="node-main">
        <span class="node-icon"><ha-icon icon=${node.icon}></ha-icon></span>
        <div class="node-copy">
          <strong>${node.name}</strong>
          <span>${formatValue(node.value, this._mode, this._config.precision)}</span>
        </div>
            ${node.children.length
          ? html`
              <button class="collapse-button" type="button" title=${this._t("expandCollapse")} @click=${(event: Event) => this._toggleNode(event, node)}>
                <ha-icon icon=${this._collapsedIds.has(node.id) ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
              </button>
            `
          : html`<span class="node-percent">${formatPercent(node.percentOfParent)}</span>`}
      </div>
      ${node.role === "source"
        ? html`
            <div class="source-meta">
              <strong>${formatPercent(node.capacity ? node.value / node.capacity : node.percentOfParent)}</strong>
              <span>${statusText}</span>
            </div>
            ${this._renderSparkline(node, Math.round(129 * scale), Math.round(26 * scale))}
          `
        : nothing}
      ${node.role !== "source" && node.children.length
        ? html`<div class="container-share">${formatPercent(node.percentOfParent)} ${this._t("ofTotal")}</div>`
        : nothing}
    `;
  }

  private _renderTooltip() {
    const tooltip = this._tooltip;
    if (!tooltip) {
      return nothing;
    }
    const tooltipWidth = this._tooltipWidth();
    const sparklineWidth = Math.round(162 * this._visualScale());
    const sparklineHeight = Math.round(44 * this._visualScale());

    return html`
      <aside
        class=${`tooltip ${tooltip.loading ? "is-loading" : ""}`}
        style=${`left:${tooltip.x}px;top:${tooltip.y}px;width:${tooltipWidth}px;--tooltip-accent:${tooltip.color};`}
        role="dialog"
        aria-label=${`${this._t("tooltipDetail")} ${tooltip.name}`}
      >
        <header>
          <span class="tooltip-icon"><ha-icon icon=${tooltip.icon}></ha-icon></span>
          <div>
            <strong>${tooltip.name}</strong>
            <span class="tooltip-value">${tooltip.valueLabel}</span>
          </div>
          <em>${formatPercent(tooltip.parentPercent)}</em>
        </header>
        <p>
          <span class="dot"></span>
          ${formatPercent(tooltip.parentPercent)} ${this._t("of")} ${tooltip.parentName}
        </p>
        ${this._renderTooltipSparkline(tooltip, sparklineWidth, sparklineHeight)}
        <footer>
          <ha-icon icon=${tooltip.error ? "mdi:alert-circle-outline" : tooltip.loading ? "mdi:clock-outline" : "mdi:chart-line"}></ha-icon>
          ${tooltip.error ?? (tooltip.loading ? this._t("loadingHaHistory") : this._tooltipHistoryLabel(tooltip))}
        </footer>
      </aside>
    `;
  }

  private _renderSparkline(node: PositionedNode, width: number, height: number) {
    const path = sparklinePath(node.history, width, height);
    return svg`
      <svg class="sparkline" viewBox=${`0 0 ${width} ${height}`} aria-hidden="true">
        <path class="sparkline-area" d=${`${path} L ${width} ${height} L 0 ${height} Z`}></path>
        <path class="sparkline-line" d=${path}></path>
      </svg>
    `;
  }

  private _renderTooltipSparkline(tooltip: TooltipState, width: number, height: number) {
    const path = sparklinePointPath(tooltip.history, width, height);
    return svg`
      <svg class="sparkline" viewBox=${`0 0 ${width} ${height}`} aria-hidden="true">
        <path class="sparkline-area" d=${`${path} L ${width} ${height} L 0 ${height} Z`}></path>
        <path class="sparkline-line" d=${path}></path>
      </svg>
    `;
  }

  private _toggleNode(event: Event, node: PositionedNode): void {
    if (node.children.length === 0) {
      return;
    }

    event.stopPropagation();
    const expanded = this._isCurrentlyExpanded(node);
    const nextExpanded = new Set(this._expandedIds);
    const nextCollapsed = new Set(this._collapsedIds);

    if (expanded) {
      nextExpanded.delete(node.id);
      nextCollapsed.add(node.id);
    } else {
      nextCollapsed.delete(node.id);
      nextExpanded.add(node.id);
    }

    this._expandedIds = nextExpanded;
    this._collapsedIds = nextCollapsed;
    this._saveBranchState();
  }

  private _isCurrentlyExpanded(node: PositionedNode): boolean {
    if (this._collapsedIds.has(node.id)) {
      return false;
    }

    if (this._expandedIds.has(node.id)) {
      return true;
    }

    return node.depth < (this._config.default_expanded_depth ?? 2);
  }

  private _queueTooltip(node: PositionedNode, delay = TOOLTIP_HOVER_DELAY): void {
    window.clearTimeout(this._tooltipTimer);
    this._tooltipTimer = window.setTimeout(() => this._openTooltip(node), delay);
  }

  private _handleNodeClick(event: Event, node: PositionedNode): void {
    event.stopPropagation();
    window.clearTimeout(this._tooltipTimer);
    if (this._tooltip?.nodeId === node.id) {
      this._clearTooltip();
      return;
    }
    this._openTooltip(node);
  }

  private _hideTooltipFromNode(node: PositionedNode): void {
    window.clearTimeout(this._tooltipTimer);
    if (this._tooltip?.nodeId === node.id) {
      this._clearTooltip();
    }
  }

  private _clearTooltip = (): void => {
    window.clearTimeout(this._tooltipTimer);
    this._tooltipRequestId += 1;
    this._tooltip = undefined;
  };

  private _openTooltip(node: PositionedNode): void {
    const requestId = ++this._tooltipRequestId;
    const entityId = node.entity;
    const fallbackHistory = this._fallbackTooltipHistory(node);
    const cached = entityId ? this._cachedTooltipHistory(entityId) : undefined;
    this._tooltip = {
      nodeId: node.id,
      entityId,
      name: node.name,
      icon: node.icon,
      valueLabel: this._currentValueLabel(node),
      parentName: node.parent?.name ?? this._t("balance"),
      parentPercent: node.parent && node.parent.value > 0 ? node.value / node.parent.value : node.percentOfParent,
      color: this._nodeAccent(node),
      ...this._tooltipPosition(node),
      history: cached ?? fallbackHistory,
      loading: Boolean(entityId && !cached),
      historySource: cached ? "home-assistant" : "local"
    };

    if (entityId && !cached) {
      void this._loadTooltipHistory(entityId, requestId);
    }
  }

  private async _loadTooltipHistory(entityId: string, requestId: number): Promise<void> {
    try {
      const points = await this._getTooltipHistory(entityId);
      if (this._tooltipRequestId !== requestId || this._tooltip?.entityId !== entityId) {
        return;
      }
      this._tooltip = {
        ...this._tooltip,
        history: points.length ? points : this._tooltip.history,
        loading: false,
        historySource: points.length ? "home-assistant" : "local",
        error: points.length ? undefined : this._t("noHistorySamples")
      };
    } catch {
      if (this._tooltipRequestId !== requestId || this._tooltip?.entityId !== entityId) {
        return;
      }
      this._tooltip = {
        ...this._tooltip,
        loading: false,
        historySource: "local",
        error: this._t("historyLoadError")
      };
    }
  }

  private _cachedTooltipHistory(entityId: string): HistoryPoint[] | undefined {
    const cached = this._tooltipHistoryCache.get(this._tooltipHistoryKey(entityId));
    if (!cached || cached.expiresAt <= Date.now()) {
      return undefined;
    }
    return cached.points;
  }

  private async _getTooltipHistory(entityId: string): Promise<HistoryPoint[]> {
    const key = this._tooltipHistoryKey(entityId);
    const cached = this._tooltipHistoryCache.get(key);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
      return cached.pending ?? cached.points;
    }

    const pending = this._fetchTooltipHistory(entityId);
    this._tooltipHistoryCache.set(key, {
      expiresAt: now + TOOLTIP_CACHE_TTL,
      points: cached?.points ?? [],
      pending
    });

    const points = await pending;
    this._tooltipHistoryCache.set(key, {
      expiresAt: Date.now() + TOOLTIP_CACHE_TTL,
      points
    });
    return points;
  }

  private async _fetchTooltipHistory(entityId: string): Promise<HistoryPoint[]> {
    const end = new Date();
    const start = new Date(end.getTime() - 60 * 60_000);

    if (this._hass?.callWS) {
      try {
        const response = await this._hass.callWS<unknown>({
          type: "history/history_during_period",
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          entity_ids: [entityId],
          significant_changes_only: false,
          minimal_response: false,
          no_attributes: true
        });
        const points = parseHistoryResponse(response, entityId);
        if (points.length) {
          return points;
        }
      } catch {
        // Fall through to REST-compatible callApi when the websocket history command is unavailable.
      }
    }

    if (this._hass?.callApi) {
      const params = new URLSearchParams({
        filter_entity_id: entityId,
        end_time: end.toISOString(),
        significant_changes_only: "false",
        minimal_response: "false",
        no_attributes: "true"
      });
      const restPath = `history/period/${encodeURIComponent(start.toISOString())}?${params.toString()}`;
      const response = await this._hass.callApi<unknown>("GET", restPath);
      return parseHistoryResponse(response, entityId);
    }

    return [];
  }

  private _tooltipHistoryKey(entityId: string): string {
    return `${this._mode}:${entityId}`;
  }

  private _fallbackTooltipHistory(node: PositionedNode): HistoryPoint[] {
    const rangeMs = 60 * 60_000;
    const now = Date.now();
    const values = node.history.length ? node.history : [node.value];
    return values.map((value, index) => ({
      time: now - rangeMs + (values.length === 1 ? rangeMs : (index / (values.length - 1)) * rangeMs),
      value
    }));
  }

  private _currentValueLabel(node: PositionedNode): string {
    const state = node.entity ? this._hass?.states[node.entity] : undefined;
    const raw = Number.parseFloat(String(state?.state ?? "").replace(",", "."));
    const unit = String(state?.attributes.unit_of_measurement ?? node.unit);
    if (Number.isFinite(raw)) {
      return `${formatRawNumber(Math.abs(raw))} ${unit}`.trim();
    }
    return formatValue(node.value, this._mode, this._config.precision);
  }

  private _tooltipPosition(node: PositionedNode): { x: number; y: number } {
    const stage = this.renderRoot.querySelector<HTMLElement>(".graph-stage");
    const nodeElement = [...this.renderRoot.querySelectorAll<HTMLElement>(".flow-node")].find((element) => element.dataset.nodeId === node.id);
    const tooltipWidth = this._tooltipWidth();
    const tooltipHeight = this._tooltipHeight();
    const scale = this._visualScale();
    if (!stage || !nodeElement) {
      return {
        x: Math.max(9 * scale, node.x + node.width + 11 * scale),
        y: Math.max(9 * scale, node.y + node.height / 2 - tooltipHeight / 2)
      };
    }

    const stageRect = stage.getBoundingClientRect();
    const nodeRect = nodeElement.getBoundingClientRect();
    const gap = 11 * scale;
    const pad = 9 * scale;
    let x = nodeRect.right - stageRect.left + gap;
    let y = nodeRect.top - stageRect.top + nodeRect.height / 2 - tooltipHeight / 2;

    if (x + tooltipWidth > stageRect.width - pad) {
      x = nodeRect.left - stageRect.left - tooltipWidth - gap;
    }

    if (x < pad) {
      x = nodeRect.left - stageRect.left + nodeRect.width / 2 - tooltipWidth / 2;
      y = nodeRect.bottom - stageRect.top + gap;
      if (y + tooltipHeight > stageRect.height - pad) {
        y = nodeRect.top - stageRect.top - tooltipHeight - gap;
      }
    }

    return {
      x: clampNumber(x, pad, Math.max(pad, stageRect.width - tooltipWidth - pad)),
      y: clampNumber(y, pad, Math.max(pad, stageRect.height - tooltipHeight - pad))
    };
  }

  private _tooltipHistoryLabel(tooltip: TooltipState): string {
    return tooltip.historySource === "home-assistant" ? this._t("historyFromHomeAssistant") : this._t("localHistoryUntilHa");
  }

  private _rebuildGraph(force: boolean): void {
    const graph = buildEnergyGraph(this._config, this._hass, this._mode, this._historyCache);
    if (force || this._hasMeaningfulGraphChange(graph)) {
      this._graph = graph;
      this._lastValues = new Map(graph.allNodes.map((node) => [node.id, node.value]));
    }
  }

  private _hasMeaningfulGraphChange(graph: GraphBuildResult): boolean {
    if (graph.signature !== this._graph.signature) {
      return true;
    }

    if (this._lastValues.size !== graph.allNodes.length) {
      return true;
    }

    return graph.allNodes.some((node) => {
      const previous = this._lastValues.get(node.id);
      if (previous === undefined) {
        return true;
      }
      const delta = Math.abs(node.value - previous);
      return delta > Math.max(0.005, Math.abs(previous) * 0.005);
    });
  }

  private _saveBranchState(): void {
    try {
      sessionStorage.setItem(
        this._storageKey(),
        JSON.stringify({
          version: STORE_VERSION,
          expanded: [...this._expandedIds],
          collapsed: [...this._collapsedIds]
        })
      );
    } catch {
      // Session storage can be blocked in hardened kiosk browsers.
    }
  }

  private _restoreBranchState(): void {
    try {
      const raw = sessionStorage.getItem(this._storageKey());
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as { version?: number; expanded?: string[]; collapsed?: string[] };
      if (parsed.version !== STORE_VERSION) {
        return;
      }
      this._expandedIds = new Set(parsed.expanded ?? []);
      this._collapsedIds = new Set(parsed.collapsed ?? []);
    } catch {
      this._expandedIds = new Set();
      this._collapsedIds = new Set();
    }
  }

  private _storageKey(): string {
    const title = this._config.title ?? "nexus-energy-card";
    return `nexus-energy-card:${title}:branches`;
  }

  private _edgeWidth(edge: PositionedEdge, maxFlowValue: number): number {
    return calculateEdgeWidth(edge.value, maxFlowValue, this._mode, edge.percent, this._config.line_width_base ?? 1.5) * this._visualScale();
  }

  private _particleDuration(edge: PositionedEdge): string {
    const speed = clampNumber(this._config.animation_speed ?? 1, 0.4, 3);
    const duration = Math.max(1.1, 6.8 - edge.value * 1.2) / speed;
    return `${duration.toFixed(2)}s`;
  }

  private _edgeColor(edge: PositionedEdge): string {
    const thresholdColor = this._thresholdColor(edge.to);
    if (thresholdColor) {
      return thresholdColor;
    }

    if (edge.direction === "reverse") {
      return "#50f0a6";
    }

    switch (edge.severity) {
      case "overflow":
        return "#ff6259";
      case "critical":
        return "#ffb000";
      case "warning":
        return "#ffd23f";
      case "normal":
      default:
        return this._config.base_color ?? (edge.from.role === "source" ? "#47f0bd" : "#38a5ff");
    }
  }

  private _edgeStart(edge: PositionedEdge): string {
    return edge.direction === "reverse" ? "#38a5ff" : "#76ffe2";
  }

  private _gradientId(edgeId: string): string {
    return `nexus-gradient-${edgeId.replace(/\W+/g, "-")}`;
  }

  private _pathId(edgeId: string): string {
    return `nexus-path-${edgeId.replace(/\W+/g, "-")}`;
  }

  private _nodeAccent(node: PositionedNode): string {
    const thresholdColor = this._thresholdColor(node);
    if (thresholdColor) {
      return thresholdColor;
    }

    if (node.color) {
      return node.color;
    }

    if (node.role === "source") {
      return "#54f1b8";
    }

    if (node.severity === "critical" || node.severity === "overflow") {
      return "#ff6259";
    }

    if (node.severity === "warning") {
      return "#ffd23f";
    }

    return this._config.base_color ?? "#8bbcff";
  }

  private _isSolarSource(node: Pick<PositionedNode, "id" | "name" | "icon" | "entity">): boolean {
    const signature = [node.id, node.name, node.icon, node.entity].filter(Boolean).join(" ").toLowerCase();
    return (
      signature.includes("solar") ||
      signature.includes("sun") ||
      signature.includes("fotovolta") ||
      signature.includes("photovolta") ||
      signature.includes("white-balance-sunny")
    );
  }

  private _thresholdColor(node: PositionedNode): string | undefined {
    const thresholds = [...(this._config.color_thresholds ?? [])].sort((a, b) => b.above - a.above);
    const value = this._mode === "power" ? node.value * 1000 : node.value;
    const match = thresholds.find((threshold) => {
      const targetMatches = !threshold.node_id || threshold.node_id === "__all__" || threshold.node_id === node.id;
      return targetMatches && value >= threshold.above;
    });

    return match?.color;
  }

  private _nodeStatus(node: PositionedNode): string {
    if (node.overflow) {
      return this._t("overflowStatus");
    }
    if (node.direction === "reverse") {
      return node.role === "source" ? this._t("exporting") : this._t("reverseFlow");
    }
    if (node.value <= 0.001) {
      return this._t("standby");
    }
    return node.role === "source" ? this._t("supplying") : this._t("active");
  }

  static override styles = css`
    :host {
      display: block;
      color: var(--primary-text-color, #f6f8fb);
      --nexus-bg: rgba(8, 18, 31, 0.82);
      --nexus-surface: rgba(24, 40, 58, 0.64);
      --nexus-surface-strong: rgba(34, 54, 76, 0.78);
      --nexus-line: rgba(164, 197, 226, 0.18);
      --nexus-muted: rgba(221, 232, 244, 0.68);
      --nexus-soft: rgba(221, 232, 244, 0.44);
      --nexus-cyan: #3aa7ff;
      --nexus-teal: #49f0bf;
      --nexus-green: #58ee83;
      --nexus-yellow: #ffd23f;
      --nexus-red: #ff6259;
      --nexus-scale: 1;
      letter-spacing: 0;
    }

    .nexus-shell {
      display: block;
      overflow: hidden;
      border: 1px solid rgba(139, 180, 216, 0.18);
      border-radius: calc(15px * var(--nexus-scale, 1));
      background:
        linear-gradient(135deg, rgba(21, 36, 54, 0.88), rgba(5, 15, 26, 0.96)),
        var(--card-background-color, #08121f);
      box-shadow: 0 calc(17px * var(--nexus-scale, 1)) calc(44px * var(--nexus-scale, 1)) rgba(0, 0, 0, 0.34);
    }

    .nexus-shell.bg-transparent {
      border-color: transparent;
      background: transparent;
      box-shadow: none;
    }

    .nexus-shell.bg-solid {
      background: var(--card-background-color, #08121f);
      box-shadow: none;
    }

    .nexus-card-frame {
      position: relative;
      min-width: 0;
      --nexus-title-size: calc(21px * var(--nexus-scale, 1));
      --nexus-primary-metric-size: calc(36px * var(--nexus-scale, 1));
      --nexus-source-padding: calc(14px * var(--nexus-scale, 1));
      --nexus-node-main-padding: 0 calc(14px * var(--nexus-scale, 1));
      --nexus-node-main-gap: calc(9px * var(--nexus-scale, 1));
      --nexus-node-icon-size: calc(26px * var(--nexus-scale, 1));
      --nexus-node-symbol-size: calc(16px * var(--nexus-scale, 1));
      --nexus-node-title-size: calc(11px * var(--nexus-scale, 1));
      --nexus-node-value-size: calc(11px * var(--nexus-scale, 1));
      --nexus-root-padding: calc(20px * var(--nexus-scale, 1)) calc(20px * var(--nexus-scale, 1)) calc(15px * var(--nexus-scale, 1));
      --nexus-root-icon-size: calc(36px * var(--nexus-scale, 1));
      --nexus-root-value-size: calc(27px * var(--nexus-scale, 1));
      --nexus-gauge-width: calc(102px * var(--nexus-scale, 1));
      --nexus-gauge-height: calc(62px * var(--nexus-scale, 1));
      padding: calc(18px * var(--nexus-scale, 1)) calc(22px * var(--nexus-scale, 1)) calc(14px * var(--nexus-scale, 1));
      border-radius: inherit;
      background:
        linear-gradient(90deg, rgba(64, 165, 255, 0.1), transparent 32%, rgba(73, 240, 191, 0.07)),
        rgba(4, 11, 19, 0.38);
      backdrop-filter: blur(calc(12px * var(--nexus-scale, 1)));
      overflow: hidden;
    }

    .nexus-card-frame.compact {
      --nexus-title-size: calc(15px * var(--nexus-scale, 1));
      --nexus-primary-metric-size: calc(26px * var(--nexus-scale, 1));
      --nexus-source-padding: calc(8px * var(--nexus-scale, 1));
      --nexus-node-main-padding: 0 calc(8px * var(--nexus-scale, 1));
      --nexus-node-main-gap: calc(6px * var(--nexus-scale, 1));
      --nexus-node-icon-size: calc(23px * var(--nexus-scale, 1));
      --nexus-node-symbol-size: calc(14px * var(--nexus-scale, 1));
      --nexus-node-title-size: calc(10px * var(--nexus-scale, 1));
      --nexus-node-value-size: calc(9px * var(--nexus-scale, 1));
      --nexus-root-padding: calc(12px * var(--nexus-scale, 1));
      --nexus-root-icon-size: calc(30px * var(--nexus-scale, 1));
      --nexus-root-value-size: calc(21px * var(--nexus-scale, 1));
      --nexus-gauge-width: calc(81px * var(--nexus-scale, 1));
      --nexus-gauge-height: calc(51px * var(--nexus-scale, 1));
      padding: calc(11px * var(--nexus-scale, 1)) calc(9px * var(--nexus-scale, 1)) calc(9px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.ultra-compact {
      --nexus-title-size: calc(14px * var(--nexus-scale, 1));
      --nexus-primary-metric-size: calc(23px * var(--nexus-scale, 1));
      --nexus-source-padding: calc(7px * var(--nexus-scale, 1)) calc(8px * var(--nexus-scale, 1));
      --nexus-node-main-padding: 0 calc(8px * var(--nexus-scale, 1));
      --nexus-node-main-gap: calc(6px * var(--nexus-scale, 1));
      --nexus-node-icon-size: calc(21px * var(--nexus-scale, 1));
      --nexus-node-symbol-size: calc(13px * var(--nexus-scale, 1));
      --nexus-node-title-size: calc(10px * var(--nexus-scale, 1));
      --nexus-node-value-size: calc(9px * var(--nexus-scale, 1));
      --nexus-root-padding: calc(11px * var(--nexus-scale, 1));
      --nexus-root-icon-size: calc(29px * var(--nexus-scale, 1));
      --nexus-root-value-size: calc(20px * var(--nexus-scale, 1));
      --nexus-gauge-width: calc(71px * var(--nexus-scale, 1));
      --nexus-gauge-height: calc(44px * var(--nexus-scale, 1));
      padding: calc(8px * var(--nexus-scale, 1));
    }

    .bg-transparent .nexus-card-frame {
      background: transparent;
      backdrop-filter: none;
    }

    .bg-solid .nexus-card-frame {
      background: rgba(8, 18, 31, 0.96);
      backdrop-filter: none;
    }

    .topbar,
    .summary-strip {
      position: relative;
      z-index: 3;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: calc(14px * var(--nexus-scale, 1));
      margin-bottom: calc(14px * var(--nexus-scale, 1));
    }

    .brand {
      display: flex;
      align-items: flex-start;
      gap: calc(12px * var(--nexus-scale, 1));
      min-width: 0;
    }

    .brand-icon {
      display: grid;
      width: calc(29px * var(--nexus-scale, 1));
      height: calc(29px * var(--nexus-scale, 1));
      place-items: center;
      color: #62c7ff;
      filter: drop-shadow(0 0 calc(9px * var(--nexus-scale, 1)) rgba(56, 165, 255, 0.42));
    }

    .brand-icon ha-icon {
      --mdc-icon-size: calc(26px * var(--nexus-scale, 1));
    }

    h2 {
      margin: 0;
      font-size: var(--nexus-title-size);
      line-height: 1.1;
      font-weight: 760;
      letter-spacing: 0;
    }

    .brand p {
      display: flex;
      align-items: center;
      gap: calc(5px * var(--nexus-scale, 1));
      margin: calc(14px * var(--nexus-scale, 1)) 0 0;
      color: var(--nexus-muted);
      font-size: calc(9px * var(--nexus-scale, 1));
      font-weight: 700;
      text-transform: uppercase;
    }

    .brand p strong {
      color: #7ff3ae;
      font-weight: 760;
    }

    .live-dot {
      width: calc(5px * var(--nexus-scale, 1));
      height: calc(5px * var(--nexus-scale, 1));
      border-radius: 999px;
      background: var(--nexus-green);
      box-shadow: 0 0 calc(11px * var(--nexus-scale, 1)) rgba(88, 238, 131, 0.85);
    }

    .summary-strip {
      display: flex;
      align-items: center;
      gap: calc(11px * var(--nexus-scale, 1));
    }

    button,
    select {
      font: inherit;
      letter-spacing: 0;
    }

    .health-pill {
      display: flex;
      align-items: center;
      min-height: calc(33px * var(--nexus-scale, 1));
      border: 1px solid var(--nexus-line);
      border-radius: calc(17px * var(--nexus-scale, 1));
      background: rgba(12, 22, 34, 0.55);
      color: var(--nexus-muted);
      backdrop-filter: blur(calc(12px * var(--nexus-scale, 1)));
    }

    .summary-strip {
      justify-content: space-between;
      margin-bottom: 0;
    }

    .primary-metric {
      display: grid;
      gap: calc(3px * var(--nexus-scale, 1));
    }

    .primary-metric span {
      color: var(--nexus-muted);
      font-size: calc(9px * var(--nexus-scale, 1));
      font-weight: 750;
      text-transform: uppercase;
    }

    .primary-metric strong {
      font-size: var(--nexus-primary-metric-size);
      line-height: 1;
      font-weight: 740;
    }

    .health-pill {
      gap: calc(6px * var(--nexus-scale, 1));
      padding: 0 calc(12px * var(--nexus-scale, 1));
      color: #68f292;
      font-size: calc(11px * var(--nexus-scale, 1));
      font-weight: 700;
    }

    .health-pill.warning {
      color: var(--nexus-yellow);
    }

    .health-pill ha-icon {
      --mdc-icon-size: calc(16px * var(--nexus-scale, 1));
    }

    .graph-stage {
      position: relative;
      z-index: 2;
      min-height: calc(390px * var(--nexus-scale, 1));
      margin-top: calc(2px * var(--nexus-scale, 1));
    }

    .flow-layer,
    .node-layer {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .flow-layer {
      z-index: 1;
      overflow: visible;
    }

    .node-layer {
      z-index: 2;
    }

    .flow-halo {
      fill: none;
      stroke: rgba(104, 181, 255, 0.08);
      stroke-linecap: round;
    }

    .flow-path {
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .flow-path.power {
      stroke-dasharray: calc(4px * var(--nexus-scale, 1)) calc(14px * var(--nexus-scale, 1));
      animation: dash-flow 1.4s linear infinite;
    }

    .flow-edge.overflow .flow-halo {
      stroke: rgba(255, 98, 89, 0.2);
    }

    .particle {
      filter: drop-shadow(0 0 calc(8px * var(--nexus-scale, 1)) currentColor);
    }

    @keyframes dash-flow {
      to {
        stroke-dashoffset: -35;
      }
    }

    .flow-node {
      position: absolute;
      box-sizing: border-box;
      overflow: hidden;
      border: 1px solid rgba(158, 195, 226, 0.22);
      border-radius: calc(9px * var(--nexus-scale, 1));
      background:
        linear-gradient(180deg, rgba(40, 61, 82, 0.72), rgba(17, 31, 46, 0.72)),
        rgba(14, 26, 39, 0.76);
      color: #f7fbff;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 calc(11px * var(--nexus-scale, 1)) calc(24px * var(--nexus-scale, 1)) rgba(0, 0, 0, 0.24);
      backdrop-filter: blur(calc(9px * var(--nexus-scale, 1)));
      outline: 0;
      cursor: default;
      transition:
        border-color 180ms ease,
        transform 180ms ease,
        box-shadow 180ms ease,
        background 180ms ease;
    }

    .flow-node:hover,
    .flow-node:focus-visible {
      transform: translateY(calc(-1px * var(--nexus-scale, 1)));
      border-color: rgba(120, 190, 255, 0.56);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        0 calc(14px * var(--nexus-scale, 1)) calc(32px * var(--nexus-scale, 1)) rgba(0, 0, 0, 0.34);
    }

    .flow-node.is-container {
      cursor: pointer;
    }

    .flow-node.warning {
      border-color: rgba(255, 210, 63, 0.52);
    }

    .flow-node.critical,
    .flow-node.overflow {
      border-color: rgba(255, 98, 89, 0.72);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        0 0 0 1px rgba(255, 98, 89, 0.16),
        0 calc(14px * var(--nexus-scale, 1)) calc(29px * var(--nexus-scale, 1)) rgba(255, 98, 89, 0.12);
    }

    .flow-node.role-rest {
      opacity: 0.74;
      border-style: dashed;
    }

    .flow-node.role-source {
      padding: var(--nexus-source-padding);
    }

    .flow-node.role-source .node-main {
      height: auto;
      padding: 0;
    }

    .flow-node.role-source::after,
    .flow-node.is-root::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(95deg, rgba(73, 240, 191, 0.12), transparent 45%);
    }

    .node-main {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: var(--nexus-node-icon-size) minmax(0, 1fr) auto;
      align-items: center;
      gap: var(--nexus-node-main-gap);
      height: 100%;
      padding: var(--nexus-node-main-padding);
    }

    .node-icon {
      display: grid;
      width: var(--nexus-node-icon-size);
      height: var(--nexus-node-icon-size);
      place-items: center;
      border-radius: calc(8px * var(--nexus-scale, 1));
      color: var(--node-accent, #8bbcff);
      background: rgba(58, 167, 255, 0.1);
    }

    .node-icon ha-icon {
      --mdc-icon-size: var(--nexus-node-symbol-size);
    }

    .role-source .node-icon {
      color: var(--node-accent, #54f1b8);
      background: rgba(73, 240, 191, 0.1);
    }

    .critical .node-icon,
    .overflow .node-icon {
      color: var(--nexus-red);
      background: rgba(255, 98, 89, 0.11);
    }

    .node-copy {
      display: grid;
      min-width: 0;
      gap: calc(3px * var(--nexus-scale, 1));
    }

    .node-copy strong {
      overflow: hidden;
      font-size: var(--nexus-node-title-size);
      font-weight: 710;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .node-copy span {
      overflow: hidden;
      color: #f7fbff;
      font-size: var(--nexus-node-value-size);
      font-weight: 650;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .node-percent,
    .container-share {
      color: var(--node-accent, var(--nexus-green));
      font-size: var(--nexus-node-value-size);
      font-weight: 780;
    }

    .warning .node-percent,
    .warning .container-share {
      color: var(--nexus-yellow);
    }

    .critical .node-percent,
    .overflow .node-percent,
    .critical .container-share,
    .overflow .container-share {
      color: var(--nexus-red);
    }

    .container-share {
      position: absolute;
      right: calc(14px * var(--nexus-scale, 1));
      bottom: calc(7px * var(--nexus-scale, 1));
      font-size: calc(9px * var(--nexus-scale, 1));
    }

    .collapse-button {
      display: grid;
      width: calc(23px * var(--nexus-scale, 1));
      height: calc(23px * var(--nexus-scale, 1));
      place-items: center;
      border: 0;
      border-radius: calc(8px * var(--nexus-scale, 1));
      color: rgba(255, 255, 255, 0.74);
      background: transparent;
      cursor: pointer;
    }

    .collapse-button:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
    }

    .collapse-button ha-icon {
      --mdc-icon-size: calc(15px * var(--nexus-scale, 1));
    }

    .source-meta {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: calc(8px * var(--nexus-scale, 1));
      margin: calc(6px * var(--nexus-scale, 1)) 0 calc(3px * var(--nexus-scale, 1)) calc(38px * var(--nexus-scale, 1));
      font-size: calc(10px * var(--nexus-scale, 1));
      color: var(--nexus-green);
    }

    .source-meta span {
      color: var(--nexus-muted);
    }

    .role-source .sparkline {
      position: relative;
      z-index: 1;
      margin-left: calc(38px * var(--nexus-scale, 1));
      width: calc(100% - calc(44px * var(--nexus-scale, 1)));
      height: calc(23px * var(--nexus-scale, 1));
    }

    .sparkline-line {
      fill: none;
      stroke: #58ee83;
      stroke-width: calc(1.5px * var(--nexus-scale, 1));
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .sparkline-area {
      fill: rgba(88, 238, 131, 0.12);
      stroke: none;
    }

    .is-root {
      padding: var(--nexus-root-padding);
      border-radius: calc(11px * var(--nexus-scale, 1));
      background:
        linear-gradient(180deg, rgba(31, 49, 70, 0.78), rgba(12, 24, 39, 0.8)),
        rgba(12, 24, 39, 0.82);
    }

    .root-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .root-icon {
      width: var(--nexus-root-icon-size);
      height: var(--nexus-root-icon-size);
      border-radius: calc(11px * var(--nexus-scale, 1));
      color: var(--nexus-cyan);
    }

    .root-icon ha-icon {
      --mdc-icon-size: calc(26px * var(--nexus-scale, 1));
    }

    .root-title {
      margin-top: calc(9px * var(--nexus-scale, 1));
      font-size: calc(14px * var(--nexus-scale, 1));
      font-weight: 740;
    }

    .root-value {
      margin-top: calc(12px * var(--nexus-scale, 1));
      font-size: var(--nexus-root-value-size);
      line-height: 1;
      font-weight: 740;
    }

    .root-subtitle {
      margin-top: calc(6px * var(--nexus-scale, 1));
      color: var(--nexus-muted);
      font-size: calc(11px * var(--nexus-scale, 1));
    }

    .gauge {
      position: relative;
      display: grid;
      width: var(--nexus-gauge-width);
      height: var(--nexus-gauge-height);
      place-items: center;
      margin: calc(17px * var(--nexus-scale, 1)) auto calc(9px * var(--nexus-scale, 1));
      border-radius: calc(114px * var(--nexus-scale, 1)) calc(114px * var(--nexus-scale, 1)) calc(12px * var(--nexus-scale, 1)) calc(12px * var(--nexus-scale, 1));
      background:
        radial-gradient(circle at 50% 85%, rgba(12, 24, 39, 1) 0 46%, transparent 47%),
        conic-gradient(from 230deg, var(--nexus-cyan) 0 var(--gauge), rgba(255, 255, 255, 0.14) var(--gauge) 74%, transparent 74%);
    }

    .gauge.is-hidden {
      display: none;
    }

    .gauge span {
      margin-top: calc(11px * var(--nexus-scale, 1));
      font-size: calc(22px * var(--nexus-scale, 1));
      font-weight: 760;
    }

    .gauge small {
      position: absolute;
      bottom: calc(6px * var(--nexus-scale, 1));
      color: var(--nexus-muted);
      font-size: calc(8px * var(--nexus-scale, 1));
    }

    .root-stats {
      display: grid;
      gap: calc(6px * var(--nexus-scale, 1));
      margin: 0;
      padding-top: calc(11px * var(--nexus-scale, 1));
      border-top: 1px solid rgba(255, 255, 255, 0.09);
    }

    .root-stats div {
      display: flex;
      justify-content: space-between;
      gap: calc(12px * var(--nexus-scale, 1));
      font-size: calc(10px * var(--nexus-scale, 1));
    }

    .root-stats dt {
      color: var(--nexus-muted);
    }

    .root-stats dd {
      margin: 0;
      color: #f7fbff;
    }

    .tooltip {
      position: absolute;
      z-index: 5;
      box-sizing: border-box;
      padding: calc(11px * var(--nexus-scale, 1));
      border: 1px solid rgba(158, 195, 226, 0.24);
      border-radius: calc(9px * var(--nexus-scale, 1));
      background:
        linear-gradient(180deg, rgba(26, 42, 62, 0.88), rgba(11, 22, 36, 0.94)),
        rgba(10, 22, 34, 0.92);
      box-shadow: 0 calc(17px * var(--nexus-scale, 1)) calc(32px * var(--nexus-scale, 1)) rgba(0, 0, 0, 0.38);
      backdrop-filter: blur(calc(11px * var(--nexus-scale, 1)));
      pointer-events: none;
      --tooltip-accent: var(--nexus-red);
    }

    .tooltip header {
      display: flex;
      align-items: center;
      gap: calc(8px * var(--nexus-scale, 1));
      font-size: calc(11px * var(--nexus-scale, 1));
      font-weight: 750;
    }

    .tooltip-icon {
      display: grid;
      flex: 0 0 auto;
      width: calc(26px * var(--nexus-scale, 1));
      height: calc(26px * var(--nexus-scale, 1));
      place-items: center;
      border-radius: calc(8px * var(--nexus-scale, 1));
      color: var(--tooltip-accent);
      background: color-mix(in srgb, var(--tooltip-accent) 18%, transparent);
    }

    .tooltip-icon ha-icon {
      --mdc-icon-size: calc(14px * var(--nexus-scale, 1));
    }

    .tooltip header div {
      min-width: 0;
      flex: 1;
    }

    .tooltip header strong,
    .tooltip-value {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tooltip-value,
    .tooltip header em {
      color: var(--tooltip-accent);
      font-style: normal;
      font-weight: 800;
    }

    .tooltip-value {
      margin-top: calc(3px * var(--nexus-scale, 1));
      font-size: calc(10px * var(--nexus-scale, 1));
    }

    .tooltip p {
      display: flex;
      align-items: center;
      gap: calc(6px * var(--nexus-scale, 1));
      margin: calc(8px * var(--nexus-scale, 1)) 0 calc(6px * var(--nexus-scale, 1));
      color: var(--nexus-muted);
      font-size: calc(10px * var(--nexus-scale, 1));
    }

    .tooltip .dot {
      width: calc(5px * var(--nexus-scale, 1));
      height: calc(5px * var(--nexus-scale, 1));
      border-radius: 999px;
      background: var(--tooltip-accent);
    }

    .tooltip .sparkline {
      width: 100%;
      height: calc(44px * var(--nexus-scale, 1));
      margin: calc(3px * var(--nexus-scale, 1)) 0 calc(8px * var(--nexus-scale, 1));
    }

    .tooltip .sparkline-line {
      stroke: var(--tooltip-accent);
      stroke-width: calc(1.8px * var(--nexus-scale, 1));
    }

    .tooltip .sparkline-area {
      fill: var(--tooltip-accent);
      fill-opacity: 0.13;
    }

    .tooltip footer {
      display: flex;
      align-items: center;
      gap: calc(6px * var(--nexus-scale, 1));
      color: var(--nexus-muted);
      font-size: calc(9px * var(--nexus-scale, 1));
    }

    .tooltip footer ha-icon {
      --mdc-icon-size: calc(12px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .topbar,
    .nexus-card-frame.compact .summary-strip,
    .nexus-card-frame.ultra-compact .topbar,
    .nexus-card-frame.ultra-compact .summary-strip {
      align-items: stretch;
      flex-direction: column;
    }

    .nexus-card-frame.compact .topbar,
    .nexus-card-frame.ultra-compact .topbar {
      gap: calc(9px * var(--nexus-scale, 1));
      margin-bottom: calc(11px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .brand,
    .nexus-card-frame.ultra-compact .brand {
      gap: calc(8px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .brand p,
    .nexus-card-frame.ultra-compact .brand p {
      margin-top: calc(6px * var(--nexus-scale, 1));
      font-size: calc(8px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .health-pill,
    .nexus-card-frame.ultra-compact .health-pill {
      align-self: flex-start;
      min-height: calc(29px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .graph-stage {
      min-height: calc(390px * var(--nexus-scale, 1));
      margin-top: calc(8px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.ultra-compact .graph-stage {
      min-height: calc(360px * var(--nexus-scale, 1));
      margin-top: calc(6px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .node-main,
    .nexus-card-frame.ultra-compact .node-main {
      grid-template-columns: var(--nexus-node-icon-size) minmax(0, 1fr) auto;
    }

    .nexus-card-frame.compact .flow-node.role-source .source-meta,
    .nexus-card-frame.compact .flow-node.role-source .sparkline,
    .nexus-card-frame.ultra-compact .flow-node.role-source .source-meta,
    .nexus-card-frame.ultra-compact .flow-node.role-source .sparkline {
      display: none;
    }

    .nexus-card-frame.compact .root-title,
    .nexus-card-frame.ultra-compact .root-title {
      font-size: calc(12px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .root-subtitle,
    .nexus-card-frame.ultra-compact .root-subtitle {
      font-size: calc(9px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .gauge {
      margin: calc(11px * var(--nexus-scale, 1)) auto calc(8px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.ultra-compact .gauge {
      margin: calc(8px * var(--nexus-scale, 1)) auto 0;
    }

    .nexus-card-frame.compact .gauge span {
      font-size: calc(17px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.ultra-compact .gauge span {
      margin-top: calc(8px * var(--nexus-scale, 1));
      font-size: calc(15px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .gauge small {
      font-size: calc(8px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.ultra-compact .gauge small {
      bottom: calc(5px * var(--nexus-scale, 1));
      font-size: calc(7px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .root-stats {
      gap: calc(5px * var(--nexus-scale, 1));
      padding-top: calc(8px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.compact .root-stats div {
      font-size: calc(9px * var(--nexus-scale, 1));
    }

    .nexus-card-frame.ultra-compact .root-stats {
      display: none;
    }
  `;
}

function sparklinePath(values: number[], width: number, height: number): string {
  if (values.length === 0) {
    return `M 0 ${height / 2} L ${width} ${height / 2}`;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(0.001, max - min);
  const points = values.map((value, index) => {
    const x = values.length === 1 ? width : (index / (values.length - 1)) * width;
    const y = height - ((value - min) / spread) * (height - 8) - 4;
    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  return points.join(" ");
}

function sparklinePointPath(points: HistoryPoint[], width: number, height: number): string {
  if (points.length === 0) {
    return `M 0 ${height / 2} L ${width} ${height / 2}`;
  }

  const sorted = [...points].sort((a, b) => a.time - b.time);
  const values = sorted.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(0.001, max - min);
  const start = sorted[0]?.time ?? 0;
  const end = sorted.at(-1)?.time ?? start;
  const timeSpread = Math.max(1, end - start);
  return sorted
    .map((point, index) => {
      const x = ((point.time - start) / timeSpread) * width;
      const y = height - ((point.value - min) / spread) * (height - 8) - 4;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function parseHistoryResponse(response: unknown, entityId: string): HistoryPoint[] {
  const groups = historyGroups(response);
  const selected =
    groups.find((group) =>
      group.some((entry) => {
        const item = entry as Record<string, unknown>;
        return item.entity_id === entityId;
      })
    ) ??
    groups[0] ??
    [];

  return selected
    .map((entry, index) => historyEntryToPoint(entry, index, selected.length))
    .filter((point): point is HistoryPoint => Boolean(point))
    .sort((a, b) => a.time - b.time);
}

function historyGroups(response: unknown): unknown[][] {
  if (!Array.isArray(response)) {
    return [];
  }

  if (response.every(Array.isArray)) {
    return response as unknown[][];
  }

  return [response];
}

function historyEntryToPoint(entry: unknown, index: number, total: number): HistoryPoint | undefined {
  if (!entry || typeof entry !== "object") {
    return undefined;
  }

  const item = entry as Record<string, unknown>;
  const state = item.state ?? item.s;
  const value = Number.parseFloat(String(state ?? "").replace(",", "."));
  if (!Number.isFinite(value)) {
    return undefined;
  }

  const parsedTime = parseHistoryTime(item.last_changed ?? item.last_updated ?? item.lc ?? item.lu);
  const time = parsedTime ?? Date.now() - Math.max(0, total - index - 1) * 60_000;
  return { time, value: Math.abs(value) };
}

function parseHistoryTime(value: unknown): number | undefined {
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 1_000_000_000_000 ? value : value * 1000;
  }

  return undefined;
}

function formatRawNumber(value: number): string {
  if (value >= 100 || Number.isInteger(value)) {
    return Math.round(value).toString();
  }

  if (value >= 10) {
    return trimTrailingZero(value.toFixed(1));
  }

  return trimTrailingZero(value.toFixed(2));
}

function trimTrailingZero(value: string): string {
  return value.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

declare global {
  interface HTMLElementTagNameMap {
    "nexus-energy-card": NexusEnergyCard;
  }
}
