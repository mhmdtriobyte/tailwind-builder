import type { BuilderElement, ElementStyles, GeneratedCode } from '@/types/builder';

/**
 * Code Generator
 *
 * Converts canvas elements into clean, production-ready React + Tailwind code.
 * Supports both JSX and TSX output formats with proper formatting.
 */

// ============================================================================
// CONSTANTS
// ============================================================================

const INDENT_SIZE = 2;
const INDENT_CHAR = ' ';

/**
 * Maps component types to their corresponding HTML/React elements
 */
const ELEMENT_TAG_MAP: Record<string, string> = {
  // Buttons
  'primary-button': 'button',
  'secondary-button': 'button',
  'outline-button': 'button',
  'ghost-button': 'button',
  'icon-button': 'button',
  'loading-button': 'button',
  'gradient-button': 'button',
  'button-group': 'div',

  // Cards
  'simple-card': 'div',
  'product-card': 'div',
  'pricing-card': 'div',
  'testimonial-card': 'div',
  'profile-card': 'div',
  'blog-card': 'article',
  'stats-card': 'div',
  'feature-card': 'div',
  'image-card': 'div',
  'horizontal-card': 'div',

  // Navigation
  'navbar': 'nav',
  'mobile-menu': 'div',
  'footer': 'footer',
  'breadcrumb': 'nav',
  'tabs': 'div',
  'pagination': 'nav',

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

  // Sections
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
 * Self-closing HTML elements that don't need closing tags
 */
const SELF_CLOSING_ELEMENTS = new Set(['img', 'hr', 'input', 'br', 'meta', 'link']);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates an indentation string for a given level
 * @param level - The indentation level
 * @returns The indentation string
 */
function createIndent(level: number): string {
  return INDENT_CHAR.repeat(level * INDENT_SIZE);
}

/**
 * Extracts all Tailwind classes from an element's styles
 * @param styles - The element styles object
 * @returns Combined class string
 */
function extractTailwindClasses(styles: ElementStyles): string {
  const allClasses: string[] = [
    ...styles.layout,
    ...styles.spacing,
    ...styles.typography,
    ...styles.colors,
    ...styles.borders,
    ...styles.effects,
  ];

  // Add responsive classes with prefixes
  if (styles.responsive.sm.length > 0) {
    allClasses.push(...styles.responsive.sm.map((c) => `sm:${c}`));
  }
  if (styles.responsive.md.length > 0) {
    allClasses.push(...styles.responsive.md.map((c) => `md:${c}`));
  }
  if (styles.responsive.lg.length > 0) {
    allClasses.push(...styles.responsive.lg.map((c) => `lg:${c}`));
  }

  // Remove duplicates and empty strings
  const filteredClasses = allClasses.filter(Boolean);
  const uniqueClasses = Array.from(new Set(filteredClasses));
  return uniqueClasses.join(' ');
}

/**
 * Escapes special characters in strings for JSX
 * @param value - The string to escape
 * @returns Escaped string safe for JSX
 */
function escapeJsxString(value: string): string {
  if (typeof value !== 'string') {
    return String(value);
  }
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Gets the HTML tag for a component type, considering dynamic heading levels
 * @param element - The builder element
 * @returns The HTML tag name
 */
function getElementTag(element: BuilderElement): string {
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

  return ELEMENT_TAG_MAP[element.type] || 'div';
}

// ============================================================================
// ATTRIBUTE GENERATORS
// ============================================================================

/**
 * Generates JSX attributes from element props
 * @param element - The builder element
 * @param isTypeScript - Whether to include type annotations
 * @returns Array of attribute strings
 */
function generateAttributes(element: BuilderElement): string[] {
  const attributes: string[] = [];

  // Handle className
  const className = extractTailwindClasses(element.styles);
  if (className) {
    attributes.push(`className="${className}"`);
  }

  // Handle specific props based on component type
  switch (element.type) {
    // Buttons
    case 'primary-button':
    case 'secondary-button':
    case 'outline-button':
    case 'ghost-button':
    case 'gradient-button':
      attributes.push(`type="button"`);
      break;

    case 'icon-button':
      attributes.push(`type="button"`);
      if (element.props.ariaLabel) {
        attributes.push(`aria-label="${escapeJsxString(element.props.ariaLabel)}"`);
      }
      break;

    case 'loading-button':
      attributes.push(`type="button"`);
      attributes.push(`disabled`);
      break;

    // Media
    case 'image':
    case 'avatar':
      if (element.props.src) {
        attributes.push(`src="${escapeJsxString(element.props.src)}"`);
      }
      if (element.props.alt) {
        attributes.push(`alt="${escapeJsxString(element.props.alt)}"`);
      }
      break;

    case 'video':
      if (element.props.src) {
        attributes.push(`src="${escapeJsxString(element.props.src)}"`);
      }
      attributes.push(`allowFullScreen`);
      attributes.push(`frameBorder="0"`);
      break;

    // Forms
    case 'login-form':
    case 'signup-form':
    case 'contact-form':
    case 'search-bar':
    case 'newsletter-form':
      attributes.push(`onSubmit={(e) => e.preventDefault()}`);
      break;

    // Links
    case 'link':
      if (element.props.href) {
        attributes.push(`href="${escapeJsxString(element.props.href)}"`);
      }
      break;

    // Navigation
    case 'breadcrumb':
      attributes.push(`aria-label="Breadcrumb"`);
      break;

    case 'pagination':
      attributes.push(`aria-label="Pagination"`);
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
 * Generates inner content for an element (text, children, etc.)
 * @param element - The builder element
 * @param indent - Current indentation level
 * @param isTypeScript - Whether generating TypeScript
 * @returns The inner content string
 */
function generateContent(
  element: BuilderElement,
  indent: number,
  isTypeScript: boolean
): string {
  const innerIndent = createIndent(indent + 1);
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
        contentParts.push(escapeJsxString(element.props.text));
      }
      break;

    case 'icon-button':
      contentParts.push(`${innerIndent}{/* Icon: ${element.props.icon || 'Plus'} */}`);
      break;

    case 'loading-button':
      contentParts.push(`${innerIndent}<span className="animate-spin mr-2">...</span>`);
      if (element.props.text) {
        contentParts.push(`${innerIndent}${escapeJsxString(element.props.text)}`);
      }
      break;

    // Cards
    case 'simple-card':
      if (element.props.title) {
        contentParts.push(
          `${innerIndent}<h3 className="text-lg font-semibold">${escapeJsxString(element.props.title)}</h3>`
        );
      }
      if (element.props.description) {
        contentParts.push(
          `${innerIndent}<p className="text-gray-600 mt-2">${escapeJsxString(element.props.description)}</p>`
        );
      }
      break;

    case 'product-card':
      if (element.props.image) {
        contentParts.push(
          `${innerIndent}<img src="${escapeJsxString(element.props.image)}" alt="${escapeJsxString(element.props.title || 'Product')}" className="w-full h-48 object-cover" />`
        );
      }
      contentParts.push(`${innerIndent}<div className="p-4">`);
      if (element.props.title) {
        contentParts.push(
          `${innerIndent}  <h3 className="font-semibold">${escapeJsxString(element.props.title)}</h3>`
        );
      }
      if (element.props.description) {
        contentParts.push(
          `${innerIndent}  <p className="text-sm text-gray-600 mt-1">${escapeJsxString(element.props.description)}</p>`
        );
      }
      if (element.props.price) {
        contentParts.push(
          `${innerIndent}  <p className="text-lg font-bold text-blue-600 mt-2">${escapeJsxString(element.props.price)}</p>`
        );
      }
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'pricing-card':
      contentParts.push(`${innerIndent}<div className="text-center">`);
      if (element.props.tier) {
        contentParts.push(
          `${innerIndent}  <h3 className="text-xl font-semibold">${escapeJsxString(element.props.tier)}</h3>`
        );
      }
      if (element.props.price) {
        contentParts.push(
          `${innerIndent}  <p className="text-4xl font-bold mt-4">${escapeJsxString(element.props.price)}<span className="text-base font-normal text-gray-600">${escapeJsxString(element.props.period || '/month')}</span></p>`
        );
      }
      contentParts.push(`${innerIndent}</div>`);
      if (element.props.features && Array.isArray(element.props.features)) {
        contentParts.push(`${innerIndent}<ul className="mt-6 space-y-3">`);
        element.props.features.forEach((feature: string) => {
          contentParts.push(
            `${innerIndent}  <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span>${escapeJsxString(feature)}</li>`
          );
        });
        contentParts.push(`${innerIndent}</ul>`);
      }
      if (element.props.ctaText) {
        contentParts.push(
          `${innerIndent}<button className="w-full mt-8 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">${escapeJsxString(element.props.ctaText)}</button>`
        );
      }
      break;

    case 'testimonial-card':
      if (element.props.quote) {
        contentParts.push(
          `${innerIndent}<p className="text-gray-600 italic">"${escapeJsxString(element.props.quote)}"</p>`
        );
      }
      contentParts.push(`${innerIndent}<div className="flex items-center mt-4 gap-3">`);
      if (element.props.avatar) {
        contentParts.push(
          `${innerIndent}  <img src="${escapeJsxString(element.props.avatar)}" alt="${escapeJsxString(element.props.author || 'Author')}" className="w-12 h-12 rounded-full object-cover" />`
        );
      }
      contentParts.push(`${innerIndent}  <div>`);
      if (element.props.author) {
        contentParts.push(
          `${innerIndent}    <p className="font-semibold">${escapeJsxString(element.props.author)}</p>`
        );
      }
      if (element.props.role) {
        contentParts.push(
          `${innerIndent}    <p className="text-sm text-gray-500">${escapeJsxString(element.props.role)}</p>`
        );
      }
      contentParts.push(`${innerIndent}  </div>`);
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'profile-card':
      contentParts.push(`${innerIndent}<div className="text-center">`);
      if (element.props.avatar) {
        contentParts.push(
          `${innerIndent}  <img src="${escapeJsxString(element.props.avatar)}" alt="${escapeJsxString(element.props.name || 'Profile')}" className="w-24 h-24 rounded-full mx-auto object-cover" />`
        );
      }
      if (element.props.name) {
        contentParts.push(
          `${innerIndent}  <h3 className="mt-4 font-semibold text-lg">${escapeJsxString(element.props.name)}</h3>`
        );
      }
      if (element.props.role) {
        contentParts.push(
          `${innerIndent}  <p className="text-gray-500">${escapeJsxString(element.props.role)}</p>`
        );
      }
      if (element.props.bio) {
        contentParts.push(
          `${innerIndent}  <p className="mt-3 text-gray-600 text-sm">${escapeJsxString(element.props.bio)}</p>`
        );
      }
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'blog-card':
      if (element.props.image) {
        contentParts.push(
          `${innerIndent}<img src="${escapeJsxString(element.props.image)}" alt="${escapeJsxString(element.props.title || 'Blog post')}" className="w-full h-48 object-cover" />`
        );
      }
      contentParts.push(`${innerIndent}<div className="p-4">`);
      if (element.props.date) {
        contentParts.push(
          `${innerIndent}  <span className="text-sm text-gray-500">${escapeJsxString(element.props.date)}</span>`
        );
      }
      if (element.props.title) {
        contentParts.push(
          `${innerIndent}  <h3 className="font-semibold mt-2">${escapeJsxString(element.props.title)}</h3>`
        );
      }
      if (element.props.excerpt) {
        contentParts.push(
          `${innerIndent}  <p className="text-gray-600 text-sm mt-2">${escapeJsxString(element.props.excerpt)}</p>`
        );
      }
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'stats-card':
      contentParts.push(`${innerIndent}<div className="text-center">`);
      if (element.props.icon) {
        contentParts.push(`${innerIndent}  {/* Icon: ${element.props.icon} */}`);
      }
      if (element.props.value) {
        contentParts.push(
          `${innerIndent}  <p className="text-3xl font-bold">${escapeJsxString(element.props.value)}</p>`
        );
      }
      if (element.props.label) {
        contentParts.push(
          `${innerIndent}  <p className="text-gray-600 mt-1">${escapeJsxString(element.props.label)}</p>`
        );
      }
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'feature-card':
      contentParts.push(
        `${innerIndent}<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">`
      );
      contentParts.push(`${innerIndent}  {/* Icon: ${element.props.icon || 'Zap'} */}`);
      contentParts.push(`${innerIndent}</div>`);
      if (element.props.title) {
        contentParts.push(
          `${innerIndent}<h3 className="font-semibold mb-2">${escapeJsxString(element.props.title)}</h3>`
        );
      }
      if (element.props.description) {
        contentParts.push(
          `${innerIndent}<p className="text-gray-600">${escapeJsxString(element.props.description)}</p>`
        );
      }
      break;

    case 'image-card':
      if (element.props.image) {
        contentParts.push(
          `${innerIndent}<img src="${escapeJsxString(element.props.image)}" alt="${escapeJsxString(element.props.title || 'Image')}" className="w-full h-full object-cover" />`
        );
      }
      contentParts.push(
        `${innerIndent}<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">`
      );
      contentParts.push(`${innerIndent}  <div className="absolute bottom-4 left-4 text-white">`);
      if (element.props.title) {
        contentParts.push(
          `${innerIndent}    <h3 className="font-semibold">${escapeJsxString(element.props.title)}</h3>`
        );
      }
      if (element.props.subtitle) {
        contentParts.push(
          `${innerIndent}    <p className="text-sm opacity-90">${escapeJsxString(element.props.subtitle)}</p>`
        );
      }
      contentParts.push(`${innerIndent}  </div>`);
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'horizontal-card':
      contentParts.push(`${innerIndent}<div className="md:w-1/3 flex-shrink-0">`);
      if (element.props.image) {
        contentParts.push(
          `${innerIndent}  <img src="${escapeJsxString(element.props.image)}" alt="${escapeJsxString(element.props.title || 'Card')}" className="w-full h-full object-cover" />`
        );
      }
      contentParts.push(`${innerIndent}</div>`);
      contentParts.push(`${innerIndent}<div className="p-4 flex-1">`);
      if (element.props.title) {
        contentParts.push(
          `${innerIndent}  <h3 className="font-semibold">${escapeJsxString(element.props.title)}</h3>`
        );
      }
      if (element.props.description) {
        contentParts.push(
          `${innerIndent}  <p className="text-gray-600 mt-2">${escapeJsxString(element.props.description)}</p>`
        );
      }
      contentParts.push(`${innerIndent}</div>`);
      break;

    // Text elements
    case 'heading':
      if (element.props.text) {
        contentParts.push(escapeJsxString(element.props.text));
      }
      break;

    case 'paragraph':
      if (element.props.text) {
        contentParts.push(escapeJsxString(element.props.text));
      }
      break;

    case 'badge':
      if (element.props.text) {
        contentParts.push(escapeJsxString(element.props.text));
      }
      break;

    case 'link':
      if (element.props.text) {
        contentParts.push(escapeJsxString(element.props.text));
      }
      break;

    case 'list':
      if (element.props.items && Array.isArray(element.props.items)) {
        element.props.items.forEach((item: string) => {
          contentParts.push(`${innerIndent}<li>${escapeJsxString(item)}</li>`);
        });
      }
      break;

    // Sections
    case 'hero-section':
      contentParts.push(`${innerIndent}<div className="max-w-4xl mx-auto text-center">`);
      if (element.props.headline) {
        contentParts.push(
          `${innerIndent}  <h1 className="text-4xl md:text-6xl font-bold mb-6">${escapeJsxString(element.props.headline)}</h1>`
        );
      }
      if (element.props.subtext) {
        contentParts.push(
          `${innerIndent}  <p className="text-xl text-gray-600 mb-8">${escapeJsxString(element.props.subtext)}</p>`
        );
      }
      if (element.props.ctaText) {
        contentParts.push(
          `${innerIndent}  <a href="${escapeJsxString(element.props.ctaLink || '#')}" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">${escapeJsxString(element.props.ctaText)}</a>`
        );
      }
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'hero-with-image':
      contentParts.push(`${innerIndent}<div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">`);
      contentParts.push(`${innerIndent}  <div>`);
      if (element.props.headline) {
        contentParts.push(
          `${innerIndent}    <h1 className="text-4xl md:text-5xl font-bold mb-6">${escapeJsxString(element.props.headline)}</h1>`
        );
      }
      if (element.props.subtext) {
        contentParts.push(
          `${innerIndent}    <p className="text-xl text-gray-600 mb-8">${escapeJsxString(element.props.subtext)}</p>`
        );
      }
      if (element.props.ctaText) {
        contentParts.push(
          `${innerIndent}    <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">${escapeJsxString(element.props.ctaText)}</button>`
        );
      }
      contentParts.push(`${innerIndent}  </div>`);
      if (element.props.image) {
        contentParts.push(
          `${innerIndent}  <img src="${escapeJsxString(element.props.image)}" alt="Hero" className="w-full rounded-lg shadow-xl" />`
        );
      }
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'feature-section':
      contentParts.push(`${innerIndent}<div className="max-w-7xl mx-auto">`);
      contentParts.push(`${innerIndent}  <div className="text-center mb-12">`);
      if (element.props.title) {
        contentParts.push(
          `${innerIndent}    <h2 className="text-3xl font-bold mb-4">${escapeJsxString(element.props.title)}</h2>`
        );
      }
      if (element.props.subtitle) {
        contentParts.push(
          `${innerIndent}    <p className="text-gray-600">${escapeJsxString(element.props.subtitle)}</p>`
        );
      }
      contentParts.push(`${innerIndent}  </div>`);
      if (element.props.features && Array.isArray(element.props.features)) {
        contentParts.push(`${innerIndent}  <div className="grid md:grid-cols-3 gap-8">`);
        element.props.features.forEach((feature: { icon?: string; title: string; description: string }) => {
          contentParts.push(`${innerIndent}    <div className="text-center p-6">`);
          contentParts.push(`${innerIndent}      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">`);
          contentParts.push(`${innerIndent}        {/* Icon: ${feature.icon || 'Star'} */}`);
          contentParts.push(`${innerIndent}      </div>`);
          contentParts.push(`${innerIndent}      <h3 className="font-semibold mb-2">${escapeJsxString(feature.title)}</h3>`);
          contentParts.push(`${innerIndent}      <p className="text-gray-600">${escapeJsxString(feature.description)}</p>`);
          contentParts.push(`${innerIndent}    </div>`);
        });
        contentParts.push(`${innerIndent}  </div>`);
      }
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'cta-section':
      contentParts.push(`${innerIndent}<div className="max-w-4xl mx-auto text-center">`);
      if (element.props.headline) {
        contentParts.push(
          `${innerIndent}  <h2 className="text-3xl font-bold mb-4">${escapeJsxString(element.props.headline)}</h2>`
        );
      }
      if (element.props.description) {
        contentParts.push(
          `${innerIndent}  <p className="text-xl mb-8 opacity-90">${escapeJsxString(element.props.description)}</p>`
        );
      }
      if (element.props.ctaText) {
        contentParts.push(
          `${innerIndent}  <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">${escapeJsxString(element.props.ctaText)}</button>`
        );
      }
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'stats-section':
      contentParts.push(`${innerIndent}<div className="max-w-7xl mx-auto">`);
      if (element.props.stats && Array.isArray(element.props.stats)) {
        contentParts.push(`${innerIndent}  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">`);
        element.props.stats.forEach((stat: { value: string; label: string }) => {
          contentParts.push(`${innerIndent}    <div>`);
          contentParts.push(`${innerIndent}      <p className="text-4xl font-bold text-blue-600">${escapeJsxString(stat.value)}</p>`);
          contentParts.push(`${innerIndent}      <p className="text-gray-600 mt-2">${escapeJsxString(stat.label)}</p>`);
          contentParts.push(`${innerIndent}    </div>`);
        });
        contentParts.push(`${innerIndent}  </div>`);
      }
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'testimonials-section':
      contentParts.push(`${innerIndent}<div className="max-w-7xl mx-auto">`);
      if (element.props.title) {
        contentParts.push(
          `${innerIndent}  <h2 className="text-3xl font-bold text-center mb-12">${escapeJsxString(element.props.title)}</h2>`
        );
      }
      if (element.props.testimonials && Array.isArray(element.props.testimonials)) {
        contentParts.push(`${innerIndent}  <div className="grid md:grid-cols-2 gap-8">`);
        element.props.testimonials.forEach((testimonial: { quote: string; author: string; role: string }) => {
          contentParts.push(`${innerIndent}    <div className="bg-white p-6 rounded-lg shadow-sm">`);
          contentParts.push(`${innerIndent}      <p className="text-gray-600 italic">"${escapeJsxString(testimonial.quote)}"</p>`);
          contentParts.push(`${innerIndent}      <div className="mt-4">`);
          contentParts.push(`${innerIndent}        <p className="font-semibold">${escapeJsxString(testimonial.author)}</p>`);
          contentParts.push(`${innerIndent}        <p className="text-sm text-gray-500">${escapeJsxString(testimonial.role)}</p>`);
          contentParts.push(`${innerIndent}      </div>`);
          contentParts.push(`${innerIndent}    </div>`);
        });
        contentParts.push(`${innerIndent}  </div>`);
      }
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'team-section':
      contentParts.push(`${innerIndent}<div className="max-w-7xl mx-auto">`);
      if (element.props.title) {
        contentParts.push(
          `${innerIndent}  <h2 className="text-3xl font-bold text-center mb-12">${escapeJsxString(element.props.title)}</h2>`
        );
      }
      if (element.props.members && Array.isArray(element.props.members)) {
        contentParts.push(`${innerIndent}  <div className="grid md:grid-cols-3 gap-8">`);
        element.props.members.forEach((member: { name: string; role: string; avatar: string }) => {
          contentParts.push(`${innerIndent}    <div className="text-center">`);
          contentParts.push(`${innerIndent}      <img src="${escapeJsxString(member.avatar)}" alt="${escapeJsxString(member.name)}" className="w-32 h-32 rounded-full mx-auto object-cover" />`);
          contentParts.push(`${innerIndent}      <h3 className="mt-4 font-semibold">${escapeJsxString(member.name)}</h3>`);
          contentParts.push(`${innerIndent}      <p className="text-gray-500">${escapeJsxString(member.role)}</p>`);
          contentParts.push(`${innerIndent}    </div>`);
        });
        contentParts.push(`${innerIndent}  </div>`);
      }
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'faq-section':
      if (element.props.title) {
        contentParts.push(
          `${innerIndent}<h2 className="text-3xl font-bold text-center mb-12">${escapeJsxString(element.props.title)}</h2>`
        );
      }
      if (element.props.faqs && Array.isArray(element.props.faqs)) {
        contentParts.push(`${innerIndent}<div className="space-y-4">`);
        element.props.faqs.forEach((faq: { question: string; answer: string }) => {
          contentParts.push(`${innerIndent}  <div className="border border-gray-200 rounded-lg">`);
          contentParts.push(`${innerIndent}    <button className="w-full px-6 py-4 text-left font-medium flex justify-between items-center">`);
          contentParts.push(`${innerIndent}      ${escapeJsxString(faq.question)}`);
          contentParts.push(`${innerIndent}      <span>+</span>`);
          contentParts.push(`${innerIndent}    </button>`);
          contentParts.push(`${innerIndent}    <div className="px-6 pb-4 text-gray-600">`);
          contentParts.push(`${innerIndent}      ${escapeJsxString(faq.answer)}`);
          contentParts.push(`${innerIndent}    </div>`);
          contentParts.push(`${innerIndent}  </div>`);
        });
        contentParts.push(`${innerIndent}</div>`);
      }
      break;

    case 'pricing-section':
      contentParts.push(`${innerIndent}<div className="max-w-7xl mx-auto">`);
      if (element.props.title) {
        contentParts.push(
          `${innerIndent}  <h2 className="text-3xl font-bold text-center mb-12">${escapeJsxString(element.props.title)}</h2>`
        );
      }
      if (element.props.plans && Array.isArray(element.props.plans)) {
        contentParts.push(`${innerIndent}  <div className="grid md:grid-cols-3 gap-8">`);
        element.props.plans.forEach((plan: { tier: string; price: string; features: string[]; highlighted?: boolean }) => {
          const cardClass = plan.highlighted
            ? 'bg-blue-600 text-white rounded-xl p-8 shadow-xl scale-105'
            : 'bg-white rounded-xl p-8 border border-gray-200 shadow-sm';
          contentParts.push(`${innerIndent}    <div className="${cardClass}">`);
          contentParts.push(`${innerIndent}      <h3 className="text-xl font-semibold">${escapeJsxString(plan.tier)}</h3>`);
          contentParts.push(`${innerIndent}      <p className="text-4xl font-bold mt-4">${escapeJsxString(plan.price)}<span className="text-base font-normal opacity-75">/mo</span></p>`);
          contentParts.push(`${innerIndent}      <ul className="mt-6 space-y-3">`);
          plan.features.forEach((feature) => {
            contentParts.push(`${innerIndent}        <li className="flex items-center gap-2"><span>&#10003;</span>${escapeJsxString(feature)}</li>`);
          });
          contentParts.push(`${innerIndent}      </ul>`);
          const btnClass = plan.highlighted
            ? 'w-full mt-8 px-4 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100'
            : 'w-full mt-8 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700';
          contentParts.push(`${innerIndent}      <button className="${btnClass}">Get Started</button>`);
          contentParts.push(`${innerIndent}    </div>`);
        });
        contentParts.push(`${innerIndent}  </div>`);
      }
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'contact-section':
      contentParts.push(`${innerIndent}<div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">`);
      contentParts.push(`${innerIndent}  <div>`);
      if (element.props.title) {
        contentParts.push(
          `${innerIndent}    <h2 className="text-3xl font-bold mb-6">${escapeJsxString(element.props.title)}</h2>`
        );
      }
      contentParts.push(`${innerIndent}    <div className="space-y-4">`);
      if (element.props.email) {
        contentParts.push(`${innerIndent}      <p className="flex items-center gap-3"><span>Email:</span>${escapeJsxString(element.props.email)}</p>`);
      }
      if (element.props.phone) {
        contentParts.push(`${innerIndent}      <p className="flex items-center gap-3"><span>Phone:</span>${escapeJsxString(element.props.phone)}</p>`);
      }
      if (element.props.address) {
        contentParts.push(`${innerIndent}      <p className="flex items-center gap-3"><span>Address:</span>${escapeJsxString(element.props.address)}</p>`);
      }
      contentParts.push(`${innerIndent}    </div>`);
      contentParts.push(`${innerIndent}  </div>`);
      contentParts.push(`${innerIndent}  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>`);
      contentParts.push(`${innerIndent}    <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />`);
      contentParts.push(`${innerIndent}    <input type="email" placeholder="Your Email" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />`);
      contentParts.push(`${innerIndent}    <textarea rows={4} placeholder="Your Message" className="w-full px-4 py-3 border border-gray-300 rounded-lg"></textarea>`);
      contentParts.push(`${innerIndent}    <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Send Message</button>`);
      contentParts.push(`${innerIndent}  </form>`);
      contentParts.push(`${innerIndent}</div>`);
      break;

    // Forms
    case 'input-field':
      if (element.props.label) {
        contentParts.push(
          `${innerIndent}<label className="block text-sm font-medium text-gray-700 mb-1">${escapeJsxString(element.props.label)}</label>`
        );
      }
      contentParts.push(
        `${innerIndent}<input type="text" placeholder="${escapeJsxString(element.props.placeholder || '')}" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" />`
      );
      if (element.props.helperText) {
        contentParts.push(
          `${innerIndent}<p className="mt-1 text-sm text-gray-500">${escapeJsxString(element.props.helperText)}</p>`
        );
      }
      break;

    case 'textarea':
      if (element.props.label) {
        contentParts.push(
          `${innerIndent}<label className="block text-sm font-medium text-gray-700 mb-1">${escapeJsxString(element.props.label)}</label>`
        );
      }
      contentParts.push(
        `${innerIndent}<textarea rows={${element.props.rows || 4}} placeholder="${escapeJsxString(element.props.placeholder || '')}" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none"></textarea>`
      );
      break;

    case 'select-dropdown':
      if (element.props.label) {
        contentParts.push(
          `${innerIndent}<label className="block text-sm font-medium text-gray-700 mb-1">${escapeJsxString(element.props.label)}</label>`
        );
      }
      contentParts.push(
        `${innerIndent}<select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">`
      );
      contentParts.push(`${innerIndent}  <option value="">Select an option</option>`);
      if (element.props.options && Array.isArray(element.props.options)) {
        element.props.options.forEach((option: string) => {
          contentParts.push(
            `${innerIndent}  <option value="${escapeJsxString(option)}">${escapeJsxString(option)}</option>`
          );
        });
      }
      contentParts.push(`${innerIndent}</select>`);
      break;

    case 'checkbox':
      contentParts.push(
        `${innerIndent}<input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />`
      );
      if (element.props.label) {
        contentParts.push(
          `${innerIndent}<span className="ml-2 text-gray-700">${escapeJsxString(element.props.label)}</span>`
        );
      }
      break;

    case 'radio-group':
      if (element.props.label) {
        contentParts.push(
          `${innerIndent}<legend className="text-sm font-medium text-gray-700 mb-2">${escapeJsxString(element.props.label)}</legend>`
        );
      }
      if (element.props.options && Array.isArray(element.props.options)) {
        contentParts.push(`${innerIndent}<div className="space-y-2">`);
        element.props.options.forEach((option: string, index: number) => {
          contentParts.push(`${innerIndent}  <label className="flex items-center gap-2">`);
          contentParts.push(`${innerIndent}    <input type="radio" name="radio-group" ${index === 0 ? 'defaultChecked ' : ''}className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />`);
          contentParts.push(`${innerIndent}    <span className="text-gray-700">${escapeJsxString(option)}</span>`);
          contentParts.push(`${innerIndent}  </label>`);
        });
        contentParts.push(`${innerIndent}</div>`);
      }
      break;

    case 'toggle-switch':
      contentParts.push(`${innerIndent}<span className="text-gray-700">${escapeJsxString(element.props.label || '')}</span>`);
      contentParts.push(`${innerIndent}<button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">`);
      contentParts.push(`${innerIndent}  <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform translate-x-1"></span>`);
      contentParts.push(`${innerIndent}</button>`);
      break;

    case 'login-form':
      if (element.props.title) {
        contentParts.push(
          `${innerIndent}<h2 className="text-2xl font-bold text-center mb-6">${escapeJsxString(element.props.title)}</h2>`
        );
      }
      contentParts.push(`${innerIndent}<div className="space-y-4">`);
      contentParts.push(`${innerIndent}  <div>`);
      contentParts.push(`${innerIndent}    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>`);
      contentParts.push(`${innerIndent}    <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />`);
      contentParts.push(`${innerIndent}  </div>`);
      contentParts.push(`${innerIndent}  <div>`);
      contentParts.push(`${innerIndent}    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>`);
      contentParts.push(`${innerIndent}    <input type="password" placeholder="Enter your password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />`);
      contentParts.push(`${innerIndent}  </div>`);
      contentParts.push(`${innerIndent}  <div className="flex items-center justify-between">`);
      contentParts.push(`${innerIndent}    <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /><span className="text-sm text-gray-600">Remember me</span></label>`);
      if (element.props.forgotPasswordLink) {
        contentParts.push(`${innerIndent}    <a href="${escapeJsxString(element.props.forgotPasswordLink)}" className="text-sm text-blue-600 hover:underline">Forgot password?</a>`);
      }
      contentParts.push(`${innerIndent}  </div>`);
      contentParts.push(`${innerIndent}  <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Sign In</button>`);
      if (element.props.signupLink) {
        contentParts.push(`${innerIndent}  <p className="text-center text-sm text-gray-600">Don't have an account? <a href="${escapeJsxString(element.props.signupLink)}" className="text-blue-600 hover:underline">Sign up</a></p>`);
      }
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'signup-form':
      if (element.props.title) {
        contentParts.push(
          `${innerIndent}<h2 className="text-2xl font-bold text-center mb-6">${escapeJsxString(element.props.title)}</h2>`
        );
      }
      contentParts.push(`${innerIndent}<div className="space-y-4">`);
      contentParts.push(`${innerIndent}  <div>`);
      contentParts.push(`${innerIndent}    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>`);
      contentParts.push(`${innerIndent}    <input type="text" placeholder="Enter your name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />`);
      contentParts.push(`${innerIndent}  </div>`);
      contentParts.push(`${innerIndent}  <div>`);
      contentParts.push(`${innerIndent}    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>`);
      contentParts.push(`${innerIndent}    <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />`);
      contentParts.push(`${innerIndent}  </div>`);
      contentParts.push(`${innerIndent}  <div>`);
      contentParts.push(`${innerIndent}    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>`);
      contentParts.push(`${innerIndent}    <input type="password" placeholder="Create a password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />`);
      contentParts.push(`${innerIndent}  </div>`);
      contentParts.push(`${innerIndent}  <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Create Account</button>`);
      if (element.props.loginLink) {
        contentParts.push(`${innerIndent}  <p className="text-center text-sm text-gray-600">Already have an account? <a href="${escapeJsxString(element.props.loginLink)}" className="text-blue-600 hover:underline">Sign in</a></p>`);
      }
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'contact-form':
      if (element.props.title) {
        contentParts.push(
          `${innerIndent}<h2 className="text-2xl font-bold mb-6">${escapeJsxString(element.props.title)}</h2>`
        );
      }
      contentParts.push(`${innerIndent}<div className="space-y-4">`);
      contentParts.push(`${innerIndent}  <div className="grid md:grid-cols-2 gap-4">`);
      contentParts.push(`${innerIndent}    <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />`);
      contentParts.push(`${innerIndent}    <input type="email" placeholder="Your Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />`);
      contentParts.push(`${innerIndent}  </div>`);
      contentParts.push(`${innerIndent}  <input type="text" placeholder="Subject" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />`);
      contentParts.push(`${innerIndent}  <textarea rows={5} placeholder="Your Message" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"></textarea>`);
      contentParts.push(`${innerIndent}  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">${escapeJsxString(element.props.submitText || 'Send Message')}</button>`);
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'search-bar':
      contentParts.push(
        `${innerIndent}<input type="text" placeholder="${escapeJsxString(element.props.placeholder || 'Search...')}" className="flex-1 px-4 py-2 focus:outline-none" />`
      );
      if (element.props.buttonText) {
        contentParts.push(
          `${innerIndent}<button type="submit" className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors">${escapeJsxString(element.props.buttonText)}</button>`
        );
      }
      break;

    case 'newsletter-form':
      contentParts.push(
        `${innerIndent}<input type="email" placeholder="${escapeJsxString(element.props.placeholder || 'Enter your email')}" className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />`
      );
      if (element.props.buttonText) {
        contentParts.push(
          `${innerIndent}<button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-r-lg font-medium hover:bg-blue-700 transition-colors">${escapeJsxString(element.props.buttonText)}</button>`
        );
      }
      break;

    case 'file-upload':
      contentParts.push(`${innerIndent}<div className="text-center">`);
      contentParts.push(`${innerIndent}  <div className="text-4xl text-gray-400 mb-2">{/* Upload Icon */}</div>`);
      if (element.props.label) {
        contentParts.push(`${innerIndent}  <p className="text-gray-600">${escapeJsxString(element.props.label)}</p>`);
      }
      contentParts.push(`${innerIndent}  <p className="text-sm text-gray-500 mt-1">or drag and drop</p>`);
      contentParts.push(`${innerIndent}  <input type="file" className="hidden" accept="${escapeJsxString(element.props.accept || '*')}" />`);
      contentParts.push(`${innerIndent}</div>`);
      break;

    // Navigation
    case 'navbar':
      contentParts.push(`${innerIndent}<div className="font-bold text-xl">`);
      contentParts.push(`${innerIndent}  ${escapeJsxString(element.props.logo || 'Logo')}`);
      contentParts.push(`${innerIndent}</div>`);
      if (element.props.links && Array.isArray(element.props.links)) {
        contentParts.push(`${innerIndent}<div className="hidden md:flex items-center gap-6">`);
        element.props.links.forEach((link: { text: string; href: string }) => {
          contentParts.push(
            `${innerIndent}  <a href="${escapeJsxString(link.href)}" className="text-gray-700 hover:text-blue-600 transition-colors">${escapeJsxString(link.text)}</a>`
          );
        });
        contentParts.push(`${innerIndent}</div>`);
      }
      if (element.props.ctaText) {
        contentParts.push(
          `${innerIndent}<button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">${escapeJsxString(element.props.ctaText)}</button>`
        );
      }
      break;

    case 'mobile-menu':
      contentParts.push(`${innerIndent}<div className="p-6">`);
      contentParts.push(`${innerIndent}  <div className="flex justify-between items-center mb-8">`);
      contentParts.push(`${innerIndent}    <span className="font-bold text-xl">Logo</span>`);
      contentParts.push(`${innerIndent}    <button className="p-2">{/* Close Icon */}</button>`);
      contentParts.push(`${innerIndent}  </div>`);
      contentParts.push(`${innerIndent}  <nav className="space-y-4">`);
      contentParts.push(`${innerIndent}    <a href="#" className="block text-lg py-2">Home</a>`);
      contentParts.push(`${innerIndent}    <a href="#" className="block text-lg py-2">About</a>`);
      contentParts.push(`${innerIndent}    <a href="#" className="block text-lg py-2">Services</a>`);
      contentParts.push(`${innerIndent}    <a href="#" className="block text-lg py-2">Contact</a>`);
      contentParts.push(`${innerIndent}  </nav>`);
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'footer':
      contentParts.push(`${innerIndent}<div className="max-w-7xl mx-auto">`);
      if (element.props.columns && Array.isArray(element.props.columns)) {
        contentParts.push(`${innerIndent}  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">`);
        element.props.columns.forEach((column: { title: string; links: string[] }) => {
          contentParts.push(`${innerIndent}    <div>`);
          contentParts.push(`${innerIndent}      <h4 className="font-semibold mb-4">${escapeJsxString(column.title)}</h4>`);
          contentParts.push(`${innerIndent}      <ul className="space-y-2">`);
          column.links.forEach((link) => {
            contentParts.push(`${innerIndent}        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">${escapeJsxString(link)}</a></li>`);
          });
          contentParts.push(`${innerIndent}      </ul>`);
          contentParts.push(`${innerIndent}    </div>`);
        });
        contentParts.push(`${innerIndent}  </div>`);
      }
      contentParts.push(`${innerIndent}  <div className="border-t border-gray-800 pt-8 text-center text-gray-400">`);
      if (element.props.copyright) {
        contentParts.push(`${innerIndent}    <p>${escapeJsxString(element.props.copyright)}</p>`);
      }
      contentParts.push(`${innerIndent}  </div>`);
      contentParts.push(`${innerIndent}</div>`);
      break;

    case 'breadcrumb':
      if (element.props.items && Array.isArray(element.props.items)) {
        contentParts.push(`${innerIndent}<ol className="flex items-center">`);
        element.props.items.forEach(
          (item: { text: string; href?: string }, index: number) => {
            if (index > 0) {
              contentParts.push(`${innerIndent}  <li className="mx-2 text-gray-400">/</li>`);
            }
            contentParts.push(`${innerIndent}  <li>`);
            if (item.href) {
              contentParts.push(
                `${innerIndent}    <a href="${escapeJsxString(item.href)}" className="hover:text-blue-600 transition-colors">${escapeJsxString(item.text)}</a>`
              );
            } else {
              contentParts.push(
                `${innerIndent}    <span className="text-gray-900 font-medium">${escapeJsxString(item.text)}</span>`
              );
            }
            contentParts.push(`${innerIndent}  </li>`);
          }
        );
        contentParts.push(`${innerIndent}</ol>`);
      }
      break;

    case 'tabs':
      if (element.props.tabs && Array.isArray(element.props.tabs)) {
        contentParts.push(`${innerIndent}<div className="flex">`);
        element.props.tabs.forEach((tab: string, index: number) => {
          const isActive = index === (element.props.activeTab || 0);
          const tabClass = isActive
            ? 'px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium'
            : 'px-4 py-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900';
          contentParts.push(`${innerIndent}  <button className="${tabClass}">${escapeJsxString(tab)}</button>`);
        });
        contentParts.push(`${innerIndent}</div>`);
      }
      break;

    case 'pagination':
      contentParts.push(
        `${innerIndent}<button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors">&laquo; Prev</button>`
      );
      for (let i = 1; i <= Math.min(element.props.totalPages || 5, 5); i++) {
        const isActive = i === (element.props.currentPage || 1);
        const btnClass = isActive
          ? 'px-3 py-1 bg-blue-600 text-white rounded'
          : 'px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors';
        contentParts.push(`${innerIndent}<button className="${btnClass}">${i}</button>`);
      }
      contentParts.push(
        `${innerIndent}<button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors">Next &raquo;</button>`
      );
      break;

    // Media
    case 'icon':
      contentParts.push(`{/* Icon: ${element.props.name || 'Star'} */}`);
      break;

    // Layout - Empty containers
    case 'divider':
      // HR is self-closing, no content
      break;

    case 'spacer':
      contentParts.push(`${innerIndent}{/* Spacer */}`);
      break;

    // Default: no special content
    default:
      break;
  }

  // Add children recursively
  if (element.children && element.children.length > 0) {
    element.children.forEach((child) => {
      contentParts.push(
        isTypeScript
          ? generateTSX(child, indent + 1)
          : generateJSX(child, indent + 1)
      );
    });
  }

  return contentParts.join('\n');
}

// ============================================================================
// MAIN CODE GENERATION FUNCTIONS
// ============================================================================

/**
 * Generates JSX code for a single element
 * @param element - The builder element
 * @param indent - Current indentation level
 * @returns JSX string for the element
 */
export function generateJSX(element: BuilderElement, indent: number = 0): string {
  const currentIndent = createIndent(indent);
  const tag = getElementTag(element);
  const attributes = generateAttributes(element);
  const attributeString = attributes.length > 0 ? ` ${attributes.join(' ')}` : '';

  // Handle self-closing elements
  if (SELF_CLOSING_ELEMENTS.has(tag)) {
    return `${currentIndent}<${tag}${attributeString} />`;
  }

  const content = generateContent(element, indent, false);

  // If no content, use short form
  if (!content.trim()) {
    return `${currentIndent}<${tag}${attributeString}></${tag}>`;
  }

  // Check if content is simple (single line, no nested elements)
  const isSimpleContent =
    !content.includes('\n') &&
    !content.includes('<') &&
    content.length < 60;

  if (isSimpleContent) {
    return `${currentIndent}<${tag}${attributeString}>${content}</${tag}>`;
  }

  return `${currentIndent}<${tag}${attributeString}>\n${content}\n${currentIndent}</${tag}>`;
}

/**
 * Generates TSX code for a single element (same as JSX but for TypeScript files)
 * @param element - The builder element
 * @param indent - Current indentation level
 * @returns TSX string for the element
 */
export function generateTSX(element: BuilderElement, indent: number = 0): string {
  // TSX generation is identical to JSX in structure
  return generateJSX(element, indent);
}

/**
 * Formats code for better readability
 * @param code - The code string to format
 * @returns Formatted code string
 */
export function formatCode(code: string): string {
  // Remove excessive blank lines
  const formatted = code.replace(/\n{3,}/g, '\n\n');

  // Ensure consistent indentation
  const lines = formatted.split('\n');
  const formattedLines = lines.map((line) => {
    // Preserve indentation but fix any tab/space inconsistencies
    const leadingWhitespace = line.match(/^(\s*)/)?.[1] || '';
    const content = line.trimStart();
    const indentLevel = Math.round(leadingWhitespace.length / INDENT_SIZE);
    return createIndent(indentLevel) + content;
  });

  return formattedLines.join('\n').trim();
}

/**
 * Generates a complete React component from canvas elements
 * @param elements - Array of builder elements
 * @param componentName - Optional custom component name
 * @returns Generated code object with JSX and TSX
 */
export function generateCode(
  elements: BuilderElement[],
  componentName: string = 'GeneratedComponent'
): GeneratedCode {
  // Sanitize component name
  const sanitizedName = componentName.replace(/[^a-zA-Z0-9]/g, '') || 'Component';

  // Generate content for all root elements
  const jsxBody =
    elements.length > 0
      ? elements.map((el) => generateJSX(el, 3)).join('\n')
      : '      {/* Add elements to your canvas */}';

  const tsxBody =
    elements.length > 0
      ? elements.map((el) => generateTSX(el, 3)).join('\n')
      : '      {/* Add elements to your canvas */}';

  // Build complete JSX component
  const jsx = `import React from 'react';

export default function ${sanitizedName}() {
  return (
    <div className="w-full">
${jsxBody}
    </div>
  );
}
`;

  // Build complete TSX component with TypeScript types
  const tsx = `import React from 'react';

interface ${sanitizedName}Props {
  className?: string;
}

export default function ${sanitizedName}({ className }: ${sanitizedName}Props) {
  return (
    <div className={\`w-full \${className || ''}\`}>
${tsxBody}
    </div>
  );
}
`;

  return {
    jsx: formatCode(jsx),
    tsx: formatCode(tsx),
  };
}

// ============================================================================
// ADDITIONAL EXPORT UTILITIES
// ============================================================================

/**
 * Generates only the JSX markup without component wrapper
 * @param elements - Array of builder elements
 * @returns JSX markup string
 */
export function generateMarkupOnly(elements: BuilderElement[]): string {
  if (elements.length === 0) {
    return '{/* No elements */}';
  }

  return elements.map((el) => generateJSX(el, 0)).join('\n');
}

/**
 * Generates a preview-friendly version of the code
 * @param elements - Array of builder elements
 * @returns Preview code string
 */
export function generatePreviewCode(elements: BuilderElement[]): string {
  if (elements.length === 0) {
    return '<div className="w-full">\n  {/* Add elements to your canvas */}\n</div>';
  }

  const body = elements.map((el) => generateJSX(el, 1)).join('\n');
  return `<div className="w-full">\n${body}\n</div>`;
}

/**
 * Generates only the inner content (snippet) without the component wrapper
 * Useful for copying snippets
 * @param elements - Array of builder elements
 * @returns Object with jsx and tsx snippet strings
 */
export function generateSnippet(elements: BuilderElement[]): GeneratedCode {
  const jsx = elements
    .map((element) => generateJSX(element, 0))
    .join('\n');

  const tsx = elements
    .map((element) => generateTSX(element, 0))
    .join('\n');

  return {
    jsx: formatCode(jsx),
    tsx: formatCode(tsx),
  };
}

/**
 * Generates code for a single element (useful for preview)
 * @param element - Single builder element
 * @returns Generated code object
 */
export function generateElementCode(element: BuilderElement): GeneratedCode {
  return {
    jsx: formatCode(generateJSX(element, 0)),
    tsx: formatCode(generateTSX(element, 0)),
  };
}
