/**
 * Semantic HTML Helpers
 *
 * Utilities for generating proper semantic HTML structure,
 * managing heading levels, and ensuring accessible markup.
 */

import type { BuilderElement } from '@/types/builder';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

/**
 * Semantic HTML5 element types
 */
export type SemanticElement =
  | 'article'
  | 'aside'
  | 'details'
  | 'figcaption'
  | 'figure'
  | 'footer'
  | 'header'
  | 'main'
  | 'mark'
  | 'nav'
  | 'section'
  | 'summary'
  | 'time'
  | 'address'
  | 'blockquote'
  | 'cite'
  | 'code'
  | 'pre'
  | 'abbr'
  | 'dfn'
  | 'kbd'
  | 'samp'
  | 'var';

/**
 * Heading levels
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * List type
 */
export type ListType = 'ordered' | 'unordered' | 'description';

/**
 * Table cell type
 */
export type CellType = 'header' | 'data';

/**
 * Semantic suggestion for a component
 */
export interface SemanticSuggestion {
  currentTag: string;
  suggestedTag: SemanticElement | string;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Heading context for tracking hierarchy
 */
export interface HeadingContext {
  currentLevel: HeadingLevel;
  parentLevel: HeadingLevel | null;
  path: HeadingLevel[];
}

/**
 * Table accessibility configuration
 */
export interface TableA11yConfig {
  caption?: string;
  summary?: string;
  hasRowHeaders?: boolean;
  hasColumnHeaders?: boolean;
  scope?: 'row' | 'col' | 'rowgroup' | 'colgroup';
}

/**
 * Form structure configuration
 */
export interface FormStructureConfig {
  legend?: string;
  errorSummaryId?: string;
  describedBy?: string[];
  autocomplete?: boolean;
}

// ============================================================================
// SEMANTIC TAG MAPPING
// ============================================================================

/**
 * Maps component types to semantic HTML elements
 */
export const COMPONENT_TO_SEMANTIC: Record<string, string> = {
  // Sections
  'hero-section': 'header',
  'hero-with-image': 'header',
  'feature-section': 'section',
  'cta-section': 'section',
  'stats-section': 'section',
  'testimonials-section': 'section',
  'team-section': 'section',
  'faq-section': 'section',
  'pricing-section': 'section',
  'contact-section': 'section',

  // Navigation
  navbar: 'nav',
  'mobile-menu': 'nav',
  footer: 'footer',
  breadcrumb: 'nav',

  // Content
  'simple-card': 'article',
  'product-card': 'article',
  'pricing-card': 'article',
  'testimonial-card': 'blockquote',
  'profile-card': 'article',
  'blog-card': 'article',
  'feature-card': 'article',

  // Media
  'image-card': 'figure',
  'stats-card': 'figure',
  image: 'img',
  avatar: 'img',
  video: 'video',

  // Text
  heading: 'h2',
  paragraph: 'p',
  link: 'a',
  list: 'ul',

  // Layout
  container: 'div',
  'grid-2-col': 'div',
  'grid-3-col': 'div',
  'grid-4-col': 'div',
  'flex-row': 'div',
  'flex-column': 'div',
  divider: 'hr',
  spacer: 'div',

  // Forms
  'input-field': 'input',
  textarea: 'textarea',
  'select-dropdown': 'select',
  checkbox: 'input',
  'radio-group': 'fieldset',
  'toggle-switch': 'input',
  'login-form': 'form',
  'signup-form': 'form',
  'contact-form': 'form',
  'search-bar': 'search',
  'newsletter-form': 'form',
  'file-upload': 'input',

  // Buttons
  'primary-button': 'button',
  'secondary-button': 'button',
  'outline-button': 'button',
  'ghost-button': 'button',
  'icon-button': 'button',
  'loading-button': 'button',
  'gradient-button': 'button',
  'button-group': 'div',
};

/**
 * Gets the semantic HTML tag for a component type
 */
export function getSemanticTag(componentType: string): string {
  return COMPONENT_TO_SEMANTIC[componentType] || 'div';
}

// ============================================================================
// SEMANTIC TAG SUGGESTIONS
// ============================================================================

/**
 * Analyzes component content and suggests semantic elements
 */
export function suggestSemanticTags(element: BuilderElement): SemanticSuggestion[] {
  const suggestions: SemanticSuggestion[] = [];
  const currentTag = getSemanticTag(element.type);
  const props = element.props;
  const name = element.name.toLowerCase();

  // Check for navigation-like content
  if (
    currentTag === 'div' &&
    (name.includes('nav') || name.includes('menu') || name.includes('links'))
  ) {
    suggestions.push({
      currentTag,
      suggestedTag: 'nav',
      reason: 'Element appears to be navigation based on naming',
      confidence: 'medium',
    });
  }

  // Check for article-like content
  if (
    currentTag === 'div' &&
    (name.includes('post') || name.includes('article') || name.includes('blog'))
  ) {
    suggestions.push({
      currentTag,
      suggestedTag: 'article',
      reason: 'Element appears to be an article based on naming',
      confidence: 'medium',
    });
  }

  // Check for aside/sidebar content
  if (
    currentTag === 'div' &&
    (name.includes('sidebar') || name.includes('aside') || name.includes('widget'))
  ) {
    suggestions.push({
      currentTag,
      suggestedTag: 'aside',
      reason: 'Element appears to be complementary content',
      confidence: 'medium',
    });
  }

  // Check for header content
  if (
    currentTag === 'div' &&
    (name.includes('header') || name.includes('hero') || name.includes('banner'))
  ) {
    suggestions.push({
      currentTag,
      suggestedTag: 'header',
      reason: 'Element appears to be header/banner content',
      confidence: 'medium',
    });
  }

  // Check for footer content
  if (currentTag === 'div' && name.includes('footer')) {
    suggestions.push({
      currentTag,
      suggestedTag: 'footer',
      reason: 'Element appears to be footer content',
      confidence: 'high',
    });
  }

  // Check for section content with heading
  if (
    currentTag === 'div' &&
    element.children.some((child) => child.type === 'heading')
  ) {
    suggestions.push({
      currentTag,
      suggestedTag: 'section',
      reason: 'Container with heading should be a section',
      confidence: 'high',
    });
  }

  // Check for figure content (image with caption)
  if (
    currentTag === 'div' &&
    element.children.some(
      (child) => child.type === 'image' || child.type === 'avatar'
    ) &&
    element.children.some(
      (child) => child.type === 'paragraph' || (props.caption && props.caption.length > 0)
    )
  ) {
    suggestions.push({
      currentTag,
      suggestedTag: 'figure',
      reason: 'Image with caption should use figure element',
      confidence: 'high',
    });
  }

  // Check for blockquote content
  if (
    (currentTag === 'div' || currentTag === 'article') &&
    (name.includes('quote') ||
      name.includes('testimonial') ||
      props.citation ||
      props.author)
  ) {
    suggestions.push({
      currentTag,
      suggestedTag: 'blockquote',
      reason: 'Quotation content should use blockquote element',
      confidence: 'high',
    });
  }

  // Check for time content
  if (props.date || props.datetime || props.timestamp) {
    suggestions.push({
      currentTag,
      suggestedTag: 'time',
      reason: 'Date/time content should use time element with datetime attribute',
      confidence: 'high',
    });
  }

  // Check for address content
  if (name.includes('address') || props.address || props.contact) {
    suggestions.push({
      currentTag,
      suggestedTag: 'address',
      reason: 'Contact information should use address element',
      confidence: 'medium',
    });
  }

  // Check for code content
  if (props.code || name.includes('code') || name.includes('snippet')) {
    suggestions.push({
      currentTag,
      suggestedTag: 'code',
      reason: 'Code content should use code element',
      confidence: 'high',
    });
  }

  // Check for main content
  if (name.includes('main-content') || name.includes('primary-content')) {
    suggestions.push({
      currentTag,
      suggestedTag: 'main',
      reason: 'Primary page content should use main element',
      confidence: 'high',
    });
  }

  return suggestions;
}

/**
 * Generates semantic wrapper for an element
 */
export function generateSemanticWrapper(
  element: BuilderElement,
  suggestion: SemanticSuggestion
): string {
  const tag = suggestion.suggestedTag;
  const ariaLabel = element.props['aria-label'] || element.name;

  switch (tag) {
    case 'nav':
      return `<nav aria-label="${ariaLabel}">`;
    case 'section':
      return `<section aria-labelledby="${element.id}-heading">`;
    case 'article':
      return `<article>`;
    case 'aside':
      return `<aside aria-label="${ariaLabel}">`;
    case 'figure':
      return `<figure>`;
    case 'blockquote':
      return `<blockquote cite="${element.props.citation || ''}">`;
    case 'time':
      return `<time datetime="${element.props.datetime || ''}">`;
    case 'main':
      return `<main id="main-content">`;
    case 'header':
      return `<header>`;
    case 'footer':
      return `<footer>`;
    default:
      return `<${tag}>`;
  }
}

// ============================================================================
// HEADING LEVEL MANAGEMENT
// ============================================================================

/**
 * Creates a new heading context
 */
export function createHeadingContext(startLevel: HeadingLevel = 1): HeadingContext {
  return {
    currentLevel: startLevel,
    parentLevel: null,
    path: [startLevel],
  };
}

/**
 * Gets the next valid heading level
 */
export function getNextHeadingLevel(context: HeadingContext): HeadingLevel {
  const nextLevel = Math.min(context.currentLevel + 1, 6) as HeadingLevel;
  return nextLevel;
}

/**
 * Gets the appropriate heading level for nesting
 */
export function getNestedHeadingLevel(
  parentLevel: HeadingLevel | null,
  isFirstInSection: boolean
): HeadingLevel {
  if (parentLevel === null) return 1;
  if (isFirstInSection) return Math.min(parentLevel + 1, 6) as HeadingLevel;
  return parentLevel;
}

/**
 * Validates heading level transition
 */
export function validateHeadingLevel(
  currentLevel: HeadingLevel,
  newLevel: HeadingLevel
): { isValid: boolean; suggestion?: HeadingLevel; reason?: string } {
  // Can't skip levels going down
  if (newLevel > currentLevel + 1) {
    return {
      isValid: false,
      suggestion: (currentLevel + 1) as HeadingLevel,
      reason: `Heading level skipped from h${currentLevel} to h${newLevel}. Use h${currentLevel + 1} instead.`,
    };
  }

  // Can skip levels going up (e.g., from h4 back to h2)
  return { isValid: true };
}

/**
 * Analyzes heading structure in elements
 */
export function analyzeHeadingStructure(elements: BuilderElement[]): {
  levels: HeadingLevel[];
  issues: string[];
  suggestions: string[];
} {
  const levels: HeadingLevel[] = [];
  const issues: string[] = [];
  const suggestions: string[] = [];

  function traverseElements(
    elements: BuilderElement[],
    expectedLevel: HeadingLevel
  ): void {
    for (const element of elements) {
      if (element.type === 'heading') {
        const level = parseInt(element.props.level || '2', 10) as HeadingLevel;
        levels.push(level);

        // Check for skipped levels
        const lastLevel = levels[levels.length - 2] || 1;
        if (level > lastLevel + 1) {
          issues.push(
            `Heading level skipped: h${level} follows h${lastLevel} in "${element.name}"`
          );
          suggestions.push(
            `Change "${element.name}" to h${lastLevel + 1}`
          );
        }

        // Check for multiple h1s
        if (level === 1 && levels.filter((l) => l === 1).length > 1) {
          issues.push('Multiple h1 headings found');
          suggestions.push('Use only one h1 per page and use h2 for subsections');
        }
      }

      if (element.children.length > 0) {
        traverseElements(element.children, expectedLevel);
      }
    }
  }

  traverseElements(elements, 1);

  // Check if page starts with h1
  if (levels.length > 0 && levels[0] !== 1) {
    issues.push('Page does not start with h1');
    suggestions.push('Add an h1 heading as the first heading');
  }

  return { levels, issues, suggestions };
}

/**
 * Generates heading level fix for an element
 */
export function generateHeadingFix(
  element: BuilderElement,
  correctLevel: HeadingLevel
): { props: Record<string, unknown> } {
  return {
    props: {
      ...element.props,
      level: String(correctLevel),
    },
  };
}

// ============================================================================
// LIST STRUCTURE HELPERS
// ============================================================================

/**
 * Generates accessible list markup
 */
export function generateListMarkup(
  items: string[],
  type: ListType = 'unordered',
  options: {
    ariaLabel?: string;
    nested?: boolean;
    startNumber?: number;
  } = {}
): string {
  const { ariaLabel, nested = false, startNumber = 1 } = options;

  const tag = type === 'ordered' ? 'ol' : type === 'description' ? 'dl' : 'ul';
  const ariaAttr = ariaLabel ? ` aria-label="${ariaLabel}"` : '';
  const startAttr = type === 'ordered' && startNumber !== 1 ? ` start="${startNumber}"` : '';
  const roleAttr = nested ? ' role="list"' : '';

  if (type === 'description') {
    const dlItems = items
      .map((item, index) => {
        const [term, desc] = item.split(':').map((s) => s.trim());
        return `  <dt>${term}</dt>\n  <dd>${desc || ''}</dd>`;
      })
      .join('\n');

    return `<dl${ariaAttr}${roleAttr}>\n${dlItems}\n</dl>`;
  }

  const listItems = items
    .map((item) => `  <li>${item}</li>`)
    .join('\n');

  return `<${tag}${ariaAttr}${startAttr}${roleAttr}>\n${listItems}\n</${tag}>`;
}

/**
 * Validates list structure
 */
export function validateListStructure(element: BuilderElement): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (element.type !== 'list') {
    return { isValid: true, issues };
  }

  const items = element.props.items || [];

  // Check for empty list
  if (items.length === 0) {
    issues.push('List is empty');
  }

  // Check for non-list item children in list
  for (const child of element.children) {
    if (!['list-item', 'li'].includes(child.type)) {
      issues.push(`Non-list-item child found: ${child.type}`);
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

// ============================================================================
// TABLE ACCESSIBILITY
// ============================================================================

/**
 * Generates accessible table markup
 */
export function generateAccessibleTableMarkup(
  data: { headers: string[]; rows: string[][] },
  config: TableA11yConfig = {}
): string {
  const { caption, summary, hasRowHeaders = false, hasColumnHeaders = true, scope } = config;

  let html = '<table>';

  // Add caption
  if (caption) {
    html += `\n  <caption>${caption}</caption>`;
  }

  // Add summary (aria-describedby pattern)
  if (summary) {
    html = `<p id="table-summary" class="sr-only">${summary}</p>\n${html}`;
    html = html.replace('<table>', `<table aria-describedby="table-summary">`);
  }

  // Add column headers
  if (hasColumnHeaders && data.headers.length > 0) {
    html += '\n  <thead>\n    <tr>';
    for (const header of data.headers) {
      const scopeAttr = scope === 'col' ? ' scope="col"' : '';
      html += `\n      <th${scopeAttr}>${header}</th>`;
    }
    html += '\n    </tr>\n  </thead>';
  }

  // Add body
  html += '\n  <tbody>';
  for (const row of data.rows) {
    html += '\n    <tr>';
    for (let i = 0; i < row.length; i++) {
      if (hasRowHeaders && i === 0) {
        const scopeAttr = scope === 'row' ? ' scope="row"' : '';
        html += `\n      <th${scopeAttr}>${row[i]}</th>`;
      } else {
        html += `\n      <td>${row[i]}</td>`;
      }
    }
    html += '\n    </tr>';
  }
  html += '\n  </tbody>';

  html += '\n</table>';

  return html;
}

/**
 * Validates table accessibility
 */
export function validateTableAccessibility(element: BuilderElement): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  const props = element.props;

  // Check for caption
  if (!props.caption) {
    issues.push('Table missing caption');
    suggestions.push('Add a caption to describe the table content');
  }

  // Check for headers
  if (!props.headers || props.headers.length === 0) {
    issues.push('Table missing column headers');
    suggestions.push('Add header cells (th) to identify columns');
  }

  // Check for scope on headers
  const hasScope = props.headerScope !== undefined;
  if (!hasScope) {
    issues.push('Table headers missing scope attribute');
    suggestions.push('Add scope="col" or scope="row" to header cells');
  }

  // Check for summary on complex tables
  const isComplexTable =
    props.rows?.length > 5 || props.headers?.length > 3 || props.hasNestedHeaders;
  if (isComplexTable && !props.summary) {
    issues.push('Complex table should have a summary');
    suggestions.push(
      'Add aria-describedby with a description of the table structure'
    );
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
  };
}

/**
 * Generates table header cell
 */
export function generateTableHeader(
  content: string,
  options: {
    scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
    abbr?: string;
    colspan?: number;
    rowspan?: number;
    id?: string;
  } = {}
): string {
  const { scope = 'col', abbr, colspan, rowspan, id } = options;

  let attrs = `scope="${scope}"`;
  if (abbr) attrs += ` abbr="${abbr}"`;
  if (colspan && colspan > 1) attrs += ` colspan="${colspan}"`;
  if (rowspan && rowspan > 1) attrs += ` rowspan="${rowspan}"`;
  if (id) attrs += ` id="${id}"`;

  return `<th ${attrs}>${content}</th>`;
}

/**
 * Generates table data cell
 */
export function generateTableCell(
  content: string,
  options: {
    headers?: string[];
    colspan?: number;
    rowspan?: number;
  } = {}
): string {
  const { headers, colspan, rowspan } = options;

  let attrs = '';
  if (headers && headers.length > 0) attrs += ` headers="${headers.join(' ')}"`;
  if (colspan && colspan > 1) attrs += ` colspan="${colspan}"`;
  if (rowspan && rowspan > 1) attrs += ` rowspan="${rowspan}"`;

  return `<td${attrs}>${content}</td>`;
}

// ============================================================================
// FORM STRUCTURE HELPERS
// ============================================================================

/**
 * Generates accessible form structure
 */
export function generateAccessibleFormStructure(
  fields: { name: string; label: string; type: string; required?: boolean }[],
  config: FormStructureConfig = {}
): string {
  const { legend, errorSummaryId, describedBy = [], autocomplete = true } = config;

  let html = '<form';
  if (!autocomplete) html += ' autocomplete="off"';
  if (describedBy.length > 0) html += ` aria-describedby="${describedBy.join(' ')}"`;
  html += '>';

  // Error summary placeholder
  if (errorSummaryId) {
    html += `\n  <div id="${errorSummaryId}" role="alert" aria-live="polite"></div>`;
  }

  // Fieldset with legend for grouped fields
  if (legend) {
    html += `\n  <fieldset>\n    <legend>${legend}</legend>`;
  }

  // Generate fields
  for (const field of fields) {
    const id = `field-${field.name}`;
    const errorId = `${id}-error`;
    const required = field.required ? ' aria-required="true"' : '';

    html += `\n    <div class="form-field">`;
    html += `\n      <label for="${id}">${field.label}${field.required ? ' <span aria-hidden="true">*</span>' : ''}</label>`;
    html += `\n      <input type="${field.type}" id="${id}" name="${field.name}"${required} aria-describedby="${errorId}" />`;
    html += `\n      <span id="${errorId}" class="error" role="alert"></span>`;
    html += `\n    </div>`;
  }

  if (legend) {
    html += '\n  </fieldset>';
  }

  html += '\n</form>';

  return html;
}

/**
 * Generates fieldset with legend
 */
export function generateFieldset(
  legend: string,
  content: string,
  options: {
    disabled?: boolean;
    describedBy?: string;
  } = {}
): string {
  const { disabled, describedBy } = options;

  let attrs = '';
  if (disabled) attrs += ' disabled';
  if (describedBy) attrs += ` aria-describedby="${describedBy}"`;

  return `<fieldset${attrs}>\n  <legend>${legend}</legend>\n  ${content}\n</fieldset>`;
}

/**
 * Generates accessible label-input pair
 */
export function generateLabelInputPair(
  label: string,
  inputType: string,
  name: string,
  options: {
    id?: string;
    required?: boolean;
    describedBy?: string;
    errorId?: string;
    helpText?: string;
    placeholder?: string;
  } = {}
): string {
  const { id = `input-${name}`, required, describedBy, errorId, helpText, placeholder } = options;

  const descIds: string[] = [];
  if (describedBy) descIds.push(describedBy);
  if (helpText) descIds.push(`${id}-help`);
  if (errorId) descIds.push(errorId);

  let html = '<div class="form-field">';

  // Label
  html += `\n  <label for="${id}">${label}`;
  if (required) {
    html += ' <span class="required" aria-hidden="true">*</span>';
  }
  html += '</label>';

  // Help text
  if (helpText) {
    html += `\n  <span id="${id}-help" class="help-text">${helpText}</span>`;
  }

  // Input
  let inputAttrs = `type="${inputType}" id="${id}" name="${name}"`;
  if (required) inputAttrs += ' aria-required="true" required';
  if (descIds.length > 0) inputAttrs += ` aria-describedby="${descIds.join(' ')}"`;
  if (placeholder) inputAttrs += ` placeholder="${placeholder}"`;

  html += `\n  <input ${inputAttrs} />`;

  // Error message slot
  if (errorId) {
    html += `\n  <span id="${errorId}" class="error-message" role="alert"></span>`;
  }

  html += '\n</div>';

  return html;
}

/**
 * Validates form structure
 */
export function validateFormStructure(element: BuilderElement): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  const formTypes = ['login-form', 'signup-form', 'contact-form', 'newsletter-form'];

  if (!formTypes.includes(element.type)) {
    return { isValid: true, issues, suggestions };
  }

  // Check for error handling
  if (!element.props.errorSummary && !element.props.errorSummaryId) {
    suggestions.push('Add an error summary region for form validation errors');
  }

  // Check children for proper labels
  for (const child of element.children) {
    const inputTypes = ['input-field', 'textarea', 'select-dropdown', 'checkbox'];
    if (inputTypes.includes(child.type)) {
      if (!child.props.label && !child.props['aria-label']) {
        issues.push(`Form input "${child.name}" missing label`);
      }
      if (child.props.required && !child.props['aria-required']) {
        suggestions.push(`Add aria-required to required field "${child.name}"`);
      }
    }
  }

  // Check for submit button
  const hasSubmitButton = element.children.some(
    (child) =>
      child.type.includes('button') &&
      (child.props.type === 'submit' || child.props.text?.toLowerCase().includes('submit'))
  );

  if (!hasSubmitButton) {
    suggestions.push('Add a submit button to the form');
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
  };
}

// ============================================================================
// GENERAL SEMANTIC UTILITIES
// ============================================================================

/**
 * Generates semantic landmark structure for a page
 */
export function generatePageLandmarks(config: {
  hasHeader?: boolean;
  hasNav?: boolean;
  hasMain?: boolean;
  hasAside?: boolean;
  hasFooter?: boolean;
  navLabel?: string;
  asideLabel?: string;
}): string {
  const { hasHeader = true, hasNav = true, hasMain = true, hasAside = false, hasFooter = true, navLabel = 'Main navigation', asideLabel = 'Sidebar' } = config;

  let html = '';

  if (hasHeader) {
    html += '<header>\n  <!-- Banner content -->\n</header>\n';
  }

  if (hasNav) {
    html += `<nav aria-label="${navLabel}">\n  <!-- Navigation links -->\n</nav>\n`;
  }

  if (hasMain) {
    html += '<main id="main-content">\n  <!-- Main content -->\n</main>\n';
  }

  if (hasAside) {
    html += `<aside aria-label="${asideLabel}">\n  <!-- Complementary content -->\n</aside>\n`;
  }

  if (hasFooter) {
    html += '<footer>\n  <!-- Footer content -->\n</footer>\n';
  }

  return html;
}

/**
 * Analyzes semantic structure of elements
 */
export function analyzeSemanticStructure(elements: BuilderElement[]): {
  hasMain: boolean;
  hasNav: boolean;
  hasHeader: boolean;
  hasFooter: boolean;
  landmarkCount: number;
  suggestions: SemanticSuggestion[];
} {
  const suggestions: SemanticSuggestion[] = [];
  let hasMain = false;
  let hasNav = false;
  let hasHeader = false;
  let hasFooter = false;
  let landmarkCount = 0;

  function analyzeElement(element: BuilderElement): void {
    const semanticTag = getSemanticTag(element.type);
    const elementSuggestions = suggestSemanticTags(element);
    suggestions.push(...elementSuggestions);

    if (semanticTag === 'main' || element.props.role === 'main') {
      hasMain = true;
      landmarkCount++;
    }
    if (semanticTag === 'nav' || element.props.role === 'navigation') {
      hasNav = true;
      landmarkCount++;
    }
    if (semanticTag === 'header' || element.props.role === 'banner') {
      hasHeader = true;
      landmarkCount++;
    }
    if (semanticTag === 'footer' || element.props.role === 'contentinfo') {
      hasFooter = true;
      landmarkCount++;
    }

    for (const child of element.children) {
      analyzeElement(child);
    }
  }

  for (const element of elements) {
    analyzeElement(element);
  }

  return {
    hasMain,
    hasNav,
    hasHeader,
    hasFooter,
    landmarkCount,
    suggestions,
  };
}

export default {
  // Semantic mapping
  COMPONENT_TO_SEMANTIC,
  getSemanticTag,

  // Semantic suggestions
  suggestSemanticTags,
  generateSemanticWrapper,

  // Heading management
  createHeadingContext,
  getNextHeadingLevel,
  getNestedHeadingLevel,
  validateHeadingLevel,
  analyzeHeadingStructure,
  generateHeadingFix,

  // List helpers
  generateListMarkup,
  validateListStructure,

  // Table accessibility
  generateAccessibleTableMarkup,
  validateTableAccessibility,
  generateTableHeader,
  generateTableCell,

  // Form helpers
  generateAccessibleFormStructure,
  generateFieldset,
  generateLabelInputPair,
  validateFormStructure,

  // General utilities
  generatePageLandmarks,
  analyzeSemanticStructure,
};
