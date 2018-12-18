const Int32 = require('../types/Int32');

module.exports = (t) => {
	t.test('Int32', (t) => {
		const original = -42000000;
		const encoder = new Int32();
		const encoded = encoder.encode(original);
		t.equal(encoded.length, 4, 'Expecting 4 bytes for Int32');
		t.equal(encoder.last_bytes_encoded, 4, 'State reports 4 bytes');

		const decoded = encoder.decode(encoded);
		t.equal(decoded, -42000000);
		t.equal(encoder.last_bytes_decoded, 4, 'State reports 4 bytes');

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