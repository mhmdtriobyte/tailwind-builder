'use client';

import { useState, useMemo, useCallback } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
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

// ============================================================================
// TYPES
// ============================================================================

type ViewMode = 'grid' | 'list';

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
}

function ComponentGrid({ components, viewMode }: ComponentGridProps) {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-1 px-1">
        {components.map((component) => (
          <DraggableComponentListItem key={component.type} component={component} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 px-1">
      {components.map((component) => (
        <DraggableComponent key={component.type} component={component} />
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

  /**
   * Filter components based on search query
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
          component.name.toLowerCase().includes(query) ||
          component.type.toLowerCase().includes(query)
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
        Drag components onto the canvas
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
