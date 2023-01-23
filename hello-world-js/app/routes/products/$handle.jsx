import {useLoaderData} from '@remix-run/react';
import {json} from 'react-router';
import {Money, ShopPayButton} from '@shopify/storefront-kit-react';
import ProductOptions from '~/components/ProductOptions';

export const loader = async ({params, context, request}) => {
  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const selectedOptions = [];

  // set selected options from the query string
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });

  const data = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions,
    },
  });

  const {product} = data;

  // optionally set a default variant so you always have an "orderable" product selected
  const selectedVariant =
    product.selectedVariant ?? product?.variants?.nodes[0];

  return json({
    product,
    selectedVariant,
  });
};

export default function ProductHandle() {
  const {product, selectedVariant} = useLoaderData();

  const {vendor, title, descriptionHtml} = product;
  const mainImage = product.media.nodes[0].image;

  return (
    <section className="w-full grid md:px-8 lg:px-12 px-0">
      <div className="grid md:gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
        <div className="w-screen md:w-full lg:col-span-2 md:grid-flow-row md:p-0 md:overflow-x-auto md:grid-cols-2">
          <div className="md:col-span-2 bg-white md:w-full">
            <img
              src={mainImage.url}
              alt={mainImage.altText || 'alt text'}
              className="w-full h-full aspect-square"
            />
          </div>
        </div>
        <div className="sticky md:-mb-nav md:top-nav md:-translate-y-nav md:h-screen md:pt-nav hiddenScroll md:overflow-y-scroll p-6">
          <h1 className="text-4xl max-w-prose font-bold mb-2">{title}</h1>
          <span className="opacity-50">{vendor}</span>
          <div
            className="prose mb-4"
            dangerouslySetInnerHTML={{__html: descriptionHtml}}
          />
          <ProductOptions
            options={product.options}
            selectedVariant={selectedVariant}
          />
          <Money
            withoutTrailingZeros
            data={selectedVariant.price}
            className="text-xl font-semibold mb-2"
          />
          <ShopPayButton variantIds={[selectedVariant?.id]} />
        </div>
      </div>
      {/* <PrintJson data={product} /> */}
    </section>
  );
}

function PrintJson({data}) {
  return (
    <details>
      <summary>Product JSON</summary>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </details>
  );
}
const PRODUCT_QUERY = `#graphql
  query product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
    product(handle: $handle) {
      id
      title
      handle
      vendor
      descriptionHtml
      media(first: 10) {
        nodes {
          ... on MediaImage {
            mediaContentType
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
      options {
        name,
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          id
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        sku
        title
        unitPrice {
          amount
          currencyCode
        }
        product {
          title
          handle
        }
      }
      variants(first: 1) {
        nodes {
          id
          title
          availableForSale
          price {
            currencyCode
            amount
          }
          compareAtPrice {
            currencyCode
            amount
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;
