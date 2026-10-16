"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

interface LandingExperienceProps {
  onEnter: () => void;
}

export default function LandingExperience({ onEnter }: LandingExperienceProps) {
  const [isEntering, setIsEntering] = useState(false);
  const [hovering, setHovering] = useState(false);
  
  // Parallax Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 60, mass: 2 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax layers (Foreground moves more, background moves less)
  const distWorldX = useTransform(smoothX, [-0.5, 0.5], ['-0.5%', '0.5%']);
  const distWorldY = useTransform(smoothY, [-0.5, 0.5], ['-0.5%', '0.5%']);
  
  const gateX = useTransform(smoothX, [-0.5, 0.5], ['-1.5%', '1.5%']);
  const gateY = useTransform(smoothY, [-0.5, 0.5], ['-1.5%', '1.5%']);

  const crestX = useTransform(smoothX, [-0.5, 0.5], ['-2%', '2%']);
  const crestY = useTransform(smoothY, [-0.5, 0.5], ['-2%', '2%']);

  const wallsX = useTransform(smoothX, [-0.5, 0.5], ['-3%', '3%']);
  const wallsY = useTransform(smoothY, [-0.5, 0.5], ['-3%', '3%']);

  const pathX = useTransform(smoothX, [-0.5, 0.5], ['-4%', '4%']);
  const pathY = useTransform(smoothY, [-0.5, 0.5], ['-4%', '4%']);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth > 768) {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        mouseX.set(x);
        mouseY.set(y);
      }
    };
    if (!isEntering) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isEntering, mouseX, mouseY]);

  const handleEnterClick = () => {
    setIsEntering(true);
    // Wait for the gate opening animation to finish before navigating
    setTimeout(() => onEnter(), 1800); 
  };

  return (
    <motion.div 
      className="absolute inset-0 z-[100] pointer-events-auto bg-[#050505] overflow-hidden perspective-[1200px] flex items-center justify-center"
      animate={isEntering ? { scale: 2, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1], opacity: { delay: 1.2, duration: 0.6 } }}
    >
      
      {/* ================================================== */}
      {/* 1. BEHIND THE GATE (The MW World Bazaar) */}
      {/* ================================================== */}
      <motion.div 
        style={{ x: distWorldX, y: distWorldY }}
        className="absolute inset-[-10%] flex items-center justify-center pointer-events-none z-0"
      >
        <div className="absolute inset-0 bg-[#070707]" />
        
        {/* Distant Shops & Lights */}
        <div className="absolute inset-x-[20%] top-[20%] bottom-[20%] flex items-center justify-center opacity-60">
          
          {/* Shop 1 Silhouette */}
          <div className="absolute left-[10%] w-[15vw] h-[40vh] bg-[#111] border-r border-[#D4AF37]/20 shadow-[0_0_40px_rgba(212,175,55,0.1)] flex flex-col justify-end pb-10 items-center">
             <div className="w-[80%] h-1 bg-[#D4AF37] blur-[2px] opacity-50 mb-2" />
             <div className="text-[#FCE192] text-[6px] tracking-widest opacity-80 blur-[0.5px]">TEE STUDIO</div>
          </div>
          
          {/* Distant Street/Corridor depth */}
          <div className="absolute w-[20vw] h-[50vh] bg-gradient-to-t from-[#111] to-transparent flex flex-col items-center justify-end">
             <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-10 h-10 bg-[#E6C96A] rounded-full blur-[30px]" 
             />
             <div className="w-full h-[20vh] bg-gradient-to-t from-[#D4AF37]/10 to-transparent transform perspective-[400px] rotate-x-[80deg]" />
          </div>

          {/* Shop 2 Silhouette */}
          <div className="absolute right-[10%] w-[15vw] h-[45vh] bg-[#111] border-l border-[#D4AF37]/20 shadow-[0_0_40px_rgba(212,175,55,0.1)] flex flex-col justify-end pb-12 items-center">
             <div className="w-[60%] h-1 bg-[#E6C96A] blur-[3px] opacity-60 mb-2" />
             <div className="text-[#D4AF37] text-[6px] tracking-widest opacity-80 blur-[0.5px]">MUG BAR</div>
          </div>
        </div>

        {/* Cinematic Ambient Fog */}
        <motion.div 
          animate={{ opacity: isEntering ? 0 : 1 }} transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] mix-blend-multiply" 
        />
      </motion.div>

      {/* ================================================== */}
      {/* 2. THE MAIN CENTER GATE */}
      {/* ================================================== */}
      <motion.div 
        style={{ x: gateX, y: gateY }}
        className="absolute inset-[-5%] pointer-events-none flex items-center justify-center z-10"
      >
        {/* Left Gate Door */}
        <motion.div 
          animate={isEntering ? { x: '-100%', opacity: 0 } : { x: '0%', opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], opacity: { duration: 1 } }}
          className="absolute left-[15vw] right-1/2 top-[10%] bottom-[15%] flex justify-end overflow-hidden"
        >
          {/* Gate Metal Material */}
          <div className="w-[100%] h-full bg-gradient-to-r from-[#0a0a0b] to-[#1a1b1e] border-r-4 border-[#111] shadow-[20px_0_50px_rgba(0,0,0,0.9)] flex">
             {/* Iron Bars/Pattern Representation */}
             <div className="flex-1 border-r border-[#333] opacity-30" />
             <div className="flex-1 border-r border-[#333] opacity-30" />
             <div className="flex-1 border-r border-[#333] opacity-30" />
             
             {/* Strong Gold Edge */}
             <div className="w-[6px] h-full bg-gradient-to-b from-[#8C6918] via-[#D4AF37] to-[#8C6918] shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
          </div>
        </motion.div>

        {/* Right Gate Door */}
        <motion.div 
          animate={isEntering ? { x: '100%', opacity: 0 } : { x: '0%', opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], opacity: { duration: 1 } }}
          className="absolute right-[15vw] left-1/2 top-[10%] bottom-[15%] flex justify-start overflow-hidden"
        >
          {/* Gate Metal Material */}
          <div className="w-[100%] h-full bg-gradient-to-l from-[#0a0a0b] to-[#1a1b1e] border-l-4 border-[#111] shadow-[-20px_0_50px_rgba(0,0,0,0.9)] flex">
             {/* Strong Gold Edge */}
             <div className="w-[6px] h-full bg-gradient-to-b from-[#8C6918] via-[#D4AF37] to-[#8C6918] shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
             
             {/* Iron Bars/Pattern Representation */}
             <div className="flex-1 border-l border-[#333] opacity-30" />
             <div className="flex-1 border-l border-[#333] opacity-30" />
             <div className="flex-1 border-l border-[#333] opacity-30" />
          </div>
        </motion.div>

        {/* Central Opening Seam Glow */}
        <motion.div 
          animate={{ 
            width: isEntering ? '200px' : (hovering ? '6px' : '2px'),
            opacity: isEntering ? 0 : 1,
            backgroundColor: hovering ? '#FCE192' : '#D4AF37'
          }}
          transition={{ duration: isEntering ? 1.0 : 0.3 }}
          className="absolute top-[10%] bottom-[15%] left-1/2 -translate-x-1/2 shadow-[0_0_40px_#D4AF37] z-20 mix-blend-screen"
        />
      </motion.div>

      {/* ================================================== */}
      {/* 3. CENTER MW EMBLEM / LOGO */}
      {/* ================================================== */}
      <motion.div 
        style={{ x: crestX, y: crestY }}
        animate={isEntering ? { y: '-100%', opacity: 0, scale: 1.5 } : { y: '0%', opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute z-30 flex items-center justify-center top-[30%] md:top-[35%] pointer-events-none"
      >
        {/* Premium Circular Architectural Centerpiece */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full shadow-[0_25px_50px_rgba(0,0,0,0.95)] flex items-center justify-center">
          
          {/* Outer Stone/Metal Bevel */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E6C96A] via-[#D4AF37] to-[#8C6918] border-2 border-[#FCE192]" />
          
          {/* Inner Recessed Graphite Mount */}
          <div className="absolute inset-[10px] md:inset-[12px] rounded-full bg-gradient-to-br from-[#1C1E22] to-[#0a0a0b] shadow-[inset_0_10px_30px_rgba(0,0,0,1)] border border-[#333] flex items-center justify-center p-6 md:p-8">
            
            {/* The Real MW Trends Logo */}
            <div className="relative w-full h-full mix-blend-screen drop-shadow-[0_2px_15px_rgba(212,175,55,0.6)]">
              <Image 
                src="/mw-logo-new.jpg"
                alt="MW Trends Crest"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            {/* Subtle Metallic Shimmer over Logo */}
            <motion.div 
              animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.1)_45deg,transparent_90deg)] pointer-events-none"
            />
          </div>
        </div>
      </motion.div>

      {/* ================================================== */}
      {/* 4. LEFT & RIGHT SIDE WALLS (Architecture) */}
      {/* ================================================== */}
      <motion.div 
        style={{ x: wallsX, y: wallsY }}
        className="absolute inset-[-5%] pointer-events-none flex justify-between z-40"
      >
        {/* Left Side Wall / Structure */}
        <div className="w-[15vw] lg:w-[22vw] h-full bg-gradient-to-r from-[#070707] via-[#161719] to-[#1C1E22] border-r-4 border-[#292C31] shadow-[40px_0_80px_rgba(0,0,0,0.9)] flex flex-col items-end pr-4 md:pr-8 py-[15%] relative">
           {/* Wall details / stone blocks */}
           <div className="w-full h-[20%] border-b border-t border-[#333] opacity-30 mt-auto" />
           <div className="absolute right-0 top-[20%] bottom-[20%] w-[3vw] bg-[#0a0a0b] shadow-[inset_10px_0_20px_rgba(0,0,0,1)] border-l border-[#222]" />
           {/* Ambient Wall Light */}
           <div className="absolute right-[-2px] top-[40%] w-1 h-[15vh] bg-[#D4AF37] blur-[5px] opacity-70" />
        </div>

        {/* Right Side Wall / Structure */}
        <div className="w-[15vw] lg:w-[22vw] h-full bg-gradient-to-l from-[#070707] via-[#161719] to-[#1C1E22] border-l-4 border-[#292C31] shadow-[-40px_0_80px_rgba(0,0,0,0.9)] flex flex-col items-start pl-4 md:pl-8 py-[15%] relative">
           {/* Wall details / stone blocks */}
           <div className="w-full h-[20%] border-b border-t border-[#333] opacity-30 mt-auto" />
           <div className="absolute left-0 top-[20%] bottom-[20%] w-[3vw] bg-[#0a0a0b] shadow-[inset_-10px_0_20px_rgba(0,0,0,1)] border-r border-[#222]" />
           {/* Ambient Wall Light */}
           <div className="absolute left-[-2px] bottom-[40%] w-1 h-[15vh] bg-[#D4AF37] blur-[5px] opacity-70" />
        </div>
      </motion.div>

      {/* ================================================== */}
      {/* 5. GROUND / PATHWAY */}
      {/* ================================================== */}
      <motion.div 
        style={{ x: pathX, y: pathY }}
        className="absolute bottom-[-15%] w-[200%] h-[55vh] perspective-[1000px] pointer-events-none z-30 flex justify-center"
      >
        <div className="w-[100%] md:w-[70%] lg:w-[60%] h-full bg-gradient-to-t from-[#111] via-[#1C1E22] to-[#070707] transform rotate-x-[80deg] origin-bottom shadow-[0_-100px_150px_rgba(0,0,0,1)] border-x-8 border-[#1a1a1a]">
          
          {/* Pathway Texture & Perspective Lines */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-10 mix-blend-overlay" />
          
          <div className="absolute inset-0 flex justify-evenly opacity-30">
            <div className="w-[2px] h-full bg-gradient-to-t from-transparent to-[#D4AF37]" />
            <div className="w-[4px] h-full bg-gradient-to-t from-transparent to-[#FCE192] shadow-[0_0_20px_#D4AF37]" />
            <div className="w-[2px] h-full bg-gradient-to-t from-transparent to-[#D4AF37]" />
          </div>

          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,20,20,0.8)_10px,transparent_10px)] bg-[size:100%_200px]" />

          {/* Floor Hover Light (Travels inward toward gate) */}
          <motion.div 
            animate={{ bottom: hovering || isEntering ? '100%' : '0%', opacity: hovering || isEntering ? [0, 1, 0] : 0 }}
            transition={{ duration: isEntering ? 0.6 : 1.2, repeat: hovering && !isEntering ? Infinity : 0, ease: "linear" }}
            className="absolute left-1/2 -translate-x-1/2 w-[40%] h-[60%] bg-gradient-to-t from-transparent via-[#D4AF37] to-transparent blur-[60px] mix-blend-screen"
          />
        </div>
      </motion.div>

      {/* ================================================== */}
      {/* 6. BUTTON: ENTER MW WORLD */}
      {/* ================================================== */}
      <motion.div 
        animate={isEntering ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-[10%] md:bottom-[15%] z-50 flex flex-col items-center pointer-events-auto"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <button 
          onClick={handleEnterClick}
          disabled={isEntering}
          className="group relative px-10 py-5 lg:px-14 lg:py-6 overflow-hidden bg-gradient-to-b from-[#1C1E22]/90 to-[#0a0a0b]/90 backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.8)] transition-all duration-500 rounded-sm"
        >
          {/* Button Borders */}
          <span className="absolute inset-0 border border-[#D4AF37]/40 group-hover:border-[#FCE192] transition-colors duration-500" />
          <span className="absolute inset-[2px] border border-[#292C31] group-hover:border-[#8C6918]/50 transition-colors duration-500" />
          
          {/* Inner Glow on Hover */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.25)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <span className="text-[11px] lg:text-[13px] font-bold tracking-[0.4em] text-[#E6C96A] group-hover:text-[#FFF] transition-colors duration-300 relative z-10 uppercase sans-serif">
            Enter MW World
          </span>
        </button>
      </motion.div>

    </motion.div>
  );
}
