'use client';

import { Monitor, Tablet, Smartphone, ZoomIn, ZoomOut, Grid } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';
import { cn } from '@/utils/cn';
import type { ViewportType } from '@/types/builder';

interface ViewportSwitcherProps {
  className?: string;
}

interface ViewportOption {
  type: ViewportType;
  icon: typeof Monitor;
  label: string;
  width: string;
}

const VIEWPORT_OPTIONS: ViewportOption[] = [
  { type: 'desktop', icon: Monitor, label: 'Desktop', width: '100%' },
  { type: 'tablet', icon: Tablet, label: 'Tablet', width: '768px' },
  { type: 'mobile', icon: Smartphone, label: 'Mobile', width: '375px' },
];

const ZOOM_LEVELS = [50, 75, 100, 125, 150];

export function ViewportSwitcher({ className }: ViewportSwitcherProps) {
  const {
    viewport,
    zoom,
    showGrid,
    setViewport,
    setZoom,
    toggleGrid,
  } = useBuilderStore();

  const handleZoomIn = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      setZoom(ZOOM_LEVELS[currentIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex > 0) {
      setZoom(ZOOM_LEVELS[currentIndex - 1]);
    }
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setZoom(parseInt(e.target.value, 10));
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 py-2 bg-gray-800 border-b border-gray-700",
        className
      )}
    >
      {/* Viewport switcher */}
      <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1">
        {VIEWPORT_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = viewport === option.type;

          return (
            <button
              key={option.type}
              onClick={() => setViewport(option.type)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors duration-150",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
              )}
              title={`${option.label} (${option.width})`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Viewport width indicator */}
      <div className="text-sm text-gray-500 hidden md:block">
        {VIEWPORT_OPTIONS.find((v) => v.type === viewport)?.width}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Grid toggle */}
      <button
        onClick={toggleGrid}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors duration-150",
          showGrid
            ? "bg-gray-700 text-white"
            : "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
        )}
        title={showGrid ? 'Hide grid' : 'Show grid'}
      >
        <Grid className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">
          Grid
        </span>
      </button>

      {/* Zoom controls */}
      <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-1">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= ZOOM_LEVELS[0]}
          className={cn(
            "p-1.5 rounded-md transition-colors duration-150",
            zoom <= ZOOM_LEVELS[0]
              ? "text-gray-600 cursor-not-allowed"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
          )}
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <select
          value={zoom}
          onChange={handleZoomChange}
          className={cn(
            "bg-transparent text-sm font-medium text-gray-300",
            "border-none outline-none cursor-pointer",
            "appearance-none text-center w-16"
          )}
          title="Zoom level"
        >
          {ZOOM_LEVELS.map((level) => (
            <option key={level} value={level} className="bg-gray-800">
              {level}%
            </option>
          ))}
        </select>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
          className={cn(
            "p-1.5 rounded-md transition-colors duration-150",
            zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]
              ? "text-gray-600 cursor-not-allowed"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
          )}
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Compact variant for toolbar integration
export function ViewportSwitcherCompact({ className }: ViewportSwitcherProps) {
  const { viewport, setViewport } = useBuilderStore();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 bg-gray-900 rounded-lg p-0.5",
        className
      )}
    >
      {VIEWPORT_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = viewport === option.type;

        return (
          <button
            key={option.type}
            onClick={() => setViewport(option.type)}
            className={cn(
              "p-1.5 rounded transition-colors duration-150",
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
            )}
            title={`${option.label} (${option.width})`}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}

// Zoom controls only component
export function ZoomControls({ className }: { className?: string }) {
  const { zoom, setZoom } = useBuilderStore();

  const handleZoomIn = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      setZoom(ZOOM_LEVELS[currentIndex + 1]);
    } else {
      // Allow custom zoom beyond predefined levels
      setZoom(Math.min(zoom + 25, 200));
    }
  };

  const handleZoomOut = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex > 0) {
      setZoom(ZOOM_LEVELS[currentIndex - 1]);
    } else {
      // Allow custom zoom below predefined levels
      setZoom(Math.max(zoom - 25, 25));
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 bg-gray-900 rounded-lg p-1",
        className
      )}
    >
      <button
        onClick={handleZoomOut}
        disabled={zoom <= 25}
        className={cn(
          "p-1 rounded transition-colors duration-150",
          zoom <= 25
            ? "text-gray-600 cursor-not-allowed"
            : "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
        )}
        title="Zoom out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <span className="text-xs font-medium text-gray-300 w-12 text-center">
        {zoom}%
      </span>

      <button
        onClick={handleZoomIn}
        disabled={zoom >= 200}
        className={cn(
          "p-1 rounded transition-colors duration-150",
          zoom >= 200
            ? "text-gray-600 cursor-not-allowed"
            : "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
        )}
        title="Zoom in"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
    </div>
  );
}

export default ViewportSwitcher;
