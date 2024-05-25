<template>
  <div
    class="tree-node-container"
    draggable="true"
    v-for="(node, i) in nodes"
    :key="node.id"
    @dragover.stop.prevent="onDragOver(node)"
    @dragstart.stop="onDragStart($event, node)"
    @dragend.stop="onDragEnd"
  >
    <div class="tree-node">
      <div
        class="drop-area"
        :class="{
          hovered: node.id === dragHoverTargetNode?.id && isHoveredToDropBeforeArea && canDropNow
        }"
        @dragover.prevent="onDragOverBeforeArea"
        @drop.stop="onDropBefore($event, node)"
        @dragenter="onDragEnterDropBeforeArea"
        @dragleave="onDragLeaveDropBeforeArea"
      ></div>
      <div
        class="node-name"
        :class="{
          hovered: node.id === dragHoverTargetNode?.id && isHoveredToNodeName && canDropNow
        }"
        @dragover.prevent="onDragOverNodeName"
        @dragenter="onDragEnterNodeName"
        @dragleave="onDragLeaveNodeName"
        @drop.stop="onDropAppendChild($event, node)"
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
        <span>{{ node.id }}</span>
      </div>
    </div>
    <div v-if="node.children && node.isExpanded">
      <TreeNodes
        :dragHoverTargetNode="dragHoverTargetNode"
        :draggingNode="draggingNode"
        :nodes="node.children"
        :canDropNow="canDropNow"
        :dropOption="dropOption"
        @update:dragHoverTargetNode="handleHoveredNodeUpdate"
        @update:draggingNode="handleDraggingNodeUpdate"
        @move:node:before="insertBefore"
        @move:node:after="insertAfter"
        @move:node:appendChild="appendChild"
        @status:canDrop="handleCanDrop"
        @status:dropOption="handleDropOption"
      />
    </div>
    <div
      class="drop-area"
      :class="{
        hovered: node.id === dragHoverTargetNode?.id && isHoveredToDropAfterArea && canDropNow
      }"
      @dragover.prevent="onDragOverAfterArea"
      @dragenter="onDragEnterDropAfterArea"
      @dragleave="onDragLeaveDropAfterArea"
      @drop.stop="onDropAfter($event, node)"
      v-if="nodes.length - 1 === i"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive, ref } from 'vue'
import type { PropType } from 'vue'
import type { Node, DropOption } from './types'
import TreeNodes from './TreeNodes.vue'

const props = defineProps({
  nodes: {
    type: Array as PropType<Node[]>,
    required: true
  },
  dragHoverTargetNode: {
    type: Object as PropType<Node | null>
  },
  draggingNode: {
    type: Object as PropType<Node | null>
  },
  canDropNow: {
    type: Boolean,
    default: false
  },
  dropOption: {
    type: String as PropType<DropOption> | null,
    default: null
  }
})

const emits = defineEmits<{
  (event: 'status:canDrop', draggedNode: Node, targetNode: Node): void
  (event: 'status:dropOption', dropOption: DropOption | null): void
  (event: 'update:dragHoverTargetNode', node: Node | null): void
  (event: 'update:draggingNode', node: Node | null): void
  (event: 'move:node:before', draggedNode: Node, targetNode: Node): void
  (event: 'move:node:after', draggedNode: Node, targetNode: Node): void
  (event: 'move:node:appendChild', draggedNode: Node, targetNode: Node): void
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
const insertBefore = (draggedNode: Node, targetNode: Node) => {
  emits('move:node:before', draggedNode, targetNode)
}

//insertAfterを親にemitする
const insertAfter = (draggedNode: Node, targetNode: Node) => {
  emits('move:node:after', draggedNode, targetNode)
}

//appendChildを親にemitする
const appendChild = (draggedNode: Node, targetNode: Node) => {
  emits('move:node:appendChild', draggedNode, targetNode)
}

//handleHoveredNodeUpdateを親にemitする
const handleHoveredNodeUpdate = (node: Node | null) => {
  emits('update:dragHoverTargetNode', node)
}

// handleDraggingNodeUpdateを親にemitする
const handleDraggingNodeUpdate = (node: Node | null) => {
  emits('update:draggingNode', node)
}

// handleCanDropを親にemitする
const handleCanDrop = (draggedNode: Node, targetNode: Node) => {
  emits('status:canDrop', draggedNode, targetNode)
}

// handleDropOptionを親にemitする
const handleDropOption = (dropOption: DropOption | null) => {
  emits('status:dropOption', dropOption)
}

// ドラッグされたノードのIDを取得する
const onDragStart = (event: DragEvent, node: Node) => {
  event.dataTransfer?.setData('application/json', JSON.stringify(node))
  emits('update:draggingNode', node)
}

const onDragEnd = () => {
  emits('update:draggingNode', null)
}

function getNodeFromEvent(event: DragEvent): Node | null {
  const jsonData = event.dataTransfer?.getData('application/json')
  if (!jsonData) {
    console.error('No data available')
    return null
  }

  try {
    return JSON.parse(jsonData)
  } catch (error) {
    console.error('Error parsing JSON data:', error)
    return null
  }
}

// Moves the dragged node to a position before the target node upon dropping.
const onDropBefore = (event: DragEvent, targetNode: Node) => {
  const node = getNodeFromEvent(event)
  if (!node) return

  emits('update:dragHoverTargetNode', null)
  emits('update:draggingNode', null)
  emits('move:node:before', node, targetNode)
}

// Moves the dragged node to a position after the target node upon dropping.
const onDropAfter = (event: DragEvent, targetNode: Node) => {
  const node = getNodeFromEvent(event)
  if (!node) return

  emits('update:dragHoverTargetNode', null)
  emits('update:draggingNode', null)
  emits('move:node:after', node, targetNode)
}

// Appends the dragged node as a child of the target node upon dropping.
const onDropAppendChild = (event: DragEvent, targetNode: Node) => {
  const node = getNodeFromEvent(event)
  if (!node) return

  emits('update:dragHoverTargetNode', null)
  emits('update:draggingNode', null)
  emits('move:node:appendChild', node, targetNode)
}

// const onDragEnter = (node: Node) => {
//   console.log('onDragEnter', node.id)
//   emits('update:dragHoverTargetNode', node)
// }

const onDragOver = (node: Node) => {
  console.log('dragHoverTargetNode', props.dragHoverTargetNode?.id)
  emits('update:dragHoverTargetNode', node)
}

const onDragOverBeforeArea = () => {
  emits('status:dropOption', 'before')
  if (props.dragHoverTargetNode && props.draggingNode) {
    emits('status:canDrop', props.draggingNode, props.dragHoverTargetNode)
  }
}

const onDragOverAfterArea = () => {
  emits('status:dropOption', 'after')
  if (props.dragHoverTargetNode && props.draggingNode) {
    emits('status:canDrop', props.draggingNode, props.dragHoverTargetNode)
  }
}

const onDragOverNodeName = () => {
  emits('status:dropOption', 'appendChild')
  if (props.dragHoverTargetNode && props.draggingNode) {
    emits('status:canDrop', props.draggingNode, props.dragHoverTargetNode)
  }
}

// const onDragLeave = (node: Node) => {}

const onDragEnterNodeName = () => {
  isHoveredToNodeName.value = true
}

const onDragLeaveNodeName = () => {
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
  background: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drop-area.hovered {
  background: linear-gradient(to bottom, #ccc 40%, #2558ff 40%, #2558ff 60%, #ccc 60%);
}

/* .drop-area {
  height: 10px;
  background-color: #ccc;
  transition: background-color 0.1s ease;
}

.drop-area.hovered {
  background-color: #2558ff;
}

.drop-area.hovered::before {
  opacity: 1;
} */

.node-name {
  border-radius: 5px;
  transition: background-color 0.2s ease;
}

.node-name.hovered {
  background-color: rgba(0, 153, 255, 0.329);
}

.node-child {
  pointer-events: none;
}
</style>
