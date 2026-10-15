import type {ReactNode, RefObject} from 'react';

/** Figma pixels -> CSS length inside the `.hw` artboard scope. */
export const du = (value: number) => `calc(var(--spacing) * ${value})`;

/** How much page scroll (in svh) one timeline unit of a scene consumes. */
export const SCROLL_PER_UNIT = 80;

type ScrollSceneProps = {
  /** Total duration of the scene's scrubbed timeline. */
  units: number;
  wrapperRef: RefObject<HTMLElement>;
  artboardRef: RefObject<HTMLDivElement>;
  /** Classes for the sticky stage (background colour etc.). */
  stageClassName?: string;
  label?: string;
  children: ReactNode;
};

/**
 * Scroll-locked scene without GSAP pinning: a tall wrapper that holds a
 * `sticky top-0 h-svh` stage. The 1919 x 994 artboard is centred inside the
 * stage and scaled through the `.hw` spacing unit.
 */
export function ScrollScene({
  units,
  wrapperRef,
  artboardRef,
  stageClassName = '',
  label,
  children,
}: ScrollSceneProps) {
  return (
    <section
      ref={wrapperRef}
      aria-label={label}
      className="relative p-0"
      style={{height: `${units * SCROLL_PER_UNIT + 100}svh`}}
    >
      <div
        className={`sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden ${stageClassName}`}
      >
        <div ref={artboardRef} className="relative h-994 w-1919 shrink-0">
          {children}
        </div>
      </div>
    </section>
  );
}
