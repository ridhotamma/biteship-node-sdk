declare const DEFAULT_BASE_URL = "https://api.biteship.com";
declare const DEFAULT_TIMEOUT_MS = 30000;
interface ClientOptions {
    /** Biteship API key, e.g. "biteship_test.****" or "biteship_live.****". */
    apiKey: string;
    /** Base URL of the Biteship API. Defaults to https://api.biteship.com */
    baseUrl?: string;
    /** Request timeout in milliseconds. Defaults to 30000. */
    timeoutMs?: number;
    /** Custom fetch implementation, useful for testing or proxies. */
    fetchImpl?: typeof fetch;
}
interface RequestOptions {
    method: 'GET' | 'POST' | 'DELETE';
    path: string;
    query?: Record<string, string | number | undefined>;
    body?: unknown;
}
declare class HttpClient {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly timeoutMs;
    private readonly fetchImpl;
    constructor(options: ClientOptions);
    request<T>(options: RequestOptions): Promise<T>;
}

interface Coordinate {
    latitude: number;
    longitude: number;
}
type ItemCategory = 'fashion' | 'healthcare' | 'food_and_drink' | 'electronic' | 'beauty' | 'outdoor_gear' | 'home_accessories' | 'hobby' | 'collection' | 'sparepart' | 'groceries' | 'frozen_food' | 'others';
type CashOnDeliveryType = '3_days' | '5_days' | '7_days';
type CollectionMethod = 'pickup' | 'drop_off';
interface Item {
    /** Name of your package. */
    name: string;
    /** Description of your package (color, details, etc). */
    description?: string;
    /** Item category. Defaults to "others" when omitted. */
    category?: ItemCategory;
    /** Item SKU. */
    sku?: string;
    /** Value of the item (in IDR). */
    value: number;
    /** Total quantity of the item. */
    quantity: number;
    /** Weight of the item in grams. */
    weight: number;
    /** Height of the item in centimeters. */
    height?: number;
    /** Length of the item in centimeters. */
    length?: number;
    /** Width of the item in centimeters. */
    width?: number;
}
type RatesType = 'origin_suggestion_to_closest_destination';
interface RatesParams {
    /** Origin area id from the Maps API (high accuracy). */
    originAreaId?: string;
    /** Destination area id from the Maps API (high accuracy). */
    destinationAreaId?: string;
    /** Origin latitude (required for instant couriers). */
    originLatitude?: number;
    /** Origin longitude (required for instant couriers). */
    originLongitude?: number;
    /** Destination latitude (required for instant couriers). */
    destinationLatitude?: number;
    /** Destination longitude (required for instant couriers). */
    destinationLongitude?: number;
    /** Origin postal code (medium accuracy). */
    originPostalCode?: number | string;
    /** Destination postal code (medium accuracy). */
    destinationPostalCode?: number | string;
    /** Special rates type, e.g. suggest the closest saved origin location. */
    type?: RatesType;
    /** Courier codes to query, e.g. ["jne", "sicepat"] or "jne,sicepat". */
    couriers: string | string[];
    /** Items to be shipped. */
    items: Item[];
    /** Declared insurance value, e.g. 1000000 for IDR 1.000.000. */
    courierInsurance?: number;
    /** COD amount to activate cash on delivery (max IDR 15.000.000). */
    destinationCashOnDelivery?: number;
    /** COD disbursement window. */
    destinationCashOnDeliveryType?: CashOnDeliveryType;
}
interface RateLocation {
    location_id?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    postal_code?: number | null;
    country_name?: string | null;
    country_code?: string | null;
    administrative_division_level_1_name?: string | null;
    administrative_division_level_1_type?: string | null;
    administrative_division_level_2_name?: string | null;
    administrative_division_level_2_type?: string | null;
    administrative_division_level_3_name?: string | null;
    administrative_division_level_3_type?: string | null;
    administrative_division_level_4_name?: string | null;
    administrative_division_level_4_type?: string | null;
    address?: string | null;
}
interface CourierPricing {
    available_collection_method?: CollectionMethod[];
    available_for_cash_on_delivery: boolean;
    available_for_proof_of_delivery: boolean;
    available_for_instant_waybill_id: boolean;
    available_for_insurance: boolean;
    company: string;
    courier_name: string;
    courier_code: string;
    courier_service_name: string;
    courier_service_code: string;
    currency?: string;
    description?: string;
    duration?: string;
    shipment_duration_range?: string;
    shipment_duration_unit?: string;
    service_type?: string;
    shipping_type?: string;
    shipping_fee?: number;
    shipping_fee_discount?: number;
    shipping_fee_surcharge?: number;
    insurance_fee?: number;
    cash_on_delivery_fee?: number;
    price: number;
    tax_lines?: unknown[];
    type?: string;
}
interface RatesResponse {
    success: boolean;
    object: 'courier_pricing';
    message: string;
    code?: number;
    origin?: RateLocation;
    destination?: RateLocation;
    pricing: CourierPricing[];
}
interface Courier {
    available_for_cash_on_delivery: boolean;
    available_for_proof_of_delivery: boolean;
    available_for_instant_waybill_id: boolean;
    courier_name: string;
    courier_code: string;
    courier_service_name: string;
    courier_service_code: string;
    tier?: string;
    description?: string;
    service_type?: string;
    shipping_type?: string;
    shipment_duration_range?: string;
    shipment_duration_unit?: string;
}
interface CouriersResponse {
    success: boolean;
    object: 'courier';
    couriers: Courier[];
}
interface SearchAreasParams {
    /** Free-text search, e.g. "Jakarta Selatan". */
    input: string;
    /** ISO 3166-1 alpha-2 country code. Defaults to "ID". */
    countries?: string;
    /** Search type. Defaults to "single". */
    type?: 'single';
}
interface Area {
    id: string;
    name: string;
    country_name?: string;
    country_code?: string;
    administrative_division_level_1_name?: string;
    administrative_division_level_1_type?: string;
    administrative_division_level_2_name?: string;
    administrative_division_level_2_type?: string;
    administrative_division_level_3_name?: string;
    administrative_division_level_3_type?: string;
    postal_code?: number;
}
interface AreasResponse {
    success: boolean;
    areas: Area[];
}
interface LocationParams {
    /** Name of the location. */
    name: string;
    /** Contact name of the person in charge. */
    contactName: string;
    /** Contact phone of the person in charge. */
    contactPhone: string;
    /** Complete address of the location. */
    address: string;
    /** Additional information about the location. */
    note?: string;
    /** Postal code of the location. */
    postalCode: number | string;
    /** Latitude of the location. */
    latitude: number;
    /** Longitude of the location. */
    longitude: number;
    /** Whether this location is used as "origin" or "destination". */
    type: 'origin' | 'destination';
}
type LocationUpdateParams = Partial<LocationParams>;
interface LocationResponse {
    success: boolean;
    id: string;
    name?: string;
    contact_name?: string;
    contact_phone?: string;
    address?: string;
    message?: string;
}
type OrderStatus = 'confirmed' | 'scheduled' | 'allocated' | 'picking_up' | 'picked' | 'cancelled' | 'on_hold' | 'in_transit' | 'dropping_off' | 'return_in_transit' | 'returned' | 'rejected' | 'disposed' | 'courier_not_found' | 'delivered';
type DeliveryType = 'now' | 'scheduled';
interface OrderParams {
    shipperContactName?: string;
    shipperContactPhone?: string;
    shipperContactEmail?: string;
    shipperOrganization?: string;
    /** Name of the person at the pickup location. */
    originContactName: string;
    /** Phone number of the person at the pickup location. */
    originContactPhone: string;
    originContactEmail?: string;
    /** Complete address of the pickup location. */
    originAddress: string;
    /** Additional information to ease the pickup process. */
    originNote?: string;
    originPostalCode?: number | string;
    /** Coordinates of the pickup location. Required for instant couriers. */
    originCoordinate?: Coordinate;
    /** Area id from the Maps API. */
    originAreaId?: string;
    /** Location id from the Locations API. */
    originLocationId?: string;
    /** "pickup" (default) or "drop_off". */
    originCollectionMethod?: CollectionMethod;
    /** Name of the person at the destination. */
    destinationContactName: string;
    /** Phone number of the person at the destination. */
    destinationContactPhone: string;
    destinationContactEmail?: string;
    /** Complete address of the destination. */
    destinationAddress: string;
    /** Additional information to ease the delivery process. */
    destinationNote?: string;
    destinationPostalCode?: number | string;
    /** Coordinates of the destination. Required for instant couriers. */
    destinationCoordinate?: Coordinate;
    /** Area id from the Maps API. */
    destinationAreaId?: string;
    /** Location id from the Locations API. */
    destinationLocationId?: string;
    /** COD amount to activate cash on delivery. */
    destinationCashOnDelivery?: number;
    /** COD disbursement window. */
    destinationCashOnDeliveryType?: CashOnDeliveryType;
    /** Enable the proof of delivery feature. */
    destinationProofOfDelivery?: boolean;
    /** Required when destinationProofOfDelivery is true. */
    destinationProofOfDeliveryNote?: string;
    /** Courier company code, e.g. "jne", "grab". */
    courierCompany: string;
    /** Courier service code, e.g. "reg", "instant". */
    courierType: string;
    /** Declared insurance value. */
    courierInsurance?: number;
    /** "now" picks up right away, "scheduled" uses deliveryDate and deliveryTime. */
    deliveryType: DeliveryType;
    /** Delivery date, format "YYYY-MM-DD" (scheduled deliveries only). */
    deliveryDate?: string;
    /** Delivery time, format "HH:mm" (scheduled deliveries only). */
    deliveryTime?: string;
    /** Additional information for the shipment. */
    orderNote?: string;
    /** Free-form object for your own internal purposes. Keys are preserved as-is. */
    metadata?: Record<string, unknown>;
    /** Your internal order id. Must be unique per order. */
    referenceId?: string;
    /** Custom tags for filtering orders later. */
    tags?: string[];
    /** Items to be shipped. */
    items: Item[];
}
type OrderUpdateParams = Partial<OrderParams>;
interface CancelOrderParams {
    /** Cancellation reason code from orders.cancellationReasons(), e.g. "change_courier". */
    reasonCode: string;
    /** Free-text reason, required when reasonCode is "others". */
    reason?: string;
}
type CancellationLanguage = 'id' | 'en';
interface CancellationReason {
    code: string;
    reason: string;
}
interface CancellationReasonsResponse {
    success: boolean;
    message: string;
    cancellation_reasons: CancellationReason[];
}
interface OrderShipper {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    organization?: string | null;
}
interface OrderOrigin {
    contact_name?: string | null;
    contact_phone?: string | null;
    contact_email?: string | null;
    address?: string | null;
    note?: string | null;
    postal_code?: number | null;
    coordinate?: Coordinate | null;
    collection_method?: CollectionMethod | null;
}
interface OrderProofOfDelivery {
    use: boolean;
    fee: number;
    note?: string | null;
    link?: string | null;
}
interface OrderCashOnDelivery {
    id?: string | null;
    amount?: number | null;
    amount_currency?: string | null;
    fee?: number | null;
    fee_currency?: string | null;
    note?: string | null;
    type?: CashOnDeliveryType | null;
    status?: string | null;
    payment_status?: string | null;
    payment_method?: string | null;
}
interface OrderDestination {
    contact_name?: string | null;
    contact_phone?: string | null;
    contact_email?: string | null;
    address?: string | null;
    note?: string | null;
    postal_code?: number | null;
    coordinate?: Coordinate | null;
    proof_of_delivery?: OrderProofOfDelivery | null;
    cash_on_delivery?: OrderCashOnDelivery | null;
}
interface OrderCourierHistoryEntry {
    service_type?: string;
    status: string;
    note?: string;
    updated_at?: string;
}
interface OrderCourier {
    tracking_id?: string | null;
    waybill_id?: string | null;
    company?: string | null;
    /** @deprecated Use driver_name instead. */
    name?: string | null;
    /** @deprecated Use driver_phone instead. */
    phone?: string | null;
    driver_name?: string | null;
    driver_phone?: string | null;
    driver_photo_url?: string | null;
    driver_plate_number?: string | null;
    type?: string | null;
    link?: string | null;
    insurance?: {
        amount: number;
        amount_currency?: string;
        fee: number;
        fee_currency?: string;
        note?: string | null;
    } | null;
    routing_code?: string | null;
    history?: OrderCourierHistoryEntry[];
    shipment_fee?: number | null;
}
interface OrderDelivery {
    datetime?: string | null;
    note?: string | null;
    type?: DeliveryType | null;
    distance?: number | null;
    distance_unit?: string | null;
}
interface Order {
    success?: boolean;
    message?: string;
    object?: 'order';
    id: string;
    draft_order_id?: string | null;
    short_id?: string;
    shipper?: OrderShipper;
    origin?: OrderOrigin;
    destination?: OrderDestination;
    courier?: OrderCourier;
    delivery?: OrderDelivery;
    reference_id?: string | null;
    invoice_id?: string | null;
    items?: Item[];
    extra?: unknown;
    currency?: string;
    tax_lines?: unknown[];
    price?: number;
    metadata?: Record<string, unknown> | null;
    tags?: string[];
    note?: string | null;
    status?: OrderStatus;
    ticket_status?: string | null;
}
interface CancelOrderResponse {
    success: boolean;
    message: string;
    object: 'order';
    id: string;
    status: 'cancelled';
    cancellation_reason_code?: string;
    cancellation_reason?: string;
}
type DraftOrderStatus = 'placed' | 'ready' | 'confirmed';
type DraftOrderParams = Omit<OrderParams, 'courierCompany' | 'courierType'> & {
    courierCompany?: string;
    courierType?: string;
};
type DraftOrderUpdateParams = Partial<DraftOrderParams>;
interface DraftOrderLocation {
    area_id?: string | null;
    address?: string | null;
    note?: string | null;
    contact_name?: string | null;
    contact_phone?: string | null;
    contact_email?: string | null;
    coordinate?: {
        latitude: number | null;
        longitude: number | null;
    } | null;
    province_name?: string | null;
    city_name?: string | null;
    district_name?: string | null;
    postal_code?: number | null;
    collection_method?: CollectionMethod | null;
    proof_of_delivery?: OrderProofOfDelivery | null;
    cash_on_delivery?: Omit<OrderCashOnDelivery, 'id' | 'fee' | 'fee_currency'> & {
        fee?: number | null;
        fee_currency?: string | null;
        payment_method?: string | null;
    } | null;
}
interface DraftOrder {
    success?: boolean;
    code?: number;
    object?: 'draft_order';
    id: string;
    order_id?: string | null;
    origin?: DraftOrderLocation;
    destination?: DraftOrderLocation;
    courier?: OrderCourier;
    delivery?: OrderDelivery;
    extra?: unknown;
    tags?: string[];
    metadata?: Record<string, unknown> | null;
    items?: Item[];
    currency?: string;
    tax_lines?: unknown[];
    price?: number;
    status?: DraftOrderStatus;
    reference_id?: string | null;
    invoice_id?: string | null;
    user_id?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    placed_at?: string | null;
    ready_at?: string | null;
    confirmed_at?: string | null;
    deleted_at?: string | null;
}
interface DeletedResponse {
    success?: boolean;
    message?: string;
    id?: string;
}
type TrackingStatus = 'confirmed' | 'allocated' | 'picking_up' | 'picked' | 'in_transit' | 'dropping_off' | 'return_in_transit' | 'on_hold' | 'delivered' | 'rejected' | 'courier_not_found' | 'returned' | 'cancelled' | 'disposed';
interface TrackingHistoryEntry {
    note?: string;
    service_type?: string;
    updated_at?: string;
    status?: TrackingStatus;
}
interface Tracking {
    success?: boolean;
    message?: string;
    object?: 'tracking';
    id: string;
    waybill_id?: string;
    courier?: {
        company?: string;
        /** @deprecated Use driver_name instead. */
        name?: string | null;
        /** @deprecated Use driver_phone instead. */
        phone?: string | null;
        driver_name?: string | null;
        driver_phone?: string | null;
        driver_photo_url?: string | null;
        driver_plate_number?: string | null;
    };
    origin?: {
        contact_name?: string | null;
        address?: string | null;
    };
    destination?: {
        contact_name?: string | null;
        address?: string | null;
    };
    history?: TrackingHistoryEntry[];
    link?: string | null;
    order_id?: string | null;
    status?: TrackingStatus;
}

declare class Couriers {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * List all available couriers and their services.
     * GET /v1/couriers
     */
    list(): Promise<CouriersResponse>;
}

declare class DraftOrders {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Create a draft order. You are not charged until it is confirmed.
     * POST /v1/draft_orders
     */
    create(params: DraftOrderParams): Promise<DraftOrder>;
    /**
     * Retrieve a draft order by id.
     * GET /v1/draft_orders/:id
     */
    retrieve(id: string): Promise<DraftOrder>;
    /**
     * Retrieve courier pricing for the draft order's origin and destination.
     * GET /v1/draft_orders/:id/rates
     */
    rates(id: string): Promise<RatesResponse>;
    /**
     * Update a draft order while it has not been confirmed yet.
     * POST /v1/draft_orders/:id
     */
    update(id: string, params: DraftOrderUpdateParams): Promise<DraftOrder>;
    /**
     * Convenience method to set the courier, moving the draft order to "ready".
     * Values must come from draftOrders.rates().
     */
    setCourier(id: string, courier: {
        company: string;
        type: string;
    }): Promise<DraftOrder>;
    /**
     * Confirm a "ready" draft order, which creates a real order.
     * POST /v1/draft_orders/:id/confirm
     */
    confirm(id: string): Promise<Order>;
    /**
     * Delete a draft order. Deleted drafts cannot be reactivated.
     * DELETE /v1/draft_orders/:id
     */
    delete(id: string): Promise<DeletedResponse>;
}

declare class Locations {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Create a location saved to your Biteship dashboard address book.
     * POST /v1/locations
     */
    create(params: LocationParams): Promise<LocationResponse>;
    /**
     * Retrieve a location by id.
     * GET /v1/locations/:id
     */
    retrieve(id: string): Promise<LocationResponse>;
    /**
     * Update a location. Only send the fields you want to change.
     * POST /v1/locations/:id
     */
    update(id: string, params: LocationUpdateParams): Promise<LocationResponse>;
    /**
     * Delete a location.
     * DELETE /v1/locations/:id
     */
    delete(id: string): Promise<LocationResponse>;
}

declare class Maps {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Search areas for autocomplete, returning area ids usable as
     * origin/destination in rates and orders (highest accuracy).
     * GET /v1/maps/areas
     */
    searchAreas(params: SearchAreasParams): Promise<AreasResponse>;
}

declare class Orders {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Create an order to be picked up by a courier.
     * POST /v1/orders
     */
    create(params: OrderParams): Promise<Order>;
    /**
     * Retrieve an order by id.
     * GET /v1/orders/:id
     */
    retrieve(id: string): Promise<Order>;
    /**
     * Update an order. Only possible while the order is not yet confirmed.
     * POST /v1/orders/:id
     */
    update(id: string, params: OrderUpdateParams): Promise<Order>;
    /**
     * Cancel an order using a cancellation reason code.
     * POST /v1/orders/:id/cancel
     */
    cancel(id: string, params: CancelOrderParams): Promise<CancelOrderResponse>;
    /**
     * List available order cancellation reason codes.
     * GET /v1/orders/cancellation_reasons
     */
    cancellationReasons(lang?: CancellationLanguage): Promise<CancellationReasonsResponse>;
    /**
     * Delete an order.
     * DELETE /v1/orders/:id
     * @deprecated The API now prefers orders.cancel().
     */
    delete(id: string): Promise<CancelOrderResponse>;
}

declare class Rates {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Calculate shipping rates across multiple couriers.
     * POST /v1/rates/couriers
     */
    calculate(params: RatesParams): Promise<RatesResponse>;
}

declare class Trackings {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Retrieve tracking info by Biteship tracking id or courier waybill id.
     * Only works for orders created via the Orders API.
     * GET /v1/trackings/:id
     */
    retrieve(id: string): Promise<Tracking>;
}

interface BiteshipAPIErrorOptions {
    message: string;
    httpStatus: number;
    code?: number | string;
    details?: unknown;
}
declare class BiteshipError extends Error {
    constructor(message: string, options?: {
        cause?: unknown;
    });
}
/** Thrown when the SDK is misconfigured, e.g. a missing or empty API key. */
declare class BiteshipConfigError extends BiteshipError {
}
/** Thrown when the HTTP request itself fails (network error, timeout, DNS, ...). */
declare class BiteshipNetworkError extends BiteshipError {
}
/** Thrown when the Biteship API responds with an error. */
declare class BiteshipAPIError extends BiteshipError {
    /** HTTP status code of the failed response, e.g. 400, 401, 500. */
    readonly httpStatus: number;
    /** Biteship error code from the response body, e.g. 40001002, 40002060. */
    readonly code?: number | string;
    /** Additional details returned by the API, e.g. which order used a duplicate reference_id. */
    readonly details?: unknown;
    constructor(options: BiteshipAPIErrorOptions, cause?: unknown);
}

type WebhookEventName = 'order.status' | 'order.price' | 'order.waybill_id';
interface OrderStatusWebhook {
    event: 'order.status';
    order_id: string;
    courier_tracking_id?: string;
    courier_waybill_id?: string;
    courier_company?: string;
    courier_type?: string;
    courier_driver_name?: string | null;
    courier_driver_phone?: string | null;
    courier_driver_photo_url?: string | null;
    courier_driver_plate_number?: string | null;
    courier_link?: string | null;
    order_price?: number;
    status?: string;
}
interface OrderPriceWebhook {
    event: 'order.price';
    order_id: string;
    cash_on_delivery_fee?: number;
    proof_of_delivery_fee?: number;
    shippment_fee?: number;
    price?: number;
    courier_tracking_id?: string;
    courier_waybill_id?: string;
    status?: string;
}
interface OrderWaybillIdWebhook {
    event: 'order.waybill_id';
    order_id: string;
    courier_tracking_id?: string;
    courier_waybill_id?: string;
    status?: string;
}
type WebhookPayload = OrderStatusWebhook | OrderPriceWebhook | OrderWaybillIdWebhook;
/**
 * Parse and validate a Biteship webhook request body into a typed payload.
 * Throws BiteshipError when the body is not a valid Biteship webhook.
 */
declare function parseWebhook(payload: unknown): WebhookPayload;

declare class Biteship {
    /** Calculate shipping rates across couriers. */
    readonly rates: Rates;
    /** List available couriers and services. */
    readonly couriers: Couriers;
    /** Search area ids for highest-accuracy addresses. */
    readonly maps: Maps;
    /** Manage saved locations from your dashboard address book. */
    readonly locations: Locations;
    /** Create, retrieve, update and cancel shipments. */
    readonly orders: Orders;
    /** Prepare orders without charge, then confirm when ready. */
    readonly draftOrders: DraftOrders;
    /** Track shipments by tracking id or waybill id. */
    readonly trackings: Trackings;
    constructor(apiKey: string, options?: Omit<ClientOptions, 'apiKey'>);
}

export { type Area, type AreasResponse, Biteship, BiteshipAPIError, type BiteshipAPIErrorOptions, BiteshipConfigError, BiteshipError, BiteshipNetworkError, type CancelOrderParams, type CancelOrderResponse, type CancellationLanguage, type CancellationReason, type CancellationReasonsResponse, type CashOnDeliveryType, type ClientOptions, type CollectionMethod, type Coordinate, type Courier, type CourierPricing, Couriers, type CouriersResponse, DEFAULT_BASE_URL, DEFAULT_TIMEOUT_MS, type DeletedResponse, type DeliveryType, type DraftOrder, type DraftOrderLocation, type DraftOrderParams, type DraftOrderStatus, type DraftOrderUpdateParams, DraftOrders, HttpClient, type Item, type ItemCategory, type LocationParams, type LocationResponse, type LocationUpdateParams, Locations, Maps, type Order, type OrderCashOnDelivery, type OrderCourier, type OrderCourierHistoryEntry, type OrderDelivery, type OrderDestination, type OrderOrigin, type OrderParams, type OrderPriceWebhook, type OrderProofOfDelivery, type OrderShipper, type OrderStatus, type OrderStatusWebhook, type OrderUpdateParams, type OrderWaybillIdWebhook, Orders, type RateLocation, Rates, type RatesParams, type RatesResponse, type RatesType, type RequestOptions, type SearchAreasParams, type Tracking, type TrackingHistoryEntry, type TrackingStatus, Trackings, type WebhookEventName, type WebhookPayload, parseWebhook };
