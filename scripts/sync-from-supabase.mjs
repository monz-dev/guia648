import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Try to read from .env.local first, otherwise use process.env
const envFile = path.join(__dirname, '../.env.local');
let supabaseUrl = process.env.SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      if (key.trim() === 'SUPABASE_URL') supabaseUrl = valueParts.join('=').trim();
      if (key.trim() === 'SUPABASE_SERVICE_ROLE_KEY') supabaseKey = valueParts.join('=').trim();
    }
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncData() {
  console.log('Fetching data from Supabase...');

  const [businessesResult, categoriesResult] = await Promise.all([
    supabase.from('businesses').select('*').order('name', { ascending: true }),
    supabase.from('categories').select('*').order('order', { ascending: true }),
  ]);

  if (businessesResult.error) throw new Error(`Businesses error: ${businessesResult.error.message}`);
  if (categoriesResult.error) throw new Error(`Categories error: ${categoriesResult.error.message}`);

  const dataDir = path.join(__dirname, '../src/data');
  
  fs.mkdirSync(path.join(dataDir, 'businesses'), { recursive: true });
  fs.mkdirSync(path.join(dataDir, 'categories'), { recursive: true });

  fs.writeFileSync(
    path.join(dataDir, 'businesses/businesses.json'),
    JSON.stringify(businessesResult.data, null, 2)
  );

  fs.writeFileSync(
    path.join(dataDir, 'categories/categories.json'),
    JSON.stringify(categoriesResult.data, null, 2)
  );

  console.log(`Synced ${businessesResult.data.length} businesses and ${categoriesResult.data.length} categories`);
}

syncData().catch(console.error);
