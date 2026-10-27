/** Primary navigation shared by the Header, Footer and full-screen menu. */
export const NAV_LINKS = [
  {label: 'Home', to: '/'},
  {label: 'Shop', to: '/collections/all'},
  {label: 'About', to: '/about'},
  {label: 'Contact', to: '/contact'},
];

export const APPOINTMENT_URL = '/contact#appointment';

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
