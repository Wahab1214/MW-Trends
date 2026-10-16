import { NextResponse } from 'next/server';
import { validateProductConfiguration, type SelectedCustomization } from '@/lib/data/productCustomizations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, variantId, sizeId, customization, quantity } = body;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Product slug is required.' }, { status: 400 });
    }

    const result = validateProductConfiguration(
      slug,
      variantId || null,
      sizeId || null,
      customization || null,
      quantity || 1
    );

    return NextResponse.json({
      success: result.isValid,
      ...result,
      formattedUnitPrice: `Rs. ${result.totalUnitPrice.toLocaleString('en-IN')}`,
      formattedLinePrice: `Rs. ${result.totalLinePrice.toLocaleString('en-IN')}`
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Price check error' },
      { status: 500 }
    );
  }
}
