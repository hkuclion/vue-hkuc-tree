<template>
	<li :class="{'node-line':!hasChildren}">
		<a class="tree-node">
			<span
				class="tree-node-expand fa"
				:class="{
					'fa-blank':!hasChildren,
					'fa-plus-square':hasChildren && !nodeState.isOpen,
					'fa-minus-square':hasChildren && nodeState.isOpen
				}"
				:style="{
					'cursor':hasChildren?'pointer':'default'
				}"
				@click="expandSwitch()"
			></span>
			<span
				class="tree-node-icon fa"
				:class="{
					'fa-file':!hasChildren,
					'fa-folder':hasChildren && !nodeState.isOpen,
					'fa-folder-open':hasChildren && nodeState.isOpen
				}"
			></span>
			<span
				class="tree-node-name"
				:title="node[setting.data.key.title]"
			>{{node[setting.data.key.name]}}</span>
		</a>
		<ul
			v-if="hasChildren"
			v-show="nodeState.isOpen"
			class="tree-node-children"
		>
			<hkuc-tree-node
				ref="child-node"
	            v-for="(childNode,index) in node[setting.data.key.children]"
	            v-model="node[setting.data.key.children][index]"
	            :key="index"
	            :setting="setting"
	            :level="level+1"
	            :level-count="node[setting.data.key.children].length"
	            :level-index="index"
			>
			</hkuc-tree-node>
		</ul>
	</li>
</template>

<script>
	import hkucTreeNodeInterface from '../lib/hkucTreeNodeInterface';

	export default {
		name:'hkuc-tree-node',
		data(){
			return {
				nodeState:{
					isOpen:true,
				},
				nodeInterface:null,
			}
		},
		props:[
			'node','setting','level','levelIndex','levelCount'
		],
		computed:{
			hasChildren(){
				return this.node[this.setting.data.key.children] && this.node[this.setting.data.key.children].length;
			}
		},
		model:{
			prop:'node',
			event:'update',
		},
		methods:{
			expandSwitch(expand){
				this.nodeInterface._operate('switchExpand', expand);
			}
		},
		mounted() {
			this.nodeInterface = new hkucTreeNodeInterface(this);
		},
		destroyed() {
			if (this.nodeInterface) {
				this.nodeInterface.destructor();
				this.nodeInterface = null;
			}
		}
	}
</script>