"use client";

import { useEffect, useState } from "react";
import { accountRepository, SavedAddress } from "@/lib/services/accountRepository";
import { motion } from "framer-motion";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    accountRepository.getAddresses().then(res => {
      setAddresses(res);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl">
      <div className="flex justify-between items-end border-b border-[#e5e0d8] pb-4">
        <h1 className="text-2xl font-bold tracking-widest">SAVED ADDRESSES</h1>
        <button className="text-[10px] font-bold tracking-widest text-[#050505] underline underline-offset-4 hover:text-[#D4AF37]">
          + ADD NEW
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {addresses.map(addr => (
          <div key={addr.id} className="bg-white border border-[#e5e0d8] p-8 shadow-sm flex flex-col group relative">
            {addr.isDefault && (
              <span className="absolute top-0 right-0 bg-[#050505] text-[#F7F4ED] text-[8px] font-bold tracking-widest px-3 py-1">
                DEFAULT
              </span>
            )}
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mb-4 uppercase">{addr.label}</h3>
            
            <div className="text-sm text-[#050505] space-y-1 mb-8">
              <p className="font-bold">{addr.fullName}</p>
              <p>{addr.addressLine1}</p>
              {addr.addressLine2 && <p>{addr.addressLine2}</p>}
              <p>{addr.city}, {addr.province}</p>
              <p className="text-[#666] mt-2">{addr.phone}</p>
            </div>

            <div className="mt-auto pt-6 border-t border-[#e5e0d8] flex gap-4">
              <button className="text-[10px] font-bold tracking-widest text-[#050505] hover:text-[#D4AF37]">EDIT</button>
              <button className="text-[10px] font-bold tracking-widest text-red-500 hover:text-red-700 ml-auto">DELETE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
