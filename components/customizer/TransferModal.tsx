"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

const TRANSFER_TARGETS = [
  { slug: "signature-mug", name: "SIGNATURE MUG", type: "objects", img: "/placeholder-mug-1.jpg" },
  { slug: "monogram-phone-case", name: "MATTE CASE", type: "cases", img: "/placeholder-case-1.jpg" },
  { slug: "memory-frame-01", name: "METAL FRAME", type: "frames", img: "/placeholder-frame-1.jpg" }
];

export default function TransferModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const handleTransfer = (slug: string) => {
    // Because useCustomizerStore is global, design elements will persist on next route load
    router.push(`/customize/${slug}`);
    onClose();
  };

  return (
    <motion.div 
      className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div 
        className="relative w-full max-w-4xl bg-[#0a0a0b] border border-[#222] shadow-2xl p-12"
        initial={{ y: 20, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.95, opacity: 0 }}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-[#888] hover:text-white">✕</button>

        <div className="text-center mb-12">
          <h3 className="text-[10px] tracking-[0.3em] text-[#D4AF37] mb-4">LOVE THIS DESIGN?</h3>
          <h2 className="text-3xl font-bold tracking-widest text-[#F7F4ED]">TRY IT ON ANOTHER CANVAS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRANSFER_TARGETS.map(target => (
            <div key={target.slug} onClick={() => handleTransfer(target.slug)} className="group cursor-pointer">
              <div className="aspect-[4/5] bg-[#111] border border-[#222] mb-4 relative overflow-hidden flex items-center justify-center p-8">
                <span className="text-[10px] tracking-widest text-[#666] absolute bottom-4 uppercase">{target.type}</span>
                <div className="w-full h-full border border-white/5 group-hover:border-[#D4AF37]/50 transition-colors bg-cover bg-center bg-[#222]" />
                {/* Simulated product visual transition area */}
              </div>
              <h4 className="text-xs font-bold tracking-widest mb-1 text-[#F7F4ED] group-hover:text-[#D4AF37] transition-colors">{target.name}</h4>
              <p className="text-[10px] tracking-widest text-[#888]">Transfer Artwork →</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
