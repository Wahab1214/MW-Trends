"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, ShoppingBag, X } from "lucide-react";

interface WorldNavProps {
  onNavigate: (target: string) => void;
  onToggleQuickShop: () => void;
}

export default function WorldNav({ onNavigate, onToggleQuickShop }: WorldNavProps) {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <>
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start pointer-events-none z-50">
        <div className="text-2xl font-bold tracking-[0.25em] text-[#D4AF37] pointer-events-auto">
          MW TRENDS
        </div>
        <div className="flex gap-6 pointer-events-auto">
          <button 
            onClick={onToggleQuickShop}
            className="group px-5 py-2.5 flex flex-col items-end border border-[#D4AF37]/20 bg-[#050505]/60 backdrop-blur-md hover:border-[#D4AF37] hover:bg-[#111111]/80 transition-all duration-300"
          >
            <span className="text-sm font-medium tracking-widest text-[#F7F4ED]">QUICK SHOP</span>
            <span className="text-[10px] tracking-wider text-[#9B9B9B] group-hover:text-[#D4AF37] transition-colors">SKIP THE WORLD</span>
          </button>
          <button className="p-3 border border-[#D4AF37]/20 bg-[#050505]/60 backdrop-blur-md hover:border-[#D4AF37] transition-all duration-300 flex items-center justify-center">
            <ShoppingBag size={20} className="text-[#F7F4ED]" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto z-50">
        <button 
          onClick={() => setMapOpen(true)}
          className="group flex items-center gap-3 px-8 py-4 text-xs font-medium tracking-[0.2em] border border-[#D4AF37]/30 bg-[#050505]/80 backdrop-blur-md hover:bg-[#111111] hover:border-[#D4AF37] transition-all duration-500"
        >
          <Map size={16} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
          DISTRICT MAP
        </button>
      </div>

      <AnimatePresence>
        {mapOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#050505]/90 backdrop-blur-xl pointer-events-auto"
          >
            <div className="relative p-16 bg-[#0a0a0a] border border-[#D4AF37]/20 shadow-2xl max-w-4xl w-full">
              <button 
                onClick={() => setMapOpen(false)}
                className="absolute top-8 right-8 text-[#9B9B9B] hover:text-[#D4AF37] transition-colors"
              >
                <X size={28} />
              </button>
              
              <h2 className="text-sm tracking-[0.4em] text-[#D4AF37] mb-16 text-center">MW DISTRICT ARCHITECTURE</h2>
              
              <div className="relative grid grid-cols-3 gap-8 text-center max-w-2xl mx-auto">
                {/* Connecting lines SVG background */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
                  <line x1="16%" y1="50%" x2="50%" y2="50%" stroke="#D4AF37" strokeWidth="1" />
                  <line x1="84%" y1="50%" x2="50%" y2="50%" stroke="#D4AF37" strokeWidth="1" />
                  <line x1="50%" y1="16%" x2="50%" y2="50%" stroke="#D4AF37" strokeWidth="1" />
                  <line x1="50%" y1="84%" x2="50%" y2="50%" stroke="#D4AF37" strokeWidth="1" />
                </svg>

                <MapNode name="PAPER ATELIER" status="inactive" />
                <MapNode name="TEE STUDIO" onClick={() => { onNavigate("tee-studio"); setMapOpen(false); }} />
                <MapNode name="FRAME GALLERY" status="inactive" />
                
                <MapNode name="CUSTOM LAB" onClick={() => { onNavigate("custom-lab"); setMapOpen(false); }} />
                <MapNode name="MW PLAZA" onClick={() => { onNavigate("plaza"); setMapOpen(false); }} isCenter />
                <MapNode name="MUG BAR" onClick={() => { onNavigate("mug-bar"); setMapOpen(false); }} />

                <MapNode name="GIFT HOUSE" status="inactive" />
                <MapNode name="STREETWEAR GARAGE" status="inactive" />
                <MapNode name="CASE LAB" status="inactive" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MapNode({ name, onClick, isCenter, status = "active" }: { name: string, onClick?: () => void, isCenter?: boolean, status?: "active" | "inactive" }) {
  const isActive = status === "active";
  
  return (
    <button 
      onClick={isActive ? onClick : undefined}
      disabled={!isActive}
      className={`relative p-6 border ${isActive ? 'border-[#D4AF37]/30 hover:border-[#D4AF37] cursor-pointer' : 'border-white/5 cursor-not-allowed'} transition-all flex flex-col items-center justify-center gap-4 ${isCenter ? 'bg-[#1B1B1B]' : 'bg-[#050505]'} z-10`}
    >
      <div className={`w-4 h-4 rotate-45 ${isCenter ? 'bg-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.5)]' : isActive ? 'bg-[#D4AF37]/50' : 'bg-white/10'}`} />
      <span className={`text-xs tracking-[0.2em] ${isActive ? 'text-[#F7F4ED]' : 'text-[#9B9B9B]/50'}`}>{name}</span>
      {!isActive && <span className="absolute bottom-2 text-[8px] tracking-widest text-[#D4AF37]/50">COMING SOON</span>}
    </button>
  );
}
