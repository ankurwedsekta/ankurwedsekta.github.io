import {useId} from 'react';
import {Diya, JaaliPattern, Lotus, Marigold} from './ornaments';
import type {SceneKey} from '../content/wedding';

/*
  Every scene lives in a 400×560 space clipped by a cusped arch.
  Groups tagged with data-depth drift at different rates during horizontal scroll.
*/

const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

function Stars({count, color, seed = 1, maxY = 300}: {count: number; color: string; seed?: number; maxY?: number}) {
  return (
    <g>
      {Array.from({length: count}, (_, i) => {
        const x = rand(i + seed) * 400;
        const y = rand(i * 3.1 + seed) * maxY;
        const s = 0.6 + rand(i * 7.7 + seed) * 1.6;
        return (
          <path
            key={i}
            className="anim-twinkle"
            style={{animationDelay: `${(rand(i * 1.9 + seed) * 3.4).toFixed(2)}s`}}
            d={`M${x} ${y - s * 3}L${x + s} ${y - s}L${x + s * 3} ${y}L${x + s} ${y + s}L${x} ${y + s * 3}L${x - s} ${y + s}L${x - s * 3} ${y}L${x - s} ${y - s}Z`}
            fill={color}
          />
        );
      })}
    </g>
  );
}

function Petals({count, colors, seed = 2, area = [0, 0, 400, 560]}: {count: number; colors: string[]; seed?: number; area?: number[]}) {
  const [x0, y0, w, h] = area;
  return (
    <g>
      {Array.from({length: count}, (_, i) => {
        const x = x0 + rand(i + seed) * w;
        const y = y0 + rand(i * 2.3 + seed) * h;
        const r = 4 + rand(i * 5.1 + seed) * 6;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${(rand(i * 9 + seed) * 360).toFixed(1)})`}>
            <path
              className="anim-float"
              style={{animationDelay: `${(-rand(i + seed * 3) * 9).toFixed(2)}s`}}
              d={`M0 ${-r}C${r * 0.9} ${-r * 0.5} ${r * 0.7} ${r * 0.8} 0 ${r}C${-r * 0.7} ${r * 0.8} ${-r * 0.9} ${-r * 0.5} 0 ${-r}Z`}
              fill={colors[i % colors.length]}
              opacity={0.85}
            />
          </g>
        );
      })}
    </g>
  );
}

function SagaaiScene() {
  const id = useId();
  const leaves = Array.from({length: 15}, (_, i) => i);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}bg`} cx="0.5" cy="0.55" r="0.75">
          <stop offset="0" stopColor="#2f7a5a" />
          <stop offset="0.55" stopColor="#0f3a2c" />
          <stop offset="1" stopColor="#071f17" />
        </radialGradient>
        <JaaliPattern id={`${id}j`} stroke="#d8b26a" size={30} sw={0.6} />
        <linearGradient id={`${id}gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6e2a8" />
          <stop offset="0.45" stopColor="#c9963f" />
          <stop offset="1" stopColor="#f1d78f" />
        </linearGradient>
      </defs>
      <rect x="-40" y="-40" width="480" height="640" fill={`url(#${id}bg)`} />
      <g data-depth="0.25">
        <rect x="-40" y="-40" width="480" height="640" fill={`url(#${id}j)`} opacity="0.13" />
        <circle cx="200" cy="330" r="150" fill="#3f9a72" opacity="0.18" className="anim-breathe" style={{transformBox: 'fill-box', transformOrigin: 'center'}} />
      </g>
      <g data-depth="0.6">
        <path d="M-10 196Q200 250 410 196" stroke="#c9963f" strokeWidth="2.2" fill="none" />
        {leaves.map((i) => {
          const t = i / (leaves.length - 1);
          const x = -10 + t * 420;
          const y = 196 + Math.sin(t * Math.PI) * 27;
          return (
            <g key={i} className="anim-sway" style={{animationDelay: `${(i * 0.37).toFixed(2)}s`}}>
              <path d={`M${x} ${y}C${x + 10} ${y + 18} ${x + 7} ${y + 40} ${x} ${y + 52}C${x - 7} ${y + 40} ${x - 10} ${y + 18} ${x} ${y}Z`} fill={i % 2 ? '#3d8a4f' : '#2a6b3c'} stroke="#173f24" strokeWidth="0.8" />
              <path d={`M${x} ${y + 4}V${y + 48}`} stroke="#9fd08a" strokeWidth="0.6" opacity="0.6" />
              {i % 2 === 0 && <Marigold x={x + 13} y={y + 6} r={7} />}
            </g>
          );
        })}
      </g>
      <g data-depth="1">
        <ellipse cx="200" cy="468" rx="120" ry="16" fill="#041510" opacity="0.5" />
        <g className="anim-float" style={{animationDuration: '11s'}}>
          <circle cx="170" cy="358" r="62" fill="none" stroke="#5a3a12" strokeWidth="17" opacity="0.4" transform="translate(4 6)" />
          <circle cx="170" cy="358" r="62" fill="none" stroke={`url(#${id}gold)`} strokeWidth="14" />
          <circle cx="170" cy="358" r="62" fill="none" stroke="#fff4cf" strokeWidth="1.4" strokeDasharray="30 160" opacity="0.8" />
        </g>
        <g className="anim-float" style={{animationDuration: '13s', animationDelay: '-4s'}}>
          <circle cx="238" cy="372" r="58" fill="none" stroke="#5a3a12" strokeWidth="15" opacity="0.4" transform="translate(4 6)" />
          <circle cx="238" cy="372" r="58" fill="none" stroke={`url(#${id}gold)`} strokeWidth="12" />
          <path d="M238 300L252 314L238 330L224 314Z" fill="#fde6f0" stroke="#ec9bbb" strokeWidth="1.5" />
          <path d="M224 314H252M238 300L232 314L238 330L244 314Z" stroke="#ec9bbb" strokeWidth="0.8" fill="none" />
          <path className="anim-twinkle" d="M262 298l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#fff" />
        </g>
      </g>
      <g data-depth="1.5">
        <Lotus x={200} y={540} s={1.05} />
        <Lotus x={70} y={556} s={0.7} />
        <Lotus x={330} y={556} s={0.7} />
        <Petals count={16} colors={['#ec9bbb', '#c2366f', '#f6c0d2']} area={[10, 250, 380, 280]} />
      </g>
    </g>
  );
}

function SehraScene() {
  const id = useId();
  const strands = Array.from({length: 23}, (_, i) => i);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}bg`} cx="0.5" cy="0.2" r="0.95">
          <stop offset="0" stopColor="#fbe39c" />
          <stop offset="0.5" stopColor="#efb24a" />
          <stop offset="1" stopColor="#c7701f" />
        </radialGradient>
      </defs>
      <rect x="-40" y="-40" width="480" height="640" fill={`url(#${id}bg)`} />
      <g data-depth="0.25" opacity="0.4">
        {Array.from({length: 36}, (_, i) => (
          <path key={i} d={`M200 120L${200 + Math.cos((i / 36) * Math.PI * 2) * 600} ${120 + Math.sin((i / 36) * Math.PI * 2) * 600}`} stroke="#fff6d8" strokeWidth={i % 2 ? 0.6 : 1.6} />
        ))}
      </g>
      <g data-depth="0.8">
        {strands.map((i) => {
          const t = i / (strands.length - 1);
          const x = 40 + t * 320;
          const top = 132 + Math.pow(t - 0.5, 2) * 4 * -40 + 40;
          const len = 210 + Math.sin(t * Math.PI) * 140 + rand(i) * 30;
          const beads = Math.floor(len / 17);
          return (
            <g key={i} className="anim-sway" style={{animationDelay: `${(-rand(i * 3) * 5).toFixed(2)}s`, animationDuration: `${4.6 + rand(i) * 2}s`}}>
              <path d={`M${x} ${top}V${top + len}`} stroke="#8a5a14" strokeWidth="0.8" />
              {Array.from({length: beads}, (_, b) => {
                const by = top + 10 + b * 17;
                return b % 3 === 2
                  ? <circle key={b} cx={x} cy={by} r="3.4" fill="#fff8ec" stroke="#d9c7a1" strokeWidth="0.6" />
                  : (
                    <g key={b} transform={`translate(${x} ${by})`}>
                      {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} transform={`rotate(${a})`} cx="0" cy="-3.6" rx="2.3" ry="3.8" fill="#fffdf5" stroke="#e5dcc6" strokeWidth="0.4" />)}
                      <circle r="1.5" fill="#f2c45a" />
                    </g>
                  );
              })}
              <path d={`M${x} ${top + len}l5 9l-5 9l-5 -9z`} fill="#c58a2c" />
            </g>
          );
        })}
        <path d="M24 178Q200 108 376 178" stroke="#7b1a12" strokeWidth="22" fill="none" strokeLinecap="round" />
        <path d="M24 178Q200 108 376 178" stroke="#e8c06a" strokeWidth="2" strokeDasharray="1 7" fill="none" strokeLinecap="round" />
        <path d="M30 168Q200 98 370 168" stroke="#e8c06a" strokeWidth="1" fill="none" />
        <path d="M30 188Q200 118 370 188" stroke="#e8c06a" strokeWidth="1" fill="none" />
        <g transform="translate(200 128)">
          <path d="M0 -58C14 -40 16 -22 0 0C-16 -22 -14 -40 0 -58Z" fill="#9b1d16" stroke="#e8c06a" strokeWidth="1.5" />
          <circle cy="-22" r="7" fill="#f2c45a" stroke="#7b1a12" />
          <path d="M0 -58C10 -78 30 -88 44 -84C30 -76 14 -70 0 -58Z" fill="#fff8ec" stroke="#d9c7a1" />
        </g>
      </g>
      <g data-depth="1.4">
        {[0, 1].map((side) => (
          <g key={side} transform={side ? 'translate(400 0) scale(-1 1)' : undefined}>
            {Array.from({length: 14}, (_, i) => {
              const t = i / 13;
              return <Marigold key={i} x={-10 + t * 170} y={470 + Math.sin(t * Math.PI) * 52} r={11 + (i % 3)} tone={i % 4 === 0 ? '#e0662a' : '#f0a12e'} />;
            })}
          </g>
        ))}
        <Petals count={12} colors={['#e0662a', '#f7c44f', '#fff8ec']} seed={7} area={[0, 280, 400, 250]} />
      </g>
    </g>
  );
}

function Elephant() {
  return (
    <g>
      <path d="M58 118C40 132 38 160 44 180" stroke="#2c3a46" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M38 176l6 14 6 -12z" fill="#2c3a46" />
      <rect x="80" y="160" width="36" height="86" rx="13" fill="#3a4a59" />
      <rect x="198" y="164" width="36" height="82" rx="13" fill="#3a4a59" />
      <ellipse cx="166" cy="138" rx="114" ry="72" fill="#566a7d" />
      <rect x="120" y="166" width="34" height="80" rx="13" fill="#62778b" />
      <rect x="236" y="160" width="36" height="86" rx="13" fill="#62778b" />
      {[98, 137, 216, 254].map((x) => (
        <g key={x}>
          <rect x={x - 19} y="226" width="38" height="6" rx="3" fill="#e2b85e" />
          <path d={`M${x - 15} 238h30`} stroke="#e2b85e" strokeWidth="1.5" strokeDasharray="1 4" strokeLinecap="round" />
        </g>
      ))}
      <path d="M262 102C300 82 340 96 344 140C346 178 336 210 324 240C318 254 330 266 338 258" stroke="#62778b" strokeWidth="26" fill="none" strokeLinecap="round" />
      <path d="M326 216l-8 30" stroke="#566a7d" strokeWidth="2" opacity="0.5" />
      <circle cx="302" cy="122" r="50" fill="#62778b" />
      <path d="M268 92C232 92 222 150 248 178C266 190 286 170 284 140Z" fill="#4c6074" />
      <path d="M272 104C250 108 246 150 260 166" stroke="#c2366f" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M318 166C332 176 344 176 352 168" stroke="#f6edd8" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="318" cy="114" r="4" fill="#1a2128" />
      <path d="M286 76C300 66 322 70 334 86L318 116L300 120Z" fill="#c2366f" />
      <path d="M298 84l14 34M290 92l20 22" stroke="#f2c45a" strokeWidth="1.5" />
      <circle cx="320" cy="122" r="6" fill="#f2c45a" />
      <path d="M90 76Q166 54 246 76L250 150Q232 162 214 150Q196 162 178 150Q160 162 142 150Q124 162 106 150Q90 162 82 150Z" fill="#a8241b" />
      <path d="M90 76Q166 54 246 76" stroke="#f2c45a" strokeWidth="5" fill="none" />
      <path d="M86 138Q166 128 248 138" stroke="#f2c45a" strokeWidth="2" fill="none" strokeDasharray="2 6" strokeLinecap="round" />
      {[118, 166, 214].map((x) => (
        <g key={x} transform={`translate(${x} 108)`}>
          <circle r="13" fill="none" stroke="#f2c45a" strokeWidth="2" />
          <path d="M0 -9L3 -3L9 0L3 3L0 9L-3 3L-9 0L-3 -3Z" fill="#f2c45a" />
        </g>
      ))}
      <path d="M120 72V28H212V72" fill="#e3b45a" stroke="#7b4a12" strokeWidth="2" />
      <path d="M116 30H216" stroke="#7b4a12" strokeWidth="5" />
      {[136, 166, 196].map((x) => <path key={x} d={`M${x} 68V36`} stroke="#7b4a12" strokeWidth="2" />)}
      <path d="M166 -76V30" stroke="#5a3a12" strokeWidth="3" />
      <path d="M90 -30Q166 -100 242 -30Q224 -40 206 -30Q186 -42 166 -30Q146 -42 126 -30Q108 -40 90 -30Z" fill="#c2366f" stroke="#f2c45a" strokeWidth="2" />
      {[90, 128, 166, 204, 242].map((x) => <path key={x} d={`M${x} -30v12`} stroke="#f2c45a" strokeWidth="1.5" />)}
      <circle cx="166" cy="-80" r="5" fill="#f2c45a" />
    </g>
  );
}

function Firework({x, y, r, color, delay}: {x: number; y: number; r: number; color: string; delay: number}) {
  return (
    <g className="anim-burst" style={{animationDelay: `${delay}s`}}>
      {Array.from({length: 22}, (_, i) => {
        const a = (i / 22) * Math.PI * 2;
        const x1 = x + Math.cos(a) * r * 0.25;
        const y1 = y + Math.sin(a) * r * 0.25;
        const x2 = x + Math.cos(a) * r;
        const y2 = y + Math.sin(a) * r;
        return (
          <g key={i}>
            <path d={`M${x1} ${y1}L${x2} ${y2}`} stroke={color} strokeWidth="1.3" strokeLinecap="round" />
            <circle cx={x2} cy={y2} r="2" fill={color} />
          </g>
        );
      })}
    </g>
  );
}

function BaraatScene() {
  const id = useId();
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#031519" />
          <stop offset="0.6" stopColor="#0b3b44" />
          <stop offset="1" stopColor="#15535b" />
        </linearGradient>
        <radialGradient id={`${id}glow`}>
          <stop offset="0" stopColor="#f0a943" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f0a943" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="-40" y="-40" width="480" height="640" fill={`url(#${id}sky)`} />
      <g data-depth="0.15">
        <Stars count={46} color="#f6e7c8" seed={4} maxY={330} />
        <path d="M318 70a26 26 0 1 0 22 40a20 20 0 1 1 -22 -40z" fill="#f6e7c8" />
      </g>
      <g data-depth="0.45">
        <Firework x={110} y={120} r={62} color="#f0a943" delay={0} />
        <Firework x={290} y={190} r={50} color="#ec9bbb" delay={1.4} />
        <Firework x={200} y={60} r={40} color="#f6e7c8" delay={2.6} />
      </g>
      <g data-depth="0.7" fill="#04191d">
        <path d="M-20 400V330H20V300Q40 262 60 300V330H96V290H110Q128 240 146 290H160V330H230V284Q262 222 294 284V330H340V306Q356 280 372 306V330H420V400Z" />
        {[128, 262].map((x) => <path key={x} d={`M${x} ${x === 128 ? 236 : 218}v-18`} stroke="#04191d" strokeWidth="2" />)}
        {[50, 120, 190, 270, 350].map((x) => <rect key={x} x={x} y="350" width="6" height="12" rx="3" fill="#f0a943" opacity="0.7" className="anim-twinkle" style={{animationDelay: `${x / 100}s`}} />)}
      </g>
      <g data-depth="1">
        <circle cx="60" cy="300" r="70" fill={`url(#${id}glow)`} className="anim-breathe" style={{transformBox: 'fill-box', transformOrigin: 'center'}} />
        <circle cx="350" cy="300" r="70" fill={`url(#${id}glow)`} className="anim-breathe" style={{transformBox: 'fill-box', transformOrigin: 'center', animationDelay: '-3s'}} />
        {[60, 350].map((x, i) => (
          <g key={x}>
            <path d={`M${x} 310V520`} stroke="#6b4a1e" strokeWidth="5" />
            <path d={`M${x - 12} 312h24l-6 14h-12z`} fill="#c58a2c" />
            <path className="anim-flicker" style={{animationDelay: `${i * 0.6}s`}} d={`M${x} 312C${x - 14} 300 ${x - 10} 280 ${x} 262C${x + 10} 280 ${x + 14} 300 ${x} 312Z`} fill="#ffb347" />
            <path className="anim-flicker" style={{animationDelay: `${i * 0.6 + 0.3}s`}} d={`M${x} 310C${x - 7} 302 ${x - 5} 290 ${x} 280C${x + 5} 290 ${x + 7} 302 ${x} 310Z`} fill="#fff1c1" />
          </g>
        ))}
        <g transform="translate(46 278) scale(0.98)">
          <Elephant />
        </g>
      </g>
      <g data-depth="1.45">
        <rect x="-40" y="524" width="480" height="60" fill="#a8241b" />
        <path d="M-40 524H440" stroke="#f2c45a" strokeWidth="3" />
        <path d={`M-40 540${Array.from({length: 24}, (_, i) => `L${-40 + i * 20 + 10} ${i % 2 ? 540 : 552}`).join('')}`} stroke="#f2c45a" strokeWidth="1.5" fill="none" />
        <Petals count={10} colors={['#f0a943', '#ec9bbb']} seed={11} area={[0, 360, 400, 160]} />
      </g>
    </g>
  );
}

function Thali() {
  const bowls = [
    {fill: '#f2b632', rim: '#e0a020'},
    {fill: '#d9672a', rim: '#b44b1c'},
    {fill: '#f8f1e2', rim: '#e3d6b8'},
    {fill: '#4e8a3a', rim: '#3a6e2a'},
    {fill: '#f3dfb0', rim: '#d8bf86'},
    {fill: '#9a3b1d', rim: '#7a2a12'},
  ];
  return (
    <g>
      <circle r="150" fill="#3a0a07" opacity="0.45" transform="translate(6 10)" />
      <circle r="150" fill="#c99a4c" />
      <circle r="146" fill="none" stroke="#f6dfa0" strokeWidth="2" />
      <circle r="140" fill="none" stroke="#8a6024" strokeWidth="1.2" strokeDasharray="2 5" />
      <circle r="128" fill="#d9b06a" />
      <circle r="128" fill="none" stroke="#a87b35" strokeWidth="1" />
      {bowls.map((b, i) => {
        const a = (i / bowls.length) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(a) * 88;
        const y = Math.sin(a) * 88;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r="31" fill="#b88a40" />
            <circle r="28" fill="#e7c47a" />
            <circle r="23" fill={b.fill} />
            <circle r="23" fill="none" stroke={b.rim} strokeWidth="2" />
            {i === 5 && [[-7, -4], [8, 2], [-2, 9]].map(([cx, cy]) => <circle key={`${cx}`} cx={cx} cy={cy} r="7" fill="#5e1f0c" stroke="#3a1206" />)}
            {i === 3 && <path d="M-10 -6q10 -8 20 0M-12 4q12 -8 24 0" stroke="#9fd08a" strokeWidth="1.4" fill="none" />}
            {i === 0 && <circle r="6" fill="#fff4c8" opacity="0.7" />}
          </g>
        );
      })}
      <path d="M-36 6C-36 -30 36 -30 36 6C26 14 -26 14 -36 6Z" fill="#fbf6ea" />
      {Array.from({length: 9}, (_, i) => <circle key={i} cx={-24 + i * 6} cy={-6 + (i % 3) * 4} r="1.2" fill="#e8dcc0" />)}
      <path d="M-50 24A54 54 0 0 1 50 24Z" fill="#e7c48a" stroke="#b5874a" />
      {[[-24, 14], [-4, 8], [18, 16], [32, 20]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3" fill="#a5672a" opacity="0.7" />)}
      <path d="M-2 -40l4 -6M8 -38l3 -7" stroke="#4e8a3a" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function DawatScene() {
  const id = useId();
  return (
    <g>
      <defs>
        <radialGradient id={`${id}bg`} cx="0.5" cy="0.62" r="0.8">
          <stop offset="0" stopColor="#c7462c" />
          <stop offset="0.6" stopColor="#8a1a13" />
          <stop offset="1" stopColor="#4a0b08" />
        </radialGradient>
        <radialGradient id={`${id}lamp`}>
          <stop offset="0" stopColor="#ffd27a" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
        <JaaliPattern id={`${id}j`} stroke="#f2c45a" size={34} sw={0.5} />
      </defs>
      <rect x="-40" y="-40" width="480" height="640" fill={`url(#${id}bg)`} />
      <g data-depth="0.2">
        <rect x="-40" y="-40" width="480" height="640" fill={`url(#${id}j)`} opacity="0.1" />
      </g>
      <g data-depth="0.55">
        {[{x: 110, l: 120, s: 1}, {x: 200, l: 70, s: 1.2}, {x: 290, l: 130, s: 0.95}].map(({x, l, s}, i) => (
          <g key={x} className="anim-sway" style={{animationDelay: `${-i * 1.7}s`, animationDuration: '6.5s'}}>
            <path d={`M${x} -20V${l}`} stroke="#e8c06a" strokeWidth="1" />
            <circle cx={x} cy={l + 34 * s} r={60 * s} fill={`url(#${id}lamp)`} />
            <g transform={`translate(${x} ${l}) scale(${s})`}>
              <path d="M-6 0h12l4 8h-20z" fill="#c58a2c" />
              <path d="M-16 8Q-24 34 -12 58H12Q24 34 16 8Z" fill="#f6b24a" stroke="#c58a2c" strokeWidth="1.5" />
              <path d="M-16 8Q-24 34 -12 58H12Q24 34 16 8Z" fill="#fff1c1" opacity="0.35" className="anim-twinkle" style={{animationDuration: '5s'}} />
              <path d="M0 8V58M-10 10Q-14 34 -6 58M10 10Q14 34 6 58" stroke="#c58a2c" strokeWidth="1" fill="none" />
              <path d="M-12 58h24l-6 8h-12z" fill="#c58a2c" />
              <path d="M0 66v14" stroke="#c58a2c" strokeWidth="1.5" />
              <circle cy="82" r="3" fill="#e2b85e" />
            </g>
          </g>
        ))}
      </g>
      <g data-depth="1">
        <g transform="translate(200 380)">
          <g className="anim-spin">
            <Thali />
          </g>
        </g>
      </g>
      <g data-depth="1.45">
        <Diya x={60} y={540} s={0.9} />
        <Diya x={150} y={552} s={0.75} delay={0.5} />
        <Diya x={250} y={552} s={0.75} delay={1.1} />
        <Diya x={336} y={540} s={0.9} delay={0.3} />
        <Petals count={12} colors={['#f2c45a', '#e0662a', '#fff1c1']} seed={21} area={[0, 160, 400, 380]} />
      </g>
    </g>
  );
}

export const scenes: Record<SceneKey, () => React.ReactElement> = {
  sagaai: SagaaiScene,
  sehra: SehraScene,
  baraat: BaraatScene,
  dawat: DawatScene,
};
