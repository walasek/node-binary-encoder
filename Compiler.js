const Exceptions = require('./exceptions');
const varint = require('varint');

module.exports = {
	/**
	 * Compile a fast, structural encoder.
	 * @param {TranscodableType} structure
	 * @param {Number} non_alloc_size If no buffer is provided when encoding then allocate this size. If too small then will throw a runtime exception.
	 * @returns {Function} (source, buffer=null), where _source_ is the object to be encoded, _buffer_ is the buffer to write to, returns a raw Buffer
	 */
	compileEncoder(structure, non_alloc_size=512){
		const code = `
		(source, buffer=null) => {
			let position = 0;
			let buffer_flexible = false;
			let i = 0;
			let tmp;
			if(!buffer){
				buffer = Buffer.alloc(${non_alloc_size});
				buffer_flexible = true;
			}
			${structure.compiledEncoder('source')}
			if(buffer_flexible){
				return buffer.slice(0, position);
			}
			return buffer;
		}
		`
		return eval(code);
	},
	/**
	 * Compile a fast, structural decoder.
	 * @param {TranscodableType} structure
	 * @returns {Function} (buffer), where _buffer_ is the data to decode, returns a the decoded _structure_ or throws on errors.
	 */
	compileDecoder(structure){
		const code = `
		(buffer) => {
			let result;
			let position = 0;
			let tmp, tmp2;
			${structure.compiledDecoder('result')}
			return result;
		}
		`
		return eval(code);
	}
}