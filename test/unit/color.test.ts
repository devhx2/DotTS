import { Color, ColorUtil } from "@dotts";
import { describe, expect, it } from "vitest";

describe("ColorUtil", () => {
  const red: Color = { r: 255, g: 0, b: 0, a: 255 };
  const green: Color = { r: 0, g: 255, b: 0, a: 255 };
  const half: Color = { r: 128, g: 128, b: 128, a: 128 };

  it("adds colors", () => {
    expect(ColorUtil.add(red, green)).toEqual({ r: 255, g: 255, b: 0, a: 510 });
  });

  it("subtracts colors", () => {
    expect(ColorUtil.sub(red, green)).toEqual({ r: 255, g: -255, b: 0, a: 0 });
  });

  it("multiplies color", () => {
    expect(ColorUtil.mul(half, 2)).toEqual({ r: 256, g: 256, b: 256, a: 256 });
  });

  it("divides color", () => {
    expect(ColorUtil.div(half, 2)).toEqual({ r: 64, g: 64, b: 64, a: 64 });
  });

  it("checks equality", () => {
    expect(ColorUtil.eq(red, red)).toBe(true);
    expect(ColorUtil.eq(red, green)).toBe(false);
  });

  it("checks inequality", () => {
    expect(ColorUtil.neq(red, green)).toBe(true);
    expect(ColorUtil.neq(red, red)).toBe(false);
  });

  it("clones color", () => {
    const clone = ColorUtil.clone(half);
    expect(clone).toEqual(half);
    expect(clone).not.toBe(half);
  });

  it("clamps color values to 0-255", () => {
    const over: Color = { r: 300, g: -20, b: 128, a: 999 };
    expect(ColorUtil.clamp(over)).toEqual({ r: 255, g: 0, b: 128, a: 255 });
  });
});
