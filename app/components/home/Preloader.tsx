import {useRef} from 'react';
import {
  ARTBOARD_WIDTH,
  artX,
  artY,
  gsap,
  lockScroll,
  ofSize,
  prefersReducedMotion,
  useGsapContext,
} from '~/lib/gsap';

const COUNTER_STEPS = [
  '001',
  '005',
  '010',
  '020',
  '030',
  '040',
  '050',
  '060',
  '070',
  '080',
  '090',
  '095',
  '096',
  '097',
  '098',
  '099',
  '100',
];
/** Height of one counter row (and of its clipping window) in Figma pixels. */
const COUNTER_LINE = 100;

/**
 * Panel geometry in the hero frame (Figma "Rectangle 32"). Like the hero
 * panel it is centred and at least as wide as the viewport.
 */
const PANEL = {top: -13, width: 1933, height: 1481, radius: 60};
/** The seed dot the panel grows from (Figma node 176:565). */
const DOT = {left: 973.5, top: 387, size: 8};

type PreloaderProps = {
  /** Fired when the loader has finished; the hero intro starts here. */
  onComplete: () => void;
};

/**
 * Time-based loader (Figma variants "Default" -> "Variant2"): the counter
 * rolls 001 -> 100, then the copper dot expands into the hero panel.
 */
export function Preloader({onComplete}: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const artboardRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useGsapContext(rootRef, () => {
    const root = rootRef.current;
    const artboard = artboardRef.current;
    if (!root || !artboard) return;

    // Panel width as % of the artboard: max(1933 Figma px, 100vw).
    const panelWidth = Math.max(
      (PANEL.width / ARTBOARD_WIDTH) * 100,
      (window.innerWidth / artboard.offsetWidth) * 100,
    );
    const panelWidthPx = (panelWidth / 100) * artboard.offsetWidth;
    const radiusPx = (PANEL.radius / ARTBOARD_WIDTH) * artboard.offsetWidth;

    window.scrollTo(0, 0);
    lockScroll();

    const tl = gsap.timeline({
      delay: 0.2,
      onComplete: () => {
        gsap.set(root, {autoAlpha: 0, display: 'none'});
        onCompleteRef.current();
      },
    });

    tl.to('[data-anim="counter"]', {
      // The list is COUNTER_STEPS.length lines tall; move it up one line per step.
      yPercent: -ofSize(
        (COUNTER_STEPS.length - 1) * COUNTER_LINE,
        COUNTER_STEPS.length * COUNTER_LINE,
      ),
      duration: 2.4,
      ease: `steps(${COUNTER_STEPS.length - 1})`,
    }).fromTo(
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
      '+=0.15',
    );

    if (prefersReducedMotion()) tl.progress(1);
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
        <div className="absolute left-180.5 top-740 flex h-63 w-1558 items-center justify-between">
          <span className="h-5 w-98 hw-panel-gradient" />
          {/* Each step gets a slot taller than the 80px glyphs so neighbouring
              rows never bleed into the window. */}
          <div className="relative h-100 w-246 shrink-0 overflow-hidden">
            <div data-anim="counter" className="absolute inset-x-0 top-0 pl-13">
              {COUNTER_STEPS.map((step) => (
                <p
                  key={step}
                  className="m-0 flex h-100 items-center whitespace-nowrap font-display fs-80 lh-80 text-black"
                >
                  % {step}
                </p>
              ))}
            </div>
          </div>
        </div>

        <span
          data-anim="seed"
          className="absolute left-973.5 top-387 size-8 r-4 hw-panel-gradient"
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
