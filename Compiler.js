const Exceptions = require('./exceptions');
const varint = require('varint');

module.exports = {
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
		console.log(code);
		return eval(code);
	}
}