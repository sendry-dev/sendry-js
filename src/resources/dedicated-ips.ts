import type { HttpClient } from "../client.js";
import type {
  DedicatedIp,
  ProvisionDedicatedIpParams,
  AssignIpParams,
  IpAssignment,
  PaginatedResponse,
  PaginationParams,
  DeleteResponse,
} from "../types.js";

export class DedicatedIps {
  constructor(private readonly client: HttpClient) {}

  /**
   * Provision a new dedicated IP address for email sending.
   * Available on Business and Enterprise plans.
   *
   * @param params - Optional provider ("ses" | "mailgun", default "ses").
   * @returns The provisioned dedicated IP.
   *
   * @example
   * ```ts
   * const ip = await sendry.dedicatedIps.provision({ provider: "ses" });
   * console.log(ip.ip_address); // "198.51.100.42"
   * console.log(ip.status); // "provisioning"
   * ```
   */
  async provision(params?: ProvisionDedicatedIpParams): Promise<DedicatedIp> {
    return this.client.post<DedicatedIp>("/v1/ips", params ?? {});
  }

  /**
   * List all dedicated IP addresses for your organisation.
   *
   * @param params - Optional cursor and limit for pagination.
   * @returns Paginated list of dedicated IPs.
   *
   * @example
   * ```ts
   * const { data } = await sendry.dedicatedIps.list();
   * ```
   */
  async list(params?: PaginationParams): Promise<PaginatedResponse<DedicatedIp>> {
    return this.client.get<PaginatedResponse<DedicatedIp>>("/v1/ips", params as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Get details for a specific dedicated IP.
   *
   * @param id - The dedicated IP ID.
   * @returns IP details including domain assignments and warmup progress.
   *
   * @example
   * ```ts
   * const ip = await sendry.dedicatedIps.get("dip_abc123");
   * console.log(ip.warmup_progress); // 65 (percentage)
   * ```
   */
  async get(id: string): Promise<DedicatedIp> {
    return this.client.get<DedicatedIp>(`/v1/ips/${encodeURIComponent(id)}`);
  }

  /**
   * Assign a dedicated IP to a domain.
   * The IP must be in warming or active status.
   *
   * @param ipId - The dedicated IP ID.
   * @param params - domain_id to assign the IP to.
   * @returns The created IP assignment.
   *
   * @example
   * ```ts
   * const assignment = await sendry.dedicatedIps.assign("dip_abc123", {
   *   domain_id: "dom_xyz456",
   * });
   * ```
   */
  async assign(ipId: string, params: AssignIpParams): Promise<IpAssignment> {
    return this.client.post<IpAssignment>(
      `/v1/ips/${encodeURIComponent(ipId)}/assign`,
      params
    );
  }

  /**
   * Remove a dedicated IP assignment from a domain.
   *
   * @param ipId - The dedicated IP ID.
   * @param assignmentId - The assignment ID to remove.
   * @returns Deletion acknowledgement.
   *
   * @example
   * ```ts
   * await sendry.dedicatedIps.removeAssignment("dip_abc123", "asgn_xyz456");
   * ```
   */
  async removeAssignment(ipId: string, assignmentId: string): Promise<DeleteResponse> {
    return this.client.delete<DeleteResponse>(
      `/v1/ips/${encodeURIComponent(ipId)}/assign/${encodeURIComponent(assignmentId)}`
    );
  }

  /**
   * Release a dedicated IP address.
   * This deletes the associated SES pool and all domain assignments.
   *
   * @param id - The dedicated IP ID.
   * @returns Deletion acknowledgement.
   *
   * @example
   * ```ts
   * await sendry.dedicatedIps.release("dip_abc123");
   * ```
   */
  async release(id: string): Promise<DeleteResponse> {
    return this.client.delete<DeleteResponse>(`/v1/ips/${encodeURIComponent(id)}`);
  }
}
