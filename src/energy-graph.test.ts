import { describe, expect, it, vi } from "vitest";
import { buildEnergyGraph } from "./energy-graph";
import type { HomeAssistantLike, NexusEnergyCardConfig } from "./types";

describe("buildEnergyGraph", () => {
  it("creates an automatic rest node when children are lower than the parent", () => {
    const config: NexusEnergyCardConfig = {
      nodes: [
        {
          id: "kitchen",
          name: "Cocina",
          entity: "sensor.kitchen",
          children: [
            { id: "oven", name: "Horno", entity: "sensor.oven" },
            { id: "microwave", name: "Microondas", entity: "sensor.microwave" }
          ]
        }
      ]
    };
    const graph = buildEnergyGraph(config, hass({ kitchen: 2000, oven: 1200, microwave: 300 }), "power");
    const rest = graph.primaryRoot?.children.find((node) => node.virtual);

    expect(rest?.name).toBe("Resto Cocina");
    expect(rest?.value).toBeCloseTo(0.5);
  });

  it("marks overflow and clamps the rest node to zero", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const config: NexusEnergyCardConfig = {
      nodes: [
        {
          id: "kitchen",
          name: "Cocina",
          entity: "sensor.kitchen",
          children: [
            { id: "oven", name: "Horno", entity: "sensor.oven" },
            { id: "microwave", name: "Microondas", entity: "sensor.microwave" }
          ]
        }
      ]
    };

    const graph = buildEnergyGraph(config, hass({ kitchen: 1000, oven: 1200, microwave: 300 }), "power");
    const rest = graph.primaryRoot?.children.find((node) => node.virtual);

    expect(graph.primaryRoot?.overflow).toBe(true);
    expect(graph.primaryRoot?.severity).toBe("overflow");
    expect(rest?.value).toBe(0);
    warn.mockRestore();
  });

  it("absorbs overflow inside the configured tolerance", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const config: NexusEnergyCardConfig = {
      overflow_tolerance: 5,
      nodes: [
        {
          id: "kitchen",
          name: "Cocina",
          entity: "sensor.kitchen",
          children: [
            { id: "oven", name: "Horno", entity: "sensor.oven" },
            { id: "microwave", name: "Microondas", entity: "sensor.microwave" }
          ]
        }
      ]
    };

    const graph = buildEnergyGraph(config, hass({ kitchen: 1000, oven: 700, microwave: 340 }), "power");
    const rest = graph.primaryRoot?.children.find((node) => node.virtual);

    expect(graph.primaryRoot?.overflow).toBe(false);
    expect(graph.primaryRoot?.severity).toBe("normal");
    expect(graph.overflowNodes).toHaveLength(0);
    expect(rest?.value).toBe(0);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("marks overflow when children exceed the configured tolerance", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const config: NexusEnergyCardConfig = {
      overflow_tolerance: 3,
      nodes: [
        {
          id: "kitchen",
          name: "Cocina",
          entity: "sensor.kitchen",
          children: [
            { id: "oven", name: "Horno", entity: "sensor.oven" },
            { id: "microwave", name: "Microondas", entity: "sensor.microwave" }
          ]
        }
      ]
    };

    const graph = buildEnergyGraph(config, hass({ kitchen: 1000, oven: 700, microwave: 340 }), "power");

    expect(graph.primaryRoot?.overflow).toBe(true);
    expect(graph.overflowNodes).toHaveLength(1);
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it("reverses direction for negative bidirectional values", () => {
    const config: NexusEnergyCardConfig = {
      sources: [{ id: "battery", entity: "sensor.battery", direction: "auto" }],
      nodes: [{ id: "home", entity: "sensor.home" }]
    };

    const graph = buildEnergyGraph(config, hass({ battery: -800, home: 800 }), "power");

    expect(graph.sources[0]?.direction).toBe("reverse");
    expect(graph.sources[0]?.value).toBeCloseTo(0.8);
  });

  it("can invert entity polarity from node configuration", () => {
    const config: NexusEnergyCardConfig = {
      sources: [{ id: "battery", entity: "sensor.battery", direction: "auto", invert_value: true }],
      nodes: [{ id: "home", entity: "sensor.home" }]
    };

    const graph = buildEnergyGraph(config, hass({ battery: 800, home: 800 }), "power");

    expect(graph.sources[0]?.rawValue).toBeCloseTo(-0.8);
    expect(graph.sources[0]?.direction).toBe("reverse");
  });
});

function hass(values: Record<string, number>): HomeAssistantLike {
  const states: HomeAssistantLike["states"] = {};
  for (const [name, value] of Object.entries(values)) {
    states[`sensor.${name}`] = {
      entity_id: `sensor.${name}`,
      state: String(value),
      attributes: {
        device_class: "power",
        unit_of_measurement: "W"
      }
    };
  }
  return { states };
}
