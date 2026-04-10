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
```typescript
import SingleFlight from '@jswork/singleflight';

const sf = new SingleFlight<string>();

// Concurrent dedup: same key executes only once
const result = await sf.run('user:1', () => fetch('/api/user/1').then(r => r.json()));
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
