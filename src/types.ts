// ------------------------------------------------------------
// Operations
// ------------------------------------------------------------

type MathOperations<T> = {
  add(a: T, b: T): T;
  sub(a: T, b: T): T;
  mul(a: T, n: number): T;
  div(a: T, n: number): T;
};

type CompareOperations<T> = {
  eq(a: T, b: T): boolean;
  neq(a: T, b: T): boolean;
};

type CloneOperation<T> = {
  clone(a: T): T;
};

type ClampOperation<T> = {
  clamp(a: T): T;
};

type IntegerOperations<T> = {
  round(a: T): T;
  floor(a: T): T;
  ceil(a: T): T;
};

type ArrayConvert<T> = {
  toArray(a: T): Float32Array;
};

// ------------------------------------------------------------
// Vector
// ------------------------------------------------------------

export type Vector = {
  x: number;
  y: number;
};

type VectorDirections = {
  zero: Readonly<Vector>;
  up: Readonly<Vector>;
  down: Readonly<Vector>;
  right: Readonly<Vector>;
  left: Readonly<Vector>;
};

type VectorOperations = {
  dot: (a: Vector, b: Vector) => number;
  length: (v: Vector) => number;
  distance: (a: Vector, b: Vector) => number;
  normalize: (v: Vector) => Vector;
};

export const VectorUtil: MathOperations<Vector> &
  IntegerOperations<Vector> &
  CompareOperations<Vector> &
  CloneOperation<Vector> &
  ArrayConvert<Vector> &
  VectorDirections &
  VectorOperations = {
  zero: { x: 0, y: 0 },
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  add: (a, b) => ({ x: a.x + b.x, y: a.y + b.y }),
  sub: (a, b) => ({ x: a.x - b.x, y: a.y - b.y }),
  mul: (a, n) => ({ x: a.x / n, y: a.y / n }),
  div: (a, n) => ({ x: a.x / n, y: a.y / n }),
  eq: (a, b) => a.x === b.x && a.y === b.y,
  neq: (a, b) => !VectorUtil.eq(a, b),
  clone: (a) => ({ x: a.x, y: a.y }),
  toArray: (a) => new Float32Array([a.x, a.y]),
  round: (a) => ({ x: Math.round(a.x), y: Math.round(a.y) }),
  floor: (a) => ({ x: Math.floor(a.x), y: Math.floor(a.y) }),
  ceil: (a) => ({ x: Math.ceil(a.x), y: Math.ceil(a.y) }),
  dot: (a, b) => a.x * b.x + a.y * b.y,
  length: (v) => Math.hypot(v.x, v.y),
  distance: (a, b) => Math.hypot(a.x - b.x, a.y - b.y),
  normalize: (v) => {
    const length = VectorUtil.length(v);
    return length === 0 ? { x: 0, y: 0 } : { x: v.x / length, y: v.y / length };
  },
};

// ------------------------------------------------------------
// Color
// ------------------------------------------------------------

export type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type ColorLimits = {
  readonly min: number;
  readonly max: number;
};

const clamp = (n: number, min: number, max: number): number => {
  return Math.min(Math.max(n, min), max);
};

export const ColorUtil: MathOperations<Color> &
  CompareOperations<Color> &
  CloneOperation<Color> &
  ClampOperation<Color> &
  ArrayConvert<Color> &
  ColorLimits = {
  min: 0,
  max: 255,
  add: (a, b) => ({
    r: a.r + b.r,
    g: a.g + b.g,
    b: a.b + b.b,
    a: a.a + b.a,
  }),
  sub: (a, b) => ({
    r: a.r - b.r,
    g: a.g - b.g,
    b: a.b - b.b,
    a: a.a - b.a,
  }),
  mul: (a, n) => ({
    r: a.r * n,
    g: a.g * n,
    b: a.b * n,
    a: a.a * n,
  }),
  div: (a, n) =>
    ({
      r: a.r / n,
      g: a.g / n,
      b: a.b / n,
      a: a.a / n,
    } as Color),
  eq: (a, b) => a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a,
  neq: (a, b) => !ColorUtil.eq(a, b),
  clone: (a) => ({ r: a.r, g: a.g, b: a.b, a: a.a }),
  clamp: (a) => ({
    r: clamp(a.r, ColorUtil.min, ColorUtil.max),
    g: clamp(a.g, ColorUtil.min, ColorUtil.max),
    b: clamp(a.b, ColorUtil.min, ColorUtil.max),
    a: clamp(a.a, ColorUtil.min, ColorUtil.max),
  }),
  toArray: (a) =>
    new Float32Array([
      clamp(a.r, ColorUtil.min, ColorUtil.max) / ColorUtil.max,
      clamp(a.g, ColorUtil.min, ColorUtil.max) / ColorUtil.max,
      clamp(a.b, ColorUtil.min, ColorUtil.max) / ColorUtil.max,
      clamp(a.a, ColorUtil.min, ColorUtil.max) / ColorUtil.max,
    ]),
};

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
