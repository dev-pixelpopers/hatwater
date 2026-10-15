import {Link} from 'react-router';

const QUICK_LINKS = [
  [
    {label: 'Home', to: '/'},
    {label: 'About', to: '/pages/about'},
    {label: 'Product', to: '/collections/all'},
  ],
  [
    {label: 'Shop', to: '/collections'},
    {label: 'Reviews', to: '/pages/reviews'},
    {label: 'Contact', to: '/pages/contact'},
  ],
];

const SOCIAL = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/',
    icon: '/assets/icon-instagram-mask.png',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/',
    icon: '/assets/icon-facebook-mask.png',
  },
  {
    label: 'Tiktok',
    href: 'https://www.tiktok.com/',
    icon: '/assets/icon-tiktok-mask.png',
  },
];

const LEGAL = [
  {label: 'Terms', to: '/policies/terms-of-service'},
  {label: 'Privacy', to: '/policies/privacy-policy'},
  {label: 'Returns', to: '/policies/refund-policy'},
];

const maskStyle = (url: string) => ({
  maskImage: `url(${url})`,
  WebkitMaskImage: `url(${url})`,
});

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

      <div className="absolute left-124 top-357 flex items-start">
        <Link
          to="/"
          aria-label="Hatwater House home"
          className="mt-9 block h-160 w-257.5"
        >
          <span
            className="block size-full bg-hw-bone hw-mask"
            style={maskStyle('/assets/logo-mask.png')}
          />
        </Link>

        <nav aria-label="Quick links" className="ml-164.5 flex flex-col">
          <h2 className="m-0 font-display font-normal fs-27.5 lh-45 tracking-[0.02em] capitalize">
            Quick links
          </h2>
          <div className="mt-7 flex items-start">
            <span className="ml-10 mt-8 h-109 w-px bg-hw-rule" />
            {QUICK_LINKS.map((column, index) => (
              <ul
                key={column[0].label}
                className={`m-0 list-none p-0 ${index === 0 ? 'ml-33 w-117' : ''}`}
              >
                {column.map((link) => (
                  <li key={link.label} className="m-0">
                    <Link
                      to={link.to}
                      className="font-grotesk-display fs-20 lh-41 tracking-[-0.02em] text-white underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </nav>

        <nav aria-label="Social" className="ml-207 flex flex-col">
          <h2 className="m-0 font-display font-normal fs-27.5 lh-45 tracking-[0.02em] capitalize">
            Connect with us
          </h2>
          <div className="mt-1 flex items-start">
            <span className="ml-12 mt-14 h-109 w-px bg-hw-rule" />
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
