export class ShaderPool {
  readonly #ctx: WebGLRenderingContext;
  readonly #shaders: Map<string, WebGLShader>;

  constructor(ctx: WebGLRenderingContext) {
    this.#ctx = ctx;
    this.#shaders = new Map();
  }

  async load(src: string): Promise<void>;
  async load(src: string[]): Promise<void>;
  async load(src: string | string[]): Promise<void> {
    const ctx = this.#ctx;

    if (Array.isArray(src)) {
      await Promise.all(src.map((s) => this.load(s)));
      return;
    }

    return new Promise(async (resolve, reject) => {
      const type = src.endsWith(".vert")
        ? ctx.VERTEX_SHADER
        : src.endsWith(".frag")
        ? ctx.FRAGMENT_SHADER
        : undefined;

      if (!type) {
        console.error("extension error");
        reject();
      }

      const shader = ctx.createShader(type!);
      if (!shader) {
        console.error("failed to crete shader");
        reject();
      }

      const source = await (await fetch(src)).text();
      ctx.shaderSource(shader!, source);
      ctx.compileShader(shader!);
      if (!ctx.getShaderParameter(shader!, ctx.COMPILE_STATUS)) {
        console.error(ctx.getShaderInfoLog(shader!));
        ctx.deleteShader(shader);
        reject();
      }

      this.#shaders.set(src, shader!);
      resolve();
    });
  }

  get(id: string): WebGLTexture | undefined {
    return this.#shaders.get(id);
  }
}
