import {AnimatePresence, motion, useMotionValueEvent, useScroll} from 'framer-motion';
import {useState} from 'react';
import {useGate} from '../lib/gate';
import {useSmooth} from '../lib/smooth';
import {mapsLink} from '../content/wedding';

const links = [
  {href: '#ceremonies', label: 'कार्यक्रम'},
  {href: '#venue', label: 'स्थल'},
  {href: mapsLink, label: 'मानचित्र ↗', strong: true, external: true},
];

export function MobileDock() {
  const {opened} = useGate();
  const smooth = useSmooth();
  const {scrollY} = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => setShow(v > window.innerHeight * 0.7));

  return (
    <AnimatePresence>
      {opened && show && (
        <motion.nav
          aria-label="Quick links"
          initial={{y: 90, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          exit={{y: 90, opacity: 0}}
          transition={{type: 'spring', stiffness: 260, damping: 28}}
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 lg:hidden"
        >
          <ul className="flex items-center justify-between gap-1 rounded-full border border-gold/40 bg-ink/95 p-1.5 shadow-[0_20px_40px_-10px_rgb(0_0_0/0.7)]">
            {links.map((l) => (
              <li key={l.href} className="flex-1">
                <a
                  href={l.href}
                  {...(l.external
                    ? {target: '_blank', rel: 'noreferrer', 'aria-label': 'Open venue in Google Maps'}
                    : {
                        onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          smooth.scrollTo(l.href);
                        },
                      })}
                  lang="hi"
                  className={`eyebrow block rounded-full px-3 py-3 text-center ${l.strong ? 'bg-gold text-ink' : 'text-ivory/85'}`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
