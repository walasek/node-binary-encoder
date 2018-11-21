const OneOf = require('../OneOf');
const TranscodableType = require('../../Type');
const NullType = require('./Null');

const SINGLETON_NULL_INSTANCE = new NullType();

/**
 * @class
 * Make a value optional.
 * @description Uses {@link OneOf} to allow the value to not be present at times at a cost of a byte.
 * @augments TranscodableType
 */
class Optional extends TranscodableType {
	/**
	 * @constructor
	 * @param {TranscodableType} subject The value type to be optional.
	 */
	constructor(subject){
		super();
		this.oneof = new OneOf({
			is_set: subject,
			is_null: SINGLETON_NULL_INSTANCE,
		});
	}
	encode(object, buffer, offset){
		let result;
		if(object){
			result = this.oneof.encode({is_set: object}, buffer, offset);
		}else{
			result = this.oneof.encode({is_null: true}, buffer, offset);
		}
		this.last_bytes_encoded = result.length;
		return result;
	}
	decode(buffer, offset){
		const obj = this.oneof.decode(buffer, offset);
		this.last_bytes_decoded = this.oneof.last_bytes_decoded;
		return obj.is_set || null;
	}
}

module.exports = Optional;