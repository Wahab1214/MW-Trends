"use client";

import { useEffect, useState } from "react";
import { accountRepository, SavedDesign } from "@/lib/services/accountRepository";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function MyDesignsPage() {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadDesigns = () => {
    accountRepository.getDesigns().then(res => {
      setDesigns(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadDesigns();
  }, []);

  const handleDuplicate = async (id: string) => {
    await accountRepository.duplicateDesign(id);
    loadDesigns(); // Refresh
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this design? Historical orders won't be affected.")) {
      await accountRepository.deleteDesign(id);
      loadDesigns();
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-widest mb-2 border-b border-[#e5e0d8] pb-4">MY DESIGNS</h1>
        <p className="text-xs tracking-widest text-[#666]">YOUR IDEAS, SAVED IN MW.</p>
      </div>

      {designs.length === 0 ? (
        <div className="bg-[#111] border border-[#222] p-12 text-center shadow-sm">
          <p className="text-sm tracking-widest text-[#888] mb-6">YOUR FIRST IDEA IS WAITING.</p>
          <Link href="/products/midnight-oversized-tee" className="px-8 py-4 bg-[#F7F4ED] text-[#050505] text-xs font-bold tracking-[0.2em] hover:bg-[#D4AF37] transition-colors">
            OPEN CUSTOM LAB
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {designs.map((design) => (
            <motion.div 
              key={design.id}
              className="bg-white border border-[#e5e0d8] flex flex-col group shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ y: -4 }}
            >
              {/* Preview Area (Flattened for perf) */}
              <div className="w-full h-64 bg-[#111] relative border-b border-[#e5e0d8] flex items-center justify-center overflow-hidden">
                 <div className="absolute top-4 right-4 z-10">
                   <span className={`px-2 py-1 text-[8px] font-bold tracking-widest border
                     ${design.status === 'ORDERED' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]' : 'bg-[#222] text-[#888] border-[#333]'}
                   `}>
                     {design.status}
                   </span>
                 </div>
                 
                 {/* Visual Mock of Canvas */}
                 {design.designConfig.map((el, i) => (
                   <span key={i} className="text-white text-3xl font-bold tracking-widest opacity-80" style={{ fontFamily: el.font || 'inherit' }}>
                     {el.content || 'DESIGN'}
                   </span>
                 ))}
                 
                 {/* Edit Overlay */}
                 <div className="absolute inset-0 bg-[#0a0a0b]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => router.push(`/customize/${design.productId}?designId=${design.id}`)}
                      className="px-6 py-3 bg-[#F7F4ED] text-[#050505] text-[10px] font-bold tracking-[0.2em] hover:bg-[#D4AF37]"
                    >
                      EDIT IN LAB
                    </button>
                 </div>
              </div>

              {/* Meta */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-sm font-bold truncate">{design.name}</h3>
                <p className="text-[10px] text-[#666] tracking-widest mt-1 mb-4 truncate">{design.productName}</p>
                <div className="mt-auto pt-4 border-t border-[#e5e0d8] flex gap-4">
                  <button onClick={() => router.push(`/customize/${design.productId}?designId=${design.id}`)} className="text-[9px] font-bold tracking-widest text-[#050505] hover:text-[#D4AF37] underline underline-offset-4">USE AGAIN</button>
                  <button onClick={() => handleDuplicate(design.id)} className="text-[9px] font-bold tracking-widest text-[#666] hover:text-[#050505]">DUPLICATE</button>
                  <button onClick={() => handleDelete(design.id)} className="text-[9px] font-bold tracking-widest text-red-500 hover:text-red-700 ml-auto">DELETE</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
