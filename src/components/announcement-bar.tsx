import React from "react";
import { Truck, Sparkles, Gift } from "lucide-react";

/**
 * Top announcement ticker bar.
 * 1. Displays delivery and promotional perks in continuous animation.
 * 2. High contrast styling with deep burgundy background and rose peach text.
 */
export function AnnouncementBar() {
  const announcements = [
    { text: "FLAT SHIPPING RATES ACROSS PAKISTAN", icon: Truck },
    { text: "100% ORIGINAL IMPORTED CONFECTIONERY", icon: Sparkles },
    { text: "COMPLIMENTARY LUXURY GIFT ON ORDERS OVER RS. 5,000", icon: Gift },
    { text: "FRESH ARTISAN STOCK ARRIVING WEEKLY", icon: Sparkles },
  ];

  return (
    <div className="bg-[#4A1A25] text-[#ECA58A] py-2 overflow-hidden border-b border-[#662A37]/50 text-xs font-semibold tracking-wider">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Render repeated list for seamless continuous loop */}
        {[...announcements, ...announcements].map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center mx-8">
              <Icon className="w-3.5 h-3.5 mr-2 text-[#ECA58A]" />
              <span>{item.text}</span>
              <span className="mx-6 text-[#ECA58A]/40">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
