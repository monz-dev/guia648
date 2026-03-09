#!/bin/bash
# Sync Supabase data to local JSON files
# Run: ./scripts/sync.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

SUPABASE_URL="https://ppxcdlrytxosntggitnk.supabase.co"
API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBweGNkbHJ5dHhvc250Z2dpdG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NzkzMjUsImV4cCI6MjA4ODI1NTMyNX0.hPSiT7fLhgjG3PBANZIwqjJHyGRWvJfSmFQrABumOfc"

echo "🔄 Syncing Supabase data to local JSON..."

# Fetch categories
echo "📦 Fetching categories..."
curl -s -H "apikey: $API_KEY" \
     -H "Authorization: Bearer $API_KEY" \
     "$SUPABASE_URL/rest/v1/categories?select=*&order=order" \
     > "$PROJECT_DIR/src/data/categories/categories.json"

echo "💾 Saved: src/data/categories/categories.json"

# Fetch businesses
echo "📦 Fetching businesses..."
curl -s -H "apikey: $API_KEY" \
     -H "Authorization: Bearer $API_KEY" \
     "$SUPABASE_URL/rest/v1/businesses?select=*&order=created_at.desc" \
     > "$PROJECT_DIR/src/data/businesses/businesses.json"

echo "💾 Saved: src/data/businesses/businesses.json"

echo "✅ Sync complete!"
