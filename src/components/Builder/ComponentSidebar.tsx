'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import * as Collapsible from '@radix-ui/react-collapsible';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MousePointer,
  Square,
  Menu,
  FormInput,
  Layers,
  LayoutGrid,
  Image,
  Type,
  GripVertical,
  X,
  Star,
  Clock,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useBuilderStore } from '@/store/builderStore';
import {
  componentsByCategory,
  categoryMetadata,
} from '@/lib/componentRegistry';
import { DraggableComponent, DraggableComponentListItem } from './DraggableComponent';
import type { ComponentCategory, ComponentDefinition } from '@/types/builder';

// ============================================================================
// CONSTANTS
// ============================================================================

const SIDEBAR_WIDTH = 280;
const SIDEBAR_MIN_WIDTH = 240;
const SIDEBAR_MAX_WIDTH = 400;

const CATEGORY_ORDER: ComponentCategory[] = [
  'buttons',
  'cards',
  'navigation',
  'forms',
  'sections',
  'layout',
  'media',
  'text',
];

const CATEGORY_ICONS: Record<ComponentCategory, LucideIcon> = {
  buttons: MousePointer,
  cards: Square,
  navigation: Menu,
  forms: FormInput,
  sections: Layers,
  layout: LayoutGrid,
  media: Image,
  text: Type,
};

const STORAGE_KEY_FAVORITES = 'tailwind-builder-favorites';
const STORAGE_KEY_RECENT = 'tailwind-builder-recent';
const MAX_RECENT_ITEMS = 8;

// ============================================================================
// TYPES
// ============================================================================

type ViewMode = 'grid' | 'list';

// ============================================================================
// FUZZY SEARCH HELPER
// ============================================================================

function fuzzyMatch(text: string, query: string): boolean {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // Direct includes check
  if (textLower.includes(queryLower)) {
    return true;
  }

  // Fuzzy match - all query chars must appear in order
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }

  return queryIndex === queryLower.length;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search components..."
        className={cn(
          'w-full pl-9 pr-8 py-2 text-sm',
          'bg-gray-800/50 border border-gray-700/50 rounded-lg',
          'text-gray-200 placeholder:text-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50',
          'transition-all duration-200'
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2',
            'w-5 h-5 flex items-center justify-center rounded-full',
            'text-gray-500 hover:text-gray-300 hover:bg-gray-700',
            'transition-colors duration-150'
          )}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

interface CategoryHeaderProps {
  category: ComponentCategory;
  count: number;
}

function CategoryHeader({ category, count }: CategoryHeaderProps) {
  const Icon = CATEGORY_ICONS[category];
  const metadata = categoryMetadata[category];

  return (
    <Accordion.Header className="flex">
      <Accordion.Trigger
        className={cn(
          'flex items-center justify-between w-full px-3 py-2.5 text-left',
          'text-sm font-medium text-gray-300',
          'hover:bg-gray-800/50 hover:text-gray-100',
          'rounded-lg transition-colors duration-150',
          'group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50'
        )}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'flex items-center justify-center w-7 h-7 rounded-md',
              'bg-gray-800 text-gray-400',
              'group-hover:bg-blue-600/20 group-hover:text-blue-400',
              'transition-colors duration-150'
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
          <span>{metadata.label}</span>
          <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-500 transition-transform duration-200',
            'group-data-[state=open]:rotate-180'
          )}
        />
      </Accordion.Trigger>
    </Accordion.Header>
  );
}

interface ComponentGridProps {
  components: ComponentDefinition[];
  viewMode: ViewMode;
  favorites: string[];
  onToggleFavorite: (type: string) => void;
  onComponentClick: (type: string) => void;
}

function ComponentGrid({
  components,
  viewMode,
  favorites,
  onToggleFavorite,
  onComponentClick,
}: ComponentGridProps) {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-1 px-1">
        {components.map((component) => (
          <div
            key={component.type}
            className="relative group"
            onClick={() => onComponentClick(component.type)}
          >
            <DraggableComponentListItem component={component} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(component.type);
              }}
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded',
                'opacity-0 group-hover:opacity-100 transition-opacity',
                favorites.includes(component.type)
                  ? 'text-yellow-400'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <Star
                className={cn('w-3 h-3', favorites.includes(component.type) && 'fill-current')}
              />
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 px-1">
      {components.map((component) => (
        <div
          key={component.type}
          className="relative group"
          onClick={() => onComponentClick(component.type)}
        >
          <DraggableComponent component={component} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(component.type);
            }}
            className={cn(
              'absolute top-1 right-1 p-1 rounded',
              'opacity-0 group-hover:opacity-100 transition-opacity',
              favorites.includes(component.type)
                ? 'text-yellow-400'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            <Star
              className={cn('w-3 h-3', favorites.includes(component.type) && 'fill-current')}
            />
          </button>
        </div>
      ))}
    </div>
  );
}

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

function ViewModeToggle({ viewMode, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-800/50 rounded-lg">
      <button
        onClick={() => onChange('grid')}
        className={cn(
          'p-1.5 rounded-md transition-colors duration-150',
          viewMode === 'grid'
            ? 'bg-gray-700 text-gray-200'
            : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/50'
        )}
        title="Grid view"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </button>
      <button
        onClick={() => onChange('list')}
        className={cn(
          'p-1.5 rounded-md transition-colors duration-150',
          viewMode === 'list'
            ? 'bg-gray-700 text-gray-200'
            : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/50'
        )}
        title="List view"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
          <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
          <line x1="4" y1="18" x2="20" y2="18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

interface SpecialSectionProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  components: ComponentDefinition[];
  isOpen: boolean;
  onToggle: () => void;
  viewMode: ViewMode;
  favorites: string[];
  onToggleFavorite: (type: string) => void;
  onComponentClick: (type: string) => void;
}

function SpecialSection({
  title,
  icon: Icon,
  iconColor,
  components,
  isOpen,
  onToggle,
  viewMode,
  favorites,
  onToggleFavorite,
  onComponentClick,
}: SpecialSectionProps) {
  if (components.length === 0) return null;

  return (
    <Collapsible.Root open={isOpen} onOpenChange={onToggle}>
      <Collapsible.Trigger
        className={cn(
          'flex items-center justify-between w-full px-3 py-2 text-left',
          'text-sm font-medium text-gray-400',
          'hover:bg-gray-800/50 hover:text-gray-300',
          'rounded-lg transition-colors duration-150'
        )}
      >
        <div className="flex items-center gap-2">
          <Icon className={cn('w-4 h-4', iconColor)} />
          <span>{title}</span>
          <span className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded-full">
            {components.length}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-500 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </Collapsible.Trigger>
      <Collapsible.Content
        className={cn(
          'overflow-hidden',
          'data-[state=open]:animate-slideDown',
          'data-[state=closed]:animate-slideUp'
        )}
      >
        <div className="py-2">
          <ComponentGrid
            components={components}
            viewMode={viewMode}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onComponentClick={onComponentClick}
          />
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ComponentSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useBuilderStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [openCategories, setOpenCategories] = useState<string[]>(['layout', 'buttons', 'text']);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  // Favorites and recent - persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);

  // Load favorites and recent from localStorage
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(STORAGE_KEY_FAVORITES);
      const storedRecent = localStorage.getItem(STORAGE_KEY_RECENT);

      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
      if (storedRecent) {
        setRecentlyUsed(JSON.parse(storedRecent));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = useCallback((newFavorites: string[]) => {
    setFavorites(newFavorites);
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(newFavorites));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save recent to localStorage
  const saveRecent = useCallback((newRecent: string[]) => {
    setRecentlyUsed(newRecent);
    try {
      localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(newRecent));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Toggle favorite
  const handleToggleFavorite = useCallback(
    (type: string) => {
      const newFavorites = favorites.includes(type)
        ? favorites.filter((f) => f !== type)
        : [...favorites, type];
      saveFavorites(newFavorites);
    },
    [favorites, saveFavorites]
  );

  // Add to recent
  const handleComponentClick = useCallback(
    (type: string) => {
      const newRecent = [type, ...recentlyUsed.filter((r) => r !== type)].slice(0, MAX_RECENT_ITEMS);
      saveRecent(newRecent);
    },
    [recentlyUsed, saveRecent]
  );

  // Get all components flat list for searching
  const allComponents = useMemo(() => {
    const result: ComponentDefinition[] = [];
    for (const category of CATEGORY_ORDER) {
      result.push(...componentsByCategory[category]);
    }
    return result;
  }, []);

  // Get favorite components
  const favoriteComponents = useMemo(() => {
    return allComponents.filter((c) => favorites.includes(c.type));
  }, [allComponents, favorites]);

  // Get recently used components
  const recentComponents = useMemo(() => {
    return recentlyUsed
      .map((type) => allComponents.find((c) => c.type === type))
      .filter(Boolean) as ComponentDefinition[];
  }, [allComponents, recentlyUsed]);

  /**
   * Filter components based on search query with fuzzy matching
   */
  const filteredComponentsByCategory = useMemo(() => {
    if (!searchQuery.trim()) {
      return componentsByCategory;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered: Record<ComponentCategory, ComponentDefinition[]> = {
      buttons: [],
      cards: [],
      navigation: [],
      forms: [],
      sections: [],
      layout: [],
      media: [],
      text: [],
    };

    for (const category of CATEGORY_ORDER) {
      filtered[category] = componentsByCategory[category].filter(
        (component) =>
          fuzzyMatch(component.name, query) ||
          fuzzyMatch(component.type, query)
      );
    }

    return filtered;
  }, [searchQuery]);

  /**
   * Get categories that have matching components
   */
  const visibleCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return CATEGORY_ORDER;
    }

    return CATEGORY_ORDER.filter(
      (category) => filteredComponentsByCategory[category].length > 0
    );
  }, [searchQuery, filteredComponentsByCategory]);

  /**
   * Total matching components count
   */
  const totalMatchingComponents = useMemo(() => {
    return visibleCategories.reduce(
      (total, category) => total + filteredComponentsByCategory[category].length,
      0
    );
  }, [visibleCategories, filteredComponentsByCategory]);

  /**
   * Handle sidebar resize
   */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.min(
        Math.max(startWidth + delta, SIDEBAR_MIN_WIDTH),
        SIDEBAR_MAX_WIDTH
      );
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [sidebarWidth]);

  /**
   * Expand all categories when searching
   */
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      setOpenCategories(CATEGORY_ORDER);
    }
  }, []);

  // Collapsed state
  if (sidebarCollapsed) {
    return (
      <div
        className={cn(
          'flex-shrink-0 h-full',
          'bg-gray-900 border-r border-gray-800',
          'transition-all duration-300 ease-in-out'
        )}
        style={{ width: 48 }}
      >
        <button
          onClick={toggleSidebar}
          className={cn(
            'w-full h-14 flex items-center justify-center',
            'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50',
            'border-b border-gray-800',
            'transition-colors duration-150'
          )}
          title="Expand sidebar"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="mt-4 space-y-2 px-2">
          {CATEGORY_ORDER.map((category) => {
            const Icon = CATEGORY_ICONS[category];
            return (
              <button
                key={category}
                className={cn(
                  'w-full p-2 rounded-lg',
                  'text-gray-400 hover:text-gray-200 hover:bg-gray-800',
                  'transition-colors duration-150'
                )}
                title={categoryMetadata[category].label}
              >
                <Icon className="w-4 h-4 mx-auto" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative flex-shrink-0 h-full flex flex-col',
        'bg-gray-900 border-r border-gray-800',
        'transition-all duration-300 ease-in-out',
        isResizing && 'select-none'
      )}
      style={{ width: sidebarWidth }}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-200">Components</h2>
          <div className="flex items-center gap-1">
            <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
            <button
              onClick={toggleSidebar}
              className={cn(
                'p-1.5 rounded-md ml-1',
                'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50',
                'transition-colors duration-150'
              )}
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
        <SearchInput value={searchQuery} onChange={handleSearchChange} />
        {searchQuery && (
          <p className="mt-2 text-xs text-gray-500">
            {totalMatchingComponents} component{totalMatchingComponents !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Component Categories */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="p-2">
          {/* Favorites Section */}
          {!searchQuery && (
            <SpecialSection
              title="Favorites"
              icon={Star}
              iconColor="text-yellow-400"
              components={favoriteComponents}
              isOpen={showFavorites}
              onToggle={() => setShowFavorites(!showFavorites)}
              viewMode={viewMode}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onComponentClick={handleComponentClick}
            />
          )}

          {/* Recently Used Section */}
          {!searchQuery && recentComponents.length > 0 && (
            <SpecialSection
              title="Recently Used"
              icon={Clock}
              iconColor="text-blue-400"
              components={recentComponents}
              isOpen={showRecent}
              onToggle={() => setShowRecent(!showRecent)}
              viewMode={viewMode}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onComponentClick={handleComponentClick}
            />
          )}

          {/* Divider if showing special sections */}
          {!searchQuery && (favoriteComponents.length > 0 || recentComponents.length > 0) && (
            <div className="my-2 border-t border-gray-800" />
          )}

          {visibleCategories.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p className="text-sm">No components found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          ) : (
            <Accordion.Root
              type="multiple"
              value={openCategories}
              onValueChange={setOpenCategories}
              className="space-y-1"
            >
              {visibleCategories.map((category) => {
                const components = filteredComponentsByCategory[category];

                return (
                  <Accordion.Item
                    key={category}
                    value={category}
                    className="rounded-lg overflow-hidden"
                  >
                    <CategoryHeader
                      category={category}
                      count={components.length}
                    />
                    <Accordion.Content
                      className={cn(
                        'overflow-hidden',
                        'data-[state=open]:animate-slideDown',
                        'data-[state=closed]:animate-slideUp'
                      )}
                    >
                      <div className="py-2">
                        <ComponentGrid
                          components={components}
                          viewMode={viewMode}
                          favorites={favorites}
                          onToggleFavorite={handleToggleFavorite}
                          onComponentClick={handleComponentClick}
                        />
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                );
              })}
            </Accordion.Root>
          )}
        </div>
      </div>

      {/* Info footer */}
      <div className="px-4 py-3 border-t border-gray-800 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>Drag components onto the canvas</span>
          <span className="text-gray-600">Ctrl+K to search</span>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={cn(
          'absolute top-0 right-0 w-1 h-full cursor-col-resize',
          'bg-transparent hover:bg-blue-500/50',
          'transition-colors duration-150',
          isResizing && 'bg-blue-500'
        )}
      >
        <div
          className={cn(
            'absolute top-1/2 right-0 -translate-y-1/2',
            'opacity-0 hover:opacity-100',
            'transition-opacity duration-150'
          )}
        >
          <GripVertical className="w-3 h-3 text-gray-500" />
        </div>
      </div>
    </div>
  );
}

export default ComponentSidebar;
