<template>
  <div
    class="tree-node"
    draggable="true"
    v-for="(node, i) in nodes"
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
        @update:node="updateNode"
        @move:node="insertBefore"
        :index="i"
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
  },
  index: {
    type: Number,
    default: 0
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

// 親のノードを探してその子ノードの配列を返す
const findParentNodesChildrenArray = (nodes: Node[], nodeId: string): Node[] | null => {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return nodes // Return the current node array if the node ID matches
    }
    if (node.children && node.children.length > 0) {
      const result = findParentNodesChildrenArray(node.children, nodeId)
      if (result) return result
    }
  }
  return null
}

// ドロップ先のノードのインデックスを取得する
const getTargetNodeIndex = (nodes: Node[], targetNodeId: string): number => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === targetNodeId) {
      return i
    }
  }
  return -1
}

// // ノードを探して削除する
function findAndRemoveNode(nodes: Node[], nodeId: string): Node | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) {
      return nodes.splice(i, 1)[0] // Remove and return the node
    }
    if (nodes[i].children && nodes[i].children.length > 0) {
      const node = findAndRemoveNode(nodes[i].children, nodeId)
      if (node) return node
    }
  }
  return null
}

// ドラッグされたノードをドロップ先のノードの前に挿入する
const insertBefore = (draggedNodeId: string, targetNodeId: string) => {
  const draggedNode = findAndRemoveNode(nodes, draggedNodeId)
  if (!draggedNode) {
    console.error('Dragged node not found')
    return
  }

  const parentNodesChildrenArray = findParentNodesChildrenArray(nodes, targetNodeId)
  const targetNodeIndex = getTargetNodeIndex(parentNodesChildrenArray || [], targetNodeId)
  if (parentNodesChildrenArray) {
    console.log('parentNodesChildrenArray:', parentNodesChildrenArray)
    parentNodesChildrenArray.splice(targetNodeIndex, 0, draggedNode)
  } else {
    console.error('No parent node found for the target ID')
  }
}

// どのノードがドラッグされたかをコンソールに表示する
const onDragStart = (event: DragEvent, nodeId: string) => {
  event.dataTransfer?.setData('text/plain', nodeId)
  console.log('Dragged Node ID:', nodeId)
}

// どのノードがどのノードにドロップされたのかをコンソールに表示する
const onDrop = (event: DragEvent, targetNodeId: string) => {
  const draggedNodeId = event.dataTransfer?.getData('text') || ''
  console.log('Dropped Node ID:', draggedNodeId, 'Target Node ID:', targetNodeId)
  emits('move:node', draggedNodeId, targetNodeId)
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
