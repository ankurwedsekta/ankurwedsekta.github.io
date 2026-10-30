import {useEffect, useState} from 'react';
import {motion, useScroll, useSpring} from 'framer-motion';
import {gsap} from 'gsap';
import {useGate} from '../lib/gate';
import {useSmooth} from '../lib/smooth';
import {mapsLink} from '../content/wedding';

export const navItems = [
  {href: '#invitation', numeral: 'I', label: 'Invitation'},
  {href: '#ceremonies', numeral: 'II', label: 'Celebrations'},
  {href: '#venue', numeral: 'III', label: 'Venue'},
] as const;

export function Header() {
  const {opened} = useGate();
  const smooth = useSmooth();
  const {scrollYProgress} = useScroll();
  const progress = useSpring(scrollYProgress, {stiffness: 120, damping: 30, mass: 0.4});
  const [light, setLight] = useState(false);

  useEffect(() => {
    let frame = 0;
    let last: boolean | null = null;
    const probe = () => {
      if (frame++ % 6) return;
      const el = document.elementFromPoint(6, 40)?.closest<HTMLElement>('[data-header]');
      const next = el?.dataset.header === 'light';
      if (next !== last) setLight((last = next));
    };
    gsap.ticker.add(probe);
    return () => gsap.ticker.remove(probe);
  }, []);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    smooth.scrollTo(href);
  };

  return (
    <motion.header
      initial={false}
      animate={opened ? {opacity: 1, y: 0} : {opacity: 0, y: -24}}
      transition={{duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: opened ? 1.1 : 0}}
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 transition-colors duration-700 ${light ? 'text-ink' : 'text-ivory'}`}
      aria-hidden={!opened}
    >
      <motion.div aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-current" style={{scaleX: progress}} />
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 -z-10 h-28 transition-colors duration-700 lg:h-24 ${light ? 'bg-gradient-to-b from-chalk via-chalk/85 to-transparent' : 'bg-gradient-to-b from-ink/85 via-ink/50 to-transparent'}`}
      />
      <div className="flex items-center justify-between px-[clamp(1.1rem,3vw,2.75rem)] py-5">
        <a
          href="#top"
          onClick={(e) => go(e, '#top')}
          tabIndex={opened ? 0 : -1}
          className="pointer-events-auto font-names text-[2.1rem] leading-none"
          aria-label="Ankur and Ekta — back to the top"
        >
          A<span className="mx-[0.1em] font-display text-[0.5em] font-light italic text-gold">&amp;</span>E
        </a>
        <nav aria-label="Sections" className="pointer-events-auto hidden lg:block">
          <ul className="flex items-center gap-10">
            {navItems.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={(e) => go(e, n.href)} tabIndex={opened ? 0 : -1} className="group eyebrow flex items-baseline gap-2">
                  <span className="display text-[0.95rem] normal-case italic tracking-normal opacity-60">{n.numeral}</span>
                  <span className="relative">
                    {n.label}
                    <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-700 ease-[var(--ease-royal)] group-hover:origin-left group-hover:scale-x-100" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={mapsLink}
          target="_blank"
          rel="noreferrer"
          tabIndex={opened ? 0 : -1}
          aria-label="Open Orriva, Ghaziabad in Google Maps (opens in a new tab)"
          className={`pointer-events-auto rounded-full border border-current/50 px-5 py-2.5 font-display text-[1.05rem] font-medium transition-colors duration-500 ${light ? 'hover:bg-ink hover:text-ivory' : 'hover:bg-ivory hover:text-ink'}`}
        >
          Google Maps <span aria-hidden="true">↗</span>
        </a>
      </div>
    </motion.header>
  );
}
