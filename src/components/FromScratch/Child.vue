<template>
  <div class="tree-node" draggable="true" @dragstart="onDragStart" @dragover.prevent @drop="onDrop">
    <slot name="toggle" :node="node">
      <q-btn
        flat
        dense
        :icon="node.isLeaf ? '' : node.isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right'"
        :class="{ 'q-ml-sm': true, rotated: node.isExpanded }"
        @click="toggleExpand"
      >
      </q-btn>
    </slot>
    <span @click="toggleExpand">{{ node.name }}</span>
    <div v-if="node.isExpanded && node.children">
      <Child
        v-for="(child, index) in node.children"
        :key="index"
        :node="child"
        @update:node="updateChild(index, $event)"
        @drop="onDrop"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted, PropType } from 'vue'
import { TreeNode } from './types' // Assuming TreeNode type is defined in types.ts

const props = defineProps({
  node: Object as PropType<TreeNode>
})

const emits = defineEmits(['update:node', 'drop'])

const Child = defineAsyncComponent(() => import('./Child.vue'))

const toggleExpand = () => {
  if (props.node.children) {
    props.node.isExpanded = !props.node.isExpanded
    emits('update:node', { ...props.node })
  }
}

const updateChild = (index: number, updatedChild: TreeNode) => {
  if (props.node.children) {
    props.node.children[index] = updatedChild
    emits('update:node', { ...props.node })
  }
}

const onDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('node', JSON.stringify(props.node))
  }
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    const droppedNode = JSON.parse(event.dataTransfer.getData('node')) as TreeNode
    if (!props.node.isLeaf && props.node !== droppedNode) {
      emits('drop', droppedNode, props.node)
    }
  }
}

onMounted(() => {
  console.log('Child component mounted.')
})
</script>

<style scoped>
.tree-node {
  margin-left: 20px;
}
</style>
