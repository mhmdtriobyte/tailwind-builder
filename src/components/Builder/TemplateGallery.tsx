'use client';

import React, { useState, useMemo, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { cn } from '@/utils/cn';
import { useBuilderStore } from '@/store/builderStore';
import {
  allPageTemplates,
  allSectionTemplates,
  searchTemplates,
  cloneTemplateElement,
  type Template,
  type PageTemplate,
  type SectionTemplate,
} from '@/lib/layoutTemplates';
import {
  Search,
  X,
  Layout,
  Layers,
  Box,
  Eye,
  Plus,
  Replace,
  ChevronRight,
  Sparkles,
  FileText,
  Grid3X3,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'pages' | 'sections' | 'components';

interface CategoryOption {
  value: string;
  label: string;
  count: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TAB_CONFIG = [
  { id: 'pages' as TabType, label: 'Pages', icon: FileText },
  { id: 'sections' as TabType, label: 'Sections', icon: Layers },
  { id: 'components' as TabType, label: 'Components', icon: Box },
];

const SECTION_CATEGORIES: CategoryOption[] = [
  { value: 'all', label: 'All Sections', count: 0 },
  { value: 'headers', label: 'Headers', count: 0 },
  { value: 'heroes', label: 'Heroes', count: 0 },
  { value: 'features', label: 'Features', count: 0 },
  { value: 'testimonials', label: 'Testimonials', count: 0 },
  { value: 'pricing', label: 'Pricing', count: 0 },
  { value: 'cta', label: 'Call to Action', count: 0 },
  { value: 'faq', label: 'FAQ', count: 0 },
  { value: 'team', label: 'Team', count: 0 },
  { value: 'contact', label: 'Contact', count: 0 },
  { value: 'footers', label: 'Footers', count: 0 },
];

const PAGE_CATEGORIES: CategoryOption[] = [
  { value: 'all', label: 'All Pages', count: 0 },
  { value: 'landing', label: 'Landing', count: 0 },
  { value: 'business', label: 'Business', count: 0 },
  { value: 'ecommerce', label: 'E-commerce', count: 0 },
  { value: 'blog', label: 'Blog', count: 0 },
  { value: 'dashboard', label: 'Dashboard', count: 0 },
  { value: 'auth', label: 'Auth', count: 0 },
  { value: 'error', label: 'Error', count: 0 },
];

// Placeholder colors for template thumbnails
const THUMBNAIL_COLORS = [
  'from-blue-500 to-cyan-400',
  'from-purple-500 to-pink-400',
  'from-green-500 to-emerald-400',
  'from-orange-500 to-amber-400',
  'from-rose-500 to-red-400',
  'from-indigo-500 to-violet-400',
  'from-teal-500 to-cyan-400',
  'from-fuchsia-500 to-pink-400',
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getThumbnailColor(index: number): string {
  return THUMBNAIL_COLORS[index % THUMBNAIL_COLORS.length];
}

function getComponentCount(template: Template): number {
  if (template.type === 'page') {
    return (template as PageTemplate).sections.length;
  }
  return 1;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface TemplateThumbnailProps {
  template: Template;
  index: number;
}

function TemplateThumbnail({ template, index }: TemplateThumbnailProps) {
  const colorClass = getThumbnailColor(index);
  const isPage = template.type === 'page';

  return (
    <div
      className={cn(
        'relative w-full aspect-[4/3] rounded-lg overflow-hidden',
        'bg-gradient-to-br',
        colorClass
      )}
    >
      {/* Mock layout structure */}
      <div className="absolute inset-2 flex flex-col gap-1">
        {/* Header mock */}
        <div className="h-2 bg-white/30 rounded-sm" />

        {/* Content mock */}
        <div className="flex-1 flex gap-1">
          {isPage ? (
            <>
              <div className="flex-1 bg-white/20 rounded-sm" />
              <div className="w-1/3 flex flex-col gap-1">
                <div className="flex-1 bg-white/15 rounded-sm" />
                <div className="flex-1 bg-white/15 rounded-sm" />
              </div>
            </>
          ) : (
            <div className="flex-1 bg-white/20 rounded-sm flex items-center justify-center">
              <Layers className="w-6 h-6 text-white/40" />
            </div>
          )}
        </div>

        {/* Footer mock */}
        <div className="h-2 bg-white/30 rounded-sm" />
      </div>

      {/* Type badge */}
      <div
        className={cn(
          'absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-medium',
          'bg-black/30 text-white backdrop-blur-sm'
        )}
      >
        {isPage ? 'Page' : 'Section'}
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: Template;
  index: number;
  onPreview: (template: Template) => void;
  onApply: (template: Template) => void;
  onAdd: (template: Template) => void;
}

function TemplateCard({
  template,
  index,
  onPreview,
  onApply,
  onAdd,
}: TemplateCardProps) {
  const componentCount = getComponentCount(template);

  return (
    <div
      className={cn(
        'group relative bg-gray-800 rounded-xl overflow-hidden',
        'border border-gray-700 hover:border-gray-600',
        'transition-all duration-200',
        'hover:shadow-xl hover:shadow-black/20',
        'hover:-translate-y-0.5'
      )}
    >
      {/* Thumbnail */}
      <div className="relative">
        <TemplateThumbnail template={template} index={index} />

        {/* Hover overlay with actions */}
        <div
          className={cn(
            'absolute inset-0 bg-black/60 backdrop-blur-sm',
            'flex items-center justify-center gap-2',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
          )}
        >
          <button
            onClick={() => onPreview(template)}
            className={cn(
              'p-2 rounded-lg bg-white/10 hover:bg-white/20',
              'text-white transition-colors',
              'flex items-center gap-1.5'
            )}
            title="Preview"
          >
            <Eye className="w-4 h-4" />
            <span className="text-xs font-medium">Preview</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-medium text-white text-sm truncate">
          {template.name}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
          {template.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-2 mt-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-1.5 py-0.5 rounded',
              'bg-gray-700 text-gray-300 text-[10px]'
            )}
          >
            <Box className="w-3 h-3" />
            {componentCount} {componentCount === 1 ? 'component' : 'components'}
          </span>
          {template.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-400 text-[10px]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onApply(template)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5',
              'px-2 py-1.5 rounded-lg text-xs font-medium',
              'bg-blue-600 hover:bg-blue-500 text-white',
              'transition-colors'
            )}
          >
            <Replace className="w-3.5 h-3.5" />
            Apply
          </button>
          <button
            onClick={() => onAdd(template)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5',
              'px-2 py-1.5 rounded-lg text-xs font-medium',
              'bg-gray-700 hover:bg-gray-600 text-white',
              'transition-colors'
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

interface CategorySidebarProps {
  categories: CategoryOption[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  templates: Template[];
}

function CategorySidebar({
  categories,
  activeCategory,
  onCategoryChange,
  templates,
}: CategorySidebarProps) {
  // Calculate counts for each category
  const categoriesWithCounts = useMemo(() => {
    return categories.map((cat) => ({
      ...cat,
      count:
        cat.value === 'all'
          ? templates.length
          : templates.filter((t) => t.category === cat.value).length,
    }));
  }, [categories, templates]);

  return (
    <div className="w-48 flex-shrink-0 border-r border-gray-700 p-3">
      <div className="space-y-1">
        {categoriesWithCounts.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-lg',
              'text-sm transition-colors',
              activeCategory === category.value
                ? 'bg-blue-600/20 text-blue-400'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            )}
          >
            <span>{category.label}</span>
            <span
              className={cn(
                'text-xs px-1.5 py-0.5 rounded',
                activeCategory === category.value
                  ? 'bg-blue-600/30 text-blue-300'
                  : 'bg-gray-700 text-gray-500'
              )}
            >
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface TemplatePreviewModalProps {
  template: Template | null;
  onClose: () => void;
  onApply: (template: Template) => void;
  onAdd: (template: Template) => void;
}

function TemplatePreviewModal({
  template,
  onClose,
  onApply,
  onAdd,
}: TemplatePreviewModalProps) {
  if (!template) return null;

  const isPage = template.type === 'page';
  const pageTemplate = isPage ? (template as PageTemplate) : null;

  return (
    <Dialog.Root open={!!template} onOpenChange={() => onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-[90vw] max-w-4xl max-h-[85vh]',
            'bg-gray-900 rounded-2xl shadow-2xl',
            'border border-gray-700 z-50',
            'flex flex-col overflow-hidden'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div>
              <Dialog.Title className="text-lg font-semibold text-white">
                {template.name}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-400 mt-0.5">
                {template.description}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Preview area */}
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-gray-800 rounded-xl p-4 min-h-[400px]">
              {/* Large preview thumbnail */}
              <div
                className={cn(
                  'w-full aspect-video rounded-lg overflow-hidden',
                  'bg-gradient-to-br',
                  getThumbnailColor(0)
                )}
              >
                <div className="w-full h-full flex flex-col p-4 gap-2">
                  {/* Mock header */}
                  <div className="h-4 bg-white/30 rounded" />

                  {/* Mock content */}
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1 bg-white/20 rounded flex items-center justify-center">
                      <div className="text-center">
                        <Layout className="w-12 h-12 text-white/40 mx-auto mb-2" />
                        <p className="text-white/60 text-sm font-medium">
                          {template.name}
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                          {template.type === 'page'
                            ? `${pageTemplate?.sections.length || 0} sections`
                            : 'Section template'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mock footer */}
                  <div className="h-4 bg-white/30 rounded" />
                </div>
              </div>

              {/* Template info */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">
                    Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type</span>
                      <span className="text-white capitalize">
                        {template.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category</span>
                      <span className="text-white capitalize">
                        {template.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Components</span>
                      <span className="text-white">
                        {getComponentCount(template)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-md bg-gray-600 text-gray-300 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sections list for page templates */}
              {isPage && pageTemplate && pageTemplate.sections.length > 0 && (
                <div className="mt-4 bg-gray-700/50 rounded-lg p-3">
                  <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">
                    Included Sections
                  </h4>
                  <div className="space-y-1">
                    {pageTemplate.sections.map((section, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-300"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                        {section.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-700 bg-gray-800/50">
            <button
              onClick={onClose}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium',
                'bg-gray-700 hover:bg-gray-600 text-white',
                'transition-colors'
              )}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onAdd(template);
                onClose();
              }}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium',
                'bg-gray-600 hover:bg-gray-500 text-white',
                'transition-colors flex items-center gap-2'
              )}
            >
              <Plus className="w-4 h-4" />
              Add to Canvas
            </button>
            <button
              onClick={() => {
                onApply(template);
                onClose();
              }}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium',
                'bg-blue-600 hover:bg-blue-500 text-white',
                'transition-colors flex items-center gap-2'
              )}
            >
              <Replace className="w-4 h-4" />
              Apply Template
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TemplateGallery({ isOpen, onClose }: TemplateGalleryProps) {
  const { addElement, clearCanvas } = useBuilderStore();

  // State
  const [activeTab, setActiveTab] = useState<TabType>('sections');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // Get templates based on active tab
  const baseTemplates = useMemo((): Template[] => {
    switch (activeTab) {
      case 'pages':
        return allPageTemplates as Template[];
      case 'sections':
        return allSectionTemplates as Template[];
      case 'components':
        // Components are treated as small sections
        return allSectionTemplates.filter(
          (t) => !['headers', 'footers', 'heroes'].includes(t.category)
        ) as Template[];
      default:
        return [];
    }
  }, [activeTab]);

  // Filter templates
  const filteredTemplates = useMemo((): Template[] => {
    let templates = baseTemplates;

    // Apply search filter
    if (searchQuery.trim()) {
      const searchResults = searchTemplates(searchQuery);
      templates = searchResults.filter((t) =>
        baseTemplates.some((bt) => bt.id === t.id)
      );
    }

    // Apply category filter
    if (activeCategory !== 'all') {
      templates = templates.filter((t) => t.category === activeCategory);
    }

    return templates;
  }, [baseTemplates, searchQuery, activeCategory]);

  // Get categories for current tab
  const categories = useMemo(() => {
    if (activeTab === 'pages') return PAGE_CATEGORIES;
    return SECTION_CATEGORIES;
  }, [activeTab]);

  // Handle template application (replaces canvas)
  const handleApplyTemplate = useCallback(
    (template: Template) => {
      clearCanvas();

      if (template.type === 'page') {
        const pageTemplate = template as PageTemplate;
        pageTemplate.sections.forEach((section) => {
          const element = cloneTemplateElement(section);
          addElement(element);
        });
      } else {
        const sectionTemplate = template as SectionTemplate;
        const element = cloneTemplateElement(sectionTemplate);
        addElement(element);
      }

      onClose();
    },
    [addElement, clearCanvas, onClose]
  );

  // Handle adding template (appends to canvas)
  const handleAddTemplate = useCallback(
    (template: Template) => {
      if (template.type === 'page') {
        const pageTemplate = template as PageTemplate;
        pageTemplate.sections.forEach((section) => {
          const element = cloneTemplateElement(section);
          addElement(element);
        });
      } else {
        const sectionTemplate = template as SectionTemplate;
        const element = cloneTemplateElement(sectionTemplate);
        addElement(element);
      }

      onClose();
    },
    [addElement, onClose]
  );

  // Reset filters when tab changes
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as TabType);
    setActiveCategory('all');
    setSearchQuery('');
  }, []);

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" />
          <Dialog.Content
            className={cn(
              'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'w-[95vw] max-w-6xl h-[90vh]',
              'bg-gray-900 rounded-2xl shadow-2xl',
              'border border-gray-700 z-40',
              'flex flex-col overflow-hidden'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                  <Grid3X3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-semibold text-white">
                    Template Gallery
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-gray-400">
                    Choose from pre-built templates to quickly design your page
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close asChild>
                <button
                  className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            {/* Tabs */}
            <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
              <div className="border-b border-gray-700 px-4">
                <Tabs.List className="flex gap-1">
                  {TAB_CONFIG.map(({ id, label, icon: Icon }) => (
                    <Tabs.Trigger
                      key={id}
                      value={id}
                      className={cn(
                        'flex items-center gap-2 px-4 py-3 text-sm font-medium',
                        'border-b-2 -mb-px transition-colors',
                        activeTab === id
                          ? 'border-blue-500 text-white'
                          : 'border-transparent text-gray-400 hover:text-white'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
              </div>

              {/* Content area */}
              <div className="flex-1 flex overflow-hidden">
                {/* Category sidebar */}
                <CategorySidebar
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  templates={baseTemplates}
                />

                {/* Main content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Search bar */}
                  <div className="p-4 border-b border-gray-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search templates..."
                        className={cn(
                          'w-full pl-10 pr-4 py-2.5 rounded-lg',
                          'bg-gray-800 border border-gray-700',
                          'text-white placeholder-gray-500',
                          'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500',
                          'transition-colors'
                        )}
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Results count */}
                  <div className="px-4 py-2 text-sm text-gray-400">
                    {filteredTemplates.length}{' '}
                    {filteredTemplates.length === 1 ? 'template' : 'templates'}{' '}
                    found
                  </div>

                  {/* Template grid */}
                  <div className="flex-1 overflow-auto p-4">
                    {filteredTemplates.length > 0 ? (
                      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredTemplates.map((template, index) => (
                          <TemplateCard
                            key={template.id}
                            template={template}
                            index={index}
                            onPreview={setPreviewTemplate}
                            onApply={handleApplyTemplate}
                            onAdd={handleAddTemplate}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="p-4 rounded-full bg-gray-800 mb-4">
                          <Sparkles className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">
                          No templates found
                        </h3>
                        <p className="text-gray-400 text-sm max-w-sm">
                          Try adjusting your search or filter to find what you
                          are looking for.
                        </p>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setActiveCategory('all');
                          }}
                          className={cn(
                            'mt-4 px-4 py-2 rounded-lg text-sm font-medium',
                            'bg-gray-800 hover:bg-gray-700 text-white',
                            'transition-colors'
                          )}
                        >
                          Clear filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Tabs.Root>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Preview modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onApply={handleApplyTemplate}
        onAdd={handleAddTemplate}
      />
    </>
  );
}

export default TemplateGallery;
