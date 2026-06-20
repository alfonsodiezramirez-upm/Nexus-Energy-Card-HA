import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, state } from "lit/decorators.js";
import { buildEnergyGraph, type HistoryCache } from "./energy-graph";
import { DEFAULT_CONFIG, EMPTY_CONFIG } from "./default-config";
import { edgePath, layoutGraph } from "./layout";
import { calculateEdgeWidth } from "./flow-style";
import { formatPercent, formatValue } from "./format";
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
const TOOLTIP_WIDTH = 252;
const TOOLTIP_HEIGHT = 210;
const COMPACT_BREAKPOINT = 600;
const RESIZE_DEBOUNCE = 100;

type NexusBreakpoint = "wide" | "compact";

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
  private _pendingWidth = 1180;
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
      throw new Error("Parámetros 'entities', 'sources' o 'nodes' mínimos no definidos.");
    }

    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      thresholds: {
        ...DEFAULT_CONFIG.thresholds,
        ...config.thresholds
      }
    };
    this._mode = "power";
    this._restoreBranchState();
    this._rebuildGraph(true);
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
    const frame = this.renderRoot.querySelector<HTMLElement>(".nexus-card-frame");
    const resizeTarget = frame ?? this;
    if ("ResizeObserver" in window) {
      this._resizeObserver = new ResizeObserver(([entry]) => {
        this._scheduleResize(entry.contentRect.width);
      });
      this._resizeObserver.observe(resizeTarget);
    }
    this._scheduleResize(this._measuredContentWidth(resizeTarget) || this._width, 0);
  }

  private _measuredContentWidth(element: Element): number {
    const rect = element.getBoundingClientRect();
    if (!(element instanceof HTMLElement)) {
      return rect.width;
    }

    const style = getComputedStyle(element);
    const padding =
      Number.parseFloat(style.paddingLeft || "0") +
      Number.parseFloat(style.paddingRight || "0") +
      Number.parseFloat(style.borderLeftWidth || "0") +
      Number.parseFloat(style.borderRightWidth || "0");
    return Math.max(0, rect.width - padding);
  }

  private _scheduleResize(width: number, delay = RESIZE_DEBOUNCE): void {
    if (!Number.isFinite(width) || width <= 0) {
      return;
    }

    this._pendingWidth = Math.max(280, Math.round(width));
    window.clearTimeout(this._resizeTimer);
    this._resizeTimer = window.setTimeout(() => {
      const nextWidth = this._pendingWidth;
      const nextBreakpoint: NexusBreakpoint = nextWidth <= COMPACT_BREAKPOINT ? "compact" : "wide";
      if (this._width !== nextWidth) {
        this._width = nextWidth;
      }
      if (this._breakpoint !== nextBreakpoint) {
        this._breakpoint = nextBreakpoint;
      }
    }, delay);
  }

  protected override render() {
    const orientation = this._breakpoint === "compact" ? "vertical" : "horizontal";
    const graphHeight = orientation === "vertical" ? Math.max(520, this._config.height ?? 720) : this._config.height ?? 720;
    const layout = layoutGraph(this._graph, {
      width: this._width,
      height: graphHeight,
      orientation,
      expandedIds: this._expandedIds,
      collapsedIds: this._collapsedIds,
      defaultExpandedDepth: this._config.default_expanded_depth ?? 2,
      hideZeroNodes: this._config.hide_zero_nodes ?? false
    });
    const primary = layout.primaryRoot;
    const solarSources = this._graph.sources.filter((source) => this._isSolarSource(source));
    const hasSolarSource = solarSources.length > 0;
    const solarBalance =
      hasSolarSource && this._graph.total > 0
        ? Math.min(1, solarSources.reduce((sum, source) => sum + source.value, 0) / this._graph.total)
        : 0;

    return html`
      <ha-card class=${`nexus-shell bg-${this._config.background_style ?? "glass"}`}>
        <section class=${`nexus-card-frame ${this._breakpoint}`} data-breakpoint=${this._breakpoint} @pointerleave=${this._clearTooltip}>
          <header class="topbar">
            <div class="brand">
              <span class="brand-icon"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon></span>
              <div>
                <h2>${this._config.title ?? "Nexus Energy"}</h2>
                <p>
                  Total en casa
                  <span class="live-dot"></span>
                  <strong>Ahora</strong>
                </p>
              </div>
            </div>
          </header>

          <section class="summary-strip" aria-label="Resumen energético">
            <div class="primary-metric">
              <span>Consumo actual</span>
              <strong>${formatValue(this._graph.total, this._mode, this._config.precision)}</strong>
            </div>
            <div class="health-pill ${this._graph.overflowNodes.length ? "warning" : ""}">
              <ha-icon icon=${this._graph.overflowNodes.length ? "mdi:alert-circle-outline" : "mdi:shield-check-outline"}></ha-icon>
              ${this._graph.overflowNodes.length ? `${this._graph.overflowNodes.length} overflow` : "Sistema normal"}
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
              <path class="flow-halo" d=${path} stroke-width=${width + 8}></path>
              <path
                id=${this._pathId(edge.id)}
                class=${`flow-path ${this._mode}`}
                d=${path}
                stroke=${`url(#${this._gradientId(edge.id)})`}
                stroke-width=${width}
              ></path>
              ${this._mode === "power" && this._config.animation !== false
                ? svg`
                  <circle class="particle" r=${Math.max(2.4, width / 2.2)} fill=${this._edgeColor(edge)}>
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
    return html`
      <div class="root-heading">
        <span class="node-icon root-icon"><ha-icon icon=${node.icon}></ha-icon></span>
        <button class="collapse-button" type="button" title="Expandir o colapsar" @click=${(event: Event) => this._toggleNode(event, node)}>
          <ha-icon icon=${this._collapsedIds.has(node.id) ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
        </button>
      </div>
      <div class="root-title">${node.name}</div>
      <div class="root-value">${formatValue(node.value, this._mode, this._config.precision)}</div>
      <div class="root-subtitle">Consumo actual</div>
      <div class=${`gauge ${hasSolarSource ? "" : "is-hidden"}`} style=${`--gauge:${Math.round(solarBalance * 100)}%`}>
        <span>${Math.round(solarBalance * 100)}%</span>
        <small>Autonomía solar</small>
      </div>
      <dl class="root-stats">
        <div><dt>Voltaje</dt><dd>230 V</dd></div>
        <div><dt>Frecuencia</dt><dd>50.0 Hz</dd></div>
        <div><dt>Factor de potencia</dt><dd>0.97</dd></div>
      </dl>
    `;
  }

  private _renderCompactNode(node: PositionedNode) {
    const statusText = this._nodeStatus(node);
    return html`
      <div class="node-main">
        <span class="node-icon"><ha-icon icon=${node.icon}></ha-icon></span>
        <div class="node-copy">
          <strong>${node.name}</strong>
          <span>${formatValue(node.value, this._mode, this._config.precision)}</span>
        </div>
            ${node.children.length
          ? html`
              <button class="collapse-button" type="button" title="Expandir o colapsar" @click=${(event: Event) => this._toggleNode(event, node)}>
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
            ${this._renderSparkline(node, 172, 34)}
          `
        : nothing}
      ${node.role !== "source" && node.children.length
        ? html`<div class="container-share">${formatPercent(node.percentOfParent)} del total</div>`
        : nothing}
    `;
  }

  private _renderTooltip() {
    const tooltip = this._tooltip;
    if (!tooltip) {
      return nothing;
    }

    return html`
      <aside
        class=${`tooltip ${tooltip.loading ? "is-loading" : ""}`}
        style=${`left:${tooltip.x}px;top:${tooltip.y}px;width:${TOOLTIP_WIDTH}px;--tooltip-accent:${tooltip.color};`}
        role="dialog"
        aria-label=${`Detalle de ${tooltip.name}`}
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
          ${formatPercent(tooltip.parentPercent)} de ${tooltip.parentName}
        </p>
        ${this._renderTooltipSparkline(tooltip, 216, 58)}
        <footer>
          <ha-icon icon=${tooltip.error ? "mdi:alert-circle-outline" : tooltip.loading ? "mdi:clock-outline" : "mdi:chart-line"}></ha-icon>
          ${tooltip.error ?? (tooltip.loading ? "Cargando historial de Home Assistant" : this._tooltipHistoryLabel(tooltip))}
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
      parentName: node.parent?.name ?? "Balance",
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
        error: points.length ? undefined : "Sin muestras historicas disponibles"
      };
    } catch {
      if (this._tooltipRequestId !== requestId || this._tooltip?.entityId !== entityId) {
        return;
      }
      this._tooltip = {
        ...this._tooltip,
        loading: false,
        historySource: "local",
        error: "No se pudo cargar el historial de HA"
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
    if (!stage || !nodeElement) {
      return {
        x: Math.max(12, node.x + node.width + 14),
        y: Math.max(12, node.y + node.height / 2 - TOOLTIP_HEIGHT / 2)
      };
    }

    const stageRect = stage.getBoundingClientRect();
    const nodeRect = nodeElement.getBoundingClientRect();
    const gap = 14;
    const pad = 12;
    let x = nodeRect.right - stageRect.left + gap;
    let y = nodeRect.top - stageRect.top + nodeRect.height / 2 - TOOLTIP_HEIGHT / 2;

    if (x + TOOLTIP_WIDTH > stageRect.width - pad) {
      x = nodeRect.left - stageRect.left - TOOLTIP_WIDTH - gap;
    }

    if (x < pad) {
      x = nodeRect.left - stageRect.left + nodeRect.width / 2 - TOOLTIP_WIDTH / 2;
      y = nodeRect.bottom - stageRect.top + gap;
      if (y + TOOLTIP_HEIGHT > stageRect.height - pad) {
        y = nodeRect.top - stageRect.top - TOOLTIP_HEIGHT - gap;
      }
    }

    return {
      x: clampNumber(x, pad, Math.max(pad, stageRect.width - TOOLTIP_WIDTH - pad)),
      y: clampNumber(y, pad, Math.max(pad, stageRect.height - TOOLTIP_HEIGHT - pad))
    };
  }

  private _tooltipHistoryLabel(tooltip: TooltipState): string {
    return tooltip.historySource === "home-assistant" ? "Historial inmediato desde Home Assistant" : "Historial local hasta recibir datos de HA";
  }

  private _rebuildGraph(force: boolean): void {
    const graph = buildEnergyGraph(this._config, this._hass, this._mode, this._historyCache);
    if (force || this._hasMeaningfulGraphChange(graph)) {
      this._graph = graph;
      this._lastValues = new Map(graph.allNodes.map((node) => [node.id, node.value]));
    }
  }

  private _hasMeaningfulGraphChange(graph: GraphBuildResult): boolean {
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
    return calculateEdgeWidth(edge.value, maxFlowValue, this._mode, edge.percent, this._config.line_width_base ?? 2);
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
      return "Desbordamiento";
    }
    if (node.direction === "reverse") {
      return node.role === "source" ? "Exportando" : "Flujo inverso";
    }
    if (node.value <= 0.001) {
      return "Standby";
    }
    return node.role === "source" ? "Aportando" : "Activo";
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
      letter-spacing: 0;
    }

    .nexus-shell {
      display: block;
      overflow: hidden;
      border: 1px solid rgba(139, 180, 216, 0.18);
      border-radius: 20px;
      background:
        linear-gradient(135deg, rgba(21, 36, 54, 0.88), rgba(5, 15, 26, 0.96)),
        var(--card-background-color, #08121f);
      box-shadow: 0 22px 58px rgba(0, 0, 0, 0.38);
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
      --nexus-title-size: 28px;
      --nexus-primary-metric-size: 48px;
      --nexus-source-padding: 18px;
      --nexus-node-main-padding: 0 18px;
      --nexus-node-main-gap: 12px;
      --nexus-node-icon-size: 34px;
      --nexus-node-title-size: 15px;
      --nexus-node-value-size: 14px;
      --nexus-root-padding: 26px 26px 20px;
      --nexus-root-icon-size: 48px;
      --nexus-root-value-size: 36px;
      --nexus-gauge-width: 136px;
      --nexus-gauge-height: 82px;
      padding: 24px 30px 18px;
      border-radius: inherit;
      background:
        linear-gradient(90deg, rgba(64, 165, 255, 0.1), transparent 32%, rgba(73, 240, 191, 0.07)),
        rgba(4, 11, 19, 0.38);
      backdrop-filter: blur(12px);
      overflow: hidden;
    }

    .nexus-card-frame.compact {
      --nexus-title-size: 20px;
      --nexus-primary-metric-size: 34px;
      --nexus-source-padding: 10px;
      --nexus-node-main-padding: 0 10px;
      --nexus-node-main-gap: 8px;
      --nexus-node-icon-size: 30px;
      --nexus-node-title-size: 13px;
      --nexus-node-value-size: 12px;
      --nexus-root-padding: 16px;
      --nexus-root-icon-size: 40px;
      --nexus-root-value-size: 28px;
      --nexus-gauge-width: 108px;
      --nexus-gauge-height: 68px;
      padding: 14px 12px 12px;
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
      gap: 18px;
      margin-bottom: 18px;
    }

    .brand {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      min-width: 0;
    }

    .brand-icon {
      display: grid;
      width: 38px;
      height: 38px;
      place-items: center;
      color: #62c7ff;
      filter: drop-shadow(0 0 12px rgba(56, 165, 255, 0.45));
    }

    .brand-icon ha-icon {
      --mdc-icon-size: 34px;
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
      gap: 7px;
      margin: 18px 0 0;
      color: var(--nexus-muted);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .brand p strong {
      color: #7ff3ae;
      font-weight: 760;
    }

    .live-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: var(--nexus-green);
      box-shadow: 0 0 14px rgba(88, 238, 131, 0.9);
    }

    .summary-strip {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    button,
    select {
      font: inherit;
      letter-spacing: 0;
    }

    .health-pill {
      display: flex;
      align-items: center;
      min-height: 44px;
      border: 1px solid var(--nexus-line);
      border-radius: 22px;
      background: rgba(12, 22, 34, 0.55);
      color: var(--nexus-muted);
      backdrop-filter: blur(12px);
    }

    .summary-strip {
      justify-content: space-between;
      margin-bottom: 0;
    }

    .primary-metric {
      display: grid;
      gap: 4px;
    }

    .primary-metric span {
      color: var(--nexus-muted);
      font-size: 12px;
      font-weight: 750;
      text-transform: uppercase;
    }

    .primary-metric strong {
      font-size: var(--nexus-primary-metric-size);
      line-height: 1;
      font-weight: 740;
    }

    .health-pill {
      gap: 8px;
      padding: 0 16px;
      color: #68f292;
      font-weight: 700;
    }

    .health-pill.warning {
      color: var(--nexus-yellow);
    }

    .graph-stage {
      position: relative;
      z-index: 2;
      min-height: 520px;
      margin-top: 2px;
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
      stroke-dasharray: 5 18;
      animation: dash-flow 1.4s linear infinite;
    }

    .flow-edge.overflow .flow-halo {
      stroke: rgba(255, 98, 89, 0.2);
    }

    .particle {
      filter: drop-shadow(0 0 8px currentColor);
    }

    @keyframes dash-flow {
      to {
        stroke-dashoffset: -46;
      }
    }

    .flow-node {
      position: absolute;
      box-sizing: border-box;
      overflow: hidden;
      border: 1px solid rgba(158, 195, 226, 0.22);
      border-radius: 12px;
      background:
        linear-gradient(180deg, rgba(40, 61, 82, 0.72), rgba(17, 31, 46, 0.72)),
        rgba(14, 26, 39, 0.76);
      color: #f7fbff;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 14px 32px rgba(0, 0, 0, 0.28);
      backdrop-filter: blur(12px);
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
      transform: translateY(-1px);
      border-color: rgba(120, 190, 255, 0.56);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        0 18px 42px rgba(0, 0, 0, 0.38);
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
        0 18px 38px rgba(255, 98, 89, 0.12);
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
      grid-template-columns: 38px minmax(0, 1fr) auto;
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
      border-radius: 10px;
      color: var(--node-accent, #8bbcff);
      background: rgba(58, 167, 255, 0.1);
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
      gap: 4px;
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
      right: 18px;
      bottom: 9px;
      font-size: 12px;
    }

    .collapse-button {
      display: grid;
      width: 30px;
      height: 30px;
      place-items: center;
      border: 0;
      border-radius: 10px;
      color: rgba(255, 255, 255, 0.74);
      background: transparent;
      cursor: pointer;
    }

    .collapse-button:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
    }

    .source-meta {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 8px 0 4px 51px;
      font-size: 13px;
      color: var(--nexus-green);
    }

    .source-meta span {
      color: var(--nexus-muted);
    }

    .role-source .sparkline {
      position: relative;
      z-index: 1;
      margin-left: 50px;
      width: calc(100% - 58px);
      height: 30px;
    }

    .sparkline-line {
      fill: none;
      stroke: #58ee83;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .sparkline-area {
      fill: rgba(88, 238, 131, 0.12);
      stroke: none;
    }

    .is-root {
      padding: var(--nexus-root-padding);
      border-radius: 14px;
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
      border-radius: 14px;
      color: var(--nexus-cyan);
    }

    .root-icon ha-icon {
      --mdc-icon-size: 34px;
    }

    .root-title {
      margin-top: 12px;
      font-size: 18px;
      font-weight: 740;
    }

    .root-value {
      margin-top: 16px;
      font-size: var(--nexus-root-value-size);
      line-height: 1;
      font-weight: 740;
    }

    .root-subtitle {
      margin-top: 8px;
      color: var(--nexus-muted);
      font-size: 14px;
    }

    .gauge {
      position: relative;
      display: grid;
      width: var(--nexus-gauge-width);
      height: var(--nexus-gauge-height);
      place-items: center;
      margin: 22px auto 12px;
      border-radius: 152px 152px 16px 16px;
      background:
        radial-gradient(circle at 50% 85%, rgba(12, 24, 39, 1) 0 46%, transparent 47%),
        conic-gradient(from 230deg, var(--nexus-cyan) 0 var(--gauge), rgba(255, 255, 255, 0.14) var(--gauge) 74%, transparent 74%);
    }

    .gauge.is-hidden {
      display: none;
    }

    .gauge span {
      margin-top: 14px;
      font-size: 29px;
      font-weight: 760;
    }

    .gauge small {
      position: absolute;
      bottom: 8px;
      color: var(--nexus-muted);
      font-size: 11px;
    }

    .root-stats {
      display: grid;
      gap: 8px;
      margin: 0;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.09);
    }

    .root-stats div {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      font-size: 13px;
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
      padding: 14px;
      border: 1px solid rgba(158, 195, 226, 0.24);
      border-radius: 12px;
      background:
        linear-gradient(180deg, rgba(26, 42, 62, 0.88), rgba(11, 22, 36, 0.94)),
        rgba(10, 22, 34, 0.92);
      box-shadow: 0 22px 42px rgba(0, 0, 0, 0.42);
      backdrop-filter: blur(14px);
      pointer-events: none;
      --tooltip-accent: var(--nexus-red);
    }

    .tooltip header {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 750;
    }

    .tooltip-icon {
      display: grid;
      flex: 0 0 auto;
      width: 34px;
      height: 34px;
      place-items: center;
      border-radius: 10px;
      color: var(--tooltip-accent);
      background: color-mix(in srgb, var(--tooltip-accent) 18%, transparent);
    }

    .tooltip-icon ha-icon {
      --mdc-icon-size: 19px;
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
      margin-top: 4px;
      font-size: 13px;
    }

    .tooltip p {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 10px 0 8px;
      color: var(--nexus-muted);
      font-size: 13px;
    }

    .tooltip .dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: var(--tooltip-accent);
    }

    .tooltip .sparkline {
      width: 100%;
      height: 58px;
      margin: 4px 0 10px;
    }

    .tooltip .sparkline-line {
      stroke: var(--tooltip-accent);
      stroke-width: 2.4;
    }

    .tooltip .sparkline-area {
      fill: var(--tooltip-accent);
      fill-opacity: 0.13;
    }

    .tooltip footer {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--nexus-muted);
      font-size: 12px;
    }

    .tooltip footer ha-icon {
      --mdc-icon-size: 16px;
    }

    .nexus-card-frame.compact .topbar,
    .nexus-card-frame.compact .summary-strip {
      align-items: stretch;
      flex-direction: column;
    }

    .nexus-card-frame.compact .topbar {
      gap: 12px;
      margin-bottom: 14px;
    }

    .nexus-card-frame.compact .brand {
      gap: 10px;
    }

    .nexus-card-frame.compact .brand p {
      margin-top: 8px;
      font-size: 11px;
    }

    .nexus-card-frame.compact .health-pill {
      align-self: flex-start;
      min-height: 38px;
    }

    .nexus-card-frame.compact .graph-stage {
      min-height: 520px;
      margin-top: 10px;
    }

    .nexus-card-frame.compact .node-main {
      grid-template-columns: var(--nexus-node-icon-size) minmax(0, 1fr) auto;
    }

    .nexus-card-frame.compact .flow-node.role-source .source-meta,
    .nexus-card-frame.compact .flow-node.role-source .sparkline {
      display: none;
    }

    .nexus-card-frame.compact .root-title {
      font-size: 16px;
    }

    .nexus-card-frame.compact .root-subtitle {
      font-size: 12px;
    }

    .nexus-card-frame.compact .gauge {
      margin: 14px auto 10px;
    }

    .nexus-card-frame.compact .gauge span {
      font-size: 23px;
    }

    .nexus-card-frame.compact .gauge small {
      font-size: 10px;
    }

    .nexus-card-frame.compact .root-stats {
      gap: 6px;
      padding-top: 10px;
    }

    .nexus-card-frame.compact .root-stats div {
      font-size: 12px;
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
