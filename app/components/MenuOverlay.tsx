import {Suspense, useEffect, useRef} from 'react';
import {Await, Link, useLocation} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {gsap, prefersReducedMotion, useGsapContext} from '~/lib/gsap';

export const MENU_OVERLAY_ID = 'hw-menu';

const NAV_LINKS = [
  {label: 'Home', to: '/'},
  {label: 'Shop', to: '/collections/all'},
  {label: 'About', to: '/pages/about'},
  {label: 'Contact', to: '/pages/contact'},
];

const FOCUSABLE = 'a[href], button:not([disabled])';

/**
 * Full-screen navigation overlay, opened by the header "Menu" buttons through
 * the aside context (`open('mobile')`). One paused GSAP timeline plays
 * forwards to open and in reverse (faster) to close.
 */
export function MenuOverlay({
  cart,
}: {
  cart: Promise<CartApiQueryFragment | null>;
}) {
  const {type, open, close} = useAside();
  const expanded = type === 'mobile';
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;

  useGsapContext(rootRef, () => {
    const root = rootRef.current;
    if (!root) return;

    gsap.set(root, {autoAlpha: 0});
    const tl = gsap.timeline({paused: true})
      .set(root, {autoAlpha: 1})
      // Copper panel wipes down from the header.
      .fromTo(
        '[data-menu="panel"]',
        {clipPath: 'inset(0% 0% 100% 0%)'},
        {clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut'},
      )
      // Each link rises out of its own mask.
      .fromTo(
        '[data-menu="link"]',
        {yPercent: 110},
        {yPercent: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out'},
        0.4,
      )
      .fromTo(
        '[data-menu="fade"]',
        {autoAlpha: 0, y: 16},
        {autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out'},
        0.55,
      );

    // Server render / remount while already open.
    if (expandedRef.current) tl.progress(1);
    timelineRef.current = tl;
    return () => {
      timelineRef.current = null;
    };
  });

  // Play / reverse, lock body scroll and manage focus.
  useEffect(() => {
    const tl = timelineRef.current;
    if (tl) {
      if (prefersReducedMotion()) {
        tl.progress(expanded ? 1 : 0).pause();
      } else if (expanded) {
        tl.timeScale(1).play();
      } else if (tl.progress() > 0) {
        tl.timeScale(1.6).reverse();
      }
    }
    const root = rootRef.current;
    if (!expanded || !root) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    root.querySelector<HTMLElement>('[data-menu="close"]')?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      // Only hand focus back if nothing else (e.g. the cart) has taken it.
      if (root.contains(document.activeElement)) {
        previousFocus?.focus();
      }
    };
  }, [expanded]);

  // Escape closes; Tab stays inside the dialog.
  useEffect(() => {
    if (!expanded) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab' || !rootRef.current) return;
      const focusable = Array.from(
        rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [expanded, close]);

  // Close on any route change (back/forward included).
  const location = useLocation();
  useEffect(() => {
    if (expandedRef.current) close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  return (
    <div
      ref={rootRef}
      id={MENU_OVERLAY_ID}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!expanded}
      className="invisible fixed inset-0 z-[70] opacity-0"
    >
      <div
        data-menu="panel"
        className="absolute inset-0 hw-panel-gradient"
        style={{clipPath: 'inset(0% 0% 100% 0%)'}}
      />

      <div className="relative flex h-full flex-col px-[clamp(20px,7vw,135px)] py-[clamp(20px,3vw,48px)] text-hw-bone">
        <div
          data-menu="fade"
          className="grid grid-cols-[1fr_auto_1fr] items-center"
        >
          <button
            type="button"
            data-menu="close"
            onClick={close}
            aria-controls={MENU_OVERLAY_ID}
            aria-expanded={expanded}
            className="group flex cursor-pointer items-center gap-3 justify-self-start border-0 bg-transparent p-0 font-grotesk text-[clamp(14px,1.05vw,20px)] font-medium uppercase tracking-[0.04em] text-hw-bone"
          >
            <span
              aria-hidden
              className="relative block size-[0.9em] transition-transform duration-500 ease-out group-hover:rotate-90"
            >
              <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
            </span>
            Close
          </button>

          <Link
            to="/"
            onClick={close}
            aria-label="Hatwater House home"
            className="block h-[clamp(52px,6vw,115px)] w-[clamp(84px,9.6vw,185px)]"
          >
            <span
              className="block size-full bg-hw-bone hw-mask"
              style={{
                maskImage: 'url(/assets/logo-mask.png)',
                WebkitMaskImage: 'url(/assets/logo-mask.png)',
              }}
            />
          </Link>
          <span />
        </div>

        <div className="flex flex-1 flex-col justify-center gap-10 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Main">
            <ul className="group/nav m-0 flex list-none flex-col p-0">
              {NAV_LINKS.map((link, index) => (
                <li key={link.to} className="overflow-hidden">
                  <Link
                    to={link.to}
                    prefetch="intent"
                    onClick={close}
                    data-menu="link"
                    className="group flex items-baseline gap-[clamp(12px,1.6vw,28px)] py-[0.06em] text-hw-bone no-underline transition-opacity duration-500 hover:no-underline group-hover/nav:opacity-40 hover:!opacity-100 focus-visible:!opacity-100"
                  >
                    <MenuItemLabel index={index} label={link.label} />
                  </Link>
                </li>
              ))}
              <li className="overflow-hidden">
                <button
                  type="button"
                  data-menu="link"
                  onClick={() => open('cart')}
                  className="group flex cursor-pointer items-baseline gap-[clamp(12px,1.6vw,28px)] border-0 bg-transparent p-0 py-[0.06em] text-left text-hw-bone transition-opacity duration-500 group-hover/nav:opacity-40 hover:!opacity-100 focus-visible:!opacity-100"
                >
                  <MenuItemLabel index={NAV_LINKS.length} label="Cart">
                    <Suspense fallback={null}>
                      <Await resolve={cart} errorElement={null}>
                        {(cart) =>
                          cart?.totalQuantity ? (
                            <sup className="ml-2 font-grotesk text-[0.22em] font-medium tracking-normal text-hw-sand">
                              ({cart.totalQuantity})
                            </sup>
                          ) : null
                        }
                      </Await>
                    </Suspense>
                  </MenuItemLabel>
                </button>
              </li>
            </ul>
          </nav>

          <div
            data-menu="fade"
            className="flex max-w-[26rem] flex-col gap-6 font-grotesk text-[clamp(14px,1.05vw,19px)] leading-relaxed text-hw-sand"
          >
            <p className="m-0 font-display text-[clamp(22px,1.9vw,36px)] capitalize leading-[1.3] text-hw-bone">
              Every hat is made just for you — shaped to order and finished by
              hand.
            </p>
            <Link
              to="/pages/contact"
              onClick={close}
              className="self-start border-b border-hw-sand/50 pb-1 uppercase tracking-[0.06em] text-hw-bone no-underline transition-colors duration-300 hover:border-hw-bone hover:no-underline"
            >
              Request a custom hat
            </Link>
          </div>
        </div>

        <div
          data-menu="fade"
          className="flex items-center justify-between border-t border-hw-bone/20 pt-[clamp(14px,1.6vw,24px)] font-grotesk text-[clamp(12px,0.85vw,15px)] uppercase tracking-[0.08em] text-hw-sand"
        >
          <span>Hatwater House</span>
          <span>Handmade to order</span>
        </div>
      </div>
    </div>
  );
}

function MenuItemLabel({
  index,
  label,
  children,
}: {
  index: number;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <span className="w-[2.2em] font-grotesk text-[clamp(12px,0.95vw,17px)] font-medium tracking-[0.08em] text-hw-sand transition-colors duration-500 group-hover:text-hw-bone">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="relative font-display text-[clamp(48px,7.4vw,136px)] capitalize leading-[0.98] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[0.18em]">
        {label}
        {children}
        <span
          aria-hidden
          className="absolute -bottom-[0.02em] left-0 h-[2px] w-full origin-left scale-x-0 bg-hw-sand transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
        />
      </span>
    </>
  );
}
