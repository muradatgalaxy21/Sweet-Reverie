"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

/**
 * NewsletterBar matching the email subscription strip from the mockup.
 * 1. Warm amber background (#F59E0B) with high-contrast black typography.
 * 2. Capsule input field with integrated submit arrow button.
 * 3. Handles form state with instant feedback confirmation.
 */
export function NewsletterBar() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 4000);
    }
  };

  return (
    <section className="bg-[#F59E0B] border-t-2 border-b-2 border-amber-600/30 py-8 px-4 sm:px-6 lg:px-8 my-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Text */}
        <div className="text-center md:text-left space-y-1">
          <h3 className="text-xl md:text-2xl font-black tracking-wider uppercase text-black">
            JOIN OUR EMAIL LIST
          </h3>
          <p className="text-xs md:text-sm font-semibold text-black/80">
            Sign up for special offers, news & promotions.
          </p>
        </div>

        {/* Right Side: Capsule Input Form */}
        <form onSubmit={handleSubmit} className="w-full md:w-auto min-w-[320px] max-w-md">
          <div className="relative flex items-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full pl-5 pr-14 py-3 bg-amber-400/50 placeholder:text-black/60 text-black font-medium text-sm rounded-full border-2 border-black focus:outline-none focus:bg-white transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1.5 w-10 h-10 bg-black hover:bg-[#662A37] text-white rounded-full flex items-center justify-center transition-transform hover:scale-105"
              aria-label="Subscribe to newsletter"
            >
              {isSubmitted ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              )}
            </button>
          </div>
          {isSubmitted && (
            <p className="text-xs font-bold text-black mt-2 text-center md:text-left">
              Thank you for subscribing to Sweet Reverie!
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
