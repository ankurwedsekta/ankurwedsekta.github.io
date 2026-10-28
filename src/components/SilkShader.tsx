import {useEffect, useRef, useState} from 'react';
import {useReducedMotion} from 'framer-motion';

const vertex = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// Domain-warped noise folded into silk: sindoor lacquer, rani sheen and marigold highlights.
const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
void main(){
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.04;
  vec2 q = vec2(fbm(p * 1.3 + vec2(0.0, t)), fbm(p * 1.3 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p * 1.5 + 2.4 * q + vec2(1.7, 9.2) + t * 0.6), fbm(p * 1.5 + 2.4 * q + vec2(8.3, 2.8) - t * 0.4));
  float f = fbm(p * 1.1 + 2.6 * r);

  float folds = sin((p.x * 1.8 + p.y * 1.1 + f * 3.4 + r.x * 2.2) * 3.14159);
  float sheen = smoothstep(0.5, 1.0, folds);
  float crease = smoothstep(-0.95, -0.55, folds) * (1.0 - smoothstep(-0.55, -0.1, folds));

  vec3 ink  = vec3(0.075, 0.035, 0.028);
  vec3 deep = vec3(0.33, 0.045, 0.04);
  vec3 sind = vec3(0.62, 0.11, 0.08);
  vec3 rani = vec3(0.66, 0.15, 0.34);
  vec3 mari = vec3(0.96, 0.64, 0.26);

  vec3 col = mix(ink, deep, smoothstep(0.1, 0.52, f));
  col = mix(col, sind, smoothstep(0.38, 0.82, f + q.x * 0.28) * 0.92);
  col = mix(col, rani, smoothstep(0.5, 0.9, r.y) * 0.55);
  col += mari * sheen * 0.3 * smoothstep(0.3, 0.85, f);
  col -= crease * 0.05;

  vec2 m = (uMouse - 0.5 * uRes) / uRes.y;
  col += vec3(0.98, 0.66, 0.32) * exp(-3.2 * length(p - m)) * 0.13;

  float v = smoothstep(1.35, 0.15, length(p * vec2(0.85, 1.15)));
  col *= mix(0.4, 1.08, v);
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
  return s;
}

/** Full-bleed living silk. Renders at reduced resolution — it is soft by nature. */
export function SilkShader({className = ''}: {className?: string}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', {antialias: false, alpha: false, powerPreference: 'low-power'});
    if (!gl) {
      setFailed(true);
      return;
    }
    let program: WebGLProgram;
    try {
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      gl.useProgram(program);
    } catch {
      setFailed(true);
      return;
    }
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(program, 'uRes');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uMouse = gl.getUniformLocation(program, 'uMouse');

    const scale = 0.55 * Math.min(window.devicePixelRatio || 1, 1.6);
    const mouse = {x: 0, y: 0, tx: 0, ty: 0};
    let raf = 0;
    let visible = true;
    const start = performance.now() - 40000;

    const resize = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      mouse.tx = mouse.x = canvas.width * 0.62;
      mouse.ty = mouse.y = canvas.height * 0.58;
    };
    const draw = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      draw(now);
      if (visible) raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) * scale;
      mouse.ty = (r.height - (e.clientY - r.top)) * scale;
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(performance.now());
    });
    ro.observe(canvas);
    let io: IntersectionObserver | undefined;
    if (reduce) {
      draw(performance.now());
    } else {
      window.addEventListener('pointermove', onMove, {passive: true});
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(loop);
      });
      io.observe(canvas);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      window.removeEventListener('pointermove', onMove);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [reduce]);

  return (
    <div className={className} aria-hidden="true">
      {failed ? (
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_62%_42%,#a8241b_0%,#5c100c_38%,#150e0a_78%)]" />
      ) : (
        <canvas ref={ref} className="h-full w-full" />
      )}
    </div>
  );
}
