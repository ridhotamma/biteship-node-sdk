import { describe, expect, it } from 'vitest';
import { BiteshipError } from '../src/errors';
import { parseWebhook } from '../src/webhooks';

describe('parseWebhook', () => {
  it('parses order.status payloads', () => {
    const payload = parseWebhook({
      event: 'order.status',
      courier_tracking_id: 'XYZ-123-PQS',
      courier_waybill_id: 'SKS-XXXXX',
      courier_company: 'JNE',
      courier_type: 'REG',
      order_id: '5dd6da88f43bd430ecd5aa2e',
      order_price: 100000,
      status: 'confirmed',
    });

    expect(payload.event).toBe('order.status');
    expect(payload).toMatchObject({ order_id: '5dd6da88f43bd430ecd5aa2e', status: 'confirmed' });
  });

  it('parses order.price payloads', () => {
    const payload = parseWebhook({
      event: 'order.price',
      cash_on_delivery_fee: 100000,
      order_id: 'ASjsd92Asd2d1ASdj91',
      price: 100000,
      proof_of_delivery_fee: 2000,
      shippment_fee: 10000,
      status: 'picked',
    });

    expect(payload.event).toBe('order.price');
    if (payload.event === 'order.price') {
      expect(payload.shippment_fee).toBe(10000);
      expect(payload.price).toBe(100000);
    }
  });

  it('parses order.waybill_id payloads', () => {
    const payload = parseWebhook({
      event: 'order.waybill_id',
      order_id: 'AbSASD12213dadas',
      courier_waybill_id: 'abc-1234',
      status: 'picked',
    });

    expect(payload.event).toBe('order.waybill_id');
    expect(payload).toMatchObject({ order_id: 'AbSASD12213dadas', courier_waybill_id: 'abc-1234' });
  });

  it('throws for non-object payloads', () => {
    expect(() => parseWebhook(null)).toThrow(BiteshipError);
    expect(() => parseWebhook('nope')).toThrow(BiteshipError);
  });

  it('throws for unknown or missing event names', () => {
    expect(() => parseWebhook({ event: 'order.unknown' })).toThrow(BiteshipError);
    expect(() => parseWebhook({ order_id: '123' })).toThrow(BiteshipError);
  });
});
