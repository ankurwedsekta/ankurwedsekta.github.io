import {useId, useLayoutEffect, useRef} from 'react';
import {gsap} from '../lib/smooth';
import {JaaliPattern} from './ornaments';

const ROUTE = 'M40 520C140 500 170 430 250 420S380 452 430 388S470 250 560 236S640 238 668 196';

function Tree({x, y, s = 1}: {x: number; y: number; s?: number}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-8" stroke="#6b4a1e" strokeWidth="1.6" />
      <circle cy="-15" r="9" fill="#5f8a55" />
      <circle cx="-5" cy="-12" r="6" fill="#4e7a46" />
      <circle cx="5" cy="-18" r="5" fill="#76a067" />
    </g>
  );
}

/** Hand-painted wayfinding map. Purely illustrative — the live map carries the real pin. */
export function PalaceMap() {
  const id = useId();
  const root = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const reveal = svg.querySelector<SVGPathElement>('[data-route-mask]')!;
        const len = reveal.getTotalLength();
        gsap.set(reveal, {strokeDasharray: len, strokeDashoffset: len});
        gsap.set('[data-pin]', {y: -90, opacity: 0});
        gsap.set('[data-ripple]', {opacity: 0});
        const tl = gsap.timeline({scrollTrigger: {trigger: svg, start: 'top 75%', once: true}});
        tl.to(reveal, {strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut'})
          .to('[data-pin]', {y: 0, opacity: 1, duration: 0.9, ease: 'bounce.out'}, '-=0.4')
          .to('[data-ripple]', {opacity: 1, duration: 0.3}, '-=0.2')
          .from('[data-label]', {opacity: 0, y: 8, duration: 0.8, stagger: 0.08, ease: 'power2.out'}, 0.4);
      });
    }, svg);
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={root} viewBox="0 0 800 620" className="h-auto w-full" role="img" aria-label="Illustrated map showing the route to Orriva (Awadh Palace), Rajnagar Extension, Ghaziabad. Illustrative, not to scale.">
      <defs>
        <JaaliPattern id={`${id}j`} stroke="#c9a35e" size={40} sw={0.4} />
        <radialGradient id={`${id}v`} cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#5c3a12" stopOpacity="0.28" />
        </radialGradient>
        <mask id={`${id}m`}>
          <path data-route-mask d={ROUTE} stroke="#fff" strokeWidth="14" fill="none" strokeLinecap="round" />
        </mask>
      </defs>

      <rect width="800" height="620" fill="#efe2c4" />
      <rect width="800" height="620" fill={`url(#${id}j)`} opacity="0.35" />

      <g fill="#e2d3ad" stroke="#c9b588" strokeWidth="0.8">
        <path d="M90 60H260V170H90Z" />
        <path d="M300 300H420V360H300Z" />
        <path d="M520 400H700V540H520Z" />
        <path d="M600 40H760V140H600Z" />
      </g>
      <g stroke="#c9b588" strokeWidth="0.6" opacity="0.8">
        {Array.from({length: 9}, (_, i) => <path key={i} d={`M${90 + i * 21} 60V170`} />)}
        {Array.from({length: 10}, (_, i) => <path key={i} d={`M520 ${400 + i * 15}H700`} />)}
      </g>

      <path d="M-20 300C80 260 120 140 230 120S330 40 420 -20" stroke="#8bb5b0" strokeWidth="34" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M-20 300C80 260 120 140 230 120S330 40 420 -20" stroke="#b9d4cd" strokeWidth="3" strokeDasharray="10 14" fill="none" />
      <text data-label x="96" y="214" transform="rotate(-38 96 214)" className="font-display" fontStyle="italic" fontSize="17" fill="#3c6e72">River Hindon</text>

      <g fill="none" strokeLinecap="round">
        <path d="M-10 470C200 450 420 470 820 380" stroke="#d7c49b" strokeWidth="22" />
        <path d="M-10 470C200 450 420 470 820 380" stroke="#fbf4e3" strokeWidth="2" strokeDasharray="14 12" />
        <path d="M470 640C470 500 520 340 560 236S600 60 640 -20" stroke="#d7c49b" strokeWidth="14" />
      </g>
      <text data-label x="34" y="454" fontSize="11" letterSpacing="3" fill="#7a5a2a" className="font-sans uppercase">← To Delhi</text>
      <text data-label x="690" y="372" fontSize="11" letterSpacing="3" fill="#7a5a2a" className="font-sans uppercase">To Meerut →</text>

      {[[150, 250], [176, 236], [330, 230], [360, 250], [250, 330], [222, 352], [250, 560], [280, 580], [700, 300], [730, 280], [120, 600], [640, 590]].map(([x, y]) => (
        <Tree key={`${x}${y}`} x={x} y={y} s={1.1} />
      ))}

      <path d={ROUTE} stroke="#a8241b" strokeOpacity="0.15" strokeWidth="6" fill="none" strokeLinecap="round" />
      <g mask={`url(#${id}m)`}>
        <path d={ROUTE} stroke="#a8241b" strokeWidth="3.2" strokeDasharray="2 9" fill="none" strokeLinecap="round" />
      </g>
      <circle cx="40" cy="520" r="6" fill="#efe2c4" stroke="#a8241b" strokeWidth="2" />
      <text data-label x="54" y="546" fontSize="11" letterSpacing="3" fill="#a8241b" className="font-sans uppercase">You</text>

      <g transform="translate(668 196)">
        <g data-ripple>
          <circle r="16" fill="none" stroke="#a8241b" strokeWidth="1.5" className="anim-ripple" />
          <circle r="16" fill="none" stroke="#a8241b" strokeWidth="1.5" className="anim-ripple" style={{animationDelay: '1.4s'}} />
        </g>
        <g data-pin>
          <g transform="translate(0 -18)">
            <path d="M-40 0V-34H40V0Z" fill="#f6ead0" stroke="#7a5a2a" strokeWidth="1.2" />
            <path d="M-44 -34H44" stroke="#7a5a2a" strokeWidth="2" />
            <path d="M-18 -34C-18 -58 18 -58 18 -34" fill="#f6ead0" stroke="#7a5a2a" strokeWidth="1.2" />
            <path d="M0 -58V-68" stroke="#7a5a2a" strokeWidth="1.2" />
            <circle cy="-70" r="2.4" fill="#c9a35e" />
            {[-40, 40].map((x) => (
              <g key={x}>
                <path d={`M${x - 7} -34C${x - 7} -48 ${x + 7} -48 ${x + 7} -34`} fill="#f6ead0" stroke="#7a5a2a" strokeWidth="1.2" />
                <path d={`M${x} -48V-54`} stroke="#7a5a2a" strokeWidth="1" />
              </g>
            ))}
            {[-26, -9, 9, 26].map((x) => <path key={x} d={`M${x - 4} 0V-14C${x - 4} -20 ${x + 4} -20 ${x + 4} -14V0`} fill="#a8241b" />)}
          </g>
          <circle r="5" fill="#a8241b" stroke="#efe2c4" strokeWidth="2" />
        </g>
        <g data-label transform="translate(-280 -128)">
          <rect width="236" height="58" rx="2" fill="#a8241b" />
          <rect x="4" y="4" width="228" height="50" fill="none" stroke="#e8c06a" strokeWidth="0.8" />
          <text x="118" y="28" textAnchor="middle" fontSize="20" fontStyle="italic" fill="#f8ecd2" className="font-display">Orriva · Awadh Palace</text>
          <text x="118" y="45" textAnchor="middle" fontSize="8.5" letterSpacing="2.6" fill="#e8c06a" className="font-sans uppercase">Rajnagar Extension</text>
        </g>
      </g>

      <g transform="translate(736 556)" fill="#7a5a2a">
        <circle r="34" fill="#efe2c4" stroke="#7a5a2a" strokeWidth="1" />
        <circle r="28" fill="none" stroke="#7a5a2a" strokeWidth="0.5" strokeDasharray="1 3" />
        <path d="M0 -30L6 0L0 30L-6 0Z" fill="#7a5a2a" />
        <path d="M0 -30L6 0H-6Z" fill="#a8241b" />
        <path d="M-30 0L0 -4L30 0L0 4Z" opacity="0.5" />
        <text y="-38" textAnchor="middle" fontSize="10" letterSpacing="2" className="font-sans">N</text>
      </g>

      <text x="24" y="604" fontSize="9" letterSpacing="2.4" fill="#7a5a2a" opacity="0.8" className="font-sans uppercase">Illustrative · not to scale</text>
      <rect width="800" height="620" fill={`url(#${id}v)`} pointerEvents="none" />
      <rect x="8" y="8" width="784" height="604" fill="none" stroke="#7a5a2a" strokeWidth="1" />
      <rect x="14" y="14" width="772" height="592" fill="none" stroke="#7a5a2a" strokeWidth="0.5" />
    </svg>
  );
}
