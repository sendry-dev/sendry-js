import { describe, test, expect, mock } from "bun:test";
import { Sendry } from "../src/index";

function createMockFetch(body: unknown, status = 200) {
  return mock(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      statusText: "OK",
      headers: new Headers(),
      json: () => Promise.resolve(body),
    } as Response)
  );
}

describe("Emails resource", () => {
  test("send() posts to /v1/emails", async () => {
    const response = {
      id: "em_123",
      from: "a@b.com",
      to: ["c@d.com"],
      subject: "Hi",
      status: "queued",
      created_at: "2025-01-01T00:00:00Z",
    };
    const fetchMock = createMockFetch(response);
    const sendry = new Sendry({
      apiKey: "sn_test_123",
      fetch: fetchMock as unknown as typeof fetch,
    });

    const result = await sendry.emails.send({
      from: "a@b.com",
      to: "c@d.com",
      subject: "Hi",
      html: "<p>Hello</p>",
    });

    expect(result.id).toBe("em_123");
    expect(result.status).toBe("queued");

    const [url, options] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/v1/emails");
    expect(options.method).toBe("POST");
    const body = JSON.parse(options.body as string);
    expect(body.from).toBe("a@b.com");
    expect(body.to).toBe("c@d.com");
  });

  test("get() fetches /v1/emails/:id", async () => {
    const response = {
      id: "em_123",
      from: "a@b.com",
      to: ["c@d.com"],
      subject: "Hi",
      status: "delivered",
      created_at: "2025-01-01T00:00:00Z",
      sent_at: "2025-01-01T00:00:01Z",
    };
    const fetchMock = createMockFetch(response);
    const sendry = new Sendry({
      apiKey: "sn_test_123",
      fetch: fetchMock as unknown as typeof fetch,
    });

    const result = await sendry.emails.get("em_123");

    expect(result.status).toBe("delivered");
    const [url] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/v1/emails/em_123");
  });

  test("list() fetches /v1/emails with query params", async () => {
    const response = {
      data: [],
      has_more: false,
      next_cursor: null,
    };
    const fetchMock = createMockFetch(response);
    const sendry = new Sendry({
      apiKey: "sn_test_123",
      fetch: fetchMock as unknown as typeof fetch,
    });

    const result = await sendry.emails.list({ limit: 10, status: "sent" });

    expect(result.has_more).toBe(false);
    const [url] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const parsed = new URL(url);
    expect(parsed.searchParams.get("limit")).toBe("10");
    expect(parsed.searchParams.get("status")).toBe("sent");
  });

  test("sendBatch() posts to /v1/emails/batch", async () => {
    const response = {
      data: [
        { id: "em_1", status: "queued" },
        { id: "em_2", status: "queued" },
      ],
    };
    const fetchMock = createMockFetch(response);
    const sendry = new Sendry({
      apiKey: "sn_test_123",
      fetch: fetchMock as unknown as typeof fetch,
    });

    const result = await sendry.emails.sendBatch({
      from: "a@b.com",
      emails: [
        { to: "c@d.com", subject: "Hi C" },
        { to: "e@f.com", subject: "Hi E" },
      ],
    });

    expect(result.data).toHaveLength(2);
    const [url] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/v1/emails/batch");
  });

  test("cancel() posts to /v1/emails/:id/cancel", async () => {
    const response = { id: "em_123", status: "cancelled" };
    const fetchMock = createMockFetch(response);
    const sendry = new Sendry({
      apiKey: "sn_test_123",
      fetch: fetchMock as unknown as typeof fetch,
    });

    const result = await sendry.emails.cancel("em_123");

    expect(result.status).toBe("cancelled");
    const [url, options] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/v1/emails/em_123/cancel");
    expect(options.method).toBe("POST");
  });

  test("sendMarketing() posts to /v1/emails/marketing", async () => {
    const response = {
      id: "em_mkt_1",
      from: "news@example.com",
      to: ["user@example.com"],
      subject: "Newsletter",
      status: "queued",
      created_at: "2025-01-01T00:00:00Z",
    };
    const fetchMock = createMockFetch(response);
    const sendry = new Sendry({
      apiKey: "sn_test_123",
      fetch: fetchMock as unknown as typeof fetch,
    });

    const result = await sendry.emails.sendMarketing({
      from: "news@example.com",
      to: "user@example.com",
      subject: "Newsletter",
      html: "<p>News</p>",
      unsubscribe_url: "https://example.com/unsub",
    });

    expect(result.id).toBe("em_mkt_1");
    const [url] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/v1/emails/marketing");
  });
});
