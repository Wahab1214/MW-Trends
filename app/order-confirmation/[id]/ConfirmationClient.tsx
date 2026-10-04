"use client";

import { useEffect, useState } from "react";
import { orderService, Order } from "@/lib/services/orderService";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function ConfirmationClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false); // Controls the "Order Lock" timing

  useEffect(() => {
    orderService.getOrder(orderId).then((res) => {
      setOrder(res);
      setLoading(false);
      
      // Trigger the MW Order Lock animation reveal
      setTimeout(() => setShowContent(true), 1200); 
    });
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4ED] flex items-center justify-center">
        <div className="w-12 h-12 border border-[#d5d0c8] rotate-45 flex items-center justify-center animate-pulse">
          <div className="w-4 h-4 bg-[#D4AF37]" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F7F4ED] text-[#050505] flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold tracking-widest mb-4">ORDER NOT FOUND</h1>
        <p className="text-sm tracking-widest text-[#666] mb-8">We couldn't retrieve the details for this order.</p>
        <Link href="/" className="px-8 py-4 bg-[#050505] text-[#F7F4ED] text-xs font-bold tracking-[0.2em] hover:bg-[#333]">
          RETURN TO MW WORLD
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4ED] text-[#050505] font-sans pointer-events-auto overflow-x-hidden">
      
      {/* MW Order Lock Signature Animation Overlay */}
      <AnimatePresence>
        {!showContent && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#F7F4ED]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Diagonal strokes */}
              <motion.div 
                className="absolute w-[200%] h-[1px] bg-[#d5d0c8] -rotate-45"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              <motion.div 
                className="absolute w-[200%] h-[1px] bg-[#d5d0c8] rotate-45"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              />
              {/* Diamond Lock */}
              <motion.div
                className="w-16 h-16 bg-[#D4AF37] rotate-45 z-10 flex items-center justify-center shadow-lg"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.6 }}
              >
                <span className="text-white -rotate-45 font-bold text-2xl">✓</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="h-16 flex items-center justify-center border-b border-[#e5e0d8] bg-white sticky top-0 z-40">
        <span className="text-sm font-bold tracking-[0.2em]">MW TRENDS</span>
      </header>

      <main className="max-w-[800px] mx-auto p-4 md:p-12 pb-24">
        
        <motion.div 
          className="text-center mb-16 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-12 h-12 bg-[#D4AF37] rotate-45 mx-auto mb-8 flex items-center justify-center">
            <span className="text-white -rotate-45 font-bold text-xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold tracking-widest mb-4">ORDER CONFIRMED</h1>
          <p className="text-sm tracking-widest text-[#666] mb-2">Thank you for choosing MW Trends, {order.shippingAddress.fullName.split(' ')[0]}.</p>
          <p className="text-xs tracking-widest text-[#888]">Order # {order.orderNumber}</p>
        </motion.div>

        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Order Details Grid */}
          <div className="bg-white border border-[#e5e0d8] p-8 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">
            <div>
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mb-4">DELIVERY ADDRESS</h3>
              <div className="text-sm text-[#050505] space-y-1">
                <p className="font-bold">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
                <p className="text-[#666] mt-2">{order.shippingAddress.phone}</p>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mb-4">PAYMENT METHOD</h3>
              <div className="text-sm text-[#050505] space-y-1">
                <p className="font-bold">Cash on Delivery (COD)</p>
                <p className="text-[#666]">Pay exactly Rs. {order.total.toLocaleString('en-IN')} upon delivery.</p>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="bg-white border border-[#e5e0d8] p-8 shadow-sm">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mb-6">ORDER ITEMS</h3>
            <div className="space-y-6">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-6 border-b border-[#e5e0d8] pb-6 last:border-0 last:pb-0">
                  <div className="w-20 h-24 bg-[#F7F4ED] relative shrink-0 border border-[#e5e0d8]">
                    {item.isCustom ? (
                      <div className="absolute inset-0 flex items-center justify-center text-[8px] text-[#D4AF37] font-bold border border-[#D4AF37]/30 bg-[#111] text-center">CUSTOM<br/>DESIGN</div>
                    ) : (
                      <Image src={item.productImage} alt={item.productName} fill className="object-cover mix-blend-multiply" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold">{item.productName}</h4>
                        <span className="text-sm font-bold">Rs. {item.lineTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-xs text-[#666] tracking-widest mt-1">
                        {item.variantName} {item.sizeLabel && `/ ${item.sizeLabel}`}
                      </p>
                      <p className="text-[10px] text-[#888] mt-1">Qty: {item.quantity}</p>
                    </div>
                    {item.isCustom && (
                      <span className="inline-block px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] font-bold tracking-widest mt-2 w-max">
                        DESIGN SNAPSHOT SAVED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-[#e5e0d8] pt-6 mt-6 space-y-3 text-xs tracking-widest text-[#666]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shippingFee === 0 ? 'FREE' : `Rs. ${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#050505] border-t border-[#e5e0d8] pt-4 mt-2">
                <span>TOTAL TO PAY</span>
                <span>Rs. {order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-[#111] text-[#F7F4ED] p-8 border border-[#222]">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mb-4">WHAT HAPPENS NEXT?</h3>
            <ol className="text-xs tracking-widest space-y-3 text-[#ccc] list-decimal list-inside">
              <li>Order received and locked into our system.</li>
              <li>{order.items.some(i => i.isCustom) ? 'Custom designs reviewed and sent to print.' : 'Items prepared for dispatch.'}</li>
              <li>Dispatched via our courier partners.</li>
              <li>Payment collected upon delivery.</li>
            </ol>
          </div>

          {/* CTAs */}
          <div className="flex flex-col md:flex-row gap-4 pt-8">
            <button className="flex-1 py-4 border border-[#050505] text-[#050505] font-bold tracking-[0.2em] text-xs text-center hover:bg-[#050505] hover:text-[#F7F4ED] transition-colors">
              TRACK ORDER
            </button>
            <Link href="/" className="flex-1 py-4 bg-[#050505] text-[#F7F4ED] font-bold tracking-[0.2em] text-xs text-center hover:bg-[#333] transition-colors">
              RETURN TO MW WORLD
            </Link>
          </div>

        </motion.div>

      </main>
    </div>
  );
}
