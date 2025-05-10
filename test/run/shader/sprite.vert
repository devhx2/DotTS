attribute vec2 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;
uniform vec2 uOffset;
uniform vec2 uCanvasSize;

void main() {
  vec2 pos = aPosition + uOffset;
  vec2 clipPos = (pos / uCanvasSize) * 2.0 - 1.0;
  gl_Position = vec4(clipPos, 0.0, 1.0);
  vTexCoord = aTexCoord;
}
