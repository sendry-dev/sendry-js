import type { HttpClient } from "../client.js";
import type {
  CreateTemplateParams,
  UpdateTemplateParams,
  Template,
  PaginatedResponse,
  PaginationParams,
  RenderTemplateParams,
  RenderTemplateResponse,
  DeleteResponse,
  TemplateStarter,
  VisualStarterSummary,
  CompileBlocksParams,
  RenderAdhocParams,
} from "../types.js";

export class Templates {
  constructor(private readonly client: HttpClient) {}

  /**
   * Create a new template.
   *
   * @example
   * ```ts
   * const template = await sendry.templates.create({
   *   name: "Welcome Email",
   *   subject: "Welcome, {{name}}!",
   *   html: "<h1>Hello {{name}}</h1>",
   * });
   * ```
   */
  async create(params: CreateTemplateParams): Promise<Template> {
    return this.client.post<Template>("/v1/templates", params);
  }

  /**
   * List all templates.
   */
  async list(params?: PaginationParams): Promise<PaginatedResponse<Template>> {
    return this.client.get<PaginatedResponse<Template>>("/v1/templates", params as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Get a template by ID.
   */
  async get(id: string): Promise<Template> {
    return this.client.get<Template>(`/v1/templates/${encodeURIComponent(id)}`);
  }

  /**
   * Update a template.
   *
   * @example
   * ```ts
   * const updated = await sendry.templates.update("tmpl_abc123", {
   *   subject: "Updated Subject",
   * });
   * ```
   */
  async update(id: string, params: UpdateTemplateParams): Promise<Template> {
    return this.client.put<Template>(`/v1/templates/${encodeURIComponent(id)}`, params);
  }

  /**
   * Delete a template.
   */
  async remove(id: string): Promise<DeleteResponse> {
    return this.client.delete<DeleteResponse>(`/v1/templates/${encodeURIComponent(id)}`);
  }

  /**
   * Render a saved template with the given variables.
   *
   * @param id - Template ID.
   * @param params - Optional variables for rendering.
   * @returns Rendered HTML and plain-text versions.
   *
   * @example
   * ```ts
   * const { html, text } = await sendry.templates.render("tmpl_abc123", {
   *   variables: { name: "World" },
   * });
   * ```
   */
  async render(id: string, params?: RenderTemplateParams): Promise<RenderTemplateResponse> {
    return this.client.post<RenderTemplateResponse>(
      `/v1/templates/${encodeURIComponent(id)}/render`,
      params ?? {}
    );
  }

  /**
   * List all available pre-built starter templates.
   *
   * @returns List of starter templates including their HTML and variable schemas.
   *
   * @example
   * ```ts
   * const { data } = await sendry.templates.listStarters();
   * console.log(data[0].name); // "Welcome Email"
   * ```
   */
  async listStarters(): Promise<{ data: TemplateStarter[] }> {
    return this.client.get<{ data: TemplateStarter[] }>("/v1/templates/starters");
  }

  /**
   * List all available visual (block-based) starter templates.
   *
   * @returns Summarised list of visual starter templates (no design payload).
   *
   * @example
   * ```ts
   * const { data } = await sendry.templates.listVisualStarters();
   * ```
   */
  async listVisualStarters(): Promise<{ data: VisualStarterSummary[] }> {
    return this.client.get<{ data: VisualStarterSummary[] }>("/v1/templates/visual-starters");
  }

  /**
   * Get the full design JSON for a specific visual starter template.
   *
   * @param starterId - The visual starter ID.
   * @returns Full visual starter including block design JSON.
   *
   * @example
   * ```ts
   * const starter = await sendry.templates.getVisualStarter("welcome-blocks");
   * ```
   */
  async getVisualStarter(starterId: string): Promise<Record<string, unknown>> {
    return this.client.get<Record<string, unknown>>(
      `/v1/templates/visual-starters/${encodeURIComponent(starterId)}`
    );
  }

  /**
   * Compile a visual block design JSON to email-safe HTML.
   * Used for live preview in the visual editor.
   *
   * @param params - Block design JSON and optional variables.
   * @returns Compiled HTML and plain-text output.
   *
   * @example
   * ```ts
   * const { html } = await sendry.templates.compileBlocks({
   *   design: myBlockDesign,
   *   variables: { name: "Alice" },
   * });
   * ```
   */
  async compileBlocks(params: CompileBlocksParams): Promise<RenderTemplateResponse> {
    return this.client.post<RenderTemplateResponse>("/v1/templates/compile-blocks", params);
  }

  /**
   * Render arbitrary template HTML with variable substitution without saving.
   * Useful for generating previews before creating a template.
   *
   * @param params - HTML content, optional engine, and variables.
   * @returns Rendered HTML and plain-text output.
   *
   * @example
   * ```ts
   * const { html } = await sendry.templates.renderAdhoc({
   *   html: "<h1>Hello {{name}}</h1>",
   *   variables: { name: "Bob" },
   * });
   * ```
   */
  async renderAdhoc(params: RenderAdhocParams): Promise<RenderTemplateResponse> {
    return this.client.post<RenderTemplateResponse>("/v1/templates/render", params);
  }
}
