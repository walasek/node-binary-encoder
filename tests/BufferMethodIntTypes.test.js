const lib = require('../');

module.exports = (t) => {
	const suites = [
		// name, Type, size, has negative values?
		['Uint8', lib.Uint8, 1, false],
		['Uint16', lib.Uint16, 2, false],
		['Uint32', lib.Uint32, 4, false],
		['Int16', lib.Int16, 2, true],
		['Int32', lib.Int32, 4, true],
	];
	suites.forEach(suite => {
		const [name, Type, size, has_negative] = suite;
		t.test('BufferMethodIntType - '+name, (t) => {
			const def = Type();

			const min_v = has_negative ? -Math.pow(2, 8*size)/2 : 0;
			const max_v = Math.pow(2, 8*size)/(has_negative ? 2 : 1) - 1;

			function _encDecTest(v, t){
				const enc = def.encode(v);
				t.equal(enc.length, size);
				const dec = def.decode(enc);
				t.equal(dec, v);
			}

			t.test('Can encode and decode minimum', (t) => {
				_encDecTest(min_v, t);
			});

			t.test('Can encode and decode maximum', (t) => {
				_encDecTest(max_v, t);
			});

			t.test('Cannot encode under minimum', (t) => {
				t.throws(() => def.encode(min_v-1));
			});

			t.test('Cannot encode above maximum', (t) => {
				t.throws(() => def.encode(max_v+1));
			});

			t.test('Can decode from raw buffers', (t) => {
				const buf = Buffer.from([0xFF, 0, 0, 0, 0]);
				const dec = def.decode(buf);
				t.equal(dec, 255);
				t.throws(() => dec.decode(buf, 6));
			});
		});
	});
}