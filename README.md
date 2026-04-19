# Guia648 - Directorio Digital de Camargo, Chihuahua

> Directorio digital de comercios y servicios locales de Camargo, Chih. 

[![GitHub stars](https://img.shields.io/github/stars/monz-dev/guia648)](https://github.com/monz-dev/guia648)
[![Build](https://img.shields.io/badge/Build-Next.js%2016-blue)](https://nextjs.org)

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
| Frontend | Next.js 16 (App Router) |
| Estilos | TailwindCSS 3 |
| Backend | Supabase (DB) |
| Icons | Lucide |
| Hosting | Vercel |
| Admin | admin-guia648 |

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
# Supabase (create .env.local for local development)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build for Production

```bash
npm run build
```

The output will be in `.next/` - automatically deployed by Vercel.

## 🔄 Workflow

### Desarrollo Local

```bash
npm run dev
```

### Deploy

El contenido se actualiza automáticamente desde Supabase. Solo hacés push y Vercel hace deploy:

```bash
git add .
git commit -m "feat: description del cambio"
git push
```

Vercel detecta el cambio y deploya automáticamente.

### Admin

Para administrar contenido, ir a: https://admin-guia648.vercel.app

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx        # Root layout
│   ├── page.tsx        # Home page
│   ├── buscar/         # Search page
│   ├── directorio/    # Category pages
│   │   └── [categoria]/
│   └── negocio/       # Business detail pages
│       └── [slug]/
├── components/           # UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── BusinessCard.tsx
│   ├── CategoryIcon.tsx
│   └── providers/       # Theme provider
├── lib/                 # Utilities & clients
│   ├── supabase.ts   # Client + types
│   ├── data.ts     # Query functions
│   └── utils.ts    # Helpers
└── public/            # Static assets
    └── images/
        ├── hero/
        └── logo.png
```

## 🌐 Dominio

El sitio está disponible en: https://guia648.com

DNS configurado en HostGator → Vercel

## 📄 License

MIT