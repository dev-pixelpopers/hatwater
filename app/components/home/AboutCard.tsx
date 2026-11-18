import {PillButton} from './PillButton';

/** Copy geometry in Figma pixels: the box, the paragraph's top and its lines. */
export const ABOUT_BOX_HEIGHT = 518;
export const ABOUT_COPY_TOP = 49;
export const ABOUT_LINE_HEIGHT = 60;
export const ABOUT_LINES = 7;

/**
 * Brand introduction card that slides over the hero (Figma "Group 22").
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
        {/* No clip, overflow or transform on this wrapper: the frosted panel
            must share a backdrop root with the copy it blurs. */}
        <div className="relative h-518 w-1124">
          <div
            data-anim="about-copy"
            className="absolute inset-0 overflow-hidden"
          >
            {/* Every line sits on the 60px grid the frosted strips follow. */}
            <h2 className="m-0 ml-18 mt-49 font-display fs-48 lh-60 font-normal text-hw-cocoa">
              An Individual Expression.
            </h2>
            <p className="m-0 ml-18 mt-60 w-1040 font-display fs-34 lh-60 text-hw-taupe">
              Rooted in the Western heritage of California, Hatwater House
              brings traditional hatmaking craftsmanship to a modern expression
              of personal style.
            </p>
            <p className="m-0 ml-18 w-1040 font-display fs-34 lh-60 text-hw-chestnut">
              Every hat begins with a considered silhouette and is shaped,
              fitted, and finished with the individual in mind.
            </p>
          </div>
          {/* Frosted panel over the copy (Figma "Rectangle 145"), split into
              one strip per line so the copy thaws line by line. Siblings of
              the clipped copy, not children: an ancestor clip-path is a
              backdrop root and leaves backdrop-filter nothing to blur. Each
              strip is clipped and un-blurred on itself (see ShowcaseScene). */}
          {Array.from({length: ABOUT_LINES}, (_, line) => (
            <div
              key={line}
              data-anim="about-blur"
              className="pointer-events-none absolute left-0 w-1124 bg-white/30 hw-frost"
              style={{
                top: `calc(var(--spacing) * ${ABOUT_COPY_TOP + line * ABOUT_LINE_HEIGHT})`,
                height: `calc(var(--spacing) * ${ABOUT_LINE_HEIGHT})`,
              }}
            />
          ))}
        </div>
        <PillButton
          to="/about"
          label="Discover Our Story"
          width={262}
          gap={18}
          className="ml-18"
        />
      </div>
    </>
  );
}
