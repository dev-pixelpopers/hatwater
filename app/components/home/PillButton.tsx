import {Link} from 'react-router';
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
      className={`flex h-60 items-center r-30 border border-hw-bone bg-white pl-7 no-underline hover:no-underline ${className}`}
      style={{width: du(width), columnGap: du(gap)}}
    >
      <span className="relative flex size-50 shrink-0 items-center justify-center">
        <img
          src="/assets/button-dot.svg"
          alt=""
          className="absolute inset-0 size-full"
        />
        <img
          src="/assets/arrow.svg"
          alt=""
          className="relative h-11 w-15.5 -rotate-45"
        />
      </span>
      <span
        className={`font-grotesk fs-20 lh-20 capitalize ${
          tone === 'taupe' ? 'text-hw-taupe' : 'text-hw-espresso'
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
