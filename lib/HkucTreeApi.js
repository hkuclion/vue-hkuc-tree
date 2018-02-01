let ProviderSymbol = Symbol('Provider');

export default class HkucTreeApi{
	constructor(provider){
		this[ProviderSymbol] = provider;
	}

	/* OPERATE */

	addChild(node,newNodeData,index = -1){
		let node_id = this.getId(node);

		this[ProviderSymbol].addChildNode(node_id, newNodeData,index);
	}

	remove(node){
		let node_id = this.getId(node);

		this[ProviderSymbol].removeNode(node_id);
	}

	editName(node){
		let node_id = this.getId(node);

		this[ProviderSymbol].editNodeName(node_id);
	}

	$emit(eventName,...args){
		this[ProviderSymbol].$tree.$emit(eventName, ...args);
	}

	/* GET */

	getChecked(){
		return this[ProviderSymbol].getCheckedNodes();
	}

	getId(node){
		return this[ProviderSymbol].getId(node);
	}
}