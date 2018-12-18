const Int16 = require('../types/Int16');

module.exports = (t) => {
	t.test('Int16', (t) => {
		const original = -42;
		const encoder = new Int16();
		const encoded = encoder.encode(original);
		t.equal(encoded.length, 2, 'Expecting 2 bytes for Int16');
		t.equal(encoder.last_bytes_encoded, 2, 'State reports 2 bytes');

		const decoded = encoder.decode(encoded);
		t.equal(decoded, -42);
		t.equal(encoder.last_bytes_decoded, 2, 'State reports 2 bytes');

		const generic = Buffer.from([0xFF, 0x0, 0x0, 0x0, 0x0]);
		const generic_decoded = encoder.decode(generic);
		t.equal(generic_decoded, 255, 'Can decode longer buffers');
		const generic_decoded_0 = encoder.decode(generic, 1);
		t.equal(generic_decoded_0, 0, 'Can decode with offset');

		t.throws(() => {
			encoder.decode(generic, 5);
		}, 'Decoding outside of the buffer throws');
	});
}