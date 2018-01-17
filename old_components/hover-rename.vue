<template>
	<span class="fa fa-edit" @click.stop="editName"></span>
</template>

<script>
	export default {
		props:['node','interface'],
		methods:{
			editName(){
				if(!this['interface'].getState('isEditing')) {
					this['interface'].editName();
				}
			}
		}
	}
</script>