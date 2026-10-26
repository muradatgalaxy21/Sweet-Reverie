"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, MapPin, Phone, Mail } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "./brand-icons";

// TODO: confirm real profile URLs.
const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/sweetreverie", icon: InstagramIcon },
  { label: "Facebook", href: "https://www.facebook.com/sweetreverie", icon: FacebookIcon },
];

function PaymentBadge({ label, bg = "#FFFFFF", children }: { label: string; bg?: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 60 24" className="h-7 w-auto rounded shadow" role="img" aria-label={label}>
      <rect width="60" height="24" rx="4" fill={bg} />
      {children}
    </svg>
  );
}

/**
 * SiteFooter component matching the 4-column dark footer from the mockup.
 * 1. Column 1: Brand title, confectionery mission, and payment method badges.
 * 2. Column 2: MENU quick navigation links.
 * 3. Column 3: POLICIES compliance and customer rights links.
 * 4. Column 4: FIND US contact, store location, and phone details.
 * 5. Bottom sub-footer with copyright and smooth scroll-to-top trigger.
 */
export function SiteFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="footer" data-focus="light" className="bg-[#4A1A25] text-[#FAF7F2] pt-14 pb-8 border-t-4 border-[#662A37]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Column 1: Brand Info & Payment Badges */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-serif text-[#D4AF7A] font-black tracking-wider uppercase">
              SWEET REVERIE
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Curators of premium imported confectionery, gourmet chocolates, artisan treats, and rare flavors from across the globe. Bringing pure indulgence to every doorstep.
            </p>

            {/* Payment Method Badges */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-stone-400 block mb-2 uppercase tracking-wider">
                Accepted Payment Methods
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <PaymentBadge label="Visa">
                  <text x="30" y="17" textAnchor="middle" fontSize="13" fontWeight="900" fontStyle="italic" fill="#1A1F71" fontFamily="Arial, sans-serif">VISA</text>
                </PaymentBadge>
                <PaymentBadge label="Mastercard">
                  <circle cx="25" cy="12" r="7" fill="#EB001B" />
                  <circle cx="35" cy="12" r="7" fill="#F79E1B" fillOpacity="0.9" />
                </PaymentBadge>
                <PaymentBadge label="JazzCash">
                  <text x="30" y="16" textAnchor="middle" fontSize="10" fontWeight="900" fill="#C8102E" fontFamily="Arial, sans-serif">Jazz<tspan fill="#F2A900">Cash</tspan></text>
                </PaymentBadge>
                <PaymentBadge label="Easypaisa">
                  <text x="30" y="16" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#1BA548" fontFamily="Arial, sans-serif">easypaisa</text>
                </PaymentBadge>
                <PaymentBadge label="Cash on Delivery" bg="#FBBF24">
                  <text x="30" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill="#000" fontFamily="Arial, sans-serif">COD</text>
                </PaymentBadge>
              </div>
            </div>
          </div>

          {/* Column 2: Menu */}
          <div className="space-y-3">
            <h4 className="text-sm font-black tracking-widest text-[#D4AF7A] uppercase">
              MENU
            </h4>
            <ul className="space-y-2 text-xs font-medium text-stone-300">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#new-arrivals" className="hover:text-amber-400 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-amber-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/#special-offers" className="hover:text-amber-400 transition-colors">
                  Special Offers
                </Link>
              </li>
              <li>
                <Link href="/#best-sellers" className="hover:text-amber-400 transition-colors">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-black tracking-widest text-[#D4AF7A] uppercase">
              POLICIES
            </h4>
            <ul className="space-y-2 text-xs font-medium text-stone-300">
              <li>
                <Link href="/policies/privacy-policy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping-policy" className="hover:text-amber-400 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/refund-policy" className="hover:text-amber-400 transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms-of-service" className="hover:text-amber-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Find Us */}
          <div className="space-y-3">
            <h4 className="text-sm font-black tracking-widest text-[#D4AF7A] uppercase">
              FIND US
            </h4>
            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Sector C, Phase 5, D.H.A, Lahore, Pakistan</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>+92 300 1515676</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>support@sweetreverie.com</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF7A]/50 text-[#D4AF7A] hover:bg-[#D4AF7A] hover:text-[#4A1A25] transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Sub-footer Copyright and Scroll To Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400">
          <p>© 2026 Sweet Reverie — Fine Confections. All rights reserved.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="mt-4 sm:mt-0 flex items-center space-x-1.5 text-stone-300 hover:text-amber-400 transition-colors p-2 rounded-lg bg-stone-900/60"
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
