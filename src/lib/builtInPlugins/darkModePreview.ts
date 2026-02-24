/**
 * Dark Mode Preview Plugin
 *
 * This plugin allows previewing how designs look in dark mode,
 * even when using light mode Tailwind classes.
 */

import { Plugin, PluginAPI } from '../pluginSystem';

// ============================================================================
// TYPES
// ============================================================================

type PreviewMode = 'light' | 'dark' | 'system';

// ============================================================================
// PLUGIN STATE
// ============================================================================

let currentMode: PreviewMode = 'light';
let styleElement: HTMLStyleElement | null = null;
let pluginApiRef: PluginAPI | null = null;
let systemDarkModeQuery: MediaQueryList | null = null;
let systemModeListener: ((e: MediaQueryListEvent) => void) | null = null;

// ============================================================================
// DARK MODE STYLES
// ============================================================================

const DARK_MODE_OVERRIDES = `
  [data-canvas-wrapper][data-dark-mode="true"] {
    --tw-bg-opacity: 1;
    background-color: rgb(17 24 39 / var(--tw-bg-opacity)) !important;
  }

  [data-canvas-wrapper][data-dark-mode="true"] .bg-white {
    background-color: rgb(31 41 55) !important;
  }

  [data-canvas-wrapper][data-dark-mode="true"] .bg-gray-50 {
    background-color: rgb(17 24 39) !important;
  }

  [data-canvas-wrapper][data-dark-mode="true"] .bg-gray-100 {
    background-color: rgb(31 41 55) !important;
  }

  [data-canvas-wrapper][data-dark-mode="true"] .bg-gray-200 {
    background-color: rgb(55 65 81) !important;
  }

  [data-canvas-wrapper][data-dark-mode="true"] .text-black,
  [data-canvas-wrapper][data-dark-mode="true"] .text-gray-900 {
    color: rgb(243 244 246) !important;
  }

  [data-canvas-wrapper][data-dark-mode="true"] .text-gray-800 {
    color: rgb(229 231 235) !important;
  }

  [data-canvas-wrapper][data-dark-mode="true"] .text-gray-700 {
    color: rgb(209 213 219) !important;
  }

  [data-canvas-wrapper][data-dark-mode="true"] .text-gray-600 {
    color: rgb(156 163 175) !important;
  }

  [data-canvas-wrapper][data-dark-mode="true"] .text-gray-500 {
    color: rgb(107 114 128) !important;
  }

  [data-canvas-wrapper][data-dark-mode="true"] .border-gray-200,
  [data-canvas-wrapper][data-dark-mode="true"] .border-gray-300 {
    border-color: rgb(55 65 81) !important;
  }

  [data-canvas-wrapper][data-dark-mode="true"] .divide-gray-200 > :not([hidden]) ~ :not([hidden]),
  [data-canvas-wrapper][data-dark-mode="true"] .divide-gray-300 > :not([hidden]) ~ :not([hidden]) {
    border-color: rgb(55 65 81) !important;
  }

  [data-canvas-wrapper][data-dark-mode="true"] .shadow-sm,
  [data-canvas-wrapper][data-dark-mode="true"] .shadow,
  [data-canvas-wrapper][data-dark-mode="true"] .shadow-md,
  [data-canvas-wrapper][data-dark-mode="true"] .shadow-lg,
  [data-canvas-wrapper][data-dark-mode="true"] .shadow-xl {
    --tw-shadow-color: rgb(0 0 0 / 0.5);
  }

  [data-canvas-wrapper][data-dark-mode="true"] input,
  [data-canvas-wrapper][data-dark-mode="true"] textarea,
  [data-canvas-wrapper][data-dark-mode="true"] select {
    background-color: rgb(31 41 55) !important;
    border-color: rgb(55 65 81) !important;
    color: rgb(243 244 246) !important;
  }

  [data-canvas-wrapper][data-dark-mode="true"] input::placeholder,
  [data-canvas-wrapper][data-dark-mode="true"] textarea::placeholder {
    color: rgb(107 114 128) !important;
  }

  /* Invert light images for dark mode */
  [data-canvas-wrapper][data-dark-mode="true"] img[src*="placeholder"] {
    filter: brightness(0.8) contrast(1.1);
  }
`;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Apply dark mode to canvas
 */
function applyDarkMode(enabled: boolean): void {
  const canvasWrapper = document.querySelector('[data-canvas-wrapper]');
  if (canvasWrapper) {
    if (enabled) {
      canvasWrapper.setAttribute('data-dark-mode', 'true');
    } else {
      canvasWrapper.removeAttribute('data-dark-mode');
    }
  }
}

/**
 * Create style element for dark mode overrides
 */
function createStyleElement(): HTMLStyleElement {
  const style = document.createElement('style');
  style.id = 'dark-mode-preview-styles';
  style.textContent = DARK_MODE_OVERRIDES;
  return style;
}

/**
 * Get system dark mode preference
 */
function getSystemDarkMode(): boolean {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

/**
 * Set preview mode
 */
function setMode(mode: PreviewMode): void {
  currentMode = mode;

  switch (mode) {
    case 'dark':
      applyDarkMode(true);
      break;
    case 'light':
      applyDarkMode(false);
      break;
    case 'system':
      applyDarkMode(getSystemDarkMode());
      break;
  }

  // Save to storage
  if (pluginApiRef) {
    pluginApiRef.setStorage('previewMode', mode);
  }
}

/**
 * Toggle between light and dark mode
 */
function toggleMode(): void {
  const newMode: PreviewMode = currentMode === 'dark' ? 'light' : 'dark';
  setMode(newMode);

  if (pluginApiRef) {
    pluginApiRef.showNotification({
      type: 'info',
      message: `Preview: ${newMode === 'dark' ? 'Dark' : 'Light'} Mode`,
      duration: 2000,
    });
  }
}

/**
 * Cycle through all modes
 */
function cycleMode(): void {
  const modes: PreviewMode[] = ['light', 'dark', 'system'];
  const currentIndex = modes.indexOf(currentMode);
  const nextIndex = (currentIndex + 1) % modes.length;
  const nextMode = modes[nextIndex];

  setMode(nextMode);

  if (pluginApiRef) {
    const modeLabels: Record<PreviewMode, string> = {
      light: 'Light Mode',
      dark: 'Dark Mode',
      system: 'System Preference',
    };

    pluginApiRef.showNotification({
      type: 'info',
      message: `Preview: ${modeLabels[nextMode]}`,
      duration: 2000,
    });
  }
}

// ============================================================================
// PLUGIN DEFINITION
// ============================================================================

export const darkModePreviewPlugin: Plugin = {
  metadata: {
    id: 'builtin:dark-mode-preview',
    name: 'Dark Mode Preview',
    version: '1.0.0',
    description: 'Preview how your designs look in dark mode',
    author: 'Tailwind Builder',
    category: 'design',
    tags: ['dark-mode', 'theme', 'preview', 'accessibility'],
    icon: 'moon',
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
        label: 'Default Preview Mode',
        type: 'select',
        defaultValue: 'light',
        description: 'The mode to use when the plugin activates',
        options: [
          { label: 'Light Mode', value: 'light' },
          { label: 'Dark Mode', value: 'dark' },
          { label: 'System Preference', value: 'system' },
        ],
      },
      {
        key: 'autoSwitch',
        label: 'Auto-switch with System',
        type: 'boolean',
        defaultValue: false,
        description: 'Automatically switch when system preference changes',
      },
      {
        key: 'invertImages',
        label: 'Adjust Images for Dark Mode',
        type: 'boolean',
        defaultValue: true,
        description: 'Slightly dim images in dark mode for better contrast',
      },
    ],
  },

  activate: (api: PluginAPI) => {
    pluginApiRef = api;

    // Add style element
    styleElement = createStyleElement();
    document.head.appendChild(styleElement);

    // Get saved mode or default
    const settings = api.getSettings();
    const savedMode = api.getStorage<PreviewMode>('previewMode');
    const defaultMode = (settings.defaultMode as PreviewMode) || 'light';

    setMode(savedMode || defaultMode);

    // Set up system preference listener
    if (typeof window !== 'undefined' && window.matchMedia) {
      systemDarkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      systemModeListener = (e: MediaQueryListEvent) => {
        const autoSwitch = api.getSettings().autoSwitch;
        if (autoSwitch && currentMode === 'system') {
          applyDarkMode(e.matches);
        }
      };
      systemDarkModeQuery.addEventListener('change', systemModeListener);
    }

    // Add toolbar button
    api.addToolbarButton({
      id: 'dark-mode-toggle',
      icon: 'moon',
      label: 'Dark Mode Preview',
      tooltip: 'Toggle dark mode preview (Ctrl+Shift+D)',
      onClick: toggleMode,
      isActive: () => currentMode === 'dark',
    });

    // Add keyboard shortcuts
    api.addKeyboardShortcut({
      id: 'dark-mode-toggle',
      keys: 'ctrl+shift+d',
      description: 'Toggle dark mode preview',
      handler: toggleMode,
    });

    api.addKeyboardShortcut({
      id: 'dark-mode-cycle',
      keys: 'ctrl+alt+d',
      description: 'Cycle through preview modes',
      handler: cycleMode,
    });

    api.log('Dark Mode Preview activated');

    if (currentMode !== 'light') {
      api.showNotification({
        type: 'info',
        message: `Dark Mode Preview: ${currentMode === 'dark' ? 'Dark' : 'System'}`,
        duration: 2000,
      });
    }
  },

  deactivate: (api: PluginAPI) => {
    // Remove styles
    if (styleElement) {
      styleElement.remove();
      styleElement = null;
    }

    // Remove dark mode attribute
    applyDarkMode(false);

    // Remove system listener
    if (systemDarkModeQuery && systemModeListener) {
      systemDarkModeQuery.removeEventListener('change', systemModeListener);
      systemDarkModeQuery = null;
      systemModeListener = null;
    }

    // Clean up UI
    api.removeToolbarButton('dark-mode-toggle');
    api.removeKeyboardShortcut('dark-mode-toggle');
    api.removeKeyboardShortcut('dark-mode-cycle');

    pluginApiRef = null;
    api.log('Dark Mode Preview deactivated');
  },

  onSettingsChange: (settings: Record<string, unknown>) => {
    // Handle auto-switch setting change
    if (settings.autoSwitch && currentMode === 'system') {
      applyDarkMode(getSystemDarkMode());
    }
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

export { type PreviewMode };
export default darkModePreviewPlugin;
