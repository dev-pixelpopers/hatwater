import {forwardRef, useImperativeHandle, useRef} from 'react';
import {
  gsap,
  prefersReducedMotion,
  unlockScroll,
  useGsapContext,
} from '~/lib/gsap';
import {HeroHeader} from './HeroHeader';
import {PillButton} from './PillButton';

export type HeroIntroHandle = {
  /** Plays the hero entrance (Figma "Variant2" -> "Variant3" -> "Variant4"). */
  playIntro: () => void;
};

/**
 * Hero frame: copper panel, HH monogram, header, model and headline.
 * Rendered at the top of the showcase track; its entrance is time-based and
 * started by the preloader.
 */
export const HeroLayer = forwardRef<HeroIntroHandle>(
  function HeroLayer(_, ref) {
    const rootRef = useRef<HTMLDivElement>(null);
    const introRef = useRef<gsap.core.Timeline | null>(null);

    useImperativeHandle(ref, () => ({
      playIntro: () => {
        const intro = introRef.current;
        if (!intro) return unlockScroll();
        if (prefersReducedMotion()) intro.progress(1);
        else intro.play(0);
      },
    }));

    useGsapContext(rootRef, () => {
      const intro = gsap.timeline({
        paused: true,
        defaults: {ease: 'power3.out'},
        onComplete: unlockScroll,
      });

      intro
        // Variant2 -> Variant3: monogram is wiped in top-down, header drops in.
        .fromTo(
          '[data-anim="monogram"]',
          {clipPath: 'inset(0% 0% 100% 0%)'},
          {clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power2.inOut'},
        )
        .fromTo(
          '[data-anim="hero-header"]',
          {yPercent: -230},
          {yPercent: 0, duration: 1},
          0.2,
        )
        // Variant3 -> Variant4: the model's frame grows upwards from y 1020,
        // the headline rises inside its mask and the CTA fades in.
        .fromTo(
          '[data-anim="woman"]',
          {clipPath: 'inset(72.6% 0% 0% 0%)'},
          {clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power2.inOut'},
          '-=0.2',
        )
        .fromTo(
          '[data-anim="headline"]',
          {yPercent: 100},
          {yPercent: 0, duration: 1},
          '-=0.8',
        )
        .fromTo(
          '[data-anim="hero-cta"]',
          {autoAlpha: 0},
          {autoAlpha: 1, duration: 0.6, ease: 'power1.out'},
          '-=0.5',
        );

      introRef.current = intro;
      return () => {
        introRef.current = null;
      };
    });

    return (
      <div ref={rootRef} className="absolute inset-x-0 top-0 h-1481">
        {/* Copper panel (Figma "Rectangle 32"), widened to the viewport on ultra-wide screens */}
        <div className="absolute left-1/2 -top-13 h-1481 w-[max(calc(var(--spacing)*1933),100vw)] -translate-x-1/2 r-60 hw-panel-gradient" />

        {/* HH monogram cut-out (Figma "logo" / "Group 19") */}
        <img
          data-anim="monogram"
          src="/assets/hh-monogram.svg"
          alt=""
          className="absolute left-649 top-0 h-995 w-1011"
        />

        <HeroHeader />

        {/* Model (Figma "Replace_woman_hat…") */}
        <div
          data-anim="woman"
          className="absolute left-420 top-154 z-20 h-1193 w-1092 overflow-hidden"
        >
          <img
            src="/assets/woman.png"
            alt="Model wearing a cream Hatwater House hat"
            className="absolute left-[-54.24%] top-[-2.89%] h-[103.43%] w-[202.72%]"
          />
        </div>

        <div className="absolute left-126 top-447 z-20 flex flex-col gap-24">
          <div className="h-215 w-443 overflow-hidden">
            <h1
              data-anim="headline"
              className="m-0 font-display fs-62 lh-66 font-normal capitalize text-hw-mist"
            >
              All of our hats
              <br />
              are made just
              <br />
              for you
            </h1>
          </div>
          <div data-anim="hero-cta">
            <PillButton
              to="/pages/contact"
              label="Custom request"
              tone="taupe"
            />
          </div>
        </div>
      </div>
    );
  },
);
