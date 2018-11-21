const lib = require('../');

module.exports = (t) => {
	t.test('Optional', (t) => {
		const DEF = lib.Structure({
			A: lib.Optional(lib.Array(lib.Uint32())),
			B: lib.Uint32(),
		});

		const enc = DEF.encode({B: 1, A: 0});
		t.equal(DEF.last_bytes_encoded, 5);
		const dec = DEF.decode(enc);
		t.equal(dec.B, 1);

		const enc2 = DEF.encode({B: 2, A: [1,2,3]});
		const dec2 = DEF.decode(enc2);
		t.equal(dec2.B, 2);
		t.equal(dec2.A[1], 2);
	});
}