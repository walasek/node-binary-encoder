const Benchmark = require('benchmark');
const bin = require('./');
const protobuf = require('protocol-buffers');
const fs = require('fs');
const proto_source = fs.readFileSync('./tests/benchmark/protobuf.proto');
const defs = protobuf(proto_source);
const MyMessage = require('./tests/benchmark/rules');
const Compiler = require('./Compiler');

const results_enc = {};
const results_dec = {};

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
	const turboDecoder = Compiler.compileDecoder(MyMessage);

	const enc_protobuf = defs.MyMessage.encode(original);
	const enc_json = JSON.stringify(original);
	const enc_bin = MyMessage.encode(original);

	new Benchmark.Suite('Encode')
	.add('protobuf (encode)', () => {
		defs.MyMessage.encode(original);
	})
	.add('binary-encoder (encode)', () => {
		MyMessage.encode(original);
	})
	.add('binary-encoder-buf (encode)', () => {
		MyMessage.encode(original, buf);
	})
	.add('binary-encoder-compiled (encode)', () => {
		turboEncoder(original);
	})
	.add('binary-encoder-compiled-buf (encode)', () => {
		turboEncoder(original, buf);
	})
	.add('json (encode)', () => {
		JSON.stringify(original);
	})
	.on('cycle', (ev) => {
		console.log(String(ev.target));
		if(!results_enc[n])
			results_enc[n] = {};
		results_enc[n][ev.target.name] = ev.target.hz;
	})
	.on('complete', function() {
		console.log(`Fastest Encoding for N=${n} is ${this.filter('fastest').map('name')}\n`);
	})
	.run();


	new Benchmark.Suite('Decode')
	.add('protobuf (decode)', () => {
		defs.MyMessage.decode(enc_protobuf);
	})
	.add('binary-encoder (decode)', () => {
		MyMessage.decode(enc_bin);
	})
	.add('binary-encoder-compiled (decode)', () => {
		turboDecoder(enc_bin);
	})
	.add('json (decode)', () => {
		JSON.stringify(enc_json);
	})
	.on('cycle', (ev) => {
		console.log(String(ev.target));
		if(!results_dec[n])
			results_dec[n] = {};
		results_dec[n][ev.target.name] = ev.target.hz;
	})
	.on('complete', function() {
		console.log(`Fastest Decoding for N=${n} is ${this.filter('fastest').map('name')}\n`);
	})
	.run();

	console.log(`Message sizes:\nprotobuf ${enc_protobuf.length} bytes\nbinary-encoder ${enc_bin.length}\njson ${enc_json.length}\n`);
}

runTestsForN(10);
runTestsForN(100);
runTestsForN(1000);
runTestsForN(10000);
runTestsForN(100000);
/*runTestsForN(1000000);
runTestsForN(10000000);*/

console.log('Results in CSV for plots:');
console.log(','+Object.keys(results_enc[10]));
Object.keys(results_enc).map(n => console.log(`${n},${Object.values(results_enc[n])}`));
console.log('');
console.log(','+Object.keys(results_dec[10]));
Object.keys(results_dec).map(n => console.log(`${n},${Object.values(results_dec[n])}`));