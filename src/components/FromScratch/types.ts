export type Node = {
  id: string
  name: string
  nodeType: NodeType
  isLeaf: boolean
  ind: number
  children: Node[]
  isExpanded?: boolean
  isDragging?: boolean
}

export type NodeType = 'customer' | 'location' | 'assetGroup' | 'asset'
