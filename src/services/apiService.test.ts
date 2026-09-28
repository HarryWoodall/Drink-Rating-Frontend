import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { del, get, post, postWithFormData, put } from "./apiService";
import { HttpError } from "@/lib/errors";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

/** A failed response whose body is valid JSON, as the API returns. */
function errorResponse(status: number, statusText: string, body: unknown) {
  return new Response(JSON.stringify(body), { status, statusText });
}

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

/** The URL and RequestInit the single fetch call was made with. */
function lastCall(): [string, RequestInit] {
  expect(fetchMock).toHaveBeenCalledTimes(1);
  return fetchMock.mock.calls[0] as [string, RequestInit];
}

describe("get", () => {
  it("requests the path against the configured base URL", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: "11007" }));

    await expect(get("/drinks/id/11007")).resolves.toEqual({ id: "11007" });

    const [url] = lastCall();
    expect(url).toBe(`${BASE_URL}/drinks/id/11007`);
  });

  // The session cookie is httpOnly, so every call has to opt into sending it.
  it("sends credentials so the session cookie rides along", async () => {
    fetchMock.mockResolvedValue(jsonResponse([]));

    await get("/favourites");

    const [, init] = lastCall();
    expect(init.credentials).toBe("include");
  });

  it("throws on a non-OK response", async () => {
    fetchMock.mockResolvedValue(errorResponse(404, "Not Found", {}));

    await expect(get("/drinks/id/nope")).rejects.toThrow("404 Not Found");
  });
});

describe.each([
  ["post", post as (p: string, b: unknown) => Promise<unknown>, "POST"],
  ["put", put as (p: string, b: unknown) => Promise<unknown>, "PUT"],
])("%s", (_name, method, verb) => {
  it(`sends a JSON body with the ${verb} verb`, async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }));

    await method("/drinks/1/feedback", { comment: "Great", rating: 5 });

    const [url, init] = lastCall();
    expect(url).toBe(`${BASE_URL}/drinks/1/feedback`);
    expect(init.method).toBe(verb);
    expect(init.credentials).toBe("include");
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
    expect(init.body).toBe(JSON.stringify({ comment: "Great", rating: 5 }));
  });

  it("throws an HttpError carrying the parsed error body", async () => {
    const body = {
      error: "Too many requests",
      cooldown: { minutes: 2, seconds: 30 },
    };
    fetchMock.mockResolvedValue(errorResponse(429, "Too Many Requests", body));

    // usePostFeedback reads `status` and `body.cooldown` off this to build
    // its toast, so both have to survive the throw.
    const error = await httpErrorFrom(method("/drinks/1/feedback", {}));

    expect(error).toBeInstanceOf(HttpError);
    expect(error?.status).toBe(429);
    expect(error?.body).toEqual(body);
  });
});

describe("post", () => {
  it("resolves to undefined when the server returns an empty body", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(post("/favourites/11007", {})).resolves.toBeUndefined();
  });

  it("still throws an HttpError when the error body isn't JSON", async () => {
    fetchMock.mockResolvedValue(
      new Response("<html>gateway error</html>", {
        status: 502,
        statusText: "Bad Gateway",
      }),
    );

    const error = await httpErrorFrom(post("/drinks/1/feedback", {}));

    expect(error).toBeInstanceOf(HttpError);
    expect(error?.status).toBe(502);
    expect(error?.body).toBeNull();
  });
});

describe("del", () => {
  it("sends a DELETE with credentials and no body", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(del("/favourites/11007")).resolves.toBeUndefined();

    const [url, init] = lastCall();
    expect(url).toBe(`${BASE_URL}/favourites/11007`);
    expect(init.method).toBe("DELETE");
    expect(init.credentials).toBe("include");
    expect(init.body).toBeUndefined();
  });

  it("throws an HttpError on a non-OK response", async () => {
    fetchMock.mockResolvedValue(
      errorResponse(401, "Unauthorized", { message: "Sign in first" }),
    );

    const error = await httpErrorFrom(del("/favourites/11007"));

    expect(error).toBeInstanceOf(HttpError);
    expect(error?.message).toBe("Sign in first");
  });
});

describe("postWithFormData", () => {
  // The browser has to set its own multipart boundary, so this must not
  // force a Content-Type the way post/put do.
  it("posts the FormData without overriding Content-Type", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: "img-1" }));
    const formData = new FormData();
    formData.append("file", new Blob(["x"]), "avatar.png");

    await expect(postWithFormData("/profile/image", formData)).resolves.toEqual(
      { id: "img-1" },
    );

    const [url, init] = lastCall();
    expect(url).toBe(`${BASE_URL}/profile/image`);
    expect(init.method).toBe("POST");
    expect(init.body).toBe(formData);
    expect(init.headers).toBeUndefined();
  });

  it("throws an HttpError on a non-OK response", async () => {
    fetchMock.mockResolvedValue(
      errorResponse(413, "Payload Too Large", { message: "File too big" }),
    );

    const error = await httpErrorFrom(
      postWithFormData("/profile/image", new FormData()),
    );

    expect(error).toBeInstanceOf(HttpError);
    expect(error?.status).toBe(413);
  });
});

async function httpErrorFrom(
  promise: Promise<unknown>,
): Promise<HttpError | undefined> {
  try {
    await promise;
  } catch (e) {
    if (e instanceof HttpError) return e;

    // eslint-disable-next-line preserve-caught-error
    throw new Error(`Expected an HttpError, got: ${String(e)}`);
  }
}
