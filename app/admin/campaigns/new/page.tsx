"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { campaignService, PlacementId } from "@/lib/services/campaignService";
import { adminService } from "@/lib/services/adminService";
import Link from "next/link";

export default function CampaignBuilder() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [internalCode, setInternalCode] = useState("");
  const [type, setType] = useState("PRODUCT_DROP");
  const [headline, setHeadline] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [placements, setPlacements] = useState<PlacementId[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState(100);

  const availablePlacements: { id: PlacementId, label: string }[] = [
    { id: 'home.hero', label: 'Homepage Hero' },
    { id: 'shop.hero', label: 'Quick Shop Hero' },
    { id: 'plaza.billboard.a', label: 'MW Plaza Billboard A' },
    { id: 'plaza.billboard.b', label: 'MW Plaza Billboard B' },
    { id: 'plaza.livingPoster', label: 'Plaza Living Poster' },
    { id: 'teeStudio.window', label: 'Tee Studio Window' }
  ];

  const handleTogglePlacement = (id: PlacementId) => {
    if (placements.includes(id)) {
      setPlacements(placements.filter(p => p !== id));
    } else {
      setPlacements([...placements, id]);
    }
  };

  const handleSave = async (status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE') => {
    if (!adminService.hasPermission('campaign.publish') && status === 'ACTIVE') {
      alert("Permission denied to publish. You can only save as Draft.");
      return;
    }

    if (!name || !internalCode || placements.length === 0 || !startDate || !endDate) {
      alert("Please fill out Name, Code, Dates, and select at least one placement.");
      return;
    }

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (start >= end) {
      alert("End date must be after start date.");
      return;
    }

    try {
      await campaignService.createCampaign({
        name,
        internalCode,
        type,
        status,
        startAt: start,
        endAt: end,
        priority,
        placements,
        creative: {
          headline,
          ctaText,
          desktopMedia: '/models/textures/placeholder_ad.jpg'
        },
        targetUrl
      });
      router.push('/admin/campaigns');
    } catch (e) {
      console.error(e);
      alert("Failed to save campaign.");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#e5e0d8] pb-4 gap-4">
        <div>
          <Link href="/admin/campaigns" className="text-[10px] font-bold tracking-widest text-[#888] hover:text-[#050505] mb-4 block">← BACK TO CAMPAIGNS</Link>
          <h1 className="text-2xl font-bold tracking-widest text-[#050505]">NEW CAMPAIGN</h1>
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => handleSave('DRAFT')} className="px-6 py-3 border border-[#d5d0c8] text-[#050505] text-[10px] font-bold tracking-[0.2em] hover:bg-[#e5e0d8]">
            SAVE DRAFT
          </button>
          <button onClick={() => handleSave('ACTIVE')} className="px-6 py-3 bg-[#050505] text-[#F7F4ED] text-[10px] font-bold tracking-[0.2em] hover:bg-[#333]">
            PUBLISH NOW
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white border border-[#e5e0d8] p-8 shadow-sm space-y-6">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888] border-b border-[#e5e0d8] pb-4">CAMPAIGN BASICS</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-widest font-bold text-[#666]">CAMPAIGN NAME</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border border-[#d5d0c8] focus:outline-none focus:border-[#050505]" placeholder="e.g. Eid 2026 Collection" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-widest font-bold text-[#666]">INTERNAL CODE</label>
                <input type="text" value={internalCode} onChange={e => setInternalCode(e.target.value)} className="w-full p-3 border border-[#d5d0c8] focus:outline-none focus:border-[#050505]" placeholder="EID26-DROP" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-widest font-bold text-[#666]">CAMPAIGN TYPE</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full p-3 border border-[#d5d0c8] focus:outline-none focus:border-[#050505] bg-white">
                <option value="PRODUCT_DROP">Product Drop</option>
                <option value="SEASONAL">Seasonal</option>
                <option value="FLASH_SALE">Flash Sale</option>
                <option value="EVERGREEN">Evergreen / Brand</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-[#e5e0d8] p-8 shadow-sm space-y-6">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888] border-b border-[#e5e0d8] pb-4">CREATIVE & DESTINATION</h2>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-widest font-bold text-[#666]">HEADLINE OVERRIDE</label>
              <input type="text" value={headline} onChange={e => setHeadline(e.target.value)} className="w-full p-3 border border-[#d5d0c8] focus:outline-none focus:border-[#050505]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-widest font-bold text-[#666]">CTA TEXT</label>
              <input type="text" value={ctaText} onChange={e => setCtaText(e.target.value)} className="w-full p-3 border border-[#d5d0c8] focus:outline-none focus:border-[#050505]" placeholder="SHOP NOW" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-widest font-bold text-[#666]">TARGET DESTINATION URL</label>
              <input type="text" value={targetUrl} onChange={e => setTargetUrl(e.target.value)} className="w-full p-3 border border-[#d5d0c8] focus:outline-none focus:border-[#050505]" placeholder="/collections/eid" />
            </div>
            <div className="pt-4 mt-4 border-t border-[#e5e0d8]">
              <p className="text-[10px] tracking-widest font-bold text-[#888] mb-4">MEDIA ASSETS</p>
              <div className="border border-dashed border-[#d5d0c8] bg-[#F7F4ED] p-8 text-center text-xs tracking-widest text-[#666] cursor-pointer hover:bg-[#f0eee9]">
                DRAG & DROP IMAGES/VIDEO HERE
              </div>
            </div>
          </div>

        </div>

        {/* Right Col */}
        <div className="space-y-8">
          
          <div className="bg-[#111] text-[#F7F4ED] border border-[#222] p-8 shadow-sm space-y-6">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888] border-b border-[#333] pb-4">DISTRIBUTION</h2>
            <p className="text-xs text-[#ccc]">Select surfaces to display this campaign.</p>
            <div className="space-y-3">
              {availablePlacements.map(p => (
                <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 border flex items-center justify-center ${placements.includes(p.id) ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-[#666] group-hover:border-[#F7F4ED]'}`}>
                    {placements.includes(p.id) && <div className="w-2 h-2 bg-[#111]" />}
                  </div>
                  <span className="text-xs font-bold tracking-widest">{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#e5e0d8] p-8 shadow-sm space-y-6">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888] border-b border-[#e5e0d8] pb-4">SCHEDULE</h2>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-widest font-bold text-[#666]">START DATE</label>
              <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-3 border border-[#d5d0c8] focus:outline-none focus:border-[#050505] text-xs" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-widest font-bold text-[#666]">END DATE</label>
              <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-3 border border-[#d5d0c8] focus:outline-none focus:border-[#050505] text-xs" />
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t border-[#e5e0d8]">
              <label className="text-[10px] tracking-widest font-bold text-[#666]">PRIORITY OVERRIDE</label>
              <input type="number" value={priority} onChange={e => setPriority(parseInt(e.target.value))} className="w-full p-3 border border-[#d5d0c8] focus:outline-none focus:border-[#050505]" />
              <p className="text-[9px] text-[#888]">Higher numbers override conflicting campaigns.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
