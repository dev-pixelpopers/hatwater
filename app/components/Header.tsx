import {Suspense} from 'react';
import {Await, Link, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {MENU_OVERLAY_ID} from '~/components/MenuOverlay';
import {NAV_LINKS, maskStyle} from '~/components/site/links';

interface HeaderProps {
  cart: Promise<CartApiQueryFragment | null>;
}

const EASE = 'duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]';
const ROLL = `transition-transform ${EASE}`;
const ICON_BUTTON = `group relative flex size-[clamp(40px,2.8vw,52px)] cursor-pointer items-center justify-center rounded-full border border-hw-espresso/25 bg-transparent p-0 transition-[scale,border-color] duration-300 hover:border-hw-espresso active:scale-90`;

/**
 * Inner-page header: the homepage's hero header (Menu roll, masked logo, icon
 * rings) recoloured espresso-on-cream and laid out fluidly so it works on
 * every route outside the scaled homepage artboard.
 */
export function Header({cart}: HeaderProps) {
  const {type, open, close} = useAside();
  const menuOpen = type === 'mobile';

  return (
    <header className="sticky top-0 z-50 border-b border-hw-espresso/10 bg-hw-cream font-grotesk text-hw-espresso">
      <div className="mx-auto grid h-[clamp(64px,5.6vw,96px)] max-w-[1720px] grid-cols-[1fr_auto_1fr] items-center px-[clamp(20px,5vw,96px)]">
        <div className="flex items-center gap-[clamp(20px,2.4vw,44px)] justify-self-start">
          <button
            type="button"
            onClick={() => (menuOpen ? close() : open('mobile'))}
            aria-controls={MENU_OVERLAY_ID}
            aria-expanded={menuOpen}
            className="group relative cursor-pointer overflow-hidden border-0 bg-transparent p-0 text-[clamp(13px,0.95vw,17px)] font-medium uppercase tracking-[0.04em] text-hw-espresso"
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

          <nav aria-label="Main" className="hidden gap-[clamp(16px,1.8vw,32px)] lg:flex">
            {NAV_LINKS.slice(1).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                prefetch="intent"
                className={({isActive}) =>
                  `group relative py-1 text-[clamp(13px,0.95vw,17px)] uppercase tracking-[0.04em] text-hw-espresso no-underline hover:no-underline ${
                    isActive ? 'font-medium' : ''
                  }`
                }
              >
                {({isActive}) => (
                  <>
                    {link.label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-0 bottom-0 h-px origin-left bg-current transition-transform ${EASE} group-hover:scale-x-100 ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <Link
          to="/"
          prefetch="intent"
          aria-label="Hatwater House home"
          className="block h-[clamp(40px,3.6vw,62px)] w-[clamp(64px,5.8vw,100px)]"
        >
          <span
            className="block size-full bg-hw-espresso hw-mask"
            style={maskStyle('/assets/logo-mask.png')}
          />
        </Link>

        <nav
          aria-label="Account"
          className="flex items-center gap-[clamp(6px,0.6vw,10px)] justify-self-end"
        >
          <Link
            to="/account"
            aria-label="Account"
            className={`${ICON_BUTTON} no-underline`}
          >
            <IconFill />
            <span
              className={`relative size-[45%] bg-hw-espresso hw-mask transition-[background-color] ${EASE} group-hover:bg-hw-bone`}
              style={maskStyle('/assets/icon-heart.svg')}
            />
          </Link>
          <CartToggle cart={cart} />
        </nav>
      </div>
    </header>
  );
}

/** Espresso disc that floods the ring from the centre on hover. */
function IconFill() {
  return (
    <span
      aria-hidden
      className={`absolute inset-0 scale-0 rounded-full bg-hw-espresso transition-[scale] ${EASE} group-hover:scale-100`}
    />
  );
}

function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      aria-label={`Open cart (${count} ${count === 1 ? 'item' : 'items'})`}
      className={`${ICON_BUTTON} no-underline`}
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
      <IconFill />
      <span
        className={`relative size-[50%] bg-hw-espresso hw-mask transition-[background-color] ${EASE} group-hover:bg-hw-bone`}
        style={maskStyle('/assets/icon-bag-mask.png')}
      />
      {count > 0 && (
        <span
          key={count}
          className="absolute -right-1 -top-1 flex size-[clamp(17px,1.2vw,22px)] animate-[hw-pop_0.45s_cubic-bezier(0.34,1.56,0.64,1)] items-center justify-center rounded-full bg-hw-copper text-[clamp(10px,0.65vw,12px)] font-medium leading-none text-white"
        >
          {count}
        </span>
      )}
    </a>
  );
}

function CartToggle({cart}: HeaderProps) {
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
