<template>
	<li :class="{'node-line':!hasChildren,['tree-level-'+level]:true}">
		<span
			class="tree-node-expand fa"
			:class="{
					'fa-blank':!hasChildren,
					'fa-plus-square-o':hasChildren && !nodeState.isOpen,
					'fa-minus-square-o':hasChildren && nodeState.isOpen
				}"
			:style="{
					'cursor':hasChildren?'pointer':'default'
				}"
			@click="expandSwitch"
		></span><span
			v-if="setting.check.enable"
			class="tree-node-check fa"
			:class="{
				'fa-square-o':nodeState.isChecked === false,
				'fa-check-square-o':nodeState.isChecked === true,
				'fa-check-square':nodeState.isChecked === 'intermediate'
			}"
			@click="checkNode"
		></span><a
			class="tree-node"
			@click="selectNode"
			@dblclick="setting.view.dblClickExpand?expandSwitch($event):null"
			@mouseenter="hoverNode(true)"
			@mouseleave="hoverNode(false)"
			:class="{selected:nodeState.isSelected}"
			>
			<span
				class="tree-node-icon fa"
				:class="{
					'fa-file-o':!hasChildren,
					'fa-folder-o':hasChildren && !nodeState.isOpen,
					'fa-folder-open-o':hasChildren && nodeState.isOpen
				}"
			></span><span
				class="tree-node-name"
				:title="node[setting.data.key.title]"
				v-if="!nodeState.isEditing"
			>{{node[setting.data.key.name]}}</span><span v-else>
				<input ref="name-input" class="tree-node-name-input" type="text" v-model="newName" @keydown="_editKeyDown" @blur="cancelEdit(false)">
			</span><span
				class="tree-node-hover"
				v-show="nodeState.isHover || nodeState.isSelected"
			>
				<span
					class="tree-node-hover-item"
					v-if="setting.view.rename && (typeof(setting.view.rename) !== 'function' || typeof(setting.view.rename) === 'function' && setting.view.rename(nodeInterface,node))"
				>
					<component
						:is="typeof(setting.view.rename) !== 'object'?'hover-rename':setting.view.rename"
						:node="node"
						:interface="nodeInterface"
						@command="_command"
					></component>
				</span><span
					class="tree-node-hover-item"
					v-if="setting.view.delete && (typeof(setting.view.delete) !== 'function' || typeof(setting.view.delete) === 'function' && setting.view.delete(nodeInterface,node))"
				>
					<component
						:is="typeof(setting.view.delete) !== 'object'?'hover-remove':setting.view.delete"
						:node="node"
						:interface="nodeInterface"
						@command="_command"
					></component>
				</span><span
					class="tree-node-hover-item"
					v-for="hover in setting.view.hover"
					v-if="setting.view.hover && Array.isArray(setting.view.hover)"
				>
					<component
						v-if="typeof(hover) === 'object'"
						:is="hover"
						:node="node"
						:interface="nodeInterface"
						@command="_command"
					></component>
					<template v-else>{{hover}}</template>
				</span>
			</span>
		</a>
		<ul
			v-if="hasChildren"
			v-show="nodeState.isOpen"
			class="tree-node-children"
		>
			<hkuc-tree-node
				ref="child-node"
				v-if="node[setting.data.key.children][index]"
	            v-for="(childNode,index) in node[setting.data.key.children]"
	            v-model="node[setting.data.key.children][index]"
	            :key="index"
	            :setting="setting"
	            :level="level+1"
	            :level-count="node[setting.data.key.children].length"
	            :level-index="index"
				:tree-interface="treeInterface"
				:parent-interface="nodeInterface"
			>
			</hkuc-tree-node>
		</ul>
		<hkuc-tree-dummy
			:tree-interface="treeInterface"
			:parent-interface="nodeInterface"
		>
		</hkuc-tree-dummy>
	</li>
</template>

<script>
	import hkucTreeNodeInterface from '../lib/hkucTreeNodeInterface';
	import hkucTreeDummy from './hkuc-tree-dummy.vue';
	import hoverRename from './hover-rename.vue';
	import hoverRemove from './hover-remove.vue';

	export default {
		name:'hkuc-tree-node',
		components:{
			hkucTreeDummy,
			hoverRename,
			hoverRemove
		},
		data(){
			return {
				nodeState:{
					isOpen:true,
					isSelected:false,
					isChecked:false,
					isHover:false,
					isEditing:false,
				},
				newName:null,
				nodeInterface:null,
			}
		},
		props:[
			'node','setting','level','levelIndex','levelCount','treeInterface','parentInterface','id'
		],
		computed:{
			hasChildren(){
				return this.node[this.setting.data.key.children] && this.node[this.setting.data.key.children].length;
			},
		},
		model:{
			prop:'node',
			event:'update',
		},
		methods:{
			expandSwitch(expand){
				if(expand instanceof Event){
					expand = undefined;
				}
				this.nodeInterface._operate('switchExpand', expand);
			},
			selectNode(selected,isMulti=false){
				if(selected instanceof Event){
					isMulti = selected.ctrlKey;
					selected = true;
				}

				this.nodeInterface._operate('select', selected, isMulti);
			},
			checkNode(checked){
				if (checked instanceof Event) {
					checked = undefined
				}

				this.nodeInterface._operate('check', checked);
			},
			hoverNode(hover){
				this.nodeState.isHover = hover;
			},
			cancelEdit(is_cancel=false){
				if (this.nodeState.isEditing) {
					this.nodeInterface._editName(is_cancel ? undefined : this.newName);
					this.nodeState.isEditing = false;
				}
			},
			_editKeyDown(event){
				if(event.keyCode === 13){
					this.cancelEdit(false);
				}
				else if(event.keyCode === 27){
					this.cancelEdit(true);
				}
			},
			_command(...args){
				this.treeInterface._command(...args);
			}
		},
		created() {
			this.nodeInterface = new hkucTreeNodeInterface(this);
		},
	}
</script>