import { vi } from 'vitest';

export interface RecordedRequest {
  url: URL;
  init: RequestInit;
  body?: unknown;
}

export interface MockResponse {
  status?: number;
  body?: unknown;
  text?: string;
}

export type MockHandler = (request: { url: URL; init: RequestInit }) => MockResponse;

export function createMockFetch(handler: MockHandler = () => ({ status: 200, body: {} })) {
  const requests: RecordedRequest[] = [];

  const fetchImpl = (async (...args: Parameters<typeof fetch>) => {
    const input = args[0];
    const init = args[1] ?? {};
    const url = input instanceof URL ? input : new URL(String(input));
    const body = typeof init.body === 'string' ? JSON.parse(init.body) : undefined;
    requests.push({ url, init, body });
    const result = handler({ url, init });
    const text = result.text ?? JSON.stringify(result.body ?? {});
    return new Response(text, {
      status: result.status ?? 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;

  const last = (): RecordedRequest => requests[requests.length - 1];

  return { fetchImpl, requests, last };
}
