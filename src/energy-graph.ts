import type {
  GraphBuildResult,
  GraphNode,
  HomeAssistantLike,
  NexusEnergyCardConfig,
  NexusEnergyNodeConfig,
  NexusMode,
  NexusSeverity
} from "./types";
import { DEFAULT_CONFIG } from "./default-config";
import { friendlyEntityName, normalizeEntityValue } from "./format";
import { resolveLanguage, t } from "./i18n";

const EPSILON = 0.0005;
const HISTORY_LENGTH = 64;

export type HistoryCache = Map<string, number[]>;

export function createMergedConfig(config: NexusEnergyCardConfig): NexusEnergyCardConfig {
  const merged = {
    ...DEFAULT_CONFIG,
    ...config,
    thresholds: {
      ...DEFAULT_CONFIG.thresholds,
      ...config.thresholds
    }
  };

  if (config.nodes || config.entities) {
    merged.nodes = config.nodes ?? nodesFromEntities(config.entities ?? []);
  }

  if (config.sources) {
    merged.sources = config.sources;
  }

  return merged;
}

export function nodesFromEntities(entities: string[]): NexusEnergyNodeConfig[] {
  return [
    {
      id: "home",
      name: "Casa",
      icon: "mdi:home-outline",
      children: entities.map((entity) => ({
        id: entity.replace(/\W+/g, "-"),
        entity,
        name: friendlyEntityName(entity)
      }))
    }
  ];
}

export function buildEnergyGraph(
  inputConfig: NexusEnergyCardConfig,
  hass: HomeAssistantLike | undefined,
  mode: NexusMode,
  historyCache: HistoryCache = new Map()
): GraphBuildResult {
  const config = createMergedConfig(inputConfig);
  const thresholds = {
    warning: config.thresholds?.warning ?? 0.65,
    critical: config.thresholds?.critical ?? 0.85
  };
  const overflowToleranceRatio = clampPercentage(config.overflow_tolerance ?? 5) / 100;
  const language = resolveLanguage(config.language, hass?.language);
  const overflowNodes: GraphNode[] = [];

  const buildNode = (
    nodeConfig: NexusEnergyNodeConfig,
    role: GraphNode["role"],
    parent?: GraphNode,
    indexPath = "0"
  ): GraphNode => {
    const entityId = mode === "energy" ? nodeConfig.energy_entity ?? nodeConfig.entity : nodeConfig.power_entity ?? nodeConfig.entity;
    const id = nodeConfig.id ?? entityId ?? `node-${indexPath}`;
    const normalized = normalizeEntityValue(hass, entityId, mode);
    const rawValue = nodeConfig.invert_value ? -normalized.rawValue : normalized.rawValue;
    const value = Math.abs(rawValue);
    const childrenConfigs = nodeConfig.children ?? [];
    const node: GraphNode = {
      id,
      name: nodeConfig.name ?? normalized.state?.attributes.friendly_name?.toString() ?? friendlyEntityName(id),
      entity: entityId,
      icon: nodeConfig.icon ?? defaultIcon(role),
      role,
      value,
      rawValue,
      unit: normalized.unit,
      capacity: nodeConfig.capacity,
      percentOfParent: 0,
      severity: "normal",
      direction: resolveDirection(nodeConfig.direction, rawValue),
      virtual: false,
      overflow: false,
      children: [],
      parent,
      color: nodeConfig.color,
      history: []
    };

    node.children = childrenConfigs.map((child, childIndex) =>
      buildNode(child, child.children?.length ? "hub" : "load", node, `${indexPath}-${childIndex}`)
    );

    const childrenTotal = node.children.reduce((sum, child) => sum + child.value, 0);
    if (!nodeConfig.entity && node.children.length > 0) {
      node.value = childrenTotal;
      node.rawValue = childrenTotal;
    }

    if (node.children.length > 0) {
      const overflowDifference = childrenTotal - node.value;
      const allowedOverflow = Math.max(EPSILON, node.value * overflowToleranceRatio);

      if (overflowDifference > allowedOverflow) {
        node.overflow = true;
        node.severity = "overflow";
        overflowNodes.push(node);
        if (typeof console !== "undefined") {
          console.warn(
            `[nexus-energy-card] Overflow detected in ${node.name}: children=${childrenTotal.toFixed(
              3
            )}${node.unit}, parent=${node.value.toFixed(3)}${node.unit}`
          );
        }
        node.children.push(createRestNode(node, 0, language));
      } else if (overflowDifference > EPSILON) {
        node.children.push(createRestNode(node, 0, language));
      } else if (node.value - childrenTotal > Math.max(EPSILON, node.value * 0.005)) {
        node.children.push(createRestNode(node, node.value - childrenTotal, language));
      }
    }

    node.severity = node.overflow ? "overflow" : resolveSeverity(node, thresholds.warning, thresholds.critical);
    node.history = updateHistory(historyCache, node);
    for (const child of node.children) {
      child.percentOfParent = node.value > 0 ? child.value / node.value : 0;
      child.severity = child.overflow ? "overflow" : resolveSeverity(child, thresholds.warning, thresholds.critical);
    }

    return node;
  };

  const roots = (config.nodes ?? []).map((node, index) => buildNode(node, "hub", undefined, `root-${index}`));
  const primaryRoot = roots[0];
  const sources = (config.sources ?? []).map((node, index) => {
    const source = buildNode(node, "source", primaryRoot, `source-${index}`);
    source.percentOfParent = primaryRoot && primaryRoot.value > 0 ? source.value / primaryRoot.value : 0;
    return source;
  });

  const allNodes = [...sources, ...flattenNodes(roots)];
  const total = primaryRoot?.value ?? roots.reduce((sum, node) => sum + node.value, 0);
  const sourceTotal = sources.reduce((sum, node) => sum + node.value, 0);
  const signature = allNodes.map((node) => `${node.id}:${node.name}:${node.rawValue.toFixed(4)}:${node.children.length}`).join("|");

  return {
    sources,
    roots,
    primaryRoot,
    allNodes,
    overflowNodes,
    total,
    sourceTotal,
    signature
  };
}

export function flattenNodes(nodes: GraphNode[]): GraphNode[] {
  const flattened: GraphNode[] = [];
  const visit = (node: GraphNode) => {
    flattened.push(node);
    node.children.forEach(visit);
  };
  nodes.forEach(visit);
  return flattened;
}

function clampPercentage(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 5;
  }

  return Math.min(100, Math.max(0, parsed));
}

function createRestNode(parent: GraphNode, value: number, language: ReturnType<typeof resolveLanguage>): GraphNode {
  const node: GraphNode = {
    id: `${parent.id}__rest`,
    name: `${t(language, "restPrefix")} ${parent.name}`,
    icon: "mdi:dots-horizontal",
    role: "rest",
    value: Math.max(0, value),
    rawValue: Math.max(0, value),
    unit: parent.unit,
    percentOfParent: parent.value > 0 ? Math.max(0, value) / parent.value : 0,
    severity: "normal",
    direction: "forward",
    virtual: true,
    overflow: false,
    children: [],
    parent,
    history: pseudoHistory(`${parent.id}__rest`, Math.max(0, value))
  };

  return node;
}

function defaultIcon(role: GraphNode["role"]): string {
  switch (role) {
    case "source":
      return "mdi:flash";
    case "hub":
      return "mdi:home-lightning-bolt-outline";
    case "rest":
      return "mdi:dots-horizontal";
    case "load":
    default:
      return "mdi:power-plug-outline";
  }
}

function resolveDirection(direction: NexusEnergyNodeConfig["direction"], rawValue: number): GraphNode["direction"] {
  if (direction === "export") {
    return "reverse";
  }

  if (direction === "import") {
    return "forward";
  }

  return rawValue < 0 ? "reverse" : "forward";
}

function resolveSeverity(node: GraphNode, warning: number, critical: number): NexusSeverity {
  if (!node.capacity || node.capacity <= 0) {
    if (node.percentOfParent >= critical) {
      return "critical";
    }
    if (node.percentOfParent >= warning) {
      return "warning";
    }
    return "normal";
  }

  const load = node.value / node.capacity;
  if (load >= critical) {
    return "critical";
  }
  if (load >= warning) {
    return "warning";
  }
  return "normal";
}

function updateHistory(historyCache: HistoryCache, node: GraphNode): number[] {
  if (!node.entity) {
    return pseudoHistory(node.id, node.value);
  }

  const existing = historyCache.get(node.entity) ?? pseudoHistory(node.entity, node.value).slice(0, 18);
  const previous = existing.at(-1);
  if (previous === undefined || Math.abs(previous - node.value) > Math.max(0.001, node.value * 0.005)) {
    existing.push(node.value);
  }

  while (existing.length > HISTORY_LENGTH) {
    existing.shift();
  }

  historyCache.set(node.entity, existing);
  return [...existing];
}

function pseudoHistory(seed: string, value: number): number[] {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return Array.from({ length: 32 }, (_, index) => {
    const wave = Math.sin(index / 3 + (hash % 17)) * 0.16;
    const drift = Math.cos(index / 7 + (hash % 11)) * 0.08;
    return Math.max(0, value * (0.9 + wave + drift));
  });
}
