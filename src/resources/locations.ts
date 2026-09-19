import type { HttpClient } from '../client';
import type { LocationParams, LocationResponse, LocationUpdateParams } from '../types';

export class Locations {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a location saved to your Biteship dashboard address book.
   * POST /v1/locations
   */
  create(params: LocationParams): Promise<LocationResponse> {
    return this.http.request<LocationResponse>({
      method: 'POST',
      path: '/v1/locations',
      body: params,
    });
  }

  /**
   * Retrieve a location by id.
   * GET /v1/locations/:id
   */
  retrieve(id: string): Promise<LocationResponse> {
    return this.http.request<LocationResponse>({
      method: 'GET',
      path: `/v1/locations/${encodeURIComponent(id)}`,
    });
  }

  /**
   * Update a location. Only send the fields you want to change.
   * POST /v1/locations/:id
   */
  update(id: string, params: LocationUpdateParams): Promise<LocationResponse> {
    return this.http.request<LocationResponse>({
      method: 'POST',
      path: `/v1/locations/${encodeURIComponent(id)}`,
      body: params,
    });
  }

  /**
   * Delete a location.
   * DELETE /v1/locations/:id
   */
  delete(id: string): Promise<LocationResponse> {
    return this.http.request<LocationResponse>({
      method: 'DELETE',
      path: `/v1/locations/${encodeURIComponent(id)}`,
    });
  }
}
