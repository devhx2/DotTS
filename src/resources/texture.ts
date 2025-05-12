export class TexturePool {
  readonly #ctx: WebGLRenderingContext;
  readonly #textures: Map<string, WebGLTexture>;

  constructor(ctx: WebGLRenderingContext) {
    this.#ctx = ctx;
    this.#textures = new Map();
  }

  async load(src: string): Promise<void>;
  async load(src: string[]): Promise<void>;
  async load(src: string | string[]): Promise<void> {
    const ctx = this.#ctx;

    if (Array.isArray(src)) {
      await Promise.all(src.map((s) => this.load(s)));
      return;
    }

    return new Promise((resolve, reject) => {
      const texture = ctx.createTexture();
      const image = new Image();
      image.src = src;
      image.onload = () => {
        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        ctx.texImage2D(
          ctx.TEXTURE_2D,
          0,
          ctx.RGBA,
          ctx.RGBA,
          ctx.UNSIGNED_BYTE,
          image
        );
        ctx.texParameteri(
          ctx.TEXTURE_2D,
          ctx.TEXTURE_WRAP_S,
          ctx.CLAMP_TO_EDGE
        );
        ctx.texParameteri(
          ctx.TEXTURE_2D,
          ctx.TEXTURE_WRAP_T,
          ctx.CLAMP_TO_EDGE
        );
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
        this.#textures.set(src, texture!);
        resolve();
      };
      image.onerror = reject;
    });
  }

  get(id: string): WebGLTexture | undefined {
    return this.#textures.get(id);
  }
}
