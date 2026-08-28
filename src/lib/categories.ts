export type Category = {
  handle: string;
  title: string;
};

// Matches the collections that actually exist in Shopify today.
// Source list from the client had "coffee" and "drinks" as separate
// categories, but the store only has one combined "coffee-drinks"
// collection — using the real collection here instead of splitting it.
export const CATEGORIES: Category[] = [
  { handle: "chocolate", title: "Chocolate" },
  { handle: "jelly", title: "Jelly" },
  { handle: "candy", title: "Candy" },
  { handle: "crisps", title: "Crisps" },
  { handle: "chips", title: "Chips" },
  { handle: "biscuits", title: "Biscuits" },
  { handle: "noodles", title: "Noodles" },
  { handle: "coffee-drinks", title: "Coffee & Drinks" },
];
