export type Sprite = {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
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
