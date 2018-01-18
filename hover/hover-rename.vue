<template>
	<span class="fa fa-edit" @click.stop="editName"></span>
</template>

<script>
	export default {
		props:['node','api'],
		methods:{
			editName(){
				this.api.editName(this.node)
			}
		}
	}
</script>