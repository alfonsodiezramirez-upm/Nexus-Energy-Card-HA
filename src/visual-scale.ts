export const VISUAL_SCALE_MIN = 0.5;
export const VISUAL_SCALE_MAX = 1.5;
export const VISUAL_SCALE_DEFAULT = 1;

export function normalizeVisualScale(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return VISUAL_SCALE_DEFAULT;
  }

  return Math.min(VISUAL_SCALE_MAX, Math.max(VISUAL_SCALE_MIN, parsed));
}

export function visualScaleToPercent(value: unknown): number {
  return Math.round(normalizeVisualScale(value) * 100);
}

export function visualScaleFromPercent(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return VISUAL_SCALE_DEFAULT;
  }

  return normalizeVisualScale(parsed / 100);
}
