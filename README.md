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

// EXPERIMENTAL API
// The following functions will be removed in the future.
// Generate a more efficient function to encode/decode.
const encoder = bin.compileEncoder(MyMessage);
const decoder = bin.compileEncoder(MyMessage);

// This is approximately 100% faster than recursive functions, but experimental at this time.
// For the maximum speed use a temporary buffer (allocated once)
const tmp = Buffer.alloc(1024);
encoder(my_message, tmp);
// ...
message = decoder(tmp);
message = MyMessage.decode(tmp); // Backwards compatible
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

## Benchmarks

The following benchmark compares Protobuf to this implementation for some basic data structure and a long string of length at least N. `binary-encoder-buf` uses a preallocated buffer for all operations. `binary-encoder-compiled` uses an experimental API that generates a structural function (rather than recursive) that is much more efficient.

```
protobuf (encode) x 263,847 ops/sec ±2.28% (85 runs sampled)
binary-encoder (encode) x 64,397 ops/sec ±3.27% (77 runs sampled)
binary-encoder-buf (encode) x 166,912 ops/sec ±2.63% (80 runs sampled)
binary-encoder-compiled (encode) x 252,473 ops/sec ±2.53% (83 runs sampled)
binary-encoder-compiled-buf (encode) x 368,113 ops/sec ±2.07% (85 runs sampled)
json (encode) x 304,341 ops/sec ±2.20% (88 runs sampled)
Fastest Encoding for N=10 is binary-encoder-compiled-buf (encode)

protobuf (decode) x 888,844 ops/sec ±2.16% (81 runs sampled)
binary-encoder (decode) x 305,803 ops/sec ±2.70% (76 runs sampled)
binary-encoder-compiled (decode) x 570,504 ops/sec ±1.87% (88 runs sampled)
json (decode) x 1,087,999 ops/sec ±2.08% (87 runs sampled)
Fastest Decoding for N=10 is json (decode)

Message sizes:
protobuf 102 bytes
binary-encoder 95
json 265

protobuf (encode) x 248,611 ops/sec ±2.20% (84 runs sampled)
binary-encoder (encode) x 69,762 ops/sec ±1.77% (84 runs sampled)
binary-encoder-buf (encode) x 171,689 ops/sec ±3.98% (81 runs sampled)
binary-encoder-compiled (encode) x 224,163 ops/sec ±3.91% (75 runs sampled)
binary-encoder-compiled-buf (encode) x 332,148 ops/sec ±3.53% (79 runs sampled)
json (encode) x 125,643 ops/sec ±2.27% (83 runs sampled)
Fastest Encoding for N=100 is binary-encoder-compiled-buf (encode)

protobuf (decode) x 849,158 ops/sec ±3.50% (83 runs sampled)
binary-encoder (decode) x 309,057 ops/sec ±2.86% (78 runs sampled)
binary-encoder-compiled (decode) x 481,219 ops/sec ±4.96% (74 runs sampled)
json (decode) x 631,153 ops/sec ±1.97% (87 runs sampled)
Fastest Decoding for N=100 is protobuf (decode)

Message sizes:
protobuf 190 bytes
binary-encoder 183
json 529

protobuf (encode) x 218,729 ops/sec ±3.15% (78 runs sampled)
binary-encoder (encode) x 64,804 ops/sec ±2.43% (85 runs sampled)
binary-encoder-buf (encode) x 173,645 ops/sec ±2.57% (82 runs sampled)
binary-encoder-compiled (encode) x 218,610 ops/sec ±3.87% (73 runs sampled)
binary-encoder-compiled-buf (encode) x 357,404 ops/sec ±2.50% (84 runs sampled)
json (encode) x 18,060 ops/sec ±2.86% (85 runs sampled)
Fastest Encoding for N=1000 is binary-encoder-compiled-buf (encode)

protobuf (decode) x 907,313 ops/sec ±1.46% (89 runs sampled)
binary-encoder (decode) x 339,065 ops/sec ±1.98% (86 runs sampled)
binary-encoder-compiled (decode) x 580,952 ops/sec ±1.68% (86 runs sampled)
json (decode) x 138,365 ops/sec ±1.58% (90 runs sampled)
Fastest Decoding for N=1000 is protobuf (decode)

Message sizes:
protobuf 1091 bytes
binary-encoder 1084
json 3229

protobuf (encode) x 143,791 ops/sec ±4.72% (76 runs sampled)
binary-encoder (encode) x 44,473 ops/sec ±3.73% (81 runs sampled)
binary-encoder-buf (encode) x 162,560 ops/sec ±2.35% (82 runs sampled)
binary-encoder-compiled (encode) x 82,039 ops/sec ±6.18% (65 runs sampled)
binary-encoder-compiled-buf (encode) x 289,004 ops/sec ±3.98% (81 runs sampled)
json (encode) x 1,675 ops/sec ±5.04% (77 runs sampled)
Fastest Encoding for N=10000 is binary-encoder-compiled-buf (encode)

protobuf (decode) x 848,061 ops/sec ±3.28% (82 runs sampled)
binary-encoder (decode) x 338,013 ops/sec ±1.77% (84 runs sampled)
binary-encoder-compiled (decode) x 563,351 ops/sec ±2.63% (84 runs sampled)
json (decode) x 16,073 ops/sec ±0.91% (93 runs sampled)
Fastest Decoding for N=10000 is protobuf (decode)

Message sizes:
protobuf 10091 bytes
binary-encoder 10084
json 30229

protobuf (encode) x 35,712 ops/sec ±8.44% (72 runs sampled)
binary-encoder (encode) x 11,461 ops/sec ±6.95% (75 runs sampled)
binary-encoder-buf (encode) x 99,910 ops/sec ±1.93% (87 runs sampled)
binary-encoder-compiled (encode) x 15,237 ops/sec ±5.31% (82 runs sampled)
binary-encoder-compiled-buf (encode) x 149,437 ops/sec ±1.35% (90 runs sampled)
json (encode) x 171 ops/sec ±3.47% (72 runs sampled)
Fastest Encoding for N=100000 is binary-encoder-compiled-buf (encode)

protobuf (decode) x 842,279 ops/sec ±2.77% (82 runs sampled)
binary-encoder (decode) x 316,650 ops/sec ±2.88% (81 runs sampled)
binary-encoder-compiled (decode) x 591,702 ops/sec ±1.93% (85 runs sampled)
json (decode) x 1,632 ops/sec ±0.68% (91 runs sampled)
Fastest Decoding for N=100000 is protobuf (decode)

Message sizes:
protobuf 100092 bytes
binary-encoder 100085
json 300229

Results in CSV for plots:
,protobuf (encode),binary-encoder (encode),binary-encoder-buf (encode),binary-encoder-compiled (encode),binary-encoder-compiled-buf (encode),json (encode)
10,263846.9073576735,64396.66812325595,166912.4244514077,252472.81891420262,368113.2204249347,304340.9733025798
100,248611.2680726218,69761.85906312823,171688.58036597492,224162.88279805557,332147.5526819311,125643.16435198345
1000,218729.48935518216,64804.45415508803,173644.57690728805,218610.08661295244,357403.71497006307,18059.71502669489
10000,143790.94828889717,44472.53288733788,162559.73559819476,82039.03267299477,289004.0518322682,1674.9432137929612
100000,35712.408241261044,11461.013689383273,99909.66569366025,15236.606656340335,149436.75087655275,170.69591493006303

,protobuf (decode),binary-encoder (decode),binary-encoder-compiled (decode),json (decode)
10,888843.5927172618,305803.3415753891,570503.5158795862,1087998.6920098183
100,849158.20272219,309056.5345350961,481219.4509456205,631152.9125705716
1000,907313.1785145177,339065.13895150385,580952.110157544,138365.14403254417
10000,848061.1820993097,338013.1009018717,563350.7465400948,16073.098278377967
100000,842279.1236521575,316650.2037582322,591702.3236950247,1632.3852198601567
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