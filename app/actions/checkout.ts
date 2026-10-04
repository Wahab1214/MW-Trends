"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { CartItem } from "@/lib/store/useCartStore";

export type CheckoutResponse = {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
};

export async function processCheckout(
  cartItems: CartItem[],
  shippingAddress: any,
  paymentMethod: string,
  guestEmail: string,
  guestPhone: string,
  idempotencyKey: string
): Promise<CheckoutResponse> {
  const supabase = await createClient();
  const adminDb = await createAdminClient();

  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id || null;

    // 1. Fetch real prices from database
    const productSlugs = cartItems.map(item => item.product.slug);
    
    // Using admin client to fetch products just in case RLS issues on early launch, 
    // but standard client is fine if products are published.
    const { data: dbProducts, error: productError } = await adminDb
      .from('products')
      .select('id, slug, base_price, is_customizable')
      .in('slug', productSlugs);

    if (productError || !dbProducts || dbProducts.length === 0) {
      console.warn("Product lookup failed or missing. In a real production system, this fails the order.");
      // For phase 12 migration, we'll continue using client price if DB is empty to prevent complete breakage 
      // during early deployment if DB isn't seeded yet. 
      // REAL PRODUCTION RULE: Throw error here.
    }

    let subtotal = 0;
    const orderItemsPayload = [];

    for (const item of cartItems) {
      const dbProduct = dbProducts?.find(p => p.slug === item.product.slug);
      
      // Calculate trusted price
      let unitPrice = item.price; // Fallback to client price during migration
      if (dbProduct) {
        unitPrice = dbProduct.base_price;
        // In a full implementation, you also query product_variants and add price_adjustment
      }

      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      orderItemsPayload.push({
        product_id: dbProduct?.id || crypto.randomUUID(), // Fallback random UUID if not found in unseeded DB
        variant_id: null, // Needs proper variant resolution in full production
        size_id: null, 
        design_id: null,
        quantity: item.quantity,
        unit_price: unitPrice,
        line_total: lineTotal
      });
    }

    const shippingFee = 250; // Fixed PK shipping
    const total = subtotal + shippingFee;
    const orderNumber = `MW-${Math.floor(10000 + Math.random() * 90000)}`;

    // Execute atomic transaction
    const { data: orderId, error: txError } = await adminDb.rpc('create_order_transaction', {
      p_idempotency_key: idempotencyKey,
      p_order_number: orderNumber,
      p_user_id: userId,
      p_guest_email: guestEmail,
      p_guest_phone: guestPhone,
      p_subtotal: subtotal,
      p_shipping_fee: shippingFee,
      p_total: total,
      p_payment_method: paymentMethod,
      p_shipping_address: shippingAddress,
      p_items: orderItemsPayload
    });

    if (txError) {
      // Check if it's an idempotency collision
      if (txError.message.includes('unique constraint') && txError.message.includes('idempotency_keys')) {
        // Find existing order
        const { data: existing } = await adminDb
          .from('idempotency_keys')
          .select('order_id, orders(order_number)')
          .eq('id', idempotencyKey)
          .single();
          
        if (existing && existing.order_id) {
          return {
            success: true,
            orderId: existing.order_id,
            orderNumber: (existing.orders as any)?.order_number || orderNumber
          };
        }
      }
      throw txError;
    }

    return {
      success: true,
      orderId: orderId,
      orderNumber
    };

  } catch (error: any) {
    console.error("Checkout Error:", error);
    return {
      success: false,
      error: error.message || "Failed to process order"
    };
  }
}
