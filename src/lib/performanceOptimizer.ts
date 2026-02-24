/**
 * Performance Optimizer
 *
 * Comprehensive code optimization system for the Tailwind Builder.
 * Includes CSS minification, HTML minification, dead code elimination,
 * unused class removal, critical CSS extraction, tree shaking, and more.
 */

import type { BuilderElement, ElementStyles } from '@/types/builder';

// ============================================================================
// TYPES
// ============================================================================

export interface OptimizationResult {
  originalSize: number;
  optimizedSize: number;
  savings: number;
  savingsPercent: number;
}

export interface CSSOptimizationResult extends OptimizationResult {
  unusedClasses: string[];
  criticalCSS: string;
  deferredCSS: string;
}

export interface HTMLOptimizationResult extends OptimizationResult {
  minifiedHTML: string;
}

export interface BundleAnalysis {
  totalClasses: number;
  uniqueClasses: number;
  duplicateClasses: number;
  estimatedCSSSize: number;
  estimatedHTMLSize: number;
  totalBundleSize: number;
  componentCount: number;
  maxNestingDepth: number;
  performanceScore: number;
  suggestions: OptimizationSuggestion[];
}

export interface OptimizationSuggestion {
  type: 'warning' | 'info' | 'critical';
  category: 'css' | 'html' | 'images' | 'structure' | 'performance';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  action?: () => void;
}

export interface ImageOptimizationSuggestion {
  src: string;
  currentSize?: number;
  suggestedFormat: string;
  suggestedDimensions?: { width: number; height: number };
  estimatedSavings: number;
}

export interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  memoryUsage: number;
  styleComputationTime: number;
  domNodeCount: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Tailwind CSS classes that are commonly used and should be prioritized
 * for critical CSS extraction
 */
const CRITICAL_CSS_PATTERNS = [
  // Layout
  /^(flex|grid|block|inline|hidden)/,
  /^(w-|h-|min-|max-)/,
  /^(p[xytblr]?-|m[xytblr]?-)/,
  // Typography
  /^(text-|font-|leading-|tracking-)/,
  // Colors (base colors for above-fold content)
  /^(bg-white|bg-gray-|text-gray-|text-black|text-white)/,
  // Display
  /^(visible|invisible|opacity-)/,
  // Position
  /^(relative|absolute|fixed|sticky)/,
];

/**
 * Classes that can safely be deferred (loaded after initial render)
 */
const DEFERRABLE_CSS_PATTERNS = [
  /^hover:/,
  /^focus:/,
  /^active:/,
  /^group-hover:/,
  /^dark:/,
  /^(sm:|md:|lg:|xl:|2xl:)/,
  /^animate-/,
  /^transition-/,
];

/**
 * Estimated bytes per Tailwind class (average)
 */
const BYTES_PER_CLASS = 25;

/**
 * Performance thresholds
 */
const PERFORMANCE_THRESHOLDS = {
  MAX_COMPONENTS: 100,
  MAX_NESTING_DEPTH: 10,
  MAX_CLASSES_PER_ELEMENT: 30,
  MAX_DUPLICATE_CLASSES: 20,
  IDEAL_BUNDLE_SIZE: 50 * 1024, // 50KB
  WARNING_BUNDLE_SIZE: 100 * 1024, // 100KB
};

// ============================================================================
// CSS MINIFICATION
// ============================================================================

/**
 * Minifies CSS by removing whitespace, comments, and optimizing syntax
 */
export function minifyCSS(css: string): string {
  if (!css) return '';

  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove whitespace around special characters
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    // Remove multiple spaces
    .replace(/\s+/g, ' ')
    // Remove spaces around selectors
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    // Remove trailing semicolons before closing braces
    .replace(/;}/g, '}')
    // Remove empty rules
    .replace(/[^{}]+{\s*}/g, '')
    // Trim
    .trim();
}

/**
 * Extracts and combines all Tailwind classes from elements
 */
export function extractAllClasses(elements: BuilderElement[]): string[] {
  const classes: string[] = [];

  function traverse(element: BuilderElement) {
    const elementClasses = extractClassesFromStyles(element.styles);
    classes.push(...elementClasses);

    element.children.forEach(traverse);
  }

  elements.forEach(traverse);
  return classes;
}

/**
 * Extracts classes from an element's styles object
 */
export function extractClassesFromStyles(styles: ElementStyles): string[] {
  const allClasses: string[] = [
    ...styles.layout,
    ...styles.spacing,
    ...styles.typography,
    ...styles.colors,
    ...styles.borders,
    ...styles.effects,
    ...styles.responsive.sm.map((c) => `sm:${c}`),
    ...styles.responsive.md.map((c) => `md:${c}`),
    ...styles.responsive.lg.map((c) => `lg:${c}`),
  ];

  return allClasses.filter(Boolean);
}

/**
 * Removes duplicate CSS classes while preserving order
 */
export function deduplicateClasses(classes: string[]): string[] {
  return Array.from(new Set(classes));
}

/**
 * Identifies unused Tailwind classes by comparing against a whitelist
 */
export function findUnusedClasses(
  usedClasses: string[],
  allPossibleClasses: string[]
): string[] {
  const usedSet = new Set(usedClasses);
  return allPossibleClasses.filter((cls) => !usedSet.has(cls));
}

/**
 * Extracts critical CSS (above-the-fold styles)
 */
export function extractCriticalCSS(classes: string[]): {
  critical: string[];
  deferred: string[];
} {
  const critical: string[] = [];
  const deferred: string[] = [];

  classes.forEach((cls) => {
    const isCritical = CRITICAL_CSS_PATTERNS.some((pattern) => pattern.test(cls));
    const isDeferrable = DEFERRABLE_CSS_PATTERNS.some((pattern) => pattern.test(cls));

    if (isCritical && !isDeferrable) {
      critical.push(cls);
    } else {
      deferred.push(cls);
    }
  });

  return { critical, deferred };
}

/**
 * Tree-shakes Tailwind classes by analyzing actual usage
 */
export function treeShakeClasses(elements: BuilderElement[]): {
  usedClasses: string[];
  removedClasses: string[];
  savings: number;
} {
  const allClasses = extractAllClasses(elements);
  const uniqueClasses = deduplicateClasses(allClasses);
  const removedCount = allClasses.length - uniqueClasses.length;

  return {
    usedClasses: uniqueClasses,
    removedClasses: allClasses.filter(
      (cls, index) => allClasses.indexOf(cls) !== index
    ),
    savings: removedCount * BYTES_PER_CLASS,
  };
}

// ============================================================================
// HTML MINIFICATION
// ============================================================================

/**
 * Minifies HTML by removing unnecessary whitespace and comments
 */
export function minifyHTML(html: string): string {
  if (!html) return '';

  return html
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove whitespace between tags
    .replace(/>\s+</g, '><')
    // Remove multiple spaces
    .replace(/\s+/g, ' ')
    // Remove spaces around attribute equals
    .replace(/\s*=\s*/g, '=')
    // Remove quotes around simple attribute values
    .replace(/="([^"'\s>]+)"/g, '=$1')
    // Remove empty attributes
    .replace(/\s+(?:class|style|id)=""/g, '')
    // Trim
    .trim();
}

/**
 * Optimizes JSX/TSX code output
 */
export function optimizeJSXOutput(jsx: string): string {
  return jsx
    // Remove unnecessary className concatenations
    .replace(/className=\{`\s*\$\{[^}]*\}\s*`\}/g, (match) => {
      const simplified = match.replace(/\s+/g, ' ');
      return simplified;
    })
    // Simplify empty string checks
    .replace(/\|\| ''/g, "|| ''")
    // Remove redundant fragments
    .replace(/<>\s*(<[^>]+>[^<]*<\/[^>]+>)\s*<\/>/g, '$1')
    .trim();
}

// ============================================================================
// DEAD CODE ELIMINATION
// ============================================================================

/**
 * Identifies elements that may be dead code (invisible, empty containers, etc.)
 */
export function findDeadElements(elements: BuilderElement[]): BuilderElement[] {
  const deadElements: BuilderElement[] = [];

  function traverse(element: BuilderElement) {
    // Check for hidden elements
    const isHidden = element.styles.layout.some(
      (cls) => cls === 'hidden' || cls === 'invisible' || cls === 'opacity-0'
    );

    // Check for empty containers
    const isEmptyContainer =
      element.children.length === 0 &&
      !element.props.text &&
      !element.props.src &&
      !element.props.content;

    if (isHidden || isEmptyContainer) {
      deadElements.push(element);
    }

    element.children.forEach(traverse);
  }

  elements.forEach(traverse);
  return deadElements;
}

/**
 * Removes dead elements from the element tree
 */
export function removeDeadElements(
  elements: BuilderElement[],
  deadIds: Set<string>
): BuilderElement[] {
  return elements
    .filter((el) => !deadIds.has(el.id))
    .map((el) => ({
      ...el,
      children: removeDeadElements(el.children, deadIds),
    }));
}

// ============================================================================
// IMAGE OPTIMIZATION
// ============================================================================

/**
 * Analyzes images in elements and provides optimization suggestions
 */
export function analyzeImages(elements: BuilderElement[]): ImageOptimizationSuggestion[] {
  const suggestions: ImageOptimizationSuggestion[] = [];

  function traverse(element: BuilderElement) {
    if (element.props.src && typeof element.props.src === 'string') {
      const src = element.props.src;
      const extension = src.split('.').pop()?.toLowerCase();

      let suggestedFormat = 'webp';
      let estimatedSavings = 30; // Default 30% savings with WebP

      if (extension === 'png') {
        suggestedFormat = 'webp';
        estimatedSavings = 40;
      } else if (extension === 'jpg' || extension === 'jpeg') {
        suggestedFormat = 'webp';
        estimatedSavings = 30;
      } else if (extension === 'gif') {
        suggestedFormat = 'webp';
        estimatedSavings = 50;
      } else if (extension === 'svg') {
        suggestedFormat = 'svgo-optimized';
        estimatedSavings = 20;
      }

      suggestions.push({
        src,
        suggestedFormat,
        estimatedSavings,
      });
    }

    element.children.forEach(traverse);
  }

  elements.forEach(traverse);
  return suggestions;
}

/**
 * Generates lazy loading attributes for images
 */
export function generateLazyLoadingAttributes(belowFold: boolean): Record<string, string> {
  if (belowFold) {
    return {
      loading: 'lazy',
      decoding: 'async',
    };
  }
  return {
    loading: 'eager',
    decoding: 'sync',
    fetchpriority: 'high',
  };
}

// ============================================================================
// BUNDLE SIZE ANALYSIS
// ============================================================================

/**
 * Calculates the maximum nesting depth of elements
 */
function calculateMaxDepth(elements: BuilderElement[], currentDepth = 0): number {
  if (elements.length === 0) return currentDepth;

  return Math.max(
    ...elements.map((el) => calculateMaxDepth(el.children, currentDepth + 1))
  );
}

/**
 * Counts total number of elements including nested
 */
function countElements(elements: BuilderElement[]): number {
  return elements.reduce(
    (count, el) => count + 1 + countElements(el.children),
    0
  );
}

/**
 * Performs comprehensive bundle analysis
 */
export function analyzeBundleSize(elements: BuilderElement[]): BundleAnalysis {
  const allClasses = extractAllClasses(elements);
  const uniqueClasses = deduplicateClasses(allClasses);
  const duplicateClasses = allClasses.length - uniqueClasses.length;
  const componentCount = countElements(elements);
  const maxNestingDepth = calculateMaxDepth(elements);

  // Estimate sizes
  const estimatedCSSSize = uniqueClasses.length * BYTES_PER_CLASS;
  const estimatedHTMLSize = componentCount * 150; // ~150 bytes per component average
  const totalBundleSize = estimatedCSSSize + estimatedHTMLSize;

  // Calculate performance score (0-100)
  let performanceScore = 100;

  // Deduct for component count
  if (componentCount > PERFORMANCE_THRESHOLDS.MAX_COMPONENTS) {
    performanceScore -= Math.min(
      30,
      ((componentCount - PERFORMANCE_THRESHOLDS.MAX_COMPONENTS) / 10) * 5
    );
  }

  // Deduct for nesting depth
  if (maxNestingDepth > PERFORMANCE_THRESHOLDS.MAX_NESTING_DEPTH) {
    performanceScore -= Math.min(
      20,
      (maxNestingDepth - PERFORMANCE_THRESHOLDS.MAX_NESTING_DEPTH) * 5
    );
  }

  // Deduct for duplicate classes
  if (duplicateClasses > PERFORMANCE_THRESHOLDS.MAX_DUPLICATE_CLASSES) {
    performanceScore -= Math.min(
      15,
      ((duplicateClasses - PERFORMANCE_THRESHOLDS.MAX_DUPLICATE_CLASSES) / 10) * 5
    );
  }

  // Deduct for bundle size
  if (totalBundleSize > PERFORMANCE_THRESHOLDS.WARNING_BUNDLE_SIZE) {
    performanceScore -= 20;
  } else if (totalBundleSize > PERFORMANCE_THRESHOLDS.IDEAL_BUNDLE_SIZE) {
    performanceScore -= 10;
  }

  performanceScore = Math.max(0, Math.round(performanceScore));

  // Generate suggestions
  const suggestions = generateOptimizationSuggestions(
    componentCount,
    maxNestingDepth,
    duplicateClasses,
    totalBundleSize,
    elements
  );

  return {
    totalClasses: allClasses.length,
    uniqueClasses: uniqueClasses.length,
    duplicateClasses,
    estimatedCSSSize,
    estimatedHTMLSize,
    totalBundleSize,
    componentCount,
    maxNestingDepth,
    performanceScore,
    suggestions,
  };
}

/**
 * Generates optimization suggestions based on analysis
 */
function generateOptimizationSuggestions(
  componentCount: number,
  maxNestingDepth: number,
  duplicateClasses: number,
  totalBundleSize: number,
  elements: BuilderElement[]
): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];

  // Component count suggestions
  if (componentCount > PERFORMANCE_THRESHOLDS.MAX_COMPONENTS) {
    suggestions.push({
      type: 'warning',
      category: 'structure',
      title: 'High Component Count',
      description: `You have ${componentCount} components. Consider consolidating similar elements or using component templates.`,
      impact: 'high',
    });
  }

  // Nesting depth suggestions
  if (maxNestingDepth > PERFORMANCE_THRESHOLDS.MAX_NESTING_DEPTH) {
    suggestions.push({
      type: 'warning',
      category: 'structure',
      title: 'Deep Nesting Detected',
      description: `Maximum nesting depth is ${maxNestingDepth}. Deep nesting can impact render performance. Consider flattening your structure.`,
      impact: 'medium',
    });
  }

  // Duplicate classes suggestions
  if (duplicateClasses > PERFORMANCE_THRESHOLDS.MAX_DUPLICATE_CLASSES) {
    suggestions.push({
      type: 'info',
      category: 'css',
      title: 'Duplicate CSS Classes',
      description: `Found ${duplicateClasses} duplicate class occurrences. These will be deduplicated in production.`,
      impact: 'low',
    });
  }

  // Bundle size suggestions
  if (totalBundleSize > PERFORMANCE_THRESHOLDS.WARNING_BUNDLE_SIZE) {
    suggestions.push({
      type: 'critical',
      category: 'performance',
      title: 'Large Bundle Size',
      description: `Estimated bundle size is ${formatBytes(totalBundleSize)}. Consider removing unused components or optimizing images.`,
      impact: 'high',
    });
  }

  // Image optimization suggestions
  const imageSuggestions = analyzeImages(elements);
  if (imageSuggestions.length > 0) {
    suggestions.push({
      type: 'info',
      category: 'images',
      title: 'Image Optimization Available',
      description: `${imageSuggestions.length} images can be optimized. Converting to WebP could save up to 30-50% in file size.`,
      impact: 'medium',
    });
  }

  // Add generic best practices
  suggestions.push({
    type: 'info',
    category: 'performance',
    title: 'Enable Lazy Loading',
    description: 'Ensure images below the fold use lazy loading for faster initial page load.',
    impact: 'medium',
  });

  return suggestions;
}

// ============================================================================
// PERFORMANCE SCORE CALCULATOR
// ============================================================================

/**
 * Calculates overall performance score with detailed breakdown
 */
export function calculatePerformanceScore(elements: BuilderElement[]): {
  overall: number;
  breakdown: {
    structure: number;
    css: number;
    images: number;
    complexity: number;
  };
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
} {
  const analysis = analyzeBundleSize(elements);
  const imageSuggestions = analyzeImages(elements);

  // Structure score (0-25)
  let structureScore = 25;
  if (analysis.maxNestingDepth > 5) {
    structureScore -= Math.min(15, (analysis.maxNestingDepth - 5) * 3);
  }
  if (analysis.componentCount > 50) {
    structureScore -= Math.min(10, Math.floor((analysis.componentCount - 50) / 10));
  }
  structureScore = Math.max(0, structureScore);

  // CSS score (0-25)
  let cssScore = 25;
  const classesPerComponent = analysis.uniqueClasses / Math.max(1, analysis.componentCount);
  if (classesPerComponent > 15) {
    cssScore -= Math.min(15, Math.floor((classesPerComponent - 15) / 2));
  }
  if (analysis.duplicateClasses > 10) {
    cssScore -= Math.min(10, Math.floor(analysis.duplicateClasses / 5));
  }
  cssScore = Math.max(0, cssScore);

  // Images score (0-25)
  let imagesScore = 25;
  const unoptimizedImages = imageSuggestions.filter(
    (img) => img.suggestedFormat !== 'svgo-optimized'
  ).length;
  imagesScore -= Math.min(25, unoptimizedImages * 5);
  imagesScore = Math.max(0, imagesScore);

  // Complexity score (0-25)
  let complexityScore = 25;
  if (analysis.totalBundleSize > PERFORMANCE_THRESHOLDS.IDEAL_BUNDLE_SIZE) {
    const excess = analysis.totalBundleSize - PERFORMANCE_THRESHOLDS.IDEAL_BUNDLE_SIZE;
    complexityScore -= Math.min(25, Math.floor(excess / 5000));
  }
  complexityScore = Math.max(0, complexityScore);

  const overall = structureScore + cssScore + imagesScore + complexityScore;

  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (overall >= 90) grade = 'A';
  else if (overall >= 80) grade = 'B';
  else if (overall >= 70) grade = 'C';
  else if (overall >= 60) grade = 'D';
  else grade = 'F';

  return {
    overall,
    breakdown: {
      structure: structureScore,
      css: cssScore,
      images: imagesScore,
      complexity: complexityScore,
    },
    grade,
  };
}

// ============================================================================
// ONE-CLICK OPTIMIZATIONS
// ============================================================================

/**
 * Applies all safe optimizations to elements
 */
export function applyAllOptimizations(elements: BuilderElement[]): {
  optimizedElements: BuilderElement[];
  changes: string[];
} {
  const changes: string[] = [];
  let optimizedElements = [...elements];

  // Remove dead elements
  const deadElements = findDeadElements(optimizedElements);
  if (deadElements.length > 0) {
    const deadIds = new Set(deadElements.map((el) => el.id));
    optimizedElements = removeDeadElements(optimizedElements, deadIds);
    changes.push(`Removed ${deadElements.length} empty/hidden elements`);
  }

  // Deduplicate classes in each element
  let deduplicatedCount = 0;
  function deduplicateInElement(element: BuilderElement): BuilderElement {
    const originalCount =
      element.styles.layout.length +
      element.styles.spacing.length +
      element.styles.typography.length +
      element.styles.colors.length +
      element.styles.borders.length +
      element.styles.effects.length;

    const newStyles: ElementStyles = {
      layout: deduplicateClasses(element.styles.layout),
      spacing: deduplicateClasses(element.styles.spacing),
      typography: deduplicateClasses(element.styles.typography),
      colors: deduplicateClasses(element.styles.colors),
      borders: deduplicateClasses(element.styles.borders),
      effects: deduplicateClasses(element.styles.effects),
      responsive: {
        sm: deduplicateClasses(element.styles.responsive.sm),
        md: deduplicateClasses(element.styles.responsive.md),
        lg: deduplicateClasses(element.styles.responsive.lg),
      },
    };

    const newCount =
      newStyles.layout.length +
      newStyles.spacing.length +
      newStyles.typography.length +
      newStyles.colors.length +
      newStyles.borders.length +
      newStyles.effects.length;

    deduplicatedCount += originalCount - newCount;

    return {
      ...element,
      styles: newStyles,
      children: element.children.map(deduplicateInElement),
    };
  }

  optimizedElements = optimizedElements.map(deduplicateInElement);
  if (deduplicatedCount > 0) {
    changes.push(`Removed ${deduplicatedCount} duplicate CSS classes`);
  }

  return { optimizedElements, changes };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Formats bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Estimates compression ratio for gzip
 */
export function estimateGzipSize(originalSize: number): number {
  // Average gzip compression ratio for HTML/CSS is about 70-80%
  return Math.round(originalSize * 0.25);
}

/**
 * Creates a performance report
 */
export function generatePerformanceReport(elements: BuilderElement[]): string {
  const analysis = analyzeBundleSize(elements);
  const score = calculatePerformanceScore(elements);
  const imageSuggestions = analyzeImages(elements);

  return `
# Performance Report

## Overall Score: ${score.overall}/100 (Grade: ${score.grade})

### Breakdown
- Structure: ${score.breakdown.structure}/25
- CSS: ${score.breakdown.css}/25
- Images: ${score.breakdown.images}/25
- Complexity: ${score.breakdown.complexity}/25

### Bundle Analysis
- Total Components: ${analysis.componentCount}
- Max Nesting Depth: ${analysis.maxNestingDepth}
- Unique CSS Classes: ${analysis.uniqueClasses}
- Duplicate Classes: ${analysis.duplicateClasses}
- Estimated CSS Size: ${formatBytes(analysis.estimatedCSSSize)}
- Estimated HTML Size: ${formatBytes(analysis.estimatedHTMLSize)}
- Total Bundle Size: ${formatBytes(analysis.totalBundleSize)}
- Gzipped Size: ${formatBytes(estimateGzipSize(analysis.totalBundleSize))}

### Suggestions
${analysis.suggestions.map((s) => `- [${s.type.toUpperCase()}] ${s.title}: ${s.description}`).join('\n')}

### Image Optimization
${
  imageSuggestions.length > 0
    ? imageSuggestions
        .map((img) => `- ${img.src}: Convert to ${img.suggestedFormat} (est. ${img.estimatedSavings}% savings)`)
        .join('\n')
    : '- No images found'
}
`.trim();
}
