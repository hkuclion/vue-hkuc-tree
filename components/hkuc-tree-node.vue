<template>
	<li>
		<a class="tree-node">
			<span
				class="tree-node-name"
				:title="node[setting.data.key.title]"
			>{{node[setting.data.key.name]}}</span>
		</a>
		<ul
			v-if="node[setting.data.key.children] && node[setting.data.key.children].length"
			class="tree-node-children"
			:class="{'tree-line':levelIndex !== levelCount-1}"
		>
			<hkuc-tree-node
				ref="child-node"
	            v-for="(childNode,index) in node[setting.data.key.children]"
	            v-model="node[setting.data.key.children][index]"
	            :key="index"
	            :setting="setting"
	            :level="level+1"
	            :level-count="node[setting.data.key.children].length"
	            :level-index="index"
			>
			</hkuc-tree-node>
		</ul>
	</li>
</template>

<script>
	export default {
		name:'hkuc-tree-node',
		props:[
			'node','setting','isRoot','level','levelIndex','levelCount'
		],
		model:{
			prop:'node',
			event:'update',
		},
	}
</script>