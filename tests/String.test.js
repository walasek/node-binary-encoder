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
}