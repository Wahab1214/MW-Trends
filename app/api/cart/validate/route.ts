import { NextResponse } from 'next/server';
import { validateProductConfiguration, type SelectedCustomization } from '@/lib/data/productCustomizations';

export interface CartValidateRequestBody {
  items: Array<{
    slug: string;
    variantId?: string | null;
    sizeId?: string | null;
    customization?: SelectedCustomization | null;
    quantity: number;
  }>;
}

export async function POST(request: Request) {
  try {
    const body: CartValidateRequestBody = await request.json();

    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request: "items" must be an array.' },
        { status: 400 }
      );
    }

    if (body.items.length === 0) {
      return NextResponse.json({
        success: true,
        items: [],
        subtotal: 0,
        currency: 'PKR',
        formattedSubtotal: 'Rs. 0'
      });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of body.items) {
      const result = validateProductConfiguration(
        item.slug,
        item.variantId || null,
        item.sizeId || null,
        item.customization || null,
        item.quantity || 1
      );

      if (!result.isValid) {
        return NextResponse.json(
          {
            success: false,
            error: result.error || `Validation failed for product ${item.slug}`,
            failedItem: {
              slug: item.slug,
              variantId: item.variantId,
              sizeId: item.sizeId
            }
          },
          { status: 422 }
        );
      }

      subtotal += result.totalLinePrice;
      validatedItems.push({
        slug: item.slug,
        name: result.product.name,
        variantId: result.variantId,
        sizeId: result.sizeId,
        quantity: result.quantity,
        basePrice: result.basePrice,
        customizationSurcharge: result.customizationSurcharge,
        totalUnitPrice: result.totalUnitPrice,
        totalLinePrice: result.totalLinePrice,
        customizationSummary: result.customizationSummary
      });
    }

    return NextResponse.json({
      success: true,
      items: validatedItems,
      subtotal,
      currency: 'PKR',
      formattedSubtotal: `Rs. ${subtotal.toLocaleString('en-IN')}`
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during cart validation' },
      { status: 500 }
    );
  }
}
