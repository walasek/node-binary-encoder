const Data = require('../types/Data');

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
	t.test('Data handles errors', (t) => {
		const D = new Data();
		const DF = new Data(4);
		t.throws(() => D.encode('abc'));
		t.throws(() => DF.encode(Buffer.from([1,2,3,4,5])));

		const buf = Buffer.allocUnsafe(6);
		DF.encode(Buffer.from([0,1,2,3]), buf, 1);
		t.equal(buf[1], 0);
		D.encode(Buffer.from([0,1,2,3]), buf, 1);
		t.equal(buf[2], 0);
		t.throws(() => D.encode(Buffer.from('12345678943243243','ascii'), buf));
		t.throws(() => DF.encode(Buffer.from([0,1,2,3]), buf, 4));

	});
}