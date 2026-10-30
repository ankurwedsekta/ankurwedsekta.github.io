import {useRef} from 'react';
import {motion, useScroll, useTransform} from 'framer-motion';
import {Reveal, ScriptName, SplitText} from '../components/Reveal';
import {Divider, Rosette} from '../components/ornaments';
import {couple, families} from '../content/wedding';

function Person({name, relation, parents, extra, align = 'left'}: {name: string; relation: string; parents: string; extra?: string; align?: 'left' | 'right'}) {
  return (
    <div className={`flex flex-col gap-3 ${align === 'right' ? 'items-end text-right' : ''}`}>
      <h3 className="font-names text-[clamp(4.4rem,12vw,10.5rem)] leading-[1.15] text-sindoor">
        <ScriptName text={name} />
      </h3>
      <Reveal as="p" delay={0.25} className="max-w-[34ch] font-display text-[clamp(1.15rem,1.5vw,1.35rem)] leading-relaxed text-umber/85">
        <span className="eyebrow mb-2 block text-peacock">{relation}</span>
        <span className="text-ink">{parents}</span>
        {extra && <span className="mt-1 block text-[0.95em] italic text-umber/65">{extra}</span>}
      </Reveal>
    </div>
  );
}

export function Invitation() {
  const ref = useRef<HTMLElement>(null);
  const {scrollYProgress} = useScroll({target: ref, offset: ['start end', 'end start']});
  const spin = useTransform(scrollYProgress, [0, 1], [-90, 120]);
  const drift = useTransform(scrollYProgress, [0, 1], ['8%', '-18%']);

  return (
    <section id="invitation" ref={ref} tabIndex={-1} data-header="light" aria-labelledby="invitation-title" className="paper relative overflow-hidden text-ink outline-none">
      <motion.div aria-hidden="true" style={{rotate: spin, y: drift}} className="pointer-events-none absolute -left-[22vw] top-[18%] size-[62vw] max-w-[900px] text-sindoor/[0.07]">
        <Rosette className="size-full" sw={0.5} />
      </motion.div>

      <div className="relative mx-auto grid max-w-[1680px] grid-cols-12 gap-x-[clamp(1rem,2vw,2rem)] px-[clamp(1.1rem,3vw,2.75rem)] py-[clamp(6rem,16vh,12rem)]">
        <aside className="col-span-12 mb-16 lg:col-span-3 lg:mb-0">
          <div className="lg:sticky lg:top-28 flex flex-row items-center gap-6 lg:flex-col lg:items-start">
            <div className="relative size-[clamp(92px,11vw,150px)] shrink-0 text-sindoor">
              <Rosette className="anim-spin size-full" sw={0.9} fills={{inner: 'rgb(228 155 52 / 0.25)', core: '#a8241b'}} />
            </div>
            <div>
              <p className="font-deva-display text-[1.4rem] leading-snug text-sindoor" lang="sa">॥ श्री गणेशाय नमः ॥</p>
              <p lang="sa" className="mt-3 hidden max-w-[30ch] font-deva text-[0.95rem] leading-[1.85] text-umber/70 lg:block">
                वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।
                <br />
                निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
              </p>
            </div>
          </div>
        </aside>

        <div className="col-span-12 lg:col-span-8 lg:col-start-5">
          <Reveal as="p" className="eyebrow flex items-center gap-4 text-peacock">
            <span className="display text-[1.1rem] normal-case italic tracking-normal">I</span>
            <span className="h-px w-12 bg-current" aria-hidden="true" />
            <span>The Invitation</span>
          </Reveal>

          <h2 id="invitation-title" className="display mt-10 max-w-[18ch] text-[clamp(2.9rem,5.6vw,5.6rem)] leading-[0.98] text-ink">
            <SplitText text="Saat phere, saat vachan —" by="word" stagger={0.06} />
            <span className="block italic text-sindoor">
              <SplitText text="saath janmon ka saath." by="word" stagger={0.06} delay={0.3} />
            </span>
          </h2>

          <div className="mt-14 grid grid-cols-8 gap-x-[clamp(1rem,2vw,2rem)] gap-y-10">
            <Reveal className="col-span-8 md:col-span-6 md:col-start-2" delay={0.1}>
              <p className="font-display text-[clamp(1.3rem,1.7vw,1.6rem)] leading-[1.6] text-umber/90">
                With the blessings of the Almighty and our elders, we joyfully invite you and your family to celebrate the wedding of our son{' '}
                <strong className="font-semibold text-ink">Ankur</strong> with <strong className="font-semibold text-ink">Ekta</strong>. Come, bless the couple
                as they begin forever — the celebration is incomplete without you.
              </p>
              <p className="mt-6 font-display text-[1.2rem] italic text-sindoor">
                With love, <span className="not-italic text-ink">{families.groomParentsEn}</span>
              </p>
            </Reveal>
          </div>

          <div className="relative mt-[clamp(4rem,10vh,8rem)] flex flex-col gap-[clamp(2rem,6vh,4rem)]">
            <Person name={couple.groom} relation="Son of" parents={families.groomParentsEn} />
            <div className="flex items-center gap-6 self-center text-gold" aria-hidden="true">
              <Divider className="w-[clamp(70px,14vw,200px)]" />
              <span lang="hi" className="shloka text-[clamp(2rem,3.2vw,2.9rem)] leading-none text-gold">संग</span>
              <Divider className="w-[clamp(70px,14vw,200px)]" />
            </div>
            <Person
              name={couple.bride}
              relation="Daughter of"
              parents={families.brideParentsEn}
              extra={`Granddaughter of ${families.brideGrandparentsEn}`}
              align="right"
            />
          </div>

          <Reveal className="mt-[clamp(4rem,10vh,7rem)] grid grid-cols-8 gap-x-[clamp(1rem,2vw,2rem)] border-t border-ink/15 pt-8">
            <div className="col-span-8 md:col-span-4">
              <p lang="sa" className="shloka text-[clamp(1.8rem,2.5vw,2.3rem)] leading-tight text-sindoor">अतिथि देवो भव</p>
              <p className="mt-2 font-display text-[1.25rem] italic leading-relaxed text-umber/80">Your presence is our greatest blessing.</p>
            </div>
            <p className="col-span-8 mt-6 md:col-span-3 md:col-start-6 md:mt-2 md:text-right">
              <span className="eyebrow block text-umber/60">With best compliments</span>
              <span className="mt-2 block font-display text-[1.3rem] text-ink">{families.complimentsEn}</span>
            </p>
          </Reveal>
        </div>

        <div aria-hidden="true" className="absolute right-[clamp(0.6rem,1.4vw,1.6rem)] top-1/2 hidden -translate-y-1/2 xl:block">
          <p className="eyebrow text-umber/45 [writing-mode:vertical-rl]">20 · 21 November 2026</p>
        </div>
      </div>
    </section>
  );
}
