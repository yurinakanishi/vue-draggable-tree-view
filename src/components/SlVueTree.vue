<template>
  <div class="sl-vue-tree" :class="{ 'sl-vue-tree-root': isRoot }" @mousemove="onMousemoveHandler"
    @mouseleave="onMouseleaveHandler" @dragend="onDragendHandler(null, $event)">
    <div ref="nodes" class="sl-vue-tree-nodes-list">
      <div class="sl-vue-tree-node" v-for="(node, nodeInd) in  nodes "
        :class="{ 'sl-vue-tree-selected': node.isSelected }">
        <div class="sl-vue-tree-cursor sl-vue-tree-cursor_before" @dragover.prevent :style="{
    'visibility': cursorPosition &&
      cursorPosition.node.pathStr === node.pathStr &&
      cursorPosition.placement === 'before' ?
      'visible' :
      'hidden',
    '--depth': depth
  }">
          <!-- suggested place for node insertion  -->
        </div>

        <div class="sl-vue-tree-node-item" @mousedown="onNodeMousedownHandler($event, node)"
          @mouseup="onNodeMouseupHandler($event, node)" @contextmenu="emitNodeContextmenu(node, $event)"
          @dblclick="emitNodeDblclick(node, $event)" @click="emitNodeClick(node, $event)"
          @dragover="onExternalDragoverHandler(node, $event)" @drop="onExternalDropHandler(node, $event)"
          :path="node.pathStr" :class="[
    {
      'sl-vue-tree-cursor-hover':
        cursorPosition &&
        cursorPosition.node.pathStr === node.pathStr,

      'sl-vue-tree-cursor-inside':
        cursorPosition &&
        cursorPosition.placement === 'inside' &&
        cursorPosition.node.pathStr === node.pathStr,

      'sl-vue-tree-node-is-leaf': node.isLeaf,
      'sl-vue-tree-node-is-folder': !node.isLeaf
    },
    `node node-type-${node.nodeType}`
  ]">
          <div class="sl-vue-tree-gap" v-for="gapInd in gaps"></div>

          <div class="sl-vue-tree-name">
            <slot name="name" :node="node">{{ node.name }}</slot>
            <span class="sl-vue-tree-toggle" v-if="!node.isLeaf" @click="onToggleHandler($event, node)">
              <slot name="toggle" :node="node">
                <q-btn flat dense
                  :icon="node.isLeaf ? '' : (node.isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right')"
                  :class="{ 'q-ml-sm': true, 'rotated': node.isExpanded }">
                </q-btn>
              </slot>
            </span>
            <slot name="empty-node" :node="node" v-if="!node.isLeaf && node.children.length == 0 && node.isExpanded">
            </slot>

          </div>

          <div class="sl-vue-tree-sidebar">
            <slot name="sidebar" :node="node"></slot>
          </div>

        </div>

        <sl-vue-tree v-if="node.children && node.children.length && node.isExpanded" :value="node.children"
          :level="node.level" :parentInd="nodeInd" :allowMultiselect="allowMultiselect"
          :allowToggleBranch="allowToggleBranch" :edgeSize="edgeSize" :showBranches="showBranches" @dragover.prevent />

        <div class="sl-vue-tree-cursor sl-vue-tree-cursor_after" @dragover.prevent :style="{
    'visibility': cursorPosition &&
      cursorPosition.node.pathStr === node.pathStr &&
      cursorPosition.placement === 'after' ?
      'visible' :
      'hidden',
    '--depth': depth
  }
    ">
        </div>
      </div>

      <div v-show="isDragging" v-if="isRoot" ref="dragInfo" class="sl-vue-tree-drag-info">
        <slot name="draginfo">
          Items: {{ selectionSize }}
        </slot>
      </div>

    </div>

  </div>
</template>

<script src="./sl-vue-tree.ts">

</script>

<style scoped>
.sl-vue-tree {
  position: relative;
  cursor: default;
  -webkit-touch-callout: none;
  /* iOS Safari */
  -webkit-user-select: none;
  /* Safari */
  -khtml-user-select: none;
  /* Konqueror HTML */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;
}

.sl-vue-tree.sl-vue-tree-root {
  color: rgb(0, 0, 0);
}

.sl-vue-tree-root>.sl-vue-tree-nodes-list {
  overflow: hidden;
  position: relative;
  padding-bottom: 4px;
}

.sl-vue-tree-selected>.sl-vue-tree-node-item {
  background-color: rgba(255, 230, 0, 0.5);
}

.sl-vue-tree-cursor-inside:hover {
  background-color: rgba(146, 251, 255, 0.5);
}

/* .node-type-customer {
  background-color: #00cc1b;
}

.node-type-location {
  background-color: #43ff7b;
}

.node-type-assetGroup {
  background-color: #b8ffb1;
}

.node-type-asset {
  background-color: #ffffff;
} */

.sl-vue-tree-node-item {
  position: relative;
  display: flex;
  flex-direction: row;

  padding-left: 10px;
  padding-right: 10px;
  line-height: 28px;
  border: 1px solid transparent;
}

.sl-vue-tree-node-item.sl-vue-tree-cursor-inside {
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.sl-vue-tree-gap {
  width: 25px;
  min-height: 1px;
}

.sl-vue-tree-toggle {
  display: inline-block;
  text-align: left;
  width: 20px;
}

.sl-vue-tree-sidebar {
  margin-left: auto;
}

.sl-vue-tree-cursor {
  position: absolute;
  background-color: crimson;
  height: 3px;
  width: 100%;
  z-index: 1000;
}

.sl-vue-tree-drag-info {
  position: absolute;
  opacity: 0.5;
  margin-left: 20px;
  padding: 5px 10px;
}

.children {
  margin-left: 20px;
}
</style>
