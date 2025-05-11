import { Color } from "@dotts";
import { describe, expect, it } from "vitest";

describe("Color", () => {
  it("should create a color and access channels", () => {
    const c = new Color(10, 20, 30, 40);
    expect(c.r).toBe(10);
    expect(c.g).toBe(20);
    expect(c.b).toBe(30);
    expect(c.a).toBe(40);
  });

  it("should add colors correctly (instance method)", () => {
    const c1 = new Color(10, 20, 30, 40);
    const c2 = new Color(5, 10, 15, 20);
    c1.add(c2);
    expect(c1.r).toBe(15);
    expect(c1.g).toBe(30);
    expect(c1.b).toBe(45);
    expect(c1.a).toBe(60);
  });

  it("should add colors correctly (static method)", () => {
    const c1 = new Color(10, 20, 30, 40);
    const c2 = new Color(5, 10, 15, 20);
    const c3 = Color.add(c1, c2);
    expect(c3.r).toBe(15);
    expect(c3.g).toBe(30);
    expect(c3.b).toBe(45);
    expect(c3.a).toBe(60);
    // original unchanged
    expect(c1).not.toBe(c3);
    expect(c2).not.toBe(c3);
  });

  it("should subtract colors correctly (instance method)", () => {
    const c1 = new Color(10, 20, 30, 40);
    const c2 = new Color(5, 10, 15, 20);
    c1.sub(c2);
    expect(c1.r).toBe(5);
    expect(c1.g).toBe(10);
    expect(c1.b).toBe(15);
    expect(c1.a).toBe(20);
  });

  it("should subtract colors correctly (static method)", () => {
    const c1 = new Color(10, 20, 30, 40);
    const c2 = new Color(5, 10, 15, 20);
    const c3 = Color.sub(c1, c2);
    expect(c3.r).toBe(5);
    expect(c3.g).toBe(10);
    expect(c3.b).toBe(15);
    expect(c3.a).toBe(20);
    // original unchanged
    expect(c1).not.toBe(c3);
    expect(c2).not.toBe(c3);
  });

  it("should multiply colors correctly (instance method)", () => {
    const c = new Color(10, 20, 30, 40);
    c.mul(2);
    expect(c.r).toBe(20);
    expect(c.g).toBe(40);
    expect(c.b).toBe(60);
    expect(c.a).toBe(80);
  });

  it("should multiply colors correctly (static method)", () => {
    const c1 = new Color(10, 20, 30, 40);
    const c2 = Color.mul(c1, 2);
    expect(c2.r).toBe(20);
    expect(c2.g).toBe(40);
    expect(c2.b).toBe(60);
    expect(c2.a).toBe(80);
    // original unchanged
    expect(c1).not.toBe(c2);
  });

  it("should divide colors correctly (instance method)", () => {
    const c = new Color(10, 20, 30, 40);
    c.div(2);
    expect(c.r).toBe(5);
    expect(c.g).toBe(10);
    expect(c.b).toBe(15);
    expect(c.a).toBe(20);
  });

  it("should divide colors correctly (static method)", () => {
    const c1 = new Color(10, 20, 30, 40);
    const c2 = Color.div(c1, 2);
    expect(c2.r).toBe(5);
    expect(c2.g).toBe(10);
    expect(c2.b).toBe(15);
    expect(c2.a).toBe(20);
    // original unchanged
    expect(c1).not.toBe(c2);
  });

  it("should check equality correctly", () => {
    const c1 = new Color(1, 2, 3, 4);
    const c2 = new Color(1, 2, 3, 4);
    const c3 = new Color(5, 6, 7, 8);
    expect(c1.eq(c2)).toBe(true);
    expect(c1.neq(c3)).toBe(true);
  });

  it("should clone correctly", () => {
    const c1 = new Color(10, 20, 30, 40);
    const c2 = c1.clone();
    expect(c2.eq(c1)).toBe(true);
    // original unchanged
    expect(c1).not.toBe(c2);
  });

  it("should convert to array", () => {
    const c = new Color(10, 20, 30, 40);
    const arr = c.toArray();
    expect(arr).toEqual(new Uint8ClampedArray([10, 20, 30, 40]));
  });

  it("should parse hex colors correctly", () => {
    const c = new Color(0, 0, 0, 0).fromHex("#ffcc88");
    expect(c.r).toBe(255);
    expect(c.g).toBe(204);
    expect(c.b).toBe(136);
    expect(c.a).toBe(255);

    const short = new Color(0, 0, 0, 0).fromHex("#fc8");
    expect(short.r).toBe(255);
    expect(short.g).toBe(204);
    expect(short.b).toBe(136);
    expect(short.a).toBe(255);

    const withAlpha = new Color(0, 0, 0, 0).fromHex("#11223344");
    expect(withAlpha.r).toBe(17);
    expect(withAlpha.g).toBe(34);
    expect(withAlpha.b).toBe(51);
    expect(withAlpha.a).toBe(68);
  });
});
