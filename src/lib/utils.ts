import type { CollectionEntry } from 'astro:content';

export interface Business {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  description?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  google_maps_url?: string;
  logo_url?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  order: number;
}

export type BusinessCollection = CollectionEntry<'businesses'>;
export type CategoryCollection = CollectionEntry<'categories'>;

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Turismo', slug: 'turismo', icon: 'map', order: 1 },
  { id: '2', name: 'Gastronomía', slug: 'gastronomia', icon: 'utensils', order: 2 },
  { id: '3', name: 'Salud', slug: 'salud', icon: 'heart-pulse', order: 3 },
  { id: '4', name: 'Servicios', slug: 'servicios', icon: 'wrench', order: 4 },
];

export function formatPhone(phone: string): string {
  // Format Mexican phone numbers
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function generateWhatsAppMessage(businessName: string): string {
  return encodeURIComponent(`Hola, vi tu negocio "${businessName}" en Guia648 y me gustaría más información.`);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Normalize string for search operations
 * Removes accents, converts to lowercase, and trims whitespace
 * Example: "Búsqueda" → "busqueda"
 */
export function normalizeString(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim();
}
