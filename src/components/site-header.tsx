"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { SearchModal } from "./search-modal";

/**
 * SiteHeader matching the design mockup layout.
 * 1. Left: Navigation links (HOME, BEST SELLERS, SPECIAL OFFERS, CONTACT).
 * 2. Center: Prominent circular brand logo badge.
 * 3. Right: Search modal trigger, customer account icon, and cart drawer toggle.
 * 4. Responsive mobile menu drawer for smaller viewports.
 */
export function SiteHeader() {
  const { totalQuantity, openCart } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F59E0B] shadow-md border-b-2 border-amber-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 relative">
            {/* Mobile menu trigger */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-black hover:text-[#662A37] focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Left Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8 text-xs font-black tracking-widest text-black uppercase">
              <Link
                href="/"
                className="hover:text-[#662A37] transition-colors py-1 border-b-2 border-transparent hover:border-black"
              >
                HOME
              </Link>
              <Link
                href="#best-sellers"
                className="hover:text-[#662A37] transition-colors py-1 border-b-2 border-transparent hover:border-black"
              >
                BEST SELLERS
              </Link>
              <Link
                href="#special-offers"
                className="hover:text-[#662A37] transition-colors py-1 border-b-2 border-transparent hover:border-black"
              >
                SPECIAL OFFERS
              </Link>
              <Link
                href="#footer"
                className="hover:text-[#662A37] transition-colors py-1 border-b-2 border-transparent hover:border-black"
              >
                CONTACT
              </Link>
            </nav>

            {/* Center Brand Logo with Circular Badge */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1 z-50">
              <Link href="/" className="block group">
                <div className="w-28 md:w-32 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/logo/sweet-reverie-no-bg.png"
                    alt="Sweet Reverie Fine Confections"
                    width={2073}
                    height={1800}
                    sizes="128px"
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-4 md:space-x-6 text-black">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:text-[#662A37] hover:scale-110 transition-transform"
                aria-label="Open Search"
              >
                <Search className="h-5 w-5 md:h-6 md:w-6 stroke-[2.5]" />
              </button>

              {/* Account Link */}
              <Link
                href="/account"
                className="hidden sm:inline-block p-2 hover:text-[#662A37] hover:scale-110 transition-transform"
                aria-label="User Account"
              >
                <User className="h-5 w-5 md:h-6 md:w-6 stroke-[2.5]" />
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                className="p-2 relative hover:text-[#662A37] hover:scale-110 transition-transform"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 stroke-[2.5]" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#662A37] text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                    {totalQuantity}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF7F2] border-t border-amber-300 px-4 pt-4 pb-6 space-y-3 shadow-2xl">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-bold text-[#662A37] hover:bg-amber-100 rounded-md"
            >
              HOME
            </Link>
            <Link
              href="#best-sellers"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-bold text-[#662A37] hover:bg-amber-100 rounded-md"
            >
              BEST SELLERS
            </Link>
            <Link
              href="#special-offers"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-bold text-[#662A37] hover:bg-amber-100 rounded-md"
            >
              SPECIAL OFFERS
            </Link>
            <Link
              href="#footer"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-bold text-[#662A37] hover:bg-amber-100 rounded-md"
            >
              CONTACT
            </Link>
          </div>
        )}
      </header>

      {/* Instant Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
