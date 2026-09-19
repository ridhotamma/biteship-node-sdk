import { beforeEach, describe, expect, it } from 'vitest';
import { Biteship } from '../src/index';
import { createMockFetch, type MockHandler } from './helpers';

const draftHandler: MockHandler = ({ url }) => {
  if (url.pathname.endsWith('/rates')) {
    return {
      body: {
        success: true,
        object: 'courier_pricing',
        pricing: [
          {
            company: 'sicepat',
            courier_code: 'sicepat',
            courier_service_code: 'reg',
            price: 11500,
          },
        ],
      },
    };
  }
  if (url.pathname.endsWith('/confirm')) {
    return {
      body: {
        success: true,
        message: 'Order successfully created',
        object: 'order',
        id: '66eba364e2e5a64816928197',
        draft_order_id: 'ef18275c-02a9-4887-a56b-f374edb96ec4',
        status: 'confirmed',
      },
    };
  }
  return {
    body: {
      success: true,
      code: 20111002,
      object: 'draft_order',
      id: 'ef18275c-02a9-4887-a56b-f374edb96ec4',
      order_id: null,
      status: 'ready',
      price: 11500,
    },
  };
};

let fetch = createMockFetch(draftHandler);

beforeEach(() => {
  fetch = createMockFetch(draftHandler);
});

describe('draftOrders', () => {
  it('create posts to /v1/draft_orders', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.draftOrders.create({
      originContactName: 'Amir',
      originContactPhone: '081234567890',
      originAddress: 'Plaza Senayan, Jalan Asia Afrik...',
      originPostalCode: 12440,
      destinationContactName: 'John Doe',
      destinationContactPhone: '088888888888',
      destinationAddress: 'Lebak Bulus MRT...',
      destinationPostalCode: 12950,
      deliveryType: 'now',
      items: [{ name: 'Black L', value: 165000, quantity: 1, weight: 200 }],
    });

    expect(fetch.last().init.method).toBe('POST');
    expect(fetch.last().url.pathname).toBe('/v1/draft_orders');
    expect(fetch.last().body).toMatchObject({
      origin_contact_name: 'Amir',
      origin_postal_code: 12440,
      delivery_type: 'now',
    });
  });

  it('retrieve gets /v1/draft_orders/:id', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    const draft = await biteship.draftOrders.retrieve('ef18275c-02a9-4887-a56b-f374edb96ec4');

    expect(fetch.last().init.method).toBe('GET');
    expect(fetch.last().url.pathname).toBe('/v1/draft_orders/ef18275c-02a9-4887-a56b-f374edb96ec4');
    expect(draft.object).toBe('draft_order');
    expect(draft.status).toBe('ready');
  });

  it('rates gets /v1/draft_orders/:id/rates', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    const rates = await biteship.draftOrders.rates('ef18275c-02a9-4887-a56b-f374edb96ec4');

    expect(fetch.last().init.method).toBe('GET');
    expect(fetch.last().url.pathname).toBe(
      '/v1/draft_orders/ef18275c-02a9-4887-a56b-f374edb96ec4/rates'
    );
    expect(rates.object).toBe('courier_pricing');
    expect(rates.pricing[0].company).toBe('sicepat');
  });

  it('update posts to /v1/draft_orders/:id', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.draftOrders.update('ef18275c-02a9-4887-a56b-f374edb96ec4', {
      originCoordinate: { latitude: -6.1751, longitude: 106.865 },
    });

    expect(fetch.last().init.method).toBe('POST');
    expect(fetch.last().url.pathname).toBe('/v1/draft_orders/ef18275c-02a9-4887-a56b-f374edb96ec4');
    expect(fetch.last().body).toEqual({
      origin_coordinate: { latitude: -6.1751, longitude: 106.865 },
    });
  });

  it('setCourier sends courier_company and courier_type', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.draftOrders.setCourier('ef18275c-02a9-4887-a56b-f374edb96ec4', {
      company: 'sicepat',
      type: 'reg',
    });

    expect(fetch.last().init.method).toBe('POST');
    expect(fetch.last().body).toEqual({ courier_company: 'sicepat', courier_type: 'reg' });
  });

  it('confirm posts to /confirm and returns the created order', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    const order = await biteship.draftOrders.confirm('ef18275c-02a9-4887-a56b-f374edb96ec4');

    expect(fetch.last().init.method).toBe('POST');
    expect(fetch.last().url.pathname).toBe(
      '/v1/draft_orders/ef18275c-02a9-4887-a56b-f374edb96ec4/confirm'
    );
    expect(order.object).toBe('order');
    expect(order.id).toBe('66eba364e2e5a64816928197');
    expect(order.draft_order_id).toBe('ef18275c-02a9-4887-a56b-f374edb96ec4');
  });

  it('delete sends DELETE /v1/draft_orders/:id', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.draftOrders.delete('ef18275c-02a9-4887-a56b-f374edb96ec4');

    expect(fetch.last().init.method).toBe('DELETE');
    expect(fetch.last().url.pathname).toBe('/v1/draft_orders/ef18275c-02a9-4887-a56b-f374edb96ec4');
  });
});
