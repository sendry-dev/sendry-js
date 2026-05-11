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

describe("Domains resource", () => {
  test("create() posts to /v1/domains", async () => {
    const response = {
      id: "dom_123",
      name: "example.com",
      status: "pending",
      dns_records: [],
      created_at: "2025-01-01T00:00:00Z",
    };
    const fetchMock = createMockFetch(response);
    const sendry = new Sendry({
      apiKey: "sn_test_123",
      fetch: fetchMock as unknown as typeof fetch,
    });

    const result = await sendry.domains.create({ name: "example.com" });

    expect(result.id).toBe("dom_123");
    expect(result.status).toBe("pending");
    const [url, options] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/v1/domains");
    expect(options.method).toBe("POST");
  });

  test("verify() posts to /v1/domains/:id/verify", async () => {
    const response = {
      id: "dom_123",
      name: "example.com",
      status: "verified",
      spf_verified: true,
      dkim_verified: true,
      dmarc_verified: false,
    };
    const fetchMock = createMockFetch(response);
    const sendry = new Sendry({
      apiKey: "sn_test_123",
      fetch: fetchMock as unknown as typeof fetch,
    });

    const result = await sendry.domains.verify("dom_123");

    expect(result.status).toBe("verified");
    expect(result.spf_verified).toBe(true);
    const [url] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/v1/domains/dom_123/verify");
  });

  test("remove() sends DELETE to /v1/domains/:id", async () => {
    const fetchMock = createMockFetch({ deleted: true });
    const sendry = new Sendry({
      apiKey: "sn_test_123",
      fetch: fetchMock as unknown as typeof fetch,
    });

    const result = await sendry.domains.remove("dom_123");

    expect(result.deleted).toBe(true);
    const [url, options] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/v1/domains/dom_123");
    expect(options.method).toBe("DELETE");
  });
});
