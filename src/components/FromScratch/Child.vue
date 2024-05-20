<template>
  <div
    class="tree-node"
    draggable="true"
    @dragstart.stop="dragStart"
    @drop.stop="drop"
    @dragover.prevent
    @dragenter.prevent
  >
    <div style="height: 30px">
      <span>{{ node.name }}</span>
      <span name="toggle" :node="node">
        <q-btn
          flat
          dense
          :icon="node.isLeaf ? '' : node.isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right'"
          :class="{ 'q-ml-sm': true, rotated: node.isExpanded }"
          @click="toggleExpand"
        >
        </q-btn>
      </span>
    </div>
    <div v-if="node.isExpanded && node.children">
      <Child
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        @update:node="updateNode($event, child.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive, readonly } from 'vue'
import type { PropType } from 'vue'
import type { Node } from './types'
import Child from './Child.vue'

const props = defineProps({
  node: {
    type: Object as PropType<Node>,
    required: true
  }
})

const emits = defineEmits(['update:node'])

const node = reactive(props.node)

const toggleExpand = () => {
  if (node.children) {
    node.isExpanded = !node.isExpanded
    emits('update:node', readonly(node))
  }
}

const updateNode = (updatedNode: Node, id: string) => {
  if (node.children) {
    node.children = node.children.map((child) => {
      if (child.id === id) {
        return updatedNode
      }
      return child
    })
    emits('update:node', readonly(node))
  }
}

const dragStart = (event: DragEvent) => {
  event.dataTransfer!.setData('node-id', node.id)
  console.log('dragStart', node)
}

const drop = (event: DragEvent) => {
  event.preventDefault()
  const nodeId = event.dataTransfer!.getData('node-id')
  console.log('drop', nodeId, node.id)
}
</script>

<style scoped>
.tree-node {
  margin-left: 20px;
}
</style>
