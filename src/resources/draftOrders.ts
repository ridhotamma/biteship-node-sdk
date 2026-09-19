import type { HttpClient } from '../client';
import type {
  DeletedResponse,
  DraftOrder,
  DraftOrderParams,
  DraftOrderUpdateParams,
  Order,
  RatesResponse,
} from '../types';

export class DraftOrders {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a draft order. You are not charged until it is confirmed.
   * POST /v1/draft_orders
   */
  create(params: DraftOrderParams): Promise<DraftOrder> {
    return this.http.request<DraftOrder>({
      method: 'POST',
      path: '/v1/draft_orders',
      body: params,
    });
  }

  /**
   * Retrieve a draft order by id.
   * GET /v1/draft_orders/:id
   */
  retrieve(id: string): Promise<DraftOrder> {
    return this.http.request<DraftOrder>({
      method: 'GET',
      path: `/v1/draft_orders/${encodeURIComponent(id)}`,
    });
  }

  /**
   * Retrieve courier pricing for the draft order's origin and destination.
   * GET /v1/draft_orders/:id/rates
   */
  rates(id: string): Promise<RatesResponse> {
    return this.http.request<RatesResponse>({
      method: 'GET',
      path: `/v1/draft_orders/${encodeURIComponent(id)}/rates`,
    });
  }

  /**
   * Update a draft order while it has not been confirmed yet.
   * POST /v1/draft_orders/:id
   */
  update(id: string, params: DraftOrderUpdateParams): Promise<DraftOrder> {
    return this.http.request<DraftOrder>({
      method: 'POST',
      path: `/v1/draft_orders/${encodeURIComponent(id)}`,
      body: params,
    });
  }

  /**
   * Convenience method to set the courier, moving the draft order to "ready".
   * Values must come from draftOrders.rates().
   */
  setCourier(
    id: string,
    courier: { company: string; type: string }
  ): Promise<DraftOrder> {
    return this.update(id, {
      courierCompany: courier.company,
      courierType: courier.type,
    });
  }

  /**
   * Confirm a "ready" draft order, which creates a real order.
   * POST /v1/draft_orders/:id/confirm
   */
  confirm(id: string): Promise<Order> {
    return this.http.request<Order>({
      method: 'POST',
      path: `/v1/draft_orders/${encodeURIComponent(id)}/confirm`,
    });
  }

  /**
   * Delete a draft order. Deleted drafts cannot be reactivated.
   * DELETE /v1/draft_orders/:id
   */
  delete(id: string): Promise<DeletedResponse> {
    return this.http.request<DeletedResponse>({
      method: 'DELETE',
      path: `/v1/draft_orders/${encodeURIComponent(id)}`,
    });
  }
}
