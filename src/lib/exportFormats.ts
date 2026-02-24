/**
 * Export Formats
 *
 * Provides multiple export formats for generated code:
 * - HTML + inline styles
 * - HTML + embedded CSS
 * - HTML + external CSS file
 * - HTML + Tailwind CDN
 * - SCSS/SASS output
 * - CSS-in-JS format
 * - Styled Components format
 * - Emotion format
 */

import type { BuilderElement, ElementStyles } from '@/types/builder';
import { generateHTML, generateHTMLWithCSS, generateHTMLSnippet } from './htmlGenerator';
import { generateCSS, generateCSSinJS, generateUtilityCSS } from './cssGenerator';
import { generateCode, generateJSX, generateTSX } from './codeGenerator';

// ============================================================================
// TYPES
// ============================================================================

export type ExportFormat =
  | 'html-inline'
  | 'html-embedded'
  | 'html-external'
  | 'html-tailwind-cdn'
  | 'react-jsx'
  | 'react-tsx'
  | 'vue-sfc'
  | 'scss'
  | 'css-modules'
  | 'styled-components'
  | 'emotion'
  | 'css-in-js';

export type StyleFormat =
  | 'tailwind'
  | 'css'
  | 'scss'
  | 'css-modules'
  | 'styled-components'
  | 'emotion';

export interface ExportResult {
  /** Primary file content */
  primary: {
    filename: string;
    content: string;
    language: string;
  };
  /** Additional files (CSS, etc.) */
  secondary?: {
    filename: string;
    content: string;
    language: string;
  }[];
  /** Dependencies to install */
  dependencies?: Record<string, string>;
  /** Dev dependencies to install */
  devDependencies?: Record<string, string>;
}

export interface FormatExportOptions {
  /** Component name */
  componentName: string;
  /** Page title */
  pageTitle: string;
  /** Page description */
  pageDescription: string;
  /** Include comments */
  includeComments: boolean;
  /** Minify output */
  minify: boolean;
  /** Use TypeScript */
  typescript: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_EXPORT_OPTIONS: FormatExportOptions = {
  componentName: 'GeneratedComponent',
  pageTitle: 'Generated Page',
  pageDescription: 'Page generated with Tailwind Builder',
  includeComments: false,
  minify: false,
  typescript: false,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extracts inline styles from Tailwind classes
 */
function tailwindToInlineStyle(styles: ElementStyles): string {
  const allClasses = [
    ...styles.layout,
    ...styles.spacing,
    ...styles.typography,
    ...styles.colors,
    ...styles.borders,
    ...styles.effects,
  ];

  // Import the CSS-in-JS generator for converting classes to styles
  const cssProperties: string[] = [];

  // Basic mapping for common Tailwind classes to inline styles
  const classToStyle: Record<string, string> = {
    // Display
    'flex': 'display: flex',
    'block': 'display: block',
    'inline': 'display: inline',
    'inline-block': 'display: inline-block',
    'grid': 'display: grid',
    'hidden': 'display: none',

    // Flex direction
    'flex-row': 'flex-direction: row',
    'flex-col': 'flex-direction: column',

    // Justify content
    'justify-start': 'justify-content: flex-start',
    'justify-center': 'justify-content: center',
    'justify-end': 'justify-content: flex-end',
    'justify-between': 'justify-content: space-between',
    'justify-around': 'justify-content: space-around',

    // Align items
    'items-start': 'align-items: flex-start',
    'items-center': 'align-items: center',
    'items-end': 'align-items: flex-end',
    'items-stretch': 'align-items: stretch',

    // Width
    'w-full': 'width: 100%',
    'w-screen': 'width: 100vw',
    'w-auto': 'width: auto',

    // Height
    'h-full': 'height: 100%',
    'h-screen': 'height: 100vh',
    'h-auto': 'height: auto',

    // Position
    'relative': 'position: relative',
    'absolute': 'position: absolute',
    'fixed': 'position: fixed',
    'sticky': 'position: sticky',

    // Text align
    'text-left': 'text-align: left',
    'text-center': 'text-align: center',
    'text-right': 'text-align: right',

    // Font weight
    'font-thin': 'font-weight: 100',
    'font-light': 'font-weight: 300',
    'font-normal': 'font-weight: 400',
    'font-medium': 'font-weight: 500',
    'font-semibold': 'font-weight: 600',
    'font-bold': 'font-weight: 700',
    'font-extrabold': 'font-weight: 800',

    // Border radius
    'rounded': 'border-radius: 0.25rem',
    'rounded-sm': 'border-radius: 0.125rem',
    'rounded-md': 'border-radius: 0.375rem',
    'rounded-lg': 'border-radius: 0.5rem',
    'rounded-xl': 'border-radius: 0.75rem',
    'rounded-2xl': 'border-radius: 1rem',
    'rounded-full': 'border-radius: 9999px',
    'rounded-none': 'border-radius: 0',

    // Shadow
    'shadow': 'box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1)',
    'shadow-sm': 'box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)',
    'shadow-md': 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)',
    'shadow-lg': 'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1)',
    'shadow-xl': 'box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1)',
    'shadow-none': 'box-shadow: none',

    // Overflow
    'overflow-hidden': 'overflow: hidden',
    'overflow-auto': 'overflow: auto',
    'overflow-scroll': 'overflow: scroll',

    // Cursor
    'cursor-pointer': 'cursor: pointer',
    'cursor-not-allowed': 'cursor: not-allowed',

    // Transition
    'transition': 'transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    'transition-colors': 'transition: color, background-color, border-color 150ms',
  };

  allClasses.forEach(cls => {
    // Skip responsive and pseudo-class prefixed classes for inline styles
    if (cls.includes(':')) return;

    if (classToStyle[cls]) {
      cssProperties.push(classToStyle[cls]);
    }

    // Handle spacing classes
    const spacingMatch = cls.match(/^(p|m|px|py|pt|pr|pb|pl|mx|my|mt|mr|mb|ml|gap)-(\d+\.?\d*|px)$/);
    if (spacingMatch) {
      const [, prop, value] = spacingMatch;
      const spacing = value === 'px' ? '1px' : `${parseFloat(value) * 0.25}rem`;

      const propMap: Record<string, string> = {
        'p': 'padding',
        'm': 'margin',
        'px': 'padding-left; padding-right',
        'py': 'padding-top; padding-bottom',
        'pt': 'padding-top',
        'pr': 'padding-right',
        'pb': 'padding-bottom',
        'pl': 'padding-left',
        'mx': 'margin-left; margin-right',
        'my': 'margin-top; margin-bottom',
        'mt': 'margin-top',
        'mr': 'margin-right',
        'mb': 'margin-bottom',
        'ml': 'margin-left',
        'gap': 'gap',
      };

      if (propMap[prop].includes(';')) {
        const props = propMap[prop].split(';').map(p => p.trim());
        props.forEach(p => cssProperties.push(`${p}: ${spacing}`));
      } else {
        cssProperties.push(`${propMap[prop]}: ${spacing}`);
      }
    }

    // Handle text size
    const textSizes: Record<string, string> = {
      'text-xs': 'font-size: 0.75rem; line-height: 1rem',
      'text-sm': 'font-size: 0.875rem; line-height: 1.25rem',
      'text-base': 'font-size: 1rem; line-height: 1.5rem',
      'text-lg': 'font-size: 1.125rem; line-height: 1.75rem',
      'text-xl': 'font-size: 1.25rem; line-height: 1.75rem',
      'text-2xl': 'font-size: 1.5rem; line-height: 2rem',
      'text-3xl': 'font-size: 1.875rem; line-height: 2.25rem',
      'text-4xl': 'font-size: 2.25rem; line-height: 2.5rem',
      'text-5xl': 'font-size: 3rem; line-height: 1',
      'text-6xl': 'font-size: 3.75rem; line-height: 1',
    };
    if (textSizes[cls]) {
      cssProperties.push(textSizes[cls]);
    }

    // Handle colors
    const colorMatch = cls.match(/^(text|bg|border)-([a-z]+)-(\d+)$/);
    if (colorMatch) {
      const [, type, color, shade] = colorMatch;
      // Use placeholder - actual hex values would be looked up from palette
      const hexColors: Record<string, Record<string, string>> = {
        'blue': { '500': '#3b82f6', '600': '#2563eb', '700': '#1d4ed8' },
        'gray': { '100': '#f3f4f6', '200': '#e5e7eb', '300': '#d1d5db', '500': '#6b7280', '600': '#4b5563', '700': '#374151', '800': '#1f2937', '900': '#111827' },
        'white': { '': '#ffffff' },
        'black': { '': '#000000' },
        'green': { '500': '#22c55e', '600': '#16a34a' },
        'red': { '500': '#ef4444', '600': '#dc2626' },
      };

      const hex = hexColors[color]?.[shade] || '#000000';
      if (type === 'text') cssProperties.push(`color: ${hex}`);
      if (type === 'bg') cssProperties.push(`background-color: ${hex}`);
      if (type === 'border') cssProperties.push(`border-color: ${hex}`);
    }

    // Handle special colors
    if (cls === 'text-white') cssProperties.push('color: #ffffff');
    if (cls === 'text-black') cssProperties.push('color: #000000');
    if (cls === 'bg-white') cssProperties.push('background-color: #ffffff');
    if (cls === 'bg-black') cssProperties.push('background-color: #000000');
    if (cls === 'bg-transparent') cssProperties.push('background-color: transparent');
  });

  return cssProperties.join('; ');
}

/**
 * Generates HTML with inline styles
 */
function generateInlineStyleHTML(
  element: BuilderElement,
  indent: number = 0
): string {
  const indentStr = '  '.repeat(indent);
  const style = tailwindToInlineStyle(element.styles);
  const styleAttr = style ? ` style="${style}"` : '';

  // Get semantic tag
  const tagMap: Record<string, string> = {
    'hero-section': 'section',
    'feature-section': 'section',
    'navbar': 'header',
    'footer': 'footer',
    'heading': element.props.level || 'h2',
    'paragraph': 'p',
    'link': 'a',
    'list': element.props.ordered ? 'ol' : 'ul',
    'image': 'img',
  };
  const tag = tagMap[element.type] || 'div';

  // Self-closing tags
  if (['img', 'hr', 'br', 'input'].includes(tag)) {
    let attrs = styleAttr;
    if (element.props.src) attrs += ` src="${element.props.src}"`;
    if (element.props.alt) attrs += ` alt="${element.props.alt}"`;
    return `${indentStr}<${tag}${attrs}>`;
  }

  // Generate content
  let content = '';
  if (element.props.text) {
    content = element.props.text;
  }

  // Generate children
  if (element.children.length > 0) {
    content = '\n' + element.children.map(child =>
      generateInlineStyleHTML(child, indent + 1)
    ).join('\n') + '\n' + indentStr;
  }

  return `${indentStr}<${tag}${styleAttr}>${content}</${tag}>`;
}

// ============================================================================
// EXPORT FORMAT GENERATORS
// ============================================================================

/**
 * Exports as HTML with inline styles
 */
export function exportHTMLInline(
  elements: BuilderElement[],
  options: Partial<FormatExportOptions> = {}
): ExportResult {
  const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };

  const bodyContent = elements.map(el => generateInlineStyleHTML(el, 2)).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${opts.pageDescription}">
  <title>${opts.pageTitle}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    * { margin: 0; }
    body { line-height: 1.5; -webkit-font-smoothing: antialiased; }
  </style>
</head>
<body>
  <main>
${bodyContent}
  </main>
</body>
</html>`;

  return {
    primary: {
      filename: 'index.html',
      content: opts.minify ? html.replace(/\s+/g, ' ').replace(/>\s+</g, '><') : html,
      language: 'html',
    },
  };
}

/**
 * Exports as HTML with embedded CSS
 */
export function exportHTMLEmbedded(
  elements: BuilderElement[],
  options: Partial<FormatExportOptions> = {}
): ExportResult {
  const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };

  const { css } = generateCSS(elements, { minify: opts.minify });
  const htmlResult = generateHTMLWithCSS(elements, css, {
    pageTitle: opts.pageTitle,
    pageDescription: opts.pageDescription,
    minify: opts.minify,
  });

  return {
    primary: {
      filename: 'index.html',
      content: htmlResult,
      language: 'html',
    },
  };
}

/**
 * Exports as HTML with external CSS file
 */
export function exportHTMLExternal(
  elements: BuilderElement[],
  options: Partial<FormatExportOptions> = {}
): ExportResult {
  const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };

  const { css } = generateCSS(elements, { minify: opts.minify });
  const { body } = generateHTML(elements, {
    pageTitle: opts.pageTitle,
    pageDescription: opts.pageDescription,
    minify: opts.minify,
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${opts.pageDescription}">
  <title>${opts.pageTitle}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${body}
</body>
</html>`;

  return {
    primary: {
      filename: 'index.html',
      content: opts.minify ? html.replace(/\s+/g, ' ').replace(/>\s+</g, '><') : html,
      language: 'html',
    },
    secondary: [
      {
        filename: 'styles.css',
        content: css,
        language: 'css',
      },
    ],
  };
}

/**
 * Exports as HTML with Tailwind CDN
 */
export function exportHTMLTailwindCDN(
  elements: BuilderElement[],
  options: Partial<FormatExportOptions> = {}
): ExportResult {
  const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };

  const { document } = generateHTML(elements, {
    pageTitle: opts.pageTitle,
    pageDescription: opts.pageDescription,
    minify: opts.minify,
    includeViewportMeta: true,
  });

  return {
    primary: {
      filename: 'index.html',
      content: document,
      language: 'html',
    },
  };
}

/**
 * Exports as React JSX
 */
export function exportReactJSX(
  elements: BuilderElement[],
  options: Partial<FormatExportOptions> = {}
): ExportResult {
  const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };
  const { jsx } = generateCode(elements, opts.componentName);

  return {
    primary: {
      filename: `${opts.componentName}.jsx`,
      content: jsx,
      language: 'jsx',
    },
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
    },
    devDependencies: {
      'tailwindcss': '^3.4.0',
      'postcss': '^8.4.0',
      'autoprefixer': '^10.4.0',
    },
  };
}

/**
 * Exports as React TSX
 */
export function exportReactTSX(
  elements: BuilderElement[],
  options: Partial<FormatExportOptions> = {}
): ExportResult {
  const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };
  const { tsx } = generateCode(elements, opts.componentName);

  return {
    primary: {
      filename: `${opts.componentName}.tsx`,
      content: tsx,
      language: 'tsx',
    },
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
    },
    devDependencies: {
      'tailwindcss': '^3.4.0',
      'postcss': '^8.4.0',
      'autoprefixer': '^10.4.0',
      'typescript': '^5.0.0',
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
    },
  };
}

/**
 * Exports as Vue Single File Component
 */
export function exportVueSFC(
  elements: BuilderElement[],
  options: Partial<FormatExportOptions> = {}
): ExportResult {
  const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };

  // Generate template content
  const template = generateHTMLSnippet(elements, { minify: false });

  // Convert className to class for Vue
  const vueTemplate = template.replace(/className=/g, 'class=');

  const sfc = `<template>
  <div class="w-full">
${vueTemplate.split('\n').map(line => '    ' + line).join('\n')}
  </div>
</template>

<script${opts.typescript ? ' lang="ts"' : ''} setup>
${opts.includeComments ? '// Component logic goes here\n' : ''}
</script>

<style scoped>
/* Custom styles go here */
</style>
`;

  return {
    primary: {
      filename: `${opts.componentName}.vue`,
      content: sfc,
      language: 'vue',
    },
    dependencies: {
      'vue': '^3.4.0',
    },
    devDependencies: {
      'tailwindcss': '^3.4.0',
      'postcss': '^8.4.0',
      'autoprefixer': '^10.4.0',
      ...(opts.typescript ? { 'typescript': '^5.0.0', 'vue-tsc': '^1.8.0' } : {}),
    },
  };
}

/**
 * Exports as SCSS
 */
export function exportSCSS(
  elements: BuilderElement[],
  options: Partial<FormatExportOptions> = {}
): ExportResult {
  const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };
  const { scss } = generateCSS(elements, { minify: opts.minify });

  return {
    primary: {
      filename: 'styles.scss',
      content: scss,
      language: 'scss',
    },
    devDependencies: {
      'sass': '^1.70.0',
    },
  };
}

/**
 * Exports as CSS Modules
 */
export function exportCSSModules(
  elements: BuilderElement[],
  options: Partial<FormatExportOptions> = {}
): ExportResult {
  const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };
  const { css, classMap } = generateCSS(elements, { cssModules: true, minify: opts.minify });

  // Generate component with CSS modules
  const ext = opts.typescript ? 'tsx' : 'jsx';
  const componentImport = opts.typescript
    ? `import styles from './${opts.componentName}.module.css';`
    : `import styles from './${opts.componentName}.module.css';`;

  const component = `import React from 'react';
${componentImport}
${opts.typescript ? `
interface ${opts.componentName}Props {
  className?: string;
}
` : ''}
export default function ${opts.componentName}(${opts.typescript ? `{ className }: ${opts.componentName}Props` : '{ className }'}) {
  return (
    <div className={\`\${styles.container} \${className || ''}\`}>
      {/* Component content */}
    </div>
  );
}
`;

  return {
    primary: {
      filename: `${opts.componentName}.${ext}`,
      content: component,
      language: ext,
    },
    secondary: [
      {
        filename: `${opts.componentName}.module.css`,
        content: css,
        language: 'css',
      },
    ],
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
    },
  };
}

/**
 * Exports as Styled Components
 */
export function exportStyledComponents(
  elements: BuilderElement[],
  options: Partial<FormatExportOptions> = {}
): ExportResult {
  const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };
  const cssInJS = generateCSSinJS(elements);

  const ext = opts.typescript ? 'tsx' : 'jsx';

  // Generate styled components
  const styledParts: string[] = [];

  Object.entries(cssInJS).forEach(([key, styles]) => {
    const componentName = key.split('_')[0]
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

    const cssString = Object.entries(styles)
      .map(([prop, value]) => {
        // Convert camelCase to kebab-case
        const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `  ${kebabProp}: ${value};`;
      })
      .join('\n');

    styledParts.push(`const Styled${componentName} = styled.div\`
${cssString}
\`;`);
  });

  const component = `import React from 'react';
import styled from 'styled-components';
${opts.typescript ? `
interface ${opts.componentName}Props {
  className?: string;
}
` : ''}
${styledParts.join('\n\n')}

const Container = styled.div\`
  width: 100%;
\`;

export default function ${opts.componentName}(${opts.typescript ? `{ className }: ${opts.componentName}Props` : '{ className }'}) {
  return (
    <Container className={className}>
      {/* Add styled components here */}
    </Container>
  );
}
`;

  return {
    primary: {
      filename: `${opts.componentName}.${ext}`,
      content: component,
      language: ext,
    },
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      'styled-components': '^6.1.0',
    },
    devDependencies: opts.typescript ? {
      'typescript': '^5.0.0',
      '@types/react': '^18.2.0',
      '@types/styled-components': '^5.1.0',
    } : {},
  };
}

/**
 * Exports as Emotion
 */
export function exportEmotion(
  elements: BuilderElement[],
  options: Partial<FormatExportOptions> = {}
): ExportResult {
  const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };
  const cssInJS = generateCSSinJS(elements);

  const ext = opts.typescript ? 'tsx' : 'jsx';

  // Generate emotion styles
  const styleParts: string[] = [];

  Object.entries(cssInJS).forEach(([key, styles]) => {
    const styleName = key.split('_')[0]
      .split('-')
      .map((part, idx) => idx === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

    const styleObject = JSON.stringify(styles, null, 2)
      .replace(/"([^"]+)":/g, '$1:');

    styleParts.push(`const ${styleName}Style = css(${styleObject});`);
  });

  const component = `/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
${opts.typescript ? `
interface ${opts.componentName}Props {
  className?: string;
}
` : ''}
${styleParts.join('\n\n')}

const containerStyle = css({
  width: '100%',
});

export default function ${opts.componentName}(${opts.typescript ? `{ className }: ${opts.componentName}Props` : '{ className }'}) {
  return (
    <div css={containerStyle} className={className}>
      {/* Add components with css prop here */}
    </div>
  );
}
`;

  return {
    primary: {
      filename: `${opts.componentName}.${ext}`,
      content: component,
      language: ext,
    },
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      '@emotion/react': '^11.11.0',
    },
    devDependencies: opts.typescript ? {
      'typescript': '^5.0.0',
      '@types/react': '^18.2.0',
    } : {},
  };
}

/**
 * Exports as CSS-in-JS object
 */
export function exportCSSinJSObject(
  elements: BuilderElement[],
  options: Partial<FormatExportOptions> = {}
): ExportResult {
  const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };
  const cssInJS = generateCSSinJS(elements);

  const ext = opts.typescript ? 'ts' : 'js';

  const content = `${opts.typescript ? 'export ' : 'module.exports = '}${opts.typescript ? 'const styles: Record<string, React.CSSProperties> = ' : ''}${JSON.stringify(cssInJS, null, 2)};
${opts.typescript ? '\nexport default styles;' : ''}
`;

  return {
    primary: {
      filename: `styles.${ext}`,
      content,
      language: ext,
    },
  };
}

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

/**
 * Exports elements in the specified format
 */
export function exportAs(
  format: ExportFormat,
  elements: BuilderElement[],
  options: Partial<FormatExportOptions> = {}
): ExportResult {
  switch (format) {
    case 'html-inline':
      return exportHTMLInline(elements, options);
    case 'html-embedded':
      return exportHTMLEmbedded(elements, options);
    case 'html-external':
      return exportHTMLExternal(elements, options);
    case 'html-tailwind-cdn':
      return exportHTMLTailwindCDN(elements, options);
    case 'react-jsx':
      return exportReactJSX(elements, options);
    case 'react-tsx':
      return exportReactTSX(elements, options);
    case 'vue-sfc':
      return exportVueSFC(elements, options);
    case 'scss':
      return exportSCSS(elements, options);
    case 'css-modules':
      return exportCSSModules(elements, options);
    case 'styled-components':
      return exportStyledComponents(elements, options);
    case 'emotion':
      return exportEmotion(elements, options);
    case 'css-in-js':
      return exportCSSinJSObject(elements, options);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Gets available export formats
 */
export function getAvailableFormats(): Array<{
  id: ExportFormat;
  name: string;
  description: string;
  category: string;
}> {
  return [
    {
      id: 'html-tailwind-cdn',
      name: 'HTML + Tailwind CDN',
      description: 'Standalone HTML with Tailwind via CDN',
      category: 'HTML',
    },
    {
      id: 'html-inline',
      name: 'HTML + Inline Styles',
      description: 'HTML with inline CSS styles',
      category: 'HTML',
    },
    {
      id: 'html-embedded',
      name: 'HTML + Embedded CSS',
      description: 'HTML with CSS in <style> tag',
      category: 'HTML',
    },
    {
      id: 'html-external',
      name: 'HTML + External CSS',
      description: 'Separate HTML and CSS files',
      category: 'HTML',
    },
    {
      id: 'react-jsx',
      name: 'React JSX',
      description: 'React component with Tailwind',
      category: 'React',
    },
    {
      id: 'react-tsx',
      name: 'React TSX',
      description: 'TypeScript React component',
      category: 'React',
    },
    {
      id: 'vue-sfc',
      name: 'Vue SFC',
      description: 'Vue Single File Component',
      category: 'Vue',
    },
    {
      id: 'scss',
      name: 'SCSS',
      description: 'SCSS/SASS stylesheet',
      category: 'CSS',
    },
    {
      id: 'css-modules',
      name: 'CSS Modules',
      description: 'React with CSS Modules',
      category: 'CSS',
    },
    {
      id: 'styled-components',
      name: 'Styled Components',
      description: 'CSS-in-JS with styled-components',
      category: 'CSS-in-JS',
    },
    {
      id: 'emotion',
      name: 'Emotion',
      description: 'CSS-in-JS with Emotion',
      category: 'CSS-in-JS',
    },
    {
      id: 'css-in-js',
      name: 'CSS-in-JS Object',
      description: 'Plain JavaScript style object',
      category: 'CSS-in-JS',
    },
  ];
}
