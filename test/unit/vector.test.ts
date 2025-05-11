import { Vector } from "@dotts";
import { describe, expect, it } from "vitest";

describe("Vector", () => {
  it("should create a vector with correct x and y", () => {
    const v = new Vector(3, 4);
    expect(v.x).toBe(3);
    expect(v.y).toBe(4);
  });

  it("should calculate length correctly", () => {
    const v = new Vector(3, 4);
    expect(v.length).toBeCloseTo(5);
  });

  it("should add vectors correctly (instance method)", () => {
    const v1 = new Vector(1, 2);
    const v2 = new Vector(3, 4);
    v1.add(v2);
    expect(v1.x).toBe(4);
    expect(v1.y).toBe(6);
  });

  it("should add vectors correctly (static method)", () => {
    const v1 = new Vector(1, 2);
    const v2 = new Vector(3, 4);
    const v3 = Vector.add(v1, v2);
    expect(v3.x).toBe(4);
    expect(v3.y).toBe(6);
    // original unchanged
    expect(v1).not.toBe(v3);
    expect(v2).not.toBe(v3);
  });

  it("should subtract vectors correctly (instance method)", () => {
    const v1 = new Vector(5, 7);
    const v2 = new Vector(2, 3);
    v1.sub(v2);
    expect(v1.x).toBe(3);
    expect(v1.y).toBe(4);
  });

  it("should subtract vectors correctly (static method)", () => {
    const v1 = new Vector(5, 7);
    const v2 = new Vector(2, 3);
    const v3 = Vector.sub(v1, v2);
    expect(v3.x).toBe(3);
    expect(v3.y).toBe(4);
    // original unchanged
    expect(v1).not.toBe(v3);
    expect(v2).not.toBe(v3);
  });

  it("should multiply vector by scalar (instance method)", () => {
    const v = new Vector(2, 3);
    v.mul(2);
    expect(v.x).toBe(4);
    expect(v.y).toBe(6);
  });

  it("should multiply vector by scalar (static method)", () => {
    const v1 = new Vector(2, 3);
    const v2 = Vector.mul(v1, 2);
    expect(v2.x).toBe(4);
    expect(v2.y).toBe(6);
    // original unchanged
    expect(v1).not.toBe(v2);
  });

  it("should divide vector by scalar (instance method)", () => {
    const v = new Vector(6, 9);
    v.div(3);
    expect(v.x).toBe(2);
    expect(v.y).toBe(3);
  });

  it("should divide vector by scalar (static method)", () => {
    const v1 = new Vector(6, 9);
    const v2 = Vector.div(v1, 3);
    v1.div(3);
    expect(v2.x).toBe(2);
    expect(v2.y).toBe(3);
    // original unchanged
    expect(v1).not.toBe(v2);
  });

  it("should check equality of vectors", () => {
    const v1 = new Vector(1, 1);
    const v2 = new Vector(1, 1);
    const v3 = new Vector(2, 2);
    expect(v1.eq(v2)).toBe(true);
    expect(v1.eq(v3)).toBe(false);
  });

  it("should clone vectors", () => {
    const v1 = new Vector(1, 2);
    const v2 = v1.clone();
    expect(v2.eq(v1)).toBe(true);
    // original unchanged
    expect(v1).not.toBe(v2);
  });

  it("should convert to array correctly", () => {
    const v = new Vector(3, 4);
    const arr = v.toArray();
    expect(arr).toEqual(new Float32Array([3, 4]));
  });

  it("should round the vector components (instance method)", () => {
    const v = new Vector(3.4, 4.5);
    v.round();
    expect(v.x).toBe(3);
    expect(v.y).toBe(5);
  });

  it("should round the vector components (static method)", () => {
    const v1 = new Vector(3.4, 4.5);
    const v2 = Vector.round(v1);
    expect(v2.x).toBe(3);
    expect(v2.y).toBe(5);
    // original unchanged
    expect(v1).not.toBe(v2);
  });

  it("should floor the vector components (instance method)", () => {
    const v = new Vector(3.4, 4.5);
    v.floor();
    expect(v.x).toBe(3);
    expect(v.y).toBe(4);
  });

  it("should floor the vector components (static method)", () => {
    const v1 = new Vector(3.4, 4.5);
    const v2 = Vector.floor(v1);
    expect(v2.x).toBe(3);
    expect(v2.y).toBe(4);
    // original unchanged
    expect(v1).not.toBe(v2);
  });

  it("should ceil the vector components (instance method)", () => {
    const v = new Vector(3.4, 4.5);
    v.ceil();
    expect(v.x).toBe(4);
    expect(v.y).toBe(5);
  });

  it("should ceil the vector components (static method)", () => {
    const v1 = new Vector(3.4, 4.5);
    const v2 = Vector.ceil(v1);
    expect(v2.x).toBe(4);
    expect(v2.y).toBe(5);
    // original unchanged
    expect(v1).not.toBe(v2);
  });

  it("should calculate distance between vectors", () => {
    const v1 = new Vector(0, 0);
    const v2 = new Vector(3, 4);
    expect(v1.distance(v2)).toBeCloseTo(5);
  });

  it("should calculate dot product", () => {
    const v1 = new Vector(1, 2);
    const v2 = new Vector(3, 4);
    expect(v1.dot(v2)).toBe(11); // 1*3 + 2*4
  });

  it("should calculate cross product", () => {
    const v1 = new Vector(1, 2);
    const v2 = new Vector(3, 4);
    expect(v1.cross(v2)).toBe(-2); // 1*4 - 2*3
  });

  it("should normalize vector correctly (instance method)", () => {
    const v = new Vector(3, 4);
    v.normalize();
    expect(v.length).toBeCloseTo(1);
  });

  it("should normalize vector correctly (static method)", () => {
    const v1 = new Vector(3, 4);
    const v2 = Vector.normalize(v1);
    expect(v2.length).toBeCloseTo(1);
    // original unchanged
    expect(v1).not.toBe(v2);
  });
});
