const lib = require('../');

module.exports = (t) => {
	t.test('Basic fixed arrays', (t) => {
		const A1 = lib.Array(lib.Uint32(), 1);
		const A2 = lib.Array(lib.Uint32(), 2);
		const a1encoder = lib.compileEncoder(A1);
		const a1decoder = lib.compileDecoder(A1);
		const a2encoder = lib.compileEncoder(A2);
		const a2decoder = lib.compileDecoder(A2);

		const v1 = [1];
		const v2 = [1,2];

		const enc1 = A1.encode(v1);
		const enc2 = A2.encode(v2);
		t.equal(A1.last_bytes_encoded, 4);
		t.equal(A2.last_bytes_encoded, 8);
		t.throws(() => A1.encode(v2));
		t.throws(() => A2.encode(v1));
		t.throws(() => a1encoder(A2));
		t.throws(() => a2encoder(A1));

		const dec1 = A1.decode(enc1);
		const dec2 = A2.decode(enc2);
		t.equal(dec1.length, 1);
		t.equal(dec1[0], v1[0]);
		t.equal(A1.last_bytes_decoded, 4);

		t.equal(dec2.length, 2);
		t.equal(dec2[0], v2[0]);
		t.equal(dec2[1], v2[1]);
		t.equal(A2.last_bytes_decoded, 8);
	});

	t.test('Basic variable arrays', (t) => {
		const A = lib.Array(lib.Uint32());

		const v1 = [1];
		const v2 = [1,2];

		const enc1 = A.encode(v1);
		t.equal(A.last_bytes_encoded, 5);
		const enc2 = A.encode(v2);
		t.equal(A.last_bytes_encoded, 9);

		const dec1 = A.decode(enc1);
		t.equal(dec1.length, 1);
		t.equal(dec1[0], v1[0]);
		t.equal(A.last_bytes_decoded, 5);

		const dec2 = A.decode(enc2);
		t.equal(dec2.length, 2);
		t.equal(dec2[0], v2[0]);
		t.equal(dec2[1], v2[1]);
		t.equal(A.last_bytes_decoded, 9);

		const buf = Buffer.allocUnsafe(16);
		const enc3 = A.encode(v1, buf, 1);
		t.equal(buf[2], 1);
		const dec3 = A.decode(enc3, 1);
		t.equal(dec3[0], 1);

		const encoder = lib.compileEncoder(A);
		const decoder = lib.compileDecoder(A);
		const enc4 = encoder(v1);
		const enc5 = encoder(v2);
		t.ok(Buffer.compare(enc4, enc1) == 0);
		const dec4 = decoder(enc4);
		const dec5 = decoder(enc5);
		t.equal(dec4[0], 1);
		t.equal(dec5[0], 1);
		t.equal(dec5[1], 2);
	});

	t.test('Array of varint', (t) => {
		const A = lib.Array(lib.Varint());

		const a = [];
		for(let i = 0; i < 16; i++){
			a.push(Math.pow(2, i));
		}

		const enc = A.encode(a);
		const dec = A.decode(enc);
		for(let i = 0; i < 16; i++)
			t.equal(dec[i], a[i]);
	});

	t.test('Big Arrays', (t) => {
		const A = lib.Array(lib.Uint8());

		const a = [];
		for(let i = 0; i < 2000; i++)
			a.push(i % 256);

		const enc = A.encode(a);
		const dec = A.decode(enc);
		for(let i = 0; i < a.length; i++){
			if(dec[i] !== a[i])
				t.fail('Incorrect decode');
		}
	});
};