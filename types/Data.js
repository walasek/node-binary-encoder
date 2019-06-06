const Exceptions = require('../exceptions');
const TranscodableType = require('../Type');
const Varint = require('./Varint');

/**
 * @class
 * A data buffer.
 * @description Operates on raw buffers.
 * @augments TranscodableType
 */
class Data extends TranscodableType {
	/**
	 * @constructor
	 * @param {Number} fixed_size Make the buffer fixed size always.
	 */
	constructor(fixed_size){
		super();
		this.size = fixed_size;
		this.Varint = new Varint();
	}
	encode(object, buffer, offset){
		if(!offset)
			offset = 0;
		if(!(object instanceof Buffer))
			throw new Exceptions.InvalidEncodeValue('Expected a Buffer');
		if(this.size){
			if(object.length !== this.size)
				throw new Exceptions.InvalidEncodeValue('Expected Buffer of size '+this.size);
			if(buffer){
				if(buffer.length-offset < object.length)
					throw new Exceptions.BufferTooSmall('Could not encode data using a temporary buffer.');
				object.copy(buffer, offset);
			}else{
				buffer = object;
			}
			this.last_bytes_encoded = object.length;
			return buffer;
		}
		if(buffer){
			this.Varint.encode(object.length, buffer, offset);
			let local_offset = this.Varint.last_bytes_encoded;
			if(buffer.length-offset-local_offset < object.length)
				throw new Exceptions.BufferTooSmall('Could not encode data using a temporary buffer.');
			object.copy(buffer, local_offset+offset);
			this.last_bytes_encoded = local_offset+object.length;
			return buffer;
		}else{
			const result = Buffer.concat([this.Varint.encode(object.length), object]);
			this.last_bytes_encoded = result.length;
			return result;
		}
	}
	decode(buffer, offset, ignore_size=false){
		if(!offset)
			offset = 0;
		if(this.size){
			if(!ignore_size && buffer.length-offset < this.size)
				throw new Exceptions.InvalidDecodeBuffer('Declared data is not contained within the buffer (missing a part of stream?).');
			const slice = buffer.slice(offset, this.size+offset);
			this.last_bytes_decoded = this.size;
			return slice;
		}else{
			const size = this.Varint.decode(buffer, offset);
			let local_offset = this.Varint.last_bytes_decoded;
			if(buffer.length-local_offset-offset < size)
				throw new Exceptions.InvalidDecodeBuffer('Declared data is not contained within the buffer (missing a part of stream?).');
			const slice = buffer.slice(offset+local_offset, offset+local_offset+size);
			this.last_bytes_decoded = local_offset + size;
			return slice;
		}
	}
	compiledEncoder(source_var){
		return `
		if(!(${source_var} instanceof Buffer))
			throw new Exceptions.InvalidEncodeValue('Expected a Buffer');
		`+(this.size ?
			// Fixed size
			`if(${source_var}.length !== ${this.size})
				throw new Exceptions.InvalidEncodeValue('Expected a Buffer');`
			:
			// Variable size
			`${this.Varint.compiledEncoder(`${source_var}.length`)}`)+
		`
		if(buffer.length-position < ${source_var}.length)
			throw new Exceptions.BufferTooSmall('Could not encode data using the buffer provided.');
		${source_var}.copy(buffer, position);
		position += ${source_var}.length;`
	}
	compiledDecoder(target_var){
		return `
		${!this.size ? this.Varint.compiledDecoder('tmp') : ''}
		${target_var} = buffer.slice(position, position+${this.size ? this.size : 'tmp'})
		position += ${this.size || `${target_var}.length`};
		`
	}
}

module.exports = Data;