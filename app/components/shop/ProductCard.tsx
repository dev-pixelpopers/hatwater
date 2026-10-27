import {useEffect, useRef, useState} from 'react';
import {Link, type FetcherWithComponents} from 'react-router';
import {CartForm, Image, Money} from '@shopify/hydrogen';
import {APPOINTMENT_URL} from '~/components/site/links';
import type {ShopProduct} from './shopData';

type CardImage = NonNullable<ShopProduct['featuredImage']>;

/** Shopify CDN images go through <Image>; local fallback art is a plain img. */
function CardImg({
  image,
  alt,
  className,
  loading,
}: {
  image: CardImage;
  alt: string;
  className: string;
  loading: 'eager' | 'lazy';
}) {
  if (image.url.startsWith('/')) {
    return (
      <img
        src={image.url}
        alt={alt}
        loading={loading}
        className={className}
      />
    );
  }
  return (
    <Image
      data={image}
      alt={alt}
      aspectRatio="4/5"
      crop="center"
      loading={loading}
      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
      className={className}
    />
  );
}

const IMAGE =
  'absolute inset-0 size-full object-cover transition-[scale,opacity,clip-path] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]';

export function ProductCard({
  product,
  index,
}: {
  product: ShopProduct;
  index: number;
}) {
  const [primary, secondary] = product.images.nodes;
  const image = product.featuredImage ?? primary;
  const alternate = secondary && secondary.url !== image?.url ? secondary : null;
  const colours =
    product.options.find((option) => /colou?r/i.test(option.name))
      ?.optionValues ?? [];
  const url = `/products/${product.handle}`;
  const loading = index < 4 ? 'eager' : 'lazy';

  return (
    <article data-card className="group/card flex flex-col">
      <Link
        to={url}
        prefetch="intent"
        aria-label={product.title}
        className="relative block aspect-[4/5] overflow-hidden bg-hw-linen"
      >
        {image && (
          <CardImg
            image={image}
            alt={image.altText || product.title}
            loading={loading}
            className={`${IMAGE} group-hover/card:scale-[1.06] ${
              alternate ? 'group-hover/card:opacity-0' : ''
            }`}
          />
        )}
        {/* Second angle wipes up from the bottom on hover. */}
        {alternate && (
          <CardImg
            image={alternate}
            alt=""
            loading="lazy"
            className={`${IMAGE} scale-[1.08] [clip-path:inset(100%_0%_0%_0%)] group-hover/card:scale-100 group-hover/card:[clip-path:inset(0%_0%_0%_0%)]`}
          />
        )}
        <span className="absolute left-[clamp(10px,0.9vw,16px)] top-[clamp(10px,0.9vw,16px)] bg-hw-cream/90 px-2.5 py-1 font-grotesk text-[clamp(10px,0.62vw,12px)] font-medium uppercase tracking-[0.16em] text-hw-espresso">
          Made to order
        </span>
        <span
          aria-hidden
          className="absolute bottom-[clamp(10px,0.9vw,16px)] right-[clamp(10px,0.9vw,16px)] flex size-[clamp(38px,2.6vw,48px)] translate-y-3 items-center justify-center rounded-full bg-hw-cream text-hw-espresso opacity-0 transition-[opacity,translate] duration-500 group-hover/card:translate-y-0 group-hover/card:opacity-100"
        >
          <svg viewBox="0 0 16 16" className="size-[38%] -rotate-45" fill="none">
            <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-[clamp(10px,0.8vw,14px)] pt-[clamp(14px,1.1vw,20px)]">
        <div className="flex items-start justify-between gap-4">
          <h3 className="m-0 font-display text-[clamp(20px,1.55vw,30px)] font-normal capitalize leading-[1.1] text-hw-espresso">
            <Link
              to={url}
              prefetch="intent"
              className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat text-hw-espresso no-underline transition-[background-size] duration-500 hover:bg-[length:100%_1px] hover:no-underline"
            >
              {product.title}
            </Link>
          </h3>
          <p className="m-0 shrink-0 pt-[0.2em] font-grotesk text-[clamp(14px,0.95vw,17px)] text-hw-taupe">
            <Money data={product.priceRange.minVariantPrice} withoutTrailingZeros />
          </p>
        </div>

        {colours.length > 0 && (
          <p className="m-0 font-grotesk text-[clamp(12px,0.75vw,14px)] uppercase tracking-[0.12em] text-hw-taupe/80">
            {colours.length} colourway{colours.length === 1 ? '' : 's'} ·{' '}
            {colours
              .slice(0, 3)
              .map((value) => value.name)
              .join(', ')}
          </p>
        )}

        <div className="mt-auto pt-1">
          {product.isFallback || !product.selectedOrFirstAvailableVariant ? (
            <Link
              to={APPOINTMENT_URL}
              className={`${BUTTON} border-hw-espresso/30 bg-transparent text-hw-espresso hover:border-hw-espresso hover:bg-hw-espresso hover:text-hw-bone`}
            >
              Enquire to order
            </Link>
          ) : (
            <AddToCart product={product} />
          )}
        </div>
      </div>
    </article>
  );
}

const BUTTON =
  'relative flex h-[clamp(44px,2.8vw,52px)] w-full cursor-pointer items-center justify-center gap-2 overflow-hidden border font-grotesk text-[clamp(11px,0.7vw,13px)] font-medium uppercase tracking-[0.18em] no-underline transition-[background-color,color,border-color] duration-500 hover:no-underline disabled:cursor-not-allowed';

type CartFetcherData = {errors?: unknown[] | null} | undefined;

/**
 * Adds the first available variant. The button flips to "Added" the moment
 * it is pressed (the header count is optimistic too) and only falls back to
 * an error if the cart action reports one.
 */
function AddToCart({product}: {product: ShopProduct}) {
  const variant = product.selectedOrFirstAvailableVariant!;
  const available = variant.availableForSale;

  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesAdd}
      inputs={{
        lines: [{merchandiseId: variant.id, quantity: 1, selectedVariant: variant}],
      }}
    >
      {(fetcher: FetcherWithComponents<CartFetcherData>) => (
        <AddToCartButton
          fetcher={fetcher}
          available={available}
          variantTitle={variant.title}
        />
      )}
    </CartForm>
  );
}

function AddToCartButton({
  fetcher,
  available,
  variantTitle,
}: {
  fetcher: FetcherWithComponents<CartFetcherData>;
  available: boolean;
  variantTitle: string;
}) {
  const [status, setStatus] = useState<'idle' | 'added' | 'error'>('idle');
  const busy = fetcher.state !== 'idle';
  const wasBusy = useRef(false);

  useEffect(() => {
    if (busy) {
      wasBusy.current = true;
      setStatus('added');
      return;
    }
    if (!wasBusy.current) return;
    wasBusy.current = false;
    const failed = Boolean(fetcher.data?.errors?.length);
    setStatus(failed ? 'error' : 'added');
    const timer = setTimeout(() => setStatus('idle'), failed ? 3200 : 2200);
    return () => clearTimeout(timer);
  }, [busy, fetcher.data]);

  const label = !available
    ? 'Sold out'
    : status === 'added'
      ? 'Added to bag'
      : status === 'error'
        ? 'Couldn’t add – retry'
        : 'Add to cart';

  return (
    <>
      <button
        type="submit"
        disabled={!available || busy}
        title={`Adds ${variantTitle}`}
        className={`${BUTTON} ${
          status === 'added'
            ? 'border-hw-copper bg-hw-copper text-white'
            : status === 'error'
              ? 'border-hw-rust bg-transparent text-hw-rust'
              : 'border-hw-espresso bg-hw-espresso text-hw-bone hover:bg-transparent hover:text-hw-espresso disabled:border-hw-sand disabled:bg-hw-sand disabled:text-white'
        }`}
      >
        {status === 'added' && (
          <svg viewBox="0 0 16 16" aria-hidden className="size-[1.3em]" fill="none">
            <path
              d="M3 8.5l3.2 3L13 4.5"
              stroke="currentColor"
              strokeWidth="1.6"
              pathLength={1}
              className="animate-[hw-draw_0.5s_ease-out_both] [stroke-dasharray:1]"
            />
          </svg>
        )}
        <span>{label}</span>
        {/* Progress hairline while the cart request is in flight. */}
        <span
          aria-hidden
          className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-white/70 transition-transform ${
            busy ? 'scale-x-100 duration-[1200ms]' : 'scale-x-0 duration-200'
          }`}
        />
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {status === 'added' ? 'Added to cart' : status === 'error' ? 'Could not add to cart' : ''}
      </span>
    </>
  );
}
