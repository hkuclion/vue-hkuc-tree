<template>
	<div id="app">
		<hkuc-tree
			:nodes="treeNodes"
			:setting="treeSetting"
		></hkuc-tree>
	</div>
</template>

<script>
	import HkucTree from '@/vue-hkuc-tree/components/hkuc-tree';

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
							{name:"u"},
							{
								name:"c",
								children:[
									{name:'a'},
									{name:'b'},
									{name:'c'}
								]
							},
						]
					},
					{name:'lion'},
				],
				treeSetting:{},
			}
		},
		components:{
			HkucTree
		}
	}
</script>

<style>
	body {
		margin: 0;
		padding: 0;
	}
</style>
