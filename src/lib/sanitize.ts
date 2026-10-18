import sanitizeHtml from "sanitize-html";

/** Allowlist for Shopify `descriptionHtml` before it hits `dangerouslySetInnerHTML`. */
export function sanitizeDescription(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "ul", "ol", "li", "strong", "em", "b", "i", "br", "h2", "h3", "h4", "a"],
    allowedAttributes: { a: ["href"] },
    allowedSchemes: ["http", "https"],
    allowProtocolRelative: false,
  });
}
