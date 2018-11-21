const Data = require('./Data');

class StringType extends Data {
	encode(object, buffer, offset){
		return super.encode(Buffer.from(object, 'utf8'), buffer, offset);
	}
	decode(buffer, offset){
		const result = super.decode(buffer, offset);
		return result.toString('utf8');
	}
}

module.exports = StringType;