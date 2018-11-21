const BufferMethodIntType = require('./BufferMethodIntType');

/**
 * @class
 * A single byte of data.
 * @description Equivalent to using Buffer's [write|read]UInt8.
 * @augments BufferMethodIntType
 * @augments TranscodableType
 */
class Uint8 extends BufferMethodIntType {
	constructor(){
		const buf = Buffer.from([]);
		super(buf.writeUInt8, buf.readUInt8, 1);
	}
}

module.exports = Uint8;