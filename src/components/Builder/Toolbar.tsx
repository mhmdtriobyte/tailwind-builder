'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Tooltip from '@radix-ui/react-tooltip';
import toast from 'react-hot-toast';
import {
  Undo2,
  Redo2,
  Grid3X3,
  Code2,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
  Layers,
  Save,
  Upload,
  Copy,
  FileCode,
  FileCode2,
  FolderDown,
  ChevronDown,
  Monitor,
  Tablet,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useBuilderStore } from '@/store/builderStore';
import { useCodeGenerator } from '@/hooks/useCodeGenerator';
import { exportToFile, exportProject, copyToClipboard } from '@/utils/export';
import type { ViewportType } from '@/types/builder';

// ============================================================================
// CONSTANTS
// ============================================================================

const ZOOM_LEVELS = [50, 75, 100, 125, 150];

const VIEWPORT_OPTIONS: { type: ViewportType; icon: LucideIcon; label: string; width: string }[] = [
  { type: 'desktop', icon: Monitor, label: 'Desktop', width: '100%' },
  { type: 'tablet', icon: Tablet, label: 'Tablet', width: '768px' },
  { type: 'mobile', icon: Smartphone, label: 'Mobile', width: '375px' },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface ToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

function ToolbarButton({
  icon: Icon,
  label,
  shortcut,
  onClick,
  active,
  disabled,
  className,
}: ToolbarButtonProps) {
  const tooltipContent = shortcut ? `${label} (${shortcut})` : label;

  return (
    <Tooltip.Root delayDuration={300}>
      <Tooltip.Trigger asChild>
        <button
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'p-2 rounded-lg transition-all duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
            active
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800',
            disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-gray-400',
            className
          )}
        >
          <Icon className="w-4 h-4" />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className={cn(
            'px-3 py-1.5 text-sm bg-gray-800 text-white rounded-lg',
            'shadow-xl border border-gray-700',
            'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'
          )}
          sideOffset={8}
        >
          <span>{tooltipContent}</span>
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-gray-700 mx-1" />;
}

interface ViewportButtonsProps {
  viewport: ViewportType;
  onViewportChange: (viewport: ViewportType) => void;
}

function ViewportButtons({ viewport, onViewportChange }: ViewportButtonsProps) {
  return (
    <div className="flex items-center gap-0.5 bg-gray-800 rounded-lg p-1">
      {VIEWPORT_OPTIONS.map(({ type, icon: Icon, label, width }) => {
        const isActive = viewport === type;
        return (
          <Tooltip.Root key={type} delayDuration={300}>
            <Tooltip.Trigger asChild>
              <button
                onClick={() => onViewportChange(type)}
                className={cn(
                  'p-1.5 rounded-md transition-all duration-150',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                )}
              >
                <Icon className="w-4 h-4" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded-lg shadow-xl border border-gray-700"
                sideOffset={8}
              >
                <span>{label} ({width})</span>
                <Tooltip.Arrow className="fill-gray-800" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        );
      })}
    </div>
  );
}

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

function ZoomControls({ zoom, onZoomChange }: ZoomControlsProps) {
  const handleZoomIn = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      onZoomChange(ZOOM_LEVELS[currentIndex + 1]);
    } else if (zoom < 200) {
      onZoomChange(Math.min(zoom + 25, 200));
    }
  };

  const handleZoomOut = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex > 0) {
      onZoomChange(ZOOM_LEVELS[currentIndex - 1]);
    } else if (zoom > 25) {
      onZoomChange(Math.max(zoom - 25, 25));
    }
  };

  return (
    <div className="flex items-center gap-1 bg-gray-800 rounded-lg px-1 py-0.5">
      <ToolbarButton
        icon={ZoomOut}
        label="Zoom Out"
        onClick={handleZoomOut}
        disabled={zoom <= 25}
      />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-md',
              'text-sm text-gray-300 font-medium min-w-[3.5rem] justify-center',
              'hover:bg-gray-700 transition-colors duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50'
            )}
          >
            {zoom}%
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={cn(
              'min-w-[100px] bg-gray-800 rounded-lg p-1',
              'shadow-xl border border-gray-700',
              'animate-in fade-in-0 zoom-in-95'
            )}
            sideOffset={8}
          >
            {ZOOM_LEVELS.map((level) => (
              <DropdownMenu.Item
                key={level}
                onClick={() => onZoomChange(level)}
                className={cn(
                  'flex items-center justify-center px-3 py-1.5 rounded-md cursor-pointer',
                  'text-sm text-gray-300 outline-none',
                  'hover:bg-gray-700 hover:text-white',
                  'focus:bg-gray-700 focus:text-white',
                  zoom === level && 'bg-blue-600/20 text-blue-400'
                )}
              >
                {level}%
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <ToolbarButton
        icon={ZoomIn}
        label="Zoom In"
        onClick={handleZoomIn}
        disabled={zoom >= 200}
      />
    </div>
  );
}

interface ExportDropdownProps {
  onCopyJSX: () => void;
  onCopyTSX: () => void;
  onDownloadJSX: () => void;
  onDownloadTSX: () => void;
  onDownloadProject: () => void;
}

function ExportDropdown({
  onCopyJSX,
  onCopyTSX,
  onDownloadJSX,
  onDownloadTSX,
  onDownloadProject,
}: ExportDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-lg',
            'text-sm text-gray-300 font-medium',
            'hover:bg-gray-800 hover:text-white transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50'
          )}
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
          <ChevronDown className="w-3 h-3 text-gray-500" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            'min-w-[200px] bg-gray-800 rounded-lg p-1',
            'shadow-xl border border-gray-700',
            'animate-in fade-in-0 zoom-in-95'
          )}
          sideOffset={8}
          align="end"
        >
          <DropdownMenu.Label className="px-3 py-1.5 text-xs text-gray-500 font-medium">
            Copy to Clipboard
          </DropdownMenu.Label>
          <DropdownMenu.Item
            onClick={onCopyJSX}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer',
              'text-sm text-gray-300 outline-none',
              'hover:bg-gray-700 hover:text-white',
              'focus:bg-gray-700 focus:text-white'
            )}
          >
            <Copy className="w-4 h-4" />
            <span>Copy JSX</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={onCopyTSX}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer',
              'text-sm text-gray-300 outline-none',
              'hover:bg-gray-700 hover:text-white',
              'focus:bg-gray-700 focus:text-white'
            )}
          >
            <Copy className="w-4 h-4" />
            <span>Copy TSX</span>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-gray-700 my-1" />

          <DropdownMenu.Label className="px-3 py-1.5 text-xs text-gray-500 font-medium">
            Download Files
          </DropdownMenu.Label>
          <DropdownMenu.Item
            onClick={onDownloadJSX}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer',
              'text-sm text-gray-300 outline-none',
              'hover:bg-gray-700 hover:text-white',
              'focus:bg-gray-700 focus:text-white'
            )}
          >
            <FileCode className="w-4 h-4" />
            <span>Download JSX</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={onDownloadTSX}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer',
              'text-sm text-gray-300 outline-none',
              'hover:bg-gray-700 hover:text-white',
              'focus:bg-gray-700 focus:text-white'
            )}
          >
            <FileCode2 className="w-4 h-4" />
            <span>Download TSX</span>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-gray-700 my-1" />

          <DropdownMenu.Item
            onClick={onDownloadProject}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer',
              'text-sm text-gray-300 outline-none',
              'hover:bg-gray-700 hover:text-white',
              'focus:bg-gray-700 focus:text-white'
            )}
          >
            <FolderDown className="w-4 h-4" />
            <span>Download Project</span>
            <span className="ml-auto text-xs text-gray-500">.zip</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function Toolbar() {
  const {
    elements,
    viewport,
    setViewport,
    zoom,
    setZoom,
    showGrid,
    toggleGrid,
    showCodePreview,
    toggleCodePreview,
    undo,
    redo,
    clearCanvas,
    saveToStorage,
    loadFromStorage,
    history,
    historyIndex,
  } = useBuilderStore();

  const { jsx, tsx } = useCodeGenerator(elements, 'GeneratedComponent');
  const [isSaving, setIsSaving] = useState(false);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Export handlers
  const handleCopyJSX = useCallback(async () => {
    try {
      await copyToClipboard(jsx);
      toast.success('JSX copied to clipboard');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  }, [jsx]);

  const handleCopyTSX = useCallback(async () => {
    try {
      await copyToClipboard(tsx);
      toast.success('TSX copied to clipboard');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  }, [tsx]);

  const handleDownloadJSX = useCallback(async () => {
    try {
      await exportToFile(jsx, 'GeneratedComponent.jsx');
      toast.success('JSX file downloaded');
    } catch {
      toast.error('Failed to download file');
    }
  }, [jsx]);

  const handleDownloadTSX = useCallback(async () => {
    try {
      await exportToFile(tsx, 'GeneratedComponent.tsx');
      toast.success('TSX file downloaded');
    } catch {
      toast.error('Failed to download file');
    }
  }, [tsx]);

  const handleDownloadProject = useCallback(async () => {
    try {
      await exportProject(elements, tsx, {
        format: 'tsx',
        includeImports: true,
        componentName: 'GeneratedComponent',
      });
      toast.success('Project downloaded');
    } catch {
      toast.error('Failed to download project');
    }
  }, [elements, tsx]);

  // Save/Load handlers
  const handleSave = useCallback(() => {
    setIsSaving(true);
    try {
      saveToStorage();
      toast.success('Canvas saved');
    } catch {
      toast.error('Failed to save canvas');
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  }, [saveToStorage]);

  const handleLoad = useCallback(() => {
    try {
      loadFromStorage();
      toast.success('Canvas loaded');
    } catch {
      toast.error('Failed to load canvas');
    }
  }, [loadFromStorage]);

  // Clear canvas with confirmation
  const handleClearCanvas = useCallback(() => {
    if (elements.length === 0) {
      toast.error('Canvas is already empty');
      return;
    }

    if (window.confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
      clearCanvas();
      toast.success('Canvas cleared');
    }
  }, [elements.length, clearCanvas]);

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className="h-14 bg-gray-900 border-b border-gray-800 px-4 flex items-center justify-between">
        {/* Left section - Logo & Navigation */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              'bg-gradient-to-br from-blue-500 to-purple-600',
              'shadow-lg shadow-blue-500/20',
              'group-hover:shadow-blue-500/40 transition-shadow duration-300'
            )}>
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg hidden lg:block">
              Tailwind Builder
            </span>
          </Link>

          <ToolbarDivider />

          {/* Undo/Redo */}
          <div className="flex items-center gap-0.5">
            <ToolbarButton
              icon={Undo2}
              label="Undo"
              shortcut="Ctrl+Z"
              onClick={undo}
              disabled={!canUndo}
            />
            <ToolbarButton
              icon={Redo2}
              label="Redo"
              shortcut="Ctrl+Shift+Z"
              onClick={redo}
              disabled={!canRedo}
            />
          </div>
        </div>

        {/* Center section - Viewport & View Controls */}
        <div className="flex items-center gap-3">
          <ViewportButtons
            viewport={viewport}
            onViewportChange={setViewport}
          />

          <ToolbarDivider />

          <ZoomControls
            zoom={zoom}
            onZoomChange={setZoom}
          />

          <ToolbarDivider />

          <div className="flex items-center gap-0.5">
            <ToolbarButton
              icon={Grid3X3}
              label="Toggle Grid"
              shortcut="Ctrl+G"
              active={showGrid}
              onClick={toggleGrid}
            />
            <ToolbarButton
              icon={Code2}
              label="Toggle Code Preview"
              shortcut="Ctrl+Shift+C"
              active={showCodePreview}
              onClick={toggleCodePreview}
            />
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-2">
          <ToolbarButton
            icon={Trash2}
            label="Clear Canvas"
            onClick={handleClearCanvas}
          />

          <ToolbarDivider />

          <ExportDropdown
            onCopyJSX={handleCopyJSX}
            onCopyTSX={handleCopyTSX}
            onDownloadJSX={handleDownloadJSX}
            onDownloadTSX={handleDownloadTSX}
            onDownloadProject={handleDownloadProject}
          />

          <ToolbarDivider />

          <div className="flex items-center gap-0.5">
            <ToolbarButton
              icon={Save}
              label="Save Canvas"
              shortcut="Ctrl+S"
              onClick={handleSave}
              className={isSaving ? 'animate-pulse' : ''}
            />
            <ToolbarButton
              icon={Upload}
              label="Load Canvas"
              onClick={handleLoad}
            />
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
}

export default Toolbar;
