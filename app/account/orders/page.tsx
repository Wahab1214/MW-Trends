"use client";

import { useEffect, useState } from "react";
import { orderService, Order } from "@/lib/services/orderService";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getUserOrders().then(res => {
      setOrders(res);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl">
      <h1 className="text-2xl font-bold tracking-widest mb-8 border-b border-[#e5e0d8] pb-4">ORDER HISTORY</h1>

      {orders.length === 0 ? (
        <div className="bg-white border border-[#e5e0d8] p-12 text-center shadow-sm">
          <p className="text-sm tracking-widest text-[#666] mb-6">You haven't placed any orders yet.</p>
          <Link href="/shop" className="px-8 py-4 bg-[#050505] text-[#F7F4ED] text-xs font-bold tracking-[0.2em] hover:bg-[#333]">
            SHOP NOW
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <motion.div 
              key={order.id} 
              className="bg-white border border-[#e5e0d8] p-6 shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between group"
              whileHover={{ y: -2 }}
            >
              <div className="flex gap-6">
                <div className="w-20 h-24 bg-[#F7F4ED] relative shrink-0 border border-[#e5e0d8]">
                   {order.items[0].isCustom ? (
                    <div className="absolute inset-0 flex items-center justify-center text-[8px] text-[#D4AF37] font-bold border border-[#D4AF37]/30 bg-[#111] text-center">CUSTOM</div>
                  ) : (
                    <Image src={order.items[0].productImage} alt="Product" fill className="object-cover mix-blend-multiply" />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm font-bold tracking-widest">ORDER #{order.orderNumber}</h3>
                    <span className={`px-2 py-1 text-[9px] font-bold tracking-widest border
                      ${order.orderStatus === 'DELIVERED' ? 'bg-[#e5e0d8] text-[#050505] border-[#d5d0c8]' 
                        : order.orderStatus === 'SHIPPED' ? 'bg-[#050505] text-white border-[#050505]'
                        : 'bg-white text-[#D4AF37] border-[#D4AF37]'}
                    `}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[#666] tracking-widest mb-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs font-bold text-[#050505]">Rs. {order.total.toLocaleString('en-IN')} <span className="text-[#888] font-normal">({order.items.length} {order.items.length === 1 ? 'item' : 'items'})</span></p>
                </div>
              </div>
              <div className="flex md:flex-col gap-4 border-t border-[#e5e0d8] md:border-0 pt-4 md:pt-0">
                <Link href={`/account/orders/${order.id}`} className="flex-1 md:flex-none py-3 px-6 bg-[#050505] text-[#F7F4ED] text-[10px] font-bold tracking-[0.2em] text-center hover:bg-[#333] transition-colors">
                  VIEW DETAILS
                </Link>
                {order.orderStatus !== 'DELIVERED' && (
                  <Link href="/track-order" className="flex-1 md:flex-none py-3 px-6 border border-[#d5d0c8] text-[#050505] text-[10px] font-bold tracking-[0.2em] text-center hover:bg-[#e5e0d8] transition-colors">
                    TRACK
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
