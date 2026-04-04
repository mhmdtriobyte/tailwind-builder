/**
 * Search System for Tailwind Builder
 *
 * A comprehensive search engine that provides:
 * - Element search by name, type, content, and style
 * - Component search in sidebar
 * - Fuzzy matching for typo-tolerant search
 * - Search history with persistence
 * - Search suggestions based on history and context
 * - Regex support for advanced users
 */

import type { BuilderElement, ComponentDefinition } from '@/types/builder';
import { componentRegistry, allComponents } from '@/lib/componentRegistry';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Search scope determines where to search
 */
export type SearchScope = 'canvas' | 'sidebar' | 'all';

/**
 * Search type determines what to search for
 */
export type SearchType =
  | 'name'
  | 'type'
  | 'content'
  | 'style'
  | 'all';

/**
 * Individual search result for elements
 */
export interface ElementSearchResult {
  element: BuilderElement;
  matchType: SearchType;
  matchedText: string;
  score: number;
  path: string[];
  highlights: TextHighlight[];
}

/**
 * Individual search result for components
 */
export interface ComponentSearchResult {
  component: ComponentDefinition;
  matchType: 'name' | 'type' | 'category';
  matchedText: string;
  score: number;
  highlights: TextHighlight[];
}

/**
 * Text highlight for showing match positions
 */
export interface TextHighlight {
  start: number;
  end: number;
  text: string;
}

/**
 * Search options for configuring search behavior
 */
export interface SearchOptions {
  scope: SearchScope;
  searchType: SearchType;
  caseSensitive: boolean;
  useRegex: boolean;
  fuzzyMatch: boolean;
  maxResults: number;
  includeHidden: boolean;
}

/**
 * Search history entry
 */
export interface SearchHistoryEntry {
  query: string;
  timestamp: number;
  resultCount: number;
  scope: SearchScope;
}

/**
 * Search suggestion
 */
export interface SearchSuggestion {
  text: string;
  type: 'history' | 'element' | 'component' | 'style';
  icon?: string;
}

/**
 * Search results container
 */
export interface SearchResults {
  elements: ElementSearchResult[];
  components: ComponentSearchResult[];
  totalCount: number;
  query: string;
  executionTime: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SEARCH_HISTORY_KEY = 'tailwind-builder-search-history';
const MAX_HISTORY_ENTRIES = 50;
const MAX_SUGGESTIONS = 10;
const DEFAULT_MAX_RESULTS = 100;

/**
 * Default search options
 */
export const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  scope: 'all',
  searchType: 'all',
  caseSensitive: false,
  useRegex: false,
  fuzzyMatch: true,
  maxResults: DEFAULT_MAX_RESULTS,
  includeHidden: false,
};

/**
 * Common Tailwind class suggestions for style search
 */
const COMMON_STYLE_SUGGESTIONS = [
  'flex',
  'grid',
  'hidden',
  'block',
  'inline',
  'text-',
  'bg-',
  'border-',
  'rounded-',
  'shadow-',
  'p-',
  'm-',
  'w-',
  'h-',
  'gap-',
  'items-',
  'justify-',
  'font-',
  'hover:',
  'focus:',
  'sm:',
  'md:',
  'lg:',
];

// ============================================================================
// FUZZY MATCHING
// ============================================================================

/**
 * Calculate Levenshtein distance for fuzzy matching
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;

  if (m === 0) return n;
  if (n === 0) return m;

  // Create distance matrix
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Initialize first column
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }

  // Initialize first row
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

/**
 * Calculate fuzzy match score (0-1, higher is better)
 */
function calculateFuzzyScore(query: string, target: string): number {
  const normalizedQuery = query.toLowerCase();
  const normalizedTarget = target.toLowerCase();

  // Exact match gets highest score
  if (normalizedTarget === normalizedQuery) {
    return 1;
  }

  // Starts with query gets high score
  if (normalizedTarget.startsWith(normalizedQuery)) {
    return 0.9;
  }

  // Contains query gets medium-high score
  if (normalizedTarget.includes(normalizedQuery)) {
    const position = normalizedTarget.indexOf(normalizedQuery);
    return 0.8 - (position / normalizedTarget.length) * 0.2;
  }

  // Calculate Levenshtein distance for fuzzy match
  const distance = levenshteinDistance(normalizedQuery, normalizedTarget);
  const maxLength = Math.max(normalizedQuery.length, normalizedTarget.length);
  const similarity = 1 - distance / maxLength;

  // Only consider it a match if similarity is above threshold
  if (similarity >= 0.6) {
    return similarity * 0.7;
  }

  // Check for subsequence match (e.g., "pb" matches "primary-button")
  let queryIdx = 0;
  let matchedChars = 0;
  for (let i = 0; i < normalizedTarget.length && queryIdx < normalizedQuery.length; i++) {
    if (normalizedTarget[i] === normalizedQuery[queryIdx]) {
      queryIdx++;
      matchedChars++;
    }
  }

  if (queryIdx === normalizedQuery.length) {
    return 0.5 * (matchedChars / normalizedTarget.length);
  }

  return 0;
}

/**
 * Check if query matches target using various matching strategies
 */
function matchesQuery(
  query: string,
  target: string,
  options: SearchOptions
): { matches: boolean; score: number; highlights: TextHighlight[] } {
  const highlights: TextHighlight[] = [];

  if (!query || !target) {
    return { matches: false, score: 0, highlights };
  }

  // Handle regex matching
  if (options.useRegex) {
    try {
      const flags = options.caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(query, flags);
      let match;
      let hasMatch = false;

      while ((match = regex.exec(target)) !== null) {
        hasMatch = true;
        highlights.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
        });
      }

      return { matches: hasMatch, score: hasMatch ? 0.9 : 0, highlights };
    } catch {
      // Invalid regex, fall through to normal matching
      return { matches: false, score: 0, highlights };
    }
  }

  const normalizedQuery = options.caseSensitive ? query : query.toLowerCase();
  const normalizedTarget = options.caseSensitive ? target : target.toLowerCase();

  // Exact match
  if (normalizedTarget === normalizedQuery) {
    highlights.push({ start: 0, end: target.length, text: target });
    return { matches: true, score: 1, highlights };
  }

  // Contains match
  const index = normalizedTarget.indexOf(normalizedQuery);
  if (index !== -1) {
    highlights.push({
      start: index,
      end: index + query.length,
      text: target.substring(index, index + query.length),
    });
    return { matches: true, score: 0.8, highlights };
  }

  // Fuzzy match
  if (options.fuzzyMatch) {
    const score = calculateFuzzyScore(query, target);
    if (score > 0.3) {
      return { matches: true, score, highlights };
    }
  }

  return { matches: false, score: 0, highlights };
}

// ============================================================================
// ELEMENT SEARCH
// ============================================================================

/**
 * Get all text content from an element's props
 */
function getElementTextContent(element: BuilderElement): string {
  const textProps = ['text', 'label', 'title', 'placeholder', 'content', 'children'];
  const texts: string[] = [];

  for (const prop of textProps) {
    const value = element.props[prop];
    if (typeof value === 'string') {
      texts.push(value);
    }
  }

  return texts.join(' ');
}

/**
 * Get all style classes from an element
 */
function getElementStyles(element: BuilderElement): string[] {
  const classes: string[] = [];

  // Collect all style classes
  for (const category of Object.keys(element.styles) as (keyof typeof element.styles)[]) {
    const styles = element.styles[category];
    if (Array.isArray(styles)) {
      classes.push(...styles);
    } else if (typeof styles === 'object') {
      // Handle responsive styles
      for (const breakpoint of Object.keys(styles)) {
        const breakpointStyles = styles[breakpoint as keyof typeof styles];
        if (Array.isArray(breakpointStyles)) {
          classes.push(...breakpointStyles);
        }
      }
    }
  }

  return classes;
}

/**
 * Get the path to an element (for breadcrumb display)
 */
function getElementPath(
  elements: BuilderElement[],
  targetId: string,
  currentPath: string[] = []
): string[] | null {
  for (const element of elements) {
    const newPath = [...currentPath, element.name || element.type];

    if (element.id === targetId) {
      return newPath;
    }

    const childPath = getElementPath(element.children, targetId, newPath);
    if (childPath) {
      return childPath;
    }
  }

  return null;
}

/**
 * Search a single element
 */
function searchElement(
  element: BuilderElement,
  query: string,
  options: SearchOptions,
  elements: BuilderElement[]
): ElementSearchResult | null {
  const results: { type: SearchType; text: string; score: number; highlights: TextHighlight[] }[] = [];

  // Search by name
  if (options.searchType === 'all' || options.searchType === 'name') {
    const match = matchesQuery(query, element.name, options);
    if (match.matches) {
      results.push({ type: 'name', text: element.name, score: match.score, highlights: match.highlights });
    }
  }

  // Search by type
  if (options.searchType === 'all' || options.searchType === 'type') {
    const match = matchesQuery(query, element.type, options);
    if (match.matches) {
      results.push({ type: 'type', text: element.type, score: match.score, highlights: match.highlights });
    }
  }

  // Search by content
  if (options.searchType === 'all' || options.searchType === 'content') {
    const content = getElementTextContent(element);
    const match = matchesQuery(query, content, options);
    if (match.matches) {
      results.push({ type: 'content', text: content, score: match.score, highlights: match.highlights });
    }
  }

  // Search by style
  if (options.searchType === 'all' || options.searchType === 'style') {
    const styles = getElementStyles(element);
    for (const style of styles) {
      const match = matchesQuery(query, style, options);
      if (match.matches) {
        results.push({ type: 'style', text: style, score: match.score, highlights: match.highlights });
        break; // Only need one style match
      }
    }
  }

  if (results.length === 0) {
    return null;
  }

  // Get the best match
  const bestMatch = results.reduce((best, current) =>
    current.score > best.score ? current : best
  );

  const path = getElementPath(elements, element.id) || [];

  return {
    element,
    matchType: bestMatch.type,
    matchedText: bestMatch.text,
    score: bestMatch.score,
    path,
    highlights: bestMatch.highlights,
  };
}

/**
 * Recursively search all elements
 */
function searchElementsRecursive(
  elements: BuilderElement[],
  query: string,
  options: SearchOptions,
  rootElements: BuilderElement[],
  results: ElementSearchResult[]
): void {
  for (const element of elements) {
    if (results.length >= options.maxResults) {
      return;
    }

    const result = searchElement(element, query, options, rootElements);
    if (result) {
      results.push(result);
    }

    // Search children
    searchElementsRecursive(element.children, query, options, rootElements, results);
  }
}

/**
 * Search canvas elements
 */
export function searchElements(
  elements: BuilderElement[],
  query: string,
  options: Partial<SearchOptions> = {}
): ElementSearchResult[] {
  const mergedOptions: SearchOptions = { ...DEFAULT_SEARCH_OPTIONS, ...options };
  const results: ElementSearchResult[] = [];

  if (!query.trim()) {
    return results;
  }

  searchElementsRecursive(elements, query, mergedOptions, elements, results);

  // Sort by score (descending)
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, mergedOptions.maxResults);
}

// ============================================================================
// COMPONENT SEARCH
// ============================================================================

/**
 * Search sidebar components
 */
export function searchComponentsAdvanced(
  query: string,
  options: Partial<SearchOptions> = {}
): ComponentSearchResult[] {
  const mergedOptions: SearchOptions = { ...DEFAULT_SEARCH_OPTIONS, ...options };
  const results: ComponentSearchResult[] = [];

  if (!query.trim()) {
    return results;
  }

  for (const component of allComponents) {
    if (results.length >= mergedOptions.maxResults) {
      break;
    }

    // Search by name
    const nameMatch = matchesQuery(query, component.name, mergedOptions);
    if (nameMatch.matches) {
      results.push({
        component,
        matchType: 'name',
        matchedText: component.name,
        score: nameMatch.score,
        highlights: nameMatch.highlights,
      });
      continue;
    }

    // Search by type
    const typeMatch = matchesQuery(query, component.type, mergedOptions);
    if (typeMatch.matches) {
      results.push({
        component,
        matchType: 'type',
        matchedText: component.type,
        score: typeMatch.score * 0.9, // Slightly lower priority
        highlights: typeMatch.highlights,
      });
      continue;
    }

    // Search by category
    const categoryMatch = matchesQuery(query, component.category, mergedOptions);
    if (categoryMatch.matches) {
      results.push({
        component,
        matchType: 'category',
        matchedText: component.category,
        score: categoryMatch.score * 0.8, // Lower priority
        highlights: categoryMatch.highlights,
      });
    }
  }

  // Sort by score (descending)
  results.sort((a, b) => b.score - a.score);

  return results;
}

// ============================================================================
// COMBINED SEARCH
// ============================================================================

/**
 * Search both elements and components
 */
export function performSearch(
  elements: BuilderElement[],
  query: string,
  options: Partial<SearchOptions> = {}
): SearchResults {
  const startTime = performance.now();
  const mergedOptions: SearchOptions = { ...DEFAULT_SEARCH_OPTIONS, ...options };

  let elementResults: ElementSearchResult[] = [];
  let componentResults: ComponentSearchResult[] = [];

  // Search based on scope
  if (mergedOptions.scope === 'canvas' || mergedOptions.scope === 'all') {
    elementResults = searchElements(elements, query, mergedOptions);
  }

  if (mergedOptions.scope === 'sidebar' || mergedOptions.scope === 'all') {
    componentResults = searchComponentsAdvanced(query, mergedOptions);
  }

  const executionTime = performance.now() - startTime;

  return {
    elements: elementResults,
    components: componentResults,
    totalCount: elementResults.length + componentResults.length,
    query,
    executionTime,
  };
}

// ============================================================================
// SEARCH HISTORY
// ============================================================================

/**
 * Get search history from storage
 */
export function getSearchHistory(): SearchHistoryEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as SearchHistoryEntry[];
  } catch {
    return [];
  }
}

/**
 * Add entry to search history
 */
export function addToSearchHistory(
  query: string,
  resultCount: number,
  scope: SearchScope
): void {
  if (typeof window === 'undefined' || !query.trim()) {
    return;
  }

  try {
    const history = getSearchHistory();

    // Remove existing entry with same query
    const filteredHistory = history.filter(
      (entry) => entry.query.toLowerCase() !== query.toLowerCase()
    );

    // Add new entry at the beginning
    const newEntry: SearchHistoryEntry = {
      query,
      timestamp: Date.now(),
      resultCount,
      scope,
    };

    filteredHistory.unshift(newEntry);

    // Limit history size
    const limitedHistory = filteredHistory.slice(0, MAX_HISTORY_ENTRIES);

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch {
    // Silently fail if storage is unavailable
  }
}

/**
 * Clear search history
 */
export function clearSearchHistory(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch {
    // Silently fail
  }
}

/**
 * Remove specific entry from history
 */
export function removeFromSearchHistory(query: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const history = getSearchHistory();
    const filtered = history.filter(
      (entry) => entry.query.toLowerCase() !== query.toLowerCase()
    );
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filtered));
  } catch {
    // Silently fail
  }
}

// ============================================================================
// SEARCH SUGGESTIONS
// ============================================================================

/**
 * Get search suggestions based on query
 */
export function getSearchSuggestions(
  query: string,
  elements: BuilderElement[],
  includeHistory: boolean = true
): SearchSuggestion[] {
  const suggestions: SearchSuggestion[] = [];
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    // Show recent history when no query
    if (includeHistory) {
      const history = getSearchHistory();
      for (const entry of history.slice(0, 5)) {
        suggestions.push({
          text: entry.query,
          type: 'history',
          icon: 'History',
        });
      }
    }
    return suggestions;
  }

  // Add matching history entries
  if (includeHistory) {
    const history = getSearchHistory();
    for (const entry of history) {
      if (suggestions.length >= MAX_SUGGESTIONS) break;
      if (entry.query.toLowerCase().includes(normalizedQuery)) {
        suggestions.push({
          text: entry.query,
          type: 'history',
          icon: 'History',
        });
      }
    }
  }

  // Add matching element names
  const elementNames = new Set<string>();
  function collectNames(els: BuilderElement[]) {
    for (const el of els) {
      if (el.name.toLowerCase().includes(normalizedQuery)) {
        elementNames.add(el.name);
      }
      collectNames(el.children);
    }
  }
  collectNames(elements);

  for (const name of Array.from(elementNames)) {
    if (suggestions.length >= MAX_SUGGESTIONS) break;
    if (!suggestions.find((s) => s.text === name)) {
      suggestions.push({
        text: name,
        type: 'element',
        icon: 'Box',
      });
    }
  }

  // Add matching component names
  for (const component of allComponents) {
    if (suggestions.length >= MAX_SUGGESTIONS) break;
    if (component.name.toLowerCase().includes(normalizedQuery)) {
      if (!suggestions.find((s) => s.text === component.name)) {
        suggestions.push({
          text: component.name,
          type: 'component',
          icon: component.icon,
        });
      }
    }
  }

  // Add matching style suggestions
  for (const style of COMMON_STYLE_SUGGESTIONS) {
    if (suggestions.length >= MAX_SUGGESTIONS) break;
    if (style.startsWith(normalizedQuery)) {
      suggestions.push({
        text: style,
        type: 'style',
        icon: 'Paintbrush',
      });
    }
  }

  return suggestions.slice(0, MAX_SUGGESTIONS);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Highlight text with search matches
 */
export function highlightText(
  text: string,
  highlights: TextHighlight[]
): Array<{ text: string; highlighted: boolean }> {
  if (highlights.length === 0) {
    return [{ text, highlighted: false }];
  }

  // Sort highlights by start position
  const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

  const parts: Array<{ text: string; highlighted: boolean }> = [];
  let currentIndex = 0;

  for (const highlight of sortedHighlights) {
    // Add text before highlight
    if (highlight.start > currentIndex) {
      parts.push({
        text: text.substring(currentIndex, highlight.start),
        highlighted: false,
      });
    }

    // Add highlighted text
    parts.push({
      text: text.substring(highlight.start, highlight.end),
      highlighted: true,
    });

    currentIndex = highlight.end;
  }

  // Add remaining text
  if (currentIndex < text.length) {
    parts.push({
      text: text.substring(currentIndex),
      highlighted: false,
    });
  }

  return parts;
}

/**
 * Escape regex special characters
 */
export function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validate regex pattern
 */
export function isValidRegex(pattern: string): boolean {
  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}

/**
 * Find and replace in elements
 */
export function findAndReplace(
  elements: BuilderElement[],
  searchQuery: string,
  replaceText: string,
  options: Partial<SearchOptions> = {}
): { updatedElements: BuilderElement[]; replacementCount: number } {
  const mergedOptions: SearchOptions = { ...DEFAULT_SEARCH_OPTIONS, ...options };
  let replacementCount = 0;

  function replaceInElement(element: BuilderElement): BuilderElement {
    const newProps = { ...element.props };
    const textProps = ['text', 'label', 'title', 'placeholder', 'content'];

    for (const prop of textProps) {
      const value = newProps[prop];
      if (typeof value === 'string') {
        let newValue: string;

        if (mergedOptions.useRegex) {
          try {
            const flags = mergedOptions.caseSensitive ? 'g' : 'gi';
            const regex = new RegExp(searchQuery, flags);
            const matches = value.match(regex);
            if (matches) {
              replacementCount += matches.length;
              newValue = value.replace(regex, replaceText);
            } else {
              newValue = value;
            }
          } catch {
            newValue = value;
          }
        } else {
          const flags = mergedOptions.caseSensitive ? 'g' : 'gi';
          const escapedQuery = escapeRegex(searchQuery);
          const regex = new RegExp(escapedQuery, flags);
          const matches = value.match(regex);
          if (matches) {
            replacementCount += matches.length;
            newValue = value.replace(regex, replaceText);
          } else {
            newValue = value;
          }
        }

        newProps[prop] = newValue;
      }
    }

    // Also update name if it matches
    let newName = element.name;
    if (mergedOptions.searchType === 'all' || mergedOptions.searchType === 'name') {
      const flags = mergedOptions.caseSensitive ? 'g' : 'gi';
      const escapedQuery = mergedOptions.useRegex ? searchQuery : escapeRegex(searchQuery);
      try {
        const regex = new RegExp(escapedQuery, flags);
        if (regex.test(element.name)) {
          newName = element.name.replace(regex, replaceText);
          replacementCount++;
        }
      } catch {
        // Invalid regex, skip
      }
    }

    return {
      ...element,
      name: newName,
      props: newProps,
      children: element.children.map(replaceInElement),
    };
  }

  const updatedElements = elements.map(replaceInElement);

  return { updatedElements, replacementCount };
}

// ============================================================================
// SEARCH SYSTEM CLASS
// ============================================================================

/**
 * Search System class for managing search state and operations
 */
export class SearchSystem {
  private options: SearchOptions;
  private lastQuery: string = '';
  private lastResults: SearchResults | null = null;

  constructor(options: Partial<SearchOptions> = {}) {
    this.options = { ...DEFAULT_SEARCH_OPTIONS, ...options };
  }

  /**
   * Update search options
   */
  setOptions(options: Partial<SearchOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Get current options
   */
  getOptions(): SearchOptions {
    return { ...this.options };
  }

  /**
   * Perform search and cache results
   */
  search(elements: BuilderElement[], query: string): SearchResults {
    this.lastQuery = query;
    this.lastResults = performSearch(elements, query, this.options);

    // Add to history if results found
    if (this.lastResults.totalCount > 0) {
      addToSearchHistory(query, this.lastResults.totalCount, this.options.scope);
    }

    return this.lastResults;
  }

  /**
   * Get cached results
   */
  getLastResults(): SearchResults | null {
    return this.lastResults;
  }

  /**
   * Get last query
   */
  getLastQuery(): string {
    return this.lastQuery;
  }

  /**
   * Clear cached results
   */
  clearResults(): void {
    this.lastQuery = '';
    this.lastResults = null;
  }

  /**
   * Get suggestions for current query
   */
  getSuggestions(elements: BuilderElement[]): SearchSuggestion[] {
    return getSearchSuggestions(this.lastQuery, elements);
  }
}

// Export default instance
export const defaultSearchSystem = new SearchSystem();
