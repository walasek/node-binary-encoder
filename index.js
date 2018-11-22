function factory(What){
	return function(){
		return new What(...arguments);
	}
}

module.exports = {
	Uint8: factory(require('./types/Uint8')),
	Uint32: factory(require('./types/Uint32')),
	Varint: factory(require('./types/Varint')),

	Structure: factory(require('./types/Structure')),
	Array: factory(require('./types/Array')),
	OneOf: factory(require('./types/OneOf')),
	Data: factory(require('./types/Data')),

	String: factory(require('./types/advanced/String')),
	Constant: factory(require('./types/advanced/Constant')),
	Optional: factory(require('./types/advanced/Optional')),
};