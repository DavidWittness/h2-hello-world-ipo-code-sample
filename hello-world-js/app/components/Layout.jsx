import {Link, Await, useMatches} from '@remix-run/react';
import {Suspense} from 'react';
import {Drawer, useDrawer} from '~/components/Drawer';
import {CartLineItems, CartActions, CartSummary} from '~/components/Cart';

export function Layout({children, title}) {
  const {isOpen, openDrawer, closeDrawer} = useDrawer();
  const [root] = useMatches();

  return (
    <div className="flex flex-col min-h-screen antialiased bg-neutral-50">
      <header
        role="banner"
        className={`flex items-center h-16 p-6 md:p-8 lg:p-12 sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 antialiased transition shadow-sm`}
      >
        <div className="flex gap-12 w-full items-center">
          <a className="font-bold" href="/">
            {title}
          </a>
          <Suspense>
            <Await resolve={root.data?.cart}>
              {(cart) => <CartHeader openDrawer={openDrawer} cart={cart} />}
            </Await>
          </Suspense>
        </div>
      </header>

      <main
        role="main"
        id="mainContent"
        className="flex-grow p-6 md:p-8 lg:p-12"
      >
        {children}
      </main>
      <Drawer open={isOpen} onClose={closeDrawer}>
        <Suspense fallback={<p>Loading...</p>}>
          <Await resolve={root.data?.cart}>
            {(cart) => <CartDrawer cart={cart} close={closeDrawer} />}
          </Await>
        </Suspense>
      </Drawer>
    </div>
  );
}

function CartHeader({cart, openDrawer}) {
  return (
    <button
      className="relative ml-auto flex items-center justify-center w-8 h-8"
      onClick={openDrawer}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
      >
        <title>Bag</title>
        <path
          fillRule="evenodd"
          d="M8.125 5a1.875 1.875 0 0 1 3.75 0v.375h-3.75V5Zm-1.25.375V5a3.125 3.125 0 1 1 6.25 0v.375h3.5V15A2.625 2.625 0 0 1 14 17.625H6A2.625 2.625 0 0 1 3.375 15V5.375h3.5ZM4.625 15V6.625h10.75V15c0 .76-.616 1.375-1.375 1.375H6c-.76 0-1.375-.616-1.375-1.375Z"
        ></path>
      </svg>
      {cart?.totalQuantity > 0 && (
        <div className="text-contrast bg-red-500 text-white absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px">
          <span>{cart?.totalQuantity}</span>
        </div>
      )}
    </button>
  );
}

function CartDrawer({cart, close}) {
  if (cart?.totalQuantity > 0)
    return (
      <div className="flex flex-col space-y-7 justify-between items-center md:py-8 md:px-12 px-4 py-6 h-screen">
        <CartLineItems linesObj={cart.lines} />

        <div className="w-full">
          <div className="mt-6">
            <CartSummary cost={cart.cost} />
          </div>

          <div className="mt-6">
            <CartActions checkoutUrl={cart.checkoutUrl} />
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col space-y-7 justify-center items-center md:py-8 md:px-12 px-4 py-6 h-screen">
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
        Your cart is empty
      </h2>
      <button
        onClick={close}
        className="inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none bg-black text-white w-full"
      >
        Continue shopping
      </button>
    </div>
  );
}
