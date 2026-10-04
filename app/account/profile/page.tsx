"use client";

import { useEffect, useState } from "react";
import { authService, UserSession } from "@/lib/services/authService";

export default function ProfilePage() {
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    setSession(authService.getSession());
  }, []);

  if (!session) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl">
      <h1 className="text-2xl font-bold tracking-widest mb-8 border-b border-[#e5e0d8] pb-4">PROFILE</h1>

      <form className="space-y-6 bg-white border border-[#e5e0d8] p-8 shadow-sm">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] tracking-widest font-bold text-[#666]">FULL NAME</label>
          <input 
            type="text" 
            defaultValue={session.name}
            className="w-full p-4 bg-white border border-[#d5d0c8] focus:outline-none focus:border-[#050505] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] tracking-widest font-bold text-[#666]">EMAIL ADDRESS</label>
          <input 
            type="email" 
            defaultValue={session.email}
            disabled
            className="w-full p-4 bg-[#F7F4ED] text-[#888] border border-[#d5d0c8] cursor-not-allowed"
          />
          <span className="text-[10px] text-[#888]">Email cannot be changed for mock demo.</span>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] tracking-widest font-bold text-[#666]">PHONE NUMBER</label>
          <input 
            type="text" 
            defaultValue={session.phone}
            className="w-full p-4 bg-white border border-[#d5d0c8] focus:outline-none focus:border-[#050505] transition-colors"
          />
        </div>
        
        <div className="pt-4 border-t border-[#e5e0d8]">
          <button type="button" className="py-4 px-8 bg-[#050505] text-[#F7F4ED] font-bold tracking-[0.2em] text-xs hover:bg-[#333] transition-colors">
            SAVE CHANGES
          </button>
        </div>
      </form>
    </div>
  );
}
