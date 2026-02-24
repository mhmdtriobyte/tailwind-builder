// Global Style Definitions
// Provides CSS reset options, base styles, and customizable global styling

// =============================================================================
// CSS RESET OPTIONS
// =============================================================================

export type CSSResetType = 'none' | 'normalize' | 'meyer' | 'modern' | 'tailwind';

export interface CSSResetOption {
  id: CSSResetType;
  name: string;
  description: string;
  css: string;
}

/**
 * Normalize.css v8.0.1
 * Makes browsers render elements more consistently
 */
const normalizeResetCSS = `
/* Normalize CSS Reset */
html {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}
body {
  margin: 0;
}
main {
  display: block;
}
h1 {
  font-size: 2em;
  margin: 0.67em 0;
}
hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}
pre {
  font-family: monospace, monospace;
  font-size: 1em;
}
a {
  background-color: transparent;
}
abbr[title] {
  border-bottom: none;
  text-decoration: underline;
  text-decoration: underline dotted;
}
b, strong {
  font-weight: bolder;
}
code, kbd, samp {
  font-family: monospace, monospace;
  font-size: 1em;
}
small {
  font-size: 80%;
}
sub, sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}
sub {
  bottom: -0.25em;
}
sup {
  top: -0.5em;
}
img {
  border-style: none;
}
button, input, optgroup, select, textarea {
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
}
button, input {
  overflow: visible;
}
button, select {
  text-transform: none;
}
button, [type="button"], [type="reset"], [type="submit"] {
  -webkit-appearance: button;
}
button::-moz-focus-inner, [type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner, [type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}
fieldset {
  padding: 0.35em 0.75em 0.625em;
}
legend {
  box-sizing: border-box;
  color: inherit;
  display: table;
  max-width: 100%;
  padding: 0;
  white-space: normal;
}
progress {
  vertical-align: baseline;
}
textarea {
  overflow: auto;
}
[type="checkbox"], [type="radio"] {
  box-sizing: border-box;
  padding: 0;
}
[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}
[type="search"] {
  -webkit-appearance: textfield;
  outline-offset: -2px;
}
[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}
::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit;
}
details {
  display: block;
}
summary {
  display: list-item;
}
template {
  display: none;
}
[hidden] {
  display: none;
}
`;

/**
 * Eric Meyer's CSS Reset
 * Removes all default styling
 */
const meyerResetCSS = `
/* Meyer CSS Reset */
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}
body {
  line-height: 1;
}
ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
`;

/**
 * Modern CSS Reset
 * Minimal but comprehensive reset
 */
const modernResetCSS = `
/* Modern CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
}
* {
  margin: 0;
}
html {
  -moz-text-size-adjust: none;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
}
body {
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}
input, button, textarea, select {
  font: inherit;
}
p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}
#root, #__next {
  isolation: isolate;
}
ul[role='list'], ol[role='list'] {
  list-style: none;
}
a:not([class]) {
  text-decoration-skip-ink: auto;
  color: currentColor;
}
button {
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}
`;

/**
 * Tailwind CSS Preflight
 * Based on modern-normalize with Tailwind additions
 */
const tailwindResetCSS = `
/* Tailwind Preflight */
*, ::before, ::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: currentColor;
}
html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
  tab-size: 4;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  font-feature-settings: normal;
  font-variation-settings: normal;
}
body {
  margin: 0;
  line-height: inherit;
}
hr {
  height: 0;
  color: inherit;
  border-top-width: 1px;
}
abbr:where([title]) {
  text-decoration: underline dotted;
}
h1, h2, h3, h4, h5, h6 {
  font-size: inherit;
  font-weight: inherit;
}
a {
  color: inherit;
  text-decoration: inherit;
}
b, strong {
  font-weight: bolder;
}
code, kbd, samp, pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 1em;
}
small {
  font-size: 80%;
}
sub, sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}
sub {
  bottom: -0.25em;
}
sup {
  top: -0.5em;
}
table {
  text-indent: 0;
  border-color: inherit;
  border-collapse: collapse;
}
button, input, optgroup, select, textarea {
  font-family: inherit;
  font-feature-settings: inherit;
  font-variation-settings: inherit;
  font-size: 100%;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
  margin: 0;
  padding: 0;
}
button, select {
  text-transform: none;
}
button, [type='button'], [type='reset'], [type='submit'] {
  -webkit-appearance: button;
  background-color: transparent;
  background-image: none;
}
:-moz-focusring {
  outline: auto;
}
:-moz-ui-invalid {
  box-shadow: none;
}
progress {
  vertical-align: baseline;
}
::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
  height: auto;
}
[type='search'] {
  -webkit-appearance: textfield;
  outline-offset: -2px;
}
::-webkit-search-decoration {
  -webkit-appearance: none;
}
::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit;
}
summary {
  display: list-item;
}
blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre {
  margin: 0;
}
fieldset {
  margin: 0;
  padding: 0;
}
legend {
  padding: 0;
}
ol, ul, menu {
  list-style: none;
  margin: 0;
  padding: 0;
}
dialog {
  padding: 0;
}
textarea {
  resize: vertical;
}
input::placeholder, textarea::placeholder {
  opacity: 1;
  color: #9ca3af;
}
button, [role="button"] {
  cursor: pointer;
}
:disabled {
  cursor: default;
}
img, svg, video, canvas, audio, iframe, embed, object {
  display: block;
  vertical-align: middle;
}
img, video {
  max-width: 100%;
  height: auto;
}
[hidden] {
  display: none;
}
`;

export const CSS_RESET_OPTIONS: CSSResetOption[] = [
  {
    id: 'none',
    name: 'None',
    description: 'No CSS reset applied',
    css: '',
  },
  {
    id: 'normalize',
    name: 'Normalize',
    description: 'Makes browsers render elements consistently',
    css: normalizeResetCSS,
  },
  {
    id: 'meyer',
    name: 'Meyer Reset',
    description: 'Removes all default browser styling',
    css: meyerResetCSS,
  },
  {
    id: 'modern',
    name: 'Modern Reset',
    description: 'Minimal but comprehensive modern reset',
    css: modernResetCSS,
  },
  {
    id: 'tailwind',
    name: 'Tailwind Preflight',
    description: 'Tailwind CSS base styles (recommended)',
    css: tailwindResetCSS,
  },
];

// =============================================================================
// BASE STYLES
// =============================================================================

export interface BaseStyles {
  html: HTMLBaseStyles;
  body: BodyBaseStyles;
  typography: TypographyBaseStyles;
}

export interface HTMLBaseStyles {
  fontSize: string;
  scrollBehavior: 'auto' | 'smooth';
  textSizeAdjust: string;
}

export interface BodyBaseStyles {
  backgroundColor: string;
  color: string;
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  minHeight: string;
  antialiased: boolean;
}

export interface TypographyBaseStyles {
  headingFontFamily: string;
  headingLineHeight: string;
  headingFontWeight: string;
  paragraphMarginBottom: string;
  codeFont: string;
}

export const DEFAULT_BASE_STYLES: BaseStyles = {
  html: {
    fontSize: '16px',
    scrollBehavior: 'smooth',
    textSizeAdjust: '100%',
  },
  body: {
    backgroundColor: '#ffffff',
    color: '#1f2937',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '1rem',
    lineHeight: '1.5',
    minHeight: '100vh',
    antialiased: true,
  },
  typography: {
    headingFontFamily: 'inherit',
    headingLineHeight: '1.2',
    headingFontWeight: '700',
    paragraphMarginBottom: '1rem',
    codeFont: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
};

export function generateBaseStylesCSS(styles: BaseStyles): string {
  const antialiased = styles.body.antialiased
    ? '-webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;'
    : '';

  return `
/* Base Styles */
html {
  font-size: ${styles.html.fontSize};
  scroll-behavior: ${styles.html.scrollBehavior};
  -webkit-text-size-adjust: ${styles.html.textSizeAdjust};
}

body {
  background-color: ${styles.body.backgroundColor};
  color: ${styles.body.color};
  font-family: ${styles.body.fontFamily};
  font-size: ${styles.body.fontSize};
  line-height: ${styles.body.lineHeight};
  min-height: ${styles.body.minHeight};
  ${antialiased}
}

h1, h2, h3, h4, h5, h6 {
  font-family: ${styles.typography.headingFontFamily};
  line-height: ${styles.typography.headingLineHeight};
  font-weight: ${styles.typography.headingFontWeight};
}

p {
  margin-bottom: ${styles.typography.paragraphMarginBottom};
}

code, pre {
  font-family: ${styles.typography.codeFont};
}
`;
}

// =============================================================================
// LINK STYLES
// =============================================================================

export interface LinkStyles {
  color: string;
  hoverColor: string;
  visitedColor: string;
  activeColor: string;
  textDecoration: 'none' | 'underline' | 'underline-offset';
  hoverTextDecoration: 'none' | 'underline' | 'underline-offset';
  transition: string;
  focusOutline: boolean;
}

export const DEFAULT_LINK_STYLES: LinkStyles = {
  color: '#3b82f6',
  hoverColor: '#2563eb',
  visitedColor: '#7c3aed',
  activeColor: '#1d4ed8',
  textDecoration: 'none',
  hoverTextDecoration: 'underline',
  transition: 'color 150ms ease',
  focusOutline: true,
};

export function generateLinkStylesCSS(styles: LinkStyles): string {
  const textDecoration = styles.textDecoration === 'underline-offset'
    ? 'text-decoration: underline;\n  text-underline-offset: 2px;'
    : `text-decoration: ${styles.textDecoration};`;

  const hoverTextDecoration = styles.hoverTextDecoration === 'underline-offset'
    ? 'text-decoration: underline;\n  text-underline-offset: 2px;'
    : `text-decoration: ${styles.hoverTextDecoration};`;

  return `
/* Link Styles */
a {
  color: ${styles.color};
  ${textDecoration}
  transition: ${styles.transition};
}

a:hover {
  color: ${styles.hoverColor};
  ${hoverTextDecoration}
}

a:visited {
  color: ${styles.visitedColor};
}

a:active {
  color: ${styles.activeColor};
}

${styles.focusOutline ? `
a:focus-visible {
  outline: 2px solid ${styles.color};
  outline-offset: 2px;
  border-radius: 2px;
}
` : ''}
`;
}

// =============================================================================
// LIST STYLES
// =============================================================================

export interface ListStyles {
  ulListStyleType: string;
  olListStyleType: string;
  listPaddingLeft: string;
  listMarginBottom: string;
  listItemMarginBottom: string;
  nestedListMarginTop: string;
}

export const DEFAULT_LIST_STYLES: ListStyles = {
  ulListStyleType: 'disc',
  olListStyleType: 'decimal',
  listPaddingLeft: '1.5rem',
  listMarginBottom: '1rem',
  listItemMarginBottom: '0.25rem',
  nestedListMarginTop: '0.5rem',
};

export function generateListStylesCSS(styles: ListStyles): string {
  return `
/* List Styles */
ul {
  list-style-type: ${styles.ulListStyleType};
  padding-left: ${styles.listPaddingLeft};
  margin-bottom: ${styles.listMarginBottom};
}

ol {
  list-style-type: ${styles.olListStyleType};
  padding-left: ${styles.listPaddingLeft};
  margin-bottom: ${styles.listMarginBottom};
}

li {
  margin-bottom: ${styles.listItemMarginBottom};
}

ul ul, ul ol, ol ul, ol ol {
  margin-top: ${styles.nestedListMarginTop};
  margin-bottom: 0;
}
`;
}

// =============================================================================
// TABLE STYLES
// =============================================================================

export interface TableStyles {
  borderCollapse: 'collapse' | 'separate';
  borderSpacing: string;
  borderColor: string;
  headerBackgroundColor: string;
  headerColor: string;
  headerFontWeight: string;
  cellPadding: string;
  stripedRows: boolean;
  stripedColor: string;
  hoverRows: boolean;
  hoverColor: string;
}

export const DEFAULT_TABLE_STYLES: TableStyles = {
  borderCollapse: 'collapse',
  borderSpacing: '0',
  borderColor: '#e5e7eb',
  headerBackgroundColor: '#f9fafb',
  headerColor: '#374151',
  headerFontWeight: '600',
  cellPadding: '0.75rem 1rem',
  stripedRows: true,
  stripedColor: '#f9fafb',
  hoverRows: true,
  hoverColor: '#f3f4f6',
};

export function generateTableStylesCSS(styles: TableStyles): string {
  const striped = styles.stripedRows ? `
tbody tr:nth-child(even) {
  background-color: ${styles.stripedColor};
}
` : '';

  const hover = styles.hoverRows ? `
tbody tr:hover {
  background-color: ${styles.hoverColor};
}
` : '';

  return `
/* Table Styles */
table {
  border-collapse: ${styles.borderCollapse};
  border-spacing: ${styles.borderSpacing};
  width: 100%;
}

th, td {
  border: 1px solid ${styles.borderColor};
  padding: ${styles.cellPadding};
  text-align: left;
}

th {
  background-color: ${styles.headerBackgroundColor};
  color: ${styles.headerColor};
  font-weight: ${styles.headerFontWeight};
}
${striped}${hover}
`;
}

// =============================================================================
// FORM STYLES
// =============================================================================

export interface FormStyles {
  inputBackgroundColor: string;
  inputBorderColor: string;
  inputBorderRadius: string;
  inputBorderWidth: string;
  inputPadding: string;
  inputFocusBorderColor: string;
  inputFocusRingColor: string;
  inputFocusRingWidth: string;
  inputPlaceholderColor: string;
  labelColor: string;
  labelFontSize: string;
  labelFontWeight: string;
  labelMarginBottom: string;
  inputDisabledOpacity: string;
  inputDisabledBackgroundColor: string;
}

export const DEFAULT_FORM_STYLES: FormStyles = {
  inputBackgroundColor: '#ffffff',
  inputBorderColor: '#d1d5db',
  inputBorderRadius: '0.375rem',
  inputBorderWidth: '1px',
  inputPadding: '0.5rem 0.75rem',
  inputFocusBorderColor: '#3b82f6',
  inputFocusRingColor: 'rgba(59, 130, 246, 0.5)',
  inputFocusRingWidth: '3px',
  inputPlaceholderColor: '#9ca3af',
  labelColor: '#374151',
  labelFontSize: '0.875rem',
  labelFontWeight: '500',
  labelMarginBottom: '0.5rem',
  inputDisabledOpacity: '0.5',
  inputDisabledBackgroundColor: '#f3f4f6',
};

export function generateFormStylesCSS(styles: FormStyles): string {
  return `
/* Form Styles */
label {
  color: ${styles.labelColor};
  font-size: ${styles.labelFontSize};
  font-weight: ${styles.labelFontWeight};
  margin-bottom: ${styles.labelMarginBottom};
  display: block;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
input[type="tel"],
input[type="url"],
input[type="search"],
input[type="date"],
input[type="time"],
input[type="datetime-local"],
textarea,
select {
  background-color: ${styles.inputBackgroundColor};
  border: ${styles.inputBorderWidth} solid ${styles.inputBorderColor};
  border-radius: ${styles.inputBorderRadius};
  padding: ${styles.inputPadding};
  width: 100%;
  font-size: 1rem;
  line-height: 1.5;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

input::placeholder,
textarea::placeholder {
  color: ${styles.inputPlaceholderColor};
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: ${styles.inputFocusBorderColor};
  box-shadow: 0 0 0 ${styles.inputFocusRingWidth} ${styles.inputFocusRingColor};
}

input:disabled,
textarea:disabled,
select:disabled {
  opacity: ${styles.inputDisabledOpacity};
  background-color: ${styles.inputDisabledBackgroundColor};
  cursor: not-allowed;
}

button[type="submit"],
input[type="submit"] {
  cursor: pointer;
}
`;
}

// =============================================================================
// SCROLLBAR STYLES
// =============================================================================

export interface ScrollbarStyles {
  enabled: boolean;
  width: string;
  height: string;
  trackColor: string;
  thumbColor: string;
  thumbHoverColor: string;
  thumbBorderRadius: string;
  trackBorderRadius: string;
}

export const DEFAULT_SCROLLBAR_STYLES: ScrollbarStyles = {
  enabled: true,
  width: '8px',
  height: '8px',
  trackColor: '#f1f1f1',
  thumbColor: '#c1c1c1',
  thumbHoverColor: '#a8a8a8',
  thumbBorderRadius: '4px',
  trackBorderRadius: '4px',
};

export function generateScrollbarStylesCSS(styles: ScrollbarStyles): string {
  if (!styles.enabled) return '';

  return `
/* Scrollbar Styles */
::-webkit-scrollbar {
  width: ${styles.width};
  height: ${styles.height};
}

::-webkit-scrollbar-track {
  background: ${styles.trackColor};
  border-radius: ${styles.trackBorderRadius};
}

::-webkit-scrollbar-thumb {
  background: ${styles.thumbColor};
  border-radius: ${styles.thumbBorderRadius};
}

::-webkit-scrollbar-thumb:hover {
  background: ${styles.thumbHoverColor};
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: ${styles.thumbColor} ${styles.trackColor};
}
`;
}

// =============================================================================
// SELECTION STYLES
// =============================================================================

export interface SelectionStyles {
  backgroundColor: string;
  color: string;
}

export const DEFAULT_SELECTION_STYLES: SelectionStyles = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
};

export function generateSelectionStylesCSS(styles: SelectionStyles): string {
  return `
/* Selection Styles */
::selection {
  background-color: ${styles.backgroundColor};
  color: ${styles.color};
}

::-moz-selection {
  background-color: ${styles.backgroundColor};
  color: ${styles.color};
}
`;
}

// =============================================================================
// FOCUS STYLES
// =============================================================================

export interface FocusStyles {
  outlineStyle: 'solid' | 'dashed' | 'dotted' | 'double';
  outlineWidth: string;
  outlineColor: string;
  outlineOffset: string;
  focusWithinEnabled: boolean;
  focusVisibleOnly: boolean;
}

export const DEFAULT_FOCUS_STYLES: FocusStyles = {
  outlineStyle: 'solid',
  outlineWidth: '2px',
  outlineColor: '#3b82f6',
  outlineOffset: '2px',
  focusWithinEnabled: true,
  focusVisibleOnly: true,
};

export function generateFocusStylesCSS(styles: FocusStyles): string {
  const selector = styles.focusVisibleOnly ? ':focus-visible' : ':focus';

  return `
/* Focus Styles */
${selector} {
  outline: ${styles.outlineWidth} ${styles.outlineStyle} ${styles.outlineColor};
  outline-offset: ${styles.outlineOffset};
}

${styles.focusVisibleOnly ? `
:focus:not(:focus-visible) {
  outline: none;
}
` : ''}

${styles.focusWithinEnabled ? `
:focus-within {
  outline: none;
}
` : ''}
`;
}

// =============================================================================
// PRINT STYLES
// =============================================================================

export interface PrintStyles {
  enabled: boolean;
  hideSelectors: string[];
  pageSize: string;
  pageMargins: string;
  removeBackgrounds: boolean;
  blackText: boolean;
  showLinks: boolean;
}

export const DEFAULT_PRINT_STYLES: PrintStyles = {
  enabled: true,
  hideSelectors: ['nav', 'footer', '.no-print', '[data-no-print]'],
  pageSize: 'A4',
  pageMargins: '2cm',
  removeBackgrounds: true,
  blackText: true,
  showLinks: true,
};

export function generatePrintStylesCSS(styles: PrintStyles): string {
  if (!styles.enabled) return '';

  const hideSelectors = styles.hideSelectors.join(', ');
  const backgrounds = styles.removeBackgrounds ? 'background: none !important;' : '';
  const textColor = styles.blackText ? 'color: black !important;' : '';
  const links = styles.showLinks ? `
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #666;
  }
  a[href^="#"]::after,
  a[href^="javascript:"]::after {
    content: "";
  }
` : '';

  return `
/* Print Styles */
@media print {
  @page {
    size: ${styles.pageSize};
    margin: ${styles.pageMargins};
  }

  ${hideSelectors} {
    display: none !important;
  }

  body {
    ${backgrounds}
    ${textColor}
  }
  ${links}
}
`;
}

// =============================================================================
// COMPLETE GLOBAL STYLES CONFIG
// =============================================================================

export interface GlobalStylesConfig {
  cssReset: CSSResetType;
  baseStyles: BaseStyles;
  linkStyles: LinkStyles;
  listStyles: ListStyles;
  tableStyles: TableStyles;
  formStyles: FormStyles;
  scrollbarStyles: ScrollbarStyles;
  selectionStyles: SelectionStyles;
  focusStyles: FocusStyles;
  printStyles: PrintStyles;
  customCSS: string;
  cssVariables: Record<string, string>;
}

export const DEFAULT_GLOBAL_STYLES_CONFIG: GlobalStylesConfig = {
  cssReset: 'tailwind',
  baseStyles: DEFAULT_BASE_STYLES,
  linkStyles: DEFAULT_LINK_STYLES,
  listStyles: DEFAULT_LIST_STYLES,
  tableStyles: DEFAULT_TABLE_STYLES,
  formStyles: DEFAULT_FORM_STYLES,
  scrollbarStyles: DEFAULT_SCROLLBAR_STYLES,
  selectionStyles: DEFAULT_SELECTION_STYLES,
  focusStyles: DEFAULT_FOCUS_STYLES,
  printStyles: DEFAULT_PRINT_STYLES,
  customCSS: '',
  cssVariables: {
    '--color-primary': '#3b82f6',
    '--color-secondary': '#6366f1',
    '--color-accent': '#f59e0b',
    '--color-success': '#10b981',
    '--color-warning': '#f59e0b',
    '--color-error': '#ef4444',
    '--font-sans': 'ui-sans-serif, system-ui, -apple-system, sans-serif',
    '--font-serif': 'ui-serif, Georgia, Cambria, serif',
    '--font-mono': 'ui-monospace, SFMono-Regular, monospace',
    '--radius-sm': '0.25rem',
    '--radius-md': '0.375rem',
    '--radius-lg': '0.5rem',
    '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
};

export function generateCSSVariablesCSS(variables: Record<string, string>): string {
  const entries = Object.entries(variables);
  if (entries.length === 0) return '';

  const vars = entries.map(([key, value]) => `  ${key}: ${value};`).join('\n');
  return `
/* CSS Variables */
:root {
${vars}
}
`;
}

export function generateCompleteGlobalStylesCSS(config: GlobalStylesConfig): string {
  const resetOption = CSS_RESET_OPTIONS.find(r => r.id === config.cssReset);
  const resetCSS = resetOption?.css || '';

  const sections = [
    resetCSS,
    generateCSSVariablesCSS(config.cssVariables),
    generateBaseStylesCSS(config.baseStyles),
    generateLinkStylesCSS(config.linkStyles),
    generateListStylesCSS(config.listStyles),
    generateTableStylesCSS(config.tableStyles),
    generateFormStylesCSS(config.formStyles),
    generateScrollbarStylesCSS(config.scrollbarStyles),
    generateSelectionStylesCSS(config.selectionStyles),
    generateFocusStylesCSS(config.focusStyles),
    generatePrintStylesCSS(config.printStyles),
    config.customCSS ? `\n/* Custom CSS */\n${config.customCSS}` : '',
  ];

  return sections.filter(Boolean).join('\n');
}

// =============================================================================
// PRESETS
// =============================================================================

export type GlobalStylesPreset = 'minimal' | 'default' | 'professional' | 'playful' | 'dark';

export const GLOBAL_STYLES_PRESETS: Record<GlobalStylesPreset, Partial<GlobalStylesConfig>> = {
  minimal: {
    cssReset: 'modern',
    linkStyles: {
      ...DEFAULT_LINK_STYLES,
      textDecoration: 'none',
      hoverTextDecoration: 'none',
    },
    scrollbarStyles: {
      ...DEFAULT_SCROLLBAR_STYLES,
      enabled: false,
    },
  },
  default: DEFAULT_GLOBAL_STYLES_CONFIG,
  professional: {
    cssReset: 'normalize',
    baseStyles: {
      ...DEFAULT_BASE_STYLES,
      body: {
        ...DEFAULT_BASE_STYLES.body,
        fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
        color: '#1a1a1a',
        backgroundColor: '#fafafa',
      },
    },
    linkStyles: {
      ...DEFAULT_LINK_STYLES,
      color: '#0066cc',
      hoverColor: '#004499',
    },
    tableStyles: {
      ...DEFAULT_TABLE_STYLES,
      headerBackgroundColor: '#f0f0f0',
    },
  },
  playful: {
    cssReset: 'tailwind',
    baseStyles: {
      ...DEFAULT_BASE_STYLES,
      body: {
        ...DEFAULT_BASE_STYLES.body,
        fontFamily: '"Nunito", ui-sans-serif, system-ui, sans-serif',
      },
    },
    linkStyles: {
      ...DEFAULT_LINK_STYLES,
      color: '#ec4899',
      hoverColor: '#db2777',
      visitedColor: '#a855f7',
    },
    selectionStyles: {
      backgroundColor: '#ec4899',
      color: '#ffffff',
    },
    focusStyles: {
      ...DEFAULT_FOCUS_STYLES,
      outlineColor: '#ec4899',
    },
  },
  dark: {
    cssReset: 'tailwind',
    baseStyles: {
      ...DEFAULT_BASE_STYLES,
      body: {
        ...DEFAULT_BASE_STYLES.body,
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
      },
    },
    linkStyles: {
      ...DEFAULT_LINK_STYLES,
      color: '#60a5fa',
      hoverColor: '#93c5fd',
      visitedColor: '#a78bfa',
    },
    tableStyles: {
      ...DEFAULT_TABLE_STYLES,
      borderColor: '#334155',
      headerBackgroundColor: '#1e293b',
      headerColor: '#f1f5f9',
      stripedColor: '#1e293b',
      hoverColor: '#334155',
    },
    formStyles: {
      ...DEFAULT_FORM_STYLES,
      inputBackgroundColor: '#1e293b',
      inputBorderColor: '#334155',
      labelColor: '#e2e8f0',
      inputPlaceholderColor: '#64748b',
      inputDisabledBackgroundColor: '#0f172a',
    },
    scrollbarStyles: {
      ...DEFAULT_SCROLLBAR_STYLES,
      trackColor: '#1e293b',
      thumbColor: '#475569',
      thumbHoverColor: '#64748b',
    },
    selectionStyles: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
    },
    cssVariables: {
      ...DEFAULT_GLOBAL_STYLES_CONFIG.cssVariables,
      '--color-primary': '#60a5fa',
      '--color-secondary': '#818cf8',
    },
  },
};

export function applyPreset(
  currentConfig: GlobalStylesConfig,
  preset: GlobalStylesPreset
): GlobalStylesConfig {
  const presetConfig = GLOBAL_STYLES_PRESETS[preset];
  return {
    ...currentConfig,
    ...presetConfig,
    baseStyles: {
      ...currentConfig.baseStyles,
      ...(presetConfig.baseStyles || {}),
      html: {
        ...currentConfig.baseStyles.html,
        ...(presetConfig.baseStyles?.html || {}),
      },
      body: {
        ...currentConfig.baseStyles.body,
        ...(presetConfig.baseStyles?.body || {}),
      },
      typography: {
        ...currentConfig.baseStyles.typography,
        ...(presetConfig.baseStyles?.typography || {}),
      },
    },
    linkStyles: {
      ...currentConfig.linkStyles,
      ...(presetConfig.linkStyles || {}),
    },
    listStyles: {
      ...currentConfig.listStyles,
      ...(presetConfig.listStyles || {}),
    },
    tableStyles: {
      ...currentConfig.tableStyles,
      ...(presetConfig.tableStyles || {}),
    },
    formStyles: {
      ...currentConfig.formStyles,
      ...(presetConfig.formStyles || {}),
    },
    scrollbarStyles: {
      ...currentConfig.scrollbarStyles,
      ...(presetConfig.scrollbarStyles || {}),
    },
    selectionStyles: {
      ...currentConfig.selectionStyles,
      ...(presetConfig.selectionStyles || {}),
    },
    focusStyles: {
      ...currentConfig.focusStyles,
      ...(presetConfig.focusStyles || {}),
    },
    printStyles: {
      ...currentConfig.printStyles,
      ...(presetConfig.printStyles || {}),
    },
    cssVariables: {
      ...currentConfig.cssVariables,
      ...(presetConfig.cssVariables || {}),
    },
  };
}
