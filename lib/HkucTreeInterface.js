import HkucTreeApi from "./HkucTreeApi";

export default class HkucTreeInterface{
	constructor($tree,setting){
		this.vmList = new Map();
		this.setting=setting;

		this.$tree = $tree;

		this.nodeIdMap = new WeakMap();
		this.idData = {};

		this.checkedIds = [];
		this.selectedIds = [];

		this.nextNodeIndex = 0;

		this.api = new HkucTreeApi(this);
	}

	destructor() {
		this.vmList.clear();
		this.nodeIdMap = null;
		this.$tree = null;
	}

	registerNode(node,parent_id=0){
		let exist_id = this.nodeIdMap.get(node);
		if(exist_id)return exist_id;
		let new_id = ++this.nextNodeIndex;

		let $parentVm = this.getVm(parent_id);

		this.idData[new_id] = {
			parentId:parent_id,
			level:$parentVm? $parentVm.level+1:0
		};

		this.nodeIdMap.set(node,new_id);
		return new_id;
	}

	registerVm(id,vm){
		this.vmList.set(id,vm);
		Object.assign(vm, this.idData[id]);
		delete this.idData[id];
	}

	/*MANIPULATE*/

	removeNode(id){
		let $vm = this.getVm(id);
		let parent_id = $vm.parentId;
		let $parentVm = this.getVm(parent_id);

		let index = $parentVm.childNodeIds.indexOf(id);

		let closest_ids = this.getChildrenIds(id,true);

		$parentVm.node.children.splice(index,1);
		$parentVm.childNodeIds.splice(index, 1);

		for(let closest_id of closest_ids){
			this.deleteVm(closest_id);
		}

		this.checkedIds = this.checkedIds.filter(checkedId => !closest_ids.includes(checkedId));
		this.selectedIds = this.selectedIds.filter(selectedId => !closest_ids.includes(selectedId));

		if (this.getNodeState(parent_id, 'isChecked')) {
			$parentVm.$nextTick(() => {
				this.syncNodeChecked(parent_id);
			});
		}
	}

	addChildNode(parent_id,new_data,index = -1){
		let $parentVm = this.getVm(parent_id);
		let new_id = this.registerNode(new_data, parent_id);
		let childrenKey = this.setting.data.key.children;

		if (!($parentVm.node.hasOwnProperty(childrenKey))) {
			$parentVm.childNodeIds = [new_id];
			$parentVm.$set($parentVm.node, childrenKey, [new_data]);
		}
		else {
			if (index === -1 || index >= $parentVm.childNodeIds.length) {
				$parentVm.childNodeIds.push(new_id);
				$parentVm.node[childrenKey].push(new_data);
			}
			else {
				$parentVm.childNodeIds.splice(index, 0, new_id);
				$parentVm.node[childrenKey].splice(index, 0, new_data);
			}
		}

		if(this.getNodeState(parent_id,'isChecked') === true) {
			$parentVm.$nextTick(() => {
				this.syncNodeChecked(parent_id);
			});
		}
	}

	editNodeName(id){
		let $vm = this.getVm(id);
		let nameKey = this.setting.data.key.name;

		$vm.newName = $vm.node[nameKey];
		this.setNodeState(id,'isEditing',true);
		$vm.$nextTick(() => {
			$vm.$refs['name-input'].focus();
		});
	}

	renameNode(id,newName){
		let $vm = this.vmList[id];
		let nameKey = this.setting.data.key.name;
		$vm.$set($vm.node,nameKey,newName);
	}

	/* SYNC */

	syncNodeChecked(id){
		let $vm = this.getVm(id);

		if(!$vm.childNodeIds)return;

		let checkedChildCount = $vm.childNodeIds.filter(childNodeId=>this.getNodeState(childNodeId,'isChecked')).length;

		this.setNodeChecked(id, checkedChildCount === 0?false: checkedChildCount !== $vm.childNodeIds.length?'intermediate':true);
	}

	/*SET*/

	setNodeOpen(id,isOpen) {
		this.setNodeState(id, 'isOpen', isOpen);
	}

	setNodeChecked(id,isChecked){
		let changed = this.setNodeState(id,'isChecked', isChecked);

		if(changed) {
			if (this.setting.check.associate) {
				this.setDescendantChecked(id, isChecked);
			}

			this.checkedIds = [...this.vmList.keys()].filter(id => this.getNodeState(id,'isChecked'));
		}
	}

	setDescendantChecked(id, isChecked){
		if(isChecked !== 'intermediate' && this.setting.check.associate === true || this.setting.check.associate === 'children') {
			let descendant_ids = this.getChildrenIds(id, false);

			for (let descendant_id of descendant_ids) {
				this.setNodeState(descendant_id,'isChecked', isChecked);
			}
		}

		if (this.setting.check.associate === true || this.setting.check.associate === 'parent') {
			let parent_id = this.getVm(id).parentId;
			let parent_check = undefined;
			while (parent_id) {
				if (parent_check === undefined) {
					let child_ids = this.getVm(parent_id).childNodeIds;
					let checked = undefined;

					for (let child_id of child_ids) {
						if (checked === undefined) {
							checked = this.getNodeState(child_id, 'isChecked');
						}
						else {
							if (checked !== this.getNodeState(child_id,'isChecked')) {
								checked = 'intermediate';
								break;
							}
						}
					}

					if (checked !== undefined) {
						this.setNodeState(parent_id, 'isChecked', checked);
						if (checked === 'intermediate') {
							parent_check = 'intermediate';
						}
					}
				}
				else {
					this.setNodeState(parent_id, 'isChecked', parent_check);
				}
				parent_id = this.getVm(parent_id).parentId;
			}
		}
	}

	setNodeHover(id,isHover){
		this.setNodeState(id,'isHover', isHover);
	}

	setNodeSelected(ids,isSelected,isDelta){
		if(!isDelta){
			for(let selected_id of this.selectedIds){
				this.setNodeState(selected_id,'isSelected',false);
			}
			this.selectedIds = [];
		}

		if(!Array.isArray(ids)){
			ids = [ids];
		}
		for(let id of ids) {
			this.setNodeState(id, 'isSelected', isSelected);
		}
		if(isSelected){
			this.selectedIds.push(...ids);
		}
		else{
			this.selectedIds = this.selectedIds.filter(selectedId=>!ids.includes(selectedId));
		}
	}

	/*UTILITY*/

	setNodeState(id,stateName,value){
		let $vm = this.getVm(id);
		if($vm.state[stateName] === value)return false;

		$vm.state[stateName] = value;

		return true;
	}

	getNodeState(id,stateName = undefined){
		let $vm = this.getVm(id);
		if(!stateName)return $vm.state;
		return $vm.state[stateName];
	}

	getId(node){
		if(typeof(node) === 'number')return node;
		else if(typeof (node) === 'object') return this.nodeIdMap.get(node);
		return -1;
	}

	getVm(id){
		return this.vmList.get(id);
	}

	deleteVm(id){
		this.vmList.delete(id);
	}

	getChildrenIds(id, include_self = false) {
		let ret = [];
		let process_ids = [id];

		while (process_ids.length) {
			let id = process_ids.shift();
			ret.push(id);

			let childNodeIds = this.getVm(id).childNodeIds;

			if (childNodeIds && childNodeIds.length) {
				process_ids.push(...childNodeIds);
			}
		}
		if (!include_self) ret.shift();
		return ret;
	}

	getLastVisibleChildIndex(id){
		if(this.vmList[id].childNodeIds){
			return this.vmList[id].childNodeIds.length - 1 - this.vmList[id].childNodeIds.reverse().findIndex(childNodeId=>this.getNodeState(childNodeId,'isHidden')===false);
		}
		return -1;
	}

	/*API*/

	getCheckedNodes(){
		return this.checkedIds
			.filter(checkedId=> checkedId!==1)
			.sort((checkedId1, checkedId2)=> this.getVm(checkedId1).level- this.getVm(checkedId2).level)
			.map(checkedId=> this.getVm(checkedId).node)
	}
}