<template>
	<span>{{api.getId(node)}}</span>
</template>

<script>
	export default {
		props:['node','api'],
	}
</script>