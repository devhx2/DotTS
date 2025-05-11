import { TexturePool } from "./resources/texture";
import { ColorUtil, Config, Sprite, VectorUtil } from "./types";

export class DotTS {
  #sprites: Sprite[] = [];
  #config: Config;
  #ctx: WebGLRenderingContext;
  #textures: TexturePool;
  #aPosition!: number;
  #aTexCoord!: number;
  #uScale!: WebGLUniformLocation;
  #uColor!: WebGLUniformLocation;
  #uOffset!: WebGLUniformLocation;

  constructor(config: Config) {
    this.#config = config;

    const canvas = document.getElementById(
      config.canvas.id
    ) as HTMLCanvasElement;

    this.#ctx = canvas.getContext("webgl") as WebGLRenderingContext;
    if (!this.#ctx) alert("Not Supported WebGL!");

    this.#textures = new TexturePool();

    canvas.width = config.canvas.width;
    canvas.height = config.canvas.height;

    this.#ctx.viewport(0, 0, canvas.width, canvas.height);
    this.#ctx.enable(this.#ctx.BLEND);
    this.#ctx.blendFunc(this.#ctx.SRC_ALPHA, this.#ctx.ONE_MINUS_SRC_ALPHA);

    Promise.all([
      this.#loadShaderSource("../shader/sprite.vert"),
      this.#loadShaderSource("../shader/sprite.frag"),
      this.#textures.load(this.#ctx, "../texture/sample_16x16.png"),
    ]).then(([vsSource, fsSource]) => {
      const vertexShader = this.#createShader(
        this.#ctx,
        this.#ctx.VERTEX_SHADER,
        vsSource
      );
      const fragmentShader = this.#createShader(
        this.#ctx,
        this.#ctx.FRAGMENT_SHADER,
        fsSource
      );

      if (!vertexShader || !fragmentShader) {
        console.error("failed to create shader");
        return;
      }

      const program = this.#ctx.createProgram();
      this.#ctx.attachShader(program, vertexShader);
      this.#ctx.attachShader(program, fragmentShader);
      this.#ctx.linkProgram(program);
      this.#ctx.useProgram(program);

      this.#aPosition = this.#ctx.getAttribLocation(program, "aPosition");
      this.#aTexCoord = this.#ctx.getAttribLocation(program, "aTexCoord");
      this.#uScale = this.#ctx.getUniformLocation(program, "uScale")!;
      this.#uColor = this.#ctx.getUniformLocation(program, "uColor")!;
      this.#uOffset = this.#ctx.getUniformLocation(program, "uOffset")!;
      const uCanvasSize = this.#ctx.getUniformLocation(program, "uCanvasSize");

      this.#ctx.uniform2f(uCanvasSize, canvas.width, canvas.height);

      const spriteCount = 1;

      for (let i = 0; i < spriteCount; i++) {
        const w = 16;
        const h = 16;

        const vertices = new Float32Array([
          0,
          0,
          0,
          0,
          w,
          0,
          1,
          0,
          0,
          h,
          0,
          1,
          w,
          h,
          1,
          1,
        ]);

        const buffer = this.#ctx.createBuffer();
        this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, buffer);
        this.#ctx.bufferData(
          this.#ctx.ARRAY_BUFFER,
          vertices,
          this.#ctx.STATIC_DRAW
        );

        const width = canvas.width / config.canvas.scale;
        const speed = Math.round(width / (config.fps * 8));

        const sprite: Sprite = {
          position: { x: 0, y: 0 },
          color: { r: 255, g: 255, b: 255, a: 255 },
          speed: { x: speed, y: speed },
          textureID: "../texture/sample_16x16.png",
          buffer: buffer,
        };

        this.#sprites.push(sprite);
      }
    });
  }

  async #loadShaderSource(url: string): Promise<string> {
    const res = await fetch(url);
    return await res.text();
  }

  #createShader(
    ctx: WebGLRenderingContext,
    type: number,
    source: string
  ): WebGLShader | null {
    const shader = ctx.createShader(type);
    if (!shader) {
      console.error("failed to crete shader");
      return null;
    }
    ctx.shaderSource(shader, source);
    ctx.compileShader(shader);
    if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
      console.error(ctx.getShaderInfoLog(shader));
      ctx.deleteShader(shader);
      return null;
    }
    return shader;
  }

  #update() {
    for (const sprite of this.#sprites) {
      sprite.position = VectorUtil.add(sprite.position, sprite.speed);

      if (
        sprite.position.x < 0 ||
        sprite.position.x > this.#config.canvas.width / 4 - 16
      )
        sprite.speed.x *= -1;
      if (
        sprite.position.y < 0 ||
        sprite.position.y > this.#config.canvas.height / 4 - 16
      )
        sprite.speed.y *= -1;
    }
  }

  #render() {
    this.#ctx.clearColor(51 / 255, 187 / 255, 51 / 255, 1.0);
    this.#ctx.clear(this.#ctx.COLOR_BUFFER_BIT);

    for (const sprite of this.#sprites) {
      this.#ctx.bindTexture(
        this.#ctx.TEXTURE_2D,
        this.#textures.get(sprite.textureID)!
      );
      this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, sprite.buffer);

      this.#ctx.enableVertexAttribArray(this.#aPosition);
      this.#ctx.vertexAttribPointer(
        this.#aPosition,
        2,
        this.#ctx.FLOAT,
        false,
        16,
        0
      );

      this.#ctx.enableVertexAttribArray(this.#aTexCoord);
      this.#ctx.vertexAttribPointer(
        this.#aTexCoord,
        2,
        this.#ctx.FLOAT,
        false,
        16,
        8
      );

      sprite.position = VectorUtil.round(sprite.position);

      this.#ctx.uniform4fv(this.#uColor, ColorUtil.toArray(sprite.color));
      this.#ctx.uniform2fv(this.#uOffset, VectorUtil.toArray(sprite.position));
      this.#ctx.uniform1f(this.#uScale, this.#config.canvas.scale);
      this.#ctx.drawArrays(this.#ctx.TRIANGLE_STRIP, 0, 4);
    }
  }

  run(): void {
    const interval = 1000 / this.#config.fps;
    let lastTime = 0;

    const loop = (currentTime: number) => {
      if (currentTime - lastTime >= interval) {
        this.#update();
        this.#render();
        lastTime = currentTime;
      }
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}
