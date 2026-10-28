import {useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type CSSProperties, type ReactNode} from 'react';
import {motion, useMotionValue, useReducedMotion, useSpring} from 'framer-motion';

/** Wraps any child so it leans toward the cursor and springs home on leave. */
export function Magnetic({children, strength = 0.32, className = ''}: {children: ReactNode; strength?: number; className?: string}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, {stiffness: 210, damping: 16, mass: 0.6});
  const sy = useSpring(y, {stiffness: 210, damping: 16, mass: 0.6});

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{x: sx, y: sy}}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

const tones = {
  gold: {b: '#d4ad66', o: '#1a100b'},
  ivory: {b: '#f3ead8', o: '#1a100b'},
  sindoor: {b: '#a8241b', o: '#f8ecd2'},
  ink: {b: '#1a100b', o: '#f3ead8'},
} as const;

type Tone = keyof typeof tones;
type Common = {children: ReactNode; variant?: 'solid' | 'ghost'; tone?: Tone; icon?: ReactNode; className?: string; magnetic?: boolean};
type LinkProps = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'> & {href: string};
type BtnProps = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {href?: undefined};

/**
 * Pill button whose fill rises like an arch on hover while the label rolls over.
 */
export function RoyalButton(props: LinkProps | BtnProps) {
  const {children, variant = 'ghost', tone = 'gold', icon, className = '', magnetic = true, ...rest} = props;
  const t = tones[tone];
  const solid = variant === 'solid';
  const style = {
    '--b': t.b,
    '--o': t.o,
    backgroundColor: solid ? 'var(--b)' : 'transparent',
    color: solid ? 'var(--o)' : undefined,
  } as CSSProperties;
  const classes = `group relative isolate inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-[1.05rem] eyebrow !tracking-[0.26em] transition-colors duration-500 ${
    solid ? '' : 'border border-current/35 hover:border-[var(--b)]'
  } ${className}`;
  const label = (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-x-[-2px] bottom-[-2px] -z-10 h-[calc(100%+4px)] translate-y-[102%] rounded-t-[50%] transition-[translate,border-radius] duration-700 ease-[var(--ease-royal)] group-hover:translate-y-0 group-hover:rounded-t-none group-focus-visible:translate-y-0 group-focus-visible:rounded-t-none"
        style={{backgroundColor: solid ? 'var(--o)' : 'var(--b)'}}
      />
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[var(--ease-royal)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">{children}</span>
        <span aria-hidden="true" className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-royal)] group-hover:translate-y-0 group-focus-visible:translate-y-0" style={{color: solid ? 'var(--b)' : 'var(--o)'}}>
          {children}
        </span>
      </span>
      {icon && (
        <span aria-hidden="true" className="relative transition-[color,transform] duration-500 ease-[var(--ease-royal)] group-hover:translate-x-1 group-hover:text-[var(--o)]" style={solid ? {} : undefined}>
          {icon}
        </span>
      )}
    </>
  );

  const element = 'href' in rest && rest.href !== undefined
    ? <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={classes} style={style}>{label}</a>
    : <button type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={classes} style={style}>{label}</button>;

  return magnetic ? <Magnetic>{element}</Magnetic> : element;
}

export const ArrowIcon = ({className = ''}: {className?: string}) => (
  <svg viewBox="0 0 24 12" width="22" height="11" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M0 6H22M17 1L22 6L17 11" />
  </svg>
);
