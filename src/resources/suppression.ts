import type { HttpClient } from "../client.js";
import type {
  AddSuppressionParams,
  SuppressionEntry,
  PaginatedResponse,
  PaginationParams,
  DeleteResponse,
} from "../types.js";

export class Suppression {
  constructor(private readonly client: HttpClient) {}

  /**
   * List all suppressed email addresses.
   */
  async list(params?: PaginationParams): Promise<PaginatedResponse<SuppressionEntry>> {
    return this.client.get<PaginatedResponse<SuppressionEntry>>("/v1/suppression", params as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Add an email address to the suppression list.
   *
   * @example
   * ```ts
   * await sendry.suppression.add({
   *   email: "bounced@example.com",
   *   reason: "hard_bounce",
   * });
   * ```
   */
  async add(params: AddSuppressionParams): Promise<SuppressionEntry> {
    return this.client.post<SuppressionEntry>("/v1/suppression", params);
  }

  /**
   * Remove an email address from the suppression list.
   */
  async remove(email: string): Promise<DeleteResponse> {
    return this.client.delete<DeleteResponse>(`/v1/suppression/${encodeURIComponent(email)}`);
  }
}
