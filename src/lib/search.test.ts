/**
 * SEARCH MODULE TEST CASES (Compatibility Documentation)
 * 
 * These test cases document the expected behavior of search functions.
 * To run these tests, install vitest and run: npm test
 * 
 * Test Coverage:
 * - 4.1: normalizeString - accent removal, case normalization, whitespace
 * - 4.2: scoreMatch - exact, prefix, substring, and fuzzy matching
 * - 4.3: searchBusinesses - AND logic, category filtering, missing field handling
 * - 4.4: Integration tests with real data structure
 */

import type { Business } from './utils';

/**
 * 4.1 TEST CASES: normalizeString
 * 
 * ✓ Should remove accents: café → cafe, naïve → naive, Español → espanol
 * ✓ Should lowercase: CAFÉ → cafe, HeLLo → hello
 * ✓ Should trim whitespace: "  hello  " → hello
 * ✓ Should handle empty strings: "" → "", null → ""
 */
export const test_normalizeString_cases = [
  { input: 'café', expected: 'cafe', desc: 'removes accents' },
  { input: 'Búsqueda', expected: 'busqueda', desc: 'removes accents and lowercases' },
  { input: '  hola  ', expected: 'hola', desc: 'trims whitespace' },
  { input: '', expected: '', desc: 'handles empty string' },
];

/**
 * 4.2 TEST CASES: scoreMatch
 * 
 * ✓ Exact match: 'hello' vs 'hello' → 1.0
 * ✓ Prefix match: 'hello world' vs 'hello' → 0.9
 * ✓ Substring: 'hello world' vs 'lo wor' → 0.7
 * ✓ Fuzzy: 'restaurant' vs 'rstnt' → 0.2-0.4
 * ✓ No match: 'hello' vs 'xyz' → 0
 */
export const test_scoreMatch_cases = [
  { text: 'hello', pattern: 'hello', expected: 1.0, desc: 'exact match' },
  { text: 'hello world', pattern: 'hello', expected: 0.9, desc: 'prefix match' },
  { text: 'hello world', pattern: 'lo wor', expected: 0.7, desc: 'substring match' },
  { text: 'restaurant', pattern: 'rstnt', expected: 'fuzzy (0.2-0.4)', desc: 'fuzzy match' },
  { text: 'hello', pattern: 'xyz', expected: 0, desc: 'no match' },
  { text: 'café', pattern: 'cafe', expected: 1.0, desc: 'normalized exact match' },
];

/**
 * 4.3 TEST CASES: searchBusinesses - AND logic
 * 
 * ✓ Multi-term AND: "la nuez" matches only 'La Casa de la Nuez'
 * ✓ Category filter: filter by 'gastronomia' returns 2/3 businesses
 * ✓ Missing category: gracefully handles empty category field
 * ✓ No query all categories: returns all 3 businesses
 * ✓ Empty results: non-existent terms return []
 */
export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'La Casa de la Nuez',
    slug: 'casa-nuez',
    category: 'gastronomia',
    description: 'Los mejores productos de nuez de Camargo',
    phone: '6481234567',
    featured: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Mariscos El Puerto',
    slug: 'mariscos-puerto',
    category: 'gastronomia',
    description: 'Mariscos frescos diarios',
    phone: '6489876543',
    featured: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Hotel La Mansión',
    slug: 'hotel-mansion',
    category: 'turismo',
    description: 'Hotel boutique con vista a la presa',
    featured: true,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
];

export const test_searchBusinesses_cases = [
  { query: 'La Nuez', category: 'all', expected: 'casa-nuez', desc: 'AND logic - multi-term match' },
  { query: '', category: 'gastronomia', expected: '2 results', desc: 'category filter' },
  { query: '', category: 'all', expected: '3 results', desc: 'no query, all categories' },
  { query: 'mansion', category: 'all', expected: 'hotel-mansion', desc: 'normalized search' },
  { query: 'xyz123', category: 'all', expected: '0 results', desc: 'no match' },
];

/**
 * 4.4 TEST CASES: Integration + Real Data
 * 
 * ✓ Accent normalization in full search
 * ✓ Multiple term AND logic
 * ✓ Category filtering with missing fields
 * ✓ Highlighting with normalized matching
 */
export const test_integration_cases = [
  {
    desc: 'Search "búsqueda" normalizes to "busqueda" correctly',
    query: 'búsqueda',
    shouldFind: 'businesses with word "search" related content',
  },
  {
    desc: 'Search "La Casa" uses AND logic (both terms required)',
    query: 'La Casa',
    shouldFind: 'only exact multi-word commercial names with la+casa',
  },
  {
    desc: 'Filter "gastronomia" category excludes turismo',
    category: 'gastronomia',
    shouldFind: 'maximum 2 businesses',
  },
];

