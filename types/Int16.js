const BufferMethodIntType = require('./BufferMethodIntType');

/**
 * @class
 * Two bytes signed.
 * @description Equivalent to using Buffer's [write|read]Int16LE.
 * @augments BufferMethodIntType
 * @augments TranscodableType
 */
class Int16 extends BufferMethodIntType {
	constructor(){
		super('writeInt16LE', 'readInt16LE', 2);
	}
}

module.exports = Int16;