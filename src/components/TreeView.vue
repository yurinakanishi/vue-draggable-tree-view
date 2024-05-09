<template>
  <div id="app">
    <SlVueTree :value="treeData" :allow-multiselect="true" :show-branches="true" />
  </div>
</template>

<script lang="ts" setup>
import SlVueTree from './SlVueTree.vue'
import { ref } from 'vue'
import type { Node } from '../types'
const treeData = ref<Node>([
  {
    id: "1",
    name: 'Customer1',
    nodeType: 'customer',
    isLeaf: false,
    order: 1,
    children: [
      {
        id: "2",
        name: 'Location1',
        nodeType: 'location',
        isLeaf: false,
        order: 1,
        children: [
          {
            id: "4",
            name: 'Asset1',
            nodeType: 'asset',
            isLeaf: true,
            order: 2,
            children: []
          },
          {
            id: "5",
            name: 'AssetGroup1',
            nodeType: 'assetGroup',
            isLeaf: false,
            order: 1,
            children: []
          }
        ]
      },
      {
        id: "232",
        name: 'Location2',
        nodeType: 'location',
        isLeaf: false,
        order: 1,
        children: [
          {
            id: "444",
            name: 'Asset1',
            nodeType: 'asset',
            isLeaf: true,
            order: 1,
            children: []
          },
          {
            id: "51",
            name: 'AssetGroup35',
            nodeType: 'assetGroup',
            isLeaf: false,
            order: 0,
            children: []
          }
        ]
      },
      {
        id: "3",
        name: 'Asset100',
        nodeType: 'asset',
        isLeaf: true,
        order: 1,
        children: []
      }
    ]
  },
  {
    id: "6",
    name: 'Customer2',
    nodeType: 'customer',
    isLeaf: false,
    order: 2,
    children: [
      {
        id: "7",
        name: 'Location98',
        nodeType: 'location',
        isLeaf: false,
        order: 1,
        children: [
          {
            id: "8",
            name: 'Location391',
            nodeType: 'location',
            isLeaf: false,
            order: 1,
            children: []
          },
          {
            id: "9",
            name: 'LocationPPP',
            nodeType: 'location',
            isLeaf: false,
            order: 1,
            children: []
          },
          {
            id: "10",
            name: 'AssetGroupYYY',
            nodeType: 'assetGroup',
            isLeaf: false,
            order: 1,
            children: []
          },
          {
            id: "11",
            name: 'AssetGroupZZZ',
            nodeType: 'assetGroup',
            isLeaf: false,
            order: 1,
            children: [
              {
                id: "91530",
                name: 'Asset@@@@',
                nodeType: 'asset',
                isLeaf: true,
                order: 1,
                children: []
              }
            ]
          },
          {
            id: "93432",
            name: 'Location000',
            nodeType: 'location',
            isLeaf: false,
            order: 1,
            children: []
          },
          {
            id: "10890",
            name: 'Location111',
            nodeType: 'location',
            isLeaf: false,
            order: 1,
            children: []
          },
          {
            id: "1891",
            name: 'Location222',
            nodeType: 'location',
            isLeaf: false,
            order: 1,
            children: []
          }
        ]
      }
    ]
  }
]
)
</script>