# singleflight
> Single flight pattern for TypeScript, deduplicate concurrent requests.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
yarn add @jswork/singleflight
```

## usage
```js
import SingleFlight from '@jswork/singleflight';

SingleFlight(1024);

// [1000, 0, 20, 4]
```

## license
Code released under [the MIT license](https://github.com/afeiship/singleflight/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/singleflight
[version-url]: https://npmjs.org/package/@jswork/singleflight

[license-image]: https://img.shields.io/npm/l/@jswork/singleflight
[license-url]: https://github.com/afeiship/singleflight/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/singleflight
[size-url]: https://github.com/afeiship/singleflight/blob/master/dist/singleflight.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/singleflight
[download-url]: https://www.npmjs.com/package/@jswork/singleflight
