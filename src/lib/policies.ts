import { shopifyFetch } from "./shopify";
import { sanitizePolicy } from "./sanitize";
import type { ShopPoliciesQuery, ShopPolicyFieldsFragment } from "./generated/storefront";

const SHOP_POLICIES = /* GraphQL */ `
  fragment ShopPolicyFields on ShopPolicy {
    title
    body
  }

  query ShopPolicies {
    shop {
      privacyPolicy {
        ...ShopPolicyFields
      }
      shippingPolicy {
        ...ShopPolicyFields
      }
      refundPolicy {
        ...ShopPolicyFields
      }
      termsOfService {
        ...ShopPolicyFields
      }
    }
  }
`;

// URL handle → Shop field. Handles match Shopify's own `/policies/<handle>` URLs, which checkout links to.
export const POLICY_FIELDS = {
  "privacy-policy": "privacyPolicy",
  "shipping-policy": "shippingPolicy",
  "refund-policy": "refundPolicy",
  "terms-of-service": "termsOfService",
} as const;

export type PolicyHandle = keyof typeof POLICY_FIELDS;

export function isPolicyHandle(handle: string): handle is PolicyHandle {
  return Object.hasOwn(POLICY_FIELDS, handle);
}

/** Policy text from Shopify admin → Settings → Policies; null if that policy is left empty. */
export async function getPolicy(handle: PolicyHandle): Promise<ShopPolicyFieldsFragment | null> {
  const { shop } = await shopifyFetch<ShopPoliciesQuery>(SHOP_POLICIES);
  const policy = shop[POLICY_FIELDS[handle]];
  if (!policy?.body.trim()) return null;
  return { ...policy, body: sanitizePolicy(policy.body) };
}
