import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:justify-between sm:px-6">
        <div>
          <p className="text-xl font-extrabold tracking-tight text-primary">
            Candyshop
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Snacks, sweets &amp; drinks delivered.
          </p>
        </div>

        <div className="flex gap-16">
          <div className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-foreground">Contact</span>
            <a
              href="mailto:candyshopnetwork24@gmail.com"
              className="text-muted-foreground hover:text-foreground"
            >
              candyshopnetwork24@gmail.com
            </a>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-foreground">Follow us</span>
            <div className="flex gap-4 text-sm">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Facebook
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
        &copy; {new Date().getFullYear()} Candyshop. All rights reserved.
      </div>
    </footer>
  );
}
