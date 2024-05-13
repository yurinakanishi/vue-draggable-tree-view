import Vue from 'vue';

export type NodeTypeType = "customer" | "location" | "assetGroup" | "asset" 

export type NodeModelType = {
  name: string;
  isLeaf?: boolean;
  children?: NodeType[];
  nodeType: NodeTypeType;
  isSelected?: boolean;
  isDraggable?: boolean;
  isExpanded?: boolean;
  isSelectable: boolean;
};

export type NodeType =  NodeModelType & {
  ind: number;
  isFirstChild: boolean;
  isLastChild: boolean;
  level: number;
  path: number[];
  pathStr: string;
  children: NodeType[];
};

export type CursorPosition = {
  node: NodeType;
  placement: 'before' | 'inside' | 'after';
}

export type InsertMode = 'nestInsert' | 'cutInInsert'

export type VueData = {
  rootCursorPosition: CursorPosition;
  rootDraggingNode: NodeType;
}

export default class VueTree extends Vue {
  value: NodeType[];
  edgeSize: number;
  level: number;
  parentInd: number;
  private rootCursorPosition;
  private rootDraggingNode;
  cursorPosition: CursorPosition;
  draggingNode: NodeType;
  readonly nodes: NodeType[];
  getNode(path: number[]): NodeType;
  getFirstNode(): NodeType;
  getLastNode(): NodeType;
  getNextNode(path: number[], filter?: (node: NodeType) => boolean): NodeType;
  getPrevNode(path: number[], filter?: (node: NodeType) => boolean): NodeType;
  updateNode(path: number[], patch: Partial<NodeType>): void;
  getSelected(): NodeType[];
  traverse(cb: (node: NodeType, nodeModel: NodeModelType, siblings: NodeType[]) => boolean | void, nodeModels?: NodeType[], parentPath?: number[]): NodeType[] | boolean;
  getNodeEl(path: number[]): HTMLElement;
  select(path: number[], addToSelection?: boolean): NodeType;
  remove(paths: number[][]): void;
  insert(cursorPosition: CursorPosition, nodeModel:NodeType): void;
}


export type TraverseCallback = (
  node: NodeType, 
  nodeModel: NodeModelType, 
  nodeModels: NodeModelType[]
) => boolean | void;

export type TraverseNodeModelCallback = (
  nodeModel: NodeModelType, 
  nodeModels: NodeModelType[], 
  index: number
) => void;