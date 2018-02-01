<template>
	<div id="app">
		<hkuc-tree
			ref="tree"
			v-model="treeNodes"
			:setting="treeSetting"

			@addChild = "addChild"
		>
		</hkuc-tree>

		<button @click="getChecked">获取Checked</button>
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
			getChecked(){
				console.log(JSON.parse(JSON.stringify(this.$refs['tree'].treeInterface.api.getChecked())));
			},
			addChild(parentNode){
				console.log(parentNode);
				console.log(JSON.parse(JSON.stringify(this.$refs['tree'].api.getChecked())));
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
