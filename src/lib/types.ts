export interface Product {
  id: string;
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
}

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  handle: string;
}

export interface CartLineItem {
  id: string;
  productId: string;
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
  checkoutUrl?: string;
}
