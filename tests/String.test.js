const StringType = require('../types/advanced/String');

module.exports = (t) => {
	t.test('String variable size', (t) => {
		const str = 'hello world!';

		const D = new StringType();
		const enc = D.encode(str);
		t.equal(D.last_bytes_encoded, 1+str.length);
		const dec = D.decode(enc);
		t.equal(dec.toString(), str);
	});
	t.test('String fixed size', (t) => {
		const str = 'hello world!';

		const D = new StringType(str.length);
		const enc = D.encode(str);
		t.equal(D.last_bytes_encoded, str.length);
		const dec = D.decode(enc);
		t.equal(dec.toString(), str);
	});
	t.test('Variable string size in fixed field', (t) => {
		const str = 'hello!';

		const D = new StringType(str.length*2); // Bigger than needed
		const enc = D.encode(str);
		t.equal(D.last_bytes_encoded, str.length*2);
		const dec = D.decode(enc);
		t.equal(dec.toString(), str);
	});
	t.test('Too long strings in a fixed size field throw', (t) => {
		t.throws(() => {
			const str = 'bigger than allowed';
			const D = new StringType(str.length/2 >>> 0);
			D.encode(str);
		});
	});
	t.test('Unicode strings in fixed lengths', (t) => {
		t.throws(() => {
			const D = new StringType(1);
			D.encode('Ą');
		});
	});
}