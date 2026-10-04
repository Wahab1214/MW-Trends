"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCustomizerStore, DesignElement } from "@/lib/store/useCustomizerStore";

export default function CustomizerCanvas() {
  const { elements, activeSide, updateElement, activeVariant } = useCustomizerStore();
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  // Only show elements for the active side
  const visibleElements = elements.filter(el => el.side === activeSide);

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-[#111111] rounded-lg">
      {/* Background Product Image Mockup based on activeVariant */}
      {/* For Phase 4 prototype, we use a generic placeholder bounded by a box if no specific image */}
      <div 
        className="w-[300px] h-[400px] md:w-[400px] md:h-[500px] relative transition-colors duration-500 rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: activeVariant?.colorCode || '#222' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/40 mix-blend-overlay pointer-events-none" />
        
        {/* Print Safe Area Boundary */}
        <div 
          ref={constraintsRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[70%] border border-dashed border-[#D4AF37]/50 rounded-md pointer-events-none z-0"
        >
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] tracking-widest text-[#D4AF37]/50 whitespace-nowrap">PRINT SAFE AREA</span>
        </div>

        {/* Draggable Elements Layer */}
        <div className="absolute inset-0 z-10">
          {visibleElements.map((el) => (
            <DraggableElement key={el.id} element={el} constraintsRef={constraintsRef} updateElement={updateElement} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DraggableElement({ 
  element, 
  constraintsRef, 
  updateElement 
}: { 
  element: DesignElement; 
  constraintsRef: React.RefObject<any>;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
}) {
  const isText = element.type === 'text';

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.1}
      dragMomentum={false}
      onDragEnd={(event, info) => {
        // Optional: save final coordinates to store. For prototype, framer-motion handles local offset.
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: element.scale, opacity: 1, rotate: element.rotation }}
      whileHover={{ scale: element.scale * 1.05 }}
      whileDrag={{ scale: element.scale * 1.1, cursor: "grabbing" }}
      className="absolute top-1/2 left-1/2 flex items-center justify-center cursor-grab group border-2 border-transparent hover:border-[#D4AF37]/50 rounded-sm"
      style={{ x: element.x, y: element.y }}
    >
      {/* Delete / Scale controls would go here (visible on hover) */}

      {isText ? (
        <span 
          style={{ color: element.color, fontFamily: element.font, fontSize: '32px' }}
          className="font-bold tracking-widest whitespace-pre-wrap text-center drop-shadow-md"
        >
          {element.content}
        </span>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img 
          src={element.content} 
          alt="User Design" 
          className="w-48 h-auto object-contain drop-shadow-lg pointer-events-none"
        />
      )}
    </motion.div>
  );
}
