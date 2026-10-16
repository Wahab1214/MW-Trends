"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-[#070605] flex flex-col items-center justify-center p-6 select-none">
      {/* Subtle Gold Shimmer Progress Line at top */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#1A1816] overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent animate-[shimmer_1.5s_infinite] -translate-x-full" />
      </div>

      {/* MW Monogram Emblem with Gentle Luxury Pulse */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border border-[#D4AF37]/40 bg-[#12100E] flex items-center justify-center text-[#D4AF37] font-serif font-bold text-xl shadow-[0_0_25px_rgba(212,175,55,0.15)] animate-pulse">
          MW
        </div>
      </div>

      {/* Branded Loading Caption */}
      <span className="text-[10px] font-bold tracking-[0.35em] text-[#D4AF37] uppercase animate-pulse mb-2">
        MW TRENDS ATELIER
      </span>
      <p className="text-[11px] text-[#A3998C] tracking-[0.2em] uppercase font-mono">
        PREPARING EXPERIENCE...
      </p>

      {/* Restrained Gold Separator */}
      <div className="w-12 h-[1px] bg-[#D4AF37]/30 mt-4" />
    </div>
  );
}
