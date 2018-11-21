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
	encode(object, buffer, offset){
		if(!offset)
			offset = 0;
		let tmp_buffer = Buffer.from([]);
		let local_offset = 0;
		if(this.fixed_length){
			if(object.length !== this.fixed_length)
				throw new Exceptions.MissingFields('Cannot encode fixed array length, passed only '+object.length+' entries');
		}else{
			if(buffer){
				this.Varint.encode(object.length, buffer, offset+local_offset);
			}else{
				tmp_buffer = this.Varint.encode(object.length);
			}
			local_offset += this.Varint.last_bytes_encoded;
		}
		for(let value of object){
			if(buffer){
				this.type.encode(value, buffer, offset+local_offset);
			}else{
				tmp_buffer = Buffer.concat([tmp_buffer, this.type.encode(value)]);
			}
			local_offset += this.type.last_bytes_encoded;
		}
		this.last_bytes_encoded = local_offset;
		return buffer || tmp_buffer;
	}
	decode(buffer, offset){
		if(!offset)
			offset = 0;
		let length = this.fixed_length;
		let local_offset = 0;
		if(!length){
			length = this.Varint.decode(buffer, offset);
			local_offset = this.Varint.last_bytes_decoded;
		}
		// REMARK: Math.min used to prevent stupidly big allocations
		const result = new Array(Math.min(length, 1000));
		for(let i = 0; i < length; i++){
			const decoded = this.type.decode(buffer, local_offset+offset);
			local_offset += this.type.last_bytes_decoded;
			if(i < result.length){
				result[i] = decoded;
			}else{
				result.push(decoded);
			}
		}
		this.last_bytes_decoded = local_offset;
		return result;
	}
}

module.exports = TranscodableArray;