const TranscodableType = require('../Type');
const Exceptions = require('../exceptions');

class BufferMethodIntType extends TranscodableType {
	constructor(write_method, read_method, size){
		super();
		this.write_method = write_method;
		this.read_method = read_method;
		this.size = size;
	}
	encode(object, buffer, offset){
		if(typeof object !== 'number')
			throw new Exceptions.InvalidEncodeValue('Expected a number, got '+(typeof object));
		if(!buffer)
			buffer = Buffer.allocUnsafe(this.size);
		this.write_method.call(buffer, object, offset);
		this.last_bytes_encoded = this.size;
		return buffer;
	}
	decode(buffer, offset){
		const value = this.read_method.call(buffer, offset);
		this.last_bytes_decoded = this.size;
		return value;
	}
}

module.exports = BufferMethodIntType;