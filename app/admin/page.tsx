"use client";

import { useEffect, useState } from "react";
import { orderService, Order } from "@/lib/services/orderService";
import { adminService } from "@/lib/services/adminService";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In real app, we'd have adminService.getAllOrders()
    // For prototype, we'll reuse getUserOrders or getOrders mock logic.
    // Assuming getOrders is exposed or we simulate it.
    // Let's use userOrders for now to populate the dashboard metrics.
    orderService.getAllOrders().then(res => {
      setOrders(res);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  const pendingCount = orders.filter(o => o.orderStatus === 'RECEIVED' || o.orderStatus === 'PROCESSING').length;
  const designReviewCount = orders.filter(o => o.items.some(i => i.isCustom) && o.orderStatus === 'RECEIVED').length;
  const todayRevenue = orders.reduce((acc, o) => acc + o.total, 0); // Simplified to total for demo

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      
      <div className="flex justify-between items-end border-b border-[#e5e0d8] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-[#050505]">OVERVIEW</h1>
          <p className="text-xs tracking-widest text-[#666] mt-1">Operational snapshot for MW Trends.</p>
        </div>
      </div>

      {/* ACTION CENTER */}
      <section>
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mb-4">ACTION CENTER</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link href="/admin/orders?status=pending" className="block bg-white border border-[#e5e0d8] p-6 shadow-sm hover:border-[#D4AF37] transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold tracking-widest text-[#050505]">PENDING ORDERS</span>
              <span className="w-2 h-2 rounded-full bg-red-500" />
            </div>
            <p className="text-3xl font-bold">{pendingCount}</p>
            <p className="text-[10px] text-[#666] tracking-widest mt-2 group-hover:text-[#D4AF37]">Awaiting confirmation →</p>
          </Link>

          <Link href="/admin/custom-orders" className="block bg-[#111] text-[#F7F4ED] border border-[#222] p-6 shadow-sm hover:border-[#D4AF37] transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold tracking-widest text-[#888]">DESIGN REVIEW QUEUE</span>
              {designReviewCount > 0 && <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
            </div>
            <p className="text-3xl font-bold">{designReviewCount}</p>
            <p className="text-[10px] text-[#888] tracking-widest mt-2 group-hover:text-[#D4AF37]">Custom files need approval →</p>
          </Link>

          <Link href="/admin/products?filter=low_stock" className="block bg-white border border-[#e5e0d8] p-6 shadow-sm hover:border-[#D4AF37] transition-colors group">
             <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold tracking-widest text-[#050505]">LOW STOCK ALERTS</span>
            </div>
            <p className="text-3xl font-bold">2</p>
            <p className="text-[10px] text-[#666] tracking-widest mt-2 group-hover:text-[#D4AF37]">Review inventory →</p>
          </Link>

        </div>
      </section>

      {/* KPI METRICS */}
      <section>
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mb-4 mt-12">STORE METRICS (DEMO)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white border border-[#e5e0d8] p-6">
            <span className="text-[10px] font-bold tracking-widest text-[#666] block mb-2">REVENUE</span>
            <p className="text-lg font-bold">Rs. {todayRevenue.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white border border-[#e5e0d8] p-6">
            <span className="text-[10px] font-bold tracking-widest text-[#666] block mb-2">TOTAL ORDERS</span>
            <p className="text-lg font-bold">{orders.length}</p>
          </div>
          <div className="bg-white border border-[#e5e0d8] p-6">
            <span className="text-[10px] font-bold tracking-widest text-[#666] block mb-2">CUSTOM %</span>
            <p className="text-lg font-bold">{Math.round((orders.filter(o => o.items.some(i => i.isCustom)).length / (orders.length || 1)) * 100)}%</p>
          </div>
          <div className="bg-white border border-[#e5e0d8] p-6">
            <span className="text-[10px] font-bold tracking-widest text-[#666] block mb-2">VISITORS</span>
            <p className="text-lg font-bold">1,248</p>
          </div>
        </div>
      </section>

    </div>
  );
}
