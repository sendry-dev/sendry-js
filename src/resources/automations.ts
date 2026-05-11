import type { HttpClient } from "../client.js";
import type {
  Automation,
  AutomationStep,
  AutomationRun,
  AddAutomationStepParams,
  AutomationRunStepListResponse,
  AutomationStepListResponse,
  CreateAutomationParams,
  CreateAutomationRunParams,
  DeleteResponse,
  ListAutomationRunsParams,
  ListAutomationsParams,
  PaginatedResponse,
  UpdateAutomationParams,
  UpdateAutomationStepParams,
} from "../types.js";

export class Automations {
  constructor(private readonly client: HttpClient) {}

  // -------- Automations --------

  /**
   * List automations with cursor-based pagination.
   *
   * @example
   * ```ts
   * const { data } = await sendry.automations.list({ status: "active" });
   * ```
   */
  async list(params?: ListAutomationsParams): Promise<PaginatedResponse<Automation>> {
    return this.client.get<PaginatedResponse<Automation>>(
      "/v1/automations",
      params as Record<string, string | number | boolean | undefined>
    );
  }

  /**
   * Get an automation by ID.
   */
  async get(id: string): Promise<Automation> {
    return this.client.get<Automation>(`/v1/automations/${encodeURIComponent(id)}`);
  }

  /**
   * Create a new automation in draft status.
   */
  async create(params: CreateAutomationParams): Promise<Automation> {
    return this.client.post<Automation>("/v1/automations", params);
  }

  /**
   * Patch an automation. Only the provided fields are updated.
   */
  async update(id: string, params: UpdateAutomationParams): Promise<Automation> {
    return this.client.patch<Automation>(
      `/v1/automations/${encodeURIComponent(id)}`,
      params
    );
  }

  /**
   * Delete an automation.
   */
  async delete(id: string): Promise<DeleteResponse> {
    return this.client.delete<DeleteResponse>(
      `/v1/automations/${encodeURIComponent(id)}`
    );
  }

  /**
   * Activate an automation (status → "active").
   */
  async activate(id: string): Promise<Automation> {
    return this.client.post<Automation>(
      `/v1/automations/${encodeURIComponent(id)}/activate`
    );
  }

  /**
   * Pause an automation (status → "paused").
   */
  async pause(id: string): Promise<Automation> {
    return this.client.post<Automation>(
      `/v1/automations/${encodeURIComponent(id)}/pause`
    );
  }

  /**
   * Archive an automation (status → "archived").
   */
  async archive(id: string): Promise<Automation> {
    return this.client.post<Automation>(
      `/v1/automations/${encodeURIComponent(id)}/archive`
    );
  }

  // -------- Steps --------

  /**
   * List all steps for an automation.
   */
  async listSteps(automationId: string): Promise<AutomationStepListResponse> {
    return this.client.get<AutomationStepListResponse>(
      `/v1/automations/${encodeURIComponent(automationId)}/steps`
    );
  }

  /**
   * Add a step to an automation.
   */
  async addStep(
    automationId: string,
    params: AddAutomationStepParams
  ): Promise<AutomationStep> {
    return this.client.post<AutomationStep>(
      `/v1/automations/${encodeURIComponent(automationId)}/steps`,
      params
    );
  }

  /**
   * Patch an automation step.
   */
  async updateStep(
    automationId: string,
    stepId: string,
    params: UpdateAutomationStepParams
  ): Promise<AutomationStep> {
    return this.client.patch<AutomationStep>(
      `/v1/automations/${encodeURIComponent(automationId)}/steps/${encodeURIComponent(stepId)}`,
      params
    );
  }

  /**
   * Delete an automation step.
   */
  async deleteStep(automationId: string, stepId: string): Promise<DeleteResponse> {
    return this.client.delete<DeleteResponse>(
      `/v1/automations/${encodeURIComponent(automationId)}/steps/${encodeURIComponent(stepId)}`
    );
  }

  // -------- Runs --------

  /**
   * List runs for an automation with cursor-based pagination.
   */
  async listRuns(
    automationId: string,
    params?: ListAutomationRunsParams
  ): Promise<PaginatedResponse<AutomationRun>> {
    return this.client.get<PaginatedResponse<AutomationRun>>(
      `/v1/automations/${encodeURIComponent(automationId)}/runs`,
      params as Record<string, string | number | boolean | undefined>
    );
  }

  /**
   * Get a single automation run.
   */
  async getRun(automationId: string, runId: string): Promise<AutomationRun> {
    return this.client.get<AutomationRun>(
      `/v1/automations/${encodeURIComponent(automationId)}/runs/${encodeURIComponent(runId)}`
    );
  }

  /**
   * List the executed/pending steps for a single run.
   */
  async listRunSteps(
    automationId: string,
    runId: string
  ): Promise<AutomationRunStepListResponse> {
    return this.client.get<AutomationRunStepListResponse>(
      `/v1/automations/${encodeURIComponent(automationId)}/runs/${encodeURIComponent(runId)}/steps`
    );
  }

  /**
   * Cancel an in-progress run.
   */
  async cancelRun(automationId: string, runId: string): Promise<AutomationRun> {
    return this.client.post<AutomationRun>(
      `/v1/automations/${encodeURIComponent(automationId)}/runs/${encodeURIComponent(runId)}/cancel`
    );
  }

  /**
   * Manually trigger a run for an automation. Requires either `contact_id` or
   * `contact_email`.
   */
  async createRun(
    automationId: string,
    params: CreateAutomationRunParams
  ): Promise<AutomationRun> {
    return this.client.post<AutomationRun>(
      `/v1/automations/${encodeURIComponent(automationId)}/runs`,
      params
    );
  }
}
