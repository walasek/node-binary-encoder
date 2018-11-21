const Data = require('./Data');

/**
 * @class
 * A UTF-8 string type.
 * @description Wraps {@link Data} with string conversion functions.
 * @augments Data
 * @augments TranscodableArray
 * @augments TranscodableType
 */
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