<template>
  <div class="flex">
    <div style="min-width: 500px">
      <TreeNodes :nodes="nodes" @update:node="updateNode" @move:node="insertBefore" />
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

const insertBefore = (newNode: Node, referenceNode?: Node) => {
  console.log('insertBefore:', newNode, referenceNode)
}
</script>
