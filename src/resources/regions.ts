import type { HttpClient } from "../client.js";
import type {
  Region,
  OrgRegionSettings,
  UpdateOrgRegionParams,
  UpdateDomainRegionParams,
  RegionAnalyticsParams,
  RegionAnalyticsResponse,
} from "../types.js";

export class Regions {
  constructor(private readonly client: HttpClient) {}

  /**
   * List all active SES regions available for sending.
   *
   * @returns List of available regions with codes and display names.
   *
   * @example
   * ```ts
   * const { data } = await sendry.regions.list();
   * console.log(data[0].region_code); // "us-east-1"
   * ```
   */
  async list(): Promise<{ data: Region[] }> {
    return this.client.get<{ data: Region[] }>("/v1/regions");
  }

  /**
   * Get the organisation-level default SES sending region and data residency constraint.
   *
   * @returns Current org region settings.
   *
   * @example
   * ```ts
   * const settings = await sendry.regions.getOrgSettings();
   * console.log(settings.default_region); // "us-east-1"
   * console.log(settings.data_residency); // "none"
   * ```
   */
  async getOrgSettings(): Promise<OrgRegionSettings> {
    return this.client.get<OrgRegionSettings>("/v1/organizations/me/region");
  }

  /**
   * Set the organisation-level default SES sending region and optional data residency constraint.
   *
   * @param params - Optional default_region and data_residency ("none" | "eu" | "us" | "ap").
   * @returns Updated org region settings.
   *
   * @example
   * ```ts
   * const settings = await sendry.regions.updateOrgSettings({
   *   default_region: "eu-west-1",
   *   data_residency: "eu",
   * });
   * ```
   */
  async updateOrgSettings(params: UpdateOrgRegionParams): Promise<OrgRegionSettings> {
    return this.client.request<OrgRegionSettings>({
      method: "PATCH",
      path: "/v1/organizations/me/region",
      body: params,
    });
  }

  /**
   * Override the SES sending region for a specific domain.
   * This takes priority over the org default region.
   *
   * @param domainId - The domain ID.
   * @param params - region code to set, or null to clear the override.
   * @returns Updated domain region setting.
   *
   * @example
   * ```ts
   * await sendry.regions.setDomainRegion("dom_abc123", { region: "eu-west-1" });
   * // Clear domain override:
   * await sendry.regions.setDomainRegion("dom_abc123", { region: null });
   * ```
   */
  async setDomainRegion(domainId: string, params: UpdateDomainRegionParams): Promise<unknown> {
    return this.client.request<unknown>({
      method: "PATCH",
      path: `/v1/domains/${encodeURIComponent(domainId)}/region`,
      body: params,
    });
  }

  /**
   * Get a breakdown of sent emails by SES region for a date range.
   *
   * @param params - from and to dates (ISO 8601).
   * @returns Region distribution with counts and percentages.
   *
   * @example
   * ```ts
   * const analytics = await sendry.regions.getRegionAnalytics({
   *   from: "2025-01-01",
   *   to: "2025-01-31",
   * });
   * ```
   */
  async getRegionAnalytics(params: RegionAnalyticsParams): Promise<RegionAnalyticsResponse> {
    return this.client.get<RegionAnalyticsResponse>("/v1/analytics/regions", params as unknown as Record<string, string | number | boolean | undefined>);
  }
}
