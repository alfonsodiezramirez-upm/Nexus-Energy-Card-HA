import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  mdiAlertCircleOutline,
  mdiBathtubOutline,
  mdiBatteryCharging60,
  mdiBedKingOutline,
  mdiBedOutline,
  mdiCalendarMonthOutline,
  mdiCashMultiple,
  mdiChevronDown,
  mdiChevronUp,
  mdiClockOutline,
  mdiCrosshairsGps,
  mdiDotsHorizontal,
  mdiEngine,
  mdiFlash,
  mdiFullscreen,
  mdiHomeOutline,
  mdiLeaf,
  mdiLightbulbOnOutline,
  mdiLightningBoltOutline,
  mdiMinus,
  mdiOfficeBuildingMarkerOutline,
  mdiPlus,
  mdiPotSteamOutline,
  mdiShieldCheckOutline,
  mdiSofaOutline,
  mdiStove,
  mdiThermometer,
  mdiToilet,
  mdiTransmissionTower,
  mdiTrendingDown,
  mdiTrashCanOutline
} from "@mdi/js";
import "../src/index";
import { DEFAULT_CONFIG } from "../src/default-config";
import type { HomeAssistantLike } from "../src/types";

const ICONS = new Map<string, string>([
  ["mdi:alert-circle-outline", mdiAlertCircleOutline],
  ["mdi:bathtub-outline", mdiBathtubOutline],
  ["mdi:battery-charging-60", mdiBatteryCharging60],
  ["mdi:bed-king-outline", mdiBedKingOutline],
  ["mdi:bed-outline", mdiBedOutline],
  ["mdi:calendar-month-outline", mdiCalendarMonthOutline],
  ["mdi:cash-multiple", mdiCashMultiple],
  ["mdi:chevron-down", mdiChevronDown],
  ["mdi:chevron-up", mdiChevronUp],
  ["mdi:clock-outline", mdiClockOutline],
  ["mdi:crosshairs-gps", mdiCrosshairsGps],
  ["mdi:dots-horizontal", mdiDotsHorizontal],
  ["mdi:engine", mdiEngine],
  ["mdi:flash", mdiFlash],
  ["mdi:fullscreen", mdiFullscreen],
  ["mdi:home-outline", mdiHomeOutline],
  ["mdi:leaf", mdiLeaf],
  ["mdi:lightbulb-on-outline", mdiLightbulbOnOutline],
  ["mdi:lightning-bolt-outline", mdiLightningBoltOutline],
  ["mdi:minus", mdiMinus],
  ["mdi:office-building-marker-outline", mdiOfficeBuildingMarkerOutline],
  ["mdi:plus", mdiPlus],
  ["mdi:pot-steam-outline", mdiPotSteamOutline],
  ["mdi:shield-check-outline", mdiShieldCheckOutline],
  ["mdi:sofa-outline", mdiSofaOutline],
  ["mdi:stove", mdiStove],
  ["mdi:thermometer", mdiThermometer],
  ["mdi:toilet", mdiToilet],
  ["mdi:transmission-tower", mdiTransmissionTower],
  ["mdi:trending-down", mdiTrendingDown],
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

@customElement("nexus-demo-app")
export class NexusDemoApp extends LitElement {
  @state() private _hass = createHass(0);
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
    card?.setConfig(DEFAULT_CONFIG);
    if (card) {
      card.hass = this._hass;
    }

    const editor = this.renderRoot.querySelector("nexus-energy-card-editor");
    editor?.setConfig(DEFAULT_CONFIG);
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
    states[`sensor.${key}`] = {
      entity_id: `sensor.${key}`,
      state: value.toFixed(isEnergy ? 2 : 0),
      attributes: {
        friendly_name: key
          .split("_")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
        device_class: isEnergy ? "energy" : "power",
        unit_of_measurement: isEnergy ? "kWh" : "W"
      }
    };
  }

  return { states };
}
