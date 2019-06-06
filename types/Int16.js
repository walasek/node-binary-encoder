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
		const buf = Buffer.from([]);
		super(buf.writeInt16LE, buf.readInt16LE, 2);
	}
	compiledEncoder(source_var){
		return `buffer.writeInt16LE(${source_var}, position);
		position += 2;`
	}
	compiledDecoder(target_var){
		return `${target_var} = buffer.readInt16LE(position);
		position += 2;`;
	}
}

module.exports = Int16;