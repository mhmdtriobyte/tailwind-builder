/**
 * Performance Hints Plugin
 *
 * This plugin analyzes the canvas elements and provides performance
 * optimization suggestions for the generated code.
 */

import { Plugin, PluginAPI, BuilderElementReadOnly } from '../pluginSystem';

// ============================================================================
// TYPES
// ============================================================================

interface PerformanceIssue {
  id: string;
  severity: 'low' | 'medium' | 'high';
  category: 'layout' | 'rendering' | 'images' | 'dom' | 'css';
  title: string;
  description: string;
  suggestion: string;
  elementId?: string;
  elementName?: string;
}

interface PerformanceReport {
  score: number;
  issues: PerformanceIssue[];
  totalElements: number;
  maxDepth: number;
  analyzedAt: number;
}

// ============================================================================
// ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Count total elements recursively
 */
function countElements(elements: BuilderElementReadOnly[]): number {
  let count = elements.length;
  for (const el of elements) {
    count += countElements(el.children);
  }
  return count;
}

/**
 * Calculate maximum nesting depth
 */
function calculateMaxDepth(elements: BuilderElementReadOnly[], depth = 0): number {
  if (elements.length === 0) return depth;

  let maxDepth = depth;
  for (const el of elements) {
    const childDepth = calculateMaxDepth(el.children, depth + 1);
    if (childDepth > maxDepth) {
      maxDepth = childDepth;
    }
  }
  return maxDepth;
}

/**
 * Get all classes from an element
 */
function getAllClasses(element: BuilderElementReadOnly): string[] {
  const { styles } = element;
  return [
    ...styles.layout,
    ...styles.spacing,
    ...styles.typography,
    ...styles.colors,
    ...styles.borders,
    ...styles.effects,
  ];
}

/**
 * Analyze elements for performance issues
 */
function analyzeElements(elements: BuilderElementReadOnly[]): PerformanceIssue[] {
  const issues: PerformanceIssue[] = [];
  let issueId = 0;

  function analyze(els: BuilderElementReadOnly[], depth: number): void {
    for (const el of els) {
      const classes = getAllClasses(el);

      // Check for expensive shadows
      const hasLargeShadow = classes.some(c =>
        c === 'shadow-2xl' || c === 'drop-shadow-2xl'
      );
      if (hasLargeShadow) {
        issues.push({
          id: `perf-${++issueId}`,
          severity: 'low',
          category: 'rendering',
          title: 'Large Shadow Effect',
          description: `Element "${el.name}" uses a large shadow that may impact rendering performance.`,
          suggestion: 'Consider using smaller shadows (shadow-lg or shadow-xl) for better performance.',
          elementId: el.id,
          elementName: el.name,
        });
      }

      // Check for backdrop blur
      const hasBackdropBlur = classes.some(c => c.startsWith('backdrop-blur'));
      if (hasBackdropBlur) {
        issues.push({
          id: `perf-${++issueId}`,
          severity: 'medium',
          category: 'rendering',
          title: 'Backdrop Blur Effect',
          description: `Element "${el.name}" uses backdrop-blur which is expensive to render.`,
          suggestion: 'Use backdrop-blur sparingly. Consider removing on mobile or using solid backgrounds.',
          elementId: el.id,
          elementName: el.name,
        });
      }

      // Check for excessive animations
      const hasAnimations = classes.some(c =>
        c.startsWith('animate-') || c.startsWith('transition-all')
      );
      const hasTransformAndShadow = classes.some(c => c.startsWith('transform')) &&
        classes.some(c => c.startsWith('shadow'));
      if (hasAnimations && hasTransformAndShadow) {
        issues.push({
          id: `perf-${++issueId}`,
          severity: 'medium',
          category: 'rendering',
          title: 'Complex Animation',
          description: `Element "${el.name}" animates both transform and shadow which triggers expensive repaints.`,
          suggestion: 'Animate only transform or opacity for best performance. Consider using will-change.',
          elementId: el.id,
          elementName: el.name,
        });
      }

      // Check for fixed/sticky positioning with blur
      const isFixed = classes.includes('fixed') || classes.includes('sticky');
      const hasBlur = classes.some(c => c.includes('blur'));
      if (isFixed && hasBlur) {
        issues.push({
          id: `perf-${++issueId}`,
          severity: 'high',
          category: 'rendering',
          title: 'Fixed Element with Blur',
          description: `Element "${el.name}" is fixed/sticky with blur effects, causing scroll performance issues.`,
          suggestion: 'Remove blur from fixed/sticky elements or reduce blur intensity on mobile.',
          elementId: el.id,
          elementName: el.name,
        });
      }

      // Check for too many classes
      if (classes.length > 20) {
        issues.push({
          id: `perf-${++issueId}`,
          severity: 'low',
          category: 'css',
          title: 'Many Utility Classes',
          description: `Element "${el.name}" has ${classes.length} utility classes which may be simplified.`,
          suggestion: 'Consider extracting common patterns into custom CSS classes using @apply.',
          elementId: el.id,
          elementName: el.name,
        });
      }

      // Check for gradient with opacity
      const hasGradient = classes.some(c => c.startsWith('bg-gradient'));
      const hasOpacity = classes.some(c => c.startsWith('opacity-'));
      if (hasGradient && hasOpacity) {
        issues.push({
          id: `perf-${++issueId}`,
          severity: 'low',
          category: 'rendering',
          title: 'Gradient with Opacity',
          description: `Element "${el.name}" applies opacity to a gradient which creates additional compositing.`,
          suggestion: 'Consider using gradient colors with built-in alpha instead of separate opacity.',
          elementId: el.id,
          elementName: el.name,
        });
      }

      // Recurse into children
      analyze(el.children, depth + 1);
    }
  }

  analyze(elements, 0);
  return issues;
}

/**
 * Analyze DOM structure
 */
function analyzeStructure(elements: BuilderElementReadOnly[]): PerformanceIssue[] {
  const issues: PerformanceIssue[] = [];
  let issueId = 1000;

  const totalElements = countElements(elements);
  const maxDepth = calculateMaxDepth(elements);

  // Check for excessive elements
  if (totalElements > 100) {
    issues.push({
      id: `perf-${++issueId}`,
      severity: 'medium',
      category: 'dom',
      title: 'Large DOM Size',
      description: `Your design has ${totalElements} elements which may slow down rendering.`,
      suggestion: 'Consider simplifying the design or splitting into multiple components/pages.',
    });
  } else if (totalElements > 200) {
    issues.push({
      id: `perf-${++issueId}`,
      severity: 'high',
      category: 'dom',
      title: 'Very Large DOM Size',
      description: `Your design has ${totalElements} elements which will significantly impact performance.`,
      suggestion: 'Split the design into smaller, lazy-loaded components.',
    });
  }

  // Check for excessive nesting
  if (maxDepth > 10) {
    issues.push({
      id: `perf-${++issueId}`,
      severity: 'medium',
      category: 'dom',
      title: 'Deep Nesting',
      description: `Maximum nesting depth is ${maxDepth} levels which complicates CSS selectors and rendering.`,
      suggestion: 'Flatten the structure where possible. Aim for max 6-8 levels of nesting.',
    });
  }

  // Check for many siblings
  function checkSiblings(els: BuilderElementReadOnly[]): void {
    if (els.length > 20) {
      issues.push({
        id: `perf-${++issueId}`,
        severity: 'low',
        category: 'dom',
        title: 'Many Sibling Elements',
        description: `Found ${els.length} sibling elements at one level which may slow down updates.`,
        suggestion: 'Consider grouping related elements or implementing virtualization for lists.',
      });
    }

    for (const el of els) {
      checkSiblings(el.children);
    }
  }

  checkSiblings(elements);

  return issues;
}

/**
 * Calculate performance score
 */
function calculateScore(issues: PerformanceIssue[]): number {
  let score = 100;

  for (const issue of issues) {
    switch (issue.severity) {
      case 'high':
        score -= 15;
        break;
      case 'medium':
        score -= 8;
        break;
      case 'low':
        score -= 3;
        break;
    }
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Generate full performance report
 */
function generateReport(elements: BuilderElementReadOnly[]): PerformanceReport {
  const elementIssues = analyzeElements(elements);
  const structureIssues = analyzeStructure(elements);
  const allIssues = [...elementIssues, ...structureIssues];

  return {
    score: calculateScore(allIssues),
    issues: allIssues,
    totalElements: countElements(elements),
    maxDepth: calculateMaxDepth(elements),
    analyzedAt: Date.now(),
  };
}

// ============================================================================
// PLUGIN STATE
// ============================================================================

let pluginApiRef: PluginAPI | null = null;
let lastReport: PerformanceReport | null = null;
let analysisInterval: ReturnType<typeof setInterval> | null = null;

// ============================================================================
// PLUGIN DEFINITION
// ============================================================================

export const performanceHintsPlugin: Plugin = {
  metadata: {
    id: 'builtin:performance-hints',
    name: 'Performance Hints',
    version: '1.0.0',
    description: 'Analyze your design for performance issues and get optimization tips',
    author: 'Tailwind Builder',
    category: 'optimization',
    tags: ['performance', 'optimization', 'analysis', 'speed'],
    icon: 'zap',
  },

  permissions: [
    'read:elements',
    'read:settings',
    'ui:toolbar',
    'ui:notifications',
    'keyboard:shortcuts',
    'storage:local',
  ],

  settingsSchema: {
    fields: [
      {
        key: 'autoAnalyze',
        label: 'Auto-analyze on Changes',
        type: 'boolean',
        defaultValue: false,
        description: 'Automatically analyze when elements change (may impact builder performance)',
      },
      {
        key: 'analysisInterval',
        label: 'Auto-analysis Interval (seconds)',
        type: 'number',
        defaultValue: 30,
        min: 10,
        max: 300,
        description: 'How often to run auto-analysis',
      },
      {
        key: 'showNotifications',
        label: 'Show Notifications',
        type: 'boolean',
        defaultValue: true,
        description: 'Show notifications for high-severity issues',
      },
      {
        key: 'minSeverity',
        label: 'Minimum Severity to Report',
        type: 'select',
        defaultValue: 'low',
        options: [
          { label: 'Low (All Issues)', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High Only', value: 'high' },
        ],
      },
    ],
  },

  activate: (api: PluginAPI) => {
    pluginApiRef = api;

    // Add toolbar button
    api.addToolbarButton({
      id: 'performance-analyze',
      icon: 'zap',
      label: 'Performance',
      tooltip: 'Analyze performance (Ctrl+Shift+P)',
      onClick: () => {
        const elements = api.getElements();
        lastReport = generateReport(elements);

        const highIssues = lastReport.issues.filter(i => i.severity === 'high');
        const mediumIssues = lastReport.issues.filter(i => i.severity === 'medium');

        api.showNotification({
          type: lastReport.score >= 80 ? 'success' : lastReport.score >= 50 ? 'warning' : 'error',
          message: `Performance Score: ${lastReport.score}/100`,
          description: `${highIssues.length} high, ${mediumIssues.length} medium severity issues`,
          duration: 5000,
        });

        api.setStorage('lastReport', lastReport);
      },
      isActive: () => false,
    });

    // Add keyboard shortcut
    api.addKeyboardShortcut({
      id: 'performance-analyze',
      keys: 'ctrl+shift+p',
      description: 'Run performance analysis',
      handler: () => {
        const button = document.querySelector('[data-plugin-button="performance-analyze"]');
        if (button) {
          (button as HTMLButtonElement).click();
        } else {
          const elements = api.getElements();
          lastReport = generateReport(elements);
          api.showNotification({
            type: 'info',
            message: `Performance Score: ${lastReport.score}/100`,
            duration: 3000,
          });
        }
      },
    });

    // Set up auto-analysis if enabled
    const settings = api.getSettings();
    if (settings.autoAnalyze) {
      const interval = ((settings.analysisInterval as number) || 30) * 1000;
      analysisInterval = setInterval(() => {
        const elements = api.getElements();
        const report = generateReport(elements);
        const prevScore = lastReport?.score || 100;
        lastReport = report;

        // Only notify if score dropped significantly
        if (settings.showNotifications && report.score < prevScore - 10) {
          api.showNotification({
            type: 'warning',
            message: `Performance score dropped to ${report.score}`,
            duration: 4000,
          });
        }
      }, interval);
    }

    // Load last report
    lastReport = api.getStorage<PerformanceReport>('lastReport');

    api.log('Performance Hints activated');
  },

  deactivate: (api: PluginAPI) => {
    // Clear auto-analysis interval
    if (analysisInterval) {
      clearInterval(analysisInterval);
      analysisInterval = null;
    }

    // Clean up UI
    api.removeToolbarButton('performance-analyze');
    api.removeKeyboardShortcut('performance-analyze');

    pluginApiRef = null;
    api.log('Performance Hints deactivated');
  },

  onSettingsChange: (settings: Record<string, unknown>) => {
    // Handle auto-analyze setting change
    if (analysisInterval) {
      clearInterval(analysisInterval);
      analysisInterval = null;
    }

    if (settings.autoAnalyze && pluginApiRef) {
      const interval = ((settings.analysisInterval as number) || 30) * 1000;
      analysisInterval = setInterval(() => {
        if (pluginApiRef) {
          const elements = pluginApiRef.getElements();
          lastReport = generateReport(elements);
        }
      }, interval);
    }
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

export { generateReport, type PerformanceReport, type PerformanceIssue };
export default performanceHintsPlugin;
