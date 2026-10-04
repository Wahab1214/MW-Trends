"use client";

import { useEffect, useState } from "react";
import { MOCK_CATALOG, Product } from "@/lib/data/mockCatalog";
import Link from "next/link";
import Image from "next/image";

export default function AdminProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Note: mockCatalog currently doesn't simulate async fetch, but we do it for realism.
    setTimeout(() => {
      setProducts(MOCK_CATALOG);
      setLoading(false);
    }, 300);
  }, []);

  const filteredProducts = products.filter(p => {
    return p.name.toLowerCase().includes(search.toLowerCase()) || 
           (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
  });

  if (loading) return null;

  return (
    <div className="space-y-6 max-w-[1400px]">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#e5e0d8] pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-[#050505]">PRODUCTS & INVENTORY</h1>
          <p className="text-xs tracking-widest text-[#666] mt-1">Manage catalog, pricing, and stock levels.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search Product or SKU..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 text-xs border border-[#d5d0c8] focus:outline-none focus:border-[#050505] min-w-[200px]"
          />
          <button className="p-3 bg-[#050505] text-[#F7F4ED] text-[10px] font-bold tracking-widest hover:bg-[#333]">
            + ADD PRODUCT
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#e5e0d8] overflow-x-auto shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#F7F4ED] text-[#888] text-[10px] tracking-widest font-bold border-b border-[#e5e0d8]">
            <tr>
              <th className="p-4 w-16">MEDIA</th>
              <th className="p-4">PRODUCT</th>
              <th className="p-4">SKU</th>
              <th className="p-4">PRICE</th>
              <th className="p-4">INVENTORY</th>
              <th className="p-4">STATUS</th>
              <th className="p-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e0d8]">
            {filteredProducts.map(product => {
              const isCustom = product.customizable;
              // Mock stock calculation for demo. Since we don't have stock in standard mockCatalog, we fake it based on id.
              const mockStock = product.id.includes('1') ? 0 : product.id.includes('2') ? 12 : 'UNLIMITED (POD)';

              return (
                <tr key={product.id} className="hover:bg-[#faf9f6] transition-colors group">
                  <td className="p-4">
                    <div className="w-10 h-12 relative border border-[#e5e0d8] bg-[#F7F4ED]">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover mix-blend-multiply" />
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-[#050505]">{product.name}</p>
                    {isCustom && <span className="text-[8px] tracking-widest font-bold text-[#D4AF37]">CUSTOM LAB ENABLED</span>}
                  </td>
                  <td className="p-4 text-[#666] text-xs font-mono">{product.sku || product.id}</td>
                  <td className="p-4 font-bold text-[#050505]">Rs. {Number(product.price.replace(/,/g, '')).toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    {mockStock === 0 ? (
                      <span className="text-red-500 font-bold text-xs">OUT OF STOCK</span>
                    ) : (
                      <span className="text-[#666] text-xs">{mockStock}</span>
                    )}
                  </td>
                  <td className="p-4">
                     <span className="px-2 py-1 text-[9px] font-bold tracking-widest border border-green-200 bg-green-50 text-green-700">
                      ACTIVE
                    </span>
                  </td>
                  <td className="p-4 text-right">
                     <button className="text-[10px] font-bold tracking-widest text-[#050505] hover:text-[#D4AF37] underline underline-offset-4 mr-4">EDIT</button>
                     <Link href={`/products/${product.slug}`} target="_blank" className="text-[10px] font-bold tracking-widest text-[#666] hover:text-[#050505]">VIEW</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center text-[#888] text-xs tracking-widest">
            NO PRODUCTS FOUND.
          </div>
        )}
      </div>

    </div>
  );
}
