import type { HttpClient } from "../client.js";
import type {
  CreateApiKeyParams,
  ApiKey,
  ApiKeyCreated,
  PaginatedResponse,
  PaginationParams,
  DeleteResponse,
} from "../types.js";

export class ApiKeys {
  constructor(private readonly client: HttpClient) {}

  /**
   * Create a new API key.
   * The full key value is only returned once in the response.
   *
   * @example
   * ```ts
   * const { key } = await sendry.apiKeys.create({
   *   name: "Production Key",
   *   scope: "sending_access",
   * });
   * // Store `key` securely -- it cannot be retrieved again
   * ```
   */
  async create(params: CreateApiKeyParams): Promise<ApiKeyCreated> {
    return this.client.post<ApiKeyCreated>("/v1/api-keys", params);
  }

  /**
   * List all API keys (keys are masked, only prefix is shown).
   */
  async list(params?: PaginationParams): Promise<PaginatedResponse<ApiKey>> {
    return this.client.get<PaginatedResponse<ApiKey>>("/v1/api-keys", params as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Revoke (delete) an API key.
   */
  async remove(id: string): Promise<DeleteResponse> {
    return this.client.delete<DeleteResponse>(`/v1/api-keys/${encodeURIComponent(id)}`);
  }
}
