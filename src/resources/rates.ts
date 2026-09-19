import type { HttpClient } from '../client';
import type { RatesParams, RatesResponse } from '../types';

export class Rates {
  constructor(private readonly http: HttpClient) {}

  /**
   * Calculate shipping rates across multiple couriers.
   * POST /v1/rates/couriers
   */
  calculate(params: RatesParams): Promise<RatesResponse> {
    const couriers = Array.isArray(params.couriers)
      ? params.couriers.join(',')
      : params.couriers;
    return this.http.request<RatesResponse>({
      method: 'POST',
      path: '/v1/rates/couriers',
      body: { ...params, couriers },
    });
  }
}
