const BufferMethodIntType = require('./BufferMethodIntType');

class Uint8 extends BufferMethodIntType {
	constructor(){
		const buf = Buffer.from([]);
		super(buf.writeUInt8, buf.readUInt8, 1);
	}
}

module.exports = Uint8;