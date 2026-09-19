import { describe, expect, it } from 'vitest';
import { Biteship, BiteshipConfigError, Couriers, DraftOrders, Locations, Maps, Orders, Rates, Trackings } from '../src/index';
import { createMockFetch } from './helpers';

describe('Biteship client', () => {
  it('exposes all resources', () => {
    const biteship = new Biteship('biteship_test.abc');
    expect(biteship.rates).toBeInstanceOf(Rates);
    expect(biteship.couriers).toBeInstanceOf(Couriers);
    expect(biteship.maps).toBeInstanceOf(Maps);
    expect(biteship.locations).toBeInstanceOf(Locations);
    expect(biteship.orders).toBeInstanceOf(Orders);
    expect(biteship.draftOrders).toBeInstanceOf(DraftOrders);
    expect(biteship.trackings).toBeInstanceOf(Trackings);
  });

  it('throws BiteshipConfigError without an api key', () => {
    expect(() => new Biteship('')).toThrow(BiteshipConfigError);
  });

  it('passes baseUrl and timeout options through', async () => {
    const mock = createMockFetch(() => ({ body: { success: true } }));
    const biteship = new Biteship('key', {
      baseUrl: 'http://localhost:9999',
      fetchImpl: mock.fetchImpl,
    });
    await biteship.couriers.list();

    expect(mock.last().url.toString()).toBe('http://localhost:9999/v1/couriers');
  });
});
