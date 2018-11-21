const Uint8 = require('../types/Uint8');

module.exports = (t) => {
	t.test('Uint8', (t) => {
		const original = 42;
		const encoder = new Uint8();
		const encoded = encoder.encode(original);
		t.equal(encoded.length, 1, 'Expecting 1 byte for Uint8');
		t.equal(encoder.last_bytes_encoded, 1, 'State reports 1 byte');

		const decoded = encoder.decode(encoded);
		t.equal(decoded, 42);
		t.equal(encoder.last_bytes_decoded, 1, 'State reports 1 byte');

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