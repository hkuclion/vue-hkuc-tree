<template>
	<span class="fa fa-trash" style="color: red;" @click.stop="remove"></span>
</template>

<script>
	export default {
		props:['node','api'],
		methods:{
			remove(){
				this.api.remove(this.node)
			}
		}
	}
</script>