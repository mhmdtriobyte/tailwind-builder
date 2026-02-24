/**
 * Navigation Variants - 30+ navigation variant definitions
 *
 * Comprehensive navigation styling system for navbars, menus,
 * tabs, breadcrumbs, and pagination components.
 */

import {
  ComponentVariantSchema,
  SizeVariant,
  ColorVariant,
  StateVariant,
  LayoutVariant,
  VariantDefinition,
  CompoundVariant,
  registerVariantSchema,
  VARIANT_COLORS,
} from '../variantSystem';

// ============================================================================
// SIZE DEFINITIONS
// ============================================================================

const navigationSizes: Record<SizeVariant, VariantDefinition> = {
  xs: {
    name: 'Extra Small',
    description: 'Compact navigation',
    classes: ['py-2', 'px-3', 'text-xs'],
    preview: { backgroundColor: '#ffffff' },
  },
  sm: {
    name: 'Small',
    description: 'Small navigation',
    classes: ['py-3', 'px-4', 'text-sm'],
    preview: { backgroundColor: '#ffffff' },
  },
  md: {
    name: 'Medium',
    description: 'Default navigation size',
    classes: ['py-4', 'px-6', 'text-sm'],
    preview: { backgroundColor: '#ffffff' },
  },
  lg: {
    name: 'Large',
    description: 'Large navigation',
    classes: ['py-5', 'px-8', 'text-base'],
    preview: { backgroundColor: '#ffffff' },
  },
  xl: {
    name: 'Extra Large',
    description: 'Extra large navigation',
    classes: ['py-6', 'px-10', 'text-lg'],
    preview: { backgroundColor: '#ffffff' },
  },
  '2xl': {
    name: '2X Large',
    description: 'Maximum size navigation',
    classes: ['py-8', 'px-12', 'text-xl'],
    preview: { backgroundColor: '#ffffff' },
  },
};

// ============================================================================
// COLOR DEFINITIONS
// ============================================================================

function generateNavColorVariant(color: ColorVariant): VariantDefinition {
  const displayName = color.charAt(0).toUpperCase() + color.slice(1);

  if (color === 'white') {
    return {
      name: displayName,
      description: 'White navigation',
      classes: ['bg-white', 'text-gray-900'],
      preview: { backgroundColor: '#ffffff', textColor: '#111827' },
    };
  }

  if (color === 'black') {
    return {
      name: displayName,
      description: 'Black navigation',
      classes: ['bg-gray-900', 'text-white'],
      preview: { backgroundColor: '#111827', textColor: '#ffffff' },
    };
  }

  return {
    name: displayName,
    description: `${displayName} themed navigation`,
    classes: [
      `bg-${color}-600`,
      'text-white',
    ],
    preview: { backgroundColor: `var(--color-${color}-600)` },
  };
}

const navigationColors: Record<ColorVariant, VariantDefinition> = {} as Record<ColorVariant, VariantDefinition>;
for (const color of VARIANT_COLORS) {
  navigationColors[color] = generateNavColorVariant(color);
}

// ============================================================================
// STYLE DEFINITIONS
// ============================================================================

const navigationStyles: Record<string, VariantDefinition> = {
  // Navbar styles
  solid: {
    name: 'Solid',
    description: 'Solid background navbar',
    classes: ['shadow-sm'],
  },
  transparent: {
    name: 'Transparent',
    description: 'Transparent navbar (for hero sections)',
    classes: ['bg-transparent', 'absolute', 'top-0', 'left-0', 'right-0', 'z-50'],
  },
  bordered: {
    name: 'Bordered',
    description: 'Navbar with bottom border',
    classes: ['border-b', 'border-gray-200'],
  },
  elevated: {
    name: 'Elevated',
    description: 'Navbar with shadow elevation',
    classes: ['shadow-lg'],
  },
  glass: {
    name: 'Glass',
    description: 'Glassmorphism navbar',
    classes: [
      'backdrop-blur-lg', 'bg-white/80', 'border-b', 'border-white/20',
    ],
  },
  'glass-dark': {
    name: 'Glass Dark',
    description: 'Dark glassmorphism navbar',
    classes: [
      'backdrop-blur-lg', 'bg-gray-900/80', 'border-b', 'border-gray-800',
      'text-white',
    ],
  },
  floating: {
    name: 'Floating',
    description: 'Floating navbar with margin',
    classes: [
      'mx-4', 'mt-4', 'rounded-full', 'shadow-lg',
      'bg-white', 'border', 'border-gray-100',
    ],
  },
  sticky: {
    name: 'Sticky',
    description: 'Sticky navbar on scroll',
    classes: ['sticky', 'top-0', 'z-50', 'shadow-sm'],
  },
  minimal: {
    name: 'Minimal',
    description: 'Minimal navbar styling',
    classes: ['bg-transparent'],
  },
  dark: {
    name: 'Dark',
    description: 'Dark themed navbar',
    classes: ['bg-gray-900', 'text-white'],
  },

  // Dropdown styles
  dropdown: {
    name: 'Dropdown',
    description: 'Dropdown menu style',
    classes: [
      'absolute', 'top-full', 'left-0', 'mt-2',
      'bg-white', 'rounded-lg', 'shadow-lg',
      'border', 'border-gray-100', 'py-2', 'min-w-[200px]',
    ],
  },
  'mega-menu': {
    name: 'Mega Menu',
    description: 'Full-width mega menu',
    classes: [
      'absolute', 'top-full', 'left-0', 'right-0', 'mt-0',
      'bg-white', 'shadow-xl', 'border-t', 'border-gray-200',
      'py-8', 'px-6',
    ],
  },

  // Tab styles
  tabs: {
    name: 'Tabs',
    description: 'Horizontal tabs',
    classes: ['border-b', 'border-gray-200'],
  },
  'tabs-pills': {
    name: 'Tabs Pills',
    description: 'Pill-style tabs',
    classes: ['bg-gray-100', 'rounded-lg', 'p-1'],
  },
  'tabs-underline': {
    name: 'Tabs Underline',
    description: 'Underlined tabs',
    classes: [],
  },
  'tabs-boxed': {
    name: 'Tabs Boxed',
    description: 'Boxed tabs style',
    classes: ['bg-gray-100', 'rounded-md', 'p-1'],
  },

  // Breadcrumb styles
  breadcrumb: {
    name: 'Breadcrumb',
    description: 'Standard breadcrumb',
    classes: [],
  },
  'breadcrumb-arrows': {
    name: 'Breadcrumb Arrows',
    description: 'Breadcrumb with arrows',
    classes: [],
  },

  // Pagination styles
  pagination: {
    name: 'Pagination',
    description: 'Standard pagination',
    classes: ['flex', 'items-center', 'gap-1'],
  },
  'pagination-simple': {
    name: 'Pagination Simple',
    description: 'Simple prev/next pagination',
    classes: ['flex', 'items-center', 'justify-between'],
  },
  'pagination-rounded': {
    name: 'Pagination Rounded',
    description: 'Rounded pagination buttons',
    classes: ['flex', 'items-center', 'gap-2'],
  },

  // Sidebar styles
  sidebar: {
    name: 'Sidebar',
    description: 'Vertical sidebar navigation',
    classes: [
      'flex', 'flex-col', 'h-full',
      'bg-white', 'border-r', 'border-gray-200',
    ],
  },
  'sidebar-dark': {
    name: 'Sidebar Dark',
    description: 'Dark sidebar navigation',
    classes: [
      'flex', 'flex-col', 'h-full',
      'bg-gray-900', 'text-white',
    ],
  },
  'sidebar-compact': {
    name: 'Sidebar Compact',
    description: 'Compact icon-only sidebar',
    classes: [
      'flex', 'flex-col', 'h-full', 'w-16',
      'bg-white', 'border-r', 'border-gray-200',
    ],
  },
};

// ============================================================================
// STATE DEFINITIONS
// ============================================================================

const navigationStates: Record<StateVariant, VariantDefinition> = {
  default: {
    name: 'Default',
    description: 'Normal navigation state',
    classes: [],
  },
  hover: {
    name: 'Hover',
    description: 'Hover state preview',
    classes: [],
  },
  active: {
    name: 'Active',
    description: 'Active/current page state',
    classes: [],
  },
  focus: {
    name: 'Focus',
    description: 'Focused state',
    classes: [],
  },
  disabled: {
    name: 'Disabled',
    description: 'Disabled navigation state',
    classes: ['opacity-50', 'pointer-events-none'],
  },
  loading: {
    name: 'Loading',
    description: 'Loading state',
    classes: ['animate-pulse'],
  },
  success: {
    name: 'Success',
    description: 'Success state',
    classes: [],
  },
  error: {
    name: 'Error',
    description: 'Error state',
    classes: [],
  },
  warning: {
    name: 'Warning',
    description: 'Warning state',
    classes: [],
  },
  info: {
    name: 'Info',
    description: 'Info state',
    classes: [],
  },
};

// ============================================================================
// LAYOUT DEFINITIONS
// ============================================================================

const navigationLayouts: Record<string, VariantDefinition> = {
  horizontal: {
    name: 'Horizontal',
    description: 'Horizontal navigation layout',
    classes: ['flex', 'flex-row', 'items-center'],
  },
  vertical: {
    name: 'Vertical',
    description: 'Vertical navigation layout',
    classes: ['flex', 'flex-col'],
  },
  centered: {
    name: 'Centered',
    description: 'Centered navigation',
    classes: ['flex', 'items-center', 'justify-center'],
  },
  'space-between': {
    name: 'Space Between',
    description: 'Navigation with space between items',
    classes: ['flex', 'items-center', 'justify-between'],
  },
  'space-around': {
    name: 'Space Around',
    description: 'Navigation with space around items',
    classes: ['flex', 'items-center', 'justify-around'],
  },
  'full-width': {
    name: 'Full Width',
    description: 'Full width navigation',
    classes: ['w-full'],
  },
  contained: {
    name: 'Contained',
    description: 'Contained navigation with max-width',
    classes: ['max-w-7xl', 'mx-auto'],
  },
  stacked: {
    name: 'Stacked',
    description: 'Stacked navigation items',
    classes: ['flex', 'flex-col', 'space-y-2'],
  },
};

// ============================================================================
// COMPOUND VARIANTS
// ============================================================================

const navigationCompoundVariants: CompoundVariant[] = [
  // Glass navbar with different colors
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').slice(0, 10).map(color => ({
    conditions: { style: 'glass', color: color as ColorVariant },
    classes: [`bg-${color}-600/80`, 'text-white'],
    priority: 10,
  })),

  // Floating navbar with colors
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').slice(0, 10).map(color => ({
    conditions: { style: 'floating', color: color as ColorVariant },
    classes: [`bg-${color}-600`, 'text-white', 'border-transparent'],
    priority: 10,
  })),

  // Tab pills with colors
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').slice(0, 10).map(color => ({
    conditions: { style: 'tabs-pills', color: color as ColorVariant },
    classes: [`bg-${color}-100`],
    priority: 10,
  })),

  // Size adjustments for layouts
  {
    conditions: { size: 'lg', layout: 'horizontal' as LayoutVariant },
    classes: ['gap-8'],
    priority: 5,
  },
  {
    conditions: { size: 'md', layout: 'horizontal' as LayoutVariant },
    classes: ['gap-6'],
    priority: 5,
  },
  {
    conditions: { size: 'sm', layout: 'horizontal' as LayoutVariant },
    classes: ['gap-4'],
    priority: 5,
  },

  // Vertical layout spacing
  {
    conditions: { size: 'lg', layout: 'vertical' as LayoutVariant },
    classes: ['space-y-4'],
    priority: 5,
  },
  {
    conditions: { size: 'md', layout: 'vertical' as LayoutVariant },
    classes: ['space-y-2'],
    priority: 5,
  },
  {
    conditions: { size: 'sm', layout: 'vertical' as LayoutVariant },
    classes: ['space-y-1'],
    priority: 5,
  },

  // Mega menu layout
  {
    conditions: { style: 'mega-menu', layout: 'horizontal' as LayoutVariant },
    classes: ['grid', 'grid-cols-4', 'gap-8'],
    priority: 10,
  },
];

// ============================================================================
// NAVIGATION VARIANT SCHEMA
// ============================================================================

export const navigationVariantSchema: ComponentVariantSchema = {
  componentType: 'navigation',
  displayName: 'Navigation',
  category: 'navigation',
  baseClasses: [],
  sizes: navigationSizes,
  colors: navigationColors,
  styles: navigationStyles,
  states: navigationStates,
  layouts: navigationLayouts,
  compoundVariants: navigationCompoundVariants,
  defaultVariant: {
    size: 'md',
    color: 'white',
    style: 'solid',
    state: 'default',
    layout: 'horizontal',
  },
};

// ============================================================================
// PRESET NAVIGATION VARIANTS
// ============================================================================

export const navigationPresets = {
  // Navbar presets
  navbarSolid: { size: 'md', color: 'white', style: 'solid', state: 'default', layout: 'space-between' },
  navbarTransparent: { size: 'md', color: 'white', style: 'transparent', state: 'default', layout: 'space-between' },
  navbarBordered: { size: 'md', color: 'white', style: 'bordered', state: 'default', layout: 'space-between' },
  navbarElevated: { size: 'md', color: 'white', style: 'elevated', state: 'default', layout: 'space-between' },
  navbarGlass: { size: 'md', color: 'white', style: 'glass', state: 'default', layout: 'space-between' },
  navbarGlassDark: { size: 'md', color: 'black', style: 'glass-dark', state: 'default', layout: 'space-between' },
  navbarFloating: { size: 'md', color: 'white', style: 'floating', state: 'default', layout: 'space-between' },
  navbarSticky: { size: 'md', color: 'white', style: 'sticky', state: 'default', layout: 'space-between' },
  navbarDark: { size: 'md', color: 'black', style: 'dark', state: 'default', layout: 'space-between' },
  navbarColored: { size: 'md', color: 'blue', style: 'solid', state: 'default', layout: 'space-between' },

  // Tab presets
  tabsDefault: { size: 'md', color: 'blue', style: 'tabs', state: 'default', layout: 'horizontal' },
  tabsPills: { size: 'md', color: 'blue', style: 'tabs-pills', state: 'default', layout: 'horizontal' },
  tabsUnderline: { size: 'md', color: 'blue', style: 'tabs-underline', state: 'default', layout: 'horizontal' },
  tabsBoxed: { size: 'md', color: 'blue', style: 'tabs-boxed', state: 'default', layout: 'horizontal' },

  // Dropdown presets
  dropdown: { size: 'sm', color: 'white', style: 'dropdown', state: 'default', layout: 'vertical' },
  megaMenu: { size: 'md', color: 'white', style: 'mega-menu', state: 'default', layout: 'horizontal' },

  // Breadcrumb presets
  breadcrumb: { size: 'sm', color: 'gray', style: 'breadcrumb', state: 'default', layout: 'horizontal' },
  breadcrumbArrows: { size: 'sm', color: 'gray', style: 'breadcrumb-arrows', state: 'default', layout: 'horizontal' },

  // Pagination presets
  pagination: { size: 'sm', color: 'blue', style: 'pagination', state: 'default', layout: 'horizontal' },
  paginationSimple: { size: 'sm', color: 'blue', style: 'pagination-simple', state: 'default', layout: 'horizontal' },
  paginationRounded: { size: 'sm', color: 'blue', style: 'pagination-rounded', state: 'default', layout: 'horizontal' },

  // Sidebar presets
  sidebar: { size: 'md', color: 'white', style: 'sidebar', state: 'default', layout: 'vertical' },
  sidebarDark: { size: 'md', color: 'black', style: 'sidebar-dark', state: 'default', layout: 'vertical' },
  sidebarCompact: { size: 'sm', color: 'white', style: 'sidebar-compact', state: 'default', layout: 'vertical' },
} as const;

// ============================================================================
// REGISTRATION
// ============================================================================

registerVariantSchema(navigationVariantSchema);

// Register variants for specific navigation types
const navigationTypes = [
  'navbar',
  'mobile-menu',
  'footer',
  'breadcrumb',
  'tabs',
  'pagination',
];

for (const type of navigationTypes) {
  registerVariantSchema({
    ...navigationVariantSchema,
    componentType: type,
    displayName: type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  });
}

export {
  navigationSizes,
  navigationColors,
  navigationStyles,
  navigationStates,
  navigationLayouts,
  navigationCompoundVariants,
};
