"use client";

import { useState } from "react";
import { orderService, Order } from "@/lib/services/orderService";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Define the Journey Stages
const STANDARD_STAGES = [
  { id: 'RECEIVED', label: 'Order Received' },
  { id: 'PROCESSING', label: 'Preparation' },
  { id: 'SHIPPED', label: 'Shipped' },
  { id: 'DELIVERED', label: 'Delivered' }
];

const CUSTOM_STAGES = [
  { id: 'RECEIVED', label: 'Order Received' },
  { id: 'PROCESSING', label: 'Printing' }, // Merged design review & print for simplicity
  { id: 'SHIPPED', label: 'Shipped' },
  { id: 'DELIVERED', label: 'Delivered' }
];

export default function TrackingClient() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await orderService.guestTrackOrder(orderNumber, phone);
      if (result) {
        setOrder(result);
      } else {
        setError("WE COULDN'T FIND THAT ORDER. Check your order number and phone number.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasCustom = order?.items.some(i => i.isCustom);
  const stages = hasCustom ? CUSTOM_STAGES : STANDARD_STAGES;
  
  // Find current stage index based on orderStatus
  const getCurrentIndex = () => {
    if (!order) return -1;
    switch(order.orderStatus) {
      case 'RECEIVED': case 'CONFIRMED': return 0;
      case 'PROCESSING': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      default: return 0;
    }
  };
  
  const currentIndex = getCurrentIndex();

  return (
    <div className="min-h-screen bg-[#F7F4ED] text-[#050505] font-sans selection:bg-[#D4AF37] selection:text-[#050505] pointer-events-auto">
      <header className="h-16 flex items-center justify-between px-8 border-b border-[#e5e0d8] bg-white sticky top-0 z-50">
        <Link href="/" className="text-sm font-bold tracking-[0.2em]">MW TRENDS</Link>
        <Link href="/account" className="text-xs font-semibold tracking-widest text-[#666] hover:text-[#050505] transition-colors">
          MY MW
        </Link>
      </header>

      <main className="max-w-[1000px] mx-auto p-4 md:p-12 pb-24">
        {!order ? (
          <div className="max-w-md mx-auto mt-12 bg-white border border-[#e5e0d8] p-8 shadow-sm">
            <h1 className="text-xl font-bold tracking-widest mb-2 text-center">TRACK ORDER</h1>
            <p className="text-xs text-[#666] tracking-widest text-center mb-8">Enter your details to follow the MW Journey.</p>
            
            {error && (
              <div className="p-4 border border-red-500 bg-red-50 text-red-700 text-xs font-bold tracking-widest mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleTrack} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-widest font-bold text-[#666]">ORDER NUMBER</label>
                <input 
                  type="text" 
                  placeholder="e.g. MW26-12345" 
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full p-4 bg-white border border-[#d5d0c8] focus:outline-none focus:border-[#050505] transition-colors uppercase"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-widest font-bold text-[#666]">PHONE NUMBER OR EMAIL</label>
                <input 
                  type="text" 
                  placeholder="03XX XXXXXXX" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-4 bg-white border border-[#d5d0c8] focus:outline-none focus:border-[#050505] transition-colors"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#050505] text-[#F7F4ED] font-bold tracking-[0.2em] text-sm hover:bg-[#333] transition-colors disabled:opacity-50"
              >
                {loading ? 'SEARCHING...' : 'TRACK ORDER'}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-widest mb-2">ORDER #{order.orderNumber}</h1>
              <p className="text-sm tracking-widest text-[#666]">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            {/* The MW Journey Tracking Timeline */}
            <div className="bg-white border border-[#e5e0d8] p-8 shadow-sm">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mb-12 text-center">THE MW JOURNEY</h3>
              
              {/* Desktop Horizontal Path */}
              <div className="relative hidden md:flex justify-between items-center px-12">
                {/* Background Track */}
                <div className="absolute top-1/2 left-12 right-12 h-[2px] bg-[#e5e0d8] -translate-y-1/2 z-0" />
                {/* Progress Track */}
                <motion.div 
                  className="absolute top-1/2 left-12 h-[2px] bg-[#D4AF37] -translate-y-1/2 z-0 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: currentIndex > 0 ? (currentIndex / (stages.length - 1)) : 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                />

                {stages.map((stage, i) => {
                  const isActive = i === currentIndex;
                  const isPast = i < currentIndex;
                  return (
                    <div key={stage.id} className="relative z-10 flex flex-col items-center">
                      <motion.div 
                        className={`w-6 h-6 rotate-45 flex items-center justify-center border-2 mb-4 transition-colors duration-500
                          ${isActive ? 'border-[#D4AF37] bg-white' : isPast ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#d5d0c8] bg-white'}
                        `}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {isActive && (
                          <motion.div className="w-2 h-2 bg-[#D4AF37]" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
                        )}
                      </motion.div>
                      <span className={`text-[10px] tracking-widest font-bold absolute top-10 whitespace-nowrap
                        ${isActive ? 'text-[#D4AF37]' : isPast ? 'text-[#050505]' : 'text-[#888]'}
                      `}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Vertical Path */}
              <div className="relative md:hidden flex flex-col gap-12 pl-4 border-l-2 border-[#e5e0d8] ml-4">
                {stages.map((stage, i) => {
                  const isActive = i === currentIndex;
                  const isPast = i < currentIndex;
                  return (
                    <div key={stage.id} className="relative">
                      <motion.div 
                        className={`absolute -left-[22px] top-0 w-4 h-4 rotate-45 flex items-center justify-center border transition-colors duration-500
                          ${isActive ? 'border-[#D4AF37] bg-white' : isPast ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#d5d0c8] bg-white'}
                        `}
                      >
                         {isActive && <div className="w-1.5 h-1.5 bg-[#D4AF37]" />}
                      </motion.div>
                      <span className={`text-xs tracking-widest font-bold pl-4
                        ${isActive ? 'text-[#D4AF37]' : isPast ? 'text-[#050505]' : 'text-[#888]'}
                      `}>
                        {stage.label}
                      </span>
                      {isActive && (
                        <p className="text-[10px] tracking-widest text-[#666] pl-4 mt-2">
                          {stage.id === 'PROCESSING' && order.items.some(i => i.isCustom) 
                            ? 'Your custom design is being reviewed and printed.' 
                            : 'Currently in progress.'}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Snapshot & Safe Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-[#e5e0d8] p-8">
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mb-6">ITEMS IN ORDER</h3>
                <div className="space-y-6">
                  {order.items.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-20 bg-[#F7F4ED] relative shrink-0 border border-[#e5e0d8]">
                        {item.isCustom ? (
                          <div className="absolute inset-0 flex items-center justify-center text-[6px] text-[#D4AF37] font-bold border border-[#D4AF37]/30 bg-[#111] text-center">CUSTOM<br/>DESIGN</div>
                        ) : (
                          <Image src={item.productImage} alt={item.productName} fill className="object-cover mix-blend-multiply" />
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-xs font-bold">{item.productName}</h4>
                        <p className="text-[10px] text-[#666] tracking-widest mt-1">
                          {item.variantName} {item.sizeLabel && `/ ${item.sizeLabel}`}
                        </p>
                        <p className="text-[10px] text-[#888] mt-1">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#111] text-[#F7F4ED] p-8 border border-[#222] flex flex-col justify-between">
                <div>
                  <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#888] mb-4">DELIVERY DESTINATION</h3>
                  <p className="text-sm font-bold tracking-widest">{order.shippingAddress.city}, {order.shippingAddress.province}</p>
                  <p className="text-xs text-[#888] tracking-widest mt-2">(Full address hidden for guest tracking privacy)</p>
                </div>
                <div className="mt-8 pt-6 border-t border-[#333]">
                  <p className="text-xs font-bold tracking-widest mb-1">Total: Rs. {order.total.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-[#D4AF37] tracking-widest">{order.paymentMethod} • {order.paymentStatus}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button onClick={() => setOrder(null)} className="text-xs tracking-widest text-[#888] hover:text-[#050505] underline underline-offset-4">
                TRACK ANOTHER ORDER
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
