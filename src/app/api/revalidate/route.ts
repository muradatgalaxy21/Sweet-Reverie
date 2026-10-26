import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

/**
 * Shopify webhook endpoint (plan.md §3): product/collection/inventory changes in Shopify
 * mark every Storefront API response tagged "shopify" stale, so pages refresh on their
 * next visit instead of polling. Register in Shopify admin → Settings → Notifications →
 * Webhooks, URL `<SITE_URL>/api/revalidate`, format JSON.
 */
const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

// Topics that change data the storefront renders. Anything else is acknowledged and ignored.
const TOPICS = new Set([
  "products/create",
  "products/update",
  "products/delete",
  "collections/create",
  "collections/update",
  "collections/delete",
  "inventory_levels/update",
]);

/** Shopify signs the raw body: base64(HMAC-SHA256(body, secret)) in X-Shopify-Hmac-Sha256. */
function isValidSignature(body: string, signature: string | null): boolean {
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(body, "utf8").digest();
  const received = Buffer.from(signature, "base64");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export async function POST(request: Request) {
  if (!secret) {
    console.error("SHOPIFY_WEBHOOK_SECRET is not set; rejecting webhook");
    return Response.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await request.text();
  if (!isValidSignature(body, request.headers.get("x-shopify-hmac-sha256"))) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const topic = request.headers.get("x-shopify-topic") ?? "";
  if (!TOPICS.has(topic)) {
    return Response.json({ revalidated: false, topic });
  }

  // "max": the first visitor after a change gets the cached page while it regenerates.
  revalidateTag("shopify", "max");
  return Response.json({ revalidated: true, topic });
}
