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
	encode(object, buffer, offset){
		if(!offset)
			offset = 0;
		let local_offset = 0;
		let tmp_buffer = Buffer.from([]);
		for(let i = 0; i < this.fields.length; i++){
			/*if(!object[this.fields[i]])
				throw new Exceptions.MissingFields('Cannot encode a partial structure, missing: '+this.fields[i]);*/
			if(!(this.descriptor[this.fields[i]] instanceof TranscodableType))
				throw new Exceptions.InvalidDescriptor('Bad descriptor for field '+this.fields[i]);
			if(buffer){
				this.descriptor[this.fields[i]].encode(object[this.fields[i]], buffer, local_offset+offset);
			}else{
				tmp_buffer = Buffer.concat([tmp_buffer, this.descriptor[this.fields[i]].encode(object[this.fields[i]])]);
			}
			local_offset += this.descriptor[this.fields[i]].last_bytes_encoded;
		}
		this.last_bytes_encoded = local_offset;
		return buffer || tmp_buffer;
	}
	decode(buffer, offset){
		if(!offset)
			offset = 0;
		let local_offset = 0;
		const obj = {};
		for(let i = 0; i < this.fields.length; i++){
			const field_decoded = this.descriptor[this.fields[i]].decode(buffer, offset+local_offset);
			local_offset += this.descriptor[this.fields[i]].last_bytes_decoded;
			obj[this.fields[i]] = field_decoded;
		}
		this.last_bytes_decoded = local_offset;
		return obj;
	}
	compiledEncoder(source_var){
		return `
		${this.fields.map(field => {
			try {
				if(!(this.descriptor[field] instanceof TranscodableType))
					throw new Exceptions.InvalidDescriptor('Bad descriptor for field '+field);
				return `${this.descriptor[field].compiledEncoder(`${source_var}.${field}`)}`;
			}catch(err){
				throw new Error('Exceptions occured when compiling encoder for '+field+'\n'+err);
			}
		}).join('')}
		`
	}
	compiledDecoder(target_var){
		return `
		${target_var} = {};
		${this.fields.map((field) => {
			try {
				if(!(this.descriptor[field] instanceof TranscodableType))
					throw new Exceptions.InvalidDescriptor('Bad descriptor for field '+field);
				return `${this.descriptor[field].compiledDecoder(`${target_var}.${field}`)}`;
			}catch(err){
				throw new Error('Exceptions occured when compiling decoder for '+field+'\n'+err);
			}
		}).join('')}
		`
	}
}

module.exports = Structure;