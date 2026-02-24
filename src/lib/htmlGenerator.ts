/**
 * HTML Generator
 *
 * Converts BuilderElement tree to semantic HTML5 with proper accessibility,
 * SEO-friendly structure, and clean formatting.
 */

import type { BuilderElement, ElementStyles } from '@/types/builder';

// ============================================================================
// TYPES
// ============================================================================

export interface HTMLGeneratorOptions {
  /** Output minified HTML without formatting */
  minify: boolean;
  /** Include comments explaining structure */
  includeComments: boolean;
  /** Add responsive viewport meta tag */
  includeViewportMeta: boolean;
  /** Page title for full document export */
  pageTitle: string;
  /** Page description for SEO */
  pageDescription: string;
  /** Language attribute for html tag */
  language: string;
  /** Base indent size in spaces */
  indentSize: number;
}

export interface GeneratedHTML {
  /** Just the body content */
  body: string;
  /** Full HTML document */
  document: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_OPTIONS: HTMLGeneratorOptions = {
  minify: false,
  includeComments: false,
  includeViewportMeta: true,
  pageTitle: 'Generated Page',
  pageDescription: 'Page generated with Tailwind Builder',
  language: 'en',
  indentSize: 2,
};

/**
 * Maps component types to semantic HTML5 elements
 */
const SEMANTIC_TAG_MAP: Record<string, string> = {
  // Sections - use semantic section elements
  'hero-section': 'section',
  'hero-with-image': 'section',
  'feature-section': 'section',
  'cta-section': 'section',
  'stats-section': 'section',
  'testimonials-section': 'section',
  'team-section': 'section',
  'faq-section': 'section',
  'pricing-section': 'section',
  'contact-section': 'section',

  // Navigation
  'navbar': 'header',
  'mobile-menu': 'nav',
  'footer': 'footer',
  'breadcrumb': 'nav',
  'tabs': 'div',
  'pagination': 'nav',

  // Cards - use article for blog, div for others
  'simple-card': 'article',
  'product-card': 'article',
  'pricing-card': 'article',
  'testimonial-card': 'blockquote',
  'profile-card': 'article',
  'blog-card': 'article',
  'stats-card': 'figure',
  'feature-card': 'article',
  'image-card': 'figure',
  'horizontal-card': 'article',

  // Buttons
  'primary-button': 'button',
  'secondary-button': 'button',
  'outline-button': 'button',
  'ghost-button': 'button',
  'icon-button': 'button',
  'loading-button': 'button',
  'gradient-button': 'button',
  'button-group': 'div',

  // Forms
  'input-field': 'div',
  'textarea': 'div',
  'select-dropdown': 'div',
  'checkbox': 'label',
  'radio-group': 'fieldset',
  'toggle-switch': 'label',
  'login-form': 'form',
  'signup-form': 'form',
  'contact-form': 'form',
  'search-bar': 'form',
  'newsletter-form': 'form',
  'file-upload': 'div',

  // Layout
  'container': 'div',
  'grid-2-col': 'div',
  'grid-3-col': 'div',
  'grid-4-col': 'div',
  'flex-row': 'div',
  'flex-column': 'div',
  'divider': 'hr',
  'spacer': 'div',

  // Media
  'image': 'img',
  'avatar': 'img',
  'icon': 'span',
  'video': 'iframe',

  // Text
  'heading': 'h2',
  'paragraph': 'p',
  'badge': 'span',
  'link': 'a',
  'list': 'ul',
};

/**
 * ARIA roles for enhanced accessibility
 */
const ARIA_ROLES: Record<string, string> = {
  'navbar': 'banner',
  'footer': 'contentinfo',
  'hero-section': 'region',
  'feature-section': 'region',
  'cta-section': 'region',
  'testimonials-section': 'region',
  'pricing-section': 'region',
  'contact-section': 'region',
  'breadcrumb': 'navigation',
  'pagination': 'navigation',
  'mobile-menu': 'navigation',
  'search-bar': 'search',
  'tabs': 'tablist',
};

/**
 * ARIA labels for accessibility
 */
const ARIA_LABELS: Record<string, string> = {
  'navbar': 'Main navigation',
  'footer': 'Site footer',
  'breadcrumb': 'Breadcrumb navigation',
  'pagination': 'Page navigation',
  'mobile-menu': 'Mobile menu',
  'search-bar': 'Search',
};

const SELF_CLOSING_ELEMENTS = new Set(['img', 'hr', 'input', 'br', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates indentation string
 */
function createIndent(level: number, options: HTMLGeneratorOptions): string {
  if (options.minify) return '';
  return ' '.repeat(level * options.indentSize);
}

/**
 * Creates newline (or empty for minified)
 */
function newline(options: HTMLGeneratorOptions): string {
  return options.minify ? '' : '\n';
}

/**
 * Extracts CSS classes from element styles
 */
function extractClasses(styles: ElementStyles): string {
  const allClasses: string[] = [
    ...styles.layout,
    ...styles.spacing,
    ...styles.typography,
    ...styles.colors,
    ...styles.borders,
    ...styles.effects,
  ];

  // Add responsive prefixed classes
  if (styles.responsive.sm.length > 0) {
    allClasses.push(...styles.responsive.sm.map((c) => `sm:${c}`));
  }
  if (styles.responsive.md.length > 0) {
    allClasses.push(...styles.responsive.md.map((c) => `md:${c}`));
  }
  if (styles.responsive.lg.length > 0) {
    allClasses.push(...styles.responsive.lg.map((c) => `lg:${c}`));
  }

  return Array.from(new Set(allClasses.filter(Boolean))).join(' ');
}

/**
 * Escapes HTML special characters
 */
function escapeHTML(text: string): string {
  if (typeof text !== 'string') return String(text);
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Gets the semantic HTML tag for an element
 */
function getSemanticTag(element: BuilderElement): string {
  // Handle dynamic heading levels
  if (element.type === 'heading' && element.props.level) {
    const validLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    if (validLevels.includes(element.props.level)) {
      return element.props.level;
    }
  }

  // Handle ordered/unordered lists
  if (element.type === 'list') {
    return element.props.ordered ? 'ol' : 'ul';
  }

  return SEMANTIC_TAG_MAP[element.type] || 'div';
}

/**
 * Generates unique ID for element (used for accessibility)
 */
function generateElementId(element: BuilderElement): string {
  const baseName = element.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `${baseName}-${element.id.slice(-6)}`;
}

// ============================================================================
// ATTRIBUTE GENERATORS
// ============================================================================

/**
 * Generates HTML attributes for an element
 */
function generateAttributes(
  element: BuilderElement,
  options: HTMLGeneratorOptions
): string[] {
  const attributes: string[] = [];
  const className = extractClasses(element.styles);

  // Add class attribute
  if (className) {
    attributes.push(`class="${className}"`);
  }

  // Add ARIA role if applicable
  const role = ARIA_ROLES[element.type];
  if (role) {
    attributes.push(`role="${role}"`);
  }

  // Add ARIA label if applicable
  const ariaLabel = ARIA_LABELS[element.type];
  if (ariaLabel) {
    attributes.push(`aria-label="${ariaLabel}"`);
  }

  // Add element-specific attributes
  switch (element.type) {
    // Buttons
    case 'primary-button':
    case 'secondary-button':
    case 'outline-button':
    case 'ghost-button':
    case 'gradient-button':
      attributes.push('type="button"');
      break;

    case 'icon-button':
      attributes.push('type="button"');
      if (element.props.ariaLabel) {
        // Override default aria-label
        const index = attributes.findIndex(a => a.startsWith('aria-label='));
        if (index >= 0) attributes.splice(index, 1);
        attributes.push(`aria-label="${escapeHTML(element.props.ariaLabel)}"`);
      }
      break;

    case 'loading-button':
      attributes.push('type="button"');
      attributes.push('disabled');
      attributes.push('aria-busy="true"');
      break;

    // Media
    case 'image':
    case 'avatar':
      if (element.props.src) {
        attributes.push(`src="${escapeHTML(element.props.src)}"`);
      }
      // Alt is required for accessibility
      attributes.push(`alt="${escapeHTML(element.props.alt || '')}"`);
      if (element.props.loading) {
        attributes.push(`loading="${element.props.loading}"`);
      } else {
        attributes.push('loading="lazy"');
      }
      break;

    case 'video':
      if (element.props.src) {
        attributes.push(`src="${escapeHTML(element.props.src)}"`);
      }
      attributes.push('allowfullscreen');
      attributes.push('frameborder="0"');
      if (element.props.title) {
        attributes.push(`title="${escapeHTML(element.props.title)}"`);
      }
      break;

    // Forms
    case 'login-form':
    case 'signup-form':
    case 'contact-form':
    case 'newsletter-form':
      attributes.push('method="post"');
      attributes.push('action="#"');
      break;

    case 'search-bar':
      attributes.push('method="get"');
      attributes.push('action="#"');
      break;

    // Links
    case 'link':
      if (element.props.href) {
        attributes.push(`href="${escapeHTML(element.props.href)}"`);
      } else {
        attributes.push('href="#"');
      }
      if (element.props.target) {
        attributes.push(`target="${element.props.target}"`);
        if (element.props.target === '_blank') {
          attributes.push('rel="noopener noreferrer"');
        }
      }
      break;

    // Sections - add ID for anchor linking
    case 'hero-section':
    case 'feature-section':
    case 'cta-section':
    case 'testimonials-section':
    case 'pricing-section':
    case 'contact-section':
    case 'team-section':
    case 'faq-section':
    case 'stats-section':
      attributes.unshift(`id="${generateElementId(element)}"`);
      break;

    default:
      break;
  }

  return attributes;
}

// ============================================================================
// CONTENT GENERATORS
// ============================================================================

/**
 * Generates inner HTML content for an element
 */
function generateContent(
  element: BuilderElement,
  indent: number,
  options: HTMLGeneratorOptions
): string {
  const innerIndent = createIndent(indent + 1, options);
  const nl = newline(options);
  const contentParts: string[] = [];

  // Generate content based on component type
  switch (element.type) {
    // Buttons with text
    case 'primary-button':
    case 'secondary-button':
    case 'outline-button':
    case 'ghost-button':
    case 'gradient-button':
      if (element.props.text) {
        contentParts.push(escapeHTML(element.props.text));
      }
      break;

    case 'icon-button':
      // Use SVG icon placeholder
      contentParts.push(`${innerIndent}<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">${nl}${innerIndent}  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>${nl}${innerIndent}</svg>`);
      break;

    case 'loading-button':
      contentParts.push(`${innerIndent}<svg class="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">${nl}`);
      contentParts.push(`${innerIndent}  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>${nl}`);
      contentParts.push(`${innerIndent}  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>${nl}`);
      contentParts.push(`${innerIndent}</svg>`);
      if (element.props.text) {
        contentParts.push(`${nl}${innerIndent}${escapeHTML(element.props.text)}`);
      }
      break;

    // Cards
    case 'simple-card':
      if (element.props.title) {
        contentParts.push(`${innerIndent}<h3 class="text-lg font-semibold">${escapeHTML(element.props.title)}</h3>`);
      }
      if (element.props.description) {
        contentParts.push(`${nl}${innerIndent}<p class="text-gray-600 mt-2">${escapeHTML(element.props.description)}</p>`);
      }
      break;

    case 'product-card':
      if (element.props.image) {
        contentParts.push(`${innerIndent}<img src="${escapeHTML(element.props.image)}" alt="${escapeHTML(element.props.title || 'Product')}" class="w-full h-48 object-cover" loading="lazy">`);
      }
      contentParts.push(`${nl}${innerIndent}<div class="p-4">`);
      if (element.props.title) {
        contentParts.push(`${nl}${innerIndent}  <h3 class="font-semibold">${escapeHTML(element.props.title)}</h3>`);
      }
      if (element.props.description) {
        contentParts.push(`${nl}${innerIndent}  <p class="text-sm text-gray-600 mt-1">${escapeHTML(element.props.description)}</p>`);
      }
      if (element.props.price) {
        contentParts.push(`${nl}${innerIndent}  <p class="text-lg font-bold text-blue-600 mt-2">${escapeHTML(element.props.price)}</p>`);
      }
      contentParts.push(`${nl}${innerIndent}</div>`);
      break;

    case 'pricing-card':
      contentParts.push(`${innerIndent}<div class="text-center">`);
      if (element.props.tier) {
        contentParts.push(`${nl}${innerIndent}  <h3 class="text-xl font-semibold">${escapeHTML(element.props.tier)}</h3>`);
      }
      if (element.props.price) {
        contentParts.push(`${nl}${innerIndent}  <p class="text-4xl font-bold mt-4">${escapeHTML(element.props.price)}<span class="text-base font-normal text-gray-600">${escapeHTML(element.props.period || '/month')}</span></p>`);
      }
      contentParts.push(`${nl}${innerIndent}</div>`);
      if (element.props.features && Array.isArray(element.props.features)) {
        contentParts.push(`${nl}${innerIndent}<ul class="mt-6 space-y-3" role="list">`);
        element.props.features.forEach((feature: string) => {
          contentParts.push(`${nl}${innerIndent}  <li class="flex items-center gap-2"><svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>${escapeHTML(feature)}</li>`);
        });
        contentParts.push(`${nl}${innerIndent}</ul>`);
      }
      if (element.props.ctaText) {
        contentParts.push(`${nl}${innerIndent}<button type="button" class="w-full mt-8 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">${escapeHTML(element.props.ctaText)}</button>`);
      }
      break;

    case 'testimonial-card':
      if (element.props.quote) {
        contentParts.push(`${innerIndent}<p class="text-gray-600 italic">"${escapeHTML(element.props.quote)}"</p>`);
      }
      contentParts.push(`${nl}${innerIndent}<footer class="flex items-center mt-4 gap-3">`);
      if (element.props.avatar) {
        contentParts.push(`${nl}${innerIndent}  <img src="${escapeHTML(element.props.avatar)}" alt="${escapeHTML(element.props.author || 'Author')}" class="w-12 h-12 rounded-full object-cover" loading="lazy">`);
      }
      contentParts.push(`${nl}${innerIndent}  <div>`);
      if (element.props.author) {
        contentParts.push(`${nl}${innerIndent}    <cite class="font-semibold not-italic">${escapeHTML(element.props.author)}</cite>`);
      }
      if (element.props.role) {
        contentParts.push(`${nl}${innerIndent}    <p class="text-sm text-gray-500">${escapeHTML(element.props.role)}</p>`);
      }
      contentParts.push(`${nl}${innerIndent}  </div>`);
      contentParts.push(`${nl}${innerIndent}</footer>`);
      break;

    // Text elements
    case 'heading':
    case 'paragraph':
    case 'badge':
    case 'link':
      if (element.props.text) {
        contentParts.push(escapeHTML(element.props.text));
      }
      break;

    case 'list':
      if (element.props.items && Array.isArray(element.props.items)) {
        element.props.items.forEach((item: string) => {
          contentParts.push(`${innerIndent}<li>${escapeHTML(item)}</li>${nl}`);
        });
      }
      break;

    // Sections
    case 'hero-section':
      contentParts.push(`${innerIndent}<div class="max-w-4xl mx-auto text-center">`);
      if (element.props.headline) {
        contentParts.push(`${nl}${innerIndent}  <h1 class="text-4xl md:text-6xl font-bold mb-6">${escapeHTML(element.props.headline)}</h1>`);
      }
      if (element.props.subtext) {
        contentParts.push(`${nl}${innerIndent}  <p class="text-xl text-gray-600 mb-8">${escapeHTML(element.props.subtext)}</p>`);
      }
      if (element.props.ctaText) {
        contentParts.push(`${nl}${innerIndent}  <a href="${escapeHTML(element.props.ctaLink || '#')}" class="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">${escapeHTML(element.props.ctaText)}</a>`);
      }
      contentParts.push(`${nl}${innerIndent}</div>`);
      break;

    case 'hero-with-image':
      contentParts.push(`${innerIndent}<div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">`);
      contentParts.push(`${nl}${innerIndent}  <div>`);
      if (element.props.headline) {
        contentParts.push(`${nl}${innerIndent}    <h1 class="text-4xl md:text-5xl font-bold mb-6">${escapeHTML(element.props.headline)}</h1>`);
      }
      if (element.props.subtext) {
        contentParts.push(`${nl}${innerIndent}    <p class="text-xl text-gray-600 mb-8">${escapeHTML(element.props.subtext)}</p>`);
      }
      if (element.props.ctaText) {
        contentParts.push(`${nl}${innerIndent}    <button type="button" class="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">${escapeHTML(element.props.ctaText)}</button>`);
      }
      contentParts.push(`${nl}${innerIndent}  </div>`);
      if (element.props.image) {
        contentParts.push(`${nl}${innerIndent}  <img src="${escapeHTML(element.props.image)}" alt="Hero illustration" class="w-full rounded-lg shadow-xl" loading="eager">`);
      }
      contentParts.push(`${nl}${innerIndent}</div>`);
      break;

    case 'feature-section':
      contentParts.push(`${innerIndent}<div class="max-w-7xl mx-auto">`);
      contentParts.push(`${nl}${innerIndent}  <header class="text-center mb-12">`);
      if (element.props.title) {
        contentParts.push(`${nl}${innerIndent}    <h2 class="text-3xl font-bold mb-4">${escapeHTML(element.props.title)}</h2>`);
      }
      if (element.props.subtitle) {
        contentParts.push(`${nl}${innerIndent}    <p class="text-gray-600">${escapeHTML(element.props.subtitle)}</p>`);
      }
      contentParts.push(`${nl}${innerIndent}  </header>`);
      if (element.props.features && Array.isArray(element.props.features)) {
        contentParts.push(`${nl}${innerIndent}  <div class="grid md:grid-cols-3 gap-8">`);
        element.props.features.forEach((feature: { icon?: string; title: string; description: string }) => {
          contentParts.push(`${nl}${innerIndent}    <article class="text-center p-6">`);
          contentParts.push(`${nl}${innerIndent}      <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4" aria-hidden="true">`);
          contentParts.push(`${nl}${innerIndent}        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`);
          contentParts.push(`${nl}${innerIndent}      </div>`);
          contentParts.push(`${nl}${innerIndent}      <h3 class="font-semibold mb-2">${escapeHTML(feature.title)}</h3>`);
          contentParts.push(`${nl}${innerIndent}      <p class="text-gray-600">${escapeHTML(feature.description)}</p>`);
          contentParts.push(`${nl}${innerIndent}    </article>`);
        });
        contentParts.push(`${nl}${innerIndent}  </div>`);
      }
      contentParts.push(`${nl}${innerIndent}</div>`);
      break;

    case 'cta-section':
      contentParts.push(`${innerIndent}<div class="max-w-4xl mx-auto text-center">`);
      if (element.props.headline) {
        contentParts.push(`${nl}${innerIndent}  <h2 class="text-3xl font-bold mb-4">${escapeHTML(element.props.headline)}</h2>`);
      }
      if (element.props.description) {
        contentParts.push(`${nl}${innerIndent}  <p class="text-xl mb-8 opacity-90">${escapeHTML(element.props.description)}</p>`);
      }
      if (element.props.ctaText) {
        contentParts.push(`${nl}${innerIndent}  <button type="button" class="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">${escapeHTML(element.props.ctaText)}</button>`);
      }
      contentParts.push(`${nl}${innerIndent}</div>`);
      break;

    // Forms
    case 'input-field':
      const inputId = `input-${element.id.slice(-6)}`;
      if (element.props.label) {
        contentParts.push(`${innerIndent}<label for="${inputId}" class="block text-sm font-medium text-gray-700 mb-1">${escapeHTML(element.props.label)}</label>`);
      }
      contentParts.push(`${nl}${innerIndent}<input type="${element.props.type || 'text'}" id="${inputId}" name="${inputId}" placeholder="${escapeHTML(element.props.placeholder || '')}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow">`);
      if (element.props.helperText) {
        contentParts.push(`${nl}${innerIndent}<p class="mt-1 text-sm text-gray-500">${escapeHTML(element.props.helperText)}</p>`);
      }
      break;

    case 'textarea':
      const textareaId = `textarea-${element.id.slice(-6)}`;
      if (element.props.label) {
        contentParts.push(`${innerIndent}<label for="${textareaId}" class="block text-sm font-medium text-gray-700 mb-1">${escapeHTML(element.props.label)}</label>`);
      }
      contentParts.push(`${nl}${innerIndent}<textarea id="${textareaId}" name="${textareaId}" rows="${element.props.rows || 4}" placeholder="${escapeHTML(element.props.placeholder || '')}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none"></textarea>`);
      break;

    case 'login-form':
      if (element.props.title) {
        contentParts.push(`${innerIndent}<h2 class="text-2xl font-bold text-center mb-6">${escapeHTML(element.props.title)}</h2>`);
      }
      contentParts.push(`${nl}${innerIndent}<div class="space-y-4">`);
      contentParts.push(`${nl}${innerIndent}  <div>`);
      contentParts.push(`${nl}${innerIndent}    <label for="login-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>`);
      contentParts.push(`${nl}${innerIndent}    <input type="email" id="login-email" name="email" required autocomplete="email" placeholder="Enter your email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">`);
      contentParts.push(`${nl}${innerIndent}  </div>`);
      contentParts.push(`${nl}${innerIndent}  <div>`);
      contentParts.push(`${nl}${innerIndent}    <label for="login-password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>`);
      contentParts.push(`${nl}${innerIndent}    <input type="password" id="login-password" name="password" required autocomplete="current-password" placeholder="Enter your password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">`);
      contentParts.push(`${nl}${innerIndent}  </div>`);
      contentParts.push(`${nl}${innerIndent}  <div class="flex items-center justify-between">`);
      contentParts.push(`${nl}${innerIndent}    <label class="flex items-center gap-2"><input type="checkbox" name="remember" class="rounded"><span class="text-sm text-gray-600">Remember me</span></label>`);
      if (element.props.forgotPasswordLink) {
        contentParts.push(`${nl}${innerIndent}    <a href="${escapeHTML(element.props.forgotPasswordLink)}" class="text-sm text-blue-600 hover:underline">Forgot password?</a>`);
      }
      contentParts.push(`${nl}${innerIndent}  </div>`);
      contentParts.push(`${nl}${innerIndent}  <button type="submit" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Sign In</button>`);
      if (element.props.signupLink) {
        contentParts.push(`${nl}${innerIndent}  <p class="text-center text-sm text-gray-600">Don't have an account? <a href="${escapeHTML(element.props.signupLink)}" class="text-blue-600 hover:underline">Sign up</a></p>`);
      }
      contentParts.push(`${nl}${innerIndent}</div>`);
      break;

    // Navigation
    case 'navbar':
      contentParts.push(`${innerIndent}<nav class="max-w-7xl mx-auto flex items-center justify-between">`);
      contentParts.push(`${nl}${innerIndent}  <a href="/" class="font-bold text-xl">${escapeHTML(element.props.logo || 'Logo')}</a>`);
      if (element.props.links && Array.isArray(element.props.links)) {
        contentParts.push(`${nl}${innerIndent}  <ul class="hidden md:flex items-center gap-6" role="list">`);
        element.props.links.forEach((link: { text: string; href: string }) => {
          contentParts.push(`${nl}${innerIndent}    <li><a href="${escapeHTML(link.href)}" class="text-gray-700 hover:text-blue-600 transition-colors">${escapeHTML(link.text)}</a></li>`);
        });
        contentParts.push(`${nl}${innerIndent}  </ul>`);
      }
      if (element.props.ctaText) {
        contentParts.push(`${nl}${innerIndent}  <button type="button" class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">${escapeHTML(element.props.ctaText)}</button>`);
      }
      // Mobile menu button
      contentParts.push(`${nl}${innerIndent}  <button type="button" class="md:hidden p-2" aria-label="Toggle menu" aria-expanded="false">`);
      contentParts.push(`${nl}${innerIndent}    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>`);
      contentParts.push(`${nl}${innerIndent}  </button>`);
      contentParts.push(`${nl}${innerIndent}</nav>`);
      break;

    case 'footer':
      contentParts.push(`${innerIndent}<div class="max-w-7xl mx-auto">`);
      if (element.props.columns && Array.isArray(element.props.columns)) {
        contentParts.push(`${nl}${innerIndent}  <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">`);
        element.props.columns.forEach((column: { title: string; links: string[] }) => {
          contentParts.push(`${nl}${innerIndent}    <div>`);
          contentParts.push(`${nl}${innerIndent}      <h4 class="font-semibold mb-4">${escapeHTML(column.title)}</h4>`);
          contentParts.push(`${nl}${innerIndent}      <ul class="space-y-2" role="list">`);
          column.links.forEach((link) => {
            contentParts.push(`${nl}${innerIndent}        <li><a href="#" class="text-gray-400 hover:text-white transition-colors">${escapeHTML(link)}</a></li>`);
          });
          contentParts.push(`${nl}${innerIndent}      </ul>`);
          contentParts.push(`${nl}${innerIndent}    </div>`);
        });
        contentParts.push(`${nl}${innerIndent}  </div>`);
      }
      contentParts.push(`${nl}${innerIndent}  <div class="border-t border-gray-800 pt-8 text-center text-gray-400">`);
      if (element.props.copyright) {
        contentParts.push(`${nl}${innerIndent}    <p>${escapeHTML(element.props.copyright)}</p>`);
      }
      contentParts.push(`${nl}${innerIndent}  </div>`);
      contentParts.push(`${nl}${innerIndent}</div>`);
      break;

    case 'breadcrumb':
      if (element.props.items && Array.isArray(element.props.items)) {
        contentParts.push(`${innerIndent}<ol class="flex items-center" role="list">`);
        element.props.items.forEach((item: { text: string; href?: string }, index: number) => {
          if (index > 0) {
            contentParts.push(`${nl}${innerIndent}  <li class="mx-2 text-gray-400" aria-hidden="true">/</li>`);
          }
          contentParts.push(`${nl}${innerIndent}  <li>`);
          if (item.href && index < element.props.items.length - 1) {
            contentParts.push(`${nl}${innerIndent}    <a href="${escapeHTML(item.href)}" class="hover:text-blue-600 transition-colors">${escapeHTML(item.text)}</a>`);
          } else {
            contentParts.push(`${nl}${innerIndent}    <span class="text-gray-900 font-medium" aria-current="page">${escapeHTML(item.text)}</span>`);
          }
          contentParts.push(`${nl}${innerIndent}  </li>`);
        });
        contentParts.push(`${nl}${innerIndent}</ol>`);
      }
      break;

    // Media
    case 'icon':
      contentParts.push(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>`);
      break;

    default:
      break;
  }

  // Add children recursively
  if (element.children && element.children.length > 0) {
    element.children.forEach((child) => {
      contentParts.push(nl + generateElement(child, indent + 1, options));
    });
  }

  return contentParts.join('');
}

// ============================================================================
// MAIN GENERATION FUNCTIONS
// ============================================================================

/**
 * Generates HTML for a single element
 */
function generateElement(
  element: BuilderElement,
  indent: number,
  options: HTMLGeneratorOptions
): string {
  const currentIndent = createIndent(indent, options);
  const nl = newline(options);
  const tag = getSemanticTag(element);
  const attributes = generateAttributes(element, options);
  const attributeString = attributes.length > 0 ? ' ' + attributes.join(' ') : '';

  // Add comment if enabled
  let comment = '';
  if (options.includeComments && !options.minify) {
    comment = `${currentIndent}<!-- ${element.name} -->${nl}`;
  }

  // Handle self-closing elements
  if (SELF_CLOSING_ELEMENTS.has(tag)) {
    return `${comment}${currentIndent}<${tag}${attributeString}>`;
  }

  const content = generateContent(element, indent, options);

  // If no content, use short form
  if (!content.trim()) {
    return `${comment}${currentIndent}<${tag}${attributeString}></${tag}>`;
  }

  // Check if content is simple (single line, no nested elements)
  const isSimpleContent = !content.includes('\n') && !content.includes('<') && content.length < 60;

  if (isSimpleContent) {
    return `${comment}${currentIndent}<${tag}${attributeString}>${content}</${tag}>`;
  }

  return `${comment}${currentIndent}<${tag}${attributeString}>${nl}${content}${nl}${currentIndent}</${tag}>`;
}

/**
 * Generates the full HTML document
 */
function generateDocument(
  bodyContent: string,
  options: HTMLGeneratorOptions,
  cssContent?: string
): string {
  const nl = newline(options);
  const indent = createIndent(1, options);

  const parts: string[] = [
    '<!DOCTYPE html>',
    `<html lang="${options.language}">`,
    '<head>',
    `${indent}<meta charset="UTF-8">`,
  ];

  if (options.includeViewportMeta) {
    parts.push(`${indent}<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
  }

  parts.push(`${indent}<meta name="description" content="${escapeHTML(options.pageDescription)}">`);
  parts.push(`${indent}<title>${escapeHTML(options.pageTitle)}</title>`);

  // Add CSS
  if (cssContent) {
    parts.push(`${indent}<style>${nl}${cssContent}${nl}${indent}</style>`);
  } else {
    // Default: include Tailwind CDN
    parts.push(`${indent}<script src="https://cdn.tailwindcss.com"></script>`);
  }

  parts.push('</head>');
  parts.push('<body>');
  parts.push(bodyContent);
  parts.push('</body>');
  parts.push('</html>');

  return parts.join(nl);
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Generates HTML from BuilderElement array
 */
export function generateHTML(
  elements: BuilderElement[],
  options: Partial<HTMLGeneratorOptions> = {}
): GeneratedHTML {
  const mergedOptions: HTMLGeneratorOptions = { ...DEFAULT_OPTIONS, ...options };
  const nl = newline(mergedOptions);

  // Generate body content
  const bodyContent = elements.length > 0
    ? elements.map((el) => generateElement(el, 2, mergedOptions)).join(nl)
    : `${createIndent(2, mergedOptions)}<main class="min-h-screen">${nl}${createIndent(3, mergedOptions)}<!-- Add your content here -->${nl}${createIndent(2, mergedOptions)}</main>`;

  // Wrap in main container
  const wrappedBody = `${createIndent(1, mergedOptions)}<main class="w-full">${nl}${bodyContent}${nl}${createIndent(1, mergedOptions)}</main>`;

  // Generate full document
  const document = generateDocument(wrappedBody, mergedOptions);

  return {
    body: wrappedBody,
    document,
  };
}

/**
 * Generates HTML with embedded CSS
 */
export function generateHTMLWithCSS(
  elements: BuilderElement[],
  cssContent: string,
  options: Partial<HTMLGeneratorOptions> = {}
): string {
  const mergedOptions: HTMLGeneratorOptions = { ...DEFAULT_OPTIONS, ...options };
  const nl = newline(mergedOptions);

  const bodyContent = elements.length > 0
    ? elements.map((el) => generateElement(el, 2, mergedOptions)).join(nl)
    : `${createIndent(2, mergedOptions)}<main class="min-h-screen">${nl}${createIndent(3, mergedOptions)}<!-- Add your content here -->${nl}${createIndent(2, mergedOptions)}</main>`;

  const wrappedBody = `${createIndent(1, mergedOptions)}<main class="w-full">${nl}${bodyContent}${nl}${createIndent(1, mergedOptions)}</main>`;

  return generateDocument(wrappedBody, mergedOptions, cssContent);
}

/**
 * Generates minified HTML
 */
export function generateMinifiedHTML(elements: BuilderElement[]): GeneratedHTML {
  return generateHTML(elements, { minify: true });
}

/**
 * Generates HTML snippet (without document wrapper)
 */
export function generateHTMLSnippet(
  elements: BuilderElement[],
  options: Partial<HTMLGeneratorOptions> = {}
): string {
  const mergedOptions: HTMLGeneratorOptions = { ...DEFAULT_OPTIONS, ...options };
  const nl = newline(mergedOptions);

  return elements.map((el) => generateElement(el, 0, mergedOptions)).join(nl);
}

export { DEFAULT_OPTIONS as HTML_GENERATOR_DEFAULT_OPTIONS };
