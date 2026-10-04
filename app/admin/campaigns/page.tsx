"use client";

import { useEffect, useState } from "react";
import { campaignService, Campaign } from "@/lib/services/campaignService";
import { adminService } from "@/lib/services/adminService";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCampaigns = () => {
    campaignService.getAllCampaigns().then(res => {
      setCampaigns(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    if (!adminService.hasPermission('campaign.publish')) {
      alert("Permission denied: Requires campaign.publish");
      return;
    }
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    await campaignService.updateCampaignStatus(id, newStatus);
    loadCampaigns();
  };

  if (loading) return null;

  return (
    <div className="space-y-6 max-w-[1400px]">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#e5e0d8] pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-[#050505]">CAMPAIGNS</h1>
          <p className="text-xs tracking-widest text-[#666] mt-1">One campaign. Multiple surfaces.</p>
        </div>
        
        {adminService.hasPermission('campaign.manage') && (
          <Link href="/admin/campaigns/new" className="p-3 bg-[#050505] text-[#F7F4ED] text-[10px] font-bold tracking-widest hover:bg-[#333]">
            + CREATE CAMPAIGN
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#111] text-[#F7F4ED] border border-[#222] p-6 shadow-sm">
          <span className="text-[10px] font-bold tracking-widest text-[#888] block mb-2">ACTIVE CAMPAIGNS</span>
          <p className="text-3xl font-bold">{campaigns.filter(c => c.status === 'ACTIVE').length}</p>
        </div>
        <div className="bg-white border border-[#e5e0d8] p-6 shadow-sm">
          <span className="text-[10px] font-bold tracking-widest text-[#666] block mb-2">SCHEDULED</span>
          <p className="text-3xl font-bold">{campaigns.filter(c => c.status === 'SCHEDULED').length}</p>
        </div>
        <div className="bg-white border border-[#e5e0d8] p-6 shadow-sm">
          <span className="text-[10px] font-bold tracking-widest text-[#666] block mb-2">ATTRIBUTED REVENUE</span>
          <p className="text-3xl font-bold">Rs. 84,200</p>
          <p className="text-[10px] text-[#888] mt-2">Mock data</p>
        </div>
        <div className="bg-white border border-[#e5e0d8] p-6 shadow-sm">
          <span className="text-[10px] font-bold tracking-widest text-[#666] block mb-2">AVG. CLICK RATE</span>
          <p className="text-3xl font-bold">4.2%</p>
          <p className="text-[10px] text-[#888] mt-2">Across all placements</p>
        </div>
      </div>

      <div className="bg-white border border-[#e5e0d8] overflow-x-auto shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#F7F4ED] text-[#888] text-[10px] tracking-widest font-bold border-b border-[#e5e0d8]">
            <tr>
              <th className="p-4">CAMPAIGN</th>
              <th className="p-4">TYPE</th>
              <th className="p-4">STATUS</th>
              <th className="p-4">PLACEMENTS</th>
              <th className="p-4">SCHEDULE</th>
              <th className="p-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e0d8]">
            {campaigns.map(cmp => (
              <tr key={cmp.id} className="hover:bg-[#faf9f6] transition-colors group">
                <td className="p-4">
                  <p className="font-bold text-[#050505]">{cmp.name}</p>
                  <p className="text-[10px] text-[#666] font-mono tracking-widest">{cmp.internalCode}</p>
                </td>
                <td className="p-4 text-xs text-[#666]">{cmp.type.replace('_', ' ')}</td>
                <td className="p-4">
                   <span className={`px-2 py-1 text-[9px] font-bold tracking-widest border
                      ${cmp.status === 'ACTIVE' ? 'bg-green-50 border-green-200 text-green-700' 
                        : cmp.status === 'SCHEDULED' ? 'bg-[#F7F4ED] border-[#d5d0c8] text-[#050505]'
                        : 'bg-red-50 border-red-200 text-red-700'}
                   `}>
                    {cmp.status}
                  </span>
                </td>
                <td className="p-4 text-[#050505] text-xs">
                  {cmp.placements.length} <span className="text-[#888]">surfaces targeted</span>
                </td>
                <td className="p-4 text-xs text-[#666]">
                  {new Date(cmp.startAt).toLocaleDateString()} - {new Date(cmp.endAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right flex items-center justify-end gap-4 h-full">
                   <button 
                    onClick={() => handleStatusToggle(cmp.id, cmp.status)}
                    className="text-[10px] font-bold tracking-widest text-[#050505] hover:text-[#D4AF37]"
                  >
                    {cmp.status === 'ACTIVE' ? 'PAUSE' : 'ACTIVATE'}
                  </button>
                   <button className="text-[10px] font-bold tracking-widest text-[#666] hover:text-[#050505]">EDIT</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
