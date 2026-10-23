import {ArrowSwap} from './ArrowSwap';
import {CAROUSEL, HERO_HAT_ID, type CollectionItem} from './collectionData';
import {HatImage} from './HatImage';
import {ProductCta} from './ProductCta';

type CollectionLayerProps = {
  /** One entry per carousel step (live products or the static fallback). */
  items: CollectionItem[];
  /** Carousel step currently in the ring. */
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
};

/**
 * Copper carousel arrow (Figma "Group 10"). On hover the disc tightens, an
 * outline ring opens around it and the arrow slides through.
 */
function SliderArrow({
  label,
  onClick,
  flipped = false,
}: {
  label: string;
  onClick: () => void;
  flipped?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group relative size-50 cursor-pointer border-0 bg-transparent p-0"
    >
      <span
        aria-hidden
        className="absolute -inset-6 rounded-full border border-solid border-hw-copper opacity-0 scale-75 transition-[opacity,scale] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-100 group-hover:opacity-100"
      />
      <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(62%_62%_at_50%_38%,#ae6c40_0%,#553119_100%)] transition-[scale] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-90 group-active:scale-75">
        <ArrowSwap className={flipped ? '-scale-x-100' : ''} />
      </span>
    </button>
  );
}

/**
 * "The California Collection" ring carousel (Figma "Group 23"). The hero hat
 * is rendered separately by the showcase because it travels from the chair.
 */
export function CollectionLayer({
  items,
  activeIndex,
  onPrev,
  onNext,
}: CollectionLayerProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[22]">
      <div
        data-anim="collection-bg"
        className="hw-bleed bg-hw-cream opacity-0"
      />

      <img
        data-anim="ring"
        src="/assets/circle-outer.svg"
        alt=""
        className="absolute left-558 top-97 h-739 w-764 opacity-0"
      />
      <img
        data-anim="ring"
        src="/assets/circle-inner.svg"
        alt=""
        className="absolute left-622 top-154 h-625 w-636 opacity-0"
      />

      {CAROUSEL.filter((item) => item.id !== HERO_HAT_ID).map((item) => (
        <HatImage key={item.id} id={item.id} hat={item.hat} decorative />
      ))}

      <div
        data-anim="collection-title"
        className="pointer-events-auto absolute left-108 top-94 flex h-307 w-521 flex-col overflow-hidden pt-45 opacity-0 invisible"
      >
        <h2 className="m-0 font-display fs-78 lh-88.75 font-normal capitalize text-hw-cocoa">
          The California
          <br />
          Collection
        </h2>
        <div className="mt-34.5 flex gap-22 pl-2">
          <SliderArrow label="Previous hat" onClick={onPrev} flipped />
          <SliderArrow label="Next hat" onClick={onNext} />
        </div>
      </div>

      <div
        data-anim="collection-cta"
        aria-live="polite"
        className="pointer-events-auto absolute left-110 top-430 w-460 opacity-0 invisible"
      >
        <ProductCta
          key={items[activeIndex]?.product?.id ?? 'fallback'}
          product={items[activeIndex]?.product}
        />
      </div>

      <div className="absolute left-907 top-711 h-183 w-613 overflow-hidden">
        <ul
          data-anim="collection-names"
          className="relative m-0 h-full list-none p-0 opacity-0"
        >
          {items.map((item) => (
            <li
              key={item.top}
              className="absolute left-0 m-0 flex w-613 flex-col"
              style={{top: `calc(var(--spacing) * ${item.top})`}}
            >
              <h3 className="m-0 truncate font-display fs-72 lh-88.75 font-normal capitalize text-hw-chestnut">
                {item.name}
              </h3>
              <p className="m-0 ml-99 line-clamp-2 w-514 font-grotesk fs-22 lh-30 capitalize text-hw-ink">
                {item.copy}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
