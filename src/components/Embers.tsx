import {useEffect, useRef} from 'react';
import {useReducedMotion} from 'framer-motion';

type Ember = {x: number; y: number; r: number; vy: number; phase: number; hue: number; life: number};

/** Warm motes rising from lamplight. Pauses offscreen; absent for reduced motion. */
export function Embers({className = '', density = 1}: {className?: string; density?: number}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduce) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const embers: Ember[] = [];

    const spawn = (anywhere: boolean): Ember => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      r: 0.6 + Math.random() * 1.8,
      vy: 0.18 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
      hue: 28 + Math.random() * 18,
      life: 0.4 + Math.random() * 0.6,
    });

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(70, (w * h) / 26000) * density);
      embers.length = 0;
      for (let i = 0; i < target; i++) embers.push(spawn(true));
    };

    const frame = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.y -= e.vy;
        e.x += Math.sin(t * 0.0006 + e.phase) * 0.25;
        if (e.y < -10) embers[i] = spawn(false);
        const fade = Math.min(1, e.y / (h * 0.35)) * e.life * (0.6 + 0.4 * Math.sin(t * 0.002 + e.phase));
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 5);
        g.addColorStop(0, `hsla(${e.hue}, 95%, 72%, ${fade})`);
        g.addColorStop(1, `hsla(${e.hue}, 95%, 60%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visible) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    });
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    io.observe(canvas);
    resize();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [reduce, density]);

  if (reduce) return null;
  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
