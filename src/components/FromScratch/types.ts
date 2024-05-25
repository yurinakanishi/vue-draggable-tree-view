export type Node = {
  id: string
  name: string
  nodeType: NodeType
  isLeaf: boolean
  customerId: string | null
  index: number
  children: Node[]
  isExpanded?: boolean
  isDragging?: boolean
}

export type NodeType = 'customer' | 'location' | 'assetGroup' | 'asset'

export type DropOption = 'before' | 'after' | 'appendChild'
