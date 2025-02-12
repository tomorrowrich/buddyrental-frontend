import { describe, it, expect } from "vitest";
import { render } from "./test-utils";

describe("test-utils", () => {
  it("should be define", () => {
    expect(render).toBeDefined();
  });

  it("should be a function", () => {
    expect(typeof render).toBe("function");
  });
});
