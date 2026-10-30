import {useLayoutEffect, useRef, type CSSProperties} from 'react';
import {ArchWindow} from '../components/ornaments';
import {scenes} from '../components/scenes';
import {Reveal, SplitText} from '../components/Reveal';
import {RoyalButton} from '../components/RoyalButton';
import {gsap} from '../lib/smooth';
import {downloadIcs, googleCalendarUrl} from '../lib/calendar';
import {ceremonies, type Ceremony} from '../content/wedding';

const DESKTOP = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <rect x="1.5" y="3" width="13" height="11.5" rx="1" />
      <path d="M1.5 6.5H14.5M5 1.2V4.4M11 1.2V4.4" />
    </svg>
  );
}

function Panel({c, index}: {c: Ceremony; index: number}) {
  const Scene = scenes[c.id];
  const flip = index % 2 === 1;
  const light = c.id === 'sehra';
  const style = {
    '--bg': c.palette.bg,
    '--glow': c.palette.glow,
    '--ink': c.palette.ink,
    '--muted': c.palette.muted,
    '--accent': c.palette.accent,
    background: `radial-gradient(90% 80% at ${flip ? '78%' : '22%'} 55%, var(--glow) 0%, var(--bg) 58%)`,
    color: 'var(--ink)',
  } as CSSProperties;

  return (
    <article
      data-panel
      data-header={light ? 'light' : 'dark'}
      aria-labelledby={`${c.id}-title`}
      className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden lg:motion-safe:h-full lg:motion-safe:min-h-0 lg:motion-safe:w-screen lg:motion-safe:shrink-0"
      style={style}
    >
      <p
        aria-hidden="true"
        data-drift="-0.5"
        lang="hi"
        className={`pointer-events-none absolute top-1/2 -z-10 hidden -translate-y-1/2 whitespace-nowrap font-deva-display text-[clamp(14rem,38vw,40rem)] leading-none text-transparent opacity-[0.1] [-webkit-text-stroke:1.5px_currentColor] lg:block ${flip ? 'left-[-6vw]' : 'right-[-8vw]'}`}
        style={{WebkitTextStrokeColor: 'var(--ink)'}}
      >
        {c.devanagari}
      </p>

      <div className={`mx-auto grid w-full max-w-[1680px] items-center gap-10 px-[clamp(1.1rem,3vw,2.75rem)] py-24 lg:grid-cols-12 lg:gap-8 lg:py-0 ${flip ? '' : ''}`}>
        <div className={`relative lg:col-span-5 ${flip ? 'lg:order-2 lg:col-start-8' : 'lg:col-start-1'}`}>
          <div className="relative mx-auto w-[min(86vw,440px)] lg:w-auto lg:h-[min(80vh,760px)] lg:aspect-[428/588]">
            <div aria-hidden="true" className="absolute inset-[8%] -z-10 rounded-t-full blur-3xl" style={{background: 'var(--accent)', opacity: light ? 0.25 : 0.18}} />
            <ArchWindow
              className="h-full w-full drop-shadow-[0_40px_60px_rgb(0_0_0/0.35)]"
              line={light ? '#7b1a12' : '#d8b26a'}
              label={`Painted miniature for ${c.name}`}
            >
              <Scene />
            </ArchWindow>
          </div>
        </div>

        <div className={`relative lg:col-span-6 ${flip ? 'lg:order-1 lg:col-start-1 lg:pl-[2vw]' : 'lg:col-start-7 lg:pr-[2vw]'}`}>
          <div className="eyebrow flex items-center gap-4" style={{color: 'var(--muted)'}}>
            <span className="display text-[1.1rem] normal-case italic tracking-normal" style={{color: 'var(--accent)'}}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="h-px w-10 bg-current" aria-hidden="true" />
            <span>{c.day === 'day-one' ? 'Day One' : 'Day Two'} · {c.weekday}</span>
          </div>

          <h3 id={`${c.id}-title`} className="display mt-6 text-[clamp(3.6rem,8.6vw,8.6rem)] leading-[0.86]">
            <SplitText text={c.name} by={c.name.includes(' ') ? 'word' : 'char'} stagger={0.05} />
          </h3>
          <p className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span lang="hi" className="shloka text-[clamp(1.5rem,2.3vw,2.1rem)] leading-none" style={{color: 'var(--accent)'}}>{c.devanagari}</span>
            <span aria-hidden="true" className="h-px w-8 self-center bg-current opacity-40" />
            <span className="font-display text-[clamp(1.25rem,1.7vw,1.55rem)] italic" style={{color: 'var(--muted)'}}>{c.subtitle}</span>
          </p>

          <div data-drift="0.35" className="mt-8 flex items-end gap-6 border-t pt-6" style={{borderColor: 'color-mix(in srgb, var(--ink) 22%, transparent)'}}>
            <p className="display text-[clamp(4.2rem,9vw,9rem)] leading-[0.78] lining-nums tabular-nums" aria-label={`${c.time} ${c.meridiem}`}>
              {c.time}
              <span className="ml-2 align-top text-[0.28em] italic" style={{color: 'var(--accent)'}}>{c.meridiem}</span>
            </p>
            <p className="eyebrow mb-2 leading-[1.9]" style={{color: 'var(--muted)'}}>
              {c.weekday}
              <br />
              <span style={{color: 'var(--ink)'}}>{c.date}</span>
            </p>
          </div>

          <Reveal as="p" className="mt-7 max-w-[38ch] font-display text-[clamp(1.25rem,1.5vw,1.4rem)] leading-[1.6]" style={{color: 'var(--muted)'}}>
            {c.line}
          </Reveal>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3" style={{color: 'var(--ink)'}}>
            <RoyalButton
              href={googleCalendarUrl(c)}
              target="_blank"
              rel="noreferrer"
              variant="ghost"
              tone={light ? 'sindoor' : 'gold'}
              icon={<CalendarIcon />}
              aria-label={`Add ${c.name} to Google Calendar (opens in a new tab)`}
            >
              Add to calendar
            </RoyalButton>
            <button
              type="button"
              onClick={() => downloadIcs([c], `${c.id}-ankur-ekta.ics`)}
              className="font-display text-[1.05rem] italic underline decoration-current/40 underline-offset-4 transition-opacity hover:opacity-70"
              style={{color: 'var(--muted)'}}
              aria-label={`Download ${c.name} calendar file for Apple or Outlook`}
            >
              Apple / Outlook
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Ceremonies() {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin.current,
            pin: true,
            scrub: 0.9,
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });

        gsap.utils.toArray<HTMLElement>('[data-panel]', el).forEach((panel) => {
          const st = {trigger: panel, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true};
          panel.querySelectorAll<SVGGElement>('[data-depth]').forEach((g) => {
            const d = Number(g.dataset.depth);
            gsap.fromTo(g, {x: 70 * d}, {x: -70 * d, ease: 'none', scrollTrigger: st});
          });
          panel.querySelectorAll<HTMLElement>('[data-drift]').forEach((n) => {
            const d = Number(n.dataset.drift);
            gsap.fromTo(n, {xPercent: 0, x: 180 * d}, {x: -180 * d, ease: 'none', scrollTrigger: st});
          });
        });
      });

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-panel]', track.current).forEach((panel) => {
          const st = {trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true};
          panel.querySelectorAll<SVGGElement>('[data-depth]').forEach((g) => {
            const d = Number(g.dataset.depth);
            gsap.fromTo(g, {y: 30 * d}, {y: -30 * d, ease: 'none', scrollTrigger: st});
          });
        });
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section id="ceremonies" ref={section} tabIndex={-1} aria-labelledby="ceremonies-title" className="relative bg-ink outline-none">
      <div ref={pin} className="relative overflow-hidden lg:motion-safe:h-screen">
        <div ref={track} className="flex flex-col lg:motion-safe:h-full lg:motion-safe:w-max lg:motion-safe:flex-row">
          <div className="relative flex min-h-[90svh] w-full shrink-0 items-center overflow-hidden px-[clamp(1.1rem,3vw,2.75rem)] py-28 lg:motion-safe:h-full lg:motion-safe:min-h-0 lg:motion-safe:w-[78vw] lg:motion-safe:py-0">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_80%,rgb(168_36_27/0.35),transparent_70%),radial-gradient(60%_50%_at_90%_10%,rgb(11_74_85/0.5),transparent_70%)]" />
            <div className="relative max-w-[1100px]">
              <Reveal as="p" className="eyebrow flex items-center gap-4 text-gold">
                <span className="display text-[1.1rem] normal-case italic tracking-normal">II</span>
                <span className="h-px w-12 bg-current" aria-hidden="true" />
                <span>The Celebrations</span>
              </Reveal>
              <h2 id="ceremonies-title" className="display mt-8 text-[clamp(3.2rem,7vw,7.2rem)] leading-[0.95] text-ivory">
                <SplitText text="Four rituals," by="word" stagger={0.08} />
                <br />
                <span className="italic text-haldi">
                  <SplitText text="two golden evenings." by="word" stagger={0.08} delay={0.2} />
                </span>
              </h2>
              <p lang="hi" className="shloka mt-6 text-[clamp(1.4rem,2vw,1.8rem)] text-gold-pale/80">मंगल कार्यक्रम</p>
              <div className="mt-12 grid max-w-[720px] gap-8 sm:grid-cols-2">
                <Reveal delay={0.1} className="border-t border-gold/30 pt-5">
                  <p className="eyebrow text-gold">Friday · 20 November</p>
                  <p className="display mt-3 text-[1.8rem] italic text-ivory">Sagaai</p>
                </Reveal>
                <Reveal delay={0.2} className="border-t border-gold/30 pt-5">
                  <p className="eyebrow text-gold">Saturday · 21 November</p>
                  <p className="display mt-3 text-[1.8rem] italic text-ivory">Sehra Bandi · Baraat · Dawat</p>
                </Reveal>
              </div>
              <Reveal delay={0.3} className="mt-12 flex flex-wrap items-center gap-6 text-ivory">
                <RoyalButton variant="solid" tone="gold" icon={<CalendarIcon />} onClick={() => downloadIcs(ceremonies)}>
                  Save every date
                </RoyalButton>
                <p className="eyebrow hidden text-ivory/50 lg:motion-safe:block">Scroll through the palace →</p>
              </Reveal>
            </div>
          </div>

          {ceremonies.map((c, i) => (
            <Panel key={c.id} c={c} index={i} />
          ))}
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-[clamp(1.1rem,3vw,2.75rem)] bottom-7 hidden items-center gap-5 text-gold-pale lg:motion-safe:flex">
          <span className="eyebrow">II</span>
          <span className="relative h-px flex-1 bg-gold-pale/30">
            <span ref={bar} className="absolute inset-0 origin-left bg-gold-pale" style={{transform: 'scaleX(0)'}} />
          </span>
          <span className="eyebrow">{ceremonies.length.toString().padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  );
}
