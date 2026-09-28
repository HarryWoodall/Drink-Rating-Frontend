import { describe, expect, it } from "vitest";
import { cn, imagePath } from "./utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false && "b", undefined, null, "c")).toBe("a c");
  });

  it("lets a later tailwind class win over an earlier conflicting one", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm text-muted-foreground", "text-amber")).toBe(
      "text-sm text-amber",
    );
  });

  it("accepts arrays and conditional objects", () => {
    expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c");
  });
});

describe("imagePath", () => {
  it("prefixes an image id with the blob store base", () => {
    expect(imagePath("abc123")).toBe(
      "https://blobs.harry-woodall-development.uk/public/image/abc123",
    );
  });

  // Callers pass this straight to an <img src>, where undefined means
  // "render the fallback" but an empty/partial URL would 404.
  it("returns undefined when there is no image", () => {
    expect(imagePath(null)).toBeUndefined();
    expect(imagePath("")).toBeUndefined();
  });
});
