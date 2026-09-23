"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

/**
 * Floating WhatsApp direct support button.
 * 1. Fixed positioning at bottom right matching the design mockup.
 * 2. Links to official store WhatsApp support number.
 * 3. Animated pulse effect for enhanced visibility.
 */
export function FloatingWhatsApp() {
  const phoneNumber = "923001515676";
  const defaultMessage = encodeURIComponent(
    "Hello Sweet Reverie, I would like to inquire about your imported chocolates and treats!"
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${defaultMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20BA5A] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border-2 border-white"
      aria-label="Chat on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-current stroke-none" />
    </a>
  );
}
