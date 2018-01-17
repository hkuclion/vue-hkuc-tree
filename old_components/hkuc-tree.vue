<template>
	<ul
		class="hkuc-ztree"
		:class="{'tree-line':_setting.view.showLine}"
		v-if="nodes && nodes.length"
	>
		<hkuc-tree-node
			ref="child-node"
			v-for="(node,index) in nodes"
			v-if="node"
			v-model="nodes[index]"
			:setting="_setting"
			:key="index"
			:level="0"
			:level-count="nodes.length"
			:level-index="index"
			:tree-interface="treeInterface"
		></hkuc-tree-node>
	</ul>
</template>

<script>
	import HkucTreeNode from './hkuc-tree-node';
	import hkucTreeInterface from '../old_lib/hkucTreeInterface';
	import 'font-awesome/css/font-awesome.min.css';
	import '@/assets/hkuc-tree.css';
	import extend from 'extend';

	export default {
		props:[
			'nodes', 'setting'
		],
		data(){
			return {
				defaultSetting:{
					data:{
						key:{
							name:'name',
							title:'title',
							children:'children',
						}
					},
					check:{
						enable:false,
						associate:true,
					},
					view:{
						showLine:true,
						multiSelect:true,
						dblClickExpand:true,
						hover:null,
						rename:true,
						'delete':true,
					},
					callback:{

					}
				},
				treeInterface:null,
			}
		},
		model:{
			prop:'nodes',
			event:'update',
		},
		components:{
			HkucTreeNode
		},
		computed:{
			_setting() {
				return extend(true,{},this.defaultSetting, this.setting);
			},
			node(){
				console.log("getNode");
				return {
					children:this.nodes
				}
			},
		},
		created(){
			this.treeInterface = new hkucTreeInterface(this);
		},
		destroyed(){
			this.treeInterface.destructor();
		}
	}
</script>