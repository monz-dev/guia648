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
-- Datos Actuales: Businesses (actualizado desde Supabase)
-- =============================================
INSERT INTO public.businesses (id, name, slug, category_id, category, description, phone, whatsapp, address, google_maps_url, logo_url, featured) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Montecarlo', 'montecarlo', '22222222-2222-2222-2222-222222222222', 'gastronomia', 'Exquisitos platillos y tragos de especialidad con un ambiente inigualable.', '6481010783', '6481010783', 'Independencia 502, Camargo, Chih.', 'https://www.google.com/maps/place/Montecarlo+Restaurante+Bar/@27.6951529,-105.1724267,633m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8694aef8a137be9d:0x411ec12fbd67aa37!8m2!3d27.6951529!4d-105.1724267!16s%2Fg%2F11bwc5cdbr?entry=ttu&g_ep=EgoyMDI2MDMwNS4wIKXMDSoASAFQAw%3D%3D', 'https://ppxcdlrytxosntggitnk.supabase.co/storage/v1/object/public/businesses/montecarlo.webp', true),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Mahan Bistro', 'mahan-bistro', '22222222-2222-2222-2222-222222222222', 'gastronomia', 'El lugar gourmet por excelencia en Camargo.', '6481181467', '6481181467', 'Av. Lic. Benito Juárez 404, Camargo, Chih.', 'https://www.google.com/maps/place/Mahan+Bistro/@27.6925531,-105.173183,615m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8694afd86b5a39a5:0x9a8529b149b3d99e!8m2!3d27.6925531!4d-105.173183!16s%2Fg%2F11jnzj3qcm?entry=ttu&g_ep=EgoyMDI2MDMwNS4wIKXMDSoASAFQAw%3D%3D', 'https://ppxcdlrytxosntggitnk.supabase.co/storage/v1/object/public/businesses/mahan-bistro.webp', true),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Hotel Santa Fe', 'hotel-santa-fe', '11111111-1111-1111-1111-111111111111', 'turismo', 'La mejor opcion de hospedaje en Camargo, Chih.', '6484624022', '6484624022', 'Carretera Panamericana Km 67, Camargo, Chih.', 'https://www.google.com/maps/place/Hotel+Santa+Fe/@27.6700874,-105.1593759,633m/data=!3m1!1e3!4m9!3m8!1s0x8694affade2327dd:0x68674e89c1d6be2f!5m2!4m1!1i2!8m2!3d27.6700874!4d-105.156801!16s%2Fg%2F1wbf_vxv?entry=ttu&g_ep=EgoyMDI2MDMwNC4xIKXMDSoASAFQAw%3D%3D', 'https://ppxcdlrytxosntggitnk.supabase.co/storage/v1/object/public/businesses/santafe.webp', true);

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
