class TranscodableType {
	constructor(){
		this.last_bytes_encoded = -1;
		this.last_bytes_decoded = -1;
	}
	encode(object, buffer, offset){
		throw Error('Called abstract encode');
	}
	decode(buffer, offset){
		throw Error('Called abstract decode');
	}
}

module.exports = TranscodableType;