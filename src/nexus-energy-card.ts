import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, state } from "lit/decorators.js";
import { buildEnergyGraph, type HistoryCache } from "./energy-graph";
import { DEFAULT_CONFIG } from "./default-config";
import { edgePath, layoutGraph, nodeCenter } from "./layout";
import { calculateEdgeWidth } from "./flow-style";
import { formatPercent, formatValue, rangeLabel } from "./format";
import type {
  GraphBuildResult,
  GraphLayout,
  HomeAssistantLike,
  NexusEnergyCardConfig,
  NexusMode,
  NexusRange,
  PositionedEdge,
  PositionedNode
} from "./types";

const STORE_VERSION = 1;

@customElement("nexus-energy-card")
export class NexusEnergyCard extends LitElement {
  @state() private _config: NexusEnergyCardConfig = DEFAULT_CONFIG;
  @state() private _graph: GraphBuildResult = buildEnergyGraph(DEFAULT_CONFIG, undefined, "power");
  @state() private _mode: NexusMode = "power";
  @state() private _range: NexusRange = "today";
  @state() private _width = 1180;
  @state() private _hoveredNodeId?: string;
  @state() private _expandedIds = new Set<string>();
  @state() private _collapsedIds = new Set<string>();

  private _hass?: HomeAssistantLike;
  private _resizeObserver?: ResizeObserver;
  private _historyCache: HistoryCache = new Map();
  private _lastValues = new Map<string, number>();
  private _touchTimer?: number;

  public static async getConfigElement(): Promise<HTMLElement> {
    await import("./nexus-energy-card-editor");
    return document.createElement("nexus-energy-card-editor");
  }

  public static getStubConfig(): NexusEnergyCardConfig {
    return DEFAULT_CONFIG;
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
    this._mode = config.mode ?? DEFAULT_CONFIG.mode ?? "power";
    this._range = config.range ?? DEFAULT_CONFIG.range ?? "today";
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
    window.clearTimeout(this._touchTimer);
    super.disconnectedCallback();
  }

  protected override firstUpdated(): void {
    const frame = this.renderRoot.querySelector(".nexus-card-frame");
    if (frame && "ResizeObserver" in window) {
      this._resizeObserver = new ResizeObserver(([entry]) => {
        this._width = Math.max(320, Math.round(entry.contentRect.width));
      });
      this._resizeObserver.observe(frame);
    }
  }

  protected override render() {
    const orientation = this._width < 768 ? "vertical" : "horizontal";
    const graphHeight = orientation === "vertical" ? Math.max(920, this._config.height ?? 720) : this._config.height ?? 720;
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
    const sourceBalance = this._graph.sourceTotal > 0 ? Math.min(1, this._graph.total / this._graph.sourceTotal) : 0;

    return html`
      <ha-card class=${`nexus-shell bg-${this._config.background_style ?? "glass"}`}>
        <section class="nexus-card-frame" @pointerleave=${this._clearTooltip}>
          <header class="topbar">
            <div class="brand">
              <span class="brand-icon"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon></span>
              <div>
                <h2>${this._config.title ?? "Nexus Energy"}</h2>
                <p>
                  Total en casa
                  <span class="live-dot"></span>
                  <strong>${this._mode === "power" ? "Ahora" : rangeLabel(this._range)}</strong>
                </p>
              </div>
            </div>

            <div class="toolbar" aria-label="Controles de Nexus Energy">
              <div class="segmented" role="tablist" aria-label="Modo de operación">
                <button
                  class=${this._mode === "power" ? "active" : ""}
                  type="button"
                  role="tab"
                  aria-selected=${this._mode === "power"}
                  @click=${() => this._setMode("power")}
                >
                  Potencia
                </button>
                <button
                  class=${this._mode === "energy" ? "active" : ""}
                  type="button"
                  role="tab"
                  aria-selected=${this._mode === "energy"}
                  @click=${() => this._setMode("energy")}
                >
                  Energía
                </button>
              </div>

              ${this._mode === "energy" && this._config.show_time_selector !== false
                ? html`
                    <label class="range-select">
                      <ha-icon icon="mdi:calendar-month-outline"></ha-icon>
                      <select .value=${this._range} @change=${this._handleRangeChange}>
                        <option value="today">Hoy</option>
                        <option value="yesterday">Ayer</option>
                        <option value="week">Esta semana</option>
                        <option value="month">Mes actual</option>
                        <option value="year">Año actual</option>
                        <option value="custom">Personalizado</option>
                      </select>
                    </label>
                  `
                : this._mode === "power"
                  ? html`<div class="now-pill"><ha-icon icon="mdi:clock-outline"></ha-icon> Ahora</div>`
                  : nothing}
            </div>
          </header>

          <section class="summary-strip" aria-label="Resumen energético">
            <div class="primary-metric">
              <span>${this._mode === "power" ? "Consumo actual" : "Consumo acumulado"}</span>
              <strong>${formatValue(this._graph.total, this._mode, this._config.precision)}</strong>
              <small><ha-icon icon="mdi:trending-down"></ha-icon> 18% vs ayer 9:00</small>
            </div>
            <div class="glass-control" aria-label="Zoom visual">
              <button type="button" title="Centrar mapa"><ha-icon icon="mdi:crosshairs-gps"></ha-icon></button>
              <span>100%</span>
              <button type="button" title="Alejar"><ha-icon icon="mdi:minus"></ha-icon></button>
              <button type="button" title="Acercar"><ha-icon icon="mdi:plus"></ha-icon></button>
              <button type="button" title="Pantalla completa"><ha-icon icon="mdi:fullscreen"></ha-icon></button>
            </div>
            <div class="health-pill ${this._graph.overflowNodes.length ? "warning" : ""}">
              <ha-icon icon=${this._graph.overflowNodes.length ? "mdi:alert-circle-outline" : "mdi:shield-check-outline"}></ha-icon>
              ${this._graph.overflowNodes.length ? `${this._graph.overflowNodes.length} overflow` : "Sistema normal"}
            </div>
          </section>

          <section class="graph-stage ${orientation}" style=${`height:${layout.height}px`}>
            ${this._renderSvg(layout)}
            <div class="node-layer">
              ${layout.nodes.map((node) => this._renderNode(node, primary, sourceBalance))}
            </div>
            ${this._renderTooltip(layout)}
          </section>

          <footer class="bottom-metrics">
            <div><ha-icon icon="mdi:leaf"></ha-icon><span>CO2 evitado hoy</span><strong>12.4 kg</strong></div>
            <div><ha-icon icon="mdi:cash-multiple"></ha-icon><span>Ahorro hoy</span><strong>2.18 €</strong></div>
            <div><ha-icon icon="mdi:thermometer"></ha-icon><span>Temperatura</span><strong>24.1 °C</strong></div>
          </footer>
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

  private _renderNode(node: PositionedNode, primary: PositionedNode | undefined, sourceBalance: number) {
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
        tabindex="0"
        @mouseenter=${() => this._showTooltip(node)}
        @focusin=${() => this._showTooltip(node)}
        @touchstart=${() => this._queueTouchTooltip(node)}
        @touchend=${this._cancelTouchTooltip}
        @click=${(event: Event) => this._toggleNode(event, node)}
      >
        ${isRoot ? this._renderRootNode(node, sourceBalance) : this._renderCompactNode(node)}
      </article>
    `;
  }

  private _renderRootNode(node: PositionedNode, sourceBalance: number) {
    return html`
      <div class="root-heading">
        <span class="node-icon root-icon"><ha-icon icon=${node.icon}></ha-icon></span>
        <button class="collapse-button" type="button" title="Expandir o colapsar">
          <ha-icon icon=${this._collapsedIds.has(node.id) ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
        </button>
      </div>
      <div class="root-title">${node.name}</div>
      <div class="root-value">${formatValue(node.value, this._mode, this._config.precision)}</div>
      <div class="root-subtitle">${this._mode === "power" ? "Consumo actual" : "Energía del periodo"}</div>
      <div class="gauge" style=${`--gauge:${Math.round(sourceBalance * 100)}%`}>
        <span>${Math.round(sourceBalance * 100)}%</span>
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
              <button class="collapse-button" type="button" title="Expandir o colapsar">
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

  private _renderTooltip(layout: GraphLayout) {
    if (!this._hoveredNodeId) {
      return nothing;
    }

    const node = layout.nodes.find((item) => item.id === this._hoveredNodeId);
    if (!node) {
      return nothing;
    }

    const center = nodeCenter(node);
    const tooltipWidth = 252;
    const x = Math.min(layout.width - tooltipWidth - 18, Math.max(18, center.x + 34));
    const y = Math.min(layout.height - 198, Math.max(18, center.y - 74));

    return html`
      <aside class="tooltip" style=${`left:${x}px;top:${y}px;width:${tooltipWidth}px;`}>
        <header>
          <strong>${node.name}</strong>
          <span>${formatValue(node.value, this._mode, this._config.precision)}</span>
        </header>
        <p>
          <span class="dot"></span>
          ${formatPercent(node.percentOfParent)} ${node.parent ? `de ${node.parent.name}` : "del balance"}
        </p>
        ${this._renderSparkline(node, 216, 58)}
        <footer>
          <ha-icon icon=${node.overflow ? "mdi:alert-outline" : "mdi:lightbulb-on-outline"}></ha-icon>
          ${node.overflow ? "Lecturas hijas por encima del total" : this._tooltipHint(node)}
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

  private _setMode(mode: NexusMode): void {
    if (this._mode === mode) {
      return;
    }

    this._mode = mode;
    this._rebuildGraph(true);
  }

  private _handleRangeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as NexusRange;
    this._range = value;
    this.dispatchEvent(new CustomEvent("nexus-range-changed", { detail: { range: value }, bubbles: true, composed: true }));
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

  private _showTooltip(node: PositionedNode): void {
    this._hoveredNodeId = node.id;
  }

  private _clearTooltip = (): void => {
    this._hoveredNodeId = undefined;
  };

  private _queueTouchTooltip(node: PositionedNode): void {
    window.clearTimeout(this._touchTimer);
    this._touchTimer = window.setTimeout(() => {
      this._hoveredNodeId = node.id;
    }, 420);
  }

  private _cancelTouchTooltip = (): void => {
    window.clearTimeout(this._touchTimer);
  };

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

  private _tooltipHint(node: PositionedNode): string {
    if (node.role === "rest") {
      return "Carga no asignada automáticamente";
    }
    if (node.children.length) {
      return "Pulsa para expandir o colapsar la rama";
    }
    return "Historial inmediato calculado en la tarjeta";
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
      padding: 28px 30px 22px;
      border-radius: inherit;
      background:
        linear-gradient(90deg, rgba(64, 165, 255, 0.1), transparent 32%, rgba(73, 240, 191, 0.07)),
        rgba(4, 11, 19, 0.38);
      backdrop-filter: blur(12px);
      overflow: hidden;
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
    .summary-strip,
    .bottom-metrics {
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
      font-size: 28px;
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

    .toolbar,
    .summary-strip,
    .bottom-metrics {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .segmented {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-width: 278px;
      padding: 3px;
      border: 1px solid var(--nexus-line);
      border-radius: 22px;
      background: rgba(12, 22, 34, 0.58);
      backdrop-filter: blur(12px);
    }

    button,
    select {
      font: inherit;
      letter-spacing: 0;
    }

    .segmented button {
      min-height: 42px;
      border: 0;
      border-radius: 18px;
      color: var(--nexus-muted);
      background: transparent;
      cursor: pointer;
    }

    .segmented button.active {
      color: #f8fbff;
      background: linear-gradient(180deg, rgba(58, 167, 255, 0.42), rgba(58, 167, 255, 0.18));
      box-shadow:
        inset 0 0 0 1px rgba(120, 190, 255, 0.38),
        0 6px 18px rgba(42, 132, 220, 0.2);
    }

    .range-select,
    .now-pill,
    .health-pill,
    .glass-control {
      display: flex;
      align-items: center;
      min-height: 44px;
      border: 1px solid var(--nexus-line);
      border-radius: 22px;
      background: rgba(12, 22, 34, 0.55);
      color: var(--nexus-muted);
      backdrop-filter: blur(12px);
    }

    .range-select,
    .now-pill {
      gap: 9px;
      padding: 0 16px;
    }

    .range-select select {
      border: 0;
      color: inherit;
      background: transparent;
      outline: 0;
      cursor: pointer;
    }

    .summary-strip {
      justify-content: space-between;
      margin-bottom: 6px;
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
      font-size: 48px;
      line-height: 1;
      font-weight: 740;
    }

    .primary-metric small {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #6bf19c;
      font-size: 13px;
    }

    .primary-metric ha-icon {
      --mdc-icon-size: 15px;
    }

    .glass-control {
      padding: 0 12px;
      gap: 10px;
    }

    .glass-control button {
      display: grid;
      width: 30px;
      height: 30px;
      place-items: center;
      border: 0;
      border-radius: 10px;
      color: var(--nexus-muted);
      background: transparent;
      cursor: pointer;
    }

    .glass-control button:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
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

    .flow-path.energy {
      stroke-dasharray: none;
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
      padding: 18px;
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
      gap: 12px;
      height: 100%;
      padding: 0 18px;
    }

    .node-icon {
      display: grid;
      width: 34px;
      height: 34px;
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
      font-size: 15px;
      font-weight: 710;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .node-copy span {
      color: #f7fbff;
      font-size: 14px;
      font-weight: 650;
    }

    .node-percent,
    .container-share {
      color: var(--node-accent, var(--nexus-green));
      font-size: 14px;
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
      padding: 26px 26px 20px;
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
      width: 48px;
      height: 48px;
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
      font-size: 36px;
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
      width: 136px;
      height: 82px;
      place-items: center;
      margin: 22px auto 12px;
      border-radius: 152px 152px 16px 16px;
      background:
        radial-gradient(circle at 50% 85%, rgba(12, 24, 39, 1) 0 46%, transparent 47%),
        conic-gradient(from 230deg, var(--nexus-cyan) 0 var(--gauge), rgba(255, 255, 255, 0.14) var(--gauge) 74%, transparent 74%);
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
    }

    .tooltip header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 14px;
      font-weight: 750;
    }

    .tooltip header span {
      color: var(--nexus-red);
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
      background: var(--nexus-red);
    }

    .tooltip .sparkline {
      width: 100%;
      height: 58px;
      margin: 4px 0 10px;
    }

    .tooltip .sparkline-line {
      stroke: var(--nexus-red);
    }

    .tooltip .sparkline-area {
      fill: rgba(255, 98, 89, 0.12);
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

    .bottom-metrics {
      justify-content: space-between;
      margin-top: 14px;
    }

    .bottom-metrics div {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 52px;
      padding: 0 16px;
      border: 1px solid var(--nexus-line);
      border-radius: 12px;
      background: rgba(21, 36, 54, 0.58);
      color: var(--nexus-muted);
    }

    .bottom-metrics ha-icon {
      color: var(--nexus-yellow);
    }

    .bottom-metrics strong {
      color: var(--nexus-green);
    }

    @media (max-width: 767px) {
      .nexus-card-frame {
        padding: 18px 14px;
      }

      .topbar,
      .summary-strip,
      .bottom-metrics {
        align-items: stretch;
        flex-direction: column;
      }

      .toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .segmented {
        min-width: 0;
      }

      .primary-metric strong {
        font-size: 38px;
      }

      .glass-control {
        display: none;
      }

      .flow-node.role-source {
        padding: 12px;
      }

      .flow-node.role-source .source-meta,
      .flow-node.role-source .sparkline {
        display: none;
      }

      .node-main {
        padding: 0 12px;
        gap: 8px;
      }

      .node-copy strong {
        font-size: 13px;
      }

      .node-copy span,
      .node-percent {
        font-size: 12px;
      }

      .source-meta {
        margin-left: 44px;
      }

      .role-source .sparkline {
        margin-left: 42px;
      }

      .is-root {
        padding: 18px;
      }
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

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

declare global {
  interface HTMLElementTagNameMap {
    "nexus-energy-card": NexusEnergyCard;
  }
}
