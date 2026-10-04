"use client";

import { useEffect, useState } from "react";
import { campaignService, Campaign } from "@/lib/services/campaignService";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WorldAdsManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    campaignService.getAllCampaigns().then(res => {
      setCampaigns(res);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  // Active resolution helper for prototype display
  const resolveForDisplay = (placementId: string) => {
    const now = Date.now();
    const active = campaigns.filter(c => 
      c.status === 'ACTIVE' && c.startAt <= now && c.endAt >= now && c.placements.includes(placementId as any)
    ).sort((a, b) => b.priority - a.priority);
    return active[0] || null;
  };

  const PLACEMENTS = [
    { id: 'plaza.billboard.a', name: 'Plaza Billboard A', type: 'VIDEO/IMAGE', location: 'MW Plaza' },
    { id: 'plaza.billboard.b', name: 'Plaza Billboard B', type: 'VIDEO/IMAGE', location: 'MW Plaza' },
    { id: 'plaza.livingPoster', name: 'Plaza Living Poster', type: 'INTERACTIVE', location: 'MW Plaza' },
    { id: 'teeStudio.window', name: 'Tee Studio Window', type: 'IMAGE', location: 'Tee Studio' },
    { id: 'street.banner', name: 'Street Banner', type: 'TEXTURE', location: 'World Streets' }
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#e5e0d8] pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-[#050505]">MW WORLD ADS</h1>
          <p className="text-xs tracking-widest text-[#666] mt-1">Manage 3D advertising inventory and placements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLACEMENTS.map(slot => {
          const activeCampaign = resolveForDisplay(slot.id);
          
          return (
            <div key={slot.id} className="bg-white border border-[#e5e0d8] shadow-sm flex flex-col h-full group">
              
              {/* Visual Slot Header */}
              <div className="h-32 bg-[#111] relative border-b border-[#e5e0d8] flex items-center justify-center p-4 overflow-hidden">
                <span className="absolute top-2 left-2 px-2 py-1 bg-[#222] text-[#888] text-[8px] font-bold tracking-widest border border-[#333]">
                  {slot.location.toUpperCase()}
                </span>
                
                {activeCampaign ? (
                   <div className="text-center z-10">
                     <h3 className="text-sm font-bold text-white tracking-widest">{activeCampaign.creative.headline || activeCampaign.name}</h3>
                     {activeCampaign.creative.subheadline && <p className="text-[10px] text-[#ccc] mt-1">{activeCampaign.creative.subheadline}</p>}
                   </div>
                ) : (
                   <div className="text-center z-10 opacity-50">
                     <h3 className="text-xs font-bold text-white tracking-widest">EVERGREEN FALLBACK</h3>
                     <p className="text-[8px] text-[#888] mt-1">Default MW Brand Ad</p>
                   </div>
                )}
                
                <div className="absolute inset-0 bg-[#0a0a0b]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                   <button className="px-4 py-2 border border-white text-white text-[9px] font-bold tracking-widest hover:bg-white hover:text-black">
                     PREVIEW IN 3D
                   </button>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xs font-bold tracking-widest">{slot.name}</h2>
                  <span className="text-[8px] font-mono text-[#888]">{slot.id}</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-[9px] font-bold tracking-widest text-[#888] mb-1">CURRENTLY ACTIVE</p>
                    {activeCampaign ? (
                      <Link href={`/admin/campaigns`} className="text-sm font-bold text-[#050505] hover:text-[#D4AF37] hover:underline underline-offset-4">
                        {activeCampaign.name}
                      </Link>
                    ) : (
                      <p className="text-sm text-[#666] italic">None (Fallback)</p>
                    )}
                  </div>
                  
                  <div>
                     <p className="text-[9px] font-bold tracking-widest text-[#888] mb-1">UPCOMING</p>
                     {(() => {
                       const upcoming = campaigns.filter(c => c.status === 'SCHEDULED' && c.placements.includes(slot.id as any));
                       if (upcoming.length === 0) return <p className="text-xs text-[#666]">No campaigns scheduled.</p>;
                       return upcoming.map(c => (
                         <div key={c.id} className="text-xs text-[#050505] flex justify-between border-b border-[#f0eee9] pb-1 mb-1 last:border-0 last:mb-0">
                           <span>{c.name}</span>
                           <span className="text-[#888]">{new Date(c.startAt).toLocaleDateString()}</span>
                         </div>
                       ));
                     })()}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-[#e5e0d8]">
                  <Link href="/admin/campaigns/new" className="text-[9px] font-bold tracking-widest text-[#050505] hover:text-[#D4AF37] underline underline-offset-4">
                    SCHEDULE CAMPAIGN
                  </Link>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
