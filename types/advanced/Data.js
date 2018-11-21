const Uint8 = require('../Uint8');
const ArrayType = require('../Array');

/**
 * @class
 * A data buffer.
 * @description Wraps {@link Array} of {@link Uint8}.
 * @augments TranscodableArray
 * @augments TranscodableType
 */
class Data extends ArrayType {
	/**
	 * @constructor
	 * @param {Number} fixed_size Make the buffer fixed size always.
	 */
	constructor(fixed_size){
		super(new Uint8(), fixed_size);
	}
	decode(buffer, offset){
		const result = super.decode(buffer, offset);
		return Buffer.from(result);
	}
}

module.exports = Data;