import type { HttpClient } from '../client';
import type { AreasResponse, SearchAreasParams } from '../types';

export class Maps {
  constructor(private readonly http: HttpClient) {}

  /**
   * Search areas for autocomplete, returning area ids usable as
   * origin/destination in rates and orders (highest accuracy).
   * GET /v1/maps/areas
   */
  searchAreas(params: SearchAreasParams): Promise<AreasResponse> {
    return this.http.request<AreasResponse>({
      method: 'GET',
      path: '/v1/maps/areas',
      query: {
        input: params.input,
        countries: params.countries ?? 'ID',
        type: params.type ?? 'single',
      },
    });
  }
}
