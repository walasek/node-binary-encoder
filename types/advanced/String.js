const Data = require('../Data');
const Exceptions = require('../../exceptions');

/**
 * @class
 * A UTF-8 string type.
 * @description Wraps {@link Data} with string conversion functions.
 * @augments Data
 * @augments TranscodableArray
 * @augments TranscodableType
 */
class StringType extends Data {
	encode(object, buffer, offset){
		let as_buf = Buffer.from(object, 'utf8');
		if(this.size && as_buf.length < this.size){
			// Pad with null bytes
			as_buf = Buffer.concat([as_buf, Buffer.alloc(this.size-as_buf.length, 0)]);
		}
		if(this.size && as_buf.length > this.size){
			throw new Exceptions.InvalidEncodeValue('Encoded string is too big to fit in '+this.size+' bytes.');
		}
		return super.encode(as_buf, buffer, offset);
	}
	decode(buffer, offset){
		const firstNull = buffer.indexOf(0);
		if(firstNull !== -1)
			return super.decode(buffer.slice(0, firstNull), offset).toString('utf8');
		return super.decode(buffer, offset).toString('utf8');
	}
}

module.exports = StringType;