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
// TODO
```

## Benchmarks

Below is a benchmark of storing _N_ values in a native `Set` object, a regular `{}` object, and the bloom filter. Combo tests first check existence with the bloom filter, then with the corresponding object/set. Keep in mind that the serialized filter occupies about 40 bytes of memory (in comparison to hudreds of megabytes in case of objects). A proper benchmark should perhaps attempt accessing the filesystem. Statistical report of false positives is printed with the `tests/domain.js` script. The following results are for a filter of length 10.

```
native-set x 1,327,960 ops/sec ±1.64% (90 runs sampled)
object x 3,470,091 ops/sec ±0.73% (92 runs sampled)
bloom-filter x 392,695 ops/sec ±0.89% (90 runs sampled)
Fastest Construction for N=10 is object

native-set x 9,716,608 ops/sec ±0.82% (96 runs sampled)
object x 37,327,440 ops/sec ±1.42% (91 runs sampled)
bloom-filter x 564,393 ops/sec ±0.57% (96 runs sampled)
bloom-set-combo x 542,737 ops/sec ±1.39% (95 runs sampled)
bloom-obj-combo x 562,978 ops/sec ±0.86% (92 runs sampled)
Fastest Test for N=10 is object

native-set x 161,173 ops/sec ±1.69% (96 runs sampled)
object x 440,619 ops/sec ±1.48% (90 runs sampled)
bloom-filter x 29,438 ops/sec ±1.63% (93 runs sampled)
Fastest Construction for N=100 is object

native-set x 1,236,300 ops/sec ±0.38% (96 runs sampled)
object x 4,965,125 ops/sec ±0.55% (92 runs sampled)
bloom-filter x 39,475 ops/sec ±1.26% (96 runs sampled)
bloom-set-combo x 38,792 ops/sec ±1.00% (96 runs sampled)
bloom-obj-combo x 39,218 ops/sec ±1.10% (91 runs sampled)
Fastest Test for N=100 is object

native-set x 17,372 ops/sec ±1.25% (92 runs sampled)
object x 49,233 ops/sec ±1.86% (94 runs sampled)
bloom-filter x 2,821 ops/sec ±0.34% (96 runs sampled)
Fastest Construction for N=1000 is object

native-set x 89,938 ops/sec ±0.83% (92 runs sampled)
object x 613,466 ops/sec ±0.51% (96 runs sampled)
bloom-filter x 3,505 ops/sec ±0.35% (97 runs sampled)
bloom-set-combo x 3,176 ops/sec ±0.93% (96 runs sampled)
bloom-obj-combo x 3,414 ops/sec ±1.23% (94 runs sampled)
Fastest Test for N=1000 is object

native-set x 1,391 ops/sec ±0.92% (92 runs sampled)
object x 5,610 ops/sec ±0.68% (97 runs sampled)
bloom-filter x 279 ops/sec ±1.12% (87 runs sampled)
Fastest Construction for N=10000 is object

native-set x 6,410 ops/sec ±0.50% (97 runs sampled)
object x 62,312 ops/sec ±1.21% (93 runs sampled)
bloom-filter x 349 ops/sec ±0.49% (92 runs sampled)
bloom-set-combo x 317 ops/sec ±1.09% (88 runs sampled)
bloom-obj-combo x 335 ops/sec ±1.60% (88 runs sampled)
Fastest Test for N=10000 is object

native-set x 88.74 ops/sec ±2.83% (66 runs sampled)
object x 261 ops/sec ±6.02% (64 runs sampled)
bloom-filter x 28.08 ops/sec ±0.80% (50 runs sampled)
Fastest Construction for N=100000 is object

native-set x 400 ops/sec ±2.66% (86 runs sampled)
object x 6,252 ops/sec ±1.34% (96 runs sampled)
bloom-filter x 34.75 ops/sec ±1.24% (61 runs sampled)
bloom-set-combo x 27.58 ops/sec ±1.95% (49 runs sampled)
bloom-obj-combo x 34.21 ops/sec ±1.30% (60 runs sampled)
Fastest Test for N=100000 is object

native-set x 4.66 ops/sec ±4.47% (16 runs sampled)
object x 16.91 ops/sec ±4.86% (38 runs sampled)
bloom-filter x 2.72 ops/sec ±2.61% (11 runs sampled)
Fastest Construction for N=1000000 is object

native-set x 13.25 ops/sec ±3.54% (37 runs sampled)
object x 636 ops/sec ±0.29% (93 runs sampled)
bloom-filter x 3.50 ops/sec ±0.50% (13 runs sampled)
bloom-set-combo x 2.28 ops/sec ±0.57% (10 runs sampled)
bloom-obj-combo x 3.41 ops/sec ±4.01% (13 runs sampled)
Fastest Test for N=1000000 is object

native-set x 0.28 ops/sec ±2.43% (5 runs sampled)
object x 1.53 ops/sec ±4.69% (9 runs sampled)
bloom-filter x 0.27 ops/sec ±1.22% (5 runs sampled)
Fastest Construction for N=10000000 is object

native-set x 1.23 ops/sec ±1.58% (8 runs sampled)
object x 63.08 ops/sec ±0.97% (65 runs sampled)
bloom-filter x 0.35 ops/sec ±0.69% (5 runs sampled)
bloom-set-combo x 0.22 ops/sec ±0.93% (5 runs sampled)
bloom-obj-combo x 0.35 ops/sec ±0.65% (5 runs sampled)
Fastest Test for N=10000000 is object
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