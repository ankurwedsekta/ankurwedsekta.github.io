import {useEffect, useId, useLayoutEffect, useRef, useState} from 'react';
import {useReducedMotion} from 'framer-motion';
import {archPath, JaaliPattern, Rosette} from '../components/ornaments';
import {useGate} from '../lib/gate';
import {gsap, useSmooth} from '../lib/smooth';
import {useElementSize} from '../lib/hooks';
import {couple} from '../content/wedding';

/**
 * Words for the seal's spinning ring. Each word is set upright on its own
 * tangent (rather than via <textPath>) so Devanagari conjuncts and matras stay
 * shaped as a unit instead of being scattered glyph-by-glyph along the curve.
 */
const SEAL_RING = (() => {
  const words = 'मुहर तोड़ें ✦ महल में पधारें ✦ आशीर्वाद दें ✦'.split(' ');
  const weight = (w: string) => (w === '✦' ? 1.2 : w.length) + 1.4;
  const total = words.reduce((s, w) => s + weight(w), 0);
  let acc = 0;
  return words.map((word) => {
    const angle = ((acc + weight(word) / 2) / total) * 360;
    acc += weight(word);
    return {word, angle: Math.round(angle * 10) / 10};
  });
})();

/** One lacquered door leaf. `side` decides the hinge and mirrors the ornament. */
function Leaf({side}: {side: 'left' | 'right'}) {
  const id = useId();
  const [ref, {width, height}] = useElementSize<HTMLDivElement>();
  const w = Math.max(width, 1);
  const h = Math.max(height, 1);
  const studs = Array.from({length: 7}, (_, i) => i);
  return (
    <div
      data-leaf={side}
      className={`absolute inset-y-0 w-1/2 ${side === 'left' ? 'left-0 origin-left' : 'right-0 origin-right'} [backface-visibility:hidden] [transform-style:preserve-3d]`}
      style={{
        background:
          side === 'left'
            ? 'linear-gradient(90deg, #4a0c08 0%, #8c1c14 22%, #a8241b 60%, #7a1710 100%)'
            : 'linear-gradient(270deg, #4a0c08 0%, #8c1c14 22%, #a8241b 60%, #7a1710 100%)',
      }}
    >
      <div className="absolute inset-0 opacity-50 mix-blend-multiply" style={{background: 'radial-gradient(120% 70% at 50% 30%, transparent 40%, #2a0604 100%)'}} />
      <div className={`absolute inset-y-0 ${side === 'left' ? 'right-0' : 'left-0'} w-[3px] bg-gradient-to-b from-gold/20 via-gold to-gold/20`} />
      <div className="absolute inset-[clamp(14px,2.4vw,34px)] border border-gold/60">
        <div className="absolute inset-[6px] border border-gold/25" />
        <div ref={ref} className="absolute inset-x-[10%] top-[8%] bottom-[30%]">
          {width > 0 && (
            <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="absolute inset-0" aria-hidden="true">
              <defs>
                <JaaliPattern id={`${id}j`} stroke="#d4ad66" size={Math.max(22, w / 7)} sw={0.9} />
                <linearGradient id={`${id}glow`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffcf7a" stopOpacity="0.18" />
                  <stop offset="1" stopColor="#ffcf7a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={archPath(w, h, {cusps: 5, maxRise: 0.42})} fill="#3b0906" />
              <path d={archPath(w, h, {cusps: 5, maxRise: 0.42})} fill={`url(#${id}j)`} opacity="0.75" />
              <path d={archPath(w, h, {cusps: 5, maxRise: 0.42})} fill={`url(#${id}glow)`} />
              <path d={archPath(w, h, {cusps: 5, maxRise: 0.42})} fill="none" stroke="#d4ad66" strokeWidth="1.6" />
              <path d={archPath(w - 16, h - 8, {cusps: 5, maxRise: 0.42, x: 8, y: 8})} fill="none" stroke="#d4ad66" strokeWidth="0.6" opacity="0.6" />
            </svg>
          )}
        </div>
        <div className="absolute inset-x-[14%] bottom-[7%] h-[17%] border border-gold/40">
          <div className="absolute inset-0 grid grid-cols-7 place-items-center px-[6%]">
            {studs.map((i) => (
              <span key={i} className="size-[clamp(6px,0.9vw,12px)] rounded-full shadow-[inset_-1px_-2px_2px_rgb(0_0_0/0.45),0_1px_1px_rgb(255_230_170/0.25)]" style={{background: 'radial-gradient(circle at 35% 30%, #fff1c4, #c99a4c 45%, #6b4a1e)'}} />
            ))}
          </div>
        </div>
      </div>
      <Rosette
        className={`absolute top-[46%] size-[clamp(70px,11vw,150px)] -translate-y-1/2 text-gold ${side === 'left' ? 'right-[12%]' : 'left-[12%]'}`}
        sw={1}
        fills={{outer: 'rgb(212 173 102 / 0.12)', core: '#8c1c14'}}
      />
      <span
        aria-hidden="true"
        className={`absolute top-[62%] h-[clamp(60px,9vw,110px)] w-[clamp(10px,1.2vw,16px)] rounded-full ${side === 'left' ? 'right-[5%]' : 'left-[5%]'}`}
        style={{background: 'linear-gradient(90deg, #6b4a1e, #f1d58f 45%, #8a6024)', boxShadow: '0 6px 14px rgb(0 0 0 / 0.5)'}}
      />
    </div>
  );
}

export function Gateway() {
  const {opened, open} = useGate();
  const [gone, setGone] = useState(opened);
  const [busy, setBusy] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const seal = useRef<HTMLButtonElement>(null);
  const smooth = useSmooth();
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    if (gone) return;
    smooth.lock();
    seal.current?.focus({preventScroll: true});
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.from('[data-gate-intro]', {opacity: 0, y: 18, duration: 1.4, ease: 'power3.out', stagger: 0.12, delay: 0.2});
      gsap.from('[data-gate-seal]', {scale: 0.6, opacity: 0, duration: 1.6, ease: 'elastic.out(1, 0.6)', delay: 0.5});
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (opened && !gone && !busy) setGone(true);
  }, [opened, gone, busy]);

  const finish = () => {
    setGone(true);
    smooth.unlock();
    requestAnimationFrame(() => document.getElementById('hero-title')?.focus({preventScroll: true}));
  };

  const enter = () => {
    if (busy) return;
    setBusy(true);
    if (reduce) {
      open();
      gsap.to(root.current, {opacity: 0, duration: 0.4, onComplete: finish});
      return;
    }
    const tl = gsap.timeline({defaults: {ease: 'power3.inOut'}, onComplete: finish});
    tl.to('[data-gate-intro]', {opacity: 0, y: -12, duration: 0.5, stagger: 0.04}, 0)
      .to('[data-gate-seal]', {scale: 1.18, duration: 0.35, ease: 'power2.out'}, 0)
      .to('[data-gate-seal]', {scale: 0.2, opacity: 0, rotate: 40, duration: 0.55, ease: 'power3.in'}, 0.35)
      .to('[data-gate-crack]', {opacity: 1, scaleX: 1, duration: 0.6, ease: 'power2.out'}, 0.6)
      .to('[data-leaf="left"]', {rotateY: 108, duration: 2.1, ease: 'power3.inOut'}, 0.85)
      .to('[data-leaf="right"]', {rotateY: -108, duration: 2.1, ease: 'power3.inOut'}, 0.85)
      .to('[data-gate-shade]', {opacity: 0, duration: 1.6}, 1)
      .call(open, [], 1.35)
      .to(root.current, {opacity: 0, duration: 0.7, ease: 'power1.out'}, 2.45);
  };

  if (gone) return null;

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      aria-describedby="gate-desc"
      className="fixed inset-0 z-[80] overflow-hidden [perspective:2200px]"
      onKeyDown={(e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          seal.current?.focus();
        }
      }}
    >
      <div data-gate-shade className="absolute inset-0 bg-ink" />
      <div
        data-gate-crack
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 w-[46vw] -translate-x-1/2 opacity-0"
        style={{transform: 'scaleX(0)', background: 'radial-gradient(50% 60% at 50% 50%, rgb(255 214 140 / 0.9), rgb(228 155 52 / 0.35) 45%, transparent 75%)'}}
      />
      <Leaf side="left" />
      <Leaf side="right" />

      <div className="pointer-events-none absolute inset-x-0 top-[clamp(36px,7vh,80px)] z-10 flex flex-col items-center gap-3 px-6 text-center">
        <p data-gate-intro lang="sa" className="font-deva-display text-[clamp(1.05rem,1.5vw,1.35rem)] text-haldi [text-shadow:0_2px_10px_rgb(0_0_0/0.55)]">॥ श्री गणेशाय नमः ॥</p>
        <h2 id="gate-title" data-gate-intro lang="hi" className="shloka text-[clamp(2.6rem,5vw,4.4rem)] leading-tight text-gold-pale [text-shadow:0_3px_18px_rgb(30_4_2/0.7)]">
          सादर आमंत्रण
        </h2>
      </div>

      <div className="absolute left-1/2 top-[46%] z-10 -translate-x-1/2 -translate-y-1/2">
        <button
          ref={seal}
          data-gate-seal
          type="button"
          onClick={enter}
          className="group relative grid size-[clamp(150px,19vw,224px)] place-items-center rounded-full outline-offset-8"
          aria-label={`Break the seal and enter the wedding of ${couple.groom} and ${couple.bride}`}
        >
          <span className="absolute inset-0 rounded-full shadow-[0_18px_40px_rgb(0_0_0/0.55)]" style={{background: 'radial-gradient(circle at 38% 32%, #e3524a, #a8241b 42%, #5c100c 80%)'}} />
          <span className="absolute inset-[7%] rounded-full border border-[#f2b2a2]/25" />
          <svg viewBox="-100 -100 200 200" className="anim-spin absolute inset-0 size-full text-gold-pale" aria-hidden="true" style={{animationDuration: '40s'}}>
            {SEAL_RING.map(({word, angle}) => (
              <text
                key={angle}
                transform={`rotate(${angle}) translate(0 -73)`}
                fontSize={word === '✦' ? 10 : 15}
                fontWeight={600}
                fill="currentColor"
                className="font-deva"
                lang="hi"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {word}
              </text>
            ))}
          </svg>
          <span className="relative flex items-baseline font-names text-[clamp(3.2rem,5.4vw,4.9rem)] leading-none text-[#f8e7b8] [text-shadow:0_2px_0_rgb(92_16_12/0.9),0_4px_16px_rgb(40_6_4/0.75)] transition-transform duration-700 ease-[var(--ease-royal)] group-hover:scale-110">
            A<span className="mx-[0.05em] font-display text-[0.5em] font-light italic text-haldi">&amp;</span>E
          </span>
        </button>
      </div>

      <div id="gate-desc" data-gate-intro className="pointer-events-none absolute inset-x-0 bottom-[clamp(28px,6vh,64px)] z-10 flex flex-col items-center gap-1 px-6 text-center [text-shadow:0_2px_12px_rgb(30_4_2/0.7)]">
        <p className="font-names text-[clamp(2.4rem,3.6vw,3.2rem)] leading-tight text-gold-pale">
          Ankur <span className="font-display text-[0.6em] font-light italic text-haldi">&amp;</span> Ekta
        </p>
        <p className="font-display text-[clamp(1.1rem,1.4vw,1.3rem)] text-ivory/90">
          20 – 21 November 2026 <span className="text-haldi">·</span> <span className="italic">Tap the seal to enter</span>
        </p>
      </div>
    </div>
  );
}
