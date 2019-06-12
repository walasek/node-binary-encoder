const { compileEncoder,  compileDecoder } = require('./Compiler');

/**
 * @class
 * Base class for any transcodable type definition.
 */
class TranscodableType {
	constructor(){
		this._tmp_encoder_compiled = null;
		this._tmp_decoder_compiled = null;
	}
	/**
	 * Encode an object into a binary representation.
	 * @param {*} object The object/value to be encoded.
	 * @param {Buffer} [buffer] The buffer to write to. If the buffer is too small an exception will be thrown.
	 * @param {Number} [offset] The offset in buffer to write at.
	 * @param {Number} [non_alloc_size] If _buffer_ is not passed then allocate a buffer of this size.
	 * @returns {Buffer} The buffer that contains the encoded data. If a new buffer is allocated then the data was written from the begining.
	 */
	encode(object, buffer, offset, non_alloc_size=null){
		if(!this._tmp_encoder_compiled)
			this._tmp_encoder_compiled = compileEncoder(this);
		return this._tmp_encoder_compiled(object, buffer, offset, non_alloc_size);
	}
	/**
	 * Decode an object from a binary representation.
	 * @param {Buffer} buffer The buffer to read from.
	 * @param {Number} [offset] The offset in buffer to start reading.
	 */
	decode(buffer, offset){
		if(!this._tmp_decoder_compiled)
			this._tmp_decoder_compiled = compileDecoder(this);
		return this._tmp_decoder_compiled(buffer, offset);
	}
	/**
	 * Generate code that encodes the value in variable of name _source\_var_.
	 * The code is pasted with other generated code in a single function.
	 * Refer to {@link Compiler.js} for usable local variables.
	 * @param {String} source_var The variable name to read from.
	 * @param {function} tmp_var_alloc A function that allocates a unique temporary variable. Returns its name.
	 * @returns {String} JavaScript code
	 */
	compiledEncoder(source_var, tmp_var_alloc){
		throw new Error('Abstract compiledEncoder called');
	}
	/**
	 * Generate code that decodes the local _buffer_ variable at _position_.
	 * Save the decoded value to _target\_var_ variable.
	 * Refer to {@link Compiler.js} for usable local variables.
	 * @param {String} target_var The variable name to save to.
	 * @param {function} tmp_var_alloc A function that allocates a unique temporary variable. Returns its name.
	 * @returns {String} JavaScript code
	 */
	compiledDecoder(target_var, tmp_var_alloc){
		throw new Error('Abstract compiledDecoder called');
	}
}

module.exports = TranscodableType;