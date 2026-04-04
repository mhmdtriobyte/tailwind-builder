/**
 * Token Resolver
 *
 * Handles token reference resolution, aliasing, math operations,
 * interpolation, fallbacks, and dark mode switching.
 */

import type {
  DesignToken,
  TokenCollection,
  TokenCategory,
  TokenTier,
  ColorScheme,
} from './designTokens';
import {
  allDesignTokens,
  getTokenById,
  getTokenByName,
  tokenToCssVarName,
} from './designTokens';

// =============================================================================
// TYPES
// =============================================================================

export interface ResolveOptions {
  colorScheme?: ColorScheme;
  followReferences?: boolean;
  maxDepth?: number;
  fallback?: string | number;
  useCssVars?: boolean;
}

export interface TokenReference {
  tokenId: string;
  originalValue: string;
  resolvedValue: string | number;
  referenceChain: string[];
}

export interface TokenDependency {
  tokenId: string;
  dependsOn: string[];
  dependedBy: string[];
}

export interface MathOperation {
  type: 'add' | 'subtract' | 'multiply' | 'divide' | 'modulo';
  operand: number | string;
}

export interface InterpolationOptions {
  start: string | number;
  end: string | number;
  steps: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

// =============================================================================
// TOKEN RESOLUTION
// =============================================================================

/**
 * Resolve a token's final value, following references if needed
 */
export function resolveTokenValue(
  token: DesignToken,
  options: ResolveOptions = {}
): string | number {
  const {
    colorScheme = 'light',
    followReferences = true,
    maxDepth = 10,
    fallback,
  } = options;

  // Get base value based on color scheme
  let value = colorScheme === 'dark' && token.value.darkValue !== undefined
    ? token.value.darkValue
    : token.value.value;

  // If no reference following needed, return value
  if (!followReferences || !token.reference) {
    return value;
  }

  // Follow reference chain
  const visited = new Set<string>();
  let currentToken: DesignToken | undefined = token;
  let depth = 0;

  while (currentToken?.reference && depth < maxDepth) {
    if (visited.has(currentToken.id)) {
      console.warn(`Circular reference detected: ${currentToken.id}`);
      break;
    }

    visited.add(currentToken.id);
    const referencedToken = getTokenById(currentToken.reference);

    if (!referencedToken) {
      console.warn(`Referenced token not found: ${currentToken.reference}`);
      break;
    }

    currentToken = referencedToken;
    value = colorScheme === 'dark' && currentToken.value.darkValue !== undefined
      ? currentToken.value.darkValue
      : currentToken.value.value;

    depth++;
  }

  return value ?? fallback ?? '';
}

/**
 * Resolve a token reference string (e.g., "{color.blue.500}")
 */
export function resolveTokenReference(
  reference: string,
  tokens: DesignToken[] = allDesignTokens,
  options: ResolveOptions = {}
): string | number | undefined {
  const { colorScheme = 'light', fallback } = options;

  // Remove brackets if present
  const cleanRef = reference.replace(/^\{|\}$/g, '').trim();

  // Try to find by path
  const pathParts = cleanRef.split('.');
  const token = tokens.find(t => {
    const tokenPath = [...t.path, t.name].join('.');
    return tokenPath === cleanRef || t.id === cleanRef || t.name === cleanRef;
  });

  if (!token) {
    return fallback;
  }

  return resolveTokenValue(token, { ...options, colorScheme });
}

/**
 * Resolve all references in a string value
 */
export function resolveAllReferences(
  value: string,
  tokens: DesignToken[] = allDesignTokens,
  options: ResolveOptions = {}
): string {
  // Match patterns like {token.path.name} or ${token.path.name}
  const refPattern = /\{([^}]+)\}|\$\{([^}]+)\}/g;

  return value.replace(refPattern, (match, ref1, ref2) => {
    const ref = ref1 || ref2;
    const resolved = resolveTokenReference(ref, tokens, options);
    return resolved !== undefined ? String(resolved) : match;
  });
}

// =============================================================================
// TOKEN ALIASING
// =============================================================================

export interface TokenAlias {
  id: string;
  name: string;
  targetTokenId: string;
  category: TokenCategory;
  tier: TokenTier;
}

/**
 * Create an alias for a token
 */
export function createTokenAlias(
  name: string,
  targetTokenId: string,
  category: TokenCategory,
  tier: TokenTier = 'semantic'
): TokenAlias {
  return {
    id: `alias_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    targetTokenId,
    category,
    tier,
  };
}

/**
 * Resolve alias to its target token
 */
export function resolveAlias(
  alias: TokenAlias,
  tokens: DesignToken[] = allDesignTokens
): DesignToken | undefined {
  return tokens.find(t => t.id === alias.targetTokenId);
}

/**
 * Get the full alias chain (alias -> target -> target's target, etc.)
 */
export function getAliasChain(
  startTokenId: string,
  tokens: DesignToken[] = allDesignTokens,
  maxDepth: number = 10
): string[] {
  const chain: string[] = [startTokenId];
  let currentToken = getTokenById(startTokenId);
  let depth = 0;

  while (currentToken?.reference && depth < maxDepth) {
    if (chain.includes(currentToken.reference)) {
      // Circular reference detected
      break;
    }
    chain.push(currentToken.reference);
    currentToken = getTokenById(currentToken.reference);
    depth++;
  }

  return chain;
}

// =============================================================================
// TOKEN MATH OPERATIONS
// =============================================================================

/**
 * Parse a numeric value from a token value string
 */
export function parseNumericValue(value: string | number): {
  number: number;
  unit: string;
} {
  if (typeof value === 'number') {
    return { number: value, unit: '' };
  }

  const match = value.match(/^(-?[\d.]+)(.*)$/);
  if (match) {
    return {
      number: parseFloat(match[1]),
      unit: match[2] || '',
    };
  }

  return { number: 0, unit: '' };
}

/**
 * Perform math operation on a token value
 */
export function performMathOperation(
  value: string | number,
  operation: MathOperation
): string | number {
  const parsed = parseNumericValue(value);
  let operandNum: number;

  if (typeof operation.operand === 'string') {
    operandNum = parseNumericValue(operation.operand).number;
  } else {
    operandNum = operation.operand;
  }

  let result: number;

  switch (operation.type) {
    case 'add':
      result = parsed.number + operandNum;
      break;
    case 'subtract':
      result = parsed.number - operandNum;
      break;
    case 'multiply':
      result = parsed.number * operandNum;
      break;
    case 'divide':
      result = operandNum !== 0 ? parsed.number / operandNum : parsed.number;
      break;
    case 'modulo':
      result = parsed.number % operandNum;
      break;
    default:
      result = parsed.number;
  }

  return parsed.unit ? `${result}${parsed.unit}` : result;
}

/**
 * Evaluate a math expression with token values
 */
export function evaluateMathExpression(
  expression: string,
  tokens: DesignToken[] = allDesignTokens,
  options: ResolveOptions = {}
): string | number {
  // First, resolve all token references
  const resolvedExpr = resolveAllReferences(expression, tokens, options);

  // Simple math parser for expressions like "16px + 8px" or "2 * 1rem"
  const mathPattern = /^([\d.]+)([a-z%]*)\s*([+\-*\/])\s*([\d.]+)([a-z%]*)$/i;
  const match = resolvedExpr.match(mathPattern);

  if (match) {
    const [, num1, unit1, operator, num2, unit2] = match;
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);
    const unit = unit1 || unit2;

    let result: number;
    switch (operator) {
      case '+':
        result = n1 + n2;
        break;
      case '-':
        result = n1 - n2;
        break;
      case '*':
        result = n1 * n2;
        break;
      case '/':
        result = n2 !== 0 ? n1 / n2 : n1;
        break;
      default:
        result = n1;
    }

    return unit ? `${result}${unit}` : result;
  }

  return resolvedExpr;
}

/**
 * Scale a token value by a factor
 */
export function scaleTokenValue(
  value: string | number,
  factor: number
): string | number {
  return performMathOperation(value, { type: 'multiply', operand: factor });
}

// =============================================================================
// TOKEN INTERPOLATION
// =============================================================================

/**
 * Generate interpolated values between two token values
 */
export function interpolateValues(
  options: InterpolationOptions
): (string | number)[] {
  const { start, end, steps, easing = 'linear' } = options;
  const startParsed = parseNumericValue(start);
  const endParsed = parseNumericValue(end);

  const values: (string | number)[] = [];

  for (let i = 0; i <= steps; i++) {
    let t = i / steps;

    // Apply easing
    switch (easing) {
      case 'ease-in':
        t = t * t;
        break;
      case 'ease-out':
        t = 1 - Math.pow(1 - t, 2);
        break;
      case 'ease-in-out':
        t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        break;
      // linear is default, no transformation needed
    }

    const interpolatedNum = startParsed.number + (endParsed.number - startParsed.number) * t;
    const unit = startParsed.unit || endParsed.unit;

    values.push(unit ? `${interpolatedNum}${unit}` : interpolatedNum);
  }

  return values;
}

/**
 * Interpolate colors (returns intermediate hex colors)
 */
export function interpolateColors(
  startColor: string,
  endColor: string,
  steps: number
): string[] {
  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);

  if (!start || !end) {
    return [startColor, endColor];
  }

  const colors: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;

    const r = Math.round(start.r + (end.r - start.r) * t);
    const g = Math.round(start.g + (end.g - start.g) * t);
    const b = Math.round(start.b + (end.b - start.b) * t);

    colors.push(rgbToHex(r, g, b));
  }

  return colors;
}

// =============================================================================
// FALLBACK HANDLING
// =============================================================================

export interface FallbackChain {
  primary: string;
  fallbacks: string[];
}

/**
 * Create a CSS value with fallbacks
 */
export function createFallbackValue(chain: FallbackChain): string {
  const values = [chain.primary, ...chain.fallbacks];
  return values.join(', ');
}

/**
 * Create a CSS var() with fallback
 */
export function createCssVarWithFallback(
  varName: string,
  fallback: string
): string {
  return `var(${varName}, ${fallback})`;
}

/**
 * Resolve token with fallback chain
 */
export function resolveWithFallbacks(
  tokenIds: string[],
  tokens: DesignToken[] = allDesignTokens,
  options: ResolveOptions = {}
): string | number | undefined {
  for (const id of tokenIds) {
    const token = getTokenById(id);
    if (token) {
      return resolveTokenValue(token, options);
    }
  }
  return options.fallback;
}

// =============================================================================
// DARK MODE SWITCHING
// =============================================================================

export interface ThemeSwitchResult {
  lightValue: string | number;
  darkValue: string | number;
  hasDarkVariant: boolean;
}

/**
 * Get both light and dark values for a token
 */
export function getThemeValues(token: DesignToken): ThemeSwitchResult {
  return {
    lightValue: token.value.value,
    darkValue: token.value.darkValue ?? token.value.value,
    hasDarkVariant: token.value.darkValue !== undefined,
  };
}

/**
 * Get token value for specific color scheme
 */
export function getTokenForScheme(
  tokenId: string,
  scheme: ColorScheme,
  tokens: DesignToken[] = allDesignTokens
): string | number | undefined {
  const token = getTokenById(tokenId);
  if (!token) return undefined;

  return resolveTokenValue(token, { colorScheme: scheme });
}

/**
 * Create CSS for dark mode switching
 */
export function createDarkModeCSS(
  tokens: DesignToken[],
  options: { useMediaQuery?: boolean; useClass?: boolean } = {}
): string {
  const { useMediaQuery = true, useClass = true } = options;
  const darkTokens = tokens.filter(t => t.value.darkValue !== undefined);

  if (darkTokens.length === 0) return '';

  const lines: string[] = [];

  // Media query version
  if (useMediaQuery) {
    lines.push('@media (prefers-color-scheme: dark) {');
    lines.push('  :root {');
    for (const token of darkTokens) {
      const varName = tokenToCssVarName(token);
      lines.push(`    ${varName}: ${token.value.darkValue};`);
    }
    lines.push('  }');
    lines.push('}');
    lines.push('');
  }

  // Class version
  if (useClass) {
    lines.push('.dark {');
    for (const token of darkTokens) {
      const varName = tokenToCssVarName(token);
      lines.push(`  ${varName}: ${token.value.darkValue};`);
    }
    lines.push('}');
  }

  return lines.join('\n');
}

// =============================================================================
// DEPENDENCY ANALYSIS
// =============================================================================

/**
 * Get all dependencies for a token
 */
export function getTokenDependencies(
  token: DesignToken,
  tokens: DesignToken[] = allDesignTokens
): TokenDependency {
  const dependsOn: string[] = [];
  const dependedBy: string[] = [];

  // Check what this token depends on
  if (token.reference) {
    dependsOn.push(token.reference);
  }

  // Check what depends on this token
  for (const t of tokens) {
    if (t.reference === token.id) {
      dependedBy.push(t.id);
    }
  }

  return {
    tokenId: token.id,
    dependsOn,
    dependedBy,
  };
}

/**
 * Build full dependency graph for all tokens
 */
export function buildDependencyGraph(
  tokens: DesignToken[] = allDesignTokens
): Map<string, TokenDependency> {
  const graph = new Map<string, TokenDependency>();

  for (const token of tokens) {
    graph.set(token.id, getTokenDependencies(token, tokens));
  }

  return graph;
}

/**
 * Get tokens in topological order (dependencies first)
 */
export function getTopologicalOrder(
  tokens: DesignToken[] = allDesignTokens
): DesignToken[] {
  const graph = buildDependencyGraph(tokens);
  const visited = new Set<string>();
  const result: DesignToken[] = [];

  function visit(tokenId: string) {
    if (visited.has(tokenId)) return;
    visited.add(tokenId);

    const deps = graph.get(tokenId);
    if (deps) {
      for (const depId of deps.dependsOn) {
        visit(depId);
      }
    }

    const token = getTokenById(tokenId);
    if (token) {
      result.push(token);
    }
  }

  for (const token of tokens) {
    visit(token.id);
  }

  return result;
}

/**
 * Detect circular references in tokens
 */
export function detectCircularReferences(
  tokens: DesignToken[] = allDesignTokens
): string[][] {
  const circles: string[][] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();

  function dfs(tokenId: string, path: string[]): boolean {
    if (visiting.has(tokenId)) {
      const circleStart = path.indexOf(tokenId);
      circles.push(path.slice(circleStart));
      return true;
    }

    if (visited.has(tokenId)) return false;

    visiting.add(tokenId);
    path.push(tokenId);

    const token = getTokenById(tokenId);
    if (token?.reference) {
      dfs(token.reference, [...path]);
    }

    visiting.delete(tokenId);
    visited.add(tokenId);

    return false;
  }

  for (const token of tokens) {
    if (!visited.has(token.id)) {
      dfs(token.id, []);
    }
  }

  return circles;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const expandedHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expandedHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, n)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// =============================================================================
// TOKEN SEARCH AND FILTERING
// =============================================================================

export interface TokenSearchOptions {
  query?: string;
  categories?: TokenCategory[];
  tiers?: TokenTier[];
  hasReference?: boolean;
  hasDarkValue?: boolean;
}

/**
 * Search and filter tokens
 */
export function searchTokens(
  tokens: DesignToken[],
  options: TokenSearchOptions
): DesignToken[] {
  let results = [...tokens];

  if (options.query) {
    const query = options.query.toLowerCase();
    results = results.filter(
      t =>
        t.name.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query) ||
        t.path.some(p => p.toLowerCase().includes(query)) ||
        t.metadata?.description?.toLowerCase().includes(query)
    );
  }

  if (options.categories && options.categories.length > 0) {
    results = results.filter(t => options.categories!.includes(t.category));
  }

  if (options.tiers && options.tiers.length > 0) {
    results = results.filter(t => options.tiers!.includes(t.tier));
  }

  if (options.hasReference !== undefined) {
    results = results.filter(t => (t.reference !== undefined) === options.hasReference);
  }

  if (options.hasDarkValue !== undefined) {
    results = results.filter(
      t => (t.value.darkValue !== undefined) === options.hasDarkValue
    );
  }

  return results;
}

/**
 * Find tokens that use a specific token
 */
export function findTokenUsages(
  tokenId: string,
  tokens: DesignToken[] = allDesignTokens
): DesignToken[] {
  return tokens.filter(t => t.reference === tokenId);
}

/**
 * Replace token usage across all tokens
 */
export function replaceTokenUsage(
  oldTokenId: string,
  newTokenId: string,
  tokens: DesignToken[]
): DesignToken[] {
  return tokens.map(t => {
    if (t.reference === oldTokenId) {
      return { ...t, reference: newTokenId };
    }
    return t;
  });
}

// =============================================================================
// CSS VARIABLE HELPERS
// =============================================================================

/**
 * Generate CSS variable usage string
 */
export function generateCssVarUsage(
  token: DesignToken,
  fallback?: string
): string {
  const varName = tokenToCssVarName(token);
  return fallback ? `var(${varName}, ${fallback})` : `var(${varName})`;
}

/**
 * Generate all CSS variables for tokens
 */
export function generateAllCssVariables(
  tokens: DesignToken[],
  options: ResolveOptions = {}
): Record<string, string> {
  const variables: Record<string, string> = {};

  for (const token of tokens) {
    const varName = tokenToCssVarName(token);
    const value = resolveTokenValue(token, options);
    variables[varName] = String(value);
  }

  return variables;
}
