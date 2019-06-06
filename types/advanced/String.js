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
		const firstNull = buffer.indexOf(0, offset);
		if(firstNull !== -1)
			return super.decode(buffer.slice(offset, firstNull), 0, true).toString('utf8');
		return super.decode(buffer, offset).toString('utf8');
	}
	compiledEncoder(source_var){
		return `
		tmp = Buffer.from(${source_var}, 'utf8');
		${this.size ? `if(tmp.length < ${this.size})
			tmp = Buffer.concat([tmp, Buffer.alloc(${this.size}-tmp.length, 0)]);
		if(tmp.length > ${this.size})
			throw new Exceptions.InvalidEncodeValue('Encoded string is too long to fit in ${this.size} bytes.')` : ''}
		${super.compiledEncoder('tmp')}
		`
	}
}

module.exports = StringType;