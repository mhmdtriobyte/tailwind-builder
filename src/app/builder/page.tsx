'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Toolbar } from '@/components/Builder/Toolbar';
import { ComponentSidebar } from '@/components/Builder/ComponentSidebar';
import { Canvas } from '@/components/Builder/Canvas';
import { PropertiesPanel } from '@/components/Builder/PropertiesPanel';
import { CodePreview } from '@/components/Builder/CodePreview';
import { CommandPalette, useCommandPalette } from '@/components/Builder/CommandPalette';
import { ShortcutsModal } from '@/components/Builder/ShortcutsModal';
import { TokenEditor } from '@/components/Builder/TokenEditor';
import {
  ThemePanel,
  AnimationPanel,
  ResponsivePanel,
  TemplateGallery,
  ExportPanel,
  HistoryPanel,
  AccessibilityPanel,
  SettingsModal,
} from '@/components/Panels';
import { useDragDrop } from '@/hooks/useDragDrop';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useBuilderStore } from '@/store/builderStore';
import { useCustomizationStore } from '@/store/customizationStore';
import { cn } from '@/utils/cn';
import {
  Sliders,
  Palette,
  Sparkles,
  Smartphone,
  Accessibility,
  Coins,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { BuilderElement } from '@/types/builder';

// ============================================================================
// CONSTANTS
// ============================================================================

const RIGHT_PANEL_TABS = [
  { id: 'properties', label: 'Properties', icon: Sliders },
  { id: 'styles', label: 'Styles', icon: Palette },
  { id: 'animation', label: 'Animation', icon: Sparkles },
  { id: 'responsive', label: 'Responsive', icon: Smartphone },
  { id: 'accessibility', label: 'A11y', icon: Accessibility },
  { id: 'tokens', label: 'Tokens', icon: Coins },
] as const;

type RightPanelTab = (typeof RIGHT_PANEL_TABS)[number]['id'];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Drag overlay component shown during drag operations
 * Shows a preview of the component being dragged
 */
function DragOverlayContent({ activeElement }: { activeElement: BuilderElement | null }) {
  if (!activeElement) return null;

  return (
    <div
      className={cn(
        'px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl',
        'text-sm text-white font-medium',
        'pointer-events-none opacity-90',
        'transform rotate-2'
      )}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <span>{activeElement.name || activeElement.type}</span>
      </div>
    </div>
  );
}

/**
 * Tab button for the right panel
 */
interface TabButtonProps {
  tab: (typeof RIGHT_PANEL_TABS)[number];
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ tab, isActive, onClick }: TabButtonProps) {
  const Icon = tab.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 px-2 py-2 rounded-lg',
        'text-[10px] font-medium transition-colors',
        isActive
          ? 'bg-blue-600/20 text-blue-400'
          : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
      )}
      title={tab.label}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden xl:block">{tab.label}</span>
    </button>
  );
}

/**
 * Enhanced right sidebar with multiple panels
 */
interface RightSidebarProps {
  activeTab: RightPanelTab;
  onTabChange: (tab: RightPanelTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

function RightSidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
}: RightSidebarProps) {
  // Collapsed state
  if (collapsed) {
    return (
      <div className="w-14 bg-gray-900 border-l border-gray-800 flex flex-col">
        <button
          onClick={onToggleCollapse}
          className={cn(
            'p-3 text-blue-400 hover:text-white hover:bg-blue-600',
            'border-b border-gray-800 transition-colors',
            'flex items-center justify-center'
          )}
          title="Expand panel (click to show)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex flex-col items-center py-2 gap-1">
          {RIGHT_PANEL_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  onToggleCollapse();
                }}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  activeTab === tab.id
                    ? 'text-blue-400 bg-blue-600/20'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                )}
                title={tab.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex items-center justify-between px-2 py-2 border-b border-gray-800">
        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {RIGHT_PANEL_TABS.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
            />
          ))}
        </div>
        <button
          onClick={onToggleCollapse}
          className="flex-shrink-0 ml-2 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
          title="Collapse panel (click to hide)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'properties' && <PropertiesPanel />}

        {activeTab === 'styles' && (
          <div className="p-4">
            <ThemePanel />
          </div>
        )}

        {activeTab === 'animation' && (
          <div className="p-4">
            <AnimationPanel />
          </div>
        )}

        {activeTab === 'responsive' && (
          <div className="p-4">
            <ResponsivePanel />
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div className="p-4">
            <AccessibilityPanel />
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="h-full">
            <TokenEditor className="h-full" />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Main Builder Page Component
 *
 * This is the core visual builder interface that allows users to:
 * - Drag components from the sidebar onto the canvas
 * - Select and edit element properties
 * - Preview responsive designs
 * - Export generated code
 */
export default function BuilderPage() {
  // Initialize sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activation
      },
    })
  );

  // Custom drag and drop logic
  const {
    activeId,
    activeElement,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useDragDrop();

  // Panel state
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>('properties');
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Modal states
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Command palette
  const commandPalette = useCommandPalette();

  // Load saved state on mount
  const { loadFromStorage, saveToStorage } = useBuilderStore();
  const { settingsModalOpen, closeSettingsModal, openSettingsModal } = useCustomizationStore();

  // Sync settings modal state
  useEffect(() => {
    setShowSettings(settingsModalOpen);
  }, [settingsModalOpen]);

  // Handle settings modal changes
  const handleSettingsChange = useCallback(
    (open: boolean) => {
      setShowSettings(open);
      if (!open) {
        closeSettingsModal();
      }
    },
    [closeSettingsModal]
  );

  // Initialize keyboard shortcuts with callbacks
  const { commands } = useKeyboardShortcuts({
    enabled: true,
    onOpenCommandPalette: commandPalette.open,
    onOpenShortcutsModal: () => setShowShortcuts(true),
    onExport: () => setShowExportPanel(true),
  });

  // Global keyboard shortcut for command palette (Ctrl+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Command palette: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        commandPalette.toggle();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [commandPalette]);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Auto-save on changes
  useEffect(() => {
    const interval = setInterval(() => {
      saveToStorage();
    }, 5000); // Save every 5 seconds

    return () => clearInterval(interval);
  }, [saveToStorage]);

  // Save before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToStorage();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveToStorage]);

  // Toolbar action handlers
  const handleOpenTemplates = useCallback(() => {
    setShowTemplateGallery(true);
  }, []);

  const handleOpenExport = useCallback(() => {
    setShowExportPanel(true);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
    openSettingsModal();
  }, [openSettingsModal]);

  const handleToggleHistory = useCallback(() => {
    setShowHistory((prev) => !prev);
  }, []);

  const handleRunAccessibilityAudit = useCallback(() => {
    setRightPanelTab('accessibility');
    setRightPanelCollapsed(false);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToWindowEdges]}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <div className="h-screen flex flex-col bg-gray-950 overflow-hidden">
        {/* Top Toolbar */}
        <Toolbar
          onOpenTemplates={handleOpenTemplates}
          onOpenExport={handleOpenExport}
          onOpenSettings={handleOpenSettings}
          onToggleHistory={handleToggleHistory}
          onRunAccessibilityAudit={handleRunAccessibilityAudit}
          showHistory={showHistory}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Component Library */}
          <ComponentSidebar />

          {/* Center - Canvas and History */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <Canvas />

            {/* History Panel - Floating */}
            {showHistory && (
              <div className="absolute bottom-4 left-4 z-10 w-72">
                <HistoryPanel
                  collapsed={false}
                  onToggle={() => setShowHistory(false)}
                />
              </div>
            )}
          </div>

          {/* Right Panel - Properties and other panels */}
          <RightSidebar
            activeTab={rightPanelTab}
            onTabChange={setRightPanelTab}
            collapsed={rightPanelCollapsed}
            onToggleCollapse={() => setRightPanelCollapsed(!rightPanelCollapsed)}
          />
        </div>

        {/* Code Preview Overlay */}
        <CodePreview />
      </div>

      {/* Drag Overlay - Shows preview of dragged element */}
      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: 'ease-out',
        }}
      >
        {activeId ? <DragOverlayContent activeElement={activeElement} /> : null}
      </DragOverlay>

      {/* Modals */}
      <CommandPalette
        open={commandPalette.isOpen}
        onOpenChange={commandPalette.setIsOpen}
        commands={commands}
      />

      <ShortcutsModal
        open={showShortcuts}
        onOpenChange={setShowShortcuts}
      />

      <TemplateGallery
        open={showTemplateGallery}
        onOpenChange={setShowTemplateGallery}
      />

      <ExportPanel
        open={showExportPanel}
        onOpenChange={setShowExportPanel}
      />

      <SettingsModal
        open={showSettings}
        onOpenChange={handleSettingsChange}
      />
    </DndContext>
  );
}
