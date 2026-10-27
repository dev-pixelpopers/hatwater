import {useRef} from 'react';
import {CONTAINER, Eyebrow} from '~/components/site/ui';
import {addClip, createScrubTimeline, gsap, inset, useGsapContext} from '~/lib/gsap';

const STAGES = [
  {
    title: 'The Fitting',
    copy: 'Every Hatwater hat starts with your head, not a size chart. We measure, talk through how and where you’ll wear it, and set the crown height and brim width that suit your face.',
    detail: 'Sizes 6 7/8 – 7 5/8 · bespoke on request',
    image: '/assets/founder-portrait.png',
    alt: 'Hatwater House founder in a dark felt western hat',
    position: '50% 20%',
  },
  {
    title: 'The Felt',
    copy: 'We work in a premium 7X beaver and rabbit blend, or 100% beaver for an heirloom piece – dense felt that sheds weather and holds its shape for years.',
    detail: '7X beaver / rabbit blend · 100% beaver',
    image: '/assets/gallery-03.png',
    alt: 'Silverbelly felt hat resting on a pair of western boots',
    position: '50% 30%',
  },
  {
    title: 'Steam & Shape',
    copy: 'The felt body is steamed until it gives, then blocked by hand: the crown creased, the brim flanged and set, one patient pass at a time.',
    detail: 'Blocked and shaped in the atelier',
    image: '/assets/workshop.jpg',
    alt: 'A felt hat body on a brim board beside the atelier steamer',
    position: '50% 62%',
  },
  {
    title: 'Hand Finishing',
    copy: 'The sweatband is sewn in, the edges trimmed and the signature Hatwater bow set at the band. A last inspection under the lamp – then it’s yours.',
    detail: 'Finished with the signature Hatwater bow',
    image: '/assets/card-craftsman.png',
    alt: 'Hatter hand-stitching the sweatband inside a cream felt hat',
    position: '50% 40%',
  },
];

/**
 * "From head to hat": a tall wrapper (one screen of scroll per stage) holds a
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
    tl.to({}, {duration: 0.3}, 0);
    STAGES.forEach((_, index) => {
      if (index === 0) return;
      const at = index - 0.7;
      addClip(tl, images[index], inset(100, 0, 0, 0), inset(), at, {
        ease: 'power3.inOut',
      });
      tl.fromTo(
        images[index].querySelector('img'),
        {scale: 1.18},
        {scale: 1, ease: 'power2.out', immediateRender: false},
        at,
      )
        .to(images[index - 1].querySelector('img'), {scale: 1.08, yPercent: -6}, at)
        .to(copies[index - 1], {autoAlpha: 0, y: -40, duration: 0.4}, at)
        .fromTo(
          copies[index],
          {autoAlpha: 0, y: 48},
          {autoAlpha: 1, y: 0, duration: 0.55, immediateRender: false},
          at + 0.3,
        )
        .to(steps[index - 1], {opacity: 0.35, duration: 0.4}, at + 0.3)
        .to(steps[index], {opacity: 1, duration: 0.4}, at + 0.3);
    });
    tl.fromTo(
      '[data-craft="progress"]',
      {scaleY: 0},
      {scaleY: 1, ease: 'none', duration: tl.duration()},
      0,
    );
    tl.to({}, {duration: 0.3});
  });

  return (
    <section
      ref={wrapperRef}
      aria-label="How a Hatwater hat is made"
      className="relative h-[420vh] bg-hw-espresso p-0 text-hw-bone"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          className={`${CONTAINER} grid h-full grid-rows-[auto_minmax(0,1fr)_auto] gap-[clamp(16px,2.4vw,40px)] pb-[clamp(20px,3vw,56px)] pt-[clamp(84px,8vw,140px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:grid-rows-[minmax(0,1fr)] lg:items-center lg:gap-[clamp(40px,6vw,120px)]`}
        >
          <div className="flex flex-col gap-[clamp(16px,2vw,40px)] lg:h-full lg:justify-center">
            <Eyebrow className="!text-hw-sand">From head to hat</Eyebrow>

            {/* Screen readers get every stage at once; the visual copy cross-fades. */}
            <ol className="sr-only">
              {STAGES.map((stage) => (
                <li key={stage.title}>
                  {stage.title}: {stage.copy}
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
                  className={`col-start-1 row-start-1 flex flex-col gap-[clamp(12px,1.2vw,22px)] ${
                    index > 0 ? 'invisible opacity-0' : ''
                  }`}
                >
                  <span className="font-grotesk text-[clamp(13px,0.85vw,16px)] font-medium tracking-[0.18em] text-hw-copper">
                    {String(index + 1).padStart(2, '0')} /{' '}
                    {String(STAGES.length).padStart(2, '0')}
                  </span>
                  <h3 className="m-0 font-display text-[clamp(40px,5.2vw,100px)] font-normal capitalize leading-[0.95] text-hw-bone">
                    {stage.title}
                  </h3>
                  <p className="m-0 max-w-[46ch] font-grotesk text-[clamp(15px,1.1vw,20px)] leading-[1.6] text-hw-sand">
                    {stage.copy}
                  </p>
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
                style={index > 0 ? {clipPath: inset(100, 0, 0, 0)} : undefined}
              >
                <img
                  src={stage.image}
                  alt={stage.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className="size-full object-cover"
                  style={{objectPosition: stage.position}}
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
