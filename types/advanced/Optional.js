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
	compiledEncoder(source_var, alloc_fn){
		return `
		tmp = {};
		if(${source_var}){
			tmp.is_set = ${source_var};
		}else{
			tmp.is_null = true;
		}
		${this.oneof.compiledEncoder('tmp', alloc_fn)}
		`;
	}
	compiledDecoder(target_var, alloc_fn){
		return `
		${this.oneof.compiledDecoder('tmp', alloc_fn)};
		${target_var} = tmp.is_set || null;
		`
	}
}

module.exports = Optional;