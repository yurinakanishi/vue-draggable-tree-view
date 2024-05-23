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
import type { Node } from './types'

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

// 親のノードを探してその子ノードの配列を返す
const findParentNodesChildrenArray = (nodes: Node[], nodeId: string): Node[] | null => {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return nodes
    }
    if (node.children && node.children.length > 0) {
      const result = findParentNodesChildrenArray(node.children, nodeId)
      if (result) return result
    }
  }
  return null
}

// ドロップ先のノードのインデックスを取得する
const getTargetNodeIndex = (nodes: Node[], targetNodeId: string): number => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === targetNodeId) {
      return i
    }
  }
  return -1
}

// ノードを探して削除する
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

// ドラッグされたノードをドロップ先のノードの前か後ろに挿入する
const insertNodeRelativeTo = (
  draggedNodeId: string,
  targetNodeId: string,
  position: 'before' | 'after'
) => {
  const draggedNode = findAndRemoveNode(nodes, draggedNodeId)
  if (!draggedNode) {
    console.error('Dragged node not found')
    return
  }

  const parentNodesChildrenArray = findParentNodesChildrenArray(nodes, targetNodeId)
  const targetNodeIndex = getTargetNodeIndex(parentNodesChildrenArray || [], targetNodeId)
  if (parentNodesChildrenArray) {
    console.log('parentNodesChildrenArray:', parentNodesChildrenArray)
    const insertIndex = position === 'before' ? targetNodeIndex : targetNodeIndex + 1
    parentNodesChildrenArray.splice(insertIndex, 0, draggedNode)
    console.log('parentNodesChildrenArrayAfter:', parentNodesChildrenArray)
  } else {
    console.error('No parent node found for the target ID')
  }
}

const handleHoveredNodeUpdate = (id: string | null) => {
  console.log('Hovered Node ID:', id)
  hoveredNode.value = id ? nodes.find((node) => node.id === id) || null : null
}

const handleDraggingNodeUpdate = (id: string | null) => {
  console.log('Dragging Node ID:', id)
  draggingNode.value = id ? nodes.find((node) => node.id === id) || null : null
}

// ドラッグされたノードをドロップ先のノードの前に挿入する
const insertBefore = (draggedNodeId: string, targetNodeId: string) => {
  insertNodeRelativeTo(draggedNodeId, targetNodeId, 'before')
}

// ドラッグされたノードをドロップ先のノードの後に挿入する
const insertAfter = (draggedNodeId: string, targetNodeId: string) => {
  insertNodeRelativeTo(draggedNodeId, targetNodeId, 'after')
}

const appendChild = (draggedNodeId: string, targetNodeId: string) => {
  // Find and remove the dragged node from its current location
  const draggedNode = findAndRemoveNode(nodes, draggedNodeId)
  if (!draggedNode) {
    console.error('Dragged node not found')
    return
  }

  // Function to recursively find a node by ID
  const findNode = (nodes: Node[], nodeId: string): Node | null => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node
      }
      if (node.children) {
        const foundNode = findNode(node.children, nodeId)
        if (foundNode) {
          return foundNode
        }
      }
    }
    return null
  }

  // Find the target node where the dragged node will be inserted
  const targetNode = findNode(nodes, targetNodeId)
  if (!targetNode) {
    console.error('Target node not found')
    return
  }

  // Initialize the children array if it does not exist
  targetNode.children = targetNode.children || []
  // Insert the dragged node as a child of the target node
  targetNode.children.push(draggedNode)
  console.log('Node inserted inside:', targetNode)
}
</script>
