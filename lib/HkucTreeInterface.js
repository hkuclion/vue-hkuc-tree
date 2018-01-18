import HkucTreeApi from "./HkucTreeApi";

export default class HkucTreeInterface{
	constructor(setting){
		this.vmList = {};
		this.setting=setting;

		this.nodeIdMap = new WeakMap();
		this.idData = {};

		this.checkedIds = [];
		this.selectedIds = [];

		this.nextNodeIndex = 0;

		this.api = new HkucTreeApi(this);
	}

	destructor() {
		this.vmList = null;
		this.nodeIdMap = null;
	}

	registerNode(node,parent_id=0){
		let exist_id = this.nodeIdMap.get(node);
		if(exist_id)return exist_id;
		let new_id = ++this.nextNodeIndex;

		this.idData[new_id] = {
			parentId:parent_id,
			level:this.vmList[parent_id]?this.vmList[parent_id].level+1:0
		};

		this.nodeIdMap.set(node,new_id);
		return new_id;
	}

	registerVm(id,vm){
		this.vmList[id] = vm;
		Object.assign(this.vmList[id], this.idData[id]);
		delete this.idData[id];
	}

	/*MANIPULATE*/

	removeNode(id){
		let $vm = this.vmList[id];
		let parent_id = $vm.parentId;
		let $parentVm = this.vmList[parent_id];

		let index = $parentVm.childNodeIds.indexOf(id);

		let closest_ids = this.getChildrenIds(id,true);

		$parentVm.node.children.splice(index,1);
		$parentVm.childNodeIds.splice(index, 1);

		for(let closest_id of closest_ids){
			delete this.vmList[closest_id];
		}
	}

	addChildNode(parent_id,new_data,index = -1){
		let $parentVm = this.vmList[parent_id];
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
	}

	editNodeName(id){
		let $vm = this.vmList[id];
		let nameKey = this.setting.data.key.name;

		$vm.newName = $vm.node[nameKey];
		$vm.state.isEditing = true;
		$vm.$nextTick(() => {
			$vm.$refs['name-input'].focus();
		});
	}

	renameNode(id,newName){
		let $vm = this.vmList[id];
		let nameKey = this.setting.data.key.name;
		$vm.$set($vm.node,nameKey,newName);
	}

	/*SET*/

	setNodeOpen(id,isOpen) {
		this.setNodeState(id, 'isOpen', isOpen);
	}

	setNodeChecked(id,isChecked){
		this.setNodeState(id,'isChecked', isChecked);

		if (this.setting.check.associate) {
			this.setDescendantChecked(id, isChecked);
		}

		this.checkedIds = Object.values(this.vmList).filter(vm=>vm.state.isChecked).map(vm=>vm.id);
	}

	setDescendantChecked(id, isChecked){
		if(this.setting.check.associate === true || this.setting.check.associate === 'children') {
			let descendant_ids = this.getChildrenIds(id, false);

			for (let descendant_id of descendant_ids) {
				this.setNodeState(descendant_id,'isChecked', isChecked);
			}
		}

		if (this.setting.check.associate === true || this.setting.check.associate === 'parent') {
			let parent_id = this.vmList[id].parentId;
			let parent_check = undefined;
			while (parent_id) {
				if (parent_check === undefined) {
					let child_ids = this.vmList[parent_id].childNodeIds;
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
					this.setNodeState(id, 'isChecked', parent_check);
				}
				parent_id = this.vmList[parent_id].parentId;
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
		this.vmList[id].state[stateName] = value;
	}

	getNodeState(id,stateName = undefined){
		if(!stateName)return this.vmList[id].state;
		return this.vmList[id].state[stateName];
	}

	getId(node){
		if(typeof(node) === 'number')return node;
		else if(typeof (node) === 'object') return this.nodeIdMap.get(node);
		return -1;
	}

	getChildrenIds(id, include_self = false) {
		let ret = [];
		let process_ids = [id];

		while (process_ids.length) {
			let id = process_ids.shift();
			ret.push(id);
			if (this.vmList[id].childNodeIds) {
				process_ids.push(...this.vmList[id].childNodeIds);
			}
		}
		if (!include_self) ret.shift();
		return ret;
	}

	/*API*/

	getCheckedNodes(){
		return this.checkedIds
			.filter(checkedId=> checkedId!==1)
			.sort((checkedId1, checkedId2)=> this.vmList[checkedId1].level- this.vmList[checkedId2].level)
			.map(checkedId=>this.vmList[checkedId].node)
	}
}