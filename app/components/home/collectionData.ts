import type {HomepageProductFragment} from 'storefrontapi.generated';

/**
 * Hat cut-outs and carousel geometry for "The California Collection"
 * (Figma variants 8 -> 10 and 14). Every value is in Figma pixels.
 */

export type HatKey = 'lj' | 'rca' | 'gus' | 'white';

export type HatArt = {
  src: string;
  alt: string;
  /** Layer box as drawn in Figma. */
  width: number;
  height: number;
  /** Image-fill crop inside that box (Figma "fill" transform). */
  crop: {width: string; height: string; left: string; top: string};
  /** Rotation used when the hat sits in the centre ring. */
  centerRotation: number;
};

export const HATS: Record<HatKey, HatArt> = {
  lj: {
    src: '/assets/hat-lj-tilted.png',
    alt: 'The LJ – flat-brim felt hat with a leather band',
    width: 412.25,
    height: 254.5,
    crop: {width: '100.06%', height: '216.16%', left: '-0.03%', top: '-55.27%'},
    centerRotation: -22.05,
  },
  rca: {
    src: '/assets/hat-rca.png',
    alt: 'Everyday RCA – grey fedora',
    width: 298.5,
    height: 190.5,
    crop: {width: '100.18%', height: '208.19%', left: '-0.09%', top: '-54.09%'},
    centerRotation: -14.84,
  },
  gus: {
    src: '/assets/hat-gus.png',
    alt: 'California Gus – cream hat with a brown ribbon',
    width: 293.25,
    height: 165,
    crop: {width: '100%', height: '235.79%', left: '0%', top: '-58.34%'},
    centerRotation: -18.15,
  },
  white: {
    src: '/assets/hat-white.png',
    alt: 'White felt cowboy hat',
    width: 276.5,
    height: 170,
    crop: {width: '100%', height: '215.93%', left: '0%', top: '-53.17%'},
    centerRotation: -17.97,
  },
};

export type Slot = {
  x: number;
  y: number;
  width: number;
  rotation: number;
  opacity: number;
};

/** Diagonal path, lower-left (-) to upper-right (+); 0 is the centre ring. */
const SLOTS: Record<number, Slot> = {
  [-3]: {x: -95, y: 940, width: 240, rotation: -18, opacity: 0},
  [-2]: {x: 182.75, y: 826, width: 241.5, rotation: -17.97, opacity: 0.33},
  [-1]: {x: 439, y: 711.25, width: 256, rotation: -18.15, opacity: 0.33},
  [0]: {x: 951, y: 436.5, width: 563, rotation: -22.05, opacity: 1},
  [1]: {x: 1422.75, y: 254.5, width: 250.75, rotation: -14.84, opacity: 0.33},
  [2]: {x: 1706, y: 147.5, width: 232.5, rotation: -17.97, opacity: 0.33},
  [3]: {x: 2036, y: 8, width: 224, rotation: -22.05, opacity: 0.33},
  [4]: {x: 2300, y: -130, width: 224, rotation: -22, opacity: 0},
};

export function slotAt(index: number): Slot {
  if (SLOTS[index]) return SLOTS[index];
  const edge = index < 0 ? SLOTS[-3] : SLOTS[4];
  const steps = index < 0 ? index + 3 : index - 4;
  return {
    ...edge,
    x: edge.x + steps * 260,
    y: edge.y - steps * 130,
    opacity: 0,
  };
}

export type CarouselHat = {id: string; hat: HatKey; slot: number};

/** The centre item (index 2) is the hat that flies off the chair. */
export const CAROUSEL: CarouselHat[] = [
  {id: 'white-a', hat: 'white', slot: -2},
  {id: 'gus-a', hat: 'gus', slot: -1},
  {id: 'lj-a', hat: 'lj', slot: 0},
  {id: 'rca', hat: 'rca', slot: 1},
  {id: 'gus-b', hat: 'gus', slot: 2},
  {id: 'lj-b', hat: 'lj', slot: 3},
  {id: 'white-b', hat: 'white', slot: 4},
];
export const HERO_HAT_ID = 'lj-a';
/** The LJ that lands in the ring after the last step and flies off. */
export const FINAL_HAT_ID = 'lj-b';
export const CAROUSEL_STEPS = 3;

export type CollectionItem = {
  name: string;
  copy: string;
  /** Row offset inside the name list, in Figma pixels. */
  top: number;
  /** Live Storefront API product shown at this carousel step, if any. */
  product?: HomepageProductFragment;
};

/** Static copy, also the fallback when the store returns no products. */
export const COLLECTION_ITEMS: CollectionItem[] = [
  {name: 'The LJ', top: 20},
  {name: 'Everyday RCA', top: 212},
  {name: 'California Gus', top: 415},
  {name: 'The LJ', top: 630},
].map((item) => ({
  ...item,
  copy: "At fifteen, Mark bought his first cowboy hat one inspired by Little Joe Cartwright's on Bonanza.",
}));

/**
 * One item per carousel step. Live products replace the names and copy; the
 * hat cut-outs stay static because the carousel geometry is tuned to them.
 * A product whose title matches a step's hat lands on that step, the rest
 * fill the remaining steps in order (repeating if the store has fewer).
 */
export function collectionItems(
  products: HomepageProductFragment[],
): CollectionItem[] {
  if (!products.length) return COLLECTION_ITEMS;
  const byTitle = (name: string) =>
    products.find(
      (product) => product.title.trim().toLowerCase() === name.toLowerCase(),
    );
  const unmatched = products.filter(
    (product) => !COLLECTION_ITEMS.some((item) => byTitle(item.name) === product),
  );
  const spare = unmatched.length ? unmatched : products;
  let next = 0;
  return COLLECTION_ITEMS.map((item) => {
    const product = byTitle(item.name) ?? spare[next++ % spare.length];
    return {
      ...item,
      name: product.title,
      copy: product.description || item.copy,
      product,
    };
  });
}

/** Vertical offset of the name list for each carousel step (Figma 8, 9, 10, 14). */
export const NAME_OFFSETS = [0, -210, -410, -610];
