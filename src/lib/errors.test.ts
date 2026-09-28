import { describe, expect, it } from "vitest";
import { HttpError } from "./errors";

function httpError<T>(status: number, statusText: string, body: T) {
  const response = new Response(null, { status, statusText });
  return new HttpError(status, statusText, body, response);
}

describe("HttpError", () => {
  it("prefers the server's message for the error message", () => {
    const error = httpError(400, "Bad Request", { message: "Rating required" });
    expect(error.message).toBe("Rating required");
  });

  it("falls back to status and status text when the body has no message", () => {
    expect(httpError(500, "Internal Server Error", {}).message).toBe(
      "500 Internal Server Error",
    );
    expect(httpError(404, "Not Found", null).message).toBe("404 Not Found");
  });

  it("keeps the status and parsed body for callers that branch on them", () => {
    const body = {
      error: "Too many requests",
      cooldown: { minutes: 1, seconds: 30 },
    };
    const error = httpError(429, "Too Many Requests", body);

    expect(error.status).toBe(429);
    expect(error.statusText).toBe("Too Many Requests");
    expect(error.body).toEqual(body);
  });

  it("is an Error and an HttpError, named HttpError", () => {
    const error = httpError(403, "Forbidden", null);

    expect(error).toBeInstanceOf(HttpError);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("HttpError");
  });
});
