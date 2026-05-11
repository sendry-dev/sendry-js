import type { HttpClient } from "../client.js";
import type {
  SendEmailParams,
  SendEmailResponse,
  Email,
  ListEmailsParams,
  PaginatedResponse,
  SendBatchParams,
  BatchEmailResponse,
  SendMarketingEmailParams,
  CancelEmailResponse,
} from "../types.js";

export class Emails {
  constructor(private readonly client: HttpClient) {}

  /**
   * Send a single email.
   *
   * @example
   * ```ts
   * const { id } = await sendry.emails.send({
   *   from: "hello@example.com",
   *   to: "user@example.com",
   *   subject: "Hello",
   *   html: "<p>World</p>",
   * });
   * ```
   */
  async send(params: SendEmailParams): Promise<SendEmailResponse> {
    return this.client.post<SendEmailResponse>("/v1/emails", params);
  }

  /**
   * Get a single email by ID.
   *
   * @example
   * ```ts
   * const email = await sendry.emails.get("em_abc123");
   * console.log(email.status); // "delivered"
   * ```
   */
  async get(id: string): Promise<Email> {
    return this.client.get<Email>(`/v1/emails/${encodeURIComponent(id)}`);
  }

  /**
   * List emails with cursor pagination.
   *
   * @example
   * ```ts
   * const { data, has_more, next_cursor } = await sendry.emails.list({ limit: 25 });
   * ```
   */
  async list(params?: ListEmailsParams): Promise<PaginatedResponse<Email>> {
    return this.client.get<PaginatedResponse<Email>>("/v1/emails", params as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Send a batch of up to 100 emails in a single request.
   *
   * @example
   * ```ts
   * const result = await sendry.emails.sendBatch({
   *   from: "hello@example.com",
   *   emails: [
   *     { to: "a@example.com", subject: "Hi A", html: "<p>A</p>" },
   *     { to: "b@example.com", subject: "Hi B", html: "<p>B</p>" },
   *   ],
   * });
   * ```
   */
  async sendBatch(params: SendBatchParams): Promise<BatchEmailResponse> {
    return this.client.post<BatchEmailResponse>("/v1/emails/batch", params);
  }

  /**
   * Send a marketing email with unsubscribe support.
   *
   * @example
   * ```ts
   * await sendry.emails.sendMarketing({
   *   from: "news@example.com",
   *   to: "subscriber@example.com",
   *   subject: "Newsletter",
   *   html: "<p>News!</p>",
   *   unsubscribe_url: "https://example.com/unsub",
   * });
   * ```
   */
  async sendMarketing(params: SendMarketingEmailParams): Promise<SendEmailResponse> {
    return this.client.post<SendEmailResponse>("/v1/emails/marketing", params);
  }

  /**
   * Cancel a queued email (only works if the email has not been sent yet).
   *
   * @example
   * ```ts
   * const result = await sendry.emails.cancel("em_abc123");
   * console.log(result.status); // "cancelled"
   * ```
   */
  async cancel(id: string): Promise<CancelEmailResponse> {
    return this.client.post<CancelEmailResponse>(`/v1/emails/${encodeURIComponent(id)}/cancel`);
  }
}
