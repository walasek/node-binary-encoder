function factory(What){
	return function(){
		return new What(...arguments);
	}
}

const { compileDecoder, compileEncoder } = require('./Compiler');

module.exports = {
	Uint8: factory(require('./types/Uint8')),
	Uint16: factory(require('./types/Uint16')),
	Int16: factory(require('./types/Int16')),
	Uint32: factory(require('./types/Uint32')),
	Int32: factory(require('./types/Int32')),
	Varint: factory(require('./types/Varint')),

	Structure: factory(require('./types/Structure')),
	Array: factory(require('./types/Array')),
	OneOf: factory(require('./types/OneOf')),
	Data: factory(require('./types/Data')),

	String: factory(require('./types/advanced/String')),
	Constant: factory(require('./types/advanced/Constant')),
	Optional: factory(require('./types/advanced/Optional')),

	compileEncoder, compileDecoder
};