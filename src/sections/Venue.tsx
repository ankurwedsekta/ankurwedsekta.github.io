import {useRef, useState} from 'react';
import {AnimatePresence, motion, useScroll, useTransform} from 'framer-motion';
import {PalaceMap} from '../components/PalaceMap';
import {Reveal, SplitText} from '../components/Reveal';
import {ArrowIcon, RoyalButton} from '../components/RoyalButton';
import {Divider} from '../components/ornaments';
import {mapsEmbed, mapsLink, venue, venueAddress} from '../content/wedding';

export function Venue() {
  const ref = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<'painted' | 'live'>('painted');
  const [copied, setCopied] = useState(false);
  const {scrollYProgress} = useScroll({target: ref, offset: ['start end', 'end start']});
  const mapY = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);
  const wordX = useTransform(scrollYProgress, [0, 1], ['4%', '-10%']);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(venueAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="venue" ref={ref} tabIndex={-1} aria-labelledby="venue-title" className="relative isolate overflow-hidden bg-peacock-deep text-ivory outline-none">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_85%_30%,rgb(20_96_107/0.55),transparent_70%),radial-gradient(50%_40%_at_10%_90%,rgb(168_36_27/0.25),transparent_70%)]" />
      <motion.p
        aria-hidden="true"
        lang="hi"
        style={{x: wordX}}
        className="display pointer-events-none absolute -bottom-[0.3em] left-0 -z-10 whitespace-nowrap text-[clamp(9rem,26vw,26rem)] text-ivory/[0.04]"
      >
        अवध महल
      </motion.p>

      <div className="mx-auto grid max-w-[1680px] grid-cols-12 gap-x-[clamp(1rem,2vw,2rem)] gap-y-16 px-[clamp(1.1rem,3vw,2.75rem)] py-[clamp(6rem,16vh,11rem)]">
        <div className="col-span-12 lg:col-span-5">
          <Reveal as="p" className="eyebrow flex items-center gap-4 text-gold">
            <span className="display text-[1.1rem] normal-case italic tracking-normal">III</span>
            <span className="h-px w-12 bg-current" aria-hidden="true" />
            <span>The Venue</span>
          </Reveal>
          <h2 id="venue-title" className="display mt-10 text-[clamp(4.6rem,11vw,10rem)]">
            <SplitText text={venue.name} stagger={0.06} />
            <span className="mt-2 block text-[0.42em] italic leading-[1] text-haldi">
              <SplitText text={venue.subtitle} by="word" delay={0.3} stagger={0.08} />
            </span>
          </h2>
          <Divider className="mt-10 w-48 text-gold" />
          <Reveal as="div" delay={0.2} className="mt-8">
            <address className="font-display text-[1.35rem] not-italic leading-[1.6] text-ivory/85">
              {venue.name} ({venue.subtitle})
              {venue.lines.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </address>
            <p className="mt-6 max-w-[36ch] font-display text-[1.25rem] italic leading-[1.6] text-ivory/65">
              Both evenings unfold here. Do arrive a little early — the courtyard diyas are lit at dusk.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-3">
            <RoyalButton href={mapsLink} target="_blank" rel="noreferrer" variant="solid" tone="gold" icon={<ArrowIcon />} aria-label="Open the venue in Google Maps (opens in a new tab)">
              Open in Google Maps
            </RoyalButton>
            <RoyalButton variant="ghost" tone="ivory" onClick={copy}>
              {copied ? 'Address copied' : 'Copy address'}
            </RoyalButton>
          </Reveal>
          <p role="status" aria-live="polite" className="sr-only">{copied ? 'Address copied to clipboard' : ''}</p>
        </div>

        <motion.div style={{y: mapY}} className="col-span-12 lg:col-span-7 lg:pt-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="eyebrow text-ivory/55">{mode === 'painted' ? 'As painted by the court artist' : 'Live map · Google'}</p>
            <div role="group" aria-label="Map style" className="relative flex rounded-full border border-gold/40 p-1">
              {(['painted', 'live'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                  className={`eyebrow relative z-10 rounded-full px-4 py-2 transition-colors duration-500 ${mode === m ? 'text-ink' : 'text-ivory/70 hover:text-ivory'}`}
                >
                  {mode === m && (
                    <motion.span layoutId="map-toggle" className="absolute inset-0 -z-10 rounded-full bg-gold" transition={{type: 'spring', stiffness: 380, damping: 32}} />
                  )}
                  {m === 'painted' ? 'Painted' : 'Live'}
                </button>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-t-[50%_18%] border border-gold/40 bg-[#efe2c4] p-2 shadow-[0_50px_100px_-30px_rgb(0_0_0/0.7)]">
            <div className="overflow-hidden rounded-t-[50%_17%]">
              <AnimatePresence mode="wait" initial={false}>
                {mode === 'painted' ? (
                  <motion.div key="painted" initial={{opacity: 0, scale: 1.04}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.98}} transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1]}}>
                    <PalaceMap />
                  </motion.div>
                ) : (
                  <motion.div key="live" className="aspect-[800/620] w-full bg-[#efe2c4]" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.5}}>
                    <iframe
                      title="Google Map of Orriva (Awadh Palace), Rajnagar Extension, Ghaziabad"
                      src={mapsEmbed}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-full w-full border-0 [filter:sepia(0.35)_saturate(0.9)_contrast(1.02)]"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
