export default class HkucTreeApi{
	constructor(provider){
		this.provider = provider;
	}

	addChild(node,newNodeData,index = -1){
		let node_id = this.provider.getId(node);

		this.provider.addChildNode(node_id, newNodeData,index);
	}

	remove(node){
		let node_id = this.provider.getId(node);

		this.provider.removeNode(node_id);
	}

	editName(node){
		let node_id = this.provider.getId(node);

		this.provider.editNodeName(node_id);
	}

	getChecked(){
		return this.provider.getCheckedNodes();
	}
}