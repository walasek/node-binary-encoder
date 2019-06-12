const lib = require('../');

module.exports = (t) => {
	t.test('String variable size', (t) => {
		const str = 'hello world!';

		const D = lib.String();
		const enc = D.encode(str);
		t.equal(enc.length, 1+str.length);
		const dec = D.decode(enc);
		t.equal(dec.toString(), str);
	});
	t.test('String fixed size', (t) => {
		const str = 'hello world!';

		const D = lib.String(str.length);
		const enc = D.encode(str);
		t.equal(enc.length, str.length);
		const dec = D.decode(enc);
		t.equal(dec.toString(), str);
	});
	t.test('Variable string size in fixed field', (t) => {
		const str = 'hello!';

		const D = lib.String(str.length*2); // Bigger than needed
		const encoder = lib.compileEncoder(D);
		const decoder = lib.compileDecoder(D);
		const enc = D.encode(str);
		t.equal(enc.length, str.length*2);
		const enc2 = encoder(str);
		t.ok(Buffer.compare(enc, enc2) == 0);
		const dec = D.decode(enc);
		const dec2 = decoder(enc2);
		t.equal(dec.toString(), str);
		t.equal(dec.toString(), dec2.toString());
	});
	t.test('Too long strings in a fixed size field throw', (t) => {
		t.throws(() => {
			const str = 'bigger than allowed';
			const D = lib.String(str.length/2 >>> 0);
			D.encode(str);
		});
	});
	t.test('Unicode strings in fixed lengths', (t) => {
		t.throws(() => {
			const D = lib.String(1);
			D.encode('Ą');
		});
	});
}