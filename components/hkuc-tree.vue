<template>
	<ul
		class="hkuc-ztree"
		:class="{'tree-line':_setting.view.showLine}"
		v-if="nodes && nodes.length"
	>
		<hkuc-tree-node
			ref="child-node"
			v-for="(node,index) in nodes"
			v-model="nodes[index]"
			:setting="_setting"
			:key="index"
			:level="0"
			:level-count="nodes.length"
			:level-index="index"
		></hkuc-tree-node>
	</ul>
</template>

<style src="../assets/hkuc-tree.css"></style>
<style src="font-awesome/css/font-awesome.css"></style>

<script>
	import HkucTreeNode from './hkuc-tree-node';
	import hkucTreeInterface from '../lib/hkucTreeInterface';

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
					view:{
						showLine:true,
					}
				},
				treeInterface:null
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
				return deepAssign(this.defaultSetting, this.setting);
			},
			node(){
				console.log("getNode");
				return {
					children:this.nodes
				}
			}
		},
		mounted(){
			this.treeInterface = new hkucTreeInterface(this);
		},
		destroyed(){
			if(this.treeInterface) {
				this.treeInterface.destructor();
				this.treeInterface = null;
			}
		}
	}

	function deepAssign(obj1, obj2) {
		if (typeof obj1 !== 'object') obj1 = {};
		if (typeof obj2 !== 'object') obj2 = {};
		let result = Object.assign({}, obj1);

		for (let key of Object.keys(obj2)) {
			if (!obj1.hasOwnProperty(key) || obj1[key] === null || typeof obj2[key] !== typeof obj1[key] || typeof obj2[key] !== 'object' || Array.isArray(obj2[key])) {
				result[key] = obj2[key];
			}
			else {
				result[key] = deepAssign(result[key], obj2[key]);
			}
		}

		return result;
	}
</script>