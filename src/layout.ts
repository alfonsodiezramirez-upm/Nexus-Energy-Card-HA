import { hierarchy } from "d3-hierarchy";
import type {
  GraphBuildResult,
  GraphLayout,
  GraphNode,
  NexusOrientation,
  PositionedEdge,
  PositionedNode
} from "./types";

interface LayoutOptions {
  width: number;
  height: number;
  orientation: NexusOrientation;
  expandedIds: Set<string>;
  collapsedIds: Set<string>;
  defaultExpandedDepth: number;
  hideZeroNodes?: boolean;
}

const DEVICE_NODE_WIDTH = 304;
const DEVICE_NODE_HEIGHT = 72;
const SOURCE_NODE_MIN_WIDTH = 218;
const SOURCE_NODE_MAX_WIDTH = 232;
const ROOT_NODE_WIDTH = 270;
const ROOT_NODE_HEIGHT = 410;
const HORIZONTAL_COLUMN_GAP = 52;
const HORIZONTAL_SIBLING_GAP = 16;
const HORIZONTAL_GROUP_GAP = 32;
const HORIZONTAL_SOURCE_GAP = HORIZONTAL_SIBLING_GAP;
const COMPACT_OUTER_PADDING = 16;
const COMPACT_CHILD_SIDE_PADDING = 0;
const COMPACT_GRID_GAP = 8;
const COMPACT_SECTION_GAP = 40;
const COMPACT_NODE_MIN_WIDTH = 140;
const COMPACT_NODE_HEIGHT = 64;
const COMPACT_SOURCE_HEIGHT = 68;
const COMPACT_ROOT_MAX_WIDTH = 300;
const COMPACT_ROOT_HEIGHT = 300;

export function layoutGraph(graph: GraphBuildResult, options: LayoutOptions): GraphLayout {
  const width = Math.max(280, options.width);
  const height = Math.max(520, options.height);
  const sourceNodes = layoutSources(graph.sources, width, height, options.orientation, options.hideZeroNodes ?? false);
  const primaryRoot = graph.primaryRoot;

  if (!primaryRoot) {
    return {
      orientation: options.orientation,
      width,
      height,
      nodes: sourceNodes,
      sources: sourceNodes,
      edges: []
    };
  }

  if (options.orientation === "vertical") {
    const positionedTree = positionVerticalHierarchy(primaryRoot, width, sourceNodes, options);
    const primary = positionedTree.find((node) => node.id === primaryRoot.id);
    const edges = buildEdges(sourceNodes, positionedTree, primary, options.orientation);

    return {
      orientation: options.orientation,
      width,
      height: Math.max(height, Math.max(...positionedTree.map((node) => node.y + node.height + 32), 0)),
      nodes: [...sourceNodes, ...positionedTree],
      sources: sourceNodes,
      primaryRoot: primary,
      edges
    };
  }

  const positionedTree = positionHorizontalHierarchy(primaryRoot, width, height, sourceNodes, options);
  const primary = positionedTree.find((node) => node.id === primaryRoot.id);
  const edges = buildEdges(sourceNodes, positionedTree, primary, options.orientation);

  return {
    orientation: options.orientation,
    width,
    height: Math.max(height, Math.max(...positionedTree.map((node) => node.y + node.height + 32), 0)),
    nodes: [...sourceNodes, ...positionedTree],
    sources: sourceNodes,
    primaryRoot: primary,
    edges
  };
}

export function edgePath(edge: PositionedEdge, orientation: NexusOrientation): string {
  const from = anchor(edge.from, orientation, "out", edge.fromSlot, edge.fromSlotCount);
  const to = anchor(edge.to, orientation, "in", edge.toSlot, edge.toSlotCount);

  if (orientation === "horizontal") {
    const offset = (to.x - from.x) / 2;
    return `M ${from.x} ${from.y} C ${from.x + offset} ${from.y}, ${to.x - offset} ${to.y}, ${to.x} ${to.y}`;
  }

  const offset = Math.abs(to.y - from.y) * 0.45;
  return `M ${from.x} ${from.y} C ${from.x} ${from.y + offset}, ${to.x} ${to.y - offset}, ${to.x} ${to.y}`;
}

export function nodeCenter(node: PositionedNode): { x: number; y: number } {
  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2
  };
}

function isExpanded(
  node: GraphNode,
  expandedIds: Set<string>,
  collapsedIds: Set<string>,
  defaultDepth: number
): boolean {
  if (node.children.length === 0) {
    return false;
  }

  if (collapsedIds.has(node.id)) {
    return false;
  }

  const depth = getDepth(node);
  if (expandedIds.has(node.id)) {
    return true;
  }

  return depth < defaultDepth;
}

function getDepth(node: GraphNode): number {
  let depth = 0;
  let cursor = node.parent;
  while (cursor) {
    depth += 1;
    cursor = cursor.parent;
  }
  return depth;
}

function layoutSources(
  sources: GraphNode[],
  width: number,
  height: number,
  orientation: NexusOrientation,
  hideZeroNodes: boolean
): PositionedNode[] {
  const visibleSources = hideZeroNodes ? sources.filter((source) => source.value > 0.001) : sources;

  if (orientation === "horizontal") {
    const nodeWidth = Math.min(SOURCE_NODE_MAX_WIDTH, Math.max(SOURCE_NODE_MIN_WIDTH, width * 0.16));
    const nodeHeight = 112;
    const gap = HORIZONTAL_SOURCE_GAP;
    const totalHeight = visibleSources.length * nodeHeight + Math.max(0, visibleSources.length - 1) * gap;
    const startY = Math.max(116, (height - totalHeight) / 2);
    return visibleSources.map((node, index) => ({
      ...node,
      x: 32,
      y: startY + index * (nodeHeight + gap),
      width: nodeWidth,
      height: nodeHeight,
      depth: 0,
      visibleChildren: []
    }));
  }

  const gap = 10;
  const availableWidth = Math.max(COMPACT_NODE_MIN_WIDTH, width - COMPACT_OUTER_PADDING * 2);
  const columns =
    availableWidth >= COMPACT_NODE_MIN_WIDTH * 2 + gap ? Math.min(2, Math.max(1, visibleSources.length)) : 1;
  const nodeWidth = Math.floor((availableWidth - gap * (columns - 1)) / columns);
  const nodeHeight = COMPACT_SOURCE_HEIGHT;
  return visibleSources.map((node, index) => ({
    ...node,
    x: columns === 1 ? (width - nodeWidth) / 2 : COMPACT_OUTER_PADDING + (index % columns) * (nodeWidth + gap),
    y: 20 + Math.floor(index / columns) * (nodeHeight + gap),
    width: nodeWidth,
    height: nodeHeight,
    depth: 0,
    visibleChildren: []
  }));
}

function positionVerticalHierarchy(
  root: GraphNode,
  width: number,
  sourceNodes: PositionedNode[],
  options: LayoutOptions
): PositionedNode[] {
  const nodes: PositionedNode[] = [];
  const sourceBottom = sourceNodes.length ? Math.max(...sourceNodes.map((source) => source.y + source.height)) : 20;
  let cursorY = sourceBottom + COMPACT_SECTION_GAP;
  const rootWidth = Math.min(COMPACT_ROOT_MAX_WIDTH, width - COMPACT_OUTER_PADDING * 2);
  const rootHeight = COMPACT_ROOT_HEIGHT;
  const rootNode: PositionedNode = {
    ...root,
    x: (width - rootWidth) / 2,
    y: cursorY,
    width: rootWidth,
    height: rootHeight,
    depth: 0,
    visibleChildren: []
  };
  nodes.push(rootNode);
  cursorY += rootHeight + COMPACT_SECTION_GAP;

  placeCompactChildren(root, rootNode, cursorY, 1, width, options, nodes);
  return nodes;
}

function placeCompactChildren(
  source: GraphNode,
  parent: PositionedNode,
  top: number,
  depth: number,
  width: number,
  options: LayoutOptions,
  nodes: PositionedNode[]
): number {
  const children = visibleChildren(source, options);
  if (children.length === 0) {
    return top;
  }

  const indent = Math.min(20, Math.max(0, depth - 1) * 8);
  const availableWidth = Math.max(COMPACT_NODE_MIN_WIDTH, width - COMPACT_CHILD_SIDE_PADDING * 2 - indent * 2);
  const columns = availableWidth >= COMPACT_NODE_MIN_WIDTH * 2 + COMPACT_GRID_GAP ? 2 : 1;
  const nodeWidth = Math.floor((availableWidth - COMPACT_GRID_GAP * (columns - 1)) / columns);
  const left = (width - (nodeWidth * columns + COMPACT_GRID_GAP * (columns - 1))) / 2;
  let cursorY = top;

  for (let index = 0; index < children.length; index += columns) {
    const rowChildren = children.slice(index, index + columns);
    const positionedRow = rowChildren.map((child, rowIndex) => {
      const childNode: PositionedNode = {
        ...child,
        x: left + rowIndex * (nodeWidth + COMPACT_GRID_GAP),
        y: cursorY,
        width: nodeWidth,
        height: COMPACT_NODE_HEIGHT,
        depth,
        visibleChildren: []
      };
      nodes.push(childNode);
      parent.visibleChildren.push(childNode);
      return { source: child, node: childNode };
    });

    cursorY += COMPACT_NODE_HEIGHT + COMPACT_GRID_GAP;

    for (const child of positionedRow) {
      if (isExpanded(child.source, options.expandedIds, options.collapsedIds, options.defaultExpandedDepth)) {
        cursorY = placeCompactChildren(child.source, child.node, cursorY + COMPACT_GRID_GAP, depth + 1, width, options, nodes);
      }
    }
  }

  return cursorY;
}

interface LayoutTree {
  node: GraphNode;
  children: LayoutTree[];
  depth: number;
  width: number;
  height: number;
  subtreeHeight: number;
  y: number;
}

function positionHorizontalHierarchy(
  root: GraphNode,
  width: number,
  height: number,
  sourceNodes: PositionedNode[],
  options: LayoutOptions
): PositionedNode[] {
  const visibleRoot = hierarchy(root, (node) => visibleChildren(node, options));
  const maxDepth = Math.max(1, visibleRoot.height);
  const rightPadding = Math.min(56, Math.max(32, width * 0.025));
  const leafX = width - rightPadding - DEVICE_NODE_WIDTH;
  const xByDepth = new Map<number, number>();

  for (let depth = 1; depth <= maxDepth; depth += 1) {
    xByDepth.set(depth, leafX - (maxDepth - depth) * (DEVICE_NODE_WIDTH + HORIZONTAL_COLUMN_GAP));
  }

  const firstColumnX = xByDepth.get(1) ?? leafX;
  const sourceRight = sourceNodes.reduce((max, source) => Math.max(max, source.x + source.width), 0);
  const symmetricalRootX = (sourceRight + firstColumnX - ROOT_NODE_WIDTH) / 2;
  const minimumRootX = sourceRight + HORIZONTAL_COLUMN_GAP;
  const maximumRootX = firstColumnX - ROOT_NODE_WIDTH - HORIZONTAL_COLUMN_GAP;
  const rootX = clamp(symmetricalRootX, minimumRootX, maximumRootX);
  const tree = measureHorizontalTree(root, 0, options);
  const top = Math.max(28, (height - tree.subtreeHeight) / 2);
  const positioned: PositionedNode[] = [];

  placeHorizontalTree(tree, top, rootX, xByDepth, positioned);
  return positioned;
}

function measureHorizontalTree(node: GraphNode, depth: number, options: LayoutOptions): LayoutTree {
  const children = visibleChildren(node, options).map((child) => measureHorizontalTree(child, depth + 1, options));
  const width = depth === 0 ? ROOT_NODE_WIDTH : DEVICE_NODE_WIDTH;
  const height = depth === 0 ? ROOT_NODE_HEIGHT : DEVICE_NODE_HEIGHT;
  const gap = depth === 0 ? HORIZONTAL_GROUP_GAP : HORIZONTAL_SIBLING_GAP;
  const childrenHeight =
    children.length > 0
      ? children.reduce((sum, child) => sum + child.subtreeHeight, 0) + Math.max(0, children.length - 1) * gap
      : 0;

  return {
    node,
    children,
    depth,
    width,
    height,
    subtreeHeight: Math.max(height, childrenHeight),
    y: 0
  };
}

function placeHorizontalTree(
  tree: LayoutTree,
  top: number,
  rootX: number,
  xByDepth: Map<number, number>,
  positioned: PositionedNode[]
): PositionedNode {
  const x = tree.depth === 0 ? rootX : xByDepth.get(tree.depth) ?? rootX + tree.depth * (DEVICE_NODE_WIDTH + HORIZONTAL_COLUMN_GAP);
  const node: PositionedNode = {
    ...tree.node,
    x,
    y: 0,
    width: tree.width,
    height: tree.height,
    depth: tree.depth,
    visibleChildren: []
  };
  positioned.push(node);

  if (tree.children.length > 0) {
    const gap = tree.depth === 0 ? HORIZONTAL_GROUP_GAP : HORIZONTAL_SIBLING_GAP;
    const childrenHeight =
      tree.children.reduce((sum, child) => sum + child.subtreeHeight, 0) + Math.max(0, tree.children.length - 1) * gap;
    let childTop = top + (tree.subtreeHeight - childrenHeight) / 2;

    for (const child of tree.children) {
      const childNode = placeHorizontalTree(child, childTop, rootX, xByDepth, positioned);
      node.visibleChildren.push(childNode);
      childTop += child.subtreeHeight + gap;
    }
  }

  const centerY =
    node.visibleChildren.length > 0
      ? (nodeCenter(node.visibleChildren[0]).y + nodeCenter(node.visibleChildren[node.visibleChildren.length - 1]).y) / 2
      : top + tree.subtreeHeight / 2;
  node.y = centerY - tree.height / 2;

  return node;
}

function visibleChildren(node: GraphNode, options: LayoutOptions): GraphNode[] {
  if (!isExpanded(node, options.expandedIds, options.collapsedIds, options.defaultExpandedDepth)) {
    return [];
  }

  if (!options.hideZeroNodes) {
    return node.children;
  }

  return node.children.filter((child) => child.value > 0.001 || child.children.length > 0);
}

function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    return (min + max) / 2;
  }

  return Math.min(max, Math.max(min, value));
}

function buildEdges(
  sourceNodes: PositionedNode[],
  positionedTree: PositionedNode[],
  primary: PositionedNode | undefined,
  orientation: NexusOrientation
): PositionedEdge[] {
  const edges: PositionedEdge[] = [];
  if (primary) {
    const sortedSources = sortForSlots(sourceNodes, orientation);
    for (const [index, source] of sortedSources.entries()) {
      edges.push({
        id: `${source.id}->${primary.id}`,
        from: source,
        to: primary,
        fromSlot: 0,
        fromSlotCount: 1,
        toSlot: index,
        toSlotCount: sortedSources.length,
        value: source.value,
        percent: source.percentOfParent,
        severity: source.severity,
        direction: source.direction
      });
    }
  }

  for (const node of positionedTree) {
    const sortedChildren = sortForSlots(node.visibleChildren, orientation);
    for (const [index, child] of sortedChildren.entries()) {
      edges.push({
        id: `${node.id}->${child.id}`,
        from: node,
        to: child,
        fromSlot: index,
        fromSlotCount: node.visibleChildren.length,
        toSlot: 0,
        toSlotCount: 1,
        value: child.value,
        percent: child.percentOfParent,
        severity: child.severity,
        direction: child.direction
      });
    }
  }

  return edges;
}

function sortForSlots(nodes: PositionedNode[], orientation: NexusOrientation): PositionedNode[] {
  return [...nodes].sort((a, b) => {
    const centerA = nodeCenter(a);
    const centerB = nodeCenter(b);
    if (orientation === "horizontal") {
      return centerA.y - centerB.y || centerA.x - centerB.x;
    }

    return centerA.x - centerB.x || centerA.y - centerB.y;
  });
}

function anchor(
  node: PositionedNode,
  orientation: NexusOrientation,
  side: "in" | "out",
  slot = 0,
  slotCount = 1
): { x: number; y: number } {
  const ratio = slotCount <= 1 ? 0.5 : (slot + 1) / (slotCount + 1);

  if (orientation === "horizontal") {
    return {
      x: side === "out" ? node.x + node.width : node.x,
      y: node.y + node.height * ratio
    };
  }

  return {
    x: node.x + node.width * ratio,
    y: side === "out" ? node.y + node.height : node.y
  };
}
