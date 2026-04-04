/**
 * Accessibility System
 *
 * Comprehensive accessibility utilities for the Tailwind Builder.
 * Provides ARIA management, focus handling, color contrast checking,
 * reduced motion detection, and screen reader utilities.
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

/**
 * Standard ARIA roles organized by component type
 */
export type AriaRole =
  | 'alert'
  | 'alertdialog'
  | 'application'
  | 'article'
  | 'banner'
  | 'button'
  | 'cell'
  | 'checkbox'
  | 'columnheader'
  | 'combobox'
  | 'complementary'
  | 'contentinfo'
  | 'definition'
  | 'dialog'
  | 'directory'
  | 'document'
  | 'feed'
  | 'figure'
  | 'form'
  | 'grid'
  | 'gridcell'
  | 'group'
  | 'heading'
  | 'img'
  | 'link'
  | 'list'
  | 'listbox'
  | 'listitem'
  | 'log'
  | 'main'
  | 'marquee'
  | 'math'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'navigation'
  | 'none'
  | 'note'
  | 'option'
  | 'presentation'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'region'
  | 'row'
  | 'rowgroup'
  | 'rowheader'
  | 'scrollbar'
  | 'search'
  | 'searchbox'
  | 'separator'
  | 'slider'
  | 'spinbutton'
  | 'status'
  | 'switch'
  | 'tab'
  | 'tablist'
  | 'tabpanel'
  | 'term'
  | 'textbox'
  | 'timer'
  | 'toolbar'
  | 'tooltip'
  | 'tree'
  | 'treegrid'
  | 'treeitem';

/**
 * Live region politeness levels
 */
export type LiveRegionPoliteness = 'off' | 'polite' | 'assertive';

/**
 * Landmark roles for page structure
 */
export type LandmarkRole =
  | 'main'
  | 'navigation'
  | 'banner'
  | 'contentinfo'
  | 'complementary'
  | 'search'
  | 'region'
  | 'form';

/**
 * ARIA attributes configuration
 */
export interface AriaAttributes {
  role?: AriaRole;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-hidden'?: boolean;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean | 'mixed';
  'aria-disabled'?: boolean;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-controls'?: string;
  'aria-owns'?: string;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-pressed'?: boolean | 'mixed';
  'aria-live'?: LiveRegionPoliteness;
  'aria-atomic'?: boolean;
  'aria-busy'?: boolean;
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';
  'aria-roledescription'?: string;
  'aria-level'?: number;
  'aria-posinset'?: number;
  'aria-setsize'?: number;
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
  'aria-orientation'?: 'horizontal' | 'vertical';
  'aria-multiselectable'?: boolean;
  'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both';
  'aria-modal'?: boolean;
  'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
  'aria-colcount'?: number;
  'aria-colindex'?: number;
  'aria-colspan'?: number;
  'aria-rowcount'?: number;
  'aria-rowindex'?: number;
  'aria-rowspan'?: number;
  'aria-activedescendant'?: string;
  'aria-errormessage'?: string;
  'aria-keyshortcuts'?: string;
  'aria-placeholder'?: string;
  'aria-readonly'?: boolean;
  tabIndex?: number;
}

/**
 * Skip link configuration
 */
export interface SkipLink {
  id: string;
  label: string;
  targetId: string;
}

/**
 * Focus trap configuration
 */
export interface FocusTrapConfig {
  containerId: string;
  initialFocusId?: string;
  returnFocusOnDeactivate?: boolean;
  allowOutsideClick?: boolean;
  escapeDeactivates?: boolean;
}

/**
 * Color representation for contrast calculations
 */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Color contrast result
 */
export interface ContrastResult {
  ratio: number;
  passesAA: boolean;
  passesAALarge: boolean;
  passesAAA: boolean;
  passesAAALarge: boolean;
  level: 'fail' | 'AA-large' | 'AA' | 'AAA-large' | 'AAA';
}

/**
 * Touch target validation result
 */
export interface TouchTargetResult {
  width: number;
  height: number;
  passesMinimum: boolean;
  passesRecommended: boolean;
  recommendation: string;
}

// ============================================================================
// ARIA ROLE ASSIGNMENTS BY COMPONENT TYPE
// ============================================================================

/**
 * Maps component types to their appropriate ARIA roles
 */
export const COMPONENT_ROLES: Record<string, AriaRole | undefined> = {
  // Buttons
  'primary-button': 'button',
  'secondary-button': 'button',
  'outline-button': 'button',
  'ghost-button': 'button',
  'icon-button': 'button',
  'loading-button': 'button',
  'gradient-button': 'button',
  'button-group': 'group',

  // Cards (semantic containers)
  'simple-card': 'article',
  'product-card': 'article',
  'pricing-card': 'article',
  'testimonial-card': 'article',
  'profile-card': 'article',
  'blog-card': 'article',
  'stats-card': 'figure',
  'feature-card': 'article',
  'image-card': 'figure',
  'horizontal-card': 'article',

  // Navigation
  navbar: 'navigation',
  'mobile-menu': 'navigation',
  footer: 'contentinfo',
  breadcrumb: 'navigation',
  tabs: 'tablist',
  pagination: 'navigation',

  // Forms
  'input-field': 'textbox',
  textarea: 'textbox',
  'select-dropdown': 'combobox',
  checkbox: 'checkbox',
  'radio-group': 'radiogroup',
  'toggle-switch': 'switch',
  'login-form': 'form',
  'signup-form': 'form',
  'contact-form': 'form',
  'search-bar': 'search',
  'newsletter-form': 'form',
  'file-upload': 'button',

  // Sections (landmarks)
  'hero-section': 'banner',
  'hero-with-image': 'banner',
  'feature-section': 'region',
  'cta-section': 'region',
  'stats-section': 'region',
  'testimonials-section': 'region',
  'team-section': 'region',
  'faq-section': 'region',
  'pricing-section': 'region',
  'contact-section': 'region',

  // Layout
  container: undefined, // Semantic div
  'grid-2-col': undefined,
  'grid-3-col': undefined,
  'grid-4-col': undefined,
  'flex-row': undefined,
  'flex-column': undefined,
  divider: 'separator',
  spacer: 'presentation',

  // Media
  image: 'img',
  avatar: 'img',
  icon: 'img',
  video: undefined, // Uses native video element

  // Text
  heading: 'heading',
  paragraph: undefined, // Uses semantic p
  badge: 'status',
  link: 'link',
  list: 'list',
};

/**
 * Gets the recommended ARIA role for a component type
 */
export function getAriaRole(componentType: string): AriaRole | undefined {
  return COMPONENT_ROLES[componentType];
}

// ============================================================================
// ARIA ATTRIBUTES HELPERS
// ============================================================================

/**
 * Creates ARIA attributes for interactive elements
 */
export function createInteractiveAriaAttributes(config: {
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  expanded?: boolean;
  disabled?: boolean;
  pressed?: boolean | 'mixed';
  hasPopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  controls?: string;
}): AriaAttributes {
  const attrs: AriaAttributes = {};

  if (config.label) attrs['aria-label'] = config.label;
  if (config.labelledBy) attrs['aria-labelledby'] = config.labelledBy;
  if (config.describedBy) attrs['aria-describedby'] = config.describedBy;
  if (config.expanded !== undefined) attrs['aria-expanded'] = config.expanded;
  if (config.disabled !== undefined) attrs['aria-disabled'] = config.disabled;
  if (config.pressed !== undefined) attrs['aria-pressed'] = config.pressed;
  if (config.hasPopup !== undefined) attrs['aria-haspopup'] = config.hasPopup;
  if (config.controls) attrs['aria-controls'] = config.controls;

  return attrs;
}

/**
 * Creates ARIA attributes for form inputs
 */
export function createFormAriaAttributes(config: {
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  errorMessage?: string;
  required?: boolean;
  invalid?: boolean;
  readonly?: boolean;
  placeholder?: string;
  autocomplete?: 'none' | 'inline' | 'list' | 'both';
}): AriaAttributes {
  const attrs: AriaAttributes = {};

  if (config.label) attrs['aria-label'] = config.label;
  if (config.labelledBy) attrs['aria-labelledby'] = config.labelledBy;
  if (config.describedBy) attrs['aria-describedby'] = config.describedBy;
  if (config.errorMessage) attrs['aria-errormessage'] = config.errorMessage;
  if (config.required !== undefined) attrs['aria-required'] = config.required;
  if (config.invalid !== undefined) attrs['aria-invalid'] = config.invalid;
  if (config.readonly !== undefined) attrs['aria-readonly'] = config.readonly;
  if (config.placeholder) attrs['aria-placeholder'] = config.placeholder;
  if (config.autocomplete) attrs['aria-autocomplete'] = config.autocomplete;

  return attrs;
}

/**
 * Creates ARIA attributes for selection-based components
 */
export function createSelectionAriaAttributes(config: {
  selected?: boolean;
  checked?: boolean | 'mixed';
  multiselectable?: boolean;
  posinset?: number;
  setsize?: number;
}): AriaAttributes {
  const attrs: AriaAttributes = {};

  if (config.selected !== undefined) attrs['aria-selected'] = config.selected;
  if (config.checked !== undefined) attrs['aria-checked'] = config.checked;
  if (config.multiselectable !== undefined) attrs['aria-multiselectable'] = config.multiselectable;
  if (config.posinset !== undefined) attrs['aria-posinset'] = config.posinset;
  if (config.setsize !== undefined) attrs['aria-setsize'] = config.setsize;

  return attrs;
}

/**
 * Creates ARIA attributes for range/slider components
 */
export function createRangeAriaAttributes(config: {
  min: number;
  max: number;
  value: number;
  valueText?: string;
  orientation?: 'horizontal' | 'vertical';
}): AriaAttributes {
  return {
    'aria-valuemin': config.min,
    'aria-valuemax': config.max,
    'aria-valuenow': config.value,
    'aria-valuetext': config.valueText,
    'aria-orientation': config.orientation,
  };
}

// ============================================================================
// LANDMARK ROLES
// ============================================================================

/**
 * Creates landmark attributes for page structure
 */
export function createLandmarkAttributes(
  role: LandmarkRole,
  label?: string
): AriaAttributes {
  const attrs: AriaAttributes = { role };
  if (label) {
    attrs['aria-label'] = label;
  }
  return attrs;
}

/**
 * Validates landmark structure for a page
 */
export function validateLandmarks(landmarks: { role: LandmarkRole; label?: string }[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for required landmarks
  const roles = landmarks.map((l) => l.role);
  if (!roles.includes('main')) {
    errors.push('Page must have a main landmark');
  }

  // Check for multiple main landmarks
  const mainCount = roles.filter((r) => r === 'main').length;
  if (mainCount > 1) {
    errors.push('Page should have only one main landmark');
  }

  // Check for duplicate navigation landmarks without labels
  const navigationLandmarks = landmarks.filter((l) => l.role === 'navigation');
  if (navigationLandmarks.length > 1) {
    const unlabeled = navigationLandmarks.filter((l) => !l.label);
    if (unlabeled.length > 0) {
      warnings.push('Multiple navigation landmarks should have unique aria-labels');
    }
  }

  // Check for duplicate region landmarks without labels
  const regionLandmarks = landmarks.filter((l) => l.role === 'region');
  const unlabeledRegions = regionLandmarks.filter((l) => !l.label);
  if (unlabeledRegions.length > 0) {
    warnings.push('Region landmarks should have aria-labels');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// LIVE REGIONS
// ============================================================================

/**
 * Configuration for live region announcements
 */
export interface LiveRegionConfig {
  politeness: LiveRegionPoliteness;
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
}

/**
 * Creates ARIA attributes for live regions
 */
export function createLiveRegionAttributes(config: LiveRegionConfig): AriaAttributes {
  return {
    'aria-live': config.politeness,
    'aria-atomic': config.atomic ?? true,
    'aria-relevant': config.relevant,
  };
}

/**
 * Creates a screen reader announcement
 */
export function createAnnouncement(
  message: string,
  politeness: LiveRegionPoliteness = 'polite'
): void {
  if (typeof document === 'undefined') return;

  // Find or create the announcer element
  let announcer = document.getElementById('a11y-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'a11y-announcer';
    announcer.setAttribute('aria-live', politeness);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;
    document.body.appendChild(announcer);
  }

  // Update politeness level if needed
  announcer.setAttribute('aria-live', politeness);

  // Clear and set message (needed to trigger announcement)
  announcer.textContent = '';
  setTimeout(() => {
    if (announcer) {
      announcer.textContent = message;
    }
  }, 50);
}

/**
 * Creates an assertive announcement for important updates
 */
export function announceAssertive(message: string): void {
  createAnnouncement(message, 'assertive');
}

/**
 * Creates a polite announcement for non-critical updates
 */
export function announcePolite(message: string): void {
  createAnnouncement(message, 'polite');
}

// ============================================================================
// FOCUS MANAGEMENT
// ============================================================================

/**
 * Gets all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    'audio[controls]',
    'video[controls]',
    'summary',
    'details',
  ].join(', ');

  const elements = Array.from(container.querySelectorAll<HTMLElement>(selector));

  return elements.filter((el) => {
    // Check visibility
    if (el.offsetParent === null && el.style.position !== 'fixed') return false;

    // Check computed styles
    const styles = window.getComputedStyle(el);
    if (styles.visibility === 'hidden' || styles.display === 'none') return false;

    return true;
  });
}

/**
 * Gets the first focusable element within a container
 */
export function getFirstFocusableElement(container: HTMLElement): HTMLElement | null {
  const elements = getFocusableElements(container);
  return elements[0] || null;
}

/**
 * Gets the last focusable element within a container
 */
export function getLastFocusableElement(container: HTMLElement): HTMLElement | null {
  const elements = getFocusableElements(container);
  return elements[elements.length - 1] || null;
}

/**
 * Moves focus to the next focusable element
 */
export function focusNext(container: HTMLElement, currentElement: HTMLElement): void {
  const elements = getFocusableElements(container);
  const currentIndex = elements.indexOf(currentElement);
  const nextIndex = (currentIndex + 1) % elements.length;
  elements[nextIndex]?.focus();
}

/**
 * Moves focus to the previous focusable element
 */
export function focusPrevious(container: HTMLElement, currentElement: HTMLElement): void {
  const elements = getFocusableElements(container);
  const currentIndex = elements.indexOf(currentElement);
  const prevIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
  elements[prevIndex]?.focus();
}

/**
 * Creates a focus trap within a container
 */
export function createFocusTrap(config: FocusTrapConfig): {
  activate: () => void;
  deactivate: () => void;
} {
  let previouslyFocusedElement: HTMLElement | null = null;
  let isActive = false;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isActive) return;

    const container = document.getElementById(config.containerId);
    if (!container) return;

    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    if (event.key === 'Escape' && config.escapeDeactivates) {
      deactivate();
    }
  };

  const handleClick = (event: MouseEvent) => {
    if (!isActive || config.allowOutsideClick) return;

    const container = document.getElementById(config.containerId);
    if (!container) return;

    if (!container.contains(event.target as Node)) {
      event.preventDefault();
      event.stopPropagation();
      const firstFocusable = getFirstFocusableElement(container);
      firstFocusable?.focus();
    }
  };

  const activate = () => {
    if (isActive) return;

    isActive = true;
    previouslyFocusedElement = document.activeElement as HTMLElement;

    const container = document.getElementById(config.containerId);
    if (!container) return;

    // Focus initial element or first focusable
    if (config.initialFocusId) {
      const initialElement = document.getElementById(config.initialFocusId);
      initialElement?.focus();
    } else {
      const firstFocusable = getFirstFocusableElement(container);
      firstFocusable?.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick, true);
  };

  const deactivate = () => {
    if (!isActive) return;

    isActive = false;
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('click', handleClick, true);

    if (config.returnFocusOnDeactivate !== false && previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  };

  return { activate, deactivate };
}

/**
 * Manages roving tabindex for keyboard navigation within groups
 */
export function createRovingTabindex(
  container: HTMLElement,
  selector: string,
  options: {
    orientation?: 'horizontal' | 'vertical' | 'both';
    loop?: boolean;
    homeEndKeys?: boolean;
  } = {}
): {
  init: () => void;
  destroy: () => void;
  setActiveIndex: (index: number) => void;
} {
  const { orientation = 'horizontal', loop = true, homeEndKeys = true } = options;
  let activeIndex = 0;

  const getElements = () => Array.from(container.querySelectorAll<HTMLElement>(selector));

  const updateTabindex = () => {
    const elements = getElements();
    elements.forEach((el, index) => {
      el.setAttribute('tabindex', index === activeIndex ? '0' : '-1');
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const elements = getElements();
    if (elements.length === 0) return;

    let nextIndex = activeIndex;
    const isHorizontal = orientation === 'horizontal' || orientation === 'both';
    const isVertical = orientation === 'vertical' || orientation === 'both';

    switch (event.key) {
      case 'ArrowLeft':
        if (isHorizontal) {
          event.preventDefault();
          nextIndex = activeIndex - 1;
        }
        break;
      case 'ArrowRight':
        if (isHorizontal) {
          event.preventDefault();
          nextIndex = activeIndex + 1;
        }
        break;
      case 'ArrowUp':
        if (isVertical) {
          event.preventDefault();
          nextIndex = activeIndex - 1;
        }
        break;
      case 'ArrowDown':
        if (isVertical) {
          event.preventDefault();
          nextIndex = activeIndex + 1;
        }
        break;
      case 'Home':
        if (homeEndKeys) {
          event.preventDefault();
          nextIndex = 0;
        }
        break;
      case 'End':
        if (homeEndKeys) {
          event.preventDefault();
          nextIndex = elements.length - 1;
        }
        break;
      default:
        return;
    }

    // Handle looping
    if (loop) {
      if (nextIndex < 0) nextIndex = elements.length - 1;
      if (nextIndex >= elements.length) nextIndex = 0;
    } else {
      nextIndex = Math.max(0, Math.min(nextIndex, elements.length - 1));
    }

    if (nextIndex !== activeIndex) {
      activeIndex = nextIndex;
      updateTabindex();
      elements[activeIndex]?.focus();
    }
  };

  const handleClick = (event: MouseEvent) => {
    const elements = getElements();
    const clickedIndex = elements.findIndex((el) => el.contains(event.target as Node));
    if (clickedIndex !== -1) {
      activeIndex = clickedIndex;
      updateTabindex();
    }
  };

  const init = () => {
    updateTabindex();
    container.addEventListener('keydown', handleKeyDown);
    container.addEventListener('click', handleClick);
  };

  const destroy = () => {
    container.removeEventListener('keydown', handleKeyDown);
    container.removeEventListener('click', handleClick);
  };

  const setActiveIndex = (index: number) => {
    const elements = getElements();
    if (index >= 0 && index < elements.length) {
      activeIndex = index;
      updateTabindex();
    }
  };

  return { init, destroy, setActiveIndex };
}

// ============================================================================
// SKIP LINKS
// ============================================================================

/**
 * Default skip links for common page structure
 */
export const DEFAULT_SKIP_LINKS: SkipLink[] = [
  { id: 'skip-to-main', label: 'Skip to main content', targetId: 'main-content' },
  { id: 'skip-to-nav', label: 'Skip to navigation', targetId: 'main-navigation' },
  { id: 'skip-to-search', label: 'Skip to search', targetId: 'search-form' },
  { id: 'skip-to-footer', label: 'Skip to footer', targetId: 'footer' },
];

/**
 * Generates skip link HTML
 */
export function generateSkipLinkHTML(links: SkipLink[]): string {
  const linkElements = links
    .map(
      (link) =>
        `<a href="#${link.targetId}" class="skip-link" id="${link.id}">${link.label}</a>`
    )
    .join('\n');

  return `<div class="skip-links">${linkElements}</div>`;
}

/**
 * Generates skip link CSS
 */
export function generateSkipLinkCSS(): string {
  return `
.skip-links {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
}

.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  padding: 0.75rem 1.5rem;
  background-color: #1f2937;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0 0 0.5rem 0;
  transition: top 0.2s ease;
}

.skip-link:focus {
  top: 0;
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
`;
}

/**
 * Creates skip link functionality
 */
export function createSkipLink(targetId: string): () => void {
  return () => {
    const target = document.getElementById(targetId);
    if (target) {
      // Make target focusable if needed
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
}

// ============================================================================
// SCREEN READER UTILITIES
// ============================================================================

/**
 * Generates screen reader only CSS class
 */
export function generateSROnlyCSS(): string {
  return `
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only-focusable:focus,
.sr-only-focusable:active {
  position: static;
  width: auto;
  height: auto;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

.not-sr-only {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
`;
}

/**
 * Creates screen reader only text wrapper
 */
export function srOnly(text: string): string {
  return `<span class="sr-only">${text}</span>`;
}

/**
 * Creates visually hidden but focusable text
 */
export function srOnlyFocusable(text: string): string {
  return `<span class="sr-only sr-only-focusable">${text}</span>`;
}

/**
 * Generates accessible icon with screen reader text
 */
export function accessibleIcon(iconHtml: string, label: string): string {
  return `${iconHtml}<span class="sr-only">${label}</span>`;
}

/**
 * Generates text for screen reader based on element state
 */
export function getStateText(state: {
  expanded?: boolean;
  selected?: boolean;
  checked?: boolean | 'mixed';
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  loading?: boolean;
}): string {
  const states: string[] = [];

  if (state.loading) states.push('loading');
  if (state.disabled) states.push('disabled');
  if (state.required) states.push('required');
  if (state.invalid) states.push('invalid');
  if (state.expanded !== undefined) {
    states.push(state.expanded ? 'expanded' : 'collapsed');
  }
  if (state.selected !== undefined) {
    states.push(state.selected ? 'selected' : 'not selected');
  }
  if (state.checked !== undefined) {
    if (state.checked === 'mixed') {
      states.push('partially checked');
    } else {
      states.push(state.checked ? 'checked' : 'unchecked');
    }
  }

  return states.join(', ');
}

// ============================================================================
// REDUCED MOTION DETECTION
// ============================================================================

/**
 * Checks if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Creates a reduced motion media query listener
 */
export function onReducedMotionChange(callback: (prefersReduced: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (event: MediaQueryListEvent) => callback(event.matches);

  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}

/**
 * Gets CSS for reduced motion alternatives
 */
export function generateReducedMotionCSS(): string {
  return `
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

@media (prefers-reduced-motion: no-preference) {
  /* Normal animations */
}
`;
}

/**
 * Returns animation duration based on user preference
 */
export function getAnimationDuration(normalDuration: number): number {
  return prefersReducedMotion() ? 0 : normalDuration;
}

/**
 * Returns transition based on user preference
 */
export function getTransition(
  property: string,
  duration: number,
  easing: string = 'ease'
): string {
  if (prefersReducedMotion()) {
    return `${property} 0.01ms ${easing}`;
  }
  return `${property} ${duration}ms ${easing}`;
}

// ============================================================================
// HIGH CONTRAST MODE DETECTION
// ============================================================================

/**
 * Checks if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;

  // Check for Windows high contrast mode
  const highContrastQuery = window.matchMedia('(forced-colors: active)');
  if (highContrastQuery.matches) return true;

  // Check for high contrast preference
  const contrastQuery = window.matchMedia('(prefers-contrast: more)');
  return contrastQuery.matches;
}

/**
 * Creates a high contrast mode listener
 */
export function onHighContrastChange(callback: (highContrast: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const forcedColorsQuery = window.matchMedia('(forced-colors: active)');
  const contrastQuery = window.matchMedia('(prefers-contrast: more)');

  const handler = () => {
    callback(forcedColorsQuery.matches || contrastQuery.matches);
  };

  forcedColorsQuery.addEventListener('change', handler);
  contrastQuery.addEventListener('change', handler);

  return () => {
    forcedColorsQuery.removeEventListener('change', handler);
    contrastQuery.removeEventListener('change', handler);
  };
}

/**
 * Gets CSS for high contrast mode support
 */
export function generateHighContrastCSS(): string {
  return `
@media (forced-colors: active) {
  /* High contrast mode overrides */
  .focus-ring {
    outline: 2px solid CanvasText !important;
    outline-offset: 2px;
  }

  .btn {
    border: 2px solid ButtonText !important;
  }

  a {
    color: LinkText !important;
  }

  a:visited {
    color: VisitedText !important;
  }
}

@media (prefers-contrast: more) {
  body {
    --text-primary: #000000;
    --text-secondary: #1a1a1a;
    --bg-primary: #ffffff;
    --border-color: #000000;
  }
}
`;
}

// ============================================================================
// COLOR CONTRAST CHECKER
// ============================================================================

/**
 * Parses a hex color to RGB
 */
export function hexToRgb(hex: string): RGBColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Converts RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Calculates relative luminance of a color
 * Based on WCAG 2.1 formula
 */
export function getRelativeLuminance(rgb: RGBColor): number {
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const normalized = c / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates contrast ratio between two colors
 */
export function getContrastRatio(color1: RGBColor, color2: RGBColor): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks color contrast against WCAG standards
 */
export function checkColorContrast(
  foreground: string | RGBColor,
  background: string | RGBColor
): ContrastResult {
  const fg = typeof foreground === 'string' ? hexToRgb(foreground) : foreground;
  const bg = typeof background === 'string' ? hexToRgb(background) : background;

  if (!fg || !bg) {
    return {
      ratio: 0,
      passesAA: false,
      passesAALarge: false,
      passesAAA: false,
      passesAAALarge: false,
      level: 'fail',
    };
  }

  const ratio = getContrastRatio(fg, bg);

  // WCAG 2.1 requirements
  const passesAA = ratio >= 4.5; // Normal text
  const passesAALarge = ratio >= 3; // Large text (18pt+ or 14pt bold)
  const passesAAA = ratio >= 7; // Enhanced normal text
  const passesAAALarge = ratio >= 4.5; // Enhanced large text

  let level: ContrastResult['level'] = 'fail';
  if (passesAAA) level = 'AAA';
  else if (passesAAALarge && !passesAAA) level = 'AAA-large';
  else if (passesAA) level = 'AA';
  else if (passesAALarge) level = 'AA-large';

  return {
    ratio: Math.round(ratio * 100) / 100,
    passesAA,
    passesAALarge,
    passesAAA,
    passesAAALarge,
    level,
  };
}

/**
 * Suggests an accessible alternative color
 */
export function suggestAccessibleColor(
  foreground: string,
  background: string,
  targetLevel: 'AA' | 'AAA' = 'AA'
): string {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) return foreground;

  const targetRatio = targetLevel === 'AAA' ? 7 : 4.5;
  const currentRatio = getContrastRatio(fg, bg);

  if (currentRatio >= targetRatio) return foreground;

  // Determine if we should lighten or darken the foreground
  const bgLuminance = getRelativeLuminance(bg);
  const shouldDarken = bgLuminance > 0.5;

  // Binary search for the right color
  let adjustedFg = { ...fg };
  let step = 10;

  for (let i = 0; i < 25; i++) {
    const newRatio = getContrastRatio(adjustedFg, bg);
    if (Math.abs(newRatio - targetRatio) < 0.1 || newRatio >= targetRatio) {
      break;
    }

    if (shouldDarken) {
      adjustedFg = {
        r: Math.max(0, adjustedFg.r - step),
        g: Math.max(0, adjustedFg.g - step),
        b: Math.max(0, adjustedFg.b - step),
      };
    } else {
      adjustedFg = {
        r: Math.min(255, adjustedFg.r + step),
        g: Math.min(255, adjustedFg.g + step),
        b: Math.min(255, adjustedFg.b + step),
      };
    }

    step = Math.max(1, Math.floor(step * 0.8));
  }

  return rgbToHex(adjustedFg.r, adjustedFg.g, adjustedFg.b);
}

// ============================================================================
// TOUCH TARGET SIZE CHECKER
// ============================================================================

/**
 * Minimum touch target size (48px x 48px per WCAG 2.1)
 */
export const MIN_TOUCH_TARGET_SIZE = 48;

/**
 * Recommended touch target size for better usability
 */
export const RECOMMENDED_TOUCH_TARGET_SIZE = 44;

/**
 * Checks if an element meets touch target size requirements
 */
export function checkTouchTargetSize(
  width: number,
  height: number
): TouchTargetResult {
  const passesMinimum = width >= MIN_TOUCH_TARGET_SIZE && height >= MIN_TOUCH_TARGET_SIZE;
  const passesRecommended =
    width >= RECOMMENDED_TOUCH_TARGET_SIZE && height >= RECOMMENDED_TOUCH_TARGET_SIZE;

  let recommendation = '';
  if (!passesMinimum) {
    const widthDiff = Math.max(0, MIN_TOUCH_TARGET_SIZE - width);
    const heightDiff = Math.max(0, MIN_TOUCH_TARGET_SIZE - height);
    recommendation = `Increase size by ${widthDiff}px width and ${heightDiff}px height to meet minimum requirements`;
  } else if (!passesRecommended) {
    recommendation = 'Touch target meets minimum but could be larger for better usability';
  }

  return {
    width,
    height,
    passesMinimum,
    passesRecommended,
    recommendation,
  };
}

/**
 * Gets touch target size from an element
 */
export function getElementTouchTargetSize(element: HTMLElement): TouchTargetResult {
  const rect = element.getBoundingClientRect();
  return checkTouchTargetSize(rect.width, rect.height);
}

/**
 * Generates CSS for minimum touch target sizes
 */
export function generateTouchTargetCSS(): string {
  return `
/* Ensure minimum touch target sizes */
.touch-target {
  min-width: ${MIN_TOUCH_TARGET_SIZE}px;
  min-height: ${MIN_TOUCH_TARGET_SIZE}px;
}

/* For inline elements, use padding to expand touch area */
.touch-target-inline {
  position: relative;
}

.touch-target-inline::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: ${MIN_TOUCH_TARGET_SIZE}px;
  min-height: ${MIN_TOUCH_TARGET_SIZE}px;
}

/* Button and link touch targets */
button,
[role="button"],
a {
  min-height: ${RECOMMENDED_TOUCH_TARGET_SIZE}px;
  min-width: ${RECOMMENDED_TOUCH_TARGET_SIZE}px;
}
`;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates a unique ID for accessibility purposes
 */
export function generateA11yId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Creates ID relationships for label-input pairs
 */
export function createLabelledBy(
  elementId: string,
  labelIds: string[]
): { id: string; 'aria-labelledby': string } {
  return {
    id: elementId,
    'aria-labelledby': labelIds.join(' '),
  };
}

/**
 * Creates ID relationships for describedby
 */
export function createDescribedBy(
  elementId: string,
  descriptionIds: string[]
): { id: string; 'aria-describedby': string } {
  return {
    id: elementId,
    'aria-describedby': descriptionIds.join(' '),
  };
}

/**
 * Combines multiple ARIA attribute objects
 */
export function combineAriaAttributes(...attrs: AriaAttributes[]): AriaAttributes {
  return attrs.reduce((combined, current) => ({ ...combined, ...current }), {});
}

/**
 * Gets all accessibility CSS as a combined string
 */
export function getAllAccessibilityCSS(): string {
  return [
    generateSkipLinkCSS(),
    generateSROnlyCSS(),
    generateReducedMotionCSS(),
    generateHighContrastCSS(),
    generateTouchTargetCSS(),
  ].join('\n');
}

export default {
  // Role assignments
  COMPONENT_ROLES,
  getAriaRole,

  // ARIA attributes
  createInteractiveAriaAttributes,
  createFormAriaAttributes,
  createSelectionAriaAttributes,
  createRangeAriaAttributes,

  // Landmarks
  createLandmarkAttributes,
  validateLandmarks,

  // Live regions
  createLiveRegionAttributes,
  createAnnouncement,
  announceAssertive,
  announcePolite,

  // Focus management
  getFocusableElements,
  getFirstFocusableElement,
  getLastFocusableElement,
  focusNext,
  focusPrevious,
  createFocusTrap,
  createRovingTabindex,

  // Skip links
  DEFAULT_SKIP_LINKS,
  generateSkipLinkHTML,
  generateSkipLinkCSS,
  createSkipLink,

  // Screen reader
  generateSROnlyCSS,
  srOnly,
  srOnlyFocusable,
  accessibleIcon,
  getStateText,

  // Reduced motion
  prefersReducedMotion,
  onReducedMotionChange,
  generateReducedMotionCSS,
  getAnimationDuration,
  getTransition,

  // High contrast
  prefersHighContrast,
  onHighContrastChange,
  generateHighContrastCSS,

  // Color contrast
  hexToRgb,
  rgbToHex,
  getRelativeLuminance,
  getContrastRatio,
  checkColorContrast,
  suggestAccessibleColor,

  // Touch targets
  MIN_TOUCH_TARGET_SIZE,
  RECOMMENDED_TOUCH_TARGET_SIZE,
  checkTouchTargetSize,
  getElementTouchTargetSize,
  generateTouchTargetCSS,

  // Utilities
  generateA11yId,
  createLabelledBy,
  createDescribedBy,
  combineAriaAttributes,
  getAllAccessibilityCSS,
};
