import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

const OPTION =
  'relative flex min-h-[44px] min-w-[52px] cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 font-grotesk text-[14px] leading-tight no-underline transition-colors duration-300 hover:no-underline disabled:cursor-not-allowed';

function optionClass(selected: boolean, available: boolean) {
  return `${OPTION} ${
    selected
      ? 'border-hw-espresso bg-hw-espresso text-hw-bone'
      : 'border-hw-espresso/20 bg-transparent text-hw-espresso hover:border-hw-espresso'
  } ${available ? '' : 'opacity-40 line-through'}`;
}

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  return (
    <div className="flex flex-col gap-[clamp(20px,1.6vw,28px)]">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;
        const current = option.optionValues.find((value) => value.selected);

        return (
          <fieldset key={option.name} className="m-0 border-0 p-0">
            <legend className="mb-3 flex w-full items-baseline justify-between gap-4 p-0 font-grotesk text-[12px] font-medium uppercase tracking-[0.18em] text-hw-taupe">
              <span>{option.name}</span>
              {current && (
                <span className="normal-case tracking-normal text-hw-espresso">
                  {current.name}
                </span>
              )}
            </legend>
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  // SEO: combined listing children link to their own URL.
                  return (
                    <Link
                      className={optionClass(selected, available)}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      aria-current={selected || undefined}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                }
                // SEO: variants are buttons so bots don't index duplicates.
                return (
                  <button
                    type="button"
                    className={optionClass(selected, available)}
                    key={option.name + name}
                    aria-pressed={selected}
                    disabled={!exists}
                    onClick={() => {
                      if (!selected) {
                        void navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    <ProductOptionSwatch swatch={swatch} name={name} />
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold Out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <>
      <span
        aria-hidden
        className="block size-4 overflow-hidden rounded-full border border-hw-espresso/20"
        style={{backgroundColor: color || 'transparent'}}
      >
        {!!image && (
          <img src={image} alt="" className="size-full rounded-none object-cover" />
        )}
      </span>
      {name}
    </>
  );
}
