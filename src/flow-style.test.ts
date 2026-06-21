import { describe, expect, it } from "vitest";
import { calculateEdgeWidth } from "./flow-style";

describe("calculateEdgeWidth", () => {
  it("keeps residual power flows at the minimum stroke width", () => {
    expect(calculateEdgeWidth(0.028, 3.6, "power", 0.01, 1.5)).toBe(1.5);
  });

  it("maps the largest visible power flow to the maximum stroke width", () => {
    expect(calculateEdgeWidth(3.6, 3.6, "power", 1, 1.5)).toBe(7.5);
  });

  it("keeps intermediate power flows visually between residual and maximum flows", () => {
    const residual = calculateEdgeWidth(0.028, 3.6, "power", 0.01, 1.5);
    const kitchen = calculateEdgeWidth(1.15, 3.6, "power", 0.32, 1.5);
    const house = calculateEdgeWidth(3.6, 3.6, "power", 1, 1.5);

    expect(kitchen).toBeGreaterThan(residual);
    expect(kitchen).toBeLessThan(house);
  });

  it("scales the full Sankey range from the configured base width", () => {
    expect(calculateEdgeWidth(0.028, 3.6, "power", 0.01, 4)).toBe(4);
    expect(calculateEdgeWidth(3.6, 3.6, "power", 1, 4)).toBe(10);
  });
});
