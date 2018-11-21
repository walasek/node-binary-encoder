const BufferMethodIntType = require('./BufferMethodIntType');

class Uint32 extends BufferMethodIntType {
	constructor(){
		const buf = Buffer.from([]);
		super(buf.writeUInt32LE, buf.readUInt32LE, 4);
	}
}

module.exports = Uint32;