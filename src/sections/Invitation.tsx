import {useRef} from 'react';
import {motion, useScroll, useTransform} from 'framer-motion';
import {Reveal, ScriptName, SplitText} from '../components/Reveal';
import {Divider, Rosette} from '../components/ornaments';
import {couple, families} from '../content/wedding';

function Person({name, relation, parents, extra, align = 'left'}: {name: string; relation: string; parents: string; extra?: string; align?: 'left' | 'right'}) {
  return (
    <div className={`flex flex-col gap-4 ${align === 'right' ? 'items-end text-right' : ''}`}>
      <h3 className="font-names text-[clamp(4.4rem,12vw,10.5rem)] leading-[1.15] text-sindoor">
        <ScriptName text={name} />
      </h3>
      <Reveal as="p" delay={0.25} className="max-w-[30ch] text-[1.1rem] leading-relaxed text-umber/80">
        <span lang="hi" className="eyebrow mb-1 block text-peacock">{relation}</span>
        <span lang="hi">{parents}</span>
        {extra && <span lang="hi" className="mt-2 block text-[0.98rem] text-umber/60">{extra}</span>}
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
              <p lang="sa" className="mt-3 max-w-[30ch] font-deva text-[0.95rem] leading-[1.85] text-umber/70">
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
            <span lang="hi">निमंत्रण</span>
          </Reveal>

          <h2 id="invitation-title" lang="hi" className="display mt-10 max-w-[16ch] text-[clamp(2.3rem,4.6vw,4.4rem)] text-ink">
            <SplitText text="सात फेरे, सात वचन," stagger={0.06} />
            <span className="block text-sindoor">
              <SplitText text="सात जन्मों का साथ।" stagger={0.06} delay={0.3} />
            </span>
          </h2>

          <div className="mt-16 grid grid-cols-8 gap-x-[clamp(1rem,2vw,2rem)] gap-y-10">
            <Reveal className="col-span-8 md:col-span-6 md:col-start-2" delay={0.1}>
              <p lang="hi" className="text-[clamp(1.15rem,1.4vw,1.32rem)] leading-[1.95] text-umber/85">
                सविनय निवेदन है कि हमारे सुपुत्र <strong className="font-normal text-ink">चि. अंकुर</strong> का शुभ विवाह{' '}
                <strong className="font-normal text-ink">सौ.कां. एकता</strong> के संग होना निश्चित हुआ है। इस मंगल अवसर पर
                आप सपरिवार पधारकर वर-वधू को अपना आशीर्वाद प्रदान करें।
              </p>
              <p lang="hi" className="mt-6 text-[1.05rem] text-sindoor">
                विनीत — <span className="text-ink">{families.groomParents}</span>
              </p>
            </Reveal>
          </div>

          <div className="relative mt-[clamp(4rem,10vh,8rem)] flex flex-col gap-[clamp(2rem,6vh,4rem)]">
            <Person name={couple.groom} relation="सुपुत्र" parents={families.groomParents} />
            <div className="flex items-center gap-6 self-center text-gold" aria-hidden="true">
              <Divider className="w-[clamp(90px,14vw,200px)]" />
              <span lang="hi" className="shloka text-[clamp(2rem,3.2vw,2.9rem)] leading-none text-gold">संग</span>
              <Divider className="w-[clamp(90px,14vw,200px)]" />
            </div>
            <Person
              name={couple.bride}
              relation="सुपुत्री"
              parents={families.brideParents}
              extra={`पौत्री — ${families.brideGrandparents}`}
              align="right"
            />
          </div>

          <Reveal className="mt-[clamp(4rem,10vh,7rem)] grid grid-cols-8 gap-x-[clamp(1rem,2vw,2rem)] border-t border-ink/15 pt-8">
            <div className="col-span-8 md:col-span-4">
              <p lang="sa" className="shloka text-[clamp(1.8rem,2.5vw,2.3rem)] leading-tight text-sindoor">अतिथि देवो भव</p>
              <p lang="hi" className="mt-2 text-[1.08rem] leading-relaxed text-umber/75">आपकी उपस्थिति ही हमारा सौभाग्य है।</p>
            </div>
            <p className="col-span-8 mt-4 md:col-span-3 md:col-start-6 md:mt-2 md:text-right" lang="hi">
              <span className="eyebrow block text-umber/60">दर्शनाभिलाषी</span>
              <span className="mt-1 block text-[1.1rem] text-ink">{families.compliments}</span>
            </p>
          </Reveal>
        </div>

        <div aria-hidden="true" className="absolute right-[clamp(0.6rem,1.4vw,1.6rem)] top-1/2 hidden -translate-y-1/2 xl:block">
          <p lang="hi" className="font-deva text-[0.9rem] text-umber/45 [writing-mode:vertical-rl]">२० · २१ नवम्बर २०२६</p>
        </div>
      </div>
    </section>
  );
}
