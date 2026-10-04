"use client";

import { useEffect, useState } from "react";
import { orderService, Order, OrderItem } from "@/lib/services/orderService";
import { adminService } from "@/lib/services/adminService";
import Link from "next/link";
import Image from "next/image";

export default function ProductionQueue() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getAllOrders().then(res => {
      // Filter orders that have custom items
      const customOrders = res.filter(o => o.items.some(i => i.isCustom));
      setOrders(customOrders);
      setLoading(false);
    });
  }, []);

  const handleApproveDesign = async (orderId: string) => {
    if (!adminService.hasPermission('design.review')) {
      alert("Permission denied: Requires design.review");
      return;
    }
    await orderService.updateOrderStatus(orderId, 'PROCESSING');
    adminService.logAction('DESIGN_APPROVED', 'Order', orderId, `Approved custom design for production.`);
    setOrders(orders.map(o => o.id === orderId ? { ...o, orderStatus: 'PROCESSING' } : o));
  };

  const handleFailQC = async (orderId: string) => {
    if (!adminService.hasPermission('design.review')) {
      alert("Permission denied");
      return;
    }
    const reason = prompt("Enter reason for QC failure:");
    if (!reason) return;
    
    // In real app, might revert to a specific 'QC_FAILED' state.
    // Here we'll set it back to RECEIVED for re-review and log it.
    await orderService.updateOrderStatus(orderId, 'RECEIVED');
    adminService.logAction('QC_FAILED', 'Order', orderId, `QC Failed: ${reason}`);
    setOrders(orders.map(o => o.id === orderId ? { ...o, orderStatus: 'RECEIVED' } : o));
  };

  if (loading) return null;

  return (
    <div className="space-y-6 max-w-[1400px]">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#e5e0d8] pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-[#050505]">PRODUCTION QUEUE</h1>
          <p className="text-xs tracking-widest text-[#666] mt-1">Review designs, manage printing, and QC.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* DESIGN REVIEW COLUMN */}
        <div className="bg-[#f0eee9] p-4 flex flex-col gap-4 border border-[#e5e0d8]">
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#050505] flex justify-between items-center border-b border-[#d5d0c8] pb-2">
            DESIGN REVIEW
            <span className="bg-[#050505] text-[#F7F4ED] px-2 py-0.5 rounded-full">{orders.filter(o => o.orderStatus === 'RECEIVED').length}</span>
          </h2>
          
          {orders.filter(o => o.orderStatus === 'RECEIVED').map(order => (
            <div key={order.id} className="bg-white border border-[#e5e0d8] p-4 shadow-sm group">
              <div className="flex justify-between items-start mb-2">
                <Link href={`/admin/orders/${order.id}`} className="text-xs font-bold hover:text-[#D4AF37] hover:underline underline-offset-2">
                  {order.orderNumber}
                </Link>
                <span className="text-[9px] text-[#888]">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-[10px] text-[#666] mb-4 line-clamp-2">
                {order.items.filter(i => i.isCustom).map(i => i.productName).join(', ')}
              </div>
              
              <div className="h-24 bg-[#111] mb-4 relative flex items-center justify-center border border-[#333]">
                 {/* Simulate rendering custom payload */}
                 {order.items.find(i => i.isCustom)?.designConfig?.map((el: any, idx: number) => (
                    <span key={idx} className="text-white font-bold opacity-80" style={{ fontFamily: el.font }}>{el.content}</span>
                 ))}
                 <div className="absolute inset-0 bg-[#0a0a0b]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button className="text-[9px] font-bold text-white tracking-widest border border-white px-3 py-1 hover:bg-white hover:text-black">
                      DOWNLOAD ASSETS
                    </button>
                 </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleApproveDesign(order.id)}
                  className="flex-1 py-2 bg-[#050505] text-[#F7F4ED] text-[9px] font-bold tracking-widest hover:bg-[#333] transition-colors"
                >
                  APPROVE
                </button>
                <button className="flex-1 py-2 border border-[#d5d0c8] text-[#050505] text-[9px] font-bold tracking-widest hover:bg-[#e5e0d8] transition-colors">
                  HOLD
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PRINTING COLUMN */}
        <div className="bg-[#f0eee9] p-4 flex flex-col gap-4 border border-[#e5e0d8]">
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#050505] flex justify-between items-center border-b border-[#d5d0c8] pb-2">
            PRINTING
            <span className="bg-[#050505] text-[#F7F4ED] px-2 py-0.5 rounded-full">{orders.filter(o => o.orderStatus === 'PROCESSING').length}</span>
          </h2>

          {orders.filter(o => o.orderStatus === 'PROCESSING').map(order => (
            <div key={order.id} className="bg-white border border-[#e5e0d8] p-4 shadow-sm group">
              <div className="flex justify-between items-start mb-2">
                <Link href={`/admin/orders/${order.id}`} className="text-xs font-bold hover:text-[#D4AF37] hover:underline underline-offset-2">
                  {order.orderNumber}
                </Link>
              </div>
              <div className="text-[10px] text-[#666] mb-4">
                Assigned: System Auto
              </div>
              
              <div className="flex gap-2 border-t border-[#e5e0d8] pt-3">
                <button 
                  onClick={async () => {
                    await orderService.updateOrderStatus(order.id, 'SHIPPED');
                    adminService.logAction('QC_PASSED', 'Order', order.id, `Passed QC and marked SHIPPED.`);
                    setOrders(orders.map(o => o.id === order.id ? { ...o, orderStatus: 'SHIPPED' } : o));
                  }}
                  className="flex-1 py-2 bg-green-600 text-white text-[9px] font-bold tracking-widest hover:bg-green-700 transition-colors"
                >
                  QC PASS → PACK
                </button>
                <button 
                  onClick={() => handleFailQC(order.id)}
                  className="flex-1 py-2 border border-red-200 text-red-600 text-[9px] font-bold tracking-widest hover:bg-red-50 transition-colors"
                >
                  FAIL QC
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* READY TO DISPATCH COLUMN */}
        <div className="bg-[#f0eee9] p-4 flex flex-col gap-4 border border-[#e5e0d8]">
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#050505] flex justify-between items-center border-b border-[#d5d0c8] pb-2">
            READY TO DISPATCH
            <span className="bg-[#050505] text-[#F7F4ED] px-2 py-0.5 rounded-full">{orders.filter(o => o.orderStatus === 'SHIPPED').length}</span>
          </h2>

          {orders.filter(o => o.orderStatus === 'SHIPPED').map(order => (
             <div key={order.id} className="bg-white border border-[#e5e0d8] p-4 shadow-sm opacity-70">
               <Link href={`/admin/orders/${order.id}`} className="text-xs font-bold text-[#050505] block mb-1">
                 {order.orderNumber}
               </Link>
               <p className="text-[10px] text-[#666]">Awaiting courier pickup.</p>
             </div>
          ))}
        </div>

      </div>

    </div>
  );
}
