/**
 * The white arrow used inside the copper discs. On hover of the nearest
 * `.group` it slides out along its own direction while a copy slides in
 * behind it, so the parent disc must clip (`overflow-hidden rounded-full`).
 */
export function ArrowSwap({className = ''}: {className?: string}) {
  const slide =
    'absolute inset-0 size-full transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]';
  return (
    <span aria-hidden className={`relative block h-11 w-15.5 ${className}`}>
      <img
        src="/assets/arrow.svg"
        alt=""
        className={`${slide} group-hover:translate-x-[250%]`}
      />
      <img
        src="/assets/arrow.svg"
        alt=""
        className={`${slide} -translate-x-[250%] group-hover:translate-x-0`}
      />
    </span>
  );
}
