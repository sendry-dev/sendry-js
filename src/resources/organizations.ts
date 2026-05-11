import type { HttpClient } from "../client.js";
import type {
  Organization,
  UpdateOrganizationParams,
  BrandingSettings,
  UpdateBrandingParams,
} from "../types.js";

export class Organizations {
  constructor(private readonly client: HttpClient) {}

  /**
   * Get the current organisation's details.
   *
   * @returns Organisation ID, name, plan, and creation timestamp.
   *
   * @example
   * ```ts
   * const org = await sendry.organizations.getCurrent();
   * console.log(org.name); // "Acme Inc"
   * console.log(org.plan); // "pro"
   * ```
   */
  async getCurrent(): Promise<Organization> {
    return this.client.get<Organization>("/v1/organizations/me");
  }

  /**
   * Update the current organisation's name.
   *
   * @param params - New organisation name (must be non-empty).
   * @returns Updated organisation.
   *
   * @example
   * ```ts
   * const updated = await sendry.organizations.update({ name: "Acme Corp" });
   * ```
   */
  async update(params: UpdateOrganizationParams): Promise<Organization> {
    return this.client.request<Organization>({
      method: "PATCH",
      path: "/v1/organizations/me",
      body: params,
    });
  }

  /**
   * Get the current organisation's branding settings.
   * These are applied to unsubscribe pages and email footers.
   *
   * @returns Branding settings including brand colour, logo URL, and unsubscribe copy.
   *
   * @example
   * ```ts
   * const branding = await sendry.organizations.getBranding();
   * console.log(branding.brand_color); // "#dc2626"
   * ```
   */
  async getBranding(): Promise<BrandingSettings> {
    return this.client.get<BrandingSettings>("/v1/organizations/me/branding");
  }

  /**
   * Update the current organisation's branding settings.
   *
   * @param params - Fields to update. All fields are optional.
   * @returns Updated branding settings.
   *
   * @example
   * ```ts
   * const branding = await sendry.organizations.updateBranding({
   *   brand_color: "#6366f1",
   *   brand_logo: "https://cdn.acme.com/logo.png",
   * });
   * ```
   */
  async updateBranding(params: UpdateBrandingParams): Promise<BrandingSettings> {
    return this.client.request<BrandingSettings>({
      method: "PATCH",
      path: "/v1/organizations/me/branding",
      body: params,
    });
  }
}
