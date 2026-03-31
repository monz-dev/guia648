import type { Business, Category } from './utils';
import { normalizeString } from './utils';

/**
 * Represents a search result with its relevance score
 */
export interface SearchResult {
  item: Business;
  score: number;
  highlights?: {
    name?: string;
    description?: string;
  };
}

/**
 * Match type and score configuration
 */
export const SCORE_CONFIG = {
  EXACT: 1.0,
  PREFIX: 0.9,
  SUBSTRING: 0.7,
  FUZZY: 0.4,
  MIN_THRESHOLD: 0.2, // Back to 0.2
} as const;

/**
 * Score a single match between text and pattern
 * Returns a score from 0 to 1 based on match type
 * 
 * Priority: Exact > Prefix > Substring > Fuzzy
 */
export function scoreMatch(text: string, pattern: string): number {
  if (!pattern || !text) return 0;

  const normalizedText = normalizeString(text);
  const normalizedPattern = normalizeString(pattern);

  // Exact match (normalized)
  if (normalizedText === normalizedPattern) {
    return SCORE_CONFIG.EXACT;
  }

  // Prefix match (word starts with pattern)
  const words = normalizedText.split(/\s+/);
  if (words.some(word => word.startsWith(normalizedPattern))) {
    return SCORE_CONFIG.PREFIX;
  }

  // Substring match only for patterns >= 3 characters
  if (pattern.length >= 3 && normalizedText.includes(normalizedPattern)) {
    return SCORE_CONFIG.SUBSTRING;
  }

  // Fuzzy match only for patterns >= 3 characters
  if (pattern.length >= 3) {
    const fuzzyScore = calculateFuzzyScore(normalizedText, normalizedPattern);
    if (fuzzyScore > SCORE_CONFIG.MIN_THRESHOLD) {
      return fuzzyScore;
    }
  }

  return 0;
}

/**
 * Calculate fuzzy match score using Levenshtein-like algorithm
 * with consecutive character matching tolerance
 * More restrictive: requires 70%+ character matching to qualify
 */
function calculateFuzzyScore(text: string, pattern: string): number {
  let patternIdx = 0;
  let consecutiveMatches = 0;

  for (let i = 0; i < text.length && patternIdx < pattern.length; i++) {
    if (text[i] === pattern[patternIdx]) {
      consecutiveMatches++;
      patternIdx++;
    } else if (consecutiveMatches > 0) {
      consecutiveMatches -= 0.5;
    }
  }

  // Require 70%+ of pattern characters to match (back to 70%)
  const threshold = Math.ceil(pattern.length * 0.7);
  if (patternIdx >= threshold) {
    const score = (patternIdx / pattern.length) * SCORE_CONFIG.FUZZY;
    // Return actual score (no minimum floor) - require real fuzzy match
    return score > 0.3 ? score : 0;
  }

  return 0;
}

/**
 * Search businesses with AND logic for multi-term queries
 * Category filter is applied first, then search terms are matched with AND logic
 * (all search terms must match for a business to be included)
 * 
 * Results are sorted by score (highest first)
 */
export function searchBusinesses(
  businesses: Business[],
  searchQuery: string,
  categoryFilter: string = 'all'
): SearchResult[] {
  // If no query and no filter, return all
  if ((!searchQuery || searchQuery.trim() === '') && categoryFilter === 'all') {
    return businesses.map(b => ({ item: b, score: 1 }));
  }

  const results: SearchResult[] = [];
  const searchTerms = searchQuery
    ? searchQuery.toLowerCase().split(/\s+/).filter(Boolean)
    : [];

  for (const business of businesses) {
    // Filter by category first - gracefully handle missing category
    if (categoryFilter !== 'all') {
      const businessCategory = business.category || '';
      if (businessCategory !== categoryFilter) {
        continue;
      }
    }

    // If no search query, just add filtered businesses
    if (searchTerms.length === 0) {
      results.push({ item: business, score: 1 });
      continue;
    }

    // Build searchable text from business fields
    const searchableText = [
      business.name,
      business.description || '',
      business.category || '',
    ]
      .filter(Boolean)
      .join(' ');

    // AND logic: all terms must match
    let totalScore = 0;
    let allTermsMatch = true;

    for (const term of searchTerms) {
      const termScore = scoreMatch(searchableText, term);
      if (termScore < SCORE_CONFIG.MIN_THRESHOLD) {
        allTermsMatch = false;
        break;
      }
      totalScore += termScore;
    }

    if (allTermsMatch) {
      // Average the scores across terms
      const averageScore = totalScore / searchTerms.length;
      results.push({ item: business, score: averageScore });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  return results;
}

/**
 * Highlight matching terms in text by wrapping them in markers
 * Respects accent normalization for accurate highlighting
 */
export function highlightMatches(text: string, searchTerms: string[]): string {
  if (!text || searchTerms.length === 0) return text;

  let result = text;
  const processedTerms = new Set<string>();

  for (const term of searchTerms) {
    if (processedTerms.has(term)) continue;
    processedTerms.add(term);

    // Create regex that matches term with normalized characters
    const normalizedTerm = normalizeString(term);
    const escapedTerm = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const normalizedForMatch = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');

    result = result.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900 px-0.5 rounded">$&</mark>');
  }

  return result;
}
