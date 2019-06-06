const lib = require('../');

module.exports = (t) => {
	t.test('Int16', (t) => {
		const original = -42;
		const def = lib.Int16();
		const encoder = lib.compileEncoder(def);
		const decoder = lib.compileDecoder(def);

		const encoded = def.encode(original);
		const encoded2 = encoder(original);
		t.equal(encoded.length, 2, 'Expecting 2 bytes for Int16');
		t.equal(encoded.length, encoded2.length);
		t.equal(def.last_bytes_encoded, 2, 'State reports 2 bytes');

		const decoded = def.decode(encoded);
		const decoded2 = decoder(encoded);
		t.equal(decoded, -42);
		t.equal(decoded, decoded2);
		t.equal(def.last_bytes_decoded, 2, 'State reports 2 bytes');

		const generic = Buffer.from([0xFF, 0x0, 0x0, 0x0, 0x0]);
		const generic_decoded = def.decode(generic);
		const generic_decoded2 = decoder(generic);
		t.equal(generic_decoded, 255, 'Can decode longer buffers');
		t.equal(generic_decoded, generic_decoded2);
		const generic_decoded_0 = def.decode(generic, 1);
		const generic_decoded_02 = decoder(generic.slice(1));
		t.equal(generic_decoded_0, 0, 'Can decode with offset');
		t.equal(generic_decoded_0, generic_decoded_02);

		t.throws(() => {
			def.decode(generic, 5);
		}, 'Decoding outside of the buffer throws');
	});
}