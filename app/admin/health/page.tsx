"use client";

import { useEffect, useState } from "react";
import { MOCK_CATALOG } from "@/lib/data/mockCatalog";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminHealthDashboard() {
  const [loading, setLoading] = useState(true);
  const [seoHealth, setSeoHealth] = useState<any>(null);

  useEffect(() => {
    // Simulate a health check scan
    setTimeout(() => {
      const catalog = MOCK_CATALOG;
      
      const missingMeta = catalog.filter(p => !p.description || p.description.length < 10);
      const missingImages = catalog.filter(p => !p.images || p.images.length === 0);
      
      setSeoHealth({
        totalIndexable: catalog.length + 5, // mock 5 pages
        missingMetaCount: missingMeta.length,
        missingImagesCount: missingImages.length,
        schemaValid: true,
      });

      setLoading(false);
    }, 400);
  }, []);

  if (loading) return null;

  return (
    <div className="space-y-8 max-w-[1400px]">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#e5e0d8] pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-[#050505]">TECHNICAL HEALTH</h1>
          <p className="text-xs tracking-widest text-[#666] mt-1">SEO, Core Web Vitals, and System Observability.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SEO HEALTH */}
        <section className="bg-white border border-[#e5e0d8] p-6 shadow-sm space-y-6">
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888] border-b border-[#e5e0d8] pb-4">SEO HEALTH</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-[#f0eee9] border border-[#d5d0c8]">
               <span className="text-[10px] font-bold tracking-widest text-[#666] block mb-1">INDEXABLE URLs</span>
               <p className="text-2xl font-bold text-[#050505]">{seoHealth.totalIndexable}</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200">
               <span className="text-[10px] font-bold tracking-widest text-green-700 block mb-1">SCHEMA</span>
               <p className="text-2xl font-bold text-green-800">VALID</p>
            </div>
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-center text-xs p-3 border border-[#e5e0d8]">
               <span className="font-bold">Missing Meta Descriptions</span>
               <span className={seoHealth.missingMetaCount > 0 ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                 {seoHealth.missingMetaCount}
               </span>
             </div>
             <div className="flex justify-between items-center text-xs p-3 border border-[#e5e0d8]">
               <span className="font-bold">Missing OG Images</span>
               <span className={seoHealth.missingImagesCount > 0 ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                 {seoHealth.missingImagesCount}
               </span>
             </div>
             <div className="flex justify-between items-center text-xs p-3 border border-[#e5e0d8]">
               <span className="font-bold">Robots.txt Environment</span>
               <span className="text-blue-500 font-bold font-mono text-[10px] bg-blue-50 px-2 py-1">PRODUCTION</span>
             </div>
          </div>
        </section>

        {/* PERFORMANCE HEALTH */}
        <section className="bg-white border border-[#e5e0d8] p-6 shadow-sm space-y-6">
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888] border-b border-[#e5e0d8] pb-4">CORE WEB VITALS (Field Data Mock)</h2>
          
          <div className="space-y-6">
             <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] font-bold tracking-widest text-[#050505]">LCP (Largest Contentful Paint)</span>
                  <span className="text-[10px] font-bold text-green-600">1.8s</span>
                </div>
                <div className="w-full bg-[#f0eee9] h-2"><div className="bg-green-500 h-2 w-[70%]"></div></div>
                <p className="text-[9px] text-[#888] mt-1">Target: &lt; 2.5s. Optimized via Next.js Priority Image.</p>
             </div>

             <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] font-bold tracking-widest text-[#050505]">INP (Interaction to Next Paint)</span>
                  <span className="text-[10px] font-bold text-green-600">85ms</span>
                </div>
                <div className="w-full bg-[#f0eee9] h-2"><div className="bg-green-500 h-2 w-[40%]"></div></div>
                <p className="text-[9px] text-[#888] mt-1">Target: &lt; 200ms. Main thread isolated from 3D bundle.</p>
             </div>

             <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] font-bold tracking-widest text-[#050505]">CLS (Cumulative Layout Shift)</span>
                  <span className="text-[10px] font-bold text-green-600">0.02</span>
                </div>
                <div className="w-full bg-[#f0eee9] h-2"><div className="bg-green-500 h-2 w-[10%]"></div></div>
                <p className="text-[9px] text-[#888] mt-1">Target: &lt; 0.1. Layout boundaries strictly enforced.</p>
             </div>
          </div>
        </section>

      </div>

      {/* SYSTEM OBSERVABILITY */}
      <section className="bg-[#111] text-[#F7F4ED] border border-[#222] p-6 shadow-sm space-y-6">
         <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888] border-b border-[#333] pb-4">SYSTEM OBSERVABILITY</h2>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-[10px] text-[#888] tracking-widest block mb-1">Event Bus Status</span>
              <span className="text-green-400 font-bold text-xs tracking-widest flex items-center gap-2"><div className="w-2 h-2 bg-green-400 rounded-full"></div> ROUTING</span>
            </div>
            <div>
              <span className="text-[10px] text-[#888] tracking-widest block mb-1">PII Redaction</span>
              <span className="text-green-400 font-bold text-xs tracking-widest">ACTIVE</span>
            </div>
            <div>
              <span className="text-[10px] text-[#888] tracking-widest block mb-1">3D Bundle Scope</span>
              <span className="text-[#D4AF37] font-bold text-xs tracking-widest">ISOLATED (ssr:false)</span>
            </div>
            <div>
              <span className="text-[10px] text-[#888] tracking-widest block mb-1">Frontend Errors (24h)</span>
              <span className="text-white font-bold text-xs tracking-widest">0.01%</span>
            </div>
         </div>
      </section>

    </div>
  );
}
