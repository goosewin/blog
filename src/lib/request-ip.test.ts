import { describe, expect, it } from 'vite-plus/test';
import { getClientIp } from './request-ip';

describe('getClientIp', () => {
  it('uses the first x-forwarded-for hop', () => {
    const request = new Request('https://www.goose.dev/api/subscribe', {
      headers: {
        'x-forwarded-for': ' 203.0.113.1, 10.0.0.1 ',
        'x-real-ip': '10.0.0.2',
      },
    });

    expect(getClientIp(request)).toBe('203.0.113.1');
  });

  it('falls back to x-real-ip and then unknown', () => {
    expect(
      getClientIp(
        new Request('https://www.goose.dev/api/subscribe', {
          headers: { 'x-real-ip': ' 198.51.100.9 ' },
        })
      )
    ).toBe('198.51.100.9');
    expect(
      getClientIp(new Request('https://www.goose.dev/api/subscribe'))
    ).toBe('unknown');
  });
});
