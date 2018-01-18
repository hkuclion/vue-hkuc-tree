<template>
	<span>{{api.provider.getId(node)}}</span>
</template>

<script>
	export default {
		props:['node','api'],
	}
</script>