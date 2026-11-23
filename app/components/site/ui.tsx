import type {RefObject} from 'react';
import {Link} from 'react-router';
import {ArrowSwap} from '~/components/home/ArrowSwap';
import {gsap, prefersReducedMotion, useGsapContext} from '~/lib/gsap';

/** Page gutter + max width shared by the inner pages. */
export const CONTAINER =
  'mx-auto w-full max-w-[1720px] px-[clamp(20px,5vw,96px)]';

/** Small uppercase kicker above editorial headings. */
export function Eyebrow({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`m-0 flex items-center gap-3 font-grotesk text-[clamp(11px,0.75vw,14px)] font-medium uppercase tracking-[0.22em] text-hw-copper ${className}`}
    >
      <span aria-hidden className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}

/**
 * Splits a heading into words, each inside its own clipping mask, so GSAP can
 * raise them line by line (`[data-word]`). Screen readers get the plain text.
 */
export function SplitWords({text}: {text: string}) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.split(' ').map((word, index) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="inline-block overflow-hidden pb-[0.08em] align-bottom"
          >
            <span data-word className="inline-block">
              {word}
              {' '}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}

/**
 * Every `[data-reveal]` inside `scope` rises and fades in, scrubbed to its
 * own scroll position (scrub: 1, no pinning). `data-reveal="slow"` drifts
 * further for large images.
 */
export function useScrollReveal(scope: RefObject<HTMLElement | null>) {
  useGsapContext(scope, () => {
    if (prefersReducedMotion()) return;
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
      const slow = element.dataset.reveal === 'slow';
      gsap.fromTo(
        element,
        {autoAlpha: 0, y: slow ? 90 : 48},
        {
          autoAlpha: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top 94%',
            end: slow ? 'top 45%' : 'top 66%',
            scrub: 1,
          },
        },
      );
    });
  });
}

/**
 * Fluid version of the homepage PillButton (white pill, copper arrow disc,
 * copper wash on hover) for pages outside the scaled artboard.
 */
export function ArrowPill({
  to,
  label,
  className = '',
}: {
  to: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      to={to}
      prefetch="intent"
      className={`group relative isolate inline-flex h-[clamp(52px,3.1vw,60px)] items-center gap-[clamp(10px,0.7vw,14px)] overflow-hidden rounded-full border border-hw-bone bg-white pl-[7px] pr-[clamp(22px,1.6vw,30px)] no-underline transition-[border-color,scale] duration-500 hover:border-hw-saddle hover:no-underline active:scale-[0.97] ${className}`}
    >
      <span
        aria-hidden
        className="absolute left-[7px] top-1/2 -z-10 aspect-square h-[calc(100%-14px)] -translate-y-1/2 rounded-full hw-panel-gradient transition-[scale] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-[13]"
      />
      <span className="relative flex aspect-square h-[calc(100%-14px)] shrink-0 items-center justify-center overflow-hidden rounded-full">
        <img
          src="/assets/button-dot.svg"
          alt=""
          className="absolute inset-0 size-full rounded-none"
        />
        <ArrowSwap className="-rotate-45 !h-[11px] !w-[15.5px]" />
      </span>
      <span className="whitespace-nowrap font-grotesk text-[clamp(16px,1.05vw,20px)] text-hw-espresso transition-colors duration-500 group-hover:text-white">
        {label}
      </span>
    </Link>
  );
}
