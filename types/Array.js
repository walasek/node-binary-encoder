const TranscodableType = require('../Type');
const Exceptions = require('../exceptions');
const Varint = require('./Varint');

// REMARKS: Name used to prevent overwriting native Array.
/**
 * @class
 * An array of values.
 * @extends TranscodableType
 */
class TranscodableArray extends TranscodableType {
	/**
	 * @constructor
	 * @param {TranscodableType} type The type of stored values.
	 * @param {Number} [fixed_length] If set then will only transcode successfuly if the array has this number of values.
	 */
	constructor(type, fixed_length){
		super();
		this.type = type;
		this.fixed_length = fixed_length || 0;
		this.Varint = new Varint();
	}
	compiledEncoder(source_var, alloc_fn){
		return `${this.fixed_length ? `if(source.length !== ${this.fixed_length})
			throw new Exceptions.MissingFields('Array does not match the fixed length of ${this.fixed_length}')`
			: `${this.Varint.compiledEncoder(`${source_var}.length`, alloc_fn)}`}
		for(let value of ${source_var}){
			${this.type.compiledEncoder('value', alloc_fn)}
		}`
	}
	compiledDecoder(target_var, alloc_fn){
		const tmp = (this.fixed_length ? null : alloc_fn());
		return `
		${!this.fixed_length ? `
		${this.Varint.compiledDecoder(tmp)}
		` : ''}
		${target_var} = [];
		for(let i = 0; i < ${this.fixed_length || tmp}; i++){
			${this.type.compiledDecoder(`${target_var}[i]`, alloc_fn)}
		}
		`
	}
}

module.exports = TranscodableArray;