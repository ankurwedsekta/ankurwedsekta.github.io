import {useId, type ReactNode} from 'react';

const f = (n: number) => Number(n.toFixed(2));

/**
 * A Mughal multifoil (cusped) arch: a pointed arch whose intrados is broken into
 * lobes. `cusps` lobes per side; set `cusps` to 0 for a smooth pointed arch.
 */
export function archPath(w: number, h: number, {cusps = 4, rk = 0.72, maxRise = 0.62, x = 0, y = 0} = {}) {
  const R = w * rk;
  const ta = Math.acos((w / 2 - R) / R);
  const rise0 = R * Math.sin(ta);
  const rise = Math.min(rise0, h * maxRise);
  const s = rise / rise0;
  if (cusps <= 0) {
    return `M${f(x)} ${f(y + h)}L${f(x)} ${f(y + rise)}A${f(R)} ${f(R * s)} 0 0 1 ${f(x + w / 2)} ${f(y)}A${f(R)} ${f(R * s)} 0 0 1 ${f(x + w)} ${f(y + rise)}L${f(x + w)} ${f(y + h)}Z`;
  }
  const left: [number, number][] = [];
  for (let i = 0; i <= cusps; i++) {
    const t = Math.PI + (ta - Math.PI) * (i / cusps);
    left.push([R + R * Math.cos(t), rise - R * Math.sin(t) * s]);
  }
  const right = left.slice(0, -1).reverse().map(([px, py]) => [w - px, py] as [number, number]);
  const pts = [...left, ...right];
  let d = `M${f(x)} ${f(y + h)}L${f(x)} ${f(y + rise)}`;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const r = Math.hypot(bx - ax, by - ay) * 0.6;
    d += `A${f(r)} ${f(r)} 0 0 1 ${f(x + bx)} ${f(y + by)}`;
  }
  return `${d}L${f(x + w)} ${f(y + h)}Z`;
}

/** Concentric line-art rosette inspired by painted ceiling medallions. */
export function Rosette({
  className,
  stroke = 'currentColor',
  sw = 0.8,
  fills,
}: {
  className?: string;
  stroke?: string;
  sw?: number;
  fills?: {outer?: string; inner?: string; core?: string; ring?: string};
}) {
  const sixteen = Array.from({length: 16}, (_, i) => i * 22.5);
  const eight = Array.from({length: 8}, (_, i) => i * 45 + 22.5);
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true" fill="none" stroke={stroke} strokeWidth={sw}>
      <circle r="97" fill={fills?.ring ?? 'none'} />
      <circle r="92.5" strokeDasharray="0.01 4.53" strokeLinecap="round" strokeWidth={sw * 2.6} />
      <circle r="88" />
      {sixteen.map((a) => (
        <path key={`o${a}`} transform={`rotate(${a})`} d="M0 -40C14 -53 12 -74 0 -86C-12 -74 -14 -53 0 -40Z" fill={fills?.outer ?? 'none'} />
      ))}
      {sixteen.map((a) => (
        <path key={`d${a}`} transform={`rotate(${a + 11.25})`} d="M0 -66L3.5 -73L0 -80L-3.5 -73Z" fill={stroke} stroke="none" />
      ))}
      {sixteen.map((a) => (
        <path key={`v${a}`} transform={`rotate(${a})`} d="M0 -46V-78" strokeWidth={sw * 0.6} />
      ))}
      <circle r="42" />
      <circle r="38" strokeDasharray="0.01 3.1" strokeLinecap="round" strokeWidth={sw * 2} />
      {eight.map((a) => (
        <g key={`i${a}`} transform={`rotate(${a})`}>
          <path d="M0 -17C21 -26 19 -45 0 -58C-19 -45 -21 -26 0 -17Z" fill={fills?.inner ?? 'none'} />
          <path d="M0 -23C9 -30 8 -42 0 -50C-8 -42 -9 -30 0 -23Z" strokeWidth={sw * 0.7} />
        </g>
      ))}
      <circle r="15" fill={fills?.core ?? 'none'} />
      <path d="M0 -12L3.4 -3.4L12 0L3.4 3.4L0 12L-3.4 3.4L-12 0L-3.4 -3.4Z" fill={stroke} stroke="none" />
    </svg>
  );
}

/** Pierced-stone lattice (jaali) as an SVG pattern. Render inside <defs>. */
export function JaaliPattern({id, stroke, size = 36, sw = 1, bg}: {id: string; stroke: string; size?: number; sw?: number; bg?: string}) {
  const c = size / 2;
  const a = size * 0.26;
  const tip = a * Math.SQRT2;
  return (
    <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
      {bg && <rect width={size} height={size} fill={bg} />}
      <g fill="none" stroke={stroke} strokeWidth={sw}>
        <rect x={c - a} y={c - a} width={a * 2} height={a * 2} />
        <rect x={c - a} y={c - a} width={a * 2} height={a * 2} transform={`rotate(45 ${c} ${c})`} />
        <circle cx={c} cy={c} r={size * 0.075} />
        <path d={`M${c} 0V${c - tip}M${c} ${size}V${c + tip}M0 ${c}H${c - tip}M${size} ${c}H${c + tip}`} />
        <path d={`M0 ${size * 0.12}L${size * 0.12} 0M${size} ${size * 0.88}L${size * 0.88} ${size}M${size * 0.88} 0L${size} ${size * 0.12}M0 ${size * 0.88}L${size * 0.12} ${size}`} />
      </g>
    </pattern>
  );
}

/** Row of scallops, like the hem of a canopy. */
export function ScallopEdge({color, flip = false, className = '', size = 28}: {color: string; flip?: boolean; className?: string; size?: number}) {
  const id = useId();
  return (
    <svg aria-hidden="true" className={`block w-full ${className}`} height={size * 0.75} style={flip ? {transform: 'scaleY(-1)'} : undefined}>
      <defs>
        <pattern id={id} width={size} height={size * 0.75} patternUnits="userSpaceOnUse">
          <path d={`M0 0H${size}A${size / 2} ${size / 2} 0 0 1 0 0Z`} fill={color} />
          <circle cx={size / 2} cy={size * 0.64} r={size * 0.06} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Ornamental hairline divider with a central lozenge. */
export function Divider({className = '', color = 'currentColor'}: {className?: string; color?: string}) {
  return (
    <svg viewBox="0 0 240 16" className={className} aria-hidden="true" fill="none" stroke={color} strokeWidth="0.8">
      <path d="M0 8H98M142 8H240" />
      <path d="M120 1L127 8L120 15L113 8Z" fill={color} />
      <path d="M104 8a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M128 8a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    </svg>
  );
}

/** Clay oil lamp with a living flame. Coordinates: base centre at (x, y). */
export function Diya({x = 0, y = 0, s = 1, delay = 0}: {x?: number; y?: number; s?: number; delay?: number}) {
  const id = useId();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id={`${id}g`}>
          <stop offset="0" stopColor="#ffcf6e" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffcf6e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}f`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fff6d6" />
          <stop offset="0.45" stopColor="#ffc24a" />
          <stop offset="1" stopColor="#e5571f" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="-34" r="42" fill={`url(#${id}g)`} className="anim-breathe" style={{animationDelay: `${delay}s`, transformBox: 'fill-box', transformOrigin: 'center'}} />
      <path d="M-36 -8Q-31 16 0 18Q31 16 36 -8Q17 -2 0 -2Q-17 -2 -36 -8Z" fill="#8f3a1a" />
      <path d="M-36 -8Q0 -17 36 -8Q17 -2 0 -2Q-17 -2 -36 -8Z" fill="#c56a2c" />
      <path d="M26 -10Q38 -12 42 -17Q36 -7 30 -5Z" fill="#8f3a1a" />
      <path d="M-24 6Q0 12 24 6" stroke="#e6b25c" strokeWidth="1.4" fill="none" strokeDasharray="1 4" strokeLinecap="round" />
      <g transform="translate(39 -15)">
        <path className="anim-flicker" style={{animationDelay: `${delay}s`}} d="M0 0C-7 -6 -6 -17 0 -30C6 -17 7 -6 0 0Z" fill={`url(#${id}f)`} />
      </g>
    </g>
  );
}

/** Single bloom of marigold: concentric frilled rings. */
export function Marigold({x, y, r = 10, tone = '#f0a12e'}: {x: number; y: number; r?: number; tone?: string}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={tone} />
      <circle r={r * 0.78} fill="none" stroke="#c46a12" strokeWidth={r * 0.18} strokeDasharray={`${r * 0.2} ${r * 0.22}`} />
      <circle r={r * 0.45} fill="#f7c44f" />
      <circle r={r * 0.2} fill="#b8560d" />
    </g>
  );
}

export function Lotus({x, y, s = 1, petal = '#f2a3bf', edge = '#c2366f'}: {x: number; y: number; s?: number; petal?: string; edge?: string}) {
  const angles = [-64, -38, -14, 14, 38, 64];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {angles.map((a) => (
        <path key={a} transform={`rotate(${a})`} d="M0 0C14 -14 12 -38 0 -54C-12 -38 -14 -14 0 0Z" fill={petal} stroke={edge} strokeWidth="1.2" />
      ))}
      <path d="M0 0C10 -16 9 -44 0 -60C-9 -44 -10 -16 0 0Z" fill={petal} stroke={edge} strokeWidth="1.2" />
      <path d="M-44 4Q0 16 44 4" stroke="#2d6b4c" strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Frame with cusped-arch clip and a double gold outline; scene drawn in a 400×560 space. */
export function ArchWindow({children, className = '', line = '#d8b26a', label}: {children: ReactNode; className?: string; line?: string; label?: string}) {
  const id = useId();
  const outer = archPath(400, 560, {cusps: 4});
  const inner = archPath(376, 548, {cusps: 4, x: 12, y: 12});
  return (
    <svg viewBox="-14 -14 428 588" className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <clipPath id={`${id}c`}>
          <path d={outer} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}c)`}>{children}</g>
      <path d={outer} fill="none" stroke={line} strokeWidth="2.4" />
      <path d={inner} fill="none" stroke={line} strokeWidth="0.9" opacity="0.7" />
      <path d={archPath(428, 588, {cusps: 4, x: -14, y: -14})} fill="none" stroke={line} strokeWidth="0.6" opacity="0.45" />
    </svg>
  );
}
