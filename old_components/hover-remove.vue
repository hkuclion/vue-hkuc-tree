<template>
	<span class="fa fa-trash" style="color: red;" @click.stop="removeNode"></span>
</template>

<script>
	export default {
		props:['node','interface'],
		methods:{
			removeNode(){
				this['interface'].remove();
			}
		}
	}
</script>