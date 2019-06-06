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
	encode(object, buffer, offset){
		if(!offset)
			offset = 0;
		const keys = Object.keys(object);
		if(keys.length > 1)
			throw new Exceptions.AmbiguousObject('OneOf fields only allow a single object key, provided '+keys.length);
		const key = keys[0];
		if(!this.descriptor[key])
			throw new Exceptions.InvalidEncodeValue('Unknown OneOf key '+key);
		let tmp_buffer = Buffer.from([]);
		let local_offset = 0;
		if(buffer){
			this.Varint.encode(this.id_map[key], buffer, offset+local_offset);
		}else{
			tmp_buffer = this.Varint.encode(this.id_map[key]);
		}
		local_offset += this.Varint.last_bytes_encoded;
		if(buffer){
			this.descriptor[key].encode(object[key], buffer, offset+local_offset);
		}else{
			tmp_buffer = Buffer.concat([tmp_buffer, this.descriptor[key].encode(object[key])]);
		}
		local_offset += this.descriptor[key].last_bytes_encoded;
		this.last_bytes_encoded = local_offset;
		return buffer || tmp_buffer;
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
	compiledEncoder(source_var){
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
					${this.descriptor[desc].compiledEncoder(`${source_var}.${desc}`)}
				break;
				`
			}).join('')}
			default:
				throw new Exceptions.InvalidEncodeValue('Unknown OneOf key'+key);
		}
		`
	}
	compiledDecoder(target_var){
		return `
		${this.Varint.compiledDecoder('tmp')}
		${target_var} = {};
		const _x = tmp;
		switch(_x){
			${Object.keys(this.descriptor).map(desc => {
				return `
				case ${this.id_map[desc]}:
					${this.descriptor[desc].compiledDecoder(`${target_var}.${desc}`)}
				break;
				`
			}).join('')}
			default:
				throw new Exceptions.InvalidDecodeBuffer('Unknown OneOf id '+tmp);
		}
		`
	}
}

module.exports = OneOf;