import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartProvider } from "@/components/cart-provider";
import { CartDrawer } from "@/components/cart-drawer";
import { fetchCart } from "@/lib/cart-actions";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MAW-Choco-Shop",
    template: "%s | MAW-Choco-Shop",
  },
  description: "Chocolates, candy, snacks & drinks delivered.",
  openGraph: {
    siteName: "MAW-Choco-Shop",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const initialCart = await fetchCart();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <CartProvider initialCart={initialCart}>
          <SiteHeader />
          {children}
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
