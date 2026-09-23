import { Product, Brand } from "./types";

/**
 * List of famous confectionery brands matching the design mockup scroller.
 * 1. Contains brand name, URL handle, and path to brand logo in public directory.
 */
export const BRANDS: Brand[] = [
  { id: "cadbury", name: "Cadbury", handle: "cadbury", logoUrl: "/brands/Cadbury-Logo-2003.jpg" },
  { id: "ferrero-rocher", name: "Ferrero Rocher", handle: "ferrero-rocher", logoUrl: "/brands/Ferrero-Rocher-Logo.png" },
  { id: "reese", name: "Reese's", handle: "reeses", logoUrl: "/brands/reese.jpg" },
  { id: "doritos", name: "Doritos", handle: "doritos", logoUrl: "/brands/doritos.jpg" },
  { id: "haribo", name: "Haribo", handle: "haribo", logoUrl: "/brands/haribo.png" },
  { id: "takis", name: "Takis", handle: "takis", logoUrl: "/brands/takis.jpg" },
  { id: "toblerone", name: "Toblerone", handle: "toblerone", logoUrl: "/brands/toblerone.jpg" },
  { id: "biscoff", name: "Lotus Biscoff", handle: "lotus-biscoff", logoUrl: "/brands/biscoff.jpg" },
  { id: "galaxy", name: "Galaxy", handle: "galaxy", logoUrl: "/brands/galaxy.jpg" },
  { id: "pringles", name: "Pringles", handle: "pringles", logoUrl: "/brands/pringles.jpg" },
  { id: "bounty", name: "Bounty", handle: "bounty", logoUrl: "/brands/bounty.png" },
  { id: "twix", name: "Twix", handle: "twix", logoUrl: "/brands/twix.png" },
  { id: "samyang", name: "Samyang", handle: "samyang", logoUrl: "/brands/samyang.jpg" },
  { id: "sour-patch", name: "Sour Patch", handle: "sour-patch", logoUrl: "/brands/sour_patch.jpg" },
  { id: "warhead", name: "Warheads", handle: "warheads", logoUrl: "/brands/warhead.jpg" },
  { id: "werther", name: "Werther's Original", handle: "werthers", logoUrl: "/brands/werther.jpg" },
  { id: "celebrations", name: "Celebrations", handle: "celebrations", logoUrl: "/brands/celebrations.png" },
  { id: "brain-blasterz", name: "Brain Blasterz", handle: "brain-blasterz", logoUrl: "/brands/Brain-Blasterz-logo_385x306_06f47262-f625-4612-b366-e5ed06a54f67.jpg" },
];

/**
 * Products for the New Arrivals section matching the design mockup layout.
 * 1. High-resolution product images.
 * 2. Regular and compareAtPrice formatted in PKR.
 * 3. Sale/New indicator badges.
 */
export const NEW_ARRIVALS: Product[] = [
  {
    id: "na-1",
    handle: "luxury-brown-chocolate-gift-box",
    title: "Luxury Brown Chocolate Gift Box 350g",
    price: 2450,
    compareAtPrice: 2990,
    imageUrl: "/products/1768309497-Ferrero-Rocher-T16-200g.jpeg",
    badge: "Sale",
    availableForSale: true,
  },
  {
    id: "na-2",
    handle: "milka-hazelnut-wafer-treat",
    title: "Milka Hazelnut Cream Wafer 150g",
    price: 950,
    compareAtPrice: 1250,
    imageUrl: "/products/1764068771-Redondo-Wafers-Sticks-Choco-Hazelnut-100g.jpeg",
    badge: "New",
    availableForSale: true,
  },
  {
    id: "na-3",
    handle: "gourmet-imported-treats-hamper",
    title: "Gourmet Imported Treats Hamper Box",
    price: 4950,
    compareAtPrice: 6200,
    imageUrl: "/products/1763640567-WhatsApp-Image-2025-11-20-at-3-16-20-PM--1-.jpeg",
    badge: "Sale",
    availableForSale: true,
  },
  {
    id: "na-4",
    handle: "sweet-reverie-artisan-black-edition-box",
    title: "Sweet Reverie Artisan Black Edition Box",
    price: 3450,
    compareAtPrice: 4200,
    imageUrl: "/products/1752368956-212-Black-Party-EDP-100ml.jpeg",
    badge: "New",
    availableForSale: true,
  },
  {
    id: "na-5",
    handle: "toblerone-deluxe-collection-pack",
    title: "Toblerone Deluxe Collection Pack 400g",
    price: 1850,
    compareAtPrice: 2200,
    imageUrl: "/products/1750127147-Toblerone-Crunchy-Almond-Chocolate-Bar-100g.jpeg",
    badge: "Sale",
    availableForSale: true,
  },
];

/**
 * Products for Our Best Sellers section matching the design mockup.
 * 1. Popular snacks, candies, drinks, and ramen.
 * 2. High-converting items with dual price points.
 */
export const BEST_SELLERS: Product[] = [
  {
    id: "bs-1",
    handle: "takis-waves-blue-heat-chips",
    title: "Takis Waves Fuego Blue Heat 190g",
    price: 750,
    compareAtPrice: 950,
    imageUrl: "/products/1731906239-Takis.jpeg",
    badge: "Sale",
    availableForSale: true,
  },
  {
    id: "bs-2",
    handle: "warheads-sour-chewy-cubes",
    title: "Warheads Sour Chewy Cubes Candy 141g",
    price: 580,
    compareAtPrice: 690,
    imageUrl: "/products/1784186392-WarheadsSuperSourTongueSplash.jpeg",
    badge: "Hot",
    availableForSale: true,
  },
  {
    id: "bs-3",
    handle: "mirinda-green-apple-soda-can",
    title: "Mirinda Green Apple Soda Can 330ml",
    price: 350,
    compareAtPrice: 420,
    imageUrl: "/products/1782776999-OKFSparklingKiwiLite350ml.jpeg",
    badge: "Sale",
    availableForSale: true,
  },
  {
    id: "bs-4",
    handle: "mirinda-strawberry-sparkling-drink",
    title: "Mirinda Strawberry Sparkling Drink 330ml",
    price: 350,
    compareAtPrice: 420,
    imageUrl: "/products/1782777593-OKFSparklingStrawbery350ml.jpeg",
    badge: "Sale",
    availableForSale: true,
  },
  {
    id: "bs-5",
    handle: "samyang-2x-spicy-hot-chicken-ramen",
    title: "Samyang 2X Spicy Hot Chicken Ramen Pack",
    price: 750,
    compareAtPrice: 890,
    imageUrl: "/products/1764072900-Samyang-3x-Hot-Chicken-Ramen-140g.jpeg",
    badge: "Hot",
    availableForSale: true,
  },
];
