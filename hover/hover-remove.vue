<template>
	<span class="fa fa-trash" style="color: red;" @click.stop="remove"></span>
</template>

<script>
	import HoverBase from './hover-base';

	export default {
		extends:HoverBase,
		methods:{
			remove(){
				this.api.remove(this.node)
			}
		}
	}
</script>