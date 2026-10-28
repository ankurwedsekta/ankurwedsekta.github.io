import {motion, useReducedMotion, type Variants} from 'framer-motion';
import type {CSSProperties, ElementType, ReactNode} from 'react';

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 32,
  className,
  style,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
  as?: 'div' | 'p' | 'li' | 'span' | 'figure';
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      style={style}
      initial={{opacity: 0, y}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '0px 0px -10% 0px'}}
      transition={{duration: 1.15, ease, delay}}
    >
      {children}
    </Comp>
  );
}

const container: Variants = {hidden: {}, show: {}};
const unit: Variants = {
  hidden: {y: '115%', rotate: 5},
  show: (i: number) => ({y: '0%', rotate: 0, transition: {duration: 1.25, ease, delay: i}}),
};

/**
 * Splits text into masked characters or words that rise into place.
 * Pass `play` to drive it externally; otherwise it plays on scroll into view.
 */
export function SplitText({
  text,
  by = 'char',
  className,
  delay = 0,
  stagger = 0.04,
  play,
  as: Tag = 'span',
}: {
  text: string;
  by?: 'char' | 'word';
  className?: string;
  delay?: number;
  stagger?: number;
  play?: boolean;
  as?: ElementType;
}) {
  const deva = /[\u0900-\u097F]/.test(text);
  const units = by === 'char' && !deva ? Array.from(text) : text.split(' ');
  const mask = deva
    ? 'pr-[0.08em] -mr-[0.08em] pt-[0.32em] -mt-[0.32em] pb-[0.3em] -mb-[0.3em]'
    : 'pr-[0.08em] -mr-[0.08em] pb-[0.12em] -mb-[0.12em]';
  const control = play === undefined
    ? {initial: 'hidden', whileInView: 'show', viewport: {once: true, margin: '0px 0px -8% 0px'}}
    : {initial: 'hidden', animate: play ? 'show' : 'hidden'};
  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span aria-hidden="true" className="inline" variants={container} {...control}>
        {units.map((u, i) => (
          <span key={`${u}-${i}`}>
            <span className={`inline-block overflow-hidden align-bottom ${mask}`}>
              <motion.span className="inline-block origin-bottom-left will-change-transform" variants={unit} custom={delay + i * stagger}>
                {u === ' ' ? '\u00A0' : u}
              </motion.span>
            </span>
            {by === 'word' || deva ? (i < units.length - 1 ? ' ' : null) : null}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/**
 * A calligraphic name that is "inked" left to right, like a pen stroke.
 * The clip box overshoots generously so swashes and descenders are never trimmed.
 */
export function ScriptName({
  text,
  play,
  delay = 0,
  duration = 1.9,
  className,
}: {
  text: string;
  play?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const hidden = {clipPath: 'inset(-30% 100% -45% -12%)', opacity: 0.2};
  const shown = {clipPath: 'inset(-30% -12% -45% -12%)', opacity: 1};
  const control = reduce
    ? {initial: false as const}
    : play === undefined
      ? {initial: hidden, whileInView: shown, viewport: {once: true, margin: '0px 0px -8% 0px'}}
      : {initial: hidden, animate: play ? shown : hidden};
  return (
    <motion.span className={`inline-block ${className ?? ''}`} transition={{duration, ease: [0.45, 0.05, 0.25, 1], delay}} {...control}>
      {text}
    </motion.span>
  );
}
