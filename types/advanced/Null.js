const TranscodableType = require('../../Type');

// A dummy type
class NullType extends TranscodableType {
	compiledEncoder(){
		return '';
	}
	compiledDecoder(){
		return '';
	}
}

module.exports = NullType;