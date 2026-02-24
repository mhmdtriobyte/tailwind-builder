/**
 * Card Variants - 50+ card variant definitions
 *
 * Comprehensive card styling system for containers, product cards,
 * pricing cards, testimonials, and more.
 */

import {
  ComponentVariantSchema,
  SizeVariant,
  ColorVariant,
  StateVariant,
  VariantDefinition,
  CompoundVariant,
  registerVariantSchema,
  VARIANT_COLORS,
} from '../variantSystem';

// ============================================================================
// SIZE DEFINITIONS
// ============================================================================

const cardSizes: Record<SizeVariant, VariantDefinition> = {
  xs: {
    name: 'Extra Small',
    description: 'Compact card for dense layouts',
    classes: ['p-3', 'max-w-xs'],
    preview: { backgroundColor: '#ffffff' },
  },
  sm: {
    name: 'Small',
    description: 'Small card for sidebars',
    classes: ['p-4', 'max-w-sm'],
    preview: { backgroundColor: '#ffffff' },
  },
  md: {
    name: 'Medium',
    description: 'Default card size',
    classes: ['p-6', 'max-w-md'],
    preview: { backgroundColor: '#ffffff' },
  },
  lg: {
    name: 'Large',
    description: 'Large card for main content',
    classes: ['p-8', 'max-w-lg'],
    preview: { backgroundColor: '#ffffff' },
  },
  xl: {
    name: 'Extra Large',
    description: 'Extra large card for featured content',
    classes: ['p-10', 'max-w-xl'],
    preview: { backgroundColor: '#ffffff' },
  },
  '2xl': {
    name: '2X Large',
    description: 'Maximum size card',
    classes: ['p-12', 'max-w-2xl'],
    preview: { backgroundColor: '#ffffff' },
  },
};

// ============================================================================
// COLOR DEFINITIONS
// ============================================================================

function generateCardColorVariant(color: ColorVariant): VariantDefinition {
  const displayName = color.charAt(0).toUpperCase() + color.slice(1);

  if (color === 'white') {
    return {
      name: displayName,
      description: 'White card',
      classes: ['bg-white', 'text-gray-900'],
      preview: { backgroundColor: '#ffffff', textColor: '#111827' },
    };
  }

  if (color === 'black') {
    return {
      name: displayName,
      description: 'Black card',
      classes: ['bg-gray-900', 'text-white'],
      preview: { backgroundColor: '#111827', textColor: '#ffffff' },
    };
  }

  return {
    name: displayName,
    description: `${displayName} tinted card`,
    classes: [`bg-${color}-50`, `text-${color}-900`, `border-${color}-100`],
    preview: { backgroundColor: `var(--color-${color}-50)` },
  };
}

const cardColors: Record<ColorVariant, VariantDefinition> = {} as Record<ColorVariant, VariantDefinition>;
for (const color of VARIANT_COLORS) {
  cardColors[color] = generateCardColorVariant(color);
}

// ============================================================================
// STYLE DEFINITIONS
// ============================================================================

const cardStyles: Record<string, VariantDefinition> = {
  elevated: {
    name: 'Elevated',
    description: 'Card with shadow elevation',
    classes: ['bg-white', 'shadow-lg', 'rounded-xl'],
  },
  flat: {
    name: 'Flat',
    description: 'Flat card with no shadow',
    classes: ['bg-white', 'rounded-lg'],
  },
  outlined: {
    name: 'Outlined',
    description: 'Card with border outline',
    classes: ['bg-white', 'border', 'border-gray-200', 'rounded-lg'],
  },
  glass: {
    name: 'Glass',
    description: 'Glassmorphism card effect',
    classes: [
      'backdrop-blur-lg', 'bg-white/80', 'border', 'border-white/20',
      'rounded-xl', 'shadow-xl',
    ],
  },
  gradient: {
    name: 'Gradient',
    description: 'Card with gradient background',
    classes: ['bg-gradient-to-br', 'rounded-xl', 'text-white'],
  },
  'gradient-border': {
    name: 'Gradient Border',
    description: 'Card with gradient border',
    classes: [
      'bg-white', 'rounded-xl', 'relative',
      'before:absolute', 'before:inset-0', 'before:-z-10',
      'before:rounded-xl', 'before:p-[2px]',
      'before:bg-gradient-to-r', 'before:from-blue-500', 'before:to-purple-500',
    ],
  },
  interactive: {
    name: 'Interactive',
    description: 'Hover-interactive card',
    classes: [
      'bg-white', 'border', 'border-gray-200', 'rounded-lg',
      'shadow-sm', 'hover:shadow-lg', 'hover:border-gray-300',
      'transition-all', 'duration-300', 'cursor-pointer',
    ],
  },
  'interactive-lift': {
    name: 'Interactive Lift',
    description: 'Card that lifts on hover',
    classes: [
      'bg-white', 'rounded-xl', 'shadow-md',
      'hover:shadow-xl', 'hover:-translate-y-1',
      'transition-all', 'duration-300', 'cursor-pointer',
    ],
  },
  'interactive-glow': {
    name: 'Interactive Glow',
    description: 'Card with hover glow effect',
    classes: [
      'bg-white', 'rounded-xl', 'shadow-md',
      'hover:shadow-blue-500/25', 'hover:shadow-xl',
      'transition-all', 'duration-300', 'cursor-pointer',
    ],
  },
  solid: {
    name: 'Solid',
    description: 'Solid color background card',
    classes: ['rounded-lg', 'shadow-sm'],
  },
  'dark-mode': {
    name: 'Dark Mode',
    description: 'Dark themed card',
    classes: ['bg-gray-800', 'text-white', 'rounded-xl', 'shadow-xl'],
  },
  minimal: {
    name: 'Minimal',
    description: 'Minimal card with subtle styling',
    classes: ['bg-gray-50', 'rounded-lg'],
  },
  feature: {
    name: 'Feature',
    description: 'Feature card with icon area',
    classes: [
      'bg-white', 'rounded-xl', 'border', 'border-gray-100',
      'shadow-sm', 'hover:shadow-md', 'transition-shadow',
    ],
  },
  pricing: {
    name: 'Pricing',
    description: 'Pricing tier card',
    classes: [
      'bg-white', 'rounded-2xl', 'border', 'border-gray-200',
      'shadow-lg', 'overflow-hidden',
    ],
  },
  'pricing-featured': {
    name: 'Pricing Featured',
    description: 'Featured pricing card',
    classes: [
      'bg-gradient-to-b', 'from-blue-600', 'to-blue-700',
      'text-white', 'rounded-2xl', 'shadow-xl', 'scale-105',
      'border-2', 'border-blue-400',
    ],
  },
  testimonial: {
    name: 'Testimonial',
    description: 'Testimonial quote card',
    classes: [
      'bg-white', 'rounded-xl', 'shadow-md',
      'border-l-4', 'border-blue-500',
    ],
  },
  profile: {
    name: 'Profile',
    description: 'User profile card',
    classes: [
      'bg-white', 'rounded-2xl', 'shadow-lg',
      'text-center', 'overflow-hidden',
    ],
  },
  product: {
    name: 'Product',
    description: 'E-commerce product card',
    classes: [
      'bg-white', 'rounded-xl', 'shadow-sm',
      'overflow-hidden', 'border', 'border-gray-100',
      'hover:shadow-lg', 'transition-shadow',
    ],
  },
  blog: {
    name: 'Blog',
    description: 'Blog post card',
    classes: [
      'bg-white', 'rounded-xl', 'shadow-sm',
      'overflow-hidden', 'hover:shadow-md', 'transition-shadow',
    ],
  },
  notification: {
    name: 'Notification',
    description: 'Notification/alert card',
    classes: [
      'rounded-lg', 'border-l-4', 'shadow-sm',
    ],
  },
  metric: {
    name: 'Metric',
    description: 'Dashboard metric card',
    classes: [
      'bg-white', 'rounded-xl', 'shadow-sm',
      'border', 'border-gray-100',
    ],
  },
  'image-overlay': {
    name: 'Image Overlay',
    description: 'Card with image and text overlay',
    classes: [
      'relative', 'overflow-hidden', 'rounded-xl',
      'before:absolute', 'before:inset-0',
      'before:bg-gradient-to-t', 'before:from-black/60', 'before:to-transparent',
    ],
  },
  horizontal: {
    name: 'Horizontal',
    description: 'Horizontal layout card',
    classes: [
      'bg-white', 'rounded-xl', 'shadow-sm',
      'flex', 'flex-row', 'overflow-hidden',
    ],
  },
  compact: {
    name: 'Compact',
    description: 'Compact card with minimal padding',
    classes: ['bg-white', 'rounded-lg', 'shadow-sm', 'p-3'],
  },
  bordered: {
    name: 'Bordered',
    description: 'Card with thick border',
    classes: ['bg-white', 'rounded-lg', 'border-2', 'border-gray-200'],
  },
  inset: {
    name: 'Inset',
    description: 'Card with inset shadow',
    classes: ['bg-gray-50', 'rounded-lg', 'shadow-inner'],
  },
};

// ============================================================================
// STATE DEFINITIONS
// ============================================================================

const cardStates: Record<StateVariant, VariantDefinition> = {
  default: {
    name: 'Default',
    description: 'Normal card state',
    classes: [],
  },
  hover: {
    name: 'Hover',
    description: 'Hover state preview',
    classes: ['shadow-lg'],
  },
  active: {
    name: 'Active',
    description: 'Selected/active state',
    classes: ['ring-2', 'ring-blue-500'],
  },
  focus: {
    name: 'Focus',
    description: 'Focused state',
    classes: ['ring-2', 'ring-blue-500', 'ring-offset-2'],
  },
  disabled: {
    name: 'Disabled',
    description: 'Disabled state',
    classes: ['opacity-50', 'pointer-events-none'],
  },
  loading: {
    name: 'Loading',
    description: 'Loading state',
    classes: ['animate-pulse', 'bg-gray-100'],
  },
  success: {
    name: 'Success',
    description: 'Success feedback state',
    classes: ['border-green-500', 'bg-green-50'],
  },
  error: {
    name: 'Error',
    description: 'Error feedback state',
    classes: ['border-red-500', 'bg-red-50'],
  },
  warning: {
    name: 'Warning',
    description: 'Warning feedback state',
    classes: ['border-amber-500', 'bg-amber-50'],
  },
  info: {
    name: 'Info',
    description: 'Info feedback state',
    classes: ['border-blue-500', 'bg-blue-50'],
  },
};

// ============================================================================
// COMPOUND VARIANTS
// ============================================================================

const cardCompoundVariants: CompoundVariant[] = [
  // Gradient color combinations
  {
    conditions: { style: 'gradient', color: 'blue' },
    classes: ['from-blue-500', 'to-blue-700'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient', color: 'purple' },
    classes: ['from-purple-500', 'to-purple-700'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient', color: 'pink' },
    classes: ['from-pink-500', 'to-rose-500'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient', color: 'green' },
    classes: ['from-green-500', 'to-emerald-600'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient', color: 'orange' },
    classes: ['from-orange-500', 'to-red-500'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient', color: 'indigo' },
    classes: ['from-indigo-500', 'via-purple-500', 'to-pink-500'],
    priority: 10,
  },

  // Notification states
  {
    conditions: { style: 'notification', state: 'success' },
    classes: ['border-green-500', 'bg-green-50', 'text-green-900'],
    priority: 15,
  },
  {
    conditions: { style: 'notification', state: 'error' },
    classes: ['border-red-500', 'bg-red-50', 'text-red-900'],
    priority: 15,
  },
  {
    conditions: { style: 'notification', state: 'warning' },
    classes: ['border-amber-500', 'bg-amber-50', 'text-amber-900'],
    priority: 15,
  },
  {
    conditions: { style: 'notification', state: 'info' },
    classes: ['border-blue-500', 'bg-blue-50', 'text-blue-900'],
    priority: 15,
  },

  // Interactive glow colors
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').slice(0, 10).map(color => ({
    conditions: { style: 'interactive-glow', color: color as ColorVariant },
    classes: [`hover:shadow-${color}-500/25`],
    priority: 10,
  })),

  // Size adjustments for specific styles
  {
    conditions: { size: 'xs', style: 'pricing' },
    classes: ['p-4'],
    priority: 5,
  },
  {
    conditions: { size: 'lg', style: 'pricing' },
    classes: ['p-10'],
    priority: 5,
  },
  {
    conditions: { size: 'xl', style: 'pricing-featured' },
    classes: ['p-12', 'scale-110'],
    priority: 5,
  },
];

// ============================================================================
// CARD VARIANT SCHEMA
// ============================================================================

export const cardVariantSchema: ComponentVariantSchema = {
  componentType: 'card',
  displayName: 'Card',
  category: 'cards',
  baseClasses: ['w-full'],
  sizes: cardSizes,
  colors: cardColors,
  styles: cardStyles,
  states: cardStates,
  compoundVariants: cardCompoundVariants,
  defaultVariant: {
    size: 'md',
    color: 'white',
    style: 'elevated',
    state: 'default',
  },
};

// ============================================================================
// PRESET CARD VARIANTS
// ============================================================================

export const cardPresets = {
  // Basic cards
  basic: { size: 'md', color: 'white', style: 'elevated', state: 'default' },
  flat: { size: 'md', color: 'white', style: 'flat', state: 'default' },
  outlined: { size: 'md', color: 'white', style: 'outlined', state: 'default' },
  bordered: { size: 'md', color: 'white', style: 'bordered', state: 'default' },

  // Interactive cards
  interactive: { size: 'md', color: 'white', style: 'interactive', state: 'default' },
  interactiveLift: { size: 'md', color: 'white', style: 'interactive-lift', state: 'default' },
  interactiveGlow: { size: 'md', color: 'blue', style: 'interactive-glow', state: 'default' },

  // Special styles
  glass: { size: 'md', color: 'white', style: 'glass', state: 'default' },
  gradient: { size: 'md', color: 'blue', style: 'gradient', state: 'default' },
  gradientPurple: { size: 'md', color: 'purple', style: 'gradient', state: 'default' },
  dark: { size: 'md', color: 'black', style: 'dark-mode', state: 'default' },

  // Use case cards
  feature: { size: 'md', color: 'white', style: 'feature', state: 'default' },
  pricing: { size: 'lg', color: 'white', style: 'pricing', state: 'default' },
  pricingFeatured: { size: 'lg', color: 'blue', style: 'pricing-featured', state: 'default' },
  testimonial: { size: 'md', color: 'white', style: 'testimonial', state: 'default' },
  profile: { size: 'md', color: 'white', style: 'profile', state: 'default' },
  product: { size: 'md', color: 'white', style: 'product', state: 'default' },
  blog: { size: 'md', color: 'white', style: 'blog', state: 'default' },
  metric: { size: 'sm', color: 'white', style: 'metric', state: 'default' },

  // Notification cards
  notificationSuccess: { size: 'sm', color: 'green', style: 'notification', state: 'success' },
  notificationError: { size: 'sm', color: 'red', style: 'notification', state: 'error' },
  notificationWarning: { size: 'sm', color: 'amber', style: 'notification', state: 'warning' },
  notificationInfo: { size: 'sm', color: 'blue', style: 'notification', state: 'info' },

  // Layout variations
  horizontal: { size: 'md', color: 'white', style: 'horizontal', state: 'default' },
  compact: { size: 'xs', color: 'white', style: 'compact', state: 'default' },
} as const;

// ============================================================================
// REGISTRATION
// ============================================================================

registerVariantSchema(cardVariantSchema);

// Register variants for specific card types
const cardTypes = [
  'simple-card',
  'product-card',
  'pricing-card',
  'testimonial-card',
  'profile-card',
  'blog-card',
  'stats-card',
  'feature-card',
  'image-card',
  'horizontal-card',
];

for (const type of cardTypes) {
  registerVariantSchema({
    ...cardVariantSchema,
    componentType: type,
    displayName: type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  });
}

export { cardSizes, cardColors, cardStyles, cardStates, cardCompoundVariants };
