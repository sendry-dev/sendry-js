import { describe, test, expect, mock } from "bun:test";
import { HttpClient } from "../src/client";
import {
  ApiError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  NotFoundError,
  NetworkError,
} from "../src/errors";

function createMockFetch(response: {
  status: number;
  body?: unknown;
  headers?: Record<string, string>;
}) {
  return mock(() =>
    Promise.resolve({
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      statusText: "OK",
      headers: new Headers(response.headers ?? {}),
      json: () => Promise.resolve(response.body),
    } as Response)
  );
}

describe("HttpClient", () => {
  test("throws if no API key is provided", () => {
    expect(() => new HttpClient({ apiKey: "" })).toThrow("Missing API key");
  });

  test("sends GET request with Authorization header", async () => {
    const fetchMock = createMockFetch({
      status: 200,
      body: { data: [], has_more: false, next_cursor: null },
    });
    const client = new HttpClient({
      apiKey: "sn_test_123",
      fetch: fetchMock as unknown as typeof fetch,
    });

    await client.get("/v1/emails");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/v1/emails");
    expect((options.headers as Record<string, string>)["Authorization"]).toBe(
      "Bearer sn_test_123"
    );
    expect(options.method).toBe("GET");
  });

  test("sends POST request with JSON body", async () => {
    const fetchMock = createMockFetch({
      status: 200,
      body: { id: "em_1", status: "queued" },
    });
    const client = new HttpClient({
      apiKey: "sn_test_123",
      fetch: fetchMock as unknown as typeof fetch,
    });

    await client.post("/v1/emails", { from: "a@b.com", to: "c@d.com", subject: "Hi" });

    const [, options] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body as string)).toEqual({
      from: "a@b.com",
      to: "c@d.com",
      subject: "Hi",
    });
  });

  test("appends query parameters to URL", async () => {
    const fetchMock = createMockFetch({ status: 200, body: {} });
    const client = new HttpClient({
      apiKey: "sn_test_123",
      fetch: fetchMock as unknown as typeof fetch,
    });

    await client.get("/v1/emails", { limit: 25, cursor: "abc", status: undefined });

    const [url] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const parsed = new URL(url);
    expect(parsed.searchParams.get("limit")).toBe("25");
    expect(parsed.searchParams.get("cursor")).toBe("abc");
    expect(parsed.searchParams.has("status")).toBe(false);
  });

  test("throws AuthenticationError on 401", async () => {
    const fetchMock = createMockFetch({
      status: 401,
      body: { error: { code: "authentication_error", message: "Invalid API key" } },
    });
    const client = new HttpClient({
      apiKey: "sn_test_bad",
      fetch: fetchMock as unknown as typeof fetch,
      retries: 0,
    });

    await expect(client.get("/v1/emails")).rejects.toBeInstanceOf(AuthenticationError);
  });

  test("throws NotFoundError on 404", async () => {
    const fetchMock = createMockFetch({
      status: 404,
      body: { error: { code: "not_found", message: "Email not found" } },
    });
    const client = new HttpClient({
      apiKey: "sn_test_123",
      fetch: fetchMock as unknown as typeof fetch,
      retries: 0,
    });

    await expect(client.get("/v1/emails/em_missing")).rejects.toBeInstanceOf(NotFoundError);
  });

  test("throws ValidationError on 422", async () => {
    const fetchMock = createMockFetch({
      status: 422,
      body: {
        error: {
          code: "validation_error",
          message: "Invalid email address",
          details: { field: "to" },
        },
      },
    });
    const client = new HttpClient({
      apiKey: "sn_test_123",
      fetch: fetchMock as unknown as typeof fetch,
      retries: 0,
    });

    try {
      await client.post("/v1/emails", {});
      throw new Error("Should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).details).toEqual({ field: "to" });
    }
  });

  test("throws RateLimitError on 429 with Retry-After", async () => {
    const fetchMock = createMockFetch({
      status: 429,
      body: { error: { code: "rate_limit_error", message: "Too many requests" } },
      headers: { "Retry-After": "30" },
    });
    const client = new HttpClient({
      apiKey: "sn_test_123",
      fetch: fetchMock as unknown as typeof fetch,
      retries: 0,
    });

    try {
      await client.get("/v1/emails");
      throw new Error("Should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(RateLimitError);
      expect((error as RateLimitError).retryAfter).toBe(30);
    }
  });

  test("retries on 5xx errors", async () => {
    let callCount = 0;
    const fetchMock = mock(() => {
      callCount++;
      if (callCount < 3) {
        return Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
          headers: new Headers(),
          json: () =>
            Promise.resolve({
              error: { code: "internal_error", message: "Server error" },
            }),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers(),
        json: () => Promise.resolve({ data: [] }),
      } as Response);
    });
    const client = new HttpClient({
      apiKey: "sn_test_123",
      fetch: fetchMock as unknown as typeof fetch,
      retries: 2,
    });

    const result = await client.get("/v1/emails");
    expect(result).toEqual({ data: [] });
    expect(callCount).toBe(3);
  });

  test("does NOT retry on 4xx errors", async () => {
    const fetchMock = createMockFetch({
      status: 400,
      body: { error: { code: "bad_request", message: "Bad request" } },
    });
    const client = new HttpClient({
      apiKey: "sn_test_123",
      fetch: fetchMock as unknown as typeof fetch,
      retries: 2,
    });

    await expect(client.get("/v1/emails")).rejects.toBeInstanceOf(ApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("strips trailing slash from baseUrl", async () => {
    const fetchMock = createMockFetch({ status: 200, body: {} });
    const client = new HttpClient({
      apiKey: "sn_test_123",
      baseUrl: "https://api.example.com///",
      fetch: fetchMock as unknown as typeof fetch,
    });

    await client.get("/v1/emails");

    const [url] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toStartWith("https://api.example.com/v1/emails");
  });
});
