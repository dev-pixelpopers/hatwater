import {Link} from 'react-router';
import {
  APPOINTMENT_URL,
  LEGAL_LINKS,
  NAV_LINKS,
  SOCIAL_LINKS,
  maskStyle,
} from '~/components/site/links';

const HEADING =
  'm-0 font-display text-[clamp(22px,1.45vw,28px)] font-normal capitalize leading-[1.6] tracking-[0.02em]';

/**
 * Inner-page footer: the homepage brand footer (copper gradient, hat
 * silhouette, quick links / social / legal rows) in normal document flow.
 */
export function Footer() {
  return (
    <footer className="relative isolate mt-auto overflow-hidden font-grotesk text-white">
      <div className="absolute inset-0 -z-20 hw-footer-gradient" />
      <img
        src="/assets/footer-hat.png"
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-10 size-full rounded-none object-cover opacity-90 mix-blend-multiply"
      />

      <div className="mx-auto flex max-w-[1720px] flex-col gap-[clamp(48px,6vw,110px)] px-[clamp(20px,6vw,124px)] pb-[clamp(28px,3vw,48px)] pt-[clamp(64px,9vw,170px)]">
        <div className="grid gap-12 md:grid-cols-[auto_1fr_1fr_1.2fr] md:gap-[clamp(32px,6vw,160px)]">
          <Link
            to="/"
            aria-label="Hatwater House home"
            className="block h-[clamp(96px,8.4vw,160px)] w-[clamp(154px,13.4vw,257px)]"
          >
            <span
              className="block size-full bg-hw-bone hw-mask"
              style={maskStyle('/assets/logo-mask.png')}
            />
          </Link>

          <nav aria-label="Quick links" className="flex flex-col gap-3">
            <h2 className={HEADING}>Quick links</h2>
            <ul className="m-0 flex list-none flex-col border-l border-hw-rule/70 p-0 pl-6">
              {NAV_LINKS.map((link) => (
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
            <h2 className={HEADING}>Connect with us</h2>
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

          <div className="flex flex-col items-start gap-5">
            <h2 className={HEADING}>Made to measure</h2>
            <p className="m-0 max-w-[28ch] text-[clamp(15px,0.95vw,18px)] leading-relaxed text-hw-bone/85">
              Every hat is shaped to order and finished by hand. Book a fitting
              at the studio or online.
            </p>
            <Link
              to={APPOINTMENT_URL}
              className="group inline-flex items-center gap-3 border-b border-hw-bone/50 pb-1 text-[clamp(13px,0.85vw,15px)] font-medium uppercase tracking-[0.1em] text-hw-bone no-underline transition-colors hover:border-hw-bone hover:no-underline"
            >
              Book an appointment
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
          <nav aria-label="Legal" className="flex gap-[clamp(20px,2.2vw,42px)]">
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
