import {forwardRef, useCallback, useRef} from 'react';
import {
  addClip,
  artX,
  artY,
  createScrubTimeline,
  inset,
  gsap,
  ofSize,
  useGsapContext,
} from '~/lib/gsap';
import {AboutCard} from './AboutCard';
import {CollectionLayer} from './CollectionLayer';
import {
  CAROUSEL,
  CAROUSEL_STEPS,
  FINAL_HAT_ID,
  HATS,
  HERO_HAT_ID,
  NAME_OFFSETS,
  slotAt,
  type CarouselHat,
} from './collectionData';
import {FeatureCards} from './FeatureCards';
import {HatImage} from './HatImage';
import {HeroLayer, type HeroIntroHandle} from './HeroLayer';
import {ScrollScene} from './ScrollScene';

/** Height of the scrolling track in Figma pixels (hero + about card). */
const TRACK_HEIGHT = 2040;
const NAMES_HEIGHT = 183;
const CAROUSEL_START = 3;
/** Hold at the end so the cards rest before the story scene arrives. */
const END_HOLD = 0.4;
export const SHOWCASE_UNITS =
  CAROUSEL_START + 1 + CAROUSEL_STEPS + 4 + END_HOLD;

/** Clip states in percentages of each frame (Figma frame widths/heights). */
const HAT_CLIP = {chair: inset(0, 98.28), card: inset(0, 67.95)};
const CHAIR_CLIP = {hidden: inset(0, 94.91)};
const ABOUT_CLIP = {hidden: inset(0, 0, 90.54)};
const TITLE_CLIP = {hidden: inset(0, 0, 85.34)};

const hatSelector = (id: string) => `[data-hat="${id}"]`;

function placeHat(item: CarouselHat, slotIndex: number) {
  const slot = slotAt(slotIndex);
  const art = HATS[item.hat];
  return {
    left: artX(slot.x),
    top: artY(slot.y),
    scale: slot.width / art.width,
    rotation: slotIndex === 0 ? art.centerRotation : slot.rotation,
    autoAlpha: slot.opacity,
  };
}

/**
 * Hero -> about card -> California Collection -> feature cards.
 * Figma variants 4 -> 15, played on one sticky stage. The track stands in
 * for the page scrolling between frames; the hero hat lives outside the
 * track so it can leave the chair and land in the collection ring.
 */
export const ShowcaseScene = forwardRef<HeroIntroHandle>(
  function ShowcaseScene(_, heroRef) {
    const wrapperRef = useRef<HTMLElement>(null);
    const artboardRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    useGsapContext(wrapperRef, () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const track = '[data-anim="track"]';
      const heroHat = hatSelector(HERO_HAT_ID);
      const finalHat = hatSelector(FINAL_HAT_ID);
      const satellites = CAROUSEL.filter((item) => item.id !== HERO_HAT_ID);
      const rings = '[data-anim="ring"]';
      const title = '[data-anim="collection-title"]';
      const hatClip = '[data-anim="hat-clip"]';
      const chairClip = '[data-anim="chair-clip"]';
      const aboutCopy = '[data-anim="about-copy"]';
      const names = '[data-anim="collection-names"]';
      const classicCard = '[data-card="classic"]';
      const customCard = '[data-card="custom"]';

      // Start states (Figma Variant4 for the hero, Variant7 for the collection).
      gsap.set('[data-hat]', {xPercent: -50, yPercent: -50});
      gsap.set(heroHat, {
        left: artX(430.45),
        top: artY(1485.7),
        rotation: 43.08,
        scale: 1,
      });
      satellites.forEach((item) => {
        gsap.set(hatSelector(item.id), {
          left: artX(956),
          top: artY(630),
          rotation: -18,
          scale: 1,
          autoAlpha: 0,
        });
      });
      gsap.set(hatClip, {clipPath: HAT_CLIP.chair});
      gsap.set(chairClip, {clipPath: CHAIR_CLIP.hidden});
      gsap.set(aboutCopy, {clipPath: ABOUT_CLIP.hidden});
      gsap.set(rings, {scale: 0.157, transformOrigin: '50% 50%'});
      gsap.set(title, {clipPath: TITLE_CLIP.hidden});
      gsap.set(names, {yPercent: ofSize(200, NAMES_HEIGHT)});
      gsap.set(customCard, {
        xPercent: ofSize(-849, 921),
        yPercent: ofSize(48, 812),
        scale: 1.8165,
        transformOrigin: '0% 0%',
      });
      gsap.set('[data-anim="card-copy"]', {autoAlpha: 0, yPercent: 30});

      const tl = createScrubTimeline(wrapper);

      // Variant4 -> Variant5: the about card scrolls up over the hero, the chair
      // and hat are wiped in from the left and the (blurred) copy appears.
      tl.to(track, {yPercent: -ofSize(1020, TRACK_HEIGHT), ease: 'none'}, 0).to(
        heroHat,
        {top: artY(465.7), ease: 'none'},
        0,
      );
      addClip(tl, chairClip, CHAIR_CLIP.hidden, inset(), 0, {ease: 'none'});
      addClip(tl, hatClip, HAT_CLIP.chair, HAT_CLIP.card, 0, {ease: 'none'});
      addClip(tl, aboutCopy, ABOUT_CLIP.hidden, inset(), 0, {ease: 'none'});

      // Variant5 -> Variant6: the frosted panel slides down, un-blurring the copy.
      tl.to(
        '[data-anim="about-blur"]',
        {yPercent: ofSize(459, 432), ease: 'none'},
        1,
      );

      // Variant6 -> Variant7: card leaves, the hat flies into the centre.
      addClip(tl, hatClip, HAT_CLIP.card, inset(), 2, {
        duration: 0.3,
        ease: 'none',
      });
      tl.to(track, {yPercent: -ofSize(2030, TRACK_HEIGHT), ease: 'none'}, 2).to(
        heroHat,
        {
          left: artX(951.07),
          top: artY(436.6),
          rotation: -22.05,
          scale: 563 / 412.25,
        },
        2,
      );

      // Variant7 -> Variant8: collection ring, satellites and copy come in.
      tl.addLabel('hat-0', CAROUSEL_START + 1)
        .to('[data-anim="collection-bg"]', {autoAlpha: 1}, CAROUSEL_START)
        .to(rings, {scale: 1, autoAlpha: 1}, CAROUSEL_START)
        .to(names, {yPercent: 0, autoAlpha: 1}, CAROUSEL_START);
      addClip(tl, title, TITLE_CLIP.hidden, inset(), CAROUSEL_START, {
        autoAlpha: 1,
      });
      satellites.forEach((item) => {
        tl.to(hatSelector(item.id), placeHat(item, item.slot), CAROUSEL_START);
      });

      // Variant8 -> 9 -> 10 -> 14: every hat moves one slot down the diagonal.
      for (let step = 1; step <= CAROUSEL_STEPS; step++) {
        const at = CAROUSEL_START + step;
        CAROUSEL.forEach((item) => {
          tl.to(hatSelector(item.id), placeHat(item, item.slot - step), at);
        });
        tl.to(names, {yPercent: ofSize(NAME_OFFSETS[step], NAMES_HEIGHT)}, at);
        tl.addLabel(`hat-${step}`, at + 1);
      }

      // Variant14 (192:4303): only the centre hat remains, laid flat.
      const outro = CAROUSEL_START + CAROUSEL_STEPS + 1;
      tl.to(
        CAROUSEL.filter((item) => item.id !== FINAL_HAT_ID).map((item) =>
          hatSelector(item.id),
        ),
        {autoAlpha: 0},
        outro,
      )
        .to([title, names], {autoAlpha: 0}, outro)
        .to(finalHat, {rotation: -2}, outro);

      // Variant13 (192:4704): ring blows out, hat flies off, craftsman card fades in.
      tl.to(rings, {scale: 4.87}, outro + 1)
        .to(
          finalHat,
          {
            left: artX(953),
            top: artY(-437),
            rotation: 67.09,
            scale: 590.5 / 412.25,
          },
          outro + 1,
        )
        .to(customCard, {autoAlpha: 1}, outro + 1);

      // Variant14 (192:4810): craftsman card settles right, the classic card fades in.
      tl.to(customCard, {xPercent: 0, yPercent: 0, scale: 1}, outro + 2).to(
        classicCard,
        {autoAlpha: 1},
        outro + 2,
      );

      // Variant15: card titles and CTAs rise in.
      tl.to(
        '[data-anim="card-copy"]',
        {autoAlpha: 1, yPercent: 0, stagger: 0.15},
        outro + 3,
      );
      tl.to({}, {duration: END_HOLD});

      timelineRef.current = tl;
      return () => {
        timelineRef.current = null;
      };
    });

    const goToHat = useCallback((direction: 1 | -1) => {
      const tl = timelineRef.current;
      const trigger = tl?.scrollTrigger;
      if (!tl || !trigger) return;
      const now = trigger.progress * tl.duration();
      const labels = Array.from(
        {length: CAROUSEL_STEPS + 1},
        (_, i) => `hat-${i}`,
      );
      const times = labels.map((label) => tl.labels[label]);
      const current = times.reduce(
        (best, time, index) =>
          Math.abs(time - now) < Math.abs(times[best] - now) ? index : best,
        0,
      );
      const target =
        labels[Math.min(Math.max(current + direction, 0), labels.length - 1)];
      window.scrollTo({top: trigger.labelToScroll(target), behavior: 'smooth'});
    }, []);

    return (
      <ScrollScene
        units={SHOWCASE_UNITS}
        wrapperRef={wrapperRef}
        artboardRef={artboardRef}
        stageClassName="bg-white"
        label="Hatwater House"
      >
        <div data-anim="track" className="absolute inset-x-0 top-0 h-2040">
          <HeroLayer ref={heroRef} />
          <AboutCard />
        </div>

        <CollectionLayer onPrev={() => goToHat(-1)} onNext={() => goToHat(1)} />

        <FeatureCards />

        <div
          data-anim="hat-clip"
          className="pointer-events-none absolute inset-0 z-[25]"
        >
          <HatImage id={HERO_HAT_ID} hat="lj" />
        </div>
      </ScrollScene>
    );
  },
);
