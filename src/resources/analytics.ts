import type { HttpClient } from "../client.js";
import type {
  AnalyticsParams,
  AnalyticsResponse,
  LogsParams,
  LogEvent,
  PaginatedResponse,
  CohortParams,
  CohortResponse,
  BenchmarkParams,
  BenchmarkResponse,
  BreakdownParams,
  BreakdownResponse,
  ComparisonResponse,
  ExportParams,
} from "../types.js";

export class Analytics {
  constructor(private readonly client: HttpClient) {}

  /**
   * Get aggregated email analytics (summary + timeseries).
   *
   * @example
   * ```ts
   * const stats = await sendry.analytics.stats({
   *   from: "2025-01-01",
   *   to: "2025-01-31",
   *   granularity: "day",
   * });
   * console.log(stats.summary.delivery_rate); // 0.98
   * ```
   */
  async stats(params: AnalyticsParams): Promise<AnalyticsResponse> {
    return this.client.get<AnalyticsResponse>("/v1/analytics", params as unknown as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Get email event logs with filtering and pagination.
   *
   * @param params - Optional filters: email_id, type, to, from_date, to_date, cursor, limit.
   * @returns Paginated list of email event log entries.
   *
   * @example
   * ```ts
   * const logs = await sendry.analytics.logs({
   *   email_id: "em_abc123",
   *   type: "delivered",
   *   limit: 25,
   * });
   * ```
   */
  async logs(params?: LogsParams): Promise<PaginatedResponse<LogEvent>> {
    return this.client.get<PaginatedResponse<LogEvent>>("/v1/logs", params as unknown as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Get cohort analysis data showing engagement over time after the send date.
   *
   * @param params - Date range, granularity, and metric to analyse.
   * @returns Cohort buckets with metric values by period offset.
   *
   * @example
   * ```ts
   * const cohorts = await sendry.analytics.getCohorts({
   *   from: "2025-01-01",
   *   to: "2025-01-31",
   *   metric: "open_rate",
   * });
   * ```
   */
  async getCohorts(params: CohortParams): Promise<CohortResponse> {
    return this.client.get<CohortResponse>("/v1/analytics/cohorts", params as unknown as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Get cross-organisation benchmark comparisons for delivery, open, and click rates.
   *
   * @param params - Date range and optional granularity.
   * @returns Your metrics alongside p50/p75/avg benchmarks across opted-in organisations.
   *
   * @example
   * ```ts
   * const benchmarks = await sendry.analytics.getBenchmarks({
   *   from: "2025-01-01",
   *   to: "2025-01-31",
   * });
   * ```
   */
  async getBenchmarks(params: BenchmarkParams): Promise<BenchmarkResponse> {
    return this.client.get<BenchmarkResponse>("/v1/analytics/benchmarks", params as unknown as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Opt in or out of the anonymous benchmark data sharing program.
   *
   * @param optIn - `true` to opt in, `false` to opt out.
   * @returns Acknowledgement.
   *
   * @example
   * ```ts
   * await sendry.analytics.toggleBenchmarkOptIn(true);
   * ```
   */
  async toggleBenchmarkOptIn(optIn: boolean): Promise<unknown> {
    return this.client.post<unknown>("/v1/analytics/benchmarks/opt-in", { opt_in: optIn });
  }

  /**
   * Get analytics broken down by domain or template.
   *
   * @param params - Date range, group_by dimension ("domain" | "template"), and optional limit.
   * @returns Per-dimension delivery, open, and click metrics.
   *
   * @example
   * ```ts
   * const breakdowns = await sendry.analytics.getBreakdowns({
   *   from: "2025-01-01",
   *   to: "2025-01-31",
   *   group_by: "domain",
   * });
   * ```
   */
  async getBreakdowns(params: BreakdownParams): Promise<BreakdownResponse> {
    return this.client.get<BreakdownResponse>("/v1/analytics/breakdowns", params as unknown as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Compare current period metrics against the equivalent previous period.
   *
   * @param params - Date range and optional granularity.
   * @returns Current and previous period stats along with percentage changes.
   *
   * @example
   * ```ts
   * const comparison = await sendry.analytics.getComparison({
   *   from: "2025-01-01",
   *   to: "2025-01-31",
   * });
   * console.log(comparison.changes.open_rate_delta); // +0.05 (5 pp increase)
   * ```
   */
  async getComparison(params: AnalyticsParams): Promise<ComparisonResponse> {
    return this.client.get<ComparisonResponse>("/v1/analytics/comparison", params as unknown as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Export analytics data as CSV or JSON.
   *
   * @param params - Date range, format ("csv" | "json"), optional granularity and domain filter.
   * @returns Raw CSV string or parsed JSON depending on the requested format.
   *
   * @example
   * ```ts
   * const csv = await sendry.analytics.exportData({
   *   from: "2025-01-01",
   *   to: "2025-01-31",
   *   format: "csv",
   * });
   * ```
   */
  async exportData(params: ExportParams): Promise<unknown> {
    return this.client.get<unknown>("/v1/analytics/export", params as unknown as Record<string, string | number | boolean | undefined>);
  }
}
