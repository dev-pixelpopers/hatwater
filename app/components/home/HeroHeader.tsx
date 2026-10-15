import {Link} from 'react-router';
import {useAside} from '~/components/Aside';

/** Brand header that lives inside the hero frame (Figma "Group 18"). */
export function HeroHeader() {
  const {open} = useAside();

  return (
    <header
      data-anim="hero-header"
      className="absolute inset-x-0 top-39 z-30 grid h-115 grid-cols-[1fr_calc(var(--spacing)*185)_1fr] items-center"
    >
      <button
        type="button"
        onClick={() => open('mobile')}
        className="ml-135 cursor-pointer justify-self-start border-0 bg-transparent p-0 font-grotesk font-medium fs-20 uppercase text-hw-bone"
      >
        Menu
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
          className="relative flex size-52 items-center justify-center"
        >
          <img
            src="/assets/icon-ring.svg"
            alt=""
            className="absolute inset-0 size-full"
          />
          <img
            src="/assets/icon-heart.svg"
            alt=""
            className="relative size-28"
          />
        </Link>
        <button
          type="button"
          aria-label="Open cart"
          onClick={() => open('cart')}
          className="relative flex size-52 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
        >
          <img
            src="/assets/icon-ring.svg"
            alt=""
            className="absolute inset-0 size-full"
          />
          <span
            className="relative size-28 bg-hw-bone hw-mask"
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
