/**
 * Variant System - Core variant management for component customization
 *
 * This module provides a comprehensive type-safe system for defining,
 * combining, and applying component variants with intelligent defaults.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Base variant types supported by the system
 */
export type VariantType = 'size' | 'color' | 'style' | 'state' | 'layout';

/**
 * Size variants from extra-small to extra-large
 */
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Color variants based on Tailwind color palette
 */
export type ColorVariant =
  | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime'
  | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky'
  | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia'
  | 'pink' | 'rose' | 'white' | 'black';

/**
 * Color intensity levels
 */
export type ColorIntensity = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';

/**
 * Style variants for different visual treatments
 */
export type StyleVariant =
  | 'solid' | 'outline' | 'ghost' | 'link' | 'gradient'
  | 'glass' | 'elevated' | 'flat' | 'bordered' | 'filled'
  | 'soft' | 'surface' | 'inverse' | 'notification'
  | 'interactive' | 'interactive-lift' | 'interactive-glow'
  | 'pricing' | 'pricing-featured' | 'outlined' | 'dark-mode'
  | 'feature' | 'testimonial' | 'profile' | 'product' | 'blog'
  | 'metric' | 'horizontal' | 'compact'
  | 'underlined' | 'pill' | 'search' | 'default' | 'floating'
  | 'icon-left' | 'icon-right' | 'icon-both'
  | 'addon-left' | 'addon-right' | 'addon-both'
  // Navigation styles
  | 'tabs-pills' | 'mega-menu' | 'transparent' | 'glass-dark' | 'sticky' | 'dark'
  | 'tabs' | 'tabs-underline' | 'tabs-boxed' | 'dropdown'
  | 'breadcrumb' | 'breadcrumb-arrows'
  | 'pagination' | 'pagination-simple' | 'pagination-rounded'
  | 'sidebar' | 'sidebar-dark' | 'sidebar-compact'
  // Text styles
  | 'glow' | 'heading' | 'subheading' | 'display' | 'display-light'
  | 'body' | 'caption' | 'label' | 'overline' | 'shadow'
  | 'serif' | 'mono' | 'italic' | 'underline' | 'strikethrough'
  // Button styles
  | '3d' | 'icon-only'
  // Section styles
  | 'hero-split' | 'cta-card' | 'stats-highlight';

/**
 * State variants for interactive elements
 */
export type StateVariant =
  | 'default' | 'hover' | 'active' | 'focus' | 'disabled'
  | 'loading' | 'success' | 'error' | 'warning' | 'info';

/**
 * Layout variants for positioning and arrangement
 */
export type LayoutVariant =
  | 'horizontal' | 'vertical' | 'stacked' | 'inline'
  | 'centered' | 'left' | 'right' | 'full-width' | 'contained'
  | 'split' | 'overlapping' | 'floating';

/**
 * Complete variant configuration for a component
 */
export interface VariantConfig {
  size?: SizeVariant;
  color?: ColorVariant;
  colorIntensity?: ColorIntensity;
  style?: StyleVariant;
  state?: StateVariant;
  layout?: LayoutVariant;
  custom?: Record<string, string>;
}

/**
 * Definition of a single variant option
 */
export interface VariantDefinition {
  name: string;
  description?: string;
  classes: string[];
  preview?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };
}

/**
 * Compound variant for combining multiple variant types
 */
export interface CompoundVariant {
  conditions: Partial<VariantConfig>;
  classes: string[];
  priority?: number;
}

/**
 * Complete variant schema for a component type
 */
export interface ComponentVariantSchema {
  componentType: string;
  displayName: string;
  category: string;
  baseClasses: string[];
  sizes: Record<SizeVariant, VariantDefinition>;
  colors: Record<ColorVariant, VariantDefinition>;
  styles: Record<string, VariantDefinition>;
  states: Record<StateVariant, VariantDefinition>;
  layouts?: Record<string, VariantDefinition>;
  compoundVariants?: CompoundVariant[];
  defaultVariant: VariantConfig;
}

/**
 * Custom variant definition for user-created variants
 */
export interface CustomVariant {
  id: string;
  name: string;
  componentType: string;
  config: VariantConfig;
  classes: string[];
  createdAt: number;
  updatedAt: number;
  isFavorite?: boolean;
}

/**
 * Variant inheritance configuration
 */
export interface VariantInheritance {
  parentType: string;
  overrides?: Partial<ComponentVariantSchema>;
  extensions?: Partial<ComponentVariantSchema>;
}

// ============================================================================
// VARIANT REGISTRY
// ============================================================================

/**
 * Central registry for all component variant schemas
 */
const variantRegistry: Map<string, ComponentVariantSchema> = new Map();

/**
 * Custom variants storage
 */
const customVariants: Map<string, CustomVariant> = new Map();

/**
 * Variant inheritance map
 */
const inheritanceMap: Map<string, VariantInheritance> = new Map();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generates color classes with intensity
 */
export function generateColorClasses(
  color: ColorVariant,
  intensity: ColorIntensity = '500',
  prefix: 'bg' | 'text' | 'border' = 'bg'
): string {
  if (color === 'white') return `${prefix}-white`;
  if (color === 'black') return `${prefix}-black`;
  return `${prefix}-${color}-${intensity}`;
}

/**
 * Generates hover state classes
 */
export function generateHoverClasses(
  color: ColorVariant,
  intensity: ColorIntensity = '600'
): string {
  if (color === 'white') return 'hover:bg-gray-100';
  if (color === 'black') return 'hover:bg-gray-900';
  return `hover:bg-${color}-${intensity}`;
}

/**
 * Generates focus ring classes
 */
export function generateFocusClasses(
  color: ColorVariant,
  intensity: ColorIntensity = '500'
): string[] {
  return [
    'focus:outline-none',
    'focus:ring-2',
    `focus:ring-${color}-${intensity}`,
    'focus:ring-offset-2',
  ];
}

/**
 * Merges multiple class arrays, removing duplicates
 */
export function mergeClasses(...classArrays: (string | string[] | undefined)[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const classes of classArrays) {
    if (!classes) continue;
    const arr = Array.isArray(classes) ? classes : [classes];
    for (const cls of arr) {
      if (cls && !seen.has(cls)) {
        seen.add(cls);
        result.push(cls);
      }
    }
  }

  return result;
}

/**
 * Resolves conflicting Tailwind classes (e.g., p-2 vs p-4)
 */
export function resolveConflicts(classes: string[]): string[] {
  const prefixMap = new Map<string, string>();
  const result: string[] = [];

  // Prefixes that should be deduplicated
  const conflictPrefixes = [
    'p-', 'px-', 'py-', 'pt-', 'pr-', 'pb-', 'pl-',
    'm-', 'mx-', 'my-', 'mt-', 'mr-', 'mb-', 'ml-',
    'w-', 'h-', 'min-w-', 'max-w-', 'min-h-', 'max-h-',
    'text-', 'font-', 'leading-', 'tracking-',
    'bg-', 'border-', 'rounded-', 'shadow-', 'opacity-',
    'gap-', 'space-x-', 'space-y-',
    'flex-', 'grid-cols-', 'justify-', 'items-', 'content-',
  ];

  for (const cls of classes) {
    let isConflict = false;
    for (const prefix of conflictPrefixes) {
      if (cls.startsWith(prefix) || cls.startsWith(`hover:${prefix}`) || cls.startsWith(`focus:${prefix}`)) {
        const key = cls.includes(':') ? cls.substring(0, cls.lastIndexOf(':') + 1) + prefix : prefix;
        prefixMap.set(key, cls);
        isConflict = true;
        break;
      }
    }
    if (!isConflict) {
      result.push(cls);
    }
  }

  return [...result, ...Array.from(prefixMap.values())];
}

// ============================================================================
// VARIANT SYSTEM CORE
// ============================================================================

/**
 * Registers a component variant schema
 */
export function registerVariantSchema(schema: ComponentVariantSchema): void {
  variantRegistry.set(schema.componentType, schema);
}

/**
 * Gets a variant schema by component type
 */
export function getVariantSchema(componentType: string): ComponentVariantSchema | undefined {
  return variantRegistry.get(componentType);
}

/**
 * Gets all registered variant schemas
 */
export function getAllVariantSchemas(): ComponentVariantSchema[] {
  return Array.from(variantRegistry.values());
}

/**
 * Registers variant inheritance
 */
export function registerInheritance(
  childType: string,
  inheritance: VariantInheritance
): void {
  inheritanceMap.set(childType, inheritance);
}

/**
 * Resolves inherited variant schema
 */
export function resolveInheritedSchema(
  componentType: string
): ComponentVariantSchema | undefined {
  const baseSchema = variantRegistry.get(componentType);
  if (baseSchema) return baseSchema;

  const inheritance = inheritanceMap.get(componentType);
  if (!inheritance) return undefined;

  const parentSchema = variantRegistry.get(inheritance.parentType);
  if (!parentSchema) return undefined;

  // Merge parent with overrides and extensions
  const resolvedSchema: ComponentVariantSchema = {
    ...parentSchema,
    componentType,
    ...inheritance.overrides,
    sizes: { ...parentSchema.sizes, ...inheritance.extensions?.sizes },
    colors: { ...parentSchema.colors, ...inheritance.extensions?.colors },
    styles: { ...parentSchema.styles, ...inheritance.extensions?.styles },
    states: { ...parentSchema.states, ...inheritance.extensions?.states },
    compoundVariants: [
      ...(parentSchema.compoundVariants || []),
      ...(inheritance.extensions?.compoundVariants || []),
    ],
  };

  return resolvedSchema;
}

/**
 * Generates classes for a specific variant configuration
 */
export function generateVariantClasses(
  componentType: string,
  config: VariantConfig
): string[] {
  const schema = resolveInheritedSchema(componentType);
  if (!schema) {
    console.warn(`No variant schema found for component type: ${componentType}`);
    return [];
  }

  const classes: string[] = [...schema.baseClasses];

  // Apply size variant
  if (config.size && schema.sizes[config.size]) {
    classes.push(...schema.sizes[config.size].classes);
  }

  // Apply color variant
  if (config.color && schema.colors[config.color]) {
    classes.push(...schema.colors[config.color].classes);
  }

  // Apply style variant
  if (config.style && schema.styles[config.style]) {
    classes.push(...schema.styles[config.style].classes);
  }

  // Apply state variant
  if (config.state && schema.states[config.state]) {
    classes.push(...schema.states[config.state].classes);
  }

  // Apply layout variant
  if (config.layout && schema.layouts?.[config.layout]) {
    classes.push(...schema.layouts[config.layout].classes);
  }

  // Apply compound variants
  if (schema.compoundVariants) {
    const matchingCompounds = schema.compoundVariants
      .filter(cv => matchesCompoundConditions(config, cv.conditions))
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    for (const compound of matchingCompounds) {
      classes.push(...compound.classes);
    }
  }

  // Apply custom classes
  if (config.custom) {
    classes.push(...Object.values(config.custom));
  }

  return resolveConflicts(classes);
}

/**
 * Checks if a config matches compound variant conditions
 */
function matchesCompoundConditions(
  config: VariantConfig,
  conditions: Partial<VariantConfig>
): boolean {
  for (const [key, value] of Object.entries(conditions)) {
    if (config[key as keyof VariantConfig] !== value) {
      return false;
    }
  }
  return true;
}

/**
 * Gets the default variant config for a component type
 */
export function getDefaultVariant(componentType: string): VariantConfig {
  const schema = resolveInheritedSchema(componentType);
  return schema?.defaultVariant || { size: 'md', style: 'solid', state: 'default' };
}

// ============================================================================
// CUSTOM VARIANT MANAGEMENT
// ============================================================================

/**
 * Creates a custom variant
 */
export function createCustomVariant(
  name: string,
  componentType: string,
  config: VariantConfig,
  classes?: string[]
): CustomVariant {
  const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const resolvedClasses = classes || generateVariantClasses(componentType, config);

  const customVariant: CustomVariant = {
    id,
    name,
    componentType,
    config,
    classes: resolvedClasses,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  customVariants.set(id, customVariant);
  return customVariant;
}

/**
 * Updates an existing custom variant
 */
export function updateCustomVariant(
  id: string,
  updates: Partial<Omit<CustomVariant, 'id' | 'createdAt'>>
): CustomVariant | undefined {
  const existing = customVariants.get(id);
  if (!existing) return undefined;

  const updated: CustomVariant = {
    ...existing,
    ...updates,
    updatedAt: Date.now(),
  };

  customVariants.set(id, updated);
  return updated;
}

/**
 * Deletes a custom variant
 */
export function deleteCustomVariant(id: string): boolean {
  return customVariants.delete(id);
}

/**
 * Gets a custom variant by ID
 */
export function getCustomVariant(id: string): CustomVariant | undefined {
  return customVariants.get(id);
}

/**
 * Gets all custom variants for a component type
 */
export function getCustomVariantsForComponent(
  componentType: string
): CustomVariant[] {
  return Array.from(customVariants.values()).filter(
    cv => cv.componentType === componentType
  );
}

/**
 * Gets all favorite custom variants
 */
export function getFavoriteVariants(): CustomVariant[] {
  return Array.from(customVariants.values()).filter(cv => cv.isFavorite);
}

/**
 * Toggles favorite status for a custom variant
 */
export function toggleFavoriteVariant(id: string): CustomVariant | undefined {
  const variant = customVariants.get(id);
  if (!variant) return undefined;

  return updateCustomVariant(id, { isFavorite: !variant.isFavorite });
}

// ============================================================================
// VARIANT BUILDER
// ============================================================================

/**
 * Builder class for creating variant configurations fluently
 */
export class VariantBuilder {
  private config: VariantConfig = {};
  private componentType: string;

  constructor(componentType: string) {
    this.componentType = componentType;
    this.config = { ...getDefaultVariant(componentType) };
  }

  size(size: SizeVariant): this {
    this.config.size = size;
    return this;
  }

  color(color: ColorVariant, intensity?: ColorIntensity): this {
    this.config.color = color;
    if (intensity) {
      this.config.colorIntensity = intensity;
    }
    return this;
  }

  style(style: StyleVariant): this {
    this.config.style = style;
    return this;
  }

  state(state: StateVariant): this {
    this.config.state = state;
    return this;
  }

  layout(layout: LayoutVariant): this {
    this.config.layout = layout;
    return this;
  }

  custom(key: string, value: string): this {
    if (!this.config.custom) {
      this.config.custom = {};
    }
    this.config.custom[key] = value;
    return this;
  }

  getConfig(): VariantConfig {
    return { ...this.config };
  }

  getClasses(): string[] {
    return generateVariantClasses(this.componentType, this.config);
  }

  getClassString(): string {
    return this.getClasses().join(' ');
  }

  reset(): this {
    this.config = { ...getDefaultVariant(this.componentType) };
    return this;
  }

  clone(): VariantBuilder {
    const builder = new VariantBuilder(this.componentType);
    builder.config = { ...this.config };
    return builder;
  }
}

/**
 * Factory function to create a variant builder
 */
export function createVariant(componentType: string): VariantBuilder {
  return new VariantBuilder(componentType);
}

// ============================================================================
// SERIALIZATION
// ============================================================================

/**
 * Serializes custom variants for storage
 */
export function serializeCustomVariants(): string {
  const variants = Array.from(customVariants.values());
  return JSON.stringify(variants);
}

/**
 * Loads custom variants from storage
 */
export function loadCustomVariants(serialized: string): void {
  try {
    const variants = JSON.parse(serialized) as CustomVariant[];
    for (const variant of variants) {
      customVariants.set(variant.id, variant);
    }
  } catch (error) {
    console.error('Failed to load custom variants:', error);
  }
}

/**
 * Clears all custom variants
 */
export function clearCustomVariants(): void {
  customVariants.clear();
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

export const VARIANT_SIZES: SizeVariant[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

export const VARIANT_COLORS: ColorVariant[] = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime',
  'green', 'emerald', 'teal', 'cyan', 'sky',
  'blue', 'indigo', 'violet', 'purple', 'fuchsia',
  'pink', 'rose', 'white', 'black',
];

export const VARIANT_STYLES: StyleVariant[] = [
  'solid', 'outline', 'ghost', 'link', 'gradient',
  'glass', 'elevated', 'flat', 'bordered', 'filled',
  'soft', 'surface', 'inverse',
];

export const VARIANT_STATES: StateVariant[] = [
  'default', 'hover', 'active', 'focus', 'disabled',
  'loading', 'success', 'error', 'warning', 'info',
];

export const VARIANT_LAYOUTS: LayoutVariant[] = [
  'horizontal', 'vertical', 'stacked', 'inline',
  'centered', 'left', 'right', 'full-width', 'contained',
  'split', 'overlapping', 'floating',
];

export const COLOR_INTENSITIES: ColorIntensity[] = [
  '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950',
];
