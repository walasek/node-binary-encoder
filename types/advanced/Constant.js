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
	compiledEncoder(source_var){
		return `
		if(${source_var} !== ${this.value})
			throw new Exceptions.InvalidEncodeValue('Expected a constant of ${this.value}');
		${super.compiledEncoder(source_var)};
		`;
	}
	compiledDecoder(target_var){
		return `
		${super.compiledDecoder(target_var)}
		if(${target_var} !== ${this.value})
			throw new Exceptions.InvalidDecodeBuffer('Invalid constant decoded, expected ${this.value}');
		`
	}
}

module.exports = Constant;