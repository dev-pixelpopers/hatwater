import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {ArrowSwap} from '~/components/home/ArrowSwap';
import {NAV_LINKS, maskStyle} from '~/components/site/links';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};
/** Returns a map of all line items and their children. */
function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const lineChildren = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(lineChildren)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}
/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  return (
    <section
      className="cart-main"
      data-layout={layout}
      aria-label={layout === 'page' ? 'Cart page' : 'Cart drawer'}
    >
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details" hidden={!linesCount}>
        <p id="cart-lines" className="sr-only">
          Line items
        </p>
        <div className="cart-lines">
          <ul aria-labelledby="cart-lines">
            {(cart?.lines?.nodes ?? []).map((line) => {
              // we do not render non-parent lines at the root of the cart
              if (
                'parentRelationship' in line &&
                line.parentRelationship?.parent
              ) {
                return null;
              }
              return (
                <CartLineItem
                  key={line.id}
                  line={line}
                  layout={layout}
                  childrenMap={childrenMap}
                />
              );
            })}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </section>
  );
}

const SHOP_URL = NAV_LINKS.find((link) => link.label === 'Shop')?.to ?? '/';

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div className="cart-empty" hidden={hidden}>
      <span
        aria-hidden
        className="cart-empty-mark hw-mask"
        style={maskStyle('/assets/hh-monogram.svg')}
      />
      <p className="cart-eyebrow">Nothing here yet</p>
      <h4 className="cart-empty-title">Your cart is waiting</h4>
      <p className="cart-empty-copy">
        Every Hatwater hat is shaped to order and finished by hand. Find the
        one that&rsquo;s made for you.
      </p>
      <CartPill to={SHOP_URL} label="Explore the collection" onClick={close} />
    </div>
  );
}

/** White pill with the copper arrow disc, matching the site's ArrowPill. */
export function CartPill({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      prefetch="viewport"
      className="group relative isolate inline-flex h-[54px] items-center gap-3 overflow-hidden rounded-full border border-hw-sand bg-white pl-[6px] pr-6 no-underline transition-[border-color,scale] duration-500 hover:border-hw-saddle hover:no-underline active:scale-[0.97]"
    >
      <span
        aria-hidden
        className="absolute left-[6px] top-1/2 -z-10 aspect-square h-[calc(100%-12px)] -translate-y-1/2 rounded-full hw-panel-gradient transition-[scale] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-[13]"
      />
      <span className="relative flex aspect-square h-[calc(100%-12px)] shrink-0 items-center justify-center overflow-hidden rounded-full">
        <img
          src="/assets/button-dot.svg"
          alt=""
          className="absolute inset-0 size-full rounded-none"
        />
        <ArrowSwap className="-rotate-45 !h-[10px] !w-[14px]" />
      </span>
      <span className="whitespace-nowrap font-grotesk text-[16px] text-hw-espresso transition-colors duration-500 group-hover:text-white">
        {label}
      </span>
    </Link>
  );
}
