import { useRef } from 'react';
import {
  ARTBOARD_WIDTH,
  artX,
  artY,
  gsap,
  lockScroll,
  prefersReducedMotion,
  useGsapContext,
} from '~/lib/gsap';

/** How long the counter and bar take to catch up with each progress jump. */
const CATCH_UP = 0.8;
/** A stalled asset never holds the page: the loader finishes after this. */
const LOAD_TIMEOUT_MS = 12000;

/**
 * Panel geometry in the hero frame (Figma "Rectangle 32"). Like the hero
 * panel it is centred and at least as wide as the viewport.
 */
const PANEL = { top: -13, width: 1933, height: 1481, radius: 60 };
/** The seed dot the panel grows from (Figma node 176:565). */
const DOT = { left: 973.5, top: 387, size: 0 };

const formatCount = (value: number) =>
  String(Math.max(1, Math.round(value))).padStart(3, '0');

/**
 * Reports page-load progress (0 -> 1) as fonts, eager images, preloading
 * videos and the window load event settle. Returns a cleanup function.
 */
function trackPageLoad(onProgress: (progress: number) => void) {
  const cleanups: Array<() => void> = [];
  let total = 0;
  let settled = 0;
  let cancelled = false;

  const settle = () => {
    if (cancelled) return;
    settled += 1;
    onProgress(settled / total);
  };

  const track = (ready: boolean, target: EventTarget, events: string[]) => {
    total += 1;
    // Deferred so `total` is final before the first report.
    if (ready) return void queueMicrotask(settle);
    const handler = () => {
      off();
      settle();
    };
    const off = () =>
      events.forEach((event) => target.removeEventListener(event, handler));
    events.forEach((event) => target.addEventListener(event, handler));
    cleanups.push(off);
  };

  document.querySelectorAll('img').forEach((img) => {
    if (img.loading !== 'lazy') track(img.complete, img, ['load', 'error']);
  });
  document.querySelectorAll('video').forEach((video) => {
    if (video.preload === 'none') return;
    track(
      video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA,
      video,
      ['canplaythrough', 'error'],
    );
  });
  track(document.readyState === 'complete', window, ['load']);
  total += 1;
  document.fonts.ready.then(settle, settle);

  return () => {
    cancelled = true;
    cleanups.forEach((off) => off());
  };
}

type PreloaderProps = {
  /** Fired when the loader has finished; the hero intro starts here. */
  onComplete: () => void;
};

/**
 * Loader (Figma variants "Default" -> "Variant2"): the hat clip plays while
 * the counter and bar follow the real page-load progress 001 -> 100, then
 * the copper dot expands into the hero panel.
 */
export function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const artboardRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useGsapContext(rootRef, () => {
    const root = rootRef.current;
    const artboard = artboardRef.current;
    const counter = counterRef.current;
    const bar = barRef.current;
    if (!root || !artboard || !counter || !bar) return;

    // Panel width as % of the artboard: max(1933 Figma px, 100vw).
    const panelWidth = Math.max(
      (PANEL.width / ARTBOARD_WIDTH) * 100,
      (window.innerWidth / artboard.offsetWidth) * 100,
    );
    const panelWidthPx = (panelWidth / 100) * artboard.offsetWidth;
    const radiusPx = (PANEL.radius / ARTBOARD_WIDTH) * artboard.offsetWidth;
    const reducedMotion = prefersReducedMotion();

    window.scrollTo(0, 0);
    lockScroll();

    const reveal = gsap.timeline({
      paused: true,
      onComplete: () => {
        gsap.set(root, { autoAlpha: 0, display: 'none' });
        onCompleteRef.current();
      },
    });
    reveal.fromTo(
      '[data-anim="seed"]',
      {
        left: artX(DOT.left),
        top: artY(DOT.top),
        width: artX(DOT.size),
        height: artY(DOT.size),
        borderRadius: '50% / 50%',
      },
      {
        left: `${(100 - panelWidth) / 2}%`,
        top: artY(PANEL.top),
        width: `${panelWidth}%`,
        height: artY(PANEL.height),
        borderRadius: `${(radiusPx / panelWidthPx) * 100}% / ${(PANEL.radius / PANEL.height) * 100}%`,
        duration: 1.2,
        ease: 'expo.inOut',
      },
      0.15,
    );

    // The counter and bar ease towards the real progress; at 100 the panel
    // grows. The value never goes backwards.
    const shown = { value: 1 };
    const render = () => {
      counter.textContent = `% ${formatCount(shown.value)}`;
      gsap.set(bar, { scaleX: shown.value / 100 });
    };
    render();

    let done = false;
    const showProgress = (progress: number) => {
      if (done) return;
      const target = Math.max(shown.value, progress * 100);
      gsap.to(shown, {
        value: target,
        duration: reducedMotion ? 0 : CATCH_UP,
        ease: 'power1.out',
        overwrite: true,
        onUpdate: render,
        onComplete: () => {
          if (target < 100 || done) return;
          done = true;
          if (reducedMotion) reveal.progress(1);
          else reveal.play();
        },
      });
    };

    const stopTracking = trackPageLoad(showProgress);
    const timeout = window.setTimeout(() => showProgress(1), LOAD_TIMEOUT_MS);

    return () => {
      stopTracking();
      window.clearTimeout(timeout);
    };
  });

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-preloader
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-hw-fog"
    >
      <div ref={artboardRef} className="relative h-994 w-1919 shrink-0">
        {/* Progress row (Figma "Component 2") */}
        <video
          src="/assets/videos/preloader-video.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          className="absolute left-409.5 top-80 h-619 w-1100 object-contain"
        />

        <div className="absolute left-180.5 top-740 flex h-63 w-1558 items-center justify-between">
          {/* The bar fills in step with the counter. */}
          <span className="relative mr-60 h-5 flex-1">
            <span
              ref={barRef}
              data-anim="bar"
              className="absolute inset-0 origin-left hw-panel-gradient"
            />
          </span>
          <div className="relative h-100 w-246 shrink-0 overflow-hidden pl-13">
            <p
              ref={counterRef}
              data-anim="counter"
              className="m-0 flex h-100 items-center whitespace-nowrap font-display fs-80 lh-80 text-black"
            >
              % 001
            </p>
          </div>
        </div>

        <span
          data-anim="seed"
          className="absolute left-973.5 top-387 size-0 r-4 hw-panel-gradient"
        />
      </div>
      {/* Without JavaScript the loader would never finish. */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: '<style>[data-preloader]{display:none!important}</style>',
        }}
      />
    </div>
  );
}
