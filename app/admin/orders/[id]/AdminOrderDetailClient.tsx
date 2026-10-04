"use client";

import { useEffect, useState } from "react";
import { orderService, Order } from "@/lib/services/orderService";
import { adminService } from "@/lib/services/adminService";
import Link from "next/link";
import Image from "next/image";

export default function AdminOrderDetailClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [internalNote, setInternalNote] = useState("");

  const loadOrder = () => {
    orderService.getOrder(orderId).then(res => {
      setOrder(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus: Order['orderStatus']) => {
    if (!adminService.hasPermission('order.manage')) {
      alert("Permission denied: Requires order.manage");
      return;
    }

    if (confirm(`Change status to ${newStatus}?`)) {
      setStatusUpdating(true);
      await orderService.updateOrderStatus(orderId, newStatus);
      adminService.logAction('STATUS_UPDATE', 'Order', orderId, `Updated status to ${newStatus}`);
      loadOrder();
      setStatusUpdating(false);
    }
  };

  const handleAddNote = () => {
    if (!internalNote.trim()) return;
    adminService.logAction('NOTE_ADDED', 'Order', orderId, `Internal Note: ${internalNote}`);
    setInternalNote("");
    alert("Note added to Audit Log.");
  };

  if (loading) return null;
  if (!order) return <div className="p-8 text-[#888]">Order not found.</div>;

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#e5e0d8] pb-4 gap-4">
        <div>
          <Link href="/admin/orders" className="text-[10px] font-bold tracking-widest text-[#888] hover:text-[#050505] mb-4 block">← BACK TO ORDERS</Link>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-widest text-[#050505]">{order.orderNumber}</h1>
            <span className="px-2 py-1 text-[9px] font-bold tracking-widest border border-[#e5e0d8] bg-white">{new Date(order.createdAt).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#888]">WORKFLOW STAGE</p>
          <div className="flex gap-2">
            {['RECEIVED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((s) => (
              <button 
                key={s}
                disabled={statusUpdating}
                onClick={() => handleStatusChange(s as Order['orderStatus'])}
                className={`px-3 py-2 text-[9px] font-bold tracking-widest border transition-colors
                  ${order.orderStatus === s ? 'bg-[#050505] text-[#F7F4ED] border-[#050505]' : 'bg-white text-[#888] border-[#e5e0d8] hover:border-[#050505] hover:text-[#050505]'}
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-[#e5e0d8] p-6 shadow-sm">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mb-6 border-b border-[#e5e0d8] pb-4">ORDERED ITEMS (IMMUTABLE SNAPSHOT)</h2>
            
            <div className="space-y-6">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-6 border-b border-[#f0eee9] pb-6 last:border-0 last:pb-0">
                  <div className="w-20 h-28 bg-[#F7F4ED] relative shrink-0 border border-[#e5e0d8]">
                    {item.isCustom ? (
                      <div className="absolute inset-0 flex items-center justify-center text-[6px] text-[#D4AF37] font-bold border border-[#D4AF37]/30 bg-[#111] text-center">CUSTOM<br/>DESIGN</div>
                    ) : (
                      <Image src={item.productImage} alt={item.productName} fill className="object-cover mix-blend-multiply" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold">{item.productName}</h3>
                        <p className="text-[10px] text-[#666] tracking-widest mt-1">
                          {item.variantName} {item.sizeLabel && `/ ${item.sizeLabel}`}
                        </p>
                      </div>
                      <p className="text-sm font-bold">Rs. {item.unitPrice.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <p className="text-[10px] text-[#888]">Qty: {item.quantity}</p>
                      <p className="text-xs font-bold">Rs. {item.lineTotal.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#e5e0d8] p-6 shadow-sm">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mb-4 border-b border-[#e5e0d8] pb-4">INTERNAL NOTES</h2>
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Add a note visible only to staff..." 
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                className="flex-1 p-3 text-xs border border-[#d5d0c8] focus:outline-none focus:border-[#050505]"
              />
              <button onClick={handleAddNote} className="px-6 bg-[#050505] text-[#F7F4ED] text-[10px] font-bold tracking-widest hover:bg-[#333]">
                SAVE NOTE
              </button>
            </div>
            <p className="text-[9px] text-[#888] mt-2 italic">Notes are logged securely to the Audit Trail.</p>
          </div>
        </div>

        {/* Right Col: Customer & Summary */}
        <div className="space-y-8">
          
          <div className="bg-white border border-[#e5e0d8] p-6 shadow-sm">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mb-4 border-b border-[#e5e0d8] pb-4">CUSTOMER</h2>
            <div className="text-sm text-[#050505] space-y-2">
              <p className="font-bold text-base">{order.shippingAddress.fullName}</p>
              <div className="pt-2 text-xs text-[#666]">
                <p>📞 {order.shippingAddress.phone}</p>
                <p className="mt-1">✉️ customer@mwtrends.com</p>
              </div>
            </div>
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mt-6 mb-4 border-b border-[#e5e0d8] pb-4">SHIPPING</h2>
            <div className="text-xs text-[#666] space-y-1">
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
            </div>
          </div>

          <div className="bg-[#111] text-[#F7F4ED] border border-[#222] p-6 shadow-sm">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mb-4 border-b border-[#333] pb-4">FINANCIALS</h2>
            <div className="space-y-3 text-xs tracking-widest text-[#ccc]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shippingFee === 0 ? 'FREE' : `Rs. ${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white border-t border-[#333] pt-4 mt-2">
                <span>TOTAL</span>
                <span>Rs. {order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#333]">
              <p className="text-[10px] font-bold tracking-widest text-[#888] mb-1">PAYMENT: {order.paymentMethod}</p>
              <p className={`text-xs font-bold ${order.paymentStatus === 'PAID' ? 'text-green-400' : 'text-[#D4AF37]'}`}>
                {order.paymentStatus}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
