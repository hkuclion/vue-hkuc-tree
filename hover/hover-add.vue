<template>
	<span class="fa fa-plus-circle" @click.stop="click"></span>
</template>

<script>
	export default {
		props:['node','interface'],
		methods:{
			click(){
				this.$emit('command','addChild',this['interface'],this.node);
			}
		}
	}
</script>