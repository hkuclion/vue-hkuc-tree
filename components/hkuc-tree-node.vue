<template>
	<li :class="{'node-line':!hasChildren,['tree-level-'+level]:true}" v-show="!state.isHidden">
		<span
			class="tree-node-expand fa"
			:class="expandClass"
			:style="{'cursor':hasChildren?'pointer':'default'}"
			@click="expandSwitch"
		></span><span
			v-if="setting.check.enable"
			class="tree-node-check fa"
			:class="checkClass"
			@click="checkSwitch"
		></span>
		<a
			class="tree-node"
			@click="selectNode"
			@dblclick="setting.view.dblClickExpand?expandSwitch:null"
			@mouseenter="hoverSwitch(true)"
			@mouseleave="hoverSwitch(false)"
			:class="{selected:state.isSelected}"
		>
			<span
				class="tree-node-icon fa"
				:class="typeClass"
			></span><span
				class="tree-node-name"
				:title="node[setting.data.key.title]"
				v-if="!state.isEditing"
			>{{node[setting.data.key.name]}}</span><span v-else>
				<input ref="name-input" class="tree-node-name-input" type="text" v-model="newName" @keydown="_editKeyDown" @blur="cancelEdit(false)">
			</span><span
				class="tree-node-hover"
				v-if="state.isHover || state.isSelected"
			>
				<span
					class="tree-node-hover-item"
					v-if="setting.view.rename && (typeof(setting.view.rename) !== 'function' || typeof(setting.view.rename) === 'function' && setting.view.rename(treeInterface,node))"
				>
					<component
						:is="typeof(setting.view.rename) !== 'object'?'hover-rename':setting.view.rename"
						:node="node"
						:api="treeInterface.api"
					></component>
				</span><span
					class="tree-node-hover-item"
					v-if="setting.view.delete && (typeof(setting.view.delete) !== 'function' || typeof(setting.view.delete) === 'function' && setting.view.delete(treeInterface,node))"
				>
					<component
						:is="typeof(setting.view.delete) !== 'object'?'hover-remove':setting.view.delete"
						:node="node"
						:api="treeInterface.api"
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
						:api="treeInterface.api"
					></component>
					<template v-else>{{hover}}</template>
				</span>
			</span>
		</a>

		<ul
			class="tree-node-children"
			v-if="node.children && childNodeIds"
			v-show="state.isOpen"
		>
			<hkuc-tree-node
				v-for="(childNode,index) in node.children"
				:key="childNodeIds[index]"
				v-model="node.children[index]"
				:treeInterface="treeInterface"
				:id="childNodeIds[index]"
				:setting="setting"
				ref="childNodes"
				:class="{'hkuc-last-child':lastVisibleChildIndex===index}"
			></hkuc-tree-node>
		</ul>
	</li>
</template>

<script>
	import HoverRemove from '../hover/hover-remove';
	import HoverRename from '../hover/hover-rename';

	export default {
		name:"hkuc-tree-node",
		props:['node','id','treeInterface','setting'],
		data(){
			return {
				state:{
					isOpen:true,
					isSelected:false,
					isChecked:false,
					isHover:false,
					isHidden:false,
					isEditing:false,
					isFirst:false,
					isLast:false,
				},

				childNodeIds:null,
				lastVisibleChildIndex:null,
				parentId:null,
				level:0,
			}
		},
		components:{
			HoverRemove,
			HoverRename
		},
		model:{
			prop:'node',
		},
		computed:{
			hasChildren() {
				return this.node[this.setting.data.key.children] && this.node[this.setting.data.key.children].length;
			},
			expandClass(){
				return {
					'fa-blank':!this.hasChildren,
					'fa-plus-square-o':this.hasChildren && !this.state.isOpen,
					'fa-minus-square-o':this.hasChildren && this.state.isOpen
				}
			},
			checkClass(){
				return {
					'fa-square-o':this.state.isChecked === false,
					'fa-check-square-o':this.state.isChecked === true,
					'fa-check-square':this.state.isChecked === 'intermediate'
				}
			},
			typeClass(){
				return {
					'fa-file-o':!this.hasChildren,
					'fa-folder-o':this.hasChildren && !this.state.isOpen,
					'fa-folder-open-o':this.hasChildren && this.state.isOpen
				}
			}
		},
		methods:{
			remove(){
				this.treeInterface.removeNode(this.id)
			},
			expandSwitch(){
				this.treeInterface.setNodeOpen(this.id, !this.state.isOpen);
			},
			checkSwitch(){
				this.treeInterface.setNodeChecked(this.id, !this.state.isChecked);
			},
			hoverSwitch(isHover){
				this.treeInterface.setNodeHover(this.id, isHover);
			},
			selectNode(event){
				let isSelected = true;
				let isDelta = false;
				if(event.ctrlKey){
					isSelected = !this.state.isSelected;
					isDelta = true;
				}

				this.treeInterface.setNodeSelected(this.id, isSelected,isDelta);
			},
			cancelEdit(is_cancel = false){
				if(!is_cancel){
					this.treeInterface.renameNode(this.id,this.newName);
				}
				this.state.isEditing = false;
			},
			_editKeyDown(event){
				if (event.keyCode === 13) {
					this.cancelEdit(false);
				}
				else if (event.keyCode === 27) {
					this.cancelEdit(true);
				}
			},
		},
		mounted(){
			this.treeInterface.registerVm(this.id,this);

			if(this.node.children){
				this.childNodeIds = this.node.children.map(childNode=> this.treeInterface.registerNode(childNode,this.id));
				this.$nextTick(()=>{
					this.lastVisibleChildIndex = this.childNodeIds.indexOf(this.childNodeIds.slice().reverse().find(childNodeId=>this.treeInterface.getNodeState(childNodeId,'isHidden')===false));
				});
			}
		}
	}
</script>

<style scoped>

</style>