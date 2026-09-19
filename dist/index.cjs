"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Biteship: () => Biteship,
  BiteshipAPIError: () => BiteshipAPIError,
  BiteshipConfigError: () => BiteshipConfigError,
  BiteshipError: () => BiteshipError,
  BiteshipNetworkError: () => BiteshipNetworkError,
  Couriers: () => Couriers,
  DEFAULT_BASE_URL: () => DEFAULT_BASE_URL,
  DEFAULT_TIMEOUT_MS: () => DEFAULT_TIMEOUT_MS,
  DraftOrders: () => DraftOrders,
  HttpClient: () => HttpClient,
  Locations: () => Locations,
  Maps: () => Maps,
  Orders: () => Orders,
  Rates: () => Rates,
  Trackings: () => Trackings,
  parseWebhook: () => parseWebhook
});
module.exports = __toCommonJS(index_exports);

// src/errors.ts
var BiteshipError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = new.target.name;
  }
};
var BiteshipConfigError = class extends BiteshipError {
};
var BiteshipNetworkError = class extends BiteshipError {
};
var BiteshipAPIError = class extends BiteshipError {
  /** HTTP status code of the failed response, e.g. 400, 401, 500. */
  httpStatus;
  /** Biteship error code from the response body, e.g. 40001002, 40002060. */
  code;
  /** Additional details returned by the API, e.g. which order used a duplicate reference_id. */
  details;
  constructor(options, cause) {
    super(options.message, cause !== void 0 ? { cause } : void 0);
    this.name = "BiteshipAPIError";
    this.httpStatus = options.httpStatus;
    this.code = options.code;
    this.details = options.details;
  }
};

// src/utils.ts
var CAMEL_CASE_PATTERN = /[A-Z]/g;
function camelToSnake(key) {
  return key.replace(CAMEL_CASE_PATTERN, (char) => `_${char.toLowerCase()}`);
}
var PASSTHROUGH_KEYS = /* @__PURE__ */ new Set(["metadata"]);
function toSnakeCase(value) {
  if (value instanceof Date) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(toSnakeCase);
  }
  if (value !== null && typeof value === "object") {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      result[camelToSnake(key)] = PASSTHROUGH_KEYS.has(key) ? val : toSnakeCase(val);
    }
    return result;
  }
  return value;
}

// src/client.ts
var DEFAULT_BASE_URL = "https://api.biteship.com";
var DEFAULT_TIMEOUT_MS = 3e4;
var HttpClient = class {
  apiKey;
  baseUrl;
  timeoutMs;
  fetchImpl;
  constructor(options) {
    if (typeof options.apiKey !== "string" || options.apiKey.trim() === "") {
      throw new BiteshipConfigError(
        "A Biteship API key is required. Create one at https://dashboard.biteship.com/integrations"
      );
    }
    this.apiKey = options.apiKey.trim();
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }
  async request(options) {
    const url = new URL(this.baseUrl + options.path);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== void 0) {
        url.searchParams.set(key, String(value));
      }
    }
    const init = {
      method: options.method,
      headers: {
        authorization: this.apiKey,
        "content-type": "application/json"
      },
      signal: AbortSignal.timeout(this.timeoutMs)
    };
    if (options.body !== void 0) {
      init.body = JSON.stringify(toSnakeCase(options.body));
    }
    let response;
    try {
      response = await this.fetchImpl(url, init);
    } catch (error) {
      const reason = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      throw new BiteshipNetworkError(
        `Request to ${options.method} ${url.pathname} failed: ${reason}`,
        { cause: error }
      );
    }
    const rawText = await response.text();
    let parsedBody;
    try {
      parsedBody = rawText === "" ? void 0 : JSON.parse(rawText);
    } catch {
      parsedBody = void 0;
    }
    if (!response.ok) {
      const errorBody = parsedBody && typeof parsedBody === "object" ? parsedBody : {};
      const message = typeof errorBody.error === "string" ? errorBody.error : typeof errorBody.message === "string" ? errorBody.message : `Biteship API error (HTTP ${response.status})`;
      throw new BiteshipAPIError({
        message,
        httpStatus: response.status,
        code: typeof errorBody.code === "number" || typeof errorBody.code === "string" ? errorBody.code : void 0,
        details: errorBody.details
      });
    }
    return parsedBody;
  }
};

// src/resources/couriers.ts
var Couriers = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /**
   * List all available couriers and their services.
   * GET /v1/couriers
   */
  list() {
    return this.http.request({
      method: "GET",
      path: "/v1/couriers"
    });
  }
};

// src/resources/draftOrders.ts
var DraftOrders = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /**
   * Create a draft order. You are not charged until it is confirmed.
   * POST /v1/draft_orders
   */
  create(params) {
    return this.http.request({
      method: "POST",
      path: "/v1/draft_orders",
      body: params
    });
  }
  /**
   * Retrieve a draft order by id.
   * GET /v1/draft_orders/:id
   */
  retrieve(id) {
    return this.http.request({
      method: "GET",
      path: `/v1/draft_orders/${encodeURIComponent(id)}`
    });
  }
  /**
   * Retrieve courier pricing for the draft order's origin and destination.
   * GET /v1/draft_orders/:id/rates
   */
  rates(id) {
    return this.http.request({
      method: "GET",
      path: `/v1/draft_orders/${encodeURIComponent(id)}/rates`
    });
  }
  /**
   * Update a draft order while it has not been confirmed yet.
   * POST /v1/draft_orders/:id
   */
  update(id, params) {
    return this.http.request({
      method: "POST",
      path: `/v1/draft_orders/${encodeURIComponent(id)}`,
      body: params
    });
  }
  /**
   * Convenience method to set the courier, moving the draft order to "ready".
   * Values must come from draftOrders.rates().
   */
  setCourier(id, courier) {
    return this.update(id, {
      courierCompany: courier.company,
      courierType: courier.type
    });
  }
  /**
   * Confirm a "ready" draft order, which creates a real order.
   * POST /v1/draft_orders/:id/confirm
   */
  confirm(id) {
    return this.http.request({
      method: "POST",
      path: `/v1/draft_orders/${encodeURIComponent(id)}/confirm`
    });
  }
  /**
   * Delete a draft order. Deleted drafts cannot be reactivated.
   * DELETE /v1/draft_orders/:id
   */
  delete(id) {
    return this.http.request({
      method: "DELETE",
      path: `/v1/draft_orders/${encodeURIComponent(id)}`
    });
  }
};

// src/resources/locations.ts
var Locations = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /**
   * Create a location saved to your Biteship dashboard address book.
   * POST /v1/locations
   */
  create(params) {
    return this.http.request({
      method: "POST",
      path: "/v1/locations",
      body: params
    });
  }
  /**
   * Retrieve a location by id.
   * GET /v1/locations/:id
   */
  retrieve(id) {
    return this.http.request({
      method: "GET",
      path: `/v1/locations/${encodeURIComponent(id)}`
    });
  }
  /**
   * Update a location. Only send the fields you want to change.
   * POST /v1/locations/:id
   */
  update(id, params) {
    return this.http.request({
      method: "POST",
      path: `/v1/locations/${encodeURIComponent(id)}`,
      body: params
    });
  }
  /**
   * Delete a location.
   * DELETE /v1/locations/:id
   */
  delete(id) {
    return this.http.request({
      method: "DELETE",
      path: `/v1/locations/${encodeURIComponent(id)}`
    });
  }
};

// src/resources/maps.ts
var Maps = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /**
   * Search areas for autocomplete, returning area ids usable as
   * origin/destination in rates and orders (highest accuracy).
   * GET /v1/maps/areas
   */
  searchAreas(params) {
    return this.http.request({
      method: "GET",
      path: "/v1/maps/areas",
      query: {
        input: params.input,
        countries: params.countries ?? "ID",
        type: params.type ?? "single"
      }
    });
  }
};

// src/resources/orders.ts
var Orders = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /**
   * Create an order to be picked up by a courier.
   * POST /v1/orders
   */
  create(params) {
    return this.http.request({
      method: "POST",
      path: "/v1/orders",
      body: params
    });
  }
  /**
   * Retrieve an order by id.
   * GET /v1/orders/:id
   */
  retrieve(id) {
    return this.http.request({
      method: "GET",
      path: `/v1/orders/${encodeURIComponent(id)}`
    });
  }
  /**
   * Update an order. Only possible while the order is not yet confirmed.
   * POST /v1/orders/:id
   */
  update(id, params) {
    return this.http.request({
      method: "POST",
      path: `/v1/orders/${encodeURIComponent(id)}`,
      body: params
    });
  }
  /**
   * Cancel an order using a cancellation reason code.
   * POST /v1/orders/:id/cancel
   */
  cancel(id, params) {
    return this.http.request({
      method: "POST",
      path: `/v1/orders/${encodeURIComponent(id)}/cancel`,
      body: {
        cancellationReasonCode: params.reasonCode,
        cancellationReason: params.reason
      }
    });
  }
  /**
   * List available order cancellation reason codes.
   * GET /v1/orders/cancellation_reasons
   */
  cancellationReasons(lang = "id") {
    return this.http.request({
      method: "GET",
      path: "/v1/orders/cancellation_reasons",
      query: { lang }
    });
  }
  /**
   * Delete an order.
   * DELETE /v1/orders/:id
   * @deprecated The API now prefers orders.cancel().
   */
  delete(id) {
    return this.http.request({
      method: "DELETE",
      path: `/v1/orders/${encodeURIComponent(id)}`
    });
  }
};

// src/resources/rates.ts
var Rates = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /**
   * Calculate shipping rates across multiple couriers.
   * POST /v1/rates/couriers
   */
  calculate(params) {
    const couriers = Array.isArray(params.couriers) ? params.couriers.join(",") : params.couriers;
    return this.http.request({
      method: "POST",
      path: "/v1/rates/couriers",
      body: { ...params, couriers }
    });
  }
};

// src/resources/trackings.ts
var Trackings = class {
  constructor(http) {
    this.http = http;
  }
  http;
  /**
   * Retrieve tracking info by Biteship tracking id or courier waybill id.
   * Only works for orders created via the Orders API.
   * GET /v1/trackings/:id
   */
  retrieve(id) {
    return this.http.request({
      method: "GET",
      path: `/v1/trackings/${encodeURIComponent(id)}`
    });
  }
};

// src/webhooks.ts
function parseWebhook(payload) {
  if (typeof payload !== "object" || payload === null) {
    throw new BiteshipError("Invalid Biteship webhook payload: expected a JSON object");
  }
  const event = payload.event;
  if (event === "order.status") return payload;
  if (event === "order.price") return payload;
  if (event === "order.waybill_id") return payload;
  throw new BiteshipError(`Unknown Biteship webhook event: ${String(event)}`);
}

// src/index.ts
var Biteship = class {
  /** Calculate shipping rates across couriers. */
  rates;
  /** List available couriers and services. */
  couriers;
  /** Search area ids for highest-accuracy addresses. */
  maps;
  /** Manage saved locations from your dashboard address book. */
  locations;
  /** Create, retrieve, update and cancel shipments. */
  orders;
  /** Prepare orders without charge, then confirm when ready. */
  draftOrders;
  /** Track shipments by tracking id or waybill id. */
  trackings;
  constructor(apiKey, options = {}) {
    const http = new HttpClient({ ...options, apiKey });
    this.rates = new Rates(http);
    this.couriers = new Couriers(http);
    this.maps = new Maps(http);
    this.locations = new Locations(http);
    this.orders = new Orders(http);
    this.draftOrders = new DraftOrders(http);
    this.trackings = new Trackings(http);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Biteship,
  BiteshipAPIError,
  BiteshipConfigError,
  BiteshipError,
  BiteshipNetworkError,
  Couriers,
  DEFAULT_BASE_URL,
  DEFAULT_TIMEOUT_MS,
  DraftOrders,
  HttpClient,
  Locations,
  Maps,
  Orders,
  Rates,
  Trackings,
  parseWebhook
});
//# sourceMappingURL=index.cjs.map