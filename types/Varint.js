const TranscodableType = require('../Type');
const Exceptions = require('../exceptions');

const varint = require('varint');

/**
 * @class
 * A variable length encoded integer.
 * @description Equivalent to Protobuf's Varint.
 * @augments TranscodableType
 */
class Varint extends TranscodableType {
	compiledEncoder(source_var){
		return `if(typeof ${source_var} !== 'number')
			throw new Exceptions.InvalidEncodeValue('Varint expected a number, got '+(typeof ${source_var}));
		varint.encode(${source_var}, buffer, position);
		position += varint.encode.bytes;`;
	}
	compiledDecoder(target_var){
		return `${target_var} = varint.decode(buffer, position);
		position += varint.decode.bytes;`
	}
}

module.exports = Varint;