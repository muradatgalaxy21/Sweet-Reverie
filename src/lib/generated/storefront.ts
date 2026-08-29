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
 * The three-letter currency codes that represent the world currencies used in
 * stores. These include standard ISO 4217 codes, legacy codes,
 * and non-standard codes.
 *
 */
export type CurrencyCode =
  /** United Arab Emirates Dirham (AED). */
  | 'AED'
  /** Afghan Afghani (AFN). */
  | 'AFN'
  /** Albanian Lek (ALL). */
  | 'ALL'
  /** Armenian Dram (AMD). */
  | 'AMD'
  /** Netherlands Antillean Guilder. */
  | 'ANG'
  /** Angolan Kwanza (AOA). */
  | 'AOA'
  /** Argentine Pesos (ARS). */
  | 'ARS'
  /** Australian Dollars (AUD). */
  | 'AUD'
  /** Aruban Florin (AWG). */
  | 'AWG'
  /** Azerbaijani Manat (AZN). */
  | 'AZN'
  /** Bosnia and Herzegovina Convertible Mark (BAM). */
  | 'BAM'
  /** Barbadian Dollar (BBD). */
  | 'BBD'
  /** Bangladesh Taka (BDT). */
  | 'BDT'
  /** Bulgarian Lev (BGN). */
  | 'BGN'
  /** Bahraini Dinar (BHD). */
  | 'BHD'
  /** Burundian Franc (BIF). */
  | 'BIF'
  /** Bermudian Dollar (BMD). */
  | 'BMD'
  /** Brunei Dollar (BND). */
  | 'BND'
  /** Bolivian Boliviano (BOB). */
  | 'BOB'
  /** Brazilian Real (BRL). */
  | 'BRL'
  /** Bahamian Dollar (BSD). */
  | 'BSD'
  /** Bhutanese Ngultrum (BTN). */
  | 'BTN'
  /** Botswana Pula (BWP). */
  | 'BWP'
  /** Belarusian Ruble (BYN). */
  | 'BYN'
  /** Belarusian Ruble (BYR). */
  | 'BYR'
  /** Belize Dollar (BZD). */
  | 'BZD'
  /** Canadian Dollars (CAD). */
  | 'CAD'
  /** Congolese franc (CDF). */
  | 'CDF'
  /** Swiss Francs (CHF). */
  | 'CHF'
  /** Chilean Peso (CLP). */
  | 'CLP'
  /** Chinese Yuan Renminbi (CNY). */
  | 'CNY'
  /** Colombian Peso (COP). */
  | 'COP'
  /** Costa Rican Colones (CRC). */
  | 'CRC'
  /** Cape Verdean escudo (CVE). */
  | 'CVE'
  /** Czech Koruny (CZK). */
  | 'CZK'
  /** Djiboutian Franc (DJF). */
  | 'DJF'
  /** Danish Kroner (DKK). */
  | 'DKK'
  /** Dominican Peso (DOP). */
  | 'DOP'
  /** Algerian Dinar (DZD). */
  | 'DZD'
  /** Egyptian Pound (EGP). */
  | 'EGP'
  /** Eritrean Nakfa (ERN). */
  | 'ERN'
  /** Ethiopian Birr (ETB). */
  | 'ETB'
  /** Euro (EUR). */
  | 'EUR'
  /** Fijian Dollars (FJD). */
  | 'FJD'
  /** Falkland Islands Pounds (FKP). */
  | 'FKP'
  /** United Kingdom Pounds (GBP). */
  | 'GBP'
  /** Georgian Lari (GEL). */
  | 'GEL'
  /** Ghanaian Cedi (GHS). */
  | 'GHS'
  /** Gibraltar Pounds (GIP). */
  | 'GIP'
  /** Gambian Dalasi (GMD). */
  | 'GMD'
  /** Guinean Franc (GNF). */
  | 'GNF'
  /** Guatemalan Quetzal (GTQ). */
  | 'GTQ'
  /** Guyanese Dollar (GYD). */
  | 'GYD'
  /** Hong Kong Dollars (HKD). */
  | 'HKD'
  /** Honduran Lempira (HNL). */
  | 'HNL'
  /** Croatian Kuna (HRK). */
  | 'HRK'
  /** Haitian Gourde (HTG). */
  | 'HTG'
  /** Hungarian Forint (HUF). */
  | 'HUF'
  /** Indonesian Rupiah (IDR). */
  | 'IDR'
  /** Israeli New Shekel (NIS). */
  | 'ILS'
  /** Indian Rupees (INR). */
  | 'INR'
  /** Iraqi Dinar (IQD). */
  | 'IQD'
  /** Iranian Rial (IRR). */
  | 'IRR'
  /** Icelandic Kronur (ISK). */
  | 'ISK'
  /** Jersey Pound. */
  | 'JEP'
  /** Jamaican Dollars (JMD). */
  | 'JMD'
  /** Jordanian Dinar (JOD). */
  | 'JOD'
  /** Japanese Yen (JPY). */
  | 'JPY'
  /** Kenyan Shilling (KES). */
  | 'KES'
  /** Kyrgyzstani Som (KGS). */
  | 'KGS'
  /** Cambodian Riel. */
  | 'KHR'
  /** Kiribati Dollar (KID). */
  | 'KID'
  /** Comorian Franc (KMF). */
  | 'KMF'
  /** South Korean Won (KRW). */
  | 'KRW'
  /** Kuwaiti Dinar (KWD). */
  | 'KWD'
  /** Cayman Dollars (KYD). */
  | 'KYD'
  /** Kazakhstani Tenge (KZT). */
  | 'KZT'
  /** Laotian Kip (LAK). */
  | 'LAK'
  /** Lebanese Pounds (LBP). */
  | 'LBP'
  /** Sri Lankan Rupees (LKR). */
  | 'LKR'
  /** Liberian Dollar (LRD). */
  | 'LRD'
  /** Lesotho Loti (LSL). */
  | 'LSL'
  /** Lithuanian Litai (LTL). */
  | 'LTL'
  /** Latvian Lati (LVL). */
  | 'LVL'
  /** Libyan Dinar (LYD). */
  | 'LYD'
  /** Moroccan Dirham. */
  | 'MAD'
  /** Moldovan Leu (MDL). */
  | 'MDL'
  /** Malagasy Ariary (MGA). */
  | 'MGA'
  /** Macedonia Denar (MKD). */
  | 'MKD'
  /** Burmese Kyat (MMK). */
  | 'MMK'
  /** Mongolian Tugrik. */
  | 'MNT'
  /** Macanese Pataca (MOP). */
  | 'MOP'
  /** Mauritanian Ouguiya (MRU). */
  | 'MRU'
  /** Mauritian Rupee (MUR). */
  | 'MUR'
  /** Maldivian Rufiyaa (MVR). */
  | 'MVR'
  /** Malawian Kwacha (MWK). */
  | 'MWK'
  /** Mexican Pesos (MXN). */
  | 'MXN'
  /** Malaysian Ringgits (MYR). */
  | 'MYR'
  /** Mozambican Metical. */
  | 'MZN'
  /** Namibian Dollar. */
  | 'NAD'
  /** Nigerian Naira (NGN). */
  | 'NGN'
  /** Nicaraguan Córdoba (NIO). */
  | 'NIO'
  /** Norwegian Kroner (NOK). */
  | 'NOK'
  /** Nepalese Rupee (NPR). */
  | 'NPR'
  /** New Zealand Dollars (NZD). */
  | 'NZD'
  /** Omani Rial (OMR). */
  | 'OMR'
  /** Panamian Balboa (PAB). */
  | 'PAB'
  /** Peruvian Nuevo Sol (PEN). */
  | 'PEN'
  /** Papua New Guinean Kina (PGK). */
  | 'PGK'
  /** Philippine Peso (PHP). */
  | 'PHP'
  /** Pakistani Rupee (PKR). */
  | 'PKR'
  /** Polish Zlotych (PLN). */
  | 'PLN'
  /** Paraguayan Guarani (PYG). */
  | 'PYG'
  /** Qatari Rial (QAR). */
  | 'QAR'
  /** Romanian Lei (RON). */
  | 'RON'
  /** Serbian dinar (RSD). */
  | 'RSD'
  /** Russian Rubles (RUB). */
  | 'RUB'
  /** Rwandan Franc (RWF). */
  | 'RWF'
  /** Saudi Riyal (SAR). */
  | 'SAR'
  /** Solomon Islands Dollar (SBD). */
  | 'SBD'
  /** Seychellois Rupee (SCR). */
  | 'SCR'
  /** Sudanese Pound (SDG). */
  | 'SDG'
  /** Swedish Kronor (SEK). */
  | 'SEK'
  /** Singapore Dollars (SGD). */
  | 'SGD'
  /** Saint Helena Pounds (SHP). */
  | 'SHP'
  /** Sierra Leonean Leone (SLL). */
  | 'SLL'
  /** Somali Shilling (SOS). */
  | 'SOS'
  /** Surinamese Dollar (SRD). */
  | 'SRD'
  /** South Sudanese Pound (SSP). */
  | 'SSP'
  /** Sao Tome And Principe Dobra (STD). */
  | 'STD'
  /** Sao Tome And Principe Dobra (STN). */
  | 'STN'
  /** Syrian Pound (SYP). */
  | 'SYP'
  /** Swazi Lilangeni (SZL). */
  | 'SZL'
  /** Thai baht (THB). */
  | 'THB'
  /** Tajikistani Somoni (TJS). */
  | 'TJS'
  /** Turkmenistani Manat (TMT). */
  | 'TMT'
  /** Tunisian Dinar (TND). */
  | 'TND'
  /** Tongan Pa'anga (TOP). */
  | 'TOP'
  /** Turkish Lira (TRY). */
  | 'TRY'
  /** Trinidad and Tobago Dollars (TTD). */
  | 'TTD'
  /** Taiwan Dollars (TWD). */
  | 'TWD'
  /** Tanzanian Shilling (TZS). */
  | 'TZS'
  /** Ukrainian Hryvnia (UAH). */
  | 'UAH'
  /** Ugandan Shilling (UGX). */
  | 'UGX'
  /** United States Dollars (USD). */
  | 'USD'
  /** Uruguayan Pesos (UYU). */
  | 'UYU'
  /** Uzbekistan som (UZS). */
  | 'UZS'
  /** Venezuelan Bolivares (VED). */
  | 'VED'
  /** Venezuelan Bolivares (VEF). */
  | 'VEF'
  /** Venezuelan Bolivares Soberanos (VES). */
  | 'VES'
  /** Vietnamese đồng (VND). */
  | 'VND'
  /** Vanuatu Vatu (VUV). */
  | 'VUV'
  /** Samoan Tala (WST). */
  | 'WST'
  /** Central African CFA Franc (XAF). */
  | 'XAF'
  /** East Caribbean Dollar (XCD). */
  | 'XCD'
  /** West African CFA franc (XOF). */
  | 'XOF'
  /** CFP Franc (XPF). */
  | 'XPF'
  /** Unrecognized currency. */
  | 'XXX'
  /** Yemeni Rial (YER). */
  | 'YER'
  /** South African Rand (ZAR). */
  | 'ZAR'
  /** Zambian Kwacha (ZMW). */
  | 'ZMW';

export type CartFragment = { id: string, checkoutUrl: unknown, totalQuantity: number, cost: { subtotalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, lines: { edges: Array<{ node:
        | { id: string, quantity: number, cost: { totalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, merchandise: { id: string, title: string, image: { url: unknown, altText: string | null } | null, price: { amount: unknown, currencyCode: Types.CurrencyCode }, product: { handle: string, title: string } } }
        | { id: string, quantity: number, cost: { totalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, merchandise: { id: string, title: string, image: { url: unknown, altText: string | null } | null, price: { amount: unknown, currencyCode: Types.CurrencyCode }, product: { handle: string, title: string } } }
       }> } };

export type GetCartQueryVariables = Exact<{
  id: string | number;
}>;


export type GetCartQuery = { cart: { id: string, checkoutUrl: unknown, totalQuantity: number, cost: { subtotalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, lines: { edges: Array<{ node:
          | { id: string, quantity: number, cost: { totalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, merchandise: { id: string, title: string, image: { url: unknown, altText: string | null } | null, price: { amount: unknown, currencyCode: Types.CurrencyCode }, product: { handle: string, title: string } } }
          | { id: string, quantity: number, cost: { totalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, merchandise: { id: string, title: string, image: { url: unknown, altText: string | null } | null, price: { amount: unknown, currencyCode: Types.CurrencyCode }, product: { handle: string, title: string } } }
         }> } } | null };

export type CartCreateMutationVariables = Exact<{
  lines?: Array<Types.CartLineInput> | Types.CartLineInput | null | undefined;
}>;


export type CartCreateMutation = { cartCreate: { cart: { id: string, checkoutUrl: unknown, totalQuantity: number, cost: { subtotalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, lines: { edges: Array<{ node:
            | { id: string, quantity: number, cost: { totalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, merchandise: { id: string, title: string, image: { url: unknown, altText: string | null } | null, price: { amount: unknown, currencyCode: Types.CurrencyCode }, product: { handle: string, title: string } } }
            | { id: string, quantity: number, cost: { totalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, merchandise: { id: string, title: string, image: { url: unknown, altText: string | null } | null, price: { amount: unknown, currencyCode: Types.CurrencyCode }, product: { handle: string, title: string } } }
           }> } } | null, userErrors: Array<{ field: Array<string> | null, message: string }> } | null };

export type CartLinesAddMutationVariables = Exact<{
  cartId: string | number;
  lines: Array<Types.CartLineInput> | Types.CartLineInput;
}>;


export type CartLinesAddMutation = { cartLinesAdd: { cart: { id: string, checkoutUrl: unknown, totalQuantity: number, cost: { subtotalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, lines: { edges: Array<{ node:
            | { id: string, quantity: number, cost: { totalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, merchandise: { id: string, title: string, image: { url: unknown, altText: string | null } | null, price: { amount: unknown, currencyCode: Types.CurrencyCode }, product: { handle: string, title: string } } }
            | { id: string, quantity: number, cost: { totalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, merchandise: { id: string, title: string, image: { url: unknown, altText: string | null } | null, price: { amount: unknown, currencyCode: Types.CurrencyCode }, product: { handle: string, title: string } } }
           }> } } | null, userErrors: Array<{ field: Array<string> | null, message: string }> } | null };

export type CartLinesUpdateMutationVariables = Exact<{
  cartId: string | number;
  lines: Array<Types.CartLineUpdateInput> | Types.CartLineUpdateInput;
}>;


export type CartLinesUpdateMutation = { cartLinesUpdate: { cart: { id: string, checkoutUrl: unknown, totalQuantity: number, cost: { subtotalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, lines: { edges: Array<{ node:
            | { id: string, quantity: number, cost: { totalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, merchandise: { id: string, title: string, image: { url: unknown, altText: string | null } | null, price: { amount: unknown, currencyCode: Types.CurrencyCode }, product: { handle: string, title: string } } }
            | { id: string, quantity: number, cost: { totalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, merchandise: { id: string, title: string, image: { url: unknown, altText: string | null } | null, price: { amount: unknown, currencyCode: Types.CurrencyCode }, product: { handle: string, title: string } } }
           }> } } | null, userErrors: Array<{ field: Array<string> | null, message: string }> } | null };

export type CartLinesRemoveMutationVariables = Exact<{
  cartId: string | number;
  lineIds: Array<string | number> | string | number;
}>;


export type CartLinesRemoveMutation = { cartLinesRemove: { cart: { id: string, checkoutUrl: unknown, totalQuantity: number, cost: { subtotalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, lines: { edges: Array<{ node:
            | { id: string, quantity: number, cost: { totalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, merchandise: { id: string, title: string, image: { url: unknown, altText: string | null } | null, price: { amount: unknown, currencyCode: Types.CurrencyCode }, product: { handle: string, title: string } } }
            | { id: string, quantity: number, cost: { totalAmount: { amount: unknown, currencyCode: Types.CurrencyCode } }, merchandise: { id: string, title: string, image: { url: unknown, altText: string | null } | null, price: { amount: unknown, currencyCode: Types.CurrencyCode }, product: { handle: string, title: string } } }
           }> } } | null, userErrors: Array<{ field: Array<string> | null, message: string }> } | null };

export type ProductCardFragment = { id: string, handle: string, title: string, featuredImage: { url: unknown, altText: string | null, width: number | null, height: number | null } | null, priceRange: { minVariantPrice: { amount: unknown, currencyCode: Types.CurrencyCode } } };

export type GetProductsQueryVariables = Exact<{
  first?: number | null | undefined;
  after?: string | null | undefined;
}>;


export type GetProductsQuery = { products: { edges: Array<{ cursor: string, node: { id: string, handle: string, title: string, featuredImage: { url: unknown, altText: string | null, width: number | null, height: number | null } | null, priceRange: { minVariantPrice: { amount: unknown, currencyCode: Types.CurrencyCode } } } }>, pageInfo: { hasNextPage: boolean, endCursor: string | null } } };

export type GetProductByHandleQueryVariables = Exact<{
  handle: string;
}>;


export type GetProductByHandleQuery = { product: { id: string, handle: string, title: string, description: string, descriptionHtml: unknown, seo: { title: string | null, description: string | null }, featuredImage: { url: unknown, altText: string | null, width: number | null, height: number | null } | null, images: { edges: Array<{ node: { url: unknown, altText: string | null, width: number | null, height: number | null } }> }, priceRange: { minVariantPrice: { amount: unknown, currencyCode: Types.CurrencyCode } }, variants: { edges: Array<{ node: { id: string, title: string, availableForSale: boolean, price: { amount: unknown, currencyCode: Types.CurrencyCode }, selectedOptions: Array<{ name: string, value: string }> } }> } } | null };

export type GetCollectionsQueryVariables = Exact<{
  first?: number | null | undefined;
}>;


export type GetCollectionsQuery = { collections: { edges: Array<{ node: { id: string, handle: string, title: string, description: string, image: { url: unknown, altText: string | null, width: number | null, height: number | null } | null } }> } };

export type GetCollectionByHandleQueryVariables = Exact<{
  handle: string;
  first?: number | null | undefined;
  after?: string | null | undefined;
}>;


export type GetCollectionByHandleQuery = { collection: { id: string, handle: string, title: string, description: string, seo: { title: string | null, description: string | null }, image: { url: unknown, altText: string | null, width: number | null, height: number | null } | null, products: { edges: Array<{ cursor: string, node: { id: string, handle: string, title: string, featuredImage: { url: unknown, altText: string | null, width: number | null, height: number | null } | null, priceRange: { minVariantPrice: { amount: unknown, currencyCode: Types.CurrencyCode } } } }>, pageInfo: { hasNextPage: boolean, endCursor: string | null } } } | null };
