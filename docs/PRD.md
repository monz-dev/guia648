# PRD: Guia648 - Directorio Digital de Camargo, Chih.

## 1. Visión del Producto

_Guia648_ es una plataforma web tipo directorio diseñada para conectar a los habitantes y turistas de Camargo, Chihuahua, con los comercios y servicios locales. El objetivo es digitalizar la economía local y servir como portafolio vivo para servicios de desarrollo web avanzados.

---

## 2. Objetivos Estratégicos

- _Centralizar la información:_ Que cualquier persona en Camargo encuentre horarios y teléfonos en un solo lugar.
- _Portafolio de Venta:_ Usar la plataforma como demo técnica para vender sitios web independientes a los negocios listados.
- _Identidad Local:_ Generar pertenencia usando el prefijo telefónico (648) como marca.

---

## 3. Especificaciones Funcionales (MVP)

### 3.1. Módulo de Usuario (Front-end)

- _Landing Page:_ Hero section con buscador central y fondo de Camargo (ej. El Faro o la Presa).
- _Buscador Inteligente:_ Filtrado por nombre de negocio o etiquetas (ej. "nuez", "mariscos").
- _Directorio por Categorías:_ \* Turismo (Boquilla, Filtros, Hoteles).
  - Gastronomía (Cenadurías, Restaurantes, Snacks).
  - Salud (Farmacias, Clínicas, Dentistas).
  - Servicios (Talleres, Fletes, Estéticas).
- _Ficha de Negocio (Standard):_ \* Logo y Nombre.
  - Botón de llamada directa (tel:).
  - Enlace a WhatsApp con mensaje: "Hola, vi tu negocio en Guia648..."
  - Integración básica con Google Maps.

### 3.2. Módulo de Administración (Back-end)

- _Base de Datos de Comercios:_ Tabla para gestionar nombres, descripciones y contactos.
- _Gestión de Destacados:_ Capacidad de poner 3 negocios al principio de la lista (Plan Premium).

---

## 4. Stack Tecnológico

- **Frontend:** Astro 5.x (SSG) - Archivos estáticos para Hostgator
- **Backend:** Supabase (Auth, Database, Edge Functions)
- **Base de Datos:** PostgreSQL (via Supabase)
- **Hosting Frontend:** Hostgator (Archivos estáticos Astro SSG)
- **Hosting Admin:** Vercel o Netlify (gratis) - App separada apuntando a Supabase
- **Diseño:** Mobile-First (Optimizado para celulares con redes 4G locales)
- **Icons:** Lucide o Heroicons
- **Styles:** TailwindCSS

---

## 5. Diseño UI/UX

### 5.1. Estilo Visual
- **Estilo:** Moderno Minimalista - bersih, sin ruido visual, tipografía limpia
- **Enfoque:** Mobile-First - diseñado primero para móvil, adaptado a desktop
- **Colores:** Paleta neutral con accent de color local (tierra/verde Chih.)

### 5.2. Tema (Dark/Light Mode)
- **Soporte completo:** Sistema automático + toggle manual
- **Persistencia:** Guardar preferencia en localStorage
- **CSS:** TailwindCSS con `dark:` variants y `@media (prefers-color-scheme)`

### 5.3. Componentes Clave
- Header fijo con toggle tema
- Hero con imagen local y buscador
- Cards de negocio minimalistas
- Footer con info de Camargo

---

## 6. Modelo de Negocio para el Programador

1.  _Listado Gratuito:_ Todos los negocios de Camargo.
2.  _Listado Premium:_ $100 - $200 MXN al mes por aparecer en los primeros resultados.
3.  _Conversión Total:_ Oferta de "Sitio Web Propio" (Tu_Negocio.com) vinculado desde la Guía.

---

## 7. Roadmap de Desarrollo

- _Semana 1:_ Estructura
- _Semana 2:_ Programación del buscador y carga de los primeros 30 negocios de Camargo.
- _Semana 3:_ Pruebas de velocidad en el hosting real y lanzamiento en grupos de Facebook locales.
