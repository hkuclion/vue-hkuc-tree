<template>
	<span class="fa fa-plus-circle" @click.stop="add"></span>
</template>

<script>
	import HoverBase from '../hover/hover-base';
	export default {
		extends:HoverBase,
		methods:{
			add(){
				this.api.$emit('addChild',this.node);
			}
		}
	}
</script>