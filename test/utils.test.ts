import { describe, expect, it } from 'vitest';
import { toSnakeCase } from '../src/utils';

describe('toSnakeCase', () => {
  it('converts camelCase keys to snake_case', () => {
    expect(toSnakeCase({ originContactName: 'Amir', deliveryType: 'now' })).toEqual({
      origin_contact_name: 'Amir',
      delivery_type: 'now',
    });
  });

  it('leaves already snake_case keys unchanged', () => {
    expect(toSnakeCase({ origin_area_id: 'X', destination_postal_code: 1 })).toEqual({
      origin_area_id: 'X',
      destination_postal_code: 1,
    });
  });

  it('converts nested objects and arrays of objects', () => {
    const input = {
      originCoordinate: { latitude: -6.2, longitude: 106.8 },
      items: [{ itemName: 'Shoes', quantity: 2 }],
    };
    expect(toSnakeCase(input)).toEqual({
      origin_coordinate: { latitude: -6.2, longitude: 106.8 },
      items: [{ item_name: 'Shoes', quantity: 2 }],
    });
  });

  it('passes metadata through untouched', () => {
    const metadata = { myCustomKey: { nestedCamel: 1 }, another_one: 2 };
    expect(toSnakeCase({ metadata, orderNote: 'hi' })).toEqual({
      metadata: { myCustomKey: { nestedCamel: 1 }, another_one: 2 },
      order_note: 'hi',
    });
  });

  it('keeps primitives, null, arrays of primitives and Dates as-is', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    expect(toSnakeCase('Hello')).toBe('Hello');
    expect(toSnakeCase(42)).toBe(42);
    expect(toSnakeCase(null)).toBe(null);
    expect(toSnakeCase(undefined)).toBe(undefined);
    expect(toSnakeCase(['a', 'b'])).toEqual(['a', 'b']);
    expect(toSnakeCase(date)).toBe(date);
  });
});
