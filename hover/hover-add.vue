<template>
	<span class="fa fa-plus-circle" @click.stop="add"></span>
</template>

<script>
	export default {
		props:['node','api'],
		methods:{
			add(){
				this.api.$emit('addChild',this.node);
			}
		}
	}
</script>