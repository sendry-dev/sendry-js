/**
 * Base error for all SDK errors.
 */
export class SendryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SendryError";
  }
}

/**
 * The API returned an error response (4xx or 5xx).
 */
export class ApiError extends SendryError {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/**
 * 401 Unauthorized -- invalid or missing API key.
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = "Invalid API key") {
    super(401, "authentication_error", message);
    this.name = "AuthenticationError";
  }
}

/**
 * 422 Validation error -- request body/params failed validation.
 */
export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(422, "validation_error", message, details);
    this.name = "ValidationError";
  }
}

/**
 * 429 Rate limited -- too many requests.
 */
export class RateLimitError extends ApiError {
  public readonly retryAfter: number | null;

  constructor(message: string = "Rate limit exceeded", retryAfter: number | null = null) {
    super(429, "rate_limit_error", message);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

/**
 * 404 Not found.
 */
export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(404, "not_found", message);
    this.name = "NotFoundError";
  }
}

/**
 * Network-level error (fetch threw, DNS failed, timeout, etc.).
 */
export class NetworkError extends SendryError {
  public override readonly cause?: Error;

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = "NetworkError";
    this.cause = cause;
  }
}
