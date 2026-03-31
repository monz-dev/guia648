export function normalizeString(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function calculateFuzzyScore(text, pattern) {
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

  const threshold = Math.ceil(pattern.length * 0.7);
  if (patternIdx >= threshold) {
    const score = (patternIdx / pattern.length) * 0.4;
    return score > 0.3 ? score : 0;
  }
  return 0;
}

export function scoreMatch(text, pattern) {
  if (!pattern || !text) return 0;

  const normalizedText = normalizeString(text);
  const normalizedPattern = normalizeString(pattern);

  if (normalizedText === normalizedPattern) return 1.0;

  const words = normalizedText.split(/\s+/);
  if (words.some(word => word.startsWith(normalizedPattern))) return 0.9;

  if (pattern.length >= 3 && normalizedText.includes(normalizedPattern)) return 0.7;

  if (pattern.length >= 3) {
    return calculateFuzzyScore(normalizedText, normalizedPattern);
  }

  return 0;
}

export function searchBusinesses(searchQuery, categoryFilter, businesses) {
  if ((!searchQuery || searchQuery.trim() === '') && categoryFilter === 'all') {
    return businesses.map(b => ({ item: b, score: 1 }));
  }

  const results = [];
  const searchTerms = searchQuery
    ? searchQuery.toLowerCase().split(/\s+/).filter(Boolean)
    : [];

  for (const business of businesses) {
    if (categoryFilter !== 'all') {
      const businessCategory = business.category || '';
      if (businessCategory !== categoryFilter) {
        continue;
      }
    }

    if (searchTerms.length === 0) {
      results.push({ item: business, score: 1 });
      continue;
    }

    const searchableText = [
      business.name,
      business.description || '',
      business.category || '',
    ]
      .filter(Boolean)
      .join(' ');

    let totalScore = 0;
    let allTermsMatch = true;

    for (const term of searchTerms) {
      const termScore = scoreMatch(searchableText, term);
      if (termScore < 0.2) {
        allTermsMatch = false;
        break;
      }
      totalScore += termScore;
    }

    if (allTermsMatch) {
      const averageScore = totalScore / searchTerms.length;
      results.push({ item: business, score: averageScore });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function highlightMatches(text, searchTerms) {
  if (!text || searchTerms.length === 0) return escapeHtml(text);

  const escapedText = escapeHtml(text);
  let result = escapedText;
  const processedTerms = new Set();

  for (const term of searchTerms) {
    if (processedTerms.has(term)) continue;
    processedTerms.add(term);

    const normalizedTerm = normalizeString(term);
    const escapedTerm = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');
    
    result = result.replace(regex, (match) => {
      return '<mark class="bg-yellow-200 dark:bg-yellow-900 px-0.5 rounded">' + match + '</mark>';
    });
  }

  return result;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
