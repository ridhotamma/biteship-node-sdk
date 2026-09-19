# biteship-node-sdk

A modern, intuitive Node.js SDK for the [Biteship API](https://biteship.com/id/docs/intro) — shipping rates, orders, draft orders, tracking, couriers, locations and maps.

- **Zero dependencies** — built on native `fetch` (Node.js 18+)
- **TypeScript-first** — full type definitions for every request and response
- **Intuitive API** — camelCase request params are auto-converted to the API's snake_case
- **ESM + CJS** — dual builds with generated types, ready for any bundler or `require()`

## Installation

```bash
npm install biteship-node-sdk
```

## Quick start

```ts
import { Biteship } from 'biteship-node-sdk';

const biteship = new Biteship('biteship_test.YOUR_API_KEY');

// 1. Find an area id for the highest-accuracy addresses
const areas = await biteship.maps.searchAreas({ input: 'Jakarta Selatan' });

// 2. Check shipping rates
const rates = await biteship.rates.calculate({
  originAreaId: areas.areas[0].id,
  destinationAreaId: 'IDNP6IDNC147IDND835IDZ10210',
  couriers: ['jne', 'sicepat', 'grab'],
  items: [{ name: 'Shoes', value: 199000, weight: 200, quantity: 1 }],
});

console.log(rates.pricing.map((p) => `${p.courier_name}: ${p.price}`));

// 3. Create an order with the courier you picked
const order = await biteship.orders.create({
  originContactName: 'Amir',
  originContactPhone: '08123456789',
  originAddress: 'Plaza Senayan, Jalan Asia Afrika',
  originPostalCode: 12440,
  destinationContactName: 'John Doe',
  destinationContactPhone: '088888888888',
  destinationAddress: 'Lebak Bulus MRT',
  destinationPostalCode: 12950,
  courierCompany: 'jne',
  courierType: 'reg',
  deliveryType: 'now',
  items: [{ name: 'Shoes', value: 199000, weight: 200, quantity: 1 }],
});

// 4. Track it
const tracking = await biteship.trackings.retrieve(order.courier.tracking_id);
console.log(tracking.status, tracking.history);
```

Get your API key from the [Biteship dashboard](https://dashboard.biteship.com/integrations). Test keys start with `biteship_test.` and live keys with `biteship_live.`.

## Client options

```ts
new Biteship(apiKey, {
  baseUrl: 'https://api.biteship.com', // custom/proxy base URL
  timeoutMs: 30_000,                    // request timeout (default 30s)
  fetchImpl: customFetch,               // inject your own fetch (testing, proxies)
});
```

## API reference

### Rates

```ts
// POST /v1/rates/couriers — supports coordinates, postal codes, area ids,
// mixed inputs, and the origin_suggestion_to_closest_destination type
const rates = await biteship.rates.calculate({
  originPostalCode: 12440,
  destinationLatitude: -6.2441792,
  destinationLongitude: 106.783529,
  couriers: 'jne,sicepat', // or ['jne', 'sicepat']
  items: [
    {
      name: 'Shoes',
      category: 'fashion',       // optional
      value: 199000,             // IDR
      weight: 200,               // grams
      quantity: 1,
      length: 30, width: 15, height: 20, // optional, cm
    },
  ],
  courierInsurance: 199000,               // optional insurance value
  destinationCashOnDelivery: 500000,      // optional COD
  destinationCashOnDeliveryType: '7_days',
});

for (const option of rates.pricing) {
  console.log(option.courier_name, option.courier_service_code, option.price);
}
```

### Orders

```ts
await biteship.orders.create({ /* ... */ });
await biteship.orders.retrieve(orderId);
await biteship.orders.update(orderId, { orderNote: 'updated' });
await biteship.orders.cancel(orderId, { reasonCode: 'change_courier' });
await biteship.orders.cancellationReasons('en'); // list valid reason codes
```

Instant couriers (Gojek, Grab, ...) require `originCoordinate` / `destinationCoordinate`:

```ts
const order = await biteship.orders.create({
  originContactName: 'Amir',
  originContactPhone: '08123456789',
  originAddress: 'Plaza Senayan, Jalan Asia Afrika',
  originCoordinate: { latitude: -6.2253114, longitude: 106.7993735 },
  destinationContactName: 'John Doe',
  destinationContactPhone: '088888888888',
  destinationAddress: 'Lebak Bulus MRT',
  destinationCoordinate: { latitude: -6.28927, longitude: 106.77492 },
  courierCompany: 'grab',
  courierType: 'instant',
  deliveryType: 'now',
  items: [{ name: 'Shoes', value: 199000, weight: 200, quantity: 1 }],
});
```

COD orders add `destinationCashOnDelivery` (max IDR 15.000.000) and `destinationCashOnDeliveryType` (`3_days`, `5_days` or `7_days`).

### Draft orders

Create an order without being charged, adjust it freely, then confirm:

```ts
let draft = await biteship.draftOrders.create({
  originContactName: 'Amir',
  originContactPhone: '08123456789',
  originAddress: 'Plaza Senayan, Jalan Asia Afrika',
  originPostalCode: 12440,
  destinationContactName: 'John Doe',
  destinationContactPhone: '088888888888',
  destinationAddress: 'Lebak Bulus MRT',
  destinationPostalCode: 12950,
  deliveryType: 'now',
  items: [{ name: 'Shoes', value: 199000, weight: 200, quantity: 1 }],
});

const pricing = await biteship.draftOrders.rates(draft.id);
draft = await biteship.draftOrders.setCourier(draft.id, {
  company: 'sicepat',
  type: 'reg',
});

const order = await biteship.draftOrders.confirm(draft.id); // creates the real order
```

### Tracking

```ts
// Works with the Biteship tracking id or the courier waybill id
const tracking = await biteship.trackings.retrieve('WYB-1112223333443');
console.log(tracking.status, tracking.history);
```

### Couriers, maps and locations

```ts
const couriers = await biteship.couriers.list();

const areas = await biteship.maps.searchAreas({
  input: 'Jakarta Selatan',
  countries: 'ID', // optional, defaults to ID
});

const location = await biteship.locations.create({
  name: 'Warehouse Pusat',
  contactName: 'Ahmad',
  contactPhone: '08123456789',
  address: 'Jl. Gambir Selatan no 5. Jakarta Pusat.',
  postalCode: 10110,
  latitude: -6.232123121,
  longitude: 102.22189911,
  type: 'origin',
});
await biteship.locations.retrieve(location.id);
await biteship.locations.update(location.id, { name: 'Apotik Monas' });
await biteship.locations.delete(location.id);
```

### Webhooks

Webhooks are configured in the [Biteship dashboard](https://dashboard.biteship.com/integrations). The SDK types and validates the three event payloads:

```ts
import { parseWebhook } from 'biteship-node-sdk';

app.post('/webhooks/biteship', (req, res) => {
  const payload = parseWebhook(req.body);

  switch (payload.event) {
    case 'order.status':
      console.log(payload.order_id, payload.status);
      break;
    case 'order.price':
      console.log(payload.order_id, payload.price);
      break;
    case 'order.waybill_id':
      console.log(payload.order_id, payload.courier_waybill_id);
      break;
  }

  res.sendStatus(200);
});
```

## Error handling

```ts
import {
  BiteshipAPIError,    // the API returned an error
  BiteshipNetworkError, // network failure or timeout
  BiteshipConfigError,  // missing/invalid API key
} from 'biteship-node-sdk';

try {
  await biteship.orders.create(params);
} catch (error) {
  if (error instanceof BiteshipAPIError) {
    console.log(error.httpStatus); // e.g. 400
    console.log(error.code);       // Biteship error code, e.g. 40002060
    console.log(error.message);    // human-readable message from the API
    console.log(error.details);    // extra details, e.g. duplicate reference_id info
  }
}
```

## Design notes

- **Request params use camelCase** and are converted to the API's snake_case automatically. The `metadata` object is passed through untouched, so your custom keys keep their original casing.
- **Responses are returned exactly as the API sends them** (snake_case fields), fully typed based on the official docs.
- The `orders.delete` method is marked `@deprecated` — the API now prefers `orders.cancel`.

## Development

```bash
npm install
npm run typecheck   # tsc --noEmit
npm test            # vitest
npm run build       # ESM + CJS + types into dist/
```

## License

[MIT](./LICENSE)
