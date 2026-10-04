import { Product } from "@/lib/data/mockCatalog";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group cursor-pointer">
      {/* Product Image Box */}
      <div className="aspect-[4/5] bg-[#0a0a0a] mb-6 relative overflow-hidden flex items-center justify-center border border-[#111111] group-hover:border-[#D4AF37]/40 transition-colors duration-500">
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isNew && (
            <span className="px-2 py-1 bg-[#111111] text-[#F7F4ED] border border-white/10 text-[9px] tracking-widest">NEW</span>
          )}
          {product.isCustomizable && (
            <span className="px-2 py-1 bg-[#D4AF37] text-[#050505] text-[9px] font-bold tracking-widest">CUSTOMIZABLE</span>
          )}
        </div>

        {/* Abstract Placeholder Graphic */}
        <div className="w-16 h-16 border border-[#1B1B1B] rotate-45 group-hover:scale-110 group-hover:border-[#D4AF37]/50 transition-all duration-700 flex items-center justify-center">
           <span className="rotate-[-45deg] text-xs text-[#9B9B9B]/30 group-hover:text-[#D4AF37]/50 transition-colors">{product.category.toUpperCase()}</span>
        </div>
        
        {/* Hover Actions */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link href={`/products/${product.slug}`}>
            <button className="w-full py-3 bg-[#D4AF37] text-[#050505] text-xs font-bold tracking-widest flex items-center justify-center gap-2">
              VIEW DETAILS <ArrowUpRight size={14} />
            </button>
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-bold tracking-wider mb-1 text-[#F7F4ED]">{product.name}</div>
          <div className="text-[#9B9B9B] text-xs tracking-wide">{product.shortDescription}</div>
          
          {/* Swatches */}
          {product.variants.length > 0 && (
            <div className="flex gap-2 mt-3">
              {product.variants.map(v => (
                <div 
                  key={v.id} 
                  title={v.name}
                  className="w-4 h-4 rounded-full border border-white/20" 
                  style={{ backgroundColor: v.colorCode }} 
                />
              ))}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-[#D4AF37] text-sm tracking-wide">{product.price}</div>
          {product.compareAtPrice && (
            <div className="text-[#9B9B9B] text-xs line-through mt-1">{product.compareAtPrice}</div>
          )}
        </div>
      </div>
    </div>
  );
}
