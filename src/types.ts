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

type IntegerOperations<T> = {
  round(a: T): T;
  floor(a: T): T;
  ceil(a: T): T;
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

type VectorFunctions = MathOperations<Vector> &
  IntegerOperations<Vector> &
  CompareOperations<Vector> &
  CloneOperation<Vector> &
  VectorDirections &
  VectorOperations;

export const VectorUtil: VectorFunctions = {
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
// Other
// ------------------------------------------------------------

export type Sprite = {
  position: Vector;
  speed: Vector;
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
