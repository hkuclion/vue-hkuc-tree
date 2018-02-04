<template>
	<div id="app">
		<hkuc-tree
			ref="tree"
			v-model="treeNodes"
			:setting="treeSetting"

			@command = "treeCommand"
		>
		</hkuc-tree>

		<button v-show="false" @click="getChecked">获取Checked</button>
	</div>
</template>

<script>
	import hkucTree from '@/components/hkuc-tree';
	//import hoverId from '@/custom_hover/hover-id';
	import hoverAdd from '@/custom_hover/hover-add';
	import hoverHide from '@/custom_hover/hover-hide';

	export default {
		name:'app',
		data(){
			return {
				treeNodes:[
					{
						name:'hkuc',
						open:true,
						checked:'intermediate',
						children:[
							{name:"h"},
							{name:"k"},
							{
								name:"u",
								open:false,
								children:[
									{name:'a', id:1},
									{name:'b', id:1},
									{name:'c', id:1},
								]
							},
							{
								name:"d",
							},
						]
					},
					{name:'lion'},
					{name:'ligueston'},
				],
				treeSetting:{
					data:{
						state:{
							isOpen:'open',
							isChecked:'checked',
						}
					},
					check:{
						enable:true,
						associate:true
					},
					view:{
						hover:[
							hoverAdd,
							//hoverId,
							hoverHide,
						]
					}
				},
			}
		},
		methods:{
			getChecked(){
				console.log(JSON.parse(JSON.stringify(this.$refs['tree'].api.getChecked())));
			},
			treeCommand(api,command,...args){
				this[command](api,...args);
			},
			addChild(api,parentNode){
				api.addChild(parentNode,{
					name:new Date().toLocaleString()
				});
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
