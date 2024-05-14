<template>
  <div id="app">
    <div class="flex">
      <SlVueTree :value="treeData">
        <!-- <template v-slot:title="{ node }">
          <span class="item-icon">
            <i class="fa fa-file" v-if="node.isLeaf"></i>
            <i class="fa fa-folder" v-if="!node.isLeaf"></i>
          </span>

          {{ node.title }}
        </template>

        <template v-slot:toggle="{ node }">
          <span v-if="!node.isLeaf">
            <i v-if="node.isExpanded" class="fa fa-chevron-down"></i>
            <i v-if="!node.isExpanded" class="fa fa-chevron-right"></i>
          </span>
        </template>

        <template v-slot:draginfo>
          {{ selectedNodesTitle }}
        </template> -->
      </SlVueTree>
      <div class="json-preview">
        <pre>{{ JSON.stringify(treeData, null, 4) }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SlVueTree from './SlVueTree.vue'
import { ref } from 'vue'
import type { NodeModelType, NodeType, NodeTypeType } from '../type/index'
const treeData = ref<NodeModelType[]>([
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
            id: '8',
            name: 'Location_Grapes0',
            nodeType: 'location',
            isLeaf: false,
            ind: 1,
            children: []
          },
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
          },
          {
            id: '93432',
            name: 'Location_Grapes3',
            nodeType: 'location',
            isLeaf: false,
            ind: 3,
            children: []
          },
          {
            id: '10890',
            name: 'Location_Grapes4',
            nodeType: 'location',
            isLeaf: false,
            ind: 4,
            children: []
          },
          {
            id: '1891',
            name: 'Location_Grapes5',
            nodeType: 'location',
            isLeaf: false,
            ind: 5,
            children: []
          }
        ]
      }
    ]
  }
])

// const lastEvent = ref('No last event')
// const selectedNodesTitle = ref('')

// const nodeSelected = (nodes: NodeType[], event: MouseEvent) => {
//   selectedNodesTitle.value = nodes.map((node) => node.name).join(', ')
//   lastEvent.value = `Selected nodes: ${selectedNodesTitle.value}`
// }

// const nodeToggled = (node: NodeType, event: MouseEvent) => {
//   lastEvent.value = `Node ${node.name} is ${node.isExpanded ? 'expanded' : 'collapsed'}`
// }

// const nodeDropped = (nodes: NodeType[], position: { placement: string; node: NodeType }) => {
//   lastEvent.value = `Nodes: ${nodes.map((node) => node.name).join(', ')} are dropped ${position.placement} ${position.node.name}`
// }

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
sortTree(treeData.value)
</script>
<style scoped>
.json-preview {
  flex-grow: 1;
  margin-left: 10px;
  border: 1px solid black;
  padding: 10px;
}
</style>
