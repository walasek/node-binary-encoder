const lib = require('../');

module.exports = (t) => {
	t.test('Constant', (t) => {
		const my_magic = 0xFE;
		const encoder = lib.Structure({
			magic: lib.Constant(my_magic),
			value: lib.Uint32(),
		});

		const obj = {
			magic: my_magic,
			value: 123
		};

		const enc = encoder.encode(obj);
		t.equal(encoder.last_bytes_encoded, 5);
		const dec = encoder.decode(enc);
		t.equal(dec.magic, obj.magic);
		t.equal(dec.value, obj.value);

		enc[0] = 0xFD;
		t.throws(() => encoder.decode(enc));
		obj.magic = 0xFD;
		t.throws(() => encoder.encode(obj));
	});
};