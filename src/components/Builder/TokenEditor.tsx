'use client';

import { useState, useMemo, useCallback } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  Copy,
  Search,
  ChevronDown,
  ChevronRight,
  Link2,
  X,
  Check,
  Palette,
  Type,
  Maximize2,
  Square,
  Layers,
  Zap,
  Monitor,
  Sun,
  Moon,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import type {
  DesignToken,
  TokenCategory,
  TokenTier,
  TokenValueType,
  TokenFormat,
} from '@/lib/designTokens';
import {
  allDesignTokens,
  getTokensByCategory,
  getCategoryDisplayName,
  getTierDisplayName,
  createToken,
  validateTokenValue,
  generateTokenId,
} from '@/lib/designTokens';
import {
  transformTokens,
  formatInfo,
  type TransformResult,
} from '@/lib/tokenTransformer';
import { resolveTokenValue, getAliasChain } from '@/lib/tokenResolver';

// =============================================================================
// TYPES
// =============================================================================

interface TokenEditorProps {
  tokens?: DesignToken[];
  onTokensChange?: (tokens: DesignToken[]) => void;
  className?: string;
}

interface TokenFormData {
  name: string;
  category: TokenCategory;
  tier: TokenTier;
  type: TokenValueType;
  value: string;
  darkValue: string;
  reference: string;
  description: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const categoryIcons: Record<TokenCategory, React.ComponentType<{ className?: string }>> = {
  color: Palette,
  typography: Type,
  spacing: Maximize2,
  border: Square,
  shadow: Layers,
  animation: Zap,
  zIndex: Layers,
  breakpoint: Monitor,
  opacity: Sun,
};

const categories: TokenCategory[] = [
  'color',
  'typography',
  'spacing',
  'border',
  'shadow',
  'animation',
  'zIndex',
  'breakpoint',
  'opacity',
];

const tiers: TokenTier[] = ['primitive', 'semantic', 'component'];

const valueTypes: TokenValueType[] = [
  'color',
  'dimension',
  'fontFamily',
  'fontWeight',
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'spacing',
  'borderWidth',
  'borderRadius',
  'shadow',
  'opacity',
  'duration',
  'easing',
  'zIndex',
  'breakpoint',
  'number',
  'string',
];

const initialFormData: TokenFormData = {
  name: '',
  category: 'color',
  tier: 'primitive',
  type: 'color',
  value: '',
  darkValue: '',
  reference: '',
  description: '',
};

// =============================================================================
// TOKEN EDITOR COMPONENT
// =============================================================================

export function TokenEditor({
  tokens = allDesignTokens,
  onTokensChange,
  className,
}: TokenEditorProps) {
  const [localTokens, setLocalTokens] = useState<DesignToken[]>(tokens);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TokenCategory | 'all'>('all');
  const [selectedTier, setSelectedTier] = useState<TokenTier | 'all'>('all');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['color']));
  const [selectedToken, setSelectedToken] = useState<DesignToken | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [formData, setFormData] = useState<TokenFormData>(initialFormData);
  const [exportFormat, setExportFormat] = useState<TokenFormat>('css');
  const [importContent, setImportContent] = useState('');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  // Filtered tokens
  const filteredTokens = useMemo(() => {
    let result = localTokens;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        t =>
          t.name.toLowerCase().includes(query) ||
          t.id.toLowerCase().includes(query) ||
          t.path.join('.').toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }

    if (selectedTier !== 'all') {
      result = result.filter(t => t.tier === selectedTier);
    }

    return result;
  }, [localTokens, searchQuery, selectedCategory, selectedTier]);

  // Grouped tokens
  const groupedTokens = useMemo(() => {
    const groups: Record<string, DesignToken[]> = {};

    for (const token of filteredTokens) {
      const groupKey = token.category;
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(token);
    }

    return groups;
  }, [filteredTokens]);

  // Update tokens
  const updateTokens = useCallback(
    (newTokens: DesignToken[]) => {
      setLocalTokens(newTokens);
      onTokensChange?.(newTokens);
    },
    [onTokensChange]
  );

  // Toggle group expansion
  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  };

  // Add token
  const handleAddToken = () => {
    const newToken = createToken({
      name: formData.name,
      path: [formData.category, formData.tier],
      category: formData.category,
      tier: formData.tier,
      type: formData.type,
      value: {
        value: formData.value,
        ...(formData.darkValue && { darkValue: formData.darkValue }),
      },
      ...(formData.reference && { reference: formData.reference }),
      ...(formData.description && {
        metadata: { description: formData.description },
      }),
    });

    updateTokens([...localTokens, newToken]);
    setFormData(initialFormData);
    setIsAddDialogOpen(false);
  };

  // Edit token
  const handleEditToken = () => {
    if (!selectedToken) return;

    const updatedToken: DesignToken = {
      ...selectedToken,
      name: formData.name,
      category: formData.category,
      tier: formData.tier,
      type: formData.type,
      path: [formData.category, formData.tier],
      value: {
        value: formData.value,
        ...(formData.darkValue && { darkValue: formData.darkValue }),
      },
      ...(formData.reference && { reference: formData.reference }),
      metadata: {
        ...selectedToken.metadata,
        ...(formData.description && { description: formData.description }),
        updatedAt: new Date().toISOString(),
      },
    };

    updateTokens(
      localTokens.map(t => (t.id === selectedToken.id ? updatedToken : t))
    );
    setFormData(initialFormData);
    setSelectedToken(null);
    setIsEditDialogOpen(false);
  };

  // Delete token
  const handleDeleteToken = (tokenId: string) => {
    updateTokens(localTokens.filter(t => t.id !== tokenId));
    if (selectedToken?.id === tokenId) {
      setSelectedToken(null);
    }
  };

  // Open edit dialog
  const openEditDialog = (token: DesignToken) => {
    setSelectedToken(token);
    setFormData({
      name: token.name,
      category: token.category,
      tier: token.tier,
      type: token.type,
      value: String(token.value.value),
      darkValue: token.value.darkValue ? String(token.value.darkValue) : '',
      reference: token.reference || '',
      description: token.metadata?.description || '',
    });
    setIsEditDialogOpen(true);
  };

  // Export tokens
  const handleExport = () => {
    const result = transformTokens(localTokens, {
      format: exportFormat,
      colorScheme,
      includeMeta: true,
    });

    const blob = new Blob([result.content], { type: result.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import tokens
  const handleImport = () => {
    try {
      const parsed = JSON.parse(importContent);
      const importedTokens = parseImportedTokens(parsed);
      updateTokens([...localTokens, ...importedTokens]);
      setImportContent('');
      setIsImportDialogOpen(false);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import tokens. Please check the format.');
    }
  };

  // Copy token value
  const copyTokenValue = (token: DesignToken) => {
    const value = resolveTokenValue(token, { colorScheme });
    navigator.clipboard.writeText(String(value));
  };

  return (
    <div className={cn('flex flex-col h-full bg-gray-900', className)}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Design Tokens</h2>
          <div className="flex items-center gap-2">
            {/* Color Scheme Toggle */}
            <button
              onClick={() => setColorScheme(s => (s === 'light' ? 'dark' : 'light'))}
              className={cn(
                'p-2 rounded transition-colors',
                'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
              title={`Viewing ${colorScheme} mode values`}
            >
              {colorScheme === 'light' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Import */}
            <button
              onClick={() => setIsImportDialogOpen(true)}
              className={cn(
                'p-2 rounded transition-colors',
                'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
              title="Import tokens"
            >
              <Upload className="w-4 h-4" />
            </button>

            {/* Export */}
            <button
              onClick={() => setIsExportDialogOpen(true)}
              className={cn(
                'p-2 rounded transition-colors',
                'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
              title="Export tokens"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Add Token */}
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 rounded',
                'bg-blue-600 text-white text-sm font-medium',
                'hover:bg-blue-700 transition-colors'
              )}
            >
              <Plus className="w-4 h-4" />
              Add Token
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tokens..."
              className={cn(
                'w-full pl-9 pr-3 py-2',
                'bg-gray-800 border border-gray-700 rounded-md',
                'text-white text-sm placeholder-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as TokenCategory | 'all')}
            className={cn(
              'px-3 py-2 bg-gray-800 border border-gray-700 rounded-md',
              'text-white text-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-500'
            )}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {getCategoryDisplayName(cat)}
              </option>
            ))}
          </select>

          {/* Tier Filter */}
          <select
            value={selectedTier}
            onChange={e => setSelectedTier(e.target.value as TokenTier | 'all')}
            className={cn(
              'px-3 py-2 bg-gray-800 border border-gray-700 rounded-md',
              'text-white text-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-500'
            )}
          >
            <option value="all">All Tiers</option>
            {tiers.map(tier => (
              <option key={tier} value={tier}>
                {getTierDisplayName(tier)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Token List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedTokens).map(([groupKey, groupTokens]) => {
          const CategoryIcon = categoryIcons[groupKey as TokenCategory] || Layers;
          const isExpanded = expandedGroups.has(groupKey);

          return (
            <div key={groupKey} className="border-b border-gray-800">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(groupKey)}
                className={cn(
                  'w-full flex items-center gap-2 px-4 py-3',
                  'text-left hover:bg-gray-800/50 transition-colors'
                )}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <CategoryIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-white">
                  {getCategoryDisplayName(groupKey as TokenCategory)}
                </span>
                <span className="text-xs text-gray-500 ml-auto">
                  {groupTokens.length} tokens
                </span>
              </button>

              {/* Tokens */}
              {isExpanded && (
                <div className="pb-2">
                  {groupTokens.map(token => (
                    <TokenRow
                      key={token.id}
                      token={token}
                      colorScheme={colorScheme}
                      onEdit={() => openEditDialog(token)}
                      onDelete={() => handleDeleteToken(token.id)}
                      onCopy={() => copyTokenValue(token)}
                      onSelect={() => setSelectedToken(token)}
                      isSelected={selectedToken?.id === token.id}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredTokens.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Search className="w-8 h-8 mb-2" />
            <p className="text-sm">No tokens found</p>
          </div>
        )}
      </div>

      {/* Token Preview Panel */}
      {selectedToken && (
        <TokenPreviewPanel
          token={selectedToken}
          colorScheme={colorScheme}
          onClose={() => setSelectedToken(null)}
        />
      )}

      {/* Add Token Dialog */}
      <TokenFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="Add New Token"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddToken}
        tokens={localTokens}
      />

      {/* Edit Token Dialog */}
      <TokenFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Token"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditToken}
        tokens={localTokens}
        isEdit
      />

      {/* Export Dialog */}
      <ExportDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        format={exportFormat}
        setFormat={setExportFormat}
        colorScheme={colorScheme}
        onExport={handleExport}
        tokens={localTokens}
      />

      {/* Import Dialog */}
      <ImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        content={importContent}
        setContent={setImportContent}
        onImport={handleImport}
      />
    </div>
  );
}

// =============================================================================
// TOKEN ROW COMPONENT
// =============================================================================

interface TokenRowProps {
  token: DesignToken;
  colorScheme: 'light' | 'dark';
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

function TokenRow({
  token,
  colorScheme,
  onEdit,
  onDelete,
  onCopy,
  onSelect,
  isSelected,
}: TokenRowProps) {
  const value = resolveTokenValue(token, { colorScheme });

  return (
    <div
      onClick={onSelect}
      className={cn(
        'flex items-center gap-3 px-4 py-2 ml-6 cursor-pointer',
        'hover:bg-gray-800/50 transition-colors',
        isSelected && 'bg-gray-800'
      )}
    >
      {/* Value Preview */}
      <TokenValuePreview token={token} value={value} />

      {/* Token Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white truncate">{token.name}</span>
          {token.reference && (
            <Link2 className="w-3 h-3 text-blue-400" title="Has reference" />
          )}
          {token.value.darkValue && (
            <Moon className="w-3 h-3 text-purple-400" title="Has dark value" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-500">{token.path.join(' / ')}</span>
          <span className="text-xs text-gray-600">|</span>
          <span className="text-xs text-gray-500">{String(value)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={e => {
            e.stopPropagation();
            onCopy();
          }}
          className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-700"
          title="Copy value"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-700"
          title="Edit"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 text-gray-400 hover:text-red-400 rounded hover:bg-gray-700"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// TOKEN VALUE PREVIEW
// =============================================================================

interface TokenValuePreviewProps {
  token: DesignToken;
  value: string | number;
}

function TokenValuePreview({ token, value }: TokenValuePreviewProps) {
  if (token.type === 'color' && typeof value === 'string') {
    return (
      <div
        className="w-8 h-8 rounded border border-gray-600 flex-shrink-0"
        style={{
          backgroundColor:
            value === 'transparent'
              ? 'transparent'
              : value.startsWith('#') || value.startsWith('rgb')
              ? value
              : undefined,
        }}
      />
    );
  }

  if (token.type === 'shadow' && typeof value === 'string') {
    return (
      <div
        className="w-8 h-8 rounded bg-gray-700 flex-shrink-0"
        style={{ boxShadow: value }}
      />
    );
  }

  if (token.type === 'borderRadius') {
    return (
      <div
        className="w-8 h-8 bg-blue-500 flex-shrink-0"
        style={{ borderRadius: String(value) }}
      />
    );
  }

  // Default preview
  return (
    <div className="w-8 h-8 rounded bg-gray-700 flex-shrink-0 flex items-center justify-center">
      <span className="text-[10px] text-gray-400 font-mono">
        {token.type.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

// =============================================================================
// TOKEN PREVIEW PANEL
// =============================================================================

interface TokenPreviewPanelProps {
  token: DesignToken;
  colorScheme: 'light' | 'dark';
  onClose: () => void;
}

function TokenPreviewPanel({ token, colorScheme, onClose }: TokenPreviewPanelProps) {
  const lightValue = resolveTokenValue(token, { colorScheme: 'light' });
  const darkValue = resolveTokenValue(token, { colorScheme: 'dark' });
  const aliasChain = token.reference ? getAliasChain(token.id) : [];

  return (
    <div className="flex-shrink-0 border-t border-gray-800 bg-gray-850 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-white">{token.name}</h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-white rounded hover:bg-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Category:</span>
          <span className="ml-2 text-white">{getCategoryDisplayName(token.category)}</span>
        </div>
        <div>
          <span className="text-gray-500">Tier:</span>
          <span className="ml-2 text-white">{getTierDisplayName(token.tier)}</span>
        </div>
        <div>
          <span className="text-gray-500">Type:</span>
          <span className="ml-2 text-white">{token.type}</span>
        </div>
        <div>
          <span className="text-gray-500">Path:</span>
          <span className="ml-2 text-white">{token.path.join('.')}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-white rounded">
          <span className="text-xs text-gray-600 block mb-1">Light Mode</span>
          <div className="flex items-center gap-2">
            {token.type === 'color' && (
              <div
                className="w-6 h-6 rounded border border-gray-200"
                style={{ backgroundColor: String(lightValue) }}
              />
            )}
            <span className="text-sm text-gray-900 font-mono">{String(lightValue)}</span>
          </div>
        </div>
        <div className="p-3 bg-gray-900 rounded border border-gray-700">
          <span className="text-xs text-gray-400 block mb-1">Dark Mode</span>
          <div className="flex items-center gap-2">
            {token.type === 'color' && (
              <div
                className="w-6 h-6 rounded border border-gray-600"
                style={{ backgroundColor: String(darkValue) }}
              />
            )}
            <span className="text-sm text-white font-mono">{String(darkValue)}</span>
          </div>
        </div>
      </div>

      {aliasChain.length > 1 && (
        <div className="mt-4">
          <span className="text-xs text-gray-500 block mb-2">Reference Chain</span>
          <div className="flex items-center gap-2 text-sm">
            {aliasChain.map((id, index) => (
              <span key={id} className="flex items-center">
                <span className={cn('text-white', index > 0 && 'text-blue-400')}>
                  {id}
                </span>
                {index < aliasChain.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-500 mx-1" />
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {token.metadata?.description && (
        <p className="mt-4 text-sm text-gray-400">{token.metadata.description}</p>
      )}
    </div>
  );
}

// =============================================================================
// TOKEN FORM DIALOG
// =============================================================================

interface TokenFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formData: TokenFormData;
  setFormData: (data: TokenFormData) => void;
  onSubmit: () => void;
  tokens: DesignToken[];
  isEdit?: boolean;
}

function TokenFormDialog({
  open,
  onOpenChange,
  title,
  formData,
  setFormData,
  onSubmit,
  tokens,
  isEdit = false,
}: TokenFormDialogProps) {
  const isValid =
    formData.name.trim() !== '' &&
    formData.value.trim() !== '' &&
    validateTokenValue(formData.type, formData.value);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-lg p-6 bg-gray-900 rounded-lg shadow-xl z-50',
            'max-h-[85vh] overflow-y-auto'
          )}
        >
          <Dialog.Title className="text-lg font-semibold text-white mb-4">
            {title}
          </Dialog.Title>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., blue-500"
                className={cn(
                  'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md',
                  'text-white text-sm placeholder-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
              />
            </div>

            {/* Category & Tier */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e =>
                    setFormData({ ...formData, category: e.target.value as TokenCategory })
                  }
                  className={cn(
                    'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md',
                    'text-white text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500'
                  )}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {getCategoryDisplayName(cat)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tier</label>
                <select
                  value={formData.tier}
                  onChange={e =>
                    setFormData({ ...formData, tier: e.target.value as TokenTier })
                  }
                  className={cn(
                    'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md',
                    'text-white text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500'
                  )}
                >
                  {tiers.map(tier => (
                    <option key={tier} value={tier}>
                      {getTierDisplayName(tier)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={e =>
                  setFormData({ ...formData, type: e.target.value as TokenValueType })
                }
                className={cn(
                  'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md',
                  'text-white text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
              >
                {valueTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Value */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Value</label>
              <div className="flex gap-2">
                {formData.type === 'color' && (
                  <input
                    type="color"
                    value={formData.value.startsWith('#') ? formData.value : '#000000'}
                    onChange={e => setFormData({ ...formData, value: e.target.value })}
                    className="w-10 h-10 rounded border border-gray-700 cursor-pointer"
                  />
                )}
                <input
                  type="text"
                  value={formData.value}
                  onChange={e => setFormData({ ...formData, value: e.target.value })}
                  placeholder={getValuePlaceholder(formData.type)}
                  className={cn(
                    'flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md',
                    'text-white text-sm placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500'
                  )}
                />
              </div>
            </div>

            {/* Dark Value */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Dark Mode Value (optional)
              </label>
              <div className="flex gap-2">
                {formData.type === 'color' && (
                  <input
                    type="color"
                    value={formData.darkValue.startsWith('#') ? formData.darkValue : '#000000'}
                    onChange={e => setFormData({ ...formData, darkValue: e.target.value })}
                    className="w-10 h-10 rounded border border-gray-700 cursor-pointer"
                  />
                )}
                <input
                  type="text"
                  value={formData.darkValue}
                  onChange={e => setFormData({ ...formData, darkValue: e.target.value })}
                  placeholder="Dark mode value"
                  className={cn(
                    'flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md',
                    'text-white text-sm placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500'
                  )}
                />
              </div>
            </div>

            {/* Reference (Alias) */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Reference Token (optional)
              </label>
              <select
                value={formData.reference}
                onChange={e => setFormData({ ...formData, reference: e.target.value })}
                className={cn(
                  'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md',
                  'text-white text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
              >
                <option value="">None</option>
                {tokens
                  .filter(t => t.category === formData.category)
                  .map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.path.join('/')})
                    </option>
                  ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description (optional)</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Token description..."
                rows={2}
                className={cn(
                  'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md',
                  'text-white text-sm placeholder-gray-500 resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => onOpenChange(false)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium',
                'bg-gray-700 text-white hover:bg-gray-600 transition-colors'
              )}
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={!isValid}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium',
                'bg-blue-600 text-white hover:bg-blue-700 transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isEdit ? 'Save Changes' : 'Add Token'}
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// =============================================================================
// EXPORT DIALOG
// =============================================================================

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  format: TokenFormat;
  setFormat: (format: TokenFormat) => void;
  colorScheme: 'light' | 'dark';
  onExport: () => void;
  tokens: DesignToken[];
}

function ExportDialog({
  open,
  onOpenChange,
  format,
  setFormat,
  colorScheme,
  onExport,
  tokens,
}: ExportDialogProps) {
  const preview = useMemo(() => {
    try {
      return transformTokens(tokens.slice(0, 10), {
        format,
        colorScheme,
        includeMeta: true,
      });
    } catch {
      return null;
    }
  }, [tokens, format, colorScheme]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-2xl p-6 bg-gray-900 rounded-lg shadow-xl z-50',
            'max-h-[85vh] overflow-y-auto'
          )}
        >
          <Dialog.Title className="text-lg font-semibold text-white mb-4">
            Export Tokens
          </Dialog.Title>

          <div className="space-y-4">
            {/* Format Selection */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Export Format</label>
              <div className="grid grid-cols-3 gap-2">
                {formatInfo.map(info => (
                  <button
                    key={info.id}
                    onClick={() => setFormat(info.id)}
                    className={cn(
                      'p-3 rounded-md border text-left transition-colors',
                      format === info.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    )}
                  >
                    <span className="block text-sm text-white font-medium">{info.name}</span>
                    <span className="block text-xs text-gray-500">{info.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {preview && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Preview</label>
                <pre
                  className={cn(
                    'p-4 bg-gray-800 rounded-md overflow-x-auto',
                    'text-sm text-gray-300 font-mono'
                  )}
                >
                  {preview.content.slice(0, 1000)}
                  {preview.content.length > 1000 && '\n...'}
                </pre>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-6">
            <div className="text-sm text-gray-500">
              {tokens.length} tokens will be exported
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onOpenChange(false)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium',
                  'bg-gray-700 text-white hover:bg-gray-600 transition-colors'
                )}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onExport();
                  onOpenChange(false);
                }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium',
                  'bg-blue-600 text-white hover:bg-blue-700 transition-colors'
                )}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// =============================================================================
// IMPORT DIALOG
// =============================================================================

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  setContent: (content: string) => void;
  onImport: () => void;
}

function ImportDialog({
  open,
  onOpenChange,
  content,
  setContent,
  onImport,
}: ImportDialogProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        setContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-2xl p-6 bg-gray-900 rounded-lg shadow-xl z-50',
            'max-h-[85vh] overflow-y-auto'
          )}
        >
          <Dialog.Title className="text-lg font-semibold text-white mb-4">
            Import Tokens
          </Dialog.Title>

          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Upload File (JSON or Figma Tokens)
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className={cn(
                  'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md',
                  'text-white text-sm file:mr-4 file:py-2 file:px-4',
                  'file:rounded-md file:border-0 file:bg-gray-700 file:text-white',
                  'file:cursor-pointer hover:file:bg-gray-600'
                )}
              />
            </div>

            {/* Paste JSON */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Or Paste JSON</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Paste your token JSON here..."
                rows={10}
                className={cn(
                  'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md',
                  'text-white text-sm font-mono placeholder-gray-500 resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => onOpenChange(false)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium',
                'bg-gray-700 text-white hover:bg-gray-600 transition-colors'
              )}
            >
              Cancel
            </button>
            <button
              onClick={onImport}
              disabled={!content.trim()}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium',
                'bg-blue-600 text-white hover:bg-blue-700 transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getValuePlaceholder(type: TokenValueType): string {
  const placeholders: Record<TokenValueType, string> = {
    color: '#3b82f6',
    dimension: '16px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: '600',
    fontSize: '1rem',
    lineHeight: '1.5',
    letterSpacing: '0.025em',
    spacing: '1rem',
    borderWidth: '1px',
    borderRadius: '0.5rem',
    shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    opacity: '0.5',
    duration: '200ms',
    easing: 'ease-in-out',
    zIndex: '10',
    breakpoint: '768px',
    number: '16',
    string: 'value',
  };
  return placeholders[type] || 'Enter value';
}

function parseImportedTokens(data: unknown): DesignToken[] {
  const tokens: DesignToken[] = [];

  function traverse(obj: unknown, path: string[] = []) {
    if (!obj || typeof obj !== 'object') return;

    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (value && typeof value === 'object' && 'value' in value) {
        // This is a token
        const tokenData = value as { value: unknown; type?: string; description?: string };
        tokens.push({
          id: generateTokenId(),
          name: key,
          path: path,
          category: inferCategory(path, key),
          tier: inferTier(path),
          type: (tokenData.type as TokenValueType) || inferType(String(tokenData.value)),
          value: { value: String(tokenData.value) },
          ...(tokenData.description && {
            metadata: { description: tokenData.description },
          }),
        });
      } else {
        // This is a group, recurse
        traverse(value, [...path, key]);
      }
    }
  }

  traverse(data);
  return tokens;
}

function inferCategory(path: string[], name: string): TokenCategory {
  const pathStr = path.join('/').toLowerCase();
  const nameStr = name.toLowerCase();

  if (pathStr.includes('color') || nameStr.includes('color')) return 'color';
  if (pathStr.includes('typography') || pathStr.includes('font')) return 'typography';
  if (pathStr.includes('spacing') || pathStr.includes('space')) return 'spacing';
  if (pathStr.includes('border')) return 'border';
  if (pathStr.includes('shadow')) return 'shadow';
  if (pathStr.includes('animation') || pathStr.includes('motion')) return 'animation';
  if (pathStr.includes('z-index') || pathStr.includes('zindex')) return 'zIndex';
  if (pathStr.includes('breakpoint') || pathStr.includes('screen')) return 'breakpoint';
  if (pathStr.includes('opacity')) return 'opacity';

  return 'color';
}

function inferTier(path: string[]): TokenTier {
  const pathStr = path.join('/').toLowerCase();

  if (pathStr.includes('primitive') || pathStr.includes('base')) return 'primitive';
  if (pathStr.includes('semantic') || pathStr.includes('alias')) return 'semantic';
  if (pathStr.includes('component')) return 'component';

  return 'primitive';
}

function inferType(value: string): TokenValueType {
  if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) {
    return 'color';
  }
  if (value.includes('px') || value.includes('rem') || value.includes('em')) {
    return 'dimension';
  }
  if (value.includes('ms') || value.includes('s')) {
    return 'duration';
  }
  if (!isNaN(Number(value))) {
    return 'number';
  }
  return 'string';
}

export default TokenEditor;
