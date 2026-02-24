'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import * as Popover from '@radix-ui/react-popover';
import * as Dialog from '@radix-ui/react-dialog';
import * as Slider from '@radix-ui/react-slider';
import {
  Palette,
  Type,
  Box,
  Square,
  Layers,
  Sparkles,
  Grid3X3,
  Sun,
  Moon,
  Download,
  Upload,
  Save,
  RotateCcw,
  Undo2,
  Redo2,
  Heart,
  Star,
  Check,
  ChevronDown,
  ChevronRight,
  X,
  Copy,
  Trash2,
  Plus,
  RefreshCw,
  Eye,
  EyeOff,
  Settings,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  useThemeStore,
  useSavedThemes,
  useThemePanelState,
  type ThemePanelSection,
  type ExportFormat,
  type SavedTheme,
} from '@/store/themeStore';
import {
  COLOR_PALETTES,
  TYPOGRAPHY_PRESETS,
  SPACING_PRESETS,
  BORDER_RADIUS_PRESETS,
  SHADOW_PRESETS,
  ANIMATION_PRESETS,
  type ColorPalette,
  type ColorScale,
} from '@/lib/themeSystem';

// =============================================================================
// CONSTANTS
// =============================================================================

const PANEL_SECTIONS: Array<{ id: ThemePanelSection; label: string; icon: typeof Palette }> = [
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'spacing', label: 'Spacing', icon: Box },
  { id: 'borderRadius', label: 'Corners', icon: Square },
  { id: 'shadows', label: 'Shadows', icon: Layers },
  { id: 'animations', label: 'Animations', icon: Sparkles },
  { id: 'presets', label: 'Presets', icon: Grid3X3 },
];

const EXPORT_FORMATS: Array<{ id: ExportFormat; label: string; ext: string }> = [
  { id: 'json', label: 'JSON Theme', ext: '.json' },
  { id: 'css', label: 'CSS Variables', ext: '.css' },
  { id: 'css-minified', label: 'CSS Minified', ext: '.min.css' },
  { id: 'scss', label: 'SCSS Variables', ext: '.scss' },
  { id: 'tailwind', label: 'Tailwind Config', ext: '.js' },
];

// =============================================================================
// COLOR SWATCH COMPONENT
// =============================================================================

interface ColorSwatchProps {
  color: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
  showLabel?: boolean;
}

function ColorSwatch({
  color,
  label,
  size = 'md',
  selected = false,
  onClick,
  showLabel = false,
}: ColorSwatchProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative rounded-md border-2 transition-all duration-150',
        sizeClasses[size],
        selected
          ? 'border-blue-500 ring-2 ring-blue-500/50 scale-110'
          : 'border-gray-600 hover:border-gray-500 hover:scale-105',
        onClick && 'cursor-pointer'
      )}
      style={{ backgroundColor: color }}
      title={label || color}
    >
      {selected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Check className="w-4 h-4 text-white drop-shadow-md" />
        </div>
      )}
      {showLabel && label && (
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  );
}

// =============================================================================
// COLOR SCALE PREVIEW COMPONENT
// =============================================================================

interface ColorScalePreviewProps {
  scale: ColorScale;
  name: string;
  compact?: boolean;
}

function ColorScalePreview({ scale, name, compact = false }: ColorScalePreviewProps) {
  const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

  return (
    <div className="space-y-1">
      {!compact && (
        <span className="text-xs text-gray-400 capitalize">{name}</span>
      )}
      <div className={cn('flex', compact ? 'gap-0.5' : 'gap-1')}>
        {shades.map((shade) => (
          <div
            key={shade}
            className={cn(
              'rounded',
              compact ? 'w-3 h-3' : 'w-5 h-5'
            )}
            style={{ backgroundColor: scale[shade] }}
            title={`${name}-${shade}: ${scale[shade]}`}
          />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// PALETTE CARD COMPONENT
// =============================================================================

interface PaletteCardProps {
  palette: ColorPalette;
  selected: boolean;
  onClick: () => void;
}

function PaletteCard({ palette, selected, onClick }: PaletteCardProps) {
  const previewColors = [
    palette.colors.primary[500],
    palette.colors.secondary[500],
    palette.colors.accent[500],
    palette.colors.neutral[500],
    palette.colors.success[500],
  ];

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative p-3 rounded-lg border-2 transition-all duration-200 w-full text-left',
        selected
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-sm font-medium text-white">{palette.name}</h4>
          <p className="text-xs text-gray-400 line-clamp-1">{palette.description}</p>
        </div>
        {selected && (
          <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
        )}
      </div>
      <div className="flex gap-1 mt-2">
        {previewColors.map((color, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-md"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </button>
  );
}

// =============================================================================
// TYPOGRAPHY CARD COMPONENT
// =============================================================================

interface TypographyCardProps {
  typography: typeof TYPOGRAPHY_PRESETS[keyof typeof TYPOGRAPHY_PRESETS];
  selected: boolean;
  onClick: () => void;
}

function TypographyCard({ typography, selected, onClick }: TypographyCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative p-3 rounded-lg border-2 transition-all duration-200 w-full text-left',
        selected
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-sm font-medium text-white">{typography.name}</h4>
          <p className="text-xs text-gray-400 line-clamp-1">{typography.description}</p>
        </div>
        {selected && (
          <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
        )}
      </div>
      <div
        className="text-lg text-white truncate"
        style={{ fontFamily: typography.fontFamily.heading }}
      >
        Aa Bb Cc
      </div>
    </button>
  );
}

// =============================================================================
// PRESET CARD COMPONENT
// =============================================================================

interface PresetCardProps {
  preset: { id: string; name: string; description: string };
  selected: boolean;
  onClick: () => void;
  preview?: React.ReactNode;
}

function PresetCard({ preset, selected, onClick, preview }: PresetCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative p-3 rounded-lg border-2 transition-all duration-200 w-full text-left',
        selected
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-medium text-white">{preset.name}</h4>
          <p className="text-xs text-gray-400 line-clamp-1">{preset.description}</p>
        </div>
        {selected && (
          <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
        )}
      </div>
      {preview && (
        <div className="mt-2">
          {preview}
        </div>
      )}
    </button>
  );
}

// =============================================================================
// COLOR PICKER INPUT
// =============================================================================

interface ColorPickerInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorPickerInput({ label, value, onChange }: ColorPickerInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-400">{label}</label>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2',
              'bg-gray-800 border border-gray-700 rounded-md',
              'text-white text-sm',
              'hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500',
              'transition-colors duration-150'
            )}
          >
            <div
              className="w-5 h-5 rounded border border-gray-600"
              style={{ backgroundColor: value }}
            />
            <span className="flex-1 text-left truncate font-mono text-xs">{value}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="w-64 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
            sideOffset={5}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-2">Color Picker</label>
                <input
                  ref={inputRef}
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full h-32 rounded-md cursor-pointer border-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Hex Value</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white text-sm font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>
            <Popover.Arrow className="fill-gray-700" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

// =============================================================================
// SECTION: COLORS
// =============================================================================

function ColorsSection() {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const setColorPalette = useThemeStore((s) => s.setColorPalette);
  const setCustomPrimaryColor = useThemeStore((s) => s.setCustomPrimaryColor);
  const setCustomSecondaryColor = useThemeStore((s) => s.setCustomSecondaryColor);
  const setCustomAccentColor = useThemeStore((s) => s.setCustomAccentColor);
  const setCustomBackgroundColor = useThemeStore((s) => s.setCustomBackgroundColor);
  const setCustomForegroundColor = useThemeStore((s) => s.setCustomForegroundColor);
  const resetSection = useThemeStore((s) => s.resetSection);

  const [showCustom, setShowCustom] = useState(false);

  const palettes = Object.values(COLOR_PALETTES);

  return (
    <div className="space-y-6">
      {/* Color Palette Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Color Palettes</h3>
          <button
            onClick={() => resetSection('colors')}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2">
          {palettes.map((palette) => (
            <PaletteCard
              key={palette.id}
              palette={palette}
              selected={currentTheme.colorPalette.id === palette.id}
              onClick={() => setColorPalette(palette.id)}
            />
          ))}
        </div>
      </div>

      {/* Custom Colors Toggle */}
      <div>
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="flex items-center justify-between w-full px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <span className="text-sm font-medium text-white">Custom Colors</span>
          <ChevronRight
            className={cn(
              'w-4 h-4 text-gray-400 transition-transform',
              showCustom && 'rotate-90'
            )}
          />
        </button>

        <AnimatePresence>
          {showCustom && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Primary/Secondary/Accent */}
                <div className="grid grid-cols-3 gap-3">
                  <ColorPickerInput
                    label="Primary"
                    value={currentTheme.colorPalette.colors.primary[500]}
                    onChange={setCustomPrimaryColor}
                  />
                  <ColorPickerInput
                    label="Secondary"
                    value={currentTheme.colorPalette.colors.secondary[500]}
                    onChange={setCustomSecondaryColor}
                  />
                  <ColorPickerInput
                    label="Accent"
                    value={currentTheme.colorPalette.colors.accent[500]}
                    onChange={setCustomAccentColor}
                  />
                </div>

                {/* Background Colors */}
                <div>
                  <h4 className="text-xs font-medium text-gray-400 mb-2">Background Colors</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <ColorPickerInput
                      label="Primary BG"
                      value={currentTheme.colorPalette.background.primary}
                      onChange={(v) => setCustomBackgroundColor('primary', v)}
                    />
                    <ColorPickerInput
                      label="Secondary BG"
                      value={currentTheme.colorPalette.background.secondary}
                      onChange={(v) => setCustomBackgroundColor('secondary', v)}
                    />
                    <ColorPickerInput
                      label="Tertiary BG"
                      value={currentTheme.colorPalette.background.tertiary}
                      onChange={(v) => setCustomBackgroundColor('tertiary', v)}
                    />
                  </div>
                </div>

                {/* Foreground Colors */}
                <div>
                  <h4 className="text-xs font-medium text-gray-400 mb-2">Text Colors</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <ColorPickerInput
                      label="Primary"
                      value={currentTheme.colorPalette.foreground.primary}
                      onChange={(v) => setCustomForegroundColor('primary', v)}
                    />
                    <ColorPickerInput
                      label="Secondary"
                      value={currentTheme.colorPalette.foreground.secondary}
                      onChange={(v) => setCustomForegroundColor('secondary', v)}
                    />
                    <ColorPickerInput
                      label="Muted"
                      value={currentTheme.colorPalette.foreground.muted}
                      onChange={(v) => setCustomForegroundColor('muted', v)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Color Scales Preview */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Color Scales</h3>
        <div className="space-y-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <ColorScalePreview
            scale={currentTheme.colorPalette.colors.primary}
            name="primary"
          />
          <ColorScalePreview
            scale={currentTheme.colorPalette.colors.secondary}
            name="secondary"
          />
          <ColorScalePreview
            scale={currentTheme.colorPalette.colors.accent}
            name="accent"
          />
          <ColorScalePreview
            scale={currentTheme.colorPalette.colors.success}
            name="success"
          />
          <ColorScalePreview
            scale={currentTheme.colorPalette.colors.warning}
            name="warning"
          />
          <ColorScalePreview
            scale={currentTheme.colorPalette.colors.error}
            name="error"
          />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: TYPOGRAPHY
// =============================================================================

function TypographySection() {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const setTypography = useThemeStore((s) => s.setTypography);
  const resetSection = useThemeStore((s) => s.resetSection);

  const typographyPresets = Object.values(TYPOGRAPHY_PRESETS);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Typography Presets</h3>
          <button
            onClick={() => resetSection('typography')}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2">
          {typographyPresets.map((typo) => (
            <TypographyCard
              key={typo.id}
              typography={typo}
              selected={currentTheme.typography.id === typo.id}
              onClick={() => setTypography(typo.id)}
            />
          ))}
        </div>
      </div>

      {/* Typography Preview */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Preview</h3>
        <div
          className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 space-y-3"
          style={{ fontFamily: currentTheme.typography.fontFamily.body }}
        >
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: currentTheme.typography.fontFamily.heading }}
          >
            Heading Text
          </h1>
          <p className="text-sm text-gray-300">
            Body text with the selected font family. The quick brown fox jumps over the lazy dog.
          </p>
          <code
            className="text-xs text-green-400 bg-gray-900 px-2 py-1 rounded"
            style={{ fontFamily: currentTheme.typography.fontFamily.mono }}
          >
            const code = &quot;monospace&quot;;
          </code>
        </div>
      </div>

      {/* Font Sizes */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Font Scale</h3>
        <div className="space-y-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          {['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'].map((size) => (
            <div key={size} className="flex items-baseline gap-3">
              <span className="text-xs text-gray-500 w-10">{size}</span>
              <span
                className="text-white"
                style={{
                  fontSize: currentTheme.typography.fontSize[size as keyof typeof currentTheme.typography.fontSize],
                }}
              >
                Text
              </span>
              <span className="text-xs text-gray-600 ml-auto">
                {currentTheme.typography.fontSize[size as keyof typeof currentTheme.typography.fontSize]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: SPACING
// =============================================================================

function SpacingSection() {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const setSpacing = useThemeStore((s) => s.setSpacing);
  const resetSection = useThemeStore((s) => s.resetSection);

  const spacingPresets = Object.values(SPACING_PRESETS);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Spacing Scale</h3>
          <button
            onClick={() => resetSection('spacing')}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {spacingPresets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              selected={currentTheme.spacing.id === preset.id}
              onClick={() => setSpacing(preset.id)}
              preview={
                <div className="flex gap-1 items-end">
                  {[1, 2, 4, 6, 8].map((n) => (
                    <div
                      key={n}
                      className="bg-blue-500/30 rounded-sm"
                      style={{
                        width: `${n * 4 * preset.baseUnit}px`,
                        height: `${n * 4 * preset.baseUnit}px`,
                      }}
                    />
                  ))}
                </div>
              }
            />
          ))}
        </div>
      </div>

      {/* Spacing Scale Preview */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Scale Preview</h3>
        <div className="space-y-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          {['1', '2', '4', '6', '8', '10', '12', '16', '20'].map((key) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-8">{key}</span>
              <div
                className="h-4 bg-blue-500/50 rounded"
                style={{
                  width: currentTheme.spacing.scale[key as keyof typeof currentTheme.spacing.scale],
                }}
              />
              <span className="text-xs text-gray-600 ml-auto">
                {currentTheme.spacing.scale[key as keyof typeof currentTheme.spacing.scale]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: BORDER RADIUS
// =============================================================================

function BorderRadiusSection() {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const setBorderRadius = useThemeStore((s) => s.setBorderRadius);
  const resetSection = useThemeStore((s) => s.resetSection);

  const radiusPresets = Object.values(BORDER_RADIUS_PRESETS);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Border Radius</h3>
          <button
            onClick={() => resetSection('borderRadius')}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {radiusPresets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              selected={currentTheme.borderRadius.id === preset.id}
              onClick={() => setBorderRadius(preset.id)}
              preview={
                <div className="flex gap-2">
                  {['sm', 'md', 'lg', 'xl'].map((size) => (
                    <div
                      key={size}
                      className="w-6 h-6 bg-blue-500/30 border border-blue-500/50"
                      style={{
                        borderRadius: preset.scale[size as keyof typeof preset.scale],
                      }}
                    />
                  ))}
                </div>
              }
            />
          ))}
        </div>
      </div>

      {/* Radius Scale Preview */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Scale Preview</h3>
        <div className="grid grid-cols-3 gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          {['none', 'sm', 'default', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].map((key) => (
            <div key={key} className="text-center">
              <div
                className="w-12 h-12 mx-auto bg-blue-500/30 border border-blue-500/50"
                style={{
                  borderRadius: currentTheme.borderRadius.scale[key as keyof typeof currentTheme.borderRadius.scale],
                }}
              />
              <span className="text-[10px] text-gray-500 mt-1 block">{key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: SHADOWS
// =============================================================================

function ShadowsSection() {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const setShadows = useThemeStore((s) => s.setShadows);
  const resetSection = useThemeStore((s) => s.resetSection);

  const shadowPresets = Object.values(SHADOW_PRESETS);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Shadow Presets</h3>
          <button
            onClick={() => resetSection('shadows')}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {shadowPresets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              selected={currentTheme.shadows.id === preset.id}
              onClick={() => setShadows(preset.id)}
              preview={
                <div className="flex gap-2 pt-2">
                  {['sm', 'md', 'lg'].map((size) => (
                    <div
                      key={size}
                      className="w-8 h-8 bg-white/90 rounded"
                      style={{
                        boxShadow: preset.scale[size as keyof typeof preset.scale],
                      }}
                    />
                  ))}
                </div>
              }
            />
          ))}
        </div>
      </div>

      {/* Shadow Scale Preview */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Scale Preview</h3>
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-100 rounded-lg">
          {['sm', 'default', 'md', 'lg', 'xl', '2xl', 'inner', 'none'].map((key) => (
            <div key={key} className="text-center">
              <div
                className="w-12 h-12 mx-auto bg-white rounded-lg"
                style={{
                  boxShadow: currentTheme.shadows.scale[key as keyof typeof currentTheme.shadows.scale],
                }}
              />
              <span className="text-[10px] text-gray-500 mt-1 block">{key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: ANIMATIONS
// =============================================================================

function AnimationsSection() {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const setAnimations = useThemeStore((s) => s.setAnimations);
  const resetSection = useThemeStore((s) => s.resetSection);

  const animationPresets = Object.values(ANIMATION_PRESETS);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Animation Presets</h3>
          <button
            onClick={() => resetSection('animations')}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {animationPresets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              selected={currentTheme.animations.id === preset.id}
              onClick={() => setAnimations(preset.id)}
            />
          ))}
        </div>
      </div>

      {/* Animation Preview */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Duration Scale</h3>
        <div className="space-y-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          {['fastest', 'fast', 'normal', 'slow', 'slowest'].map((key) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-xs text-gray-400 capitalize">{key}</span>
              <span className="text-xs text-gray-500 font-mono">
                {currentTheme.animations.duration[key as keyof typeof currentTheme.animations.duration]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Timing Functions */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Timing Functions</h3>
        <div className="space-y-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          {['linear', 'easeIn', 'easeOut', 'easeInOut', 'bounce', 'elastic'].map((key) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{key}</span>
              <span className="text-[10px] text-gray-600 font-mono truncate max-w-[180px]">
                {currentTheme.animations.timing[key as keyof typeof currentTheme.animations.timing]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SECTION: PRESETS (SAVED THEMES)
// =============================================================================

function PresetsSection() {
  const savedThemes = useSavedThemes();
  const saveCurrentTheme = useThemeStore((s) => s.saveCurrentTheme);
  const loadSavedTheme = useThemeStore((s) => s.loadSavedTheme);
  const deleteSavedTheme = useThemeStore((s) => s.deleteSavedTheme);
  const duplicateSavedTheme = useThemeStore((s) => s.duplicateSavedTheme);
  const toggleFavorite = useThemeStore((s) => s.toggleFavorite);
  const isFavorite = useThemeStore((s) => s.isFavorite);
  const resetToDefault = useThemeStore((s) => s.resetToDefault);

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [themeDescription, setThemeDescription] = useState('');

  const handleSaveTheme = () => {
    if (!themeName.trim()) return;
    saveCurrentTheme(themeName.trim(), themeDescription.trim());
    setThemeName('');
    setThemeDescription('');
    setSaveDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => setSaveDialogOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
        >
          <Save className="w-4 h-4" />
          Save Current
        </button>
        <button
          onClick={resetToDefault}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Saved Themes */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">
          Saved Themes ({savedThemes.length})
        </h3>
        {savedThemes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No saved themes yet. Save your first theme above.
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {savedThemes.map((saved) => (
              <div
                key={saved.id}
                className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">
                      {saved.name}
                    </h4>
                    {saved.description && (
                      <p className="text-xs text-gray-400 truncate">
                        {saved.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => toggleFavorite(saved.id)}
                      className={cn(
                        'p-1 rounded hover:bg-gray-700 transition-colors',
                        isFavorite(saved.id) ? 'text-yellow-500' : 'text-gray-500'
                      )}
                    >
                      <Star className="w-4 h-4" fill={isFavorite(saved.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[
                    saved.theme.colorPalette.colors.primary[500],
                    saved.theme.colorPalette.colors.secondary[500],
                    saved.theme.colorPalette.colors.accent[500],
                  ].map((color, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex gap-1 mt-2">
                  <button
                    onClick={() => loadSavedTheme(saved.id)}
                    className="flex-1 px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded text-xs transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => duplicateSavedTheme(saved.id)}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteSavedTheme(saved.id)}
                    className="px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-xs transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Dialog */}
      <Dialog.Root open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl p-6 z-50 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-white mb-4">
              Save Theme
            </Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="My Custom Theme"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={themeDescription}
                  onChange={(e) => setThemeDescription(e.target.value)}
                  placeholder="A brief description..."
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setSaveDialogOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTheme}
                disabled={!themeName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

// =============================================================================
// EXPORT/IMPORT PANEL
// =============================================================================

function ExportImportPanel() {
  const downloadTheme = useThemeStore((s) => s.downloadTheme);
  const importTheme = useThemeStore((s) => s.importTheme);
  const exportTheme = useThemeStore((s) => s.exportTheme);

  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json');
  const [exportedCode, setExportedCode] = useState('');

  const handleImport = () => {
    const success = importTheme(importData, 'json');
    if (success) {
      setImportData('');
      setImportDialogOpen(false);
    }
  };

  const handleExportPreview = (format: ExportFormat) => {
    setSelectedFormat(format);
    setExportedCode(exportTheme(format));
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportedCode);
  };

  return (
    <div className="space-y-2">
      {/* Export Button */}
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">
            <Download className="w-4 h-4" />
            Export Theme
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="w-64 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
            sideOffset={5}
          >
            <div className="space-y-1">
              {EXPORT_FORMATS.map((format) => (
                <button
                  key={format.id}
                  onClick={() => {
                    handleExportPreview(format.id);
                    setExportDialogOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-700 rounded-md transition-colors text-sm"
                >
                  <span className="text-white">{format.label}</span>
                  <span className="text-gray-500 text-xs">{format.ext}</span>
                </button>
              ))}
            </div>
            <Popover.Arrow className="fill-gray-700" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* Import Button */}
      <button
        onClick={() => setImportDialogOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
      >
        <Upload className="w-4 h-4" />
        Import Theme
      </button>

      {/* Export Dialog */}
      <Dialog.Root open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] bg-gray-800 border border-gray-700 rounded-xl p-6 z-50 shadow-xl overflow-hidden flex flex-col">
            <Dialog.Title className="text-lg font-semibold text-white mb-4">
              Export Theme
            </Dialog.Title>

            <div className="flex gap-2 mb-4">
              {EXPORT_FORMATS.map((format) => (
                <button
                  key={format.id}
                  onClick={() => handleExportPreview(format.id)}
                  className={cn(
                    'px-3 py-1 rounded-md text-sm transition-colors',
                    selectedFormat === format.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  )}
                >
                  {format.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-hidden">
              <pre className="h-full overflow-auto p-4 bg-gray-900 rounded-lg text-xs text-gray-300 font-mono">
                {exportedCode}
              </pre>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCopyToClipboard}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button
                onClick={() => downloadTheme(selectedFormat)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>

            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Import Dialog */}
      <Dialog.Root open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-gray-800 border border-gray-700 rounded-xl p-6 z-50 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-white mb-4">
              Import Theme
            </Dialog.Title>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Paste JSON theme data
              </label>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder='{"id": "...", "name": "...", ...}'
                rows={10}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setImportDialogOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!importData.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors"
              >
                Import
              </button>
            </div>
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

// =============================================================================
// MAIN THEME PANEL COMPONENT
// =============================================================================

interface ThemePanelProps {
  className?: string;
}

export function ThemePanel({ className }: ThemePanelProps) {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const isDarkMode = useThemeStore((s) => s.isDarkMode);
  const toggleDarkMode = useThemeStore((s) => s.toggleDarkMode);
  const activePanelSection = useThemeStore((s) => s.activePanelSection);
  const setActivePanelSection = useThemeStore((s) => s.setActivePanelSection);
  const undo = useThemeStore((s) => s.undo);
  const redo = useThemeStore((s) => s.redo);
  const canUndo = useThemeStore((s) => s.canUndo);
  const canRedo = useThemeStore((s) => s.canRedo);
  const isPreviewMode = useThemeStore((s) => s.isPreviewMode);
  const setPreviewMode = useThemeStore((s) => s.setPreviewMode);

  const renderSection = () => {
    switch (activePanelSection) {
      case 'colors':
        return <ColorsSection />;
      case 'typography':
        return <TypographySection />;
      case 'spacing':
        return <SpacingSection />;
      case 'borderRadius':
        return <BorderRadiusSection />;
      case 'shadows':
        return <ShadowsSection />;
      case 'animations':
        return <AnimationsSection />;
      case 'presets':
        return <PresetsSection />;
      default:
        return <ColorsSection />;
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-gray-900 border-l border-gray-800',
        className
      )}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Theme</h2>
          <div className="flex items-center gap-1">
            {/* Preview Mode Toggle */}
            <button
              onClick={() => setPreviewMode(!isPreviewMode)}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                isPreviewMode
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
              title={isPreviewMode ? 'Exit Preview' : 'Preview Mode'}
            >
              {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Undo/Redo */}
            <button
              onClick={undo}
              disabled={!canUndo()}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo()}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Theme Info */}
        <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
          <div className="flex gap-1">
            {[
              currentTheme.colorPalette.colors.primary[500],
              currentTheme.colorPalette.colors.secondary[500],
              currentTheme.colorPalette.colors.accent[500],
            ].map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{currentTheme.name}</p>
            <p className="text-xs text-gray-500">
              {currentTheme.colorPalette.name} / {currentTheme.typography.name}
            </p>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex-shrink-0 p-2 border-b border-gray-800">
        <div className="flex flex-wrap gap-1">
          {PANEL_SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActivePanelSection(id)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                activePanelSection === id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Section Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanelSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer - Export/Import */}
      <div className="flex-shrink-0 p-4 border-t border-gray-800">
        <ExportImportPanel />
      </div>
    </div>
  );
}

export default ThemePanel;
