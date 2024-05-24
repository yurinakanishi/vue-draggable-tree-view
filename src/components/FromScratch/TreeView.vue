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

const defaultNodes = reactive<Node[]>([
  {
    id: '4',
    name: 'Customer_Melon4',
    nodeType: 'customer',
    customerId: null,
    isLeaf: false,
    index: 3,
    children: [
      {
        id: '8',
        name: 'Location_Banana1',
        nodeType: 'location',
        customerId: '4',
        isLeaf: false,
        index: 0,
        children: [
          {
            id: '12',
            name: 'AssetGroup_Grapes3',
            nodeType: 'assetGroup',
            customerId: '4',
            isLeaf: false,
            index: 0,
            children: []
          },
          {
            id: '13',
            name: 'AssetGroup_Grapes4',
            nodeType: 'assetGroup',
            customerId: '4',
            isLeaf: false,
            index: 1,
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
    customerId: null,
    isLeaf: false,
    index: 0,
    children: [
      {
        id: '2',
        name: 'Location_Orange0',
        nodeType: 'location',
        customerId: '1',
        isLeaf: false,
        index: 0,
        children: [
          {
            id: '47',
            name: 'Asset_Apple2',
            nodeType: 'asset',
            customerId: '1',
            isLeaf: true,
            index: 1,
            children: []
          },
          {
            id: '5',
            name: 'AssetGroup_Apple1',
            nodeType: 'assetGroup',
            customerId: '1',
            isLeaf: false,
            index: 0,
            children: []
          }
        ]
      },
      {
        id: '232',
        name: 'Location_Orange2',
        nodeType: 'location',
        customerId: '1',
        isLeaf: false,
        index: 2,
        children: [
          {
            id: '444',
            name: 'Asset1',
            nodeType: 'asset',
            customerId: '1',
            isLeaf: true,
            index: 1,
            children: []
          },
          {
            id: '51',
            name: 'AssetGroup35',
            nodeType: 'assetGroup',
            customerId: '1',
            isLeaf: false,
            index: 0,
            children: []
          }
        ]
      },
      {
        id: '3',
        name: 'Asset_Orange1',
        nodeType: 'asset',
        customerId: '1',
        isLeaf: true,
        index: 1,
        children: []
      }
    ]
  },
  {
    id: '6',
    name: 'Customer_Melon1',
    nodeType: 'customer',
    customerId: null,
    isLeaf: false,
    index: 1,
    children: [
      {
        id: '7',
        name: 'Location_Banana0',
        nodeType: 'location',
        customerId: '6',
        isLeaf: false,
        index: 0,
        children: [
          {
            id: '10',
            name: 'AssetGroup_Grapes1',
            nodeType: 'assetGroup',
            customerId: '6',
            isLeaf: false,
            index: 1,
            children: []
          },
          {
            id: '11',
            name: 'AssetGroup_Grapes2',
            nodeType: 'assetGroup',
            customerId: '6',
            isLeaf: false,
            index: 2,
            children: [
              {
                id: '91530',
                name: 'Asset_Kiwi0',
                nodeType: 'asset',
                customerId: '6',
                isLeaf: true,
                index: 0,
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
])

// change order of nodes to be displayed
const changeOrder = (nodes: Node[]) => {
  nodes.sort((a, b) => a.index - b.index)
  nodes.forEach((node) => {
    if (node.children && node.children.length > 0) {
      changeOrder(node.children)
    }
  })
  return nodes
}

const nodes = reactive(changeOrder(defaultNodes))

const hoveredNode = ref<Node | null>(null)
const draggingNode = ref<Node | null>(null)

// Update draggingNode value
const handleDraggingNodeUpdate = (node: Node | null) => {
  if (!node) {
    draggingNode.value = null
    return
  }
  draggingNode.value = node
}

const handleHoveredNodeUpdate = (node: Node | null) => {
  if (!node) {
    hoveredNode.value = null
    return
  }

  hoveredNode.value = node
}

//Find node's ancestor ID
const findAncestorInfo = (
  nodes: Node[],
  targetNode: Node,
  parent: { id: string; nodeType: NodeType } | null = null
): { id: string; nodeType: NodeType } | null => {
  for (const node of nodes) {
    if (node.id === targetNode.id) {
      return parent
    }
    if (node.children && node.children.length > 0) {
      const result = findAncestorInfo(node.children, targetNode, {
        id: node.id,
        nodeType: node.nodeType
      })
      if (result) return result
    }
  }
  return null
}

// Search ancestor node and return children array
const findAncestorNodesChildrenArray = (nodes: Node[], targetNode: Node): Node[] | null => {
  for (const node of nodes) {
    if (node.id === targetNode.id) {
      return nodes
    }
    if (node.children && node.children.length > 0) {
      const result = findAncestorNodesChildrenArray(node.children, targetNode)
      if (result) return result
    }
  }
  return null
}

// Search target node index
const findTargetNodeIndex = (nodes: Node[], targetNode: Node): number => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === targetNode.id) {
      return i
    }
  }
  return -1
}

// Find and remove node from the tree
function removeNode(nodes: Node[], targetNode: Node): Node | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === targetNode.id) {
      return nodes.splice(i, 1)[0] // Remove the node and return it
    }
    if (nodes[i].children && nodes[i].children.length > 0) {
      const removedNode = removeNode(nodes[i].children, targetNode)
      if (removedNode) return removedNode
    }
  }
  return null
}

// Insert dragged node relative to the target node
const insertNodeRelativeTo = async (
  draggedNode: Node,
  targetNode: Node,
  position: 'before' | 'after'
) => {
  if (
    draggedNode.customerId !== targetNode.customerId ||
    draggedNode.id === targetNode.id ||
    (draggedNode.nodeType === 'customer' && targetNode.nodeType === 'location') ||
    (draggedNode.nodeType === 'customer' && targetNode.nodeType === 'assetGroup') ||
    (draggedNode.nodeType === 'customer' && targetNode.nodeType === 'asset') ||
    (draggedNode.nodeType === 'asset' && targetNode.nodeType === 'customer') ||
    (draggedNode.nodeType === 'assetGroup' && targetNode.nodeType === 'customer') ||
    (draggedNode.nodeType === 'location' && targetNode.nodeType === 'customer')
  ) {
    console.error('Invalid operation')
    return
  }

  try {
    removeNode(nodes, draggedNode)
    if (!draggedNode) {
      console.error('Dragged node not found')
      return
    }
    const parentNodesChildrenArray = findAncestorNodesChildrenArray(nodes, targetNode)
    if (!parentNodesChildrenArray) {
      console.error('No parent node found for the target ID')
      return
    }
    const targetNodeIndex = findTargetNodeIndex(parentNodesChildrenArray, targetNode)
    const insertIndex = position === 'before' ? targetNodeIndex : targetNodeIndex + 1
    parentNodesChildrenArray.splice(insertIndex, 0, draggedNode)
    const ancestorInfo =
      targetNode?.nodeType === 'customer' ? null : findAncestorInfo(nodes, targetNode)
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
const insertBefore = (draggedNode: Node, targetNode: Node) => {
  insertNodeRelativeTo(draggedNode, targetNode, 'before')
}

// Insert dragged node after the target node
const insertAfter = (draggedNode: Node, targetNode: Node) => {
  insertNodeRelativeTo(draggedNode, targetNode, 'after')
}

// Append the dragged node as a child of the target node
const appendChild = async (draggedNode: Node, targetNode: Node) => {
  if (
    draggedNode.customerId !== targetNode.customerId ||
    draggedNode.id === targetNode.id ||
    (draggedNode.nodeType === 'customer' && targetNode.nodeType === 'customer') ||
    (draggedNode.nodeType === 'customer' && targetNode.nodeType === 'location') ||
    (draggedNode.nodeType === 'customer' && targetNode.nodeType === 'assetGroup') ||
    (draggedNode.nodeType === 'customer' && targetNode.nodeType === 'asset') ||
    (draggedNode.nodeType === 'location' && targetNode.nodeType === 'assetGroup')
  ) {
    console.error('Invalid operation')
    return
  }
  try {
    removeNode(nodes, draggedNode)
    if (!draggedNode) {
      console.error('Dragged node not found')
      return
    }
    if (!targetNode) {
      console.error('Target node not found')
      return
    }
    targetNode.children = targetNode.children || []
    targetNode.children.push(draggedNode)

    await sendNodeData({
      id: draggedNode.id,
      nodeType: draggedNode.nodeType,
      ancestorId: targetNode.id,
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
