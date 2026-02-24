/**
 * Customization Store
 *
 * Manages state for themes, animations, variants, accessibility,
 * performance, tokens, and project settings.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ThemeConfig,
  ThemePreset,
  AnimationPreset,
  TransitionConfig,
  VariantConfig,
  Breakpoint,
  AccessibilityReport,
  PerformanceReport,
  DesignToken,
  TokenGroup,
  Template,
  ProjectSettings,
  GridSettings,
  AutosaveSettings,
  ExportSettings,
} from '@/types/customization';

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const defaultGridSettings: GridSettings = {
  enabled: true,
  size: 8,
  color: '#3B82F6',
  opacity: 0.1,
  snap: true,
  snapThreshold: 4,
};

const defaultAutosaveSettings: AutosaveSettings = {
  enabled: true,
  interval: 30000,
  maxSnapshots: 10,
};

const defaultExportSettings: ExportSettings = {
  defaultFormat: 'tsx',
  includeComments: true,
  minify: false,
  componentPrefix: '',
};

const defaultProjectSettings: ProjectSettings = {
  name: 'Untitled Project',
  description: '',
  defaultTheme: 'default',
  grid: defaultGridSettings,
  autosave: defaultAutosaveSettings,
  export: defaultExportSettings,
  shortcuts: [],
};

const defaultTheme: ThemeConfig = {
  id: 'default',
  name: 'Default',
  description: 'Default Tailwind CSS theme',
  mode: 'dark',
  palette: {
    primary: [{ name: 'Primary', value: '#3B82F6' }],
    secondary: [{ name: 'Secondary', value: '#6366F1' }],
    accent: [{ name: 'Accent', value: '#8B5CF6' }],
    neutral: [{ name: 'Neutral', value: '#6B7280' }],
    success: [{ name: 'Success', value: '#10B981' }],
    warning: [{ name: 'Warning', value: '#F59E0B' }],
    error: [{ name: 'Error', value: '#EF4444' }],
    info: [{ name: 'Info', value: '#3B82F6' }],
  },
  borderRadius: 'rounded-lg',
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    serif: 'Georgia, serif',
    mono: 'JetBrains Mono, monospace',
  },
  spacing: {
    unit: 4,
    scale: [0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64],
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
};

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface CustomizationState {
  // Theme
  currentTheme: ThemeConfig;
  themePresets: ThemePreset[];
  isDarkMode: boolean;

  // Animations
  animationPresets: AnimationPreset[];
  globalTransition: TransitionConfig;

  // Variants
  variants: Record<string, VariantConfig[]>;
  activeVariant: string | null;

  // Responsive
  activeBreakpoint: Breakpoint | 'default';
  showBreakpointIndicator: boolean;

  // Accessibility
  accessibilityReport: AccessibilityReport | null;
  autoCheckAccessibility: boolean;

  // Performance
  performanceReport: PerformanceReport | null;

  // Tokens
  tokenGroups: TokenGroup[];
  customTokens: DesignToken[];

  // Templates
  templates: Template[];
  favoriteTemplates: string[];
  recentTemplates: string[];

  // Settings
  projectSettings: ProjectSettings;
  settingsModalOpen: boolean;

  // Panel state
  activePanelTab: string;
  collapsedSections: string[];

  // Theme actions
  setTheme: (theme: ThemeConfig) => void;
  setDarkMode: (isDark: boolean) => void;
  addThemePreset: (preset: ThemePreset) => void;
  removeThemePreset: (id: string) => void;

  // Animation actions
  setGlobalTransition: (config: TransitionConfig) => void;
  addAnimationPreset: (preset: AnimationPreset) => void;
  removeAnimationPreset: (id: string) => void;

  // Variant actions
  setActiveVariant: (variant: string | null) => void;
  addVariant: (componentType: string, variant: VariantConfig) => void;
  updateVariant: (componentType: string, variantId: string, updates: Partial<VariantConfig>) => void;
  removeVariant: (componentType: string, variantId: string) => void;

  // Responsive actions
  setActiveBreakpoint: (breakpoint: Breakpoint | 'default') => void;
  toggleBreakpointIndicator: () => void;

  // Accessibility actions
  setAccessibilityReport: (report: AccessibilityReport | null) => void;
  toggleAutoAccessibilityCheck: () => void;
  runAccessibilityCheck: () => void;

  // Performance actions
  setPerformanceReport: (report: PerformanceReport | null) => void;
  runPerformanceAnalysis: () => void;

  // Token actions
  addToken: (groupId: string, token: DesignToken) => void;
  updateToken: (groupId: string, tokenId: string, updates: Partial<DesignToken>) => void;
  removeToken: (groupId: string, tokenId: string) => void;
  addTokenGroup: (group: TokenGroup) => void;
  removeTokenGroup: (groupId: string) => void;

  // Template actions
  addTemplate: (template: Template) => void;
  removeTemplate: (id: string) => void;
  toggleFavoriteTemplate: (id: string) => void;
  addRecentTemplate: (id: string) => void;

  // Settings actions
  updateProjectSettings: (settings: Partial<ProjectSettings>) => void;
  updateGridSettings: (settings: Partial<GridSettings>) => void;
  updateAutosaveSettings: (settings: Partial<AutosaveSettings>) => void;
  updateExportSettings: (settings: Partial<ExportSettings>) => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;

  // Panel actions
  setActivePanelTab: (tab: string) => void;
  toggleSection: (sectionId: string) => void;

  // Reset
  resetToDefaults: () => void;
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useCustomizationStore = create<CustomizationState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentTheme: defaultTheme,
      themePresets: [],
      isDarkMode: true,

      animationPresets: [],
      globalTransition: {
        property: 'all',
        duration: 150,
        easing: 'ease-in-out',
        delay: 0,
      },

      variants: {},
      activeVariant: null,

      activeBreakpoint: 'default',
      showBreakpointIndicator: true,

      accessibilityReport: null,
      autoCheckAccessibility: true,

      performanceReport: null,

      tokenGroups: [],
      customTokens: [],

      templates: [],
      favoriteTemplates: [],
      recentTemplates: [],

      projectSettings: defaultProjectSettings,
      settingsModalOpen: false,

      activePanelTab: 'style',
      collapsedSections: [],

      // Theme actions
      setTheme: (theme) => set({ currentTheme: theme }),

      setDarkMode: (isDark) =>
        set((state) => ({
          isDarkMode: isDark,
          currentTheme: { ...state.currentTheme, mode: isDark ? 'dark' : 'light' },
        })),

      addThemePreset: (preset) =>
        set((state) => ({
          themePresets: [...state.themePresets, preset],
        })),

      removeThemePreset: (id) =>
        set((state) => ({
          themePresets: state.themePresets.filter((p) => p.id !== id),
        })),

      // Animation actions
      setGlobalTransition: (config) => set({ globalTransition: config }),

      addAnimationPreset: (preset) =>
        set((state) => ({
          animationPresets: [...state.animationPresets, preset],
        })),

      removeAnimationPreset: (id) =>
        set((state) => ({
          animationPresets: state.animationPresets.filter((p) => p.id !== id),
        })),

      // Variant actions
      setActiveVariant: (variant) => set({ activeVariant: variant }),

      addVariant: (componentType, variant) =>
        set((state) => ({
          variants: {
            ...state.variants,
            [componentType]: [...(state.variants[componentType] || []), variant],
          },
        })),

      updateVariant: (componentType, variantId, updates) =>
        set((state) => ({
          variants: {
            ...state.variants,
            [componentType]: (state.variants[componentType] || []).map((v) =>
              v.id === variantId ? { ...v, ...updates } : v
            ),
          },
        })),

      removeVariant: (componentType, variantId) =>
        set((state) => ({
          variants: {
            ...state.variants,
            [componentType]: (state.variants[componentType] || []).filter(
              (v) => v.id !== variantId
            ),
          },
        })),

      // Responsive actions
      setActiveBreakpoint: (breakpoint) => set({ activeBreakpoint: breakpoint }),
      toggleBreakpointIndicator: () =>
        set((state) => ({ showBreakpointIndicator: !state.showBreakpointIndicator })),

      // Accessibility actions
      setAccessibilityReport: (report) => set({ accessibilityReport: report }),
      toggleAutoAccessibilityCheck: () =>
        set((state) => ({ autoCheckAccessibility: !state.autoCheckAccessibility })),

      runAccessibilityCheck: () => {
        // Simulated accessibility check
        const report: AccessibilityReport = {
          score: 85,
          issues: [],
          passed: [
            'All images have alt text',
            'Color contrast meets WCAG AA',
            'Interactive elements are keyboard accessible',
          ],
          timestamp: Date.now(),
        };
        set({ accessibilityReport: report });
      },

      // Performance actions
      setPerformanceReport: (report) => set({ performanceReport: report }),

      runPerformanceAnalysis: () => {
        // Simulated performance analysis
        const report: PerformanceReport = {
          score: 92,
          metrics: [
            {
              name: 'DOM Elements',
              value: 45,
              unit: 'elements',
              status: 'good',
              threshold: { good: 100, poor: 500 },
            },
            {
              name: 'CSS Classes Used',
              value: 128,
              unit: 'classes',
              status: 'good',
              threshold: { good: 200, poor: 500 },
            },
            {
              name: 'Nesting Depth',
              value: 4,
              unit: 'levels',
              status: 'good',
              threshold: { good: 6, poor: 10 },
            },
          ],
          suggestions: [
            'Consider using CSS Grid for complex layouts',
            'Combine similar utility classes where possible',
          ],
          timestamp: Date.now(),
        };
        set({ performanceReport: report });
      },

      // Token actions
      addToken: (groupId, token) =>
        set((state) => ({
          tokenGroups: state.tokenGroups.map((g) =>
            g.id === groupId ? { ...g, tokens: [...g.tokens, token] } : g
          ),
        })),

      updateToken: (groupId, tokenId, updates) =>
        set((state) => ({
          tokenGroups: state.tokenGroups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  tokens: g.tokens.map((t) => (t.id === tokenId ? { ...t, ...updates } : t)),
                }
              : g
          ),
        })),

      removeToken: (groupId, tokenId) =>
        set((state) => ({
          tokenGroups: state.tokenGroups.map((g) =>
            g.id === groupId
              ? { ...g, tokens: g.tokens.filter((t) => t.id !== tokenId) }
              : g
          ),
        })),

      addTokenGroup: (group) =>
        set((state) => ({
          tokenGroups: [...state.tokenGroups, group],
        })),

      removeTokenGroup: (groupId) =>
        set((state) => ({
          tokenGroups: state.tokenGroups.filter((g) => g.id !== groupId),
        })),

      // Template actions
      addTemplate: (template) =>
        set((state) => ({
          templates: [...state.templates, template],
        })),

      removeTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
          favoriteTemplates: state.favoriteTemplates.filter((fId) => fId !== id),
          recentTemplates: state.recentTemplates.filter((rId) => rId !== id),
        })),

      toggleFavoriteTemplate: (id) =>
        set((state) => ({
          favoriteTemplates: state.favoriteTemplates.includes(id)
            ? state.favoriteTemplates.filter((fId) => fId !== id)
            : [...state.favoriteTemplates, id],
        })),

      addRecentTemplate: (id) =>
        set((state) => {
          const filtered = state.recentTemplates.filter((rId) => rId !== id);
          return {
            recentTemplates: [id, ...filtered].slice(0, 10),
          };
        }),

      // Settings actions
      updateProjectSettings: (settings) =>
        set((state) => ({
          projectSettings: { ...state.projectSettings, ...settings },
        })),

      updateGridSettings: (settings) =>
        set((state) => ({
          projectSettings: {
            ...state.projectSettings,
            grid: { ...state.projectSettings.grid, ...settings },
          },
        })),

      updateAutosaveSettings: (settings) =>
        set((state) => ({
          projectSettings: {
            ...state.projectSettings,
            autosave: { ...state.projectSettings.autosave, ...settings },
          },
        })),

      updateExportSettings: (settings) =>
        set((state) => ({
          projectSettings: {
            ...state.projectSettings,
            export: { ...state.projectSettings.export, ...settings },
          },
        })),

      openSettingsModal: () => set({ settingsModalOpen: true }),
      closeSettingsModal: () => set({ settingsModalOpen: false }),

      // Panel actions
      setActivePanelTab: (tab) => set({ activePanelTab: tab }),

      toggleSection: (sectionId) =>
        set((state) => ({
          collapsedSections: state.collapsedSections.includes(sectionId)
            ? state.collapsedSections.filter((s) => s !== sectionId)
            : [...state.collapsedSections, sectionId],
        })),

      // Reset
      resetToDefaults: () =>
        set({
          currentTheme: defaultTheme,
          themePresets: [],
          isDarkMode: true,
          animationPresets: [],
          globalTransition: {
            property: 'all',
            duration: 150,
            easing: 'ease-in-out',
            delay: 0,
          },
          variants: {},
          activeVariant: null,
          activeBreakpoint: 'default',
          accessibilityReport: null,
          performanceReport: null,
          tokenGroups: [],
          customTokens: [],
          templates: [],
          favoriteTemplates: [],
          recentTemplates: [],
          projectSettings: defaultProjectSettings,
          settingsModalOpen: false,
          activePanelTab: 'style',
          collapsedSections: [],
        }),
    }),
    {
      name: 'tailwind-builder-customization',
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        themePresets: state.themePresets,
        isDarkMode: state.isDarkMode,
        animationPresets: state.animationPresets,
        globalTransition: state.globalTransition,
        variants: state.variants,
        tokenGroups: state.tokenGroups,
        customTokens: state.customTokens,
        templates: state.templates,
        favoriteTemplates: state.favoriteTemplates,
        projectSettings: state.projectSettings,
      }),
    }
  )
);
