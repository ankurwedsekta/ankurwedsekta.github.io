import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Diya, Rosette} from '../components/ornaments';
import {Reveal} from '../components/Reveal';
import {useSmooth} from '../lib/smooth';
import {families, weddingMoment} from '../content/wedding';

function remaining() {
  const ms = weddingMoment.getTime() - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60};
}

function Unit({value, label}: {value: number; label: string}) {
  const text = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="display relative flex overflow-hidden text-[clamp(3rem,8vw,7.5rem)] leading-none lining-nums tabular-nums">
        {Array.from(text).map((ch, i) => (
          <span key={i} className="relative inline-block w-[0.62em] text-center">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={ch}
                className="inline-block"
                initial={{y: '100%', opacity: 0}}
                animate={{y: '0%', opacity: 1}}
                exit={{y: '-100%', opacity: 0}}
                transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1]}}
              >
                {ch}
              </motion.span>
            </AnimatePresence>
          </span>
        ))}
      </span>
      <span className="eyebrow text-gold-pale/60">{label}</span>
    </div>
  );
}

function Countdown() {
  const [left, setLeft] = useState(remaining);
  useEffect(() => {
    const t = window.setInterval(() => setLeft(remaining()), 1000);
    return () => window.clearInterval(t);
  }, []);

  if (!left) {
    return <p className="display text-[clamp(2.4rem,6vw,5rem)] italic text-haldi">The celebrations have begun!</p>;
  }
  const label = `${left.days} days, ${left.hours} hours and ${left.minutes} minutes until the wedding`;
  return (
    <div role="timer" aria-label={label} className="flex items-start justify-center gap-[clamp(0.8rem,3vw,3rem)]">
      <div aria-hidden="true" className="contents">
        <Unit value={left.days} label="Days" />
        <span className="display mt-[0.15em] text-[clamp(2rem,5vw,4.5rem)] text-gold/50">:</span>
        <Unit value={left.hours} label="Hours" />
        <span className="display mt-[0.15em] text-[clamp(2rem,5vw,4.5rem)] text-gold/50">:</span>
        <Unit value={left.minutes} label="Minutes" />
        <span className="display mt-[0.15em] hidden text-[clamp(2rem,5vw,4.5rem)] text-gold/50 sm:block">:</span>
        <div className="hidden sm:block">
          <Unit value={left.seconds} label="Seconds" />
        </div>
      </div>
    </div>
  );
}

export function Finale() {
  const smooth = useSmooth();
  return (
    <footer className="relative isolate overflow-hidden bg-sindoor-deep pb-28 pt-[clamp(6rem,16vh,10rem)] text-ivory lg:pb-14">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_50%_42%,rgb(228_155_52/0.28),transparent_70%)]" />
      <div className="mx-auto flex max-w-[1680px] flex-col items-center px-[clamp(1.1rem,3vw,2.75rem)] text-center">
        <Reveal as="p" className="eyebrow text-gold">Until the sehra is tied</Reveal>
        <Reveal delay={0.1} className="mt-10 w-full">
          <Countdown />
        </Reveal>

        <div className="relative mt-[clamp(5rem,12vh,9rem)] grid place-items-center">
          <div aria-hidden="true" className="absolute size-[clamp(280px,40vw,520px)] text-gold/40">
            <Rosette className="anim-spin-rev size-full" sw={0.55} />
          </div>
          <Reveal y={20} className="relative">
            <p className="font-names gold-foil py-[0.1em] pl-[0.25em] pr-[0.45em] text-[clamp(7rem,20vw,16rem)] leading-[1.1] hover:bg-[position:100%_50%]">
              A<span className="mx-[0.06em] font-display text-[0.45em] font-light italic">&amp;</span>E
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-14 flex flex-col items-center gap-3">
          <p className="display text-[clamp(1.8rem,3vw,2.6rem)] italic">
            Ankur weds Ekta <span className="not-italic text-gold">·</span> 21.11.2026
          </p>
          <p className="font-display text-[1.2rem] text-gold-pale/75">With love — {families.complimentsEn}</p>
        </Reveal>

        <svg viewBox="0 0 520 70" className="mt-12 h-[70px] w-[min(90vw,520px)] overflow-visible" aria-hidden="true">
          {[40, 130, 220, 310, 400, 490].map((x, i) => (
            <Diya key={x} x={x - 10} y={60} s={0.62} delay={i * 0.35} />
          ))}
        </svg>

        <div className="mt-14 flex w-full flex-col items-center justify-between gap-6 border-t border-gold/20 pt-8 sm:flex-row">
          <p lang="sa" className="font-deva-display text-[1.05rem] text-gold-pale/70">॥ सर्वे भवन्तु सुखिनः ॥</p>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              smooth.scrollTo('#top');
            }}
            className="group eyebrow flex items-center gap-3 text-ivory/70 transition-colors hover:text-haldi"
          >
            <span>Back to the gate</span>
            <span aria-hidden="true" className="inline-block transition-transform duration-500 group-hover:-translate-y-1">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
