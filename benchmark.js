const Benchmark = require('benchmark');
const bin = require('./');
const protobuf = require('protocol-buffers');
const fs = require('fs');
const proto_source = fs.readFileSync('./tests/benchmark/protobuf.proto');
const defs = protobuf(proto_source);
const MyMessage = require('./tests/benchmark/rules');
const Compiler = require('./Compiler');

function runTestsForN(n){
	const original = {
		title: 'binary-encoder',
		from: {first_name: 'Karol', age: 25},
		to: {first_name: 'Jon', age: 30},
		content: 'some content'.padEnd(n, '0'),
		attachments: [
			{link: {url: 'https://github.com/walasek/node-binary-encoder'}}
		]
	};
	const buf = Buffer.allocUnsafe(2*n+1024);
	const turboEncoder = Compiler.compileEncoder(MyMessage, buf.length);

	new Benchmark.Suite('Encode')
	.add('protobuf', () => {
		const r = defs.MyMessage.encode(original);
		const obj = defs.MyMessage.decode(r);
		if(!obj.attachments[0].link.url)
			throw Error('nope');
	})
	.add('binary-encoder', () => {
		const r = MyMessage.encode(original);
		const obj = MyMessage.decode(r);
		if(!obj.attachments[0].link.url)
			throw Error('nope');
	})
	.add('binary-encoder-buf', () => {
		const r = MyMessage.encode(original, buf);
		const obj = MyMessage.decode(r);
		if(!obj.attachments[0].link.url)
			throw Error('nope');
	})
	.add('binary-encoder-compiled', () => {
		const r = turboEncoder(original);
		// TODO: Swap this later
		const obj = MyMessage.decode(r);
		if(!obj.attachments[0].link.url)
			throw Error('nope');
	})
	.add('binary-encoder-compiled-buf', () => {
		const r = turboEncoder(original, buf);
		// TODO: Swap this later
		const obj = MyMessage.decode(r);
		if(!obj.attachments[0].link.url)
			throw Error('nope');
	})
	.add('json', () => {
		const r = JSON.stringify(original);
		const obj = JSON.parse(r);
		if(!obj.attachments[0].link.url)
			throw Error('nope');
	})
	.on('cycle', (ev) => {
		console.log(String(ev.target));
	})
	.on('complete', function() {
		console.log(`Fastest Transcoding for N=${n} is ${this.filter('fastest').map('name')}\n`);
	})
	.run();
}

runTestsForN(10);
runTestsForN(100);
runTestsForN(1000);
runTestsForN(10000);
runTestsForN(100000);
/*runTestsForN(1000000);
runTestsForN(10000000);*/