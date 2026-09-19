import { describe, expect, it } from 'vitest';
import { HttpClient } from '../src/client';
import { BiteshipAPIError, BiteshipConfigError, BiteshipNetworkError } from '../src/errors';
import { createMockFetch } from './helpers';

const successHandler = () => ({ body: { success: true } });

describe('HttpClient', () => {
  it('throws BiteshipConfigError when the api key is missing or blank', () => {
    expect(() => new HttpClient({ apiKey: '' })).toThrow(BiteshipConfigError);
    expect(() => new HttpClient({ apiKey: '   ' })).toThrow(BiteshipConfigError);
  });

  it('sends the raw api key and json content type in headers', async () => {
    const { fetchImpl, last } = createMockFetch(successHandler);
    const client = new HttpClient({ apiKey: 'biteship_test.abc', fetchImpl });
    await client.request({ method: 'GET', path: '/v1/couriers' });

    const headers = new Headers(last().init.headers);
    expect(headers.get('authorization')).toBe('biteship_test.abc');
    expect(headers.get('content-type')).toBe('application/json');
  });

  it('trims trailing slashes from the base url', async () => {
    const { fetchImpl, last } = createMockFetch(successHandler);
    const client = new HttpClient({
      apiKey: 'key',
      baseUrl: 'http://localhost:9999///',
      fetchImpl,
    });
    await client.request({ method: 'GET', path: '/v1/couriers' });

    expect(last().url.toString()).toBe('http://localhost:9999/v1/couriers');
  });

  it('serializes query params and skips undefined values', async () => {
    const { fetchImpl, last } = createMockFetch(successHandler);
    const client = new HttpClient({ apiKey: 'key', fetchImpl });
    await client.request({
      method: 'GET',
      path: '/v1/maps/areas',
      query: { input: 'Jakarta Selatan', lang: undefined, page: 2 },
    });

    const params = last().url.searchParams;
    expect(params.get('input')).toBe('Jakarta Selatan');
    expect(params.get('page')).toBe('2');
    expect(params.has('lang')).toBe(false);
  });

  it('converts request bodies to snake_case', async () => {
    const { fetchImpl, last } = createMockFetch(successHandler);
    const client = new HttpClient({ apiKey: 'key', fetchImpl });
    await client.request({
      method: 'POST',
      path: '/v1/orders',
      body: { originContactName: 'Amir', metadata: { keepMe: 1 } },
    });

    expect(last().body).toEqual({
      origin_contact_name: 'Amir',
      metadata: { keepMe: 1 },
    });
  });

  it('returns the parsed JSON response', async () => {
    const { fetchImpl } = createMockFetch(() => ({ body: { success: true, pricing: [] } }));
    const client = new HttpClient({ apiKey: 'key', fetchImpl });
    const result = await client.request<{ success: boolean; pricing: unknown[] }>({
      method: 'POST',
      path: '/v1/rates/couriers',
    });

    expect(result).toEqual({ success: true, pricing: [] });
  });

  it('returns undefined for an empty response body', async () => {
    const { fetchImpl } = createMockFetch(() => ({ text: '' }));
    const client = new HttpClient({ apiKey: 'key', fetchImpl });
    const result = await client.request({ method: 'DELETE', path: '/v1/locations/1' });

    expect(result).toBeUndefined();
  });

  it('throws BiteshipAPIError with code and details from JSON error bodies', async () => {
    const { fetchImpl } = createMockFetch(() => ({
      status: 400,
      body: {
        success: false,
        error: 'Reference id has already been used before. Please input other reference id',
        code: 40002060,
        details: { order_id: 'order-1', reference_id: 'ref-1' },
      },
    }));
    const client = new HttpClient({ apiKey: 'key', fetchImpl });

    const error = await client
      .request({ method: 'POST', path: '/v1/orders', body: {} })
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BiteshipAPIError);
    expect((error as BiteshipAPIError).message).toContain('Reference id has already been used');
    expect((error as BiteshipAPIError).httpStatus).toBe(400);
    expect((error as BiteshipAPIError).code).toBe(40002060);
    expect((error as BiteshipAPIError).details).toEqual({
      order_id: 'order-1',
      reference_id: 'ref-1',
    });
  });

  it('falls back to the message field when the error body has no error field', async () => {
    const { fetchImpl } = createMockFetch(() => ({
      status: 404,
      body: { success: false, message: 'Order not found', code: 40002057 },
    }));
    const client = new HttpClient({ apiKey: 'key', fetchImpl });

    const error = await client
      .request({ method: 'GET', path: '/v1/orders/nope' })
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BiteshipAPIError);
    expect((error as BiteshipAPIError).message).toBe('Order not found');
    expect((error as BiteshipAPIError).code).toBe(40002057);
  });

  it('handles non-JSON error bodies', async () => {
    const { fetchImpl } = createMockFetch(() => ({
      status: 502,
      text: '<html>Bad Gateway</html>',
    }));
    const client = new HttpClient({ apiKey: 'key', fetchImpl });

    const error = await client
      .request({ method: 'GET', path: '/v1/couriers' })
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BiteshipAPIError);
    expect((error as BiteshipAPIError).message).toBe('Biteship API error (HTTP 502)');
    expect((error as BiteshipAPIError).code).toBeUndefined();
  });

  it('wraps fetch failures in BiteshipNetworkError', async () => {
    const fetchImpl = (async () => {
      throw new Error('connection refused');
    }) as unknown as typeof fetch;
    const client = new HttpClient({ apiKey: 'key', fetchImpl });

    const error = await client
      .request({ method: 'GET', path: '/v1/couriers' })
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BiteshipNetworkError);
    expect((error as BiteshipNetworkError).message).toContain('connection refused');
  });
});
