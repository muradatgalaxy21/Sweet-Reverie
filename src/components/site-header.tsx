"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { SearchModal } from "./search-modal";
import { CATEGORIES } from "@/lib/categories";

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

// Shopify-hosted customer account (plan.md §8); the store redirects to its account login/order pages.
const ACCOUNT_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/account`;

const MAIN_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/#best-sellers", label: "BEST SELLERS" },
  { href: "/#special-offers", label: "SPECIAL OFFERS" },
  { href: "/#footer", label: "CONTACT" },
];

const COLLECTION_LINKS = [
  { href: "/collections/best-sellers", label: "BEST SELLERS" },
  { href: "/collections/new-arrivals", label: "NEW ARRIVALS" },
];

const CATEGORY_GROUPS = [
  { title: "Sweets", handles: ["candies-jellies", "chewing-gums", "chocolate-bars", "chocolate-boxes", "chocolate-pouches", "cookies-biscuits"] },
  { title: "Snacks & Drinks", handles: ["chips-snacks", "noodles", "beverages", "coffee-tea"] },
  { title: "Gifts", handles: ["gifting", "bundles", "kids-section"] },
  { title: "Essentials", handles: ["baby-care", "grocery", "health-beauty", "pet-care-food"] },
].map((g) => ({ ...g, items: CATEGORIES.filter((c) => g.handles.includes(c.handle)) }));

const DRAWER_LINK = "block px-3 py-2 text-sm font-bold text-[#662A37] hover:bg-amber-100 rounded-md";
const DRAWER_HEADING = "px-3 pt-4 pb-1 text-[11px] font-black tracking-[0.2em] uppercase text-[#B08A3E]";

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
 * 4. Hamburger (all viewports) opens a left drawer: main links, collections, grouped categories, account.
 */
export function SiteHeader() {
  const { cart, openCart } = useCart();
  const totalQuantity = cart?.totalQuantity ?? 0;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [logoMax, setLogoMax] = useState(LOGO_MAX_DESKTOP);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
      <header className="sticky top-0 z-40 bg-[#FAF7F2] shadow-md border-b-2 border-[#D4AF7A]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 relative">
            <div className="flex items-center gap-4 md:gap-6">
              {/* Menu trigger (all viewports) */}
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="p-2 text-[#662A37] hover:text-[#F59E0B]"
                aria-label="Open Navigation Menu"
                aria-expanded={menuOpen}
                aria-controls="site-menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Desktop Navigation Links */}
              <nav aria-label="Main" className="hidden md:flex items-center space-x-8 text-xs font-black tracking-widest text-[#662A37] uppercase">
                {MAIN_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="hover:text-[#F59E0B] transition-colors py-1 border-b-2 border-transparent hover:border-[#F59E0B]"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>

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
                    sizes="(min-width: 768px) 130px, 72px"
                    className="w-[95%] max-w-none h-auto"
                    preload
                  />
                </div>
              </Link>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-4 md:space-x-6 text-[#662A37]">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:text-[#F59E0B] hover:scale-110 transition-transform"
                aria-label="Open Search"
              >
                <SearchIcon className="h-5 w-5 md:h-6 md:w-6" />
              </button>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                className="p-2 relative hover:text-[#F59E0B] hover:scale-110 transition-transform"
                aria-label={totalQuantity > 0 ? `Shopping cart, ${totalQuantity} items` : "Shopping cart"}
              >
                <CartIcon className="h-5 w-5 md:h-6 md:w-6" />
                {totalQuantity > 0 && (
                  <span aria-hidden className="absolute -top-1 -right-1 bg-[#F59E0B] text-[#4A1A25] text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-[#FAF7F2] shadow-md motion-safe:animate-pulse">
                    {totalQuantity}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

      </header>

      {/* Navigation Drawer */}
      <div className={`fixed inset-0 z-[60] ${menuOpen ? "" : "pointer-events-none invisible delay-300"} transition-[visibility]`} aria-hidden={!menuOpen}>
          <div
            aria-hidden
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
            onClick={closeMenu}
          />
          <nav
            id="site-menu"
            aria-label="Site menu"
            className={`absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-[#FAF7F2] border-r-2 border-[#D4AF7A]/60 px-4 pb-8 shadow-2xl transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="sticky top-0 flex items-center justify-between bg-[#FAF7F2] py-4">
              <span className="px-3 text-xs font-black tracking-widest text-[#662A37]">MENU</span>
              <button type="button" onClick={closeMenu} className="p-2 text-[#662A37] hover:text-[#F59E0B]" aria-label="Close Navigation Menu">
                <X className="h-6 w-6" />
              </button>
            </div>

            {MAIN_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={closeMenu} className={DRAWER_LINK}>
                {l.label}
              </Link>
            ))}

            <p className={DRAWER_HEADING}>Collections</p>
            {COLLECTION_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={closeMenu} className={DRAWER_LINK}>
                {l.label}
              </Link>
            ))}

            {CATEGORY_GROUPS.map((g) => (
              <div key={g.title}>
                <p className={DRAWER_HEADING}>{g.title}</p>
                {g.items.map((c) => (
                  <Link key={c.handle} href={`/collections/${c.handle}`} onClick={closeMenu} className={DRAWER_LINK}>
                    {c.title}
                  </Link>
                ))}
              </div>
            ))}

            <div className="mt-4 border-t border-[#D4AF7A]/60 pt-4">
              <a href={ACCOUNT_URL} className={`${DRAWER_LINK} flex items-center gap-2`}>
                <ProfileIcon className="h-5 w-5" />
                MY ACCOUNT
              </a>
            </div>
          </nav>
        </div>

      {/* Instant Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
