import {Link} from 'react-router';
import {
  BRAND_TAGLINE,
  FOOTER_LINKS,
  LEGAL_LINKS,
  SOCIAL_LINKS,
  STUDIO,
  VISIT_URL,
  maskStyle,
} from '~/components/site/links';

const HEADING =
  'm-0 font-display text-[clamp(22px,1.45vw,28px)] font-normal leading-[1.6] tracking-[0.02em]';

/**
 * Inner-page footer: the homepage brand footer (copper gradient, hat
 * silhouette, navigation / social / visit / legal rows) in normal document flow.
 */
export function Footer({className = ''}: {className?: string}) {
  return (
    <footer
      className={`relative isolate mt-auto overflow-hidden font-grotesk text-white ${className}`}
    >
      <div className="absolute inset-0 -z-20 hw-footer-gradient" />
      <img
        src="/assets/footer-hat.png"
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-10 size-full rounded-none object-cover opacity-90 mix-blend-multiply"
      />

      <div className="mx-auto flex max-w-[1720px] flex-col gap-[clamp(48px,6vw,110px)] px-[clamp(20px,6vw,124px)] pb-[clamp(28px,3vw,48px)] pt-[clamp(64px,9vw,170px)]">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr] lg:gap-[clamp(32px,4vw,110px)]">
          <div className="flex flex-col items-start gap-4 sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              aria-label="Hatwater House by Mark Alex, home"
              className="block h-[clamp(96px,8.4vw,160px)] w-[clamp(154px,13.4vw,257px)]"
            >
              <span
                className="block size-full bg-hw-bone hw-mask"
                style={maskStyle('/assets/logo-mask.png')}
              />
            </Link>
            <p className="m-0 max-w-[30ch] font-display text-[clamp(17px,1.15vw,21px)] leading-[1.45] text-hw-bone/85">
              {BRAND_TAGLINE}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <h2 className={HEADING}>Explore</h2>
            <ul className="m-0 flex list-none flex-col border-l border-hw-rule/70 p-0 pl-6">
              {FOOTER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    prefetch="intent"
                    className="font-grotesk-display text-[clamp(17px,1.05vw,20px)] leading-[2] tracking-[-0.02em] text-white underline underline-offset-4 transition-opacity hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Social" className="flex flex-col gap-3">
            <h2 className={HEADING}>Connect</h2>
            <ul className="m-0 flex list-none flex-col border-l border-hw-rule/70 p-0 pl-6">
              {SOCIAL_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-[clamp(17px,1.05vw,20px)] font-bold leading-[2] tracking-[-0.016em] text-white no-underline transition-opacity hover:no-underline hover:opacity-70"
                  >
                    <span
                      className="size-[15px] bg-white hw-mask"
                      style={maskStyle(item.icon)}
                    />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col items-start gap-4 sm:col-span-2 lg:col-span-1">
            <h2 className={HEADING}>Visit the House</h2>
            <div className="flex max-w-[32ch] flex-col gap-1 text-[clamp(15px,0.95vw,18px)] leading-relaxed text-hw-bone/85">
              <p className="m-0">
                {STUDIO.street}
                <br />
                {STUDIO.city}
              </p>
              <p className="m-0">
                Tel:{' '}
                <a
                  href={STUDIO.phoneHref}
                  className="text-hw-bone no-underline hover:underline"
                >
                  {STUDIO.phone}
                </a>
              </p>
              <p className="m-0">Hours: {STUDIO.hours}</p>
            </div>
            <Link
              to={VISIT_URL}
              className="group mt-1 inline-flex items-center gap-3 border-b border-hw-bone/50 pb-1 text-[clamp(13px,0.85vw,15px)] font-medium uppercase tracking-[0.1em] text-hw-bone no-underline transition-colors hover:border-hw-bone hover:no-underline"
            >
              Plan Your Visit
              <span
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-white/20 pt-[clamp(20px,2vw,32px)] lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <p className="m-0 text-[clamp(14px,0.95vw,18px)]">
            © 2026 FPLLC. All Rights Reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-[clamp(20px,2.2vw,42px)] gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-[clamp(14px,1.05vw,20px)] tracking-[0.02em] text-white no-underline hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <img
            src="/assets/payment-logos.png"
            alt="Visa, American Express, Apple Pay, Mastercard, PayPal and more"
            loading="lazy"
            className="h-auto w-[clamp(200px,14.7vw,282px)] rounded-none lg:justify-self-end"
          />
        </div>
      </div>
    </footer>
  );
}
