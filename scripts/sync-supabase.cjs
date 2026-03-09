#!/usr/bin/env node
/**
 * Sync Supabase Data to Local JSON
 * 
 * Fetches data from Supabase and saves it to src/data/ for SSG
 * Run: node scripts/sync-supabase.cjs
 */

const fs = require('fs/promises');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'https://ppxcdlrytxosntggitnk.supabase.co';
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_ANON_KEY) {
  console.error('❌ Error: PUBLIC_SUPABASE_ANON_KEY not set in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DATA_DIR = path.join(process.cwd(), 'src/data');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories/categories.json');
const BUSINESSES_FILE = path.join(DATA_DIR, 'businesses/businesses.json');

async function fetchCategories() {
  console.log('📦 Fetching categories from Supabase...');
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order');

  if (error) {
    console.error('❌ Error fetching categories:', error.message);
    process.exit(1);
  }

  console.log(`✅ Fetched ${data.length} categories`);
  return data;
}

async function fetchBusinesses() {
  console.log('📦 Fetching businesses from Supabase...');
  
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching businesses:', error.message);
    process.exit(1);
  }

  console.log(`✅ Fetched ${data.length} businesses`);
  return data;
}

async function saveJson(filePath, data) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`💾 Saved: ${filePath}`);
}

async function main() {
  console.log('🔄 Starting Supabase sync...\n');

  try {
    const categories = await fetchCategories();
    const businesses = await fetchBusinesses();

    await saveJson(CATEGORIES_FILE, categories);
    await saveJson(BUSINESSES_FILE, businesses);

    console.log('\n✨ Sync complete!');
  } catch (err) {
    console.error('❌ Sync failed:', err);
    process.exit(1);
  }
}

main();
