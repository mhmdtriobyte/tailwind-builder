/**
 * Customization System Types
 *
 * Types for themes, animations, variants, accessibility, performance,
 * and advanced styling features.
 */

// ============================================================================
// THEME TYPES
// ============================================================================

export interface ThemeColor {
  name: string;
  value: string;
  shade?: number;
}

export interface ThemePalette {
  primary: ThemeColor[];
  secondary: ThemeColor[];
  accent: ThemeColor[];
  neutral: ThemeColor[];
  success: ThemeColor[];
  warning: ThemeColor[];
  error: ThemeColor[];
  info: ThemeColor[];
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  mode: 'light' | 'dark';
  palette: ThemePalette;
  borderRadius: string;
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
  };
  spacing: {
    unit: number;
    scale: number[];
  };
  shadows: Record<string, string>;
}

export interface ThemePreset {
  id: string;
  name: string;
  preview: string;
  config: ThemeConfig;
}

// ============================================================================
// ANIMATION TYPES
// ============================================================================

export type EasingFunction =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'cubic-bezier';

export interface AnimationKeyframe {
  offset: number;
  properties: Record<string, string>;
}

export interface AnimationConfig {
  name: string;
  duration: number;
  delay: number;
  easing: EasingFunction;
  iterations: number | 'infinite';
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
  keyframes: AnimationKeyframe[];
}

export interface AnimationPreset {
  id: string;
  name: string;
  category: 'entrance' | 'exit' | 'attention' | 'loop';
  config: AnimationConfig;
  preview?: string;
}

export type TransitionProperty =
  | 'all'
  | 'colors'
  | 'opacity'
  | 'shadow'
  | 'transform'
  | 'none';

export interface TransitionConfig {
  property: TransitionProperty;
  duration: number;
  easing: EasingFunction;
  delay: number;
}

// ============================================================================
// VARIANT TYPES
// ============================================================================

export type ElementState =
  | 'default'
  | 'hover'
  | 'focus'
  | 'active'
  | 'disabled'
  | 'loading'
  | 'error'
  | 'success';

export interface StateStyles {
  state: ElementState;
  classes: string[];
}

export interface VariantConfig {
  id: string;
  name: string;
  description: string;
  baseClasses: string[];
  states: StateStyles[];
}

export interface ComponentVariant {
  componentType: string;
  variants: VariantConfig[];
}

// ============================================================================
// RESPONSIVE TYPES
// ============================================================================

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface BreakpointConfig {
  name: Breakpoint;
  minWidth: number;
  label: string;
  icon: string;
}

export interface ResponsiveValue<T> {
  default: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

export interface ResponsiveStyles {
  display?: ResponsiveValue<string>;
  width?: ResponsiveValue<string>;
  height?: ResponsiveValue<string>;
  padding?: ResponsiveValue<string>;
  margin?: ResponsiveValue<string>;
  fontSize?: ResponsiveValue<string>;
  flexDirection?: ResponsiveValue<string>;
  gridCols?: ResponsiveValue<string>;
  gap?: ResponsiveValue<string>;
  hidden?: ResponsiveValue<boolean>;
}

// ============================================================================
// ACCESSIBILITY TYPES
// ============================================================================

export interface AccessibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  element: string;
  message: string;
  fix: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  wcagCriteria: string;
}

export interface AccessibilityReport {
  score: number;
  issues: AccessibilityIssue[];
  passed: string[];
  timestamp: number;
}

export interface AriaAttributes {
  role?: string;
  ariaLabel?: string;
  ariaDescribedby?: string;
  ariaLabelledby?: string;
  ariaHidden?: boolean;
  ariaExpanded?: boolean;
  ariaSelected?: boolean;
  ariaDisabled?: boolean;
  ariaLive?: 'off' | 'polite' | 'assertive';
  ariaAtomic?: boolean;
  tabIndex?: number;
}

// ============================================================================
// PERFORMANCE TYPES
// ============================================================================

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'needs-improvement' | 'poor';
  threshold: {
    good: number;
    poor: number;
  };
}

export interface PerformanceReport {
  score: number;
  metrics: PerformanceMetric[];
  suggestions: string[];
  timestamp: number;
}

export interface CodeOptimization {
  id: string;
  type: 'css' | 'html' | 'accessibility';
  description: string;
  before: string;
  after: string;
  impact: 'high' | 'medium' | 'low';
}

// ============================================================================
// DESIGN TOKEN TYPES
// ============================================================================

export interface DesignToken {
  id: string;
  name: string;
  category: 'color' | 'spacing' | 'typography' | 'shadow' | 'border' | 'animation';
  value: string;
  description?: string;
  cssVariable?: string;
}

export interface TokenGroup {
  id: string;
  name: string;
  tokens: DesignToken[];
}

export interface TokenSystem {
  name: string;
  groups: TokenGroup[];
}

// ============================================================================
// TEMPLATE TYPES
// ============================================================================

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  tags: string[];
  elements: unknown[];
  createdAt: string;
  updatedAt: string;
  author?: string;
  downloads?: number;
  rating?: number;
}

// ============================================================================
// SETTINGS TYPES
// ============================================================================

export interface GridSettings {
  enabled: boolean;
  size: number;
  color: string;
  opacity: number;
  snap: boolean;
  snapThreshold: number;
}

export interface AutosaveSettings {
  enabled: boolean;
  interval: number;
  maxSnapshots: number;
}

export interface ExportSettings {
  defaultFormat: 'jsx' | 'tsx';
  includeComments: boolean;
  minify: boolean;
  componentPrefix: string;
}

export interface KeyboardShortcut {
  id: string;
  action: string;
  keys: string[];
  description: string;
  category: 'general' | 'edit' | 'view' | 'export';
}

export interface ProjectSettings {
  name: string;
  description: string;
  defaultTheme: string;
  grid: GridSettings;
  autosave: AutosaveSettings;
  export: ExportSettings;
  shortcuts: KeyboardShortcut[];
}

// ============================================================================
// ADVANCED STYLE TYPES
// ============================================================================

export interface GradientStop {
  color: string;
  position: number;
}

export interface GradientConfig {
  type: 'linear' | 'radial' | 'conic';
  angle?: number;
  stops: GradientStop[];
}

export interface FilterConfig {
  blur?: number;
  brightness?: number;
  contrast?: number;
  grayscale?: number;
  hueRotate?: number;
  invert?: number;
  saturate?: number;
  sepia?: number;
  dropShadow?: string;
}

export interface TransformConfig {
  translateX?: string;
  translateY?: string;
  rotate?: string;
  scaleX?: number;
  scaleY?: number;
  skewX?: string;
  skewY?: string;
  origin?: string;
}

export interface AdvancedStyleConfig {
  gradient?: GradientConfig;
  filter?: FilterConfig;
  transform?: TransformConfig;
  backdropFilter?: FilterConfig;
  mixBlendMode?: string;
  isolation?: boolean;
}
