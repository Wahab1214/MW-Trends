"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/useCartStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MiniCart() {
  const [mounted, setMounted] = useState(false);
  const {
    items,
    isMiniCartOpen,
    setMiniCartOpen,
    updateQuantity,
    removeItem,
    undoRemove,
    recentlyRemoved
  } = useCartStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AnimatePresence>
      {isMiniCartOpen && (
        <>
          {/* Smoked Backdrop */}
          <motion.div
            className="fixed inset-0 bg-[#050505]/75 backdrop-blur-md z-[150]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMiniCartOpen(false)}
          />

          {/* Luxury Slide-in Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0A0908] border-l border-[#D4AF37]/25 z-[160] flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-[#24211E] flex justify-between items-center bg-[#0D0B0A] shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <h2 className="text-xs font-bold tracking-[0.28em] text-[#F7F4ED] uppercase">
                  ATELIER BAG ({totalItemCount})
                </h2>
              </div>
              <button
                onClick={() => setMiniCartOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#888] hover:text-[#D4AF37] hover:bg-[#1E1B18] transition-colors"
                aria-label="Close Shopping Bag"
              >
                ✕
              </button>
            </div>

            {/* Undo Notification Pill */}
            {recentlyRemoved && (
              <div className="mx-6 mt-4 p-3 rounded bg-[#181614] border border-[#D4AF37]/30 flex items-center justify-between text-xs animate-fadeIn">
                <span className="text-[#A3998C] text-[11px] truncate max-w-[240px]">
                  Removed {recentlyRemoved.product.name}
                </span>
                <button
                  onClick={undoRemove}
                  className="text-[10px] font-bold tracking-widest text-[#D4AF37] hover:underline uppercase"
                >
                  UNDO
                </button>
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 border border-[#D4AF37]/30 rotate-45 mb-6 flex items-center justify-center">
                    <div className="w-8 h-8 border border-[#333]" />
                  </div>
                  <h3 className="text-[#F7F4ED] tracking-[0.2em] text-xs font-bold mb-2 uppercase">
                    YOUR BAG IS EMPTY
                  </h3>
                  <p className="text-[#888] text-[11px] mb-8 max-w-xs leading-relaxed">
                    Explore the MW Trends boutiques to curate your collection.
                  </p>
                  <button
                    onClick={() => setMiniCartOpen(false)}
                    className="px-6 py-3 border border-[#D4AF37] text-[10px] tracking-[0.2em] font-bold text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
                  >
                    EXPLORE ATELIER
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const hasCustom = Boolean(
                    item.customization &&
                      (item.customization.customText ||
                        item.customization.giftBox ||
                        item.customization.printSide ||
                        item.customization.photoName)
                  );

                  return (
                    <div
                      key={item.id}
                      className="p-4 border border-[#24211E] bg-[#12100E] rounded relative group hover:border-[#D4AF37]/40 transition-colors"
                    >
                      <div className="flex gap-4">
                        {/* Thumbnail */}
                        <div className="w-20 h-24 relative bg-[#060605] border border-[#24211E] rounded shrink-0 overflow-hidden">
                          {item.product.images && item.product.images[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-[#888]">
                              MW
                            </div>
                          )}
                          {hasCustom && (
                            <span className="absolute bottom-0 inset-x-0 bg-[#D4AF37] text-black text-[7px] font-bold tracking-widest text-center py-0.5 uppercase">
                              BESPOKE
                            </span>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-xs font-bold tracking-wider text-[#F7F4ED] leading-snug">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-[#666] hover:text-[#E25555] text-xs transition-colors p-1"
                                aria-label="Remove Item"
                              >
                                ✕
                              </button>
                            </div>

                            {/* Attributes */}
                            <div className="text-[10px] tracking-wider text-[#A3998C] mt-1 space-y-0.5">
                              {item.variant && <p>COLOR: {item.variant.name.toUpperCase()}</p>}
                              {item.size && <p>SIZE: {item.size.label.toUpperCase()}</p>}
                            </div>

                            {/* Category Customization Details */}
                            {hasCustom && item.customization && (
                              <div className="mt-2 p-2 rounded bg-[#181614] border border-[#D4AF37]/20 text-[9px] space-y-1">
                                {item.customization.customText && (
                                  <div className="flex items-center gap-1.5 text-[#D4AF37]">
                                    <span className="font-bold">INSCRIPTION:</span>
                                    <span>&ldquo;{item.customization.customText.toUpperCase()}&rdquo;</span>
                                  </div>
                                )}
                                {item.customization.placement && (
                                  <div className="text-[#A3998C]">
                                    PLACEMENT: {item.customization.placement.toUpperCase()}
                                  </div>
                                )}
                                {item.customization.printSide === "both" && (
                                  <div className="text-[#A3998C]">PRINT: BOTH SIDES (+Rs. 150)</div>
                                )}
                                {item.customization.giftBox && (
                                  <div className="text-[#C8A86B]">
                                    PRESENTATION GIFT BOX (+Rs. {item.customization.surcharge || 250})
                                  </div>
                                )}
                                {item.customization.photoName && (
                                  <div className="text-[#A3998C] truncate max-w-[200px]">
                                    ART: {item.customization.photoName}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Price & Quantity Controls */}
                          <div className="flex justify-between items-end mt-3 pt-2 border-t border-[#1F1C1A]">
                            <div className="flex items-center gap-3 border border-[#333] px-2 py-1 rounded bg-[#0A0908]">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="text-[#888] hover:text-[#D4AF37] text-xs px-1"
                                aria-label="Decrease Quantity"
                              >
                                −
                              </button>
                              <span className="text-[11px] font-bold text-[#F7F4ED] w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-[#888] hover:text-[#D4AF37] text-xs px-1"
                                aria-label="Increase Quantity"
                              >
                                +
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-bold tracking-wider text-[#D4AF37]">
                                Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
                              </span>
                              {item.quantity > 1 && (
                                <span className="block text-[8px] text-[#666]">
                                  (Rs. {item.price.toLocaleString("en-IN")} each)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer / Subtotal & Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#24211E] bg-[#0D0B0A] shrink-0 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] tracking-[0.25em] text-[#888] block uppercase">
                      ESTIMATED SUBTOTAL
                    </span>
                    <span className="text-[9px] text-[#666]">Taxes & luxury delivery calculated at checkout</span>
                  </div>
                  <span className="text-base font-bold tracking-wider text-[#D4AF37]">
                    Rs. {subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/checkout"
                    onClick={() => setMiniCartOpen(false)}
                    className="block w-full py-4 bg-[#D4AF37] hover:bg-[#E5C358] text-black font-bold tracking-[0.22em] text-[11px] text-center rounded transition-colors uppercase"
                  >
                    PROCEED TO CHECKOUT
                  </Link>

                  <button
                    onClick={() => setMiniCartOpen(false)}
                    className="block w-full py-3 border border-[#333] hover:border-[#D4AF37] text-[#D3C7B8] hover:text-[#F7F4ED] font-bold tracking-[0.2em] text-[10px] text-center rounded transition-colors uppercase"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
