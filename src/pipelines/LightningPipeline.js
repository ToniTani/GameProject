import Phaser from 'phaser';

export default class LightningPipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
  constructor(game) {
    super({
      game,
      renderer: game.renderer,
      fragShader: `
        precision mediump float;

        uniform vec2  iResolution;
        uniform float iTime;
        uniform float uHue;
        uniform float uXOffset;
        uniform float uSpeed;
        uniform float uIntensity;
        uniform float uSize;

        #define OCTAVES 10

        // 1) Hash a single float to [0,1]
        float hash11(float p) {
          p = fract(p * 0.1031);
          p *= p + 33.33;
          p *= p + p;
          return fract(p);
        }

        // 2) Hash a vec2 to [0,1]
        float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.x, p.y, p.x) * 0.1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
        }

        // 3) 2D rotation matrix
        mat2 rotate2d(float a) {
          float c = cos(a);
          float s = sin(a);
          return mat2(c, -s, s, c);
        }

        // 4) Simple gradient noise
        float noise(vec2 x) {
          vec2 i = floor(x);
          vec2 f = fract(x);
          float a = hash12(i);
          float b = hash12(i + vec2(1.0, 0.0));
          float c = hash12(i + vec2(0.0, 1.0));
          float d = hash12(i + vec2(1.0, 1.0));
          vec2 u = f*f*(3.0 - 2.0*f);
          return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
        }

        // 5) Fractal Brownian Motion
        float fbm(vec2 x) {
          float v = 0.0;
          float w = 0.5;
          for (int i = 0; i < OCTAVES; i++) {
            v += w * noise(x);
            x = rotate2d(0.45) * x * 2.0;
            w *= 0.5;
          }
          return v;
        }

        // 6) HSV → RGB conversion
        vec3 hsv2rgb(vec3 c) {
          vec3 p = abs(fract(c.x * 6.0 + vec3(0.0,4.0,2.0)) * 2.0 - 1.0);
          vec3 rgb = c.z * mix(vec3(1.0), clamp(p,0.0,1.0), c.y);
          return rgb;
        }

        // 7) Main lightning effect, based on iTime, uv, fbm, etc.
        void mainImage(out vec4 fragColor, in vec2 fragCoord) {
          vec2 uv = fragCoord / iResolution;
          uv = 2.0 * uv - 1.0;
          uv.x *= iResolution.x / iResolution.y;
          uv.x += uXOffset;
          uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
          float dist = abs(uv.x);
          vec3 base = hsv2rgb(vec3(uHue/360.0, 1.0, 1.0));
          float strength = pow(mix(0.0,0.07, hash11(iTime*uSpeed)) / abs(uv.x), 1.0);
          vec3 col = base * strength * uIntensity;
          fragColor = vec4(col, 1.0);
        }

        // 8) Standard entry point
        void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
        }
      `
    });
  }

  onPreRender() {
    // update uniforms every frame
    this.set1f('iTime',   this.game.loop.time * 0.001);
    this.set2f('iResolution',
      this.game.scale.width,
      this.game.scale.height
    );
    // tweak these or expose setters on the pipeline:
    this.set1f('uHue',       220.0);
    this.set1f('uXOffset',   0.0);
    this.set1f('uSpeed',     1.0);
    this.set1f('uIntensity', 1.0);
    this.set1f('uSize',      1.0);
  }
}