import {PillButton} from './PillButton';

/**
 * "Made just for you" card that slides over the hero (Figma "Group 22").
 * Positioned in hero-frame coordinates on the showcase track.
 */
export function AboutCard() {
  return (
    <>
      <div className="absolute left-65 top-1097 z-10 h-784 w-1791 r-30 bg-white" />

      {/* Chair, wiped in from the left edge (Figma "Frame 7", 33 -> 648 wide) */}
      <div
        data-anim="chair-clip"
        className="absolute -left-33 top-1275 z-10 h-827 w-648 overflow-hidden"
      >
        <div className="absolute left-33 top-61 h-766 w-496 -scale-x-100 overflow-hidden">
          <img
            src="/assets/chair.png"
            alt="Walnut lounge chair"
            className="absolute left-[-104.19%] top-[-13.98%] h-[117.64%] w-[326.58%]"
            loading="lazy"
          />
        </div>
      </div>

      {/* Fade that blends the model into the card (Figma "Rectangle 5") */}
      <div className="pointer-events-none absolute left-80 top-1097 z-30 h-278 w-1755 bg-linear-to-b from-white/0 to-white to-96%" />

      <div className="absolute left-643 top-1400 z-10 flex w-1124 flex-col gap-5">
        <div
          data-anim="about-copy"
          className="relative h-518 w-1124 overflow-hidden"
        >
          <p className="m-0 ml-18 mt-49 w-1096 font-display fs-36 lh-60 capitalize text-hw-taupe">
            <span className="text-hw-sand">
              All of our hats are made just for you—not pulled from a shelf.
              Once your order is placed,
            </span>{' '}
            we begin crafting your hat from the ground up, shaping it to your
            specifications, and finishing it by hand. Because we source premium
            felts in a variety of colors and qualities,{' '}
            <span className="text-hw-sand">
              production times may vary depending on material availability. We
              appreciate your patience,
            </span>{' '}
            because good things take time—and a great hat is one of them
          </p>
          {/* Frosted panel that slides down to reveal the copy (Figma "Rectangle 145") */}
          <div
            data-anim="about-blur"
            className="absolute left-0 top-49 h-432 w-1124 bg-white/30 backdrop-blur-[calc(var(--spacing)*16)]"
          />
        </div>
        <PillButton
          to="/pages/about"
          label="Read more"
          width={240}
          gap={27}
          className="ml-18"
        />
      </div>
    </>
  );
}
