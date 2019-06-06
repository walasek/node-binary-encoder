const { compileEncoder, compileDecoder } = require('../Compiler');
const { Structure, Uint8 } = require('../');
const struct = require('./benchmark/rules');

module.exports = (t) => {
	t.test('Compiler tests', (t) => {
		const encode = compileEncoder(struct);
		const original = {
			title: 'binary-encoder',
			from: {first_name: 'Karol', age: 25},
			to: {first_name: 'Jon', age: 30},
			content: 'some content'.padEnd(1024, '0'),
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
	});
}