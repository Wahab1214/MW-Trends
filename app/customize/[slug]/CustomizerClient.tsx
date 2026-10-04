"use client";

import { useEffect, useState, useRef } from "react";
import { getProductBySlug, Product, ProductVariant } from "@/lib/data/mockCatalog";
import { useCustomizerStore } from "@/lib/store/useCustomizerStore";
import CustomizerCanvas from "@/components/customizer/CustomizerCanvas";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PrintCheckModal from "@/components/customizer/PrintCheckModal";
import TransferModal from "@/components/customizer/TransferModal";
import Preview3D from "@/components/customizer/Preview3D";
import { useCartStore } from "@/lib/store/useCartStore";
import { useSearchParams } from "next/navigation";
import { accountRepository } from "@/lib/services/accountRepository";

export default function CustomizerClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isPrintCheckOpen, setIsPrintCheckOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  
  const { addItem } = useCartStore();

  const { 
    activeVariant, setActiveVariant, 
    activeSide, setActiveSide,
    addElement, elements, undo, redo, reset,
    is3DMode, set3DMode, loadDesign
  } = useCustomizerStore();

  useEffect(() => {
    const data = getProductBySlug(slug);
    if (data) {
      setProduct(data);
      if (data.variants.length > 0 && !activeVariant) {
        setActiveVariant(data.variants[0]);
      }
    }

    const designId = searchParams.get('designId');
    if (designId) {
      accountRepository.getDesign(designId).then(design => {
        if (design && design.designConfig) {
          loadDesign(design.designConfig);
        }
      });
    }
  }, [slug, searchParams, loadDesign]);

  if (!product) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file read for local prototype
      const reader = new FileReader();
      reader.onload = (event) => {
        addElement({
          type: 'image',
          content: event.target?.result as string,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          side: activeSide
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddText = () => {
    addElement({
      type: 'text',
      content: 'YOUR TEXT',
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      side: activeSide,
      color: '#FFFFFF'
    });
  };

  const handleAddToBag = () => {
    if (product) {
      addItem({
        product,
        variant: activeVariant,
        size: null, // Customize view defaults or we could add size selector
        designConfig: elements,
      });
    }
    setIsPrintCheckOpen(false);
  };

  return (
    <div className="pointer-events-auto min-h-screen bg-[#050505] text-[#F7F4ED] font-sans overflow-hidden flex flex-col">
      {/* HEADER */}
      <header className="h-16 border-b border-[#222] flex items-center justify-between px-8 bg-[#0a0a0b] shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link href={`/products/${slug}`} className="text-[#888] hover:text-[#F7F4ED] transition-colors">
            ← EXIT CUSTOMIZER
          </Link>
        </div>
        <div className="text-[10px] tracking-[0.2em] font-bold text-[#D4AF37]">
          MW CUSTOM LAB
        </div>
        <div className="flex gap-4">
          <button onClick={undo} className="text-[#888] hover:text-white text-xs">UNDO</button>
          <button onClick={redo} className="text-[#888] hover:text-white text-xs">REDO</button>
          <button onClick={reset} className="text-[#888] hover:text-white text-xs">RESET</button>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative">
        
        {/* CENTER: PREVIEW STAGE (Moves to top on mobile via order-1 lg:order-2) */}
        <div className="flex-1 relative bg-[#050505] overflow-hidden flex flex-col p-4 lg:p-8 order-1 lg:order-2 min-h-[50vh] lg:min-h-0">
          
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-[#111]/80 backdrop-blur-md p-1 border border-[#222] rounded-md">
            <button 
              onClick={() => set3DMode(false)}
              className={`px-4 py-2 text-[10px] tracking-widest rounded-sm transition-all ${!is3DMode ? 'bg-[#222] text-[#D4AF37]' : 'text-[#888]'}`}
            >
              2D EDITOR
            </button>
            <button 
              onClick={() => set3DMode(true)}
              className={`px-4 py-2 text-[10px] tracking-widest rounded-sm transition-all ${is3DMode ? 'bg-[#222] text-[#D4AF37]' : 'text-[#888]'}`}
            >
              3D PREVIEW
            </button>
          </div>

          {is3DMode ? (
            <Preview3D />
          ) : (
            <CustomizerCanvas />
          )}

        </div>

        {/* LEFT PANEL: TOOLS (Moves below stage on mobile via order-2 lg:order-1) */}
        <div className="w-full lg:w-80 border-r border-[#222] bg-[#0a0a0b] p-6 flex flex-col gap-8 overflow-y-auto shrink-0 z-10 order-2 lg:order-1 border-t lg:border-t-0">
          <div>
            <h2 className="text-xs font-bold tracking-[0.2em] mb-4 text-[#F7F4ED]">TOOLS</h2>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/png, image/jpeg, image/webp"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="py-6 border border-[#222] bg-[#111] hover:border-[#D4AF37] transition-all flex flex-col items-center gap-2 rounded-md"
              >
                <span className="text-xl">⇪</span>
                <span className="text-[10px] tracking-widest text-[#888]">UPLOAD ART</span>
              </button>
              <button 
                onClick={handleAddText}
                className="py-6 border border-[#222] bg-[#111] hover:border-[#D4AF37] transition-all flex flex-col items-center gap-2 rounded-md"
              >
                <span className="text-xl">T</span>
                <span className="text-[10px] tracking-widest text-[#888]">ADD TEXT</span>
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold tracking-[0.2em] mb-4 text-[#F7F4ED]">PRODUCT COLOR</h2>
            <div className="flex gap-3 flex-wrap">
              {product.variants.map(v => (
                <button
                  key={v.id}
                  onClick={() => setActiveVariant(v)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeVariant?.id === v.id ? 'border border-[#D4AF37] p-[2px]' : 'border border-[#333]'}`}
                >
                  <span className="w-full h-full rounded-full block" style={{ backgroundColor: v.colorCode }} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold tracking-[0.2em] mb-4 text-[#F7F4ED]">PRINT SIDE</h2>
            <div className="flex bg-[#111] border border-[#222] p-1 rounded-md">
              <button 
                onClick={() => setActiveSide('front')}
                className={`flex-1 py-2 text-[10px] tracking-widest rounded-sm transition-all ${activeSide === 'front' ? 'bg-[#222] text-white shadow-md' : 'text-[#888]'}`}
              >
                FRONT
              </button>
              <button 
                onClick={() => setActiveSide('back')}
                className={`flex-1 py-2 text-[10px] tracking-widest rounded-sm transition-all ${activeSide === 'back' ? 'bg-[#222] text-white shadow-md' : 'text-[#888]'}`}
              >
                BACK
              </button>
            </div>
          </div>

          {/* Layers Summary */}
          <div className="flex-1">
            <h2 className="text-xs font-bold tracking-[0.2em] mb-4 text-[#F7F4ED]">LAYERS</h2>
            <div className="space-y-2">
              {elements.filter(el => el.side === activeSide).map((el, idx) => (
                <div key={el.id} className="p-3 bg-[#111] border border-[#222] rounded flex justify-between items-center group">
                  <span className="text-[10px] tracking-widest text-[#888]">
                    {el.type.toUpperCase()} {idx + 1}
                  </span>
                  {/* Delete button logic handled via store.removeElement in complete app */}
                </div>
              ))}
              {elements.filter(el => el.side === activeSide).length === 0 && (
                <div className="text-[10px] text-[#666] tracking-widest p-4 text-center border border-dashed border-[#222]">
                  NO LAYERS ON {activeSide.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>



        {/* RIGHT PANEL: SUMMARY & CHECKOUT */}
        <div className="w-full lg:w-80 border-l border-[#222] bg-[#0a0a0b] p-6 flex flex-col justify-between shrink-0 z-10 order-3 border-t lg:border-t-0 pb-24 lg:pb-6">
          <div>
            <h2 className="text-lg font-bold tracking-wider mb-2">{product.name}</h2>
            <div className="text-[10px] tracking-widest text-[#888] mb-8 pb-8 border-b border-[#222]">
              CUSTOM DESIGN
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-xs text-[#888]">
                <span>Base Product</span>
                <span className="text-[#F7F4ED]">{product.price}</span>
              </div>
              {elements.length > 0 && (
                <div className="flex justify-between text-xs text-[#D4AF37]">
                  <span>Custom Print</span>
                  <span>+ Rs. 499</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm border-t border-[#222] pt-4 mt-4">
                <span>TOTAL</span>
                <span>Rs. {elements.length > 0 ? (parseInt(product.price.replace(/\D/g, '')) + 499).toLocaleString('en-IN') : product.price}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => setIsPrintCheckOpen(true)}
              className="w-full py-4 bg-[#F7F4ED] text-[#050505] font-bold tracking-[0.2em] text-[10px] text-center hover:bg-[#D4AF37] transition-colors"
            >
              {elements.length > 0 ? 'REVIEW & ADD TO BAG' : 'ADD TO BAG'}
            </button>
            <button onClick={() => setIsTransferOpen(true)} className="w-full py-4 border border-[#F7F4ED] text-[#F7F4ED] font-bold tracking-[0.2em] text-[10px] text-center hover:bg-[#F7F4ED]/10 transition-colors">
              TRY ON ANOTHER CANVAS
            </button>
          </div>
        </div>
      </div>

      {/* Signature Modals */}
      <AnimatePresence>
        {isPrintCheckOpen && (
          <PrintCheckModal onClose={handleAddToBag} product={product} />
        )}
        {isTransferOpen && (
          <TransferModal onClose={() => setIsTransferOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
