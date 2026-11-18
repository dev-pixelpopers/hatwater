import {Suspense} from 'react';
import {Await, Link, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {MENU_OVERLAY_ID} from '~/components/MenuOverlay';
import {maskStyle} from '~/components/site/links';

interface HeaderProps {
  cart: Promise<CartApiQueryFragment | null>;
  className?: string;
}

const EASE = 'duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]';
const ROLL = `transition-transform ${EASE}`;
/** Figma pixels on the 1919px homepage artboard -> fluid vw with a floor. */
const ICON_BUTTON =
  'group relative flex size-[clamp(40px,2.71vw,52px)] cursor-pointer items-center justify-center border-0 bg-transparent p-0 no-underline transition-[scale] duration-300 hover:no-underline active:scale-90';
/** Bone icon that turns espresso as the ring fills behind it. */
const ICON = `relative size-[54%] bg-hw-bone hw-mask transition-[background-color,scale] ${EASE} group-hover:scale-110 group-hover:bg-hw-espresso`;

/**
 * Site header: the homepage hero header (Figma "Group 18") on its copper
 * panel - Menu roll, bone logo, ring icons - laid out fluidly so every page
 * outside the scaled homepage artboard gets the same header.
 */
export function Header({cart, className = ''}: HeaderProps) {
  const {type, open, close} = useAside();
  const menuOpen = type === 'mobile';

  return (
    <header
      className={`relative z-50 overflow-hidden font-grotesk text-hw-bone hw-panel-gradient [background-position:50%_0%] [background-size:100%_300%] ${className}`}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center py-[clamp(12px,2.03vw,39px)]">
        <button
          type="button"
          data-menu-toggle
          onClick={() => (menuOpen ? close() : open('mobile'))}
          aria-controls={MENU_OVERLAY_ID}
          aria-expanded={menuOpen}
          className="group relative ml-[clamp(20px,7.03vw,135px)] cursor-pointer justify-self-start overflow-hidden border-0 bg-transparent p-0 font-grotesk text-[clamp(14px,1.04vw,20px)] font-medium uppercase text-hw-bone"
        >
          {/* The label rolls up and a copy rolls in beneath it. */}
          <span className={`block ${ROLL} group-hover:-translate-y-full`}>
            {menuOpen ? 'Close' : 'Menu'}
          </span>
          <span
            aria-hidden
            className={`absolute inset-0 translate-y-full ${ROLL} group-hover:translate-y-0`}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </span>
        </button>

        <Link
          to="/"
          prefetch="intent"
          aria-label="Hatwater House home"
          className="block aspect-[185/115] w-[clamp(96px,9.64vw,185px)]"
        >
          <span
            className="block size-full bg-hw-bone hw-mask"
            style={maskStyle('/assets/logo-mask.png')}
          />
        </Link>

        <nav
          aria-label="Account"
          className="mr-[clamp(20px,11.15vw,214px)] flex items-center gap-[clamp(6px,0.52vw,10px)] justify-self-end"
        >
          <Link to="/account" aria-label="Wishlist" className={ICON_BUTTON}>
            <IconRing />
            <span className={ICON} style={maskStyle('/assets/icon-heart.svg')} />
          </Link>
          <CartToggle cart={cart} />
        </nav>
      </div>
    </header>
  );
}

/** Outline ring that floods with bone from the centre on hover. */
function IconRing() {
  return (
    <>
      <img
        src="/assets/icon-ring.svg"
        alt=""
        className="absolute inset-0 size-full rounded-none"
      />
      <span
        aria-hidden
        className={`absolute inset-0 scale-0 rounded-full bg-hw-bone transition-[scale] ${EASE} group-hover:scale-100`}
      />
    </>
  );
}

function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      aria-label={`Open cart (${count} ${count === 1 ? 'item' : 'items'})`}
      className={ICON_BUTTON}
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <IconRing />
      <span className={ICON} style={maskStyle('/assets/icon-bag-mask.png')} />
      {count > 0 && (
        <span
          key={count}
          className="absolute -right-1 -top-1 flex size-[clamp(17px,1.2vw,22px)] animate-[hw-pop_0.45s_cubic-bezier(0.34,1.56,0.64,1)] items-center justify-center rounded-full bg-hw-bone text-[clamp(10px,0.65vw,12px)] font-medium leading-none text-hw-espresso"
        >
          {count}
        </span>
      )}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}
