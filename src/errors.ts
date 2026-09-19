export interface BiteshipAPIErrorOptions {
  message: string;
  httpStatus: number;
  code?: number | string;
  details?: unknown;
}

export class BiteshipError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = new.target.name;
  }
}

/** Thrown when the SDK is misconfigured, e.g. a missing or empty API key. */
export class BiteshipConfigError extends BiteshipError {}

/** Thrown when the HTTP request itself fails (network error, timeout, DNS, ...). */
export class BiteshipNetworkError extends BiteshipError {}

/** Thrown when the Biteship API responds with an error. */
export class BiteshipAPIError extends BiteshipError {
  /** HTTP status code of the failed response, e.g. 400, 401, 500. */
  readonly httpStatus: number;
  /** Biteship error code from the response body, e.g. 40001002, 40002060. */
  readonly code?: number | string;
  /** Additional details returned by the API, e.g. which order used a duplicate reference_id. */
  readonly details?: unknown;

  constructor(options: BiteshipAPIErrorOptions, cause?: unknown) {
    super(options.message, cause !== undefined ? { cause } : undefined);
    this.name = 'BiteshipAPIError';
    this.httpStatus = options.httpStatus;
    this.code = options.code;
    this.details = options.details;
  }
}
