export default class hkucTreeNodeInterface {
	constructor(hkucTreeNodeVm) {
		this.vm = hkucTreeNodeVm;
	}

	destructor() {
		this.vm = null;
	}

	switchExpand(...args){
		let [expand] = args;

		if (this._callback('beforeSwitchExpand',...args) === false) {
			return false;
		}

		if(expand === undefined){
			expand = !this.vm.nodeState.isOpen;
		}
		this.vm.nodeState.isOpen = !!expand;

		this._callback('afterSwitchExpand', ...args);
	}

	_callback(callback,...args){
		if(!typeof(this.vm.setting.callback[callback])==='function') {
			return this.vm.setting.callback[callback].call(this.vm, ...args);
		}
	}

	_operate(operation,...args){
		if(typeof(this[operation]) === 'function'){
			this[operation](...args);
		}
		else{
			console.error(`未定义的操作 hkucTreeNodeInterface::${operation}`)
		}
	}
}