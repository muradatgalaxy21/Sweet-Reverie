export interface Product {
  id: string;
  /** First variant, used by the card's quick "Add to cart". */
  variantId: string;
  handle: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  badge?: "Sale" | "New" | "Best Seller" | "Hot";
  category?: string;
  description?: string;
  availableForSale: boolean;
}

export interface Category {
  id: string;
  handle: string;
  title: string;
  imageUrl: string;
  itemCount?: number;
  /** Text-free banner behind the collection page title. */
  bannerUrl?: string;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  handle: string;
}

export interface CartLineItem {
  /** Shopify cart line id. */
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Cart {
  id: string;
  items: CartLineItem[];
  totalQuantity: number;
  totalPrice: number;
  checkoutUrl: string;
}
