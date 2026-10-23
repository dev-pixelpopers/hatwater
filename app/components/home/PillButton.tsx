import {Link} from 'react-router';
import {ArrowSwap} from './ArrowSwap';
import {du} from './ScrollScene';

type PillButtonProps = {
  to: string;
  label: string;
  /** Width of the pill in Figma pixels. */
  width?: number;
  /** Gap between the round arrow and the label in Figma pixels. */
  gap?: number;
  tone?: 'taupe' | 'espresso';
  className?: string;
};

/**
 * Copper wash for the white pills: on hover of the `.group` pill it grows out
 * of the 50px disc (inset 7px) until it fills the whole button.
 */
export function PillFill() {
  return (
    <span
      aria-hidden
      className="absolute left-7 top-1/2 -z-10 size-50 -translate-y-1/2 rounded-full hw-panel-gradient transition-[scale] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-[13]"
    />
  );
}

/** White pill with the copper arrow disc (Figma "button" / "Group 9"). */
export function PillButton({
  to,
  label,
  width = 251,
  gap = 12,
  tone = 'espresso',
  className = '',
}: PillButtonProps) {
  return (
    <Link
      to={to}
      prefetch="intent"
      className={`group relative isolate flex h-60 items-center overflow-hidden r-30 border border-hw-bone bg-white pl-7 no-underline transition-[border-color,scale] duration-500 hover:border-hw-saddle hover:no-underline active:scale-[0.97] ${className}`}
      style={{width: du(width), columnGap: du(gap)}}
    >
      <PillFill />
      <span className="relative flex size-50 shrink-0 items-center justify-center overflow-hidden rounded-full">
        <img
          src="/assets/button-dot.svg"
          alt=""
          className="absolute inset-0 size-full"
        />
        <ArrowSwap className="-rotate-45" />
      </span>
      <span
        className={`font-grotesk fs-20 lh-20 capitalize transition-colors duration-500 group-hover:text-white ${
          tone === 'taupe' ? 'text-hw-taupe' : 'text-hw-espresso'
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
