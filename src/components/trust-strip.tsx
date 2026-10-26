import React from "react";
import { BadgeCheck, Truck, Banknote, ShieldCheck } from "lucide-react";

export const TRUST_ITEMS = [
  { icon: BadgeCheck, title: "Original Imports", text: "100% authentic, sourced abroad" },
  { icon: Truck, title: "Nationwide Delivery", text: "To every city in Pakistan" },
  { icon: Banknote, title: "Cash on Delivery", text: "Pay when it arrives" },
  { icon: ShieldCheck, title: "Secure Checkout", text: "Powered by Shopify" },
];

/** Homepage reassurance strip shown under the hero. */
export function TrustStrip() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 rounded-2xl border border-[#ECA58A]/60 bg-[#FAF7F2] p-4 md:p-6">
        {TRUST_ITEMS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-center gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#662A37] text-[#D4AF7A]">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs md:text-sm font-extrabold text-[#4A1A25]">{title}</p>
              <p className="hidden sm:block text-xs text-stone-500">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
