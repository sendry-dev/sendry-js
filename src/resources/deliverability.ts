import type { HttpClient } from "../client.js";
import type {
  ReputationQuery,
  ReputationHistoryQuery,
  ReputationResponse,
  BlocklistQuery,
  BlocklistCheckBody,
  BlocklistResponse,
  DeliverabilityReportQuery,
  DeliverabilityReport,
} from "../types.js";

export class Deliverability {
  constructor(private readonly client: HttpClient) {}

  /**
   * Get a reputation overview for your organisation or a specific domain.
   *
   * @param params - Optional domain_id and days (1–90, default 30).
   * @returns Current reputation score, history, and per-domain breakdown.
   *
   * @example
   * ```ts
   * const reputation = await sendry.deliverability.getReputation({ days: 30 });
   * console.log(reputation.current.score); // 92
   * console.log(reputation.current.rating); // "excellent"
   * ```
   */
  async getReputation(params?: ReputationQuery): Promise<ReputationResponse> {
    return this.client.get<ReputationResponse>("/v1/deliverability/reputation", params as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Get reputation score history for a specific domain.
   *
   * @param domainId - The domain ID.
   * @param params - Optional from/to date range (ISO 8601).
   * @returns Array of reputation snapshots over time.
   *
   * @example
   * ```ts
   * const history = await sendry.deliverability.getReputationHistory("dom_abc123", {
   *   from: "2025-01-01",
   *   to: "2025-01-31",
   * });
   * ```
   */
  async getReputationHistory(domainId: string, params?: ReputationHistoryQuery): Promise<unknown> {
    return this.client.get<unknown>(
      `/v1/deliverability/reputation/${encodeURIComponent(domainId)}/history`,
      params as Record<string, string | number | boolean | undefined>
    );
  }

  /**
   * Get blocklist status for your domains and IPs.
   *
   * @param params - Optional target and target_type filter.
   * @returns Blocklist check results, active alerts, and summary.
   *
   * @example
   * ```ts
   * const blocklist = await sendry.deliverability.getBlocklist();
   * if (!blocklist.summary.clean_count) {
   *   console.warn("Some targets are clean");
   * }
   * ```
   */
  async getBlocklist(params?: BlocklistQuery): Promise<BlocklistResponse> {
    return this.client.get<BlocklistResponse>("/v1/deliverability/blocklist", params as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Run an on-demand blocklist check for a specific domain or IP.
   *
   * @param params - Target (domain or IP address) and target_type.
   * @returns Check result.
   *
   * @example
   * ```ts
   * await sendry.deliverability.runBlocklistCheck({
   *   target: "example.com",
   *   target_type: "domain",
   * });
   * ```
   */
  async runBlocklistCheck(params: BlocklistCheckBody): Promise<unknown> {
    return this.client.post<unknown>("/v1/deliverability/blocklist/check", params);
  }

  /**
   * Dismiss a blocklist alert by ID.
   *
   * @param alertId - The alert ID to dismiss.
   * @returns Updated alert.
   *
   * @example
   * ```ts
   * await sendry.deliverability.dismissAlert("alert_abc123");
   * ```
   */
  async dismissAlert(alertId: string): Promise<unknown> {
    return this.client.request<unknown>({
      method: "PATCH",
      path: `/v1/deliverability/blocklist/alerts/${encodeURIComponent(alertId)}`,
      body: { status: "dismissed" },
    });
  }

  /**
   * Get a comprehensive deliverability report for a date range.
   *
   * @param params - Optional domain_id and days (7–90, default 30).
   * @returns Full deliverability report including metrics, reputation, blocklist, and recommendations.
   *
   * @example
   * ```ts
   * const report = await sendry.deliverability.getReport({ days: 30 });
   * console.log(report.reputation.rating); // "good"
   * console.log(report.blocklist_status.clean); // true
   * ```
   */
  async getReport(params?: DeliverabilityReportQuery): Promise<DeliverabilityReport> {
    return this.client.get<DeliverabilityReport>("/v1/deliverability/report", params as Record<string, string | number | boolean | undefined>);
  }
}
