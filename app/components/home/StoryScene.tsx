import {useRef} from 'react';
import {
  addClip,
  createScrubTimeline,
  gsap,
  inset,
  ofSize,
  useGsapContext,
} from '~/lib/gsap';
import {ScrollScene} from './ScrollScene';

/** Height of the monogram + skyline group in Figma pixels. */
const GROUP_HEIGHT = 1300;
const SKYLINE_HEIGHT = 889;
const PORTRAIT = {width: 598, height: 691};
const WORKSHOP = {width: 406, height: 660};
const COPY_HEIGHT = 350;
const END_HOLD = 0.3;
/** Only the centre stem (x 537-616) of the monogram frame is visible. */
const MONOGRAM_STEM = inset(0, 46.5, 0, 46.5);
const COPY_HIDDEN = inset(0, 0, 93.14);
export const STORY_UNITS = 5 + END_HOLD;

/**
 * Founder story (Figma variants 16 -> 21): the HH stem opens into the full
 * monogram, the old-town skyline rises, then the founder portrait, workshop
 * shot and copy settle into place. Layout is the Variant21 end state; the
 * timeline animates in from offsets.
 */
export function StoryScene() {
  const wrapperRef = useRef<HTMLElement>(null);
  const artboardRef = useRef<HTMLDivElement>(null);

  useGsapContext(wrapperRef, () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const group = '[data-anim="story-group"]';
    const skyline = '[data-anim="skyline"]';
    const portrait = '[data-anim="portrait"]';
    const workshop = '[data-anim="workshop"]';
    const copy = '[data-anim="story-copy"]';

    // Variant16: only the monogram's centre stem is visible.
    gsap.set(group, {yPercent: ofSize(994, GROUP_HEIGHT)});
    gsap.set('[data-anim="story-monogram"]', {
      clipPath: MONOGRAM_STEM,
    });
    gsap.set('[data-anim="story-fade"]', {
      scaleY: 0.034,
      transformOrigin: '50% 0%',
    });
    gsap.set(skyline, {yPercent: ofSize(530.5, SKYLINE_HEIGHT), scale: 0.409});
    gsap.set(portrait, {
      xPercent: ofSize(311, PORTRAIT.width),
      yPercent: ofSize(1088, PORTRAIT.height),
    });
    gsap.set(workshop, {
      xPercent: ofSize(-306, WORKSHOP.width),
      yPercent: ofSize(700, WORKSHOP.height),
    });
    gsap.set(copy, {
      yPercent: ofSize(100, COPY_HEIGHT),
      clipPath: COPY_HIDDEN,
    });

    const tl = createScrubTimeline(wrapper);

    // 16 -> 17: stem opens into the full gradient monogram.
    addClip(tl, '[data-anim="story-monogram"]', MONOGRAM_STEM, inset(), 0);
    tl.to('[data-anim="story-fade"]', {scaleY: 1}, 0);

    // 17 -> 18: skyline rises and widens to full bleed.
    tl.to(skyline, {yPercent: ofSize(220, SKYLINE_HEIGHT), scale: 1}, 1);

    // 18 -> 19: monogram scrolls away, founder portrait arrives centre stage.
    tl.to(group, {yPercent: ofSize(170, GROUP_HEIGHT)}, 2)
      .to(skyline, {yPercent: ofSize(130, SKYLINE_HEIGHT)}, 2)
      .to(portrait, {yPercent: ofSize(280, PORTRAIT.height)}, 2);

    // 19 -> 20: portrait moves left, workshop shot rises on the right.
    tl.to(group, {yPercent: 0}, 3)
      .to(skyline, {yPercent: 0}, 3)
      .to(portrait, {xPercent: 0, yPercent: 0}, 3)
      .to(workshop, {xPercent: 0, yPercent: 0}, 3)
      .to(copy, {yPercent: 0}, 3);

    // 20 -> 21: copy is revealed.
    addClip(tl, copy, COPY_HIDDEN, inset(), 4);
    tl.to({}, {duration: END_HOLD});
  });

  return (
    <ScrollScene
      units={STORY_UNITS}
      wrapperRef={wrapperRef}
      artboardRef={artboardRef}
      stageClassName="bg-white"
      label="Our story"
    >
      <div
        data-anim="story-group"
        className="absolute left-0 -top-995 h-1300 w-1919"
      >
        <div
          data-anim="story-monogram"
          className="absolute left-12 top-29 h-953 w-1129 overflow-hidden"
        >
          <img
            src="/assets/hh-gradient.svg"
            alt=""
            className="absolute left-59 top-0 h-953 w-1011"
          />
        </div>

        <div
          data-anim="skyline"
          className="absolute -left-24 top-326 h-889 w-1976"
        >
          <img
            src="/assets/city-panorama.png"
            alt="Historic downtown street scene"
            loading="lazy"
            className="size-full object-cover object-bottom"
          />
        </div>

        {/* White fade over the monogram (Figma "Rectangle 25") */}
        <div
          data-anim="story-fade"
          className="pointer-events-none absolute -left-22 top-0 h-982 w-1943 mix-blend-luminosity"
          style={{
            backgroundImage:
              'linear-gradient(0.6deg, rgb(255 255 255 / 0) 31.876%, rgb(255 255 255) 92.652%)',
          }}
        />
      </div>

      <figure
        data-anim="portrait"
        className="absolute left-214 top-12 m-0 h-691 w-598 overflow-hidden r-20 border-solid border-white bw-6"
      >
        <img
          src="/assets/founder-portrait.png"
          alt="Mark, founder of Hatwater House"
          loading="lazy"
          className="absolute left-[-9.3%] top-[0.07%] h-full w-[117.02%]"
        />
      </figure>

      <figure
        data-anim="workshop"
        className="absolute left-1429 top-317 m-0 h-660 w-406 overflow-hidden"
      >
        <img
          src="/assets/workshop.jpg"
          alt="Hat blocks and tools in the Hatwater House workshop"
          loading="lazy"
          className="size-full object-cover"
        />
      </figure>

      <div
        data-anim="story-copy"
        className="absolute left-494 top-624 h-350 w-723 overflow-hidden"
      >
        <p className="m-0 mt-24 indent-345 font-display fs-36 lh-60 capitalize text-hw-taupe">
          Beyond our current collection, Hatwater House offers custom hats
          shaped around your style and fit. Explore the gallery below for a look
          at hats we’ve created for our customers.
        </p>
      </div>
    </ScrollScene>
  );
}
