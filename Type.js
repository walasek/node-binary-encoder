/**
 * @class
 * Base class for any transcodable type definition.
 */
class TranscodableType {
	constructor(){
		this.last_bytes_encoded = -1;
		this.last_bytes_decoded = -1;
	}
	/**
	 * Encode an object into a binary representation.
	 * @param {*} object The object/value to be encoded.
	 * @param {Buffer} [buffer] The buffer to write to. If the buffer is too small to encode then a new buffer will be allocated.
	 * @param {Number} [offset] The offset in buffer to write at.
	 * @returns {Buffer} The buffer that contains the encoded data. If a new buffer is allocated then the data was written from the begining.
	 */
	encode(object, buffer, offset){
		throw Error('Called abstract encode');
	}
	/**
	 * Decode an object from a binary representation.
	 * @param {Buffer} buffer The buffer to read from.
	 * @param {Number} [offset] The offset in buffer to start reading.
	 */
	decode(buffer, offset){
		throw Error('Called abstract decode');
	}
}

module.exports = TranscodableType;