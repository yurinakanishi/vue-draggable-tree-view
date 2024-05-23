<template>
  <div
    class="tree-node-container"
    draggable="true"
    v-for="(node, i) in nodes"
    :key="node.id"
    @dragover.prevent
    @dragenter.stop="onDragEnter(node.id)"
    @dragleave.stop="onDragLeave(node.id)"
    @dragstart.stop="onDragStart($event, node.id)"
    @dragend.stop="onDragEnd"
  >
    <div class="tree-node">
      <div
        class="drop-area"
        :class="{
          hovered: node.id === hoveredNode?.id && isHoveredToDropBeforeArea
        }"
        @dragover.prevent
        @drop.stop="onDropBefore($event, node.id)"
        @dragenter="onDragEnterDropBeforeArea"
        @dragleave="onDragLeaveDropBeforeArea"
      >
        <div class="bar"></div>
      </div>
      <div
        class="node-name"
        :class="{ hovered: node.id === hoveredNode?.id && isHoveredToNodeName }"
        @dragover.prevent
        @dragenter="onDragEnterNodeName(node.id)"
        @dragleave="onDragLeaveNodeName"
        @drop.stop="onDropAppendChild($event, node.id)"
      >
        <span :class="{ 'node-child': draggingNode }">{{ node.name }}</span>
        <span :class="{ 'node-child': draggingNode }" name="toggle" :node="node">
          <q-btn
            flat
            dense
            :icon="node.isLeaf ? '' : node.isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right'"
            :class="{ 'q-ml-sm': true, rotated: node.isExpanded }"
            @click="toggleExpand(node)"
          >
          </q-btn>
        </span>
        <span :class="{ 'node-child': draggingNode }">{{ isHoveredToNodeName }}</span>
      </div>
    </div>
    <div v-if="node.children && node.isExpanded">
      <TreeNodes
        :hoveredNode="hoveredNode"
        :draggingNode="draggingNode"
        :nodes="node.children"
        @update:hoveredNode="handleHoveredNodeUpdate"
        @update:draggingNode="handleDraggingNodeUpdate"
        @move:node:before="insertBefore"
        @move:node:after="insertAfter"
        @move:node:appendChild="appendChild"
      />
    </div>
    <div
      class="drop-area"
      :class="{
        hovered: node.id === hoveredNode?.id && isHoveredToDropAfterArea
      }"
      @dragover.prevent
      @drop.stop="onDropAfter($event, node.id)"
      @dragenter.stop="onDragEnterDropAfterArea"
      @dragleave.stop="onDragLeaveDropAfterArea"
      v-if="nodes.length - 1 === i"
    >
      <div class="bar"></div>
    </div>
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
  },
  hoveredNode: {
    type: Object as PropType<Node | null>
  },
  draggingNode: {
    type: Object as PropType<Node | null>
  }
})

const emits = defineEmits<{
  (event: 'update:hoveredNode', nodeId: string | null): void
  (event: 'update:draggingNode', nodeId: string | null): void
  (event: 'move:node:before', draggedNodeId: string, targetNodeId: string): void
  (event: 'move:node:after', draggedNodeId: string, targetNodeId: string): void
  (event: 'move:node:appendChild', draggedNodeId: string, targetNodeId: string): void
}>()

const nodes = reactive(props.nodes)

const isHoveredToDropBeforeArea = ref(false)
const isHoveredToDropAfterArea = ref(false)
const isHoveredToNodeName = ref(false)

// ノードの展開状態をトグルする
const toggleExpand = (node: Node) => {
  if (node.children) {
    node.isExpanded = !node.isExpanded
  }
}

//insertBeforeを親にemitする
const insertBefore = (draggedNodeId: string, targetNodeId: string) => {
  emits('move:node:before', draggedNodeId, targetNodeId)
}

//insertAfterを親にemitする
const insertAfter = (draggedNodeId: string, targetNodeId: string) => {
  emits('move:node:after', draggedNodeId, targetNodeId)
}

//appendChildを親にemitする
const appendChild = (draggedNodeId: string, targetNodeId: string) => {
  emits('move:node:appendChild', draggedNodeId, targetNodeId)
}

//handleHoveredNodeUpdateを親にemitする
const handleHoveredNodeUpdate = (nodeId: string | null) => {
  emits('update:hoveredNode', nodeId)
}

//handleDraggingNodeUpdateを親にemitする
const handleDraggingNodeUpdate = (nodeId: string | null) => {
  emits('update:draggingNode', nodeId)
}

// ドラッグされたノードのIDを取得する
const onDragStart = (event: DragEvent, nodeId: string) => {
  event.dataTransfer?.setData('text/plain', nodeId)
  emits('update:draggingNode', nodeId)
}

const onDragEnd = () => {
  console.log('onDragEnd')
  emits('update:draggingNode', null)
}

// ドラッグされたノードをドロップ先の前に移動する
const onDropBefore = (event: DragEvent, targetNodeId: string) => {
  const draggedNodeId = event.dataTransfer?.getData('text') || ''
  console.log('Dropped Node ID:', draggedNodeId, 'Target Node ID:', targetNodeId)
  // ドラッグ元とドロップ先が同じ場合はReturn
  if (draggedNodeId === targetNodeId) {
    return
  }
  emits('update:hoveredNode', null)
  emits('update:draggingNode', null)
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
  emits('update:hoveredNode', null)
  emits('update:draggingNode', null)
  emits('move:node:after', draggedNodeId, targetNodeId)
}

const onDropAppendChild = (event: DragEvent, nodeId: string) => {
  const draggedNodeId = event.dataTransfer?.getData('text') || ''
  console.log('Dropped Node ID:', draggedNodeId, 'Target Node ID:', nodeId)
  // ドラッグ元とドロップ先が同じ場合はReturn
  if (draggedNodeId === nodeId) {
    return
  }
  emits('update:hoveredNode', null)
  emits('update:draggingNode', null)
  emits('move:node:appendChild', draggedNodeId, nodeId)
}

const onDragEnter = (nodeId: string) => {
  console.log('onDragEnter:', nodeId)
  emits('update:hoveredNode', nodeId)
}

const onDragLeave = (nodeId: string) => {
  console.log('onDragLeave from:', nodeId)
}

const onDragEnterNodeName = (nodeId: string) => {
  isHoveredToNodeName.value = true
}

const onDragLeaveNodeName = () => {
  console.log('onDragLeaveNodeName')
  isHoveredToNodeName.value = false
}

// ドラッグしているノードがドロップエリアに入った時に、そのノードのIDを取得し、hoveredDropBeforeAreaIdにセットする
const onDragEnterDropBeforeArea = () => {
  isHoveredToDropBeforeArea.value = true
}

// ドラッグしているノードがドロップエリアから出た時に、hoveredDropBeforeAreaIdをnullにする
const onDragLeaveDropBeforeArea = () => {
  isHoveredToDropBeforeArea.value = false
}

// ドラッグしているノードがドロップエリアに入った時に、そのノードのIDを取得し、hoveredDropAfterAreaIdにセットする
const onDragEnterDropAfterArea = () => {
  isHoveredToDropAfterArea.value = true
}

// ドラッグしているノードがドロップエリアから出た時に、hoveredDropAfterAreaIdをnullにする
const onDragLeaveDropAfterArea = () => {
  isHoveredToDropAfterArea.value = false
}
</script>

<style scoped>
.tree-node-container {
  margin-left: 20px;
}

.tree-node {
  height: 40px;
}

.drop-area {
  height: 10px;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drop-area.hovered .bar {
  width: 100%;
  height: 3px;
  background-color: #ff0606;
}

.node-name {
  border-radius: 5px;
}

.node-name.hovered {
  background-color: rgba(0, 153, 255, 0.329);
}

.node-child {
  pointer-events: none;
}
</style>
