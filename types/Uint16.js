const BufferMethodIntType = require('./BufferMethodIntType');

/**
 * @class
 * Two bytes of data.
 * @description Equivalent to using Buffer's [write|read]UInt16LE.
 * @augments BufferMethodIntType
 * @augments TranscodableType
 */
class Uint16 extends BufferMethodIntType {
	constructor(){
		super('writeUInt16LE', 'readUInt16LE', 2);
	}
}

module.exports = Uint16;