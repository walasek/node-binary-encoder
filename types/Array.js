const TranscodableType = require('../Type');
const Exceptions = require('../exceptions');
const Varint = require('./Varint');

// REMARKS: Name used to prevent overwriting native Array.
class TranscodableArray extends TranscodableType {
	constructor(type, fixed_length){
		super();
		this.type = type;
		this.fixed_length = fixed_length || 0;
		this.Varint = new Varint();
	}
	encode(object, buffer_unused, offset){
		// TOOD: Implement buffers through argument
		let buffer;
		if(this.fixed_length){
			if(object.length !== this.fixed_length)
				throw new Exceptions.MissingFields('Cannot encode fixed array length, passed only '+object.length+' entries');
		}else{
			buffer = this.Varint.encode(object.length);
		}
		for(let value of object){
			if(buffer){
				buffer = Buffer.concat([buffer, this.type.encode(value)]);
			}else{
				buffer = this.type.encode(value);
			}
		}
		this.last_bytes_encoded = buffer.length;
		return buffer;
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