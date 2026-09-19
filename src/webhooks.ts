import { BiteshipError } from './errors';

export type WebhookEventName = 'order.status' | 'order.price' | 'order.waybill_id';

export interface OrderStatusWebhook {
  event: 'order.status';
  order_id: string;
  courier_tracking_id?: string;
  courier_waybill_id?: string;
  courier_company?: string;
  courier_type?: string;
  courier_driver_name?: string | null;
  courier_driver_phone?: string | null;
  courier_driver_photo_url?: string | null;
  courier_driver_plate_number?: string | null;
  courier_link?: string | null;
  order_price?: number;
  status?: string;
}

export interface OrderPriceWebhook {
  event: 'order.price';
  order_id: string;
  cash_on_delivery_fee?: number;
  proof_of_delivery_fee?: number;
  // Field name is spelled "shippment_fee" in the Biteship API payload.
  shippment_fee?: number;
  price?: number;
  courier_tracking_id?: string;
  courier_waybill_id?: string;
  status?: string;
}

export interface OrderWaybillIdWebhook {
  event: 'order.waybill_id';
  order_id: string;
  courier_tracking_id?: string;
  courier_waybill_id?: string;
  status?: string;
}

export type WebhookPayload = OrderStatusWebhook | OrderPriceWebhook | OrderWaybillIdWebhook;

/**
 * Parse and validate a Biteship webhook request body into a typed payload.
 * Throws BiteshipError when the body is not a valid Biteship webhook.
 */
export function parseWebhook(payload: unknown): WebhookPayload {
  if (typeof payload !== 'object' || payload === null) {
    throw new BiteshipError('Invalid Biteship webhook payload: expected a JSON object');
  }
  const event = (payload as Record<string, unknown>).event;
  if (event === 'order.status') return payload as OrderStatusWebhook;
  if (event === 'order.price') return payload as OrderPriceWebhook;
  if (event === 'order.waybill_id') return payload as OrderWaybillIdWebhook;
  throw new BiteshipError(`Unknown Biteship webhook event: ${String(event)}`);
}
