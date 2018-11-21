const Uint8 = require('../Uint8');
const Exceptions = require('../../exceptions');

/**
 * @class
 * A constant value.
 * @description Allows encoding only of a single value. Throws an exception when decoding a different value.
 * @augments Uint8
 * @augments TranscodableType
 */
class Constant extends Uint8 {
	/**
	 * @constructor
	 * @param {Number} value The constant.
	 */
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