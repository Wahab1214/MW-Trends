import { CartItem } from "../store/useCartStore";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode?: string;
  landmark?: string;
  notes?: string;
}

export interface OrderItem {
  id: string; // The cart item composite ID
  productId: string;
  productName: string;
  productImage: string;
  variantName: string | null;
  sizeLabel: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  isCustom: boolean;
  designConfig?: any[]; // Snapshotted design array
}

export interface Order {
  id: string;
  orderNumber: string;
  shippingAddress: ShippingAddress;
  paymentMethod: 'COD' | 'BANK_TRANSFER' | 'CARD';
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  orderStatus: 'RECEIVED' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  paymentStatus: 'PENDING' | 'COD' | 'PAID';
  createdAt: number;
}

// Mock Database (persisted in localStorage for prototype)
const STORAGE_KEY = 'mw_mock_orders';

// Seeding Demo Data
const seedDemoOrders = (): Order[] => {
  const demoOrders: Order[] = [
    {
      id: 'MW26-90124',
      orderNumber: 'MW26-90124',
      shippingAddress: { fullName: "Ahmed Khan", phone: "03001234567", email: "ahmed@example.com", addressLine1: "123 Defense Phase 6", city: "Lahore", province: "Punjab" },
      paymentMethod: 'COD',
      items: [{
        id: 'midnight-tee-custom-1', productId: 'midnight-oversized-tee', productName: 'Midnight Oversized Tee', productImage: '/placeholder-tee-1.jpg', variantName: 'Graphite', sizeLabel: 'L', quantity: 1, unitPrice: 3499, lineTotal: 3499, isCustom: true,
        designConfig: [{ id: '1', type: 'text', content: 'ARCHIVE', x: 50, y: 30, scale: 1.5, fill: '#FFFFFF', font: 'sans-serif' }]
      }],
      subtotal: 3499, shippingFee: 250, total: 3749,
      orderStatus: 'PROCESSING', paymentStatus: 'COD', createdAt: Date.now() - 86400000 // 1 day ago
    },
    {
      id: 'MW26-88001',
      orderNumber: 'MW26-88001',
      shippingAddress: { fullName: "Ahmed Khan", phone: "03001234567", email: "ahmed@example.com", addressLine1: "123 Defense Phase 6", city: "Lahore", province: "Punjab" },
      paymentMethod: 'COD',
      items: [{
        id: 'mug-standard-1', productId: 'signature-mug', productName: 'Signature Mug', productImage: '/placeholder-mug-1.jpg', variantName: 'Bone', sizeLabel: null, quantity: 2, unitPrice: 899, lineTotal: 1798, isCustom: false
      }],
      subtotal: 1798, shippingFee: 250, total: 2048,
      orderStatus: 'SHIPPED', paymentStatus: 'COD', createdAt: Date.now() - 259200000 // 3 days ago
    },
    {
      id: 'MW26-77543',
      orderNumber: 'MW26-77543',
      shippingAddress: { fullName: "Ahmed Khan", phone: "03001234567", email: "ahmed@example.com", addressLine1: "123 Defense Phase 6", city: "Lahore", province: "Punjab" },
      paymentMethod: 'COD',
      items: [{
        id: 'frame-custom-1', productId: 'memory-frame-01', productName: 'Memory Frame 01', productImage: '/placeholder-frame-1.jpg', variantName: 'Matte Black', sizeLabel: null, quantity: 1, unitPrice: 1499, lineTotal: 1499, isCustom: true,
        designConfig: [{ id: '1', type: 'text', content: 'MOMENTS', x: 50, y: 50, scale: 2, fill: '#FFFFFF', font: 'serif' }]
      }],
      subtotal: 1499, shippingFee: 250, total: 1749,
      orderStatus: 'DELIVERED', paymentStatus: 'PAID', createdAt: Date.now() - 864000000 // 10 days ago
    }
  ];
  return demoOrders;
};

const getOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
  let data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const demo = seedDemoOrders();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    return demo;
  }
  return JSON.parse(data);
};

const saveOrders = (orders: Order[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }
};

export const orderService = {
  createOrder: async (cartItems: CartItem[], address: ShippingAddress, paymentMethod: 'COD' | 'BANK_TRANSFER' | 'CARD' = 'COD'): Promise<Order> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shippingFee = subtotal > 5000 ? 0 : 250;
    const total = subtotal + shippingFee;
    const orderNumber = `MW26-${Math.floor(10000 + Math.random() * 90000)}`;

    const items: OrderItem[] = cartItems.map(item => ({
      id: item.id,
      productId: item.product.slug,
      productName: item.product.name,
      productImage: item.product.images[0],
      variantName: item.variant?.name || null,
      sizeLabel: item.size?.label || null,
      quantity: item.quantity,
      unitPrice: item.price,
      lineTotal: item.price * item.quantity,
      isCustom: !!item.designConfig && item.designConfig.length > 0,
      designConfig: item.designConfig ? JSON.parse(JSON.stringify(item.designConfig)) : undefined
    }));

    const newOrder: Order = {
      id: orderNumber, orderNumber, shippingAddress: address, paymentMethod, items, subtotal, shippingFee, total,
      orderStatus: 'RECEIVED', paymentStatus: paymentMethod === 'COD' ? 'COD' : 'PENDING', createdAt: Date.now()
    };

    const orders = getOrders();
    saveOrders([newOrder, ...orders]); // Prepend new order

    return newOrder;
  },

  getOrder: async (id: string): Promise<Order | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const orders = getOrders();
    return orders.find(o => o.id === id || o.orderNumber === id) || null;
  },

  getUserOrders: async (): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return getOrders().sort((a, b) => b.createdAt - a.createdAt);
  },

  getAllOrders: async (): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getOrders().sort((a, b) => b.createdAt - a.createdAt);
  },

  updateOrderStatus: async (id: string, newStatus: Order['orderStatus']): Promise<Order | null> => {
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === id || o.orderNumber === id);
    if (index === -1) return null;
    
    orders[index] = { ...orders[index], orderStatus: newStatus };
    saveOrders(orders);
    return orders[index];
  },

  guestTrackOrder: async (orderNumber: string, phone: string): Promise<Order | null> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const orders = getOrders();
    // Validate both order number and phone to ensure privacy
    const order = orders.find(o => o.orderNumber === orderNumber);
    if (!order) return null;
    
    // Simple normalization check
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const cleanOrderPhone = order.shippingAddress.phone.replace(/[\s-]/g, '');
    
    if (cleanPhone === cleanOrderPhone) return order;
    return null;
  }
};
