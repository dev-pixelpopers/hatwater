import {useRef} from 'react';
import {
  addClip,
  artX,
  artY,
  createScrubTimeline,
  gsap,
  inset,
  ofSize,
  useGsapContext,
} from '~/lib/gsap';
import {
  FEATURE_TILE,
  GALLERY_TILES,
  STORIES,
  STORY_CARD,
  SWAP_DISTANCE,
  type GalleryTile,
  type TileImage,
} from './galleryData';
import {du, ScrollScene} from './ScrollScene';
import {SiteFooter} from './SiteFooter';

const END_HOLD = 0.3;
/** The wordmark frames start 208px wide, showing only each capital H. */
const WORD_HAT_INITIAL = inset(0, 84.13);
const WORD_HOUSE_INITIAL = inset(0, 79.45);
export const GALLERY_UNITS = 8 + END_HOLD;

function TilePicture({image, alt}: {image: TileImage; alt: string}) {
  return (
    <div
      className={`absolute overflow-hidden r-20.25 ${image.mirrored ? '-scale-x-100' : ''} ${
        image.luminosity ? 'mix-blend-luminosity' : ''
      }`}
      style={{
        left: du(image.left),
        top: du(image.top),
        width: du(image.width),
        height: du(image.height),
      }}
    >
      <img
        src={image.src}
        alt={alt}
        loading="lazy"
        className={image.crop ? 'absolute' : 'size-full object-cover'}
        style={image.crop}
      />
    </div>
  );
}

function Tile({tile, feature = false}: {tile: GalleryTile; feature?: boolean}) {
  return (
    <div
      data-tile={feature ? 'feature' : 'gallery'}
      className="absolute overflow-hidden"
      style={{
        left: du(tile.left),
        top: du(tile.top),
        width: du(tile.width),
        height: du(tile.height),
      }}
    >
      <div data-anim="swap" className="absolute inset-0">
        <TilePicture image={tile.image} alt="Hatwater House customer hat" />
        <TilePicture image={tile.incoming} alt="" />
      </div>

      {feature ? (
        <div data-anim="stories" className="absolute inset-0">
          {STORIES.map((story) => (
            <div
              key={story.id}
              data-story={story.id}
              className="absolute inset-0 overflow-hidden"
            >
              <img
                src={story.src}
                alt={story.alt}
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/**
 * "A Hat for Every Story" (Figma variants 22 -> 30): wordmark, gallery wall,
 * the centre tile becoming the video stories row, and the footer.
 */
export function GalleryScene() {
  const wrapperRef = useRef<HTMLElement>(null);
  const artboardRef = useRef<HTMLDivElement>(null);

  useGsapContext(wrapperRef, () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const wordHat = '[data-anim="word-hatwater"]';
    const wordHouse = '[data-anim="word-house"]';
    const tiles = '[data-anim="tiles"]';
    const feature = '[data-tile="feature"]';
    const heading = '[data-anim="gallery-heading"]';

    // Variant22: the two wordmark frames only show their capital H.
    gsap.set(wordHat, {
      clipPath: WORD_HAT_INITIAL,
      yPercent: ofSize(127, 273),
    });
    gsap.set(wordHouse, {
      clipPath: WORD_HOUSE_INITIAL,
      yPercent: ofSize(122, 298),
    });
    gsap.set(tiles, {
      scale: 0.2795,
      yPercent: ofSize(45, 994),
      autoAlpha: 0,
      transformOrigin: `${(954.75 / 1919) * 100}% ${(501 / 994) * 100}%`,
    });
    gsap.utils.toArray<HTMLElement>('[data-anim="swap"]').forEach((swap) => {
      const tileHeight = swap.parentElement?.offsetHeight || 1;
      const artboardHeight = artboardRef.current?.offsetHeight || 1;
      // Distance in the tile's own units so it stays correct when resized.
      const distance = (SWAP_DISTANCE / 994) * artboardHeight;
      gsap.set(swap, {yPercent: (distance / tileHeight) * 100});
    });
    gsap.set('[data-anim="stories"]', {yPercent: 104});
    gsap.set(heading, {autoAlpha: 0, yPercent: 20});
    gsap.set('[data-anim="footer"]', {yPercent: 102});

    const tl = createScrubTimeline(wrapper);

    // 22 -> 23: "Hatwater House" opens up from its initials.
    addClip(tl, wordHat, WORD_HAT_INITIAL, inset(), 0, {yPercent: 0});
    addClip(tl, wordHouse, WORD_HOUSE_INITIAL, inset(), 0, {yPercent: 0});

    // 23 -> 24: the gallery wall scales in from the centre.
    tl.to(tiles, {scale: 1, yPercent: 0, autoAlpha: 1}, 1);

    // 24 -> 25: every tile swaps to its next photo.
    tl.to('[data-anim="swap"]', {yPercent: 0, stagger: 0.03}, 2);

    // 25 -> 26: heading and intro copy.
    tl.to(heading, {autoAlpha: 1, yPercent: 0}, 3);

    // 26 -> 27: everything clears except the centre tile, which cuts to the stories.
    tl.to(
      [wordHat, wordHouse, heading, '[data-tile="gallery"]'],
      {autoAlpha: 0},
      4,
    )
      .to(`${feature} [data-anim="swap"]`, {yPercent: -104}, 4)
      .to('[data-anim="stories"]', {yPercent: 0}, 4);

    // 27 -> 28: centre story grows to full size.
    tl.to(
      feature,
      {
        left: artX(STORY_CARD.enlarged.left),
        top: artY(STORY_CARD.enlarged.top),
        width: artX(STORY_CARD.width),
        height: artY(STORY_CARD.height),
      },
      5,
    );

    // 28 -> 29: the stacked stories fan out into a row.
    tl.set(feature, {overflow: 'visible'}, 6).to(
      feature,
      {left: artX(STORY_CARD.settled.left), top: artY(STORY_CARD.settled.top)},
      6,
    );
    STORIES.forEach((story) => {
      tl.to(
        `[data-story="${story.id}"]`,
        {
          xPercent: ofSize(story.offset.x, STORY_CARD.width),
          yPercent: ofSize(story.offset.y, STORY_CARD.height),
        },
        6,
      );
    });

    // 29 -> 30: stories lift and the footer rises underneath them.
    tl.to(tiles, {yPercent: ofSize(-550, 994)}, 7).to(
      '[data-anim="footer"]',
      {yPercent: 0},
      7,
    );
    tl.to({}, {duration: END_HOLD});
  });

  return (
    <ScrollScene
      units={GALLERY_UNITS}
      wrapperRef={wrapperRef}
      artboardRef={artboardRef}
      stageClassName="bg-white"
      label="A hat for every story"
    >
      <div aria-hidden className="absolute inset-0">
        <div
          data-anim="word-hatwater"
          className="absolute left-318 top-9 h-273 w-1311 overflow-hidden"
        >
          <p className="m-0 whitespace-nowrap pt-23 font-display fs-318.5 lh-250 capitalize hw-wordmark">
            hatwater
          </p>
        </div>
        <div
          data-anim="word-house"
          className="absolute left-454 top-228 h-298 w-1012 overflow-hidden"
        >
          <p className="m-0 whitespace-nowrap pt-48 font-display fs-318.5 lh-250 capitalize hw-wordmark">
            house
          </p>
        </div>
      </div>

      <div data-anim="tiles" className="absolute inset-0 z-20">
        {GALLERY_TILES.map((tile) => (
          <Tile key={tile.id} tile={tile} />
        ))}
        <Tile tile={FEATURE_TILE} feature />
      </div>

      <div
        data-anim="gallery-heading"
        className="absolute left-425 top-761 z-20 flex w-1025 flex-col items-center gap-5 text-center"
      >
        <h2 className="m-0 font-display font-normal fs-78 lh-88.75 capitalize text-hw-espresso">
          A hat for every story
        </h2>
        <p className="m-0 font-display fs-36 lh-46 capitalize text-hw-taupe">
          Discover the styles that define every look — from timeless classics to
          modern statement pieces.
        </p>
      </div>

      <SiteFooter />
    </ScrollScene>
  );
}
