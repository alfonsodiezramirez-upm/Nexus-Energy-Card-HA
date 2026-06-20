import type { HomeAssistantLike, HomeAssistantState, NexusMode, NexusRange } from "./types";

const POWER_UNITS = new Set(["w", "kw"]);
const ENERGY_UNITS = new Set(["wh", "kwh"]);

export function normalizeEntityValue(
  hass: HomeAssistantLike | undefined,
  entityId: string | undefined,
  mode: NexusMode
): { value: number; rawValue: number; unit: string; state?: HomeAssistantState } {
  const state = entityId && hass ? hass.states[entityId] : undefined;
  const raw = Number.parseFloat(String(state?.state ?? "0").replace(",", "."));
  const unit = String(state?.attributes.unit_of_measurement ?? (mode === "power" ? "kW" : "kWh"));
  const normalizedUnit = unit.toLowerCase();
  const safeRaw = Number.isFinite(raw) ? raw : 0;

  if (mode === "power" && POWER_UNITS.has(normalizedUnit)) {
    return {
      value: normalizedUnit === "w" ? Math.abs(safeRaw) / 1000 : Math.abs(safeRaw),
      rawValue: normalizedUnit === "w" ? safeRaw / 1000 : safeRaw,
      unit: "kW",
      state
    };
  }

  if (mode === "energy" && ENERGY_UNITS.has(normalizedUnit)) {
    return {
      value: normalizedUnit === "wh" ? Math.abs(safeRaw) / 1000 : Math.abs(safeRaw),
      rawValue: normalizedUnit === "wh" ? safeRaw / 1000 : safeRaw,
      unit: "kWh",
      state
    };
  }

  return {
    value: Math.abs(safeRaw),
    rawValue: safeRaw,
    unit: mode === "power" ? "kW" : "kWh",
    state
  };
}

export function friendlyEntityName(entityId: string): string {
  const [, objectId = entityId] = entityId.split(".");
  return objectId
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatValue(value: number, mode: NexusMode, precision = 2): string {
  if (mode === "power") {
    if (Math.abs(value) < 1) {
      return `${Math.round(value * 1000)} W`;
    }

    return `${value.toFixed(precision)} kW`;
  }

  if (Math.abs(value) < 1) {
    return `${Math.round(value * 1000)} Wh`;
  }

  return `${value.toFixed(precision)} kWh`;
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${Math.round(value * 100)}%`;
}

export function rangeLabel(range: NexusRange | undefined): string {
  switch (range) {
    case "yesterday":
      return "Ayer";
    case "week":
      return "Esta semana";
    case "month":
      return "Mes actual";
    case "year":
      return "Año actual";
    case "custom":
      return "Personalizado";
    case "today":
    default:
      return "Hoy";
  }
}
