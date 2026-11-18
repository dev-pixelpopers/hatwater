import type { HomepageProductFragment } from 'storefrontapi.generated';
import { PillButton } from './PillButton';

/**
 * Call to action for the hat currently in the collection ring. The homepage
 * deliberately shows no price or size: it links to the product page, where
 * the shopper picks a size, or to the catalogue when there is no live product.
 */
export function ProductCta({ product }: { product?: HomepageProductFragment }) {
  if (!product) {
    return (
      <PillButton
        to="/collections/all"
        label="Explore the Collection"
        width={290}
        gap={22}
      />
    );
  }

  return (
    <PillButton
      to={`/products/${product.handle}`}
      label="Discover the Hat"
      width={270}
      gap={22}
    />
  );
}
