/**
 * Color Blindness Simulator Plugin
 *
 * This plugin simulates different types of color blindness to help designers
 * ensure their designs are accessible to users with color vision deficiencies.
 */

import { Plugin, PluginAPI } from '../pluginSystem';

// ============================================================================
// COLOR BLINDNESS SIMULATION MATRICES
// ============================================================================

/**
 * Color transformation matrices for different types of color blindness.
 * These matrices are applied as CSS filters using SVG filters.
 */
const COLOR_BLINDNESS_FILTERS = {
  protanopia: {
    name: 'Protanopia',
    description: 'Red-blind (1% of males)',
    matrix: [
      0.567, 0.433, 0, 0, 0,
      0.558, 0.442, 0, 0, 0,
      0, 0.242, 0.758, 0, 0,
      0, 0, 0, 1, 0,
    ],
  },
  deuteranopia: {
    name: 'Deuteranopia',
    description: 'Green-blind (1% of males)',
    matrix: [
      0.625, 0.375, 0, 0, 0,
      0.7, 0.3, 0, 0, 0,
      0, 0.3, 0.7, 0, 0,
      0, 0, 0, 1, 0,
    ],
  },
  tritanopia: {
    name: 'Tritanopia',
    description: 'Blue-blind (rare)',
    matrix: [
      0.95, 0.05, 0, 0, 0,
      0, 0.433, 0.567, 0, 0,
      0, 0.475, 0.525, 0, 0,
      0, 0, 0, 1, 0,
    ],
  },
  protanomaly: {
    name: 'Protanomaly',
    description: 'Red-weak (1% of males)',
    matrix: [
      0.817, 0.183, 0, 0, 0,
      0.333, 0.667, 0, 0, 0,
      0, 0.125, 0.875, 0, 0,
      0, 0, 0, 1, 0,
    ],
  },
  deuteranomaly: {
    name: 'Deuteranomaly',
    description: 'Green-weak (5% of males)',
    matrix: [
      0.8, 0.2, 0, 0, 0,
      0.258, 0.742, 0, 0, 0,
      0, 0.142, 0.858, 0, 0,
      0, 0, 0, 1, 0,
    ],
  },
  tritanomaly: {
    name: 'Tritanomaly',
    description: 'Blue-weak (rare)',
    matrix: [
      0.967, 0.033, 0, 0, 0,
      0, 0.733, 0.267, 0, 0,
      0, 0.183, 0.817, 0, 0,
      0, 0, 0, 1, 0,
    ],
  },
  achromatopsia: {
    name: 'Achromatopsia',
    description: 'Complete color blindness (rare)',
    matrix: [
      0.299, 0.587, 0.114, 0, 0,
      0.299, 0.587, 0.114, 0, 0,
      0.299, 0.587, 0.114, 0, 0,
      0, 0, 0, 1, 0,
    ],
  },
};

type ColorBlindnessType = keyof typeof COLOR_BLINDNESS_FILTERS | 'none';

// ============================================================================
// PLUGIN STATE
// ============================================================================

let currentFilter: ColorBlindnessType = 'none';
let svgFilterElement: SVGSVGElement | null = null;
let styleElement: HTMLStyleElement | null = null;
let pluginApiRef: PluginAPI | null = null;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create SVG filter element for color transformation
 */
function createSVGFilter(filterType: ColorBlindnessType): SVGSVGElement | null {
  if (filterType === 'none') return null;

  const filter = COLOR_BLINDNESS_FILTERS[filterType];
  if (!filter) return null;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('id', 'color-blindness-filter-svg');
  svg.setAttribute('style', 'position: absolute; width: 0; height: 0;');

  svg.innerHTML = `
    <defs>
      <filter id="color-blindness-filter" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values="${filter.matrix.join(' ')}" />
      </filter>
    </defs>
  `;

  return svg;
}

/**
 * Apply color blindness filter to canvas
 */
function applyFilter(filterType: ColorBlindnessType): void {
  // Remove existing filter
  removeFilter();

  if (filterType === 'none') {
    currentFilter = 'none';
    return;
  }

  // Create and add SVG filter
  svgFilterElement = createSVGFilter(filterType);
  if (svgFilterElement) {
    document.body.appendChild(svgFilterElement);
  }

  // Create style to apply filter to canvas
  styleElement = document.createElement('style');
  styleElement.id = 'color-blindness-filter-style';
  styleElement.textContent = `
    [data-canvas-wrapper] {
      filter: url(#color-blindness-filter) !important;
    }
  `;
  document.head.appendChild(styleElement);

  currentFilter = filterType;
}

/**
 * Remove color blindness filter
 */
function removeFilter(): void {
  if (svgFilterElement) {
    svgFilterElement.remove();
    svgFilterElement = null;
  }

  if (styleElement) {
    styleElement.remove();
    styleElement = null;
  }
}

/**
 * Cycle through color blindness modes
 */
function cycleFilter(): void {
  const types: ColorBlindnessType[] = [
    'none',
    'protanopia',
    'deuteranopia',
    'tritanopia',
    'protanomaly',
    'deuteranomaly',
    'tritanomaly',
    'achromatopsia',
  ];

  const currentIndex = types.indexOf(currentFilter);
  const nextIndex = (currentIndex + 1) % types.length;
  const nextFilter = types[nextIndex];

  applyFilter(nextFilter);

  if (pluginApiRef) {
    if (nextFilter === 'none') {
      pluginApiRef.showNotification({
        type: 'info',
        message: 'Color blindness simulation disabled',
      });
    } else {
      const filterInfo = COLOR_BLINDNESS_FILTERS[nextFilter];
      pluginApiRef.showNotification({
        type: 'info',
        message: `Simulating: ${filterInfo.name}`,
        description: filterInfo.description,
      });
    }
  }
}

// ============================================================================
// PLUGIN DEFINITION
// ============================================================================

export const colorBlindnessPlugin: Plugin = {
  metadata: {
    id: 'builtin:color-blindness',
    name: 'Color Blindness Simulator',
    version: '1.0.0',
    description: 'Simulate different types of color blindness to test accessibility',
    author: 'Tailwind Builder',
    category: 'accessibility',
    tags: ['accessibility', 'color', 'vision', 'a11y'],
    icon: 'eye',
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
        key: 'defaultMode',
        label: 'Default Simulation Mode',
        type: 'select',
        defaultValue: 'none',
        description: 'The color blindness type to apply on plugin activation',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Protanopia (Red-blind)', value: 'protanopia' },
          { label: 'Deuteranopia (Green-blind)', value: 'deuteranopia' },
          { label: 'Tritanopia (Blue-blind)', value: 'tritanopia' },
          { label: 'Protanomaly (Red-weak)', value: 'protanomaly' },
          { label: 'Deuteranomaly (Green-weak)', value: 'deuteranomaly' },
          { label: 'Tritanomaly (Blue-weak)', value: 'tritanomaly' },
          { label: 'Achromatopsia (Monochrome)', value: 'achromatopsia' },
        ],
      },
      {
        key: 'showIndicator',
        label: 'Show Active Filter Indicator',
        type: 'boolean',
        defaultValue: true,
        description: 'Display a badge when a color blindness filter is active',
      },
    ],
  },

  activate: (api: PluginAPI) => {
    pluginApiRef = api;

    // Get saved or default mode
    const settings = api.getSettings();
    const defaultMode = (settings.defaultMode as ColorBlindnessType) || 'none';

    // Restore last used filter from storage
    const lastFilter = api.getStorage<ColorBlindnessType>('lastFilter');
    applyFilter(lastFilter || defaultMode);

    // Add toolbar button
    api.addToolbarButton({
      id: 'color-blindness-toggle',
      icon: 'eye',
      label: 'Color Blindness',
      tooltip: 'Toggle color blindness simulation (Ctrl+Shift+B)',
      onClick: cycleFilter,
      isActive: () => currentFilter !== 'none',
    });

    // Add keyboard shortcut
    api.addKeyboardShortcut({
      id: 'color-blindness-cycle',
      keys: 'ctrl+shift+b',
      description: 'Cycle through color blindness simulation modes',
      handler: cycleFilter,
    });

    api.log('Color Blindness Simulator activated');

    if (currentFilter !== 'none') {
      const filterInfo = COLOR_BLINDNESS_FILTERS[currentFilter];
      api.showNotification({
        type: 'info',
        message: `Color Blindness: ${filterInfo.name}`,
        description: 'Press Ctrl+Shift+B to cycle modes',
      });
    }
  },

  deactivate: (api: PluginAPI) => {
    // Save current filter for next activation
    api.setStorage('lastFilter', currentFilter);

    // Remove filter
    removeFilter();

    // Clean up UI
    api.removeToolbarButton('color-blindness-toggle');
    api.removeKeyboardShortcut('color-blindness-cycle');

    pluginApiRef = null;
    api.log('Color Blindness Simulator deactivated');
  },

  onSettingsChange: (settings: Record<string, unknown>) => {
    // If default mode changes while plugin is active, don't auto-apply
    // User can manually cycle to the new default
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

export { COLOR_BLINDNESS_FILTERS, type ColorBlindnessType };
export default colorBlindnessPlugin;
