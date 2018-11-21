# [node-binary-encoder](https://github.com/walasek/node-binary-encoder) [![Build Status](https://img.shields.io/travis/walasek/node-binary-encoder.svg?style=flat-square)](https://travis-ci.org/walasek/node-binary-encoder) [![Package Version](https://img.shields.io/npm/v/binary-encoder.svg?style=flat-square)](https://www.npmjs.com/walasek/node-binary-encoder) ![License](https://img.shields.io/npm/l/binary-encoder.svg?style=flat-square) [![Dependencies](https://david-dm.org/walasek/node-binary-encoder.svg)](https://david-dm.org/walasek/node-binary-encoder.svg)  [![codecov](https://codecov.io/gh/walasek/node-binary-encoder/branch/master/graph/badge.svg)](https://codecov.io/gh/walasek/node-binary-encoder)

Quick and consistent binary encoding of data structures.

---

## Goal

Encoding data in raw buffers is a difficult task especially in terms of description of the encoding end decoding process. This project aims to deliver tools for easy description of data structures that can be encoded into raw buffers, and decoded from raw buffers and data streams.

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
```

## API

### Basic Types
Type | Usage | Size
--- | --- | ---
Uint8 | A byte of data (value range 0-255) | 1
Uint32 | Little-endian unsigned int (0-(2^32-1)) | 4
Varint | A Protobuf-style Varint, same value range as Uint32 | 1-5
Implementing [U]Int* variants is trivial.

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

The following benchmark results compare Protobuf to this implementation for some basic data structure and a long string of length at least N. `binary-encoder-buf` uses a preallocated buffer for all operations.

```
protobuf x 264,940 ops/sec ±1.00% (92 runs sampled)
binary-encoder x 23,463 ops/sec ±2.79% (90 runs sampled)
binary-encoder-buf x 89,261 ops/sec ±1.18% (90 runs sampled)
json x 258,351 ops/sec ±0.52% (94 runs sampled)
Fastest Transcoding for N=10 is protobuf

protobuf x 260,823 ops/sec ±1.04% (95 runs sampled)
binary-encoder x 13,564 ops/sec ±1.70% (90 runs sampled)
binary-encoder-buf x 69,481 ops/sec ±0.78% (96 runs sampled)
json x 229,297 ops/sec ±1.27% (95 runs sampled)
Fastest Transcoding for N=100 is protobuf

protobuf x 207,682 ops/sec ±1.36% (89 runs sampled)
binary-encoder x 1,615 ops/sec ±4.55% (76 runs sampled)
binary-encoder-buf x 20,205 ops/sec ±0.86% (94 runs sampled)
json x 126,046 ops/sec ±1.27% (94 runs sampled)
Fastest Transcoding for N=1000 is protobuf

protobuf x 76,755 ops/sec ±2.15% (80 runs sampled)
binary-encoder x 57.94 ops/sec ±5.05% (61 runs sampled)
binary-encoder-buf x 2,366 ops/sec ±0.98% (93 runs sampled)
json x 23,853 ops/sec ±1.02% (95 runs sampled)
Fastest Transcoding for N=10000 is protobuf

protobuf x 11,710 ops/sec ±2.32% (88 runs sampled)
binary-encoder x 0.71 ops/sec ±5.96% (6 runs sampled)
binary-encoder-buf x 169 ops/sec ±2.72% (77 runs sampled)
json x 2,651 ops/sec ±0.66% (95 runs sampled)
Fastest Transcoding for N=100000 is protobuf
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