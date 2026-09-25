"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { SearchModal } from "./search-modal";

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.4 15.4 20.5 20.5" />
    </svg>
  );
}

function ProfileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8.3" r="3.8" />
      <path d="M4.8 20.2c.9-3.7 3.8-5.8 7.2-5.8s6.3 2.1 7.2 5.8" />
    </svg>
  );
}

function CartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2.5 4h2.3l2.4 10.3a1.6 1.6 0 0 0 1.6 1.2h8.4a1.6 1.6 0 0 0 1.5-1.1L20.8 8H5.7" />
      <circle cx="9.5" cy="19.5" r="1.4" />
      <circle cx="16.8" cy="19.5" r="1.4" />
    </svg>
  );
}

const LOGO_MAX_DESKTOP = 130;
const LOGO_MAX_MOBILE = 71;
const LOGO_MIN = 56;
const HEADER_HEIGHT = 80;
const MOBILE_BREAKPOINT = 768;

/**
 * SiteHeader matching the design mockup layout.
 * 1. Left: Navigation links (HOME, BEST SELLERS, SPECIAL OFFERS, CONTACT).
 * 2. Center: Prominent circular brand logo badge that shrinks into the navbar
 *    as the hero section scrolls out of view, fully docked once the hero is cleared.
 * 3. Right: Search modal trigger, customer account icon, and cart drawer toggle.
 * 4. Responsive mobile menu drawer for smaller viewports.
 */
export function SiteHeader() {
  const { totalQuantity, openCart } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [logoMax, setLogoMax] = useState(LOGO_MAX_DESKTOP);

  useEffect(() => {
    let rafId: number | null = null;

    const measure = () => {
      rafId = null;
      const hero = document.getElementById("hero");
      const range = hero ? hero.offsetHeight : 150;
      const progress = Math.min(Math.max(window.scrollY / range, 0), 1);
      setScrollProgress(progress);
      setLogoMax(window.innerWidth < MOBILE_BREAKPOINT ? LOGO_MAX_MOBILE : LOGO_MAX_DESKTOP);
    };

    const handleScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Ease-out curve for a smoother, less linear shrink feel.
  const eased = 1 - Math.pow(1 - scrollProgress, 2);
  const logoSize = logoMax - (logoMax - LOGO_MIN) * eased;
  const logoTop = 4 + ((HEADER_HEIGHT - LOGO_MIN) / 2 - 4) * eased;

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

            {/* Center Brand Logo with Circular Badge — shrinks into navbar on scroll */}
            <div
              className="absolute left-1/2 -translate-x-1/2 z-50 will-change-[top]"
              style={{ top: `${logoTop}px` }}
            >
              <Link href="/" className="block group">
                <div
                  className="rounded-full bg-[#FAF7F2] border-2 border-[#662A37] shadow-xl flex items-center justify-center group-hover:scale-105 will-change-[width,height]"
                  style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
                >
                  <Image
                    src="/logo/sweet-reverie-no-bg.png"
                    alt="Sweet Reverie Fine Confections"
                    width={2073}
                    height={1800}
                    sizes="130px"
                    className="w-[95%] max-w-none h-auto"
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
                <SearchIcon className="h-5 w-5 md:h-6 md:w-6" />
              </button>

              {/* Account Link */}
              <Link
                href="/account"
                className="hidden sm:inline-block p-2 hover:text-[#662A37] hover:scale-110 transition-transform"
                aria-label="User Account"
              >
                <ProfileIcon className="h-5 w-5 md:h-6 md:w-6" />
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                className="p-2 relative hover:text-[#662A37] hover:scale-110 transition-transform"
                aria-label="Shopping Cart"
              >
                <CartIcon className="h-5 w-5 md:h-6 md:w-6" />
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
