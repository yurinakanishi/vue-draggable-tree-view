<template>
  <h2>FromScratch</h2>
  <div class="flex">
    <div style="margin-right: 300px">
      <Child
        v-for="(node, index) in nodes"
        :key="index"
        :node="node"
        @update:node="updateNode(index, $event)"
        @drop="onDrop"
      />
    </div>
    <pre>{{ JSON.stringify(nodes, null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Child from './Child.vue'
import type { TreeNode, UpdateFunction, DropFunction } from './types'

const nodes = ref<NodeModelType[]>([
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
            id: '9',
            name: 'Location_Grapes0',
            nodeType: 'location',
            isLeaf: false,
            ind: 0,
            children: []
          },
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

const updateNode: UpdateFunction = (index, updatedNode) => {
  nodes.value[index] = updatedNode
}

const onDrop: DropFunction = (droppedNode, targetNode) => {
  if (!targetNode.children) {
    targetNode.children = []
  }
  targetNode.children.push(droppedNode)

  const removeNode = (nodesArray: TreeNode[], nodeToRemove: TreeNode) => {
    for (let i = 0; i < nodesArray.length; i++) {
      if (nodesArray[i] === nodeToRemove) {
        nodesArray.splice(i, 1)
        break
      }
      if (nodesArray[i].children && nodesArray[i].children.length) {
        removeNode(nodesArray[i].children, nodeToRemove)
      }
    }
    return nodesArray
  }

  nodes.value = removeNode([...nodes.value], droppedNode)
}
</script>
