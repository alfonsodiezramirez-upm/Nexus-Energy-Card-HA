import { describe, expect, it } from "vitest";
import { buildEnergyGraph } from "./energy-graph";
import { edgePath, layoutGraph } from "./layout";
import type { HomeAssistantLike, NexusEnergyCardConfig, PositionedNode } from "./types";

describe("layoutGraph", () => {
  it("aligns equal-depth children in strict columns with fixed device dimensions", () => {
    const layout = fixtureLayout();
    const depthTwoNodes = layout.nodes.filter((node) => node.depth === 2);
    const firstX = depthTwoNodes[0]?.x;

    expect(depthTwoNodes.length).toBeGreaterThan(3);
    for (const node of depthTwoNodes) {
      expect(node.x).toBe(firstX);
      expect(node.width).toBe(304);
      expect(node.height).toBe(72);
    }
  });

  it("centers parent nodes against the full height of their child group", () => {
    const layout = fixtureLayout();
    const groundFloor = getNode(layout.nodes, "ground-floor");
    const children = groundFloor.visibleChildren;
    const parentCenter = groundFloor.y + groundFloor.height / 2;
    const childGroupCenter = (centerY(children[0]) + centerY(children[children.length - 1])) / 2;

    expect(parentCenter).toBeCloseTo(childGroupCenter, 5);
  });

  it("centers the root against the first and last visible child centers", () => {
    const layout = fixtureLayout();
    const home = getNode(layout.nodes, "home");
    const children = home.visibleChildren;
    const expectedCenter = (centerY(children[0]) + centerY(children[children.length - 1])) / 2;

    expect(centerY(home)).toBeCloseTo(expectedCenter, 5);
  });

  it("keeps calculated rest nodes in the same structural column as real siblings", () => {
    const layout = fixtureLayout();
    const groundFloor = getNode(layout.nodes, "ground-floor");
    const realSibling = getNode(groundFloor.visibleChildren, "living-room");
    const restSibling = groundFloor.visibleChildren.find((node) => node.role === "rest");

    expect(restSibling).toBeDefined();
    expect(restSibling?.x).toBe(realSibling.x);
    expect(restSibling?.width).toBe(realSibling.width);
    expect(restSibling?.height).toBe(realSibling.height);
  });

  it("emits horizontal Bezier tangents at parent and child anchors", () => {
    const layout = fixtureLayout();
    const edge = layout.edges.find((item) => item.from.id === "ground-floor" && item.to.id === "living-room");
    expect(edge).toBeDefined();

    const path = edgePath(edge!, "horizontal");
    const numbers = [...path.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
    const [, startY, , controlOneY, , controlTwoY, , endY] = numbers;

    expect(controlOneY).toBe(startY);
    expect(controlTwoY).toBe(endY);
  });

  it("uses the strict half-column offset cubic formula", () => {
    const layout = fixtureLayout();
    const edge = layout.edges.find((item) => item.from.id === "ground-floor" && item.to.id === "living-room");
    expect(edge).toBeDefined();

    const numbers = parsePath(edgePath(edge!, "horizontal"));
    const [x1, y1, c1x, c1y, c2x, c2y, x2, y2] = numbers;
    const offset = (x2 - x1) / 2;

    expect(c1x).toBeCloseTo(x1 + offset, 5);
    expect(c1y).toBe(y1);
    expect(c2x).toBeCloseTo(x2 - offset, 5);
    expect(c2y).toBe(y2);
  });

  it("spreads parent output anchors evenly along the right border", () => {
    const layout = fixtureLayout();
    const groundFloor = getNode(layout.nodes, "ground-floor");
    const outgoing = layout.edges.filter((edge) => edge.from.id === "ground-floor");
    const startYs = outgoing.map((edge) => parsePath(edgePath(edge, "horizontal"))[1]);

    expect(outgoing).toHaveLength(4);
    expect(startYs).toEqual([...startYs].sort((a, b) => a - b));
    expect(startYs[0]).toBeCloseTo(groundFloor.y + groundFloor.height / 5, 5);
    expect(startYs[3]).toBeCloseTo(groundFloor.y + (groundFloor.height * 4) / 5, 5);
  });

  it("spreads source input anchors evenly along the home left border", () => {
    const layout = fixtureLayout();
    const home = getNode(layout.nodes, "home");
    const incoming = layout.edges.filter((edge) => edge.to.id === "home");
    const endYs = incoming.map((edge) => parsePath(edgePath(edge, "horizontal"))[7]);

    expect(incoming).toHaveLength(4);
    expect(endYs).toEqual([...endYs].sort((a, b) => a - b));
    expect(endYs[0]).toBeCloseTo(home.y + home.height / 5, 5);
    expect(endYs[3]).toBeCloseTo(home.y + (home.height * 4) / 5, 5);
  });

  it("balances horizontal gaps between sources, home, and first hierarchy column", () => {
    const layout = fixtureLayout();
    const home = getNode(layout.nodes, "home");
    const firstChild = home.visibleChildren[0];
    const sourceRight = Math.max(...layout.sources.map((source) => source.x + source.width));

    expect(home.x - sourceRight).toBeCloseTo(firstChild.x - (home.x + home.width), 5);
    expect(home.x - sourceRight).toBeGreaterThanOrEqual(52);
  });

  it("uses the same vertical rhythm for left sources and right sibling groups", () => {
    const layout = fixtureLayout();
    const groundFloor = getNode(layout.nodes, "ground-floor");
    const sourceGap = layout.sources[1].y - (layout.sources[0].y + layout.sources[0].height);
    const childGap = groundFloor.visibleChildren[1].y - (groundFloor.visibleChildren[0].y + groundFloor.visibleChildren[0].height);

    expect(sourceGap).toBe(16);
    expect(childGap).toBe(sourceGap);
  });

  it("can hide zero-value sources when cleanup mode is enabled", () => {
    const graph = buildEnergyGraph(fixtureConfig(), fixtureHass(), "power");
    const layout = layoutGraph(graph, {
      width: 1380,
      height: 720,
      orientation: "horizontal",
      expandedIds: new Set(),
      collapsedIds: new Set(),
      defaultExpandedDepth: 2,
      hideZeroNodes: true
    });

    expect(layout.sources.map((source) => source.id)).toEqual(["solar", "battery"]);
    expect(layout.edges.some((edge) => edge.from.id === "grid")).toBe(false);
    expect(layout.edges.some((edge) => edge.from.id === "generator")).toBe(false);
  });

  it("stacks sources, home, and children in compact vertical mode", () => {
    const layout = fixtureCompactLayout();
    const home = getNode(layout.nodes, "home");
    const firstSource = getNode(layout.sources, "solar");
    const firstChild = home.visibleChildren[0];

    expect(layout.orientation).toBe("vertical");
    expect(firstSource.y + firstSource.height).toBeLessThan(home.y);
    expect(home.y + home.height).toBeLessThan(firstChild.y);
    expect(home.width).toBeLessThanOrEqual(300);

    for (const node of layout.nodes) {
      expect(node.x).toBeGreaterThanOrEqual(0);
      expect(node.x + node.width).toBeLessThanOrEqual(layout.width);
    }
  });

  it("uses a two-column compact child grid when the card width allows it", () => {
    const layout = fixtureCompactLayout();
    const home = getNode(layout.nodes, "home");
    const [first, second, third] = home.visibleChildren;

    expect(home.visibleChildren.length).toBeGreaterThanOrEqual(3);
    expect(first.y).toBe(second.y);
    expect(first.x).toBeLessThan(second.x);
    expect(third.y).toBeGreaterThan(first.y);
    expect(first.width).toBeGreaterThanOrEqual(140);
    expect(first.width).toBe(second.width);
  });

  it("emits vertical Bezier tangents in compact mode", () => {
    const layout = fixtureCompactLayout();
    const edge = layout.edges.find((item) => item.from.id === "home" && item.to.id === "ground-floor");
    expect(edge).toBeDefined();

    const numbers = parsePath(edgePath(edge!, "vertical"));
    const [x1, y1, c1x, c1y, c2x, c2y, x2, y2] = numbers;
    const offset = (y2 - y1) / 2;

    expect(c1x).toBe(x1);
    expect(c1y).toBeCloseTo(y1 + offset, 5);
    expect(c2x).toBe(x2);
    expect(c2y).toBeCloseTo(y2 - offset, 5);
  });

  it("spreads compact parent output anchors along the bottom edge", () => {
    const layout = fixtureCompactLayout();
    const home = getNode(layout.nodes, "home");
    const outgoing = layout.edges.filter((edge) => edge.from.id === "home");
    const startXs = outgoing.map((edge) => parsePath(edgePath(edge, "vertical"))[0]);

    expect(outgoing.length).toBeGreaterThanOrEqual(3);
    expect(startXs).toEqual([...startXs].sort((a, b) => a - b));
    expect(startXs[0]).toBeCloseTo(home.x + home.width / (outgoing.length + 1), 5);
    expect(startXs.at(-1)).toBeCloseTo(home.x + (home.width * outgoing.length) / (outgoing.length + 1), 5);
  });
});

function fixtureLayout() {
  const graph = buildEnergyGraph(fixtureConfig(), fixtureHass(), "power");
  return layoutGraph(graph, {
    width: 1380,
    height: 720,
    orientation: "horizontal",
    expandedIds: new Set(),
    collapsedIds: new Set(),
    defaultExpandedDepth: 2
  });
}

function fixtureCompactLayout() {
  const graph = buildEnergyGraph(fixtureConfig(), fixtureHass(), "power");
  return layoutGraph(graph, {
    width: 360,
    height: 520,
    orientation: "vertical",
    expandedIds: new Set(),
    collapsedIds: new Set(),
    defaultExpandedDepth: 2
  });
}

function getNode(nodes: PositionedNode[], id: string): PositionedNode {
  const node = nodes.find((item) => item.id === id);
  if (!node) {
    throw new Error(`Missing node ${id}`);
  }
  return node;
}

function centerY(node: PositionedNode): number {
  return node.y + node.height / 2;
}

function parsePath(path: string): number[] {
  return [...path.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
}

function fixtureConfig(): NexusEnergyCardConfig {
  return {
    sources: [
      { id: "solar", name: "Solar", entity: "sensor.solar", capacity: 7 },
      { id: "battery", name: "Bateria", entity: "sensor.battery", capacity: 3, direction: "auto" },
      { id: "grid", name: "Red", entity: "sensor.grid", capacity: 6 },
      { id: "generator", name: "Generador", entity: "sensor.generator", capacity: 5 }
    ],
    nodes: [
      {
        id: "home",
        name: "Casa",
        entity: "sensor.home",
        children: [
          {
            id: "ground-floor",
            name: "Planta Baja",
            entity: "sensor.ground_floor",
            children: [
              { id: "living-room", name: "Salón", entity: "sensor.living_room" },
              { id: "kitchen", name: "Cocina", entity: "sensor.kitchen" },
              { id: "bathroom-small", name: "Aseo", entity: "sensor.bathroom_small" }
            ]
          },
          {
            id: "top-floor",
            name: "Planta Alta",
            entity: "sensor.top_floor",
            children: [
              { id: "main-bedroom", name: "Dormitorio Principal", entity: "sensor.main_bedroom" },
              { id: "bedroom-2", name: "Dormitorio 2", entity: "sensor.bedroom_2" }
            ]
          }
        ]
      }
    ]
  };
}

function fixtureHass(): HomeAssistantLike {
  const values = {
    solar: 3600,
    battery: 1200,
    grid: 0,
    generator: 0,
    home: 3600,
    ground_floor: 2400,
    living_room: 800,
    kitchen: 900,
    bathroom_small: 200,
    top_floor: 900,
    main_bedroom: 400,
    bedroom_2: 300
  };
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
