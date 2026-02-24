'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Command,
  Search,
  Clock,
  File,
  Edit3,
  Eye,
  Layers,
  Navigation,
  HelpCircle,
  X,
  RotateCcw,
  RotateCw,
  Copy,
  Clipboard,
  Scissors,
  Trash2,
  CheckSquare,
  Save,
  Download,
  Grid,
  Sidebar,
  Code,
  ZoomIn,
  ZoomOut,
  Maximize,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronsUp,
  ChevronsDown,
  Folder,
  FolderOpen,
  CornerLeftUp,
  CornerRightDown,
  Keyboard,
  Trash,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  getCommandRegistry,
  searchCommands,
  highlightMatches,
  type Command as CommandType,
  type CommandSearchResult,
  type CommandCategory,
  CATEGORY_INFO,
} from '@/lib/commandPalette';
import { formatKeyCombo, getShortcutManager } from '@/lib/keyboardShortcuts';

// ============================================================================
// ICON MAP
// ============================================================================

const iconMap: Record<string, LucideIcon> = {
  RotateCcw,
  RotateCw,
  Copy,
  Clipboard,
  Scissors,
  Trash2,
  Trash,
  CheckSquare,
  Save,
  Download,
  Grid,
  Sidebar,
  Code,
  ZoomIn,
  ZoomOut,
  Maximize,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronsUp,
  ChevronsDown,
  Folder,
  FolderOpen,
  CornerLeftUp,
  CornerRightDown,
  Keyboard,
  Command,
  Clock,
  File,
  Edit3,
  Eye,
  Layers,
  Navigation,
  HelpCircle,
};

const categoryIcons: Record<CommandCategory, LucideIcon> = {
  recent: Clock,
  file: File,
  edit: Edit3,
  view: Eye,
  element: Layers,
  navigation: Navigation,
  help: HelpCircle,
};

// ============================================================================
// TYPES
// ============================================================================

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: CommandType[];
}

// ============================================================================
// COMMAND ITEM COMPONENT
// ============================================================================

interface CommandItemProps {
  command: CommandType;
  isSelected: boolean;
  onSelect: () => void;
  searchResult?: CommandSearchResult;
}

function CommandItem({
  command,
  isSelected,
  onSelect,
  searchResult,
}: CommandItemProps) {
  const Icon = command.icon ? iconMap[command.icon] : Command;
  const shortcutManager = getShortcutManager();

  // Get shortcut display
  const shortcutDisplay = useMemo(() => {
    if (!command.shortcutId) return null;
    const combo = shortcutManager.getActiveKeyCombo(command.shortcutId);
    if (!combo) return null;
    return formatKeyCombo(combo);
  }, [command.shortcutId, shortcutManager]);

  // Highlight matches in name
  const nameDisplay = useMemo(() => {
    if (!searchResult) {
      return <span>{command.name}</span>;
    }

    const nameMatch = searchResult.matches.find((m) => m.field === 'name');
    if (!nameMatch || nameMatch.indices.length === 0) {
      return <span>{command.name}</span>;
    }

    const parts = highlightMatches(command.name, nameMatch.indices);
    return (
      <>
        {parts.map((part, i) => (
          <span
            key={i}
            className={part.highlighted ? 'text-blue-400 font-semibold' : ''}
          >
            {part.text}
          </span>
        ))}
      </>
    );
  }, [command.name, searchResult]);

  return (
    <button
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-md transition-colors',
        isSelected
          ? 'bg-blue-600/20 text-white'
          : 'text-gray-300 hover:bg-gray-800/50'
      )}
      onClick={onSelect}
      onMouseEnter={(e) => e.currentTarget.focus()}
    >
      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{nameDisplay}</div>
        {command.description && (
          <div className="text-xs text-gray-500 truncate">{command.description}</div>
        )}
      </div>
      {shortcutDisplay && (
        <kbd
          className={cn(
            'px-1.5 py-0.5 text-xs rounded',
            'bg-gray-800 text-gray-400 border border-gray-700',
            'font-mono'
          )}
        >
          {shortcutDisplay}
        </kbd>
      )}
    </button>
  );
}

// ============================================================================
// COMMAND GROUP COMPONENT
// ============================================================================

interface CommandGroupProps {
  category: CommandCategory;
  commands: CommandType[];
  selectedIndex: number;
  startIndex: number;
  onSelect: (command: CommandType) => void;
  searchResults?: Map<string, CommandSearchResult>;
}

function CommandGroup({
  category,
  commands,
  selectedIndex,
  startIndex,
  onSelect,
  searchResults,
}: CommandGroupProps) {
  const CategoryIcon = categoryIcons[category];
  const categoryInfo = CATEGORY_INFO[category];

  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
        <CategoryIcon className="w-3 h-3" />
        {categoryInfo.name}
      </div>
      <div className="space-y-0.5">
        {commands.map((command, i) => (
          <CommandItem
            key={command.id}
            command={command}
            isSelected={selectedIndex === startIndex + i}
            onSelect={() => onSelect(command)}
            searchResult={searchResults?.get(command.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CommandPalette({
  open,
  onOpenChange,
  commands,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  // Get registry for recent commands
  const registry = useMemo(() => getCommandRegistry(), []);

  // Search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    return searchCommands(commands, query);
  }, [commands, query]);

  // Build search results map for highlighting
  const searchResultsMap = useMemo(() => {
    if (!searchResults) return undefined;
    const map = new Map<string, CommandSearchResult>();
    for (const result of searchResults) {
      map.set(result.command.id, result);
    }
    return map;
  }, [searchResults]);

  // Grouped commands for display
  const displayData = useMemo(() => {
    if (searchResults) {
      // Show search results
      return {
        groups: [
          {
            category: 'recent' as CommandCategory,
            commands: searchResults.map((r) => r.command),
          },
        ],
        flatList: searchResults.map((r) => r.command),
      };
    }

    // Show recent + all commands grouped by category
    const recentCommands = registry.getRecentCommands(5);
    const groups: { category: CommandCategory; commands: CommandType[] }[] = [];
    const flatList: CommandType[] = [];

    // Add recent commands if any
    if (recentCommands.length > 0) {
      groups.push({ category: 'recent', commands: recentCommands });
      flatList.push(...recentCommands);
    }

    // Group remaining commands by category
    const categoryOrder: CommandCategory[] = [
      'file',
      'edit',
      'element',
      'view',
      'navigation',
      'help',
    ];

    for (const category of categoryOrder) {
      const categoryCommands = commands.filter((c) => c.category === category);
      if (categoryCommands.length > 0) {
        groups.push({ category, commands: categoryCommands });
        flatList.push(...categoryCommands);
      }
    }

    return { groups, flatList };
  }, [commands, registry, searchResults]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const { flatList } = displayData;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % flatList.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + flatList.length) % flatList.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (flatList[selectedIndex]) {
            handleSelect(flatList[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onOpenChange(false);
          break;
      }
    },
    [displayData, selectedIndex, onOpenChange]
  );

  // Handle command selection
  const handleSelect = useCallback(
    (command: CommandType) => {
      onOpenChange(false);
      // Execute after modal closes
      setTimeout(() => {
        command.execute();
        registry.addToHistory(command.id);
      }, 100);
    },
    [onOpenChange, registry]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;

    const selectedElement = listRef.current.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!open || !mounted) return null;

  const content = (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
      onClick={() => onOpenChange(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className={cn(
          'relative w-full max-w-xl mx-4',
          'bg-gray-900 border border-gray-700 rounded-xl shadow-2xl',
          'overflow-hidden',
          'animate-in fade-in-0 zoom-in-95 duration-150'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className={cn(
              'flex-1 bg-transparent text-white placeholder-gray-500',
              'text-sm outline-none'
            )}
          />
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="max-h-[400px] overflow-y-auto p-2"
        >
          {displayData.flatList.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No commands found</p>
            </div>
          ) : (
            <>
              {searchResults ? (
                // Show flat search results
                <div className="space-y-0.5">
                  {displayData.flatList.map((command, i) => (
                    <div key={command.id} data-index={i}>
                      <CommandItem
                        command={command}
                        isSelected={selectedIndex === i}
                        onSelect={() => handleSelect(command)}
                        searchResult={searchResultsMap?.get(command.id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                // Show grouped commands
                <>
                  {displayData.groups.map((group, groupIndex) => {
                    const startIndex = displayData.groups
                      .slice(0, groupIndex)
                      .reduce((sum, g) => sum + g.commands.length, 0);

                    return (
                      <CommandGroup
                        key={group.category}
                        category={group.category}
                        commands={group.commands}
                        selectedIndex={selectedIndex}
                        startIndex={startIndex}
                        onSelect={handleSelect}
                        searchResults={searchResultsMap}
                      />
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 font-mono">
                {'\u2191'}
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 font-mono">
                {'\u2193'}
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 font-mono">
                {'\u21B5'}
              </kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 font-mono">
                Esc
              </kbd>
              <span>to close</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

// ============================================================================
// HOOK FOR USING COMMAND PALETTE
// ============================================================================

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
}

export default CommandPalette;
