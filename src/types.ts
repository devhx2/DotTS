// ------------------------------------------------------------
// Interface
// ------------------------------------------------------------

interface Arithmetic<T> {
  add(other: T): this;
  sub(other: T): this;
  mul(n: number): this;
  div(n: number): this;
}

interface Comparable<T> {
  eq(other: T): boolean;
  neq(other: T): boolean;
}

interface Cloneable<T> {
  clone(): T;
}

interface ArrayConvertible<T> {
  toArray(): T;
}

interface Rounding {
  round(): this;
  floor(): this;
  ceil(): this;
}

interface Normalizable {
  normalize(): this;
}

// ------------------------------------------------------------
// Vector
// ------------------------------------------------------------

export class Vector
  implements
    Arithmetic<Vector>,
    Comparable<Vector>,
    Cloneable<Vector>,
    ArrayConvertible<Float32Array>,
    Rounding,
    Normalizable
{
  #array: Float32Array;
  get x(): number {
    return this.#array[0];
  }
  set x(n: number) {
    this.#array[0] = n;
  }
  get y(): number {
    return this.#array[1];
  }
  set y(n: number) {
    this.#array[1] = n;
  }
  get length(): number {
    return Math.hypot(this.x, this.y);
  }
  constructor(x: number, y: number) {
    this.#array = new Float32Array([x, y]);
  }
  add(other: Vector): this {
    this.x += other.x;
    this.y += other.y;
    return this;
  }
  static add(v1: Vector, v2: Vector): Vector {
    return v1.clone().add(v2);
  }
  sub(other: Vector): this {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }
  static sub(v1: Vector, v2: Vector): Vector {
    return v1.clone().sub(v2);
  }
  mul(n: number): this {
    this.x *= n;
    this.y *= n;
    return this;
  }
  static mul(v: Vector, n: number): Vector {
    return v.clone().mul(n);
  }
  div(n: number): this {
    this.x /= n;
    this.y /= n;
    return this;
  }
  static div(v: Vector, n: number): Vector {
    return v.clone().div(n);
  }
  eq(other: Vector): boolean {
    return this.x === other.x && this.y === other.y;
  }
  neq(other: Vector): boolean {
    return !this.eq(other);
  }
  clone(): Vector {
    return new Vector(this.x, this.y);
  }
  toArray(): Float32Array {
    return this.#array.slice();
  }
  round(): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }
  static round(v: Vector): Vector {
    return v.clone().round();
  }
  floor(): this {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }
  static floor(v: Vector): Vector {
    return v.clone().floor();
  }
  ceil(): this {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }
  static ceil(v: Vector): Vector {
    return v.clone().ceil();
  }
  distance(other: Vector): number {
    return Math.hypot(this.x - other.x, this.y - other.y);
  }
  dot(other: Vector): number {
    return this.x * other.x + this.y * other.y;
  }
  cross(other: Vector): number {
    return this.x * other.y - this.y * other.x;
  }
  normalize(): this {
    const len = this.length;
    if (len !== 0) {
      this.x /= len;
      this.y /= len;
    }
    return this;
  }
  static normalize(v: Vector): Vector {
    return v.clone().normalize();
  }
}

// ------------------------------------------------------------
// Color
// ------------------------------------------------------------

export class Color
  implements
    Arithmetic<Color>,
    Comparable<Color>,
    Cloneable<Color>,
    ArrayConvertible<Uint8ClampedArray>
{
  #array: Uint8ClampedArray;
  static readonly MIN_VALUE = 0;
  static readonly MAX_VALUE = 255;
  constructor(r: number, g: number, b: number, a: number) {
    this.#array = new Uint8ClampedArray([r, g, b, a]);
  }
  get r(): number {
    return this.#array[0];
  }
  set r(n: number) {
    this.#array[0] = n;
  }
  get g(): number {
    return this.#array[1];
  }
  set g(n: number) {
    this.#array[1] = n;
  }
  get b(): number {
    return this.#array[2];
  }
  set b(n: number) {
    this.#array[2] = n;
  }
  get a(): number {
    return this.#array[3];
  }
  set a(n: number) {
    this.#array[3] = n;
  }
  add(other: Color): this {
    this.r += other.r;
    this.g += other.g;
    this.b += other.b;
    this.a += other.a;
    return this;
  }
  static add(c1: Color, c2: Color): Color {
    return c1.clone().add(c2);
  }
  sub(other: Color): this {
    this.r -= other.r;
    this.g -= other.g;
    this.b -= other.b;
    this.a -= other.a;
    return this;
  }
  static sub(c1: Color, c2: Color): Color {
    return c1.clone().sub(c2);
  }
  mul(n: number): this {
    this.r *= n;
    this.g *= n;
    this.b *= n;
    this.a *= n;
    return this;
  }
  static mul(c: Color, n: number): Color {
    return c.clone().mul(n);
  }
  div(n: number): this {
    this.r /= n;
    this.g /= n;
    this.b /= n;
    this.a /= n;
    return this;
  }
  static div(c: Color, n: number): Color {
    return c.clone().div(n);
  }
  eq(other: Color): boolean {
    return (
      this.r === other.r &&
      this.g === other.g &&
      this.b === other.b &&
      this.a === other.a
    );
  }
  neq(other: Color): boolean {
    return !this.eq(other);
  }
  clone(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }
  toArray(): Uint8ClampedArray {
    return this.#array.slice();
  }
  toFloatArray(): Float32Array {
    return new Float32Array([
      this.r / Color.MAX_VALUE,
      this.g / Color.MAX_VALUE,
      this.b / Color.MAX_VALUE,
      this.a / Color.MAX_VALUE,
    ]);
  }
  fromHex(hex: string): this {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3 || hex.length === 4) {
      // #rgb / #rgba -> #rrggbb / #rrggbbaa
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (hex.length !== 6 && hex.length !== 8) {
      console.warn(`failed to convert ${hex} to rgba color`);
    }
    this.r = parseInt(hex.slice(0, 2), 16);
    this.g = parseInt(hex.slice(2, 4), 16);
    this.b = parseInt(hex.slice(4, 6), 16);
    this.a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) : 255;
    return this;
  }
}

// ------------------------------------------------------------
// Other
// ------------------------------------------------------------

export type Sprite = {
  position: Vector;
  speed: Vector;
  color: Color;
  textureID: string;
  buffer: WebGLBuffer;
};

export type Config = {
  canvas: {
    id: string;
    width: number;
    height: number;
    scale: number;
  };
  fps: number;
};
