export type NexusMode = "power" | "energy";
export type NexusOrientation = "horizontal" | "vertical";
export type NexusNodeRole = "source" | "hub" | "load" | "rest";
export type NexusDirection = "auto" | "import" | "export";
export type NexusSeverity = "normal" | "warning" | "critical" | "overflow";
export type NexusRange = "today" | "yesterday" | "week" | "month" | "year" | "custom";
export type NexusBackgroundStyle = "transparent" | "glass" | "solid";

export interface HomeAssistantState {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed?: string;
  last_updated?: string;
}

export interface HomeAssistantLike {
  states: Record<string, HomeAssistantState>;
  callWS?: <T = unknown>(message: Record<string, unknown>) => Promise<T>;
  callApi?: <T = unknown>(
    method: string,
    path: string,
    parameters?: Record<string, unknown>,
    headers?: Record<string, string>
  ) => Promise<T>;
  callService?: (...args: unknown[]) => Promise<unknown> | unknown;
}

export interface NexusThresholds {
  warning?: number;
  critical?: number;
}

export interface NexusEnergyNodeConfig {
  id?: string;
  name?: string;
  entity?: string;
  power_entity?: string;
  energy_entity?: string;
  icon?: string;
  capacity?: number;
  direction?: NexusDirection;
  invert_value?: boolean;
  color?: string;
  children?: NexusEnergyNodeConfig[];
}

export interface NexusColorThreshold {
  id?: string;
  node_id?: string;
  above: number;
  color: string;
}

export interface NexusEnergyCardConfig {
  type?: string;
  title?: string;
  mode?: NexusMode;
  range?: NexusRange;
  show_time_selector?: boolean;
  height?: number;
  unit?: string;
  precision?: number;
  animation?: boolean;
  animation_speed?: number;
  line_width_base?: number;
  background_style?: NexusBackgroundStyle;
  hide_zero_nodes?: boolean;
  base_color?: string;
  default_expanded_depth?: number;
  thresholds?: NexusThresholds;
  color_thresholds?: NexusColorThreshold[];
  sources?: NexusEnergyNodeConfig[];
  nodes?: NexusEnergyNodeConfig[];
  entities?: string[];
}

export interface GraphNode {
  id: string;
  name: string;
  entity?: string;
  icon: string;
  role: NexusNodeRole;
  value: number;
  rawValue: number;
  unit: string;
  capacity?: number;
  percentOfParent: number;
  severity: NexusSeverity;
  direction: "forward" | "reverse";
  virtual: boolean;
  overflow: boolean;
  children: GraphNode[];
  parent?: GraphNode;
  color?: string;
  history: number[];
}

export interface GraphBuildResult {
  sources: GraphNode[];
  roots: GraphNode[];
  primaryRoot?: GraphNode;
  allNodes: GraphNode[];
  overflowNodes: GraphNode[];
  total: number;
  sourceTotal: number;
  signature: string;
}

export interface PositionedNode extends GraphNode {
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  visibleChildren: PositionedNode[];
}

export interface PositionedEdge {
  id: string;
  from: PositionedNode;
  to: PositionedNode;
  fromSlot: number;
  fromSlotCount: number;
  toSlot: number;
  toSlotCount: number;
  value: number;
  percent: number;
  severity: NexusSeverity;
  direction: "forward" | "reverse";
}

export interface GraphLayout {
  orientation: NexusOrientation;
  width: number;
  height: number;
  nodes: PositionedNode[];
  sources: PositionedNode[];
  primaryRoot?: PositionedNode;
  edges: PositionedEdge[];
}
