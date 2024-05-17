import Vue from 'vue'

export type NodeTypeType = 'customer' | 'location' | 'assetGroup' | 'asset'

export type NodeModelType = {
  id: string
  ind: number
  name: string
  isLeaf?: boolean
  children?: NodeModelType[]
  nodeType: NodeTypeType
  isSelected?: boolean
  isDraggable?: boolean
  isExpanded?: boolean
  isSelectable?: boolean
}

export type NodeType = NodeModelType & {
  isFirstChild: boolean
  isLastChild: boolean
  level: number
  path: number[]
  pathStr: string
  children: NodeType[]
}

export type CursorPosition = {
  node: NodeType
  placement: 'before' | 'inside' | 'after'
}

export type InsertMode = 'nestInsert' | 'cutInInsert'

export type VueData = {
  rootCursorPosition: CursorPosition
  rootDraggingNode: NodeType
}

export type TraverseCallback = (
  node: NodeType,
  nodeModel: NodeModelType,
  nodeModels: NodeModelType[]
) => boolean | void

export type TraverseNodeModelCallback = (
  nodeModel: NodeModelType,
  nodeModels: NodeModelType[],
  index: number
) => void
