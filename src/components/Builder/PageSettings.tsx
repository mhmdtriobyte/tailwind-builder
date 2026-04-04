'use client';

/**
 * PageSettings Component
 *
 * Provides a comprehensive settings panel for individual pages including
 * SEO metadata, Open Graph settings, page styles, and template selection.
 */

import { useState, useCallback, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import toast from 'react-hot-toast';
import {
  Settings,
  Search,
  Share2,
  Palette,
  FileCode,
  X,
  Globe,
  Tag,
  FileText,
  Image,
  Link2,
  Code,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useProjectStore } from '@/store/projectStore';
import type { PageMeta, PageStyles } from '@/lib/projectSystem';
import { PAGE_TEMPLATES, validatePagePath } from '@/lib/projectSystem';

// ============================================================================
// TYPES
// ============================================================================

interface PageSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SettingsTabProps {
  children: React.ReactNode;
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  icon?: React.ReactNode;
  type?: 'text' | 'textarea' | 'url';
  rows?: number;
}

interface KeywordsInputProps {
  value: string[];
  onChange: (keywords: string[]) => void;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function SettingsTab({ children }: SettingsTabProps) {
  return (
    <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
      {children}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  icon,
  type = 'text',
  rows = 3,
}: InputFieldProps) {
  const inputClasses = cn(
    'w-full px-3 py-2 rounded-lg',
    'bg-gray-800 border border-gray-700 text-white',
    'placeholder-gray-500 outline-none',
    'focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
    'transition-colors',
    icon && 'pl-10'
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={cn(inputClasses, 'resize-none')}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={inputClasses}
          />
        )}
      </div>
      {helperText && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

function KeywordsInput({ value, onChange }: KeywordsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = useCallback(() => {
    const keyword = inputValue.trim();
    if (keyword && !value.includes(keyword)) {
      onChange([...value, keyword]);
      setInputValue('');
    }
  }, [inputValue, value, onChange]);

  const handleRemove = useCallback(
    (keyword: string) => {
      onChange(value.filter((k) => k !== keyword));
    },
    [value, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAdd();
      } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
        handleRemove(value[value.length - 1]);
      }
    },
    [handleAdd, handleRemove, inputValue, value]
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Keywords
      </label>
      <div
        className={cn(
          'flex flex-wrap gap-2 p-2 rounded-lg min-h-[42px]',
          'bg-gray-800 border border-gray-700',
          'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'
        )}
      >
        {value.map((keyword) => (
          <span
            key={keyword}
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-md',
              'bg-blue-500/20 text-blue-400 text-sm'
            )}
          >
            {keyword}
            <button
              onClick={() => handleRemove(keyword)}
              className="hover:text-blue-300"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAdd}
          placeholder={value.length === 0 ? 'Add keywords...' : ''}
          className={cn(
            'flex-1 min-w-[100px] bg-transparent text-white',
            'placeholder-gray-500 outline-none text-sm'
          )}
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Press Enter to add a keyword
      </p>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PageSettings({ open, onOpenChange }: PageSettingsProps) {
  const {
    currentProject,
    activePageId,
    updatePageMeta,
    updatePageStyles,
    updatePagePath,
    getActivePage,
  } = useProjectStore();

  const activePage = getActivePage();

  // Local state for form values
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [styles, setStyles] = useState<PageStyles | null>(null);
  const [path, setPath] = useState('');
  const [pathError, setPathError] = useState<string | null>(null);

  // Sync state with active page
  useEffect(() => {
    if (activePage) {
      setMeta({ ...activePage.meta });
      setStyles({ ...activePage.styles });
      setPath(activePage.path);
      setPathError(null);
    }
  }, [activePage, open]);

  // Handlers
  const handleMetaChange = useCallback(
    (key: keyof PageMeta, value: string | string[]) => {
      if (!meta) return;
      setMeta({ ...meta, [key]: value });
    },
    [meta]
  );

  const handleStylesChange = useCallback(
    (key: keyof PageStyles, value: string | string[]) => {
      if (!styles) return;
      setStyles({ ...styles, [key]: value });
    },
    [styles]
  );

  const handlePathChange = useCallback(
    (value: string) => {
      setPath(value);

      // Validate path
      if (currentProject && activePage) {
        const existingPaths = currentProject.pages
          .filter((p) => p.id !== activePage.id)
          .map((p) => p.path);
        const error = validatePagePath(value, existingPaths);
        setPathError(error);
      }
    },
    [currentProject, activePage]
  );

  const handleSave = useCallback(() => {
    if (!activePageId || !meta || !styles) return;

    if (pathError) {
      toast.error(pathError);
      return;
    }

    updatePageMeta(activePageId, meta);
    updatePageStyles(activePageId, styles);
    if (path !== activePage?.path) {
      updatePagePath(activePageId, path);
    }

    toast.success('Page settings saved');
    onOpenChange(false);
  }, [
    activePageId,
    meta,
    styles,
    path,
    pathError,
    activePage?.path,
    updatePageMeta,
    updatePageStyles,
    updatePagePath,
    onOpenChange,
  ]);

  if (!activePage || !meta || !styles) {
    return null;
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-2xl bg-gray-900 rounded-xl shadow-2xl',
            'border border-gray-800',
            'animate-in fade-in-0 zoom-in-95'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-400" />
              <Dialog.Title className="text-lg font-semibold text-white">
                Page Settings: {activePage.name}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Tabs */}
          <Tabs.Root defaultValue="seo">
            <Tabs.List className="flex border-b border-gray-800">
              <Tabs.Trigger
                value="seo"
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium',
                  'border-b-2 border-transparent text-gray-400',
                  'hover:text-white transition-colors',
                  'data-[state=active]:text-blue-400 data-[state=active]:border-blue-400'
                )}
              >
                <Search className="w-4 h-4" />
                SEO
              </Tabs.Trigger>
              <Tabs.Trigger
                value="opengraph"
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium',
                  'border-b-2 border-transparent text-gray-400',
                  'hover:text-white transition-colors',
                  'data-[state=active]:text-blue-400 data-[state=active]:border-blue-400'
                )}
              >
                <Share2 className="w-4 h-4" />
                Open Graph
              </Tabs.Trigger>
              <Tabs.Trigger
                value="styles"
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium',
                  'border-b-2 border-transparent text-gray-400',
                  'hover:text-white transition-colors',
                  'data-[state=active]:text-blue-400 data-[state=active]:border-blue-400'
                )}
              >
                <Palette className="w-4 h-4" />
                Styles
              </Tabs.Trigger>
              <Tabs.Trigger
                value="advanced"
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium',
                  'border-b-2 border-transparent text-gray-400',
                  'hover:text-white transition-colors',
                  'data-[state=active]:text-blue-400 data-[state=active]:border-blue-400'
                )}
              >
                <Code className="w-4 h-4" />
                Advanced
              </Tabs.Trigger>
            </Tabs.List>

            {/* SEO Tab */}
            <Tabs.Content value="seo">
              <SettingsTab>
                <InputField
                  label="Page Title"
                  value={meta.title}
                  onChange={(v) => handleMetaChange('title', v)}
                  placeholder="Page title for browser tab and search results"
                  helperText="Recommended: 50-60 characters"
                  icon={<FileText className="w-4 h-4" />}
                />

                <InputField
                  label="URL Path"
                  value={path}
                  onChange={handlePathChange}
                  placeholder="/about-us"
                  helperText={pathError || 'The URL path for this page'}
                  icon={<Link2 className="w-4 h-4" />}
                />

                <InputField
                  label="Meta Description"
                  value={meta.description}
                  onChange={(v) => handleMetaChange('description', v)}
                  placeholder="A brief description of this page for search engines"
                  helperText="Recommended: 150-160 characters"
                  type="textarea"
                  rows={3}
                />

                <KeywordsInput
                  value={meta.keywords}
                  onChange={(v) => handleMetaChange('keywords', v)}
                />

                <InputField
                  label="Canonical URL"
                  value={meta.canonicalUrl || ''}
                  onChange={(v) => handleMetaChange('canonicalUrl', v)}
                  placeholder="https://example.com/page"
                  helperText="The preferred URL for this page (optional)"
                  icon={<Globe className="w-4 h-4" />}
                  type="url"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Robots Directive
                  </label>
                  <select
                    value={meta.robots || 'index, follow'}
                    onChange={(e) => handleMetaChange('robots', e.target.value)}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg',
                      'bg-gray-800 border border-gray-700 text-white',
                      'outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    )}
                  >
                    <option value="index, follow">Index, Follow (Default)</option>
                    <option value="noindex, follow">No Index, Follow</option>
                    <option value="index, nofollow">Index, No Follow</option>
                    <option value="noindex, nofollow">No Index, No Follow</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Controls how search engines index this page
                  </p>
                </div>
              </SettingsTab>
            </Tabs.Content>

            {/* Open Graph Tab */}
            <Tabs.Content value="opengraph">
              <SettingsTab>
                <InputField
                  label="OG Title"
                  value={meta.ogTitle || ''}
                  onChange={(v) => handleMetaChange('ogTitle', v)}
                  placeholder="Title for social media sharing"
                  helperText="Leave empty to use page title"
                  icon={<Tag className="w-4 h-4" />}
                />

                <InputField
                  label="OG Description"
                  value={meta.ogDescription || ''}
                  onChange={(v) => handleMetaChange('ogDescription', v)}
                  placeholder="Description for social media sharing"
                  helperText="Leave empty to use meta description"
                  type="textarea"
                  rows={3}
                />

                <InputField
                  label="OG Image URL"
                  value={meta.ogImage || ''}
                  onChange={(v) => handleMetaChange('ogImage', v)}
                  placeholder="https://example.com/image.jpg"
                  helperText="Recommended: 1200x630 pixels"
                  icon={<Image className="w-4 h-4" />}
                  type="url"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    OG Type
                  </label>
                  <select
                    value={meta.ogType || 'website'}
                    onChange={(e) => handleMetaChange('ogType', e.target.value)}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg',
                      'bg-gray-800 border border-gray-700 text-white',
                      'outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    )}
                  >
                    <option value="website">Website</option>
                    <option value="article">Article</option>
                    <option value="product">Product</option>
                    <option value="profile">Profile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Twitter Card Type
                  </label>
                  <select
                    value={meta.twitterCard || 'summary_large_image'}
                    onChange={(e) =>
                      handleMetaChange(
                        'twitterCard',
                        e.target.value || 'summary_large_image'
                      )
                    }
                    className={cn(
                      'w-full px-3 py-2 rounded-lg',
                      'bg-gray-800 border border-gray-700 text-white',
                      'outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    )}
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary with Large Image</option>
                    <option value="app">App</option>
                    <option value="player">Player</option>
                  </select>
                </div>
              </SettingsTab>
            </Tabs.Content>

            {/* Styles Tab */}
            <Tabs.Content value="styles">
              <SettingsTab>
                <InputField
                  label="Font Family"
                  value={styles.fontFamily || ''}
                  onChange={(v) => handleStylesChange('fontFamily', v)}
                  placeholder="Inter, system-ui, sans-serif"
                  helperText="CSS font-family value"
                />

                <InputField
                  label="Primary Color"
                  value={styles.primaryColor || ''}
                  onChange={(v) => handleStylesChange('primaryColor', v)}
                  placeholder="#3b82f6"
                  helperText="Primary color for this page"
                />

                <InputField
                  label="Background Color"
                  value={styles.backgroundColor || ''}
                  onChange={(v) => handleStylesChange('backgroundColor', v)}
                  placeholder="#ffffff"
                  helperText="Page background color"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Body Classes
                  </label>
                  <input
                    type="text"
                    value={styles.bodyClasses.join(' ')}
                    onChange={(e) =>
                      handleStylesChange(
                        'bodyClasses',
                        e.target.value.split(' ').filter(Boolean)
                      )
                    }
                    placeholder="min-h-screen bg-white"
                    className={cn(
                      'w-full px-3 py-2 rounded-lg',
                      'bg-gray-800 border border-gray-700 text-white',
                      'placeholder-gray-500 outline-none',
                      'focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    )}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Tailwind classes to apply to the body element
                  </p>
                </div>

                <InputField
                  label="Custom CSS"
                  value={styles.customCss}
                  onChange={(v) => handleStylesChange('customCss', v)}
                  placeholder=".custom-class { color: red; }"
                  helperText="Custom CSS for this page only"
                  type="textarea"
                  rows={5}
                />
              </SettingsTab>
            </Tabs.Content>

            {/* Advanced Tab */}
            <Tabs.Content value="advanced">
              <SettingsTab>
                <InputField
                  label="Custom Head Code"
                  value={meta.customHead || ''}
                  onChange={(v) => handleMetaChange('customHead', v)}
                  placeholder="<script>...</script>"
                  helperText="Custom code to add to the <head> section"
                  type="textarea"
                  rows={5}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Page Template
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PAGE_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        className={cn(
                          'p-3 rounded-lg border text-left transition-all',
                          activePage.template === template.id
                            ? 'border-blue-500 bg-blue-500/10 text-white'
                            : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                        )}
                      >
                        <FileCode className="w-4 h-4 mb-1" />
                        <p className="text-sm font-medium">{template.name}</p>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Selecting a template will only affect new content
                  </p>
                </div>
              </SettingsTab>
            </Tabs.Content>
          </Tabs.Root>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-800">
            <Dialog.Close asChild>
              <button
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white',
                  'transition-colors'
                )}
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSave}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium',
                'bg-blue-600 text-white hover:bg-blue-700',
                'transition-colors'
              )}
            >
              Save Changes
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default PageSettings;
