import { Vector, VectorUtil } from "@dotts";
import { describe, expect, it } from "vitest";

describe("VectorUtil", () => {
  it("should add two vectors correctly", () => {
    const a: Vector = { x: 1, y: 2 };
    const b: Vector = { x: 3, y: 4 };
    const result = VectorUtil.add(a, b);
    expect(result).toEqual({ x: 4, y: 6 });
  });

  it("should subtract two vectors correctly", () => {
    const a: Vector = { x: 5, y: 3 };
    const b: Vector = { x: 2, y: 7 };
    const result = VectorUtil.sub(a, b);
    expect(result).toEqual({ x: 3, y: -4 });
  });

  it("should multiply vector by scalar correctly", () => {
    const a: Vector = { x: 4, y: 5 };
    const result = VectorUtil.mul(a, 2);
    expect(result).toEqual({ x: 2, y: 2.5 });
  });

  it("should divide vector by scalar correctly", () => {
    const a: Vector = { x: 6, y: 9 };
    const result = VectorUtil.div(a, 3);
    expect(result).toEqual({ x: 2, y: 3 });
  });

  it("should check vector equality correctly", () => {
    const a: Vector = { x: 1, y: 2 };
    const b: Vector = { x: 1, y: 2 };
    const c: Vector = { x: 2, y: 3 };
    expect(VectorUtil.eq(a, b)).toBe(true);
    expect(VectorUtil.eq(a, c)).toBe(false);
  });

  it("should check vector not equality correctly", () => {
    const a: Vector = { x: 1, y: 2 };
    const b: Vector = { x: 1, y: 2 };
    const c: Vector = { x: 2, y: 3 };
    expect(VectorUtil.neq(a, b)).toBe(false);
    expect(VectorUtil.neq(a, c)).toBe(true);
  });

  it("should clone a vector correctly", () => {
    const a: Vector = { x: 1, y: 2 };
    const result = VectorUtil.clone(a);
    expect(result).toEqual(a);
    expect(result).not.toBe(a);
  });

  it("should round a vector correctly", () => {
    const a: Vector = { x: 1.7, y: 2.4 };
    const result = VectorUtil.round(a);
    expect(result).toEqual({ x: 2, y: 2 });
  });

  it("should floor a vector correctly", () => {
    const a: Vector = { x: 1.7, y: 2.4 };
    const result = VectorUtil.floor(a);
    expect(result).toEqual({ x: 1, y: 2 });
  });

  it("should ceil a vector correctly", () => {
    const a: Vector = { x: 1.7, y: 2.4 };
    const result = VectorUtil.ceil(a);
    expect(result).toEqual({ x: 2, y: 3 });
  });

  it("should calculate dot product correctly", () => {
    const a: Vector = { x: 2, y: 3 };
    const b: Vector = { x: 4, y: 5 };
    const result = VectorUtil.dot(a, b);
    expect(result).toBe(23);
  });

  it("should calculate the length of a vector correctly", () => {
    const a: Vector = { x: 3, y: 4 };
    const result = VectorUtil.length(a);
    expect(result).toBe(5);
  });

  it("should calculate distance between two vectors correctly", () => {
    const a: Vector = { x: 1, y: 1 };
    const b: Vector = { x: 4, y: 5 };
    const result = VectorUtil.distance(a, b);
    expect(result).toBe(5);
  });

  it("should normalize a vector correctly", () => {
    const a: Vector = { x: 3, y: 4 };
    const result = VectorUtil.normalize(a);
    expect(result).toEqual({ x: 0.6, y: 0.8 });
  });
});
