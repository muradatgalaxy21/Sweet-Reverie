# Sweet Reverie — Headless Storefront

**Sweet Reverie** is a luxury confectionery boutique specializing in artisanal sweets, gourmet chocolates, handcrafted candies, and curated international treats.

This repository contains the official headless e-commerce web application for Sweet Reverie, built with a modern Next.js 16 frontend and powered by Shopify's Storefront GraphQL API.

---

## 🍬 Key Features & Highlights

- **Luxury Design System**: Rich burgundy, peach, gold, and espresso color palette with smooth micro-animations.
- **Headless Architecture**: Lightning-fast Next.js App Router frontend decoupled from Shopify backend operations.
- **Dynamic Storefront**:
  - Interactive hero carousels featuring seasonal highlights.
  - Multi-column category grids and brand showcases.
  - New arrivals and best seller sections with quick cart drawer integration.
  - Search modal and filterable product collections.
- **Shopify Integration**: GraphQL integration with Shopify Storefront API for inventory sync and checkout redirects.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & React**: [React 19](https://react.dev/), `@base-ui/react`, Lucide React
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Layer**: GraphQL, `@graphql-codegen`, `graphql-request`
- **Backend / CMS**: Shopify Storefront API & Shopify Hosted Checkout

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/sweet-reverie.git
   cd sweet-reverie
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file and fill in your Shopify Storefront credentials:
   ```bash
   cp .env.local.example .env.local
   ```
   *Required variables:*
   ```env
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_public_storefront_access_token
   SHOPIFY_ADMIN_TOKEN=your_private_admin_token
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack. |
| `npm run build` | Builds the application for production deployment. |
| `npm run start` | Runs the compiled production build locally. |
| `npm run lint` | Executes ESLint to check for code quality issues. |
| `npm run codegen` | Generates TypeScript types from Shopify GraphQL schema. |

---

## 📁 Repository Structure

```
├── public/              # Static assets and media
├── src/
│   ├── app/             # Next.js App Router pages and layouts
│   ├── components/      # Reusable presentational components & sections
│   ├── lib/             # Helper utilities, cart context, static fallback data & types
│   └── types/           # Generated GraphQL and TypeScript definitions
├── codegen.ts           # GraphQL Codegen configuration
├── plan.md              # Architectural spec and development roadmap
└── progress.md          # Log of completed features and active milestones
```

---

## 🔒 License

Private & Proprietary © **Sweet Reverie**. All rights reserved.
