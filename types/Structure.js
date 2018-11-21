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
	encode(object, buffer_unused, offset){
		// TODO: Implement buffers through argument
		let buffer;
		for(let i = 0; i < this.fields.length; i++){
			/*if(!object[this.fields[i]])
				throw new Exceptions.MissingFields('Cannot encode a partial structure, missing: '+this.fields[i]);*/
			if(!(this.descriptor[this.fields[i]] instanceof TranscodableType))
				throw new Exceptions.InvalidDescriptor('Bad descriptor for field '+this.fields[i]);
			const field_encoded = this.descriptor[this.fields[i]].encode(object[this.fields[i]]);
			if(!buffer){
				buffer = field_encoded;
			}else{
				buffer = Buffer.concat([buffer, field_encoded]);
			}
		}
		this.last_bytes_encoded = buffer ? buffer.length : 0;
		return buffer || Buffer.from([]);
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
}

module.exports = Structure;