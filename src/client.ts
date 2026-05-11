import type { SendryConfig } from "./types.js";
import { VERSION } from "./version.js";
import {
  ApiError,
  AuthenticationError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  ValidationError,
} from "./errors.js";

const DEFAULT_BASE_URL = "https://api.sendry.online";
const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_RETRIES = 2;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method: HttpMethod;
  path: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  /** Override instance timeout for this request */
  timeout?: number;
}

export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchFn: typeof globalThis.fetch;
  private readonly timeout: number;
  private readonly defaultHeaders: Record<string, string>;
  private readonly retries: number;

  constructor(config: SendryConfig) {
    if (!config.apiKey) {
      throw new Error(
        "Missing API key. Pass it to the Sendry constructor: new Sendry('sn_live_...')"
      );
    }

    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.fetchFn = config.fetch ?? globalThis.fetch;
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT;
    this.defaultHeaders = config.headers ?? {};
    this.retries = config.retries ?? DEFAULT_RETRIES;
  }

  async request<T>(options: RequestOptions): Promise<T> {
    const url = this.buildUrl(options.path, options.query);
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": `sendry-sdk/${VERSION}`,
      ...this.defaultHeaders,
      ...options.headers,
    };

    // Remove Content-Type for GET/DELETE with no body
    if (!options.body && (options.method === "GET" || options.method === "DELETE")) {
      delete headers["Content-Type"];
    }

    const requestInit: RequestInit = {
      method: options.method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    };

    const timeout = options.timeout ?? this.timeout;

    let lastError: Error | undefined;
    const maxAttempts = this.retries + 1;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await this.fetchFn(url, {
          ...requestInit,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          // 204 No Content
          if (response.status === 204) {
            return undefined as T;
          }
          return (await response.json()) as T;
        }

        // Parse error body
        const errorBody = await this.parseErrorBody(response);
        const errorCode = errorBody?.error?.code ?? "unknown_error";
        const errorMessage = errorBody?.error?.message ?? response.statusText;
        const errorDetails = errorBody?.error?.details;

        // Non-retryable client errors -- throw immediately
        if (response.status === 401) {
          throw new AuthenticationError(errorMessage);
        }
        if (response.status === 404) {
          throw new NotFoundError(errorMessage);
        }
        if (response.status === 422) {
          throw new ValidationError(errorMessage, errorDetails);
        }
        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After");
          throw new RateLimitError(
            errorMessage,
            retryAfter ? parseInt(retryAfter, 10) : null
          );
        }

        // 4xx errors (other than above) -- do not retry
        if (response.status >= 400 && response.status < 500) {
          throw new ApiError(response.status, errorCode, errorMessage, errorDetails);
        }

        // 5xx errors -- retry
        lastError = new ApiError(response.status, errorCode, errorMessage, errorDetails);
      } catch (error) {
        if (
          error instanceof ApiError ||
          error instanceof AuthenticationError ||
          error instanceof ValidationError ||
          error instanceof RateLimitError ||
          error instanceof NotFoundError
        ) {
          throw error;
        }

        // Network or timeout error -- retry
        if (error instanceof DOMException && error.name === "AbortError") {
          lastError = new NetworkError(`Request timed out after ${timeout}ms`);
        } else if (error instanceof Error) {
          lastError = new NetworkError(error.message, error);
        } else {
          lastError = new NetworkError(String(error));
        }
      }

      // Exponential backoff before retry: 200ms, 400ms, 800ms...
      if (attempt < maxAttempts - 1) {
        const delay = Math.min(200 * Math.pow(2, attempt), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  // Convenience methods
  get<T>(path: string, query?: RequestOptions["query"]): Promise<T> {
    return this.request<T>({ method: "GET", path, query });
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>({ method: "POST", path, body });
  }

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>({ method: "PUT", path, body });
  }

  patch<T>(path: string, body?: unknown, query?: RequestOptions["query"]): Promise<T> {
    return this.request<T>({ method: "PATCH", path, body, query });
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>({ method: "DELETE", path });
  }

  private buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private async parseErrorBody(response: Response): Promise<{
    error?: { code?: string; message?: string; details?: unknown };
  } | null> {
    try {
      return (await response.json()) as { error?: { code?: string; message?: string; details?: unknown } };
    } catch {
      return null;
    }
  }
}
