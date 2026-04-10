import SingleFlight from '../src';

describe('refreshToken scenario', () => {
  let token: string;
  let refreshCount: number;
  let sf: SingleFlight<string>;

  beforeEach(() => {
    token = 'expired-token';
    refreshCount = 0;
    sf = new SingleFlight<string>();
  });

  async function refreshToken(): Promise<string> {
    return sf.run('refresh-token', async () => {
      refreshCount++;
      token = 'new-token';
      return token;
    });
  }

  async function request(): Promise<string> {
    if (token === 'expired-token') {
      const newToken = await refreshToken();
      return `response-with-${newToken}`;
    }
    return `response-with-${token}`;
  }

  test('multiple concurrent 401s trigger only one refresh', async () => {
    const results = await Promise.all([
      request(),
      request(),
      request(),
      request(),
      request(),
    ]);

    // All requests get the new token
    expect(results).toEqual(Array(5).fill('response-with-new-token'));
    // Only one refresh call was made
    expect(refreshCount).toBe(1);
  });

  test('after refresh, next expired-token request triggers a new refresh', async () => {
    // First batch — triggers refresh
    await request();
    expect(refreshCount).toBe(1);

    // Token expires again
    token = 'expired-token';

    // Second batch — triggers a new refresh
    const result = await request();
    expect(result).toBe('response-with-new-token');
    expect(refreshCount).toBe(2);
  });

  test('refresh failure propagates to all waiting requests', async () => {
    const failSf = new SingleFlight<string>();

    const failRefresh = () =>
      failSf.run('refresh-token', async () => {
        refreshCount++;
        throw new Error('network error');
      });

    const results = await Promise.allSettled([
      failRefresh(),
      failRefresh(),
      failRefresh(),
    ]);

    // All callers received the same error
    expect(results.every((r) => r.status === 'rejected')).toBe(true);
    if (results[0].status === 'rejected') {
      expect(results[0].reason.message).toBe('network error');
    }
    // Only one refresh attempt was made
    expect(refreshCount).toBe(1);
  });
});
