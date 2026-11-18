/** Primary navigation shared by the Header, Footer and full-screen menu. */
export const NAV_LINKS = [
  {label: 'Home', to: '/'},
  {label: 'Shop', to: '/collections/all'},
  {label: 'About', to: '/about'},
  {label: 'Contact', to: '/contact'},
];

/** Footer navigation, as named in the copy brief. */
export const FOOTER_LINKS = [
  {label: 'The Collection', to: '/collections/all'},
  {label: 'Our Story', to: '/about'},
  {label: 'The Craft', to: '/about#craft'},
  {label: 'Contact', to: '/contact'},
];

export const APPOINTMENT_URL = '/contact#appointment';
/** "Plan Your Visit": the studio details at the top of the contact page. */
export const VISIT_URL = '/contact#visit';

/** Studio details shown on the contact page and in both footers. */
export const STUDIO = {
  name: 'Hatwater House',
  street: '3042 Glendale Blvd.',
  city: 'Los Angeles, CA 90039',
  phone: '323-342-4313',
  phoneHref: 'tel:+13233424313',
  hours: 'Appointment Only',
  email: 'hello@hatwaterhouse.com',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=3042+Glendale+Blvd+Los+Angeles+CA+90039',
};

export const BRAND_TAGLINE =
  'Western heritage. California perspective. Individual expression.';

export const SOCIAL_LINKS = [
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

export const LEGAL_LINKS = [
  {label: 'Terms', to: '/policies/terms-of-service'},
  {label: 'Privacy', to: '/policies/privacy-policy'},
  {label: 'Returns', to: '/policies/refund-policy'},
];

export const maskStyle = (url: string) => ({
  maskImage: `url(${url})`,
  WebkitMaskImage: `url(${url})`,
});
