"use client";

import Link from "next/link";
import { Compass, Layers, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070605] text-[#F7F4ED] flex flex-col items-center justify-center p-6 text-center select-none relative z-50">
      {/* Background Subtle Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* MW Monogram Crest */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border border-[#D4AF37]/50 bg-[#12100E] flex items-center justify-center text-[#D4AF37] font-serif font-bold text-xl shadow-[0_0_30px_rgba(212,175,55,0.18)]">
          MW
        </div>
        <div className="absolute -bottom-1 -right-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#D4AF37] text-black font-bold">
          404
        </div>
      </div>

      {/* Heading */}
      <span className="text-[10px] font-bold tracking-[0.35em] text-[#D4AF37] uppercase mb-2">
        MW TRENDS ARCHIVES
      </span>
      <h1 className="text-3xl md:text-4xl font-serif tracking-[0.18em] text-[#F7F4ED] max-w-lg leading-tight mb-4">
        ATELIER NOT FOUND
      </h1>
      <p className="text-xs md:text-sm text-[#A3998C] max-w-md leading-relaxed mb-8">
        The boutique salon or bespoke creation you are searching for does not exist in the directory, or has been retired to the private vault.
      </p>

      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pointer-events-auto">
        <Link
          href="/?floor=1"
          className="w-full sm:w-auto flex-1 py-3 px-6 rounded-full bg-[#D4AF37] text-black hover:bg-[#E5C358] font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2"
        >
          <Compass size={14} />
          <span>ENTER MW WORLD</span>
        </Link>
        <Link
          href="/shop"
          className="w-full sm:w-auto flex-1 py-3 px-6 rounded-full bg-[#161412] border border-[#333] hover:border-[#D4AF37] text-[#D3C7B8] hover:text-[#F7F4ED] font-bold text-xs tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2"
        >
          <Layers size={14} className="text-[#D4AF37]" />
          <span>EXPLORE SHOPS</span>
        </Link>
      </div>

      {/* Footnote */}
      <div className="mt-12 text-[9px] tracking-[0.3em] text-[#666] uppercase">
        GRAND CONCOURSE • FLOOR 01 DIRECTORY
      </div>
    </div>
  );
}
