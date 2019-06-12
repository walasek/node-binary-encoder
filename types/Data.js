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
	compiledDecoder(target_var, alloc_tmp){
		const tmp = alloc_tmp();
		return `
		${!this.size ? this.Varint.compiledDecoder(tmp) : ''}
		if(${this.size ? this.size : tmp}+position > buffer.length)
			throw new Exceptions.InvalidDecodeBuffer('Part of data buffer is missing');
		${target_var} = buffer.slice(position, position+${this.size ? this.size : tmp})
		position += ${this.size || `${target_var}.length`};
		`
	}
}

module.exports = Data;