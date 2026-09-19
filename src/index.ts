import { HttpClient, type ClientOptions } from './client';
import { Couriers } from './resources/couriers';
import { DraftOrders } from './resources/draftOrders';
import { Locations } from './resources/locations';
import { Maps } from './resources/maps';
import { Orders } from './resources/orders';
import { Rates } from './resources/rates';
import { Trackings } from './resources/trackings';

export type { ClientOptions, RequestOptions } from './client';
export { DEFAULT_BASE_URL, DEFAULT_TIMEOUT_MS, HttpClient } from './client';
export { Couriers } from './resources/couriers';
export { DraftOrders } from './resources/draftOrders';
export { Locations } from './resources/locations';
export { Maps } from './resources/maps';
export { Orders } from './resources/orders';
export { Rates } from './resources/rates';
export { Trackings } from './resources/trackings';
export * from './errors';
export * from './types';
export * from './webhooks';

export class Biteship {
  /** Calculate shipping rates across couriers. */
  public readonly rates: Rates;
  /** List available couriers and services. */
  public readonly couriers: Couriers;
  /** Search area ids for highest-accuracy addresses. */
  public readonly maps: Maps;
  /** Manage saved locations from your dashboard address book. */
  public readonly locations: Locations;
  /** Create, retrieve, update and cancel shipments. */
  public readonly orders: Orders;
  /** Prepare orders without charge, then confirm when ready. */
  public readonly draftOrders: DraftOrders;
  /** Track shipments by tracking id or waybill id. */
  public readonly trackings: Trackings;

  constructor(apiKey: string, options: Omit<ClientOptions, 'apiKey'> = {}) {
    const http = new HttpClient({ ...options, apiKey });
    this.rates = new Rates(http);
    this.couriers = new Couriers(http);
    this.maps = new Maps(http);
    this.locations = new Locations(http);
    this.orders = new Orders(http);
    this.draftOrders = new DraftOrders(http);
    this.trackings = new Trackings(http);
  }
}
