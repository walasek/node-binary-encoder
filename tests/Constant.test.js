const lib = require('../');

module.exports = (t) => {
	t.test('Constant', (t) => {
		const my_magic = 0xFE;
		const struct = lib.Structure({
			magic: lib.Constant(my_magic),
			value: lib.Uint32(),
		});

		const obj = {
			magic: my_magic,
			value: 123
		};

		const enc = struct.encode(obj);
		t.equal(enc.length, 5);
		const dec = struct.decode(enc);
		t.equal(dec.magic, obj.magic);
		t.equal(dec.value, obj.value);

		const encoder = lib.compileEncoder(struct);
		const decoder = lib.compileDecoder(struct);
		const enc2 = encoder(obj);
		const dec2 = decoder(enc2);
		const dec3 = decoder(enc);
		t.equal(JSON.stringify(dec2), JSON.stringify(dec3));

		enc[0] = 0xFD;
		t.throws(() => struct.decode(enc));
		t.throws(() => decoder(enc));
		obj.magic = 0xFD;
		t.throws(() => struct.encode(obj));
		t.throws(() => encoder(obj));
	});
};