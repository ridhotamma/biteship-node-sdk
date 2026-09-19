import type { HttpClient } from '../client';
import type {
  CancelOrderParams,
  CancelOrderResponse,
  CancellationLanguage,
  CancellationReasonsResponse,
  Order,
  OrderParams,
  OrderUpdateParams,
} from '../types';

export class Orders {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create an order to be picked up by a courier.
   * POST /v1/orders
   */
  create(params: OrderParams): Promise<Order> {
    return this.http.request<Order>({
      method: 'POST',
      path: '/v1/orders',
      body: params,
    });
  }

  /**
   * Retrieve an order by id.
   * GET /v1/orders/:id
   */
  retrieve(id: string): Promise<Order> {
    return this.http.request<Order>({
      method: 'GET',
      path: `/v1/orders/${encodeURIComponent(id)}`,
    });
  }

  /**
   * Update an order. Only possible while the order is not yet confirmed.
   * POST /v1/orders/:id
   */
  update(id: string, params: OrderUpdateParams): Promise<Order> {
    return this.http.request<Order>({
      method: 'POST',
      path: `/v1/orders/${encodeURIComponent(id)}`,
      body: params,
    });
  }

  /**
   * Cancel an order using a cancellation reason code.
   * POST /v1/orders/:id/cancel
   */
  cancel(id: string, params: CancelOrderParams): Promise<CancelOrderResponse> {
    return this.http.request<CancelOrderResponse>({
      method: 'POST',
      path: `/v1/orders/${encodeURIComponent(id)}/cancel`,
      body: {
        cancellationReasonCode: params.reasonCode,
        cancellationReason: params.reason,
      },
    });
  }

  /**
   * List available order cancellation reason codes.
   * GET /v1/orders/cancellation_reasons
   */
  cancellationReasons(lang: CancellationLanguage = 'id'): Promise<CancellationReasonsResponse> {
    return this.http.request<CancellationReasonsResponse>({
      method: 'GET',
      path: '/v1/orders/cancellation_reasons',
      query: { lang },
    });
  }

  /**
   * Delete an order.
   * DELETE /v1/orders/:id
   * @deprecated The API now prefers orders.cancel().
   */
  delete(id: string): Promise<CancelOrderResponse> {
    return this.http.request<CancelOrderResponse>({
      method: 'DELETE',
      path: `/v1/orders/${encodeURIComponent(id)}`,
    });
  }
}
