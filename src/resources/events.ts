import type { HttpClient } from "../client.js";
import type {
  IngestEventParams,
  IngestedEvent,
  ListEventsParams,
  PaginatedResponse,
} from "../types.js";

export class Events {
  constructor(private readonly client: HttpClient) {}

  /**
   * Ingest a custom event. Events can trigger automations whose
   * `trigger_type` is `"event"`.
   *
   * @example
   * ```ts
   * await sendry.events.ingest({
   *   name: "user.signed_up",
   *   contact_email: "user@example.com",
   *   payload: { plan: "pro" },
   * });
   * ```
   */
  async ingest(params: IngestEventParams): Promise<IngestedEvent> {
    return this.client.post<IngestedEvent>("/v1/events", params);
  }

  /**
   * List ingested events with cursor-based pagination.
   */
  async list(params?: ListEventsParams): Promise<PaginatedResponse<IngestedEvent>> {
    return this.client.get<PaginatedResponse<IngestedEvent>>(
      "/v1/events",
      params as Record<string, string | number | boolean | undefined>
    );
  }

  /**
   * Get a single ingested event.
   */
  async get(id: string): Promise<IngestedEvent> {
    return this.client.get<IngestedEvent>(`/v1/events/${encodeURIComponent(id)}`);
  }
}
