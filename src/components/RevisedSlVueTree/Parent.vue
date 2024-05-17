<template>
  <div id="app">
    <div class="flex">
      <Child v-for="(node, index) in nodes" :node="node" :key="index" />
      <div class="json-preview">
        <pre>{{ nodesJson }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Child from './Child.vue'
import { ref, onMounted, computed } from 'vue'
import type { NodeModelType } from './type'

onMounted(() => {
  console.log(nodes.value) // Log the actual data
})

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

function sortTree(nodes: NodeModelType[]) {
  // Sort the current level of nodes based on the 'ind' property
  nodes.sort((a, b) => a.ind - b.ind)

  // Recursively sort each set of children, if present
  nodes.forEach((node) => {
    if (node.children && node.children.length) {
      sortTree(node.children)
    }
  })
}

// Initially sort the entire tree
sortTree(nodes.value)

const nodesJson = computed(() => JSON.stringify(nodes.value, null, 2))
</script>
<style scoped>
.json-preview {
  flex-grow: 1;
  margin-left: 10px;
  border: 1px solid black;
  padding: 10px;
}
</style>
