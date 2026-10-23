/**
 * "A Hat for Every Story" gallery (Figma "images" group, Variant26 layout).
 * Each tile shows `image` and slides `incoming` (parked 310px above) out of
 * view during the swap step. All geometry is in Figma pixels.
 */

export type TileImage = {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  /** Figma draws these layers rotated 180Â° + flipped vertically = mirrored. */
  mirrored?: boolean;
  luminosity?: boolean;
  /** Optional fill crop inside the rounded box. */
  crop?: {width: string; height: string; left: string; top: string};
};

export type GalleryTile = {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  image: TileImage;
  incoming: TileImage;
};

const g = (n: number) => `/assets/gallery-${String(n).padStart(2, '0')}.png`;

export const GALLERY_TILES: GalleryTile[] = [
  {
    id: 'f24',
    left: 16.5,
    top: 270.5,
    width: 247.25,
    height: 290.75,
    image: {src: g(12), left: 0, top: 0, width: 245.25, height: 290.75},
    incoming: {
      src: g(11),
      left: 2,
      top: -310,
      width: 245.25,
      height: 290.75,
      mirrored: true,
      luminosity: true,
    },
  },
  {
    id: 'f25',
    left: 18.5,
    top: 583.5,
    width: 246.25,
    height: 297,
    image: {src: g(9), left: 1, top: 5.25, width: 245.25, height: 290.75},
    incoming: {
      src: g(8),
      left: 0,
      top: -310,
      width: 245.25,
      height: 291.75,
      mirrored: true,
    },
  },
  {
    id: 'f23',
    left: 292,
    top: 140.75,
    width: 247.25,
    height: 303,
    image: {src: g(1), left: 0, top: 3.25, width: 234, height: 278.75},
    incoming: {
      src: g(6),
      left: 2,
      top: -310,
      width: 245.25,
      height: 290.75,
      mirrored: true,
    },
  },
  {
    id: 'f22',
    left: 292,
    top: 456,
    width: 248.25,
    height: 297,
    image: {src: g(13), left: 0, top: 0, width: 245.25, height: 291.75},
    incoming: {
      src: g(14),
      left: 3,
      top: -310,
      width: 245.25,
      height: 290.75,
      mirrored: true,
    },
  },
  {
    id: 'f21',
    left: 564,
    top: 444,
    width: 241,
    height: 309,
    image: {
      src: g(5),
      left: -0.25,
      top: 6.5,
      width: 241.25,
      height: 290.75,
      crop: {width: '107.41%', height: '111.78%', left: '-3.7%', top: '-5.89%'},
    },
    incoming: {
      src: g(2),
      left: 6.75,
      top: -310.25,
      width: 234,
      height: 278.75,
      mirrored: true,
    },
  },
  {
    id: 'f16',
    left: 1106.75,
    top: 443.75,
    width: 234,
    height: 278.75,
    image: {
      src: g(2),
      left: 0,
      top: 0.75,
      width: 234,
      height: 278.75,
      mirrored: true,
    },
    incoming: {src: g(1), left: 0, top: -310, width: 234, height: 278.75},
  },
  {
    id: 'f18',
    left: 1365,
    top: 122,
    width: 259,
    height: 310,
    image: {src: g(3), left: 0, top: -0.25, width: 259.5, height: 309},
    incoming: {
      src: g(4),
      left: 7.25,
      top: -291.25,
      width: 245.25,
      height: 290.75,
    },
  },
  {
    id: 'f17',
    left: 1372.25,
    top: 455,
    width: 245.25,
    height: 291.75,
    image: {
      src: g(6),
      left: 0,
      top: 1,
      width: 245.25,
      height: 290.75,
      mirrored: true,
    },
    incoming: {src: g(7), left: 0, top: -310, width: 245.25, height: 291.75},
  },
  {
    id: 'f19',
    left: 1647.75,
    top: 270.5,
    width: 245.25,
    height: 290.75,
    image: {
      src: g(11),
      left: 0,
      top: 0,
      width: 245.25,
      height: 290.75,
      mirrored: true,
    },
    incoming: {
      src: g(10),
      left: 0,
      top: -310,
      width: 245.25,
      height: 290.75,
      luminosity: true,
    },
  },
  {
    id: 'f20',
    left: 1647.75,
    top: 583.5,
    width: 245.25,
    height: 290.75,
    image: {
      src: g(8),
      left: 0,
      top: 0,
      width: 245.25,
      height: 291.75,
      mirrored: true,
    },
    incoming: {src: g(12), left: 0, top: -310, width: 245.25, height: 290.75},
  },
];

/** Centre tile that turns into the video stories row (Figma "Frame 15"). */
export const FEATURE_TILE: GalleryTile = {
  id: 'f15',
  left: 830,
  top: 320,
  width: 259.5,
  height: 319.25,
  image: {
    src: g(14),
    left: 0,
    top: 5.25,
    width: 259.5,
    height: 307,
    mirrored: true,
  },
  incoming: {src: g(3), left: 0, top: -310, width: 259.5, height: 309},
};

export const SWAP_DISTANCE = 310;

export type Story = {
  id: string;
  /** UGC clip, played on hover. */
  video: string;
  alt: string;
  /** Instagram post the card opens on click. */
  href: string;
  /** Where the card ends up relative to the centre card (Figma Variant29). */
  offset: {x: number; y: number};
};

export const STORIES: Story[] = [
  {
    id: 'c3',
    video: '/assets/videos/testimonial_1.mp4',
    alt: 'Woman in a camel coat and brown felt hat',
    href: 'https://www.instagram.com/',
    offset: {x: -840, y: -4},
  },
  {
    id: 'c4',
    video: '/assets/videos/testimonial_2.mp4',
    alt: 'Man in a navy fedora lighting a cigar',
    href: 'https://www.instagram.com/',
    offset: {x: -420, y: 77},
  },
  {
    id: 'c6',
    video: '/assets/videos/testimonial_3.mp4',
    alt: 'Woman in a cream cowboy hat in the desert',
    href: 'https://www.instagram.com/',
    offset: {x: 420, y: 77},
  },
  {
    id: 'c5',
    video: '/assets/videos/testimonial_4.mp4',
    alt: 'Woman holding a tan Hatwater House hat',
    href: 'https://www.instagram.com/',
    offset: {x: 0, y: 0},
  },
];

/** Story card geometry (Figma Variant28 / Variant29). */
export const STORY_CARD = {
  width: 422,
  height: 746,
  enlarged: {left: 748.5, top: 216},
  settled: {left: 959, top: 180},
};
