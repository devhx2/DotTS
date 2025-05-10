type Sprite = {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  texture: WebGLTexture;
  buffer: WebGLBuffer;
};

type Config = {
  canvas: {
    id: string;
    width: number;
    height: number;
    scale: number;
  };
  fps: number;
};

const config: Config = {
  canvas: {
    id: "game-screen",
    width: 640,
    height: 480,
    scale: 4,
  },
  fps: 30,
};

main(config);

function main(config: Config) {
  const canvas = document.getElementById(config.canvas.id) as HTMLCanvasElement;
  const ctx = canvas.getContext("webgl") as WebGLRenderingContext;
  if (!ctx) alert("Not Supported WebGL!");

  canvas.width = config.canvas.width;
  canvas.height = config.canvas.height;

  ctx.viewport(0, 0, canvas.width, canvas.height);
  ctx.enable(ctx.BLEND);
  ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);

  Promise.all([
    loadShaderSource("../shader/sprite.vert"),
    loadShaderSource("../shader/sprite.frag"),
  ]).then(([vsSource, fsSource]) => {
    const vertexShader = createShader(ctx, ctx.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(ctx, ctx.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) {
      console.error("failed to create shader");
      return;
    }
    const program = ctx.createProgram();
    ctx.attachShader(program, vertexShader);
    ctx.attachShader(program, fragmentShader);
    ctx.linkProgram(program);
    ctx.useProgram(program);

    const aPosition = ctx.getAttribLocation(program, "aPosition");
    const aTexCoord = ctx.getAttribLocation(program, "aTexCoord");
    const uScale = ctx.getUniformLocation(program, "uScale");
    const uOffset = ctx.getUniformLocation(program, "uOffset");
    const uCanvasSize = ctx.getUniformLocation(program, "uCanvasSize");

    ctx.uniform2f(uCanvasSize, canvas.width, canvas.height);

    const spriteCount = 1;
    const sprites: Sprite[] = [];

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

      const buffer = ctx.createBuffer();
      ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
      ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.STATIC_DRAW);

      const width = canvas.width / config.canvas.scale;
      const speed = Math.round(width / (config.fps * 8));

      const sprite = {
        x: 0,
        y: 0,
        speedX: speed,
        speedY: speed,
        texture: loadTexture(ctx, `../texture/sample_16x16.png`),
        buffer: buffer,
      };
      sprites.push(sprite);
    }

    const interval = 1000 / config.fps;
    let lastTime = 0;

    function loop(currentTime: number) {
      if (currentTime - lastTime >= interval) {
        update(canvas, sprites);
        render(ctx, aPosition, aTexCoord, uOffset!, uScale!, sprites);
        lastTime = currentTime;
      }
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  });
}

async function loadShaderSource(url: string) {
  const res = await fetch(url);
  return await res.text();
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    console.error("failed to crete shader");
    return;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function loadTexture(gl: WebGLRenderingContext, src: string) {
  const texture = gl.createTexture();
  const image = new Image();
  image.src = src;
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  };
  return texture;
}

function update(canvas: HTMLCanvasElement, sprites: Sprite[]) {
  for (const sprite of sprites) {
    sprite.x += sprite.speedX;
    sprite.y += sprite.speedY;

    sprite.x = Math.round(sprite.x);
    sprite.y = Math.round(sprite.y);

    if (sprite.x < 0 || sprite.x > canvas.width / 4 - 16) sprite.speedX *= -1;
    if (sprite.y < 0 || sprite.y > canvas.height / 4 - 16) sprite.speedY *= -1;
  }
}

function render(
  ctx: WebGLRenderingContext,
  aPosition: number,
  aTexCoord: number,
  uOffset: WebGLUniformLocation,
  uScale: WebGLUniformLocation,
  sprites: Sprite[]
) {
  ctx.clearColor(51 / 255, 187 / 255, 51 / 255, 1.0);
  ctx.clear(ctx.COLOR_BUFFER_BIT);

  for (const sprite of sprites) {
    ctx.bindTexture(ctx.TEXTURE_2D, sprite.texture);
    ctx.bindBuffer(ctx.ARRAY_BUFFER, sprite.buffer);

    ctx.enableVertexAttribArray(aPosition);
    ctx.vertexAttribPointer(aPosition, 2, ctx.FLOAT, false, 16, 0);

    ctx.enableVertexAttribArray(aTexCoord);
    ctx.vertexAttribPointer(aTexCoord, 2, ctx.FLOAT, false, 16, 8);

    const x = Math.round(sprite.x);
    const y = Math.round(sprite.y);

    ctx.uniform2f(uOffset, x, y);
    ctx.uniform1f(uScale, config.canvas.scale);
    ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
  }
}
