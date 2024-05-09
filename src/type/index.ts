export type NodeType = "customer" | "location" | "assetGroup" | "asset" 

export type Node = {
  name: string;
  isLeaf: boolean;
  nodeType: NodeType;
  children: Node[];
  order: number;
};
  