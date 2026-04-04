'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as Popover from '@radix-ui/react-popover';
import {
  Pipette,
  Copy,
  Check,
  Plus,
  X,
  ChevronDown,
  Palette,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsb,
  hsbToRgb,
  getRelativeLuminance,
  getComplementary,
  getAnalogous,
  getTriadic,
  type RGB,
  type HSL,
  type HSB,
} from '@/lib/colorSystem';
import { tailwindColors } from '@/lib/colorPalettes';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  showAlpha?: boolean;
  showPresets?: boolean;
  showHarmony?: boolean;
  className?: string;
  label?: string;
}

type ColorFormat = 'hex' | 'rgb' | 'hsl';

interface ColorState {
  hex: string;
  rgb: RGB;
  hsl: HSL;
  hsb: HSB;
  alpha: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const STORAGE_KEY_SAVED_COLORS = 'colorpicker-saved-colors';
const STORAGE_KEY_RECENT_COLORS = 'colorpicker-recent-colors';
const MAX_RECENT_COLORS = 8;
const MAX_SAVED_COLORS = 24;

const PRESET_TAILWIND_COLORS = ['slate', 'gray', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function parseColorToState(colorStr: string): ColorState {
  let hex = '#000000';
  let alpha = 1;

  const trimmed = colorStr.trim().toLowerCase();

  if (trimmed.startsWith('#')) {
    // Handle hex with or without alpha
    if (trimmed.length === 9) {
      hex = trimmed.substring(0, 7);
      alpha = parseInt(trimmed.substring(7, 9), 16) / 255;
    } else if (trimmed.length === 7) {
      hex = trimmed;
    } else if (trimmed.length === 4) {
      hex = `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`;
    }
  } else if (trimmed.startsWith('rgba')) {
    const match = trimmed.match(/rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
    if (match) {
      const rgb: RGB = { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
      hex = rgbToHex(rgb);
      alpha = parseFloat(match[4]);
    }
  } else if (trimmed.startsWith('rgb')) {
    const match = trimmed.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (match) {
      const rgb: RGB = { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
      hex = rgbToHex(rgb);
    }
  } else if (trimmed.startsWith('hsla')) {
    const match = trimmed.match(/hsla\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*,\s*([\d.]+)\s*\)/);
    if (match) {
      const hsl: HSL = { h: parseInt(match[1]), s: parseInt(match[2]), l: parseInt(match[3]) };
      const rgb = hslToRgb(hsl);
      hex = rgbToHex(rgb);
      alpha = parseFloat(match[4]);
    }
  } else if (trimmed.startsWith('hsl')) {
    const match = trimmed.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/);
    if (match) {
      const hsl: HSL = { h: parseInt(match[1]), s: parseInt(match[2]), l: parseInt(match[3]) };
      const rgb = hslToRgb(hsl);
      hex = rgbToHex(rgb);
    }
  }

  const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
  const hsl = rgbToHsl(rgb);
  const hsb = rgbToHsb(rgb);

  return { hex, rgb, hsl, hsb, alpha };
}

function formatColorOutput(state: ColorState, format: ColorFormat, includeAlpha: boolean): string {
  const { rgb, hsl, alpha, hex } = state;

  if (format === 'hex') {
    if (includeAlpha && alpha < 1) {
      const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
      return `${hex}${alphaHex}`;
    }
    return hex;
  }

  if (format === 'rgb') {
    if (includeAlpha && alpha < 1) {
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.toFixed(2)})`;
    }
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  if (format === 'hsl') {
    if (includeAlpha && alpha < 1) {
      return `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${alpha.toFixed(2)})`;
    }
    return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
  }

  return hex;
}

function calculateContrastRatio(color1: RGB, color2: RGB): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getContrastLevel(ratio: number): { aa: boolean; aaLarge: boolean; aaa: boolean; aaaLarge: boolean } {
  return {
    aa: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaa: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  };
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface SaturationBrightnessPanelProps {
  hsb: HSB;
  onChange: (hsb: HSB) => void;
}

function SaturationBrightnessPanel({ hsb, onChange }: SaturationBrightnessPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateColor = useCallback((clientX: number, clientY: number) => {
    if (!panelRef.current) return;

    const rect = panelRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    onChange({
      h: hsb.h,
      s: x * 100,
      b: (1 - y) * 100,
    });
  }, [hsb.h, onChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateColor(e.clientX, e.clientY);
  }, [updateColor]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateColor(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updateColor]);

  const hueColor = `hsl(${hsb.h}, 100%, 50%)`;
  const cursorX = (hsb.s / 100) * 100;
  const cursorY = (1 - hsb.b / 100) * 100;

  return (
    <div
      ref={panelRef}
      className="relative w-full h-40 rounded-lg cursor-crosshair overflow-hidden"
      style={{ backgroundColor: hueColor }}
      onMouseDown={handleMouseDown}
    >
      {/* White overlay (left to right) */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, white, transparent)' }}
      />
      {/* Black overlay (top to bottom) */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, transparent, black)' }}
      />
      {/* Cursor */}
      <div
        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full shadow-md pointer-events-none"
        style={{
          left: `${cursorX}%`,
          top: `${cursorY}%`,
          boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
}

interface HueSliderProps {
  hue: number;
  onChange: (hue: number) => void;
}

function HueSlider({ hue, onChange }: HueSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateHue = useCallback((clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onChange(x * 360);
  }, [onChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateHue(e.clientX);
  }, [updateHue]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateHue(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updateHue]);

  return (
    <div
      ref={sliderRef}
      className="relative h-3 rounded-full cursor-pointer"
      style={{
        background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="absolute top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full border-2 border-gray-300 shadow-md pointer-events-none"
        style={{ left: `${(hue / 360) * 100}%` }}
      />
    </div>
  );
}

interface AlphaSliderProps {
  alpha: number;
  color: string;
  onChange: (alpha: number) => void;
}

function AlphaSlider({ alpha, color, onChange }: AlphaSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateAlpha = useCallback((clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onChange(x);
  }, [onChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateAlpha(e.clientX);
  }, [updateAlpha]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateAlpha(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updateAlpha]);

  return (
    <div
      ref={sliderRef}
      className="relative h-3 rounded-full cursor-pointer overflow-hidden"
      style={{
        background: `linear-gradient(to right, transparent, ${color}), repeating-conic-gradient(#808080 0% 25%, #fff 0% 50%) 50% / 8px 8px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="absolute top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full border-2 border-gray-300 shadow-md pointer-events-none"
        style={{ left: `${alpha * 100}%` }}
      />
    </div>
  );
}

interface ColorInputFieldsProps {
  colorState: ColorState;
  format: ColorFormat;
  onColorChange: (state: ColorState) => void;
  onAlphaChange: (alpha: number) => void;
  showAlpha: boolean;
}

function ColorInputFields({ colorState, format, onColorChange, onAlphaChange, showAlpha }: ColorInputFieldsProps) {
  const { rgb, hsl, hex, alpha } = colorState;

  const handleHexChange = (value: string) => {
    const hexValue = value.startsWith('#') ? value : `#${value}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(hexValue)) {
      const newRgb = hexToRgb(hexValue);
      if (newRgb) {
        onColorChange({
          hex: hexValue.toLowerCase(),
          rgb: newRgb,
          hsl: rgbToHsl(newRgb),
          hsb: rgbToHsb(newRgb),
          alpha,
        });
      }
    }
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: string) => {
    const numValue = Math.max(0, Math.min(255, parseInt(value) || 0));
    const newRgb = { ...rgb, [channel]: numValue };
    onColorChange({
      hex: rgbToHex(newRgb),
      rgb: newRgb,
      hsl: rgbToHsl(newRgb),
      hsb: rgbToHsb(newRgb),
      alpha,
    });
  };

  const handleHslChange = (channel: 'h' | 's' | 'l', value: string) => {
    let numValue = parseInt(value) || 0;
    if (channel === 'h') {
      numValue = Math.max(0, Math.min(360, numValue));
    } else {
      numValue = Math.max(0, Math.min(100, numValue));
    }
    const newHsl = { ...hsl, [channel]: numValue };
    const newRgb = hslToRgb(newHsl);
    onColorChange({
      hex: rgbToHex(newRgb),
      rgb: newRgb,
      hsl: newHsl,
      hsb: rgbToHsb(newRgb),
      alpha,
    });
  };

  const inputClass = "w-full px-2 py-1 text-xs text-center bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500";

  return (
    <div className="grid gap-2">
      {format === 'hex' && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-gray-400 mb-1">HEX</label>
            <input
              type="text"
              value={hex.toUpperCase()}
              onChange={(e) => handleHexChange(e.target.value)}
              className={inputClass}
              maxLength={7}
            />
          </div>
          {showAlpha && (
            <div>
              <label className="block text-[10px] text-gray-400 mb-1">Alpha</label>
              <input
                type="number"
                value={Math.round(alpha * 100)}
                onChange={(e) => onAlphaChange(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) / 100)}
                className={inputClass}
                min={0}
                max={100}
              />
            </div>
          )}
        </div>
      )}

      {format === 'rgb' && (
        <div className={cn("grid gap-2", showAlpha ? "grid-cols-4" : "grid-cols-3")}>
          <div>
            <label className="block text-[10px] text-gray-400 mb-1">R</label>
            <input
              type="number"
              value={rgb.r}
              onChange={(e) => handleRgbChange('r', e.target.value)}
              className={inputClass}
              min={0}
              max={255}
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 mb-1">G</label>
            <input
              type="number"
              value={rgb.g}
              onChange={(e) => handleRgbChange('g', e.target.value)}
              className={inputClass}
              min={0}
              max={255}
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 mb-1">B</label>
            <input
              type="number"
              value={rgb.b}
              onChange={(e) => handleRgbChange('b', e.target.value)}
              className={inputClass}
              min={0}
              max={255}
            />
          </div>
          {showAlpha && (
            <div>
              <label className="block text-[10px] text-gray-400 mb-1">A</label>
              <input
                type="number"
                value={Math.round(alpha * 100)}
                onChange={(e) => onAlphaChange(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) / 100)}
                className={inputClass}
                min={0}
                max={100}
              />
            </div>
          )}
        </div>
      )}

      {format === 'hsl' && (
        <div className={cn("grid gap-2", showAlpha ? "grid-cols-4" : "grid-cols-3")}>
          <div>
            <label className="block text-[10px] text-gray-400 mb-1">H</label>
            <input
              type="number"
              value={Math.round(hsl.h)}
              onChange={(e) => handleHslChange('h', e.target.value)}
              className={inputClass}
              min={0}
              max={360}
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 mb-1">S</label>
            <input
              type="number"
              value={Math.round(hsl.s)}
              onChange={(e) => handleHslChange('s', e.target.value)}
              className={inputClass}
              min={0}
              max={100}
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 mb-1">L</label>
            <input
              type="number"
              value={Math.round(hsl.l)}
              onChange={(e) => handleHslChange('l', e.target.value)}
              className={inputClass}
              min={0}
              max={100}
            />
          </div>
          {showAlpha && (
            <div>
              <label className="block text-[10px] text-gray-400 mb-1">A</label>
              <input
                type="number"
                value={Math.round(alpha * 100)}
                onChange={(e) => onAlphaChange(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) / 100)}
                className={inputClass}
                min={0}
                max={100}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ContrastCheckerProps {
  rgb: RGB;
}

function ContrastChecker({ rgb }: ContrastCheckerProps) {
  const white: RGB = { r: 255, g: 255, b: 255 };
  const black: RGB = { r: 0, g: 0, b: 0 };

  const whiteRatio = calculateContrastRatio(rgb, white);
  const blackRatio = calculateContrastRatio(rgb, black);

  const whiteLevels = getContrastLevel(whiteRatio);
  const blackLevels = getContrastLevel(blackRatio);

  const ContrastBadge = ({ passed, label }: { passed: boolean; label: string }) => (
    <span
      className={cn(
        "px-1.5 py-0.5 text-[10px] font-medium rounded",
        passed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
      )}
    >
      {label}
    </span>
  );

  return (
    <div className="space-y-2">
      <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Contrast Check</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-white rounded text-center">
          <div className="text-xs font-medium text-gray-900 mb-1">White</div>
          <div className="text-[10px] text-gray-600 mb-1">{whiteRatio.toFixed(2)}:1</div>
          <div className="flex gap-1 justify-center flex-wrap">
            <ContrastBadge passed={whiteLevels.aa} label="AA" />
            <ContrastBadge passed={whiteLevels.aaa} label="AAA" />
          </div>
        </div>
        <div className="p-2 bg-black rounded text-center">
          <div className="text-xs font-medium text-white mb-1">Black</div>
          <div className="text-[10px] text-gray-400 mb-1">{blackRatio.toFixed(2)}:1</div>
          <div className="flex gap-1 justify-center flex-wrap">
            <ContrastBadge passed={blackLevels.aa} label="AA" />
            <ContrastBadge passed={blackLevels.aaa} label="AAA" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface HarmonySuggestionsProps {
  rgb: RGB;
  onSelect: (color: string) => void;
}

function HarmonySuggestions({ rgb, onSelect }: HarmonySuggestionsProps) {
  const complementary = getComplementary(rgb);
  const analogous = getAnalogous(rgb);
  const triadic = getTriadic(rgb);

  const HarmonyRow = ({ label, colors }: { label: string; colors: RGB[] }) => (
    <div>
      <div className="text-[10px] text-gray-400 mb-1">{label}</div>
      <div className="flex gap-1">
        {colors.map((color, i) => {
          const hex = rgbToHex(color);
          return (
            <button
              key={i}
              onClick={() => onSelect(hex)}
              className="w-6 h-6 rounded border border-gray-600 hover:border-blue-500 transition-colors"
              style={{ backgroundColor: hex }}
              title={hex}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Color Harmony</div>
      <div className="space-y-2">
        <HarmonyRow label="Complementary" colors={complementary} />
        <HarmonyRow label="Analogous" colors={analogous} />
        <HarmonyRow label="Triadic" colors={triadic} />
      </div>
    </div>
  );
}

interface TailwindPresetsProps {
  onSelect: (color: string) => void;
}

function TailwindPresets({ onSelect }: TailwindPresetsProps) {
  const [expandedColor, setExpandedColor] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Tailwind Colors</div>
      {expandedColor ? (
        <div>
          <button
            onClick={() => setExpandedColor(null)}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mb-2"
          >
            <ChevronDown className="w-3 h-3 rotate-90" />
            {expandedColor}
          </button>
          <div className="grid grid-cols-11 gap-1">
            {Object.entries(tailwindColors[expandedColor] || {}).map(([shade, hex]) => (
              <button
                key={shade}
                onClick={() => onSelect(hex)}
                className="w-5 h-5 rounded border border-gray-600 hover:border-blue-500 transition-colors"
                style={{ backgroundColor: hex }}
                title={`${expandedColor}-${shade}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-9 gap-1">
          {PRESET_TAILWIND_COLORS.map((colorName) => {
            const hex = tailwindColors[colorName]?.['500'] || '#000';
            return (
              <button
                key={colorName}
                onClick={() => setExpandedColor(colorName)}
                className="w-5 h-5 rounded border border-gray-600 hover:border-blue-500 transition-colors"
                style={{ backgroundColor: hex }}
                title={colorName}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ColorPicker({
  value,
  onChange,
  showAlpha = true,
  showPresets = true,
  showHarmony = true,
  className,
  label,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ColorFormat>('hex');
  const [copied, setCopied] = useState(false);
  const [colorState, setColorState] = useState<ColorState>(() => parseColorToState(value));
  const [savedColors, setSavedColors] = useState<string[]>([]);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [eyeDropperSupported, setEyeDropperSupported] = useState(false);

  // Check for EyeDropper API support
  useEffect(() => {
    setEyeDropperSupported('EyeDropper' in window);
  }, []);

  // Load saved and recent colors from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED_COLORS);
      const recent = localStorage.getItem(STORAGE_KEY_RECENT_COLORS);
      if (saved) setSavedColors(JSON.parse(saved));
      if (recent) setRecentColors(JSON.parse(recent));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Sync with external value changes
  useEffect(() => {
    const newState = parseColorToState(value);
    setColorState(newState);
  }, [value]);

  const currentColorOutput = useMemo(() => {
    return formatColorOutput(colorState, format, showAlpha);
  }, [colorState, format, showAlpha]);

  const handleColorChange = useCallback((newState: ColorState) => {
    setColorState(newState);
    const output = formatColorOutput(newState, format, showAlpha);
    onChange(output);
  }, [format, showAlpha, onChange]);

  const handleHsbChange = useCallback((hsb: HSB) => {
    const rgb = hsbToRgb(hsb);
    const newState: ColorState = {
      hex: rgbToHex(rgb),
      rgb,
      hsl: rgbToHsl(rgb),
      hsb,
      alpha: colorState.alpha,
    };
    handleColorChange(newState);
  }, [colorState.alpha, handleColorChange]);

  const handleHueChange = useCallback((hue: number) => {
    handleHsbChange({ ...colorState.hsb, h: hue });
  }, [colorState.hsb, handleHsbChange]);

  const handleAlphaChange = useCallback((alpha: number) => {
    const newState = { ...colorState, alpha };
    handleColorChange(newState);
  }, [colorState, handleColorChange]);

  const handleSelectColor = useCallback((hex: string) => {
    const newState = parseColorToState(hex);
    newState.alpha = colorState.alpha;
    handleColorChange(newState);
  }, [colorState.alpha, handleColorChange]);

  const handleEyeDropper = useCallback(async () => {
    if (!eyeDropperSupported) return;

    try {
      // @ts-expect-error - EyeDropper API is not yet in TypeScript DOM types
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      handleSelectColor(result.sRGBHex);
    } catch {
      // User cancelled or error
    }
  }, [eyeDropperSupported, handleSelectColor]);

  const handleCopyColor = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentColorOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied
    }
  }, [currentColorOutput]);

  const handleAddToSaved = useCallback(() => {
    const hex = colorState.hex;
    if (!savedColors.includes(hex)) {
      const newSaved = [hex, ...savedColors].slice(0, MAX_SAVED_COLORS);
      setSavedColors(newSaved);
      try {
        localStorage.setItem(STORAGE_KEY_SAVED_COLORS, JSON.stringify(newSaved));
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [colorState.hex, savedColors]);

  const handleRemoveSaved = useCallback((hex: string, e: React.MouseEvent) => {
    e.preventDefault();
    const newSaved = savedColors.filter((c) => c !== hex);
    setSavedColors(newSaved);
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_COLORS, JSON.stringify(newSaved));
    } catch {
      // Ignore localStorage errors
    }
  }, [savedColors]);

  const addToRecent = useCallback((hex: string) => {
    const newRecent = [hex, ...recentColors.filter((c) => c !== hex)].slice(0, MAX_RECENT_COLORS);
    setRecentColors(newRecent);
    try {
      localStorage.setItem(STORAGE_KEY_RECENT_COLORS, JSON.stringify(newRecent));
    } catch {
      // Ignore localStorage errors
    }
  }, [recentColors]);

  // Add to recent when popover closes
  useEffect(() => {
    if (!open && colorState.hex) {
      addToRecent(colorState.hex);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayColor = colorState.alpha < 1
    ? `rgba(${colorState.rgb.r}, ${colorState.rgb.g}, ${colorState.rgb.b}, ${colorState.alpha})`
    : colorState.hex;

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="block text-xs font-medium text-gray-400">
          {label}
        </label>
      )}
      <Popover.Root open={open} onOpenChange={setOpen}>
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
              className="w-6 h-6 rounded border border-gray-600 flex-shrink-0"
              style={{
                backgroundColor: displayColor,
                backgroundImage: colorState.alpha < 1
                  ? 'repeating-conic-gradient(#808080 0% 25%, #fff 0% 50%) 50% / 8px 8px'
                  : undefined,
              }}
            >
              {colorState.alpha < 1 && (
                <div
                  className="w-full h-full rounded"
                  style={{ backgroundColor: displayColor }}
                />
              )}
            </div>
            <span className="flex-1 text-left truncate font-mono text-xs">
              {currentColorOutput}
            </span>
            <Palette className="w-4 h-4 text-gray-400" />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className={cn(
              'w-72 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl',
              'z-50 max-h-[90vh] overflow-y-auto'
            )}
            sideOffset={5}
            align="start"
          >
            {/* Color Preview & Actions Row */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-10 h-10 rounded-lg border border-gray-600 flex-shrink-0"
                style={{
                  backgroundColor: displayColor,
                  backgroundImage: colorState.alpha < 1
                    ? 'repeating-conic-gradient(#808080 0% 25%, #fff 0% 50%) 50% / 8px 8px'
                    : undefined,
                }}
              >
                {colorState.alpha < 1 && (
                  <div
                    className="w-full h-full rounded-lg"
                    style={{ backgroundColor: displayColor }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white font-mono truncate">{currentColorOutput}</div>
                <div className="text-[10px] text-gray-400">
                  {format.toUpperCase()}{showAlpha && colorState.alpha < 1 ? 'A' : ''}
                </div>
              </div>
              <div className="flex gap-1">
                {eyeDropperSupported && (
                  <button
                    onClick={handleEyeDropper}
                    className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors"
                    title="Pick color from screen"
                  >
                    <Pipette className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleCopyColor}
                  className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors"
                  title="Copy color"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleAddToSaved}
                  className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors"
                  title="Save color"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Saturation/Brightness Panel */}
            <div className="mb-3">
              <SaturationBrightnessPanel
                hsb={colorState.hsb}
                onChange={handleHsbChange}
              />
            </div>

            {/* Hue Slider */}
            <div className="mb-3">
              <HueSlider hue={colorState.hsb.h} onChange={handleHueChange} />
            </div>

            {/* Alpha Slider */}
            {showAlpha && (
              <div className="mb-3">
                <AlphaSlider
                  alpha={colorState.alpha}
                  color={colorState.hex}
                  onChange={handleAlphaChange}
                />
              </div>
            )}

            {/* Format Tabs */}
            <div className="flex gap-1 mb-3">
              {(['hex', 'rgb', 'hsl'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={cn(
                    'flex-1 py-1 text-xs font-medium rounded transition-colors',
                    format === f
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  )}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Input Fields */}
            <div className="mb-3">
              <ColorInputFields
                colorState={colorState}
                format={format}
                onColorChange={handleColorChange}
                onAlphaChange={handleAlphaChange}
                showAlpha={showAlpha}
              />
            </div>

            {/* Recent Colors */}
            {recentColors.length > 0 && (
              <div className="mb-3">
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">Recent</div>
                <div className="flex gap-1 flex-wrap">
                  {recentColors.map((hex) => (
                    <button
                      key={hex}
                      onClick={() => handleSelectColor(hex)}
                      className="w-5 h-5 rounded border border-gray-600 hover:border-blue-500 transition-colors"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Saved Colors */}
            {savedColors.length > 0 && (
              <div className="mb-3">
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">Saved</div>
                <div className="flex gap-1 flex-wrap">
                  {savedColors.map((hex) => (
                    <button
                      key={hex}
                      onClick={() => handleSelectColor(hex)}
                      onContextMenu={(e) => handleRemoveSaved(hex, e)}
                      className="w-5 h-5 rounded border border-gray-600 hover:border-blue-500 transition-colors relative group"
                      style={{ backgroundColor: hex }}
                      title={`${hex} (right-click to remove)`}
                    >
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full hidden group-hover:flex items-center justify-center">
                        <X className="w-2 h-2 text-white" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tailwind Presets */}
            {showPresets && (
              <div className="mb-3">
                <TailwindPresets onSelect={handleSelectColor} />
              </div>
            )}

            {/* Harmony Suggestions */}
            {showHarmony && (
              <div className="mb-3">
                <HarmonySuggestions rgb={colorState.rgb} onSelect={handleSelectColor} />
              </div>
            )}

            {/* Contrast Checker */}
            <ContrastChecker rgb={colorState.rgb} />

            <Popover.Arrow className="fill-gray-700" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <style jsx global>{`
        .bg-checkered {
          background-image: linear-gradient(45deg, #374151 25%, transparent 25%),
            linear-gradient(-45deg, #374151 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #374151 75%),
            linear-gradient(-45deg, transparent 75%, #374151 75%);
          background-size: 8px 8px;
          background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// LEGACY EXPORTS FOR BACKWARD COMPATIBILITY
// =============================================================================

// Color hex map for backward compatibility
export const colorHexMap: Record<string, Record<string, string>> = tailwindColors;

// Quick color select component (simplified version)
interface QuickColorSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: 'bg' | 'text' | 'border';
  className?: string;
}

export function QuickColorSelect({
  label,
  value,
  onChange,
  prefix = 'bg',
  className,
}: QuickColorSelectProps) {
  const quickColors = [
    'white',
    'black',
    'gray-500',
    'red-500',
    'orange-500',
    'yellow-500',
    'green-500',
    'blue-500',
    'indigo-500',
    'purple-500',
    'pink-500',
  ];

  const getHex = (color: string): string => {
    if (color === 'white') return '#ffffff';
    if (color === 'black') return '#000000';
    const [name, shade] = color.split('-');
    return tailwindColors[name]?.[shade] || '#9ca3af';
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-xs font-medium text-gray-400">
        {label}
      </label>
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => onChange('')}
          className={cn(
            'w-6 h-6 rounded border-2 bg-checkered',
            !value ? 'border-blue-500' : 'border-gray-600 hover:border-gray-500'
          )}
          title="None"
        />
        {quickColors.map((color) => {
          const colorClass = `${prefix}-${color}`;
          const hex = getHex(color);

          return (
            <button
              key={color}
              onClick={() => onChange(colorClass)}
              className={cn(
                'w-6 h-6 rounded border-2',
                value === colorClass
                  ? 'border-blue-500 ring-2 ring-blue-500/50'
                  : 'border-gray-600 hover:border-gray-500'
              )}
              style={{ backgroundColor: hex }}
              title={color}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ColorPicker;
