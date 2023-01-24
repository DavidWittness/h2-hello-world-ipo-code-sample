import {Money} from '@shopify/storefront-kit-react';
import {Link, useFetcher, useMatches} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {flattenConnection, Image} from '@shopify/storefront-kit-react';

export function CartLineItems({linesObj}) {
  const lines = flattenConnection(linesObj);
  return (
    <div>
      {lines.map((line) => {
        return <LineItem key={line.id} lineItem={line} />;
      })}
    </div>
  );
}

function LineItem({lineItem}) {
  const {merchandise, quantity} = lineItem;

  return (
    <div className="flex gap-4 items-center py-8">
      <Link
        to={`/products/${merchandise.product.handle}`}
        className="flex-shrink-0"
      >
        <Image data={merchandise.image} width={110} height={110} />
      </Link>
      <div className="">
        <Link
          to={`/products/${merchandise.product.handle}`}
          className="no-underline hover:underline"
        >
          {merchandise.product.title}
        </Link>
        <div className="text-gray-800 text-sm">{merchandise.title}</div>
        <div className="text-gray-800 text-sm">Qty: {quantity}</div>
        <ItemRemoveButton lineIds={[lineItem.id]} />
      </div>
    </div>
  );
}

export function CartSummary({cost}) {
  return (
    <>
      <dl className="space-y-2">
        <div className="flex items-center justify-between">
          <dt>Subtotal</dt>
          <dd>
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center">
            <span>Shipping estimate</span>
          </dt>
          <dd className="text-green-600">Free and carbon neutral</dd>
        </div>
      </dl>
    </>
  );
}

export function CartActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <div className="flex flex-col mt-2">
      <a
        href={checkoutUrl}
        className="bg-black text-white px-4 py-2 w-full rounded-md text-center"
      >
        Continue to Checkout
      </a>
    </div>
  );
}

function ItemRemoveButton({lineIds}) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form action="/cart" method="post">
      <input type="hidden" name="cartAction" value="REMOVE_FROM_CART" />
      <input type="hidden" name="linesIds" value={JSON.stringify(lineIds)} />
      <button
        className="bg-white border-black text-black hover:text-white hover:bg-black inline-block rounded-sm font-small text-center py-2 px-4 my-2 max-w-xl leading-none border"
        type="submit"
      >
        <span>Remove</span>
        {/* <IconRemove aria-hidden="true" /> */}
      </button>
    </fetcher.Form>
  );
}
