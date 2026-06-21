import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  mdiAlertCircleOutline,
  mdiBathtubOutline,
  mdiBatteryCharging60,
  mdiBedKingOutline,
  mdiBedOutline,
  mdiCalendarMonthOutline,
  mdiChartLine,
  mdiChevronDown,
  mdiChevronUp,
  mdiClockOutline,
  mdiDotsHorizontal,
  mdiEngine,
  mdiFlash,
  mdiHomeOutline,
  mdiLightbulbOnOutline,
  mdiLightningBoltOutline,
  mdiOfficeBuildingMarkerOutline,
  mdiPowerPlugOutline,
  mdiPotSteamOutline,
  mdiShieldCheckOutline,
  mdiSofaOutline,
  mdiStove,
  mdiToilet,
  mdiTransmissionTower,
  mdiTrashCanOutline
} from "@mdi/js";
import "../src/index";
import { DEFAULT_CONFIG, EMPTY_CONFIG } from "../src/default-config";
import type { HomeAssistantLike } from "../src/types";

const DEMO_CONFIG = {
  ...DEFAULT_CONFIG,
  voltage_entity: "sensor.home_voltage",
  frequency_entity: "sensor.grid_frequency",
  power_factor_entity: "sensor.home_power_factor"
};

const ICONS = new Map<string, string>([
  ["mdi:alert-circle-outline", mdiAlertCircleOutline],
  ["mdi:bathtub-outline", mdiBathtubOutline],
  ["mdi:battery-charging-60", mdiBatteryCharging60],
  ["mdi:bed-king-outline", mdiBedKingOutline],
  ["mdi:bed-outline", mdiBedOutline],
  ["mdi:calendar-month-outline", mdiCalendarMonthOutline],
  ["mdi:chart-line", mdiChartLine],
  ["mdi:chevron-down", mdiChevronDown],
  ["mdi:chevron-up", mdiChevronUp],
  ["mdi:clock-outline", mdiClockOutline],
  ["mdi:dots-horizontal", mdiDotsHorizontal],
  ["mdi:engine", mdiEngine],
  ["mdi:flash", mdiFlash],
  ["mdi:home-outline", mdiHomeOutline],
  ["mdi:lightbulb-on-outline", mdiLightbulbOnOutline],
  ["mdi:lightning-bolt-outline", mdiLightningBoltOutline],
  ["mdi:office-building-marker-outline", mdiOfficeBuildingMarkerOutline],
  ["mdi:power-plug-outline", mdiPowerPlugOutline],
  ["mdi:pot-steam-outline", mdiPotSteamOutline],
  ["mdi:shield-check-outline", mdiShieldCheckOutline],
  ["mdi:sofa-outline", mdiSofaOutline],
  ["mdi:stove", mdiStove],
  ["mdi:toilet", mdiToilet],
  ["mdi:transmission-tower", mdiTransmissionTower],
  ["mdi:trash-can-outline", mdiTrashCanOutline]
]);

class HaCardStub extends HTMLElement {}
customElements.define("ha-card", HaCardStub);

class HaIconStub extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["icon"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const path = ICONS.get(this.getAttribute("icon") ?? "") ?? mdiFlash;
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-grid;
            width: var(--mdc-icon-size, 24px);
            height: var(--mdc-icon-size, 24px);
            place-items: center;
          }
          svg {
            width: 100%;
            height: 100%;
            fill: currentColor;
          }
        </style>
        <svg viewBox="0 0 24 24" part="svg" aria-hidden="true"><path d="${path}"></path></svg>
      `;
    }
  }
}
customElements.define("ha-icon", HaIconStub);

class HaIconPickerStub extends HTMLElement {
  private _value = "";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set value(value: string) {
    this._value = value ?? "";
    this.render();
  }

  get value(): string {
    return this._value;
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    if (!this.shadowRoot) {
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        .field {
          display: flex;
          align-items: center;
          min-height: 36px;
          gap: 8px;
          border: 1px solid rgba(150, 180, 210, 0.24);
          border-radius: 8px;
          padding: 0 10px;
          color: var(--primary-text-color, #eef5ff);
          background: #111c29;
          font: inherit;
        }
        ha-icon {
          color: #6fc8ff;
          --mdc-icon-size: 18px;
        }
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      </style>
      <div class="field">
        <ha-icon icon="${this._value || "mdi:home-outline"}"></ha-icon>
        <span>${this._value || "mdi:home-outline"}</span>
      </div>
    `;
  }
}
customElements.define("ha-icon-picker", HaIconPickerStub);

@customElement("nexus-demo-app")
export class NexusDemoApp extends LitElement {
  @state() private _hass = createHass(0);
  private _cardConfigured = false;
  private _editorConfigured = false;
  private _timer?: number;

  protected override firstUpdated(): void {
    this._syncChild();
    this._timer = window.setInterval(() => {
      this._hass = createHass(Date.now());
      this._syncChild();
    }, 2400);
  }

  public override disconnectedCallback(): void {
    window.clearInterval(this._timer);
    super.disconnectedCallback();
  }

  protected override render() {
    const editorMode = new URLSearchParams(window.location.search).has("editor");
    return editorMode ? html`<nexus-energy-card-editor></nexus-energy-card-editor>` : html`<nexus-energy-card></nexus-energy-card>`;
  }

  private _syncChild(): void {
    const card = this.renderRoot.querySelector("nexus-energy-card");
    if (card && !this._cardConfigured) {
      card.setConfig(DEMO_CONFIG);
      this._cardConfigured = true;
    }
    if (card) {
      card.hass = this._hass;
    }

    const editor = this.renderRoot.querySelector("nexus-energy-card-editor");
    if (editor && !this._editorConfigured) {
      editor.setConfig(new URLSearchParams(window.location.search).has("demo") ? DEMO_CONFIG : EMPTY_CONFIG);
      this._editorConfigured = true;
    }
    if (editor) {
      editor.hass = this._hass;
    }
  }

  static override styles = css`
    :host {
      display: block;
    }

    ha-icon {
      display: inline-grid;
      width: var(--mdc-icon-size, 24px);
      height: var(--mdc-icon-size, 24px);
      place-items: center;
    }

    ha-icon svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  `;
}

function createHass(tick: number): HomeAssistantLike {
  const pulse = Math.sin(tick / 5800) * 70;
  const values = {
    solar_power: 5280 + pulse,
    battery_power: -1320 + Math.sin(tick / 7000) * 40,
    grid_power: 0,
    generator_power: 0,
    home_power: 3620 + pulse * 0.3,
    ground_floor_power: 2450 + pulse * 0.2,
    living_room_power: 850 + Math.sin(tick / 3500) * 36,
    kitchen_power: 1150,
    oven_power: 1200,
    microwave_power: 300,
    small_bathroom_power: 200,
    top_floor_power: 1040 + Math.cos(tick / 4900) * 12,
    main_bedroom_power: 400,
    bedroom_2_power: 350,
    bathroom_power: 250,
    home_voltage: 230 + Math.sin(tick / 9000) * 1.2,
    grid_frequency: 50 + Math.cos(tick / 11000) * 0.03,
    home_power_factor: 0.97,
    solar_energy_today: 22.4,
    battery_energy_today: 4.6,
    grid_energy_today: 0.8,
    generator_energy_today: 0,
    home_energy_today: 17.8,
    ground_floor_energy_today: 9.9,
    living_room_energy_today: 3.2,
    kitchen_energy_today: 4.1,
    oven_energy_today: 4.4,
    microwave_energy_today: 0.8,
    small_bathroom_energy_today: 0.6,
    top_floor_energy_today: 5.2,
    main_bedroom_energy_today: 2.1,
    bedroom_2_energy_today: 1.6,
    bathroom_energy_today: 1.5
  };

  const states: HomeAssistantLike["states"] = {};
  for (const [key, value] of Object.entries(values)) {
    const isEnergy = key.includes("energy");
    const isVoltage = key.includes("voltage");
    const isFrequency = key.includes("frequency");
    const isPowerFactor = key.includes("power_factor");
    states[`sensor.${key}`] = {
      entity_id: `sensor.${key}`,
      state: value.toFixed(isEnergy || isFrequency || isPowerFactor ? 2 : 0),
      attributes: {
        friendly_name: key
          .split("_")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
        device_class: isEnergy ? "energy" : isVoltage ? "voltage" : isFrequency ? "frequency" : isPowerFactor ? "power_factor" : "power",
        unit_of_measurement: isEnergy ? "kWh" : isVoltage ? "V" : isFrequency ? "Hz" : isPowerFactor ? "" : "W"
      }
    };
  }

  const callWS: HomeAssistantLike["callWS"] = async <T,>(message: Record<string, unknown>): Promise<T> => {
    if (message.type !== "history/history_during_period") {
      return [] as T;
    }

    const requestedIds = Array.isArray(message.entity_ids)
      ? message.entity_ids.filter((entityId): entityId is string => typeof entityId === "string")
      : typeof message.entity_id === "string"
        ? [message.entity_id]
        : [];
    const start = Date.parse(String(message.start_time ?? "")) || Date.now() - 60 * 60_000;
    const end = Date.parse(String(message.end_time ?? "")) || Date.now();
    const sampleCount = 44;
    const history = requestedIds.map((entityId) => {
      const key = entityId.replace(/^sensor\./, "");
      const base = Number(values[key as keyof typeof values] ?? states[entityId]?.state ?? 0);
      const isEnergy = key.includes("energy");
      return Array.from({ length: sampleCount }, (_, index) => {
        const progress = index / (sampleCount - 1);
        const time = new Date(start + (end - start) * progress);
        const wave = Math.sin(index / 2.8 + key.length) * (isEnergy ? 0.035 : 0.16);
        const spike = index % 17 === 0 ? (isEnergy ? 0.08 : 0.34) : 0;
        const value = Math.max(0, base * (1 + wave + spike));
        return {
          entity_id: entityId,
          state: value.toFixed(isEnergy ? 2 : 0),
          last_changed: time.toISOString(),
          last_updated: time.toISOString()
        };
      });
    });
    return history as T;
  };

  return { states, callWS };
}
