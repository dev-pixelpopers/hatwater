import {CAROUSEL, COLLECTION_ITEMS, HERO_HAT_ID} from './collectionData';
import {HatImage} from './HatImage';

type CollectionLayerProps = {
  onPrev: () => void;
  onNext: () => void;
};

/**
 * "The California Collection" ring carousel (Figma "Group 23"). The hero hat
 * is rendered separately by the showcase because it travels from the chair.
 */
export function CollectionLayer({onPrev, onNext}: CollectionLayerProps) {
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
          <button
            type="button"
            aria-label="Previous hat"
            onClick={onPrev}
            className="size-50 -scale-x-100 cursor-pointer border-0 bg-transparent p-0"
          >
            <img src="/assets/btn-arrow.svg" alt="" className="size-full" />
          </button>
          <button
            type="button"
            aria-label="Next hat"
            onClick={onNext}
            className="size-50 cursor-pointer border-0 bg-transparent p-0"
          >
            <img src="/assets/btn-arrow.svg" alt="" className="size-full" />
          </button>
        </div>
      </div>

      <div className="absolute left-907 top-711 h-183 w-613 overflow-hidden">
        <ul
          data-anim="collection-names"
          className="relative m-0 h-full list-none p-0 opacity-0"
        >
          {COLLECTION_ITEMS.map((item) => (
            <li
              key={`${item.name}-${item.top}`}
              className="absolute left-0 m-0 flex flex-col"
              style={{top: `calc(var(--spacing) * ${item.top})`}}
            >
              <h3 className="m-0 whitespace-nowrap font-display fs-72 lh-88.75 font-normal capitalize text-hw-chestnut">
                {item.name}
              </h3>
              <p className="m-0 ml-99 w-514 font-grotesk fs-22 lh-30 capitalize text-hw-ink">
                {item.copy}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
