import type { HttpClient } from "../client.js";
import type {
  InboundEmail,
  InboundConfig,
  UpdateInboundConfigParams,
  PaginatedResponse,
  PaginationParams,
} from "../types.js";

export class Inbound {
  constructor(private readonly client: HttpClient) {}

  /**
   * List received inbound emails with cursor pagination.
   *
   * @param params - Optional cursor and limit for pagination.
   * @returns Paginated list of inbound emails.
   *
   * @example
   * ```ts
   * const { data, has_more, next_cursor } = await sendry.inbound.list({ limit: 25 });
   * ```
   */
  async list(params?: PaginationParams): Promise<PaginatedResponse<InboundEmail>> {
    return this.client.get<PaginatedResponse<InboundEmail>>("/v1/inbound", params as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Get a specific inbound email by ID including body and attachments.
   *
   * @param id - The inbound email ID.
   * @returns Full inbound email details.
   *
   * @example
   * ```ts
   * const email = await sendry.inbound.get("inb_abc123");
   * console.log(email.subject);
   * console.log(email.html);
   * ```
   */
  async get(id: string): Promise<InboundEmail> {
    return this.client.get<InboundEmail>(`/v1/inbound/${encodeURIComponent(id)}`);
  }

  /**
   * Get the inbound webhook forwarding configuration.
   *
   * @returns Current webhook URL and HMAC signing secret.
   *
   * @example
   * ```ts
   * const config = await sendry.inbound.getConfig();
   * console.log(config.url); // "https://api.acme.com/webhooks/inbound"
   * ```
   */
  async getConfig(): Promise<InboundConfig> {
    return this.client.get<InboundConfig>("/v1/inbound/config");
  }

  /**
   * Update the inbound webhook forwarding configuration.
   *
   * @param params - Webhook URL (or null to disable) and optional HMAC secret.
   * @returns Updated configuration.
   *
   * @example
   * ```ts
   * const config = await sendry.inbound.updateConfig({
   *   url: "https://api.acme.com/webhooks/inbound",
   *   secret: "my-hmac-secret",
   * });
   * ```
   */
  async updateConfig(params: UpdateInboundConfigParams): Promise<InboundConfig> {
    return this.client.put<InboundConfig>("/v1/inbound/config", params);
  }
}
