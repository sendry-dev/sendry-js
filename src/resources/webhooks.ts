import type { HttpClient } from "../client.js";
import type {
  CreateWebhookParams,
  UpdateWebhookParams,
  Webhook,
  WebhookListItem,
  PaginatedResponse,
  PaginationParams,
  DeleteResponse,
} from "../types.js";

export class Webhooks {
  constructor(private readonly client: HttpClient) {}

  /**
   * Create a webhook endpoint.
   *
   * @example
   * ```ts
   * const webhook = await sendry.webhooks.create({
   *   url: "https://example.com/webhook",
   *   events: ["email.delivered", "email.bounced"],
   * });
   * console.log(webhook.secret); // HMAC secret for verifying payloads
   * ```
   */
  async create(params: CreateWebhookParams): Promise<Webhook> {
    return this.client.post<Webhook>("/v1/webhooks", params);
  }

  /**
   * List all webhooks.
   */
  async list(params?: PaginationParams): Promise<PaginatedResponse<WebhookListItem>> {
    return this.client.get<PaginatedResponse<WebhookListItem>>("/v1/webhooks", params as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Get a webhook by ID (includes secret).
   */
  async get(id: string): Promise<Webhook> {
    return this.client.get<Webhook>(`/v1/webhooks/${encodeURIComponent(id)}`);
  }

  /**
   * Update a webhook.
   *
   * @example
   * ```ts
   * await sendry.webhooks.update("wh_abc123", {
   *   events: ["email.delivered"],
   *   active: false,
   * });
   * ```
   */
  async update(id: string, params: UpdateWebhookParams): Promise<Webhook> {
    return this.client.put<Webhook>(`/v1/webhooks/${encodeURIComponent(id)}`, params);
  }

  /**
   * Delete a webhook.
   */
  async remove(id: string): Promise<DeleteResponse> {
    return this.client.delete<DeleteResponse>(`/v1/webhooks/${encodeURIComponent(id)}`);
  }
}
