/**
 * CSS Scoping - Advanced CSS scoping and isolation utilities
 *
 * This module provides:
 * - CSS scoping to specific elements
 * - CSS Modules-like class name hashing
 * - BEM naming convention generator
 * - Style leak prevention
 * - Global vs scoped style management
 */

import { parseCSS, type CSSAST, type CSSRule } from './cssParser';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

/** Configuration for CSS scoping */
export interface ScopeConfig {
  /** Prefix for scoped class names */
  prefix?: string;
  /** Hash length for generated class names */
  hashLength?: number;
  /** Whether to include original class names */
  preserveOriginal?: boolean;
  /** Selectors to treat as global (won't be scoped) */
  globalSelectors?: string[];
  /** Custom hash function */
  hashFunction?: (input: string) => string;
}

/** Result of scoping operation */
export interface ScopeResult {
  /** The scoped CSS */
  css: string;
  /** Map of original to scoped class names */
  classMap: Record<string, string>;
  /** List of global selectors found */
  globalSelectors: string[];
}

/** BEM block configuration */
export interface BEMConfig {
  /** Block name */
  block: string;
  /** Element separator (default: __) */
  elementSeparator?: string;
  /** Modifier separator (default: --) */
  modifierSeparator?: string;
}

/** BEM generator result */
export interface BEMResult {
  block: string;
  element: (name: string) => string;
  modifier: (name: string, value?: string | boolean) => string;
  elementModifier: (element: string, modifier: string, value?: string | boolean) => string;
}

/** Style isolation context */
export interface IsolationContext {
  /** Unique ID for the context */
  id: string;
  /** Scoped styles */
  styles: string;
  /** Class name mappings */
  classMap: Record<string, string>;
  /** Whether styles are injected */
  isInjected: boolean;
}

// =============================================================================
// HASH UTILITIES
// =============================================================================

/**
 * Generates a simple hash from a string
 * Uses djb2 algorithm for fast, consistent hashing
 */
export function simpleHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generates a unique hash based on content and context
 */
export function generateHash(content: string, context: string = '', length: number = 8): string {
  const combined = `${content}|${context}|${Date.now()}`;
  const hash = simpleHash(combined);
  return hash.substring(0, length);
}

/**
 * Generates a CSS Modules-like hash
 */
export function generateModuleHash(filename: string, className: string, css: string): string {
  const input = `${filename}:${className}:${css}`;
  return simpleHash(input).substring(0, 5);
}

// =============================================================================
// CSS SCOPING
// =============================================================================

/**
 * Scopes CSS to a specific element or class
 * Similar to Vue's scoped styles or CSS Modules
 */
export function scopeCSS(css: string, config: ScopeConfig = {}): ScopeResult {
  const {
    prefix = '_',
    hashLength = 6,
    preserveOriginal = false,
    globalSelectors = [':root', 'html', 'body', '@keyframes', '@font-face'],
    hashFunction = simpleHash,
  } = config;

  const ast = parseCSS(css);
  const classMap: Record<string, string> = {};
  const foundGlobalSelectors: string[] = [];
  const scopeId = hashFunction(css).substring(0, hashLength);

  /**
   * Generates a scoped class name
   */
  const scopeClassName = (original: string): string => {
    if (classMap[original]) {
      return classMap[original];
    }

    const hash = hashFunction(original + scopeId).substring(0, hashLength);
    const scoped = preserveOriginal
      ? `${original}${prefix}${hash}`
      : `${prefix}${hash}`;

    classMap[original] = scoped;
    return scoped;
  };

  /**
   * Checks if a selector should be treated as global
   */
  const isGlobalSelector = (selector: string): boolean => {
    const selectorLower = selector.toLowerCase().trim();

    for (const global of globalSelectors) {
      if (selectorLower.startsWith(global.toLowerCase())) {
        return true;
      }
    }

    // Check for :global() wrapper
    if (selector.includes(':global(')) {
      return true;
    }

    return false;
  };

  /**
   * Scopes a single selector
   */
  const scopeSelector = (selector: string): string => {
    if (isGlobalSelector(selector)) {
      foundGlobalSelectors.push(selector);
      // Extract content from :global() if present
      if (selector.includes(':global(')) {
        return selector.replace(/:global\(([^)]+)\)/g, '$1');
      }
      return selector;
    }

    // Parse and scope class selectors
    return selector.replace(/\.([a-zA-Z_][a-zA-Z0-9_-]*)/g, (match, className) => {
      return `.${scopeClassName(className)}`;
    });
  };

  /**
   * Processes a CSS rule
   */
  const processRule = (rule: CSSRule): string => {
    if (rule.type === 'comment') {
      return rule.raw;
    }

    if (rule.type === 'at-rule') {
      // Handle keyframes and other at-rules
      if (rule.atKeyword === 'keyframes' || rule.atKeyword === '-webkit-keyframes') {
        const scopedName = scopeClassName(rule.atValue || '');
        let result = `@${rule.atKeyword} ${scopedName} {\n`;

        if (rule.rules) {
          result += rule.rules.map(processRule).join('\n');
        }

        result += '\n}';
        return result;
      }

      // Handle media queries, supports, etc.
      if (rule.rules && rule.rules.length > 0) {
        let result = `@${rule.atKeyword} ${rule.atValue || ''} {\n`;
        result += rule.rules.map(processRule).join('\n');
        result += '\n}';
        return result;
      }

      // Handle imports and other simple at-rules
      if (rule.declarations.length === 0) {
        return `@${rule.atKeyword} ${rule.atValue || ''};`;
      }

      // Handle font-face and similar
      let result = `@${rule.atKeyword} ${rule.atValue || ''} {\n`;
      result += rule.declarations
        .map((decl) => `  ${decl.property}: ${decl.value}${decl.important ? ' !important' : ''};`)
        .join('\n');
      result += '\n}';
      return result;
    }

    // Regular rule
    const scopedSelectors = rule.selectors.map(scopeSelector).join(',\n');
    const declarations = rule.declarations
      .map((decl) => {
        // Scope animation-name references
        if (decl.property === 'animation-name' || decl.property === 'animation') {
          const scopedValue = decl.value
            .split(',')
            .map((part) => {
              const trimmed = part.trim();
              const animationName = trimmed.split(' ')[0];
              if (classMap[animationName]) {
                return part.replace(animationName, classMap[animationName]);
              }
              // Scope if it looks like a custom animation name
              if (/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(animationName)) {
                const scoped = scopeClassName(animationName);
                return part.replace(animationName, scoped);
              }
              return part;
            })
            .join(', ');
          return `  ${decl.property}: ${scopedValue}${decl.important ? ' !important' : ''};`;
        }
        return `  ${decl.property}: ${decl.value}${decl.important ? ' !important' : ''};`;
      })
      .join('\n');

    return `${scopedSelectors} {\n${declarations}\n}`;
  };

  const scopedCSS = ast.rules.map(processRule).join('\n\n');

  return {
    css: scopedCSS,
    classMap,
    globalSelectors: foundGlobalSelectors,
  };
}

/**
 * Scopes CSS to a specific data attribute
 * Similar to how Vue scoped styles work
 */
export function scopeToAttribute(css: string, attribute: string): string {
  const ast = parseCSS(css);

  const addAttributeSelector = (selector: string): string => {
    // Don't modify keyframe selectors
    if (/^(from|to|\d+%)$/.test(selector.trim())) {
      return selector;
    }

    // Split complex selectors
    const parts = selector.split(/(\s*[>+~]\s*|\s+)/);
    const result: string[] = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      // Skip combinators
      if (/^[\s>+~]*$/.test(part)) {
        result.push(part);
        continue;
      }

      // Add attribute selector to the first simple selector
      if (part.match(/^[a-zA-Z*#.\[]/)) {
        // Find where to insert the attribute selector
        const match = part.match(/^([a-zA-Z*]*)(.*)$/);
        if (match) {
          const [, element, rest] = match;
          result.push(`${element || '*'}[${attribute}]${rest}`);
        } else {
          result.push(`${part}[${attribute}]`);
        }
      } else {
        result.push(part);
      }
    }

    return result.join('');
  };

  const processRule = (rule: CSSRule): string => {
    if (rule.type === 'comment') {
      return rule.raw;
    }

    if (rule.type === 'at-rule') {
      if (rule.rules && rule.rules.length > 0) {
        let result = `@${rule.atKeyword} ${rule.atValue || ''} {\n`;
        result += rule.rules.map(processRule).join('\n');
        result += '\n}';
        return result;
      }

      if (rule.declarations.length === 0) {
        return `@${rule.atKeyword} ${rule.atValue || ''};`;
      }

      let result = `@${rule.atKeyword} ${rule.atValue || ''} {\n`;
      result += rule.declarations
        .map((decl) => `  ${decl.property}: ${decl.value}${decl.important ? ' !important' : ''};`)
        .join('\n');
      result += '\n}';
      return result;
    }

    const scopedSelectors = rule.selectors.map(addAttributeSelector).join(',\n');
    const declarations = rule.declarations
      .map((decl) => `  ${decl.property}: ${decl.value}${decl.important ? ' !important' : ''};`)
      .join('\n');

    return `${scopedSelectors} {\n${declarations}\n}`;
  };

  return ast.rules.map(processRule).join('\n\n');
}

/**
 * Scopes CSS to a specific container selector
 */
export function scopeToContainer(css: string, containerSelector: string): string {
  const ast = parseCSS(css);

  const prependContainer = (selector: string): string => {
    // Don't modify certain selectors
    if (/^(from|to|\d+%|:root|html|body)$/i.test(selector.trim())) {
      return selector;
    }

    // Handle :global() wrapper
    if (selector.includes(':global(')) {
      return selector.replace(/:global\(([^)]+)\)/g, '$1');
    }

    return `${containerSelector} ${selector}`;
  };

  const processRule = (rule: CSSRule): string => {
    if (rule.type === 'comment') {
      return rule.raw;
    }

    if (rule.type === 'at-rule') {
      if (rule.rules && rule.rules.length > 0) {
        let result = `@${rule.atKeyword} ${rule.atValue || ''} {\n`;
        result += rule.rules.map(processRule).join('\n');
        result += '\n}';
        return result;
      }

      if (rule.declarations.length === 0) {
        return `@${rule.atKeyword} ${rule.atValue || ''};`;
      }

      let result = `@${rule.atKeyword} ${rule.atValue || ''} {\n`;
      result += rule.declarations
        .map((decl) => `  ${decl.property}: ${decl.value}${decl.important ? ' !important' : ''};`)
        .join('\n');
      result += '\n}';
      return result;
    }

    const scopedSelectors = rule.selectors.map(prependContainer).join(',\n');
    const declarations = rule.declarations
      .map((decl) => `  ${decl.property}: ${decl.value}${decl.important ? ' !important' : ''};`)
      .join('\n');

    return `${scopedSelectors} {\n${declarations}\n}`;
  };

  return ast.rules.map(processRule).join('\n\n');
}

// =============================================================================
// BEM NAMING CONVENTION
// =============================================================================

/**
 * Creates a BEM naming helper
 */
export function createBEM(config: BEMConfig): BEMResult {
  const {
    block,
    elementSeparator = '__',
    modifierSeparator = '--',
  } = config;

  return {
    block,

    element(name: string): string {
      return `${block}${elementSeparator}${name}`;
    },

    modifier(name: string, value?: string | boolean): string {
      if (value === false) return block;
      if (value === true || value === undefined) {
        return `${block}${modifierSeparator}${name}`;
      }
      return `${block}${modifierSeparator}${name}-${value}`;
    },

    elementModifier(element: string, modifier: string, value?: string | boolean): string {
      const elementClass = `${block}${elementSeparator}${element}`;
      if (value === false) return elementClass;
      if (value === true || value === undefined) {
        return `${elementClass}${modifierSeparator}${modifier}`;
      }
      return `${elementClass}${modifierSeparator}${modifier}-${value}`;
    },
  };
}

/**
 * Generates BEM class names from a structure definition
 */
export function generateBEMClasses(
  block: string,
  elements: Record<string, string[]>,
  config?: Partial<BEMConfig>
): Record<string, string> {
  const bem = createBEM({ block, ...config });
  const classes: Record<string, string> = { block };

  for (const [element, modifiers] of Object.entries(elements)) {
    classes[element] = bem.element(element);

    for (const modifier of modifiers) {
      const key = `${element}--${modifier}`;
      classes[key] = bem.elementModifier(element, modifier);
    }
  }

  return classes;
}

/**
 * Converts regular class names to BEM format
 */
export function convertToBEM(css: string, blockName: string): string {
  const ast = parseCSS(css);
  const bem = createBEM({ block: blockName });

  const convertSelector = (selector: string): string => {
    // Match class selectors
    return selector.replace(/\.([a-zA-Z_][a-zA-Z0-9_-]*)/g, (match, className) => {
      // Check if it's already BEM formatted
      if (className.includes('__') || className.includes('--')) {
        return match;
      }

      // Check for element indicator (e.g., .button-icon -> .button__icon)
      if (className.includes('-')) {
        const parts = className.split('-');
        if (parts.length === 2) {
          return `.${bem.element(parts[1])}`;
        }
        // Multiple hyphens might indicate modifier
        const element = parts.slice(0, -1).join('-');
        const modifier = parts[parts.length - 1];
        return `.${bem.elementModifier(element, modifier)}`;
      }

      // Simple class name becomes block modifier
      return `.${bem.modifier(className)}`;
    });
  };

  const processRule = (rule: CSSRule): string => {
    if (rule.type === 'comment') {
      return rule.raw;
    }

    if (rule.type === 'at-rule') {
      if (rule.rules && rule.rules.length > 0) {
        let result = `@${rule.atKeyword} ${rule.atValue || ''} {\n`;
        result += rule.rules.map(processRule).join('\n');
        result += '\n}';
        return result;
      }

      if (rule.declarations.length === 0) {
        return `@${rule.atKeyword} ${rule.atValue || ''};`;
      }

      let result = `@${rule.atKeyword} ${rule.atValue || ''} {\n`;
      result += rule.declarations
        .map((decl) => `  ${decl.property}: ${decl.value}${decl.important ? ' !important' : ''};`)
        .join('\n');
      result += '\n}';
      return result;
    }

    const convertedSelectors = rule.selectors.map(convertSelector).join(',\n');
    const declarations = rule.declarations
      .map((decl) => `  ${decl.property}: ${decl.value}${decl.important ? ' !important' : ''};`)
      .join('\n');

    return `${convertedSelectors} {\n${declarations}\n}`;
  };

  return ast.rules.map(processRule).join('\n\n');
}

// =============================================================================
// STYLE ISOLATION
// =============================================================================

/** Global registry for isolation contexts */
const isolationContexts = new Map<string, IsolationContext>();

/**
 * Creates an isolated style context
 */
export function createIsolatedContext(css: string, name: string = ''): IsolationContext {
  const id = generateHash(css, name, 8);

  // Check if context already exists
  const existing = isolationContexts.get(id);
  if (existing) {
    return existing;
  }

  const scopeResult = scopeCSS(css, {
    prefix: `_${id}_`,
    hashLength: 4,
    preserveOriginal: true,
  });

  const context: IsolationContext = {
    id,
    styles: scopeResult.css,
    classMap: scopeResult.classMap,
    isInjected: false,
  };

  isolationContexts.set(id, context);
  return context;
}

/**
 * Gets a class name from an isolation context
 */
export function getIsolatedClass(context: IsolationContext, className: string): string {
  return context.classMap[className] || className;
}

/**
 * Injects isolated styles into the document
 * Only works in browser environment
 */
export function injectIsolatedStyles(context: IsolationContext): void {
  if (typeof document === 'undefined') {
    return;
  }

  if (context.isInjected) {
    return;
  }

  const styleId = `isolated-${context.id}`;
  let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;

  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = context.styles;
    document.head.appendChild(styleElement);
  }

  context.isInjected = true;
}

/**
 * Removes isolated styles from the document
 */
export function removeIsolatedStyles(context: IsolationContext): void {
  if (typeof document === 'undefined') {
    return;
  }

  const styleId = `isolated-${context.id}`;
  const styleElement = document.getElementById(styleId);

  if (styleElement) {
    styleElement.remove();
  }

  context.isInjected = false;
  isolationContexts.delete(context.id);
}

/**
 * Creates a styled component utility similar to styled-components
 */
export function createStyled<T extends Record<string, string>>(
  css: string,
  classNames: T
): { styles: string; classes: T; inject: () => void; remove: () => void } {
  const context = createIsolatedContext(css);

  const scopedClasses = {} as T;
  for (const key in classNames) {
    if (Object.prototype.hasOwnProperty.call(classNames, key)) {
      const original = classNames[key];
      scopedClasses[key] = (context.classMap[original] || original) as T[typeof key];
    }
  }

  return {
    styles: context.styles,
    classes: scopedClasses,
    inject: () => injectIsolatedStyles(context),
    remove: () => removeIsolatedStyles(context),
  };
}

// =============================================================================
// GLOBAL VS SCOPED STYLE MANAGEMENT
// =============================================================================

/** Global style registry */
const globalStyles = new Map<string, string>();

/**
 * Registers global styles
 */
export function registerGlobalStyles(id: string, css: string): void {
  globalStyles.set(id, css);

  if (typeof document !== 'undefined') {
    const styleId = `global-${id}`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;
  }
}

/**
 * Unregisters global styles
 */
export function unregisterGlobalStyles(id: string): void {
  globalStyles.delete(id);

  if (typeof document !== 'undefined') {
    const styleId = `global-${id}`;
    const styleElement = document.getElementById(styleId);

    if (styleElement) {
      styleElement.remove();
    }
  }
}

/**
 * Gets all registered global styles
 */
export function getGlobalStyles(): Map<string, string> {
  return new Map(globalStyles);
}

/**
 * Combines global and scoped styles
 */
export function combineStyles(globalCSS: string, scopedCSS: string, scopeSelector: string): string {
  const scopedResult = scopeToContainer(scopedCSS, scopeSelector);
  return `/* Global Styles */\n${globalCSS}\n\n/* Scoped Styles */\n${scopedResult}`;
}

// =============================================================================
// CSS LAYER MANAGEMENT
// =============================================================================

/** CSS layer priorities */
export const CSS_LAYERS = {
  reset: 'reset',
  base: 'base',
  components: 'components',
  utilities: 'utilities',
  overrides: 'overrides',
} as const;

/**
 * Wraps CSS in a @layer rule
 */
export function wrapInLayer(css: string, layer: keyof typeof CSS_LAYERS): string {
  return `@layer ${CSS_LAYERS[layer]} {\n${css}\n}`;
}

/**
 * Creates a layer order declaration
 */
export function createLayerOrder(layers: (keyof typeof CSS_LAYERS)[] = Object.keys(CSS_LAYERS) as (keyof typeof CSS_LAYERS)[]): string {
  return `@layer ${layers.map((l) => CSS_LAYERS[l]).join(', ')};`;
}

/**
 * Organizes CSS into layers
 */
export function organizeIntoLayers(
  reset: string = '',
  base: string = '',
  components: string = '',
  utilities: string = '',
  overrides: string = ''
): string {
  const parts: string[] = [createLayerOrder()];

  if (reset) parts.push(wrapInLayer(reset, 'reset'));
  if (base) parts.push(wrapInLayer(base, 'base'));
  if (components) parts.push(wrapInLayer(components, 'components'));
  if (utilities) parts.push(wrapInLayer(utilities, 'utilities'));
  if (overrides) parts.push(wrapInLayer(overrides, 'overrides'));

  return parts.join('\n\n');
}

// =============================================================================
// SHADOW DOM ISOLATION
// =============================================================================

/**
 * Prepares CSS for Shadow DOM usage
 * Handles :host and ::slotted selectors
 */
export function prepareForShadowDOM(css: string): string {
  const ast = parseCSS(css);

  const processSelector = (selector: string): string => {
    // Convert :root and html to :host
    let result = selector
      .replace(/:root\b/g, ':host')
      .replace(/\bhtml\b/g, ':host');

    // Ensure :host has proper syntax
    if (result.includes(':host') && !result.includes(':host(')) {
      result = result.replace(/:host(?!\()/g, ':host');
    }

    return result;
  };

  const processRule = (rule: CSSRule): string => {
    if (rule.type === 'comment') {
      return rule.raw;
    }

    if (rule.type === 'at-rule') {
      if (rule.rules && rule.rules.length > 0) {
        let result = `@${rule.atKeyword} ${rule.atValue || ''} {\n`;
        result += rule.rules.map(processRule).join('\n');
        result += '\n}';
        return result;
      }

      if (rule.declarations.length === 0) {
        return `@${rule.atKeyword} ${rule.atValue || ''};`;
      }

      let result = `@${rule.atKeyword} ${rule.atValue || ''} {\n`;
      result += rule.declarations
        .map((decl) => `  ${decl.property}: ${decl.value}${decl.important ? ' !important' : ''};`)
        .join('\n');
      result += '\n}';
      return result;
    }

    const processedSelectors = rule.selectors.map(processSelector).join(',\n');
    const declarations = rule.declarations
      .map((decl) => `  ${decl.property}: ${decl.value}${decl.important ? ' !important' : ''};`)
      .join('\n');

    return `${processedSelectors} {\n${declarations}\n}`;
  };

  return ast.rules.map(processRule).join('\n\n');
}

/**
 * Creates adoptable stylesheet for modern Shadow DOM
 */
export function createAdoptableStylesheet(css: string): CSSStyleSheet | null {
  if (typeof CSSStyleSheet === 'undefined' || !('replaceSync' in CSSStyleSheet.prototype)) {
    return null;
  }

  const sheet = new CSSStyleSheet();
  sheet.replaceSync(css);
  return sheet;
}

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

/**
 * Extracts class names from CSS
 */
export function extractClassNames(css: string): string[] {
  const classRegex = /\.([a-zA-Z_][a-zA-Z0-9_-]*)/g;
  const classes = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = classRegex.exec(css)) !== null) {
    classes.add(match[1]);
  }

  return [...classes];
}

/**
 * Checks if CSS contains any scoped selectors
 */
export function hasScoped(css: string): boolean {
  return css.includes('[data-v-') || css.includes('[data-scope-') || /_[a-z0-9]+_/i.test(css);
}

/**
 * Removes scope markers from class names
 */
export function unscopeClassName(className: string): string {
  // Remove common scope patterns
  return className
    .replace(/_[a-z0-9]+$/i, '') // Trailing hash
    .replace(/^_[a-z0-9]+_/i, '') // Leading hash with separator
    .replace(/__[a-z0-9]+$/i, ''); // CSS Modules style hash
}

/**
 * Creates a unique scope ID
 */
export function createScopeId(prefix: string = 'scope'): string {
  return `${prefix}-${generateHash('', '', 8)}`;
}
