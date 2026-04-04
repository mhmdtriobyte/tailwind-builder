'use client';

import { useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  Search,
  Star,
  Clock,
  Layout,
  Grid3X3,
  ShoppingBag,
  FileText,
  User,
  Briefcase,
  Image,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useCustomizationStore } from '@/store/customizationStore';
import { useBuilderStore } from '@/store/builderStore';
import toast from 'react-hot-toast';
import type { Template } from '@/types/customization';

// ============================================================================
// CONSTANTS
// ============================================================================

const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: Grid3X3 },
  { id: 'landing', name: 'Landing Pages', icon: Layout },
  { id: 'ecommerce', name: 'E-Commerce', icon: ShoppingBag },
  { id: 'blog', name: 'Blog', icon: FileText },
  { id: 'portfolio', name: 'Portfolio', icon: User },
  { id: 'dashboard', name: 'Dashboard', icon: Briefcase },
  { id: 'gallery', name: 'Gallery', icon: Image },
  { id: 'contact', name: 'Contact', icon: MessageSquare },
] as const;

// Built-in templates
const BUILTIN_TEMPLATES: Template[] = [
  {
    id: 'hero-1',
    name: 'Hero Section',
    description: 'Modern hero with gradient background',
    category: 'landing',
    preview: '/templates/hero-1.png',
    elements: [],
    tags: ['hero', 'landing', 'gradient'],
    author: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pricing-1',
    name: 'Pricing Table',
    description: 'Three-tier pricing comparison',
    category: 'landing',
    preview: '/templates/pricing-1.png',
    elements: [],
    tags: ['pricing', 'cards', 'comparison'],
    author: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'product-grid-1',
    name: 'Product Grid',
    description: '4-column product showcase',
    category: 'ecommerce',
    preview: '/templates/product-grid-1.png',
    elements: [],
    tags: ['products', 'grid', 'ecommerce'],
    author: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'blog-list-1',
    name: 'Blog List',
    description: 'Blog post listing with sidebar',
    category: 'blog',
    preview: '/templates/blog-list-1.png',
    elements: [],
    tags: ['blog', 'articles', 'list'],
    author: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'portfolio-1',
    name: 'Portfolio Grid',
    description: 'Masonry-style portfolio gallery',
    category: 'portfolio',
    preview: '/templates/portfolio-1.png',
    elements: [],
    tags: ['portfolio', 'gallery', 'masonry'],
    author: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'contact-1',
    name: 'Contact Form',
    description: 'Contact form with map section',
    category: 'contact',
    preview: '/templates/contact-1.png',
    elements: [],
    tags: ['contact', 'form', 'map'],
    author: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'features-1',
    name: 'Features Section',
    description: 'Icon-based feature showcase',
    category: 'landing',
    preview: '/templates/features-1.png',
    elements: [],
    tags: ['features', 'icons', 'grid'],
    author: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'testimonials-1',
    name: 'Testimonials',
    description: 'Customer testimonial carousel',
    category: 'landing',
    preview: '/templates/testimonials-1.png',
    elements: [],
    tags: ['testimonials', 'reviews', 'carousel'],
    author: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ============================================================================
// TYPES
// ============================================================================

interface TemplateGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface TemplateCardProps {
  template: Template;
  isFavorite: boolean;
  isRecent: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

function TemplateCard({
  template,
  isFavorite,
  isRecent,
  onSelect,
  onToggleFavorite,
}: TemplateCardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-lg border border-gray-700 overflow-hidden',
        'bg-gray-800/50 hover:border-gray-600 transition-all duration-200',
        'cursor-pointer hover:shadow-lg hover:shadow-blue-500/10'
      )}
    >
      {/* Thumbnail */}
      <div
        className="aspect-video bg-gray-700 relative"
        onClick={onSelect}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Layout className="w-12 h-12 text-gray-600" />
        </div>
        {/* Overlay on hover */}
        <div
          className={cn(
            'absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20',
            'flex items-center justify-center opacity-0 group-hover:opacity-100',
            'transition-all duration-200'
          )}
        >
          <span className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg font-medium">
            Use Template
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-white truncate">
              {template.name}
            </h4>
            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
              {template.description}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={cn(
              'p-1 rounded transition-colors flex-shrink-0',
              isFavorite
                ? 'text-yellow-400 hover:text-yellow-300'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            <Star className={cn('w-4 h-4', isFavorite && 'fill-current')} />
          </button>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          {isRecent && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] bg-blue-600/20 text-blue-400 rounded">
              <Clock className="w-3 h-3" />
              Recent
            </span>
          )}
          {template.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 text-[10px] bg-gray-700 text-gray-400 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TemplateGallery({ open, onOpenChange }: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const {
    templates: customTemplates,
    favoriteTemplates,
    recentTemplates,
    toggleFavoriteTemplate,
    addRecentTemplate,
  } = useCustomizationStore();

  useBuilderStore(); // Keep store connection for template application

  // Combine built-in and custom templates
  const allTemplates = useMemo(() => {
    return [...BUILTIN_TEMPLATES, ...customTemplates];
  }, [customTemplates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let result = allTemplates;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((t) => t.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return result;
  }, [allTemplates, selectedCategory, searchQuery]);

  // Get favorite templates
  const favorites = useMemo(() => {
    return allTemplates.filter((t) => favoriteTemplates.includes(t.id));
  }, [allTemplates, favoriteTemplates]);

  // Get recent templates
  const recents = useMemo(() => {
    return recentTemplates
      .map((id) => allTemplates.find((t) => t.id === id))
      .filter(Boolean) as Template[];
  }, [allTemplates, recentTemplates]);

  // Handle template selection
  const handleSelectTemplate = (template: Template) => {
    // Add to recent
    addRecentTemplate(template.id);

    // For now, just close and show a toast
    // In a full implementation, this would load the template elements
    toast.success(`Template "${template.name}" loaded`);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-4xl h-[80vh] bg-gray-900 rounded-xl shadow-2xl z-50',
            'flex flex-col overflow-hidden',
            'animate-in fade-in-0 zoom-in-95 duration-200'
          )}
        >
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold text-white">
                Template Gallery
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1 text-gray-400 hover:text-white rounded hover:bg-gray-800">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            {/* Search */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className={cn(
                  'w-full pl-10 pr-4 py-2.5 text-sm',
                  'bg-gray-800 border border-gray-700 rounded-lg',
                  'text-white placeholder-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                )}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Categories sidebar */}
            <div className="w-48 flex-shrink-0 border-r border-gray-800 overflow-y-auto">
              <div className="p-2">
                {TEMPLATE_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left',
                        'text-sm transition-colors',
                        isActive
                          ? 'bg-blue-600/20 text-blue-400'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {category.name}
                    </button>
                  );
                })}

                {/* Divider */}
                <div className="my-2 border-t border-gray-800" />

                {/* Favorites */}
                <button
                  onClick={() => setSelectedCategory('favorites')}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left',
                    'text-sm transition-colors',
                    selectedCategory === 'favorites'
                      ? 'bg-yellow-600/20 text-yellow-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  )}
                >
                  <Star className="w-4 h-4" />
                  Favorites
                  {favorites.length > 0 && (
                    <span className="ml-auto text-xs text-gray-500">
                      {favorites.length}
                    </span>
                  )}
                </button>

                {/* Recent */}
                <button
                  onClick={() => setSelectedCategory('recent')}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left',
                    'text-sm transition-colors',
                    selectedCategory === 'recent'
                      ? 'bg-purple-600/20 text-purple-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  )}
                >
                  <Clock className="w-4 h-4" />
                  Recent
                  {recents.length > 0 && (
                    <span className="ml-auto text-xs text-gray-500">
                      {recents.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Templates grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {selectedCategory === 'favorites' ? (
                favorites.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Star className="w-12 h-12 mb-2" />
                    <p className="text-sm">No favorite templates yet</p>
                    <p className="text-xs mt-1">Star templates to add them here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {favorites.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        isFavorite={true}
                        isRecent={recentTemplates.includes(template.id)}
                        onSelect={() => handleSelectTemplate(template)}
                        onToggleFavorite={() => toggleFavoriteTemplate(template.id)}
                      />
                    ))}
                  </div>
                )
              ) : selectedCategory === 'recent' ? (
                recents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Clock className="w-12 h-12 mb-2" />
                    <p className="text-sm">No recent templates</p>
                    <p className="text-xs mt-1">Templates you use will appear here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {recents.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        isFavorite={favoriteTemplates.includes(template.id)}
                        isRecent={true}
                        onSelect={() => handleSelectTemplate(template)}
                        onToggleFavorite={() => toggleFavoriteTemplate(template.id)}
                      />
                    ))}
                  </div>
                )
              ) : filteredTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Search className="w-12 h-12 mb-2" />
                  <p className="text-sm">No templates found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isFavorite={favoriteTemplates.includes(template.id)}
                      isRecent={recentTemplates.includes(template.id)}
                      onSelect={() => handleSelectTemplate(template)}
                      onToggleFavorite={() => toggleFavoriteTemplate(template.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default TemplateGallery;
