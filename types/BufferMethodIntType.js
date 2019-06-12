const TranscodableType = require('../Type');
const Exceptions = require('../exceptions');

/**
 * @class
 * A utility type that abstracts native Buffer's methods.
 * @augments TranscodableType
 */
class BufferMethodIntType extends TranscodableType {
	/**
	 * @constructor
	 * @param {string} write_snippet Method name of Buffer that writes.
	 * @param {string} read_snippet Method name of Buffer that reads.
	 * @param {number} size The size of read/written values.
	 */
	constructor(write_snippet, read_snippet, size){
		super();
		this.write_snippet = write_snippet;
		this.read_snippet = read_snippet;
		this.size = size;
	}
	compiledEncoder(source_var){
		return `if(typeof ${source_var} != 'number')
			throw new Exceptions.InvalidEncodeValue('Expected a number but got '+(typeof ${source_var}));
		buffer.${this.write_snippet}(${source_var}, position);
		position += ${this.size}`;
	}
	compiledDecoder(target_var){
		return `${target_var} = buffer.${this.read_snippet}(position);
		position += ${this.size}`;
	}
}

module.exports = BufferMethodIntType;