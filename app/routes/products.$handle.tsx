import {useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import type {ProductFragment} from 'storefrontapi.generated';
import {
  getSelectedProductOptions,
  Analytics,
  Image,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductForm} from '~/components/ProductForm';
import {APPOINTMENT_URL} from '~/components/site/links';
import {CONTAINER, Eyebrow} from '~/components/site/ui';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  const product = data?.product;
  return [
    {title: `${product?.seo.title || product?.title || 'Hat'} | Hatwater House`},
    {
      name: 'description',
      content:
        product?.seo.description ||
        product?.description?.slice(0, 155) ||
        'A Hatwater House hat, individually shaped and finished to order in Los Angeles.',
    },
    {
      rel: 'canonical',
      href: `/products/${product?.handle}`,
    },
  ];
};

export const handle = {fullBleed: true};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

/** Ordering steps, in the brief's language. */
const ORDER_STEPS = [
  {
    title: 'Choose your hat',
    copy: 'Select the felt, size, and color that suit you.',
  },
  {
    title: 'Shaped to order',
    copy: 'Your hat is individually shaped and finished to order in Los Angeles.',
  },
  {
    title: 'Finished with intention',
    copy: 'Each hat is inspected, refined, and prepared for the person who will make it their own.',
  },
];

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;
  const optionValue = (pattern: RegExp) =>
    selectedVariant?.selectedOptions.find((option) =>
      pattern.test(option.name),
    )?.value;
  const sizes =
    product.options.find((option) => /size/i.test(option.name))
      ?.optionValues ?? [];

  const details = [
    {
      label: 'Material',
      value: product.material?.value || optionValue(/material|felt/i),
    },
    {
      label: 'Size',
      value:
        optionValue(/size/i) ??
        (sizes.length
          ? `${sizes[0].name} – ${sizes[sizes.length - 1].name}`
          : undefined),
    },
    {label: 'Color', value: optionValue(/colou?r/i)},
    {
      label: 'Estimated lead time',
      // Set per product in Shopify (metafield custom.lead_time).
      value:
        product.leadTime?.value ||
        'Made to order — timing is confirmed with your order.',
    },
  ].filter((detail): detail is {label: string; value: string} =>
    Boolean(detail.value),
  );

  return (
    <div className="hw-page bg-hw-cream font-grotesk text-hw-espresso">
      <div
        className={`${CONTAINER} grid gap-[clamp(32px,5vw,110px)] py-[clamp(28px,4vw,80px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]`}
      >
        <ProductGallery
          title={title}
          selectedImage={selectedVariant?.image}
          images={product.images.nodes}
        />

        <div className="flex flex-col gap-[clamp(22px,2vw,36px)] lg:sticky lg:top-8 lg:self-start">
          <div className="flex flex-col gap-3">
            <Eyebrow>Made to Order</Eyebrow>
            <h1 className="m-0 font-display text-[clamp(40px,4.2vw,80px)] font-normal leading-[1] text-hw-espresso">
              {title}
            </h1>
            {product.productType && (
              <p className="m-0 text-[clamp(15px,1vw,18px)] text-hw-taupe">
                {product.productType}
              </p>
            )}
            <div className="font-grotesk text-[clamp(18px,1.25vw,22px)] text-hw-espresso [&_s]:text-hw-taupe [&_.product-price-on-sale]:flex [&_.product-price-on-sale]:gap-3">
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
            </div>
          </div>

          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />

          <p className="m-0 text-[14px] leading-[1.6] text-hw-taupe">
            Unsure of your size or looking for something entirely your own?{' '}
            <Link
              to={APPOINTMENT_URL}
              className="text-hw-espresso underline underline-offset-4 hover:text-hw-copper"
            >
              Commission a Hat
            </Link>
            .
          </p>

          <dl className="m-0 flex flex-col border-t border-hw-espresso/15">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] gap-4 border-b border-hw-espresso/15 py-3 text-[clamp(14px,0.95vw,16px)]"
              >
                <dt className="text-[12px] font-medium uppercase leading-[1.8] tracking-[0.16em] text-hw-taupe">
                  {detail.label}
                </dt>
                <dd className="m-0 text-hw-espresso">{detail.value}</dd>
              </div>
            ))}
          </dl>

          {descriptionHtml && (
            <div
              className="text-[clamp(15px,1.05vw,18px)] leading-[1.7] text-hw-taupe [&_p]:m-0 [&_p+p]:mt-4"
              dangerouslySetInnerHTML={{__html: descriptionHtml}}
            />
          )}

          <section aria-labelledby="ordering-heading" className="flex flex-col gap-4">
            <h2
              id="ordering-heading"
              className="m-0 font-display text-[clamp(24px,1.8vw,32px)] font-normal text-hw-espresso"
            >
              How Ordering Works
            </h2>
            <ol className="m-0 flex list-none flex-col gap-4 p-0">
              {ORDER_STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-hw-copper/50 text-[12px] font-medium text-hw-copper">
                    {index + 1}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-hw-espresso">
                      {step.title}
                    </span>
                    <span className="text-[15px] leading-[1.5] text-hw-taupe">
                      {step.copy}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

type GalleryImage = NonNullable<ProductFragment['images']['nodes'][number]>;

/**
 * Large image of the selected variant with the product's other photos as
 * thumbnails underneath. Choosing a variant resets to its own photo.
 */
function ProductGallery({
  title,
  selectedImage,
  images,
}: {
  title: string;
  selectedImage?: GalleryImage | null;
  images: GalleryImage[];
}) {
  const all = selectedImage
    ? [selectedImage, ...images.filter((image) => image.id !== selectedImage.id)]
    : images;
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [lastSelected, setLastSelected] = useState(selectedImage?.id);
  if (lastSelected !== selectedImage?.id) {
    setLastSelected(selectedImage?.id);
    setPickedId(null);
  }
  const active = all.find((image) => image.id === pickedId) ?? all[0];

  return (
    <div className="flex flex-col gap-3 lg:self-start">
      <div className="relative aspect-[4/5] overflow-hidden bg-hw-linen">
        {active ? (
          <Image
            key={active.id}
            data={active}
            alt={active.altText || title}
            aspectRatio="4/5"
            crop="center"
            loading="eager"
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="absolute inset-0 size-full rounded-none object-cover"
          />
        ) : null}
      </div>
      {all.length > 1 && (
        <ul className="m-0 grid list-none grid-cols-5 gap-2 p-0 sm:grid-cols-6">
          {all.slice(0, 6).map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setPickedId(image.id ?? null)}
                aria-label={`Show image ${index + 1} of ${title}`}
                aria-pressed={image.id === active?.id}
                className={`block aspect-square w-full cursor-pointer overflow-hidden border bg-hw-linen p-0 transition-opacity ${
                  image.id === active?.id
                    ? 'border-hw-espresso'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  data={image}
                  alt=""
                  aspectRatio="1/1"
                  crop="center"
                  loading="lazy"
                  sizes="120px"
                  className="size-full rounded-none object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    productType
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 8) {
      nodes {
        __typename
        id
        url
        altText
        width
        height
      }
    }
    material: metafield(namespace: "custom", key: "material") {
      value
    }
    leadTime: metafield(namespace: "custom", key: "lead_time") {
      value
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
