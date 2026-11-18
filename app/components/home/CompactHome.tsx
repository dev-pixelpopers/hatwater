import {useRef} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {HomepageProductFragment} from 'storefrontapi.generated';
import {APPOINTMENT_URL} from '~/components/site/links';
import {
  ArrowPill,
  CONTAINER,
  Eyebrow,
  useScrollReveal,
} from '~/components/site/ui';
import {STORIES} from './galleryData';

const GALLERY = [1, 2, 4, 6, 8, 12].map(
  (n) => `/assets/gallery-${String(n).padStart(2, '0')}.png`,
);

const H2 =
  'm-0 font-display text-[clamp(36px,8vw,64px)] font-normal leading-[1] text-hw-espresso';
const BODY =
  'm-0 font-display text-[clamp(20px,4.6vw,30px)] leading-[1.45] text-hw-taupe';

/**
 * Fluid homepage for phones, portrait tablets and other narrow or portrait
 * viewports, where the 1919 x 994 scrubbed artboard would shrink to an
 * unreadable letterbox. Same copy, imagery and palette as the desktop scenes,
 * laid out in normal document flow. Shown via the `compact` variant.
 */
export function CompactHome({
  products,
  className = '',
}: {
  products: HomepageProductFragment[];
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  useScrollReveal(rootRef);

  return (
    <div
      ref={rootRef}
      className={`hw-page bg-hw-cream font-grotesk text-hw-espresso ${className}`}
    >
      {/* Hero */}
      <section
        aria-labelledby="compact-hero-heading"
        className="relative isolate overflow-hidden hw-panel-gradient text-hw-mist"
      >
        <img
          src="/assets/hh-monogram.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-[4%] left-1/2 -z-10 w-[min(118vw,760px)] max-w-none -translate-x-[38%] rounded-none"
        />
        <div
          className={`${CONTAINER} flex flex-col items-start gap-[clamp(14px,3vw,22px)] pt-[clamp(36px,8vw,72px)]`}
        >
          <h1
            id="compact-hero-heading"
            className="m-0 font-display text-[clamp(44px,11vw,84px)] font-normal leading-[1.02] text-hw-mist"
          >
            Made for One.
            <br />
            Made for You.
          </h1>
          <p className="m-0 max-w-[30ch] text-[clamp(16px,3.6vw,21px)] leading-[1.5] text-hw-mist/90">
            Western-inspired hats, individually shaped and finished in Los
            Angeles.
          </p>
          <ArrowPill to={APPOINTMENT_URL} label="Commission a Hat" />
        </div>
        <img
          src="/assets/woman.png"
          alt="Model wearing a cream Hatwater House hat"
          className="mt-[clamp(8px,3vw,24px)] block h-[clamp(380px,110vw,760px)] w-full rounded-none object-cover object-[50%_0%]"
        />
      </section>

      {/* Brand introduction */}
      <section
        aria-labelledby="compact-intro-heading"
        className={`${CONTAINER} grid items-center gap-[clamp(28px,6vw,56px)] py-[clamp(56px,12vw,110px)] md:grid-cols-[0.8fr_1.2fr]`}
      >
        <div data-reveal className="relative mx-auto aspect-[4/5] w-[min(70%,340px)] overflow-hidden md:w-full">
          <img
            src="/assets/chair.png"
            alt="Walnut lounge chair with a Hatwater House hat"
            loading="lazy"
            className="size-full -scale-x-100 rounded-none object-cover object-[47%_60%]"
          />
        </div>
        <div className="flex flex-col items-start gap-[clamp(16px,3.4vw,26px)]">
          <h2 id="compact-intro-heading" data-reveal className={H2}>
            An Individual Expression.
          </h2>
          <p data-reveal className={BODY}>
            Rooted in the Western heritage of California, Hatwater House brings
            traditional hatmaking craftsmanship to a modern expression of
            personal style.
          </p>
          <p data-reveal className={`${BODY} !text-hw-chestnut`}>
            Every hat begins with a considered silhouette and is shaped,
            fitted, and finished with the individual in mind.
          </p>
          <div data-reveal>
            <ArrowPill to="/about" label="Discover Our Story" />
          </div>
        </div>
      </section>

      {/* The California Collection */}
      <section
        aria-labelledby="compact-collection-heading"
        className="bg-hw-linen py-[clamp(56px,12vw,110px)]"
      >
        <div className={`${CONTAINER} flex flex-col gap-3`}>
          <Eyebrow>Mark Alex — The Collection</Eyebrow>
          <h2 id="compact-collection-heading" className={H2}>
            The California Collection
          </h2>
        </div>
        {products.length > 0 && (
          <ul className="m-0 mt-[clamp(24px,5vw,44px)] flex list-none snap-x snap-mandatory scroll-px-[clamp(20px,5vw,96px)] gap-[clamp(12px,3vw,20px)] overflow-x-auto px-[clamp(20px,5vw,96px)] pb-2 [scrollbar-width:none]">
            {products.map((product) => (
              <li
                key={product.id}
                className="w-[min(72vw,320px)] shrink-0 snap-start"
              >
                <CollectionCard product={product} />
              </li>
            ))}
          </ul>
        )}
        <div className={`${CONTAINER} mt-[clamp(24px,5vw,40px)]`}>
          <ArrowPill to="/collections/all" label="Explore the Collection" />
        </div>
      </section>

      {/* Editorial cards */}
      <section
        aria-label="Collection and commissions"
        className={`${CONTAINER} grid gap-[clamp(12px,3vw,20px)] py-[clamp(56px,12vw,110px)] md:grid-cols-2`}
      >
        <EditorialCard
          title="Western by Nature. Individual by Design."
          cta={{label: 'Explore the Collection', to: '/collections/all'}}
          image="/assets/card-cigar.png"
          alt="Man in a dark felt hat by a vintage car"
          position="50% 25%"
        />
        <EditorialCard
          title="Crafted Around You."
          cta={{label: 'Commission a Hat', to: APPOINTMENT_URL}}
          image="/assets/card-craftsman.png"
          alt="Hatter shaping a hat brim by hand"
          position="50% 30%"
        />
      </section>

      {/* Founder / commissions */}
      <section
        aria-label="Our story"
        className={`${CONTAINER} grid items-end gap-[clamp(16px,4vw,32px)] pb-[clamp(56px,12vw,110px)] grid-cols-[1.3fr_1fr]`}
      >
        <figure data-reveal className="m-0 aspect-[4/5] overflow-hidden">
          <img
            src="/assets/founder-portrait.png"
            alt="Mark Alex, founder of Hatwater House"
            loading="lazy"
            className="size-full rounded-none object-cover object-[50%_25%]"
          />
        </figure>
        <figure data-reveal className="m-0 aspect-[3/5] overflow-hidden">
          <img
            src="/assets/workshop.jpg"
            alt="Hat blocks and tools in the Hatwater House workshop"
            loading="lazy"
            className="size-full rounded-none object-cover object-[50%_62%]"
          />
        </figure>
        <p data-reveal className={`${BODY} col-span-2 mt-[clamp(8px,2vw,16px)]`}>
          Beyond the collection, Hatwater House offers individual commissions
          guided by personal style, proportion, and the finer details.
        </p>
      </section>

      {/* A hat for every story */}
      <section
        aria-labelledby="compact-gallery-heading"
        className="border-t border-hw-espresso/10 py-[clamp(56px,12vw,110px)]"
      >
        <div className={`${CONTAINER} flex flex-col gap-3 text-center`}>
          <h2 id="compact-gallery-heading" className={H2}>
            A Hat for Every Story
          </h2>
          <p className="m-0 mx-auto max-w-[34ch] font-display text-[clamp(18px,4vw,26px)] leading-[1.4] text-hw-taupe">
            Discover the styles that define every look — from timeless classics
            to modern statement pieces.
          </p>
        </div>
        <ul
          className={`${CONTAINER} m-0 mt-[clamp(24px,5vw,44px)] grid list-none grid-cols-2 gap-[clamp(8px,2vw,14px)] p-0 md:grid-cols-3`}
        >
          {GALLERY.map((src) => (
            <li key={src} data-reveal className="aspect-[3/4] overflow-hidden bg-hw-linen">
              <img
                src={src}
                alt=""
                loading="lazy"
                className="size-full rounded-none object-cover"
              />
            </li>
          ))}
        </ul>
        <ul className="m-0 mt-[clamp(12px,3vw,20px)] flex list-none snap-x snap-mandatory scroll-px-[clamp(20px,5vw,96px)] gap-[clamp(8px,2vw,14px)] overflow-x-auto px-[clamp(20px,5vw,96px)] pb-2 [scrollbar-width:none]">
          {STORIES.map((story) => (
            <li key={story.id} className="w-[min(46vw,240px)] shrink-0 snap-start">
              <a
                href={story.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${story.alt} - view on Instagram`}
                className="block aspect-[9/16] overflow-hidden bg-hw-linen"
              >
                <video
                  src={story.video}
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="size-full object-cover"
                />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CollectionCard({product}: {product: HomepageProductFragment}) {
  const image = product.featuredImage;
  const url = `/products/${product.handle}`;
  return (
    <article className="flex flex-col gap-3">
      <Link
        to={url}
        prefetch="intent"
        aria-label={product.title}
        className="relative block aspect-[4/5] overflow-hidden bg-hw-cream"
      >
        {image && (
          <Image
            data={image}
            alt={image.altText || product.title}
            aspectRatio="4/5"
            crop="center"
            loading="lazy"
            sizes="(min-width: 768px) 320px, 72vw"
            className="absolute inset-0 size-full rounded-none object-cover"
          />
        )}
        <span className="absolute left-3 top-3 bg-hw-cream/90 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-hw-espresso">
          Made to Order
        </span>
      </Link>
      <h3 className="m-0 font-display text-[clamp(22px,5vw,28px)] font-normal leading-[1.1] text-hw-espresso">
        {product.title}
      </h3>
      <Link
        to={url}
        prefetch="intent"
        className="flex h-12 items-center justify-center border border-hw-espresso bg-hw-espresso text-[12px] font-medium uppercase tracking-[0.18em] text-hw-bone no-underline transition-colors duration-500 hover:bg-transparent hover:text-hw-espresso hover:no-underline"
      >
        Discover the Hat
      </Link>
    </article>
  );
}

function EditorialCard({
  title,
  cta,
  image,
  alt,
  position,
}: {
  title: string;
  cta: {label: string; to: string};
  image: string;
  alt: string;
  position: string;
}) {
  return (
    <article
      data-reveal
      className="relative isolate flex aspect-[4/5] flex-col items-center justify-end gap-4 overflow-hidden rounded-[10px] p-[clamp(20px,5vw,40px)] text-center"
    >
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 -z-20 size-full rounded-none object-cover"
        style={{objectPosition: position}}
      />
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent from-40% to-hw-espresso to-95%"
      />
      <h3 className="m-0 max-w-[18ch] font-grotesk-display text-[clamp(24px,6vw,36px)] font-medium leading-[1.2] text-white">
        {title}
      </h3>
      <ArrowPill to={cta.to} label={cta.label} />
    </article>
  );
}
