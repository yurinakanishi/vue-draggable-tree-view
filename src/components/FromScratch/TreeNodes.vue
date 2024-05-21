<template>
  <div
    class="tree-node"
    draggable="true"
    v-for="node in nodes"
    :key="node.id"
    @dragover.prevent
    @dragenter.prevent
    @dragstart.stop="onDragStart($event, node.id)"
    @drop.stop="onDrop($event, node.id)"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
  >
    <div style="height: 40px">
      <div class="drop-area"></div>
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
        @update:node="updateNode(node.id)"
        @move:node="insertBefore(node.id, node.id)"
      />
    </div>
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

const emits = defineEmits(['update:node', 'move:node'])

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

// ドラッグされたノードをドロップ先のノードの前に挿入する
const insertBefore = (draggedNodeId: string, targetNodeId: string) => {
  console.log('draggedNodeId:', draggedNodeId, 'targetNodeId:', targetNodeId)
}

// どのノードがドラッグされたかをコンソールに表示する
const onDragStart = (event: DragEvent, nodeId: string) => {
  event.dataTransfer?.setData('text/plain', nodeId)
  console.log('Dragged Node ID:', nodeId)
}

// どのノードがどのノードにドロップされたのかをコンソールに表示する
const onDrop = (event: DragEvent, targetNodeId: string) => {
  const draggedNodeId = event.dataTransfer?.getData('text')
  console.log('Dropped Node ID:', draggedNodeId, 'Target Node ID:', targetNodeId)
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
  background-color: #ccc;
}
</style>
