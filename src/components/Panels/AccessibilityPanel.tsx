'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Check,
  AlertTriangle,
  X,
  Eye,
  Type,
  MousePointer,
  Keyboard,
  Contrast,
  RefreshCw,
  ChevronDown,
  Info,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useBuilderStore } from '@/store/builderStore';
import { useCustomizationStore } from '@/store/customizationStore';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES
// ============================================================================

interface AccessibilityPanelProps {
  className?: string;
}

interface LocalAccessibilityIssue {
  id: string;
  elementId?: string;
  type: 'error' | 'warning' | 'info';
  category: 'contrast' | 'alt' | 'aria' | 'keyboard' | 'structure';
  message: string;
  suggestion?: string;
  wcagCriteria?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CATEGORY_INFO = {
  contrast: {
    name: 'Color Contrast',
    icon: Contrast,
    description: 'Text and UI elements should have sufficient color contrast',
  },
  alt: {
    name: 'Alternative Text',
    icon: Eye,
    description: 'Images and media should have descriptive alt text',
  },
  aria: {
    name: 'ARIA Labels',
    icon: Type,
    description: 'Interactive elements need proper ARIA attributes',
  },
  keyboard: {
    name: 'Keyboard Access',
    icon: Keyboard,
    description: 'All functionality should be keyboard accessible',
  },
  structure: {
    name: 'Structure',
    icon: MousePointer,
    description: 'Proper heading hierarchy and landmark regions',
  },
};

// ============================================================================
// MOCK AUDIT FUNCTION
// ============================================================================

function runAccessibilityAudit(
  elements: ReturnType<typeof useBuilderStore.getState>['elements']
): LocalAccessibilityIssue[] {
  const issues: LocalAccessibilityIssue[] = [];
  let issueCounter = 0;

  // Check each element
  function checkElement(element: (typeof elements)[0]) {
    const { type, props, id } = element;

    // Check images for alt text
    if (type === 'image' || type === 'avatar') {
      if (!props.alt || props.alt === '') {
        issues.push({
          id: `issue-${issueCounter++}`,
          elementId: id,
          type: 'error',
          category: 'alt',
          message: 'Image is missing alt text',
          suggestion: 'Add descriptive alt text or mark as decorative with alt=""',
          wcagCriteria: 'WCAG 1.1.1',
        });
      }
    }

    // Check buttons for accessible names
    if (type.includes('button') && type !== 'button-group') {
      if (!props.text && !props['aria-label']) {
        issues.push({
          id: `issue-${issueCounter++}`,
          elementId: id,
          type: 'error',
          category: 'aria',
          message: 'Button has no accessible name',
          suggestion: 'Add visible text or aria-label attribute',
          wcagCriteria: 'WCAG 4.1.2',
        });
      }
    }

    // Check links for href
    if (type === 'link') {
      if (!props.href || props.href === '#') {
        issues.push({
          id: `issue-${issueCounter++}`,
          elementId: id,
          type: 'warning',
          category: 'keyboard',
          message: 'Link has empty or placeholder href',
          suggestion: 'Provide a valid href or use a button instead',
          wcagCriteria: 'WCAG 2.4.4',
        });
      }
    }

    // Check form inputs for labels
    if (type === 'input-field' || type === 'textarea') {
      if (!props.label && !props['aria-label']) {
        issues.push({
          id: `issue-${issueCounter++}`,
          elementId: id,
          type: 'error',
          category: 'aria',
          message: 'Form input is missing a label',
          suggestion: 'Add a visible label or aria-label attribute',
          wcagCriteria: 'WCAG 1.3.1',
        });
      }
    }

    // Check headings structure (simplified)
    if (type === 'heading') {
      // This would need to check heading hierarchy in a real implementation
      issues.push({
        id: `issue-${issueCounter++}`,
        elementId: id,
        type: 'info',
        category: 'structure',
        message: 'Verify heading level is appropriate',
        suggestion: 'Ensure headings follow a logical hierarchy (h1 > h2 > h3)',
        wcagCriteria: 'WCAG 1.3.1',
      });
    }

    // Recurse into children
    if (element.children) {
      for (const child of element.children) {
        checkElement(child);
      }
    }
  }

  for (const element of elements) {
    checkElement(element);
  }

  // Add general recommendations if no issues
  if (issues.length === 0) {
    issues.push({
      id: `issue-${issueCounter++}`,
      type: 'info',
      category: 'structure',
      message: 'No accessibility issues detected',
      suggestion: 'Continue following WCAG guidelines as you build',
    });
  }

  return issues;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface IssueItemProps {
  issue: LocalAccessibilityIssue;
  onSelectElement?: (id: string) => void;
}

function IssueItem({ issue, onSelectElement }: IssueItemProps) {
  const [expanded, setExpanded] = useState(false);

  const typeIcons: Record<LocalAccessibilityIssue['type'], typeof X> = {
    error: X,
    warning: AlertTriangle,
    info: Info,
  };

  const typeColors: Record<LocalAccessibilityIssue['type'], string> = {
    error: 'text-red-400 bg-red-600/20',
    warning: 'text-yellow-400 bg-yellow-600/20',
    info: 'text-blue-400 bg-blue-600/20',
  };

  const Icon = typeIcons[issue.type];
  const typeColor = typeColors[issue.type];
  const CategoryIcon = CATEGORY_INFO[issue.category].icon;

  return (
    <div
      className={cn(
        'rounded-lg border overflow-hidden',
        issue.type === 'error'
          ? 'border-red-600/50'
          : issue.type === 'warning'
          ? 'border-yellow-600/50'
          : 'border-gray-700'
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'w-full flex items-start gap-3 p-3 text-left',
          'hover:bg-gray-800/50 transition-colors'
        )}
      >
        <div className={cn('flex-shrink-0 p-1 rounded', typeColor)}>
          <Icon className="w-3 h-3" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-white">{issue.message}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1 text-[10px] text-gray-500">
              <CategoryIcon className="w-3 h-3" />
              {CATEGORY_INFO[issue.category].name}
            </span>
            {issue.wcagCriteria && (
              <span className="text-[10px] text-gray-500">{issue.wcagCriteria}</span>
            )}
          </div>
        </div>

        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-500 transition-transform flex-shrink-0',
            expanded && 'rotate-180'
          )}
        />
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-gray-800">
          {issue.suggestion && (
            <div className="pt-2">
              <p className="text-xs text-gray-400">
                <span className="text-gray-500">Suggestion: </span>
                {issue.suggestion}
              </p>
            </div>
          )}

          {issue.elementId && (
            <button
              onClick={() => onSelectElement?.(issue.elementId!)}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded text-xs',
                'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700',
                'transition-colors'
              )}
            >
              <MousePointer className="w-3 h-3" />
              Select Element
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface ScoreDisplayProps {
  score: number;
}

function ScoreDisplay({ score }: ScoreDisplayProps) {
  const getScoreColor = () => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreRing = () => {
    if (score >= 90) return 'ring-green-500';
    if (score >= 70) return 'ring-yellow-500';
    return 'ring-red-500';
  };

  return (
    <div
      className={cn(
        'relative w-20 h-20 rounded-full flex items-center justify-center',
        'ring-4',
        getScoreRing()
      )}
    >
      <span className={cn('text-2xl font-bold', getScoreColor())}>{score}</span>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AccessibilityPanel({ className }: AccessibilityPanelProps) {
  const [isAuditing, setIsAuditing] = useState(false);
  const [issues, setIssues] = useState<LocalAccessibilityIssue[]>([]);
  const [lastAuditTime, setLastAuditTime] = useState<number | null>(null);

  const { elements, selectElement } = useBuilderStore();
  const { accessibilityReport, setAccessibilityReport, autoCheckAccessibility } =
    useCustomizationStore();

  // Calculate score based on issues
  const score = accessibilityReport?.score ?? 100;
  const errorCount = issues.filter((i) => i.type === 'error').length;
  const warningCount = issues.filter((i) => i.type === 'warning').length;

  // Run audit
  const runAudit = useCallback(() => {
    setIsAuditing(true);

    // Simulate async audit
    setTimeout(() => {
      const auditIssues = runAccessibilityAudit(elements);
      setIssues(auditIssues);
      setLastAuditTime(Date.now());

      // Calculate score
      const errors = auditIssues.filter((i) => i.type === 'error').length;
      const warnings = auditIssues.filter((i) => i.type === 'warning').length;
      const calculatedScore = Math.max(0, 100 - errors * 15 - warnings * 5);

      setAccessibilityReport({
        score: calculatedScore,
        issues: auditIssues.map((i) => ({
          id: i.id,
          type: i.type,
          element: i.elementId || 'unknown',
          message: i.message,
          fix: i.suggestion || 'No fix available',
          wcagLevel: 'AA' as const,
          wcagCriteria: i.wcagCriteria || 'Unknown',
        })),
        passed: [],
        timestamp: Date.now(),
      });

      setIsAuditing(false);
      toast.success('Accessibility audit complete');
    }, 1000);
  }, [elements, setAccessibilityReport]);

  // Auto-audit when elements change
  useEffect(() => {
    if (autoCheckAccessibility && elements.length > 0) {
      const timeout = setTimeout(runAudit, 2000);
      return () => clearTimeout(timeout);
    }
  }, [elements, autoCheckAccessibility, runAudit]);

  // Select element handler
  const handleSelectElement = (elementId: string) => {
    selectElement(elementId);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ScoreDisplay score={score} />
          <div>
            <h4 className="text-sm font-medium text-white">Accessibility Score</h4>
            <p className="text-xs text-gray-500">
              {errorCount} errors, {warningCount} warnings
            </p>
          </div>
        </div>

        <button
          onClick={runAudit}
          disabled={isAuditing}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
            'bg-blue-600 text-white hover:bg-blue-500',
            'transition-colors disabled:opacity-50',
            isAuditing && 'animate-pulse'
          )}
        >
          <RefreshCw className={cn('w-4 h-4', isAuditing && 'animate-spin')} />
          {isAuditing ? 'Auditing...' : 'Run Audit'}
        </button>
      </div>

      {/* Last audit time */}
      {lastAuditTime && (
        <p className="text-xs text-gray-500">
          Last audited: {new Date(lastAuditTime).toLocaleTimeString()}
        </p>
      )}

      {/* Category summary */}
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(CATEGORY_INFO).map(([key, info]) => {
          const Icon = info.icon;
          const categoryIssues = issues.filter((i) => i.category === key);
          const hasErrors = categoryIssues.some((i) => i.type === 'error');
          const hasWarnings = categoryIssues.some((i) => i.type === 'warning');

          return (
            <div
              key={key}
              className={cn(
                'flex flex-col items-center p-2 rounded-lg',
                'bg-gray-800/50 border border-gray-700',
                hasErrors && 'border-red-600/50',
                !hasErrors && hasWarnings && 'border-yellow-600/50'
              )}
              title={info.description}
            >
              <Icon
                className={cn(
                  'w-4 h-4 mb-1',
                  hasErrors
                    ? 'text-red-400'
                    : hasWarnings
                    ? 'text-yellow-400'
                    : 'text-green-400'
                )}
              />
              <span className="text-[9px] text-gray-500 text-center">{info.name}</span>
              {categoryIssues.length > 0 && (
                <span className="text-[10px] text-gray-400">{categoryIssues.length}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Issues list */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Issues ({issues.length})
        </h4>

        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Check className="w-8 h-8 mb-2 text-green-400" />
            <p className="text-sm">No issues found</p>
            <p className="text-xs mt-1">Run an audit to check accessibility</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {issues.map((issue) => (
              <IssueItem
                key={issue.id}
                issue={issue}
                onSelectElement={handleSelectElement}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick tips */}
      <div className="p-3 bg-gray-800/30 rounded-lg">
        <h4 className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-2">
          <Info className="w-3 h-3" />
          Quick Tips
        </h4>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>- Always provide alt text for images</li>
          <li>- Use semantic HTML elements (buttons, links)</li>
          <li>- Ensure sufficient color contrast (4.5:1)</li>
          <li>- Add labels to all form inputs</li>
        </ul>
      </div>
    </div>
  );
}

export default AccessibilityPanel;
