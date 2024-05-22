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
        :class="{
          hovered: node.id === hoveredDropBeforeAreaId && isHoveredToDropBeforeArea && isDragging
        }"
        @drop.stop="onDropBefore($event, node.id)"
        @dragenter.stop="onDragEnterDropBeforeArea(node.id)"
        @dragleave.stop="onDragLeaveDropBeforeArea(node.id)"
      ></div>
      <div
        class="node-name"
        :class="{ hovered: node.id === hoveredNodeId && isHoveredToNodeName && isDragging }"
        @dragenter.stop="onDragEnterNodeName(node.id)"
        @dragleave.stop="onDragLeaveNodeName(node.id)"
        @drop.stop="onDropInside($event, node.id)"
      >
        <span :class="{ 'node-child': isDragging }">{{ node.name }}</span>
        <span :class="{ 'node-child': isDragging }" name="toggle" :node="node">
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
    </div>
    <div v-if="node.children && node.isExpanded">
      <TreeNodes
        :nodes="node.children"
        @update:node="updateNode"
        @move:node:before="insertBefore"
        @move:node:after="insertAfter"
        @move:node:inside="insertInside"
      />
    </div>
    <div
      class="drop-area"
      :class="{
        hovered: node.id === hoveredDropAfterAreaId && isHoveredToDropAfterArea && isDragging
      }"
      @drop.stop="onDropAfter($event, node.id)"
      @dragenter.stop="onDragEnterDropAfterArea(node.id)"
      @dragleave.stop="onDragLeaveDropAfterArea(node.id)"
      v-if="nodes.length - 1 === i"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive, ref } from 'vue'
import type { PropType, Ref } from 'vue'
import type { Node } from './types'
import TreeNodes from './TreeNodes.vue'
import { is } from 'quasar'

const props = defineProps({
  nodes: {
    type: Array as PropType<Node[]>,
    required: true
  }
})

const emits = defineEmits([
  'update:node',
  'move:node:before',
  'move:node:after',
  'move:node:inside'
])

// const emits = defineEmits<{
//   'update:node': (id: string) => true
//   'move:node:before': (draggedNodeId: string, targetNodeId: string) => true
//   'move:node:after': (draggedNodeId: string, targetNodeId: string) => true
//   'move:node:inside': (draggedNodeId: string, targetNodeId: string) => true
// }>()

const nodes = reactive(props.nodes)

const hoveredNodeId: Ref<string | null> = ref(null)
const hoveredDropBeforeAreaId: Ref<string | null> = ref(null)
const hoveredDropAfterAreaId: Ref<string | null> = ref(null)
const isHoveredToDropBeforeArea = ref(false)
const isHoveredToDropAfterArea = ref(false)
const isHoveredToNodeName = ref(false)
const isDragging = ref(false)

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

//insertInsideを親にemitする
const insertInside = (draggedNodeId: string, targetNodeId: string) => {
  emits('move:node:inside', draggedNodeId, targetNodeId)
}

// ドラッグされたノードのIDを取得する
const onDragStart = (event: DragEvent, nodeId: string) => {
  event.dataTransfer?.setData('text/plain', nodeId)
  console.log('Dragged Node ID:', nodeId)
  isDragging.value = true
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
  isDragging.value = false
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
  isDragging.value = false
}

const onDropInside = (event: DragEvent, nodeId: string) => {
  const draggedNodeId = event.dataTransfer?.getData('text') || ''
  console.log('Dropped Node ID:', draggedNodeId, 'Target Node ID:', nodeId)
  // ドラッグ元とドロップ先が同じ場合はReturn
  if (draggedNodeId === nodeId) {
    return
  }
  emits('move:node:inside', draggedNodeId, nodeId)
  isDragging.value = false
}

// ドラッグしているノードがノードに入った時に、そのノードのIDを取得し、hoveredNodeIdにセットする
const onDragEnterNodeName = (nodeId: string) => {
  hoveredNodeId.value = nodeId
  isHoveredToNodeName.value = true
}

// ドラッグしているノードがノードから出た時に、hoveredNodeIdをnullにする
const onDragLeaveNodeName = (nodeId: string) => {
  if (hoveredNodeId.value === nodeId) {
    hoveredNodeId.value = null
  }
  isHoveredToNodeName.value = false
}

// ドラッグしているノードがドロップエリアに入った時に、そのノードのIDを取得し、hoveredDropBeforeAreaIdにセットする
const onDragEnterDropBeforeArea = (nodeId: string) => {
  hoveredDropBeforeAreaId.value = nodeId
  isHoveredToDropBeforeArea.value = true
}

// ドラッグしているノードがドロップエリアから出た時に、hoveredDropBeforeAreaIdをnullにする
const onDragLeaveDropBeforeArea = (nodeId: string) => {
  if (hoveredDropBeforeAreaId.value === nodeId) {
    hoveredDropBeforeAreaId.value = null
  }
  isHoveredToDropBeforeArea.value = false
}

// ドラッグしているノードがドロップエリアに入った時に、そのノードのIDを取得し、hoveredDropAfterAreaIdにセットする
const onDragEnterDropAfterArea = (nodeId: string) => {
  hoveredDropAfterAreaId.value = nodeId
  isHoveredToDropAfterArea.value = true
}

// ドラッグしているノードがドロップエリアから出た時に、hoveredDropAfterAreaIdをnullにする
const onDragLeaveDropAfterArea = (nodeId: string) => {
  if (hoveredDropAfterAreaId.value === nodeId) {
    hoveredDropAfterAreaId.value = null
  }
  isHoveredToDropAfterArea.value = false
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

.node-name.hovered {
  background-color: #02ccff;
}

.drop-area.hovered {
  background-color: #00ff55;
}

.node-child {
  pointer-events: none;
}
</style>
