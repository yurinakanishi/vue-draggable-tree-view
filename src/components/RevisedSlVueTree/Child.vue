<template>
  <div
    class="sl-vue-tree"
    :class="{ 'sl-vue-tree-root': isRoot }"
    @mousemove="onMousemoveHandler"
    @mouseleave="onMouseleaveHandler"
  >
    <div ref="nodes" class="sl-vue-tree-nodes-list">
      <div
        class="sl-vue-tree-node"
        v-for="(node, nodeInd) in nodes"
        :key="node.id"
        :class="{ 'sl-vue-tree-selected': node.isSelected }"
      >
        <div
          class="sl-vue-tree-cursor sl-vue-tree-cursor_before"
          @dragover.prevent
          :style="{
            visibility:
              cursorPosition &&
              cursorPosition.node.pathStr === node.pathStr &&
              cursorPosition.placement === 'before'
                ? 'visible'
                : 'hidden',
            '--depth': depth
          }"
        >
          <!-- suggested place for node insertion  -->
        </div>

        <div
          class="sl-vue-tree-node-item"
          @mousedown="onNodeMousedownHandler($event, node)"
          @mouseup="onNodeMouseupHandler($event, node)"
          @contextmenu="emitNodeContextmenu(node, $event)"
          @dblclick="emitNodeDblclick(node, $event)"
          @click="emitNodeClick(node, $event)"
          @dragover="onExternalDragoverHandler(node, $event)"
          @drop="onExternalDropHandler(node, $event)"
          :path="node.pathStr"
          :class="[
            {
              'sl-vue-tree-cursor-hover':
                cursorPosition && cursorPosition.node.pathStr === node.pathStr,

              'sl-vue-tree-cursor-inside':
                cursorPosition &&
                cursorPosition.placement === 'inside' &&
                cursorPosition.node.pathStr === node.pathStr,

              'sl-vue-tree-node-is-leaf': node.isLeaf,
              'sl-vue-tree-node-is-folder': !node.isLeaf
            },
            `node node-type-${node.nodeType}`
          ]"
        >
          <div class="sl-vue-tree-gap" v-for="(gapInd, Ind) in gaps" :key="Ind"></div>

          <div class="sl-vue-tree-name">
            <slot name="name" :node="node">{{ node.name }}</slot>
            <span
              class="sl-vue-tree-toggle"
              v-if="!node.isLeaf"
              @click="onToggleHandler($event, node)"
            >
              <slot name="toggle" :node="node">
                <q-btn
                  flat
                  dense
                  :icon="
                    node.isLeaf ? '' : node.isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right'
                  "
                  :class="{ 'q-ml-sm': true, rotated: node.isExpanded }"
                >
                </q-btn>
              </slot>
            </span>
            <slot
              name="empty-node"
              :node="node"
              v-if="!node.isLeaf && node.children.length == 0 && node.isExpanded"
            >
            </slot>
          </div>

          <div class="sl-vue-tree-sidebar">
            <slot name="sidebar" :node="node"></slot>
          </div>
        </div>

        <Child
          v-if="node.children && node.children.length && node.isExpanded"
          :value="node.children"
          :level="node.level"
          :parentInd="nodeInd"
          :edgeSize="edgeSize"
          @dragover.prevent
        />

        <div
          class="sl-vue-tree-cursor sl-vue-tree-cursor_after"
          @dragover.prevent
          :style="{
            visibility:
              cursorPosition &&
              cursorPosition.node.pathStr === node.pathStr &&
              cursorPosition.placement === 'after'
                ? 'visible'
                : 'hidden',
            '--depth': depth
          }"
        ></div>
      </div>
      <div v-show="isDragging" v-if="isRoot" ref="dragInfo" class="sl-vue-tree-drag-info">
        <slot name="draginfo"> Items </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type {
  CursorPosition,
  InsertMode,
  NodeModelType,
  NodeType,
  TraverseCallback,
  TraverseNodeModelCallback
} from './type'
import Child from '../tutorial/Child.vue'

export default {
  name: 'sl-vue-tree',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    edgeSize: {
      type: Number,
      default: 3
    },
    level: {
      type: Number,
      default: 0
    },
    parentInd: {
      type: Number
    },
    scrollAreaHeight: {
      type: Number,
      default: 70
    },
    maxScrollSpeed: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      rootCursorPosition: null as null | CursorPosition,
      scrollIntervalId: 0 as number,
      scrollSpeed: 0 as number,
      lastSelectedNode: null as null | NodeType,
      mouseIsDown: false as boolean,
      isDragging: false as boolean,
      lastMousePos: { x: 0, y: 0 } as { x: number; y: number },
      preventDrag: false as boolean,
      currentValue: this.value as NodeType
    }
  },

  mounted() {
    if (this.isRoot) {
      document.addEventListener('mouseup', this.onDocumentMouseupHandler)
    }
  },

  beforeUnmount() {
    document.removeEventListener('mouseup', this.onDocumentMouseupHandler)
  },

  watch: {
    value: function (newValue: NodeType) {
      this.currentValue = newValue
    }
  },

  computed: {
    cursorPosition() {
      if (this.isRoot) return this.rootCursorPosition
      return this.getParent().cursorPosition
    },

    depth() {
      return this.gaps.length
    },

    nodes() {
      if (this.isRoot) {
        const nodeModels = this.copy(this.currentValue)
        return this.getNodes(nodeModels)
      }

      return this.getParent().nodes[this.parentInd].children
    },
    /**
     * gaps is using for nodes indentation
     * @returns {number[]}
     */
    gaps() {
      const gaps = []
      let i: number = this.level
      i++
      while (i-- > 0) gaps.push(i)
      return gaps
    },

    isRoot() {
      return !this.level
    }
  },
  methods: {
    setCursorPosition(pos: CursorPosition) {
      if (this.isRoot) {
        this.rootCursorPosition = pos
        return
      }
      this.getParent().setCursorPosition(pos)
    },

    getNodes(
      nodeModels: NodeType[],
      parentPath: any[] = [],
      isVisible: boolean = true
    ): NodeType[] {
      return nodeModels.map((nodeModel, ind) => {
        const nodePath = parentPath.concat(ind)
        return this.getNode(nodePath, nodeModel, nodeModels, isVisible)
      })
    },

    getNode(
      path: any[],
      nodeModel: NodeType | null = null,
      siblings: NodeType[] | null = null,
      isVisible: boolean | null = null
    ): NodeType | null {
      const ind = path.slice(-1)[0]

      // calculate nodeModel, siblings, isVisible fields if it is not passed as arguments
      siblings = siblings || this.getNodeSiblings(this.currentValue, path)
      nodeModel = nodeModel || (siblings && siblings[ind]) || null

      if (isVisible == null) {
        isVisible = this.isVisible(path)
      }

      if (!nodeModel) return null

      const isExpanded = nodeModel.isExpanded == void 0 ? false : !!nodeModel.isExpanded
      const isDraggable = nodeModel.isDraggable == void 0 ? true : !!nodeModel.isDraggable
      const isSelectable = nodeModel.isSelectable == void 0 ? true : !!nodeModel.isSelectable

      const node: NodeType = {
        // define the all ISlTreeNodeModel props
        id: nodeModel.id,
        name: nodeModel.name,
        isLeaf: !!nodeModel.isLeaf,
        nodeType: nodeModel.nodeType,
        children: nodeModel.children ? this.getNodes(nodeModel.children, path, isExpanded) : [],
        isSelected: !!nodeModel.isSelected,
        isExpanded,
        isDraggable,
        isSelectable,

        // define the all ISlTreeNode computed props
        path: path,
        pathStr: JSON.stringify(path),
        level: path.length,
        ind,
        isFirstChild: ind == 0,
        isLastChild: ind === (siblings?.length ?? 0) - 1
      }
      return node
    },

    isVisible(path: number[]): boolean {
      if (path.length < 2) return true
      let nodeModels: NodeModelType[] = this.currentValue

      for (let i = 0; i < path.length - 1; i++) {
        let ind: number = path[i]
        let nodeModel: NodeModelType = nodeModels[ind]
        let isExpanded: boolean = nodeModel.isExpanded == void 0 ? true : !!nodeModel.isExpanded
        if (!isExpanded) return false
        nodeModels = nodeModel.children
      }

      return true
    },

    emitInput(newValue: NodeType): void {
      this.currentValue = newValue
      this.getRoot().$emit('input', newValue)
    },

    emitSelect(selectedNode: NodeType, event: MouseEvent): void {
      this.getRoot().$emit('select', selectedNode, event)
    },

    emitBeforeDrop(draggingNodes: NodeType, position: any, cancel: () => void): void {
      this.getRoot().$emit('beforedrop', draggingNodes, position, cancel)
    },

    emitDrop(draggingNode: NodeType, position: any, event: MouseEvent): void {
      this.getRoot().$emit('drop', draggingNode, position, event)
    },

    emitToggle(toggledNode: NodeType, event: MouseEvent): void {
      this.getRoot().$emit('toggle', toggledNode, event)
    },

    emitNodeClick(node: NodeModelType, event: MouseEvent): void {
      this.getRoot().$emit('nodeclick', node, event)
    },

    emitNodeDblclick(node: NodeModelType, event: MouseEvent): void {
      this.getRoot().$emit('nodedblclick', node, event)
    },

    emitNodeContextmenu(node: NodeModelType, event: MouseEvent): void {
      this.getRoot().$emit('nodecontextmenu', node, event)
    },

    onExternalDragoverHandler(node: NodeModelType, event: MouseEvent): void {
      event.preventDefault()
      const root = this.getRoot()
      const cursorPosition = root.getCursorPositionFromCoords(event.clientX, event.clientY)
      root.setCursorPosition(cursorPosition)
      root.$emit('externaldragover', cursorPosition, event)
    },

    onExternalDropHandler(node: NodeModelType, event: MouseEvent): void {
      const root = this.getRoot()
      const cursorPosition = root.getCursorPositionFromCoords(event.clientX, event.clientY)
      root.$emit('externaldrop', cursorPosition, event)
      this.setCursorPosition(null)
    },

    select(path: any[], event: MouseEvent = null): NodeType {
      const selectedNode: NodeType = this.getNode(path)
      if (!selectedNode) return null

      const newNodes = this.copy(this.currentValue)

      this.traverse((node, nodeModel) => {
        if (node.pathStr === selectedNode.pathStr) {
          nodeModel.isSelected = node.isSelectable
        } else {
          if (nodeModel.isSelected) nodeModel.isSelected = false
        }
      }, newNodes)
      this.lastSelectedNode = selectedNode
      this.emitInput(newNodes)
      this.emitSelect(selectedNode, event)
      // console.log("selectedNode", selectedNode);
      return selectedNode
    },

    onMousemoveHandler(event: MouseEvent): void {
      // console.log({
      //   mouseIsDown: this.mouseIsDown,
      //   lastMousePos: this.lastMousePos,
      //   isDragging: this.isDragging,
      //   $dragInfo: this.$refs.dragInfo
      // });
      try {
        if (!this.isRoot) {
          this.getRoot().onMousemoveHandler(event)
          return
        }
        // console.log('this.preventDrag', this.preventDrag)
        if (this.preventDrag) return

        const initialDraggingState = this.isDragging

        const isDragging =
          this.isDragging ||
          (this.mouseIsDown &&
            (this.lastMousePos.x !== event.clientX || this.lastMousePos.y !== event.clientY))

        const isDragStarted = initialDraggingState === false && isDragging === true

        this.lastMousePos = {
          x: event.clientX,
          y: event.clientY
        }

        if (!isDragging) return

        const $root = this.getRoot().$el
        const rootRect = $root.getBoundingClientRect()
        const $dragInfo = this.$refs.dragInfo
        const dragInfoTop =
          event.clientY - rootRect.top + $root.scrollTop - ($dragInfo.style.marginBottom | 0)
        const dragInfoLeft = event.clientX - rootRect.left

        // console.log('this.getRoot()', this.getRoot())
        // console.log('$root', $root)
        // console.log('rootRect', rootRect)
        // console.log('$dragInfo', $dragInfo)
        // console.log('dragInfoTop', dragInfoTop)
        // console.log('dragInfoLeft', dragInfoLeft)

        $dragInfo.style.top = dragInfoTop + 'px'
        $dragInfo.style.left = dragInfoLeft + 'px'

        const cursorPosition: CursorPosition = this.getCursorPositionFromCoords(
          event.clientX,
          event.clientY
        )
        const destNode = cursorPosition.node
        const placement = cursorPosition.placement

        if (isDragStarted && !destNode.isSelected) {
          this.select(destNode.path, event)
        }

        const draggableNode = this.getDraggable()
        if (!draggableNode) {
          this.preventDrag = true
          return
        }

        this.isDragging = isDragging

        this.setCursorPosition({ node: destNode, placement })

        const scrollBottomLine = rootRect.bottom - this.scrollAreaHeight
        const scrollDownSpeed =
          (event.clientY - scrollBottomLine) / (rootRect.bottom - scrollBottomLine)
        const scrollTopLine = rootRect.top + this.scrollAreaHeight
        const scrollTopSpeed = (scrollTopLine - event.clientY) / (scrollTopLine - rootRect.top)

        if (scrollDownSpeed > 0) {
          this.startScroll(scrollDownSpeed)
        } else if (scrollTopSpeed > 0) {
          this.startScroll(-scrollTopSpeed)
        } else {
          this.stopScroll()
        }
      } catch (error) {
        console.error('Error handling mousemove event:', error)
      }
    },

    getCursorPositionFromCoords(x: number, y: number): any {
      const $target: Element | null = document.elementFromPoint(x, y)
      const $nodeItem: Element = $target?.getAttribute('path')
        ? $target
        : this.getClosetElementWithPath($target)
      let destNode: NodeType | null
      let placement: 'before' | 'inside' | 'after'

      if ($nodeItem) {
        if (!$nodeItem) return

        destNode = this.getNode(JSON.parse($nodeItem.getAttribute('path')))

        const nodeHeight = $nodeItem.offsetHeight
        const edgeSize = this.edgeSize
        const offsetY = y - $nodeItem.getBoundingClientRect().top

        if (destNode.isLeaf) {
          placement = offsetY >= nodeHeight / 2 ? 'after' : 'before'
        } else {
          if (offsetY <= edgeSize) {
            placement = 'before'
          } else if (offsetY >= nodeHeight - edgeSize) {
            placement = 'after'
          } else {
            placement = 'inside'
          }
        }
        // console.log("nodeHeight", nodeHeight);
        // console.log("edgeSize", edgeSize);
      } else {
        const $root = this.getRoot().$el
        const rootRect = $root.getBoundingClientRect()
        // console.log("rootRect", rootRect);
        if (y > rootRect.top + rootRect.height / 2) {
          placement = 'after'
          destNode = this.getLastNode()
        } else {
          placement = 'before'
          destNode = this.getFirstNode()
        }
      }

      // console.log("placement", placement);
      return { node: destNode, placement }
    },

    getClosetElementWithPath($el: Element): Element | null {
      if (!$el) return null
      if ($el.getAttribute('path')) return $el
      return this.getClosetElementWithPath($el.parentElement)
    },

    onMouseleaveHandler(event: MouseEvent): void {
      if (!this.isRoot || !this.isDragging) return
      const $root = this.getRoot().$el
      const rootRect = $root.getBoundingClientRect()
      if (event.clientY >= rootRect.bottom) {
        this.setCursorPosition({
          node: this.nodes.slice(-1)[0],
          placement: 'after'
        })
      } else if (event.clientY < rootRect.top) {
        this.setCursorPosition({
          node: this.getFirstNode(),
          placement: 'before'
        })
      }
    },

    getNodeEl(path: any[]): void {
      this.getRoot().$el.querySelector(`[path="${JSON.stringify(path)}"]`)
    },

    getLastNode(): NodeType | null {
      let lastNode: NodeType | null = null
      this.traverse((node) => {
        lastNode = node
      })
      return lastNode
    },

    getFirstNode(): NodeType | null {
      return this.getNode([0])
    },

    getNextNode(path: any[], filter: any): NodeType | null {
      let resultNode: NodeType | null = null

      this.traverse((node) => {
        if (this.comparePaths(node.path, path) < 1) return

        if (!filter || filter(node)) {
          resultNode = node
          return false // stop traverse
        }
      })

      return resultNode
    },

    getPrevNode(path: any[], filter: any) {
      let prevNodes: NodeType[] | null = []

      this.traverse((node: NodeType) => {
        if (this.comparePaths(node.path, path) >= 0) {
          return false
        }
        prevNodes.push(node)
      })

      let i: number = prevNodes.length
      while (i--) {
        const node = prevNodes[i]
        if (!filter || filter(node)) return node
      }

      return null
    },

    /**
     * returns 1 if path1 > path2
     * returns -1 if path1 < path2
     * returns 0 if path1 == path2
     *
     * examples
     *
     * [1, 2, 3] < [1, 2, 4]
     * [1, 1, 3] < [1, 2, 3]
     * [1, 2, 3] > [1, 2, 0]
     * [1, 2, 3] > [1, 1, 3]
     * [1, 2] < [1, 2, 0]
     *
     */
    comparePaths(path1: any[], path2: any[]): number {
      for (let i = 0; i < path1.length; i++) {
        if (path2[i] == void 0) return 1
        if (path1[i] > path2[i]) return 1
        if (path1[i] < path2[i]) return -1
      }
      return path2[path1.length] == void 0 ? 0 : -1
    },

    onNodeMousedownHandler(event: MouseEvent, node: NodeModelType): void {
      // handle only left mouse button
      if (event.button !== 0) return

      if (!this.isRoot) {
        this.getRoot().onNodeMousedownHandler(event, node)
        return
      }
      this.mouseIsDown = true
    },

    startScroll(speed: number) {
      const $root = this.getRoot().$el
      if (this.scrollSpeed === speed) {
        return
      } else if (this.scrollIntervalId) {
        this.stopScroll()
      }

      this.scrollSpeed = speed
      this.scrollIntervalId = setInterval(() => {
        $root.scrollTop += this.maxScrollSpeed * speed
      }, 20)
    },

    stopScroll() {
      clearInterval(this.scrollIntervalId)
      this.scrollIntervalId = 0
      this.scrollSpeed = 0
    },

    onDocumentMouseupHandler(event: MouseEvent): void {
      if (this.isDragging) this.onNodeMouseupHandler(event)
    },

    onNodeMouseupHandler(event: MouseEvent, targetNode: null | NodeType = null): void {
      // handle only left mouse button
      if (event.button !== 0) return

      if (!this.isRoot) {
        this.getRoot().onNodeMouseupHandler(event, targetNode)
        return
      }

      this.mouseIsDown = false

      if (!this.isDragging && targetNode && !this.preventDrag) {
        this.select(targetNode.path, event)
      }

      this.preventDrag = false

      if (!this.cursorPosition) {
        this.stopDrag()
        return
      }

      const draggingNode: NodeType = this.getDraggable()

      if (draggingNode.pathStr == this.cursorPosition.node.pathStr) {
        this.stopDrag()
        return
      }

      if (this.checkNodeIsParent(draggingNode, this.cursorPosition.node)) {
        this.stopDrag()
        return
      }

      const newNodes: NodeType = this.copy(this.currentValue)

      // find dragging model to delete
      const sourceSiblings = this.getNodeSiblings(newNodes, draggingNode.path)
      const draggingNodeModel = sourceSiblings[draggingNode.ind]
      draggingNodeModel['_markToDelete'] = true

      // allow the drop to be cancelled
      let cancelled: boolean = false
      this.emitBeforeDrop(draggingNode, this.cursorPosition, () => (cancelled = true))

      if (cancelled) {
        this.stopDrag()
        return
      }

      const nodeModelToInsert: NodeModelType = draggingNodeModel

      // insert dragging nodes to the new place
      this.insertModel(this.cursorPosition, nodeModelToInsert, newNodes)

      // delete dragging node from the old place
      this.traverseModels((nodeModel, siblings, ind) => {
        if (!nodeModel._markToDelete) return
        siblings.splice(ind, 1)
      }, newNodes)

      this.lastSelectedNode = null
      this.emitInput(newNodes)
      this.emitDrop(draggingNode, this.cursorPosition, event)
      this.stopDrag()
    },

    onToggleHandler(event: MouseEvent, node: NodeType): void {
      this.updateNode(node.path, { isExpanded: !node.isExpanded })
      this.emitToggle(node, event)
      event.stopPropagation()
    },

    stopDrag(): void {
      this.isDragging = false
      this.mouseIsDown = false
      this.setCursorPosition(null)
      this.stopScroll()
    },

    getParent(): void {
      return this.$parent
    },

    getRoot(): any {
      if (this.isRoot) return this
      return this.getParent().getRoot()
    },

    getNodeSiblings(nodes: NodeModelType[], path: number[]) {
      if (path.length === 1) return nodes
      return this.getNodeSiblings(nodes[path[0]].children, path.slice(1))
    },

    getNodeParent(nodes: NodeType[], path: number[]): NodeType | null {
      // If the path length is 1 or less, it means we are at the root or top level,
      // so there is no parent to return because the top-level nodes do not have a parent within the array.
      if (path.length <= 1) return null

      // Traverse to the parent node of the specified node. We use path.slice(0, -1)
      // to step just before the last index, which gives us the parent.
      let parent: NodeType[] = nodes // Start with the root nodes array
      for (let i = 0; i < path.length - 1; i++) {
        parent = parent[path[i]] // Traverse using the current index
        if (i < path.length - 2) {
          // Ensure we do not go to the children of the last node
          parent = parent.children
        }
      }

      // parent now should be the direct parent of the node at the given path
      return parent
    },

    updateNode(path: number[], patch: Partial<NodeType>): void {
      if (!this.isRoot) {
        this.getParent().updateNode(path, patch)
        return
      }

      const pathStr: string = JSON.stringify(path)
      const newNodes: NodeType[] = this.copy(this.currentValue)
      this.traverse((node, nodeModel) => {
        if (node.pathStr !== pathStr) return
        Object.assign(nodeModel, patch)
      }, newNodes)

      this.emitInput(newNodes)
    },

    getSelected(): NodeType | null {
      let selectedNode: NodeType | null = null
      this.traverse((node) => {
        if (node.isSelected) {
          selectedNode = node
          return // Stop the traversal once the first selected node is found
        }
      })
      return selectedNode
    },

    getDraggable(): NodeType | null {
      let draggableNode: NodeType | null = null
      this.traverse((node) => {
        if (node.isSelected && node.isDraggable) {
          draggableNode = node
          return // Stop the traversal once the first draggable and selected node is found
        }
      })
      return draggableNode
    },

    traverse(
      cb: TraverseCallback,
      nodeModels: NodeModelType[] = null,
      parentPath: number[] = []
    ): NodeType[] | boolean {
      if (!nodeModels) nodeModels = this.currentValue

      let shouldStop: boolean = false

      const nodes: NodeType[] = []

      for (let nodeInd = 0; nodeInd < nodeModels.length; nodeInd++) {
        const nodeModel: NodeModelType = nodeModels[nodeInd]
        const itemPath: number[] = parentPath.concat(nodeInd)
        const node: NodeType | null = this.getNode(itemPath, nodeModel, nodeModels)
        shouldStop = cb(node, nodeModel, nodeModels) === false
        nodes.push(node)

        if (shouldStop) break

        if (nodeModel.children) {
          shouldStop = this.traverse(cb, nodeModel.children, itemPath) === false
          if (shouldStop) break
        }
      }

      return !shouldStop ? nodes : false
    },

    traverseModels(cb: TraverseNodeModelCallback, nodeModels: NodeModelType[]): NodeModelType[] {
      let i: number = nodeModels.length
      while (i--) {
        const nodeModel: NodeModelType = nodeModels[i]
        if (nodeModel.children) this.traverseModels(cb, nodeModel.children)
        cb(nodeModel, nodeModels, i)
      }
      return nodeModels
    },

    insertModel(
      cursorPosition: CursorPosition,
      nodeModelToInsert: NodeType,
      newNodes: NodeModelType[]
    ): void {
      const insertMode: InsertMode =
        cursorPosition.placement === 'inside' ? 'nestInsert' : 'cutInInsert'
      const destNode: NodeType = cursorPosition.node
      const destSiblings: NodeModelType[] = this.getNodeSiblings(newNodes, destNode.path)
      const destParent: NodeModelType = this.getNodeParent(newNodes, destNode.path)
      const destNodeModel: NodeModelType =
        insertMode === 'nestInsert' ? destSiblings[destNode.ind] : undefined

      // console.log("destNodeModel", destNodeModel);
      // console.log("destNode", destNode);
      // console.log("destSiblings", destSiblings);
      // console.log("destParent", destParent);

      // if (
      //   destNodeModel.nodeType === "customer" &&
      //   selectedNode.nodeType === "location"
      // ) {
      //   console.error(
      //     "Cannot nest 'location' node type inside 'customer' node type."
      //   );
      //   return; // Prevent the nesting by exiting the function
      // }

      if (cursorPosition.placement === 'inside') {
        console.log('destNodeModel.children', destNodeModel.children)
        console.log('nodeModelsToInsert', [nodeModelToInsert])
        destNodeModel.children = destNodeModel.children || []
        destNodeModel.children.unshift(nodeModelToInsert)
        console.log('destNodeModel.children after', destNodeModel.children)
        console.log('shift finished')
        console.log('destSiblings', destSiblings)
      } else {
        const insertInd: number =
          cursorPosition.placement === 'before' ? destNode.ind : destNode.ind + 1

        destSiblings.splice(insertInd, 0, nodeModelToInsert)
      }
    },

    checkNodeIsParent(sourceNode: NodeType, destNode: NodeType) {
      const destPath: number[] = destNode.path
      return JSON.stringify(destPath.slice(0, sourceNode.path.length)) == sourceNode.pathStr
    },

    copy(entity: any): any {
      return JSON.parse(JSON.stringify(entity))
    }
  }
}
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
  width: 400px;
}

.sl-vue-tree.sl-vue-tree-root {
  color: rgb(0, 0, 0);
}

.sl-vue-tree-root > .sl-vue-tree-nodes-list {
  overflow: hidden;
  position: relative;
  padding-bottom: 4px;
}

.sl-vue-tree-selected > .sl-vue-tree-node-item {
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
