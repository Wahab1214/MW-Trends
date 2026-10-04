-- ==========================================
-- PHASE 12: MW TRENDS INITIAL PRODUCTION SCHEMA
-- ==========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- AUTH & PROFILES
-- ==========================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
    id TEXT PRIMARY KEY,
    description TEXT
);
INSERT INTO roles (id, description) VALUES ('admin', 'System Administrator'), ('customer', 'Standard Customer');

CREATE TABLE user_roles (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role_id TEXT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- ==========================================
-- CATALOG (Products, Categories, Collections)
-- ==========================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    sku TEXT UNIQUE,
    name TEXT NOT NULL,
    short_description TEXT,
    description TEXT,
    base_price INTEGER NOT NULL CHECK (base_price >= 0),
    category_id UUID REFERENCES categories(id),
    is_customizable BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color_code TEXT,
    image_url TEXT,
    price_adjustment INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_sizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    inventory_tracking TEXT NOT NULL DEFAULT 'UNLIMITED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- CUSTOM DESIGNS
-- ==========================================
CREATE TABLE designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    title TEXT,
    preview_url TEXT,
    config_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- ORDERS & TRANSACTIONS
-- ==========================================
CREATE TABLE idempotency_keys (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    order_id UUID
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    guest_email TEXT,
    guest_phone TEXT,
    subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
    shipping_fee INTEGER NOT NULL CHECK (shipping_fee >= 0),
    total INTEGER NOT NULL CHECK (total >= 0),
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'PENDING',
    order_status TEXT NOT NULL DEFAULT 'PROCESSING',
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    idempotency_key TEXT UNIQUE REFERENCES idempotency_keys(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    size_id UUID REFERENCES product_sizes(id),
    design_id UUID REFERENCES designs(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
    line_total INTEGER NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- RLS POLICIES & SECURITY
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can manage own designs" ON designs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

CREATE POLICY "Admins can do everything on profiles" ON profiles FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_id = 'admin'));
CREATE POLICY "Admins can do everything on orders" ON orders FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_id = 'admin'));
CREATE POLICY "Admins can do everything on designs" ON designs FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_id = 'admin'));

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published products" ON products FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_id = 'admin'));

-- ==========================================
-- ATOMIC ORDER CREATION FUNCTION
-- ==========================================
CREATE OR REPLACE FUNCTION create_order_transaction(
    p_idempotency_key TEXT,
    p_order_number TEXT,
    p_user_id UUID,
    p_guest_email TEXT,
    p_guest_phone TEXT,
    p_subtotal INTEGER,
    p_shipping_fee INTEGER,
    p_total INTEGER,
    p_payment_method TEXT,
    p_shipping_address JSONB,
    p_items JSONB
) RETURNS UUID AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
    v_existing_order_id UUID;
BEGIN
    SELECT order_id INTO v_existing_order_id FROM idempotency_keys WHERE id = p_idempotency_key;
    IF v_existing_order_id IS NOT NULL THEN
        RETURN v_existing_order_id;
    END IF;

    INSERT INTO idempotency_keys (id) VALUES (p_idempotency_key);

    INSERT INTO orders (
        order_number, user_id, guest_email, guest_phone, subtotal, shipping_fee, total, payment_method, shipping_address, idempotency_key
    ) VALUES (
        p_order_number, p_user_id, p_guest_email, p_guest_phone, p_subtotal, p_shipping_fee, p_total, p_payment_method, p_shipping_address, p_idempotency_key
    ) RETURNING id INTO v_order_id;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO order_items (
            order_id, product_id, variant_id, size_id, design_id, quantity, unit_price, line_total
        ) VALUES (
            v_order_id, 
            (v_item->>'product_id')::UUID, 
            (v_item->>'variant_id')::UUID, 
            (v_item->>'size_id')::UUID, 
            (v_item->>'design_id')::UUID, 
            (v_item->>'quantity')::INTEGER, 
            (v_item->>'unit_price')::INTEGER, 
            (v_item->>'quantity')::INTEGER * (v_item->>'unit_price')::INTEGER
        );

        UPDATE product_sizes 
        SET stock_quantity = stock_quantity - (v_item->>'quantity')::INTEGER
        WHERE id = (v_item->>'size_id')::UUID AND inventory_tracking = 'TRACKED';
    END LOOP;

    INSERT INTO order_events (order_id, status, notes) VALUES (v_order_id, 'PROCESSING', 'Order created securely via transaction.');
    UPDATE idempotency_keys SET order_id = v_order_id WHERE id = p_idempotency_key;

    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
