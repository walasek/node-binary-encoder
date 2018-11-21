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
	encode(object, buffer_unused, offset){
		// TODO: Implement buffers through argument
		const keys = Object.keys(object);
		if(keys.length > 1)
			throw new Exceptions.AmbiguousObject('OneOf fields only allow a single object key, provided '+keys.length);
		const key = keys[0];
		if(!this.descriptor[key])
			throw new Exceptions.InvalidEncodeValue('Unknown OneOf key '+key);
		let buffer = this.Varint.encode(this.id_map[key]);
		buffer = Buffer.concat([buffer, this.descriptor[key].encode(object[key])]);
		this.last_bytes_encoded = buffer.length;
		return buffer;
	}
	decode(buffer, offset){
		if(!offset)
			offset = 0;
		const id = this.Varint.decode(buffer, offset);
		let local_offset = this.Varint.last_bytes_decoded;
		if(!this.rev_map[id])
			throw new Exceptions.InvalidDecodeBuffer('Unknown OneOf id '+id);
		const result = this.descriptor[this.rev_map[id]].decode(buffer, offset+local_offset);
		local_offset += this.descriptor[this.rev_map[id]].last_bytes_decoded;
		this.last_bytes_decoded = local_offset;
		return {[this.rev_map[id]]: result};
	}
}

module.exports = OneOf;