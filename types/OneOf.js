const TranscodableType = require('../Type');
const Exceptions = require('../exceptions');
const Varint = require('./Varint');

/**
 * @class
 * An encoder that allows only one definition to be encoded at a time.
 * @description Encodes a _Varint_ with an identifier and encoded data.
 * @augments TranscodableType
 */
class OneOf extends TranscodableType {
	/**
	 * @constructor
	 * @param {Object} descriptor A map of keys and {@link TranscodableType}. When encoding only one key can be set.
	 */
	constructor(descriptor){
		super();
		this.descriptor = descriptor;
		this.id_map = new Array(Object.keys(descriptor).length);
		this.rev_map = new Array(this.id_map.length);
		Object.keys(descriptor).forEach((name,index) => {
			this.id_map[name] = index;
			this.rev_map[index] = name;
		});
		this.Varint = new Varint();
	}
	compiledEncoder(source_var, alloc_tmp){
		return `
		const keys = Object.keys(${source_var});
		if(keys.length > 1)
			throw new Exceptions.AmbiguousObject('OneOf fields only allow a single key, provided '+keys.length);
		const key = keys[0];
		switch(key){
			${Object.keys(this.descriptor).map(desc => {
				return `
				case '${desc}':
					${this.Varint.compiledEncoder(this.id_map[desc])}
					${this.descriptor[desc].compiledEncoder(`${source_var}.${desc}`, alloc_tmp)}
				break;
				`
			}).join('')}
			default:
				throw new Exceptions.InvalidEncodeValue('Unknown OneOf key'+key);
		}
		`
	}
	compiledDecoder(target_var, alloc_tmp){
		const tmp = alloc_tmp();
		return `
		${this.Varint.compiledDecoder(tmp)}
		${target_var} = {};
		switch(${tmp}){
			${Object.keys(this.descriptor).map(desc => {
				return `
				case ${this.id_map[desc]}:
					${this.descriptor[desc].compiledDecoder(`${target_var}.${desc}`, alloc_tmp)}
				break;
				`
			}).join('')}
			default:
				throw new Exceptions.InvalidDecodeBuffer('Unknown OneOf id '+${tmp});
		}
		`
	}
}

module.exports = OneOf;