const Data = require('../Data');
const Exceptions = require('../../exceptions');

/**
 * @class
 * A UTF-8 string type.
 * @description Wraps {@link Data} with string conversion functions.
 * @augments Data
 * @augments TranscodableArray
 * @augments TranscodableType
 */
class StringType extends Data {
	compiledEncoder(source_var, alloc_fn){
		const tmp = alloc_fn();
		return `
		${tmp} = Buffer.from(${source_var}, 'utf8');
		${this.size ? `if(${tmp}.length < ${this.size})
			${tmp} = Buffer.concat([${tmp}, Buffer.alloc(${this.size}-${tmp}.length, 0)]);
		if(${tmp}.length > ${this.size})
			throw new Exceptions.InvalidEncodeValue('Encoded string is too long to fit in ${this.size} bytes.')` : ''}
		${super.compiledEncoder(tmp, alloc_fn)}
		`
	}
	compiledDecoder(target_var, alloc_fn){
		const tmp = alloc_fn();
		const tmp2 = alloc_fn();
		return `
		${super.compiledDecoder(tmp, alloc_fn)}
		${tmp2} = ${tmp}.indexOf(0);
		if(${tmp2} !== -1){
			${target_var} = ${tmp}.slice(0, ${tmp2}).toString('utf8');
		}else{
			${target_var} = ${tmp}.toString('utf8');
		}
		`
	}
}

module.exports = StringType;