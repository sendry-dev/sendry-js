import type { HttpClient } from "../client.js";
import type {
  Audience,
  CreateAudienceParams,
  UpdateAudienceParams,
  PaginatedResponse,
  PaginationParams,
  DeleteResponse,
  Contact,
  AddContactsToAudienceParams,
  AddContactsToAudienceResult,
} from "../types.js";

export class Audiences {
  constructor(private readonly client: HttpClient) {}

  /**
   * Create a new audience (contact list).
   *
   * @param params - Audience name and optional description.
   * @returns The created audience.
   *
   * @example
   * ```ts
   * const audience = await sendry.audiences.create({
   *   name: "Newsletter Subscribers",
   *   description: "Weekly newsletter list",
   * });
   * ```
   */
  async create(params: CreateAudienceParams): Promise<Audience> {
    return this.client.post<Audience>("/v1/audiences", params);
  }

  /**
   * List all audiences with member counts.
   *
   * @param params - Optional cursor and limit for pagination.
   * @returns Paginated list of audiences.
   *
   * @example
   * ```ts
   * const { data } = await sendry.audiences.list();
   * ```
   */
  async list(params?: PaginationParams): Promise<PaginatedResponse<Audience>> {
    return this.client.get<PaginatedResponse<Audience>>("/v1/audiences", params as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Get an audience by ID.
   *
   * @param id - The audience ID.
   * @returns Audience details including member count.
   *
   * @example
   * ```ts
   * const audience = await sendry.audiences.get("aud_abc123");
   * console.log(audience.member_count);
   * ```
   */
  async get(id: string): Promise<Audience> {
    return this.client.get<Audience>(`/v1/audiences/${encodeURIComponent(id)}`);
  }

  /**
   * Update an audience's name or description.
   *
   * @param id - The audience ID.
   * @param params - Fields to update.
   * @returns Updated audience.
   *
   * @example
   * ```ts
   * const updated = await sendry.audiences.update("aud_abc123", {
   *   name: "VIP Subscribers",
   * });
   * ```
   */
  async update(id: string, params: UpdateAudienceParams): Promise<Audience> {
    return this.client.put<Audience>(`/v1/audiences/${encodeURIComponent(id)}`, params);
  }

  /**
   * Delete an audience and remove all contact memberships.
   * Contacts themselves are not deleted.
   *
   * @param id - The audience ID.
   * @returns Deletion acknowledgement.
   *
   * @example
   * ```ts
   * await sendry.audiences.remove("aud_abc123");
   * ```
   */
  async remove(id: string): Promise<DeleteResponse> {
    return this.client.delete<DeleteResponse>(`/v1/audiences/${encodeURIComponent(id)}`);
  }

  /**
   * Add one or more contacts to an audience by their IDs.
   *
   * @param audienceId - The audience ID.
   * @param params - Array of contact IDs to add (max 100).
   * @returns Number of contacts added.
   *
   * @example
   * ```ts
   * const result = await sendry.audiences.addContacts("aud_abc123", {
   *   contact_ids: ["ct_1", "ct_2"],
   * });
   * console.log(result.added); // 2
   * ```
   */
  async addContacts(audienceId: string, params: AddContactsToAudienceParams): Promise<AddContactsToAudienceResult> {
    return this.client.post<AddContactsToAudienceResult>(
      `/v1/audiences/${encodeURIComponent(audienceId)}/contacts`,
      params
    );
  }

  /**
   * List all contacts in an audience.
   *
   * @param audienceId - The audience ID.
   * @param params - Optional cursor and limit for pagination.
   * @returns Paginated list of contacts.
   *
   * @example
   * ```ts
   * const { data } = await sendry.audiences.listContacts("aud_abc123");
   * ```
   */
  async listContacts(audienceId: string, params?: PaginationParams): Promise<PaginatedResponse<Contact>> {
    return this.client.get<PaginatedResponse<Contact>>(
      `/v1/audiences/${encodeURIComponent(audienceId)}/contacts`,
      params as Record<string, string | number | boolean | undefined>
    );
  }

  /**
   * Remove a contact from an audience.
   *
   * @param audienceId - The audience ID.
   * @param contactId - The contact ID to remove.
   * @returns Deletion acknowledgement.
   *
   * @example
   * ```ts
   * await sendry.audiences.removeContact("aud_abc123", "ct_xyz456");
   * ```
   */
  async removeContact(audienceId: string, contactId: string): Promise<DeleteResponse> {
    return this.client.delete<DeleteResponse>(
      `/v1/audiences/${encodeURIComponent(audienceId)}/contacts/${encodeURIComponent(contactId)}`
    );
  }
}
