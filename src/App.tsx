import {MotionConfig} from 'framer-motion';
import {GateProvider} from './lib/gate';
import {SmoothScroll} from './lib/smooth';
import {Grain} from './components/Grain';
import {Gateway} from './sections/Gateway';
import {Header} from './sections/Header';
import {Hero} from './sections/Hero';
import {Invitation} from './sections/Invitation';
import {Marquee} from './sections/Marquee';
import {Ceremonies} from './sections/Ceremonies';
import {Venue} from './sections/Venue';
import {Finale} from './sections/Finale';
import {MobileDock} from './sections/MobileDock';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <GateProvider>
        <SmoothScroll>
          <a href="#invitation" className="eyebrow fixed left-4 top-4 z-[90] -translate-y-24 rounded-full bg-gold px-5 py-3 text-ink transition-transform focus:translate-y-0">
            Skip to the invitation
          </a>
          <Gateway />
          <Header />
          <main>
            <Hero />
            <Invitation />
            <Marquee />
            <Ceremonies />
            <Venue />
          </main>
          <Finale />
          <MobileDock />
          <Grain />
        </SmoothScroll>
      </GateProvider>
    </MotionConfig>
  );
}
