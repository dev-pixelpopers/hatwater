import {useCallback, useRef} from 'react';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {COLLECTION_ITEMS} from '~/components/home/collectionData';
import {CompactHome} from '~/components/home/CompactHome';
import {GalleryScene} from '~/components/home/GalleryScene';
import type {HeroIntroHandle} from '~/components/home/HeroLayer';
import {Preloader} from '~/components/home/Preloader';
import {ShowcaseScene} from '~/components/home/ShowcaseScene';
import {StoryScene} from '~/components/home/StoryScene';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Hatwater House | Made for One. Made for You.'},
    {
      name: 'description',
      content:
        'Western-inspired hats, individually shaped and finished in Los Angeles. Explore the California Collection or commission a hat from Hatwater House.',
    },
  ];
};

/**
 * The home page brings its own header and footer on the artboard; in the
 * compact layout PageLayout shows the regular ones (see PageLayout).
 */
export const handle = {hideLayoutChrome: true};

export async function loader({context}: Route.LoaderArgs) {
  const {storefront} = context;

  // The collection carousel falls back to its static items when the store
  // returns nothing (or errors), so a Storefront API hiccup never breaks the
  // scrubbed scenes.
  const products = await storefront
    .query(HOMEPAGE_PRODUCTS_QUERY, {
      variables: {
        first: COLLECTION_ITEMS.length,
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

  return {products};
}

export default function Homepage() {
  const {products} = useLoaderData<typeof loader>();
  const heroRef = useRef<HeroIntroHandle>(null);

  // The hero entrance is chained to the end of the preloader timeline.
  const handlePreloaderComplete = useCallback(() => {
    heroRef.current?.playIntro();
  }, []);

  return (
    <>
      <div className="hw">
        <Preloader onComplete={handlePreloaderComplete} />
      </div>
      {/* Scrubbed artboard scenes on landscape screens >= 1024px wide... */}
      <div className="hw bg-white compact:hidden">
        <ShowcaseScene ref={heroRef} products={products} />
        <StoryScene />
        <GalleryScene />
      </div>
      {/* ...and a fluid layout on phones and portrait tablets. */}
      <CompactHome products={products} className="hidden compact:block" />
    </>
  );
}

const HOMEPAGE_PRODUCTS_QUERY = `#graphql
  fragment HomepageProduct on Product {
    id
    title
    handle
    description
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
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
        id
        url
        altText
        width
        height
      }
    }
  }
  query HomepageProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int!
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        ...HomepageProduct
      }
    }
  }
` as const;
