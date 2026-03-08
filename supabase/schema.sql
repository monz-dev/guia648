-- =============================================
-- Guia648 - Supabase Schema
-- Directorio Digital de Camargo, Chihuahua
-- =============================================

-- =============================================
-- Tabla: categories
-- =============================================
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Tabla: businesses
-- =============================================
CREATE TABLE public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    category VARCHAR(100),  -- Fallback: slug de categoría para SSG
    description TEXT,
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    address TEXT,
    google_maps_url TEXT,
    logo_url TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Tabla: reviews
-- =============================================
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    approved BOOLEAN DEFAULT false,  -- Moderación de reseñas
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Índices
-- =============================================
CREATE INDEX idx_businesses_category ON public.businesses(category);
CREATE INDEX idx_businesses_category_id ON public.businesses(category_id);
CREATE INDEX idx_businesses_slug ON public.businesses(slug);
CREATE INDEX idx_businesses_featured ON public.businesses(featured) WHERE featured = true;
CREATE INDEX idx_reviews_business ON public.reviews(business_id);
CREATE INDEX idx_reviews_approved ON public.reviews(approved) WHERE approved = true;

-- =============================================
-- Datos Iniciales: Categories
-- =============================================
INSERT INTO public.categories (id, name, slug, icon, "order") VALUES
    ('11111111-1111-1111-1111-111111111111', 'Turismo', 'turismo', 'map', 1),
    ('22222222-2222-2222-2222-222222222222', 'Gastronomía', 'gastronomia', 'utensils', 2),
    ('33333333-3333-3333-3333-333333333333', 'Salud', 'salud', 'heart-pulse', 3),
    ('44444444-4444-4444-4444-444444444444', 'Servicios', 'servicios', 'wrench', 4);

-- =============================================
-- Datos Iniciales: Businesses
-- =============================================
INSERT INTO public.businesses (id, name, slug, category_id, category, description, phone, whatsapp, address, google_maps_url, featured) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'La Casa de la Nuez', 'casa-de-la-nuez', '22222222-2222-2222-2222-222222222222', 'gastronomia', 'Los mejores productos de nuez de Camargo. Venta de nuez pelada, confitada y enchilada.', '6481234567', '6481234567', 'Calle Principal #123, Camargo, Chih.', 'https://maps.google.com/?q=Camargo+Chihuahua', true),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Mariscos El Puerto', 'mariscos-el-puerto', '22222222-2222-2222-2222-222222222222', 'gastronomia', 'Mariscos frescos diarios. Ceviches, tacos, ostiones y más.', '6489876543', '6489876543', 'Boulevard Juárez #456, Camargo, Chih.', 'https://maps.google.com/?q=Camargo+Chihuahua', true),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Hotel La Mansion', 'hotel-la-mansion', '11111111-1111-1111-1111-111111111111', 'turismo', 'Hotel boutique con vista a la presa. Habitaciones comfortable y servicio de primera.', '6481112233', '6481112233', 'Carretera a La Presa Km 5, Camargo, Chih.', 'https://maps.google.com/?q=La+Presa+Camargo+Chihuahua', true);

-- =============================================
-- Función: Actualizar updated_at automáticamente
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_businesses_updated_at
    BEFORE UPDATE ON public.businesses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- RLS Policies (Row Level Security)
-- =============================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read categories and businesses
CREATE POLICY "Public can read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can read businesses" ON public.businesses FOR SELECT USING (true);

-- Anyone can read approved reviews
CREATE POLICY "Public can read approved reviews" ON public.reviews FOR SELECT USING (approved = true);

-- Anyone can insert reviews (but they won't be visible until approved)
CREATE POLICY "Anyone can create reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- Only authenticated users can modify data
CREATE POLICY "Auth users can manage categories" ON public.categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can manage businesses" ON public.businesses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can manage reviews" ON public.reviews FOR ALL USING (auth.role() = 'authenticated');
