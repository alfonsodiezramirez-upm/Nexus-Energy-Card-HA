import { LitElement, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { EMPTY_CONFIG } from "./default-config";
import type {
  HomeAssistantLike,
  NexusBackgroundStyle,
  NexusColorThreshold,
  NexusDirection,
  NexusEnergyCardConfig,
  NexusEnergyNodeConfig
} from "./types";

const SOURCE_PARENT_ID = "__source__";
const ALL_NODES_ID = "__all__";
const EMPTY_MAIN_NODE: NexusEnergyNodeConfig = {
  id: "home",
  name: "Casa",
  icon: "mdi:home-outline",
  children: []
};

const COMMON_ICONS = [
  "mdi:home-outline",
  "mdi:white-balance-sunny",
  "mdi:battery-charging-60",
  "mdi:transmission-tower",
  "mdi:engine",
  "mdi:office-building-marker-outline",
  "mdi:sofa-outline",
  "mdi:pot-steam-outline",
  "mdi:stove",
  "mdi:microwave",
  "mdi:toilet",
  "mdi:bed-king-outline",
  "mdi:bed-outline",
  "mdi:bathtub-outline",
  "mdi:power-plug-outline",
  "mdi:dots-horizontal"
];

interface EntityOption {
  entity_id: string;
  label: string;
  deviceClass: string;
}

interface FlatEditorNode {
  id: string;
  parentId: string;
  name: string;
  entity?: string;
  power_entity?: string;
  energy_entity?: string;
  icon?: string;
  capacity?: number;
  direction?: NexusDirection;
  invert_value?: boolean;
  color?: string;
}

@customElement("nexus-energy-card-editor")
export class NexusEnergyCardEditor extends LitElement {
  @state() private _config: NexusEnergyCardConfig = EMPTY_CONFIG;
  @state() private _flatNodes: FlatEditorNode[] = [];
  @state() private _expandedNodeId?: string;

  private _hass?: HomeAssistantLike;

  public setConfig(config: NexusEnergyCardConfig): void {
    const previousExpandedId = this._expandedNodeId;
    const configWithoutLegacyHeight = omitLegacyHeight(config);
    const nextConfig = {
      ...EMPTY_CONFIG,
      ...configWithoutLegacyHeight,
      thresholds: {
        ...EMPTY_CONFIG.thresholds,
        ...configWithoutLegacyHeight.thresholds
      },
      sources: configWithoutLegacyHeight.sources ?? [],
      nodes: configWithoutLegacyHeight.nodes ?? []
    };
    const nextFlatNodes = flattenConfig(nextConfig);
    this._config = nextConfig;
    this._flatNodes = nextFlatNodes;
    this._expandedNodeId =
      previousExpandedId && nextFlatNodes.some((node) => node.id === previousExpandedId) ? previousExpandedId : undefined;
  }

  public set hass(hass: HomeAssistantLike) {
    this._hass = hass;
    this.requestUpdate();
  }

  protected override render() {
    const entities = this._filteredEntities();
    const mainNode = this._mainNode();

    return html`
      <div class="editor">
        <header class="editor-head">
          <span class="head-icon"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon></span>
          <div>
            <h3>Nexus Energy Card</h3>
            <p>Configuracion visual</p>
          </div>
        </header>

        <datalist id="nexus-entities">
          ${entities.map((entity) => html`<option value=${entity.entity_id}>${entity.label}</option>`)}
        </datalist>
        <datalist id="nexus-icons">
          ${COMMON_ICONS.map((icon) => html`<option value=${icon}></option>`)}
        </datalist>

        ${this._renderGeneral(mainNode, entities)}
        ${this._renderBuilder(mainNode, entities)}
        ${this._renderAppearance()}
        ${this._renderThresholds(mainNode)}
      </div>
    `;
  }

  private _renderGeneral(mainNode: NexusEnergyNodeConfig, entities: EntityOption[]) {
    return html`
      <section class="panel">
        <div class="panel-head">
          <h4>Configuracion general</h4>
        </div>
        <div class="grid general-grid">
          <label>
            Titulo de la tarjeta
            <input .value=${this._config.title ?? ""} @input=${(event: Event) => this._patchConfig("title", cleanText(valueOf(event)))} />
          </label>
          ${this._renderEntityField("Entidad de la Casa", mainNode.entity ?? mainNode.power_entity ?? "", entities, (entityId) =>
            this._patchMain(this._entityPatch(entityId))
          )}
          <label>
            Tolerancia de desbordamiento (%)
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              .value=${String(this._config.overflow_tolerance ?? 5)}
              @input=${(event: Event) => this._patchConfig("overflow_tolerance", clampPercentage(Number(valueOf(event))))}
            />
          </label>
          <label>
            Nombre del nodo principal
            <input
              .value=${mainNode.name ?? "Casa"}
              @input=${(event: Event) => this._patchMain({ name: cleanText(valueOf(event)) || "Casa" })}
            />
          </label>
          <label>
            Icono del nodo principal
            <input
              list="nexus-icons"
              .value=${mainNode.icon ?? "mdi:home-outline"}
              @input=${(event: Event) => this._patchMain({ icon: cleanText(valueOf(event)) || "mdi:home-outline" })}
            />
          </label>
        </div>
      </section>
    `;
  }

  private _renderBuilder(mainNode: NexusEnergyNodeConfig, entities: EntityOption[]) {
    const hasNodes = this._flatNodes.length > 0;

    return html`
      <section class="panel">
        <div class="panel-head">
          <h4>Constructor del arbol</h4>
          ${hasNodes
            ? html`
                <div class="head-actions">
                  <button type="button" @click=${() => this._addNode(SOURCE_PARENT_ID)}>Fuente</button>
                  <button type="button" @click=${() => this._addNode(this._mainId())}>Nodo</button>
                </div>
              `
            : nothing}
        </div>
        ${hasNodes
          ? html`<div class="node-list">${this._flatNodes.map((node) => this._renderNodeRow(node, mainNode, entities))}</div>`
          : html`
              <div class="zero-state">
                <button class="primary-add" type="button" @click=${() => this._addNode(this._mainId())}>
                  <span class="add-mark">+</span>
                  Anadir Primer Nodo
                </button>
              </div>
            `}
      </section>
    `;
  }

  private _renderNodeRow(node: FlatEditorNode, mainNode: NexusEnergyNodeConfig, entities: EntityOption[]) {
    const isSource = node.parentId === SOURCE_PARENT_ID;
    const depth = isSource ? 0 : this._depthOf(node);
    const parentLabel = isSource ? "Raiz/Fuente" : node.parentId === this._mainId() ? mainNode.name ?? "Casa" : this._nodeName(node.parentId);
    const entityLabel = node.entity ?? node.power_entity ?? node.energy_entity ?? "Sin entidad";
    const isExpanded = this._expandedNodeId === node.id;

    return html`
      <article class=${`node-row ${isSource ? "is-source" : ""}`} style=${`--depth:${depth}`}>
        <div class="row-title">
          <button
            class="row-toggle"
            type="button"
            aria-expanded=${isExpanded}
            title=${isExpanded ? "Contraer" : "Editar"}
            @click=${() => this._toggleNode(node.id)}
          >
            <span class="row-icon"><ha-icon icon=${node.icon ?? (isSource ? "mdi:flash" : "mdi:power-plug-outline")}></ha-icon></span>
            <span class="row-summary">
              <strong>${node.name || "Nodo sin nombre"}</strong>
              <small>${entityLabel} - ${parentLabel}</small>
            </span>
            <ha-icon class="chevron" icon=${isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
          </button>
          <button class="icon-button danger" type="button" title="Eliminar" @click=${() => this._removeNode(node.id)}>
            <ha-icon icon="mdi:trash-can-outline"></ha-icon>
          </button>
        </div>

        ${isExpanded
          ? html`
              <div class="node-form">
                <div class="grid node-grid">
                  ${this._renderEntityField("Entidad", node.entity ?? node.power_entity ?? node.energy_entity ?? "", entities, (entityId) =>
                    this._patchNode(node.id, this._entityPatch(entityId))
                  )}
                  <label>
                    Nombre a mostrar
                    <input .value=${node.name} @input=${(event: Event) => this._patchNode(node.id, { name: cleanText(valueOf(event)) })} />
                  </label>
                  <label>
                    Icono
                    <input
                      list="nexus-icons"
                      .value=${node.icon ?? ""}
                      @input=${(event: Event) => this._patchNode(node.id, { icon: cleanText(valueOf(event)) || undefined })}
                    />
                  </label>
                  <label>
                    Nodo padre
                    <select .value=${node.parentId} @change=${(event: Event) => this._patchNode(node.id, { parentId: valueOf(event) })}>
                      <option value=${SOURCE_PARENT_ID} ?selected=${node.parentId === SOURCE_PARENT_ID}>Raiz/Fuente</option>
                      <option value=${this._mainId()} ?selected=${node.parentId === this._mainId()}>${mainNode.name ?? "Casa"}</option>
                      ${this._flatNodes
                        .filter((parent) => this._canUseAsParent(parent, node))
                        .map((parent) => html`<option value=${parent.id} ?selected=${node.parentId === parent.id}>${parent.name}</option>`)}
                    </select>
                  </label>
                  <label>
                    Direccion
                    <select
                      .value=${node.direction ?? "auto"}
                      @change=${(event: Event) => this._patchNode(node.id, { direction: valueOf(event) as NexusDirection })}
                    >
                      <option value="auto">Auto</option>
                      <option value="import">Importar</option>
                      <option value="export">Exportar</option>
                    </select>
                  </label>
                  <label>
                    Capacidad kW
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      .value=${node.capacity === undefined ? "" : String(node.capacity)}
                      @input=${(event: Event) => this._patchNode(node.id, { capacity: optionalNumber(valueOf(event)) })}
                    />
                  </label>
                  ${this._renderCheck("Invertir valor", node.invert_value === true, (checked) => this._patchNode(node.id, { invert_value: checked }))}
                </div>
              </div>
            `
          : nothing}
      </article>
    `;
  }

  private _renderAppearance() {
    const speed = this._config.animation_speed ?? 1;
    const speedLabel = speed < 0.85 ? "Lento" : speed > 1.25 ? "Rapido" : "Normal";

    return html`
      <section class="panel">
        <div class="panel-head">
          <h4>Apariencia y animaciones</h4>
        </div>
        <div class="grid appearance-grid">
          <label>
            Grosor de las lineas
            <div class="range-row">
              <input
                type="range"
                min="0.75"
                max="6"
                step="0.25"
                .value=${String(this._config.line_width_base ?? 1.5)}
                @input=${(event: Event) => this._patchConfig("line_width_base", Number(valueOf(event)))}
              />
              <output>${this._config.line_width_base ?? 1.5}px</output>
            </div>
          </label>
          <label>
            Velocidad
            <div class="range-row">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                .value=${String(speed)}
                @input=${(event: Event) => this._patchConfig("animation_speed", Number(valueOf(event)))}
              />
              <output>${speedLabel}</output>
            </div>
          </label>
          <label>
            Estilo del fondo
            <select
              .value=${this._config.background_style ?? "glass"}
              @change=${(event: Event) => this._patchConfig("background_style", valueOf(event) as NexusBackgroundStyle)}
            >
              <option value="glass">Glassmorphism</option>
              <option value="transparent">Transparente</option>
              <option value="solid">Color solido</option>
            </select>
          </label>
          <label>
            Color base
            <input type="color" .value=${this._config.base_color ?? "#38a5ff"} @input=${(event: Event) => this._patchConfig("base_color", valueOf(event))} />
          </label>
          ${this._renderCheck("Animacion", this._config.animation !== false, (checked) => this._patchConfig("animation", checked))}
          ${this._renderCheck("Ocultar nodos a 0W", this._config.hide_zero_nodes === true, (checked) => this._patchConfig("hide_zero_nodes", checked))}
          <label>
            Profundidad expandida
            <input
              type="number"
              min="0"
              max="6"
              .value=${String(this._config.default_expanded_depth ?? 2)}
              @input=${(event: Event) => this._patchConfig("default_expanded_depth", Number(valueOf(event)))}
            />
          </label>
        </div>
      </section>
    `;
  }

  private _renderThresholds(mainNode: NexusEnergyNodeConfig) {
    const thresholds = this._config.color_thresholds ?? [];
    const nodeOptions = [{ id: this._mainId(), name: mainNode.name ?? "Casa" }, ...this._flatNodes.map((node) => ({ id: node.id, name: node.name }))];

    return html`
      <section class="panel">
        <div class="panel-head">
          <h4>Umbrales de color</h4>
          <button type="button" @click=${this._addThreshold}>Anadir umbral</button>
        </div>
        <div class="threshold-list">
          ${thresholds.length
            ? thresholds.map(
                (threshold, index) => html`
                  <article class="threshold-row">
                    <label>
                      Nodo
                      <select
                        .value=${threshold.node_id ?? ALL_NODES_ID}
                        @change=${(event: Event) => this._patchThreshold(index, { node_id: valueOf(event) })}
                      >
                        <option value=${ALL_NODES_ID}>Todos</option>
                        ${nodeOptions.map((node) => html`<option value=${node.id}>${node.name}</option>`)}
                      </select>
                    </label>
                    <label>
                      Por encima de
                      <input
                        type="number"
                        min="0"
                        step="10"
                        .value=${String(threshold.above)}
                        @input=${(event: Event) => this._patchThreshold(index, { above: Number(valueOf(event)) })}
                      />
                    </label>
                    <label>
                      Color
                      <input type="color" .value=${threshold.color} @input=${(event: Event) => this._patchThreshold(index, { color: valueOf(event) })} />
                    </label>
                    <button class="icon-button danger" type="button" title="Eliminar" @click=${() => this._removeThreshold(index)}>
                      <ha-icon icon="mdi:trash-can-outline"></ha-icon>
                    </button>
                  </article>
                `
              )
            : html`<div class="empty-state">Sin umbrales personalizados.</div>`}
        </div>
      </section>
    `;
  }

  private _renderEntityField(label: string, value: string, entities: EntityOption[], onChange: (entityId: string) => void) {
    return html`
      <label>
        ${label}
        <input
          list="nexus-entities"
          .value=${value}
          @input=${(event: Event) => onChange(cleanText(valueOf(event)))}
          placeholder="sensor..."
        />
        ${entities.length ? nothing : html`<span class="field-note">sensor power</span>`}
      </label>
    `;
  }

  private _renderCheck(label: string, checked: boolean, onChange: (checked: boolean) => void) {
    return html`
      <label class="check-row">
        <input type="checkbox" .checked=${checked} @change=${(event: Event) => onChange((event.target as HTMLInputElement).checked)} />
        <span>${label}</span>
      </label>
    `;
  }

  private _filteredEntities(): EntityOption[] {
    const states = Object.values(this._hass?.states ?? {});
    return states
      .filter((state) => {
        const entity = state.entity_id;
        const deviceClass = String(state.attributes.device_class ?? "");
        return entity.startsWith("sensor.") && deviceClass === "power";
      })
      .map((state) => ({
        entity_id: state.entity_id,
        label: `${state.attributes.friendly_name ?? state.entity_id} (${state.attributes.unit_of_measurement ?? ""})`,
        deviceClass: String(state.attributes.device_class ?? "")
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private _patchConfig<K extends keyof NexusEnergyCardConfig>(key: K, value: NexusEnergyCardConfig[K]): void {
    this._commitConfig({
      ...this._config,
      [key]: value
    });
  }

  private _patchMain(patch: Partial<NexusEnergyNodeConfig>): void {
    const main = {
      ...this._mainNode(),
      ...patch
    };
    this._config = {
      ...this._config,
      nodes: [main]
    };
    this._emitConfig();
  }

  private _patchNode(id: string, patch: Partial<FlatEditorNode>): void {
    const current = this._flatNodes.find((node) => node.id === id);
    if (!current) {
      return;
    }

    if (patch.parentId && (patch.parentId === id || this._isDescendant(patch.parentId, id))) {
      return;
    }

    this._flatNodes = this._flatNodes.map((node) => (node.id === id ? { ...node, ...patch } : node));
    this._emitConfig();
  }

  private _addNode(parentId: string): void {
    const source = parentId === SOURCE_PARENT_ID;
    const id = uniqueNodeId(this._flatNodes, source ? "fuente" : "nodo");
    this._flatNodes = [
      ...this._flatNodes,
      {
        id,
        parentId,
        name: source ? "Nueva fuente" : "Nuevo nodo",
        icon: source ? "mdi:flash" : "mdi:power-plug-outline",
        direction: "auto"
      }
    ];
    this._expandedNodeId = id;
    this._emitConfig();
  }

  private _removeNode(id: string): void {
    const descendants = new Set([id]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of this._flatNodes) {
        if (descendants.has(node.parentId) && !descendants.has(node.id)) {
          descendants.add(node.id);
          changed = true;
        }
      }
    }
    this._flatNodes = this._flatNodes.filter((node) => !descendants.has(node.id));
    if (this._expandedNodeId && descendants.has(this._expandedNodeId)) {
      this._expandedNodeId = undefined;
    }
    this._emitConfig();
  }

  private _toggleNode(id: string): void {
    this._expandedNodeId = this._expandedNodeId === id ? undefined : id;
  }

  private _addThreshold = (): void => {
    const threshold: NexusColorThreshold = {
      id: `threshold-${Date.now().toString(36)}`,
      node_id: ALL_NODES_ID,
      above: 2000,
      color: "#ffb000"
    };
    this._patchConfig("color_thresholds", [...(this._config.color_thresholds ?? []), threshold]);
  };

  private _patchThreshold(index: number, patch: Partial<NexusColorThreshold>): void {
    const thresholds = [...(this._config.color_thresholds ?? [])];
    thresholds[index] = {
      ...thresholds[index],
      ...patch,
      node_id: patch.node_id === ALL_NODES_ID ? ALL_NODES_ID : patch.node_id ?? thresholds[index]?.node_id
    };
    this._patchConfig("color_thresholds", thresholds);
  }

  private _removeThreshold(index: number): void {
    this._patchConfig(
      "color_thresholds",
      (this._config.color_thresholds ?? []).filter((_, itemIndex) => itemIndex !== index)
    );
  }

  private _entityPatch(entityId: string): Partial<NexusEnergyNodeConfig & FlatEditorNode> {
    if (!entityId) {
      return {
        entity: undefined,
        power_entity: undefined,
        energy_entity: undefined
      };
    }

    return {
      entity: entityId,
      power_entity: entityId,
      energy_entity: undefined
    };
  }

  private _mainNode(): NexusEnergyNodeConfig {
    return this._config.nodes?.[0] ?? EMPTY_MAIN_NODE;
  }

  private _mainId(): string {
    return this._mainNode().id ?? "home";
  }

  private _nodeName(id: string): string {
    return this._flatNodes.find((node) => node.id === id)?.name ?? id;
  }

  private _canUseAsParent(parent: FlatEditorNode, node: FlatEditorNode): boolean {
    return parent.id !== node.id && parent.parentId !== SOURCE_PARENT_ID && !this._isDescendant(parent.id, node.id);
  }

  private _isDescendant(candidateId: string, ancestorId: string): boolean {
    let cursor = candidateId;
    while (cursor && cursor !== SOURCE_PARENT_ID && cursor !== this._mainId()) {
      if (cursor === ancestorId) {
        return true;
      }
      const parent = this._flatNodes.find((node) => node.id === cursor);
      cursor = parent?.parentId ?? "";
    }
    return false;
  }

  private _depthOf(node: FlatEditorNode): number {
    let depth = 0;
    let cursor = node.parentId;
    while (cursor && cursor !== this._mainId() && cursor !== SOURCE_PARENT_ID) {
      const parent = this._flatNodes.find((item) => item.id === cursor);
      if (!parent) {
        break;
      }
      depth += 1;
      cursor = parent.parentId;
    }
    return depth;
  }

  private _emitConfig(): void {
    const main = this._mainNode();
    const mainId = main.id ?? "home";
    const sources = this._flatNodes.filter((node) => node.parentId === SOURCE_PARENT_ID).map((node) => rowToConfig(node));
    const children = buildChildren(this._flatNodes, mainId);
    const nodes =
      children.length || this._hasConfiguredMain(main)
        ? [
            {
              ...main,
              id: mainId,
              children
            }
          ]
        : [];
    const nextConfig: NexusEnergyCardConfig = {
      ...this._config,
      mode: "power",
      sources,
      nodes
    };

    this._commitConfig(nextConfig);
  }

  private _commitConfig(nextConfig: NexusEnergyCardConfig): void {
    this._config = nextConfig;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: nextConfig },
        bubbles: true,
        composed: true
      })
    );
  }

  private _hasConfiguredMain(main: NexusEnergyNodeConfig): boolean {
    return Boolean(
      main.entity ||
        main.power_entity ||
        main.energy_entity ||
        main.capacity !== undefined ||
        main.color ||
        (main.name && main.name !== EMPTY_MAIN_NODE.name) ||
        (main.icon && main.icon !== EMPTY_MAIN_NODE.icon)
    );
  }

  static override styles = css`
    :host {
      display: block;
      color: var(--primary-text-color, #eef5ff);
      letter-spacing: 0;
      --editor-surface: rgba(21, 36, 54, 0.62);
      --editor-surface-soft: rgba(255, 255, 255, 0.045);
      --editor-line: rgba(150, 180, 210, 0.2);
      --editor-muted: var(--secondary-text-color, rgba(230, 240, 250, 0.68));
      --editor-accent: #3aa7ff;
      --editor-danger: #ff6259;
      --editor-field-bg: #111c29;
      --editor-field-bg-hover: #162535;
      --editor-option-bg: #101b28;
      --editor-option-bg-selected: #236fae;
      --editor-option-text: #eef5ff;
      --editor-option-muted: rgba(238, 245, 255, 0.56);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .editor {
      display: grid;
      gap: 14px;
      max-width: 100%;
      overflow-x: hidden;
      padding: 16px;
    }

    .editor-head,
    .panel {
      border: 1px solid var(--editor-line);
      border-radius: 8px;
      background: var(--editor-surface);
    }

    .editor-head {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
    }

    .head-icon,
    .row-icon {
      display: grid;
      flex: 0 0 auto;
      width: 36px;
      height: 36px;
      place-items: center;
      border-radius: 8px;
      color: #6fc8ff;
      background: rgba(58, 167, 255, 0.12);
    }

    h3,
    h4,
    p {
      margin: 0;
    }

    h3 {
      font-size: 18px;
      line-height: 1.2;
    }

    h4 {
      font-size: 14px;
      text-transform: uppercase;
    }

    p,
    small,
    .field-note,
    .empty-state {
      color: var(--editor-muted);
    }

    p,
    small,
    .field-note {
      font-size: 12px;
    }

    .panel {
      display: grid;
      gap: 12px;
      padding: 14px;
    }

    .panel-head,
    .head-actions,
    .row-title,
    .range-row {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .panel-head,
    .row-title {
      justify-content: space-between;
    }

    .head-actions {
      margin-left: auto;
    }

    .head-actions button {
      min-width: 0;
    }

    .grid {
      display: grid;
      gap: 10px;
    }

    .general-grid {
      grid-template-columns: 1fr;
    }

    .appearance-grid {
      grid-template-columns: 1fr;
    }

    .node-list,
    .threshold-list {
      display: grid;
      gap: 10px;
    }

    .node-row,
    .threshold-row,
    .empty-state {
      border: 1px solid rgba(150, 180, 210, 0.16);
      border-radius: 8px;
      background: var(--editor-surface-soft);
    }

    .node-row {
      display: grid;
      gap: 10px;
      padding: 12px;
    }

    .node-row.is-source .row-icon {
      color: #57efbd;
      background: rgba(73, 240, 191, 0.12);
    }

    .row-title {
      min-width: 0;
    }

    .row-toggle {
      display: flex;
      align-items: center;
      flex: 1;
      min-width: 0;
      gap: 10px;
      padding: 0;
      border: 0;
      color: inherit;
      background: transparent;
      text-align: left;
    }

    .row-toggle:hover {
      border-color: transparent;
      background: transparent;
    }

    .row-summary {
      display: block;
      min-width: 0;
      flex: 1;
    }

    .row-summary strong,
    .row-summary small {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chevron {
      flex: 0 0 auto;
      color: var(--editor-muted);
    }

    .node-form {
      display: grid;
      min-width: 0;
    }

    .node-grid {
      grid-template-columns: 1fr;
    }

    .threshold-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      align-items: end;
      padding: 10px;
    }

    label {
      display: grid;
      gap: 6px;
      min-width: 0;
      color: var(--editor-muted);
      font-size: 12px;
      font-weight: 700;
    }

    input,
    select {
      color-scheme: dark;
      box-sizing: border-box;
      width: 100%;
      max-width: 100%;
      min-height: 36px;
      border: 1px solid rgba(150, 180, 210, 0.24);
      border-radius: 8px;
      padding: 0 10px;
      color: var(--editor-option-text);
      background-color: var(--editor-field-bg);
      font: inherit;
      letter-spacing: 0;
      outline: 0;
    }

    select {
      background-image:
        linear-gradient(45deg, transparent 50%, rgba(238, 245, 255, 0.78) 50%),
        linear-gradient(135deg, rgba(238, 245, 255, 0.78) 50%, transparent 50%);
      background-position:
        calc(100% - 16px) 50%,
        calc(100% - 11px) 50%;
      background-repeat: no-repeat;
      background-size:
        5px 5px,
        5px 5px;
      padding-right: 30px;
      appearance: none;
    }

    select:hover,
    input:hover {
      background-color: var(--editor-field-bg-hover);
    }

    input:focus,
    select:focus {
      border-color: rgba(90, 170, 255, 0.64);
    }

    select option,
    select optgroup {
      color: var(--editor-option-text);
      background-color: var(--editor-option-bg);
    }

    select option:checked {
      color: #ffffff;
      background-color: var(--editor-option-bg-selected);
    }

    select option:disabled {
      color: var(--editor-option-muted);
      background-color: var(--editor-option-bg);
    }

    input[type="color"] {
      padding: 4px;
    }

    input[type="range"] {
      padding: 0;
      accent-color: var(--editor-accent);
    }

    button {
      box-sizing: border-box;
      max-width: 100%;
      min-height: 34px;
      border: 1px solid rgba(90, 170, 255, 0.35);
      border-radius: 8px;
      padding: 0 12px;
      color: #dff0ff;
      background: rgba(58, 167, 255, 0.16);
      font: inherit;
      cursor: pointer;
      letter-spacing: 0;
    }

    button:hover {
      border-color: rgba(90, 170, 255, 0.6);
      background: rgba(58, 167, 255, 0.24);
    }

    .icon-button {
      display: grid;
      width: 36px;
      min-height: 36px;
      place-items: center;
      padding: 0;
    }

    .danger {
      border-color: rgba(255, 98, 89, 0.28);
      color: #ff837b;
      background: rgba(255, 98, 89, 0.1);
    }

    .check-row {
      display: flex;
      align-items: center;
      min-height: 36px;
      gap: 9px;
      padding: 0 10px;
      border: 1px solid rgba(150, 180, 210, 0.16);
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.12);
    }

    .check-row input {
      width: 16px;
      min-height: 16px;
      accent-color: var(--editor-accent);
    }

    .range-row output {
      min-width: 62px;
      color: #dff0ff;
      text-align: right;
      font-weight: 700;
    }

    .empty-state {
      padding: 16px;
      text-align: center;
    }

    .zero-state {
      display: grid;
      min-width: 0;
    }

    .primary-add {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 58px;
      gap: 10px;
      border-style: dashed;
      font-weight: 800;
    }

    .add-mark {
      display: grid;
      width: 24px;
      height: 24px;
      place-items: center;
      border-radius: 999px;
      color: #04121f;
      background: #8bd8ff;
      font-size: 18px;
      line-height: 1;
    }

    @media (max-width: 900px) {
      .general-grid,
      .appearance-grid,
      .node-grid,
      .threshold-row {
        grid-template-columns: 1fr;
      }

      .panel-head,
      .editor-head {
        align-items: stretch;
        flex-direction: column;
      }

      .head-actions {
        width: 100%;
        margin-left: 0;
      }

      .head-actions button {
        flex: 1;
      }

      .node-row {
        margin-left: 0;
      }
    }
  `;
}

function flattenConfig(config: NexusEnergyCardConfig): FlatEditorNode[] {
  const rows: FlatEditorNode[] = [];
  const main = config.nodes?.[0];
  const mainId = main?.id ?? EMPTY_MAIN_NODE.id ?? "home";

  for (const source of config.sources ?? []) {
    rows.push(configToRow(source, SOURCE_PARENT_ID, rows.length));
  }

  const visit = (nodes: NexusEnergyNodeConfig[] | undefined, parentId: string) => {
    for (const node of nodes ?? []) {
      const row = configToRow(node, parentId, rows.length);
      rows.push(row);
      visit(node.children, row.id);
    }
  };

  visit(main?.children, mainId);
  return rows;
}

function configToRow(node: NexusEnergyNodeConfig, parentId: string, index: number): FlatEditorNode {
  const id = node.id ?? node.entity ?? `node-${index}`;
  return {
    id,
    parentId,
    name: node.name ?? id,
    entity: node.entity,
    power_entity: node.power_entity,
    energy_entity: node.energy_entity,
    icon: node.icon,
    capacity: node.capacity,
    direction: node.direction,
    invert_value: node.invert_value,
    color: node.color
  };
}

function buildChildren(rows: FlatEditorNode[], parentId: string): NexusEnergyNodeConfig[] {
  return rows.filter((row) => row.parentId === parentId).map((row) => rowToConfig(row, buildChildren(rows, row.id)));
}

function rowToConfig(row: FlatEditorNode, children: NexusEnergyNodeConfig[] = []): NexusEnergyNodeConfig {
  return {
    id: row.id,
    name: row.name,
    entity: row.entity,
    power_entity: row.power_entity,
    energy_entity: row.energy_entity,
    icon: row.icon,
    capacity: row.capacity,
    direction: row.direction,
    invert_value: row.invert_value || undefined,
    color: row.color,
    children
  };
}

function uniqueNodeId(rows: FlatEditorNode[], prefix: string): string {
  let index = rows.length + 1;
  let id = `${prefix}-${index}`;
  while (rows.some((row) => row.id === id)) {
    index += 1;
    id = `${prefix}-${index}`;
  }
  return id;
}

function cleanText(value: string): string {
  return value.trim();
}

function omitLegacyHeight(config: NexusEnergyCardConfig): NexusEnergyCardConfig {
  const next = { ...config } as NexusEnergyCardConfig & { height?: number };
  delete next.height;
  return next;
}

function optionalNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function clampPercentage(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 5;
  }

  return Math.min(100, Math.max(0, parsed));
}

function valueOf(event: Event): string {
  return (event.target as HTMLInputElement | HTMLSelectElement).value;
}

declare global {
  interface HTMLElementTagNameMap {
    "nexus-energy-card-editor": NexusEnergyCardEditor;
  }
}
