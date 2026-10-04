"use client";

import { useEffect, useState } from "react";
import { authService, UserSession } from "@/lib/services/authService";
import { orderService, Order } from "@/lib/services/orderService";
import { accountRepository, SavedDesign } from "@/lib/services/accountRepository";
import Link from "next/link";
import Image from "next/image";

export default function AccountOverview() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);
  const [recentDesign, setRecentDesign] = useState<SavedDesign | null>(null);

  useEffect(() => {
    setSession(authService.getSession());
    orderService.getUserOrders().then(orders => setRecentOrder(orders[0] || null));
    accountRepository.getDesigns().then(designs => setRecentDesign(designs[0] || null));
  }, []);

  if (!session) return null;

  return (
    <div className="space-y-12 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero */}
      <section className="pb-8 border-b border-[#e5e0d8]">
        <h1 className="text-3xl font-bold tracking-widest mb-2 uppercase">WELCOME BACK, {session.name.split(' ')[0]}</h1>
        <p className="text-sm text-[#666] tracking-widest">YOUR MW SPACE • Orders, designs and everything you've created.</p>
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Recent Order */}
        <div className="bg-white border border-[#e5e0d8] p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888]">RECENT ORDER</h2>
              {recentOrder && (
                <span className="px-2 py-1 bg-[#F7F4ED] text-[9px] font-bold tracking-widest border border-[#e5e0d8]">
                  {recentOrder.orderStatus}
                </span>
              )}
            </div>
            
            {recentOrder ? (
              <div className="flex gap-4 mb-6">
                <div className="w-16 h-20 bg-[#F7F4ED] relative shrink-0 border border-[#e5e0d8]">
                  {recentOrder.items[0].isCustom ? (
                    <div className="absolute inset-0 flex items-center justify-center text-[6px] text-[#D4AF37] font-bold border border-[#D4AF37]/30 bg-[#111] text-center">CUSTOM</div>
                  ) : (
                    <Image src={recentOrder.items[0].productImage} alt="Product" fill className="object-cover mix-blend-multiply" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold">{recentOrder.items[0].productName}</h4>
                  <p className="text-[10px] text-[#666] tracking-widest mt-1">Order # {recentOrder.orderNumber}</p>
                  <p className="text-xs font-bold mt-2">Rs. {recentOrder.total.toLocaleString('en-IN')}</p>
                  {recentOrder.items.length > 1 && <p className="text-[10px] text-[#888] mt-1">+ {recentOrder.items.length - 1} more items</p>}
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#888] tracking-widest mb-6">YOUR MW STORY STARTS WITH YOUR FIRST ORDER.</p>
            )}
          </div>
          
          <div className="flex gap-4 border-t border-[#e5e0d8] pt-6">
            {recentOrder ? (
              <>
                <Link href={`/account/orders/${recentOrder.id}`} className="text-[10px] font-bold tracking-widest text-[#050505] hover:text-[#D4AF37] underline underline-offset-4">VIEW DETAILS</Link>
                <Link href="/track-order" className="text-[10px] font-bold tracking-widest text-[#666] hover:text-[#050505]">TRACK ORDER</Link>
              </>
            ) : (
              <Link href="/shop" className="text-[10px] font-bold tracking-widest text-[#050505] hover:text-[#D4AF37] underline underline-offset-4">SHOP NOW</Link>
            )}
          </div>
        </div>

        {/* Recent Design */}
        <div className="bg-[#111] text-[#F7F4ED] border border-[#222] p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888]">LATEST DESIGN</h2>
              {recentDesign && (
                <span className={`px-2 py-1 text-[9px] font-bold tracking-widest border ${recentDesign.status === 'ORDERED' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30' : 'bg-[#333] text-[#F7F4ED] border-[#444]'}`}>
                  {recentDesign.status}
                </span>
              )}
            </div>
            
            {recentDesign ? (
              <div className="flex gap-4 mb-6">
                 <div className="w-16 h-20 relative shrink-0 border border-[#333] bg-black">
                   {/* Flattened visual mock */}
                   <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-[8px] tracking-widest opacity-50">{recentDesign.designConfig[0]?.content || 'DESIGN'}</span>
                   </div>
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-[#F7F4ED]">{recentDesign.name}</h4>
                   <p className="text-[10px] text-[#888] tracking-widest mt-1">On {recentDesign.productName}</p>
                 </div>
              </div>
            ) : (
              <p className="text-xs text-[#888] tracking-widest mb-6">YOUR FIRST IDEA IS WAITING.</p>
            )}
          </div>

          <div className="flex gap-4 border-t border-[#333] pt-6">
            {recentDesign ? (
              <>
                <Link href={`/account/designs`} className="text-[10px] font-bold tracking-widest text-[#D4AF37] hover:text-white underline underline-offset-4">VIEW LIBRARY</Link>
                <Link href={`/customize/${recentDesign.productId}?designId=${recentDesign.id}`} className="text-[10px] font-bold tracking-widest text-[#888] hover:text-white">EDIT DESIGN</Link>
              </>
            ) : (
              <Link href="/products/midnight-oversized-tee" className="text-[10px] font-bold tracking-widest text-[#D4AF37] hover:text-white underline underline-offset-4">OPEN CUSTOM LAB</Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
