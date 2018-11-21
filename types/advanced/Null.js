const TranscodableType = require('../../Type');

// A dummy type
class NullType extends TranscodableType {
	encode(){
		this.last_bytes_encoded = 0;
		return Buffer.from([]);
	}
	decode(){
		this.last_bytes_decoded = 0;
		return null;
	}
}

module.exports = NullType;