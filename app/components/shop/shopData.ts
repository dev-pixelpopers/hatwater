import type {ShopProductFragment} from 'storefrontapi.generated';

export type ShopProduct = ShopProductFragment & {
  /** Hard-coded catalogue item, shown only when the store returns nothing. */
  isFallback?: boolean;
};

export const SORT_OPTIONS = [
  {value: 'featured', label: 'Featured'},
  {value: 'newest', label: 'Newest'},
  {value: 'price-asc', label: 'Price: low to high'},
  {value: 'price-desc', label: 'Price: high to low'},
  {value: 'title', label: 'Name: A – Z'},
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

export function sortProducts(products: ShopProduct[], sort: SortValue) {
  const price = (product: ShopProduct) =>
    parseFloat(product.priceRange.minVariantPrice.amount);
  const sorted = [...products];
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'price-asc':
      return sorted.sort((a, b) => price(a) - price(b));
    case 'price-desc':
      return sorted.sort((a, b) => price(b) - price(a));
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted; // Store order (best selling).
  }
}

export type Category = {
  id: string;
  label: string;
  productIds: string[];
};

export type CategoryGroup = {label: string; categories: Category[]};

const HIDDEN_COLLECTIONS = new Set(['frontpage', 'all']);

function group(
  label: string,
  products: ShopProduct[],
  keysOf: (product: ShopProduct) => {id: string; label: string}[],
): CategoryGroup | null {
  const byId = new Map<string, Category>();
  for (const product of products) {
    for (const key of keysOf(product)) {
      const category = byId.get(key.id) ?? {...key, productIds: []};
      if (!category.productIds.includes(product.id)) {
        category.productIds.push(product.id);
      }
      byId.set(key.id, category);
    }
  }
  const categories = [...byId.values()]
    .sort((a, b) => b.productIds.length - a.productIds.length)
    .slice(0, 7);
  // A group only helps if at least one pill narrows the list.
  const narrows = categories.some(
    (category) => category.productIds.length < products.length,
  );
  return categories.length >= 2 && narrows ? {label, categories} : null;
}

const titleCase = (value: string) =>
  value.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());

/**
 * Filter pills: store collections when products belong to some, else product
 * types, else the crown style named in the description ("a classic Gus
 * crown"), else the colourways the hats are offered in.
 */
export function buildCategories(products: ShopProduct[]): CategoryGroup {
  return (
    group('Collections', products, (product) =>
      product.collections.nodes
        .filter((collection) => !HIDDEN_COLLECTIONS.has(collection.handle))
        .map((collection) => ({id: collection.handle, label: collection.title})),
    ) ??
    group('Styles', products, (product) =>
      product.productType
        ? [{id: product.productType.toLowerCase(), label: product.productType}]
        : [],
    ) ??
    group('Crown', products, (product) => {
      const crown = /\b([\w]+)[- ]crown\b/i.exec(product.description)?.[1];
      return crown && !/^(the|a|its|clean|classic)$/i.test(crown)
        ? [{id: crown.toLowerCase(), label: `${titleCase(crown)} crown`}]
        : [];
    }) ??
    group('Colourways', products, (product) =>
      product.options
        .filter((option) => /colou?r/i.test(option.name))
        .flatMap((option) => option.optionValues)
        .map((value) => ({id: value.name.toLowerCase(), label: value.name})),
    ) ?? {label: 'Collections', categories: []}
  );
}

const image = (id: string, url: string, altText: string) => ({
  id,
  url,
  altText,
  width: 1000,
  height: 1327,
});

const price = {amount: '600.0', currencyCode: 'USD' as const};

function fallback(
  handle: string,
  title: string,
  productType: string,
  hat: string,
  lifestyle: string,
  alt: string,
  colours: string[],
  createdAt: string,
): ShopProduct {
  const featuredImage = image(`${handle}-1`, hat, alt);
  return {
    isFallback: true,
    id: `fallback-${handle}`,
    handle,
    title,
    productType,
    description: '',
    createdAt,
    featuredImage,
    images: {
      nodes: [
        featuredImage,
        image(`${handle}-2`, lifestyle, `${title} being worn`),
      ],
    },
    priceRange: {minVariantPrice: price},
    collections: {nodes: []},
    options: [
      {name: 'Color', optionValues: colours.map((name) => ({name}))},
    ],
    selectedOrFirstAvailableVariant: null,
  };
}

/** Shown when the Storefront API returns no products, so the page never looks empty. */
export const FALLBACK_PRODUCTS: ShopProduct[] = [
  fallback(
    'the-lj',
    'The LJ',
    'Flat Brim',
    '/assets/hat-lj-tilted.png',
    '/assets/story-1.png',
    'The LJ – flat-brim felt hat with a leather band',
    ['Mushroom', 'Black', 'Pecan'],
    '2026-10-22T18:42:24Z',
  ),
  fallback(
    'everyday-rca',
    'Everyday RCA',
    'Fedora',
    '/assets/hat-rca.png',
    '/assets/story-2.png',
    'Everyday RCA – grey fedora',
    ['Slate', 'Black', 'Chocolate'],
    '2026-10-22T18:41:49Z',
  ),
  fallback(
    'california-gus',
    'California Gus',
    'Western',
    '/assets/hat-gus.png',
    '/assets/story-3.png',
    'California Gus – brown felt hat with a grosgrain ribbon',
    ['Chocolate', 'Black', 'Mushroom'],
    '2026-10-22T18:41:27Z',
  ),
  fallback(
    'pacific-rim',
    'Pacific Rim',
    'Western',
    '/assets/hat-white.png',
    '/assets/story-4.png',
    'Pacific Rim – white felt western hat',
    ['Silverbelly', 'Chocolate', 'Black'],
    '2026-10-22T18:41:07Z',
  ),
];
