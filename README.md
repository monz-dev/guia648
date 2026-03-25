# Guia648 - Directorio Digital de Camargo, Chihuahua

> Directorio digital de comercios y servicios locales de Camargo, Chih. 

[![GitHub stars](https://img.shields.io/github/stars/monz-dev/guia648)](https://github.com/monz-dev/guia648)
[![Build](https://img.shields.io/badge/Build-Astro%205.x-blue)](https://astro.build)

## 📱 Preview

Plataforma web tipo directorio diseñada para conectar habitantes y turistas con los comercios locales de Camargo, Chihuahua.

### Características

- 🏠 **Landing Page** - Hero con buscador y categorías
- 🔍 **Buscador Inteligente** - Filtrado por nombre o etiquetas
- 📂 **Directorio por Categorías** - Turismo, Gastronomía, Salud, Servicios
- 📇 **Fichas de Negocio** - Llamada directa, WhatsApp, Google Maps
- 🌙 **Dark/Light Mode** - Soporte completo con toggle manual
- 📱 **Mobile-First** - Optimizado para celulares

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | Astro 5.x (SSG) |
| Estilos | TailwindCSS 4 |
| Backend | Supabase (DB + Auth) |
| Icons | Lucide |
| Hosting | Hostgator (estático) |
| Admin | Vercel |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/monz-dev/guia648.git
cd guia648

# Install dependencies
npm install

# Copy environment template
cp .env.template .env

# Start development server
npm run dev
```

### Environment Variables

```env
# Supabase
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build for Production

```bash
# Build static site
npm run build

# Preview build locally
npm run preview
```

The static output will be in `dist/` - ready to upload to Hostgator.

## 🔄 Workflow

### Desarrollo Local

```bash
# Iniciar servidor de desarrollo (Astro en puerto 4321)
npm run dev

# En otra terminal, iniciar API PHP (para datos de negocios)
cd scripts && php -S localhost:8000 -t ..
```

### Sincronizar Datos desde Supabase

Cuando cargues negocios nuevos en Supabase y quieras actualizar los JSONs locales:

```bash
# Obtener credenciales de Supabase Dashboard → Settings → API
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Ejecutar script de sync
node scripts/sync-from-supabase.mjs

# Verificar cambios en los JSONs
git status
```

### Commit & Deploy

```bash
# 1. Agregar cambios
git add .

# 2. Commit con mensaje descriptivo
git commit -m "feat: agregar nuevos negocios"

# 3. Push a remote
git push

# 4. Build local y subir a HostGator
npm run build
# Subir contenido de dist/ + carpeta api/ a HostGator
```

## 📁 Project Structure

```
src/
├── components/       # UI components
│   ├── BusinessCard.astro
│   ├── BusinessList.astro
│   ├── ThemeToggle.astro
│   └── ...
├── data/            # Static data (JSON)
│   ├── businesses/
│   └── categories/
├── layouts/         # Page layouts
├── lib/             # Utilities & clients
│   ├── supabase.ts
│   └── utils.ts
├── pages/           # Routes
│   ├── index.astro
│   ├── directorio/[categoria].astro
│   └── negocio/[slug].astro
└── styles/          # Global styles
```

## 📄 License

MIT
