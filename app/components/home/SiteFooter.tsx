import {Link} from 'react-router';
import {
  BRAND_TAGLINE,
  FOOTER_LINKS,
  LEGAL_LINKS as LEGAL,
  SOCIAL_LINKS as SOCIAL,
  VISIT_URL,
  maskStyle,
} from '~/components/site/links';

/**
 * Brand footer (Figma "Group 27", Variant30). Coordinates are relative to the
 * footer's top edge at y 199 of the final frame.
 */
export function SiteFooter() {
  return (
    <footer
      data-anim="footer"
      className="absolute inset-x-0 top-199 z-10 h-795 font-grotesk text-white"
    >
      <div className="absolute left-1/2 top-0 h-878 w-screen -translate-x-1/2 opacity-88 hw-footer-gradient" />
      <div className="absolute -left-6 top-0 h-919 w-1919 overflow-hidden mix-blend-multiply">
        <img
          src="/assets/footer-hat.png"
          alt=""
          loading="lazy"
          className="absolute left-0 top-[-17.16%] h-[173.81%] w-full"
        />
      </div>

      <div className="absolute left-124 top-330 flex items-start">
        <div className="flex w-340 flex-col items-start">
          <Link
            to="/"
            aria-label="Hatwater House by Mark Alex, home"
            className="mt-9 block h-160 w-257.5"
          >
            <span
              className="block size-full bg-hw-bone hw-mask"
              style={maskStyle('/assets/logo-mask.png')}
            />
          </Link>
          <p className="m-0 mt-28 w-320 font-display fs-22 lh-32 text-hw-bone">
            {BRAND_TAGLINE}
          </p>
        </div>

        <nav aria-label="Footer" className="ml-110 flex flex-col">
          <h2 className="m-0 font-display font-normal fs-27.5 lh-45 tracking-[0.02em]">
            Explore
          </h2>
          <div className="mt-7 flex items-start">
            <span className="ml-10 mt-8 h-150 w-px bg-hw-rule" />
            <ul className="m-0 ml-29 list-none p-0">
              {FOOTER_LINKS.map((link) => (
                <li key={link.to} className="m-0">
                  <Link
                    to={link.to}
                    className="whitespace-nowrap font-grotesk-display fs-20 lh-41 tracking-[-0.02em] text-white underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <nav aria-label="Social" className="ml-130 flex flex-col">
          <h2 className="m-0 font-display font-normal fs-27.5 lh-45 tracking-[0.02em]">
            Connect
          </h2>
          <div className="mt-7 flex items-start">
            <span className="ml-10 mt-8 h-109 w-px bg-hw-rule" />
            <ul className="m-0 ml-29 list-none p-0">
              {SOCIAL.map((item) => (
                <li key={item.label} className="m-0">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-12 font-bold fs-20 lh-41 tracking-[-0.016em] text-white no-underline"
                  >
                    <span
                      className="size-15 bg-white hw-mask"
                      style={maskStyle(item.icon)}
                    />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="ml-130 flex w-400 flex-col items-start">
          <h2 className="m-0 font-display font-normal fs-27.5 lh-45 tracking-[0.02em]">
            Visit the House
          </h2>
          <p className="m-0 mt-12 font-grotesk fs-19 lh-30 text-hw-bone">
            Discover Hatwater House in Los Angeles.
            <br />
            Appointments encouraged. Walk-ins welcome.
          </p>
          <Link
            to={VISIT_URL}
            className="mt-24 flex items-center gap-12 border-0 border-b border-solid border-hw-bone/60 pb-6 font-grotesk fs-16 lh-20 font-medium uppercase tracking-[0.1em] text-hw-bone no-underline"
          >
            Plan Your Visit <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <div className="absolute left-120 right-108 top-733 grid grid-cols-[1fr_auto_1fr] items-center">
        <p className="m-0 fs-18 lh-35">© 2026 FPLLC. All Rights Reserved.</p>
        <nav aria-label="Legal" className="flex gap-42">
          {LEGAL.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="fs-20 lh-33 tracking-[0.02em] text-white no-underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <img
          src="/assets/payment-logos.png"
          alt="Visa, American Express, Apple Pay, Mastercard, PayPal and more"
          loading="lazy"
          className="h-25 w-282 justify-self-end"
        />
      </div>
    </footer>
  );
}
