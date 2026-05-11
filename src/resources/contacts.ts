import type { HttpClient } from "../client.js";
import type {
  Contact,
  CreateContactParams,
  UpdateContactParams,
  ListContactsParams,
  PaginatedResponse,
  DeleteResponse,
  BulkImportContactsParams,
  BulkImportResult,
} from "../types.js";

export class Contacts {
  constructor(private readonly client: HttpClient) {}

  /**
   * Create a new contact in your organisation.
   *
   * @param params - Contact details including email and optional name/metadata.
   * @returns The created contact.
   *
   * @example
   * ```ts
   * const contact = await sendry.contacts.create({
   *   email: "jane@example.com",
   *   first_name: "Jane",
   *   last_name: "Doe",
   * });
   * ```
   */
  async create(params: CreateContactParams): Promise<Contact> {
    return this.client.post<Contact>("/v1/contacts", params);
  }

  /**
   * List contacts with optional email search and audience filter.
   *
   * @param params - Optional filters: email (partial match), audience_id, cursor, limit.
   * @returns Paginated list of contacts.
   *
   * @example
   * ```ts
   * const { data, has_more, next_cursor } = await sendry.contacts.list({
   *   audience_id: "aud_abc123",
   *   limit: 50,
   * });
   * ```
   */
  async list(params?: ListContactsParams): Promise<PaginatedResponse<Contact>> {
    return this.client.get<PaginatedResponse<Contact>>("/v1/contacts", params as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Get a contact by ID.
   *
   * @param id - The contact ID.
   * @returns Contact details.
   *
   * @example
   * ```ts
   * const contact = await sendry.contacts.get("ct_abc123");
   * ```
   */
  async get(id: string): Promise<Contact> {
    return this.client.get<Contact>(`/v1/contacts/${encodeURIComponent(id)}`);
  }

  /**
   * Update a contact.
   *
   * @param id - The contact ID.
   * @param params - Fields to update.
   * @returns Updated contact.
   *
   * @example
   * ```ts
   * const updated = await sendry.contacts.update("ct_abc123", {
   *   unsubscribed: true,
   * });
   * ```
   */
  async update(id: string, params: UpdateContactParams): Promise<Contact> {
    return this.client.put<Contact>(`/v1/contacts/${encodeURIComponent(id)}`, params);
  }

  /**
   * Delete a contact.
   *
   * @param id - The contact ID.
   * @returns Deletion acknowledgement.
   *
   * @example
   * ```ts
   * await sendry.contacts.remove("ct_abc123");
   * ```
   */
  async remove(id: string): Promise<DeleteResponse> {
    return this.client.delete<DeleteResponse>(`/v1/contacts/${encodeURIComponent(id)}`);
  }

  /**
   * Look up a contact by email address (case-insensitive).
   *
   * @param email - The contact email.
   * @param opts - Optional `audience_id` to restrict to a specific audience.
   * @returns Contact details.
   *
   * @example
   * ```ts
   * const contact = await sendry.contacts.getByEmail("jane@example.com");
   * ```
   */
  async getByEmail(email: string, opts?: { audience_id?: string }): Promise<Contact> {
    return this.client.get<Contact>("/v1/contacts/by-email", {
      email,
      audience_id: opts?.audience_id,
    });
  }

  /**
   * Update a contact identified by email (case-insensitive). Body shape matches
   * `update(id, params)`.
   *
   * @param email - The contact email.
   * @param params - Fields to update.
   * @returns Updated contact.
   *
   * @example
   * ```ts
   * const updated = await sendry.contacts.updateByEmail("jane@example.com", {
   *   unsubscribed: true,
   * });
   * ```
   */
  async updateByEmail(email: string, params: UpdateContactParams): Promise<Contact> {
    return this.client.patch<Contact>("/v1/contacts/by-email", params, { email });
  }

  /**
   * Bulk import up to 1000 contacts at once.
   * Existing contacts matched by email are updated; new ones are created.
   *
   * @param params - Array of contacts and optional audience_id.
   * @returns Import result with created/updated counts.
   *
   * @example
   * ```ts
   * const result = await sendry.contacts.bulkImport({
   *   contacts: [
   *     { email: "alice@example.com", first_name: "Alice" },
   *     { email: "bob@example.com", first_name: "Bob" },
   *   ],
   *   audience_id: "aud_abc123",
   * });
   * console.log(result.created, result.updated);
   * ```
   */
  async bulkImport(params: BulkImportContactsParams): Promise<BulkImportResult> {
    return this.client.post<BulkImportResult>("/v1/contacts/import", params);
  }
}
