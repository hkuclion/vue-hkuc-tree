export default class HkucTreeInterface{
	constructor(setting){
		this.vmList = {};
		this.setting=setting;

		this.nodeIdMap = new WeakMap();
		this.idData = {};

		this.checkedIds = [];

		this.nextNodeIndex = 0;
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

	removeNode(id){
		let parent_id = this.vmList[id].parentId;
		let index = this.vmList[parent_id].childNodeIds.indexOf(id);

		let closest_ids = this.getChildrenIds(id,true)

		this.vmList[parent_id].node.children.splice(index,1);
		this.vmList[parent_id].childNodeIds.splice(index, 1);

		for(let closest_id of closest_ids){
			delete this.vmList[closest_id];
		}
	}

	getChildrenIds(id, include_self = false){
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

	setNodeOpen(id,isOpen) {
		this.vmList[id].state.isOpen = isOpen;
	}

	setNodeChecked(id,isChecked){
		this.vmList[id].state.isChecked = isChecked;

		if (this.setting.check.associate) {
			this.setDescendantChecked(id, isChecked);
		}

		this.checkedIds = Object.values(this.vmList).filter(vm=>vm.state.isChecked).map(vm=>vm.id);
	}

	setDescendantChecked(id, isChecked){
		if(this.setting.check.associate === true || this.setting.check.associate === 'children') {
			let descendant_ids = this.getChildrenIds(id, false);

			for (let descendant_id of descendant_ids) {
				this.vmList[descendant_id].state.isChecked = isChecked;
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
							checked = this.vmList[child_id].state.isChecked;
						}
						else {
							if (checked !== this.vmList[child_id].state.isChecked) {
								checked = 'intermediate';
								break;
							}
						}
					}

					if (checked !== undefined) {
						this.vmList[parent_id].state.isChecked = checked;
						if (checked === 'intermediate') {
							parent_check = 'intermediate';
						}
					}
				}
				else {
					this.vmList[parent_id].state.isChecked = parent_check;
				}
				parent_id = this.vmList[parent_id].parentId;
			}
		}
	}

	setNodeHover(isHover){
		this.vmList[id].state.isHover = isHover;
	}

	setNodeSelected(isSelected,isDelta){
		this.vmList[id].state.isSelected = isSelected;
	}
}