const BufferMethodIntType = require('./BufferMethodIntType');

/**
 * @class
 * Four bytes of data.
 * @description Equivalent to using Buffer's [write|read]UInt8LE.
 * @augments BufferMethodIntType
 * @augments TranscodableType
 */
class Uint32 extends BufferMethodIntType {
	constructor(){
		super('writeUInt32LE', 'readUInt32LE', 4);
	}
}

module.exports = Uint32;