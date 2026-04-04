'use client';

import { useState, useCallback, useMemo } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Switch from '@radix-ui/react-switch';
import * as Slider from '@radix-ui/react-slider';
import {
  MousePointer,
  Focus,
  Hand,
  Ban,
  Loader2,
  AlertCircle,
  CheckCircle,
  CheckSquare,
  Move,
  Copy,
  RotateCcw,
  ChevronDown,
  Clock,
  Layers,
  Eye,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { ColorPicker } from '@/components/common/ColorPicker';
import { SelectInput } from './SelectInput';
import {
  type InteractionStateName,
  type InteractionStatesConfig,
  type InteractionStateDefinition,
  type StateStyles,
  type StateTransition,
  createDefaultStatesConfig,
  stateToTailwindClasses,
  transitionsToTailwindClasses,
  getAllStateNames,
} from '@/lib/interactionStates';
import {
  getCursorOptionsGrouped,
} from '@/lib/cursorStyles';
import { shadowOptions, borderRadiusOptions } from '@/lib/tailwindClasses';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface StateEditorProps {
  elementId: string;
  initialConfig?: InteractionStatesConfig;
  onChange: (config: InteractionStatesConfig) => void;
  onPreviewState?: (stateName: InteractionStateName | null) => void;
}

interface StateTabProps {
  state: InteractionStateDefinition;
  isActive: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STATE_ICONS: Record<InteractionStateName, React.ComponentType<{ className?: string }>> = {
  default: Eye,
  hover: MousePointer,
  focus: Focus,
  active: Hand,
  disabled: Ban,
  loading: Loader2,
  error: AlertCircle,
  success: CheckCircle,
  selected: CheckSquare,
  dragging: Move,
};

const STATE_COLORS: Record<InteractionStateName, string> = {
  default: 'bg-gray-500',
  hover: 'bg-blue-500',
  focus: 'bg-purple-500',
  active: 'bg-orange-500',
  disabled: 'bg-gray-400',
  loading: 'bg-yellow-500',
  error: 'bg-red-500',
  success: 'bg-green-500',
  selected: 'bg-indigo-500',
  dragging: 'bg-pink-500',
};

const DURATION_OPTIONS = [
  { label: 'Instant (0ms)', value: 0 },
  { label: 'Fast (75ms)', value: 75 },
  { label: 'Normal (150ms)', value: 150 },
  { label: 'Slow (300ms)', value: 300 },
  { label: 'Very Slow (500ms)', value: 500 },
];

const TIMING_OPTIONS = [
  { label: 'Linear', value: 'linear' },
  { label: 'Ease', value: 'ease' },
  { label: 'Ease In', value: 'ease-in' },
  { label: 'Ease Out', value: 'ease-out' },
  { label: 'Ease In-Out', value: 'ease-in-out' },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * State Tab Button
 */
function StateTab({ state, isActive, onClick, icon: Icon }: StateTabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium',
        'transition-all duration-150',
        isActive
          ? 'bg-gray-800 text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
      )}
    >
      <div
        className={cn(
          'w-2 h-2 rounded-full',
          state.enabled ? STATE_COLORS[state.name] : 'bg-gray-600'
        )}
      />
      <Icon className="w-4 h-4" />
      <span className="capitalize">{state.label}</span>
    </button>
  );
}

/**
 * Style Property Section
 */
function StyleSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {title}
      </h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/**
 * Opacity Slider
 */
function OpacitySlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-400">Opacity</label>
        <span className="text-xs text-gray-500">{Math.round(value * 100)}%</span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={0}
        max={1}
        step={0.05}
      >
        <Slider.Track className="bg-gray-700 relative grow rounded-full h-1.5">
          <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </Slider.Root>
    </div>
  );
}

/**
 * Scale Slider
 */
function ScaleSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-400">Scale</label>
        <span className="text-xs text-gray-500">{Math.round(value * 100)}%</span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={0.8}
        max={1.2}
        step={0.01}
      >
        <Slider.Track className="bg-gray-700 relative grow rounded-full h-1.5">
          <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </Slider.Root>
    </div>
  );
}

/**
 * Cursor Select
 */
function CursorSelect({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (value: string) => void;
}) {
  const groupedOptions = getCursorOptionsGrouped();

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-400">Cursor</label>
      <select
        value={value || 'default'}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md',
          'text-white text-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        )}
      >
        {Object.entries(groupedOptions).map(([category, options]) => (
          <optgroup key={category} label={category.charAt(0).toUpperCase() + category.slice(1)}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

/**
 * Transition Editor
 */
function TransitionEditor({
  transition,
  onChange,
}: {
  transition: StateTransition;
  onChange: (transition: StateTransition) => void;
}) {
  return (
    <div className="p-3 bg-gray-800/50 rounded-lg space-y-3">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Clock className="w-3.5 h-3.5" />
        <span>Transition</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-400">Duration</label>
          <select
            value={transition.duration}
            onChange={(e) =>
              onChange({ ...transition, duration: parseInt(e.target.value) })
            }
            className={cn(
              'w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-md',
              'text-white text-xs',
              'focus:outline-none focus:ring-2 focus:ring-blue-500'
            )}
          >
            {DURATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-400">Timing</label>
          <select
            value={transition.timing}
            onChange={(e) =>
              onChange({ ...transition, timing: e.target.value as typeof transition.timing })
            }
            className={cn(
              'w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-md',
              'text-white text-xs',
              'focus:outline-none focus:ring-2 focus:ring-blue-500'
            )}
          >
            {TIMING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-400">Delay (ms)</label>
        <input
          type="number"
          value={transition.delay || 0}
          onChange={(e) =>
            onChange({ ...transition, delay: parseInt(e.target.value) || 0 })
          }
          min={0}
          max={2000}
          step={25}
          className={cn(
            'w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-md',
            'text-white text-xs',
            'focus:outline-none focus:ring-2 focus:ring-blue-500'
          )}
        />
      </div>
    </div>
  );
}

/**
 * State Style Editor Panel
 */
function StateStyleEditor({
  state,
  onChange,
  onCopyFrom,
  onReset,
  availableStates,
}: {
  state: InteractionStateDefinition;
  onChange: (state: InteractionStateDefinition) => void;
  onCopyFrom: (fromState: InteractionStateName) => void;
  onReset: () => void;
  availableStates: InteractionStateName[];
}) {
  const [copyFromOpen, setCopyFromOpen] = useState(false);

  const updateStyles = useCallback(
    (updates: Partial<StateStyles>) => {
      onChange({
        ...state,
        styles: { ...state.styles, ...updates },
      });
    },
    [state, onChange]
  );

  const updateTransition = useCallback(
    (index: number, transition: StateTransition) => {
      const newTransitions = [...state.transitions];
      newTransitions[index] = transition;
      onChange({ ...state, transitions: newTransitions });
    },
    [state, onChange]
  );

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Switch.Root
            checked={state.enabled}
            onCheckedChange={(checked) => onChange({ ...state, enabled: checked })}
            className={cn(
              'w-9 h-5 bg-gray-700 rounded-full relative',
              'data-[state=checked]:bg-blue-500',
              'transition-colors'
            )}
          >
            <Switch.Thumb
              className={cn(
                'block w-4 h-4 bg-white rounded-full',
                'transition-transform duration-100',
                'translate-x-0.5 will-change-transform',
                'data-[state=checked]:translate-x-[18px]'
              )}
            />
          </Switch.Root>
          <span className="text-sm text-gray-300">
            {state.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy From */}
          <Popover.Root open={copyFromOpen} onOpenChange={setCopyFromOpen}>
            <Popover.Trigger asChild>
              <button
                className={cn(
                  'flex items-center gap-1.5 px-2 py-1 rounded text-xs',
                  'text-gray-400 hover:text-white hover:bg-gray-800',
                  'transition-colors'
                )}
              >
                <Copy className="w-3.5 h-3.5" />
                Copy From
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="w-40 p-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
                sideOffset={5}
              >
                <div className="space-y-1">
                  {availableStates
                    .filter((s) => s !== state.name)
                    .map((stateName) => (
                      <button
                        key={stateName}
                        onClick={() => {
                          onCopyFrom(stateName);
                          setCopyFromOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs',
                          'text-gray-300 hover:text-white hover:bg-gray-700',
                          'transition-colors text-left'
                        )}
                      >
                        <div className={cn('w-2 h-2 rounded-full', STATE_COLORS[stateName])} />
                        <span className="capitalize">{stateName}</span>
                      </button>
                    ))}
                </div>
                <Popover.Arrow className="fill-gray-700" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          {/* Reset */}
          <button
            onClick={onReset}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded text-xs',
              'text-gray-400 hover:text-white hover:bg-gray-800',
              'transition-colors'
            )}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Style Properties */}
      {state.enabled && (
        <div className="space-y-6">
          {/* Colors */}
          <StyleSection title="Colors">
            <ColorPicker
              label="Background Color"
              value={state.styles.backgroundColor || ''}
              onChange={(value) => updateStyles({ backgroundColor: value })}
            />
            <ColorPicker
              label="Text Color"
              value={state.styles.textColor || ''}
              onChange={(value) => updateStyles({ textColor: value })}
            />
            <ColorPicker
              label="Border Color"
              value={state.styles.borderColor || ''}
              onChange={(value) => updateStyles({ borderColor: value })}
            />
          </StyleSection>

          {/* Effects */}
          <StyleSection title="Effects">
            <OpacitySlider
              value={state.styles.opacity ?? 1}
              onChange={(value) => updateStyles({ opacity: value })}
            />
            <ScaleSlider
              value={state.styles.scale ?? 1}
              onChange={(value) => updateStyles({ scale: value })}
            />
            <SelectInput
              label="Shadow"
              value={state.styles.shadow || ''}
              onChange={(value) => updateStyles({ shadow: value })}
              options={[{ label: 'None', value: '' }, ...shadowOptions]}
            />
          </StyleSection>

          {/* Focus Ring */}
          <StyleSection title="Focus Ring">
            <SelectInput
              label="Ring Width"
              value={state.styles.ring || ''}
              onChange={(value) => updateStyles({ ring: value })}
              options={[
                { label: 'None', value: '' },
                { label: 'Ring 1', value: 'ring-1' },
                { label: 'Ring 2', value: 'ring-2' },
                { label: 'Ring 4', value: 'ring-4' },
                { label: 'Ring 8', value: 'ring-8' },
              ]}
            />
            <ColorPicker
              label="Ring Color"
              value={state.styles.ringColor || ''}
              onChange={(value) => updateStyles({ ringColor: value.replace('bg-', 'ring-') })}
            />
            <SelectInput
              label="Ring Offset"
              value={state.styles.ringOffset || ''}
              onChange={(value) => updateStyles({ ringOffset: value })}
              options={[
                { label: 'None', value: '' },
                { label: 'Offset 1', value: 'ring-offset-1' },
                { label: 'Offset 2', value: 'ring-offset-2' },
                { label: 'Offset 4', value: 'ring-offset-4' },
              ]}
            />
          </StyleSection>

          {/* Borders */}
          <StyleSection title="Borders">
            <SelectInput
              label="Border Radius"
              value={state.styles.borderRadius || ''}
              onChange={(value) => updateStyles({ borderRadius: value })}
              options={[{ label: 'Inherit', value: '' }, ...borderRadiusOptions]}
            />
          </StyleSection>

          {/* Cursor */}
          <StyleSection title="Cursor">
            <CursorSelect
              value={state.styles.cursor}
              onChange={(value) => updateStyles({ cursor: value })}
            />
          </StyleSection>

          {/* Transitions */}
          <StyleSection title="Transitions">
            {state.transitions.map((transition, index) => (
              <TransitionEditor
                key={index}
                transition={transition}
                onChange={(t) => updateTransition(index, t)}
              />
            ))}
          </StyleSection>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function StateEditor({
  initialConfig,
  onChange,
  onPreviewState,
}: StateEditorProps) {
  // State
  const [config, setConfig] = useState<InteractionStatesConfig>(
    initialConfig || createDefaultStatesConfig()
  );
  const [activeState, setActiveState] = useState<InteractionStateName>('default');
  const [previewingState, setPreviewingState] = useState<InteractionStateName | null>(null);

  // Memoized values
  const allStateNames = useMemo(() => getAllStateNames(), []);
  const currentState = config[activeState];

  // Handlers
  const handleStateChange = useCallback(
    (state: InteractionStateDefinition) => {
      const newConfig = {
        ...config,
        [activeState]: state,
      };
      setConfig(newConfig);
      onChange(newConfig);
    },
    [config, activeState, onChange]
  );

  const handleCopyFrom = useCallback(
    (fromState: InteractionStateName) => {
      const sourceState = config[fromState];
      const newState: InteractionStateDefinition = {
        ...currentState,
        styles: { ...sourceState.styles },
        transitions: [...sourceState.transitions],
      };
      handleStateChange(newState);
    },
    [config, currentState, handleStateChange]
  );

  const handleReset = useCallback(() => {
    const defaultConfig = createDefaultStatesConfig();
    const resetState = defaultConfig[activeState];
    handleStateChange(resetState);
  }, [activeState, handleStateChange]);

  const handlePreviewState = useCallback(
    (stateName: InteractionStateName | null) => {
      setPreviewingState(stateName);
      onPreviewState?.(stateName);
    },
    [onPreviewState]
  );

  // Generate preview classes
  const previewClasses = useMemo(() => {
    if (!previewingState) return [];
    const state = config[previewingState];
    return stateToTailwindClasses(state);
  }, [config, previewingState]);

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* State Tabs */}
      <div className="border-b border-gray-800 p-2">
        <div className="flex flex-wrap gap-1">
          {allStateNames.slice(0, 5).map((stateName) => (
            <StateTab
              key={stateName}
              state={config[stateName]}
              isActive={activeState === stateName}
              onClick={() => setActiveState(stateName)}
              icon={STATE_ICONS[stateName]}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {allStateNames.slice(5).map((stateName) => (
            <StateTab
              key={stateName}
              state={config[stateName]}
              isActive={activeState === stateName}
              onClick={() => setActiveState(stateName)}
              icon={STATE_ICONS[stateName]}
            />
          ))}
        </div>
      </div>

      {/* State Description */}
      <div className="p-3 border-b border-gray-800 bg-gray-800/30">
        <div className="flex items-center gap-2">
          {(() => {
            const Icon = STATE_ICONS[activeState];
            return <Icon className="w-4 h-4 text-gray-400" />;
          })()}
          <div>
            <div className="text-sm font-medium text-white capitalize">
              {currentState.label}
            </div>
            <div className="text-xs text-gray-500">{currentState.description}</div>
          </div>
        </div>
      </div>

      {/* Live Preview Controls */}
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400">Live Preview</span>
          <div className="flex items-center gap-2">
            {allStateNames.slice(0, 5).map((stateName) => {
              const Icon = STATE_ICONS[stateName];
              const isActive = previewingState === stateName;
              return (
                <button
                  key={stateName}
                  onClick={() => handlePreviewState(isActive ? null : stateName)}
                  onMouseEnter={() => handlePreviewState(stateName)}
                  onMouseLeave={() => handlePreviewState(null)}
                  className={cn(
                    'p-1.5 rounded transition-colors',
                    isActive
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                  )}
                  title={`Preview ${stateName} state`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>
        </div>
        {previewingState && (
          <div className="mt-2 p-2 bg-gray-800/50 rounded text-xs">
            <span className="text-gray-400">Preview classes: </span>
            <span className="text-blue-400">{previewClasses.join(' ') || 'none'}</span>
          </div>
        )}
      </div>

      {/* Style Editor */}
      <div className="flex-1 overflow-y-auto p-4">
        <StateStyleEditor
          state={currentState}
          onChange={handleStateChange}
          onCopyFrom={handleCopyFrom}
          onReset={handleReset}
          availableStates={allStateNames}
        />
      </div>

      {/* Generated Classes Preview */}
      <div className="border-t border-gray-800 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400">Generated Tailwind Classes</span>
          <button
            onClick={() => {
              const classes = [
                ...transitionsToTailwindClasses(config.globalTransitions),
                ...stateToTailwindClasses(config[activeState], activeState === 'default' ? undefined : activeState),
              ];
              navigator.clipboard.writeText(classes.join(' '));
            }}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Copy
          </button>
        </div>
        <code className="block p-2 bg-gray-800 rounded text-xs text-gray-300 break-all">
          {[
            ...transitionsToTailwindClasses(config.globalTransitions),
            ...stateToTailwindClasses(config[activeState], activeState === 'default' ? undefined : activeState),
          ].join(' ') || 'No classes generated'}
        </code>
      </div>
    </div>
  );
}

// ============================================================================
// COMPACT STATE EDITOR (for sidebar integration)
// ============================================================================

export function CompactStateEditor({
  config,
  onChange,
}: {
  elementId?: string;
  config: InteractionStatesConfig;
  onChange: (config: InteractionStatesConfig) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeState, setActiveState] = useState<InteractionStateName>('hover');

  const enabledStatesCount = useMemo(
    () => getAllStateNames().filter((s) => config[s].enabled).length,
    [config]
  );

  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'w-full flex items-center justify-between p-3',
          'bg-gray-800/50 hover:bg-gray-800',
          'transition-colors'
        )}
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-white">Interaction States</span>
          <span className="text-xs text-gray-500">({enabledStatesCount} enabled)</span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-400 transition-transform',
            expanded && 'rotate-180'
          )}
        />
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-3 border-t border-gray-800 space-y-3">
          {/* Quick State Toggles */}
          <div className="flex flex-wrap gap-2">
            {getAllStateNames().map((stateName) => {
              const Icon = STATE_ICONS[stateName];
              const isEnabled = config[stateName].enabled;
              return (
                <button
                  key={stateName}
                  onClick={() => {
                    const newConfig = {
                      ...config,
                      [stateName]: {
                        ...config[stateName],
                        enabled: !isEnabled,
                      },
                    };
                    onChange(newConfig);
                  }}
                  className={cn(
                    'flex items-center gap-1.5 px-2 py-1 rounded text-xs',
                    'transition-colors',
                    isEnabled
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-gray-800 text-gray-500 border border-gray-700 hover:border-gray-600'
                  )}
                >
                  <Icon className="w-3 h-3" />
                  <span className="capitalize">{stateName}</span>
                </button>
              );
            })}
          </div>

          {/* State selector for editing */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400">Edit:</label>
            <select
              value={activeState}
              onChange={(e) => setActiveState(e.target.value as InteractionStateName)}
              className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {getAllStateNames().map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName.charAt(0).toUpperCase() + stateName.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Quick style controls for active state */}
          <div className="space-y-2">
            <ColorPicker
              label={`${activeState} Background`}
              value={config[activeState].styles.backgroundColor || ''}
              onChange={(value) => {
                const newConfig = {
                  ...config,
                  [activeState]: {
                    ...config[activeState],
                    styles: {
                      ...config[activeState].styles,
                      backgroundColor: value,
                    },
                  },
                };
                onChange(newConfig);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default StateEditor;
