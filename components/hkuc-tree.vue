<template>
	<hkuc-tree-node-root
		v-if="rootId"
		v-model="rootNode"
		:setting="mergedSetting"
		:id="rootId"
		:treeInterface="treeInterface"
	/>
</template>

<script>
	import HkucTreeInterface from '../lib/HkucTreeInterface';
	import HkucTreeNodeRoot from "./hkuc-tree-node-root";
	import 'font-awesome/css/font-awesome.min.css';
	import '@/assets/hkuc-tree.css';
	import extend from 'extend';

	let defaultSetting = {
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
		callback:{}
	};

	export default {
		props:['setting','nodes'],
		name:"hkuc-tree",
		data(){
			return {
				rootNode:null,
				rootId:null,
				treeInterface:null,
				mergedSetting:null,
			}
		},
		components:{
			HkucTreeNodeRoot,
		},
		model:{
			prop:'nodes',
			event:'update',
		},
		mounted(){
			this.mergedSetting = extend(true,{},defaultSetting,this.setting);
			this.treeInterface = new HkucTreeInterface(this.mergedSetting);

			this.rootNode = {
				children:this.nodes
			};

			this.rootId=this.treeInterface.registerNode(this.rootNode);
		},
		destroyed() {
			this.treeInterface.destructor();
		}
	}
</script>

<style scoped>

</style>