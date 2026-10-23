import {useEffect} from 'react';
import {type FetcherWithComponents} from 'react-router';
import {CartForm, Money} from '@shopify/hydrogen';
import type {HomepageProductFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {PillButton, PillFill} from './PillButton';

type CartActionData = {cart?: {checkoutUrl?: string} | null};

/**
 * Price + cart actions for the hat currently in the collection ring. Falls
 * back to a link to the catalogue when there is no live product.
 */
export function ProductCta({product}: {product?: HomepageProductFragment}) {
  const variant = product?.selectedOrFirstAvailableVariant;
  if (!product || !variant) {
    return (
      <PillButton
        to="/collections/all"
        label="Shop the collection"
        width={280}
        gap={22}
      />
    );
  }

  const lines = [{merchandiseId: variant.id, quantity: 1}];
  const soldOut = !variant.availableForSale;

  return (
    <div className="flex flex-col gap-18">
      <p className="m-0 flex items-baseline gap-12 font-grotesk fs-22 lh-30 text-hw-taupe">
        <Money
          as="span"
          data={variant.price ?? product.priceRange.minVariantPrice}
          className="font-medium text-hw-espresso"
        />
        {variant.title !== 'Default Title' ? (
          <span className="capitalize">{variant.title}</span>
        ) : null}
      </p>
      <div className="flex items-center gap-28">
        <AddToCart lines={lines} disabled={soldOut} />
        {soldOut ? null : <BuyNow lines={lines} />}
      </div>
    </div>
  );
}

type Lines = Array<{merchandiseId: string; quantity: number}>;

function AddToCart({lines, disabled}: {lines: Lines; disabled: boolean}) {
  const {open} = useAside();
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<CartActionData>) => (
        <button
          type="submit"
          onClick={() => open('cart')}
          disabled={disabled || fetcher.state !== 'idle'}
          className="group relative isolate flex h-60 cursor-pointer items-center gap-12 overflow-hidden r-30 border border-hw-bone bg-white pl-7 pr-28 transition-[border-color,scale] duration-500 hover:border-hw-saddle active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <PillFill />
          <span className="relative flex size-50 shrink-0 items-center justify-center">
            <img
              src="/assets/button-dot.svg"
              alt=""
              className="absolute inset-0 size-full"
            />
            <span
              className="relative size-22 bg-hw-bone transition-[rotate,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hw-mask group-hover:-rotate-12 group-hover:scale-110"
              style={{
                maskImage: 'url(/assets/icon-bag-mask.png)',
                WebkitMaskImage: 'url(/assets/icon-bag-mask.png)',
              }}
            />
          </span>
          <span className="font-grotesk fs-20 lh-20 capitalize text-hw-espresso transition-colors duration-500 group-hover:text-white">
            {disabled
              ? 'Sold out'
              : fetcher.state !== 'idle'
                ? 'Adding…'
                : 'Add to cart'}
          </span>
        </button>
      )}
    </CartForm>
  );
}

/** Adds the line, then sends the shopper straight to checkout. */
function BuyNow({lines}: {lines: Lines}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<CartActionData>) => (
        <BuyNowButton fetcher={fetcher} />
      )}
    </CartForm>
  );
}

function BuyNowButton({
  fetcher,
}: {
  fetcher: FetcherWithComponents<CartActionData>;
}) {
  const checkoutUrl = fetcher.data?.cart?.checkoutUrl;
  useEffect(() => {
    if (fetcher.state === 'idle' && checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [fetcher.state, checkoutUrl]);

  return (
    <button
      type="submit"
      disabled={fetcher.state !== 'idle'}
      // A copper underline wipes in over the resting line from the left.
      className="relative cursor-pointer border-0 bg-transparent p-0 pb-4 font-grotesk fs-20 lh-20 capitalize text-hw-espresso transition-colors duration-300 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-hw-espresso/40 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-hw-copper after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.65,0,0.35,1)] hover:text-hw-copper hover:after:origin-left hover:after:scale-x-100 disabled:cursor-wait"
    >
      {fetcher.state !== 'idle' ? 'One moment…' : 'Buy now'}
    </button>
  );
}
