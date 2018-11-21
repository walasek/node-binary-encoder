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
		if(typeof object !== 'number')
			throw new Exceptions.InvalidEncodeValue('Expected a number, got '+(typeof object));
		const result = Buffer.from(varint.encode(object, buffer, offset));
		this.last_bytes_encoded = varint.encode.bytes;
		return result;
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
}

module.exports = Varint;