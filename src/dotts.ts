import { ShaderPool } from "./resources/shader";
import { TexturePool } from "./resources/texture";
import { Color, Config, Sprite, Vector } from "./types";

export class DotTS {
  #sprites: Sprite[] = [];
  #config: Config;

  #ctx: WebGLRenderingContext;
  #textures: TexturePool;
  #shaders: ShaderPool;

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

    this.#textures = new TexturePool(this.#ctx);
    this.#shaders = new ShaderPool(this.#ctx);

    canvas.width = config.canvas.width;
    canvas.height = config.canvas.height;

    this.#ctx.viewport(0, 0, canvas.width, canvas.height);
    this.#ctx.enable(this.#ctx.BLEND);
    this.#ctx.blendFunc(this.#ctx.SRC_ALPHA, this.#ctx.ONE_MINUS_SRC_ALPHA);

    Promise.all([
      this.#shaders.load(["../shader/sprite.vert", "../shader/sprite.frag"]),
      this.#textures.load("../texture/sample_16x16.png"),
    ]).then(() => {
      const program = this.#ctx.createProgram();
      this.#ctx.attachShader(
        program,
        this.#shaders.get("../shader/sprite.vert")!
      );
      this.#ctx.attachShader(
        program,
        this.#shaders.get("../shader/sprite.frag")!
      );
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
        const speed = Math.round(width / (config.fps * 10));

        const sprite: Sprite = {
          position: new Vector(0, 0),
          color: new Color(255, 255, 255, 255),
          speed: new Vector(speed, speed),
          textureID: "../texture/sample_16x16.png",
          buffer: buffer,
        };

        this.#sprites.push(sprite);
      }
    });
  }

  #update() {
    for (const sprite of this.#sprites) {
      sprite.position.add(sprite.speed);

      if (
        sprite.position.x < 0 ||
        sprite.position.x >
          this.#config.canvas.width / this.#config.canvas.scale - 16
      )
        sprite.speed.x *= -1;
      if (
        sprite.position.y < 0 ||
        sprite.position.y >
          this.#config.canvas.height / this.#config.canvas.scale - 16
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

      sprite.position.round();

      this.#ctx.uniform4fv(this.#uColor, sprite.color.toFloatArray());
      this.#ctx.uniform2fv(this.#uOffset, sprite.position.toArray());
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
