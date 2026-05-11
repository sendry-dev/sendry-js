import type { HttpClient } from "../client.js";
import type {
  TestEmail,
  TestEmailSummary,
  PaginatedResponse,
  PaginationParams,
} from "../types.js";

export class TestEmails {
  constructor(private readonly client: HttpClient) {}

  /**
   * List test emails captured in test mode with cursor pagination.
   *
   * @param params - Optional cursor and limit for pagination.
   * @returns Paginated list of test email summaries.
   *
   * @example
   * ```ts
   * const { data, has_more, next_cursor } = await sendry.testEmails.list({ limit: 25 });
   * for (const email of data) {
   *   console.log(email.subject, email.created_at);
   * }
   * ```
   */
  async list(params?: PaginationParams): Promise<PaginatedResponse<TestEmailSummary>> {
    return this.client.get<PaginatedResponse<TestEmailSummary>>("/v1/test-emails", params as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Get a specific test email by ID including HTML and plain-text body.
   *
   * @param id - The test email ID.
   * @returns Full test email details.
   *
   * @example
   * ```ts
   * const email = await sendry.testEmails.get("te_abc123");
   * console.log(email.html);
   * console.log(email.message_type); // "transactional"
   * ```
   */
  async get(id: string): Promise<TestEmail> {
    return this.client.get<TestEmail>(`/v1/test-emails/${encodeURIComponent(id)}`);
  }
}
