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
	encode(object, buffer, offset){
		if(!offset)
			offset = 0;
		if(typeof object !== 'number')
			throw new Exceptions.InvalidEncodeValue('Expected a number, got '+(typeof object));
		if(buffer){
			buffer = varint.encode(object, buffer, offset);
		}else{
			buffer = Buffer.from(varint.encode(object));
		}
		this.last_bytes_encoded = varint.encode.bytes;
		return buffer;
	}
	decode(buffer, offset){
		try {
			const value = varint.decode(buffer, offset);
			this.last_bytes_decoded = varint.decode.bytes;
			return value;
		}catch(err){
			throw new Exceptions.InvalidDecodeBuffer('Could not decode Varint buffer');
		}
	}
	compiledEncoder(source_var){
		return `varint.encode(${source_var}, buffer, position);
		position += varint.encode.bytes;`;
	}
	compiledDecoder(target_var){
		return `${target_var} = varint.decode(buffer, position);
		position += varint.decode.bytes;`
	}
}

module.exports = Varint;