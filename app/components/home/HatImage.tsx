import {HATS, type HatKey} from './collectionData';
import {du} from './ScrollScene';

type HatImageProps = {
  hat: HatKey;
  id: string;
  decorative?: boolean;
};

/**
 * A hat cut-out positioned by GSAP: left / top tweens address the hat's
 * centre because the showcase offsets it by -50% of its own box.
 */
export function HatImage({hat, id, decorative = false}: HatImageProps) {
  const art = HATS[hat];
  return (
    <div
      data-hat={id}
      className="absolute left-0 top-0 overflow-hidden"
      style={{width: du(art.width), height: du(art.height)}}
    >
      <img
        src={art.src}
        alt={decorative ? '' : art.alt}
        loading="lazy"
        className="absolute"
        style={{
          width: art.crop.width,
          height: art.crop.height,
          left: art.crop.left,
          top: art.crop.top,
        }}
      />
    </div>
  );
}
