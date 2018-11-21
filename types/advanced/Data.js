const Uint8 = require('../Uint8');
const ArrayType = require('../Array');

class Data extends ArrayType {
	constructor(fixed_size){
		super(new Uint8(), fixed_size);
	}
	decode(buffer, offset){
		const result = super.decode(buffer, offset);
		return Buffer.from(result);
	}
}

module.exports = Data;