'use client';

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  memo,
} from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Tabs from '@radix-ui/react-tabs';
import * as Tooltip from '@radix-ui/react-tooltip';
import {
  Search,
  X,
  Copy,
  Check,
  Clock,
  Star,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  type IconName,
  type IconCategory,
  type IconSize,
  type IconMetadata,
  iconCategories,
  categoryMetadata,
  searchIcons,
  getIconComponent,
  getRecentIcons,
  addToRecentIcons,
  getFavoriteIcons,
  toggleFavoriteIcon,
  iconSizePresets,
  iconToComponentString,
} from '@/lib/iconSystem';
import { ColorPicker } from '@/components/common/ColorPicker';

// ============================================================================
// CONSTANTS
// ============================================================================

const ICON_SIZES: { value: IconSize; label: string }[] = [
  { value: 'sm', label: 'Small (16px)' },
  { value: 'md', label: 'Medium (20px)' },
  { value: 'lg', label: 'Large (24px)' },
  { value: 'xl', label: 'XL (32px)' },
];

const GRID_COLUMN_COUNT = 6;

const CATEGORY_ORDER: IconCategory[] = [
  'arrows',
  'actions',
  'navigation',
  'media',
  'files',
  'communication',
  'alerts',
  'shapes',
  'devices',
  'charts',
  'development',
  'editing',
  'layout',
  'social',
  'commerce',
  'travel',
  'health',
  'nature',
  'weather',
  'misc',
];

// ============================================================================
// TYPES
// ============================================================================

interface IconPickerProps {
  value?: IconName;
  onChange: (iconName: IconName) => void;
  size?: IconSize;
  onSizeChange?: (size: IconSize) => void;
  color?: string;
  onColorChange?: (color: string) => void;
  className?: string;
  disabled?: boolean;
}

interface IconCellProps {
  icon: IconMetadata;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
  previewSize: number;
}

// ============================================================================
// ICON CELL COMPONENT (Memoized for performance)
// ============================================================================

const IconCell = memo(function IconCell({
  icon,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
  previewSize,
}: IconCellProps) {
  const IconComponent = getIconComponent(icon.name);
  const [showTooltip, setShowTooltip] = useState(false);

  if (!IconComponent) return null;

  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root open={showTooltip} onOpenChange={setShowTooltip}>
        <Tooltip.Trigger asChild>
          <button
            onClick={onSelect}
            onContextMenu={(e) => {
              e.preventDefault();
              onToggleFavorite();
            }}
            className={cn(
              'relative flex items-center justify-center w-full h-full',
              'rounded-lg transition-all duration-150',
              isSelected
                ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              isFavorite && !isSelected && 'bg-yellow-500/10'
            )}
          >
            <IconComponent size={previewSize} strokeWidth={2} />
            {isFavorite && (
              <Star
                className="absolute top-0.5 right-0.5 w-2.5 h-2.5 text-yellow-400 fill-yellow-400"
              />
            )}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={cn(
              'px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl',
              'text-sm text-white z-50'
            )}
            sideOffset={5}
          >
            <div className="font-medium">{icon.displayName}</div>
            <div className="text-xs text-gray-400 mt-0.5">
              {icon.tags.slice(0, 3).join(', ')}
            </div>
            <Tooltip.Arrow className="fill-gray-700" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
});

// ============================================================================
// ICON GRID (Scrollable with lazy rendering)
// ============================================================================

interface IconGridProps {
  icons: IconMetadata[];
  selectedIcon?: IconName;
  favoriteIcons: IconName[];
  onSelect: (name: IconName) => void;
  onToggleFavorite: (name: IconName) => void;
  previewSize: number;
}

function IconGrid({
  icons,
  selectedIcon,
  favoriteIcons,
  onSelect,
  onToggleFavorite,
  previewSize,
}: IconGridProps) {
  // Limit displayed icons for performance - show first 100
  const displayedIcons = useMemo(() => {
    return icons.slice(0, 100);
  }, [icons]);

  if (icons.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500">
        No icons found
      </div>
    );
  }

  return (
    <div
      className="grid gap-1 max-h-[280px] overflow-y-auto custom-scrollbar"
      style={{
        gridTemplateColumns: `repeat(${GRID_COLUMN_COUNT}, minmax(0, 1fr))`,
      }}
    >
      {displayedIcons.map((icon) => (
        <div key={icon.name} className="p-0.5">
          <IconCell
            icon={icon}
            isSelected={selectedIcon === icon.name}
            isFavorite={favoriteIcons.includes(icon.name)}
            onSelect={() => onSelect(icon.name)}
            onToggleFavorite={() => onToggleFavorite(icon.name)}
            previewSize={previewSize}
          />
        </div>
      ))}
      {icons.length > 100 && (
        <div className="col-span-full text-center text-xs text-gray-500 py-2">
          Showing 100 of {icons.length} icons. Use search to find more.
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SEARCH INPUT
// ============================================================================

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search icons..."
        className={cn(
          'w-full pl-8 pr-8 py-2 text-sm',
          'bg-gray-800 border border-gray-700 rounded-lg',
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

// ============================================================================
// SIZE SELECTOR
// ============================================================================

interface SizeSelectorProps {
  value: IconSize;
  onChange: (size: IconSize) => void;
}

function SizeSelector({ value, onChange }: SizeSelectorProps) {
  return (
    <div className="flex gap-1">
      {ICON_SIZES.map((size) => (
        <button
          key={size.value}
          onClick={() => onChange(size.value)}
          className={cn(
            'px-2 py-1 text-xs rounded-md transition-colors duration-150',
            value === size.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
          )}
          title={size.label}
        >
          {iconSizePresets[size.value]}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// COPY CODE BUTTON
// ============================================================================

interface CopyCodeButtonProps {
  iconName: IconName;
  size: IconSize;
  color?: string;
}

function CopyCodeButton({ iconName, size, color }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const code = iconToComponentString(iconName, { size, color });
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [iconName, size, color]);

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 text-xs rounded-md',
        'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200',
        'transition-colors duration-150'
      )}
      title="Copy icon code"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

// ============================================================================
// MAIN ICON PICKER COMPONENT
// ============================================================================

export function IconPicker({
  value,
  onChange,
  size = 'md',
  onSizeChange,
  color,
  onColorChange,
  className,
  disabled = false,
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'favorites'>('all');
  const [selectedCategory, setSelectedCategory] = useState<IconCategory | 'all'>('all');
  const [internalSize, setInternalSize] = useState<IconSize>(size);
  const [favoriteIcons, setFavoriteIcons] = useState<IconName[]>([]);
  const [recentIcons, setRecentIcons] = useState<IconName[]>([]);

  // Load favorites and recent icons
  useEffect(() => {
    setFavoriteIcons(getFavoriteIcons());
    setRecentIcons(getRecentIcons());
  }, [open]);

  // Get current size
  const currentSize = onSizeChange ? size : internalSize;

  // Handle size change
  const handleSizeChange = useCallback(
    (newSize: IconSize) => {
      if (onSizeChange) {
        onSizeChange(newSize);
      } else {
        setInternalSize(newSize);
      }
    },
    [onSizeChange]
  );

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    if (activeTab === 'recent') {
      const recentMetadata = recentIcons
        .map((name) => {
          for (const cat of Object.keys(iconCategories) as IconCategory[]) {
            const found = iconCategories[cat].find((i) => i.name === name);
            if (found) return found;
          }
          return null;
        })
        .filter(Boolean) as IconMetadata[];

      if (searchQuery) {
        return recentMetadata.filter(
          (icon) =>
            icon.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            icon.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      return recentMetadata;
    }

    if (activeTab === 'favorites') {
      const favMetadata = favoriteIcons
        .map((name) => {
          for (const cat of Object.keys(iconCategories) as IconCategory[]) {
            const found = iconCategories[cat].find((i) => i.name === name);
            if (found) return found;
          }
          return null;
        })
        .filter(Boolean) as IconMetadata[];

      if (searchQuery) {
        return favMetadata.filter(
          (icon) =>
            icon.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            icon.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      return favMetadata;
    }

    // All icons tab
    if (searchQuery) {
      return searchIcons(searchQuery, 100);
    }

    if (selectedCategory !== 'all') {
      return iconCategories[selectedCategory] || [];
    }

    // Return all categorized icons
    return CATEGORY_ORDER.flatMap((cat) => iconCategories[cat]);
  }, [searchQuery, activeTab, selectedCategory, recentIcons, favoriteIcons]);

  // Handle icon selection
  const handleSelect = useCallback(
    (iconName: IconName) => {
      onChange(iconName);
      addToRecentIcons(iconName);
      setRecentIcons(getRecentIcons());
      setOpen(false);
    },
    [onChange]
  );

  // Handle favorite toggle
  const handleToggleFavorite = useCallback((iconName: IconName) => {
    toggleFavoriteIcon(iconName);
    setFavoriteIcons(getFavoriteIcons());
  }, []);

  // Get selected icon component
  const SelectedIconComponent = value ? getIconComponent(value) : null;

  return (
    <div className={cn('space-y-1.5', className)}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            disabled={disabled}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2',
              'bg-gray-800 border border-gray-700 rounded-md',
              'text-white text-sm',
              'hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500',
              'transition-colors duration-150',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className="flex items-center justify-center w-6 h-6 bg-gray-700 rounded">
              {SelectedIconComponent ? (
                <SelectedIconComponent size={16} strokeWidth={2} />
              ) : (
                <span className="text-gray-500 text-xs">?</span>
              )}
            </div>
            <span className="flex-1 text-left truncate">
              {value || 'Select icon...'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className={cn(
              'w-[340px] bg-gray-900 border border-gray-700 rounded-xl shadow-2xl',
              'z-50 overflow-hidden'
            )}
            sideOffset={5}
            align="start"
          >
            <div className="p-3 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Icon Picker</span>
                {value && (
                  <CopyCodeButton
                    iconName={value}
                    size={currentSize}
                    color={color}
                  />
                )}
              </div>

              {/* Search */}
              <SearchInput value={searchQuery} onChange={setSearchQuery} />

              {/* Tabs */}
              <Tabs.Root value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
                <Tabs.List className="flex gap-1 p-1 bg-gray-800 rounded-lg">
                  <Tabs.Trigger
                    value="all"
                    className={cn(
                      'flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                      activeTab === 'all'
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    )}
                  >
                    All Icons
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="recent"
                    className={cn(
                      'flex items-center gap-1 flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                      activeTab === 'recent'
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    )}
                  >
                    <Clock className="w-3 h-3" />
                    Recent
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="favorites"
                    className={cn(
                      'flex items-center gap-1 flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                      activeTab === 'favorites'
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    )}
                  >
                    <Star className="w-3 h-3" />
                    Favorites
                  </Tabs.Trigger>
                </Tabs.List>
              </Tabs.Root>

              {/* Category Filter (only for 'all' tab) */}
              {activeTab === 'all' && !searchQuery && (
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={cn(
                      'px-2 py-1 text-xs rounded-md transition-colors',
                      selectedCategory === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    )}
                  >
                    All
                  </button>
                  {CATEGORY_ORDER.slice(0, 8).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        'px-2 py-1 text-xs rounded-md transition-colors capitalize',
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      )}
                    >
                      {categoryMetadata[cat].label}
                    </button>
                  ))}
                </div>
              )}

              {/* Icon Grid */}
              <div className="bg-gray-800/50 rounded-lg p-2">
                <IconGrid
                  icons={filteredIcons}
                  selectedIcon={value}
                  favoriteIcons={favoriteIcons}
                  onSelect={handleSelect}
                  onToggleFavorite={handleToggleFavorite}
                  previewSize={iconSizePresets.md}
                />
              </div>

              {/* Size and Color Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Size</label>
                  <SizeSelector value={currentSize} onChange={handleSizeChange} />
                </div>
                {onColorChange && (
                  <div className="w-24">
                    <ColorPicker
                      label="Color"
                      value={color || '#ffffff'}
                      onChange={onColorChange}
                      showPresets
                      showAlpha={false}
                    />
                  </div>
                )}
              </div>

              {/* Preview */}
              {value && (
                <div className="flex items-center justify-center p-4 bg-gray-800 rounded-lg">
                  {SelectedIconComponent && (
                    <SelectedIconComponent
                      size={iconSizePresets[currentSize] * 2}
                      strokeWidth={2}
                      className={color || 'text-white'}
                    />
                  )}
                </div>
              )}

              {/* Results count */}
              <div className="text-xs text-gray-500 text-center">
                {filteredIcons.length} icons {searchQuery && `matching "${searchQuery}"`}
              </div>
            </div>

            <Popover.Arrow className="fill-gray-700" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

// ============================================================================
// INLINE ICON PICKER (For quick selection in toolbars)
// ============================================================================

interface InlineIconPickerProps {
  value?: IconName;
  onChange: (iconName: IconName) => void;
  size?: number;
  className?: string;
}

export function InlineIconPicker({
  value,
  onChange,
  size = 20,
  className,
}: InlineIconPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIcons = useMemo(() => {
    return searchIcons(searchQuery, 50);
  }, [searchQuery]);

  const SelectedIconComponent = value ? getIconComponent(value) : null;

  const handleSelect = useCallback(
    (iconName: IconName) => {
      onChange(iconName);
      addToRecentIcons(iconName);
      setOpen(false);
    },
    [onChange]
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className={cn(
            'flex items-center justify-center p-2 rounded-md',
            'bg-gray-800 border border-gray-700',
            'hover:bg-gray-700 hover:border-gray-600',
            'transition-colors duration-150',
            className
          )}
        >
          {SelectedIconComponent ? (
            <SelectedIconComponent size={size} strokeWidth={2} />
          ) : (
            <span className="text-gray-500 text-xs">+</span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className={cn(
            'w-72 p-3 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50'
          )}
          sideOffset={5}
        >
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          <div className="mt-3 grid grid-cols-6 gap-1 max-h-48 overflow-y-auto custom-scrollbar">
            {filteredIcons.map((icon) => {
              const IconComp = getIconComponent(icon.name);
              if (!IconComp) return null;

              return (
                <button
                  key={icon.name}
                  onClick={() => handleSelect(icon.name)}
                  className={cn(
                    'flex items-center justify-center p-2 rounded-md',
                    'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'transition-colors duration-150',
                    value === icon.name && 'bg-blue-600 text-white'
                  )}
                  title={icon.displayName}
                >
                  <IconComp size={16} strokeWidth={2} />
                </button>
              );
            })}
          </div>
          <Popover.Arrow className="fill-gray-700" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default IconPicker;
