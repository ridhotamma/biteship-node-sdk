// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export type ItemCategory =
  | 'fashion'
  | 'healthcare'
  | 'food_and_drink'
  | 'electronic'
  | 'beauty'
  | 'outdoor_gear'
  | 'home_accessories'
  | 'hobby'
  | 'collection'
  | 'sparepart'
  | 'groceries'
  | 'frozen_food'
  | 'others';

export type CashOnDeliveryType = '3_days' | '5_days' | '7_days';

export type CollectionMethod = 'pickup' | 'drop_off';

export interface Item {
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

// ---------------------------------------------------------------------------
// Rates — POST /v1/rates/couriers
// ---------------------------------------------------------------------------

export type RatesType = 'origin_suggestion_to_closest_destination';

export interface RatesParams {
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

export interface RateLocation {
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

export interface CourierPricing {
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

export interface RatesResponse {
  success: boolean;
  object: 'courier_pricing';
  message: string;
  code?: number;
  origin?: RateLocation;
  destination?: RateLocation;
  pricing: CourierPricing[];
}

// ---------------------------------------------------------------------------
// Couriers — GET /v1/couriers
// ---------------------------------------------------------------------------

export interface Courier {
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

export interface CouriersResponse {
  success: boolean;
  object: 'courier';
  couriers: Courier[];
}

// ---------------------------------------------------------------------------
// Maps — GET /v1/maps/areas
// ---------------------------------------------------------------------------

export interface SearchAreasParams {
  /** Free-text search, e.g. "Jakarta Selatan". */
  input: string;
  /** ISO 3166-1 alpha-2 country code. Defaults to "ID". */
  countries?: string;
  /** Search type. Defaults to "single". */
  type?: 'single';
}

export interface Area {
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

export interface AreasResponse {
  success: boolean;
  areas: Area[];
}

// ---------------------------------------------------------------------------
// Locations — /v1/locations
// ---------------------------------------------------------------------------

export interface LocationParams {
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

export type LocationUpdateParams = Partial<LocationParams>;

export interface LocationResponse {
  success: boolean;
  id: string;
  name?: string;
  contact_name?: string;
  contact_phone?: string;
  address?: string;
  message?: string;
}

// ---------------------------------------------------------------------------
// Orders — /v1/orders
// ---------------------------------------------------------------------------

export type OrderStatus =
  | 'confirmed'
  | 'scheduled'
  | 'allocated'
  | 'picking_up'
  | 'picked'
  | 'cancelled'
  | 'on_hold'
  | 'in_transit'
  | 'dropping_off'
  | 'return_in_transit'
  | 'returned'
  | 'rejected'
  | 'disposed'
  | 'courier_not_found'
  | 'delivered';

export type DeliveryType = 'now' | 'scheduled';

export interface OrderParams {
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

export type OrderUpdateParams = Partial<OrderParams>;

export interface CancelOrderParams {
  /** Cancellation reason code from orders.cancellationReasons(), e.g. "change_courier". */
  reasonCode: string;
  /** Free-text reason, required when reasonCode is "others". */
  reason?: string;
}

export type CancellationLanguage = 'id' | 'en';

export interface CancellationReason {
  code: string;
  reason: string;
}

export interface CancellationReasonsResponse {
  success: boolean;
  message: string;
  cancellation_reasons: CancellationReason[];
}

export interface OrderShipper {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  organization?: string | null;
}

export interface OrderOrigin {
  contact_name?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  address?: string | null;
  note?: string | null;
  postal_code?: number | null;
  coordinate?: Coordinate | null;
  collection_method?: CollectionMethod | null;
}

export interface OrderProofOfDelivery {
  use: boolean;
  fee: number;
  note?: string | null;
  link?: string | null;
}

export interface OrderCashOnDelivery {
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

export interface OrderDestination {
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

export interface OrderCourierHistoryEntry {
  service_type?: string;
  status: string;
  note?: string;
  updated_at?: string;
}

export interface OrderCourier {
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

export interface OrderDelivery {
  datetime?: string | null;
  note?: string | null;
  type?: DeliveryType | null;
  distance?: number | null;
  distance_unit?: string | null;
}

export interface Order {
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

export interface CancelOrderResponse {
  success: boolean;
  message: string;
  object: 'order';
  id: string;
  status: 'cancelled';
  cancellation_reason_code?: string;
  cancellation_reason?: string;
}

// ---------------------------------------------------------------------------
// Draft orders — /v1/draft_orders
// ---------------------------------------------------------------------------

export type DraftOrderStatus = 'placed' | 'ready' | 'confirmed';

export type DraftOrderParams = Omit<OrderParams, 'courierCompany' | 'courierType'> & {
  courierCompany?: string;
  courierType?: string;
};

export type DraftOrderUpdateParams = Partial<DraftOrderParams>;

export interface DraftOrderLocation {
  area_id?: string | null;
  address?: string | null;
  note?: string | null;
  contact_name?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  coordinate?: { latitude: number | null; longitude: number | null } | null;
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

export interface DraftOrder {
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

export interface DeletedResponse {
  success?: boolean;
  message?: string;
  id?: string;
}

// ---------------------------------------------------------------------------
// Trackings — GET /v1/trackings/:id
// ---------------------------------------------------------------------------

export type TrackingStatus =
  | 'confirmed'
  | 'allocated'
  | 'picking_up'
  | 'picked'
  | 'in_transit'
  | 'dropping_off'
  | 'return_in_transit'
  | 'on_hold'
  | 'delivered'
  | 'rejected'
  | 'courier_not_found'
  | 'returned'
  | 'cancelled'
  | 'disposed';

export interface TrackingHistoryEntry {
  note?: string;
  service_type?: string;
  updated_at?: string;
  status?: TrackingStatus;
}

export interface Tracking {
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
