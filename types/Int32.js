const BufferMethodIntType = require('./BufferMethodIntType');

/**
 * @class
 * Four bytes signed.
 * @description Equivalent to using Buffer's [write|read]Int32LE.
 * @augments BufferMethodIntType
 * @augments TranscodableType
 */
class Int32 extends BufferMethodIntType {
	constructor(){
		super('writeInt32LE', 'readInt32LE', 4);
	}
}

module.exports = Int32;