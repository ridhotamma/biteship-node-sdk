import { beforeEach, describe, expect, it } from 'vitest';
import { Biteship } from '../src/index';
import { createMockFetch, type MockHandler } from './helpers';

const order = {
  success: true,
  message: 'Order successfully created',
  object: 'order',
  id: '5dd599ebdefcd4158eb8470b',
  status: 'confirmed',
  price: 48000,
};

const orderHandler: MockHandler = ({ url, init }) => {
  if (url.pathname === '/v1/orders/cancellation_reasons') {
    return {
      body: {
        success: true,
        message: 'Order cancellation reasons successfully retrieved',
        cancellation_reasons: [{ code: 'change_courier', reason: 'Ingin mengganti kurir' }],
      },
    };
  }
  if (url.pathname.endsWith('/cancel')) {
    return {
      body: {
        success: true,
        message: 'Order successfully deleted',
        object: 'order',
        id: '5dd5a396248481164a225af4',
        status: 'cancelled',
        cancellation_reason_code: 'others',
        cancellation_reason: 'Accidentally ordered',
      },
    };
  }
  return { body: order };
};

let fetch = createMockFetch(orderHandler);

beforeEach(() => {
  fetch = createMockFetch(orderHandler);
});

const createParams = {
  originContactName: 'Amir',
  originContactPhone: '088888888888',
  originAddress: 'Plaza Senayan, Jalan Asia Afrik...',
  originPostalCode: 12440,
  destinationContactName: 'John Doe',
  destinationContactPhone: '088888888888',
  destinationAddress: 'Lebak Bulus MRT...',
  destinationPostalCode: 12950,
  courierCompany: 'jne',
  courierType: 'reg',
  deliveryType: 'now' as const,
  orderNote: 'Please be careful',
  metadata: { internal: { myKey: true } },
  items: [
    { name: 'Black L', description: 'White Shirt', value: 165000, quantity: 1, weight: 200 },
  ],
};

describe('orders', () => {
  it('create posts snake_case payload to /v1/orders', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.orders.create(createParams);

    expect(fetch.last().init.method).toBe('POST');
    expect(fetch.last().url.pathname).toBe('/v1/orders');
    expect(fetch.last().body).toEqual({
      origin_contact_name: 'Amir',
      origin_contact_phone: '088888888888',
      origin_address: 'Plaza Senayan, Jalan Asia Afrik...',
      origin_postal_code: 12440,
      destination_contact_name: 'John Doe',
      destination_contact_phone: '088888888888',
      destination_address: 'Lebak Bulus MRT...',
      destination_postal_code: 12950,
      courier_company: 'jne',
      courier_type: 'reg',
      delivery_type: 'now',
      order_note: 'Please be careful',
      metadata: { internal: { myKey: true } },
      items: [
        { name: 'Black L', description: 'White Shirt', value: 165000, quantity: 1, weight: 200 },
      ],
    });
  });

  it('create maps instant courier coordinates', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.orders.create({
      ...createParams,
      originCoordinate: { latitude: -6.2253114, longitude: 106.7993735 },
      destinationCoordinate: { latitude: -6.28927, longitude: 106.77492 },
    });

    expect(fetch.last().body).toMatchObject({
      origin_coordinate: { latitude: -6.2253114, longitude: 106.7993735 },
      destination_coordinate: { latitude: -6.28927, longitude: 106.77492 },
    });
  });

  it('retrieve gets /v1/orders/:id and returns the order', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    const result = await biteship.orders.retrieve('5dd599ebdefcd4158eb8470b');

    expect(fetch.last().init.method).toBe('GET');
    expect(fetch.last().url.pathname).toBe('/v1/orders/5dd599ebdefcd4158eb8470b');
    expect(result.id).toBe('5dd599ebdefcd4158eb8470b');
    expect(result.status).toBe('confirmed');
  });

  it('update posts to /v1/orders/:id', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.orders.update('5dd599ebdefcd4158eb8470b', { orderNote: 'updated' });

    expect(fetch.last().init.method).toBe('POST');
    expect(fetch.last().url.pathname).toBe('/v1/orders/5dd599ebdefcd4158eb8470b');
    expect(fetch.last().body).toEqual({ order_note: 'updated' });
  });

  it('cancel posts cancellation_reason_code and optional reason', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    const result = await biteship.orders.cancel('5dd5a396248481164a225af4', {
      reasonCode: 'others',
      reason: 'Accidentally ordered',
    });

    expect(fetch.last().init.method).toBe('POST');
    expect(fetch.last().url.pathname).toBe('/v1/orders/5dd5a396248481164a225af4/cancel');
    expect(fetch.last().body).toEqual({
      cancellation_reason_code: 'others',
      cancellation_reason: 'Accidentally ordered',
    });
    expect(result.status).toBe('cancelled');
  });

  it('cancel omits the reason when not provided', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.orders.cancel('5dd5a396248481164a225af4', { reasonCode: 'change_courier' });

    expect(fetch.last().body).toEqual({ cancellation_reason_code: 'change_courier' });
  });

  it('cancellationReasons defaults to bahasa and supports english', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.orders.cancellationReasons();
    expect(fetch.last().url.searchParams.get('lang')).toBe('id');

    await biteship.orders.cancellationReasons('en');
    expect(fetch.last().url.searchParams.get('lang')).toBe('en');
  });

  it('delete sends DELETE /v1/orders/:id', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.orders.delete('5dd5a396248481164a225af4');

    expect(fetch.last().init.method).toBe('DELETE');
    expect(fetch.last().url.pathname).toBe('/v1/orders/5dd5a396248481164a225af4');
  });
});
