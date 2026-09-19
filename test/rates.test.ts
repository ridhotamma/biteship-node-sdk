import { beforeEach, describe, expect, it } from 'vitest';
import { Biteship } from '../src/index';
import { createMockFetch, type MockHandler } from './helpers';

const ratesHandler: MockHandler = () => ({
  body: {
    success: true,
    object: 'courier_pricing',
    message: 'Success to retrieve courier pricing',
    pricing: [
      {
        company: 'jne',
        courier_code: 'jne',
        courier_service_code: 'reg',
        price: 11000,
        available_for_insurance: false,
        available_for_cash_on_delivery: true,
        available_for_proof_of_delivery: true,
        available_for_instant_waybill_id: true,
      },
    ],
  },
});

let fetch = createMockFetch(ratesHandler);

beforeEach(() => {
  fetch = createMockFetch(ratesHandler);
});

describe('rates.calculate', () => {
  it('posts to /v1/rates/couriers and joins courier arrays', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.rates.calculate({
      originPostalCode: 12440,
      destinationPostalCode: 12240,
      couriers: ['jne', 'sicepat'],
      items: [
        {
          name: 'Shoes',
          description: 'Black colored size 45',
          value: 199000,
          weight: 200,
          quantity: 1,
          length: 30,
          width: 15,
          height: 20,
        },
      ],
    });

    expect(fetch.last().init.method).toBe('POST');
    expect(fetch.last().url.pathname).toBe('/v1/rates/couriers');
    expect(fetch.last().body).toEqual({
      origin_postal_code: 12440,
      destination_postal_code: 12240,
      couriers: 'jne,sicepat',
      items: [
        {
          name: 'Shoes',
          description: 'Black colored size 45',
          value: 199000,
          weight: 200,
          quantity: 1,
          length: 30,
          width: 15,
          height: 20,
        },
      ],
    });
  });

  it('accepts a comma separated courier string as-is', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.rates.calculate({
      originLatitude: -6.3031123,
      originLongitude: 106.7794934999,
      destinationLatitude: -6.2441792,
      destinationLongitude: 106.783529,
      couriers: 'grab,jne,tiki',
      items: [{ name: 'Shoes', value: 199000, quantity: 2, weight: 200 }],
    });

    expect(fetch.last().body).toMatchObject({ couriers: 'grab,jne,tiki' });
  });

  it('supports area ids, insurance and COD parameters', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.rates.calculate({
      originAreaId: 'IDNP6IDNC148IDND836IDZ12410',
      destinationAreaId: 'IDNP6IDNC148IDND836IDZ12430',
      couriers: ['sicepat'],
      courierInsurance: 199000,
      destinationCashOnDelivery: 199000,
      destinationCashOnDeliveryType: '7_days',
      items: [{ name: 'Shoes', value: 199000, quantity: 1, weight: 200 }],
    });

    expect(fetch.last().body).toEqual({
      origin_area_id: 'IDNP6IDNC148IDND836IDZ12410',
      destination_area_id: 'IDNP6IDNC148IDND836IDZ12430',
      couriers: 'sicepat',
      courier_insurance: 199000,
      destination_cash_on_delivery: 199000,
      destination_cash_on_delivery_type: '7_days',
      items: [{ name: 'Shoes', value: 199000, quantity: 1, weight: 200 }],
    });
  });

  it('returns the parsed pricing response', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    const response = await biteship.rates.calculate({
      originPostalCode: 12440,
      destinationPostalCode: 12240,
      couriers: ['jne'],
      items: [{ name: 'Shoes', value: 199000, quantity: 1, weight: 200 }],
    });

    expect(response.object).toBe('courier_pricing');
    expect(response.pricing[0].company).toBe('jne');
    expect(response.pricing[0].price).toBe(11000);
  });
});
