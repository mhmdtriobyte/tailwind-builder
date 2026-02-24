/**
 * Button Variants - 100+ button variant definitions
 *
 * Comprehensive button styling system with all size, color, style,
 * and state combinations for maximum customization.
 */

import {
  ComponentVariantSchema,
  SizeVariant,
  ColorVariant,
  StyleVariant,
  StateVariant,
  VariantDefinition,
  CompoundVariant,
  registerVariantSchema,
  generateColorClasses,
  generateHoverClasses,
  generateFocusClasses,
  VARIANT_COLORS,
} from '../variantSystem';

// ============================================================================
// SIZE DEFINITIONS
// ============================================================================

const buttonSizes: Record<SizeVariant, VariantDefinition> = {
  xs: {
    name: 'Extra Small',
    description: 'Compact button for tight spaces',
    classes: ['px-2', 'py-1', 'text-xs', 'min-h-[24px]'],
    preview: { backgroundColor: '#f3f4f6' },
  },
  sm: {
    name: 'Small',
    description: 'Smaller button for secondary actions',
    classes: ['px-3', 'py-1.5', 'text-sm', 'min-h-[32px]'],
    preview: { backgroundColor: '#f3f4f6' },
  },
  md: {
    name: 'Medium',
    description: 'Default button size',
    classes: ['px-4', 'py-2', 'text-sm', 'min-h-[40px]'],
    preview: { backgroundColor: '#f3f4f6' },
  },
  lg: {
    name: 'Large',
    description: 'Larger button for primary actions',
    classes: ['px-6', 'py-3', 'text-base', 'min-h-[48px]'],
    preview: { backgroundColor: '#f3f4f6' },
  },
  xl: {
    name: 'Extra Large',
    description: 'Extra large button for hero sections',
    classes: ['px-8', 'py-4', 'text-lg', 'min-h-[56px]'],
    preview: { backgroundColor: '#f3f4f6' },
  },
  '2xl': {
    name: '2X Large',
    description: 'Maximum size button for prominent CTAs',
    classes: ['px-10', 'py-5', 'text-xl', 'min-h-[64px]'],
    preview: { backgroundColor: '#f3f4f6' },
  },
};

// ============================================================================
// COLOR DEFINITIONS
// ============================================================================

function generateButtonColorVariant(color: ColorVariant): VariantDefinition {
  const displayName = color.charAt(0).toUpperCase() + color.slice(1);

  if (color === 'white') {
    return {
      name: displayName,
      description: `White button`,
      classes: ['bg-white', 'text-gray-900', 'hover:bg-gray-100', 'border', 'border-gray-200'],
      preview: { backgroundColor: '#ffffff', textColor: '#111827' },
    };
  }

  if (color === 'black') {
    return {
      name: displayName,
      description: `Black button`,
      classes: ['bg-black', 'text-white', 'hover:bg-gray-900'],
      preview: { backgroundColor: '#000000', textColor: '#ffffff' },
    };
  }

  return {
    name: displayName,
    description: `${displayName} colored button`,
    classes: [
      generateColorClasses(color, '600', 'bg'),
      'text-white',
      generateHoverClasses(color, '700'),
      ...generateFocusClasses(color, '500'),
    ],
    preview: { backgroundColor: `var(--color-${color}-600)` },
  };
}

const buttonColors: Record<ColorVariant, VariantDefinition> = {} as Record<ColorVariant, VariantDefinition>;
for (const color of VARIANT_COLORS) {
  buttonColors[color] = generateButtonColorVariant(color);
}

// ============================================================================
// STYLE DEFINITIONS
// ============================================================================

const buttonStyles: Record<string, VariantDefinition> = {
  solid: {
    name: 'Solid',
    description: 'Filled background button',
    classes: ['font-medium'],
  },
  outline: {
    name: 'Outline',
    description: 'Bordered button with transparent background',
    classes: ['bg-transparent', 'border-2', 'font-medium', 'hover:bg-opacity-10'],
  },
  ghost: {
    name: 'Ghost',
    description: 'Minimal button with hover effect',
    classes: ['bg-transparent', 'font-medium', 'hover:bg-gray-100', 'dark:hover:bg-gray-800'],
  },
  link: {
    name: 'Link',
    description: 'Text-only button styled as a link',
    classes: ['bg-transparent', 'underline-offset-4', 'hover:underline', 'p-0', 'h-auto'],
  },
  gradient: {
    name: 'Gradient',
    description: 'Button with gradient background',
    classes: ['bg-gradient-to-r', 'font-semibold', 'text-white', 'shadow-lg', 'hover:shadow-xl'],
  },
  glass: {
    name: 'Glass',
    description: 'Translucent glassmorphism button',
    classes: [
      'backdrop-blur-md', 'bg-white/10', 'border', 'border-white/20',
      'text-white', 'shadow-lg', 'hover:bg-white/20',
    ],
  },
  elevated: {
    name: 'Elevated',
    description: 'Button with prominent shadow',
    classes: ['shadow-md', 'hover:shadow-lg', 'transition-shadow', 'font-medium'],
  },
  flat: {
    name: 'Flat',
    description: 'Button with no shadow',
    classes: ['shadow-none', 'font-medium'],
  },
  soft: {
    name: 'Soft',
    description: 'Button with subtle background',
    classes: ['font-medium'],
  },
  '3d': {
    name: '3D',
    description: 'Button with 3D press effect',
    classes: [
      'font-bold', 'shadow-[0_4px_0_0]', 'translate-y-0',
      'active:translate-y-1', 'active:shadow-none', 'transition-all',
    ],
  },
  pill: {
    name: 'Pill',
    description: 'Fully rounded button',
    classes: ['rounded-full', 'font-medium'],
  },
  square: {
    name: 'Square',
    description: 'Square button with no rounded corners',
    classes: ['rounded-none', 'font-medium'],
  },
  rounded: {
    name: 'Rounded',
    description: 'Button with standard rounded corners',
    classes: ['rounded-lg', 'font-medium'],
  },
  'icon-left': {
    name: 'Icon Left',
    description: 'Button with icon on the left',
    classes: ['inline-flex', 'items-center', 'gap-2', 'font-medium'],
  },
  'icon-right': {
    name: 'Icon Right',
    description: 'Button with icon on the right',
    classes: ['inline-flex', 'items-center', 'gap-2', 'flex-row-reverse', 'font-medium'],
  },
  'icon-only': {
    name: 'Icon Only',
    description: 'Square button with icon only',
    classes: ['aspect-square', 'p-2', 'flex', 'items-center', 'justify-center'],
  },
};

// ============================================================================
// STATE DEFINITIONS
// ============================================================================

const buttonStates: Record<StateVariant, VariantDefinition> = {
  default: {
    name: 'Default',
    description: 'Normal button state',
    classes: ['cursor-pointer'],
  },
  hover: {
    name: 'Hover',
    description: 'Hover state preview',
    classes: ['opacity-90'],
  },
  active: {
    name: 'Active',
    description: 'Pressed/active state',
    classes: ['scale-[0.98]', 'opacity-95'],
  },
  focus: {
    name: 'Focus',
    description: 'Focused state with ring',
    classes: ['ring-2', 'ring-offset-2'],
  },
  disabled: {
    name: 'Disabled',
    description: 'Disabled button state',
    classes: ['opacity-50', 'cursor-not-allowed', 'pointer-events-none'],
  },
  loading: {
    name: 'Loading',
    description: 'Loading state with spinner',
    classes: ['opacity-70', 'cursor-wait', 'pointer-events-none'],
  },
  success: {
    name: 'Success',
    description: 'Success feedback state',
    classes: ['bg-green-600', 'hover:bg-green-700', 'text-white'],
  },
  error: {
    name: 'Error',
    description: 'Error feedback state',
    classes: ['bg-red-600', 'hover:bg-red-700', 'text-white'],
  },
  warning: {
    name: 'Warning',
    description: 'Warning feedback state',
    classes: ['bg-amber-500', 'hover:bg-amber-600', 'text-white'],
  },
  info: {
    name: 'Info',
    description: 'Info feedback state',
    classes: ['bg-blue-500', 'hover:bg-blue-600', 'text-white'],
  },
};

// ============================================================================
// COMPOUND VARIANTS
// ============================================================================

const buttonCompoundVariants: CompoundVariant[] = [
  // Outline color combinations
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').map(color => ({
    conditions: { style: 'outline' as StyleVariant, color: color as ColorVariant },
    classes: [
      `border-${color}-600`,
      `text-${color}-600`,
      `hover:bg-${color}-50`,
      `hover:text-${color}-700`,
    ],
    priority: 10,
  })),

  // Ghost color combinations
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').map(color => ({
    conditions: { style: 'ghost' as StyleVariant, color: color as ColorVariant },
    classes: [
      `text-${color}-600`,
      `hover:bg-${color}-50`,
      `hover:text-${color}-700`,
    ],
    priority: 10,
  })),

  // Link color combinations
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').map(color => ({
    conditions: { style: 'link' as StyleVariant, color: color as ColorVariant },
    classes: [
      `text-${color}-600`,
      `hover:text-${color}-700`,
    ],
    priority: 10,
  })),

  // Soft color combinations
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').map(color => ({
    conditions: { style: 'soft' as StyleVariant, color: color as ColorVariant },
    classes: [
      `bg-${color}-100`,
      `text-${color}-700`,
      `hover:bg-${color}-200`,
    ],
    priority: 10,
  })),

  // Gradient combinations
  {
    conditions: { style: 'gradient' as StyleVariant, color: 'blue' as ColorVariant },
    classes: ['from-blue-500', 'to-blue-700'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient' as StyleVariant, color: 'purple' as ColorVariant },
    classes: ['from-purple-500', 'to-purple-700'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient' as StyleVariant, color: 'pink' as ColorVariant },
    classes: ['from-pink-500', 'to-rose-500'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient' as StyleVariant, color: 'green' as ColorVariant },
    classes: ['from-green-500', 'to-emerald-600'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient' as StyleVariant, color: 'orange' as ColorVariant },
    classes: ['from-orange-500', 'to-red-500'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient' as StyleVariant, color: 'cyan' as ColorVariant },
    classes: ['from-cyan-400', 'to-blue-500'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient' as StyleVariant, color: 'indigo' as ColorVariant },
    classes: ['from-indigo-500', 'via-purple-500', 'to-pink-500'],
    priority: 10,
  },

  // Size + Style combinations
  {
    conditions: { size: 'xs', style: 'pill' as StyleVariant },
    classes: ['px-3'],
    priority: 5,
  },
  {
    conditions: { size: 'xl', style: 'pill' as StyleVariant },
    classes: ['px-10'],
    priority: 5,
  },

  // 3D button color combinations
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').map(color => ({
    conditions: { style: '3d' as StyleVariant, color: color as ColorVariant },
    classes: [`shadow-${color}-800`],
    priority: 10,
  })),

  // Icon-only size adjustments
  {
    conditions: { size: 'xs', style: 'icon-only' as StyleVariant },
    classes: ['w-6', 'h-6'],
    priority: 5,
  },
  {
    conditions: { size: 'sm', style: 'icon-only' as StyleVariant },
    classes: ['w-8', 'h-8'],
    priority: 5,
  },
  {
    conditions: { size: 'md', style: 'icon-only' as StyleVariant },
    classes: ['w-10', 'h-10'],
    priority: 5,
  },
  {
    conditions: { size: 'lg', style: 'icon-only' as StyleVariant },
    classes: ['w-12', 'h-12'],
    priority: 5,
  },
  {
    conditions: { size: 'xl', style: 'icon-only' as StyleVariant },
    classes: ['w-14', 'h-14'],
    priority: 5,
  },
];

// ============================================================================
// BUTTON VARIANT SCHEMA
// ============================================================================

export const buttonVariantSchema: ComponentVariantSchema = {
  componentType: 'button',
  displayName: 'Button',
  category: 'buttons',
  baseClasses: [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-md',
    'transition-all',
    'duration-200',
  ],
  sizes: buttonSizes,
  colors: buttonColors,
  styles: buttonStyles,
  states: buttonStates,
  compoundVariants: buttonCompoundVariants,
  defaultVariant: {
    size: 'md',
    color: 'blue',
    style: 'solid',
    state: 'default',
  },
};

// ============================================================================
// PRESET BUTTON VARIANTS
// ============================================================================

export const buttonPresets = {
  // Primary buttons
  primarySolid: { size: 'md', color: 'blue', style: 'solid', state: 'default' },
  primaryOutline: { size: 'md', color: 'blue', style: 'outline', state: 'default' },
  primaryGhost: { size: 'md', color: 'blue', style: 'ghost', state: 'default' },
  primaryGradient: { size: 'md', color: 'blue', style: 'gradient', state: 'default' },

  // Secondary buttons
  secondarySolid: { size: 'md', color: 'gray', style: 'solid', state: 'default' },
  secondaryOutline: { size: 'md', color: 'gray', style: 'outline', state: 'default' },
  secondaryGhost: { size: 'md', color: 'gray', style: 'ghost', state: 'default' },

  // Danger buttons
  dangerSolid: { size: 'md', color: 'red', style: 'solid', state: 'default' },
  dangerOutline: { size: 'md', color: 'red', style: 'outline', state: 'default' },
  dangerGhost: { size: 'md', color: 'red', style: 'ghost', state: 'default' },

  // Success buttons
  successSolid: { size: 'md', color: 'green', style: 'solid', state: 'default' },
  successOutline: { size: 'md', color: 'green', style: 'outline', state: 'default' },

  // Warning buttons
  warningSolid: { size: 'md', color: 'amber', style: 'solid', state: 'default' },
  warningOutline: { size: 'md', color: 'amber', style: 'outline', state: 'default' },

  // Special styles
  glassDark: { size: 'md', color: 'white', style: 'glass', state: 'default' },
  pill: { size: 'md', color: 'blue', style: 'pill', state: 'default' },
  threeDimensional: { size: 'md', color: 'blue', style: '3d', state: 'default' },

  // Sizes
  tiny: { size: 'xs', color: 'blue', style: 'solid', state: 'default' },
  small: { size: 'sm', color: 'blue', style: 'solid', state: 'default' },
  medium: { size: 'md', color: 'blue', style: 'solid', state: 'default' },
  large: { size: 'lg', color: 'blue', style: 'solid', state: 'default' },
  extraLarge: { size: 'xl', color: 'blue', style: 'solid', state: 'default' },
  huge: { size: '2xl', color: 'blue', style: 'solid', state: 'default' },

  // Icon buttons
  iconPrimary: { size: 'md', color: 'blue', style: 'icon-only', state: 'default' },
  iconSecondary: { size: 'md', color: 'gray', style: 'icon-only', state: 'default' },
  iconGhost: { size: 'md', color: 'gray', style: 'ghost', state: 'default' },
} as const;

// ============================================================================
// REGISTRATION
// ============================================================================

registerVariantSchema(buttonVariantSchema);

// Register variants for specific button types
const buttonTypes = [
  'primary-button',
  'secondary-button',
  'outline-button',
  'ghost-button',
  'icon-button',
  'loading-button',
  'gradient-button',
];

for (const type of buttonTypes) {
  registerVariantSchema({
    ...buttonVariantSchema,
    componentType: type,
    displayName: type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  });
}

export { buttonSizes, buttonColors, buttonStyles, buttonStates, buttonCompoundVariants };
