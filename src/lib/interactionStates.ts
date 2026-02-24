/**
 * Interaction States Library
 *
 * Defines all interaction states for UI elements with their
 * default styles, transitions, and TypeScript types.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * All possible interaction state names
 */
export type InteractionStateName =
  | 'default'
  | 'hover'
  | 'focus'
  | 'active'
  | 'disabled'
  | 'loading'
  | 'error'
  | 'success'
  | 'selected'
  | 'dragging';

/**
 * CSS transition timing function types
 */
export type TimingFunction =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | `cubic-bezier(${number}, ${number}, ${number}, ${number})`;

/**
 * Transition duration in milliseconds
 */
export type TransitionDuration = number;

/**
 * Individual style property for a state
 */
export interface StateStyleProperty {
  value: string;
  tailwindClass: string;
  cssProperty: string;
}

/**
 * Style overrides for a single interaction state
 */
export interface StateStyles {
  // Colors
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;

  // Effects
  opacity?: number;
  shadow?: string;
  transform?: string;
  scale?: number;

  // Layout
  outline?: string;
  outlineOffset?: string;
  ring?: string;
  ringColor?: string;
  ringOffset?: string;

  // Borders
  borderWidth?: string;
  borderRadius?: string;

  // Cursor
  cursor?: string;

  // Custom Tailwind classes
  customClasses?: string[];
}

/**
 * Transition configuration for a state change
 */
export interface StateTransition {
  property: string | 'all';
  duration: TransitionDuration;
  timing: TimingFunction;
  delay?: TransitionDuration;
}

/**
 * Complete definition of an interaction state
 */
export interface InteractionStateDefinition {
  name: InteractionStateName;
  label: string;
  description: string;
  pseudoClass?: string;
  styles: StateStyles;
  transitions: StateTransition[];
  enabled: boolean;
}

/**
 * Complete interaction states configuration for an element
 */
export interface InteractionStatesConfig {
  default: InteractionStateDefinition;
  hover: InteractionStateDefinition;
  focus: InteractionStateDefinition;
  active: InteractionStateDefinition;
  disabled: InteractionStateDefinition;
  loading: InteractionStateDefinition;
  error: InteractionStateDefinition;
  success: InteractionStateDefinition;
  selected: InteractionStateDefinition;
  dragging: InteractionStateDefinition;
  globalTransitions: StateTransition[];
}

/**
 * Element-specific state preset
 */
export interface StatePreset {
  name: string;
  description: string;
  elementTypes: string[];
  states: Partial<InteractionStatesConfig>;
}

// ============================================================================
// TRANSITION PRESETS
// ============================================================================

export const TRANSITION_DURATIONS = {
  instant: 0,
  fast: 75,
  normal: 150,
  slow: 300,
  verySlow: 500,
} as const;

export const TIMING_FUNCTIONS: Record<string, TimingFunction> = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  overshoot: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

export const DEFAULT_TRANSITION: StateTransition = {
  property: 'all',
  duration: TRANSITION_DURATIONS.normal,
  timing: TIMING_FUNCTIONS.smooth,
};

// ============================================================================
// DEFAULT STATE DEFINITIONS
// ============================================================================

/**
 * Default state - base appearance with no interactions
 */
export const DEFAULT_STATE: InteractionStateDefinition = {
  name: 'default',
  label: 'Default',
  description: 'Base state with no user interaction',
  styles: {
    opacity: 1,
    cursor: 'default',
  },
  transitions: [DEFAULT_TRANSITION],
  enabled: true,
};

/**
 * Hover state - mouse pointer over element
 */
export const HOVER_STATE: InteractionStateDefinition = {
  name: 'hover',
  label: 'Hover',
  description: 'Mouse pointer is over the element',
  pseudoClass: ':hover',
  styles: {
    opacity: 0.9,
    cursor: 'pointer',
    shadow: 'shadow-md',
    scale: 1.02,
  },
  transitions: [
    {
      property: 'all',
      duration: TRANSITION_DURATIONS.normal,
      timing: TIMING_FUNCTIONS.easeOut,
    },
  ],
  enabled: true,
};

/**
 * Focus state - element has keyboard focus
 */
export const FOCUS_STATE: InteractionStateDefinition = {
  name: 'focus',
  label: 'Focus',
  description: 'Element has keyboard focus',
  pseudoClass: ':focus',
  styles: {
    outline: 'none',
    ring: 'ring-2',
    ringColor: 'ring-blue-500',
    ringOffset: 'ring-offset-2',
  },
  transitions: [
    {
      property: 'box-shadow',
      duration: TRANSITION_DURATIONS.fast,
      timing: TIMING_FUNCTIONS.easeOut,
    },
  ],
  enabled: true,
};

/**
 * Active/Pressed state - element is being clicked/tapped
 */
export const ACTIVE_STATE: InteractionStateDefinition = {
  name: 'active',
  label: 'Active',
  description: 'Element is being pressed or clicked',
  pseudoClass: ':active',
  styles: {
    scale: 0.98,
    shadow: 'shadow-sm',
    opacity: 0.95,
  },
  transitions: [
    {
      property: 'transform',
      duration: TRANSITION_DURATIONS.fast,
      timing: TIMING_FUNCTIONS.easeIn,
    },
  ],
  enabled: true,
};

/**
 * Disabled state - element is not interactive
 */
export const DISABLED_STATE: InteractionStateDefinition = {
  name: 'disabled',
  label: 'Disabled',
  description: 'Element is disabled and not interactive',
  pseudoClass: ':disabled',
  styles: {
    opacity: 0.5,
    cursor: 'not-allowed',
    backgroundColor: 'bg-gray-200',
    textColor: 'text-gray-400',
  },
  transitions: [DEFAULT_TRANSITION],
  enabled: true,
};

/**
 * Loading state - element is in loading/pending state
 */
export const LOADING_STATE: InteractionStateDefinition = {
  name: 'loading',
  label: 'Loading',
  description: 'Element is loading or processing',
  styles: {
    opacity: 0.7,
    cursor: 'wait',
    customClasses: ['animate-pulse'],
  },
  transitions: [DEFAULT_TRANSITION],
  enabled: true,
};

/**
 * Error state - element has an error
 */
export const ERROR_STATE: InteractionStateDefinition = {
  name: 'error',
  label: 'Error',
  description: 'Element has an error or invalid state',
  styles: {
    borderColor: 'border-red-500',
    ring: 'ring-2',
    ringColor: 'ring-red-500/20',
    textColor: 'text-red-500',
    customClasses: ['animate-shake'],
  },
  transitions: [
    {
      property: 'all',
      duration: TRANSITION_DURATIONS.fast,
      timing: TIMING_FUNCTIONS.easeOut,
    },
  ],
  enabled: true,
};

/**
 * Success state - element action completed successfully
 */
export const SUCCESS_STATE: InteractionStateDefinition = {
  name: 'success',
  label: 'Success',
  description: 'Element action completed successfully',
  styles: {
    borderColor: 'border-green-500',
    ring: 'ring-2',
    ringColor: 'ring-green-500/20',
    textColor: 'text-green-500',
  },
  transitions: [
    {
      property: 'all',
      duration: TRANSITION_DURATIONS.normal,
      timing: TIMING_FUNCTIONS.easeOut,
    },
  ],
  enabled: true,
};

/**
 * Selected state - element is selected in a group
 */
export const SELECTED_STATE: InteractionStateDefinition = {
  name: 'selected',
  label: 'Selected',
  description: 'Element is selected or checked',
  styles: {
    backgroundColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    ring: 'ring-2',
    ringColor: 'ring-blue-500/30',
  },
  transitions: [DEFAULT_TRANSITION],
  enabled: true,
};

/**
 * Dragging state - element is being dragged
 */
export const DRAGGING_STATE: InteractionStateDefinition = {
  name: 'dragging',
  label: 'Dragging',
  description: 'Element is being dragged',
  styles: {
    opacity: 0.8,
    shadow: 'shadow-2xl',
    scale: 1.05,
    cursor: 'grabbing',
    customClasses: ['rotate-2'],
  },
  transitions: [
    {
      property: 'transform, box-shadow',
      duration: TRANSITION_DURATIONS.fast,
      timing: TIMING_FUNCTIONS.easeOut,
    },
  ],
  enabled: true,
};

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

/**
 * Creates a default interaction states configuration
 */
export function createDefaultStatesConfig(): InteractionStatesConfig {
  return {
    default: { ...DEFAULT_STATE },
    hover: { ...HOVER_STATE },
    focus: { ...FOCUS_STATE },
    active: { ...ACTIVE_STATE },
    disabled: { ...DISABLED_STATE },
    loading: { ...LOADING_STATE },
    error: { ...ERROR_STATE },
    success: { ...SUCCESS_STATE },
    selected: { ...SELECTED_STATE },
    dragging: { ...DRAGGING_STATE },
    globalTransitions: [DEFAULT_TRANSITION],
  };
}

// ============================================================================
// STATE PRESETS BY ELEMENT TYPE
// ============================================================================

export const BUTTON_STATE_PRESET: StatePreset = {
  name: 'Button States',
  description: 'Optimized interaction states for buttons',
  elementTypes: ['button', 'primary-button', 'secondary-button', 'outline-button', 'ghost-button'],
  states: {
    hover: {
      ...HOVER_STATE,
      styles: {
        ...HOVER_STATE.styles,
        transform: 'translateY(-1px)',
        shadow: 'shadow-lg',
      },
    },
    active: {
      ...ACTIVE_STATE,
      styles: {
        ...ACTIVE_STATE.styles,
        transform: 'translateY(1px)',
        scale: 0.98,
      },
    },
    disabled: {
      ...DISABLED_STATE,
      styles: {
        ...DISABLED_STATE.styles,
        backgroundColor: 'bg-gray-300',
        textColor: 'text-gray-500',
        shadow: 'shadow-none',
      },
    },
  },
};

export const INPUT_STATE_PRESET: StatePreset = {
  name: 'Input States',
  description: 'Optimized interaction states for form inputs',
  elementTypes: ['input', 'input-field', 'textarea', 'select'],
  states: {
    hover: {
      ...HOVER_STATE,
      styles: {
        borderColor: 'border-gray-400',
        scale: 1,
      },
    },
    focus: {
      ...FOCUS_STATE,
      styles: {
        borderColor: 'border-blue-500',
        ring: 'ring-4',
        ringColor: 'ring-blue-500/20',
        outline: 'none',
      },
    },
    error: {
      ...ERROR_STATE,
      styles: {
        borderColor: 'border-red-500',
        backgroundColor: 'bg-red-50',
        ring: 'ring-4',
        ringColor: 'ring-red-500/20',
      },
    },
    disabled: {
      ...DISABLED_STATE,
      styles: {
        backgroundColor: 'bg-gray-100',
        textColor: 'text-gray-400',
        cursor: 'not-allowed',
      },
    },
  },
};

export const CARD_STATE_PRESET: StatePreset = {
  name: 'Card States',
  description: 'Optimized interaction states for cards',
  elementTypes: ['card', 'simple-card', 'product-card', 'blog-card'],
  states: {
    hover: {
      ...HOVER_STATE,
      styles: {
        shadow: 'shadow-xl',
        transform: 'translateY(-4px)',
        scale: 1,
      },
    },
    active: {
      ...ACTIVE_STATE,
      styles: {
        shadow: 'shadow-md',
        transform: 'translateY(-2px)',
      },
    },
    selected: {
      ...SELECTED_STATE,
      styles: {
        borderColor: 'border-blue-500',
        borderWidth: 'border-2',
        shadow: 'shadow-lg',
      },
    },
  },
};

export const LINK_STATE_PRESET: StatePreset = {
  name: 'Link States',
  description: 'Optimized interaction states for links',
  elementTypes: ['link', 'nav-link'],
  states: {
    hover: {
      ...HOVER_STATE,
      styles: {
        textColor: 'text-blue-600',
        customClasses: ['underline'],
        scale: 1,
      },
    },
    focus: {
      ...FOCUS_STATE,
      styles: {
        ring: 'ring-2',
        ringColor: 'ring-blue-500',
        ringOffset: 'ring-offset-1',
      },
    },
    active: {
      ...ACTIVE_STATE,
      styles: {
        textColor: 'text-blue-800',
        scale: 1,
      },
    },
  },
};

export const CHECKBOX_STATE_PRESET: StatePreset = {
  name: 'Checkbox States',
  description: 'Optimized interaction states for checkboxes',
  elementTypes: ['checkbox', 'toggle'],
  states: {
    hover: {
      ...HOVER_STATE,
      styles: {
        borderColor: 'border-blue-400',
        scale: 1.05,
      },
    },
    focus: {
      ...FOCUS_STATE,
      styles: {
        ring: 'ring-2',
        ringColor: 'ring-blue-500/50',
      },
    },
    selected: {
      ...SELECTED_STATE,
      styles: {
        backgroundColor: 'bg-blue-500',
        borderColor: 'border-blue-500',
        textColor: 'text-white',
      },
    },
  },
};

// ============================================================================
// STATE PRESET REGISTRY
// ============================================================================

export const STATE_PRESETS: StatePreset[] = [
  BUTTON_STATE_PRESET,
  INPUT_STATE_PRESET,
  CARD_STATE_PRESET,
  LINK_STATE_PRESET,
  CHECKBOX_STATE_PRESET,
];

/**
 * Get the appropriate state preset for an element type
 */
export function getStatePresetForElement(elementType: string): StatePreset | null {
  const preset = STATE_PRESETS.find((p) =>
    p.elementTypes.some((type) => elementType.toLowerCase().includes(type.toLowerCase()))
  );
  return preset || null;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Merge state styles with base styles
 */
export function mergeStateStyles(base: StateStyles, override: Partial<StateStyles>): StateStyles {
  return {
    ...base,
    ...override,
    customClasses: [
      ...(base.customClasses || []),
      ...(override.customClasses || []),
    ],
  };
}

/**
 * Convert state definition to Tailwind classes
 */
export function stateToTailwindClasses(
  state: InteractionStateDefinition,
  prefix?: string
): string[] {
  const classes: string[] = [];
  const { styles } = state;
  const p = prefix ? `${prefix}:` : '';

  if (styles.backgroundColor) classes.push(`${p}${styles.backgroundColor}`);
  if (styles.textColor) classes.push(`${p}${styles.textColor}`);
  if (styles.borderColor) classes.push(`${p}${styles.borderColor}`);
  if (styles.borderWidth) classes.push(`${p}${styles.borderWidth}`);
  if (styles.borderRadius) classes.push(`${p}${styles.borderRadius}`);
  if (styles.shadow) classes.push(`${p}${styles.shadow}`);
  if (styles.ring) classes.push(`${p}${styles.ring}`);
  if (styles.ringColor) classes.push(`${p}${styles.ringColor}`);
  if (styles.ringOffset) classes.push(`${p}${styles.ringOffset}`);
  if (styles.outline) classes.push(`${p}outline-${styles.outline}`);
  if (styles.outlineOffset) classes.push(`${p}outline-offset-${styles.outlineOffset}`);

  if (styles.opacity !== undefined) {
    classes.push(`${p}opacity-${Math.round(styles.opacity * 100)}`);
  }

  if (styles.scale !== undefined && styles.scale !== 1) {
    const scaleValue = Math.round(styles.scale * 100);
    classes.push(`${p}scale-${scaleValue}`);
  }

  if (styles.cursor) {
    classes.push(`${p}cursor-${styles.cursor}`);
  }

  if (styles.customClasses) {
    classes.push(...styles.customClasses.map((c) => `${p}${c}`));
  }

  return classes;
}

/**
 * Convert transitions to Tailwind transition classes
 */
export function transitionsToTailwindClasses(transitions: StateTransition[]): string[] {
  const classes: string[] = [];

  for (const t of transitions) {
    // Property
    if (t.property === 'all') {
      classes.push('transition-all');
    } else if (t.property.includes(',')) {
      classes.push('transition');
    } else {
      const propMap: Record<string, string> = {
        'transform': 'transition-transform',
        'opacity': 'transition-opacity',
        'colors': 'transition-colors',
        'shadow': 'transition-shadow',
        'box-shadow': 'transition-shadow',
      };
      classes.push(propMap[t.property] || 'transition');
    }

    // Duration
    const durationMap: Record<number, string> = {
      0: 'duration-0',
      75: 'duration-75',
      100: 'duration-100',
      150: 'duration-150',
      200: 'duration-200',
      300: 'duration-300',
      500: 'duration-500',
      700: 'duration-700',
      1000: 'duration-1000',
    };
    classes.push(durationMap[t.duration] || `duration-[${t.duration}ms]`);

    // Timing
    const timingMap: Record<string, string> = {
      'linear': 'ease-linear',
      'ease': 'ease',
      'ease-in': 'ease-in',
      'ease-out': 'ease-out',
      'ease-in-out': 'ease-in-out',
    };
    if (timingMap[t.timing]) {
      classes.push(timingMap[t.timing]);
    }

    // Delay
    if (t.delay) {
      classes.push(`delay-${t.delay}`);
    }
  }

  return classes;
}

/**
 * Generate complete Tailwind classes for an element with all states
 */
export function generateInteractionClasses(config: InteractionStatesConfig): string[] {
  const classes: string[] = [];

  // Global transitions
  classes.push(...transitionsToTailwindClasses(config.globalTransitions));

  // Default state (no prefix)
  if (config.default.enabled) {
    classes.push(...stateToTailwindClasses(config.default));
  }

  // Hover state
  if (config.hover.enabled) {
    classes.push(...stateToTailwindClasses(config.hover, 'hover'));
  }

  // Focus state
  if (config.focus.enabled) {
    classes.push(...stateToTailwindClasses(config.focus, 'focus'));
  }

  // Active state
  if (config.active.enabled) {
    classes.push(...stateToTailwindClasses(config.active, 'active'));
  }

  // Disabled state
  if (config.disabled.enabled) {
    classes.push(...stateToTailwindClasses(config.disabled, 'disabled'));
  }

  return classes;
}

/**
 * Parse Tailwind classes to extract state styles
 */
export function parseTailwindStateClasses(classes: string[]): Partial<InteractionStatesConfig> {
  const config: Partial<InteractionStatesConfig> = {};

  const stateMap: Record<string, InteractionStateName> = {
    'hover': 'hover',
    'focus': 'focus',
    'active': 'active',
    'disabled': 'disabled',
    'focus-visible': 'focus',
    'focus-within': 'focus',
  };

  for (const cls of classes) {
    const [prefix, ...rest] = cls.split(':');

    if (rest.length > 0 && stateMap[prefix]) {
      const stateName = stateMap[prefix];
      const actualClass = rest.join(':');

      // Initialize state if not exists
      if (!config[stateName]) {
        config[stateName] = createDefaultStatesConfig()[stateName];
      }

      // Add class to state customClasses
      const state = config[stateName];
      if (state && state.styles) {
        state.styles.customClasses = state.styles.customClasses || [];
        state.styles.customClasses.push(actualClass);
      }
    }
  }

  return config;
}

/**
 * Validate state configuration
 */
export function validateStatesConfig(config: InteractionStatesConfig): string[] {
  const errors: string[] = [];

  const states: InteractionStateName[] = [
    'default', 'hover', 'focus', 'active', 'disabled',
    'loading', 'error', 'success', 'selected', 'dragging'
  ];

  for (const stateName of states) {
    const state = config[stateName];
    if (!state) {
      errors.push(`Missing state definition: ${stateName}`);
      continue;
    }

    if (!state.name) {
      errors.push(`State ${stateName} missing name property`);
    }

    if (!state.styles) {
      errors.push(`State ${stateName} missing styles property`);
    }

    if (!state.transitions || !Array.isArray(state.transitions)) {
      errors.push(`State ${stateName} missing or invalid transitions`);
    }
  }

  return errors;
}

/**
 * Clone a states configuration
 */
export function cloneStatesConfig(config: InteractionStatesConfig): InteractionStatesConfig {
  return JSON.parse(JSON.stringify(config));
}

/**
 * Get all state names
 */
export function getAllStateNames(): InteractionStateName[] {
  return [
    'default',
    'hover',
    'focus',
    'active',
    'disabled',
    'loading',
    'error',
    'success',
    'selected',
    'dragging',
  ];
}

/**
 * Get states that have CSS pseudo-classes
 */
export function getPseudoClassStates(): InteractionStateName[] {
  return ['hover', 'focus', 'active', 'disabled'];
}

/**
 * Get programmatic states (controlled via JS)
 */
export function getProgrammaticStates(): InteractionStateName[] {
  return ['loading', 'error', 'success', 'selected', 'dragging'];
}
