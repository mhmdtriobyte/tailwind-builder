'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Replace,
  History,
  Box,
  Paintbrush,
  Component,
  Settings2,
  Regex,
  CaseSensitive,
  Layout,
  Layers,
  FileText,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useBuilderStore } from '@/store/builderStore';
import {
  performSearch,
  clearSearchHistory,
  removeFromSearchHistory,
  getSearchSuggestions,
  findAndReplace,
  highlightText,
  isValidRegex,
  type SearchOptions,
  type SearchScope,
  type SearchType,
  type SearchResults,
  type ElementSearchResult,
  type SearchSuggestion,
} from '@/lib/searchSystem';

// ============================================================================
// TYPES
// ============================================================================

interface GlobalSearchProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface SearchScopeButtonProps {
  scope: SearchScope;
  currentScope: SearchScope;
  onClick: (scope: SearchScope) => void;
  icon: React.ReactNode;
  label: string;
}

function SearchScopeButton({
  scope,
  currentScope,
  onClick,
  icon,
  label,
}: SearchScopeButtonProps) {
  return (
    <button
      onClick={() => onClick(scope)}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors',
        currentScope === scope
          ? 'bg-blue-600 text-white'
          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

interface SearchOptionToggleProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}

function SearchOptionToggle({
  active,
  onClick,
  icon,
  label,
  disabled,
}: SearchOptionToggleProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center p-1.5 rounded transition-colors',
        active
          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
          : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800 border border-transparent',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      title={label}
    >
      {icon}
    </button>
  );
}

interface SearchResultItemProps {
  result: ElementSearchResult;
  isSelected: boolean;
  onClick: () => void;
}

function SearchResultItem({ result, isSelected, onClick }: SearchResultItemProps) {
  const { element, matchType, matchedText, path, highlights } = result;

  const highlightedParts = useMemo(() => {
    return highlightText(matchedText, highlights);
  }, [matchedText, highlights]);

  const matchTypeIcon = {
    name: <FileText className="w-3 h-3" />,
    type: <Box className="w-3 h-3" />,
    content: <Layers className="w-3 h-3" />,
    style: <Paintbrush className="w-3 h-3" />,
    all: <Search className="w-3 h-3" />,
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-3 py-2 transition-colors',
        isSelected
          ? 'bg-blue-600/20 border-l-2 border-blue-500'
          : 'hover:bg-gray-800/50 border-l-2 border-transparent'
      )}
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-gray-500">{matchTypeIcon[matchType]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-200 truncate">
              {element.name}
            </span>
            <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
              {element.type}
            </span>
          </div>

          {/* Path breadcrumb */}
          {path.length > 1 && (
            <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
              {path.slice(0, -1).map((p, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="truncate max-w-[80px]">{p}</span>
                  {i < path.length - 2 && <ArrowRight className="w-2.5 h-2.5" />}
                </span>
              ))}
            </div>
          )}

          {/* Matched text with highlights */}
          {matchedText && matchedText !== element.name && (
            <p className="text-xs text-gray-400 mt-1 truncate">
              {highlightedParts.map((part, i) => (
                <span
                  key={i}
                  className={part.highlighted ? 'bg-yellow-500/30 text-yellow-300' : ''}
                >
                  {part.text}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

interface SuggestionItemProps {
  suggestion: SearchSuggestion;
  isSelected: boolean;
  onClick: () => void;
}

function SuggestionItem({ suggestion, isSelected, onClick }: SuggestionItemProps) {
  const icons = {
    history: <History className="w-3.5 h-3.5" />,
    element: <Box className="w-3.5 h-3.5" />,
    component: <Component className="w-3.5 h-3.5" />,
    style: <Paintbrush className="w-3.5 h-3.5" />,
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors',
        isSelected ? 'bg-gray-800 text-gray-200' : 'text-gray-400 hover:bg-gray-800/50'
      )}
    >
      <span className="text-gray-500">{icons[suggestion.type]}</span>
      <span>{suggestion.text}</span>
    </button>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function GlobalSearch({ isOpen, onOpenChange }: GlobalSearchProps) {
  const { elements, selectElement } = useBuilderStore();

  // Search state
  const [query, setQuery] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showReplace, setShowReplace] = useState(false);
  const [scope, setScope] = useState<SearchScope>('all');
  const [searchType] = useState<SearchType>('all');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  // Results state
  const [results, setResults] = useState<SearchResults | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Search options
  const searchOptions: Partial<SearchOptions> = useMemo(
    () => ({
      scope,
      searchType,
      caseSensitive,
      useRegex,
      fuzzyMatch: !useRegex,
    }),
    [scope, searchType, caseSensitive, useRegex]
  );

  // Perform search
  const doSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults(null);
        setSelectedIndex(0);
        return;
      }

      if (useRegex && !isValidRegex(searchQuery)) {
        return;
      }

      const searchResults = performSearch(elements, searchQuery, searchOptions);
      setResults(searchResults);
      setSelectedIndex(0);
    },
    [elements, searchOptions, useRegex]
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      doSearch(query);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, doSearch]);

  // Update suggestions when query changes
  useEffect(() => {
    if (!query) {
      setSuggestions(getSearchSuggestions('', elements));
    } else {
      setSuggestions(getSearchSuggestions(query, elements));
    }
  }, [query, elements]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setShowSuggestions(false);
    }
  }, [isOpen]);

  // Navigate to selected result
  const navigateToResult = useCallback(
    (result: ElementSearchResult) => {
      selectElement(result.element.id);
      onOpenChange(false);
    },
    [selectElement, onOpenChange]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const totalResults = results?.elements.length || 0;
      const totalSuggestions = suggestions.length;
      const showingResults = results && totalResults > 0;
      const showingSuggestions = !query && showSuggestions && totalSuggestions > 0;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (showingResults) {
            setSelectedIndex((prev) => Math.min(prev + 1, totalResults - 1));
          } else if (showingSuggestions) {
            setSelectedIndex((prev) => Math.min(prev + 1, totalSuggestions - 1));
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;

        case 'Enter':
          e.preventDefault();
          if (showingResults && results.elements[selectedIndex]) {
            navigateToResult(results.elements[selectedIndex]);
          } else if (showingSuggestions && suggestions[selectedIndex]) {
            setQuery(suggestions[selectedIndex].text);
            setShowSuggestions(false);
          }
          break;

        case 'Escape':
          onOpenChange(false);
          break;

        case 'F3':
          e.preventDefault();
          if (showingResults) {
            if (e.shiftKey) {
              setSelectedIndex((prev) => Math.max(prev - 1, 0));
            } else {
              setSelectedIndex((prev) => Math.min(prev + 1, totalResults - 1));
            }
          }
          break;
      }
    },
    [results, suggestions, selectedIndex, query, showSuggestions, navigateToResult, onOpenChange]
  );

  // Replace functionality
  const handleReplace = useCallback(() => {
    if (!query || !results || results.elements.length === 0) return;

    const { replacementCount } = findAndReplace(
      elements,
      query,
      replaceText,
      searchOptions
    );

    if (replacementCount > 0) {
      // Note: This would need to update the store with updatedElements
      // For now, we just show what would be replaced
      console.log(`Would replace ${replacementCount} occurrences`);
    }
  }, [query, replaceText, elements, results, searchOptions]);

  const handleReplaceAll = useCallback(() => {
    handleReplace();
  }, [handleReplace]);

  // Scroll selected result into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const selectedElement = resultsContainerRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Clear history
  const handleClearHistory = useCallback(() => {
    clearSearchHistory();
    setSuggestions([]);
  }, []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-[15%] z-50 w-full max-w-2xl -translate-x-1/2',
            'bg-gray-900 border border-gray-800 rounded-xl shadow-2xl',
            'focus:outline-none'
          )}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(false);
                }}
                onFocus={() => !query && setShowSuggestions(true)}
                placeholder="Search elements, components, or styles..."
                className={cn(
                  'flex-1 bg-transparent text-gray-100 text-lg',
                  'placeholder:text-gray-500 focus:outline-none',
                  useRegex && !isValidRegex(query) && query && 'text-red-400'
                )}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <Dialog.Close asChild>
                <button className="p-1 text-gray-500 hover:text-gray-300 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            {/* Replace input */}
            {showReplace && (
              <div className="flex items-center gap-3 mt-3 pl-8">
                <Replace className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="Replace with..."
                  className={cn(
                    'flex-1 bg-gray-800/50 px-3 py-1.5 rounded-md text-sm',
                    'text-gray-200 placeholder:text-gray-500',
                    'border border-gray-700 focus:border-blue-500 focus:outline-none'
                  )}
                />
                <button
                  onClick={handleReplace}
                  disabled={!query || !results || results.elements.length === 0}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                    'bg-gray-800 text-gray-300 hover:bg-gray-700',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  Replace
                </button>
                <button
                  onClick={handleReplaceAll}
                  disabled={!query || !results || results.elements.length === 0}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                    'bg-blue-600 text-white hover:bg-blue-700',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  Replace All
                </button>
              </div>
            )}

            {/* Search options */}
            <div className="flex items-center justify-between mt-3 pl-8">
              <div className="flex items-center gap-1">
                <SearchScopeButton
                  scope="all"
                  currentScope={scope}
                  onClick={setScope}
                  icon={<Layers className="w-3.5 h-3.5" />}
                  label="All"
                />
                <SearchScopeButton
                  scope="canvas"
                  currentScope={scope}
                  onClick={setScope}
                  icon={<Layout className="w-3.5 h-3.5" />}
                  label="Canvas"
                />
                <SearchScopeButton
                  scope="sidebar"
                  currentScope={scope}
                  onClick={setScope}
                  icon={<Component className="w-3.5 h-3.5" />}
                  label="Sidebar"
                />
              </div>

              <div className="flex items-center gap-1">
                <SearchOptionToggle
                  active={caseSensitive}
                  onClick={() => setCaseSensitive(!caseSensitive)}
                  icon={<CaseSensitive className="w-4 h-4" />}
                  label="Case sensitive (Alt+C)"
                />
                <SearchOptionToggle
                  active={useRegex}
                  onClick={() => setUseRegex(!useRegex)}
                  icon={<Regex className="w-4 h-4" />}
                  label="Use regex (Alt+R)"
                />
                <SearchOptionToggle
                  active={showReplace}
                  onClick={() => setShowReplace(!showReplace)}
                  icon={<Replace className="w-4 h-4" />}
                  label="Replace (Ctrl+H)"
                />
                <button
                  onClick={() => {
                    // Toggle advanced options
                  }}
                  className={cn(
                    'p-1.5 rounded text-gray-500 hover:text-gray-300',
                    'hover:bg-gray-800 transition-colors'
                  )}
                  title="More options"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results / Suggestions */}
          <div
            ref={resultsContainerRef}
            className="max-h-[400px] overflow-y-auto"
          >
            {/* Show suggestions when no query */}
            {!query && showSuggestions && suggestions.length > 0 && (
              <div className="py-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Recent Searches
                  </span>
                  <button
                    onClick={handleClearHistory}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Clear history
                  </button>
                </div>
                {suggestions
                  .filter((s) => s.type === 'history')
                  .map((suggestion, index) => (
                    <div key={suggestion.text} className="flex items-center group">
                      <SuggestionItem
                        suggestion={suggestion}
                        isSelected={selectedIndex === index}
                        onClick={() => {
                          setQuery(suggestion.text);
                          setShowSuggestions(false);
                        }}
                      />
                      <button
                        onClick={() => {
                          removeFromSearchHistory(suggestion.text);
                          setSuggestions(getSearchSuggestions('', elements));
                        }}
                        className={cn(
                          'p-1.5 mr-2 text-gray-500 hover:text-red-400 transition-colors',
                          'opacity-0 group-hover:opacity-100'
                        )}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {/* Show search results */}
            {query && results && (
              <>
                {results.elements.length > 0 ? (
                  <div className="py-2">
                    <div className="px-3 py-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {results.totalCount} result{results.totalCount !== 1 ? 's' : ''} found
                        <span className="ml-2 text-gray-600">
                          ({results.executionTime.toFixed(1)}ms)
                        </span>
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            setSelectedIndex((prev) => Math.max(prev - 1, 0))
                          }
                          disabled={selectedIndex === 0}
                          className={cn(
                            'p-1 rounded text-gray-500 hover:text-gray-300',
                            'hover:bg-gray-800 transition-colors',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                          )}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-gray-500 min-w-[3rem] text-center">
                          {selectedIndex + 1} / {results.elements.length}
                        </span>
                        <button
                          onClick={() =>
                            setSelectedIndex((prev) =>
                              Math.min(prev + 1, results.elements.length - 1)
                            )
                          }
                          disabled={selectedIndex === results.elements.length - 1}
                          className={cn(
                            'p-1 rounded text-gray-500 hover:text-gray-300',
                            'hover:bg-gray-800 transition-colors',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                          )}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {results.elements.map((result, index) => (
                      <div key={result.element.id} data-index={index}>
                        <SearchResultItem
                          result={result}
                          isSelected={selectedIndex === index}
                          onClick={() => navigateToResult(result)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Search className="w-12 h-12 mx-auto text-gray-700 mb-3" />
                    <p className="text-gray-400">No results found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Try a different search term or adjust filters
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Empty state */}
            {!query && !showSuggestions && (
              <div className="py-12 text-center">
                <Search className="w-12 h-12 mx-auto text-gray-700 mb-3" />
                <p className="text-gray-400">Start typing to search</p>
                <p className="text-sm text-gray-500 mt-1">
                  Search elements by name, type, content, or style
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">Enter</kbd>
                {' '}to select
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">
                  <span className="mr-0.5">&#8593;</span>
                  <span>&#8595;</span>
                </kbd>
                {' '}to navigate
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">Esc</kbd>
                {' '}to close
              </span>
            </div>
            <span>
              Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">Ctrl+K</kbd> for quick search
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default GlobalSearch;
