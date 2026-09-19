import type { HttpClient } from '../client';
import type { CouriersResponse } from '../types';

export class Couriers {
  constructor(private readonly http: HttpClient) {}

  /**
   * List all available couriers and their services.
   * GET /v1/couriers
   */
  list(): Promise<CouriersResponse> {
    return this.http.request<CouriersResponse>({
      method: 'GET',
      path: '/v1/couriers',
    });
  }
}
