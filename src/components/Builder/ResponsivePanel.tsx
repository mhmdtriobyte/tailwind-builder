'use client';

import { useState, useCallback, useMemo, Fragment } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCcw,
  Plus,
  Trash2,
  AlertTriangle,
  Check,
  Columns,
  Lightbulb,
  Settings,
  Layers,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useBuilderStore } from '@/store/builderStore';
import {
  TAILWIND_BREAKPOINTS,
  EXTENDED_BREAKPOINTS,
  VISIBILITY_PATTERNS,
  analyzeResponsiveIssues,
  responsivePrefix,
  type BreakpointConfig,
  type ResponsiveFix,
} from '@/lib/responsiveSystem';
import {
  MOBILE_PRESETS,
  TABLET_PRESETS,
  DESKTOP_PRESETS,
  getOrientedDimensions,
  type DevicePreset,
  type DesktopPreset,
  type DeviceOrientation,
} from '@/lib/breakpointPresets';
import { useResponsive } from '@/hooks/useResponsive';

// ============================================================================
// TYPES
// ============================================================================

interface ResponsivePanelProps {
  className?: string;
}

interface BreakpointOverride {
  breakpoint: string;
  classes: string[];
  enabled: boolean;
}

// Reserved for future visibility rules implementation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type VisibilityRuleType = {
  id: string;
  hideOn: string[];
  showOn: string[];
};

// Reserved for future custom breakpoint form
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CustomBreakpointFormType = {
  name: string;
  minWidth: string;
  maxWidth: string;
};

// ============================================================================
// CONSTANTS
// ============================================================================

const DEVICE_ICONS: Record<string, typeof Monitor> = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
};

const VISIBILITY_PRESETS = [
  { id: 'hide-mobile', label: 'Hide on mobile', classes: ['hidden', 'md:block'] },
  { id: 'show-mobile-only', label: 'Mobile only', classes: ['block', 'md:hidden'] },
  { id: 'hide-tablet', label: 'Hide on tablet', classes: ['block', 'md:hidden', 'lg:block'] },
  { id: 'desktop-only', label: 'Desktop only', classes: ['hidden', 'lg:block'] },
  { id: 'hide-desktop', label: 'Hide on desktop', classes: ['block', 'lg:hidden'] },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Breakpoint indicator bar
 */
function BreakpointBar({
  breakpoints,
  currentBreakpoint,
  onSelect,
}: {
  breakpoints: BreakpointConfig[];
  currentBreakpoint: string;
  onSelect: (breakpoint: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 p-2 bg-gray-900 rounded-lg">
      {breakpoints.map((bp) => {
        const isActive = bp.name === currentBreakpoint;
        return (
          <button
            key={bp.name}
            onClick={() => onSelect(bp.name)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded transition-colors',
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            )}
            title={`${bp.label} (${bp.minWidth}px${bp.maxWidth ? ` - ${bp.maxWidth}px` : '+'})`}
          >
            {bp.name}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Device selector dropdown
 */
function DeviceSelector({
  selectedDevice,
  orientation,
  onSelectDevice,
  onToggleOrientation,
}: {
  selectedDevice: DevicePreset | DesktopPreset | null;
  orientation: DeviceOrientation;
  onSelectDevice: (device: DevicePreset | DesktopPreset) => void;
  onToggleOrientation: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  const devices = useMemo(() => {
    switch (activeCategory) {
      case 'mobile':
        return MOBILE_PRESETS;
      case 'tablet':
        return TABLET_PRESETS;
      case 'desktop':
        return DESKTOP_PRESETS;
      default:
        return [];
    }
  }, [activeCategory]);

  const getCategoryIcon = (category: string) => {
    const Icon = DEVICE_ICONS[category] || Monitor;
    return Icon;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors w-full"
      >
        {selectedDevice && (
          <>
            {(() => {
              const Icon = getCategoryIcon(selectedDevice.category);
              return <Icon className="w-4 h-4 text-gray-400" />;
            })()}
            <span className="flex-1 text-left text-sm text-gray-200">
              {selectedDevice.name}
            </span>
            <span className="text-xs text-gray-500">
              {'width' in selectedDevice && 'height' in selectedDevice
                ? `${selectedDevice.width} x ${selectedDevice.height}`
                : ''}
            </span>
          </>
        )}
        {!selectedDevice && (
          <span className="flex-1 text-left text-sm text-gray-400">Select device...</span>
        )}
        <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 max-h-80 overflow-hidden">
          {/* Category tabs */}
          <div className="flex border-b border-gray-700">
            {(['mobile', 'tablet', 'desktop'] as const).map((cat) => {
              const Icon = getCategoryIcon(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm transition-colors',
                    activeCategory === cat
                      ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                      : 'text-gray-400 hover:text-white hover:bg-gray-750'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="capitalize">{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Device list */}
          <div className="overflow-y-auto max-h-56">
            {devices.map((device) => {
              const isSelected = selectedDevice?.id === device.id;
              const dims = 'defaultOrientation' in device
                ? getOrientedDimensions(device as DevicePreset, orientation)
                : { width: device.width, height: device.height };

              return (
                <button
                  key={device.id}
                  onClick={() => {
                    onSelectDevice(device);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors',
                    isSelected
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'hover:bg-gray-700 text-gray-300'
                  )}
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">{device.name}</div>
                    {'brand' in device && (
                      <div className="text-xs text-gray-500">{(device as DevicePreset).brand}</div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {dims.width} x {dims.height}
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Orientation toggle for non-desktop devices */}
      {selectedDevice && selectedDevice.category !== 'desktop' && (
        <button
          onClick={onToggleOrientation}
          className="mt-2 flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 rounded hover:bg-gray-700 transition-colors w-full"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Rotate to {orientation === 'portrait' ? 'landscape' : 'portrait'}</span>
        </button>
      )}
    </div>
  );
}

/**
 * Visibility toggle for breakpoints
 */
function VisibilityToggle({
  label,
  isVisible,
  onToggle,
}: {
  label: string;
  isVisible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors w-full',
        isVisible
          ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
      )}
    >
      {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      <span className="text-sm">{label}</span>
    </button>
  );
}

/**
 * Per-breakpoint style override editor
 */
function BreakpointOverrideEditor({
  breakpoint,
  classes,
  enabled,
  onToggle,
  onUpdateClasses,
  onRemove,
}: {
  breakpoint: string;
  classes: string[];
  enabled: boolean;
  onToggle: () => void;
  onUpdateClasses: (classes: string[]) => void;
  onRemove: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState(classes.join(' '));

  const handleSave = () => {
    const newClasses = inputValue
      .split(/\s+/)
      .filter((c) => c.length > 0)
      .map((c) => responsivePrefix(breakpoint, c));
    onUpdateClasses(newClasses);
  };

  return (
    <div
      className={cn(
        'border rounded-lg transition-colors',
        enabled ? 'border-blue-500/50 bg-blue-900/10' : 'border-gray-700 bg-gray-800/50'
      )}
    >
      <div className="flex items-center gap-2 p-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-gray-400 hover:text-white"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <span className="text-sm font-medium text-gray-300 flex-1">{breakpoint}</span>

        <button
          onClick={onToggle}
          className={cn(
            'p-1 rounded transition-colors',
            enabled ? 'text-blue-400 hover:text-blue-300' : 'text-gray-500 hover:text-gray-300'
          )}
          title={enabled ? 'Disable override' : 'Enable override'}
        >
          {enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        <button
          onClick={onRemove}
          className="p-1 text-gray-500 hover:text-red-400 transition-colors"
          title="Remove override"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter Tailwind classes..."
            className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            rows={2}
          />
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Responsive issue suggestion card
 */
function ResponsiveIssueSuggestion({
  fix,
  onApply,
  onDismiss,
}: {
  fix: ResponsiveFix;
  onApply: () => void;
  onDismiss: () => void;
}) {
  const severityColors = {
    error: 'border-red-500/50 bg-red-900/20',
    warning: 'border-yellow-500/50 bg-yellow-900/20',
    info: 'border-blue-500/50 bg-blue-900/20',
  };

  const severityIcons = {
    error: AlertTriangle,
    warning: AlertTriangle,
    info: Lightbulb,
  };

  const Icon = severityIcons[fix.severity];

  return (
    <div className={cn('p-3 rounded-lg border', severityColors[fix.severity])}>
      <div className="flex items-start gap-2">
        <Icon
          className={cn(
            'w-4 h-4 mt-0.5 flex-shrink-0',
            fix.severity === 'error' && 'text-red-400',
            fix.severity === 'warning' && 'text-yellow-400',
            fix.severity === 'info' && 'text-blue-400'
          )}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-200">{fix.description}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {fix.suggestedClasses.map((cls) => (
              <code
                key={cls}
                className="px-1.5 py-0.5 text-xs bg-gray-800 text-gray-300 rounded"
              >
                {cls}
              </code>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={onDismiss}
          className="px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors"
        >
          Dismiss
        </button>
        <button
          onClick={onApply}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
        >
          Apply Fix
        </button>
      </div>
    </div>
  );
}

/**
 * Side-by-side preview comparison
 */
function ResponsiveComparison({
  breakpoints,
}: {
  breakpoints: string[];
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {breakpoints.map((bp) => {
        const config = TAILWIND_BREAKPOINTS.find((b) => b.name === bp);
        return (
          <div key={bp} className="flex-shrink-0">
            <div className="text-xs text-gray-400 mb-2 text-center">
              {bp} ({config?.minWidth}px)
            </div>
            <div
              className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden"
              style={{
                width: Math.min((config?.minWidth || 320) * 0.2, 200),
                height: 150,
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                Preview
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * ResponsivePanel - Comprehensive responsive design controls
 *
 * Features:
 * - Visual breakpoint editor
 * - Device frame selector with real dimensions
 * - Orientation toggle
 * - Per-breakpoint style overrides
 * - Visibility toggles (hide on mobile, show on desktop, etc.)
 * - Side-by-side responsive preview comparison
 * - Auto-suggest responsive fixes
 */
export function ResponsivePanel({ className }: ResponsivePanelProps) {
  const { selectedId, getElementById, updateElementStyles } = useBuilderStore();
  const { breakpoint: currentBreakpoint, viewport } = useResponsive();

  // Local state
  const [activeTab, setActiveTab] = useState<'breakpoints' | 'device' | 'visibility' | 'fixes'>(
    'breakpoints'
  );
  const [selectedBreakpoint, setSelectedBreakpoint] = useState('md');
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset | DesktopPreset | null>(null);
  const [orientation, setOrientation] = useState<DeviceOrientation>('portrait');
  const [overrides, setOverrides] = useState<BreakpointOverride[]>([]);
  const [visibilityRules, setVisibilityRules] = useState<Record<string, boolean>>({
    hideOnMobile: false,
    hideOnTablet: false,
    hideOnDesktop: false,
  });
  const [useExtendedBreakpoints, setUseExtendedBreakpoints] = useState(false);
  const [dismissedFixes, setDismissedFixes] = useState<Set<string>>(new Set());

  const selectedElement = selectedId ? getElementById(selectedId) : null;
  const breakpoints = useExtendedBreakpoints ? EXTENDED_BREAKPOINTS : TAILWIND_BREAKPOINTS;

  // Analyze responsive issues for the selected element
  const responsiveFixes = useMemo(() => {
    if (!selectedElement) return [];

    // Extract element information for analysis
    const allClasses = [
      ...selectedElement.styles.layout,
      ...selectedElement.styles.spacing,
      ...selectedElement.styles.typography,
    ];

    const fixes = analyzeResponsiveIssues(
      { classes: allClasses },
      { width: viewport.width, height: viewport.height }
    );

    return fixes.filter((fix) => !dismissedFixes.has(`${fix.issue}-${fix.description}`));
  }, [selectedElement, viewport, dismissedFixes]);

  // Handle adding a new breakpoint override
  const handleAddOverride = useCallback(() => {
    const newOverride: BreakpointOverride = {
      breakpoint: selectedBreakpoint,
      classes: [],
      enabled: true,
    };
    setOverrides((prev) => {
      if (prev.some((o) => o.breakpoint === selectedBreakpoint)) {
        return prev;
      }
      return [...prev, newOverride];
    });
  }, [selectedBreakpoint]);

  // Handle updating override classes
  const handleUpdateOverrideClasses = useCallback(
    (breakpoint: string, classes: string[]) => {
      setOverrides((prev) =>
        prev.map((o) => (o.breakpoint === breakpoint ? { ...o, classes } : o))
      );

      // Apply to element if selected
      if (selectedElement) {
        const currentClasses = selectedElement.styles.responsive;
        const breakpointKey = breakpoint as keyof typeof currentClasses;
        if (breakpointKey in currentClasses) {
          updateElementStyles(selectedElement.id, 'responsive', {
            ...currentClasses,
            [breakpointKey]: classes,
          } as unknown as string[]);
        }
      }
    },
    [selectedElement, updateElementStyles]
  );

  // Handle visibility changes
  const handleVisibilityChange = useCallback(
    (rule: string) => {
      setVisibilityRules((prev) => ({ ...prev, [rule]: !prev[rule] }));

      if (selectedElement) {
        const classes: string[] = [];

        if (rule === 'hideOnMobile' && !visibilityRules.hideOnMobile) {
          classes.push(...VISIBILITY_PATTERNS.hideOnMobile);
        }
        if (rule === 'hideOnDesktop' && !visibilityRules.hideOnDesktop) {
          classes.push(...VISIBILITY_PATTERNS.hideOnDesktop);
        }

        if (classes.length > 0) {
          updateElementStyles(selectedElement.id, 'layout', [
            ...selectedElement.styles.layout,
            ...classes,
          ]);
        }
      }
    },
    [selectedElement, visibilityRules, updateElementStyles]
  );

  // Handle applying a responsive fix
  const handleApplyFix = useCallback(
    (fix: ResponsiveFix) => {
      if (!selectedElement) return;

      // Remove current problematic classes if any
      let layoutClasses = [...selectedElement.styles.layout];
      if (fix.currentClasses) {
        layoutClasses = layoutClasses.filter((c) => !fix.currentClasses?.includes(c));
      }

      // Add suggested classes
      layoutClasses.push(...fix.suggestedClasses);

      updateElementStyles(selectedElement.id, 'layout', layoutClasses);
    },
    [selectedElement, updateElementStyles]
  );

  // Handle dismissing a fix
  const handleDismissFix = useCallback((fix: ResponsiveFix) => {
    setDismissedFixes((prev) => new Set(prev).add(`${fix.issue}-${fix.description}`));
  }, []);

  return (
    <div className={cn('flex flex-col h-full bg-gray-850', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Responsive Design
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Current: {currentBreakpoint.current}</span>
          <button
            onClick={() => setUseExtendedBreakpoints(!useExtendedBreakpoints)}
            className={cn(
              'p-1 rounded transition-colors',
              useExtendedBreakpoints
                ? 'text-blue-400 bg-blue-900/30'
                : 'text-gray-400 hover:text-white'
            )}
            title={useExtendedBreakpoints ? 'Use standard breakpoints' : 'Use extended breakpoints'}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {[
          { id: 'breakpoints', label: 'Breakpoints', icon: Columns },
          { id: 'device', label: 'Device', icon: Smartphone },
          { id: 'visibility', label: 'Visibility', icon: Eye },
          { id: 'fixes', label: 'Suggestions', icon: Lightbulb, count: responsiveFixes.length },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors',
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-900/10'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {'count' in tab && tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-yellow-500/20 text-yellow-400 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Breakpoints Tab */}
        {activeTab === 'breakpoints' && (
          <div className="space-y-4">
            {/* Breakpoint bar */}
            <BreakpointBar
              breakpoints={breakpoints}
              currentBreakpoint={selectedBreakpoint}
              onSelect={setSelectedBreakpoint}
            />

            {/* Current breakpoint info */}
            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-200">
                  {breakpoints.find((b) => b.name === selectedBreakpoint)?.label}
                </span>
                <span className="text-xs text-gray-500">
                  {breakpoints.find((b) => b.name === selectedBreakpoint)?.minWidth}px
                  {breakpoints.find((b) => b.name === selectedBreakpoint)?.maxWidth
                    ? ` - ${breakpoints.find((b) => b.name === selectedBreakpoint)?.maxWidth}px`
                    : '+'}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {breakpoints.find((b) => b.name === selectedBreakpoint)?.description}
              </p>
            </div>

            {/* Overrides section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Breakpoint Overrides
                </h4>
                <button
                  onClick={handleAddOverride}
                  className="p-1 text-gray-400 hover:text-white rounded hover:bg-gray-700 transition-colors"
                  title="Add override for selected breakpoint"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {overrides.length === 0 ? (
                <p className="text-xs text-gray-500 py-4 text-center">
                  No breakpoint overrides. Click + to add one.
                </p>
              ) : (
                <div className="space-y-2">
                  {overrides.map((override) => (
                    <BreakpointOverrideEditor
                      key={override.breakpoint}
                      breakpoint={override.breakpoint}
                      classes={override.classes}
                      enabled={override.enabled}
                      onToggle={() =>
                        setOverrides((prev) =>
                          prev.map((o) =>
                            o.breakpoint === override.breakpoint
                              ? { ...o, enabled: !o.enabled }
                              : o
                          )
                        )
                      }
                      onUpdateClasses={(classes) =>
                        handleUpdateOverrideClasses(override.breakpoint, classes)
                      }
                      onRemove={() =>
                        setOverrides((prev) =>
                          prev.filter((o) => o.breakpoint !== override.breakpoint)
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Comparison preview */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Preview Comparison
              </h4>
              <ResponsiveComparison breakpoints={['sm', 'md', 'lg', 'xl']} />
            </div>
          </div>
        )}

        {/* Device Tab */}
        {activeTab === 'device' && (
          <div className="space-y-4">
            <DeviceSelector
              selectedDevice={selectedDevice}
              orientation={orientation}
              onSelectDevice={setSelectedDevice}
              onToggleOrientation={() =>
                setOrientation((o) => (o === 'portrait' ? 'landscape' : 'portrait'))
              }
            />

            {selectedDevice && (
              <div className="space-y-3">
                {/* Device details */}
                <div className="p-3 bg-gray-800 rounded-lg space-y-2">
                  <h4 className="text-sm font-medium text-gray-200">{selectedDevice.name}</h4>
                  {'brand' in selectedDevice && (
                    <p className="text-xs text-gray-500">
                      {(selectedDevice as DevicePreset).brand} {(selectedDevice as DevicePreset).model}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">CSS Pixels:</span>
                      <span className="ml-2 text-gray-300">
                        {selectedDevice.width} x {selectedDevice.height}
                      </span>
                    </div>
                    {'pixelDensity' in selectedDevice && (
                      <div>
                        <span className="text-gray-500">DPR:</span>
                        <span className="ml-2 text-gray-300">
                          {(selectedDevice as DevicePreset).pixelDensity}x
                        </span>
                      </div>
                    )}
                    {'physicalPixelWidth' in selectedDevice && (
                      <div>
                        <span className="text-gray-500">Physical:</span>
                        <span className="ml-2 text-gray-300">
                          {(selectedDevice as DevicePreset).physicalPixelWidth} x{' '}
                          {(selectedDevice as DevicePreset).physicalPixelHeight}
                        </span>
                      </div>
                    )}
                    {'ppi' in selectedDevice && (selectedDevice as DevicePreset).ppi && (
                      <div>
                        <span className="text-gray-500">PPI:</span>
                        <span className="ml-2 text-gray-300">
                          {(selectedDevice as DevicePreset).ppi}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Device features */}
                {'hasNotch' in selectedDevice && (
                  <div className="flex flex-wrap gap-2">
                    {(selectedDevice as DevicePreset).hasNotch && (
                      <span className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded">
                        Notch
                      </span>
                    )}
                    {(selectedDevice as DevicePreset).hasDynamicIsland && (
                      <span className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded">
                        Dynamic Island
                      </span>
                    )}
                    {(selectedDevice as DevicePreset).hasHomeIndicator && (
                      <span className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded">
                        Home Indicator
                      </span>
                    )}
                    {(selectedDevice as DevicePreset).hasNavigationBar && (
                      <span className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded">
                        Nav Bar
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Visibility Tab */}
        {activeTab === 'visibility' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-400">
              Control element visibility across different screen sizes.
            </p>

            {/* Quick visibility toggles */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Quick Toggles
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <VisibilityToggle
                  label="Hide on mobile"
                  isVisible={!visibilityRules.hideOnMobile}
                  onToggle={() => handleVisibilityChange('hideOnMobile')}
                />
                <VisibilityToggle
                  label="Hide on tablet"
                  isVisible={!visibilityRules.hideOnTablet}
                  onToggle={() => handleVisibilityChange('hideOnTablet')}
                />
                <VisibilityToggle
                  label="Hide on desktop"
                  isVisible={!visibilityRules.hideOnDesktop}
                  onToggle={() => handleVisibilityChange('hideOnDesktop')}
                />
              </div>
            </div>

            {/* Visibility presets */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Presets
              </h4>
              <div className="space-y-1">
                {VISIBILITY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      if (selectedElement) {
                        updateElementStyles(selectedElement.id, 'layout', [
                          ...selectedElement.styles.layout.filter(
                            (c) => !c.includes('hidden') && !c.includes('block')
                          ),
                          ...preset.classes,
                        ]);
                      }
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <span>{preset.label}</span>
                    <div className="flex gap-1">
                      {preset.classes.map((cls) => (
                        <code key={cls} className="px-1 py-0.5 text-xs bg-gray-900 rounded">
                          {cls}
                        </code>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'fixes' && (
          <div className="space-y-4">
            {responsiveFixes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Check className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-sm text-gray-300">No responsive issues detected!</p>
                <p className="text-xs text-gray-500 mt-1">
                  Your design looks good across all breakpoints.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-400">
                  {responsiveFixes.length} suggestion{responsiveFixes.length !== 1 ? 's' : ''} for
                  improving responsiveness
                </p>
                {responsiveFixes.map((fix, index) => (
                  <ResponsiveIssueSuggestion
                    key={`${fix.issue}-${index}`}
                    fix={fix}
                    onApply={() => handleApplyFix(fix)}
                    onDismiss={() => handleDismissFix(fix)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer with current viewport info */}
      <div className="px-4 py-2 border-t border-gray-700 bg-gray-900">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Viewport: {viewport.width} x {viewport.height}
          </span>
          <span>{viewport.orientation}</span>
        </div>
      </div>
    </div>
  );
}

export default ResponsivePanel;
