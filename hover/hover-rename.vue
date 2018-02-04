<template>
	<span class="fa fa-edit" @click.stop="editName"></span>
</template>

<script>
	import HoverBase from './hover-base';

	export default {
		extends:HoverBase,
		methods:{
			editName(){
				this.api.editName(this.node)
			}
		}
	}
</script>