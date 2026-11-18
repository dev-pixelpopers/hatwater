import {useState} from 'react';

const VALUES = [
  {
    title: 'Fitted to the Individual',
    copy: 'Each hat is fitted to its wearer and shaped around head shape, proportion, and the way it will be worn.',
    image: '/assets/story-2.png',
  },
  {
    title: 'Honest Materials',
    copy: 'Premium fur felt, from refined rabbit-and-beaver blends to pure beaver — chosen for texture, character, and the way it holds a shape.',
    image: '/assets/gallery-11.png',
  },
  {
    title: 'Built to Be Worn',
    copy: 'Western hats for the ranch, the coast, and the city — made to be lived in every day.',
    image: '/assets/story-3.png',
  },
  {
    title: 'California at Heart',
    copy: 'Rooted in California’s ranching traditions and vaquero culture, and shaped through a distinctly Californian point of view.',
    image: '/assets/story-1.png',
  },
];

/**
 * Atelier values as expanding panels: hover, focus or tap a panel and it
 * widens (desktop) or opens (mobile) to reveal its story.
 */
export function AtelierValues() {
  const [active, setActive] = useState(0);

  return (
    <ul className="m-0 flex list-none flex-col gap-[clamp(8px,0.8vw,14px)] p-0 lg:h-[min(72vh,760px)] lg:flex-row">
      {VALUES.map((value, index) => {
        const open = index === active;
        return (
          <li
            key={value.title}
            data-reveal
            className="relative min-h-0 min-w-0 overflow-hidden bg-hw-espresso transition-[flex-grow,height] duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] max-lg:h-[clamp(96px,22vw,128px)] max-lg:data-[open=true]:h-[min(78vh,560px)] lg:basis-0"
            data-open={open}
            style={{flexGrow: open ? 2.6 : 1}}
            onMouseEnter={() => setActive(index)}
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setActive(index)}
              onFocus={() => setActive(index)}
              className="group absolute inset-0 flex size-full cursor-pointer flex-col justify-end border-0 bg-transparent p-[clamp(18px,1.8vw,34px)] text-left text-hw-bone"
            >
              <img
                src={value.image}
                alt=""
                loading="lazy"
                className={`absolute inset-0 size-full object-cover transition-[scale,filter] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? 'scale-100 grayscale-0' : 'scale-110 grayscale'
                }`}
              />
              <span
                aria-hidden
                className={`absolute inset-0 bg-gradient-to-t from-hw-espresso via-hw-espresso/40 to-hw-espresso/10 transition-opacity duration-700 ${
                  open ? 'opacity-90' : 'opacity-100'
                }`}
              />
              <span className="relative flex items-baseline gap-4">
                <span className="font-grotesk text-[clamp(12px,0.8vw,15px)] font-medium tracking-[0.16em] text-hw-copper">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-[clamp(26px,2.2vw,42px)] leading-[1.05]">
                  {value.title}
                </span>
              </span>
              <span
                className={`relative grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                  open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <span className="overflow-hidden">
                  <span className="block max-w-[38ch] pt-[clamp(10px,1vw,18px)] font-grotesk text-[clamp(15px,1vw,19px)] leading-[1.6] text-hw-sand">
                    {value.copy}
                  </span>
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
