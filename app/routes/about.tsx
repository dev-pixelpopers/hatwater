import {useRef} from 'react';
import {Link} from 'react-router';
import type {Route} from './+types/about';
import {AtelierValues} from '~/components/about/AtelierValues';
import {CraftShowcase} from '~/components/about/CraftShowcase';
import {APPOINTMENT_URL} from '~/components/site/links';
import {
  ArrowPill,
  CONTAINER,
  Eyebrow,
  SplitWords,
  useScrollReveal,
} from '~/components/site/ui';
import {gsap, prefersReducedMotion, useGsapContext} from '~/lib/gsap';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'About | Hatwater House'},
    {
      name: 'description',
      content:
        'Hatwater House is a Los Angeles hat studio where Western heritage, individual style, and traditional craftsmanship meet. Founded by hatmaker Mark Alex.',
    },
  ];
};

export const handle = {fullBleed: true};

const FOUNDER_CALLOUTS = [
  'California Heritage',
  'Premium Fur Felt',
  'Individually Finished',
];

export default function About() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  useScrollReveal(rootRef);

  useGsapContext(heroRef, () => {
    const hero = heroRef.current;
    if (!hero) return;
    if (!prefersReducedMotion()) {
      gsap
        .timeline({defaults: {ease: 'expo.out'}})
        .from('[data-hero="image"]', {scale: 1.2, duration: 2.2})
        .from(
          '[data-hero="title"] [data-word]',
          {yPercent: 115, duration: 1.3, stagger: 0.07},
          0.15,
        )
        .from(
          '[data-hero="fade"]',
          {autoAlpha: 0, y: 24, duration: 1, stagger: 0.12},
          0.6,
        );
    }
    // Parallax out as the hero scrolls away (scrub: 1, no pin).
    gsap
      .timeline({
        defaults: {ease: 'none'},
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
      .to('[data-hero="media"]', {yPercent: 18}, 0)
      .to('[data-hero="copy"]', {yPercent: -30, autoAlpha: 0.2}, 0);
  });

  return (
    <div ref={rootRef} className="hw-page bg-hw-cream font-grotesk text-hw-espresso">
      {/* Hero banner */}
      <section
        ref={heroRef}
        aria-label="Hatwater House"
        className="relative isolate flex h-[calc(100svh-var(--header-h))] min-h-[560px] items-end overflow-hidden bg-hw-espresso p-0 text-hw-bone"
      >
        <div data-hero="media" className="absolute inset-0 -z-10">
          <img
            data-hero="image"
            src="/assets/card-cigar.png"
            alt="A man in a Hatwater felt western hat on the California coast"
            className="size-full object-cover object-[50%_28%]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-hw-espresso via-hw-espresso/65 to-hw-espresso/10" />
        </div>

        <div
          data-hero="copy"
          className={`${CONTAINER} grid gap-8 pb-[clamp(36px,5vw,96px)] lg:grid-cols-[1.5fr_1fr] lg:items-end`}
        >
          <div className="flex flex-col gap-[clamp(14px,1.4vw,26px)]">
            <div data-hero="fade">
              <Eyebrow className="!text-hw-sand">Our Story</Eyebrow>
            </div>
            <h1
              data-hero="title"
              className="m-0 font-display text-[clamp(46px,7vw,140px)] font-normal leading-[0.94] tracking-[-0.01em] text-hw-bone"
            >
              <SplitWords text="A California Point of View." />
            </h1>
          </div>
          <div
            data-hero="fade"
            className="flex max-w-[46ch] flex-col items-start gap-[clamp(12px,1vw,18px)] text-[clamp(15px,1.05vw,19px)] leading-[1.6] text-hw-bone [text-shadow:0_1px_12px_rgb(43_22_10/0.45)]"
          >
            <p className="m-0">
              Hatwater House is a Los Angeles hat studio where Western heritage,
              individual style, and traditional craftsmanship meet.
            </p>
            <p className="m-0">
              Founded by hatmaker Mark Alex, the house draws inspiration from
              California’s distinctive Western history — from its ranching
              traditions and vaquero culture to the unmistakable influence of
              Hollywood.
            </p>
            <ArrowPill to="#craft" label="Discover the Craft" className="mt-2" />
          </div>
        </div>
      </section>

      {/* Origin story */}
      <section
        aria-labelledby="origin-heading"
        className={`${CONTAINER} grid gap-[clamp(36px,6vw,120px)] py-[clamp(72px,10vw,190px)] lg:grid-cols-[1fr_1.1fr] lg:items-center`}
      >
        <figure data-reveal="slow" className="relative m-0 aspect-[4/5] overflow-hidden lg:aspect-[5/6]">
          <img
            src="/assets/founder-portrait.png"
            alt="Mark Alex, founder of Hatwater House"
            loading="lazy"
            className="size-full object-cover object-[50%_25%]"
          />
          <figcaption className="absolute bottom-0 left-0 bg-hw-cream px-4 py-2 text-[clamp(11px,0.7vw,13px)] uppercase tracking-[0.18em] text-hw-taupe">
            Mark Alex, founder
          </figcaption>
        </figure>

        <div className="flex flex-col gap-[clamp(18px,1.8vw,32px)]">
          <div data-reveal>
            <Eyebrow>The Founder</Eyebrow>
          </div>
          <h2
            id="origin-heading"
            data-reveal
            className="m-0 font-display text-[clamp(38px,4.2vw,82px)] font-normal leading-[1] text-hw-espresso"
          >
            Mark Alex
          </h2>
          <p data-reveal className="m-0 max-w-[56ch] font-display text-[clamp(20px,1.6vw,30px)] leading-[1.4] text-hw-espresso">
            A lifelong appreciation for Western culture, craftsmanship, and
            individual expression is at the heart of Hatwater House.
          </p>
          <p data-reveal className="m-0 max-w-[56ch] text-[clamp(16px,1.1vw,20px)] leading-[1.7] text-hw-taupe">
            For Mark Alex, a hat is more than an accessory. It is an extension
            of the person who wears it — reflecting their character,
            confidence, and personal sense of style.
          </p>
          <p data-reveal className="m-0 max-w-[56ch] text-[clamp(16px,1.1vw,20px)] leading-[1.7] text-hw-taupe">
            From the selection of the silhouette to its final proportions and
            finishing details, the aim is simple: to create a hat that feels
            unmistakably your own.
          </p>
          <ul
            data-reveal
            className="m-0 grid list-none gap-4 border-t border-hw-espresso/15 p-0 pt-[clamp(18px,1.8vw,32px)] sm:grid-cols-3"
          >
            {FOUNDER_CALLOUTS.map((callout, index) => (
              <li key={callout} className="flex flex-col gap-1">
                <span className="font-grotesk text-[clamp(11px,0.72vw,13px)] font-medium tracking-[0.16em] text-hw-copper">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-[clamp(20px,1.5vw,28px)] leading-[1.15] text-hw-espresso">
                  {callout}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CraftShowcase />

      {/* Values / atelier */}
      <section
        aria-labelledby="values-heading"
        className={`${CONTAINER} flex flex-col gap-[clamp(28px,3.4vw,64px)] py-[clamp(72px,10vw,190px)]`}
      >
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div className="flex flex-col gap-[clamp(14px,1.4vw,24px)]">
            <div data-reveal>
              <Eyebrow>Our Principles</Eyebrow>
            </div>
            <h2
              id="values-heading"
              data-reveal
              className="m-0 font-display text-[clamp(38px,4.2vw,82px)] font-normal leading-[1] text-hw-espresso"
            >
              What We Hold To
            </h2>
          </div>
          <p data-reveal className="m-0 max-w-[44ch] text-[clamp(16px,1.05vw,19px)] leading-[1.7] text-hw-taupe">
            Four principles behind every hat that leaves the bench. Hover or tap
            to open each one.
          </p>
        </div>
        <AtelierValues />
      </section>

      {/* Appointment CTA */}
      <section aria-labelledby="cta-heading" className={`${CONTAINER} pb-[clamp(72px,9vw,170px)]`}>
        <div
          data-reveal
          className="relative isolate grid overflow-hidden text-hw-bone lg:grid-cols-[1.2fr_1fr]"
        >
          <div className="absolute inset-0 -z-10 hw-panel-gradient" />
          <div className="flex flex-col items-start gap-[clamp(18px,1.8vw,30px)] px-[clamp(24px,5vw,96px)] py-[clamp(48px,6vw,120px)]">
            <Eyebrow className="!text-hw-sand">Commissions</Eyebrow>
            <h2
              id="cta-heading"
              className="m-0 font-display text-[clamp(40px,4.6vw,90px)] font-normal leading-[0.98] text-hw-bone"
            >
              Beyond the Collection.
            </h2>
            <p className="m-0 max-w-[46ch] text-[clamp(16px,1.05vw,19px)] leading-[1.7] text-hw-sand">
              For those seeking something entirely their own, Hatwater House
              offers individual commissions guided by personal style,
              proportion, and the finer details.
            </p>
            <p className="m-0 max-w-[46ch] font-display text-[clamp(20px,1.5vw,28px)] leading-[1.4] text-hw-bone">
              A distinctive silhouette. A particular color. A hat created with
              one person in mind.
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <ArrowPill to={APPOINTMENT_URL} label="Begin Your Commission" />
              <Link
                to="/collections/all"
                prefetch="intent"
                className="border-b border-hw-sand/50 pb-1 text-[clamp(13px,0.85vw,15px)] font-medium uppercase tracking-[0.1em] text-hw-bone no-underline transition-colors hover:border-hw-bone hover:no-underline"
              >
                Explore the Collection
              </Link>
            </div>
          </div>
          <img
            src="/assets/woman.png"
            alt=""
            loading="lazy"
            className="pointer-events-none h-[clamp(280px,32vw,620px)] w-full self-end object-cover object-[70%_0%] max-lg:-mt-6"
          />
        </div>
      </section>
    </div>
  );
}
