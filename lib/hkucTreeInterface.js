export default class hkucTreeInterface{
	constructor(hkucTreeVm){
		this.vm = hkucTreeVm;

		this.nodeMap = {};
		this.childrenMap = {};
		this.selectedIds = [];

		this.nextNodeIndex = 1;
	}

	destructor(){
		this.vm = null;
		for(let id of Object.keys(this.nodeMap)){
			this.nodeMap[id].destructor();
		}
	}

	registerNode(node){
		if(!this.nodes){
			this.nodes = [];
		}

		let index = this.nodes.indexOf(node);
		console.log(this.nodes,node,index,node.name);
		if(index === -1){
			this.nodes.push(node);
		}
		return this.nodes.length-1;
	}

	getNextNodeIndex(){
		return ++this.nextNodeIndex;
	}

	setSelected(selected,id = undefined){
		if(id === undefined){
			for(let selected_id of this.selectedIds){
				this.nodeMap[selected_id].setState('isSelected', selected);
			}
			this.selectedIds = [];
		}
		else{
			if(!this.nodeMap[id])return;
			this.nodeMap[id].setState('isSelected',selected);
			if(selected){
				this.selectedIds.push(id);
			}
			else{
				this.selectedIds = this.selectedIds.filter(selected_id => selected_id !== id);
			}
		}
	}

	descendantCheck(id,checked){
		let descendant_ids = this._getChildIds(id,false);

		for (let descendant_id of descendant_ids) {
			this.nodeMap[descendant_id].setState('isChecked', checked);
		}

		let parent_id = this.nodeMap[id].parent_id;
		let parent_check = undefined;
		while (parent_id) {
			if (parent_check === undefined) {
				let child_ids = this.childrenMap[parent_id];
				let checked = undefined;

				for (let child_id of child_ids) {
					if (checked === undefined) {
						checked = this.nodeMap[child_id].getState('isChecked');
					}
					else {
						if (checked !== this.nodeMap[child_id].getState('isChecked')) {
							checked = 'intermediate';
							break;
						}
					}
				}

				if (checked !== undefined) {
					this.nodeMap[parent_id].setState('isChecked', checked);
					if (checked === 'intermediate') {
						parent_check = 'intermediate';
					}
				}
			}
			else {
				this.nodeMap[parent_id].setState('isChecked', parent_check);
			}
			parent_id = this.nodeMap[parent_id].parent_id;
		}
	}

	removeNode(id,parent_id){
		let index = this.nodeMap[id].vm.levelIndex;

		let parent;
		if(parent_id === undefined){
			parent= this.vm.node;
		}
		else{
			parent = this.nodeMap[parent_id].vm.node;
		}

		this.vm.$set(parent.children,index,null);

		let delete_ids = this._getChildIds(id, true);
		for (let delete_id of delete_ids) {
			this.nodeMap[delete_id].destructor();
			delete this.nodeMap[delete_id];
			delete this.childrenMap[delete_id];
		}

		if (parent_id === undefined) {
			parent_id = 'root'
		}
		this.childrenMap[parent_id] = this.childrenMap[parent_id].filter(child_id => child_id !== id);
		this.selectedIds = this.selectedIds.filter(select_id => !delete_ids.includes(select_id));
	}

	_registerNodeInterface(id,node,parent_id){
		this.nodeMap[id] = node;

		if(parent_id === undefined)parent_id = 'root';
		if(!this.childrenMap.hasOwnProperty(parent_id)){
			this.childrenMap[parent_id] = [];
		}
		this.childrenMap[parent_id].push(id);
	}

	_command(command,...args){
		this.vm.$emit(command,...args);
	}

	_callback(callback, ...args) {
		if (typeof(this.vm._setting.callback[callback]) === 'function') {
			return this.vm._setting.callback[callback].call(this.vm, ...args);
		}
	}

	_getChildIds(id,include_self = false){
		let ret = [];
		let process_ids = [id];

		while (process_ids.length) {
			let id = process_ids.shift();
			ret.push(id);
			if (this.childrenMap[id]) {
				process_ids.push(...this.childrenMap[id]);
			}
		}
		if(!include_self) ret.shift();
		return ret;
	}
}