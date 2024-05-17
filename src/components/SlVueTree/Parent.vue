<template>
  <h2>SlVueTree</h2>
  <div>
    <div class="flex">
      <SlVueTree :value="nodes" :allow-multiselect="true" :show-branches="false" />
      <div class="json-preview">
        <pre>{{ JSON.stringify(nodes, null, 4) }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SlVueTree from './SlVueTree.vue'
import { ref } from 'vue'
const nodes = ref([
  { title: 'Item1', isLeaf: true },
  { title: 'Item2', isLeaf: true, data: { visible: false } },
  { title: 'Folder1' },
  {
    title: 'Folder2',
    isExpanded: true,
    children: [
      { title: 'Item3', isLeaf: true },
      { title: 'Item4', isLeaf: true },
      {
        title: 'Folder3',
        children: [{ title: 'Item5', isLeaf: true }]
      }
    ]
  },
  { title: 'Folder5', isExpanded: false },
  { title: 'Item6', isLeaf: true },
  { title: 'Item7', isLeaf: true, data: { visible: false } },
  {
    title: 'Folder6',
    children: [
      {
        title: 'Folder7',
        children: [
          { title: 'Item8', isLeaf: true },
          { title: 'Item9', isLeaf: true }
        ]
      }
    ]
  }
])
</script>
<style scoped>
.json-preview {
  flex-grow: 1;
  margin-left: 10px;
  border: 1px solid black;
  padding: 10px;
}
</style>
