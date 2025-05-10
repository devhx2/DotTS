attribute vec2 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

uniform float uScale;
uniform vec2 uOffset;
uniform vec2 uCanvasSize;

void main() {
  vec2 pos = (aPosition + uOffset) * uScale;

  vec2 zeroToOne = pos / uCanvasSize;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace.x, -clipSpace.y, 0, 1);
  vTexCoord = aTexCoord;
}
