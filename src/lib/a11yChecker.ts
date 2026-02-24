/**
 * Accessibility Checker
 *
 * Comprehensive accessibility validation for the Tailwind Builder.
 * Checks for common accessibility issues and provides actionable fixes.
 */

import type { BuilderElement } from '@/types/builder';
import {
  checkColorContrast,
  suggestAccessibleColor,
  checkTouchTargetSize,
  MIN_TOUCH_TARGET_SIZE,
  getAriaRole,
  type ContrastResult,
} from './accessibilitySystem';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

/**
 * Severity levels for accessibility issues
 */
export type A11ySeverity = 'critical' | 'serious' | 'moderate' | 'minor';

/**
 * Categories of accessibility issues
 */
export type A11yCategory =
  | 'images'
  | 'color'
  | 'structure'
  | 'links'
  | 'forms'
  | 'focus'
  | 'touch'
  | 'keyboard'
  | 'aria'
  | 'semantics';

/**
 * WCAG conformance levels
 */
export type WCAGLevel = 'A' | 'AA' | 'AAA';

/**
 * WCAG success criterion reference
 */
export interface WCAGCriterion {
  id: string;
  level: WCAGLevel;
  name: string;
  description: string;
  url: string;
}

/**
 * An individual accessibility issue
 */
export interface A11yIssue {
  id: string;
  elementId: string;
  elementType: string;
  elementName: string;
  category: A11yCategory;
  severity: A11ySeverity;
  message: string;
  suggestion: string;
  wcagCriteria: WCAGCriterion[];
  autoFixable: boolean;
  fix?: A11yFix;
}

/**
 * An automatic fix for an accessibility issue
 */
export interface A11yFix {
  type: 'props' | 'styles' | 'attribute';
  changes: Record<string, unknown>;
  description: string;
}

/**
 * Complete accessibility audit report
 */
export interface A11yReport {
  timestamp: Date;
  totalElements: number;
  totalIssues: number;
  issuesBySeverity: Record<A11ySeverity, number>;
  issuesByCategory: Record<A11yCategory, number>;
  issues: A11yIssue[];
  score: number;
  scoreBreakdown: {
    images: number;
    color: number;
    structure: number;
    forms: number;
    navigation: number;
  };
  wcagCompliance: {
    levelA: boolean;
    levelAA: boolean;
    levelAAA: boolean;
  };
  passedChecks: string[];
  recommendations: string[];
}

/**
 * Checker configuration options
 */
export interface A11yCheckerOptions {
  checkImages?: boolean;
  checkColor?: boolean;
  checkStructure?: boolean;
  checkLinks?: boolean;
  checkForms?: boolean;
  checkFocus?: boolean;
  checkTouch?: boolean;
  checkKeyboard?: boolean;
  checkAria?: boolean;
  targetLevel?: WCAGLevel;
  strictMode?: boolean;
}

// ============================================================================
// WCAG CRITERIA REFERENCE
// ============================================================================

export const WCAG_CRITERIA: Record<string, WCAGCriterion> = {
  '1.1.1': {
    id: '1.1.1',
    level: 'A',
    name: 'Non-text Content',
    description: 'All non-text content has a text alternative',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content',
  },
  '1.3.1': {
    id: '1.3.1',
    level: 'A',
    name: 'Info and Relationships',
    description: 'Information and relationships conveyed through presentation can be programmatically determined',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships',
  },
  '1.3.2': {
    id: '1.3.2',
    level: 'A',
    name: 'Meaningful Sequence',
    description: 'When sequence affects meaning, a correct reading sequence can be programmatically determined',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence',
  },
  '1.4.1': {
    id: '1.4.1',
    level: 'A',
    name: 'Use of Color',
    description: 'Color is not used as the only visual means of conveying information',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/use-of-color',
  },
  '1.4.3': {
    id: '1.4.3',
    level: 'AA',
    name: 'Contrast (Minimum)',
    description: 'Text has a contrast ratio of at least 4.5:1 (3:1 for large text)',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum',
  },
  '1.4.6': {
    id: '1.4.6',
    level: 'AAA',
    name: 'Contrast (Enhanced)',
    description: 'Text has a contrast ratio of at least 7:1 (4.5:1 for large text)',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced',
  },
  '1.4.11': {
    id: '1.4.11',
    level: 'AA',
    name: 'Non-text Contrast',
    description: 'UI components and graphics have a contrast ratio of at least 3:1',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast',
  },
  '2.1.1': {
    id: '2.1.1',
    level: 'A',
    name: 'Keyboard',
    description: 'All functionality is available from a keyboard',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard',
  },
  '2.4.1': {
    id: '2.4.1',
    level: 'A',
    name: 'Bypass Blocks',
    description: 'A mechanism is available to bypass blocks of content',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks',
  },
  '2.4.2': {
    id: '2.4.2',
    level: 'A',
    name: 'Page Titled',
    description: 'Pages have titles that describe topic or purpose',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled',
  },
  '2.4.4': {
    id: '2.4.4',
    level: 'A',
    name: 'Link Purpose (In Context)',
    description: 'The purpose of each link can be determined from the link text',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context',
  },
  '2.4.6': {
    id: '2.4.6',
    level: 'AA',
    name: 'Headings and Labels',
    description: 'Headings and labels describe topic or purpose',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels',
  },
  '2.4.7': {
    id: '2.4.7',
    level: 'AA',
    name: 'Focus Visible',
    description: 'Keyboard focus indicator is visible',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-visible',
  },
  '2.5.5': {
    id: '2.5.5',
    level: 'AAA',
    name: 'Target Size',
    description: 'Touch targets are at least 44 by 44 pixels',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/target-size',
  },
  '2.5.8': {
    id: '2.5.8',
    level: 'AA',
    name: 'Target Size (Minimum)',
    description: 'Touch targets are at least 24 by 24 pixels',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/target-size-minimum',
  },
  '3.3.1': {
    id: '3.3.1',
    level: 'A',
    name: 'Error Identification',
    description: 'Input errors are automatically detected and described to the user',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/error-identification',
  },
  '3.3.2': {
    id: '3.3.2',
    level: 'A',
    name: 'Labels or Instructions',
    description: 'Labels or instructions are provided for user input',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions',
  },
  '4.1.1': {
    id: '4.1.1',
    level: 'A',
    name: 'Parsing',
    description: 'Elements have complete start and end tags, are nested correctly',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/parsing',
  },
  '4.1.2': {
    id: '4.1.2',
    level: 'A',
    name: 'Name, Role, Value',
    description: 'UI components have accessible names and roles',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value',
  },
};

// ============================================================================
// ISSUE DETECTION FUNCTIONS
// ============================================================================

/**
 * Generates a unique issue ID
 */
function generateIssueId(): string {
  return `a11y-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Checks for missing alt text on images
 */
function checkImageAltText(element: BuilderElement): A11yIssue | null {
  const imageTypes = ['image', 'avatar', 'icon', 'image-card'];

  if (!imageTypes.includes(element.type)) return null;

  const alt = element.props.alt || element.props.altText;
  const isDecorative = element.props.decorative === true;

  // Decorative images should have empty alt
  if (isDecorative && alt) {
    return {
      id: generateIssueId(),
      elementId: element.id,
      elementType: element.type,
      elementName: element.name,
      category: 'images',
      severity: 'minor',
      message: 'Decorative image has alt text (should be empty)',
      suggestion: 'Remove alt text from decorative images or set alt=""',
      wcagCriteria: [WCAG_CRITERIA['1.1.1']],
      autoFixable: true,
      fix: {
        type: 'props',
        changes: { alt: '' },
        description: 'Set alt text to empty string',
      },
    };
  }

  // Non-decorative images need alt text
  if (!isDecorative && !alt) {
    return {
      id: generateIssueId(),
      elementId: element.id,
      elementType: element.type,
      elementName: element.name,
      category: 'images',
      severity: 'critical',
      message: 'Image is missing alt text',
      suggestion: 'Add descriptive alt text or mark as decorative',
      wcagCriteria: [WCAG_CRITERIA['1.1.1']],
      autoFixable: false,
    };
  }

  // Check for unhelpful alt text
  const unhelpfulPatterns = [
    /^image$/i,
    /^photo$/i,
    /^picture$/i,
    /^img$/i,
    /^icon$/i,
    /^graphic$/i,
    /^\d+$/,
    /^untitled$/i,
    /^placeholder$/i,
    /\.jpg$/i,
    /\.png$/i,
    /\.gif$/i,
    /\.webp$/i,
  ];

  if (alt && unhelpfulPatterns.some((pattern) => pattern.test(alt))) {
    return {
      id: generateIssueId(),
      elementId: element.id,
      elementType: element.type,
      elementName: element.name,
      category: 'images',
      severity: 'serious',
      message: `Alt text "${alt}" is not descriptive`,
      suggestion: 'Provide meaningful alt text that describes the image content or purpose',
      wcagCriteria: [WCAG_CRITERIA['1.1.1']],
      autoFixable: false,
    };
  }

  return null;
}

/**
 * Extracts colors from Tailwind classes
 */
function extractColorsFromClasses(classes: string[]): { text?: string; bg?: string } {
  const result: { text?: string; bg?: string } = {};

  const tailwindColors: Record<string, string> = {
    'slate-50': '#f8fafc',
    'slate-100': '#f1f5f9',
    'slate-200': '#e2e8f0',
    'slate-300': '#cbd5e1',
    'slate-400': '#94a3b8',
    'slate-500': '#64748b',
    'slate-600': '#475569',
    'slate-700': '#334155',
    'slate-800': '#1e293b',
    'slate-900': '#0f172a',
    'gray-50': '#f9fafb',
    'gray-100': '#f3f4f6',
    'gray-200': '#e5e7eb',
    'gray-300': '#d1d5db',
    'gray-400': '#9ca3af',
    'gray-500': '#6b7280',
    'gray-600': '#4b5563',
    'gray-700': '#374151',
    'gray-800': '#1f2937',
    'gray-900': '#111827',
    'red-500': '#ef4444',
    'red-600': '#dc2626',
    'red-700': '#b91c1c',
    'green-500': '#22c55e',
    'green-600': '#16a34a',
    'blue-500': '#3b82f6',
    'blue-600': '#2563eb',
    'blue-700': '#1d4ed8',
    'purple-500': '#a855f7',
    'purple-600': '#9333ea',
    'white': '#ffffff',
    'black': '#000000',
  };

  for (const cls of classes) {
    // Extract text color
    const textMatch = cls.match(/^text-([\w-]+)$/);
    if (textMatch && tailwindColors[textMatch[1]]) {
      result.text = tailwindColors[textMatch[1]];
    }

    // Extract background color
    const bgMatch = cls.match(/^bg-([\w-]+)$/);
    if (bgMatch && tailwindColors[bgMatch[1]]) {
      result.bg = tailwindColors[bgMatch[1]];
    }
  }

  return result;
}

/**
 * Checks color contrast ratios
 */
function checkColorContrastIssues(element: BuilderElement): A11yIssue | null {
  const allClasses = [
    ...element.styles.colors,
    ...element.styles.typography,
  ];

  const colors = extractColorsFromClasses(allClasses);

  // Skip if we can't determine both colors
  if (!colors.text || !colors.bg) return null;

  const contrast: ContrastResult = checkColorContrast(colors.text, colors.bg);

  if (!contrast.passesAA) {
    const suggestedColor = suggestAccessibleColor(colors.text, colors.bg, 'AA');

    return {
      id: generateIssueId(),
      elementId: element.id,
      elementType: element.type,
      elementName: element.name,
      category: 'color',
      severity: contrast.passesAALarge ? 'moderate' : 'serious',
      message: `Insufficient color contrast ratio: ${contrast.ratio}:1 (minimum 4.5:1 for normal text)`,
      suggestion: `Consider changing text color to ${suggestedColor} for better contrast`,
      wcagCriteria: [WCAG_CRITERIA['1.4.3']],
      autoFixable: false,
    };
  }

  return null;
}

/**
 * Checks heading hierarchy
 */
function checkHeadingHierarchy(
  elements: BuilderElement[],
  currentLevel: number = 0
): A11yIssue[] {
  const issues: A11yIssue[] = [];
  let lastHeadingLevel = currentLevel;

  for (const element of elements) {
    if (element.type === 'heading') {
      const level = parseInt(element.props.level || '2', 10);

      // Check for skipped heading levels
      if (level > lastHeadingLevel + 1 && lastHeadingLevel > 0) {
        issues.push({
          id: generateIssueId(),
          elementId: element.id,
          elementType: element.type,
          elementName: element.name,
          category: 'structure',
          severity: 'moderate',
          message: `Heading level skipped: h${level} follows h${lastHeadingLevel}`,
          suggestion: `Use h${lastHeadingLevel + 1} to maintain proper heading hierarchy`,
          wcagCriteria: [WCAG_CRITERIA['1.3.1'], WCAG_CRITERIA['2.4.6']],
          autoFixable: true,
          fix: {
            type: 'props',
            changes: { level: String(lastHeadingLevel + 1) },
            description: `Change heading level to h${lastHeadingLevel + 1}`,
          },
        });
      }

      lastHeadingLevel = level;
    }

    // Recursively check children
    if (element.children.length > 0) {
      issues.push(...checkHeadingHierarchy(element.children, lastHeadingLevel));
    }
  }

  return issues;
}

/**
 * Checks for descriptive link text
 */
function checkLinkText(element: BuilderElement): A11yIssue | null {
  if (element.type !== 'link') return null;

  const linkText = element.props.text || element.props.children || '';
  const href = element.props.href || '';

  // Check for empty link text
  if (!linkText.trim()) {
    return {
      id: generateIssueId(),
      elementId: element.id,
      elementType: element.type,
      elementName: element.name,
      category: 'links',
      severity: 'critical',
      message: 'Link has no accessible text',
      suggestion: 'Add descriptive link text or aria-label',
      wcagCriteria: [WCAG_CRITERIA['2.4.4'], WCAG_CRITERIA['4.1.2']],
      autoFixable: false,
    };
  }

  // Check for generic link text
  const genericTexts = [
    'click here',
    'here',
    'click',
    'read more',
    'more',
    'learn more',
    'link',
    'go',
    'this',
  ];

  if (genericTexts.includes(linkText.toLowerCase().trim())) {
    return {
      id: generateIssueId(),
      elementId: element.id,
      elementType: element.type,
      elementName: element.name,
      category: 'links',
      severity: 'serious',
      message: `Link text "${linkText}" is not descriptive`,
      suggestion: 'Use descriptive text that indicates the link destination or purpose',
      wcagCriteria: [WCAG_CRITERIA['2.4.4']],
      autoFixable: false,
    };
  }

  // Check for URL as link text
  if (/^https?:\/\//.test(linkText)) {
    return {
      id: generateIssueId(),
      elementId: element.id,
      elementType: element.type,
      elementName: element.name,
      category: 'links',
      severity: 'moderate',
      message: 'Link text is a URL',
      suggestion: 'Replace URL with descriptive text that describes the link destination',
      wcagCriteria: [WCAG_CRITERIA['2.4.4']],
      autoFixable: false,
    };
  }

  // Check for external links without indication
  const isExternal = href.startsWith('http') && !href.includes(typeof window !== 'undefined' ? window.location.hostname : '');
  const opensNewTab = element.props.target === '_blank';

  if (isExternal && opensNewTab && !element.props['aria-label']?.includes('new tab')) {
    return {
      id: generateIssueId(),
      elementId: element.id,
      elementType: element.type,
      elementName: element.name,
      category: 'links',
      severity: 'moderate',
      message: 'External link opens in new tab without warning',
      suggestion: 'Add aria-label or visible text indicating link opens in new tab',
      wcagCriteria: [WCAG_CRITERIA['2.4.4']],
      autoFixable: true,
      fix: {
        type: 'props',
        changes: { 'aria-label': `${linkText} (opens in new tab)` },
        description: 'Add aria-label with new tab indication',
      },
    };
  }

  return null;
}

/**
 * Checks form elements for accessibility
 */
function checkFormLabels(element: BuilderElement): A11yIssue | null {
  const formInputTypes = [
    'input-field',
    'textarea',
    'select-dropdown',
    'checkbox',
    'radio-group',
    'toggle-switch',
    'file-upload',
  ];

  if (!formInputTypes.includes(element.type)) return null;

  const hasLabel = element.props.label || element.props['aria-label'] || element.props['aria-labelledby'];

  if (!hasLabel) {
    return {
      id: generateIssueId(),
      elementId: element.id,
      elementType: element.type,
      elementName: element.name,
      category: 'forms',
      severity: 'critical',
      message: 'Form input has no accessible label',
      suggestion: 'Add a label prop or aria-label attribute',
      wcagCriteria: [WCAG_CRITERIA['3.3.2'], WCAG_CRITERIA['4.1.2']],
      autoFixable: false,
    };
  }

  // Check for placeholder-only labels
  if (!element.props.label && !element.props['aria-label'] && element.props.placeholder) {
    return {
      id: generateIssueId(),
      elementId: element.id,
      elementType: element.type,
      elementName: element.name,
      category: 'forms',
      severity: 'serious',
      message: 'Form input uses placeholder as only label',
      suggestion: 'Add a visible label or aria-label. Placeholders disappear when typing.',
      wcagCriteria: [WCAG_CRITERIA['3.3.2']],
      autoFixable: false,
    };
  }

  return null;
}

/**
 * Checks focus indicators
 */
function checkFocusIndicators(element: BuilderElement): A11yIssue | null {
  const interactiveTypes = [
    'primary-button',
    'secondary-button',
    'outline-button',
    'ghost-button',
    'icon-button',
    'loading-button',
    'gradient-button',
    'link',
    'input-field',
    'textarea',
    'select-dropdown',
    'checkbox',
    'toggle-switch',
  ];

  if (!interactiveTypes.includes(element.type)) return null;

  // Check for focus-related classes
  const allClasses = [
    ...element.styles.effects,
    ...element.styles.borders,
  ];

  const hasFocusStyles = allClasses.some((cls) =>
    cls.includes('focus:') || cls.includes('focus-visible:') || cls.includes('focus-within:')
  );

  // Check for outline:none without replacement
  const hasOutlineNone = allClasses.some((cls) =>
    cls === 'outline-none' || cls === 'focus:outline-none'
  );

  const hasRingStyles = allClasses.some((cls) =>
    cls.includes('ring') || cls.includes('border-')
  );

  if (hasOutlineNone && !hasFocusStyles && !hasRingStyles) {
    return {
      id: generateIssueId(),
      elementId: element.id,
      elementType: element.type,
      elementName: element.name,
      category: 'focus',
      severity: 'serious',
      message: 'Element removes focus outline without replacement',
      suggestion: 'Add visible focus indicator (focus:ring, focus:border, etc.)',
      wcagCriteria: [WCAG_CRITERIA['2.4.7']],
      autoFixable: true,
      fix: {
        type: 'styles',
        changes: {
          effects: [...element.styles.effects, 'focus:ring-2', 'focus:ring-blue-500'],
        },
        description: 'Add focus ring styles',
      },
    };
  }

  return null;
}

/**
 * Checks touch target sizes
 */
function checkTouchTargetSizeIssue(element: BuilderElement): A11yIssue | null {
  const interactiveTypes = [
    'primary-button',
    'secondary-button',
    'outline-button',
    'ghost-button',
    'icon-button',
    'loading-button',
    'gradient-button',
    'link',
    'checkbox',
    'toggle-switch',
  ];

  if (!interactiveTypes.includes(element.type)) return null;

  // Try to extract size from classes
  const allClasses = [
    ...element.styles.spacing,
    ...element.styles.layout,
  ];

  // Map common Tailwind size classes to pixels
  const sizeMap: Record<string, number> = {
    'p-0': 0,
    'p-1': 4,
    'p-2': 8,
    'p-3': 12,
    'p-4': 16,
    'px-2': 8,
    'px-3': 12,
    'px-4': 16,
    'py-1': 4,
    'py-2': 8,
    'py-3': 12,
    'h-4': 16,
    'h-6': 24,
    'h-8': 32,
    'h-10': 40,
    'h-12': 48,
    'w-4': 16,
    'w-6': 24,
    'w-8': 32,
    'w-10': 40,
    'w-12': 48,
    'text-xs': 12,
    'text-sm': 14,
    'text-base': 16,
  };

  let estimatedHeight = 40; // Default estimate
  let estimatedWidth = 40;

  for (const cls of allClasses) {
    if (cls.startsWith('h-') || cls.startsWith('py-')) {
      const size = sizeMap[cls];
      if (size) estimatedHeight = Math.max(estimatedHeight, size * 2);
    }
    if (cls.startsWith('w-') || cls.startsWith('px-')) {
      const size = sizeMap[cls];
      if (size) estimatedWidth = Math.max(estimatedWidth, size * 2);
    }
  }

  const result = checkTouchTargetSize(estimatedWidth, estimatedHeight);

  if (!result.passesMinimum && element.type !== 'link') {
    return {
      id: generateIssueId(),
      elementId: element.id,
      elementType: element.type,
      elementName: element.name,
      category: 'touch',
      severity: 'moderate',
      message: `Touch target may be too small (estimated ${estimatedWidth}x${estimatedHeight}px)`,
      suggestion: `Increase size to at least ${MIN_TOUCH_TARGET_SIZE}x${MIN_TOUCH_TARGET_SIZE}px for touch accessibility`,
      wcagCriteria: [WCAG_CRITERIA['2.5.5'], WCAG_CRITERIA['2.5.8']],
      autoFixable: true,
      fix: {
        type: 'styles',
        changes: {
          spacing: [...element.styles.spacing.filter((c) => !c.startsWith('p-')), 'p-3'],
        },
        description: 'Increase padding for larger touch target',
      },
    };
  }

  return null;
}

/**
 * Checks keyboard accessibility
 */
function checkKeyboardAccessibility(element: BuilderElement): A11yIssue | null {
  const interactiveTypes = [
    'primary-button',
    'secondary-button',
    'outline-button',
    'ghost-button',
    'icon-button',
    'loading-button',
    'gradient-button',
  ];

  if (!interactiveTypes.includes(element.type)) return null;

  // Check for click handlers without keyboard handlers on non-button elements
  const hasOnClick = element.props.onClick !== undefined;
  const hasOnKeyDown = element.props.onKeyDown !== undefined;
  const hasRole = element.props.role === 'button';
  const hasTabIndex = element.props.tabIndex !== undefined;

  // If element uses a div with click but no keyboard support
  if (hasOnClick && !hasOnKeyDown && !hasRole && element.type.includes('button')) {
    return {
      id: generateIssueId(),
      elementId: element.id,
      elementType: element.type,
      elementName: element.name,
      category: 'keyboard',
      severity: 'serious',
      message: 'Interactive element may not be keyboard accessible',
      suggestion: 'Ensure element can be activated with Enter and Space keys',
      wcagCriteria: [WCAG_CRITERIA['2.1.1']],
      autoFixable: false,
    };
  }

  return null;
}

/**
 * Checks ARIA usage
 */
function checkAriaUsage(element: BuilderElement): A11yIssue[] {
  const issues: A11yIssue[] = [];

  // Check for redundant ARIA roles
  const implicitRole = getAriaRole(element.type);
  const explicitRole = element.props.role;

  if (implicitRole && explicitRole && implicitRole === explicitRole) {
    issues.push({
      id: generateIssueId(),
      elementId: element.id,
      elementType: element.type,
      elementName: element.name,
      category: 'aria',
      severity: 'minor',
      message: `Redundant ARIA role "${explicitRole}"`,
      suggestion: 'Remove redundant role as it is implicit to the element type',
      wcagCriteria: [WCAG_CRITERIA['4.1.2']],
      autoFixable: true,
      fix: {
        type: 'props',
        changes: { role: undefined },
        description: 'Remove redundant role attribute',
      },
    });
  }

  // Check for aria-hidden on focusable elements
  if (element.props['aria-hidden'] === true) {
    const isFocusable = element.props.tabIndex >= 0 || element.type.includes('button') || element.type === 'link';
    if (isFocusable) {
      issues.push({
        id: generateIssueId(),
        elementId: element.id,
        elementType: element.type,
        elementName: element.name,
        category: 'aria',
        severity: 'serious',
        message: 'Focusable element is hidden from screen readers',
        suggestion: 'Remove aria-hidden or make element non-focusable',
        wcagCriteria: [WCAG_CRITERIA['4.1.2']],
        autoFixable: false,
      });
    }
  }

  // Check for aria-expanded without corresponding control
  if (element.props['aria-expanded'] !== undefined && !element.props['aria-controls']) {
    issues.push({
      id: generateIssueId(),
      elementId: element.id,
      elementType: element.type,
      elementName: element.name,
      category: 'aria',
      severity: 'moderate',
      message: 'Element with aria-expanded missing aria-controls',
      suggestion: 'Add aria-controls to reference the controlled element',
      wcagCriteria: [WCAG_CRITERIA['4.1.2']],
      autoFixable: false,
    });
  }

  return issues;
}

// ============================================================================
// MAIN CHECKER FUNCTIONS
// ============================================================================

/**
 * Counts elements in a tree
 */
function countElements(elements: BuilderElement[]): number {
  return elements.reduce((count, element) => {
    return count + 1 + countElements(element.children);
  }, 0);
}

/**
 * Runs all accessibility checks on elements
 */
function checkElement(element: BuilderElement): A11yIssue[] {
  const issues: A11yIssue[] = [];

  // Run all checks
  const checks = [
    checkImageAltText(element),
    checkColorContrastIssues(element),
    checkLinkText(element),
    checkFormLabels(element),
    checkFocusIndicators(element),
    checkTouchTargetSizeIssue(element),
    checkKeyboardAccessibility(element),
    ...checkAriaUsage(element),
  ];

  // Collect non-null issues
  for (const issue of checks) {
    if (issue) issues.push(issue);
  }

  // Recursively check children
  for (const child of element.children) {
    issues.push(...checkElement(child));
  }

  return issues;
}

/**
 * Calculates accessibility score
 */
function calculateScore(issues: A11yIssue[], totalElements: number): number {
  if (totalElements === 0) return 100;

  // Weight by severity
  const severityWeights: Record<A11ySeverity, number> = {
    critical: 10,
    serious: 5,
    moderate: 2,
    minor: 1,
  };

  const totalDeductions = issues.reduce((sum, issue) => {
    return sum + severityWeights[issue.severity];
  }, 0);

  // Max possible deduction based on element count
  const maxDeduction = totalElements * 3; // Average weight

  const score = Math.max(0, 100 - (totalDeductions / maxDeduction) * 100);
  return Math.round(score);
}

/**
 * Generates passed checks list
 */
function generatePassedChecks(issues: A11yIssue[], elements: BuilderElement[]): string[] {
  const passed: string[] = [];

  // Check what categories have no issues
  const issueCategories = new Set(issues.map((i) => i.category));

  if (!issueCategories.has('images')) {
    passed.push('All images have appropriate alt text');
  }

  if (!issueCategories.has('color')) {
    passed.push('Color contrast meets WCAG AA standards');
  }

  if (!issueCategories.has('structure')) {
    passed.push('Heading hierarchy is properly structured');
  }

  if (!issueCategories.has('links')) {
    passed.push('Links have descriptive text');
  }

  if (!issueCategories.has('forms')) {
    passed.push('Form inputs have accessible labels');
  }

  if (!issueCategories.has('focus')) {
    passed.push('Focus indicators are visible');
  }

  if (!issueCategories.has('touch')) {
    passed.push('Touch targets meet size requirements');
  }

  if (!issueCategories.has('keyboard')) {
    passed.push('Interactive elements are keyboard accessible');
  }

  if (!issueCategories.has('aria')) {
    passed.push('ARIA attributes are used correctly');
  }

  return passed;
}

/**
 * Generates recommendations based on issues
 */
function generateRecommendations(issues: A11yIssue[]): string[] {
  const recommendations: string[] = [];
  const categories = new Set(issues.map((i) => i.category));

  if (categories.has('images')) {
    recommendations.push('Review all images and provide meaningful alt text');
  }

  if (categories.has('color')) {
    recommendations.push('Use a color contrast checker to verify text readability');
  }

  if (categories.has('structure')) {
    recommendations.push('Ensure heading levels follow a logical sequence (h1, h2, h3...)');
  }

  if (categories.has('links')) {
    recommendations.push('Make link text descriptive of the destination');
  }

  if (categories.has('forms')) {
    recommendations.push('Associate every form input with a visible label');
  }

  if (categories.has('focus')) {
    recommendations.push('Add visible focus indicators to all interactive elements');
  }

  if (categories.has('touch')) {
    recommendations.push('Increase interactive element sizes for touch accessibility');
  }

  // General recommendations
  if (issues.length > 0) {
    recommendations.push('Consider running automated accessibility tests regularly');
    recommendations.push('Test with keyboard navigation and screen readers');
  }

  return recommendations;
}

/**
 * Runs a full accessibility audit
 */
export function runAccessibilityAudit(
  elements: BuilderElement[],
  options: A11yCheckerOptions = {}
): A11yReport {
  const {
    checkImages = true,
    checkColor = true,
    checkStructure = true,
    checkLinks = true,
    checkForms = true,
    checkFocus = true,
    checkTouch = true,
    checkKeyboard = true,
    checkAria = true,
    targetLevel = 'AA',
  } = options;

  // Collect all issues
  let allIssues: A11yIssue[] = [];

  for (const element of elements) {
    allIssues.push(...checkElement(element));
  }

  // Add heading hierarchy check
  if (checkStructure) {
    allIssues.push(...checkHeadingHierarchy(elements));
  }

  // Filter based on options
  allIssues = allIssues.filter((issue) => {
    if (!checkImages && issue.category === 'images') return false;
    if (!checkColor && issue.category === 'color') return false;
    if (!checkStructure && issue.category === 'structure') return false;
    if (!checkLinks && issue.category === 'links') return false;
    if (!checkForms && issue.category === 'forms') return false;
    if (!checkFocus && issue.category === 'focus') return false;
    if (!checkTouch && issue.category === 'touch') return false;
    if (!checkKeyboard && issue.category === 'keyboard') return false;
    if (!checkAria && issue.category === 'aria') return false;
    return true;
  });

  // Filter by target WCAG level
  if (targetLevel === 'A') {
    allIssues = allIssues.filter((issue) =>
      issue.wcagCriteria.some((c) => c.level === 'A')
    );
  } else if (targetLevel === 'AA') {
    allIssues = allIssues.filter((issue) =>
      issue.wcagCriteria.some((c) => c.level === 'A' || c.level === 'AA')
    );
  }

  // Calculate statistics
  const totalElements = countElements(elements);

  const issuesBySeverity: Record<A11ySeverity, number> = {
    critical: allIssues.filter((i) => i.severity === 'critical').length,
    serious: allIssues.filter((i) => i.severity === 'serious').length,
    moderate: allIssues.filter((i) => i.severity === 'moderate').length,
    minor: allIssues.filter((i) => i.severity === 'minor').length,
  };

  const issuesByCategory: Record<A11yCategory, number> = {
    images: allIssues.filter((i) => i.category === 'images').length,
    color: allIssues.filter((i) => i.category === 'color').length,
    structure: allIssues.filter((i) => i.category === 'structure').length,
    links: allIssues.filter((i) => i.category === 'links').length,
    forms: allIssues.filter((i) => i.category === 'forms').length,
    focus: allIssues.filter((i) => i.category === 'focus').length,
    touch: allIssues.filter((i) => i.category === 'touch').length,
    keyboard: allIssues.filter((i) => i.category === 'keyboard').length,
    aria: allIssues.filter((i) => i.category === 'aria').length,
    semantics: allIssues.filter((i) => i.category === 'semantics').length,
  };

  // Calculate score breakdown
  const calculateCategoryScore = (category: A11yCategory): number => {
    const categoryIssues = allIssues.filter((i) => i.category === category);
    if (categoryIssues.length === 0) return 100;
    return Math.max(0, 100 - categoryIssues.length * 10);
  };

  // Check WCAG compliance
  const criticalOrSerious = allIssues.filter(
    (i) => i.severity === 'critical' || i.severity === 'serious'
  );
  const levelAIssues = criticalOrSerious.filter((i) =>
    i.wcagCriteria.some((c) => c.level === 'A')
  );
  const levelAAIssues = criticalOrSerious.filter((i) =>
    i.wcagCriteria.some((c) => c.level === 'AA')
  );
  const levelAAAIssues = criticalOrSerious.filter((i) =>
    i.wcagCriteria.some((c) => c.level === 'AAA')
  );

  return {
    timestamp: new Date(),
    totalElements,
    totalIssues: allIssues.length,
    issuesBySeverity,
    issuesByCategory,
    issues: allIssues,
    score: calculateScore(allIssues, totalElements),
    scoreBreakdown: {
      images: calculateCategoryScore('images'),
      color: calculateCategoryScore('color'),
      structure: calculateCategoryScore('structure'),
      forms: calculateCategoryScore('forms'),
      navigation: calculateCategoryScore('links'),
    },
    wcagCompliance: {
      levelA: levelAIssues.length === 0,
      levelAA: levelAIssues.length === 0 && levelAAIssues.length === 0,
      levelAAA:
        levelAIssues.length === 0 &&
        levelAAIssues.length === 0 &&
        levelAAAIssues.length === 0,
    },
    passedChecks: generatePassedChecks(allIssues, elements),
    recommendations: generateRecommendations(allIssues),
  };
}

/**
 * Applies an automatic fix to an element
 */
export function applyFix(
  element: BuilderElement,
  fix: A11yFix
): Partial<BuilderElement> {
  switch (fix.type) {
    case 'props':
      return {
        props: { ...element.props, ...fix.changes },
      };
    case 'styles':
      return {
        styles: { ...element.styles, ...fix.changes },
      };
    case 'attribute':
      return {
        props: { ...element.props, ...fix.changes },
      };
    default:
      return {};
  }
}

/**
 * Gets all auto-fixable issues
 */
export function getAutoFixableIssues(issues: A11yIssue[]): A11yIssue[] {
  return issues.filter((issue) => issue.autoFixable && issue.fix);
}

/**
 * Exports audit report as JSON
 */
export function exportReportAsJSON(report: A11yReport): string {
  return JSON.stringify(report, null, 2);
}

/**
 * Exports audit report as HTML
 */
export function exportReportAsHTML(report: A11yReport): string {
  const severityColor = (severity: A11ySeverity): string => {
    const colors = {
      critical: '#dc2626',
      serious: '#ea580c',
      moderate: '#ca8a04',
      minor: '#2563eb',
    };
    return colors[severity];
  };

  const issueRows = report.issues
    .map(
      (issue) => `
      <tr>
        <td style="color: ${severityColor(issue.severity)}; font-weight: bold;">${issue.severity.toUpperCase()}</td>
        <td>${issue.category}</td>
        <td>${issue.elementName} (${issue.elementType})</td>
        <td>${issue.message}</td>
        <td>${issue.suggestion}</td>
        <td>${issue.wcagCriteria.map((c) => c.id).join(', ')}</td>
      </tr>
    `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Audit Report</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1 { color: #1f2937; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
    .card { background: #f3f4f6; padding: 20px; border-radius: 8px; }
    .score { font-size: 48px; font-weight: bold; color: ${report.score >= 80 ? '#16a34a' : report.score >= 60 ? '#ca8a04' : '#dc2626'}; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; }
    .passed { color: #16a34a; }
    .recommendation { background: #eff6ff; padding: 10px; border-radius: 4px; margin: 5px 0; }
  </style>
</head>
<body>
  <h1>Accessibility Audit Report</h1>
  <p>Generated: ${report.timestamp.toLocaleString()}</p>

  <div class="summary">
    <div class="card">
      <h3>Overall Score</h3>
      <div class="score">${report.score}</div>
    </div>
    <div class="card">
      <h3>Total Elements</h3>
      <div class="score">${report.totalElements}</div>
    </div>
    <div class="card">
      <h3>Total Issues</h3>
      <div class="score">${report.totalIssues}</div>
    </div>
    <div class="card">
      <h3>WCAG Compliance</h3>
      <p>Level A: ${report.wcagCompliance.levelA ? 'PASS' : 'FAIL'}</p>
      <p>Level AA: ${report.wcagCompliance.levelAA ? 'PASS' : 'FAIL'}</p>
      <p>Level AAA: ${report.wcagCompliance.levelAAA ? 'PASS' : 'FAIL'}</p>
    </div>
  </div>

  <h2>Issues by Severity</h2>
  <ul>
    <li><strong>Critical:</strong> ${report.issuesBySeverity.critical}</li>
    <li><strong>Serious:</strong> ${report.issuesBySeverity.serious}</li>
    <li><strong>Moderate:</strong> ${report.issuesBySeverity.moderate}</li>
    <li><strong>Minor:</strong> ${report.issuesBySeverity.minor}</li>
  </ul>

  <h2>Passed Checks</h2>
  <ul>
    ${report.passedChecks.map((check) => `<li class="passed">${check}</li>`).join('')}
  </ul>

  <h2>Issues</h2>
  <table>
    <thead>
      <tr>
        <th>Severity</th>
        <th>Category</th>
        <th>Element</th>
        <th>Issue</th>
        <th>Suggestion</th>
        <th>WCAG</th>
      </tr>
    </thead>
    <tbody>
      ${issueRows}
    </tbody>
  </table>

  <h2>Recommendations</h2>
  ${report.recommendations.map((rec) => `<div class="recommendation">${rec}</div>`).join('')}
</body>
</html>
  `;
}

export default {
  runAccessibilityAudit,
  applyFix,
  getAutoFixableIssues,
  exportReportAsJSON,
  exportReportAsHTML,
  WCAG_CRITERIA,
};
