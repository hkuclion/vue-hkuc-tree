<template>
	<span>{{interface.id}}</span>
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