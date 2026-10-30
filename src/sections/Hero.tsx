import {useRef} from 'react';
import {motion, useScroll, useTransform} from 'framer-motion';
import {SilkShader} from '../components/SilkShader';
import {ScriptName} from '../components/Reveal';
import {archPath, Rosette} from '../components/ornaments';
import {useGate} from '../lib/gate';
import {useSmooth} from '../lib/smooth';
import {couple, venue} from '../content/wedding';

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const {opened} = useGate();
  const smooth = useSmooth();
  const {scrollYProgress} = useScroll({target: ref, offset: ['start start', 'end start']});
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%']);
  const ampY = useTransform(scrollYProgress, [0, 1], ['0%', '-60%']);
  const archScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const silkY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  const fadeIn = (delay: number) => ({
    initial: {opacity: 0, y: 18},
    animate: opened ? {opacity: 1, y: 0} : {opacity: 0, y: 18},
    transition: {duration: 1.3, ease, delay},
  });

  return (
    <section id="top" ref={ref} tabIndex={-1} aria-labelledby="hero-title" className="relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-sindoor-deep text-ivory outline-none">
      <motion.div className="absolute inset-0 -z-20" style={{y: silkY}}>
        <SilkShader className="absolute inset-0" />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_120%,rgb(21_14_10/0.85),transparent_60%)]" />

      <motion.svg
        aria-hidden="true"
        viewBox="-4 -4 608 908"
        preserveAspectRatio="xMidYMid meet"
        className="absolute left-1/2 top-[54%] -z-10 h-[118%] -translate-x-1/2 -translate-y-1/2 text-gold"
        style={{scale: archScale, opacity: fade}}
      >
        <motion.path
          d={archPath(600, 900, {cusps: 5, maxRise: 0.5})}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          initial={{pathLength: 0, opacity: 0}}
          animate={opened ? {pathLength: 1, opacity: 0.75} : {pathLength: 0, opacity: 0}}
          transition={{duration: 3.2, ease: [0.65, 0, 0.35, 1], delay: 0.4}}
        />
        <motion.path
          d={archPath(560, 880, {cusps: 5, maxRise: 0.5, x: 20, y: 20})}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          initial={{pathLength: 0, opacity: 0}}
          animate={opened ? {pathLength: 1, opacity: 0.4} : {pathLength: 0, opacity: 0}}
          transition={{duration: 3.6, ease: [0.65, 0, 0.35, 1], delay: 0.6}}
        />
      </motion.svg>

      <motion.div
        aria-hidden="true"
        className="absolute right-[-12vw] top-[-14vw] -z-10 size-[44vw] max-w-[640px] max-h-[640px] text-gold/35"
        initial={{opacity: 0, rotate: -40}}
        animate={opened ? {opacity: 1, rotate: 0} : {}}
        transition={{duration: 3, ease, delay: 0.8}}
      >
        <Rosette className="anim-spin size-full" sw={0.6} />
      </motion.div>

      <div className="relative mx-auto flex h-full max-w-[1680px] flex-col px-[clamp(1.1rem,3vw,2.75rem)] pb-[clamp(1.5rem,4vh,2.75rem)] pt-[clamp(5.5rem,13vh,8.5rem)]">
        <motion.p {...fadeIn(0.5)} className="flex flex-wrap items-center gap-x-5 gap-y-1 text-gold-pale">
          <span lang="hi" className="shloka whitespace-nowrap text-[clamp(1.7rem,2.4vw,2.3rem)] leading-none text-haldi">शुभ विवाह</span>
          <span className="h-px w-12 bg-gold/60" aria-hidden="true" />
          <span className="font-display text-[clamp(1.15rem,1.4vw,1.35rem)] italic text-gold-pale/90">The Wedding Celebration</span>
        </motion.p>

        <motion.h1
          id="hero-title"
          tabIndex={-1}
          style={{y: nameY}}
          className="relative my-auto flex flex-col font-names text-[clamp(5.2rem,28vw,16rem)] leading-[1.05] text-ivory outline-none [text-shadow:0_0.03em_0.25em_rgb(40_8_6/0.55)] md:text-[clamp(6rem,15.5vw,15.5rem)]"
        >
          <span className="sr-only">{couple.groom} and {couple.bride}</span>
          <span aria-hidden="true" className="block self-start pl-[4vw] md:pl-[8vw]">
            <ScriptName text={couple.groom} play={opened} delay={0.35} />
          </span>
          <motion.span
            aria-hidden="true"
            style={{y: ampY}}
            className="pointer-events-none relative -my-[0.18em] self-center font-display text-[0.6em] font-light italic leading-none text-haldi md:absolute md:left-1/2 md:top-[30%] md:my-0 md:-translate-x-1/2 md:text-[0.72em]"
          >
            <motion.span
              className="inline-block"
              initial={{opacity: 0, scale: 0.6, rotate: -14}}
              animate={opened ? {opacity: 1, scale: 1, rotate: 0} : {}}
              transition={{duration: 1.8, ease, delay: 1.2}}
            >
              &amp;
            </motion.span>
          </motion.span>
          <span aria-hidden="true" className="block self-end pr-[4vw] md:pr-[8vw]">
            <ScriptName text={couple.bride} play={opened} delay={1.35} />
          </span>
        </motion.h1>

        <motion.div style={{opacity: fade}} className="relative flex flex-col items-center gap-4 text-center">
          <motion.div {...fadeIn(1.5)} className="flex flex-col items-center gap-3 sm:flex-row sm:items-stretch sm:gap-[clamp(1.5rem,4vw,3.5rem)]">
            <dl className="flex flex-col items-center gap-1 sm:items-end sm:text-right">
              <dt className="eyebrow text-gold-pale/80">Two days of celebration</dt>
              <dd className="font-display text-[clamp(2rem,3.4vw,3.3rem)] font-medium leading-[1.05] text-ivory">
                20 <span className="font-light text-gold">–</span> 21 November <span className="text-gold-pale/80">2026</span>
              </dd>
            </dl>
            <span aria-hidden="true" className="hidden w-px bg-gradient-to-b from-transparent via-gold to-transparent sm:block" />
            <address className="flex flex-col items-center gap-1 not-italic sm:items-start sm:text-left">
              <span className="eyebrow text-gold-pale/80">The Venue</span>
              <span className="font-display text-[clamp(2rem,3.4vw,3.3rem)] font-medium leading-[1.05] text-ivory">
                {venue.name} <span className="text-gold-pale/80">· {venue.lines[1].split(',')[0]}</span>
              </span>
            </address>
          </motion.div>
          <motion.a
            {...fadeIn(1.7)}
            href="#invitation"
            onClick={(e) => {
              e.preventDefault();
              smooth.scrollTo('#invitation');
            }}
            className="group mt-1 flex flex-col items-center gap-2"
          >
            <span className="eyebrow text-gold-pale/75 transition-colors group-hover:text-ivory">Step inside</span>
            <span aria-hidden="true" className="relative h-10 w-px overflow-hidden bg-ivory/20">
              <span className="anim-cue absolute inset-0 bg-haldi" />
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
