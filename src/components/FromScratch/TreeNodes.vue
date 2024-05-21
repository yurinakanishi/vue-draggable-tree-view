<template>
  <div
    class="tree-node"
    draggable="true"
    v-for="(node, i) in nodes"
    :key="node.id"
    @dragover.prevent
    @dragenter.prevent
    @dragstart.stop="onDragStart($event, node.id)"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
  >
    <div style="height: 40px">
      <div class="drop-area" @drop.stop="onDropBefore($event, node.id)"></div>
      <span>{{ node.name }}</span>
      <span name="toggle" :node="node">
        <q-btn
          flat
          dense
          :icon="node.isLeaf ? '' : node.isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right'"
          :class="{ 'q-ml-sm': true, rotated: node.isExpanded }"
          @click="toggleExpand(node)"
        >
        </q-btn>
      </span>
    </div>
    <div v-if="node.children && node.isExpanded">
      <TreeNodes
        :nodes="node.children"
        @update:node="updateNode"
        @move:node:before="insertBefore"
        @move:node:after="insertAfter"
      />
    </div>
    <div
      class="drop-area"
      @drop.stop="onDropAfter($event, node.id)"
      v-if="nodes.length - 1 === i"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive } from 'vue'
import type { PropType } from 'vue'
import type { Node } from './types'
import TreeNodes from './TreeNodes.vue'

const props = defineProps({
  nodes: {
    type: Array as PropType<Node[]>,
    required: true
  }
})

const emits = defineEmits(['update:node', 'move:node:before', 'move:node:after'])

const nodes = reactive(props.nodes)

// ノードの展開状態をトグルする
const toggleExpand = (node: Node) => {
  if (node.children) {
    node.isExpanded = !node.isExpanded
  }
}

// ノードの情報を更新する
const updateNode = (id: string) => {
  console.log('id:', id)
}

//insertBeforeを親にemitする
const insertBefore = (draggedNodeId: string, targetNodeId: string) => {
  emits('move:node:before', draggedNodeId, targetNodeId)
}

//insertAfterを親にemitする
const insertAfter = (draggedNodeId: string, targetNodeId: string) => {
  emits('move:node:after', draggedNodeId, targetNodeId)
}

// どのノードがドラッグされたかをコンソールに表示する
const onDragStart = (event: DragEvent, nodeId: string) => {
  event.dataTransfer?.setData('text/plain', nodeId)
  console.log('Dragged Node ID:', nodeId)
}

// ドラッグされたノードがドロップ先に入った時にコンソールに表示する
const onDropBefore = (event: DragEvent, targetNodeId: string) => {
  const draggedNodeId = event.dataTransfer?.getData('text') || ''
  console.log('Dropped Node ID:', draggedNodeId, 'Target Node ID:', targetNodeId)
  emits('move:node:before', draggedNodeId, targetNodeId)
}

const onDropAfter = (event: DragEvent, targetNodeId: string) => {
  const draggedNodeId = event.dataTransfer?.getData('text') || ''
  console.log('Dropped Node ID:', draggedNodeId, 'Target Node ID:', targetNodeId)
  emits('move:node:after', draggedNodeId, targetNodeId)
}

// ドラッグされたノードがドロップ先に入った時にコンソールに表示する
const onDragEnter = () => {
  console.log('onDragEnter')
}

// ドラッグされたノードがドロップ先から出た時にコンソールに表示する
const onDragLeave = () => {
  console.log('onDragLeave')
}
</script>

<style scoped>
.tree-node {
  margin-left: 20px;
}

.drop-area {
  height: 10px;
  border-color: black;
  border-style: dashed;
  border-width: 1px;
  background-color: #ccc;
}
</style>
