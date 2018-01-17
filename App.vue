<template>
	<div id="app">
		<hkuc-tree
			v-model="treeNodes"
			:setting="treeSetting"
			@addChild = "addChild"
		>
		</hkuc-tree>
	</div>
</template>

<script>
	import hkucTree from '@/components/hkuc-tree';
	import hoverId from '@/hover/hover-id';
	import hoverAdd from '@/hover/hover-add';

	export default {
		name:'app',
		data(){
			return {
				treeNodes:[
					{
						name:'hkuc',
						children:[
							{name:"h"},
							{name:"k"},
							{name:"u", children:[
								{name:'a', id:1},
								{name:'b', id:1},
								{name:'c', id:1},
							]},
							{
								name:"d",
							},
						]
					},
					{name:'lion'},
					{name:'ligueston'},
				],
				treeSetting:{
					check:{
						enable:true,
						associate:true
					},
					view:{
						hover:[
							hoverAdd,hoverId
						]
					}
				},
			}
		},
		methods:{
			addChild(nodeInterface,node){
				let name = prompt('请输入新节点的名称',node.name);
				if(name){
					nodeInterface.addChild({name});
				}
			}
		},
		components:{
			hkucTree,
		}
	}
</script>

<style>
	body {
		margin: 0;
		padding: 0;
	}
	#app{
		padding: 10px;
	}
</style>
