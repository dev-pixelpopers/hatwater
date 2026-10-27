import {useEffect, useMemo, useRef, useState} from 'react';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/collections.all';
import {ProductCard} from '~/components/shop/ProductCard';
import {
  FALLBACK_PRODUCTS,
  SORT_OPTIONS,
  buildCategories,
  sortProducts,
  type ShopProduct,
  type SortValue,
} from '~/components/shop/shopData';
import {APPOINTMENT_URL} from '~/components/site/links';
import {
  ArrowPill,
  CONTAINER,
  Eyebrow,
  SplitWords,
  useScrollReveal,
} from '~/components/site/ui';
import {gsap, prefersReducedMotion, useGsapContext} from '~/lib/gsap';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Shop | Hatwater House'},
    {
      name: 'description',
      content:
        'Shop Hatwater House hats – western, fedora and flat-brim felt hats, each shaped to order and finished by hand.',
    },
  ];
};

export const handle = {fullBleed: true};

export async function loader({context}: Route.LoaderArgs) {
  const {storefront} = context;

  // A Storefront API error or an empty store falls back to the static
  // catalogue so the page always renders complete.
  const products: ShopProduct[] = await storefront
    .query(SHOP_PRODUCTS_QUERY, {
      variables: {
        first: 48,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheShort(),
    })
    .then(({products}) => products.nodes)
    .catch((error: unknown) => {
      console.error(error);
      return [];
    });

  return {
    products: products.length ? products : FALLBACK_PRODUCTS,
    isFallback: !products.length,
  };
}

const ALL = 'all';

export default function Shop() {
  const {products} = useLoaderData<typeof loader>();
  const [active, setActive] = useState(ALL);
  const [sort, setSort] = useState<SortValue>('featured');

  const {label: groupLabel, categories} = useMemo(
    () => buildCategories(products),
    [products],
  );
  const visible = useMemo(() => {
    const category = categories.find((item) => item.id === active);
    const filtered = category
      ? products.filter((product) => category.productIds.includes(product.id))
      : products;
    return sortProducts(filtered, sort);
  }, [products, categories, active, sort]);

  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  useScrollReveal(rootRef);

  // Editorial header entrance.
  useGsapContext(rootRef, () => {
    if (prefersReducedMotion()) return;
    gsap
      .timeline({defaults: {ease: 'expo.out'}})
      .from('[data-intro="title"] [data-word]', {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.08,
      })
      .from(
        '[data-intro="fade"]',
        {autoAlpha: 0, y: 24, duration: 1, stagger: 0.1},
        0.35,
      )
      .from(
        '[data-intro="rule"]',
        {scaleX: 0, transformOrigin: 'left center', duration: 1.4},
        0.2,
      );
  });

  // Cards cascade back in whenever the filter or sort changes.
  useGsapContext(
    gridRef,
    () => {
      if (prefersReducedMotion()) return;
      gsap.from('[data-card]', {
        autoAlpha: 0,
        y: 40,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.07,
        clearProps: 'all',
      });
    },
    [active, sort],
  );

  return (
    <div ref={rootRef} className="hw-page bg-hw-cream font-grotesk text-hw-espresso">
      <header
        className={`${CONTAINER} grid gap-[clamp(28px,3vw,56px)] pb-[clamp(36px,4vw,72px)] pt-[clamp(48px,7vw,130px)] lg:grid-cols-[1.4fr_1fr] lg:items-end`}
      >
        <div className="flex flex-col gap-[clamp(18px,1.6vw,28px)]">
          <div data-intro="fade">
            <Eyebrow>The collection</Eyebrow>
          </div>
          <h1
            data-intro="title"
            className="m-0 font-display text-[clamp(52px,7.4vw,142px)] font-normal capitalize leading-[0.95] tracking-[-0.01em] text-hw-espresso"
          >
            <SplitWords text="Hats made just for you" />
          </h1>
        </div>
        <div className="flex flex-col gap-6 lg:pb-[0.6vw]">
          <p
            data-intro="fade"
            className="m-0 max-w-[44ch] text-[clamp(16px,1.1vw,20px)] leading-[1.6] text-hw-taupe"
          >
            Felt western, fedora and flat-brim silhouettes, each blocked to
            order in our California atelier and finished by hand. Choose your
            colourway – we take care of the fit.
          </p>
          <p
            data-intro="fade"
            className="m-0 text-[clamp(12px,0.75vw,14px)] uppercase tracking-[0.18em] text-hw-copper"
          >
            {String(products.length).padStart(2, '0')} styles · Handmade to
            order
          </p>
        </div>
        <span
          data-intro="rule"
          aria-hidden
          className="h-px w-full bg-hw-espresso/15 lg:col-span-2"
        />
      </header>

      <div className="sticky top-[clamp(64px,5.6vw,96px)] z-30 border-b border-hw-espresso/10 bg-hw-cream/90 backdrop-blur-md">
        <div
          className={`${CONTAINER} flex flex-col gap-3 py-[clamp(12px,1vw,18px)] md:flex-row md:items-center md:justify-between md:gap-8`}
        >
          <FilterPills
            label={groupLabel}
            categories={categories.map(({id, label, productIds}) => ({
              id,
              label,
              count: productIds.length,
            }))}
            total={products.length}
            active={active}
            onChange={setActive}
          />
          <SortSelect value={sort} onChange={setSort} />
        </div>
      </div>

      <section
        aria-label="Products"
        className={`${CONTAINER} py-[clamp(36px,4vw,80px)]`}
      >
        <p className="sr-only" role="status" aria-live="polite">
          Showing {visible.length} of {products.length} hats
        </p>
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-x-[clamp(12px,1.6vw,32px)] gap-y-[clamp(40px,4vw,80px)] min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {visible.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        {!visible.length && (
          <p className="m-0 py-20 text-center font-display text-[clamp(24px,2vw,36px)] text-hw-taupe">
            Nothing in this selection just yet.
          </p>
        )}
      </section>

      <section
        aria-label="Bespoke"
        className={`${CONTAINER} pb-[clamp(64px,8vw,150px)]`}
      >
        <div
          data-reveal
          className="relative isolate grid items-center gap-8 overflow-hidden px-[clamp(24px,5vw,96px)] py-[clamp(40px,5vw,96px)] text-hw-bone md:grid-cols-[1.3fr_auto]"
        >
          <div className="absolute inset-0 -z-10 hw-panel-gradient" />
          <div className="flex flex-col gap-4">
            <Eyebrow className="!text-hw-sand">Bespoke</Eyebrow>
            <h2 className="m-0 font-display text-[clamp(32px,3.4vw,64px)] font-normal capitalize leading-[1.05] text-hw-bone">
              Don’t see your hat? We’ll build it.
            </h2>
            <p className="m-0 max-w-[52ch] text-[clamp(15px,1vw,19px)] leading-relaxed text-hw-sand">
              Book a fitting and we’ll measure your head, choose the felt and
              shape a one-of-one hat with you.
            </p>
          </div>
          <ArrowPill to={APPOINTMENT_URL} label="Book a fitting" />
        </div>
      </section>
    </div>
  );
}

function FilterPills({
  label,
  categories,
  total,
  active,
  onChange,
}: {
  label: string;
  categories: {id: string; label: string; count: number}[];
  total: number;
  active: string;
  onChange: (id: string) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const pills = [{id: ALL, label: 'All', count: total}, ...categories];

  // The espresso indicator glides to whichever pill is active.
  useEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;
    let first = true;
    const move = () => {
      const button = list.querySelector<HTMLElement>(
        `[data-pill="${CSS.escape(active)}"]`,
      );
      if (!button) return;
      gsap.to(indicator, {
        x: button.offsetLeft,
        width: button.offsetWidth,
        autoAlpha: 1,
        duration: first || prefersReducedMotion() ? 0 : 0.7,
        ease: 'expo.out',
      });
      first = false;
    };
    move();
    window.addEventListener('resize', move);
    return () => window.removeEventListener('resize', move);
  }, [active, pills.length]);

  return (
    <div className="flex min-w-0 items-center gap-4">
      <span className="hidden shrink-0 text-[clamp(11px,0.7vw,13px)] uppercase tracking-[0.18em] text-hw-taupe xl:inline">
        {label}
      </span>
      <div
        ref={listRef}
        role="group"
        aria-label={`Filter by ${label.toLowerCase()}`}
        className="relative -mx-1 flex min-w-0 gap-1 overflow-x-auto px-1 py-1 [scrollbar-width:none]"
      >
        <span
          ref={indicatorRef}
          aria-hidden
          className="invisible absolute bottom-1 left-0 top-1 rounded-full bg-hw-espresso opacity-0"
        />
        {pills.map((pill) => {
          const selected = pill.id === active;
          return (
            <button
              key={pill.id}
              type="button"
              data-pill={pill.id}
              aria-pressed={selected}
              onClick={() => onChange(pill.id)}
              className={`relative shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-[clamp(14px,1.1vw,20px)] py-[clamp(7px,0.5vw,10px)] text-[clamp(13px,0.85vw,15px)] tracking-[0.02em] transition-colors duration-500 ${
                selected
                  ? 'border-transparent bg-transparent text-hw-bone'
                  : 'border-hw-espresso/15 bg-transparent text-hw-espresso hover:border-hw-espresso/50'
              }`}
            >
              {pill.label}
              <sup className="ml-1 text-[0.7em] opacity-60">{pill.count}</sup>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SortSelect({
  value,
  onChange,
}: {
  value: SortValue;
  onChange: (value: SortValue) => void;
}) {
  return (
    <label className="relative flex shrink-0 items-center gap-3 self-end md:self-auto">
      <span className="text-[clamp(11px,0.7vw,13px)] uppercase tracking-[0.18em] text-hw-taupe">
        Sort by
      </span>
      <span className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as SortValue)}
          className="cursor-pointer appearance-none rounded-full border border-hw-espresso/15 bg-white py-[clamp(7px,0.5vw,10px)] pl-4 pr-10 font-grotesk text-[clamp(13px,0.85vw,15px)] text-hw-espresso outline-none transition-colors hover:border-hw-espresso/50 focus-visible:border-hw-espresso"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 12 8"
          className="pointer-events-none absolute right-4 top-1/2 w-[10px] -translate-y-1/2 text-hw-espresso"
          fill="none"
        >
          <path d="M1 1.5l5 5 5-5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </span>
    </label>
  );
}

const SHOP_PRODUCTS_QUERY = `#graphql
  fragment ShopImage on Image {
    id
    url
    altText
    width
    height
  }
  fragment ShopProduct on Product {
    id
    handle
    title
    productType
    description
    createdAt
    featuredImage {
      ...ShopImage
    }
    images(first: 2) {
      nodes {
        ...ShopImage
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    collections(first: 4) {
      nodes {
        handle
        title
      }
    }
    options(first: 3) {
      name
      optionValues {
        name
      }
    }
    selectedOrFirstAvailableVariant {
      id
      title
      availableForSale
      price {
        amount
        currencyCode
      }
      image {
        ...ShopImage
      }
      selectedOptions {
        name
        value
      }
      product {
        handle
        title
      }
    }
  }
  query ShopProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int!
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        ...ShopProduct
      }
    }
  }
` as const;
