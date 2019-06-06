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
		const buf = Buffer.from([]);
		super(buf.writeUInt16LE, buf.readUInt16LE, 2);
	}
	compiledEncoder(source_var){
		return `buffer.writeUInt16LE(${source_var}, position);
		position += 2;`
	}
	compiledDecoder(target_var){
		return `${target_var} = buffer.readUInt16LE(position);
		position += 2;`;
	}
}

module.exports = Uint16;