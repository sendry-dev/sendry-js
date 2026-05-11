import type { HttpClient } from "../client.js";
import type {
  SystemStatus,
  Incident,
  PaginatedResponse,
  PaginationParams,
  LatencyStats,
  GetLatencyParams,
} from "../types.js";

export class Status {
  constructor(private readonly client: HttpClient) {}

  /**
   * Get the current operational status of all Sendry components and any active incidents.
   *
   * @returns Current status, component health, active incidents, and SLA summary.
   *
   * @example
   * ```ts
   * const status = await sendry.status.getCurrent();
   * console.log(status.status); // "operational"
   * console.log(status.sla_summary.sla_met); // true
   * ```
   */
  async getCurrent(): Promise<SystemStatus> {
    return this.client.get<SystemStatus>("/v1/status");
  }

  /**
   * Get a paginated list of resolved incidents ordered by most recent first.
   *
   * @param params - Optional cursor and limit for pagination.
   * @returns Paginated incident history.
   *
   * @example
   * ```ts
   * const { data } = await sendry.status.getHistory({ limit: 10 });
   * for (const incident of data) {
   *   console.log(incident.title, incident.resolved_at);
   * }
   * ```
   */
  async getHistory(params?: PaginationParams): Promise<PaginatedResponse<Incident>> {
    return this.client.get<PaginatedResponse<Incident>>("/v1/status/history", params as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Get hourly P50/P95/P99 latency rollups for a component over a time window.
   *
   * @param params - Optional component slug (default "api-gateway") and hours (1–168, default 24).
   * @returns Latency stats including current P50, target, and hourly breakdown.
   *
   * @example
   * ```ts
   * const latency = await sendry.status.getLatency({
   *   component: "api-gateway",
   *   hours: 48,
   * });
   * console.log(latency.current_p50_ms); // 45
   * console.log(latency.target_met); // true
   * ```
   */
  async getLatency(params?: GetLatencyParams): Promise<LatencyStats> {
    return this.client.get<LatencyStats>("/v1/status/latency", params as Record<string, string | number | boolean | undefined>);
  }
}
