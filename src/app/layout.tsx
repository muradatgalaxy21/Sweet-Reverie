import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { AnnouncementBar } from "@/components/announcement-bar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sweet Reverie — Fine Confections | Luxury Imported Chocolates & Treats",
  description:
    "Discover Pakistan's premier destination for original imported chocolates, luxury confectionery, artisanal sweets, and gourmet snacks. Est. 2024.",
  keywords: [
    "Sweet Reverie",
    "Imported Chocolates",
    "Luxury Confectionery",
    "Takis Pakistan",
    "Ferrero Rocher",
    "Artisan Sweets",
    "Gourmet Hampers",
  ],
  openGraph: {
    title: "Sweet Reverie — Fine Confections",
    description: "Premium imported confectionery, chocolates, and artisan treats.",
    type: "website",
    locale: "en_PK",
    siteName: "Sweet Reverie",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body suppressHydrationWarning className="antialiased min-h-screen flex flex-col justify-between selection:bg-[#ECA58A] selection:text-[#662A37]">
        <CartProvider>
          {/* Top Marquee Announcement */}
          <AnnouncementBar />

          {/* Sticky Header with Navigation and Logo */}
          <SiteHeader />

          {/* Main Content Area */}
          <main id="main-content" className="flex-1">
            {children}
          </main>

          {/* 4-Column Luxury Dark Footer */}
          <SiteFooter />

          {/* Slide-over Cart Drawer */}
          <CartDrawer />

          {/* Floating WhatsApp Action Button */}
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
