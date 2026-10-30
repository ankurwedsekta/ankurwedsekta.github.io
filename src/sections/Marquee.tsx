import {useLayoutEffect, useRef} from 'react';
import {ScallopEdge} from '../components/ornaments';
import {gsap} from '../lib/smooth';
import {ceremonies} from '../content/wedding';

const Row = ({italic}: {italic?: boolean}) => (
  <div className="flex shrink-0 items-center">
    {[0, 1].map((k) =>
      ceremonies.map((c) => (
        <span key={`${k}${c.id}`} className="flex items-center">
          <span
            lang={italic ? 'hi' : undefined}
            className={`whitespace-nowrap px-[0.35em] ${italic ? 'shloka text-[clamp(3rem,8vw,7.6rem)] leading-[1.35] text-haldi' : 'display text-[clamp(3.6rem,10vw,9.5rem)] leading-[1.05] text-ivory'}`}
          >
            {italic ? c.devanagari : c.name}
          </span>
          <svg viewBox="-10 -10 20 20" className="size-[clamp(18px,2.4vw,34px)] text-gold" aria-hidden="true">
            <path d="M0 -9L2.6 -2.6L9 0L2.6 2.6L0 9L-2.6 2.6L-9 0L-2.6 -2.6Z" fill="currentColor" />
          </svg>
        </span>
      )),
    )}
  </div>
);

export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const opts = {ease: 'none', scrollTrigger: {trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.6}};
        gsap.fromTo('[data-row="a"]', {xPercent: 0}, {xPercent: -32, ...opts});
        gsap.fromTo('[data-row="b"]', {xPercent: -36}, {xPercent: -4, ...opts});
        gsap.fromTo('[data-band]', {rotate: -2.2}, {rotate: 1.2, ...opts});
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="relative z-10 overflow-hidden bg-[linear-gradient(to_bottom,var(--color-chalk)_50%,var(--color-ink)_50%)] py-14">
      <div data-band className="relative -mx-[6vw] origin-center">
        <ScallopEdge color="#a8241b" flip size={30} />
        <div className="bg-sindoor py-[clamp(1rem,2.4vw,2rem)] shadow-[0_30px_60px_-20px_rgb(21_14_10/0.6)]">
          <div className="border-y border-gold/40 py-2">
            <div data-row="a" className="flex w-max">
              <Row />
            </div>
            <div className="hidden h-px bg-gold/25 md:block" />
            <div data-row="b" className="hidden w-max md:flex">
              <Row italic />
            </div>
          </div>
        </div>
        <ScallopEdge color="#a8241b" size={30} />
      </div>
    </div>
  );
}
