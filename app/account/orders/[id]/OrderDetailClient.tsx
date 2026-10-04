"use client";

import { useEffect, useState } from "react";
import { orderService, Order } from "@/lib/services/orderService";
import { useCartStore } from "@/lib/store/useCartStore";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OrderDetailClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    orderService.getOrder(orderId).then(res => {
      setOrder(res);
      setLoading(false);
    });
  }, [orderId]);

  if (loading) return null;

  if (!order) {
    return (
      <div className="text-center p-12 bg-white shadow-sm border border-[#e5e0d8]">
        <p className="text-sm tracking-widest text-[#666] mb-6">Order not found.</p>
        <Link href="/account/orders" className="text-xs font-bold tracking-[0.2em] underline underline-offset-4">BACK TO ORDERS</Link>
      </div>
    );
  }

  const handleReorder = (item: any) => {
    // In a real app, this would query the product catalog to ensure availability.
    if (item.isCustom) {
      // Custom reorder: in Phase 7 we route to Custom Lab with design context
      // But for prototype simplicity we'll just alert or do direct cart add if we wanted.
      addItem({
        product: { slug: item.productId, name: item.productName, price: item.unitPrice, images: [item.productImage] } as any,
        variant: { id: item.variantName?.toLowerCase(), name: item.variantName },
        size: { id: item.sizeLabel, label: item.sizeLabel, isAvailable: true },
        designConfig: item.designConfig
      });
      router.push('/cart');
    } else {
      addItem({
        product: { slug: item.productId, name: item.productName, price: item.unitPrice, images: [item.productImage] } as any,
        variant: { id: item.variantName?.toLowerCase(), name: item.variantName },
        size: { id: item.sizeLabel, label: item.sizeLabel, isAvailable: true },
      });
      router.push('/cart');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl">
      <Link href="/account/orders" className="text-[10px] font-bold tracking-widest text-[#666] hover:text-[#050505]">
        ← BACK TO ORDERS
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e5e0d8] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-widest">ORDER #{order.orderNumber}</h1>
          <p className="text-xs tracking-widest text-[#666] mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-4">
           {order.orderStatus !== 'DELIVERED' && (
             <Link href="/track-order" className="py-3 px-6 bg-[#050505] text-[#F7F4ED] text-[10px] font-bold tracking-[0.2em] text-center hover:bg-[#333]">
               TRACK ORDER
             </Link>
           )}
           <button className="py-3 px-6 border border-[#d5d0c8] text-[#050505] text-[10px] font-bold tracking-[0.2em] text-center hover:bg-[#e5e0d8]">
             NEED HELP?
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#e5e0d8] p-8 shadow-sm">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mb-6">ITEMS INCLUDED</h2>
            
            <div className="space-y-8">
              {order.items.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 border-b border-[#e5e0d8] pb-8 last:border-0 last:pb-0">
                  <div className="w-24 h-32 bg-[#F7F4ED] relative shrink-0 border border-[#e5e0d8]">
                    {item.isCustom ? (
                      <div className="absolute inset-0 flex items-center justify-center text-[8px] text-[#D4AF37] font-bold border border-[#D4AF37]/30 bg-[#111] text-center">CUSTOM<br/>DESIGN</div>
                    ) : (
                      <Image src={item.productImage} alt={item.productName} fill className="object-cover mix-blend-multiply" />
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold">{item.productName}</h3>
                      <p className="text-[10px] text-[#666] tracking-widest mt-1">
                        {item.variantName} {item.sizeLabel && `/ ${item.sizeLabel}`}
                      </p>
                      <p className="text-xs font-bold mt-2">Rs. {item.lineTotal.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-[#888] mt-1">Qty: {item.quantity}</p>
                    </div>

                    <div className="mt-4 flex gap-4">
                      <button 
                        onClick={() => handleReorder(item)}
                        className="text-[10px] font-bold tracking-widest text-[#050505] hover:text-[#D4AF37] underline underline-offset-4"
                      >
                        ORDER AGAIN
                      </button>
                      {item.isCustom && (
                        <span className="text-[10px] font-bold tracking-widest text-[#D4AF37]">
                          ✓ SNAPSHOT SAVED
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Summary */}
        <div className="space-y-6">
          <div className="bg-[#111] text-[#F7F4ED] border border-[#222] p-8 shadow-sm">
             <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mb-6">SUMMARY</h2>
             <div className="space-y-3 text-xs tracking-widest text-[#ccc]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.shippingFee === 0 ? 'FREE' : `Rs. ${order.shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white border-t border-[#333] pt-4 mt-2">
                  <span>TOTAL</span>
                  <span>Rs. {order.total.toLocaleString('en-IN')}</span>
                </div>
             </div>
             
             <div className="mt-8 pt-6 border-t border-[#333]">
               <p className="text-[10px] font-bold tracking-widest text-[#888] mb-2">PAYMENT STATUS</p>
               <p className="text-xs text-white">{order.paymentMethod} • {order.paymentStatus}</p>
             </div>
          </div>

          <div className="bg-white border border-[#e5e0d8] p-8 shadow-sm">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mb-4">DELIVERY ADDRESS</h2>
            <div className="text-sm text-[#050505] space-y-1">
              <p className="font-bold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
              <p className="text-[#666] mt-2">{order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
