# [node-binary-encoder](https://github.com/walasek/node-binary-encoder) [![Build Status](https://img.shields.io/travis/walasek/node-binary-encoder.svg?style=flat-square)](https://travis-ci.org/walasek/node-binary-encoder) [![Package Version](https://img.shields.io/npm/v/binary-encoder.svg?style=flat-square)](https://www.npmjs.com/walasek/node-binary-encoder) ![License](https://img.shields.io/npm/l/binary-encoder.svg?style=flat-square) [![Dependencies](https://david-dm.org/walasek/node-binary-encoder.svg)](https://david-dm.org/walasek/node-binary-encoder.svg)  [![codecov](https://codecov.io/gh/walasek/node-binary-encoder/branch/master/graph/badge.svg)](https://codecov.io/gh/walasek/node-binary-encoder)

Quick and consistent binary encoding of data structures.

---

## Goal

Encoding data in raw buffers is a difficult task especially in terms of description of the encoding and decoding process. This project aims to deliver tools for easy description of data structures that can be encoded into raw buffers, and decoded from raw buffers and data streams.

## Installation

Node `>=8.9.0` is required.

```bash
npm install --save binary-encoder
```

To perform tests use:

```bash
cd node_modules/binary-encoder
npm i
npm t
```

This project also has a benchmark that you can run yourself:

```bash
cd node_modules/binary-encoder
npm i
npm run benchmark
```

## Usage

Beware this project is still in development. There may be serious bugs or performance issues over time.

Documentation is available [here](https://walasek.github.io/node-binary-encoder/).

```javascript
const bin = require('binary-encoder');

// A basic structure definition
const Person = bin.Structure({
    first_name: bin.String(),
    age: bin.Uint32(),
});

const Image = bin.Structure({
    binary: bin.Data(),
});
const Link = bin.Structure({
    url: bin.String(),
});

// A Protobuf-style OneOf union
const Attachment = bin.OneOf({
    image: Image,
    link: Link,
});

// Definitions can be nested
const MyMessage = bin.Structure({
    title: bin.String(),
    from: Person,
    to: Person,
    content: bin.String(),
    attachments: bin.Array(Attachment),
});

// Any type or definition can be encoded and decoded
const my_message = {
    title: 'binary-encoder',
    from: {first_name: 'Karol', age: 25},
    to: {first_name: 'Jon', age: 30},
    content: 'This library is awesome!',
    attachments: [
        {link: {url: 'https://github.com/walasek/node-binary-encoder'}},
    ],
};
const buffer = MyMessage.encode(my_message);
// socket.send(buffer); fs.writeFileSync(..., buffer); or something else here
// ...
// socket.on('data', ...); fs.readFilesync(...); or something else here
const message = MyMessage.decode(buffer);
// t.deepEqual(message, my_message, 'This would pass');


// Generate a more efficient function to encode/decode.
const encoder = bin.compileEncoder(MyMessage);
const decoder = bin.compileEncoder(MyMessage);

// This is a bit faster than using MyMessage.encode/decode
// For the maximum speed use a temporary buffer (allocated once)
const tmp = Buffer.alloc(1024);
encoder(my_message, tmp);
// ...
message = decoder(tmp);
message = MyMessage.decode(tmp); // Calls are compatible
```

## API

### Basic Types
Type | Usage | Size
--- | --- | ---
Uint8 | A byte of data (value range 0-255) | 1
Uint16 | Two bytes of data (value range 0-(2^16-1)) | 2
Int16 | Two bytes signed (value range -32768:32767) | 2
Uint32 | Little-endian unsigned int (0-(2^32-1)) | 4
Int32 | Found bytes signed (value range -2^16:2^16-1) | 4
Varint | A Protobuf-style Varint, same value range as Uint32 | 1-5

### Structures
Type | Usage | Size
--- | --- | ---
Structure | An object that maps types to keys. Order matters. All fields must be present, additional fields that are not declared earlier will not be encoded. | Sum of fields
Array | A list of values (can be of any type). Variable length by default, can be set as fixed size. | Sum of values (+ _Varint_ size if the array is not fixed size)
OneOf | Protobuf-style _OneOf_ which allows only one member to be encoded. Can be considered as a C-style _union_. | _Varint_ size + value size

### Advanced Types
Type | Usage | Size
--- | --- | ---
Constant | A Uint8 constant. If attempting to decode or encode a different value an exception is thrown. | 1 (Uint8)
Optional | Marks a field as optional (null if not present). | 1 + value size (if set)
Data | A generic binary buffer. Equivalent to an Array of Uint8's. Can be fixed size. | (Array)
String | A UTF-8 encoded string. Equivalent to Data with some post processing. Can be fixed size. | (Array)

## Ideas and plans

- [x] Generate code for super fast encoding and decoding
- [ ] Provide utilities for format versioning
- [ ] An efficient Boolean type that allows storing of 8 values in a single byte
- [ ] Better transcoding error reporting
- [ ] Make decoding at least as fast as protobuf

## Benchmarks

The following benchmark compares Protobuf to this implementation for some basic data structure and a long string of length at least N. `binary-encoder-buf` uses a preallocated buffer for all operations. `binary-encoder-compiled` uses an API that generates a structural function (rather than recursive) that is much more efficient. This API has replaced the old transcoding functions in version 0.4

```
protobuf (encode) x 275,101 ops/sec ±2.73% (86 runs sampled)
binary-encoder (encode) x 279,292 ops/sec ±1.89% (86 runs sampled)
binary-encoder-buf (encode) x 378,238 ops/sec ±3.42% (91 runs sampled)
binary-encoder-compiled (encode) x 302,381 ops/sec ±1.64% (84 runs sampled)
binary-encoder-compiled-buf (encode) x 396,369 ops/sec ±0.80% (94 runs sampled)
json (encode) x 334,773 ops/sec ±1.24% (91 runs sampled)
Fastest Encoding for N=10 is binary-encoder-compiled-buf (encode)

protobuf (decode) x 1,003,710 ops/sec ±2.11% (95 runs sampled)
binary-encoder (decode) x 577,905 ops/sec ±0.59% (92 runs sampled)
binary-encoder-compiled (decode) x 619,247 ops/sec ±1.12% (92 runs sampled)
json (decode) x 1,218,423 ops/sec ±1.39% (93 runs sampled)
Fastest Decoding for N=10 is json (decode)

Message sizes:
protobuf 102 bytes
binary-encoder 95
json 265

protobuf (encode) x 302,829 ops/sec ±0.61% (93 runs sampled)
binary-encoder (encode) x 292,029 ops/sec ±2.80% (83 runs sampled)
binary-encoder-buf (encode) x 387,583 ops/sec ±2.05% (92 runs sampled)
binary-encoder-compiled (encode) x 317,967 ops/sec ±1.79% (90 runs sampled)
binary-encoder-compiled-buf (encode) x 390,195 ops/sec ±2.22% (94 runs sampled)
json (encode) x 139,347 ops/sec ±1.84% (90 runs sampled)
Fastest Encoding for N=100 is binary-encoder-compiled-buf (encode),binary-encoder-buf (encode)

protobuf (decode) x 988,917 ops/sec ±1.54% (89 runs sampled)
binary-encoder (decode) x 611,869 ops/sec ±2.07% (90 runs sampled)
binary-encoder-compiled (decode) x 625,291 ops/sec ±0.65% (93 runs sampled)
json (decode) x 701,532 ops/sec ±2.00% (93 runs sampled)
Fastest Decoding for N=100 is protobuf (decode)

Message sizes:
protobuf 190 bytes
binary-encoder 183
json 529

protobuf (encode) x 265,475 ops/sec ±1.54% (89 runs sampled)
binary-encoder (encode) x 272,316 ops/sec ±2.26% (89 runs sampled)
binary-encoder-buf (encode) x 361,452 ops/sec ±2.31% (89 runs sampled)
binary-encoder-compiled (encode) x 276,349 ops/sec ±2.03% (87 runs sampled)
binary-encoder-compiled-buf (encode) x 389,293 ops/sec ±0.95% (91 runs sampled)
json (encode) x 20,450 ops/sec ±2.52% (90 runs sampled)
Fastest Encoding for N=1000 is binary-encoder-compiled-buf (encode)

protobuf (decode) x 1,005,756 ops/sec ±0.64% (90 runs sampled)
binary-encoder (decode) x 600,982 ops/sec ±2.93% (93 runs sampled)
binary-encoder-compiled (decode) x 608,827 ops/sec ±1.73% (86 runs sampled)
json (decode) x 150,480 ops/sec ±0.92% (97 runs sampled)
Fastest Decoding for N=1000 is protobuf (decode)

Message sizes:
protobuf 1091 bytes
binary-encoder 1084
json 3229

protobuf (encode) x 188,602 ops/sec ±1.95% (90 runs sampled)
binary-encoder (encode) x 96,150 ops/sec ±6.07% (75 runs sampled)
binary-encoder-buf (encode) x 323,255 ops/sec ±2.10% (92 runs sampled)
binary-encoder-compiled (encode) x 91,660 ops/sec ±6.28% (70 runs sampled)
binary-encoder-compiled-buf (encode) x 324,058 ops/sec ±1.82% (93 runs sampled)
json (encode) x 2,152 ops/sec ±2.42% (94 runs sampled)
Fastest Encoding for N=10000 is binary-encoder-compiled-buf (encode)

protobuf (decode) x 1,003,324 ops/sec ±1.62% (94 runs sampled)
binary-encoder (decode) x 620,480 ops/sec ±1.18% (93 runs sampled)
binary-encoder-compiled (decode) x 604,111 ops/sec ±1.75% (91 runs sampled)
json (decode) x 16,745 ops/sec ±1.37% (89 runs sampled)
Fastest Decoding for N=10000 is protobuf (decode)

Message sizes:
protobuf 10091 bytes
binary-encoder 10084
json 30229

protobuf (encode) x 43,479 ops/sec ±7.56% (76 runs sampled)
binary-encoder (encode) x 17,175 ops/sec ±3.98% (84 runs sampled)
binary-encoder-buf (encode) x 144,706 ops/sec ±1.55% (91 runs sampled)
binary-encoder-compiled (encode) x 16,500 ops/sec ±5.55% (83 runs sampled)
binary-encoder-compiled-buf (encode) x 139,586 ops/sec ±2.27% (91 runs sampled)
json (encode) x 196 ops/sec ±0.73% (82 runs sampled)
Fastest Encoding for N=100000 is binary-encoder-buf (encode)

protobuf (decode) x 1,005,751 ops/sec ±1.22% (95 runs sampled)
binary-encoder (decode) x 626,437 ops/sec ±0.65% (91 runs sampled)
binary-encoder-compiled (decode) x 613,772 ops/sec ±1.72% (94 runs sampled)
json (decode) x 1,725 ops/sec ±1.14% (93 runs sampled)
Fastest Decoding for N=100000 is protobuf (decode)

Message sizes:
protobuf 100092 bytes
binary-encoder 100085
json 300229

Results in CSV for plots:
,protobuf (encode),binary-encoder (encode),binary-encoder-buf (encode),binary-encoder-compiled (encode),binary-encoder-compiled-buf (encode),json (encode)
10,275100.89346097526,279292.22569242545,378238.19335844467,302381.22546956234,396368.88476240553,334772.6771391154
100,302829.2292918837,292028.7469037824,387583.1739925365,317966.9913567071,390194.88813506975,139346.78461104393
1000,265474.88563085516,272316.1912953785,361451.80561332963,276349.15915051894,389293.1210141299,20450.177162941625
10000,188601.77150885522,96150.19232190275,323255.18721761,91659.97990245724,324058.26913309,2152.266905785588
100000,43479.42604434454,17174.572831579495,144705.5132266813,16499.57203120676,139585.7696546299,196.42320811682777

,protobuf (decode),binary-encoder (decode),binary-encoder-compiled (decode),json (decode)
10,1003710.2172942789,577904.5272137446,619247.4478993919,1218423.0929970394
100,988917.2158851528,611868.8883996161,625291.1413850804,701531.7270248663
1000,1005756.3483413532,600981.523941358,608826.877034854,150480.01344809862
10000,1003323.8427481409,620480.0659664081,604110.5598468462,16744.669505525177
100000,1005751.3702685619,626437.4469872701,613771.6145731651,1725.0958798853685
```

## Contributing

The source is documented with JSDoc. To generate the documentation use:

```bash
npm run docs
```

Extra debugging information is printed using the `debug` module:

```bash
DEBUG=binary-encoder:* npm t
```

The documentation will be put in the new `docs` directory.

To introduce an improvement please fork this project, commit changes in a new branch to your fork and add a pull request on this repository pointing at your fork. Please follow these style recommendations when working on the code:

* Use tabs (yup).
* Use `async`/`await` and/or `Promise` where possible.
* Features must be properly tested.
* New methods must be properly documented with `jscode` style comments.