export type Node = {
  id: string
  name: string
  nodeType: string
  isLeaf: boolean
  ind: number
  children: Node[]
  isExpanded?: boolean
  isDragging?: boolean
}
