import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className="flex h-[clamp(50px,3.2vw,58px)] w-full cursor-pointer items-center justify-center border border-hw-espresso bg-hw-espresso font-grotesk text-[13px] font-medium uppercase tracking-[0.18em] text-hw-bone transition-colors duration-500 hover:bg-transparent hover:text-hw-espresso disabled:cursor-not-allowed disabled:border-hw-sand disabled:bg-hw-sand disabled:text-white"
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}
