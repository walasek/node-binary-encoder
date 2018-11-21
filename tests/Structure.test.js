const lib = require('../');

module.exports = (t) => {
	t.test('Basic structure tests', (t) => {
		const BasicStructure = lib.Structure({
			A: lib.Uint32()
		});
		const o1 = {A: 1};
		const encoded_o1 = BasicStructure.encode(o1);
		t.equal(encoded_o1.length, 4, 'Structure has no length overhead');
		t.equal(BasicStructure.last_bytes_encoded, 4);

		const decoded_o1 = BasicStructure.decode(encoded_o1);
		t.ok(decoded_o1.A);
		t.equal(decoded_o1.A, o1.A);

		const enlarged_o1 = Buffer.concat([Buffer.from([0,0,0,0]), encoded_o1]);
		const dec2 = BasicStructure.decode(enlarged_o1, 4);
		t.ok(dec2.A);
		t.equal(dec2.A, o1.A);

		t.throws(() => {
			BasicStructure.decode(enlarged_o1, 5);
		});
	});

	t.test('Missing fields test', (t) => {
		const BasicStructure = lib.Structure({
			A: lib.Uint32(),
			B: lib.Uint32(),
		});

		t.throws(() => {
			BasicStructure.encode({A: 1});
		});
	})

	t.test('Multifield structures', (t) => {
		const BasicStructure = lib.Structure({
			A: lib.Uint32(),
			B: lib.Uint32(),
		});
		const o1 = {A: 1, B: 2};
		const encoded_o1 = BasicStructure.encode(o1);
		t.equal(encoded_o1.length, 8, 'Structure has no length overhead');
		t.equal(BasicStructure.last_bytes_encoded, 8);

		const decoded_o1 = BasicStructure.decode(encoded_o1);
		t.ok(decoded_o1.A);
		t.ok(decoded_o1.B);
		t.equal(decoded_o1.A, o1.A);
		t.equal(decoded_o1.B, o1.B);

		const enlarged_o1 = Buffer.concat([Buffer.from([0,0,0,0]), encoded_o1]);
		const dec2 = BasicStructure.decode(enlarged_o1, 4);
		t.ok(dec2.A);
		t.ok(dec2.B);
		t.equal(dec2.A, o1.A);
		t.equal(dec2.B, o1.B);

		t.throws(() => {
			BasicStructure.decode(enlarged_o1, 5);
		});
	});

	t.test('Nested structures', (t) => {
		const NestedStructure = lib.Structure({
			A: lib.Uint32(),
			B: lib.Uint32(),
		});
		const MainStructure = lib.Structure({
			Child1: NestedStructure,
			Child2: NestedStructure,
		});
		const o1 = {
			Child1: {A: 1, B: 2},
			Child2: {A: 3, B: 4},
		};
		const encoded = MainStructure.encode(o1);
		t.equal(encoded.length, 16, 'Structure has no length overhead');
		t.equal(MainStructure.last_bytes_encoded, 16);
		t.equal(NestedStructure.last_bytes_encoded, 8);

		const decoded = MainStructure.decode(encoded);
		t.equal(decoded.Child1.A, o1.Child1.A);
		t.equal(decoded.Child1.B, o1.Child1.B);
		t.equal(decoded.Child2.A, o1.Child2.A);
		t.equal(decoded.Child2.B, o1.Child2.B);
		t.equal(MainStructure.last_bytes_decoded, 16);

		const decoded_hack = NestedStructure.decode(encoded);
		t.equal(NestedStructure.last_bytes_decoded, 8);
		t.equal(decoded_hack.A, o1.Child1.A);
		t.equal(decoded_hack.B, o1.Child1.B);
	});

	t.test('Recursive structures wont really work', (t) => {
		let RecursiveStructure;
		RecursiveStructure = lib.Structure({
			value: lib.Uint32(),
			child: RecursiveStructure, // undefined
		});
		// Hack
		RecursiveStructure.descriptor.child = RecursiveStructure;

		const obj = {
			value: 1,
			child: {
				value: 2,
				child: {
					value: 3,
					child: {}
				}
			}
		};

		t.throws(() => {
			RecursiveStructure.encode(obj);
		});
	});

	t.test('Bad field descriptor', (t) => {
		const bad = lib.Structure({
			A: lib.Uint32(),
			B: 'not a valid descriptor'
		});

		t.throws(() => bad.encode({A:1,B:2}));
	});

	t.test('Empty descriptor', (t) => {
		const empty = lib.Structure({});
		const enc = empty.encode({});
		t.equal(enc.length, 0);

		t.throws(() => empty.encode({A: 1}));
	})
}