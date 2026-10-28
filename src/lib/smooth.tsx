import {createContext, useContext, useEffect, useMemo, useRef, type ReactNode} from 'react';
import Lenis from 'lenis';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useReducedMotion} from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

type SmoothApi = {
  scrollTo: (target: string | number) => void;
  lock: () => void;
  unlock: () => void;
};

const SmoothContext = createContext<SmoothApi | null>(null);

export function SmoothScroll({children}: {children: ReactNode}) {
  const lenisRef = useRef<Lenis | null>(null);
  const lockedRef = useRef(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({lerp: 0.085, wheelMultiplier: 0.95, touchMultiplier: 1.2});
    lenisRef.current = lenis;
    if (lockedRef.current) lenis.stop();
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduce]);

  const api = useMemo<SmoothApi>(() => ({
    scrollTo(target) {
      const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : null;
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(el ?? (target as number), {duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4)});
      } else if (el) {
        el.scrollIntoView();
      } else if (typeof target === 'number') {
        window.scrollTo({top: target});
      }
      // Move keyboard focus with the view so tab order follows the destination.
      el?.focus({preventScroll: true});
    },
    lock() {
      lockedRef.current = true;
      lenisRef.current?.stop();
      document.documentElement.style.overflow = 'hidden';
    },
    unlock() {
      lockedRef.current = false;
      document.documentElement.style.overflow = '';
      lenisRef.current?.start();
      ScrollTrigger.refresh();
    },
  }), []);

  return <SmoothContext.Provider value={api}>{children}</SmoothContext.Provider>;
}

export function useSmooth() {
  const ctx = useContext(SmoothContext);
  if (!ctx) throw new Error('useSmooth must be used inside <SmoothScroll>');
  return ctx;
}

export {gsap, ScrollTrigger};
