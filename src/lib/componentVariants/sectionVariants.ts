/**
 * Section Variants - 50+ section variant definitions
 *
 * Comprehensive section styling system for hero sections, feature sections,
 * CTAs, testimonials, and other page sections.
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

const sectionSizes: Record<SizeVariant, VariantDefinition> = {
  xs: {
    name: 'Extra Small',
    description: 'Compact section padding',
    classes: ['py-8', 'px-4'],
    preview: { backgroundColor: '#ffffff' },
  },
  sm: {
    name: 'Small',
    description: 'Small section padding',
    classes: ['py-12', 'px-6'],
    preview: { backgroundColor: '#ffffff' },
  },
  md: {
    name: 'Medium',
    description: 'Default section padding',
    classes: ['py-16', 'px-6'],
    preview: { backgroundColor: '#ffffff' },
  },
  lg: {
    name: 'Large',
    description: 'Large section padding',
    classes: ['py-24', 'px-8'],
    preview: { backgroundColor: '#ffffff' },
  },
  xl: {
    name: 'Extra Large',
    description: 'Extra large section padding',
    classes: ['py-32', 'px-8'],
    preview: { backgroundColor: '#ffffff' },
  },
  '2xl': {
    name: '2X Large',
    description: 'Maximum section padding',
    classes: ['py-40', 'px-8'],
    preview: { backgroundColor: '#ffffff' },
  },
};

// ============================================================================
// COLOR DEFINITIONS
// ============================================================================

function generateSectionColorVariant(color: ColorVariant): VariantDefinition {
  const displayName = color.charAt(0).toUpperCase() + color.slice(1);

  if (color === 'white') {
    return {
      name: displayName,
      description: 'White section',
      classes: ['bg-white', 'text-gray-900'],
      preview: { backgroundColor: '#ffffff', textColor: '#111827' },
    };
  }

  if (color === 'black') {
    return {
      name: displayName,
      description: 'Black section',
      classes: ['bg-gray-900', 'text-white'],
      preview: { backgroundColor: '#111827', textColor: '#ffffff' },
    };
  }

  return {
    name: displayName,
    description: `${displayName} section`,
    classes: [
      `bg-${color}-50`,
      `text-${color}-900`,
    ],
    preview: { backgroundColor: `var(--color-${color}-50)` },
  };
}

const sectionColors: Record<ColorVariant, VariantDefinition> = {} as Record<ColorVariant, VariantDefinition>;
for (const color of VARIANT_COLORS) {
  sectionColors[color] = generateSectionColorVariant(color);
}

// ============================================================================
// STYLE DEFINITIONS
// ============================================================================

const sectionStyles: Record<string, VariantDefinition> = {
  // Basic styles
  solid: {
    name: 'Solid',
    description: 'Solid background section',
    classes: [],
  },
  gradient: {
    name: 'Gradient',
    description: 'Gradient background section',
    classes: ['bg-gradient-to-br'],
  },
  'gradient-radial': {
    name: 'Radial Gradient',
    description: 'Radial gradient background',
    classes: ['bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]'],
  },
  mesh: {
    name: 'Mesh Gradient',
    description: 'Mesh gradient background',
    classes: [
      'bg-gradient-to-br',
      'from-indigo-500', 'via-purple-500', 'to-pink-500',
    ],
  },
  pattern: {
    name: 'Pattern',
    description: 'Background with pattern overlay',
    classes: [
      'relative',
      'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]',
    ],
  },
  'pattern-dots': {
    name: 'Pattern Dots',
    description: 'Dotted pattern background',
    classes: [
      'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)]',
      '[background-size:16px_16px]',
    ],
  },
  'pattern-grid': {
    name: 'Pattern Grid',
    description: 'Grid pattern background',
    classes: [
      'bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)]',
      '[background-size:14px_24px]',
    ],
  },
  glass: {
    name: 'Glass',
    description: 'Glassmorphism section',
    classes: [
      'backdrop-blur-xl', 'bg-white/10',
      'border-y', 'border-white/20',
    ],
  },

  // Hero specific styles
  'hero-centered': {
    name: 'Hero Centered',
    description: 'Centered hero section',
    classes: ['text-center'],
  },
  'hero-split': {
    name: 'Hero Split',
    description: 'Split hero with text and image',
    classes: ['grid', 'lg:grid-cols-2', 'gap-12', 'items-center'],
  },
  'hero-image-bg': {
    name: 'Hero Image Background',
    description: 'Hero with full background image',
    classes: [
      'relative', 'bg-cover', 'bg-center', 'bg-no-repeat',
      'before:absolute', 'before:inset-0', 'before:bg-black/50',
    ],
  },
  'hero-video-bg': {
    name: 'Hero Video Background',
    description: 'Hero with video background',
    classes: [
      'relative', 'overflow-hidden',
    ],
  },
  'hero-gradient-overlay': {
    name: 'Hero Gradient Overlay',
    description: 'Hero with gradient overlay',
    classes: [
      'relative',
      'before:absolute', 'before:inset-0',
      'before:bg-gradient-to-r', 'before:from-black/70', 'before:to-transparent',
    ],
  },

  // Feature section styles
  'feature-grid': {
    name: 'Feature Grid',
    description: 'Feature section with grid layout',
    classes: [],
  },
  'feature-alternating': {
    name: 'Feature Alternating',
    description: 'Alternating feature layout',
    classes: [],
  },
  'feature-centered': {
    name: 'Feature Centered',
    description: 'Centered feature cards',
    classes: ['text-center'],
  },

  // CTA styles
  'cta-banner': {
    name: 'CTA Banner',
    description: 'Full-width CTA banner',
    classes: ['text-center'],
  },
  'cta-split': {
    name: 'CTA Split',
    description: 'Split CTA with text and form',
    classes: ['grid', 'lg:grid-cols-2', 'gap-8', 'items-center'],
  },
  'cta-card': {
    name: 'CTA Card',
    description: 'CTA in a floating card',
    classes: [
      'rounded-2xl', 'shadow-xl', 'mx-auto', 'max-w-4xl',
    ],
  },

  // Testimonial styles
  'testimonial-grid': {
    name: 'Testimonial Grid',
    description: 'Grid of testimonial cards',
    classes: [],
  },
  'testimonial-carousel': {
    name: 'Testimonial Carousel',
    description: 'Carousel testimonials',
    classes: ['overflow-hidden'],
  },
  'testimonial-single': {
    name: 'Testimonial Single',
    description: 'Single large testimonial',
    classes: ['text-center', 'max-w-3xl', 'mx-auto'],
  },

  // Pricing styles
  'pricing-cards': {
    name: 'Pricing Cards',
    description: 'Side by side pricing cards',
    classes: [],
  },
  'pricing-table': {
    name: 'Pricing Table',
    description: 'Comparison table pricing',
    classes: [],
  },

  // Stats styles
  'stats-row': {
    name: 'Stats Row',
    description: 'Horizontal stats layout',
    classes: [],
  },
  'stats-grid': {
    name: 'Stats Grid',
    description: 'Grid stats layout',
    classes: [],
  },
  'stats-highlight': {
    name: 'Stats Highlight',
    description: 'Highlighted stats section',
    classes: ['rounded-2xl'],
  },

  // Special styles
  'wave-top': {
    name: 'Wave Top',
    description: 'Section with wave shape at top',
    classes: [
      'relative',
      'before:absolute', 'before:top-0', 'before:left-0', 'before:right-0',
      'before:h-16', 'before:bg-white',
      'before:[clip-path:ellipse(60%_100%_at_50%_0%)]',
    ],
  },
  'wave-bottom': {
    name: 'Wave Bottom',
    description: 'Section with wave shape at bottom',
    classes: [
      'relative',
      'after:absolute', 'after:bottom-0', 'after:left-0', 'after:right-0',
      'after:h-16', 'after:bg-white',
      'after:[clip-path:ellipse(60%_100%_at_50%_100%)]',
    ],
  },
  'skew-top': {
    name: 'Skew Top',
    description: 'Section with skewed top edge',
    classes: [
      'relative',
      'before:absolute', 'before:top-0', 'before:left-0', 'before:right-0',
      'before:h-16', 'before:-translate-y-1/2',
      'before:bg-inherit', 'before:skew-y-2',
    ],
  },
  'skew-bottom': {
    name: 'Skew Bottom',
    description: 'Section with skewed bottom edge',
    classes: [
      'relative',
      'after:absolute', 'after:bottom-0', 'after:left-0', 'after:right-0',
      'after:h-16', 'after:translate-y-1/2',
      'after:bg-inherit', 'after:-skew-y-2',
    ],
  },
  bordered: {
    name: 'Bordered',
    description: 'Section with border',
    classes: ['border-y', 'border-gray-200'],
  },
  inset: {
    name: 'Inset',
    description: 'Inset section with margin',
    classes: ['mx-4', 'lg:mx-8', 'rounded-2xl'],
  },
};

// ============================================================================
// STATE DEFINITIONS
// ============================================================================

const sectionStates: Record<StateVariant, VariantDefinition> = {
  default: {
    name: 'Default',
    description: 'Normal section state',
    classes: [],
  },
  hover: {
    name: 'Hover',
    description: 'Hover state preview',
    classes: [],
  },
  active: {
    name: 'Active',
    description: 'Active state',
    classes: [],
  },
  focus: {
    name: 'Focus',
    description: 'Focused state',
    classes: [],
  },
  disabled: {
    name: 'Disabled',
    description: 'Disabled state',
    classes: ['opacity-50'],
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

const sectionLayouts: Record<string, VariantDefinition> = {
  'full-width': {
    name: 'Full Width',
    description: 'Full viewport width section',
    classes: ['w-full'],
  },
  contained: {
    name: 'Contained',
    description: 'Max-width contained section',
    classes: ['max-w-7xl', 'mx-auto'],
  },
  narrow: {
    name: 'Narrow',
    description: 'Narrow contained section',
    classes: ['max-w-4xl', 'mx-auto'],
  },
  wide: {
    name: 'Wide',
    description: 'Wide contained section',
    classes: ['max-w-screen-2xl', 'mx-auto'],
  },
  split: {
    name: 'Split',
    description: 'Two column split layout',
    classes: ['grid', 'lg:grid-cols-2', 'gap-12', 'items-center'],
  },
  'split-reverse': {
    name: 'Split Reverse',
    description: 'Two column split layout (reversed)',
    classes: ['grid', 'lg:grid-cols-2', 'gap-12', 'items-center'],
  },
  centered: {
    name: 'Centered',
    description: 'Center-aligned content',
    classes: ['text-center'],
  },
  left: {
    name: 'Left Aligned',
    description: 'Left-aligned content',
    classes: ['text-left'],
  },
  stacked: {
    name: 'Stacked',
    description: 'Vertically stacked content',
    classes: ['flex', 'flex-col', 'space-y-8'],
  },
  overlapping: {
    name: 'Overlapping',
    description: 'Overlapping elements layout',
    classes: ['relative', '-mt-16', 'lg:-mt-24', 'z-10'],
  },
  floating: {
    name: 'Floating',
    description: 'Floating card layout',
    classes: ['relative', 'z-10'],
  },
};

// ============================================================================
// COMPOUND VARIANTS
// ============================================================================

const sectionCompoundVariants: CompoundVariant[] = [
  // Gradient color combinations
  {
    conditions: { style: 'gradient', color: 'blue' },
    classes: ['from-blue-600', 'to-blue-800', 'text-white'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient', color: 'purple' },
    classes: ['from-purple-600', 'to-purple-800', 'text-white'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient', color: 'pink' },
    classes: ['from-pink-500', 'to-rose-600', 'text-white'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient', color: 'green' },
    classes: ['from-green-600', 'to-emerald-700', 'text-white'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient', color: 'indigo' },
    classes: ['from-indigo-600', 'via-purple-600', 'to-pink-500', 'text-white'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient', color: 'orange' },
    classes: ['from-orange-500', 'to-red-600', 'text-white'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient', color: 'cyan' },
    classes: ['from-cyan-500', 'to-blue-600', 'text-white'],
    priority: 10,
  },

  // Solid dark colors
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').slice(0, 10).map(color => ({
    conditions: { style: 'solid', color: color as ColorVariant },
    classes: [`bg-${color}-600`, 'text-white'],
    priority: 8,
  })),

  // Hero split with size adjustments
  {
    conditions: { style: 'hero-split', size: 'lg' },
    classes: ['min-h-[600px]'],
    priority: 5,
  },
  {
    conditions: { style: 'hero-split', size: 'xl' },
    classes: ['min-h-[700px]'],
    priority: 5,
  },
  {
    conditions: { style: 'hero-split', size: '2xl' },
    classes: ['min-h-screen'],
    priority: 5,
  },

  // CTA card with colors
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').slice(0, 10).map(color => ({
    conditions: { style: 'cta-card', color: color as ColorVariant },
    classes: [`bg-${color}-600`, 'text-white'],
    priority: 10,
  })),

  // Stats highlight with colors
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').slice(0, 10).map(color => ({
    conditions: { style: 'stats-highlight', color: color as ColorVariant },
    classes: [`bg-${color}-600`, 'text-white'],
    priority: 10,
  })),
];

// ============================================================================
// SECTION VARIANT SCHEMA
// ============================================================================

export const sectionVariantSchema: ComponentVariantSchema = {
  componentType: 'section',
  displayName: 'Section',
  category: 'sections',
  baseClasses: ['w-full', 'relative'],
  sizes: sectionSizes,
  colors: sectionColors,
  styles: sectionStyles,
  states: sectionStates,
  layouts: sectionLayouts,
  compoundVariants: sectionCompoundVariants,
  defaultVariant: {
    size: 'lg',
    color: 'white',
    style: 'solid',
    state: 'default',
    layout: 'contained',
  },
};

// ============================================================================
// PRESET SECTION VARIANTS
// ============================================================================

export const sectionPresets = {
  // Hero presets
  heroCentered: { size: 'xl', color: 'white', style: 'hero-centered', state: 'default', layout: 'contained' },
  heroSplit: { size: 'xl', color: 'white', style: 'hero-split', state: 'default', layout: 'full-width' },
  heroGradient: { size: 'xl', color: 'blue', style: 'gradient', state: 'default', layout: 'contained' },
  heroMesh: { size: 'xl', color: 'indigo', style: 'mesh', state: 'default', layout: 'contained' },
  heroImageBg: { size: 'xl', color: 'black', style: 'hero-image-bg', state: 'default', layout: 'contained' },
  heroDark: { size: 'xl', color: 'black', style: 'solid', state: 'default', layout: 'contained' },

  // Feature presets
  featureGrid: { size: 'lg', color: 'white', style: 'feature-grid', state: 'default', layout: 'contained' },
  featureAlternating: { size: 'lg', color: 'gray', style: 'feature-alternating', state: 'default', layout: 'contained' },
  featureCentered: { size: 'lg', color: 'white', style: 'feature-centered', state: 'default', layout: 'contained' },

  // CTA presets
  ctaBanner: { size: 'md', color: 'blue', style: 'cta-banner', state: 'default', layout: 'contained' },
  ctaSplit: { size: 'md', color: 'gray', style: 'cta-split', state: 'default', layout: 'contained' },
  ctaCard: { size: 'md', color: 'blue', style: 'cta-card', state: 'default', layout: 'contained' },
  ctaGradient: { size: 'md', color: 'indigo', style: 'gradient', state: 'default', layout: 'contained' },

  // Testimonial presets
  testimonialGrid: { size: 'lg', color: 'gray', style: 'testimonial-grid', state: 'default', layout: 'contained' },
  testimonialSingle: { size: 'lg', color: 'white', style: 'testimonial-single', state: 'default', layout: 'narrow' },

  // Pricing presets
  pricingCards: { size: 'lg', color: 'white', style: 'pricing-cards', state: 'default', layout: 'contained' },
  pricingTable: { size: 'lg', color: 'gray', style: 'pricing-table', state: 'default', layout: 'contained' },

  // Stats presets
  statsRow: { size: 'md', color: 'white', style: 'stats-row', state: 'default', layout: 'contained' },
  statsGrid: { size: 'md', color: 'gray', style: 'stats-grid', state: 'default', layout: 'contained' },
  statsHighlight: { size: 'md', color: 'blue', style: 'stats-highlight', state: 'default', layout: 'contained' },

  // Pattern presets
  patternDots: { size: 'lg', color: 'white', style: 'pattern-dots', state: 'default', layout: 'contained' },
  patternGrid: { size: 'lg', color: 'white', style: 'pattern-grid', state: 'default', layout: 'contained' },

  // Special presets
  glass: { size: 'lg', color: 'white', style: 'glass', state: 'default', layout: 'contained' },
  waveTop: { size: 'lg', color: 'gray', style: 'wave-top', state: 'default', layout: 'full-width' },
  waveBottom: { size: 'lg', color: 'gray', style: 'wave-bottom', state: 'default', layout: 'full-width' },
  skew: { size: 'lg', color: 'blue', style: 'skew-bottom', state: 'default', layout: 'full-width' },
  inset: { size: 'lg', color: 'gray', style: 'inset', state: 'default', layout: 'contained' },
} as const;

// ============================================================================
// REGISTRATION
// ============================================================================

registerVariantSchema(sectionVariantSchema);

// Register variants for specific section types
const sectionTypes = [
  'hero-section',
  'hero-with-image',
  'feature-section',
  'cta-section',
  'stats-section',
  'testimonials-section',
  'team-section',
  'faq-section',
  'pricing-section',
  'contact-section',
];

for (const type of sectionTypes) {
  registerVariantSchema({
    ...sectionVariantSchema,
    componentType: type,
    displayName: type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  });
}

export {
  sectionSizes,
  sectionColors,
  sectionStyles,
  sectionStates,
  sectionLayouts,
  sectionCompoundVariants,
};
