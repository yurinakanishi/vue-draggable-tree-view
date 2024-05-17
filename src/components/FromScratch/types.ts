// Define the structure for the custom data that might be attached to a node
export interface CustomData {
  visible?: boolean
}

// Define the structure of each tree node
export type NodeModelType = {
  id: string
  name: string
  nodeType: string
  isLeaf: boolean
  ind: number
  children: NodeModelType[]
}

// Define the function type for updating a node
export type UpdateFunction = (index: number, updatedNode: TreeNode) => void

// Define the function type for handling drop operations in the tree view
export type DropFunction = (droppedNode: TreeNode, targetNode: TreeNode) => void
