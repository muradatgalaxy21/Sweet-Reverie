"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, MapPin, Phone, Mail } from "lucide-react";

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
    <footer id="footer" className="bg-[#4A1A25] text-[#FAF7F2] pt-14 pb-8 border-t-4 border-[#662A37]">
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
              <div className="flex items-center space-x-2">
                <span className="bg-white text-black font-extrabold text-[10px] px-2 py-1 rounded shadow">
                  VISA
                </span>
                <span className="bg-white text-black font-extrabold text-[10px] px-2 py-1 rounded shadow">
                  MC
                </span>
                <span className="bg-white text-black font-extrabold text-[10px] px-2 py-1 rounded shadow">
                  PAYPAL
                </span>
                <span className="bg-amber-400 text-black font-extrabold text-[10px] px-2 py-1 rounded shadow">
                  COD
                </span>
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
                <Link href="#new-arrivals" className="hover:text-amber-400 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="#categories" className="hover:text-amber-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="#special-offers" className="hover:text-amber-400 transition-colors">
                  Special Offers
                </Link>
              </li>
              <li>
                <Link href="#best-sellers" className="hover:text-amber-400 transition-colors">
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
                <Link href="/privacy-policy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-amber-400 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-amber-400 transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-amber-400 transition-colors">
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
