// ===========================================================================
// MW TRENDS — PRODUCT CUSTOMIZATION & PRICE AUTHORITY ENGINE
// ===========================================================================

import { type Product, getProductBySlug } from './mockCatalog';

export interface CustomizationField {
  id: string;
  type: 'text' | 'select' | 'boolean' | 'file';
  label: string;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  options?: { label: string; value: string; surcharge?: number }[];
  surcharge: number;
  description?: string;
}

export interface CategoryCustomizationProfile {
  categorySlug: string;
  title: string;
  fields: CustomizationField[];
}

export const CATEGORY_CUSTOMIZATION_PROFILES: Record<string, CategoryCustomizationProfile> = {
  shirts: {
    categorySlug: 'shirts',
    title: 'Bespoke Atelier Monogramming',
    fields: [
      {
        id: 'customText',
        type: 'text',
        label: 'Embroidery Inscription (Initials / Name)',
        maxLength: 12,
        placeholder: 'e.g., W.A.',
        surcharge: 299,
        description: 'Hand-stitched in atelier with dense French thread.'
      },
      {
        id: 'font',
        type: 'select',
        label: 'Typography Style',
        surcharge: 0,
        options: [
          { label: 'Serif Atelier (Classic Roman)', value: 'serif' },
          { label: 'Modern Sans (Minimalist)', value: 'sans' },
          { label: 'Couture Script (Calligraphic)', value: 'script' }
        ]
      },
      {
        id: 'placement',
        type: 'select',
        label: 'Embroidery Placement',
        surcharge: 0,
        options: [
          { label: 'Chest Left (Above Heart)', value: 'chest-left' },
          { label: 'Right Cuff / Sleeve', value: 'cuff' },
          { label: 'Rear Neck Yoke', value: 'collar-back' }
        ]
      }
    ]
  },
  mugs: {
    categorySlug: 'mugs',
    title: 'Custom Ceramic Inscription & Gifting',
    fields: [
      {
        id: 'customText',
        type: 'text',
        label: 'Custom Ceramic Inscription / Name',
        maxLength: 20,
        placeholder: 'e.g., THE ARCHITECT',
        surcharge: 199,
        description: 'Permanently screen-printed and double-glazed.'
      },
      {
        id: 'printSide',
        type: 'select',
        label: 'Print Orientation',
        surcharge: 0,
        options: [
          { label: 'Front Display Only', value: 'front', surcharge: 0 },
          { label: 'Both Sides (+Rs. 150)', value: 'both', surcharge: 150 }
        ]
      },
      {
        id: 'giftBox',
        type: 'boolean',
        label: 'Luxury Gifting Presentation Box (+Rs. 250)',
        surcharge: 250,
        description: 'Hard-shell graphite box with gold debossed ribbon.'
      }
    ]
  },
  pens: {
    categorySlug: 'pens',
    title: 'Precision Laser Engraving & Presentation',
    fields: [
      {
        id: 'customText',
        type: 'text',
        label: 'Barrel Laser Engraving',
        maxLength: 15,
        placeholder: 'e.g., WAHAB ALI',
        surcharge: 249,
        description: 'Fiber-laser engraved into brushed solid brass.'
      },
      {
        id: 'font',
        type: 'select',
        label: 'Engraving Typeface',
        surcharge: 0,
        options: [
          { label: 'Executive Roman', value: 'serif' },
          { label: 'Architectural Sans', value: 'sans' },
          { label: 'Bespoke Script', value: 'script' }
        ]
      },
      {
        id: 'giftBox',
        type: 'boolean',
        label: 'American Walnut Presentation Case (+Rs. 350)',
        surcharge: 350,
        description: 'Solid walnut hinged case with velvet pen rest.'
      }
    ]
  },
  frames: {
    categorySlug: 'frames',
    title: 'Archival Mat Inscription & Fine Art Print',
    fields: [
      {
        id: 'customText',
        type: 'text',
        label: 'Museum Mat Inscription (Name & Date)',
        maxLength: 30,
        placeholder: 'e.g., The Atrium / Oct 2026',
        surcharge: 199,
        description: 'Letterpressed onto 100% cotton acid-free archival mat.'
      },
      {
        id: 'orientation',
        type: 'select',
        label: 'Mounting Orientation',
        surcharge: 0,
        options: [
          { label: 'Portrait (Vertical)', value: 'portrait' },
          { label: 'Landscape (Horizontal)', value: 'landscape' }
        ]
      },
      {
        id: 'photoUpload',
        type: 'file',
        label: 'Upload High-Resolution Art / Photo (+Rs. 299)',
        surcharge: 299,
        description: 'Giclée printed on 310gsm German etching rag paper.'
      }
    ]
  }
};

export interface SelectedCustomization {
  customText?: string;
  font?: string;
  placement?: string;
  printSide?: string;
  orientation?: string;
  photoUrl?: string;
  photoName?: string;
  giftBox?: boolean;
  giftNote?: string;
}

export interface ValidatedLineItemResult {
  isValid: boolean;
  product: Product;
  variantId: string | null;
  sizeId: string | null;
  quantity: number;
  basePrice: number;
  customizationSurcharge: number;
  totalUnitPrice: number;
  totalLinePrice: number;
  customizationSummary: string[];
  error?: string;
}

// ---------------------------------------------------------------------------
// SERVER-AUTHORITATIVE PRICE & CONFIGURATION VALIDATION
// ---------------------------------------------------------------------------
export function validateProductConfiguration(
  slug: string,
  variantId: string | null,
  sizeId: string | null,
  customization: SelectedCustomization | null,
  quantity: number
): ValidatedLineItemResult {
  const product = getProductBySlug(slug);

  if (!product) {
    throw new Error(`Product not found: "${slug}"`);
  }

  const safeQuantity = Math.max(1, Math.min(quantity || 1, 10));
  let basePrice = product.numericPrice;

  // Validate variant
  let resolvedVariant = null;
  if (product.variants && product.variants.length > 0) {
    if (variantId) {
      resolvedVariant = product.variants.find((v) => v.id === variantId) || null;
      if (!resolvedVariant) {
        return {
          isValid: false,
          product,
          variantId,
          sizeId,
          quantity: safeQuantity,
          basePrice,
          customizationSurcharge: 0,
          totalUnitPrice: basePrice,
          totalLinePrice: basePrice * safeQuantity,
          customizationSummary: [],
          error: 'Selected color variant is invalid or discontinued.'
        };
      }
    } else {
      resolvedVariant = product.variants[0];
    }
  }

  // Validate size if apparel
  let resolvedSize = null;
  if (product.sizes && product.sizes.length > 0) {
    if (!sizeId) {
      return {
        isValid: false,
        product,
        variantId: resolvedVariant?.id || null,
        sizeId,
        quantity: safeQuantity,
        basePrice,
        customizationSurcharge: 0,
        totalUnitPrice: basePrice,
        totalLinePrice: basePrice * safeQuantity,
        customizationSummary: [],
        error: 'Please select a size to continue.'
      };
    }
    resolvedSize = product.sizes.find((s) => s.id === sizeId) || null;
    if (!resolvedSize) {
      return {
        isValid: false,
        product,
        variantId: resolvedVariant?.id || null,
        sizeId,
        quantity: safeQuantity,
        basePrice,
        customizationSurcharge: 0,
        totalUnitPrice: basePrice,
        totalLinePrice: basePrice * safeQuantity,
        customizationSummary: [],
        error: 'Selected size is not available.'
      };
    }
    if (!resolvedSize.isAvailable) {
      return {
        isValid: false,
        product,
        variantId: resolvedVariant?.id || null,
        sizeId,
        quantity: safeQuantity,
        basePrice,
        customizationSurcharge: 0,
        totalUnitPrice: basePrice,
        totalLinePrice: basePrice * safeQuantity,
        customizationSummary: [],
        error: `Size ${resolvedSize.label} is currently out of stock.`
      };
    }
  }

  // Authoritatively compute customization surcharges
  let customizationSurcharge = 0;
  const customizationSummary: string[] = [];

  const profile = CATEGORY_CUSTOMIZATION_PROFILES[product.categorySlug];

  if (product.isCustomizable && profile && customization) {
    // 1. Text Inscription
    if (customization.customText && customization.customText.trim().length > 0) {
      const field = profile.fields.find((f) => f.id === 'customText');
      if (field) {
        const text = customization.customText.trim();
        if (field.maxLength && text.length > field.maxLength) {
          return {
            isValid: false,
            product,
            variantId: resolvedVariant?.id || null,
            sizeId: resolvedSize?.id || null,
            quantity: safeQuantity,
            basePrice,
            customizationSurcharge: 0,
            totalUnitPrice: basePrice,
            totalLinePrice: basePrice * safeQuantity,
            customizationSummary: [],
            error: `Custom inscription exceeds limit of ${field.maxLength} characters.`
          };
        }
        customizationSurcharge += field.surcharge;
        customizationSummary.push(`"${text.toUpperCase()}"`);
      }
    }

    // 2. Secondary options / Print side
    if (customization.printSide === 'both') {
      customizationSurcharge += 150;
      customizationSummary.push('Print: Both Sides');
    }

    // 3. Gift presentation box
    if (customization.giftBox) {
      const field = profile.fields.find((f) => f.id === 'giftBox');
      if (field) {
        customizationSurcharge += field.surcharge;
        customizationSummary.push('Presentation Gift Box');
      }
    }

    // 4. Photo upload
    if (customization.photoName || customization.photoUrl) {
      const field = profile.fields.find((f) => f.id === 'photoUpload');
      if (field) {
        customizationSurcharge += field.surcharge;
        customizationSummary.push(`Archival Art: ${customization.photoName || 'Uploaded Art'}`);
      }
    }

    // Placement details
    if (customization.placement) {
      customizationSummary.push(`Placement: ${customization.placement}`);
    }
  }

  const totalUnitPrice = basePrice + customizationSurcharge;
  const totalLinePrice = totalUnitPrice * safeQuantity;

  return {
    isValid: true,
    product,
    variantId: resolvedVariant?.id || null,
    sizeId: resolvedSize?.id || null,
    quantity: safeQuantity,
    basePrice,
    customizationSurcharge,
    totalUnitPrice,
    totalLinePrice,
    customizationSummary
  };
}
