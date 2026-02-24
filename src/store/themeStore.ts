/**
 * Theme Store - Zustand store for theme state management
 *
 * This store manages:
 * - Current theme selection
 * - Custom overrides
 * - Dark/light mode toggle
 * - Theme presets
 * - Save/load themes
 * - Export theme as JSON/CSS
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Theme,
  ThemeOverrides,
  ColorPalette,
  TypographyPreset,
  SpacingPreset,
  BorderRadiusPreset,
  ShadowPreset,
  AnimationPreset,
} from '@/lib/themeSystem';
import {
  DEFAULT_THEME,
  COLOR_PALETTES,
  TYPOGRAPHY_PRESETS,
  SPACING_PRESETS,
  BORDER_RADIUS_PRESETS,
  SHADOW_PRESETS,
  ANIMATION_PRESETS,
  createTheme,
  serializeTheme,
  deserializeTheme,
  validateTheme,
} from '@/lib/themeSystem';
import {
  generateFullCSS,
  exportAsTailwindConfig,
  exportAsSCSS,
  exportAsMinifiedCSS,
} from '@/lib/cssVariables';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/** Custom theme saved by user */
export interface SavedTheme {
  id: string;
  name: string;
  description: string;
  theme: Theme;
  createdAt: string;
  updatedAt: string;
}

/** Export format options */
export type ExportFormat = 'json' | 'css' | 'css-minified' | 'scss' | 'tailwind';

/** Theme panel section */
export type ThemePanelSection =
  | 'colors'
  | 'typography'
  | 'spacing'
  | 'borderRadius'
  | 'shadows'
  | 'animations'
  | 'presets';

/** Theme store state */
export interface ThemeState {
  // Current active theme
  currentTheme: Theme;

  // Custom overrides applied on top of the theme
  overrides: ThemeOverrides;

  // Dark mode state
  isDarkMode: boolean;

  // UI state
  activePanelSection: ThemePanelSection;
  isPanelOpen: boolean;
  isPreviewMode: boolean;

  // Saved custom themes
  savedThemes: SavedTheme[];

  // Recently used themes
  recentThemes: string[];

  // Favorite theme IDs
  favoriteThemes: string[];

  // Theme history for undo/redo
  themeHistory: Theme[];
  historyIndex: number;

  // Actions
  setTheme: (theme: Theme) => void;
  setColorPalette: (paletteId: string) => void;
  setTypography: (typographyId: string) => void;
  setSpacing: (spacingId: string) => void;
  setBorderRadius: (radiusId: string) => void;
  setShadows: (shadowId: string) => void;
  setAnimations: (animationId: string) => void;

  // Custom color actions
  setCustomPrimaryColor: (hex: string) => void;
  setCustomSecondaryColor: (hex: string) => void;
  setCustomAccentColor: (hex: string) => void;
  setCustomBackgroundColor: (type: 'primary' | 'secondary' | 'tertiary', hex: string) => void;
  setCustomForegroundColor: (type: 'primary' | 'secondary' | 'muted', hex: string) => void;
  setCustomBorderColor: (type: 'default' | 'subtle' | 'strong', hex: string) => void;

  // Override actions
  setOverrides: (overrides: ThemeOverrides) => void;
  clearOverrides: () => void;
  applyOverrides: () => void;

  // Dark mode
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;

  // UI actions
  setActivePanelSection: (section: ThemePanelSection) => void;
  togglePanel: () => void;
  setPreviewMode: (isPreview: boolean) => void;

  // Saved themes actions
  saveCurrentTheme: (name: string, description?: string) => SavedTheme;
  loadSavedTheme: (id: string) => void;
  deleteSavedTheme: (id: string) => void;
  updateSavedTheme: (id: string, updates: Partial<SavedTheme>) => void;
  duplicateSavedTheme: (id: string) => SavedTheme;

  // Recent/Favorite actions
  addToRecent: (themeId: string) => void;
  toggleFavorite: (themeId: string) => void;
  isFavorite: (themeId: string) => boolean;

  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveToHistory: () => void;

  // Import/Export actions
  exportTheme: (format: ExportFormat) => string;
  importTheme: (data: string, format: 'json') => boolean;
  downloadTheme: (format: ExportFormat, filename?: string) => void;

  // Reset
  resetToDefault: () => void;
  resetSection: (section: ThemePanelSection) => void;

  // Computed getters
  getEffectiveTheme: () => Theme;
  getColorPaletteOptions: () => Array<{ id: string; name: string; description: string }>;
  getTypographyOptions: () => Array<{ id: string; name: string; description: string }>;
  getSpacingOptions: () => Array<{ id: string; name: string; description: string }>;
  getBorderRadiusOptions: () => Array<{ id: string; name: string; description: string }>;
  getShadowOptions: () => Array<{ id: string; name: string; description: string }>;
  getAnimationOptions: () => Array<{ id: string; name: string; description: string }>;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function generateId(): string {
  return `theme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const MAX_HISTORY = 30;
const MAX_RECENT = 10;

// =============================================================================
// STORE IMPLEMENTATION
// =============================================================================

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentTheme: DEFAULT_THEME,
      overrides: {},
      isDarkMode: false,
      activePanelSection: 'colors',
      isPanelOpen: false,
      isPreviewMode: false,
      savedThemes: [],
      recentThemes: [],
      favoriteThemes: [],
      themeHistory: [DEFAULT_THEME],
      historyIndex: 0,

      // Set entire theme
      setTheme: (theme) => {
        set({ currentTheme: theme, overrides: {} });
        get().saveToHistory();
        get().addToRecent(theme.id);
      },

      // Set color palette
      setColorPalette: (paletteId) => {
        const palette = COLOR_PALETTES[paletteId];
        if (!palette) return;

        set((state) => ({
          currentTheme: {
            ...state.currentTheme,
            colorPalette: palette,
            updatedAt: new Date().toISOString(),
          },
        }));
        get().saveToHistory();
      },

      // Set typography
      setTypography: (typographyId) => {
        const typography = TYPOGRAPHY_PRESETS[typographyId];
        if (!typography) return;

        set((state) => ({
          currentTheme: {
            ...state.currentTheme,
            typography,
            updatedAt: new Date().toISOString(),
          },
        }));
        get().saveToHistory();
      },

      // Set spacing
      setSpacing: (spacingId) => {
        const spacing = SPACING_PRESETS[spacingId];
        if (!spacing) return;

        set((state) => ({
          currentTheme: {
            ...state.currentTheme,
            spacing,
            updatedAt: new Date().toISOString(),
          },
        }));
        get().saveToHistory();
      },

      // Set border radius
      setBorderRadius: (radiusId) => {
        const borderRadius = BORDER_RADIUS_PRESETS[radiusId];
        if (!borderRadius) return;

        set((state) => ({
          currentTheme: {
            ...state.currentTheme,
            borderRadius,
            updatedAt: new Date().toISOString(),
          },
        }));
        get().saveToHistory();
      },

      // Set shadows
      setShadows: (shadowId) => {
        const shadows = SHADOW_PRESETS[shadowId];
        if (!shadows) return;

        set((state) => ({
          currentTheme: {
            ...state.currentTheme,
            shadows,
            updatedAt: new Date().toISOString(),
          },
        }));
        get().saveToHistory();
      },

      // Set animations
      setAnimations: (animationId) => {
        const animations = ANIMATION_PRESETS[animationId];
        if (!animations) return;

        set((state) => ({
          currentTheme: {
            ...state.currentTheme,
            animations,
            updatedAt: new Date().toISOString(),
          },
        }));
        get().saveToHistory();
      },

      // Custom color setters
      setCustomPrimaryColor: (hex) => {
        const { generateColorScale } = require('@/lib/themeSystem');
        const scale = generateColorScale(hex);

        set((state) => ({
          currentTheme: {
            ...state.currentTheme,
            colorPalette: {
              ...state.currentTheme.colorPalette,
              colors: {
                ...state.currentTheme.colorPalette.colors,
                primary: scale,
              },
            },
            updatedAt: new Date().toISOString(),
          },
        }));
        get().saveToHistory();
      },

      setCustomSecondaryColor: (hex) => {
        const { generateColorScale } = require('@/lib/themeSystem');
        const scale = generateColorScale(hex);

        set((state) => ({
          currentTheme: {
            ...state.currentTheme,
            colorPalette: {
              ...state.currentTheme.colorPalette,
              colors: {
                ...state.currentTheme.colorPalette.colors,
                secondary: scale,
              },
            },
            updatedAt: new Date().toISOString(),
          },
        }));
        get().saveToHistory();
      },

      setCustomAccentColor: (hex) => {
        const { generateColorScale } = require('@/lib/themeSystem');
        const scale = generateColorScale(hex);

        set((state) => ({
          currentTheme: {
            ...state.currentTheme,
            colorPalette: {
              ...state.currentTheme.colorPalette,
              colors: {
                ...state.currentTheme.colorPalette.colors,
                accent: scale,
              },
            },
            updatedAt: new Date().toISOString(),
          },
        }));
        get().saveToHistory();
      },

      setCustomBackgroundColor: (type, hex) => {
        set((state) => ({
          currentTheme: {
            ...state.currentTheme,
            colorPalette: {
              ...state.currentTheme.colorPalette,
              background: {
                ...state.currentTheme.colorPalette.background,
                [type]: hex,
              },
            },
            updatedAt: new Date().toISOString(),
          },
        }));
        get().saveToHistory();
      },

      setCustomForegroundColor: (type, hex) => {
        set((state) => ({
          currentTheme: {
            ...state.currentTheme,
            colorPalette: {
              ...state.currentTheme.colorPalette,
              foreground: {
                ...state.currentTheme.colorPalette.foreground,
                [type]: hex,
              },
            },
            updatedAt: new Date().toISOString(),
          },
        }));
        get().saveToHistory();
      },

      setCustomBorderColor: (type, hex) => {
        set((state) => ({
          currentTheme: {
            ...state.currentTheme,
            colorPalette: {
              ...state.currentTheme.colorPalette,
              border: {
                ...state.currentTheme.colorPalette.border,
                [type]: hex,
              },
            },
            updatedAt: new Date().toISOString(),
          },
        }));
        get().saveToHistory();
      },

      // Override actions
      setOverrides: (overrides) => {
        set({ overrides });
      },

      clearOverrides: () => {
        set({ overrides: {} });
      },

      applyOverrides: () => {
        const { currentTheme, overrides } = get();
        const newTheme = createTheme(currentTheme, overrides);
        set({ currentTheme: newTheme, overrides: {} });
        get().saveToHistory();
      },

      // Dark mode
      toggleDarkMode: () => {
        set((state) => {
          const newIsDark = !state.isDarkMode;
          // Apply dark palette if toggling to dark mode
          if (newIsDark && state.currentTheme.colorPalette.id !== 'dark') {
            return {
              isDarkMode: newIsDark,
              currentTheme: {
                ...state.currentTheme,
                colorPalette: COLOR_PALETTES.dark,
                darkMode: true,
                updatedAt: new Date().toISOString(),
              },
            };
          } else if (!newIsDark && state.currentTheme.colorPalette.id === 'dark') {
            return {
              isDarkMode: newIsDark,
              currentTheme: {
                ...state.currentTheme,
                colorPalette: COLOR_PALETTES.light,
                darkMode: false,
                updatedAt: new Date().toISOString(),
              },
            };
          }
          return { isDarkMode: newIsDark };
        });
      },

      setDarkMode: (isDark) => {
        set({ isDarkMode: isDark });
      },

      // UI actions
      setActivePanelSection: (section) => {
        set({ activePanelSection: section });
      },

      togglePanel: () => {
        set((state) => ({ isPanelOpen: !state.isPanelOpen }));
      },

      setPreviewMode: (isPreview) => {
        set({ isPreviewMode: isPreview });
      },

      // Saved themes
      saveCurrentTheme: (name, description = '') => {
        const { currentTheme } = get();
        const savedTheme: SavedTheme = {
          id: generateId(),
          name,
          description,
          theme: { ...currentTheme, id: generateId(), name },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          savedThemes: [...state.savedThemes, savedTheme],
        }));

        return savedTheme;
      },

      loadSavedTheme: (id) => {
        const { savedThemes } = get();
        const saved = savedThemes.find((t) => t.id === id);
        if (saved) {
          set({ currentTheme: saved.theme, overrides: {} });
          get().saveToHistory();
          get().addToRecent(id);
        }
      },

      deleteSavedTheme: (id) => {
        set((state) => ({
          savedThemes: state.savedThemes.filter((t) => t.id !== id),
          favoriteThemes: state.favoriteThemes.filter((fid) => fid !== id),
          recentThemes: state.recentThemes.filter((rid) => rid !== id),
        }));
      },

      updateSavedTheme: (id, updates) => {
        set((state) => ({
          savedThemes: state.savedThemes.map((t) =>
            t.id === id
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      duplicateSavedTheme: (id) => {
        const { savedThemes } = get();
        const original = savedThemes.find((t) => t.id === id);
        if (!original) {
          throw new Error('Theme not found');
        }

        const duplicate: SavedTheme = {
          ...original,
          id: generateId(),
          name: `${original.name} (Copy)`,
          theme: { ...original.theme, id: generateId() },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          savedThemes: [...state.savedThemes, duplicate],
        }));

        return duplicate;
      },

      // Recent/Favorite
      addToRecent: (themeId) => {
        set((state) => {
          const filtered = state.recentThemes.filter((id) => id !== themeId);
          return {
            recentThemes: [themeId, ...filtered].slice(0, MAX_RECENT),
          };
        });
      },

      toggleFavorite: (themeId) => {
        set((state) => {
          const isFav = state.favoriteThemes.includes(themeId);
          return {
            favoriteThemes: isFav
              ? state.favoriteThemes.filter((id) => id !== themeId)
              : [...state.favoriteThemes, themeId],
          };
        });
      },

      isFavorite: (themeId) => {
        return get().favoriteThemes.includes(themeId);
      },

      // History
      saveToHistory: () => {
        set((state) => {
          const newHistory = state.themeHistory.slice(0, state.historyIndex + 1);
          newHistory.push(JSON.parse(JSON.stringify(state.currentTheme)));

          if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
          }

          return {
            themeHistory: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      },

      undo: () => {
        set((state) => {
          if (state.historyIndex <= 0) return state;
          const newIndex = state.historyIndex - 1;
          return {
            currentTheme: JSON.parse(JSON.stringify(state.themeHistory[newIndex])),
            historyIndex: newIndex,
          };
        });
      },

      redo: () => {
        set((state) => {
          if (state.historyIndex >= state.themeHistory.length - 1) return state;
          const newIndex = state.historyIndex + 1;
          return {
            currentTheme: JSON.parse(JSON.stringify(state.themeHistory[newIndex])),
            historyIndex: newIndex,
          };
        });
      },

      canUndo: () => {
        return get().historyIndex > 0;
      },

      canRedo: () => {
        const { historyIndex, themeHistory } = get();
        return historyIndex < themeHistory.length - 1;
      },

      // Export/Import
      exportTheme: (format) => {
        const { currentTheme } = get();

        switch (format) {
          case 'json':
            return serializeTheme(currentTheme);
          case 'css':
            return generateFullCSS(currentTheme, { includeComments: true }).full;
          case 'css-minified':
            return exportAsMinifiedCSS(currentTheme);
          case 'scss':
            return exportAsSCSS(currentTheme);
          case 'tailwind':
            return exportAsTailwindConfig(currentTheme);
          default:
            return serializeTheme(currentTheme);
        }
      },

      importTheme: (data, format) => {
        if (format === 'json') {
          const theme = deserializeTheme(data);
          if (theme) {
            set({ currentTheme: theme, overrides: {} });
            get().saveToHistory();
            return true;
          }
        }
        return false;
      },

      downloadTheme: (format, filename) => {
        const content = get().exportTheme(format);
        const { currentTheme } = get();
        const baseName = filename || currentTheme.name.toLowerCase().replace(/\s+/g, '-');

        const extensions: Record<ExportFormat, string> = {
          json: 'json',
          css: 'css',
          'css-minified': 'min.css',
          scss: 'scss',
          tailwind: 'js',
        };

        const mimeTypes: Record<ExportFormat, string> = {
          json: 'application/json',
          css: 'text/css',
          'css-minified': 'text/css',
          scss: 'text/x-scss',
          tailwind: 'application/javascript',
        };

        downloadFile(content, `${baseName}.${extensions[format]}`, mimeTypes[format]);
      },

      // Reset
      resetToDefault: () => {
        set({
          currentTheme: DEFAULT_THEME,
          overrides: {},
          isDarkMode: false,
        });
        get().saveToHistory();
      },

      resetSection: (section) => {
        set((state) => {
          const updates: Partial<Theme> = { updatedAt: new Date().toISOString() };

          switch (section) {
            case 'colors':
              updates.colorPalette = DEFAULT_THEME.colorPalette;
              break;
            case 'typography':
              updates.typography = DEFAULT_THEME.typography;
              break;
            case 'spacing':
              updates.spacing = DEFAULT_THEME.spacing;
              break;
            case 'borderRadius':
              updates.borderRadius = DEFAULT_THEME.borderRadius;
              break;
            case 'shadows':
              updates.shadows = DEFAULT_THEME.shadows;
              break;
            case 'animations':
              updates.animations = DEFAULT_THEME.animations;
              break;
          }

          return {
            currentTheme: { ...state.currentTheme, ...updates },
          };
        });
        get().saveToHistory();
      },

      // Getters
      getEffectiveTheme: () => {
        const { currentTheme, overrides } = get();
        if (Object.keys(overrides).length === 0) {
          return currentTheme;
        }
        return createTheme(currentTheme, overrides);
      },

      getColorPaletteOptions: () => {
        return Object.values(COLOR_PALETTES).map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
        }));
      },

      getTypographyOptions: () => {
        return Object.values(TYPOGRAPHY_PRESETS).map((t) => ({
          id: t.id,
          name: t.name,
          description: t.description,
        }));
      },

      getSpacingOptions: () => {
        return Object.values(SPACING_PRESETS).map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
        }));
      },

      getBorderRadiusOptions: () => {
        return Object.values(BORDER_RADIUS_PRESETS).map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
        }));
      },

      getShadowOptions: () => {
        return Object.values(SHADOW_PRESETS).map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
        }));
      },

      getAnimationOptions: () => {
        return Object.values(ANIMATION_PRESETS).map((a) => ({
          id: a.id,
          name: a.name,
          description: a.description,
        }));
      },
    }),
    {
      name: 'tailwind-builder-theme',
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        isDarkMode: state.isDarkMode,
        savedThemes: state.savedThemes,
        recentThemes: state.recentThemes,
        favoriteThemes: state.favoriteThemes,
      }),
    }
  )
);

// =============================================================================
// SELECTOR HOOKS
// =============================================================================

/**
 * Hook to get the current effective theme (with overrides applied)
 */
export function useEffectiveTheme(): Theme {
  return useThemeStore((state) => state.getEffectiveTheme());
}

/**
 * Hook to get current color palette
 */
export function useColorPalette(): ColorPalette {
  return useThemeStore((state) => state.currentTheme.colorPalette);
}

/**
 * Hook to get current typography
 */
export function useTypography(): TypographyPreset {
  return useThemeStore((state) => state.currentTheme.typography);
}

/**
 * Hook to get current spacing
 */
export function useSpacing(): SpacingPreset {
  return useThemeStore((state) => state.currentTheme.spacing);
}

/**
 * Hook to get current border radius
 */
export function useBorderRadius(): BorderRadiusPreset {
  return useThemeStore((state) => state.currentTheme.borderRadius);
}

/**
 * Hook to get current shadows
 */
export function useShadows(): ShadowPreset {
  return useThemeStore((state) => state.currentTheme.shadows);
}

/**
 * Hook to get current animations
 */
export function useAnimations(): AnimationPreset {
  return useThemeStore((state) => state.currentTheme.animations);
}

/**
 * Hook to get dark mode state
 */
export function useIsDarkMode(): boolean {
  return useThemeStore((state) => state.isDarkMode);
}

/**
 * Hook to get saved themes
 */
export function useSavedThemes(): SavedTheme[] {
  return useThemeStore((state) => state.savedThemes);
}

/**
 * Hook to get theme panel state
 */
export function useThemePanelState() {
  return useThemeStore((state) => ({
    isOpen: state.isPanelOpen,
    activeSection: state.activePanelSection,
    isPreviewMode: state.isPreviewMode,
  }));
}

// Export default store
export default useThemeStore;
