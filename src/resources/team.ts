import type { HttpClient } from "../client.js";
import type {
  TeamMember,
  ListTeamResponse,
  InviteTeamMemberParams,
  UpdateTeamMemberRoleParams,
  DeleteResponse,
} from "../types.js";

export class Team {
  constructor(private readonly client: HttpClient) {}

  /**
   * List all team members, including pending invites.
   *
   * @returns Team members array plus seat usage and current plan.
   *
   * @example
   * ```ts
   * const team = await sendry.team.list();
   * console.log(team.seats.used, "/", team.seats.limit);
   * ```
   */
  async list(): Promise<ListTeamResponse> {
    return this.client.get<ListTeamResponse>("/v1/team");
  }

  /**
   * Invite a new team member by email. Requires admin or owner role.
   *
   * @param params - Email address and optional role ("admin" | "member", default "member").
   * @returns The created team member record (status will be "pending").
   *
   * @example
   * ```ts
   * const member = await sendry.team.invite({
   *   email: "colleague@acme.com",
   *   role: "member",
   * });
   * ```
   */
  async invite(params: InviteTeamMemberParams): Promise<TeamMember> {
    return this.client.post<TeamMember>("/v1/team/invite", params);
  }

  /**
   * Remove a team member. Requires admin or owner role.
   *
   * @param id - The team member ID.
   * @returns Deletion acknowledgement.
   *
   * @example
   * ```ts
   * await sendry.team.remove("mem_abc123");
   * ```
   */
  async remove(id: string): Promise<DeleteResponse> {
    return this.client.delete<DeleteResponse>(`/v1/team/${encodeURIComponent(id)}`);
  }

  /**
   * Update a team member's role. Requires admin or owner role.
   *
   * @param id - The team member ID.
   * @param params - New role ("admin" | "member").
   * @returns Updated team member.
   *
   * @example
   * ```ts
   * const updated = await sendry.team.updateRole("mem_abc123", { role: "admin" });
   * ```
   */
  async updateRole(id: string, params: UpdateTeamMemberRoleParams): Promise<TeamMember> {
    return this.client.request<TeamMember>({
      method: "PATCH",
      path: `/v1/team/${encodeURIComponent(id)}/role`,
      body: params,
    });
  }
}
