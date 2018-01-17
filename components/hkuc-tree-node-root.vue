<template>
	<ul
		class="hkuc-ztree"
		:class="{'tree-line':setting.view.showLine}"
	    v-if="node.children && childNodeIds"
	>
		<hkuc-tree-node
			v-for="(childNode,index) in node.children"
			:key="childNodeIds[index]"
			v-model="node.children[index]"
			:treeInterface="treeInterface"
			:id="childNodeIds[index]"
			:setting="setting"
		/>
	</ul>
</template>

<script>
	import HkucTreeNode from './hkuc-tree-node';

	export default {
		name:"hkuc-tree-node-root",
		props:['setting','id'],
		components:{
			HkucTreeNode
		},
		extends:HkucTreeNode
	}
</script>

<style scoped>

</style>