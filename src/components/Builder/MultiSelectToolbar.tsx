'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import { cn } from '@/utils/cn';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Columns,
  Rows,
  Group,
  Ungroup,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  SeparatorVertical,
  SeparatorHorizontal,
  Equal,
  ChevronDown,
  Palette,
  Move,
  LayoutGrid,
} from 'lucide-react';

interface MultiSelectToolbarProps {
  className?: string;
}

type ToolbarSection = 'align' | 'distribute' | 'size' | 'group' | 'style' | 'actions';

interface DropdownState {
  section: ToolbarSection | null;
  isOpen: boolean;
}

export function MultiSelectToolbar({ className }: MultiSelectToolbarProps) {
  const {
    selectedIds,
    elements,
    removeMultiple,
    duplicateMultiple,
    groupElements,
    ungroupElements,
    alignElements,
    distributeElements,
    matchSizes,
    lockMultiple,
    unlockMultiple,
    hideMultiple,
    showMultiple,
    applyStyleToMultiple,
  } = useBuilderStore();

  const [dropdown, setDropdown] = useState<DropdownState>({
    section: null,
    isOpen: false,
  });

  // Only show when 2+ elements selected
  const isVisible = selectedIds.length >= 2;

  // Check if any selected elements are locked
  const hasLockedElements = useMemo(() => {
    // TODO: Check actual locked state from elements
    return false;
  }, [selectedIds, elements]);

  // Check if any selected elements are hidden
  const hasHiddenElements = useMemo(() => {
    // TODO: Check actual hidden state from elements
    return false;
  }, [selectedIds, elements]);

  // Toggle dropdown
  const toggleDropdown = useCallback((section: ToolbarSection) => {
    setDropdown(prev => ({
      section: prev.section === section && prev.isOpen ? null : section,
      isOpen: prev.section !== section || !prev.isOpen,
    }));
  }, []);

  // Close dropdown
  const closeDropdown = useCallback(() => {
    setDropdown({ section: null, isOpen: false });
  }, []);

  // Action handlers
  const handleAlign = useCallback((alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (typeof alignElements === 'function') {
      alignElements(selectedIds, alignment);
    }
    closeDropdown();
  }, [selectedIds, alignElements, closeDropdown]);

  const handleDistribute = useCallback((distribution: 'horizontal' | 'vertical') => {
    if (typeof distributeElements === 'function') {
      distributeElements(selectedIds, distribution);
    }
    closeDropdown();
  }, [selectedIds, distributeElements, closeDropdown]);

  const handleMatchSize = useCallback((sizeType: 'width' | 'height' | 'both') => {
    if (typeof matchSizes === 'function') {
      matchSizes(selectedIds, sizeType);
    }
    closeDropdown();
  }, [selectedIds, matchSizes, closeDropdown]);

  const handleGroup = useCallback(() => {
    if (typeof groupElements === 'function') {
      groupElements(selectedIds);
    }
    closeDropdown();
  }, [selectedIds, groupElements, closeDropdown]);

  const handleUngroup = useCallback(() => {
    if (typeof ungroupElements === 'function') {
      ungroupElements(selectedIds);
    }
    closeDropdown();
  }, [selectedIds, ungroupElements, closeDropdown]);

  const handleDuplicate = useCallback(() => {
    if (typeof duplicateMultiple === 'function') {
      duplicateMultiple(selectedIds);
    }
  }, [selectedIds, duplicateMultiple]);

  const handleDelete = useCallback(() => {
    if (typeof removeMultiple === 'function') {
      removeMultiple(selectedIds);
    }
  }, [selectedIds, removeMultiple]);

  const handleLock = useCallback(() => {
    if (typeof lockMultiple === 'function') {
      lockMultiple(selectedIds);
    }
  }, [selectedIds, lockMultiple]);

  const handleUnlock = useCallback(() => {
    if (typeof unlockMultiple === 'function') {
      unlockMultiple(selectedIds);
    }
  }, [selectedIds, unlockMultiple]);

  const handleHide = useCallback(() => {
    if (typeof hideMultiple === 'function') {
      hideMultiple(selectedIds);
    }
  }, [selectedIds, hideMultiple]);

  const handleShow = useCallback(() => {
    if (typeof showMultiple === 'function') {
      showMultiple(selectedIds);
    }
  }, [selectedIds, showMultiple]);

  const handleApplyStyle = useCallback((category: string, classes: string[]) => {
    if (typeof applyStyleToMultiple === 'function') {
      applyStyleToMultiple(selectedIds, category, classes);
    }
    closeDropdown();
  }, [selectedIds, applyStyleToMultiple, closeDropdown]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2',
        'flex items-center gap-1 p-2 rounded-xl',
        'bg-gray-900 text-white shadow-2xl',
        'border border-gray-700',
        'z-50',
        className
      )}
    >
      {/* Selection count */}
      <div className="px-3 py-1.5 bg-blue-500/20 rounded-lg text-sm font-medium text-blue-400">
        {selectedIds.length} selected
      </div>

      <Divider />

      {/* Align section */}
      <div className="relative">
        <ToolbarButton
          icon={<AlignCenter className="w-4 h-4" />}
          label="Align"
          onClick={() => toggleDropdown('align')}
          isActive={dropdown.section === 'align' && dropdown.isOpen}
          hasDropdown
        />

        {dropdown.section === 'align' && dropdown.isOpen && (
          <DropdownMenu onClose={closeDropdown}>
            <DropdownLabel>Horizontal</DropdownLabel>
            <div className="flex gap-1 p-1">
              <DropdownButton
                icon={<AlignLeft className="w-4 h-4" />}
                onClick={() => handleAlign('left')}
                tooltip="Align left"
              />
              <DropdownButton
                icon={<AlignCenter className="w-4 h-4" />}
                onClick={() => handleAlign('center')}
                tooltip="Align center"
              />
              <DropdownButton
                icon={<AlignRight className="w-4 h-4" />}
                onClick={() => handleAlign('right')}
                tooltip="Align right"
              />
            </div>
            <DropdownLabel>Vertical</DropdownLabel>
            <div className="flex gap-1 p-1">
              <DropdownButton
                icon={<AlignStartVertical className="w-4 h-4" />}
                onClick={() => handleAlign('top')}
                tooltip="Align top"
              />
              <DropdownButton
                icon={<AlignCenterVertical className="w-4 h-4" />}
                onClick={() => handleAlign('middle')}
                tooltip="Align middle"
              />
              <DropdownButton
                icon={<AlignEndVertical className="w-4 h-4" />}
                onClick={() => handleAlign('bottom')}
                tooltip="Align bottom"
              />
            </div>
          </DropdownMenu>
        )}
      </div>

      {/* Distribute section */}
      <div className="relative">
        <ToolbarButton
          icon={<Columns className="w-4 h-4" />}
          label="Distribute"
          onClick={() => toggleDropdown('distribute')}
          isActive={dropdown.section === 'distribute' && dropdown.isOpen}
          hasDropdown
        />

        {dropdown.section === 'distribute' && dropdown.isOpen && (
          <DropdownMenu onClose={closeDropdown}>
            <div className="flex gap-1 p-1">
              <DropdownButton
                icon={<SeparatorHorizontal className="w-4 h-4" />}
                onClick={() => handleDistribute('horizontal')}
                tooltip="Distribute horizontally"
                label="Horizontal"
              />
              <DropdownButton
                icon={<SeparatorVertical className="w-4 h-4" />}
                onClick={() => handleDistribute('vertical')}
                tooltip="Distribute vertically"
                label="Vertical"
              />
            </div>
          </DropdownMenu>
        )}
      </div>

      {/* Size matching section */}
      <div className="relative">
        <ToolbarButton
          icon={<Equal className="w-4 h-4" />}
          label="Match Size"
          onClick={() => toggleDropdown('size')}
          isActive={dropdown.section === 'size' && dropdown.isOpen}
          hasDropdown
        />

        {dropdown.section === 'size' && dropdown.isOpen && (
          <DropdownMenu onClose={closeDropdown}>
            <DropdownItem
              icon={<SeparatorHorizontal className="w-4 h-4" />}
              label="Match Width"
              onClick={() => handleMatchSize('width')}
            />
            <DropdownItem
              icon={<SeparatorVertical className="w-4 h-4" />}
              label="Match Height"
              onClick={() => handleMatchSize('height')}
            />
            <DropdownItem
              icon={<LayoutGrid className="w-4 h-4" />}
              label="Match Both"
              onClick={() => handleMatchSize('both')}
            />
          </DropdownMenu>
        )}
      </div>

      <Divider />

      {/* Group/Ungroup */}
      <ToolbarButton
        icon={<Group className="w-4 h-4" />}
        label="Group"
        onClick={handleGroup}
        tooltip="Group selected elements"
      />
      <ToolbarButton
        icon={<Ungroup className="w-4 h-4" />}
        label="Ungroup"
        onClick={handleUngroup}
        tooltip="Ungroup selected elements"
      />

      <Divider />

      {/* Style section */}
      <div className="relative">
        <ToolbarButton
          icon={<Palette className="w-4 h-4" />}
          label="Style"
          onClick={() => toggleDropdown('style')}
          isActive={dropdown.section === 'style' && dropdown.isOpen}
          hasDropdown
        />

        {dropdown.section === 'style' && dropdown.isOpen && (
          <DropdownMenu onClose={closeDropdown} className="w-48">
            <DropdownLabel>Quick Styles</DropdownLabel>
            <DropdownItem
              icon={<div className="w-4 h-4 bg-gray-200 rounded" />}
              label="Add padding"
              onClick={() => handleApplyStyle('spacing', ['p-4'])}
            />
            <DropdownItem
              icon={<div className="w-4 h-4 bg-gray-200 rounded border border-gray-400" />}
              label="Add border"
              onClick={() => handleApplyStyle('borders', ['border', 'border-gray-300'])}
            />
            <DropdownItem
              icon={<div className="w-4 h-4 bg-gray-100 rounded" />}
              label="Add background"
              onClick={() => handleApplyStyle('colors', ['bg-gray-100'])}
            />
            <DropdownItem
              icon={<div className="w-4 h-4 rounded shadow" />}
              label="Add shadow"
              onClick={() => handleApplyStyle('effects', ['shadow-md'])}
            />
            <DropdownItem
              icon={<div className="w-4 h-4 rounded-lg bg-gray-200" />}
              label="Round corners"
              onClick={() => handleApplyStyle('borders', ['rounded-lg'])}
            />
          </DropdownMenu>
        )}
      </div>

      <Divider />

      {/* Actions section */}
      <div className="relative">
        <ToolbarButton
          icon={<Move className="w-4 h-4" />}
          label="Actions"
          onClick={() => toggleDropdown('actions')}
          isActive={dropdown.section === 'actions' && dropdown.isOpen}
          hasDropdown
        />

        {dropdown.section === 'actions' && dropdown.isOpen && (
          <DropdownMenu onClose={closeDropdown} className="w-40">
            <DropdownItem
              icon={<Copy className="w-4 h-4" />}
              label="Duplicate"
              onClick={handleDuplicate}
              shortcut="Ctrl+D"
            />
            <DropdownDivider />
            <DropdownItem
              icon={hasLockedElements ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              label={hasLockedElements ? "Unlock" : "Lock"}
              onClick={hasLockedElements ? handleUnlock : handleLock}
            />
            <DropdownItem
              icon={hasHiddenElements ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              label={hasHiddenElements ? "Show" : "Hide"}
              onClick={hasHiddenElements ? handleShow : handleHide}
            />
            <DropdownDivider />
            <DropdownItem
              icon={<Trash2 className="w-4 h-4" />}
              label="Delete"
              onClick={handleDelete}
              shortcut="Del"
              destructive
            />
          </DropdownMenu>
        )}
      </div>

      {/* Quick delete button */}
      <Divider />
      <ToolbarButton
        icon={<Trash2 className="w-4 h-4" />}
        onClick={handleDelete}
        tooltip="Delete selected"
        destructive
      />
    </div>
  );
}

// Helper components

function Divider() {
  return <div className="w-px h-6 bg-gray-700 mx-1" />;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick: () => void;
  tooltip?: string;
  isActive?: boolean;
  hasDropdown?: boolean;
  destructive?: boolean;
}

function ToolbarButton({
  icon,
  label,
  onClick,
  tooltip,
  isActive,
  hasDropdown,
  destructive,
}: ToolbarButtonProps) {
  return (
    <button
      className={cn(
        'flex items-center gap-1.5 px-2 py-1.5 rounded-lg',
        'text-sm font-medium transition-colors',
        'hover:bg-gray-800',
        isActive && 'bg-gray-800',
        destructive && 'hover:bg-red-500/20 hover:text-red-400'
      )}
      onClick={onClick}
      title={tooltip}
    >
      {icon}
      {label && <span className="hidden sm:inline">{label}</span>}
      {hasDropdown && <ChevronDown className="w-3 h-3 opacity-50" />}
    </button>
  );
}

interface DropdownMenuProps {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}

function DropdownMenu({ children, onClose, className }: DropdownMenuProps) {
  return (
    <>
      {/* Backdrop to close dropdown */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Menu */}
      <div
        className={cn(
          'absolute bottom-full left-0 mb-2',
          'min-w-[120px] p-1 rounded-lg',
          'bg-gray-800 border border-gray-700',
          'shadow-xl z-50',
          className
        )}
      >
        {children}
      </div>
    </>
  );
}

function DropdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 py-1 text-xs font-medium text-gray-400 uppercase">
      {children}
    </div>
  );
}

function DropdownDivider() {
  return <div className="h-px bg-gray-700 my-1" />;
}

interface DropdownButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  tooltip?: string;
  label?: string;
}

function DropdownButton({ icon, onClick, tooltip, label }: DropdownButtonProps) {
  return (
    <button
      className={cn(
        'flex flex-col items-center gap-1 p-2 rounded-md',
        'hover:bg-gray-700 transition-colors',
        'min-w-[40px]'
      )}
      onClick={onClick}
      title={tooltip}
    >
      {icon}
      {label && <span className="text-[10px] text-gray-400">{label}</span>}
    </button>
  );
}

interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  shortcut?: string;
  destructive?: boolean;
}

function DropdownItem({
  icon,
  label,
  onClick,
  shortcut,
  destructive
}: DropdownItemProps) {
  return (
    <button
      className={cn(
        'flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-left',
        'text-sm transition-colors',
        'hover:bg-gray-700',
        destructive && 'hover:bg-red-500/20 text-red-400'
      )}
      onClick={onClick}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {shortcut && (
        <span className="text-xs text-gray-500">{shortcut}</span>
      )}
    </button>
  );
}

export default MultiSelectToolbar;
