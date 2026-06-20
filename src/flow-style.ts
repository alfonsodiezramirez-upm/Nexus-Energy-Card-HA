import type { NexusMode } from "./types";

const POWER_MIN_WIDTH = 2;
const POWER_MAX_WIDTH = 10;
const POWER_RESIDUAL_KW = 0.05;
const ENERGY_MIN_WIDTH = 3;
const ENERGY_MAX_WIDTH = 18;

export function calculateEdgeWidth(
  value: number,
  maxValue: number,
  mode: NexusMode,
  percent: number,
  baseWidth = POWER_MIN_WIDTH
): number {
  const minPowerWidth = clamp(baseWidth, 1, 8);
  const maxPowerWidth = minPowerWidth + (POWER_MAX_WIDTH - POWER_MIN_WIDTH);
  const minEnergyWidth = Math.max(2, minPowerWidth + (ENERGY_MIN_WIDTH - POWER_MIN_WIDTH));
  const maxEnergyWidth = minEnergyWidth + (ENERGY_MAX_WIDTH - ENERGY_MIN_WIDTH);

  if (mode === "energy") {
    const normalized = clamp(percent, 0, 1);
    return roundWidth(minEnergyWidth + normalized * (maxEnergyWidth - minEnergyWidth));
  }

  if (value <= POWER_RESIDUAL_KW || maxValue <= POWER_RESIDUAL_KW) {
    return minPowerWidth;
  }

  const normalized =
    Math.log1p(Math.max(0, value - POWER_RESIDUAL_KW)) / Math.log1p(Math.max(0.001, maxValue - POWER_RESIDUAL_KW));

  return roundWidth(minPowerWidth + clamp(normalized, 0, 1) * (maxPowerWidth - minPowerWidth));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundWidth(value: number): number {
  return Math.round(value * 100) / 100;
}
