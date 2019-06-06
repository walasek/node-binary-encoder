const lib = require('../');

module.exports = (t) => {
	t.test('Data variable size', (t) => {
		const str = 'hello world!';
		const data = Buffer.from(str, 'ascii');

		const D = lib.Data();
		const enc = D.encode(data);
		t.equal(D.last_bytes_encoded, 1+str.length);
		const dec = D.decode(enc);
		t.equal(dec.toString(), str);
		const encoder = lib.compileEncoder(D);
		const decoder = lib.compileDecoder(D);
		const enc2 = encoder(data);
		t.ok(Buffer.compare(enc2, enc) == 0);
		const dec2 = decoder(enc2);
		t.equal(JSON.stringify(dec2), JSON.stringify(dec));
	});
	t.test('Data fixed size', (t) => {
		const str = 'hello world!';
		const data = Buffer.from(str, 'ascii');

		const D = lib.Data(str.length);
		const enc = D.encode(data);
		t.equal(D.last_bytes_encoded, str.length);
		const dec = D.decode(enc);
		t.equal(dec.toString(), str);
		const encoder = lib.compileEncoder(D);
		const decoder = lib.compileDecoder(D);
		const enc2 = encoder(data);
		t.ok(Buffer.compare(enc2, enc) == 0);
		const dec2 = decoder(enc2);
		t.equal(JSON.stringify(dec2), JSON.stringify(dec));
	});
	t.test('Data handles errors', (t) => {
		const D = lib.Data();
		const DF = lib.Data(4);
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
	t.test('Data missing parts', (t) => {
		t.throws(() => {
			const D = lib.Data();
			const raw = D.encode(Buffer.from('Some long data here'));
			D.decode(raw.slice(0, raw.length/2 >>> 0));
		});
		t.throws(() => {
			const fd = Buffer.from('Some long data here');
			const D = lib.Data(fd.length);
			const raw = D.encode(fd);
			D.decode(raw.slice(0, raw.length/2 >>> 0));
		});
	});
}