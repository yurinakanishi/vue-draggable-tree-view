<template>
  <div class="flex">
    <div style="min-width: 500px">
      <TreeNodes
        :nodes="nodes"
        :hoveredNode="hoveredNode"
        :draggingNode="draggingNode"
        @move:node:before="insertBefore"
        @move:node:after="insertAfter"
        @move:node:appendChild="appendChild"
        @update:hoveredNode="handleHoveredNodeUpdate"
        @update:draggingNode="handleDraggingNodeUpdate"
      />
    </div>
    <pre>{{ JSON.stringify(nodes, null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import TreeNodes from './TreeNodes.vue'
import type { Node, NodeType } from './types'

const nodes = reactive<Node[]>([
  {
    id: '4',
    name: 'Customer_Melon4',
    nodeType: 'customer',
    isLeaf: false,
    ind: 0,
    children: [
      {
        id: '8',
        name: 'Location_Banana1',
        nodeType: 'location',
        isLeaf: false,
        ind: 0,
        children: [
          {
            id: '12',
            name: 'AssetGroup_Grapes3',
            nodeType: 'assetGroup',
            isLeaf: false,
            ind: 0,
            children: []
          },
          {
            id: '13',
            name: 'AssetGroup_Grapes4',
            nodeType: 'assetGroup',
            isLeaf: false,
            ind: 1,
            children: []
          }
        ]
      }
    ]
  },
  {
    id: '1',
    name: 'Customer_Melon0',
    nodeType: 'customer',
    isLeaf: false,
    ind: 0,
    children: [
      {
        id: '2',
        name: 'Location_Orange0',
        nodeType: 'location',
        isLeaf: false,
        ind: 0,
        children: [
          {
            id: '47',
            name: 'Asset_Apple2',
            nodeType: 'asset',
            isLeaf: true,
            ind: 1,
            children: []
          },
          {
            id: '5',
            name: 'AssetGroup_Apple1',
            nodeType: 'assetGroup',
            isLeaf: false,
            ind: 0,
            children: []
          }
        ]
      },
      {
        id: '232',
        name: 'Location_Orange2',
        nodeType: 'location',
        isLeaf: false,
        ind: 2,
        children: [
          {
            id: '444',
            name: 'Asset1',
            nodeType: 'asset',
            isLeaf: true,
            ind: 1,
            children: []
          },
          {
            id: '51',
            name: 'AssetGroup35',
            nodeType: 'assetGroup',
            isLeaf: false,
            ind: 0,
            children: []
          }
        ]
      },
      {
        id: '3',
        name: 'Asset_Orange1',
        nodeType: 'asset',
        isLeaf: true,
        ind: 1,
        children: []
      }
    ]
  },
  {
    id: '6',
    name: 'Customer_Melon1',
    nodeType: 'customer',
    isLeaf: false,
    ind: 1,
    children: [
      {
        id: '7',
        name: 'Location_Banana0',
        nodeType: 'location',
        isLeaf: false,
        ind: 0,
        children: [
          {
            id: '10',
            name: 'AssetGroup_Grapes1',
            nodeType: 'assetGroup',
            isLeaf: false,
            ind: 1,
            children: []
          },
          {
            id: '11',
            name: 'AssetGroup_Grapes2',
            nodeType: 'assetGroup',
            isLeaf: false,
            ind: 2,
            children: [
              {
                id: '91530',
                name: 'Asset_Kiwi0',
                nodeType: 'asset',
                isLeaf: true,
                ind: 0,
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
])

const hoveredNode = ref<Node | null>(null)
const draggingNode = ref<Node | null>(null)

// Update draggingNode value
const handleDraggingNodeUpdate = (id: string | null) => {
  if (!id) {
    draggingNode.value = null
    return
  }
  draggingNode.value = findNodeFromId(nodes, id)
}

const handleHoveredNodeUpdate = (id: string | null) => {
  if (!id) {
    hoveredNode.value = null
    return
  }

  hoveredNode.value = findNodeFromId(nodes, id) || null
}

//Find node's ancestor ID
const findAncestorInfo = (
  nodes: Node[],
  nodeId: string,
  parent: { id: string; nodeType: NodeType } | null = null
): { id: string; nodeType: NodeType } | null => {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return parent
    }
    if (node.children && node.children.length > 0) {
      const result = findAncestorInfo(node.children, nodeId, {
        id: node.id,
        nodeType: node.nodeType
      })
      if (result) return result
    }
  }
  return null
}

// Search ancestor node and return children array
const findAncestorNodesChildrenArray = (nodes: Node[], nodeId: string): Node[] | null => {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return nodes
    }
    if (node.children && node.children.length > 0) {
      const result = findAncestorNodesChildrenArray(node.children, nodeId)
      if (result) return result
    }
  }
  return null
}

// Search target node index
const findTargetNodeIndex = (nodes: Node[], targetNodeId: string): number => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === targetNodeId) {
      return i
    }
  }
  return -1
}

// Function to recursively find a node by ID
const findNodeFromId = (nodes: Node[], nodeId: string): Node | null => {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node
    }
    if (node.children) {
      const foundNode = findNodeFromId(node.children, nodeId)
      if (foundNode) {
        return foundNode
      }
    }
  }
  return null
}

// Find and remove node from the tree
function findAndRemoveNode(nodes: Node[], nodeId: string): Node | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) {
      return nodes.splice(i, 1)[0]
    }
    if (nodes[i].children && nodes[i].children.length > 0) {
      const node = findAndRemoveNode(nodes[i].children, nodeId)
      if (node) return node
    }
  }
  return null
}

// Insert dragged node relative to the target node
const insertNodeRelativeTo = async (
  draggedNodeId: string,
  targetNodeId: string,
  position: 'before' | 'after'
) => {
  try {
    const draggedNode = findAndRemoveNode(nodes, draggedNodeId)
    if (!draggedNode) {
      console.error('Dragged node not found')
      return
    }
    const parentNodesChildrenArray = findAncestorNodesChildrenArray(nodes, targetNodeId)
    if (!parentNodesChildrenArray) {
      console.error('No parent node found for the target ID')
      return
    }
    const targetNodeIndex = findTargetNodeIndex(parentNodesChildrenArray, targetNodeId)
    const insertIndex = position === 'before' ? targetNodeIndex : targetNodeIndex + 1
    parentNodesChildrenArray.splice(insertIndex, 0, draggedNode)
    const targetNode = findNodeFromId(nodes, targetNodeId)
    const ancestorInfo =
      targetNode?.nodeType === 'customer' ? null : findAncestorInfo(nodes, targetNodeId)
    await sendNodeData({
      id: draggedNode.id,
      nodeType: draggedNode.nodeType,
      ancestorId: ancestorInfo?.id ?? null,
      ancestorNodeType: ancestorInfo?.nodeType ?? null,
      index: insertIndex
    })
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

// Insert dragged node before the target node
const insertBefore = (draggedNodeId: string, targetNodeId: string) => {
  insertNodeRelativeTo(draggedNodeId, targetNodeId, 'before')
}

// Insert dragged node after the target node
const insertAfter = (draggedNodeId: string, targetNodeId: string) => {
  insertNodeRelativeTo(draggedNodeId, targetNodeId, 'after')
}

// Append the dragged node as a child of the target node
const appendChild = async (draggedNodeId: string, targetNodeId: string) => {
  try {
    const draggedNode = findAndRemoveNode(nodes, draggedNodeId)
    if (!draggedNode) {
      console.error('Dragged node not found')
      return
    }
    const targetNode = findNodeFromId(nodes, targetNodeId)
    if (!targetNode) {
      console.error('Target node not found')
      return
    }
    targetNode.children = targetNode.children || []
    targetNode.children.push(draggedNode)

    await sendNodeData({
      id: draggedNode.id,
      nodeType: draggedNode.nodeType,
      ancestorId: targetNodeId,
      ancestorNodeType: targetNode.nodeType,
      index: targetNode.children.length - 1
    })
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

// Call API to send node data
const sendNodeData = ({
  id,
  nodeType,
  ancestorId,
  ancestorNodeType,
  index
}: {
  id: string
  nodeType: NodeType
  ancestorId: string | null
  ancestorNodeType: NodeType | null
  index: number
}) => {
  console.log({
    id: id,
    nodeType: nodeType,
    ancestorId: ancestorId,
    ancestorNodeType: ancestorNodeType,
    index: index
  })
}
</script>
