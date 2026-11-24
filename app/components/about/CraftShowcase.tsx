import { useRef } from 'react';
import { CONTAINER, Eyebrow } from '~/components/site/ui';
import { addClip, createScrubTimeline, gsap, inset, useGsapContext } from '~/lib/gsap';

const STAGES = [
  {
    title: 'The Fitting',
    copy: [
      'The process begins with the individual. We consider head shape, proportions, personal style, and how the hat will be worn. Crown height, brim width, and fit are carefully considered to create a silhouette that feels naturally yours.',
    ],
    detail: 'Fitted to the Individual',
    image: '/assets/fitting.jpg',
    alt: 'Mark Alex, founder of Hatwater House, in a dark felt western hat',
    position: '50% 20%',
  },
  {
    title: 'The Felt',
    copy: [
      'Exceptional hats begin with carefully selected materials. Our collection features premium fur felt, chosen for its texture, character, and ability to hold a beautifully defined shape.',
      'From refined rabbit-and-beaver blends to pure beaver felt, each material offers its own distinctive qualities.',
    ],
    detail: 'Materials Chosen with Purpose',
    // TODO(brief): replace with close-up felt texture photography.
    image: '/assets/felt.png',
    alt: 'Silverbelly fur felt hat resting on a pair of western boots',
    position: '50% 30%',
  },
  {
    title: 'Steam & Shape',
    copy: [
      'With steam, practiced hands, and a careful eye for proportion, the hat takes on its individual character.',
      'The crown is creased, the brim shaped, and each line refined until the silhouette achieves the intended balance.',
    ],
    detail: 'Shaped by Hand in Los Angeles',
    image: '/assets/steam-and-shape.png',
    alt: 'A felt hat on a brim board beside the workshop steamer',
    position: '50% 62%',
  },
  {
    title: 'Hand Finishing',
    copy: [
      'The smallest details give a hat its distinction.',
      'Ribbon, trim, and finishing touches are considered with the same care as the silhouette itself. Each hat is inspected, refined, and prepared for the person who will make it their own.',
    ],
    detail: 'Finished with Intention',
    image: '/assets/hand-fitting.png',
    alt: 'Hatter hand-finishing a cream felt hat',
    position: '50% 40%',
  },
];

/**
 * "The Craft": a tall wrapper (one screen of scroll per stage) holds a
 * sticky 100vh stage. One scrubbed timeline (scrub: 1, no pin) wipes each
 * photo up over the last and swaps the copy as you scroll.
 */
export function CraftShowcase() {
  const wrapperRef = useRef<HTMLElement>(null);

  useGsapContext(wrapperRef, () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const tl = createScrubTimeline(wrapper);
    const images = gsap.utils.toArray<HTMLElement>('[data-craft="image"]');
    const copies = gsap.utils.toArray<HTMLElement>('[data-craft="copy"]');
    const steps = gsap.utils.toArray<HTMLElement>('[data-craft="step"]');

    // A short hold at the start and end so the first / last stage can be read.
    tl.to({}, { duration: 0.3 }, 0);
    STAGES.forEach((_, index) => {
      if (index === 0) return;
      const at = index - 0.7;
      addClip(tl, images[index], inset(100, 0, 0, 0), inset(), at, {
        ease: 'power3.inOut',
      });
      tl.fromTo(
        images[index].querySelector('img'),
        { scale: 1.18 },
        { scale: 1, ease: 'power2.out', immediateRender: false },
        at,
      )
        .to(images[index - 1].querySelector('img'), { scale: 1.08, yPercent: -6 }, at)
        .to(copies[index - 1], { autoAlpha: 0, y: -40, duration: 0.4 }, at)
        .fromTo(
          copies[index],
          { autoAlpha: 0, y: 48 },
          { autoAlpha: 1, y: 0, duration: 0.55, immediateRender: false },
          at + 0.3,
        )
        .to(steps[index - 1], { opacity: 0.35, duration: 0.4 }, at + 0.3)
        .to(steps[index], { opacity: 1, duration: 0.4 }, at + 0.3);
    });
    tl.fromTo(
      '[data-craft="progress"]',
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', duration: tl.duration() },
      0,
    );
    tl.to({}, { duration: 0.3 });
  });

  return (
    <section
      ref={wrapperRef}
      id="craft"
      aria-label="How a Hatwater hat is made"
      className="relative h-[420vh] bg-hw-espresso p-0 text-hw-bone"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          className={`${CONTAINER} grid h-full grid-rows-[auto_minmax(0,1fr)_auto] gap-[clamp(16px,2.4vw,40px)] pb-[clamp(20px,3vw,56px)] pt-[clamp(28px,4vw,72px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:grid-rows-[minmax(0,1fr)] lg:items-center lg:gap-[clamp(40px,6vw,120px)]`}
        >
          <div className="flex flex-col gap-[clamp(16px,2vw,40px)] lg:h-full lg:justify-center">
            <Eyebrow className="!text-hw-sand">The Craft</Eyebrow>

            {/* Screen readers get every stage at once; the visual copy cross-fades. */}
            <ol className="sr-only">
              {STAGES.map((stage) => (
                <li key={stage.title}>
                  {stage.title}: {stage.copy.join(' ')}
                </li>
              ))}
            </ol>
            {/* Every stage's copy shares one grid cell. */}
            <div className="grid">
              {STAGES.map((stage, index) => (
                <div
                  key={stage.title}
                  data-craft="copy"
                  aria-hidden
                  className={`col-start-1 row-start-1 flex flex-col gap-[clamp(12px,1.2vw,22px)] ${index > 0 ? 'invisible opacity-0' : ''
                    }`}
                >
                  <span className="font-grotesk text-[clamp(13px,0.85vw,16px)] font-medium tracking-[0.18em] text-hw-copper">
                    {String(index + 1).padStart(2, '0')} /{' '}
                    {String(STAGES.length).padStart(2, '0')}
                  </span>
                  <h3 className="m-0 font-display text-[clamp(36px,5.2vw,100px)] font-normal leading-[0.95] text-hw-bone">
                    {stage.title}
                  </h3>
                  <div className="flex max-w-[48ch] flex-col gap-[0.7em] font-grotesk text-[clamp(14px,1.05vw,19px)] leading-[1.6] text-hw-sand">
                    {stage.copy.map((paragraph) => (
                      <p key={paragraph} className="m-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <p className="m-0 font-grotesk text-[clamp(11px,0.72vw,13px)] uppercase tracking-[0.2em] text-hw-bone/70">
                    {stage.detail}
                  </p>
                </div>
              ))}
            </div>

            <ol aria-hidden className="m-0 hidden list-none gap-[clamp(16px,2vw,36px)] p-0 font-grotesk text-[clamp(12px,0.75vw,14px)] uppercase tracking-[0.16em] lg:flex lg:flex-wrap">
              {STAGES.map((stage, index) => (
                <li
                  key={stage.title}
                  data-craft="step"
                  className={`whitespace-nowrap ${index > 0 ? 'opacity-35' : ''}`}
                >
                  {stage.title}
                </li>
              ))}
            </ol>
          </div>

          <div className="relative row-start-2 h-full min-h-0 lg:row-start-1 lg:col-start-2 lg:h-[min(76vh,880px)]">
            {STAGES.map((stage, index) => (
              <figure
                key={stage.title}
                data-craft="image"
                className="absolute inset-0 m-0 overflow-hidden"
                style={index > 0 ? { clipPath: inset(100, 0, 0, 0) } : undefined}
              >
                <img
                  src={stage.image}
                  alt={stage.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className="size-full object-cover"
                  style={{ objectPosition: stage.position }}
                />
              </figure>
            ))}
            {/* Scroll progress, filled by the same timeline. */}
            <span className="absolute -left-[clamp(14px,1.6vw,32px)] top-0 hidden h-full w-px bg-hw-bone/15 lg:block">
              <span
                data-craft="progress"
                className="block size-full origin-top scale-y-0 bg-hw-copper"
              />
            </span>
          </div>

          <p className="m-0 row-start-3 font-grotesk text-[clamp(11px,0.7vw,13px)] uppercase tracking-[0.2em] text-hw-bone/50 lg:hidden">
            Keep scrolling
          </p>
        </div>
      </div>
    </section>
  );
}
