import type { HttpClient } from "../client.js";
import type {
  CreateDomainParams,
  Domain,
  PaginatedResponse,
  PaginationParams,
  VerifyDomainResponse,
  DeleteResponse,
  ConfigureBimiParams,
  BimiConfig,
  VerifyBimiResponse,
} from "../types.js";

export class Domains {
  constructor(private readonly client: HttpClient) {}

  /**
   * Add a domain to your account.
   *
   * @example
   * ```ts
   * const domain = await sendry.domains.create({ name: "example.com" });
   * console.log(domain.dns_records); // Records to add to your DNS
   * ```
   */
  async create(params: CreateDomainParams): Promise<Domain> {
    return this.client.post<Domain>("/v1/domains", params);
  }

  /**
   * List all domains.
   */
  async list(params?: PaginationParams): Promise<PaginatedResponse<Domain>> {
    return this.client.get<PaginatedResponse<Domain>>("/v1/domains", params as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Get a domain by ID.
   */
  async get(id: string): Promise<Domain> {
    return this.client.get<Domain>(`/v1/domains/${encodeURIComponent(id)}`);
  }

  /**
   * Trigger DNS verification for a domain.
   *
   * @example
   * ```ts
   * const result = await sendry.domains.verify("dom_abc123");
   * if (result.spf_verified && result.dkim_verified) {
   *   console.log("Domain is fully verified!");
   * }
   * ```
   */
  async verify(id: string): Promise<VerifyDomainResponse> {
    return this.client.post<VerifyDomainResponse>(`/v1/domains/${encodeURIComponent(id)}/verify`);
  }

  /**
   * Delete a domain.
   */
  async remove(id: string): Promise<DeleteResponse> {
    return this.client.delete<DeleteResponse>(`/v1/domains/${encodeURIComponent(id)}`);
  }

  /**
   * Configure BIMI (Brand Indicators for Message Identification) for a domain.
   *
   * @param domainId - The domain ID to configure BIMI for.
   * @param params - BIMI configuration including logo URL and optional VMC URL.
   * @returns The created/updated BIMI configuration.
   *
   * @example
   * ```ts
   * const bimi = await sendry.domains.configureBimi("dom_abc123", {
   *   logo_url: "https://example.com/logo.svg",
   *   vmc_url: "https://example.com/vmc.pem",
   * });
   * ```
   */
  async configureBimi(domainId: string, params: ConfigureBimiParams): Promise<BimiConfig> {
    return this.client.post<BimiConfig>(`/v1/domains/${encodeURIComponent(domainId)}/bimi`, params);
  }

  /**
   * Get the BIMI configuration for a domain.
   *
   * @param domainId - The domain ID.
   * @returns The BIMI configuration, or throws 404 if not configured.
   *
   * @example
   * ```ts
   * const bimi = await sendry.domains.getBimi("dom_abc123");
   * console.log(bimi.status); // "pending"
   * ```
   */
  async getBimi(domainId: string): Promise<BimiConfig> {
    return this.client.get<BimiConfig>(`/v1/domains/${encodeURIComponent(domainId)}/bimi`);
  }

  /**
   * Trigger DNS verification for the BIMI record of a domain.
   *
   * @param domainId - The domain ID.
   * @returns Verification result.
   *
   * @example
   * ```ts
   * const result = await sendry.domains.verifyBimi("dom_abc123");
   * if (result.verified) console.log("BIMI is verified!");
   * ```
   */
  async verifyBimi(domainId: string): Promise<VerifyBimiResponse> {
    return this.client.post<VerifyBimiResponse>(`/v1/domains/${encodeURIComponent(domainId)}/bimi/verify`);
  }

  /**
   * Remove the BIMI configuration for a domain.
   *
   * @param domainId - The domain ID.
   * @returns Deletion acknowledgement.
   *
   * @example
   * ```ts
   * await sendry.domains.removeBimi("dom_abc123");
   * ```
   */
  async removeBimi(domainId: string): Promise<DeleteResponse> {
    return this.client.delete<DeleteResponse>(`/v1/domains/${encodeURIComponent(domainId)}/bimi`);
  }
}
