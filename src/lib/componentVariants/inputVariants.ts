/**
 * Input Variants - 40+ input field variant definitions
 *
 * Comprehensive input styling system for text fields, textareas,
 * selects, and other form controls.
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

const inputSizes: Record<SizeVariant, VariantDefinition> = {
  xs: {
    name: 'Extra Small',
    description: 'Compact input for dense forms',
    classes: ['px-2', 'py-1', 'text-xs', 'h-7'],
    preview: { backgroundColor: '#ffffff' },
  },
  sm: {
    name: 'Small',
    description: 'Small input for compact layouts',
    classes: ['px-3', 'py-1.5', 'text-sm', 'h-8'],
    preview: { backgroundColor: '#ffffff' },
  },
  md: {
    name: 'Medium',
    description: 'Default input size',
    classes: ['px-4', 'py-2', 'text-sm', 'h-10'],
    preview: { backgroundColor: '#ffffff' },
  },
  lg: {
    name: 'Large',
    description: 'Large input for prominent forms',
    classes: ['px-4', 'py-3', 'text-base', 'h-12'],
    preview: { backgroundColor: '#ffffff' },
  },
  xl: {
    name: 'Extra Large',
    description: 'Extra large input for hero forms',
    classes: ['px-5', 'py-4', 'text-lg', 'h-14'],
    preview: { backgroundColor: '#ffffff' },
  },
  '2xl': {
    name: '2X Large',
    description: 'Maximum size input',
    classes: ['px-6', 'py-5', 'text-xl', 'h-16'],
    preview: { backgroundColor: '#ffffff' },
  },
};

// ============================================================================
// COLOR DEFINITIONS
// ============================================================================

function generateInputColorVariant(color: ColorVariant): VariantDefinition {
  const displayName = color.charAt(0).toUpperCase() + color.slice(1);

  if (color === 'white') {
    return {
      name: displayName,
      description: 'White background input',
      classes: ['bg-white', 'text-gray-900', 'border-gray-300'],
      preview: { backgroundColor: '#ffffff', textColor: '#111827' },
    };
  }

  if (color === 'black') {
    return {
      name: displayName,
      description: 'Dark background input',
      classes: ['bg-gray-900', 'text-white', 'border-gray-700'],
      preview: { backgroundColor: '#111827', textColor: '#ffffff' },
    };
  }

  return {
    name: displayName,
    description: `${displayName} accent input`,
    classes: [
      'bg-white',
      'text-gray-900',
      `border-${color}-300`,
      `focus:border-${color}-500`,
      `focus:ring-${color}-500`,
    ],
    preview: { borderColor: `var(--color-${color}-500)` },
  };
}

const inputColors: Record<ColorVariant, VariantDefinition> = {} as Record<ColorVariant, VariantDefinition>;
for (const color of VARIANT_COLORS) {
  inputColors[color] = generateInputColorVariant(color);
}

// ============================================================================
// STYLE DEFINITIONS
// ============================================================================

const inputStyles: Record<string, VariantDefinition> = {
  default: {
    name: 'Default',
    description: 'Standard input with border',
    classes: [
      'bg-white', 'border', 'border-gray-300', 'rounded-md',
      'shadow-sm', 'placeholder-gray-400',
    ],
  },
  filled: {
    name: 'Filled',
    description: 'Input with filled background',
    classes: [
      'bg-gray-100', 'border-0', 'border-b-2', 'border-transparent',
      'rounded-t-md', 'placeholder-gray-500',
      'focus:bg-gray-50', 'focus:border-blue-500',
    ],
  },
  outlined: {
    name: 'Outlined',
    description: 'Input with prominent outline',
    classes: [
      'bg-transparent', 'border-2', 'border-gray-300', 'rounded-md',
      'placeholder-gray-400',
    ],
  },
  underlined: {
    name: 'Underlined',
    description: 'Input with bottom border only',
    classes: [
      'bg-transparent', 'border-0', 'border-b-2', 'border-gray-300',
      'rounded-none', 'px-0', 'placeholder-gray-400',
    ],
  },
  ghost: {
    name: 'Ghost',
    description: 'Minimal input with no visible border',
    classes: [
      'bg-transparent', 'border-0', 'rounded-md',
      'placeholder-gray-400', 'hover:bg-gray-50', 'focus:bg-gray-50',
    ],
  },
  pill: {
    name: 'Pill',
    description: 'Fully rounded input',
    classes: [
      'bg-white', 'border', 'border-gray-300', 'rounded-full',
      'shadow-sm', 'placeholder-gray-400',
    ],
  },
  floating: {
    name: 'Floating Label',
    description: 'Input with floating label animation',
    classes: [
      'bg-white', 'border', 'border-gray-300', 'rounded-md',
      'pt-5', 'pb-1', 'placeholder-transparent',
    ],
  },
  'icon-left': {
    name: 'Icon Left',
    description: 'Input with left icon',
    classes: [
      'bg-white', 'border', 'border-gray-300', 'rounded-md',
      'pl-10', 'placeholder-gray-400',
    ],
  },
  'icon-right': {
    name: 'Icon Right',
    description: 'Input with right icon',
    classes: [
      'bg-white', 'border', 'border-gray-300', 'rounded-md',
      'pr-10', 'placeholder-gray-400',
    ],
  },
  'icon-both': {
    name: 'Icon Both',
    description: 'Input with icons on both sides',
    classes: [
      'bg-white', 'border', 'border-gray-300', 'rounded-md',
      'pl-10', 'pr-10', 'placeholder-gray-400',
    ],
  },
  'addon-left': {
    name: 'Addon Left',
    description: 'Input with left addon',
    classes: [
      'bg-white', 'border', 'border-gray-300',
      'rounded-r-md', 'rounded-l-none', 'border-l-0',
      'placeholder-gray-400',
    ],
  },
  'addon-right': {
    name: 'Addon Right',
    description: 'Input with right addon',
    classes: [
      'bg-white', 'border', 'border-gray-300',
      'rounded-l-md', 'rounded-r-none', 'border-r-0',
      'placeholder-gray-400',
    ],
  },
  'addon-both': {
    name: 'Addon Both',
    description: 'Input with addons on both sides',
    classes: [
      'bg-white', 'border', 'border-gray-300',
      'rounded-none', 'border-l-0', 'border-r-0',
      'placeholder-gray-400',
    ],
  },
  search: {
    name: 'Search',
    description: 'Search input style',
    classes: [
      'bg-gray-100', 'border-0', 'rounded-full',
      'pl-10', 'placeholder-gray-500',
      'focus:bg-white', 'focus:ring-2', 'focus:ring-blue-500',
    ],
  },
  inset: {
    name: 'Inset',
    description: 'Input with inset shadow',
    classes: [
      'bg-gray-50', 'border', 'border-gray-200', 'rounded-md',
      'shadow-inner', 'placeholder-gray-400',
    ],
  },
  'dark-mode': {
    name: 'Dark Mode',
    description: 'Dark themed input',
    classes: [
      'bg-gray-800', 'border', 'border-gray-700', 'rounded-md',
      'text-white', 'placeholder-gray-500',
    ],
  },
  glass: {
    name: 'Glass',
    description: 'Glassmorphism input',
    classes: [
      'backdrop-blur-md', 'bg-white/10', 'border', 'border-white/20',
      'rounded-md', 'text-white', 'placeholder-white/50',
    ],
  },
  bordered: {
    name: 'Bordered',
    description: 'Input with thick border',
    classes: [
      'bg-white', 'border-2', 'border-gray-300', 'rounded-md',
      'placeholder-gray-400',
    ],
  },
  minimal: {
    name: 'Minimal',
    description: 'Minimal input styling',
    classes: [
      'bg-transparent', 'border', 'border-gray-200', 'rounded-md',
      'placeholder-gray-400',
    ],
  },
};

// ============================================================================
// STATE DEFINITIONS
// ============================================================================

const inputStates: Record<StateVariant, VariantDefinition> = {
  default: {
    name: 'Default',
    description: 'Normal input state',
    classes: [
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500',
      'focus:border-blue-500', 'transition-all', 'duration-200',
    ],
  },
  hover: {
    name: 'Hover',
    description: 'Hover state preview',
    classes: ['border-gray-400'],
  },
  active: {
    name: 'Active',
    description: 'Active/focused state',
    classes: ['ring-2', 'ring-blue-500', 'border-blue-500'],
  },
  focus: {
    name: 'Focus',
    description: 'Focused state with ring',
    classes: ['ring-2', 'ring-blue-500', 'border-blue-500'],
  },
  disabled: {
    name: 'Disabled',
    description: 'Disabled input state',
    classes: [
      'bg-gray-100', 'text-gray-500', 'cursor-not-allowed',
      'opacity-60', 'pointer-events-none',
    ],
  },
  loading: {
    name: 'Loading',
    description: 'Loading state',
    classes: ['bg-gray-50', 'animate-pulse', 'cursor-wait'],
  },
  success: {
    name: 'Success',
    description: 'Valid input state',
    classes: [
      'border-green-500', 'focus:ring-green-500', 'focus:border-green-500',
      'pr-10',
    ],
  },
  error: {
    name: 'Error',
    description: 'Invalid input state',
    classes: [
      'border-red-500', 'focus:ring-red-500', 'focus:border-red-500',
      'text-red-900', 'placeholder-red-400', 'pr-10',
    ],
  },
  warning: {
    name: 'Warning',
    description: 'Warning input state',
    classes: [
      'border-amber-500', 'focus:ring-amber-500', 'focus:border-amber-500',
    ],
  },
  info: {
    name: 'Info',
    description: 'Info input state',
    classes: [
      'border-blue-500', 'focus:ring-blue-500', 'focus:border-blue-500',
    ],
  },
};

// ============================================================================
// COMPOUND VARIANTS
// ============================================================================

const inputCompoundVariants: CompoundVariant[] = [
  // Filled state colors
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').slice(0, 10).map(color => ({
    conditions: { style: 'filled', color: color as ColorVariant },
    classes: [
      `focus:border-${color}-500`,
      `focus:ring-${color}-500/20`,
    ],
    priority: 10,
  })),

  // Outlined state colors
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').slice(0, 10).map(color => ({
    conditions: { style: 'outlined', color: color as ColorVariant },
    classes: [
      `border-${color}-300`,
      `focus:border-${color}-500`,
      `focus:ring-${color}-500`,
    ],
    priority: 10,
  })),

  // Underlined state colors
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').slice(0, 10).map(color => ({
    conditions: { style: 'underlined', color: color as ColorVariant },
    classes: [
      `focus:border-${color}-500`,
    ],
    priority: 10,
  })),

  // Size adjustments for pill style
  {
    conditions: { size: 'xs', style: 'pill' },
    classes: ['px-3'],
    priority: 5,
  },
  {
    conditions: { size: 'sm', style: 'pill' },
    classes: ['px-4'],
    priority: 5,
  },
  {
    conditions: { size: 'lg', style: 'pill' },
    classes: ['px-6'],
    priority: 5,
  },
  {
    conditions: { size: 'xl', style: 'pill' },
    classes: ['px-8'],
    priority: 5,
  },

  // Search size adjustments
  {
    conditions: { size: 'lg', style: 'search' },
    classes: ['pl-12'],
    priority: 5,
  },
  {
    conditions: { size: 'xl', style: 'search' },
    classes: ['pl-14'],
    priority: 5,
  },

  // Error state with different styles
  {
    conditions: { style: 'filled', state: 'error' },
    classes: ['bg-red-50', 'border-red-500'],
    priority: 15,
  },
  {
    conditions: { style: 'underlined', state: 'error' },
    classes: ['border-red-500'],
    priority: 15,
  },

  // Success state with different styles
  {
    conditions: { style: 'filled', state: 'success' },
    classes: ['bg-green-50', 'border-green-500'],
    priority: 15,
  },
  {
    conditions: { style: 'underlined', state: 'success' },
    classes: ['border-green-500'],
    priority: 15,
  },
];

// ============================================================================
// INPUT VARIANT SCHEMA
// ============================================================================

export const inputVariantSchema: ComponentVariantSchema = {
  componentType: 'input',
  displayName: 'Input',
  category: 'forms',
  baseClasses: ['w-full', 'appearance-none'],
  sizes: inputSizes,
  colors: inputColors,
  styles: inputStyles,
  states: inputStates,
  compoundVariants: inputCompoundVariants,
  defaultVariant: {
    size: 'md',
    color: 'blue',
    style: 'default',
    state: 'default',
  },
};

// ============================================================================
// PRESET INPUT VARIANTS
// ============================================================================

export const inputPresets = {
  // Basic inputs
  basic: { size: 'md', color: 'blue', style: 'default', state: 'default' },
  filled: { size: 'md', color: 'blue', style: 'filled', state: 'default' },
  outlined: { size: 'md', color: 'blue', style: 'outlined', state: 'default' },
  underlined: { size: 'md', color: 'blue', style: 'underlined', state: 'default' },
  ghost: { size: 'md', color: 'blue', style: 'ghost', state: 'default' },
  pill: { size: 'md', color: 'blue', style: 'pill', state: 'default' },

  // With icons
  withIconLeft: { size: 'md', color: 'blue', style: 'icon-left', state: 'default' },
  withIconRight: { size: 'md', color: 'blue', style: 'icon-right', state: 'default' },
  withIconBoth: { size: 'md', color: 'blue', style: 'icon-both', state: 'default' },

  // With addons
  withAddonLeft: { size: 'md', color: 'blue', style: 'addon-left', state: 'default' },
  withAddonRight: { size: 'md', color: 'blue', style: 'addon-right', state: 'default' },
  withAddonBoth: { size: 'md', color: 'blue', style: 'addon-both', state: 'default' },

  // Special styles
  search: { size: 'md', color: 'blue', style: 'search', state: 'default' },
  searchLarge: { size: 'lg', color: 'blue', style: 'search', state: 'default' },
  floating: { size: 'md', color: 'blue', style: 'floating', state: 'default' },
  glass: { size: 'md', color: 'white', style: 'glass', state: 'default' },
  dark: { size: 'md', color: 'black', style: 'dark-mode', state: 'default' },

  // States
  valid: { size: 'md', color: 'green', style: 'default', state: 'success' },
  invalid: { size: 'md', color: 'red', style: 'default', state: 'error' },
  disabled: { size: 'md', color: 'gray', style: 'default', state: 'disabled' },

  // Sizes
  tiny: { size: 'xs', color: 'blue', style: 'default', state: 'default' },
  small: { size: 'sm', color: 'blue', style: 'default', state: 'default' },
  medium: { size: 'md', color: 'blue', style: 'default', state: 'default' },
  large: { size: 'lg', color: 'blue', style: 'default', state: 'default' },
  extraLarge: { size: 'xl', color: 'blue', style: 'default', state: 'default' },
} as const;

// ============================================================================
// REGISTRATION
// ============================================================================

registerVariantSchema(inputVariantSchema);

// Register variants for specific input types
const inputTypes = [
  'input-field',
  'textarea',
  'select-dropdown',
  'search-bar',
];

for (const type of inputTypes) {
  registerVariantSchema({
    ...inputVariantSchema,
    componentType: type,
    displayName: type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  });
}

export { inputSizes, inputColors, inputStyles, inputStates, inputCompoundVariants };
