import React, { useEffect, useRef, useState } from 'react';
import { animate, createScope, createTimeline, onScroll, stagger } from 'animejs';
import {
  ArrowDown,
  BarChart3,
  ChefHat,
  Check,
  Clock3,
  QrCode,
  ScanLine,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const chapters = [
  { label: 'Scan', eyebrow: 'Table 04' },
  { label: 'Choose', eyebrow: 'Live menu' },
  { label: 'Cook', eyebrow: 'Kitchen pass' },
  { label: 'Serve', eyebrow: 'Floor team' },
  { label: 'Learn', eyebrow: 'Manager signal' },
];

export const CinematicStoryOverview: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const { setActiveTab, simulateCustomerOrder } = useStore();

  useEffect(() => {
    if (!rootRef.current || !sequenceRef.current) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compactLayout = window.matchMedia('(max-width: 899px)').matches;
    if (reducedMotion || compactLayout) return;

    const scope = createScope({ root: rootRef.current }).add(() => {
      animate('.cinematic-kicker > span', {
        y: ['110%', '0%'],
        opacity: [0, 1],
        delay: stagger(70),
        duration: 900,
        ease: 'out(4)',
      });

      animate('.hero-rule', {
        scaleX: [0, 1],
        duration: 1100,
        delay: 300,
        ease: 'inOut(3)',
      });

      createTimeline({
        autoplay: onScroll({
          target: sequenceRef.current!,
          enter: 'top top',
          leave: 'bottom bottom',
          sync: 0.35,
        }),
        defaults: { ease: 'linear' },
      })
        .add('.journey-progress', { scaleY: [0, 1], duration: 5000 }, 0)
        .add('.story-ambient', { opacity: [0.22, 0.72], scale: [1.08, 1], duration: 900 }, 0)
        .add('.scene-scan', { opacity: [1, 0], y: [0, -36], duration: 320 }, 650)
        .add('.scene-menu', { opacity: [0, 1], y: [40, 0], duration: 300 }, 780)
        .add('.ticket-item', { opacity: [0, 1], x: [-18, 0], duration: 250, delay: stagger(60) }, 900)
        .add('.scene-menu', { opacity: [1, 0], y: [0, -36], duration: 300 }, 1650)
        .add('.scene-kitchen', { opacity: [0, 1], y: [40, 0], duration: 300 }, 1780)
        .add('.kds-card', { opacity: [0, 1], x: [40, 0], duration: 220, delay: stagger(70) }, 1880)
        .add('.ticket-object', { x: ['0vw', '12vw'], rotate: [-3, 2], scale: [1, 0.9], duration: 900 }, 1750)
        .add('.ticket-status-scan', { opacity: [1, 0], duration: 100 }, 1800)
        .add('.ticket-status-cook', { opacity: [0, 1], duration: 160 }, 1880)
        .add('.scene-kitchen', { opacity: [1, 0], y: [0, -36], duration: 300 }, 2650)
        .add('.scene-floor', { opacity: [0, 1], y: [40, 0], duration: 300 }, 2780)
        .add('.service-route', { strokeDashoffset: [420, 0], duration: 650 }, 2880)
        .add('.ticket-object', { x: ['12vw', '-10vw'], rotate: [2, -2], duration: 900 }, 2730)
        .add('.ticket-status-cook', { opacity: [1, 0], duration: 100 }, 2820)
        .add('.ticket-status-ready', { opacity: [0, 1], duration: 160 }, 2900)
        .add('.scene-floor', { opacity: [1, 0], y: [0, -36], duration: 300 }, 3650)
        .add('.scene-insight', { opacity: [0, 1], y: [40, 0], duration: 300 }, 3780)
        .add('.metric-bar', { scaleY: [0, 1], duration: 420, delay: stagger(65) }, 3900)
        .add('.ticket-object', { x: ['-10vw', '8vw'], rotate: [-2, 0], scale: [0.9, 0.76], duration: 800 }, 3740)
        .add('.ticket-status-ready', { opacity: [1, 0], duration: 100 }, 3820)
        .add('.ticket-status-paid', { opacity: [0, 1], duration: 160 }, 3900)
        .add('.insight-line', { scaleX: [0, 1], duration: 600 }, 4050);
    });

    return () => scope.revert();
  }, []);

  useEffect(() => {
    const updateChapter = () => {
      const section = sequenceRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      setActiveChapter(Math.min(4, Math.floor(progress * 5)));
    };

    updateChapter();
    window.addEventListener('scroll', updateChapter, { passive: true });
    return () => window.removeEventListener('scroll', updateChapter);
  }, []);

  const runStory = () => {
    simulateCustomerOrder();
    sequenceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div ref={rootRef} className="cinematic-story">
      <section className="cinematic-hero" aria-labelledby="story-title">
        <img
          className="cinematic-hero-image"
          src="/story/scan-to-serve-hero.webp"
          alt="A QR table marker and plated dish facing an active open restaurant kitchen"
        />
        <div className="cinematic-hero-shade" />

        <div className="cinematic-hero-copy">
          <div className="cinematic-kicker" aria-label="The service begins">
            {'THE SERVICE BEGINS'.split(' ').map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
          <div className="hero-rule" />
          <h1 id="story-title">
            One order.
            <em>Every team in motion.</em>
          </h1>
          <p>
            Follow a single table from first scan to final insight. This is not a tour of
            features. It is tonight&apos;s service, unfolding in real time.
          </p>
          <div className="cinematic-hero-actions">
            <button type="button" onClick={runStory}>
              Begin the service <ArrowDown aria-hidden="true" />
            </button>
            <button type="button" className="quiet-action" onClick={() => setActiveTab('customer')}>
              Skip to live system
            </button>
          </div>
        </div>

        <div className="hero-service-note">
          <span>FRIDAY</span>
          <strong>19:42</strong>
          <span>DINNER RUSH</span>
        </div>
      </section>

      <section ref={sequenceRef} className="service-sequence" aria-label="Order journey">
        <div className="service-stage">
          <img
            className="story-ambient"
            src="/story/scan-to-serve-hero.webp"
            alt=""
            aria-hidden="true"
          />
          <div className="stage-wash" />

          <nav className="chapter-index" aria-label="Story chapters">
            <div className="journey-track">
              <span className="journey-progress" />
            </div>
            {chapters.map((chapter, index) => (
              <button
                key={chapter.label}
                type="button"
                className={index === activeChapter ? 'active' : ''}
                onClick={() => {
                  const section = sequenceRef.current;
                  if (!section) return;
                  const top = section.offsetTop + (section.offsetHeight - window.innerHeight) * (index / 4);
                  window.scrollTo({ top, behavior: 'smooth' });
                }}
              >
                <span>0{index + 1}</span>
                <strong>{chapter.label}</strong>
                <small>{chapter.eyebrow}</small>
              </button>
            ))}
          </nav>

          <div className="story-scenes">
            <article className="story-frame scene-scan">
              <p className="scene-number">01 / TABLE 04</p>
              <h2>The room recognizes the guest.</h2>
              <p>
                A secure scan binds the table, the live menu, and the service team before
                anyone needs to wave for attention.
              </p>
              <div className="scan-aperture" aria-hidden="true">
                <QrCode />
                <span />
                <ScanLine />
              </div>
            </article>

            <article className="story-frame scene-menu">
              <p className="scene-number">02 / LIVE MENU</p>
              <h2>Only what the kitchen can serve.</h2>
              <p>
                Availability, preparation time, and dietary details update at the moment of
                choice. The promise made at the table is one the kitchen can keep.
              </p>
              <div className="editorial-menu">
                <div className="ticket-item">
                  <span>01</span><strong>Forest mushroom arancini</strong><b>₹420</b>
                </div>
                <div className="ticket-item">
                  <span>02</span><strong>Charred pepper paneer</strong><b>₹560</b>
                </div>
                <div className="ticket-item">
                  <span>03</span><strong>Saffron pistachio kulfi</strong><b>₹280</b>
                </div>
              </div>
            </article>

            <article className="story-frame scene-kitchen">
              <p className="scene-number">03 / THE PASS</p>
              <h2>The ticket lands where work happens.</h2>
              <p>
                No shouted instructions. No duplicate slips. Stations see priority, elapsed
                time, and modifications in one high-contrast kitchen view.
              </p>
              <div className="mini-kds" aria-label="Kitchen order statuses">
                {[
                  ['NEW', '00:18', 'TABLE 04'],
                  ['COOKING', '06:42', 'TABLE 11'],
                  ['READY', '11:08', 'TABLE 02'],
                ].map(([status, time, table]) => (
                  <div className="kds-card" key={status}>
                    <span>{status}</span><strong>{time}</strong><small>{table}</small>
                  </div>
                ))}
              </div>
            </article>

            <article className="story-frame scene-floor">
              <p className="scene-number">04 / FLOOR TEAM</p>
              <h2>Ready becomes a route, not a shout.</h2>
              <p>
                The nearest runner sees the pickup and Table 04 lights up on the floor plan.
                The handoff is visible, timed, and owned.
              </p>
              <div className="floor-canvas">
                <svg viewBox="0 0 520 220" role="img" aria-label="Service route to table 04">
                  <path className="floor-outline" d="M20 20H500V200H20Z M180 20V200 M360 20V200" />
                  <path className="service-route" d="M80 165 C160 150 165 70 260 95 S390 160 450 70" />
                </svg>
                <span className="floor-node kitchen-node"><ChefHat /> PASS</span>
                <span className="floor-node table-node">04</span>
              </div>
            </article>

            <article className="story-frame scene-insight">
              <p className="scene-number">05 / MANAGER SIGNAL</p>
              <h2>Service becomes intelligence.</h2>
              <p>
                Every movement leaves a useful signal. SmartServe turns tonight&apos;s pace
                into tomorrow&apos;s staffing, prep, and inventory decisions.
              </p>
              <div className="insight-board">
                <div className="metric-bars" aria-hidden="true">
                  {[42, 68, 54, 88, 74, 96].map((height, index) => (
                    <span className="metric-bar" style={{ height: `${height}%` }} key={index} />
                  ))}
                </div>
                <div className="ai-note">
                  <Sparkles />
                  <span>GEMINI SHIFT NOTE</span>
                  <strong>Move one prep cook to the grill station before the 20:15 peak.</strong>
                  <i className="insight-line" />
                </div>
              </div>
            </article>
          </div>

          <aside className="ticket-object" aria-label="Table 04 order ticket">
            <header>
              <span>SMARTSERVE / KITCHEN</span><strong>#8042</strong>
            </header>
            <div className="ticket-table">
              <small>TABLE</small><strong>04</strong><Clock3 />
            </div>
            <div className="ticket-lines">
              <p><b>1×</b> MUSHROOM ARANCINI</p>
              <p><b>1×</b> PEPPER PANEER</p>
              <small>NO ONION / MEDIUM SPICE</small>
            </div>
            <div className="ticket-total"><span>TOTAL</span><strong>₹980</strong></div>
            <div className="ticket-stamps">
              <span className="ticket-status-scan">QR VERIFIED</span>
              <span className="ticket-status-cook">ON THE LINE</span>
              <span className="ticket-status-ready">READY / RUNNER 02</span>
              <span className="ticket-status-paid">SERVED & CLOSED</span>
            </div>
          </aside>

          <div className="stage-caption">
            <span>Scroll to conduct service</span>
            <strong>SmartServe OS / Live operation</strong>
          </div>
        </div>
      </section>

      <section className="system-entry">
        <div>
          <p>THE STORY CONTINUES IN THE SYSTEM</p>
          <h2>Now run the restaurant.</h2>
        </div>
        <div className="system-entry-grid">
          <button type="button" onClick={() => setActiveTab('customer')}>
            <QrCode /><span>Customer menu<small>Scan, choose, order</small></span>
          </button>
          <button type="button" onClick={() => setActiveTab('kitchen')}>
            <ChefHat /><span>Kitchen KDS<small>Accept, cook, release</small></span>
          </button>
          <button type="button" onClick={() => setActiveTab('staff')}>
            <UtensilsCrossed /><span>Floor service<small>Route, serve, reset</small></span>
          </button>
          <button type="button" onClick={() => setActiveTab('analytics')}>
            <BarChart3 /><span>Manager signal<small>Measure, predict, act</small></span>
          </button>
        </div>
        <div className="system-proof">
          <span><Check /> One shared order state</span>
          <span><Check /> Role-aware operations</span>
          <span><Check /> Server-verified totals</span>
        </div>
      </section>
    </div>
  );
};
