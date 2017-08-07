export default class hkucTreeInterface{
	constructor(hkucTreeVm){
		this.vm = hkucTreeVm;
	}

	destructor(){
		this.vm = null;
	}
}