<template>
	<span class="fa fa-eye-slash" @click.stop="hide"></span>
</template>

<script>
	import HoverBase from '../hover/hover-base';

	export default {
		extends:HoverBase,
		name:"hover-hide",
		methods:{
			hide() {
				this.api.hide(this.node);
			}
		},
	}
</script>

<style scoped>

</style>