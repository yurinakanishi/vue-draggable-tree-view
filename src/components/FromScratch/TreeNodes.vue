<template>
  <div
    class="tree-node"
    draggable="true"
    v-for="(node, i) in nodes"
    :key="node.id"
    @dragover.prevent
    @dragenter.prevent
    @dragstart.stop="onDragStart($event, node.id)"
  >
    <div style="height: 40px">
      <div
        class="drop-area"
        :class="{ hovered: node.id === hoveredNodeId }"
        @drop.stop="onDropBefore($event, node.id)"
        @dragenter="onDragEnterDropArea(node.id)"
        @dragleave="onDragLeaveDropArea(node.id)"
      ></div>
      <span
        :class="{ hovered: node.id === hoveredNodeId }"
        @dragenter="onDragEnterNode(node.id)"
        @dragleave="onDragLeaveNode(node.id)"
        >{{ node.name }}</span
      >
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
import { defineProps, defineEmits, reactive, ref } from 'vue'
import type { PropType, Ref } from 'vue'
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

const hoveredNodeId: Ref<string | null> = ref(null)
const hoveredDropAreaId: Ref<string | null> = ref(null)

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

// ドラッグされたノードのIDを取得する
const onDragStart = (event: DragEvent, nodeId: string) => {
  event.dataTransfer?.setData('text/plain', nodeId)
  console.log('Dragged Node ID:', nodeId)
}

// ドラッグされたノードをドロップ先の前に移動する
const onDropBefore = (event: DragEvent, targetNodeId: string) => {
  const draggedNodeId = event.dataTransfer?.getData('text') || ''
  console.log('Dropped Node ID:', draggedNodeId, 'Target Node ID:', targetNodeId)
  // ドラッグ元とドロップ先が同じ場合はReturn
  if (draggedNodeId === targetNodeId) {
    return
  }
  emits('move:node:before', draggedNodeId, targetNodeId)
}

// ドラッグされたノードをドロップ先の後に移動する
const onDropAfter = (event: DragEvent, targetNodeId: string) => {
  const draggedNodeId = event.dataTransfer?.getData('text') || ''
  console.log('Dropped Node ID:', draggedNodeId, 'Target Node ID:', targetNodeId)
  // ドラッグ元とドロップ先が同じ場合はReturn
  if (draggedNodeId === targetNodeId) {
    return
  }
  emits('move:node:after', draggedNodeId, targetNodeId)
}

// ドラッグしているノードがノードに入った時に、そのノードのIDを取得し、hoveredNodeIdにセットする
const onDragEnterNode = (nodeId: string) => {
  hoveredNodeId.value = nodeId
}

// ドラッグしているノードがノードから出た時に、hoveredNodeIdをnullにする
const onDragLeaveNode = (nodeId: string) => {
  if (hoveredNodeId.value === nodeId) {
    hoveredNodeId.value = null
  }
}

// ドラッグしているノードがドロップエリアに入った時に、そのノードのIDを取得し、hoveredDropAreaIdにセットする
const onDragEnterDropArea = (nodeId: string) => {
  hoveredDropAreaId.value = nodeId
}

// ドラッグしているノードがドロップエリアから出た時に、hoveredDropAreaIdをnullにする
const onDragLeaveDropArea = (nodeId: string) => {
  if (hoveredDropAreaId.value === nodeId) {
    hoveredDropAreaId.value = null
  }
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

.hovered {
  background-color: #02ccff;
}

.drop-area.hovered {
  background-color: #00ff55;
}
</style>
