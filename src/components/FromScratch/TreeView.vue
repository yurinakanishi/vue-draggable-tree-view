<template>
  <div class="flex">
    <div style="min-width: 500px">
      <TreeNodes
        :nodes="nodes"
        @update:node="updateNode"
        @move:node:before="insertBefore"
        @move:node:after="insertAfter"
      />
    </div>
    <pre>{{ JSON.stringify(nodes, null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
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
            id: '4',
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

const updateNode = (updatedNode: Node) => {
  console.log('updateNode:', updatedNode)
}

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
  } else {
    console.error('No parent node found for the target ID')
  }
}

// ドラッグされたノードをドロップ先のノードの前に挿入する
const insertBefore = (draggedNodeId: string, targetNodeId: string) => {
  insertNodeRelativeTo(draggedNodeId, targetNodeId, 'before')
}

// ドラッグされたノードをドロップ先のノードの後に挿入する
const insertAfter = (draggedNodeId: string, targetNodeId: string) => {
  insertNodeRelativeTo(draggedNodeId, targetNodeId, 'after')
}
</script>
