const { compileEncoder, compileDecoder } = require('../Compiler');
const { Structure, Uint8 } = require('../');
const struct = require('./benchmark/rules');

module.exports = (t) => {
	t.test('Compiler tests', (t) => {
		const encode = compileEncoder(struct, 2048);
		const decode = compileDecoder(struct);
		const original = {
			title: 'binary-encoder',
			from: {first_name: 'Karol', age: 25},
			to: {first_name: 'Jon', age: 30},
			content: Buffer.from('some content'.padEnd(1024, '0')),
			attachments: [
				{link: {url: 'https://github.com/walasek/node-binary-encoder'}}
			]
		};
		const result = encode(original);
		console.log(result);
		console.log(struct.encode(original));

		t.test('Data encoded by compiled function can be decoded normally', (t) => {
			const decoded = struct.decode(result);
			t.equal(JSON.stringify(original), JSON.stringify(decoded));
		});

		t.test('Data encoded by compiled function can be decoded by a compiled function', (t) => {
			const decoded = decode(result);
			t.equal(JSON.stringify(original), JSON.stringify(decoded));
		});

		t.test('Data encoded by recursive functions can be decoded by a compiled function', (t) => {
			const encoded = struct.encode(original);
			const decoded = decode(encoded);
			t.equal(JSON.stringify(original), JSON.stringify(decoded));
		});
	});
}