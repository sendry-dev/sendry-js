import { describe, test, expect } from "bun:test";
import {
  SendryError,
  ApiError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  NotFoundError,
  NetworkError,
} from "../src/errors";

describe("Error classes", () => {
  test("SendryError is an instance of Error", () => {
    const err = new SendryError("test");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(SendryError);
    expect(err.name).toBe("SendryError");
  });

  test("ApiError includes statusCode and code", () => {
    const err = new ApiError(400, "bad_request", "Bad request", { field: "to" });
    expect(err).toBeInstanceOf(SendryError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe("bad_request");
    expect(err.details).toEqual({ field: "to" });
  });

  test("AuthenticationError defaults to 401", () => {
    const err = new AuthenticationError();
    expect(err.statusCode).toBe(401);
    expect(err).toBeInstanceOf(ApiError);
  });

  test("ValidationError includes details", () => {
    const err = new ValidationError("Invalid", { fields: ["to"] });
    expect(err.statusCode).toBe(422);
    expect(err.details).toEqual({ fields: ["to"] });
  });

  test("RateLimitError includes retryAfter", () => {
    const err = new RateLimitError("slow down", 30);
    expect(err.statusCode).toBe(429);
    expect(err.retryAfter).toBe(30);
  });

  test("NotFoundError defaults to 404", () => {
    const err = new NotFoundError();
    expect(err.statusCode).toBe(404);
  });

  test("NetworkError wraps a cause", () => {
    const cause = new TypeError("Failed to fetch");
    const err = new NetworkError("Network failed", cause);
    expect(err).toBeInstanceOf(SendryError);
    expect(err.cause).toBe(cause);
    expect(err.name).toBe("NetworkError");
  });

  test("all error types are catchable as SendryError", () => {
    const errors = [
      new AuthenticationError(),
      new ValidationError("bad"),
      new RateLimitError(),
      new NotFoundError(),
      new ApiError(500, "internal", "oops"),
      new NetworkError("down"),
    ];
    for (const err of errors) {
      expect(err).toBeInstanceOf(SendryError);
    }
  });
});
