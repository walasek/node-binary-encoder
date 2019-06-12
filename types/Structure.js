const TranscodableType = require('../Type');
const Exceptions = require('../exceptions');

// REMARKS: This implementation assumes that ordering of keys
//          in an object will remain the same as in code.
/**
 * @class
 * A collection of different values.
 * @description Puts encoded values next to each other.
 * @augments TranscodableType
 */
class Structure extends TranscodableType {
	/**
	 * @constructor
	 * @param {Object} descriptor A map of keys and {@link TranscodableType}. All fields must be set when encoding.
	 */
	constructor(descriptor){
		super();
		this.descriptor = descriptor;
		this.fields = Object.keys(this.descriptor);
	}
	compiledEncoder(source_var, alloc_tmp){
		return `
		${this.fields.map(field => {
			try {
				if(!(this.descriptor[field] instanceof TranscodableType))
					throw new Exceptions.InvalidDescriptor('Bad descriptor for field '+field);
				return `${this.descriptor[field].compiledEncoder(`${source_var}.${field}`, alloc_tmp)}`;
			}catch(err){
				throw new Error('Exceptions occured when compiling encoder for '+field+'\n'+err);
			}
		}).join('\n')}
		`
	}
	compiledDecoder(target_var, alloc_tmp){
		return `
		${target_var} = {};
		${this.fields.map((field) => {
			try {
				if(!(this.descriptor[field] instanceof TranscodableType))
					throw new Exceptions.InvalidDescriptor('Bad descriptor for field '+field);
				return `${this.descriptor[field].compiledDecoder(`${target_var}.${field}`, alloc_tmp)}`;
			}catch(err){
				throw new Error('Exceptions occured when compiling decoder for '+field+'\n'+err);
			}
		}).join('\n')}
		`
	}
}

module.exports = Structure;