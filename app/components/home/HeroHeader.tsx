import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {MENU_OVERLAY_ID} from '~/components/MenuOverlay';

const EASE = 'duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]';
const ROLL = `transition-transform ${EASE}`;
const ICON_BUTTON =
  'relative flex size-52 items-center justify-center transition-[scale] duration-300 active:scale-90';
/** Bone icon that turns espresso as the ring fills behind it. */
const ICON = `bg-hw-bone hw-mask transition-[background-color,scale] ${EASE} group-hover:scale-110 group-hover:bg-hw-espresso`;

/** Outline ring that floods with bone from the centre on hover. */
function IconRing() {
  return (
    <>
      <img
        src="/assets/icon-ring.svg"
        alt=""
        className="absolute inset-0 size-full"
      />
      <span
        aria-hidden
        className={`absolute inset-0 scale-0 rounded-full bg-hw-bone transition-[scale] ${EASE} group-hover:scale-100`}
      />
    </>
  );
}

/** Brand header that lives inside the hero frame (Figma "Group 18"). */
export function HeroHeader() {
  const {type, open, close} = useAside();
  const menuOpen = type === 'mobile';

  return (
    <header
      data-anim="hero-header"
      className="absolute inset-x-0 top-39 z-30 grid h-115 grid-cols-[1fr_calc(var(--spacing)*185)_1fr] items-center"
    >
      <button
        type="button"
        onClick={() => (menuOpen ? close() : open('mobile'))}
        aria-controls={MENU_OVERLAY_ID}
        aria-expanded={menuOpen}
        className="group relative ml-135 cursor-pointer justify-self-start overflow-hidden border-0 bg-transparent p-0 font-grotesk font-medium fs-20 uppercase text-hw-bone"
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
        aria-label="Hatwater House home"
        className="block h-115 w-185"
      >
        <span
          className="block size-full bg-hw-bone hw-mask"
          style={{
            maskImage: 'url(/assets/logo-mask.png)',
            WebkitMaskImage: 'url(/assets/logo-mask.png)',
          }}
        />
      </Link>

      <nav aria-label="Account" className="mr-214 flex gap-10 justify-self-end">
        <Link
          to="/account"
          aria-label="Wishlist"
          className={`group ${ICON_BUTTON}`}
        >
          <IconRing />
          <span
            className={`relative size-28 ${ICON}`}
            style={{
              maskImage: 'url(/assets/icon-heart.svg)',
              WebkitMaskImage: 'url(/assets/icon-heart.svg)',
            }}
          />
        </Link>
        <button
          type="button"
          aria-label="Open cart"
          onClick={() => open('cart')}
          className={`group cursor-pointer border-0 bg-transparent p-0 ${ICON_BUTTON}`}
        >
          <IconRing />
          <span
            className={`relative size-28 ${ICON}`}
            style={{
              maskImage: 'url(/assets/icon-bag-mask.png)',
              WebkitMaskImage: 'url(/assets/icon-bag-mask.png)',
            }}
          />
        </button>
      </nav>
    </header>
  );
}
