import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SearchSuggestion {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface SearchBarProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  loading?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  showButton?: boolean;
  buttonText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  clearable?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  defaultValue = '',
  onChange,
  onSearch,
  onSuggestionSelect,
  placeholder = 'Search...',
  suggestions = [],
  loading = false,
  disabled = false,
  autoFocus = false,
  showButton = true,
  buttonText = 'Search',
  size = 'md',
  variant = 'default',
  clearable = true,
  className,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const searchValue = value ?? internalValue;
  const showSuggestions = isFocused && suggestions.length > 0 && searchValue.length > 0;

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    onChange?.(newValue);
    setHighlightedIndex(-1);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() && !disabled) {
      onSearch?.(searchValue.trim());
      setIsFocused(false);
    }
  };

  const handleClear = () => {
    handleChange('');
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleChange(suggestion.label);
    onSuggestionSelect?.(suggestion);
    setIsFocused(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        if (highlightedIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const sizeClasses = {
    sm: {
      wrapper: 'h-9',
      input: 'text-sm pl-9 pr-3',
      icon: 'left-2.5 w-4 h-4',
      button: 'px-3 text-sm',
      clear: 'right-2',
    },
    md: {
      wrapper: 'h-11',
      input: 'text-sm pl-10 pr-4',
      icon: 'left-3 w-5 h-5',
      button: 'px-4 text-sm',
      clear: 'right-3',
    },
    lg: {
      wrapper: 'h-14',
      input: 'text-base pl-12 pr-5',
      icon: 'left-4 w-6 h-6',
      button: 'px-6 text-base',
      clear: 'right-4',
    },
  };

  const variantClasses = {
    default: 'bg-white border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500',
    filled: 'bg-gray-100 border border-transparent focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500',
    outlined: 'bg-transparent border-2 border-gray-300 focus-within:border-blue-500',
  };

  const sizes = sizeClasses[size];

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit} role="search">
        <div
          className={cn(
            'flex items-center rounded-lg transition-all',
            sizes.wrapper,
            variantClasses[variant],
            disabled && 'opacity-60 cursor-not-allowed'
          )}
        >
          {/* Search Icon */}
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none',
              sizes.icon
            )}
            aria-hidden="true"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Search />
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="search"
            value={searchValue}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            autoComplete="off"
            aria-label="Search"
            aria-autocomplete={suggestions.length > 0 ? 'list' : undefined}
            aria-controls={showSuggestions ? 'search-suggestions' : undefined}
            aria-expanded={showSuggestions}
            aria-activedescendant={
              highlightedIndex >= 0
                ? `suggestion-${suggestions[highlightedIndex]?.id}`
                : undefined
            }
            className={cn(
              'flex-1 h-full bg-transparent border-none outline-none',
              sizes.input,
              showButton && 'rounded-r-none',
              clearable && searchValue && 'pr-10',
              disabled && 'cursor-not-allowed'
            )}
          />

          {/* Clear Button */}
          {clearable && searchValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors',
                sizes.clear,
                showButton && 'right-[calc(4rem+1rem)]'
              )}
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search Button */}
          {showButton && (
            <button
              type="submit"
              disabled={disabled || !searchValue.trim()}
              className={cn(
                'h-full bg-blue-600 text-white font-medium rounded-r-lg transition-colors',
                'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset',
                'disabled:bg-gray-300 disabled:cursor-not-allowed',
                sizes.button
              )}
            >
              {buttonText}
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <ul
          id="search-suggestions"
          ref={listRef}
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              id={`suggestion-${suggestion.id}`}
              role="option"
              aria-selected={index === highlightedIndex}
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                index === highlightedIndex
                  ? 'bg-blue-50 text-blue-700'
                  : 'hover:bg-gray-50'
              )}
            >
              {suggestion.icon && (
                <span className="flex-shrink-0 text-gray-400" aria-hidden="true">
                  {suggestion.icon}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{suggestion.label}</p>
                {suggestion.description && (
                  <p className="text-xs text-gray-500 truncate">
                    {suggestion.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
