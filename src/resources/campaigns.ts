import type { HttpClient } from "../client.js";
import type {
  Campaign,
  CampaignListItem,
  CreateCampaignParams,
  UpdateCampaignParams,
  ListCampaignsParams,
  ScheduleCampaignParams,
  CampaignActionResponse,
  PaginatedResponse,
  DeleteResponse,
} from "../types.js";

export class Campaigns {
  constructor(private readonly client: HttpClient) {}

  /**
   * Create a new email campaign in draft status.
   *
   * @param params - Campaign configuration including name, subject, from, and audience.
   * @returns The created campaign.
   *
   * @example
   * ```ts
   * const campaign = await sendry.campaigns.create({
   *   name: "March Newsletter",
   *   subject: "What's new in March",
   *   from: "Acme <hello@acme.com>",
   *   audience_id: "aud_abc123",
   *   html: "<h1>Hello!</h1>",
   * });
   * ```
   */
  async create(params: CreateCampaignParams): Promise<Campaign> {
    return this.client.post<Campaign>("/v1/campaigns", params);
  }

  /**
   * List all campaigns with cursor-based pagination.
   *
   * @param params - Optional filters: status, cursor, limit.
   * @returns Paginated list of campaign summaries.
   *
   * @example
   * ```ts
   * const { data } = await sendry.campaigns.list({ status: "draft" });
   * ```
   */
  async list(params?: ListCampaignsParams): Promise<PaginatedResponse<CampaignListItem>> {
    return this.client.get<PaginatedResponse<CampaignListItem>>("/v1/campaigns", params as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Get a campaign by ID including delivery statistics.
   *
   * @param id - The campaign ID.
   * @returns Full campaign details with stats.
   *
   * @example
   * ```ts
   * const campaign = await sendry.campaigns.get("cp_abc123");
   * console.log(campaign.stats.delivered_count);
   * ```
   */
  async get(id: string): Promise<Campaign> {
    return this.client.get<Campaign>(`/v1/campaigns/${encodeURIComponent(id)}`);
  }

  /**
   * Update a campaign. Only draft campaigns can be updated.
   *
   * @param id - The campaign ID.
   * @param params - Fields to update.
   * @returns Updated campaign.
   *
   * @example
   * ```ts
   * const updated = await sendry.campaigns.update("cp_abc123", {
   *   subject: "Updated subject line",
   * });
   * ```
   */
  async update(id: string, params: UpdateCampaignParams): Promise<Campaign> {
    return this.client.put<Campaign>(`/v1/campaigns/${encodeURIComponent(id)}`, params);
  }

  /**
   * Delete a campaign. Only draft or cancelled campaigns can be deleted.
   *
   * @param id - The campaign ID.
   * @returns Deletion acknowledgement.
   *
   * @example
   * ```ts
   * await sendry.campaigns.remove("cp_abc123");
   * ```
   */
  async remove(id: string): Promise<DeleteResponse> {
    return this.client.delete<DeleteResponse>(`/v1/campaigns/${encodeURIComponent(id)}`);
  }

  /**
   * Schedule a draft campaign to be sent at a specific time.
   *
   * @param id - The campaign ID.
   * @param params - ISO 8601 scheduled_at datetime.
   * @returns Campaign with updated status.
   *
   * @example
   * ```ts
   * await sendry.campaigns.schedule("cp_abc123", {
   *   scheduled_at: "2026-03-15T10:00:00Z",
   * });
   * ```
   */
  async schedule(id: string, params: ScheduleCampaignParams): Promise<CampaignActionResponse> {
    return this.client.post<CampaignActionResponse>(
      `/v1/campaigns/${encodeURIComponent(id)}/schedule`,
      params
    );
  }

  /**
   * Immediately enqueue a draft or scheduled campaign for sending.
   *
   * @param id - The campaign ID.
   * @returns Campaign with updated status ("sending").
   *
   * @example
   * ```ts
   * await sendry.campaigns.send("cp_abc123");
   * ```
   */
  async send(id: string): Promise<CampaignActionResponse> {
    return this.client.post<CampaignActionResponse>(
      `/v1/campaigns/${encodeURIComponent(id)}/send`
    );
  }

  /**
   * Cancel a scheduled or paused campaign.
   *
   * @param id - The campaign ID.
   * @returns Campaign with updated status ("cancelled").
   *
   * @example
   * ```ts
   * await sendry.campaigns.cancel("cp_abc123");
   * ```
   */
  async cancel(id: string): Promise<CampaignActionResponse> {
    return this.client.post<CampaignActionResponse>(
      `/v1/campaigns/${encodeURIComponent(id)}/cancel`
    );
  }

  /**
   * Pause a campaign that is currently sending.
   *
   * @param id - The campaign ID.
   * @returns Campaign with updated status ("paused").
   *
   * @example
   * ```ts
   * await sendry.campaigns.pause("cp_abc123");
   * ```
   */
  async pause(id: string): Promise<CampaignActionResponse> {
    return this.client.post<CampaignActionResponse>(
      `/v1/campaigns/${encodeURIComponent(id)}/pause`
    );
  }

  /**
   * Resume sending a paused campaign.
   *
   * @param id - The campaign ID.
   * @returns Campaign with updated status ("sending").
   *
   * @example
   * ```ts
   * await sendry.campaigns.resume("cp_abc123");
   * ```
   */
  async resume(id: string): Promise<CampaignActionResponse> {
    return this.client.post<CampaignActionResponse>(
      `/v1/campaigns/${encodeURIComponent(id)}/resume`
    );
  }
}
