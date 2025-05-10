import { describe, expect, it } from "vitest";
import { add } from "../../src/add";

describe("add", () => {
  it("adds two numbers", () => {
    expect(add(1, 2)).toBe(3);
  });

  it("adds negative numbers", () => {
    expect(add(-1, -2)).toBe(-3);
  });
});
