import {PillButton} from './PillButton';

type FeatureCardProps = {
  id: string;
  title: string;
  cta: {label: string; to: string};
  image: {src: string; alt: string; className: string};
  /** Gradient overlay start (Figma fill stop). */
  fadeFrom: string;
  /** Distance from the card bottom to the CTA, in Figma pixels. */
  paddingBottomClass: string;
  className: string;
};

function FeatureCard({
  id,
  title,
  cta,
  image,
  fadeFrom,
  paddingBottomClass,
  className,
}: FeatureCardProps) {
  return (
    <article
      data-card={id}
      className={`pointer-events-auto absolute top-144 flex h-812 w-921 flex-col items-center justify-end gap-17 overflow-hidden r-10 opacity-0 invisible ${paddingBottomClass} ${className}`}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className={`absolute ${image.className}`}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(180deg, rgb(0 0 0 / 0) ${fadeFrom}, var(--color-hw-espresso) 95%)`,
        }}
      />
      <div
        data-anim="card-copy"
        className="relative flex flex-col items-center gap-17"
      >
        <h3 className="m-0 font-grotesk-display font-medium fs-40 lh-70 capitalize text-white">
          {title}
        </h3>
        <PillButton to={cta.to} label={cta.label} />
      </div>
    </article>
  );
}

/** Two editorial cards revealed after the collection (Figma "Group 24/25"). */
export function FeatureCards() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[24]">
      <FeatureCard
        id="classic"
        title="Classic hats made for timeless style."
        cta={{label: 'View collection', to: '/collections/all'}}
        image={{
          src: '/assets/card-cigar.png',
          alt: 'Man in a dark felt hat by a vintage car',
          className: '-top-37 left-0 h-981 w-921',
        }}
        fadeFrom="61.4%"
        paddingBottomClass="pb-71"
        className="left-16"
      />
      <FeatureCard
        id="custom"
        title="Built for the head."
        cta={{label: 'Custom request', to: '/pages/contact'}}
        image={{
          src: '/assets/card-craftsman.png',
          alt: 'Hatter shaping a hat brim by hand',
          className: '-left-16 top-0 h-826 w-946 object-cover',
        }}
        fadeFrom="18%"
        paddingBottomClass="pb-61"
        className="left-972"
      />
    </div>
  );
}
