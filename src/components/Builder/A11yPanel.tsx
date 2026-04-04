'use client';

import { useState, useMemo, useCallback } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Accordion from '@radix-ui/react-accordion';
import * as Tooltip from '@radix-ui/react-tooltip';
import {
  Play,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
  ChevronDown,
  Eye,
  Zap,
  Palette,
  MousePointer,
  Keyboard,
  FileText,
  Target,
  Link2,
  Settings,
  Download,
  RefreshCw,
  Copy,
  ExternalLink,
  Accessibility,
  Focus,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useBuilderStore } from '@/store/builderStore';
import type { BuilderElement } from '@/types/builder';
import {
  runAccessibilityAudit,
  applyFix,
  getAutoFixableIssues,
  exportReportAsJSON,
  exportReportAsHTML,
  type A11yReport,
  type A11yIssue,
  type A11ySeverity,
  type A11yCategory,
  type WCAGLevel,
} from '@/lib/a11yChecker';
import {
  checkColorContrast,
  suggestAccessibleColor,
  type ContrastResult,
  type AriaAttributes,
} from '@/lib/accessibilitySystem';

// =============================================================================
// TYPES
// =============================================================================

interface A11yPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

interface ContrastCheckState {
  foreground: string;
  background: string;
  result: ContrastResult | null;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SEVERITY_CONFIG: Record<
  A11ySeverity,
  { icon: typeof AlertCircle; color: string; bgColor: string; label: string }
> = {
  critical: {
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    label: 'Critical',
  },
  serious: {
    icon: AlertTriangle,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    label: 'Serious',
  },
  moderate: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    label: 'Moderate',
  },
  minor: {
    icon: Info,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    label: 'Minor',
  },
};

const CATEGORY_CONFIG: Record<
  A11yCategory,
  { icon: typeof Eye; label: string }
> = {
  images: { icon: Eye, label: 'Images' },
  color: { icon: Palette, label: 'Color & Contrast' },
  structure: { icon: FileText, label: 'Structure' },
  links: { icon: Link2, label: 'Links' },
  forms: { icon: FileText, label: 'Forms' },
  focus: { icon: Focus, label: 'Focus' },
  touch: { icon: MousePointer, label: 'Touch Targets' },
  keyboard: { icon: Keyboard, label: 'Keyboard' },
  aria: { icon: Accessibility, label: 'ARIA' },
  semantics: { icon: FileText, label: 'Semantics' },
};

const COMMON_ARIA_ATTRIBUTES: Array<{
  name: keyof AriaAttributes;
  label: string;
  type: 'boolean' | 'string' | 'select';
  options?: string[];
}> = [
  { name: 'role', label: 'Role', type: 'select', options: ['button', 'link', 'heading', 'navigation', 'main', 'banner', 'contentinfo', 'complementary', 'form', 'region', 'alert', 'dialog', 'menu', 'menuitem', 'tab', 'tabpanel', 'tablist'] },
  { name: 'aria-label', label: 'Label', type: 'string' },
  { name: 'aria-labelledby', label: 'Labelled By', type: 'string' },
  { name: 'aria-describedby', label: 'Described By', type: 'string' },
  { name: 'aria-hidden', label: 'Hidden', type: 'boolean' },
  { name: 'aria-expanded', label: 'Expanded', type: 'boolean' },
  { name: 'aria-selected', label: 'Selected', type: 'boolean' },
  { name: 'aria-disabled', label: 'Disabled', type: 'boolean' },
  { name: 'aria-required', label: 'Required', type: 'boolean' },
  { name: 'aria-invalid', label: 'Invalid', type: 'boolean' },
  { name: 'aria-live', label: 'Live Region', type: 'select', options: ['off', 'polite', 'assertive'] },
  { name: 'aria-current', label: 'Current', type: 'select', options: ['false', 'true', 'page', 'step', 'location', 'date', 'time'] },
  { name: 'tabIndex', label: 'Tab Index', type: 'string' },
];

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function SeverityIcon({ severity, className }: { severity: A11ySeverity; className?: string }) {
  const config = SEVERITY_CONFIG[severity];
  const Icon = config.icon;
  return <Icon className={cn('w-4 h-4', config.color, className)} />;
}

function ScoreGauge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
  const radius = 50 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500 stroke-green-500';
    if (score >= 70) return 'text-yellow-500 stroke-yellow-500';
    if (score >= 50) return 'text-orange-500 stroke-orange-500';
    return 'text-red-500 stroke-red-500';
  };

  return (
    <div className={cn('relative', sizeClasses[size])}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-700"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn('transition-all duration-500', getScoreColor(score))}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn('font-bold', textSizes[size], getScoreColor(score).split(' ')[0])}>
          {score}
        </span>
      </div>
    </div>
  );
}

function WCAGBadge({ level, passed }: { level: WCAGLevel; passed: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium',
        passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
      )}
    >
      {passed ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
      Level {level}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color = 'blue',
}: {
  label: string;
  value: number | string;
  icon: typeof AlertCircle;
  color?: 'red' | 'orange' | 'yellow' | 'green' | 'blue';
}) {
  const colorClasses = {
    red: 'text-red-500 bg-red-500/10',
    orange: 'text-orange-500 bg-orange-500/10',
    yellow: 'text-yellow-500 bg-yellow-500/10',
    green: 'text-green-500 bg-green-500/10',
    blue: 'text-blue-500 bg-blue-500/10',
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
      <div className={cn('p-2 rounded-lg', colorClasses[color])}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

// =============================================================================
// ISSUE LIST COMPONENT
// =============================================================================

interface IssueListProps {
  issues: A11yIssue[];
  onSelectElement: (elementId: string) => void;
  onApplyFix: (issue: A11yIssue) => void;
  selectedIssueId: string | null;
  onSelectIssue: (issueId: string | null) => void;
}

function IssueList({
  issues,
  onSelectElement,
  onApplyFix,
  selectedIssueId,
  onSelectIssue,
}: IssueListProps) {
  const groupedIssues = useMemo(() => {
    const groups: Record<A11yCategory, A11yIssue[]> = {} as Record<A11yCategory, A11yIssue[]>;
    for (const issue of issues) {
      if (!groups[issue.category]) {
        groups[issue.category] = [];
      }
      groups[issue.category].push(issue);
    }
    return groups;
  }, [issues]);

  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Issues Found</h3>
        <p className="text-sm text-gray-400 max-w-xs">
          Great job! Your design passes all accessibility checks.
        </p>
      </div>
    );
  }

  return (
    <Accordion.Root type="multiple" defaultValue={Object.keys(groupedIssues)}>
      {Object.entries(groupedIssues).map(([category, categoryIssues]) => {
        const config = CATEGORY_CONFIG[category as A11yCategory];
        const CategoryIcon = config.icon;

        return (
          <Accordion.Item key={category} value={category} className="border-b border-gray-800">
            <Accordion.Trigger className="flex items-center justify-between w-full py-3 px-4 text-left hover:bg-gray-800/50 transition-colors group">
              <div className="flex items-center gap-3">
                <CategoryIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-white">{config.label}</span>
                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                  {categoryIssues.length}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="pb-2">
                {categoryIssues.map((issue) => (
                  <IssueItem
                    key={issue.id}
                    issue={issue}
                    isSelected={selectedIssueId === issue.id}
                    onSelect={() => onSelectIssue(issue.id)}
                    onSelectElement={() => onSelectElement(issue.elementId)}
                    onApplyFix={() => onApplyFix(issue)}
                  />
                ))}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
}

function IssueItem({
  issue,
  isSelected,
  onSelect,
  onSelectElement,
  onApplyFix,
}: {
  issue: A11yIssue;
  isSelected: boolean;
  onSelect: () => void;
  onSelectElement: () => void;
  onApplyFix: () => void;
}) {
  const severityConfig = SEVERITY_CONFIG[issue.severity];

  return (
    <div
      onClick={onSelect}
      className={cn(
        'px-4 py-3 ml-4 border-l-2 cursor-pointer transition-colors',
        isSelected
          ? 'bg-gray-800 border-blue-500'
          : 'border-transparent hover:bg-gray-800/50 hover:border-gray-600'
      )}
    >
      <div className="flex items-start gap-3">
        <SeverityIcon severity={issue.severity} className="mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                'text-xs px-1.5 py-0.5 rounded',
                severityConfig.bgColor,
                severityConfig.color
              )}
            >
              {severityConfig.label}
            </span>
            <span className="text-xs text-gray-500">{issue.elementName}</span>
          </div>
          <p className="text-sm text-white mb-1">{issue.message}</p>
          <p className="text-xs text-gray-400 mb-2">{issue.suggestion}</p>

          {issue.wcagCriteria.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {issue.wcagCriteria.map((criterion) => (
                <Tooltip.Provider key={criterion.id}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <a
                        href={criterion.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-1.5 py-0.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {criterion.id}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="z-50 max-w-xs px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg border border-gray-700"
                        sideOffset={5}
                      >
                        <p className="font-medium mb-1">{criterion.name}</p>
                        <p className="text-gray-400">{criterion.description}</p>
                        <Tooltip.Arrow className="fill-gray-900" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectElement();
              }}
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <Target className="w-3 h-3" />
              Select
            </button>
            {issue.autoFixable && issue.fix && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApplyFix();
                }}
                className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
              >
                <Zap className="w-3 h-3" />
                Quick Fix
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// CONTRAST CHECKER COMPONENT
// =============================================================================

function ContrastChecker() {
  const [state, setState] = useState<ContrastCheckState>({
    foreground: '#000000',
    background: '#ffffff',
    result: null,
  });

  const checkContrast = useCallback(() => {
    const result = checkColorContrast(state.foreground, state.background);
    setState((prev) => ({ ...prev, result }));
  }, [state.foreground, state.background]);

  const suggestedColor = useMemo(() => {
    if (!state.result || state.result.passesAA) return null;
    return suggestAccessibleColor(state.foreground, state.background, 'AA');
  }, [state.result, state.foreground, state.background]);

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-medium text-white mb-4">Color Contrast Checker</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Foreground (Text)</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={state.foreground}
              onChange={(e) => setState((prev) => ({ ...prev, foreground: e.target.value }))}
              className="w-10 h-10 rounded border border-gray-700 cursor-pointer"
            />
            <input
              type="text"
              value={state.foreground}
              onChange={(e) => setState((prev) => ({ ...prev, foreground: e.target.value }))}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Background</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={state.background}
              onChange={(e) => setState((prev) => ({ ...prev, background: e.target.value }))}
              className="w-10 h-10 rounded border border-gray-700 cursor-pointer"
            />
            <input
              type="text"
              value={state.background}
              onChange={(e) => setState((prev) => ({ ...prev, background: e.target.value }))}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
            />
          </div>
        </div>
      </div>

      <button
        onClick={checkContrast}
        className="w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Check Contrast
      </button>

      {state.result && (
        <div className="space-y-4">
          {/* Preview */}
          <div
            className="p-4 rounded-lg text-center"
            style={{ backgroundColor: state.background }}
          >
            <p className="text-lg font-medium" style={{ color: state.foreground }}>
              Sample Text Preview
            </p>
            <p className="text-sm" style={{ color: state.foreground }}>
              This is how your text will look.
            </p>
          </div>

          {/* Results */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  {state.result.ratio.toFixed(2)}:1
                </span>
                <span className="text-sm text-gray-400">contrast ratio</span>
              </div>
              <span
                className={cn(
                  'px-2 py-1 rounded text-xs font-medium',
                  state.result.level === 'AAA'
                    ? 'bg-green-500/20 text-green-400'
                    : state.result.level === 'AA'
                    ? 'bg-green-500/20 text-green-400'
                    : state.result.level === 'AA-large'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                )}
              >
                {state.result.level === 'fail' ? 'FAIL' : state.result.level}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                {state.result.passesAA ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm text-gray-300">AA Normal Text</span>
              </div>
              <div className="flex items-center gap-2">
                {state.result.passesAALarge ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm text-gray-300">AA Large Text</span>
              </div>
              <div className="flex items-center gap-2">
                {state.result.passesAAA ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm text-gray-300">AAA Normal Text</span>
              </div>
              <div className="flex items-center gap-2">
                {state.result.passesAAALarge ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm text-gray-300">AAA Large Text</span>
              </div>
            </div>
          </div>

          {/* Suggestion */}
          {suggestedColor && !state.result.passesAA && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-400 mb-2">
                Suggested foreground color for WCAG AA compliance:
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded border border-gray-600"
                  style={{ backgroundColor: suggestedColor }}
                />
                <code className="text-sm text-white bg-gray-800 px-2 py-1 rounded">
                  {suggestedColor}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(suggestedColor);
                  }}
                  className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// ARIA EDITOR COMPONENT
// =============================================================================

function AriaEditor() {
  const selectedId = useBuilderStore((state) => state.selectedId);
  const getElementById = useBuilderStore((state) => state.getElementById);
  const updateElement = useBuilderStore((state) => state.updateElement);

  const selectedElement = selectedId ? getElementById(selectedId) : null;

  const updateAriaAttribute = useCallback(
    (name: string, value: string | boolean | undefined) => {
      if (!selectedElement) return;
      const newProps = { ...selectedElement.props };
      if (value === undefined || value === '' || value === false) {
        delete newProps[name];
      } else {
        newProps[name] = value;
      }
      updateElement(selectedElement.id, { props: newProps });
    },
    [selectedElement, updateElement]
  );

  if (!selectedElement) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-400">Select an element to edit ARIA attributes</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">ARIA Attributes</h3>
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
          {selectedElement.name}
        </span>
      </div>

      <div className="space-y-3">
        {COMMON_ARIA_ATTRIBUTES.map((attr) => {
          const currentValue = selectedElement.props[attr.name];

          if (attr.type === 'boolean') {
            return (
              <label key={attr.name} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentValue === true}
                  onChange={(e) => updateAriaAttribute(attr.name, e.target.checked || undefined)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500"
                />
                <span className="text-sm text-gray-300">{attr.label}</span>
                <code className="text-xs text-gray-500 ml-auto">{attr.name}</code>
              </label>
            );
          }

          if (attr.type === 'select' && attr.options) {
            return (
              <div key={attr.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400">{attr.label}</label>
                  <code className="text-xs text-gray-500">{attr.name}</code>
                </div>
                <select
                  value={currentValue ?? ''}
                  onChange={(e) => updateAriaAttribute(attr.name, e.target.value || undefined)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                >
                  <option value="">None</option>
                  {attr.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          return (
            <div key={attr.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">{attr.label}</label>
                <code className="text-xs text-gray-500">{attr.name}</code>
              </div>
              <input
                type="text"
                value={currentValue ?? ''}
                onChange={(e) => updateAriaAttribute(attr.name, e.target.value || undefined)}
                placeholder={`Enter ${attr.label.toLowerCase()}...`}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-500"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// FOCUS ORDER VISUALIZATION COMPONENT
// =============================================================================

function FocusOrderVisualization() {
  const elements = useBuilderStore((state) => state.elements);

  const focusableElements = useMemo(() => {
    const result: Array<{ element: BuilderElement; order: number; tabIndex: number }> = [];
    let order = 0;

    function collectFocusable(elements: BuilderElement[]) {
      for (const el of elements) {
        const isFocusable =
          el.type.includes('button') ||
          el.type === 'link' ||
          el.type.includes('input') ||
          el.type === 'textarea' ||
          el.type === 'select-dropdown' ||
          el.type === 'checkbox' ||
          el.type === 'toggle-switch' ||
          el.props.tabIndex !== undefined;

        if (isFocusable) {
          const tabIndex = typeof el.props.tabIndex === 'number' ? el.props.tabIndex : 0;
          result.push({ element: el, order: order++, tabIndex });
        }

        if (el.children.length > 0) {
          collectFocusable(el.children);
        }
      }
    }

    collectFocusable(elements);

    // Sort by tabIndex (negative values first, then 0 and positive in document order)
    return result.sort((a, b) => {
      if (a.tabIndex < 0 && b.tabIndex >= 0) return 1;
      if (a.tabIndex >= 0 && b.tabIndex < 0) return -1;
      if (a.tabIndex === b.tabIndex) return a.order - b.order;
      if (a.tabIndex === 0) return 1;
      if (b.tabIndex === 0) return -1;
      return a.tabIndex - b.tabIndex;
    });
  }, [elements]);

  const selectElement = useBuilderStore((state) => state.selectElement);

  if (focusableElements.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-400">No focusable elements found</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-medium text-white mb-4">Focus Order (Tab Sequence)</h3>

      <div className="space-y-2">
        {focusableElements.map((item, index) => (
          <div
            key={item.element.id}
            onClick={() => selectElement(item.element.id)}
            className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center bg-blue-600 rounded-full text-xs font-bold text-white">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{item.element.name}</p>
              <p className="text-xs text-gray-500">{item.element.type}</p>
            </div>
            {item.tabIndex !== 0 && (
              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded">
                tabindex={item.tabIndex}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
        <p className="text-xs text-yellow-400">
          <strong>Tip:</strong> Elements with positive tabindex values are focused first (in order),
          then elements with tabindex=0 or implicit focus in document order. Negative tabindex
          removes elements from the tab order.
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN A11Y PANEL COMPONENT
// =============================================================================

export function A11yPanel({ isOpen, onClose, className }: A11yPanelProps) {
  const elements = useBuilderStore((state) => state.elements);
  const selectElement = useBuilderStore((state) => state.selectElement);
  const getElementById = useBuilderStore((state) => state.getElementById);
  const updateElement = useBuilderStore((state) => state.updateElement);

  const [report, setReport] = useState<A11yReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('audit');
  const [targetLevel, setTargetLevel] = useState<WCAGLevel>('AA');

  // Run audit
  const runAudit = useCallback(() => {
    setIsLoading(true);
    // Simulate async operation
    setTimeout(() => {
      const auditReport = runAccessibilityAudit(elements, { targetLevel });
      setReport(auditReport);
      setIsLoading(false);
    }, 100);
  }, [elements, targetLevel]);

  // Apply fix
  const handleApplyFix = useCallback(
    (issue: A11yIssue) => {
      if (!issue.fix) return;
      const element = getElementById(issue.elementId);
      if (!element) return;

      const updates = applyFix(element, issue.fix);
      updateElement(issue.elementId, updates);

      // Re-run audit after fix
      setTimeout(runAudit, 100);
    },
    [getElementById, updateElement, runAudit]
  );

  // Apply all auto-fixes
  const handleApplyAllFixes = useCallback(() => {
    if (!report) return;
    const fixableIssues = getAutoFixableIssues(report.issues);

    for (const issue of fixableIssues) {
      if (issue.fix) {
        const element = getElementById(issue.elementId);
        if (element) {
          const updates = applyFix(element, issue.fix);
          updateElement(issue.elementId, updates);
        }
      }
    }

    // Re-run audit after all fixes
    setTimeout(runAudit, 100);
  }, [report, getElementById, updateElement, runAudit]);

  // Export report
  const handleExportJSON = useCallback(() => {
    if (!report) return;
    const json = exportReportAsJSON(report);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accessibility-report.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [report]);

  const handleExportHTML = useCallback(() => {
    if (!report) return;
    const html = exportReportAsHTML(report);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accessibility-report.html';
    a.click();
    URL.revokeObjectURL(url);
  }, [report]);

  // Select element on canvas
  const handleSelectElement = useCallback(
    (elementId: string) => {
      selectElement(elementId);
    },
    [selectElement]
  );

  if (!isOpen) return null;

  const autoFixableCount = report ? getAutoFixableIssues(report.issues).length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={cn(
          'w-[900px] max-h-[85vh] bg-gray-900 border border-gray-700 rounded-xl shadow-2xl flex flex-col overflow-hidden',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Accessibility className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">Accessibility Checker</h2>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value as WCAGLevel)}
              className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
            >
              <option value="A">WCAG Level A</option>
              <option value="AA">WCAG Level AA</option>
              <option value="AAA">WCAG Level AAA</option>
            </select>
            <button
              onClick={runAudit}
              disabled={isLoading}
              className={cn(
                'flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                'bg-blue-600 text-white hover:bg-blue-700',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Run Audit
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs.Root
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <Tabs.List className="flex border-b border-gray-800 px-4">
            {[
              { id: 'audit', label: 'Audit Results', icon: CheckCircle },
              { id: 'contrast', label: 'Contrast Checker', icon: Palette },
              { id: 'aria', label: 'ARIA Editor', icon: Settings },
              { id: 'focus', label: 'Focus Order', icon: Keyboard },
            ].map((tab) => (
              <Tabs.Trigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px',
                  'data-[state=active]:border-blue-500 data-[state=active]:text-white',
                  'data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-300'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <div className="flex-1 overflow-hidden">
            {/* Audit Results Tab */}
            <Tabs.Content value="audit" className="h-full flex">
              {report ? (
                <>
                  {/* Left: Score and Summary */}
                  <div className="w-72 flex-shrink-0 border-r border-gray-800 p-6 overflow-y-auto">
                    {/* Score */}
                    <div className="flex flex-col items-center mb-6">
                      <ScoreGauge score={report.score} size="lg" />
                      <p className="text-sm text-gray-400 mt-2">Accessibility Score</p>
                    </div>

                    {/* WCAG Compliance */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <WCAGBadge level="A" passed={report.wcagCompliance.levelA} />
                      <WCAGBadge level="AA" passed={report.wcagCompliance.levelAA} />
                      <WCAGBadge level="AAA" passed={report.wcagCompliance.levelAAA} />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      <StatCard
                        label="Critical"
                        value={report.issuesBySeverity.critical}
                        icon={AlertCircle}
                        color="red"
                      />
                      <StatCard
                        label="Serious"
                        value={report.issuesBySeverity.serious}
                        icon={AlertTriangle}
                        color="orange"
                      />
                      <StatCard
                        label="Moderate"
                        value={report.issuesBySeverity.moderate}
                        icon={AlertTriangle}
                        color="yellow"
                      />
                      <StatCard
                        label="Minor"
                        value={report.issuesBySeverity.minor}
                        icon={Info}
                        color="blue"
                      />
                    </div>

                    {/* Quick Actions */}
                    {autoFixableCount > 0 && (
                      <button
                        onClick={handleApplyAllFixes}
                        className="w-full mb-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        Fix {autoFixableCount} Issues Automatically
                      </button>
                    )}

                    {/* Export */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleExportJSON}
                        className="flex-1 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        JSON
                      </button>
                      <button
                        onClick={handleExportHTML}
                        className="flex-1 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        HTML
                      </button>
                    </div>

                    {/* Passed Checks */}
                    {report.passedChecks.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                          Passed Checks
                        </h4>
                        <div className="space-y-2">
                          {report.passedChecks.map((check, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-xs text-gray-300">{check}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Issue List */}
                  <div className="flex-1 overflow-y-auto">
                    <IssueList
                      issues={report.issues}
                      onSelectElement={handleSelectElement}
                      onApplyFix={handleApplyFix}
                      selectedIssueId={selectedIssueId}
                      onSelectIssue={setSelectedIssueId}
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <Accessibility className="w-16 h-16 text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Run an Accessibility Audit</h3>
                  <p className="text-sm text-gray-400 text-center max-w-md mb-6">
                    Click &quot;Run Audit&quot; to check your design for accessibility issues and get
                    recommendations for improvements.
                  </p>
                  <button
                    onClick={runAudit}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Run Audit
                  </button>
                </div>
              )}
            </Tabs.Content>

            {/* Contrast Checker Tab */}
            <Tabs.Content value="contrast" className="h-full overflow-y-auto">
              <ContrastChecker />
            </Tabs.Content>

            {/* ARIA Editor Tab */}
            <Tabs.Content value="aria" className="h-full overflow-y-auto">
              <AriaEditor />
            </Tabs.Content>

            {/* Focus Order Tab */}
            <Tabs.Content value="focus" className="h-full overflow-y-auto">
              <FocusOrderVisualization />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}

export default A11yPanel;
