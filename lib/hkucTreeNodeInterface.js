export default class hkucTreeNodeInterface {
	constructor(hkucTreeNodeVm) {
		this.vm = hkucTreeNodeVm;

		this.treeInterface = this.vm.treeInterface;
		this.id = this.treeInterface.getNextNodeIndex();
		this.parent_id = this.vm.parentInterface && this.vm.parentInterface.id;

		console.log('construct',this.id,this.vm.node.name, this.parent_id);

		this.treeInterface._registerNodeInterface(this.id, this, this.parent_id);
	}

	destructor() {
		this.vm = null;
		this.treeInterface = null;
	}

	getState(key=undefined){
		if(key === undefined){
			return this.vm.nodeState;
		}
		return this.vm.nodeState[key];
	}

	setState(key,value){
		this.vm.nodeState[key] = value;
	}

	getData(){
		return this.vm.node;
	}

	switchExpand(...args){
		if(!this.vm)return;
		if (this.treeInterface._callback('before.switchExpand',...args) === false) {
			return false;
		}

		let [expand] = args;
		if(expand === undefined){
			expand = !this.getState('isOpen');
		}
		this.setState('isOpen', !!expand);

		this.treeInterface._callback('after.switchExpand', ...args);
	}

	select(...args){
		if (!this.vm) return;
		if (this.treeInterface._callback('before.select', ...args) === false) {
			return false;
		}

		let [selected,isMulti] = args;

		if(isMulti){
			if(this.getState('isSelected')){
				this.treeInterface.setSelected(false,this.id);
			}
			else{
				this.treeInterface.setSelected(true,this.id);
			}
		}
		else{
			this.treeInterface.setSelected(false);
			this.treeInterface.setSelected(true,this.id);
		}

		this.treeInterface._callback('after.select', ...args);
	}

	check(...args){
		if (!this.vm) return;
		if (this.treeInterface._callback('before.check', ...args) === false) {
			return false;
		}

		let [checked] = args;

		if(checked === undefined){
			checked = this.getState('isChecked') === false;
		}

		this.setState('isChecked',checked);

		if (this.vm.setting.check.associate) {
			this.treeInterface.descendantCheck(this.id, checked);
		}

		this.treeInterface._callback('after.check', ...args);
	}

	addChild(child,index = -1){
		if (!this.vm) return;
		if(!(this.vm.node.hasOwnProperty('children'))){
			this.vm.$set(this.vm.node,'children',[child]);
		}
		else{
			if(index === -1){
				this.vm.node.children.push(child);
			}
			else{
				this.vm.node.children.splice(index,0,child);
			}
		}
	}

	editName(...args){
		if (!this.vm) return;
		if(args.length>0){
			this.vm.node[this.vm.setting.data.key.name] = args[0];
			return true;
		}

		if (this.treeInterface._callback('before.editName', ...args) === false) {
			return false;
		}

		this.vm.newName = this.vm.node[this.vm.setting.data.key.name];
		this.setState('isEditing',true);
		this.vm.$nextTick(()=>{
			this.vm.$refs['name-input'].focus();
		});
	}

	_editName(...args){
		if (!this.vm) return;
		let [newName] = args;

		if(newName === this.vm.node[this.vm.setting.data.key.name]){
			this.treeInterface._callback('after.editName');
			return;
		}

		if(newName !== undefined){
			this.vm.node[this.vm.setting.data.key.name] = newName;
		}

		this.treeInterface._callback('after.editName', ...args)
	}

	remove(...args) {
		if (!this.vm) return;
		if (this.treeInterface._callback('before.delete', ...args) === false) {
			return false;
		}

		let treeInterface = this.treeInterface;

		this.treeInterface.removeNode(this.id,this.parent_id);

		treeInterface._callback('after.delete', ...args);
	}

	_operate(operation,...args){
		if(typeof(this[operation]) === 'function'){
			return this[operation](...args);
		}
		else{
			console.error(`未定义的操作 hkucTreeNodeInterface::${operation}`)
		}
	}
}