import type { CodegenConfig } from "@graphql-codegen/cli";
import "dotenv/config";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

if (!domain || !token) {
  throw new Error(
    "Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN env vars"
  );
}

const config: CodegenConfig = {
  schema: {
    [`https://${domain}/api/2026-01/graphql.json`]: {
      headers: { "X-Shopify-Storefront-Access-Token": token },
    },
  },
  documents: ["src/lib/products.ts"],
  generates: {
    "src/lib/generated/storefront-types.ts": {
      plugins: ["typescript"],
      config: { enumsAsTypes: true },
    },
    "src/lib/generated/storefront.ts": {
      plugins: [
        { add: { content: "import type * as Types from './storefront-types';" } },
        "typescript-operations",
      ],
      config: {
        enumsAsTypes: true,
        namespacedImportName: "Types",
      },
    },
  },
};

export default config;
