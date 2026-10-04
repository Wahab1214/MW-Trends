"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { orderService, ShippingAddress } from "@/lib/services/orderService";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { analytics } from "@/lib/analytics/eventBus";

const PROVINCES = [
  "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", 
  "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Jammu & Kashmir"
];

export default function CheckoutClient() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    email: "",
    addressLine1: "",
    city: "",
    province: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shippingFee;

  useEffect(() => {
    // Guard: Prevent checkout with empty cart
    if (items.length === 0) {
      router.replace('/shop');
    }
  }, [items, router]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Valid email is required";
    
    // Pakistani Phone Validation (03XX XXXXXXX or +923XX XXXXXXX)
    const phoneClean = formData.phone.replace(/[\s-]/g, '');
    if (!/^(03\d{9}|\+923\d{9})$/.test(phoneClean)) {
      newErrors.phone = "Valid Pakistan phone required (e.g. 0300 1234567)";
    }

    if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.province.trim()) newErrors.province = "Province is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submit
    setSubmitError("");

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const idempotencyKey = crypto.randomUUID();
      const response = await import('@/app/actions/checkout').then(m => m.processCheckout(
        items,
        formData,
        'COD',
        formData.email || '',
        formData.phone || '',
        idempotencyKey
      ));

      if (!response.success) {
        throw new Error(response.error);
      }
      
      // Phase 10: Strict Analytics tracking WITHOUT PII
      analytics.track('purchase', {
        transaction_id: response.orderNumber || 'unknown',
        value: total,
        currency: 'PKR',
        items: items.map(item => ({
          item_id: item.product.sku || item.product.slug,
          item_name: item.product.name,
          price: item.price,
          quantity: item.quantity
        }))
      });

      clearCart();
      router.push(`/order-confirmation/${response.orderId}`);
    } catch (err) {
      console.error("Checkout failed:", err);
      setSubmitError("We couldn't confirm your order yet. Your bag is safe. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#F7F4ED] text-[#050505] font-sans selection:bg-[#D4AF37] selection:text-[#050505] pointer-events-auto">
      {/* Checkout Header Minimal */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-[#e5e0d8] bg-white sticky top-0 z-50">
        <Link href="/cart" className="text-xs font-semibold tracking-widest text-[#666] hover:text-[#050505] transition-colors">
          ← BACK TO BAG
        </Link>
        <span className="text-sm font-bold tracking-[0.2em]">MW TRENDS</span>
        <span className="text-[10px] tracking-widest font-bold text-[#888] hidden md:block">SECURE CHECKOUT</span>
      </header>

      <main className="max-w-[1200px] mx-auto p-4 lg:p-12 flex flex-col-reverse lg:flex-row gap-12 lg:gap-24">
        
        {/* LEFT: Form */}
        <div className="flex-[3]">
          {submitError && (
            <div className="p-4 border border-red-500 bg-red-50 text-red-700 text-xs font-bold tracking-widest mb-8">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Contact */}
            <section>
              <h2 className="text-xs font-bold tracking-[0.2em] mb-6 pb-2 border-b border-[#e5e0d8] text-[#888]">1. CONTACT</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Name" name="fullName" value={formData.fullName} error={errors.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                <Input label="Email Address" type="email" name="email" value={formData.email} error={errors.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <Input label="Phone Number" name="phone" placeholder="03XX XXXXXXX" value={formData.phone} error={errors.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="md:col-span-2" />
              </div>
            </section>

            {/* Delivery */}
            <section>
              <h2 className="text-xs font-bold tracking-[0.2em] mb-6 pb-2 border-b border-[#e5e0d8] text-[#888]">2. DELIVERY ADDRESS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Address Line 1" name="addressLine1" value={formData.addressLine1} error={errors.addressLine1} onChange={(e) => setFormData({...formData, addressLine1: e.target.value})} className="md:col-span-2" />
                <Input label="Apartment, suite, etc. (optional)" name="addressLine2" value={formData.addressLine2 || ''} onChange={(e) => setFormData({...formData, addressLine2: e.target.value})} className="md:col-span-2" />
                <Input label="City" name="city" value={formData.city} error={errors.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-widest font-bold text-[#666]">PROVINCE</label>
                  <select 
                    value={formData.province} 
                    onChange={(e) => setFormData({...formData, province: e.target.value})}
                    className={`w-full p-4 bg-white border ${errors.province ? 'border-red-500' : 'border-[#d5d0c8]'} focus:outline-none focus:border-[#050505] rounded-none text-sm transition-colors`}
                  >
                    <option value="" disabled>Select province...</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.province && <span className="text-xs text-red-500">{errors.province}</span>}
                </div>
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="text-xs font-bold tracking-[0.2em] mb-6 pb-2 border-b border-[#e5e0d8] text-[#888]">3. PAYMENT METHOD</h2>
              <div className="p-6 border-2 border-[#D4AF37] bg-white flex items-center justify-between relative overflow-hidden group cursor-default">
                <div className="flex flex-col relative z-10">
                  <span className="font-bold tracking-widest text-sm mb-1">CASH ON DELIVERY</span>
                  <span className="text-xs text-[#666]">Pay when your order is delivered.</span>
                </div>
                <div className="w-6 h-6 border border-[#D4AF37] rotate-45 flex items-center justify-center bg-[#F7F4ED] z-10">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
                </div>
              </div>
            </section>

            {/* Mobile CTA */}
            <div className="lg:hidden block pt-8 border-t border-[#e5e0d8]">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#050505] text-[#F7F4ED] font-bold tracking-[0.2em] text-sm text-center hover:bg-[#333] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'PLACING ORDER...' : 'PLACE COD ORDER'}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="flex-[2] lg:sticky lg:top-24 h-max">
          <div className="bg-white border border-[#e5e0d8] p-6 lg:p-8 flex flex-col shadow-sm">
            
            {/* Desktop CTA at top for clarity or bottom */}
            <h2 className="text-sm font-bold tracking-widest mb-6 border-b border-[#e5e0d8] pb-4">ORDER SUMMARY</h2>

            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-20 bg-[#F7F4ED] relative shrink-0 border border-[#e5e0d8]">
                    {item.designConfig && item.designConfig.length > 0 ? (
                      <div className="absolute inset-0 flex items-center justify-center text-[6px] text-[#D4AF37] font-bold border border-[#D4AF37]/30 bg-[#111]">CUSTOM<br/>PREVIEW</div>
                    ) : (
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover mix-blend-multiply" />
                    )}
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#050505] text-[#F7F4ED] text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-xs font-bold">{item.product.name}</h4>
                    <p className="text-[10px] text-[#666] tracking-widest mt-1">
                      {item.variant?.name} {item.size && `/ ${item.size.label}`}
                    </p>
                    <p className="text-xs font-bold mt-2">Rs. {item.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-xs tracking-widest mb-8 border-t border-[#e5e0d8] pt-6">
              <div className="flex justify-between text-[#666]">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#666]">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-[#050505] border-t border-[#e5e0d8] pt-4 mt-2">
                <span>TOTAL</span>
                <span>Rs. {total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="hidden lg:block w-full py-4 bg-[#050505] text-[#F7F4ED] font-bold tracking-[0.2em] text-sm text-center hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'PLACING ORDER...' : 'PLACE COD ORDER'}
            </button>

            {/* Trust Block */}
            <div className="mt-8 pt-6 border-t border-[#e5e0d8] space-y-3 text-[10px] tracking-widest text-[#888]">
              <p className="flex items-center gap-2">✓ Cash on Delivery verified</p>
              <p className="flex items-center gap-2">✓ Order tracking available after purchase</p>
              {items.some(i => i.designConfig) && (
                <p className="flex items-center gap-2 text-[#D4AF37]">✓ Custom designs snapshot preserved</p>
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

// Simple Input wrapper
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-[10px] tracking-widest font-bold text-[#666]">{label}</label>
      <input 
        className={`w-full p-4 bg-white border ${error ? 'border-red-500' : 'border-[#d5d0c8]'} focus:outline-none focus:border-[#050505] placeholder:text-[#ccc] transition-colors`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
