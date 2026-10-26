import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="max-w-xl mx-auto px-4 py-20 text-center">
      <Image
        src="/logo/sweet-reverie-no-bg.png"
        alt="Sweet Reverie Fine Confections"
        width={2073}
        height={1800}
        sizes="160px"
        className="w-40 h-auto mx-auto mb-6"
      />
      <p className="text-sm font-black tracking-widest text-amber-600">404</p>
      <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-[#662A37]">
        Oops! This treat doesn&apos;t exist…
      </h1>
      <p className="mt-3 text-stone-600">
        Someone may have eaten it already. Plenty more sweets are waiting for you.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center bg-[#4A1A25] hover:bg-[#662A37] text-white text-xs font-extrabold tracking-widest uppercase px-8 py-3 rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
      >
        Continue shopping
      </Link>
    </section>
  );
}
