/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type * as Types from './storefront-types';
/**
 * A custom key-value pair that stores additional information on a [cart](https://shopify.dev/docs/api/storefront/current/objects/Cart) or [cart line](https://shopify.dev/docs/api/storefront/current/objects/CartLine). Attributes capture additional information like gift messages, special instructions, or custom order details. Learn more about [managing carts with the Storefront API](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage).
 *
 */
export type AttributeInput = {
  /** Key or name of the attribute. */
  key: string;
  /** Value of the attribute. */
  value: string;
};

/**
 * The input fields for adding a merchandise line to a cart. Each line represents a [`ProductVariant`](https://shopify.dev/docs/api/storefront/current/objects/ProductVariant) the buyer intends to purchase, along with the quantity and optional [`SellingPlan`](https://shopify.dev/docs/api/storefront/current/objects/SellingPlan) for subscriptions.
 *
 * Used by the [`cartCreate`](https://shopify.dev/docs/api/storefront/current/mutations/cartCreate) mutation when creating a cart with initial items, and the [`cartLinesAdd`](https://shopify.dev/docs/api/storefront/current/mutations/cartLinesAdd) mutation when adding items to an existing cart.
 *
 */
export type CartLineInput = {
  /**
   * An array of key-value pairs that contains additional information about the merchandise line.
   *
   * The input must not contain more than `250` values.
   */
  attributes?: Array<AttributeInput> | null | undefined;
  /** The ID of the merchandise that the buyer intends to purchase. */
  merchandiseId: string | number;
  /** The parent line item of the cart line. */
  parent?: CartLineParentInput | null | undefined;
  /** The quantity of the merchandise. */
  quantity?: number | null | undefined;
  /** The ID of the selling plan that the merchandise is being purchased with. */
  sellingPlanId?: string | number | null | undefined;
};

/** The parent line item of the cart line. */
export type CartLineParentInput = {
  /** The id of the parent line item. */
  lineId?: string | number | null | undefined;
  /** The ID of the parent line merchandise. */
  merchandiseId?: string | number | null | undefined;
};

/**
 * The input fields for updating a merchandise line in a cart. Used by the [`cartLinesUpdate`](https://shopify.dev/docs/api/storefront/current/mutations/cartLinesUpdate) mutation.
 *
 * Specify the line item's [`id`](https://shopify.dev/docs/api/storefront/current/input-objects/CartLineUpdateInput#fields-id) along with any fields to modify. You can change the quantity, swap the merchandise, update custom attributes, or associate a different selling plan.
 *
 */
export type CartLineUpdateInput = {
  /**
   * An array of key-value pairs that contains additional information about the merchandise line.
   *
   * The input must not contain more than `250` values.
   */
  attributes?: Array<AttributeInput> | null | undefined;
  /** The ID of the merchandise line. */
  id: string | number;
  /** The ID of the merchandise for the line item. */
  merchandiseId?: string | number | null | undefined;
  /** The quantity of the line item. */
  quantity?: number | null | undefined;
  /** The ID of the selling plan that the merchandise is being purchased with. */
  sellingPlanId?: string | number | null | undefined;
};

/**
 * Sorting options for the [`products`](https://shopify.dev/docs/api/storefront/current/queries/products) query. Supports sorting products by criteria such as best-selling and price, and by product attributes such as type, and vendor.
 *
 * > Note: Use the [`RELEVANCE`](https://shopify.dev/docs/api/storefront/current/enums/ProductSortKeys#enums-RELEVANCE) key only when a search query is specified.
 *
 */
export type ProductSortKeys =
  /** Sort by the `best_selling` value. */
  | 'BEST_SELLING'
  /** Sort by the `created_at` value. */
  | 'CREATED_AT'
  /** Sort by the `id` value. */
  | 'ID'
  /** Sort by the `price` value. */
  | 'PRICE'
  /** Sort by the `product_type` value. */
  | 'PRODUCT_TYPE'
  /**
   * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
   * Don't use this sort key when no search query is specified.
   *
   */
  | 'RELEVANCE'
  /** Sort by the `title` value. */
  | 'TITLE'
  /** Sort by the `updated_at` value. */
  | 'UPDATED_AT'
  /** Sort by the `vendor` value. */
  | 'VENDOR';

export type CartFieldsFragment = { id: string, checkoutUrl: string, totalQuantity: number, cost: { subtotalAmount: { amount: string } }, lines: { nodes: Array<
      | { id: string, quantity: number, merchandise: { title: string, price: { amount: string }, image: { url: string } | null, product: { title: string, featuredImage: { url: string } | null } } }
      | { id: string, quantity: number, merchandise: { title: string, price: { amount: string }, image: { url: string } | null, product: { title: string, featuredImage: { url: string } | null } } }
    > } };

export type CartQueryVariables = Exact<{
  cartId: string | number;
}>;


export type CartQuery = { cart: { id: string, checkoutUrl: string, totalQuantity: number, cost: { subtotalAmount: { amount: string } }, lines: { nodes: Array<
        | { id: string, quantity: number, merchandise: { title: string, price: { amount: string }, image: { url: string } | null, product: { title: string, featuredImage: { url: string } | null } } }
        | { id: string, quantity: number, merchandise: { title: string, price: { amount: string }, image: { url: string } | null, product: { title: string, featuredImage: { url: string } | null } } }
      > } } | null };

export type CreateCartMutationVariables = Exact<{
  lines: Array<Types.CartLineInput> | Types.CartLineInput;
}>;


export type CreateCartMutation = { cartCreate: { cart: { id: string, checkoutUrl: string, totalQuantity: number, cost: { subtotalAmount: { amount: string } }, lines: { nodes: Array<
          | { id: string, quantity: number, merchandise: { title: string, price: { amount: string }, image: { url: string } | null, product: { title: string, featuredImage: { url: string } | null } } }
          | { id: string, quantity: number, merchandise: { title: string, price: { amount: string }, image: { url: string } | null, product: { title: string, featuredImage: { url: string } | null } } }
        > } } | null, userErrors: Array<{ message: string }> } | null };

export type CartLinesAddMutationVariables = Exact<{
  cartId: string | number;
  lines: Array<Types.CartLineInput> | Types.CartLineInput;
}>;


export type CartLinesAddMutation = { cartLinesAdd: { cart: { id: string, checkoutUrl: string, totalQuantity: number, cost: { subtotalAmount: { amount: string } }, lines: { nodes: Array<
          | { id: string, quantity: number, merchandise: { title: string, price: { amount: string }, image: { url: string } | null, product: { title: string, featuredImage: { url: string } | null } } }
          | { id: string, quantity: number, merchandise: { title: string, price: { amount: string }, image: { url: string } | null, product: { title: string, featuredImage: { url: string } | null } } }
        > } } | null, userErrors: Array<{ message: string }> } | null };

export type CartLinesUpdateMutationVariables = Exact<{
  cartId: string | number;
  lines: Array<Types.CartLineUpdateInput> | Types.CartLineUpdateInput;
}>;


export type CartLinesUpdateMutation = { cartLinesUpdate: { cart: { id: string, checkoutUrl: string, totalQuantity: number, cost: { subtotalAmount: { amount: string } }, lines: { nodes: Array<
          | { id: string, quantity: number, merchandise: { title: string, price: { amount: string }, image: { url: string } | null, product: { title: string, featuredImage: { url: string } | null } } }
          | { id: string, quantity: number, merchandise: { title: string, price: { amount: string }, image: { url: string } | null, product: { title: string, featuredImage: { url: string } | null } } }
        > } } | null, userErrors: Array<{ message: string }> } | null };

export type CartLinesRemoveMutationVariables = Exact<{
  cartId: string | number;
  lineIds: Array<string | number> | string | number;
}>;


export type CartLinesRemoveMutation = { cartLinesRemove: { cart: { id: string, checkoutUrl: string, totalQuantity: number, cost: { subtotalAmount: { amount: string } }, lines: { nodes: Array<
          | { id: string, quantity: number, merchandise: { title: string, price: { amount: string }, image: { url: string } | null, product: { title: string, featuredImage: { url: string } | null } } }
          | { id: string, quantity: number, merchandise: { title: string, price: { amount: string }, image: { url: string } | null, product: { title: string, featuredImage: { url: string } | null } } }
        > } } | null, userErrors: Array<{ message: string }> } | null };

export type ProductCardFragment = { id: string, handle: string, title: string, availableForSale: boolean, featuredImage: { url: string, altText: string | null } | null, variants: { nodes: Array<{ id: string, price: { amount: string }, compareAtPrice: { amount: string } | null }> } };

export type CollectionProductsQueryVariables = Exact<{
  handle: string;
  first: number;
  after?: string | null | undefined;
}>;


export type CollectionProductsQuery = { collection: { title: string, description: string, products: { nodes: Array<{ id: string, handle: string, title: string, availableForSale: boolean, featuredImage: { url: string, altText: string | null } | null, variants: { nodes: Array<{ id: string, price: { amount: string }, compareAtPrice: { amount: string } | null }> } }>, pageInfo: { hasNextPage: boolean, endCursor: string | null } } } | null };

export type ProductsQueryVariables = Exact<{
  first: number;
  sortKey?: Types.ProductSortKeys | null | undefined;
  reverse?: boolean | null | undefined;
  query?: string | null | undefined;
}>;


export type ProductsQuery = { products: { nodes: Array<{ id: string, handle: string, title: string, availableForSale: boolean, featuredImage: { url: string, altText: string | null } | null, variants: { nodes: Array<{ id: string, price: { amount: string }, compareAtPrice: { amount: string } | null }> } }> } };

export type ProductPageQueryVariables = Exact<{
  handle: string;
}>;


export type ProductPageQuery = { product: { id: string, handle: string, title: string, description: string, descriptionHtml: string, seo: { title: string | null, description: string | null }, images: { nodes: Array<{ url: string, altText: string | null }> }, variants: { nodes: Array<{ id: string, title: string, availableForSale: boolean, selectedOptions: Array<{ name: string, value: string }>, price: { amount: string }, compareAtPrice: { amount: string } | null, image: { url: string } | null }> }, collections: { nodes: Array<{ handle: string, title: string }> } } | null };
