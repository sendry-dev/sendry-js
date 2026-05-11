import type { HttpClient } from "../client.js";
import type {
  CreateUnsubscribeParams,
  BatchUnsubscribeParams,
  BatchUnsubscribeResponse,
  UnsubscribeEntry,
  PaginatedResponse,
  ListUnsubscribesParams,
  DeleteResponse,
} from "../types.js";

export class Unsubscribes {
  constructor(private readonly client: HttpClient) {}

  /**
   * List unsubscribed email addresses.
   */
  async list(params?: ListUnsubscribesParams): Promise<PaginatedResponse<UnsubscribeEntry>> {
    return this.client.get<PaginatedResponse<UnsubscribeEntry>>("/v1/unsubscribes", params as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Add a single email to the unsubscribe list.
   *
   * @example
   * ```ts
   * await sendry.unsubscribes.create({
   *   email: "user@example.com",
   *   list_id: "newsletter",
   *   reason: "User clicked unsubscribe",
   * });
   * ```
   */
  async create(params: CreateUnsubscribeParams): Promise<UnsubscribeEntry> {
    return this.client.post<UnsubscribeEntry>("/v1/unsubscribes", params);
  }

  /**
   * Batch add emails to the unsubscribe list (up to 1000).
   *
   * @example
   * ```ts
   * const { inserted } = await sendry.unsubscribes.createBatch({
   *   emails: ["a@example.com", "b@example.com"],
   *   list_id: "newsletter",
   * });
   * ```
   */
  async createBatch(params: BatchUnsubscribeParams): Promise<BatchUnsubscribeResponse> {
    return this.client.post<BatchUnsubscribeResponse>("/v1/unsubscribes/batch", params);
  }

  /**
   * Get a single unsubscribe record by ID.
   */
  async get(id: string): Promise<UnsubscribeEntry> {
    return this.client.get<UnsubscribeEntry>(`/v1/unsubscribes/${encodeURIComponent(id)}`);
  }

  /**
   * Remove an email from the unsubscribe list.
   */
  async remove(id: string): Promise<DeleteResponse> {
    return this.client.delete<DeleteResponse>(`/v1/unsubscribes/${encodeURIComponent(id)}`);
  }
}
