/**
 * Design Tokens System
 *
 * A comprehensive token-based design system for ultimate customization.
 * Supports primitives, semantics, and multiple output formats.
 */

// =============================================================================
// TOKEN VALUE TYPES
// =============================================================================

export type TokenValueType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'fontSize'
  | 'lineHeight'
  | 'letterSpacing'
  | 'spacing'
  | 'borderWidth'
  | 'borderRadius'
  | 'shadow'
  | 'opacity'
  | 'duration'
  | 'easing'
  | 'zIndex'
  | 'breakpoint'
  | 'number'
  | 'string';

export type TokenCategory =
  | 'color'
  | 'typography'
  | 'spacing'
  | 'border'
  | 'shadow'
  | 'animation'
  | 'zIndex'
  | 'breakpoint'
  | 'opacity';

export type TokenTier = 'primitive' | 'semantic' | 'component';

export type TokenFormat =
  | 'css'
  | 'scss'
  | 'json'
  | 'js'
  | 'ts'
  | 'figma'
  | 'tailwind'
  | 'ios'
  | 'android';

export type ColorScheme = 'light' | 'dark';

// =============================================================================
// TOKEN INTERFACES
// =============================================================================

export interface TokenMetadata {
  description?: string;
  deprecated?: boolean;
  deprecatedMessage?: string;
  group?: string;
  tags?: string[];
  source?: 'figma' | 'user' | 'system' | 'imported';
  createdAt?: string;
  updatedAt?: string;
}

export interface TokenValue {
  value: string | number;
  darkValue?: string | number;
}

export interface DesignToken {
  id: string;
  name: string;
  path: string[];
  category: TokenCategory;
  tier: TokenTier;
  type: TokenValueType;
  value: TokenValue;
  reference?: string;
  metadata?: TokenMetadata;
}

export interface TokenGroup {
  id: string;
  name: string;
  path: string[];
  tokens: DesignToken[];
  children: TokenGroup[];
}

export interface TokenCollection {
  id: string;
  name: string;
  version: string;
  description?: string;
  tokens: DesignToken[];
  groups: TokenGroup[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    author?: string;
  };
}

// =============================================================================
// COLOR TOKENS - PRIMITIVES
// =============================================================================

export const primitiveColorTokens: DesignToken[] = [
  // Grayscale
  { id: 'color-white', name: 'white', path: ['color', 'primitive'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#ffffff' } },
  { id: 'color-black', name: 'black', path: ['color', 'primitive'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#000000' } },

  // Gray Scale
  { id: 'color-gray-50', name: 'gray-50', path: ['color', 'primitive', 'gray'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#f9fafb' } },
  { id: 'color-gray-100', name: 'gray-100', path: ['color', 'primitive', 'gray'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#f3f4f6' } },
  { id: 'color-gray-200', name: 'gray-200', path: ['color', 'primitive', 'gray'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#e5e7eb' } },
  { id: 'color-gray-300', name: 'gray-300', path: ['color', 'primitive', 'gray'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#d1d5db' } },
  { id: 'color-gray-400', name: 'gray-400', path: ['color', 'primitive', 'gray'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#9ca3af' } },
  { id: 'color-gray-500', name: 'gray-500', path: ['color', 'primitive', 'gray'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#6b7280' } },
  { id: 'color-gray-600', name: 'gray-600', path: ['color', 'primitive', 'gray'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#4b5563' } },
  { id: 'color-gray-700', name: 'gray-700', path: ['color', 'primitive', 'gray'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#374151' } },
  { id: 'color-gray-800', name: 'gray-800', path: ['color', 'primitive', 'gray'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#1f2937' } },
  { id: 'color-gray-900', name: 'gray-900', path: ['color', 'primitive', 'gray'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#111827' } },
  { id: 'color-gray-950', name: 'gray-950', path: ['color', 'primitive', 'gray'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#030712' } },

  // Blue Scale
  { id: 'color-blue-50', name: 'blue-50', path: ['color', 'primitive', 'blue'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#eff6ff' } },
  { id: 'color-blue-100', name: 'blue-100', path: ['color', 'primitive', 'blue'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#dbeafe' } },
  { id: 'color-blue-200', name: 'blue-200', path: ['color', 'primitive', 'blue'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#bfdbfe' } },
  { id: 'color-blue-300', name: 'blue-300', path: ['color', 'primitive', 'blue'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#93c5fd' } },
  { id: 'color-blue-400', name: 'blue-400', path: ['color', 'primitive', 'blue'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#60a5fa' } },
  { id: 'color-blue-500', name: 'blue-500', path: ['color', 'primitive', 'blue'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#3b82f6' } },
  { id: 'color-blue-600', name: 'blue-600', path: ['color', 'primitive', 'blue'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#2563eb' } },
  { id: 'color-blue-700', name: 'blue-700', path: ['color', 'primitive', 'blue'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#1d4ed8' } },
  { id: 'color-blue-800', name: 'blue-800', path: ['color', 'primitive', 'blue'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#1e40af' } },
  { id: 'color-blue-900', name: 'blue-900', path: ['color', 'primitive', 'blue'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#1e3a8a' } },

  // Red Scale
  { id: 'color-red-50', name: 'red-50', path: ['color', 'primitive', 'red'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#fef2f2' } },
  { id: 'color-red-100', name: 'red-100', path: ['color', 'primitive', 'red'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#fee2e2' } },
  { id: 'color-red-200', name: 'red-200', path: ['color', 'primitive', 'red'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#fecaca' } },
  { id: 'color-red-300', name: 'red-300', path: ['color', 'primitive', 'red'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#fca5a5' } },
  { id: 'color-red-400', name: 'red-400', path: ['color', 'primitive', 'red'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#f87171' } },
  { id: 'color-red-500', name: 'red-500', path: ['color', 'primitive', 'red'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#ef4444' } },
  { id: 'color-red-600', name: 'red-600', path: ['color', 'primitive', 'red'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#dc2626' } },
  { id: 'color-red-700', name: 'red-700', path: ['color', 'primitive', 'red'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#b91c1c' } },
  { id: 'color-red-800', name: 'red-800', path: ['color', 'primitive', 'red'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#991b1b' } },
  { id: 'color-red-900', name: 'red-900', path: ['color', 'primitive', 'red'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#7f1d1d' } },

  // Green Scale
  { id: 'color-green-50', name: 'green-50', path: ['color', 'primitive', 'green'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#f0fdf4' } },
  { id: 'color-green-100', name: 'green-100', path: ['color', 'primitive', 'green'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#dcfce7' } },
  { id: 'color-green-200', name: 'green-200', path: ['color', 'primitive', 'green'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#bbf7d0' } },
  { id: 'color-green-300', name: 'green-300', path: ['color', 'primitive', 'green'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#86efac' } },
  { id: 'color-green-400', name: 'green-400', path: ['color', 'primitive', 'green'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#4ade80' } },
  { id: 'color-green-500', name: 'green-500', path: ['color', 'primitive', 'green'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#22c55e' } },
  { id: 'color-green-600', name: 'green-600', path: ['color', 'primitive', 'green'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#16a34a' } },
  { id: 'color-green-700', name: 'green-700', path: ['color', 'primitive', 'green'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#15803d' } },
  { id: 'color-green-800', name: 'green-800', path: ['color', 'primitive', 'green'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#166534' } },
  { id: 'color-green-900', name: 'green-900', path: ['color', 'primitive', 'green'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#14532d' } },

  // Yellow Scale
  { id: 'color-yellow-50', name: 'yellow-50', path: ['color', 'primitive', 'yellow'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#fefce8' } },
  { id: 'color-yellow-100', name: 'yellow-100', path: ['color', 'primitive', 'yellow'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#fef9c3' } },
  { id: 'color-yellow-200', name: 'yellow-200', path: ['color', 'primitive', 'yellow'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#fef08a' } },
  { id: 'color-yellow-300', name: 'yellow-300', path: ['color', 'primitive', 'yellow'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#fde047' } },
  { id: 'color-yellow-400', name: 'yellow-400', path: ['color', 'primitive', 'yellow'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#facc15' } },
  { id: 'color-yellow-500', name: 'yellow-500', path: ['color', 'primitive', 'yellow'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#eab308' } },
  { id: 'color-yellow-600', name: 'yellow-600', path: ['color', 'primitive', 'yellow'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#ca8a04' } },
  { id: 'color-yellow-700', name: 'yellow-700', path: ['color', 'primitive', 'yellow'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#a16207' } },
  { id: 'color-yellow-800', name: 'yellow-800', path: ['color', 'primitive', 'yellow'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#854d0e' } },
  { id: 'color-yellow-900', name: 'yellow-900', path: ['color', 'primitive', 'yellow'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#713f12' } },

  // Purple Scale
  { id: 'color-purple-50', name: 'purple-50', path: ['color', 'primitive', 'purple'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#faf5ff' } },
  { id: 'color-purple-100', name: 'purple-100', path: ['color', 'primitive', 'purple'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#f3e8ff' } },
  { id: 'color-purple-200', name: 'purple-200', path: ['color', 'primitive', 'purple'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#e9d5ff' } },
  { id: 'color-purple-300', name: 'purple-300', path: ['color', 'primitive', 'purple'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#d8b4fe' } },
  { id: 'color-purple-400', name: 'purple-400', path: ['color', 'primitive', 'purple'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#c084fc' } },
  { id: 'color-purple-500', name: 'purple-500', path: ['color', 'primitive', 'purple'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#a855f7' } },
  { id: 'color-purple-600', name: 'purple-600', path: ['color', 'primitive', 'purple'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#9333ea' } },
  { id: 'color-purple-700', name: 'purple-700', path: ['color', 'primitive', 'purple'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#7e22ce' } },
  { id: 'color-purple-800', name: 'purple-800', path: ['color', 'primitive', 'purple'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#6b21a8' } },
  { id: 'color-purple-900', name: 'purple-900', path: ['color', 'primitive', 'purple'], category: 'color', tier: 'primitive', type: 'color', value: { value: '#581c87' } },
];

// =============================================================================
// COLOR TOKENS - SEMANTIC
// =============================================================================

export const semanticColorTokens: DesignToken[] = [
  // Background
  { id: 'color-bg-primary', name: 'bg-primary', path: ['color', 'semantic', 'background'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#ffffff', darkValue: '#111827' }, reference: 'color-white' },
  { id: 'color-bg-secondary', name: 'bg-secondary', path: ['color', 'semantic', 'background'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#f9fafb', darkValue: '#1f2937' }, reference: 'color-gray-50' },
  { id: 'color-bg-tertiary', name: 'bg-tertiary', path: ['color', 'semantic', 'background'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#f3f4f6', darkValue: '#374151' }, reference: 'color-gray-100' },
  { id: 'color-bg-inverse', name: 'bg-inverse', path: ['color', 'semantic', 'background'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#111827', darkValue: '#ffffff' }, reference: 'color-gray-900' },

  // Text
  { id: 'color-text-primary', name: 'text-primary', path: ['color', 'semantic', 'text'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#111827', darkValue: '#f9fafb' }, reference: 'color-gray-900' },
  { id: 'color-text-secondary', name: 'text-secondary', path: ['color', 'semantic', 'text'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#4b5563', darkValue: '#d1d5db' }, reference: 'color-gray-600' },
  { id: 'color-text-tertiary', name: 'text-tertiary', path: ['color', 'semantic', 'text'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#9ca3af', darkValue: '#9ca3af' }, reference: 'color-gray-400' },
  { id: 'color-text-inverse', name: 'text-inverse', path: ['color', 'semantic', 'text'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#ffffff', darkValue: '#111827' }, reference: 'color-white' },
  { id: 'color-text-link', name: 'text-link', path: ['color', 'semantic', 'text'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#2563eb', darkValue: '#60a5fa' }, reference: 'color-blue-600' },

  // Border
  { id: 'color-border-default', name: 'border-default', path: ['color', 'semantic', 'border'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#e5e7eb', darkValue: '#374151' }, reference: 'color-gray-200' },
  { id: 'color-border-strong', name: 'border-strong', path: ['color', 'semantic', 'border'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#d1d5db', darkValue: '#4b5563' }, reference: 'color-gray-300' },
  { id: 'color-border-focus', name: 'border-focus', path: ['color', 'semantic', 'border'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#3b82f6', darkValue: '#60a5fa' }, reference: 'color-blue-500' },

  // Interactive
  { id: 'color-interactive-primary', name: 'interactive-primary', path: ['color', 'semantic', 'interactive'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#3b82f6', darkValue: '#60a5fa' }, reference: 'color-blue-500' },
  { id: 'color-interactive-primary-hover', name: 'interactive-primary-hover', path: ['color', 'semantic', 'interactive'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#2563eb', darkValue: '#3b82f6' }, reference: 'color-blue-600' },
  { id: 'color-interactive-secondary', name: 'interactive-secondary', path: ['color', 'semantic', 'interactive'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#6b7280', darkValue: '#9ca3af' }, reference: 'color-gray-500' },

  // Status
  { id: 'color-status-success', name: 'status-success', path: ['color', 'semantic', 'status'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#22c55e', darkValue: '#4ade80' }, reference: 'color-green-500' },
  { id: 'color-status-success-bg', name: 'status-success-bg', path: ['color', 'semantic', 'status'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#f0fdf4', darkValue: '#14532d' }, reference: 'color-green-50' },
  { id: 'color-status-warning', name: 'status-warning', path: ['color', 'semantic', 'status'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#eab308', darkValue: '#facc15' }, reference: 'color-yellow-500' },
  { id: 'color-status-warning-bg', name: 'status-warning-bg', path: ['color', 'semantic', 'status'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#fefce8', darkValue: '#713f12' }, reference: 'color-yellow-50' },
  { id: 'color-status-error', name: 'status-error', path: ['color', 'semantic', 'status'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#ef4444', darkValue: '#f87171' }, reference: 'color-red-500' },
  { id: 'color-status-error-bg', name: 'status-error-bg', path: ['color', 'semantic', 'status'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#fef2f2', darkValue: '#7f1d1d' }, reference: 'color-red-50' },
  { id: 'color-status-info', name: 'status-info', path: ['color', 'semantic', 'status'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#3b82f6', darkValue: '#60a5fa' }, reference: 'color-blue-500' },
  { id: 'color-status-info-bg', name: 'status-info-bg', path: ['color', 'semantic', 'status'], category: 'color', tier: 'semantic', type: 'color', value: { value: '#eff6ff', darkValue: '#1e3a8a' }, reference: 'color-blue-50' },
];

// =============================================================================
// TYPOGRAPHY TOKENS
// =============================================================================

export const typographyTokens: DesignToken[] = [
  // Font Family
  { id: 'font-family-sans', name: 'font-sans', path: ['typography', 'family'], category: 'typography', tier: 'primitive', type: 'fontFamily', value: { value: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' } },
  { id: 'font-family-serif', name: 'font-serif', path: ['typography', 'family'], category: 'typography', tier: 'primitive', type: 'fontFamily', value: { value: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' } },
  { id: 'font-family-mono', name: 'font-mono', path: ['typography', 'family'], category: 'typography', tier: 'primitive', type: 'fontFamily', value: { value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' } },

  // Font Size
  { id: 'font-size-xs', name: 'font-size-xs', path: ['typography', 'size'], category: 'typography', tier: 'primitive', type: 'fontSize', value: { value: '0.75rem' }, metadata: { description: '12px' } },
  { id: 'font-size-sm', name: 'font-size-sm', path: ['typography', 'size'], category: 'typography', tier: 'primitive', type: 'fontSize', value: { value: '0.875rem' }, metadata: { description: '14px' } },
  { id: 'font-size-base', name: 'font-size-base', path: ['typography', 'size'], category: 'typography', tier: 'primitive', type: 'fontSize', value: { value: '1rem' }, metadata: { description: '16px' } },
  { id: 'font-size-lg', name: 'font-size-lg', path: ['typography', 'size'], category: 'typography', tier: 'primitive', type: 'fontSize', value: { value: '1.125rem' }, metadata: { description: '18px' } },
  { id: 'font-size-xl', name: 'font-size-xl', path: ['typography', 'size'], category: 'typography', tier: 'primitive', type: 'fontSize', value: { value: '1.25rem' }, metadata: { description: '20px' } },
  { id: 'font-size-2xl', name: 'font-size-2xl', path: ['typography', 'size'], category: 'typography', tier: 'primitive', type: 'fontSize', value: { value: '1.5rem' }, metadata: { description: '24px' } },
  { id: 'font-size-3xl', name: 'font-size-3xl', path: ['typography', 'size'], category: 'typography', tier: 'primitive', type: 'fontSize', value: { value: '1.875rem' }, metadata: { description: '30px' } },
  { id: 'font-size-4xl', name: 'font-size-4xl', path: ['typography', 'size'], category: 'typography', tier: 'primitive', type: 'fontSize', value: { value: '2.25rem' }, metadata: { description: '36px' } },
  { id: 'font-size-5xl', name: 'font-size-5xl', path: ['typography', 'size'], category: 'typography', tier: 'primitive', type: 'fontSize', value: { value: '3rem' }, metadata: { description: '48px' } },
  { id: 'font-size-6xl', name: 'font-size-6xl', path: ['typography', 'size'], category: 'typography', tier: 'primitive', type: 'fontSize', value: { value: '3.75rem' }, metadata: { description: '60px' } },
  { id: 'font-size-7xl', name: 'font-size-7xl', path: ['typography', 'size'], category: 'typography', tier: 'primitive', type: 'fontSize', value: { value: '4.5rem' }, metadata: { description: '72px' } },
  { id: 'font-size-8xl', name: 'font-size-8xl', path: ['typography', 'size'], category: 'typography', tier: 'primitive', type: 'fontSize', value: { value: '6rem' }, metadata: { description: '96px' } },
  { id: 'font-size-9xl', name: 'font-size-9xl', path: ['typography', 'size'], category: 'typography', tier: 'primitive', type: 'fontSize', value: { value: '8rem' }, metadata: { description: '128px' } },

  // Font Weight
  { id: 'font-weight-thin', name: 'font-weight-thin', path: ['typography', 'weight'], category: 'typography', tier: 'primitive', type: 'fontWeight', value: { value: '100' } },
  { id: 'font-weight-extralight', name: 'font-weight-extralight', path: ['typography', 'weight'], category: 'typography', tier: 'primitive', type: 'fontWeight', value: { value: '200' } },
  { id: 'font-weight-light', name: 'font-weight-light', path: ['typography', 'weight'], category: 'typography', tier: 'primitive', type: 'fontWeight', value: { value: '300' } },
  { id: 'font-weight-normal', name: 'font-weight-normal', path: ['typography', 'weight'], category: 'typography', tier: 'primitive', type: 'fontWeight', value: { value: '400' } },
  { id: 'font-weight-medium', name: 'font-weight-medium', path: ['typography', 'weight'], category: 'typography', tier: 'primitive', type: 'fontWeight', value: { value: '500' } },
  { id: 'font-weight-semibold', name: 'font-weight-semibold', path: ['typography', 'weight'], category: 'typography', tier: 'primitive', type: 'fontWeight', value: { value: '600' } },
  { id: 'font-weight-bold', name: 'font-weight-bold', path: ['typography', 'weight'], category: 'typography', tier: 'primitive', type: 'fontWeight', value: { value: '700' } },
  { id: 'font-weight-extrabold', name: 'font-weight-extrabold', path: ['typography', 'weight'], category: 'typography', tier: 'primitive', type: 'fontWeight', value: { value: '800' } },
  { id: 'font-weight-black', name: 'font-weight-black', path: ['typography', 'weight'], category: 'typography', tier: 'primitive', type: 'fontWeight', value: { value: '900' } },

  // Line Height
  { id: 'line-height-none', name: 'line-height-none', path: ['typography', 'lineHeight'], category: 'typography', tier: 'primitive', type: 'lineHeight', value: { value: '1' } },
  { id: 'line-height-tight', name: 'line-height-tight', path: ['typography', 'lineHeight'], category: 'typography', tier: 'primitive', type: 'lineHeight', value: { value: '1.25' } },
  { id: 'line-height-snug', name: 'line-height-snug', path: ['typography', 'lineHeight'], category: 'typography', tier: 'primitive', type: 'lineHeight', value: { value: '1.375' } },
  { id: 'line-height-normal', name: 'line-height-normal', path: ['typography', 'lineHeight'], category: 'typography', tier: 'primitive', type: 'lineHeight', value: { value: '1.5' } },
  { id: 'line-height-relaxed', name: 'line-height-relaxed', path: ['typography', 'lineHeight'], category: 'typography', tier: 'primitive', type: 'lineHeight', value: { value: '1.625' } },
  { id: 'line-height-loose', name: 'line-height-loose', path: ['typography', 'lineHeight'], category: 'typography', tier: 'primitive', type: 'lineHeight', value: { value: '2' } },

  // Letter Spacing
  { id: 'letter-spacing-tighter', name: 'letter-spacing-tighter', path: ['typography', 'letterSpacing'], category: 'typography', tier: 'primitive', type: 'letterSpacing', value: { value: '-0.05em' } },
  { id: 'letter-spacing-tight', name: 'letter-spacing-tight', path: ['typography', 'letterSpacing'], category: 'typography', tier: 'primitive', type: 'letterSpacing', value: { value: '-0.025em' } },
  { id: 'letter-spacing-normal', name: 'letter-spacing-normal', path: ['typography', 'letterSpacing'], category: 'typography', tier: 'primitive', type: 'letterSpacing', value: { value: '0em' } },
  { id: 'letter-spacing-wide', name: 'letter-spacing-wide', path: ['typography', 'letterSpacing'], category: 'typography', tier: 'primitive', type: 'letterSpacing', value: { value: '0.025em' } },
  { id: 'letter-spacing-wider', name: 'letter-spacing-wider', path: ['typography', 'letterSpacing'], category: 'typography', tier: 'primitive', type: 'letterSpacing', value: { value: '0.05em' } },
  { id: 'letter-spacing-widest', name: 'letter-spacing-widest', path: ['typography', 'letterSpacing'], category: 'typography', tier: 'primitive', type: 'letterSpacing', value: { value: '0.1em' } },
];

// =============================================================================
// SPACING TOKENS (0 to 96 scale)
// =============================================================================

export const spacingTokens: DesignToken[] = [
  { id: 'spacing-0', name: 'spacing-0', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '0px' } },
  { id: 'spacing-px', name: 'spacing-px', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '1px' } },
  { id: 'spacing-0.5', name: 'spacing-0.5', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '0.125rem' }, metadata: { description: '2px' } },
  { id: 'spacing-1', name: 'spacing-1', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '0.25rem' }, metadata: { description: '4px' } },
  { id: 'spacing-1.5', name: 'spacing-1.5', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '0.375rem' }, metadata: { description: '6px' } },
  { id: 'spacing-2', name: 'spacing-2', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '0.5rem' }, metadata: { description: '8px' } },
  { id: 'spacing-2.5', name: 'spacing-2.5', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '0.625rem' }, metadata: { description: '10px' } },
  { id: 'spacing-3', name: 'spacing-3', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '0.75rem' }, metadata: { description: '12px' } },
  { id: 'spacing-3.5', name: 'spacing-3.5', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '0.875rem' }, metadata: { description: '14px' } },
  { id: 'spacing-4', name: 'spacing-4', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '1rem' }, metadata: { description: '16px' } },
  { id: 'spacing-5', name: 'spacing-5', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '1.25rem' }, metadata: { description: '20px' } },
  { id: 'spacing-6', name: 'spacing-6', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '1.5rem' }, metadata: { description: '24px' } },
  { id: 'spacing-7', name: 'spacing-7', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '1.75rem' }, metadata: { description: '28px' } },
  { id: 'spacing-8', name: 'spacing-8', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '2rem' }, metadata: { description: '32px' } },
  { id: 'spacing-9', name: 'spacing-9', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '2.25rem' }, metadata: { description: '36px' } },
  { id: 'spacing-10', name: 'spacing-10', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '2.5rem' }, metadata: { description: '40px' } },
  { id: 'spacing-11', name: 'spacing-11', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '2.75rem' }, metadata: { description: '44px' } },
  { id: 'spacing-12', name: 'spacing-12', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '3rem' }, metadata: { description: '48px' } },
  { id: 'spacing-14', name: 'spacing-14', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '3.5rem' }, metadata: { description: '56px' } },
  { id: 'spacing-16', name: 'spacing-16', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '4rem' }, metadata: { description: '64px' } },
  { id: 'spacing-20', name: 'spacing-20', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '5rem' }, metadata: { description: '80px' } },
  { id: 'spacing-24', name: 'spacing-24', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '6rem' }, metadata: { description: '96px' } },
  { id: 'spacing-28', name: 'spacing-28', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '7rem' }, metadata: { description: '112px' } },
  { id: 'spacing-32', name: 'spacing-32', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '8rem' }, metadata: { description: '128px' } },
  { id: 'spacing-36', name: 'spacing-36', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '9rem' }, metadata: { description: '144px' } },
  { id: 'spacing-40', name: 'spacing-40', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '10rem' }, metadata: { description: '160px' } },
  { id: 'spacing-44', name: 'spacing-44', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '11rem' }, metadata: { description: '176px' } },
  { id: 'spacing-48', name: 'spacing-48', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '12rem' }, metadata: { description: '192px' } },
  { id: 'spacing-52', name: 'spacing-52', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '13rem' }, metadata: { description: '208px' } },
  { id: 'spacing-56', name: 'spacing-56', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '14rem' }, metadata: { description: '224px' } },
  { id: 'spacing-60', name: 'spacing-60', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '15rem' }, metadata: { description: '240px' } },
  { id: 'spacing-64', name: 'spacing-64', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '16rem' }, metadata: { description: '256px' } },
  { id: 'spacing-72', name: 'spacing-72', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '18rem' }, metadata: { description: '288px' } },
  { id: 'spacing-80', name: 'spacing-80', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '20rem' }, metadata: { description: '320px' } },
  { id: 'spacing-96', name: 'spacing-96', path: ['spacing'], category: 'spacing', tier: 'primitive', type: 'spacing', value: { value: '24rem' }, metadata: { description: '384px' } },
];

// =============================================================================
// BORDER TOKENS
// =============================================================================

export const borderTokens: DesignToken[] = [
  // Border Width
  { id: 'border-width-0', name: 'border-width-0', path: ['border', 'width'], category: 'border', tier: 'primitive', type: 'borderWidth', value: { value: '0px' } },
  { id: 'border-width-1', name: 'border-width-1', path: ['border', 'width'], category: 'border', tier: 'primitive', type: 'borderWidth', value: { value: '1px' } },
  { id: 'border-width-2', name: 'border-width-2', path: ['border', 'width'], category: 'border', tier: 'primitive', type: 'borderWidth', value: { value: '2px' } },
  { id: 'border-width-4', name: 'border-width-4', path: ['border', 'width'], category: 'border', tier: 'primitive', type: 'borderWidth', value: { value: '4px' } },
  { id: 'border-width-8', name: 'border-width-8', path: ['border', 'width'], category: 'border', tier: 'primitive', type: 'borderWidth', value: { value: '8px' } },

  // Border Radius
  { id: 'border-radius-none', name: 'border-radius-none', path: ['border', 'radius'], category: 'border', tier: 'primitive', type: 'borderRadius', value: { value: '0px' } },
  { id: 'border-radius-sm', name: 'border-radius-sm', path: ['border', 'radius'], category: 'border', tier: 'primitive', type: 'borderRadius', value: { value: '0.125rem' }, metadata: { description: '2px' } },
  { id: 'border-radius-default', name: 'border-radius-default', path: ['border', 'radius'], category: 'border', tier: 'primitive', type: 'borderRadius', value: { value: '0.25rem' }, metadata: { description: '4px' } },
  { id: 'border-radius-md', name: 'border-radius-md', path: ['border', 'radius'], category: 'border', tier: 'primitive', type: 'borderRadius', value: { value: '0.375rem' }, metadata: { description: '6px' } },
  { id: 'border-radius-lg', name: 'border-radius-lg', path: ['border', 'radius'], category: 'border', tier: 'primitive', type: 'borderRadius', value: { value: '0.5rem' }, metadata: { description: '8px' } },
  { id: 'border-radius-xl', name: 'border-radius-xl', path: ['border', 'radius'], category: 'border', tier: 'primitive', type: 'borderRadius', value: { value: '0.75rem' }, metadata: { description: '12px' } },
  { id: 'border-radius-2xl', name: 'border-radius-2xl', path: ['border', 'radius'], category: 'border', tier: 'primitive', type: 'borderRadius', value: { value: '1rem' }, metadata: { description: '16px' } },
  { id: 'border-radius-3xl', name: 'border-radius-3xl', path: ['border', 'radius'], category: 'border', tier: 'primitive', type: 'borderRadius', value: { value: '1.5rem' }, metadata: { description: '24px' } },
  { id: 'border-radius-full', name: 'border-radius-full', path: ['border', 'radius'], category: 'border', tier: 'primitive', type: 'borderRadius', value: { value: '9999px' } },
];

// =============================================================================
// SHADOW TOKENS
// =============================================================================

export const shadowTokens: DesignToken[] = [
  { id: 'shadow-none', name: 'shadow-none', path: ['shadow'], category: 'shadow', tier: 'primitive', type: 'shadow', value: { value: 'none' } },
  { id: 'shadow-sm', name: 'shadow-sm', path: ['shadow'], category: 'shadow', tier: 'primitive', type: 'shadow', value: { value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' } },
  { id: 'shadow-default', name: 'shadow-default', path: ['shadow'], category: 'shadow', tier: 'primitive', type: 'shadow', value: { value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' } },
  { id: 'shadow-md', name: 'shadow-md', path: ['shadow'], category: 'shadow', tier: 'primitive', type: 'shadow', value: { value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' } },
  { id: 'shadow-lg', name: 'shadow-lg', path: ['shadow'], category: 'shadow', tier: 'primitive', type: 'shadow', value: { value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' } },
  { id: 'shadow-xl', name: 'shadow-xl', path: ['shadow'], category: 'shadow', tier: 'primitive', type: 'shadow', value: { value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' } },
  { id: 'shadow-2xl', name: 'shadow-2xl', path: ['shadow'], category: 'shadow', tier: 'primitive', type: 'shadow', value: { value: '0 25px 50px -12px rgb(0 0 0 / 0.25)' } },
  { id: 'shadow-inner', name: 'shadow-inner', path: ['shadow'], category: 'shadow', tier: 'primitive', type: 'shadow', value: { value: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)' } },
];

// =============================================================================
// ANIMATION TOKENS
// =============================================================================

export const animationTokens: DesignToken[] = [
  // Duration
  { id: 'duration-0', name: 'duration-0', path: ['animation', 'duration'], category: 'animation', tier: 'primitive', type: 'duration', value: { value: '0ms' } },
  { id: 'duration-75', name: 'duration-75', path: ['animation', 'duration'], category: 'animation', tier: 'primitive', type: 'duration', value: { value: '75ms' } },
  { id: 'duration-100', name: 'duration-100', path: ['animation', 'duration'], category: 'animation', tier: 'primitive', type: 'duration', value: { value: '100ms' } },
  { id: 'duration-150', name: 'duration-150', path: ['animation', 'duration'], category: 'animation', tier: 'primitive', type: 'duration', value: { value: '150ms' } },
  { id: 'duration-200', name: 'duration-200', path: ['animation', 'duration'], category: 'animation', tier: 'primitive', type: 'duration', value: { value: '200ms' } },
  { id: 'duration-300', name: 'duration-300', path: ['animation', 'duration'], category: 'animation', tier: 'primitive', type: 'duration', value: { value: '300ms' } },
  { id: 'duration-500', name: 'duration-500', path: ['animation', 'duration'], category: 'animation', tier: 'primitive', type: 'duration', value: { value: '500ms' } },
  { id: 'duration-700', name: 'duration-700', path: ['animation', 'duration'], category: 'animation', tier: 'primitive', type: 'duration', value: { value: '700ms' } },
  { id: 'duration-1000', name: 'duration-1000', path: ['animation', 'duration'], category: 'animation', tier: 'primitive', type: 'duration', value: { value: '1000ms' } },

  // Easing
  { id: 'easing-linear', name: 'easing-linear', path: ['animation', 'easing'], category: 'animation', tier: 'primitive', type: 'easing', value: { value: 'linear' } },
  { id: 'easing-in', name: 'easing-in', path: ['animation', 'easing'], category: 'animation', tier: 'primitive', type: 'easing', value: { value: 'cubic-bezier(0.4, 0, 1, 1)' } },
  { id: 'easing-out', name: 'easing-out', path: ['animation', 'easing'], category: 'animation', tier: 'primitive', type: 'easing', value: { value: 'cubic-bezier(0, 0, 0.2, 1)' } },
  { id: 'easing-in-out', name: 'easing-in-out', path: ['animation', 'easing'], category: 'animation', tier: 'primitive', type: 'easing', value: { value: 'cubic-bezier(0.4, 0, 0.2, 1)' } },
  { id: 'easing-bounce', name: 'easing-bounce', path: ['animation', 'easing'], category: 'animation', tier: 'primitive', type: 'easing', value: { value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' } },
];

// =============================================================================
// Z-INDEX TOKENS
// =============================================================================

export const zIndexTokens: DesignToken[] = [
  { id: 'z-index-auto', name: 'z-index-auto', path: ['zIndex'], category: 'zIndex', tier: 'primitive', type: 'zIndex', value: { value: 'auto' } },
  { id: 'z-index-0', name: 'z-index-0', path: ['zIndex'], category: 'zIndex', tier: 'primitive', type: 'zIndex', value: { value: '0' } },
  { id: 'z-index-10', name: 'z-index-10', path: ['zIndex'], category: 'zIndex', tier: 'primitive', type: 'zIndex', value: { value: '10' }, metadata: { description: 'Dropdown, tooltips' } },
  { id: 'z-index-20', name: 'z-index-20', path: ['zIndex'], category: 'zIndex', tier: 'primitive', type: 'zIndex', value: { value: '20' }, metadata: { description: 'Sticky elements' } },
  { id: 'z-index-30', name: 'z-index-30', path: ['zIndex'], category: 'zIndex', tier: 'primitive', type: 'zIndex', value: { value: '30' }, metadata: { description: 'Fixed navigation' } },
  { id: 'z-index-40', name: 'z-index-40', path: ['zIndex'], category: 'zIndex', tier: 'primitive', type: 'zIndex', value: { value: '40' }, metadata: { description: 'Modals, dialogs' } },
  { id: 'z-index-50', name: 'z-index-50', path: ['zIndex'], category: 'zIndex', tier: 'primitive', type: 'zIndex', value: { value: '50' }, metadata: { description: 'Notifications, toasts' } },

  // Semantic z-index
  { id: 'z-index-dropdown', name: 'z-index-dropdown', path: ['zIndex', 'semantic'], category: 'zIndex', tier: 'semantic', type: 'zIndex', value: { value: '1000' }, reference: 'z-index-10' },
  { id: 'z-index-sticky', name: 'z-index-sticky', path: ['zIndex', 'semantic'], category: 'zIndex', tier: 'semantic', type: 'zIndex', value: { value: '1020' }, reference: 'z-index-20' },
  { id: 'z-index-fixed', name: 'z-index-fixed', path: ['zIndex', 'semantic'], category: 'zIndex', tier: 'semantic', type: 'zIndex', value: { value: '1030' }, reference: 'z-index-30' },
  { id: 'z-index-modal-backdrop', name: 'z-index-modal-backdrop', path: ['zIndex', 'semantic'], category: 'zIndex', tier: 'semantic', type: 'zIndex', value: { value: '1040' } },
  { id: 'z-index-modal', name: 'z-index-modal', path: ['zIndex', 'semantic'], category: 'zIndex', tier: 'semantic', type: 'zIndex', value: { value: '1050' }, reference: 'z-index-40' },
  { id: 'z-index-popover', name: 'z-index-popover', path: ['zIndex', 'semantic'], category: 'zIndex', tier: 'semantic', type: 'zIndex', value: { value: '1060' } },
  { id: 'z-index-tooltip', name: 'z-index-tooltip', path: ['zIndex', 'semantic'], category: 'zIndex', tier: 'semantic', type: 'zIndex', value: { value: '1070' } },
  { id: 'z-index-toast', name: 'z-index-toast', path: ['zIndex', 'semantic'], category: 'zIndex', tier: 'semantic', type: 'zIndex', value: { value: '1080' }, reference: 'z-index-50' },
];

// =============================================================================
// BREAKPOINT TOKENS
// =============================================================================

export const breakpointTokens: DesignToken[] = [
  { id: 'breakpoint-xs', name: 'breakpoint-xs', path: ['breakpoint'], category: 'breakpoint', tier: 'primitive', type: 'breakpoint', value: { value: '0px' }, metadata: { description: 'Extra small devices' } },
  { id: 'breakpoint-sm', name: 'breakpoint-sm', path: ['breakpoint'], category: 'breakpoint', tier: 'primitive', type: 'breakpoint', value: { value: '640px' }, metadata: { description: 'Small devices' } },
  { id: 'breakpoint-md', name: 'breakpoint-md', path: ['breakpoint'], category: 'breakpoint', tier: 'primitive', type: 'breakpoint', value: { value: '768px' }, metadata: { description: 'Medium devices (tablets)' } },
  { id: 'breakpoint-lg', name: 'breakpoint-lg', path: ['breakpoint'], category: 'breakpoint', tier: 'primitive', type: 'breakpoint', value: { value: '1024px' }, metadata: { description: 'Large devices (desktops)' } },
  { id: 'breakpoint-xl', name: 'breakpoint-xl', path: ['breakpoint'], category: 'breakpoint', tier: 'primitive', type: 'breakpoint', value: { value: '1280px' }, metadata: { description: 'Extra large devices' } },
  { id: 'breakpoint-2xl', name: 'breakpoint-2xl', path: ['breakpoint'], category: 'breakpoint', tier: 'primitive', type: 'breakpoint', value: { value: '1536px' }, metadata: { description: 'Extra extra large devices' } },
];

// =============================================================================
// OPACITY TOKENS
// =============================================================================

export const opacityTokens: DesignToken[] = [
  { id: 'opacity-0', name: 'opacity-0', path: ['opacity'], category: 'opacity', tier: 'primitive', type: 'opacity', value: { value: '0' } },
  { id: 'opacity-5', name: 'opacity-5', path: ['opacity'], category: 'opacity', tier: 'primitive', type: 'opacity', value: { value: '0.05' } },
  { id: 'opacity-10', name: 'opacity-10', path: ['opacity'], category: 'opacity', tier: 'primitive', type: 'opacity', value: { value: '0.1' } },
  { id: 'opacity-20', name: 'opacity-20', path: ['opacity'], category: 'opacity', tier: 'primitive', type: 'opacity', value: { value: '0.2' } },
  { id: 'opacity-25', name: 'opacity-25', path: ['opacity'], category: 'opacity', tier: 'primitive', type: 'opacity', value: { value: '0.25' } },
  { id: 'opacity-30', name: 'opacity-30', path: ['opacity'], category: 'opacity', tier: 'primitive', type: 'opacity', value: { value: '0.3' } },
  { id: 'opacity-40', name: 'opacity-40', path: ['opacity'], category: 'opacity', tier: 'primitive', type: 'opacity', value: { value: '0.4' } },
  { id: 'opacity-50', name: 'opacity-50', path: ['opacity'], category: 'opacity', tier: 'primitive', type: 'opacity', value: { value: '0.5' } },
  { id: 'opacity-60', name: 'opacity-60', path: ['opacity'], category: 'opacity', tier: 'primitive', type: 'opacity', value: { value: '0.6' } },
  { id: 'opacity-70', name: 'opacity-70', path: ['opacity'], category: 'opacity', tier: 'primitive', type: 'opacity', value: { value: '0.7' } },
  { id: 'opacity-75', name: 'opacity-75', path: ['opacity'], category: 'opacity', tier: 'primitive', type: 'opacity', value: { value: '0.75' } },
  { id: 'opacity-80', name: 'opacity-80', path: ['opacity'], category: 'opacity', tier: 'primitive', type: 'opacity', value: { value: '0.8' } },
  { id: 'opacity-90', name: 'opacity-90', path: ['opacity'], category: 'opacity', tier: 'primitive', type: 'opacity', value: { value: '0.9' } },
  { id: 'opacity-95', name: 'opacity-95', path: ['opacity'], category: 'opacity', tier: 'primitive', type: 'opacity', value: { value: '0.95' } },
  { id: 'opacity-100', name: 'opacity-100', path: ['opacity'], category: 'opacity', tier: 'primitive', type: 'opacity', value: { value: '1' } },
];

// =============================================================================
// ALL TOKENS COMBINED
// =============================================================================

export const allDesignTokens: DesignToken[] = [
  ...primitiveColorTokens,
  ...semanticColorTokens,
  ...typographyTokens,
  ...spacingTokens,
  ...borderTokens,
  ...shadowTokens,
  ...animationTokens,
  ...zIndexTokens,
  ...breakpointTokens,
  ...opacityTokens,
];

// =============================================================================
// DEFAULT TOKEN COLLECTION
// =============================================================================

export const defaultTokenCollection: TokenCollection = {
  id: 'default-collection',
  name: 'Default Design Tokens',
  version: '1.0.0',
  description: 'A comprehensive design token system based on Tailwind CSS',
  tokens: allDesignTokens,
  groups: [],
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'Tailwind Builder',
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get tokens by category
 */
export function getTokensByCategory(category: TokenCategory): DesignToken[] {
  return allDesignTokens.filter(token => token.category === category);
}

/**
 * Get tokens by tier
 */
export function getTokensByTier(tier: TokenTier): DesignToken[] {
  return allDesignTokens.filter(token => token.tier === tier);
}

/**
 * Get token by ID
 */
export function getTokenById(id: string): DesignToken | undefined {
  return allDesignTokens.find(token => token.id === id);
}

/**
 * Get token by name
 */
export function getTokenByName(name: string): DesignToken | undefined {
  return allDesignTokens.find(token => token.name === name);
}

/**
 * Get token path as string
 */
export function getTokenPath(token: DesignToken): string {
  return [...token.path, token.name].join('.');
}

/**
 * Create CSS variable name from token
 */
export function tokenToCssVarName(token: DesignToken): string {
  const path = [...token.path, token.name].join('-');
  return `--${path}`;
}

/**
 * Generate unique token ID
 */
export function generateTokenId(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new design token
 */
export function createToken(
  params: Omit<DesignToken, 'id'>
): DesignToken {
  return {
    id: generateTokenId(),
    ...params,
  };
}

/**
 * Validate token value based on type
 */
export function validateTokenValue(type: TokenValueType, value: string | number): boolean {
  switch (type) {
    case 'color':
      return typeof value === 'string' && (
        /^#[0-9a-fA-F]{3,8}$/.test(value) ||
        /^rgb/.test(value) ||
        /^hsl/.test(value) ||
        value === 'transparent' ||
        value === 'currentColor'
      );
    case 'dimension':
    case 'fontSize':
    case 'spacing':
    case 'borderWidth':
    case 'borderRadius':
      return typeof value === 'string' && /^[\d.]+(px|rem|em|%|vh|vw)?$/.test(value);
    case 'fontWeight':
      return (typeof value === 'number' && value >= 100 && value <= 900) ||
             (typeof value === 'string' && /^\d{3}$/.test(value));
    case 'lineHeight':
      return typeof value === 'string' || typeof value === 'number';
    case 'duration':
      return typeof value === 'string' && /^\d+(ms|s)$/.test(value);
    case 'zIndex':
      return typeof value === 'number' || value === 'auto' || /^\d+$/.test(String(value));
    case 'opacity':
      return typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value)));
    default:
      return true;
  }
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: TokenCategory): string {
  const names: Record<TokenCategory, string> = {
    color: 'Colors',
    typography: 'Typography',
    spacing: 'Spacing',
    border: 'Borders',
    shadow: 'Shadows',
    animation: 'Animation',
    zIndex: 'Z-Index',
    breakpoint: 'Breakpoints',
    opacity: 'Opacity',
  };
  return names[category];
}

/**
 * Get tier display name
 */
export function getTierDisplayName(tier: TokenTier): string {
  const names: Record<TokenTier, string> = {
    primitive: 'Primitive',
    semantic: 'Semantic',
    component: 'Component',
  };
  return names[tier];
}
