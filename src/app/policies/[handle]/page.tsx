import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPolicy, isPolicyHandle, POLICY_FIELDS } from "@/lib/policies";

// Only the four Shopify policies exist; any other handle 404s. Text refreshes with the 1h ISR safety net
// (policy edits don't fire the product/collection webhooks in api/revalidate).
export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(POLICY_FIELDS).map((handle) => ({ handle }));
}

export async function generateMetadata(props: PageProps<"/policies/[handle]">): Promise<Metadata> {
  const { handle } = await props.params;
  if (!isPolicyHandle(handle)) return {};
  const policy = await getPolicy(handle);
  if (!policy) return {};
  return { title: policy.title, alternates: { canonical: `/policies/${handle}` } };
}

/** Store policy page (privacy, shipping, refund, terms): burgundy title strip + policy text from Shopify. */
export default async function PolicyPage(props: PageProps<"/policies/[handle]">) {
  const { handle } = await props.params;
  if (!isPolicyHandle(handle)) notFound();
  const policy = await getPolicy(handle);
  if (!policy) notFound();

  return (
    <div className="pb-12">
      <section className="bg-[#4A1A25] border-b-2 border-amber-500/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-center">
          <h1 className="text-3xl md:text-5xl font-serif text-[#D4AF7A] tracking-tight">{policy.title}</h1>
        </div>
      </section>

      <article
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 text-sm md:text-base leading-relaxed text-stone-700 break-words [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-serif [&_h2]:text-[#4A1A25] [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-bold [&_h3]:text-[#4A1A25] [&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:font-bold [&_a]:text-[#662A37] [&_a]:underline [&_strong]:text-stone-900"
        dangerouslySetInnerHTML={{ __html: policy.body }}
      />
    </div>
  );
}
