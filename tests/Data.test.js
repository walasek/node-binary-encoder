const Data = require('../types/advanced/Data');

module.exports = (t) => {
	t.test('Data variable size', (t) => {
		const str = 'hello world!';
		const data = Buffer.from(str, 'ascii');

		const D = new Data();
		const enc = D.encode(data);
		t.equal(D.last_bytes_encoded, 1+str.length);
		const dec = D.decode(enc);
		t.equal(dec.toString(), str);
	});
	t.test('Data fixed size', (t) => {
		const str = 'hello world!';
		const data = Buffer.from(str, 'ascii');

		const D = new Data(str.length);
		const enc = D.encode(data);
		t.equal(D.last_bytes_encoded, str.length);
		const dec = D.decode(enc);
		t.equal(dec.toString(), str);
	});
}