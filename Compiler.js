const Exceptions = require('./exceptions');
const varint = require('varint');

module.exports = {
	/**
	 * Compile a fast, structural encoder.
	 * @param {TranscodableType} structure
	 * @param {Number} non_alloc_size If no buffer is provided when encoding then allocate this size. If too small then will throw a runtime exception.
	 * @returns {Function} (source, buffer=null), where _source_ is the object to be encoded, _buffer_ is the buffer to write to, returns a raw Buffer
	 */
	compileEncoder(structure, non_alloc_size=4096){
		let custom_vars = [];
		const alloc_tmp_var = () => {
			const name = 'tmp'+custom_vars.length;
			custom_vars.push(name);
			return name;
		}
		const compiled = structure.compiledEncoder('source', alloc_tmp_var);
		const code = `
		(source, buffer=null, offset=0) => {
			let position = offset;
			let buffer_flexible = false;
			let i = 0;
			let tmp;
			${custom_vars.length > 0 ? 'let '+custom_vars.join(', ')+';' : ''}
			if(!buffer){
				buffer = Buffer.alloc(${non_alloc_size});
				buffer_flexible = true;
			}
			${compiled}
			return buffer.slice(0, position);
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
		let custom_vars = [];
		const alloc_tmp_var = () => {
			const name = 'tmp'+custom_vars.length;
			custom_vars.push(name);
			return name;
		}
		const compiled = structure.compiledDecoder('result', alloc_tmp_var);
		const code = `
		(buffer, offset=0) => {
			let result;
			let position = offset;
			let tmp;
			${custom_vars.length > 0 ? 'let '+custom_vars.join(', ')+';' : ''}
			${compiled}
			return result;
		}
		`
		return eval(code);
	}
}