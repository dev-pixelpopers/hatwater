import {useEffect, type DependencyList, type RefObject} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

/** Every Figma frame in the prototype is a 1919 x 994 artboard. */
export const ARTBOARD_WIDTH = 1919;
export const ARTBOARD_HEIGHT = 994;

let registered = false;

function registerGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/**
 * Runs `setup` inside a `gsap.context()` scoped to `scope`, on the client only
 * (useEffect never runs during SSR on Oxygen). Everything created inside is
 * reverted on unmount.
 */
export function useGsapContext(
  scope: RefObject<HTMLElement | null>,
  setup: (context: gsap.Context) => void | (() => void),
  deps: DependencyList = [],
) {
  useEffect(() => {
    const element = scope.current;
    if (!element) return;
    registerGsap();
    const context = gsap.context(setup, element);
    return () => context.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Figma x / y (artboard pixels) as a percentage of the artboard, for
 * left / top / width / height tweens. Percentages keep every tween
 * resolution-independent, so nothing needs re-measuring on resize.
 */
export const artX = (x: number) => `${(x / ARTBOARD_WIDTH) * 100}%`;
export const artY = (y: number) => `${(y / ARTBOARD_HEIGHT) * 100}%`;

/** A Figma distance as a percentage of an element's own size (xPercent / yPercent). */
export const ofSize = (distance: number, size: number) =>
  (distance / size) * 100;

/** `clip-path: inset()` in percentages (top, right, bottom, left). */
export const inset = (top = 0, right = 0, bottom = 0, left = 0) =>
  `inset(${top}% ${right}% ${bottom}% ${left}%)`;

/**
 * Adds a clip-path tween with an explicit start value. Browsers serialise
 * `inset()` in its shortest form when sides match ("inset(0% 46.5%)"), which
 * GSAP would otherwise read back and interpolate against the wrong sides.
 */
export function addClip(
  tl: gsap.core.Timeline,
  targets: gsap.TweenTarget,
  from: string,
  to: string,
  position: gsap.Position,
  vars: gsap.TweenVars = {},
) {
  return tl.fromTo(
    targets,
    {clipPath: from},
    {clipPath: to, immediateRender: false, ...vars},
    position,
  );
}

/** Timeline driven by a tall wrapper + sticky stage (no `pin`). */
export function createScrubTimeline(trigger: HTMLElement) {
  return gsap.timeline({
    defaults: {duration: 1, ease: 'power2.inOut'},
    scrollTrigger: {
      trigger,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
    },
  });
}

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function lockScroll() {
  document.documentElement.classList.add('hw-scroll-lock');
}

export function unlockScroll() {
  document.documentElement.classList.remove('hw-scroll-lock');
  ScrollTrigger.refresh();
}

export {gsap, ScrollTrigger};
