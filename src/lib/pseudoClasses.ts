/**
 * CSS Pseudo-Class and Pseudo-Element Handling
 *
 * Provides utilities for working with CSS pseudo-classes,
 * pseudo-elements, and their Tailwind CSS equivalents.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Categories of pseudo-classes
 */
export type PseudoClassCategory =
  | 'interactive'
  | 'structural'
  | 'form'
  | 'content'
  | 'language'
  | 'misc';

/**
 * Individual pseudo-class definition
 */
export interface PseudoClassDefinition {
  name: string;
  cssSelector: string;
  tailwindPrefix: string | null;
  category: PseudoClassCategory;
  description: string;
  browserSupport: 'full' | 'partial' | 'experimental';
  canNest?: boolean;
  example?: string;
}

/**
 * Pseudo-element definition
 */
export interface PseudoElementDefinition {
  name: string;
  cssSelector: string;
  tailwindPrefix: string | null;
  description: string;
  supportsContent: boolean;
  example?: string;
}

/**
 * State to CSS/Tailwind conversion result
 */
export interface ConversionResult {
  css: string;
  tailwind: string[];
  valid: boolean;
  warnings: string[];
}

/**
 * Parsed pseudo-class information
 */
export interface ParsedPseudoClass {
  name: string;
  argument?: string;
  isNegated: boolean;
  isValid: boolean;
}

// ============================================================================
// INTERACTIVE PSEUDO-CLASSES
// ============================================================================

export const INTERACTIVE_PSEUDO_CLASSES: PseudoClassDefinition[] = [
  {
    name: 'hover',
    cssSelector: ':hover',
    tailwindPrefix: 'hover',
    category: 'interactive',
    description: 'Element is being hovered with a pointing device',
    browserSupport: 'full',
    example: 'button:hover { background-color: blue; }',
  },
  {
    name: 'focus',
    cssSelector: ':focus',
    tailwindPrefix: 'focus',
    category: 'interactive',
    description: 'Element has received focus',
    browserSupport: 'full',
    example: 'input:focus { border-color: blue; }',
  },
  {
    name: 'focus-visible',
    cssSelector: ':focus-visible',
    tailwindPrefix: 'focus-visible',
    category: 'interactive',
    description: 'Element has focus and the user agent determines focus should be shown',
    browserSupport: 'full',
    example: 'button:focus-visible { outline: 2px solid blue; }',
  },
  {
    name: 'focus-within',
    cssSelector: ':focus-within',
    tailwindPrefix: 'focus-within',
    category: 'interactive',
    description: 'Element or any of its descendants has focus',
    browserSupport: 'full',
    example: 'form:focus-within { box-shadow: 0 0 0 2px blue; }',
  },
  {
    name: 'active',
    cssSelector: ':active',
    tailwindPrefix: 'active',
    category: 'interactive',
    description: 'Element is being activated (clicked/tapped)',
    browserSupport: 'full',
    example: 'button:active { transform: scale(0.98); }',
  },
  {
    name: 'visited',
    cssSelector: ':visited',
    tailwindPrefix: 'visited',
    category: 'interactive',
    description: 'Link has been visited',
    browserSupport: 'full',
    example: 'a:visited { color: purple; }',
  },
  {
    name: 'target',
    cssSelector: ':target',
    tailwindPrefix: 'target',
    category: 'interactive',
    description: 'Element is the target of the current URL fragment',
    browserSupport: 'full',
    example: '#section:target { background: yellow; }',
  },
];

// ============================================================================
// FORM-RELATED PSEUDO-CLASSES
// ============================================================================

export const FORM_PSEUDO_CLASSES: PseudoClassDefinition[] = [
  {
    name: 'disabled',
    cssSelector: ':disabled',
    tailwindPrefix: 'disabled',
    category: 'form',
    description: 'Form element is disabled',
    browserSupport: 'full',
    example: 'input:disabled { opacity: 0.5; }',
  },
  {
    name: 'enabled',
    cssSelector: ':enabled',
    tailwindPrefix: 'enabled',
    category: 'form',
    description: 'Form element is enabled',
    browserSupport: 'full',
    example: 'input:enabled { border-color: green; }',
  },
  {
    name: 'checked',
    cssSelector: ':checked',
    tailwindPrefix: 'checked',
    category: 'form',
    description: 'Checkbox or radio is checked',
    browserSupport: 'full',
    example: 'input:checked { background: blue; }',
  },
  {
    name: 'indeterminate',
    cssSelector: ':indeterminate',
    tailwindPrefix: 'indeterminate',
    category: 'form',
    description: 'Checkbox is in indeterminate state',
    browserSupport: 'full',
    example: 'input:indeterminate { background: gray; }',
  },
  {
    name: 'valid',
    cssSelector: ':valid',
    tailwindPrefix: 'valid',
    category: 'form',
    description: 'Form element passes validation',
    browserSupport: 'full',
    example: 'input:valid { border-color: green; }',
  },
  {
    name: 'invalid',
    cssSelector: ':invalid',
    tailwindPrefix: 'invalid',
    category: 'form',
    description: 'Form element fails validation',
    browserSupport: 'full',
    example: 'input:invalid { border-color: red; }',
  },
  {
    name: 'required',
    cssSelector: ':required',
    tailwindPrefix: 'required',
    category: 'form',
    description: 'Form element is required',
    browserSupport: 'full',
    example: 'input:required { border-left: 3px solid red; }',
  },
  {
    name: 'optional',
    cssSelector: ':optional',
    tailwindPrefix: 'optional',
    category: 'form',
    description: 'Form element is optional',
    browserSupport: 'full',
    example: 'input:optional { border-left: 3px solid gray; }',
  },
  {
    name: 'read-only',
    cssSelector: ':read-only',
    tailwindPrefix: 'read-only',
    category: 'form',
    description: 'Form element is read-only',
    browserSupport: 'full',
    example: 'input:read-only { background: #eee; }',
  },
  {
    name: 'read-write',
    cssSelector: ':read-write',
    tailwindPrefix: null,
    category: 'form',
    description: 'Form element is editable',
    browserSupport: 'full',
    example: 'input:read-write { background: white; }',
  },
  {
    name: 'placeholder-shown',
    cssSelector: ':placeholder-shown',
    tailwindPrefix: 'placeholder-shown',
    category: 'form',
    description: 'Input is showing placeholder text',
    browserSupport: 'full',
    example: 'input:placeholder-shown { border-style: dashed; }',
  },
  {
    name: 'autofill',
    cssSelector: ':autofill',
    tailwindPrefix: 'autofill',
    category: 'form',
    description: 'Input has been autofilled by browser',
    browserSupport: 'partial',
    example: 'input:autofill { background: #e8f0fe; }',
  },
  {
    name: 'default',
    cssSelector: ':default',
    tailwindPrefix: 'default',
    category: 'form',
    description: 'Form element is the default in a group',
    browserSupport: 'full',
    example: 'button:default { font-weight: bold; }',
  },
  {
    name: 'in-range',
    cssSelector: ':in-range',
    tailwindPrefix: null,
    category: 'form',
    description: 'Input value is within min/max range',
    browserSupport: 'full',
    example: 'input:in-range { border-color: green; }',
  },
  {
    name: 'out-of-range',
    cssSelector: ':out-of-range',
    tailwindPrefix: 'out-of-range',
    category: 'form',
    description: 'Input value is outside min/max range',
    browserSupport: 'full',
    example: 'input:out-of-range { border-color: red; }',
  },
];

// ============================================================================
// STRUCTURAL PSEUDO-CLASSES
// ============================================================================

export const STRUCTURAL_PSEUDO_CLASSES: PseudoClassDefinition[] = [
  {
    name: 'first-child',
    cssSelector: ':first-child',
    tailwindPrefix: 'first',
    category: 'structural',
    description: 'Element is the first child of its parent',
    browserSupport: 'full',
    example: 'li:first-child { font-weight: bold; }',
  },
  {
    name: 'last-child',
    cssSelector: ':last-child',
    tailwindPrefix: 'last',
    category: 'structural',
    description: 'Element is the last child of its parent',
    browserSupport: 'full',
    example: 'li:last-child { border-bottom: none; }',
  },
  {
    name: 'only-child',
    cssSelector: ':only-child',
    tailwindPrefix: 'only',
    category: 'structural',
    description: 'Element is the only child of its parent',
    browserSupport: 'full',
    example: 'p:only-child { margin: 0; }',
  },
  {
    name: 'first-of-type',
    cssSelector: ':first-of-type',
    tailwindPrefix: 'first-of-type',
    category: 'structural',
    description: 'Element is the first of its type among siblings',
    browserSupport: 'full',
    example: 'p:first-of-type { text-indent: 0; }',
  },
  {
    name: 'last-of-type',
    cssSelector: ':last-of-type',
    tailwindPrefix: 'last-of-type',
    category: 'structural',
    description: 'Element is the last of its type among siblings',
    browserSupport: 'full',
    example: 'p:last-of-type { margin-bottom: 0; }',
  },
  {
    name: 'only-of-type',
    cssSelector: ':only-of-type',
    tailwindPrefix: 'only-of-type',
    category: 'structural',
    description: 'Element is the only one of its type among siblings',
    browserSupport: 'full',
    example: 'img:only-of-type { display: block; }',
  },
  {
    name: 'nth-child',
    cssSelector: ':nth-child()',
    tailwindPrefix: null,
    category: 'structural',
    description: 'Element matches the given formula (an+b)',
    browserSupport: 'full',
    canNest: true,
    example: 'li:nth-child(2n) { background: #f5f5f5; }',
  },
  {
    name: 'nth-last-child',
    cssSelector: ':nth-last-child()',
    tailwindPrefix: null,
    category: 'structural',
    description: 'Element matches formula counting from end',
    browserSupport: 'full',
    canNest: true,
    example: 'li:nth-last-child(1) { font-weight: bold; }',
  },
  {
    name: 'nth-of-type',
    cssSelector: ':nth-of-type()',
    tailwindPrefix: null,
    category: 'structural',
    description: 'Element of type matches the given formula',
    browserSupport: 'full',
    canNest: true,
    example: 'p:nth-of-type(odd) { background: #f5f5f5; }',
  },
  {
    name: 'nth-last-of-type',
    cssSelector: ':nth-last-of-type()',
    tailwindPrefix: null,
    category: 'structural',
    description: 'Element of type matches formula from end',
    browserSupport: 'full',
    canNest: true,
    example: 'p:nth-last-of-type(1) { margin-bottom: 0; }',
  },
  {
    name: 'root',
    cssSelector: ':root',
    tailwindPrefix: null,
    category: 'structural',
    description: 'Root element of the document',
    browserSupport: 'full',
    example: ':root { --primary: blue; }',
  },
  {
    name: 'empty',
    cssSelector: ':empty',
    tailwindPrefix: 'empty',
    category: 'structural',
    description: 'Element has no children',
    browserSupport: 'full',
    example: 'div:empty { display: none; }',
  },
];

// ============================================================================
// CONTENT PSEUDO-CLASSES
// ============================================================================

export const CONTENT_PSEUDO_CLASSES: PseudoClassDefinition[] = [
  {
    name: 'not',
    cssSelector: ':not()',
    tailwindPrefix: null,
    category: 'content',
    description: 'Negation - element does not match the selector',
    browserSupport: 'full',
    canNest: true,
    example: 'button:not(:disabled) { cursor: pointer; }',
  },
  {
    name: 'has',
    cssSelector: ':has()',
    tailwindPrefix: 'has',
    category: 'content',
    description: 'Relational - element has a descendant matching selector',
    browserSupport: 'partial',
    canNest: true,
    example: 'article:has(img) { padding: 20px; }',
  },
  {
    name: 'is',
    cssSelector: ':is()',
    tailwindPrefix: null,
    category: 'content',
    description: 'Matches any selector in the list',
    browserSupport: 'full',
    canNest: true,
    example: ':is(h1, h2, h3) { margin-top: 20px; }',
  },
  {
    name: 'where',
    cssSelector: ':where()',
    tailwindPrefix: null,
    category: 'content',
    description: 'Like :is() but with zero specificity',
    browserSupport: 'full',
    canNest: true,
    example: ':where(article, section) p { line-height: 1.6; }',
  },
];

// ============================================================================
// PSEUDO-ELEMENTS
// ============================================================================

export const PSEUDO_ELEMENTS: PseudoElementDefinition[] = [
  {
    name: 'before',
    cssSelector: '::before',
    tailwindPrefix: 'before',
    description: 'Creates a pseudo-element before element content',
    supportsContent: true,
    example: '.icon::before { content: "\\2022"; }',
  },
  {
    name: 'after',
    cssSelector: '::after',
    tailwindPrefix: 'after',
    description: 'Creates a pseudo-element after element content',
    supportsContent: true,
    example: '.required::after { content: "*"; color: red; }',
  },
  {
    name: 'placeholder',
    cssSelector: '::placeholder',
    tailwindPrefix: 'placeholder',
    description: 'Placeholder text styling',
    supportsContent: false,
    example: 'input::placeholder { color: #999; }',
  },
  {
    name: 'selection',
    cssSelector: '::selection',
    tailwindPrefix: 'selection',
    description: 'Text selection styling',
    supportsContent: false,
    example: '::selection { background: blue; color: white; }',
  },
  {
    name: 'first-letter',
    cssSelector: '::first-letter',
    tailwindPrefix: 'first-letter',
    description: 'First letter of block element',
    supportsContent: false,
    example: 'p::first-letter { font-size: 2em; }',
  },
  {
    name: 'first-line',
    cssSelector: '::first-line',
    tailwindPrefix: 'first-line',
    description: 'First line of block element',
    supportsContent: false,
    example: 'p::first-line { font-weight: bold; }',
  },
  {
    name: 'marker',
    cssSelector: '::marker',
    tailwindPrefix: 'marker',
    description: 'List item marker (bullet/number)',
    supportsContent: false,
    example: 'li::marker { color: blue; }',
  },
  {
    name: 'file-selector-button',
    cssSelector: '::file-selector-button',
    tailwindPrefix: 'file',
    description: 'File input button',
    supportsContent: false,
    example: 'input[type="file"]::file-selector-button { background: blue; }',
  },
  {
    name: 'backdrop',
    cssSelector: '::backdrop',
    tailwindPrefix: 'backdrop',
    description: 'Backdrop of dialog or fullscreen element',
    supportsContent: false,
    example: 'dialog::backdrop { background: rgba(0,0,0,0.5); }',
  },
];

// ============================================================================
// NTH-CHILD PRESETS
// ============================================================================

export const NTH_CHILD_PRESETS = {
  odd: { formula: 'odd', description: 'Odd elements (1st, 3rd, 5th...)' },
  even: { formula: 'even', description: 'Even elements (2nd, 4th, 6th...)' },
  first3: { formula: '-n+3', description: 'First 3 elements' },
  last3: { formula: 'n+3', description: 'Last 3 elements' },
  every2nd: { formula: '2n', description: 'Every 2nd element' },
  every3rd: { formula: '3n', description: 'Every 3rd element' },
  every4th: { formula: '4n', description: 'Every 4th element' },
  skip1: { formula: 'n+2', description: 'All but first element' },
  skipLast1: { formula: '-n+last-1', description: 'All but last element' },
} as const;

// ============================================================================
// ALL PSEUDO-CLASSES COMBINED
// ============================================================================

export const ALL_PSEUDO_CLASSES: PseudoClassDefinition[] = [
  ...INTERACTIVE_PSEUDO_CLASSES,
  ...FORM_PSEUDO_CLASSES,
  ...STRUCTURAL_PSEUDO_CLASSES,
  ...CONTENT_PSEUDO_CLASSES,
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get pseudo-class definition by name
 */
export function getPseudoClass(name: string): PseudoClassDefinition | undefined {
  return ALL_PSEUDO_CLASSES.find(
    (pc) => pc.name === name || pc.cssSelector === `:${name}`
  );
}

/**
 * Get pseudo-element definition by name
 */
export function getPseudoElement(name: string): PseudoElementDefinition | undefined {
  return PSEUDO_ELEMENTS.find(
    (pe) => pe.name === name || pe.cssSelector === `::${name}`
  );
}

/**
 * Check if a pseudo-class has Tailwind support
 */
export function hasTailwindSupport(pseudoClass: string): boolean {
  const pc = getPseudoClass(pseudoClass);
  return pc?.tailwindPrefix !== null && pc?.tailwindPrefix !== undefined;
}

/**
 * Convert CSS pseudo-class selector to Tailwind prefix
 */
export function cssToTailwindPrefix(cssSelector: string): string | null {
  // Remove leading colon(s)
  const name = cssSelector.replace(/^:+/, '');
  const pc = getPseudoClass(name);
  return pc?.tailwindPrefix || null;
}

/**
 * Convert Tailwind prefix to CSS pseudo-class
 */
export function tailwindPrefixToCss(prefix: string): string | null {
  const pc = ALL_PSEUDO_CLASSES.find((p) => p.tailwindPrefix === prefix);
  if (pc) return pc.cssSelector;

  const pe = PSEUDO_ELEMENTS.find((p) => p.tailwindPrefix === prefix);
  if (pe) return pe.cssSelector;

  return null;
}

/**
 * Parse a pseudo-class string (e.g., "not(.disabled)")
 */
export function parsePseudoClass(input: string): ParsedPseudoClass {
  const isNegated = input.startsWith('not(') || input.startsWith(':not(');
  let name = input;
  let argument: string | undefined;

  // Handle functional pseudo-classes
  const match = input.match(/^:?(\w+(?:-\w+)*)\(([^)]*)\)$/);
  if (match) {
    name = match[1];
    argument = match[2];
  } else {
    name = input.replace(/^:+/, '');
  }

  const isValid = ALL_PSEUDO_CLASSES.some(
    (pc) => pc.name === name || (pc.canNest && name.startsWith(pc.name))
  );

  return {
    name,
    argument,
    isNegated,
    isValid,
  };
}

/**
 * Convert state configuration to CSS
 */
export function stateToCss(
  selector: string,
  pseudoClass: string,
  styles: Record<string, string>
): string {
  const pc = getPseudoClass(pseudoClass);
  const cssSelector = pc ? `${selector}${pc.cssSelector}` : `${selector}:${pseudoClass}`;

  const cssProperties = Object.entries(styles)
    .map(([prop, value]) => `  ${camelToKebab(prop)}: ${value};`)
    .join('\n');

  return `${cssSelector} {\n${cssProperties}\n}`;
}

/**
 * Convert state configuration to Tailwind classes
 */
export function stateToTailwind(
  pseudoClass: string,
  classes: string[]
): string[] {
  const pc = getPseudoClass(pseudoClass);
  if (!pc?.tailwindPrefix) {
    console.warn(`No Tailwind prefix for pseudo-class: ${pseudoClass}`);
    return classes;
  }

  return classes.map((cls) => `${pc.tailwindPrefix}:${cls}`);
}

/**
 * Generate CSS for multiple states
 */
export function generateStateCss(
  selector: string,
  states: Record<string, Record<string, string>>
): string {
  const cssBlocks: string[] = [];

  for (const [state, styles] of Object.entries(states)) {
    if (state === 'default') {
      const cssProperties = Object.entries(styles)
        .map(([prop, value]) => `  ${camelToKebab(prop)}: ${value};`)
        .join('\n');
      cssBlocks.push(`${selector} {\n${cssProperties}\n}`);
    } else {
      cssBlocks.push(stateToCss(selector, state, styles));
    }
  }

  return cssBlocks.join('\n\n');
}

/**
 * Generate Tailwind classes for multiple states
 */
export function generateStateTailwind(
  states: Record<string, string[]>
): string[] {
  const allClasses: string[] = [];

  for (const [state, classes] of Object.entries(states)) {
    if (state === 'default') {
      allClasses.push(...classes);
    } else {
      allClasses.push(...stateToTailwind(state, classes));
    }
  }

  return allClasses;
}

/**
 * Build a complete pseudo-class selector
 */
export function buildPseudoSelector(
  baseSelector: string,
  pseudoClass: string,
  argument?: string
): string {
  const pc = getPseudoClass(pseudoClass);

  if (pc?.canNest && argument) {
    return `${baseSelector}:${pseudoClass}(${argument})`;
  }

  return `${baseSelector}${pc?.cssSelector || `:${pseudoClass}`}`;
}

/**
 * Get pseudo-classes by category
 */
export function getPseudoClassesByCategory(
  category: PseudoClassCategory
): PseudoClassDefinition[] {
  return ALL_PSEUDO_CLASSES.filter((pc) => pc.category === category);
}

/**
 * Get all pseudo-classes that have Tailwind support
 */
export function getTailwindSupportedPseudoClasses(): PseudoClassDefinition[] {
  return ALL_PSEUDO_CLASSES.filter((pc) => pc.tailwindPrefix !== null);
}

/**
 * Get all pseudo-elements that have Tailwind support
 */
export function getTailwindSupportedPseudoElements(): PseudoElementDefinition[] {
  return PSEUDO_ELEMENTS.filter((pe) => pe.tailwindPrefix !== null);
}

/**
 * Validate if a pseudo-class combination is valid
 */
export function validatePseudoClassChain(chain: string[]): boolean {
  // Check for incompatible combinations
  const incompatible: string[][] = [
    ['first-child', 'last-child'],
    ['only-child', 'first-child'],
    ['only-child', 'last-child'],
    ['enabled', 'disabled'],
    ['valid', 'invalid'],
    ['required', 'optional'],
    ['read-only', 'read-write'],
    ['checked', 'indeterminate'],
  ];

  for (const [a, b] of incompatible) {
    if (chain.includes(a) && chain.includes(b)) {
      return false;
    }
  }

  return true;
}

/**
 * Convert camelCase to kebab-case
 */
function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Group state classes by pseudo-class prefix
 */
export function groupClassesByState(classes: string[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {
    default: [],
  };

  for (const cls of classes) {
    const colonIndex = cls.indexOf(':');
    if (colonIndex === -1) {
      grouped.default.push(cls);
      continue;
    }

    const prefix = cls.substring(0, colonIndex);
    const restOfClass = cls.substring(colonIndex + 1);

    // Check if prefix is a known pseudo-class
    const pc = ALL_PSEUDO_CLASSES.find((p) => p.tailwindPrefix === prefix);
    const pe = PSEUDO_ELEMENTS.find((p) => p.tailwindPrefix === prefix);

    if (pc || pe) {
      const stateName = pc?.name || pe?.name || prefix;
      if (!grouped[stateName]) {
        grouped[stateName] = [];
      }
      grouped[stateName].push(restOfClass);
    } else {
      // Could be responsive prefix or other modifier
      grouped.default.push(cls);
    }
  }

  return grouped;
}

/**
 * Create CSS variables for state colors
 */
export function createStateColorVariables(
  states: Record<string, { primary: string; secondary: string }>
): string {
  const vars = Object.entries(states)
    .map(
      ([state, colors]) =>
        `  --state-${state}-primary: ${colors.primary};\n  --state-${state}-secondary: ${colors.secondary};`
    )
    .join('\n');

  return `:root {\n${vars}\n}`;
}

/**
 * Generate a hover/focus group variant
 */
export function createGroupVariant(
  groupName: string,
  pseudoClass: string,
  classes: string[]
): string[] {
  return classes.map((cls) => `group-${pseudoClass}/${groupName}:${cls}`);
}

/**
 * Generate a peer variant
 */
export function createPeerVariant(
  peerName: string,
  pseudoClass: string,
  classes: string[]
): string[] {
  return classes.map((cls) => `peer-${pseudoClass}/${peerName}:${cls}`);
}
