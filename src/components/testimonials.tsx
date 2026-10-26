import React from "react";
import { Star } from "lucide-react";

// TODO: mock quotes — replace with real customer reviews before launch.
const TESTIMONIALS = [
  { name: "Ayesha K.", city: "Lahore", quote: "Ferrero box arrived perfectly packed and fresh. Will definitely order again for Eid." },
  { name: "Hamza R.", city: "Karachi", quote: "Finally found genuine Takis and Samyang in Pakistan. Delivery took two days." },
  { name: "Sana M.", city: "Islamabad", quote: "Ordered a gift hamper over WhatsApp — super helpful team and beautiful presentation." },
];

export function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-center text-3xl md:text-4xl text-[#662A37] mb-8">Sweet Words</h2>
      <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
        {TESTIMONIALS.map((t) => (
          <li key={t.name} className="rounded-2xl border border-[#ECA58A]/60 bg-white p-6 shadow-sm">
            <div className="flex gap-0.5 text-[#D4AF7A]" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">&ldquo;{t.quote}&rdquo;</p>
            <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[#4A1A25]">
              {t.name} <span className="font-medium text-stone-500">· {t.city}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
