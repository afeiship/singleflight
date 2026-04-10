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

## real-world example: token refresh

When multiple requests hit a 401 at the same time, you only want one refresh call — the rest share the same Promise.

```typescript
import SingleFlight from '@jswork/singleflight';

const sf = new SingleFlight<string>();
let token = '';

async function refreshToken(): Promise<string> {
  return sf.run('refresh-token', async () => {
    const res = await fetch('/api/refresh-token', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    token = data.token;
    return token;
  });
}

async function request(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: { ...options?.headers, Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    const newToken = await refreshToken();
    return fetch(url, {
      ...options,
      headers: { ...options?.headers, Authorization: `Bearer ${newToken}` },
    });
  }

  return res;
}
```

## license
Code released under [the MIT license](https://github.com/afeiship/singleflight/blob/main/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/singleflight
[version-url]: https://npmjs.org/package/@jswork/singleflight

[license-image]: https://img.shields.io/npm/l/@jswork/singleflight
[license-url]: https://github.com/afeiship/singleflight/blob/main/LICENSE.txt

[download-image]: https://img.shields.io/npm/dm/@jswork/singleflight
[download-url]: https://www.npmjs.com/package/@jswork/singleflight
