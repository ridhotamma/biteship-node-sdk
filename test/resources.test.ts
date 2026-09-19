import { beforeEach, describe, expect, it } from 'vitest';
import { Biteship } from '../src/index';
import { createMockFetch, type MockHandler } from './helpers';

const handler: MockHandler = ({ url }) => {
  if (url.pathname === '/v1/maps/areas') {
    return {
      body: {
        success: true,
        areas: [
          {
            id: 'IDNP6IDNC148IDND843IDZ12250',
            name: 'Pesanggrahan, Jakarta Selatan, DKI Jakarta. 12250',
            postal_code: 12250,
          },
        ],
      },
    };
  }
  if (url.pathname === '/v1/couriers') {
    return {
      body: {
        success: true,
        object: 'courier',
        couriers: [
          {
            courier_name: 'Grab',
            courier_code: 'grab',
            courier_service_name: 'Instant',
            courier_service_code: 'instant',
            available_for_cash_on_delivery: false,
            available_for_proof_of_delivery: false,
            available_for_instant_waybill_id: true,
          },
        ],
      },
    };
  }
  if (url.pathname === '/v1/trackings/WYB-1112223333443') {
    return {
      body: {
        success: true,
        object: 'tracking',
        id: '6051861741a37414e6637fab',
        waybill_id: 'WYB-1112223333443',
        status: 'delivered',
        history: [{ note: 'Item has been delivered.', status: 'delivered' }],
      },
    };
  }
  if (url.pathname.startsWith('/v1/locations/')) {
    return {
      body: {
        success: true,
        id: '61d565c69a3211036a05f3f8',
        name: 'Apotek Gambir',
        contact_name: 'Ahmad',
        contact_phone: '08123456789',
        address: 'Jl. Gambir Selatan no 5. Blok F 92. Jakarta Pusat.',
      },
    };
  }
  return { body: {} };
};

let fetch = createMockFetch(handler);

beforeEach(() => {
  fetch = createMockFetch(handler);
});

describe('couriers', () => {
  it('list gets /v1/couriers', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    const response = await biteship.couriers.list();

    expect(fetch.last().init.method).toBe('GET');
    expect(fetch.last().url.pathname).toBe('/v1/couriers');
    expect(response.couriers[0].courier_code).toBe('grab');
  });
});

describe('maps', () => {
  it('searchAreas gets /v1/maps/areas with defaults', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    const response = await biteship.maps.searchAreas({ input: 'Jakarta Selatan' });

    expect(fetch.last().url.pathname).toBe('/v1/maps/areas');
    expect(fetch.last().url.searchParams.get('input')).toBe('Jakarta Selatan');
    expect(fetch.last().url.searchParams.get('countries')).toBe('ID');
    expect(fetch.last().url.searchParams.get('type')).toBe('single');
    expect(response.areas[0].id).toBe('IDNP6IDNC148IDND843IDZ12250');
  });

  it('searchAreas supports custom countries', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.maps.searchAreas({ input: 'Kuala Lumpur', countries: 'MY' });

    expect(fetch.last().url.searchParams.get('countries')).toBe('MY');
  });
});

describe('locations', () => {
  it('create posts snake_case payload', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.locations.create({
      name: 'Apotik Gambir',
      contactName: 'Ahmad',
      contactPhone: '08123456789',
      address: 'Jl. Gambir Selatan no 5. Blok F 92. Jakarta Pusat.',
      note: 'Dekat tulisan warung Bu Indah',
      postalCode: 10110,
      latitude: -6.232123121,
      longitude: 102.22189911,
      type: 'origin',
    });

    expect(fetch.last().init.method).toBe('POST');
    expect(fetch.last().url.pathname).toBe('/v1/locations');
    expect(fetch.last().body).toEqual({
      name: 'Apotik Gambir',
      contact_name: 'Ahmad',
      contact_phone: '08123456789',
      address: 'Jl. Gambir Selatan no 5. Blok F 92. Jakarta Pusat.',
      note: 'Dekat tulisan warung Bu Indah',
      postal_code: 10110,
      latitude: -6.232123121,
      longitude: 102.22189911,
      type: 'origin',
    });
  });

  it('retrieve gets /v1/locations/:id', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    const location = await biteship.locations.retrieve('61d565c69a3211036a05f3f8');

    expect(fetch.last().init.method).toBe('GET');
    expect(fetch.last().url.pathname).toBe('/v1/locations/61d565c69a3211036a05f3f8');
    expect(location.name).toBe('Apotek Gambir');
  });

  it('update posts partial payload', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.locations.update('61d565c69a3211036a05f3f8', { name: 'Apotik Monas' });

    expect(fetch.last().init.method).toBe('POST');
    expect(fetch.last().url.pathname).toBe('/v1/locations/61d565c69a3211036a05f3f8');
    expect(fetch.last().body).toEqual({ name: 'Apotik Monas' });
  });

  it('delete sends DELETE /v1/locations/:id', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.locations.delete('61d565c69a3211036a05f3f8');

    expect(fetch.last().init.method).toBe('DELETE');
    expect(fetch.last().url.pathname).toBe('/v1/locations/61d565c69a3211036a05f3f8');
  });
});

describe('trackings', () => {
  it('retrieve gets /v1/trackings/:id', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    const tracking = await biteship.trackings.retrieve('WYB-1112223333443');

    expect(fetch.last().init.method).toBe('GET');
    expect(fetch.last().url.pathname).toBe('/v1/trackings/WYB-1112223333443');
    expect(tracking.status).toBe('delivered');
    expect(tracking.history?.[0].status).toBe('delivered');
  });

  it('url-encodes ids with special characters', async () => {
    const biteship = new Biteship('key', { fetchImpl: fetch.fetchImpl });
    await biteship.trackings.retrieve('abc/1 2');

    expect(fetch.last().url.pathname).toBe('/v1/trackings/abc%2F1%202');
  });
});
