import React from "react";
import { BadgeCheck, Truck, Banknote, ShieldCheck, Award } from "lucide-react";

export const TRUST_ITEMS = [
  { icon: BadgeCheck, title: "Original Imports", text: "100% authentic, sourced abroad" },
  { icon: Truck, title: "Nationwide Delivery", text: "To every city in Pakistan" },
  { icon: Banknote, title: "Cash on Delivery", text: "Pay when it arrives" },
  { icon: ShieldCheck, title: "Secure Checkout", text: "Powered by Shopify" },
  { icon: Award, title: "Top Vendor in Pakistan", text: "Among the leading confectionery importers" },
];

/** Homepage reassurance strip shown under the hero: slim, full-bleed band. */
export function TrustStrip() {
  return (
    <section className="w-full border-y border-[#ECA58A]/60 bg-[#FAF7F2]">
      <ul className="flex items-center justify-between gap-6 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-10 [scrollbar-width:none]">
        {TRUST_ITEMS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex flex-shrink-0 items-center gap-2.5">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#662A37] text-[#D4AF7A]">
              <Icon className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <p className="text-xs md:text-sm font-extrabold text-[#4A1A25]">{title}</p>
              <p className="hidden xl:block text-xs text-stone-500">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
