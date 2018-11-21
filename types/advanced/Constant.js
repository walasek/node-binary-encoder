const Uint8 = require('../Uint8');
const Exceptions = require('../../exceptions');

class Constant extends Uint8 {
	constructor(value){
		super();
		this.value = value;
	}
	encode(value, buffer, offset){
		if(value !== this.value)
			throw new Exceptions.InvalidEncodeValue('Expected a constant of '+this.value);
		return super.encode(this.value, buffer, offset);
	}
	decode(buffer, offset){
		const value = super.decode(buffer, offset);
		if(value !== this.value)
			throw new Exceptions.InvalidDecodeBuffer('Invalid constant decoded, expected '+this.value);
		return value;
	}
}

module.exports = Constant;