import { BiteshipAPIError, BiteshipConfigError, BiteshipNetworkError } from './errors';
import { toSnakeCase } from './utils';

export const DEFAULT_BASE_URL = 'https://api.biteship.com';
export const DEFAULT_TIMEOUT_MS = 30_000;

export interface ClientOptions {
  /** Biteship API key, e.g. "biteship_test.****" or "biteship_live.****". */
  apiKey: string;
  /** Base URL of the Biteship API. Defaults to https://api.biteship.com */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to 30000. */
  timeoutMs?: number;
  /** Custom fetch implementation, useful for testing or proxies. */
  fetchImpl?: typeof fetch;
}

export interface RequestOptions {
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  query?: Record<string, string | number | undefined>;
  body?: unknown;
}

export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: ClientOptions) {
    if (typeof options.apiKey !== 'string' || options.apiKey.trim() === '') {
      throw new BiteshipConfigError(
        'A Biteship API key is required. Create one at https://dashboard.biteship.com/integrations'
      );
    }
    this.apiKey = options.apiKey.trim();
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async request<T>(options: RequestOptions): Promise<T> {
    const url = new URL(this.baseUrl + options.path);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }

    const init: RequestInit = {
      method: options.method,
      headers: {
        authorization: this.apiKey,
        'content-type': 'application/json',
      },
      signal: AbortSignal.timeout(this.timeoutMs),
    };
    if (options.body !== undefined) {
      init.body = JSON.stringify(toSnakeCase(options.body));
    }

    let response: Response;
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
    let parsedBody: unknown;
    try {
      parsedBody = rawText === '' ? undefined : JSON.parse(rawText);
    } catch {
      parsedBody = undefined;
    }

    if (!response.ok) {
      const errorBody = (parsedBody && typeof parsedBody === 'object' ? parsedBody : {}) as Record<
        string,
        unknown
      >;
      const message =
        typeof errorBody.error === 'string'
          ? errorBody.error
          : typeof errorBody.message === 'string'
            ? errorBody.message
            : `Biteship API error (HTTP ${response.status})`;
      throw new BiteshipAPIError({
        message,
        httpStatus: response.status,
        code:
          typeof errorBody.code === 'number' || typeof errorBody.code === 'string'
            ? errorBody.code
            : undefined,
        details: errorBody.details,
      });
    }

    return parsedBody as T;
  }
}
