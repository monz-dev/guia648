/**
 * Exporta la tabla businesses a un archivo CSV para Excel.
 *
 * Uso: node scripts/export-businesses.mjs
 *
 * Columnas que incluye (las que te interesan para rellenar):
 * - name, slug, category_id, category, description, phone, whatsapp,
 *   address, google_maps_url, logo_url, featured
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuración de Supabase (lee de .env o poné las keys acá)
const SUPABASE_URL = 'https://ppxcdlrytxosntggitnk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBweGNkbHJ5dHhvc250Z2dpdG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NzkzMjUsImV4cCI6MjA4ODI1NTMyNX0.hPSiT7fLhgjG3PBANZIwqjJHyGRWvJfSmFQrABumOfc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Categorías conocidas para referencia
const CATEGORIES = [
  { id: '11111111-1111-1111-1111-111111111111', slug: 'turismo' },
  { id: '22222222-2222-2222-2222-222222222222', slug: 'gastronomia' },
  { id: '33333333-3333-3333-3333-333333333333', slug: 'salud' },
  { id: '44444444-4444-4444-4444-444444444444', slug: 'servicios' },
];

async function exportBusinesses() {
  console.log('📊 Exportando negocios de Supabase...\n');

  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  console.log(`✅ ${businesses.length} negocios encontrados\n`);

  // Columnas para el CSV (las útiles para agregar nuevos)
  const columns = [
    'name',
    'slug',
    'category_id',
    'category',
    'description',
    'phone',
    'whatsapp',
    'address',
    'google_maps_url',
    'logo_url',
    'featured',
  ];

  // Helper: escapa valores CSV
  function csvValue(val) {
    if (val === null || val === undefined) return '';
    const str = String(val);
    // Si tiene comillas, comas o saltos de línea, entrecomillar
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  // Generar CSV
  const header = columns.join(',');
  const rows = businesses.map((b) =>
    columns.map((col) => csvValue(b[col])).join(',')
  );
  const csv = [header, ...rows].join('\n');

  // Guardar archivo
  const outputPath = resolve(__dirname, '..', 'businesses-export.csv');
  writeFileSync(outputPath, csv, 'utf-8');

  console.log(`📁 Archivo guardado: ${outputPath}\n`);
  console.log('🏷️  Categorías disponibles:');
  CATEGORIES.forEach((c) => console.log(`   ${c.slug} → ${c.id}`));
  console.log('\n📋 Para abrir en Excel:');
  console.log('   1. Abrí Excel');
  console.log('   2. Archivo → Abrir → Seleccioná businesses-export.csv');
  console.log('   3. Excel va a abrir el Asistente de importación');
  console.log('   4. Elegí "Delimitado" → Siguiente');
  console.log('   5. Marcá "Coma" como delimitador → Finalizar');
  console.log('\n   O simplemente hacé doble click en el archivo .csv 😉');
}

exportBusinesses();
