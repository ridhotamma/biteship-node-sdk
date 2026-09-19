import type { HttpClient } from '../client';
import type { Tracking } from '../types';

export class Trackings {
  constructor(private readonly http: HttpClient) {}

  /**
   * Retrieve tracking info by Biteship tracking id or courier waybill id.
   * Only works for orders created via the Orders API.
   * GET /v1/trackings/:id
   */
  retrieve(id: string): Promise<Tracking> {
    return this.http.request<Tracking>({
      method: 'GET',
      path: `/v1/trackings/${encodeURIComponent(id)}`,
    });
  }
}
