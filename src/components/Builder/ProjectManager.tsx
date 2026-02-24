'use client';

/**
 * ProjectManager Component
 *
 * Provides a comprehensive UI for managing multi-page projects including
 * project naming, page management, templates, and page ordering.
 */

import { useState, useCallback, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Tooltip from '@radix-ui/react-tooltip';
import toast from 'react-hot-toast';
import {
  Plus,
  FileText,
  Trash2,
  Copy,
  Edit3,
  MoreVertical,
  Home,
  ChevronDown,
  GripVertical,
  Check,
  X,
  FolderPlus,
  Settings,
  FileCode,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useProjectStore } from '@/store/projectStore';
import type { ProjectPage, PageTemplate } from '@/lib/projectSystem';
import { PAGE_TEMPLATES } from '@/lib/projectSystem';

// ============================================================================
// TYPES
// ============================================================================

interface PageTabProps {
  page: ProjectPage;
  isActive: boolean;
  onSelect: () => void;
  onRename: (name: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSetHome: () => void;
  canDelete: boolean;
}

interface AddPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (name: string, path?: string, template?: PageTemplate) => void;
}

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  pageName: string;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function PageTab({
  page,
  isActive,
  onSelect,
  onRename,
  onDuplicate,
  onDelete,
  onSetHome,
  canDelete,
}: PageTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(page.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStartEdit = useCallback(() => {
    setEditName(page.name);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }, [page.name]);

  const handleSaveEdit = useCallback(() => {
    if (editName.trim() && editName !== page.name) {
      onRename(editName.trim());
    }
    setIsEditing(false);
  }, [editName, page.name, onRename]);

  const handleCancelEdit = useCallback(() => {
    setEditName(page.name);
    setIsEditing(false);
  }, [page.name]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSaveEdit();
      } else if (e.key === 'Escape') {
        handleCancelEdit();
      }
    },
    [handleSaveEdit, handleCancelEdit]
  );

  return (
    <div
      className={cn(
        'group flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150',
        isActive
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
      )}
      onClick={!isEditing ? onSelect : undefined}
    >
      {/* Drag handle */}
      <GripVertical
        className={cn(
          'w-3 h-3 opacity-0 group-hover:opacity-50 cursor-grab',
          isActive ? 'text-white' : 'text-gray-400'
        )}
      />

      {/* Page icon */}
      {page.isHomePage ? (
        <Home className="w-4 h-4 flex-shrink-0" />
      ) : (
        <FileText className="w-4 h-4 flex-shrink-0" />
      )}

      {/* Page name */}
      {isEditing ? (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSaveEdit}
            className={cn(
              'w-24 px-1 py-0.5 text-sm rounded',
              'bg-gray-900 border border-gray-600 outline-none',
              'focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            )}
            autoFocus
          />
          <button
            onClick={handleSaveEdit}
            className="p-0.5 rounded hover:bg-gray-700"
          >
            <Check className="w-3 h-3 text-green-400" />
          </button>
          <button
            onClick={handleCancelEdit}
            className="p-0.5 rounded hover:bg-gray-700"
          >
            <X className="w-3 h-3 text-red-400" />
          </button>
        </div>
      ) : (
        <span className="text-sm font-medium truncate max-w-[100px]">
          {page.name}
        </span>
      )}

      {/* Actions dropdown */}
      {!isEditing && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity',
                'hover:bg-white/10',
                isActive && 'opacity-100'
              )}
            >
              <MoreVertical className="w-3 h-3" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={cn(
                'min-w-[160px] bg-gray-800 rounded-lg p-1',
                'shadow-xl border border-gray-700',
                'animate-in fade-in-0 zoom-in-95'
              )}
              sideOffset={5}
              align="end"
            >
              <DropdownMenu.Item
                onClick={handleStartEdit}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer',
                  'text-sm text-gray-300 outline-none',
                  'hover:bg-gray-700 hover:text-white',
                  'focus:bg-gray-700 focus:text-white'
                )}
              >
                <Edit3 className="w-4 h-4" />
                Rename
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={onDuplicate}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer',
                  'text-sm text-gray-300 outline-none',
                  'hover:bg-gray-700 hover:text-white',
                  'focus:bg-gray-700 focus:text-white'
                )}
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </DropdownMenu.Item>
              {!page.isHomePage && (
                <DropdownMenu.Item
                  onClick={onSetHome}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer',
                    'text-sm text-gray-300 outline-none',
                    'hover:bg-gray-700 hover:text-white',
                    'focus:bg-gray-700 focus:text-white'
                  )}
                >
                  <Home className="w-4 h-4" />
                  Set as Home
                </DropdownMenu.Item>
              )}
              {canDelete && (
                <>
                  <DropdownMenu.Separator className="h-px bg-gray-700 my-1" />
                  <DropdownMenu.Item
                    onClick={onDelete}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer',
                      'text-sm text-red-400 outline-none',
                      'hover:bg-red-900/30 hover:text-red-300',
                      'focus:bg-red-900/30 focus:text-red-300'
                    )}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </DropdownMenu.Item>
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </div>
  );
}

function AddPageDialog({ open, onOpenChange, onAdd }: AddPageDialogProps) {
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);

  const handleAdd = useCallback(() => {
    if (!name.trim()) {
      toast.error('Page name is required');
      return;
    }

    onAdd(name.trim(), path.trim() || undefined, selectedTemplate || undefined);
    setName('');
    setPath('');
    setSelectedTemplate(null);
    onOpenChange(false);
    toast.success(`Page "${name}" created`);
  }, [name, path, selectedTemplate, onAdd, onOpenChange]);

  const handleNameChange = useCallback((value: string) => {
    setName(value);
    // Auto-generate path from name
    if (!path || path === `/${name.toLowerCase().replace(/\s+/g, '-')}`) {
      setPath(`/${value.toLowerCase().replace(/\s+/g, '-')}`);
    }
  }, [name, path]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-md bg-gray-900 rounded-xl shadow-2xl',
            'border border-gray-800',
            'animate-in fade-in-0 zoom-in-95'
          )}
        >
          <div className="p-6">
            <Dialog.Title className="text-lg font-semibold text-white mb-4">
              Add New Page
            </Dialog.Title>

            <div className="space-y-4">
              {/* Page name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Page Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., About Us"
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-gray-800 border border-gray-700 text-white',
                    'placeholder-gray-500 outline-none',
                    'focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  )}
                  autoFocus
                />
              </div>

              {/* Page path */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  URL Path
                </label>
                <input
                  type="text"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="e.g., /about-us"
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-gray-800 border border-gray-700 text-white',
                    'placeholder-gray-500 outline-none',
                    'focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  )}
                />
                <p className="mt-1 text-xs text-gray-500">
                  The URL path for this page (e.g., /about-us)
                </p>
              </div>

              {/* Template selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Template
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PAGE_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={cn(
                        'p-3 rounded-lg border text-left transition-all',
                        selectedTemplate?.id === template.id
                          ? 'border-blue-500 bg-blue-500/10 text-white'
                          : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                      )}
                    >
                      <FileCode className="w-5 h-5 mb-1" />
                      <p className="text-sm font-medium">{template.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {template.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-800">
            <Dialog.Close asChild>
              <button
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white',
                  'transition-colors'
                )}
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleAdd}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium',
                'bg-blue-600 text-white hover:bg-blue-700',
                'transition-colors'
              )}
            >
              Add Page
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  pageName,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-sm bg-gray-900 rounded-xl shadow-2xl',
            'border border-gray-800',
            'animate-in fade-in-0 zoom-in-95'
          )}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-red-500/10">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <Dialog.Title className="text-lg font-semibold text-white">
                Delete Page
              </Dialog.Title>
            </div>

            <p className="text-gray-400">
              Are you sure you want to delete <strong className="text-white">{pageName}</strong>?
              This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-800">
            <Dialog.Close asChild>
              <button
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white',
                  'transition-colors'
                )}
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium',
                'bg-red-600 text-white hover:bg-red-700',
                'transition-colors'
              )}
            >
              Delete
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ProjectManager() {
  const {
    currentProject,
    activePageId,
    setActivePage,
    addPage,
    removePage,
    renamePage,
    duplicatePage,
    setHomePage,
    updateProjectName,
    hasUnsavedChanges,
    saveCurrentProject,
    isSaving,
  } = useProjectStore();

  const [isAddPageOpen, setIsAddPageOpen] = useState(false);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [projectNameEdit, setProjectNameEdit] = useState('');
  const projectNameInputRef = useRef<HTMLInputElement>(null);

  // Get page to delete for dialog
  const pageToDelete = deletePageId
    ? currentProject?.pages.find((p) => p.id === deletePageId)
    : null;

  // Handlers
  const handleStartProjectNameEdit = useCallback(() => {
    if (currentProject) {
      setProjectNameEdit(currentProject.name);
      setIsEditingProjectName(true);
      setTimeout(() => projectNameInputRef.current?.select(), 0);
    }
  }, [currentProject]);

  const handleSaveProjectName = useCallback(() => {
    if (projectNameEdit.trim()) {
      updateProjectName(projectNameEdit.trim());
    }
    setIsEditingProjectName(false);
  }, [projectNameEdit, updateProjectName]);

  const handleAddPage = useCallback(
    (name: string, path?: string, template?: PageTemplate) => {
      addPage(name, path, template);
    },
    [addPage]
  );

  const handleDeletePage = useCallback(() => {
    if (deletePageId) {
      removePage(deletePageId);
      setDeletePageId(null);
      toast.success('Page deleted');
    }
  }, [deletePageId, removePage]);

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-12 bg-gray-900 border-b border-gray-800 px-4">
        <p className="text-gray-500 text-sm">No project open</p>
      </div>
    );
  }

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className="flex items-center h-12 bg-gray-900 border-b border-gray-800 px-4 gap-4">
        {/* Project name */}
        <div className="flex items-center gap-2">
          <FolderPlus className="w-4 h-4 text-gray-400" />
          {isEditingProjectName ? (
            <div className="flex items-center gap-1">
              <input
                ref={projectNameInputRef}
                type="text"
                value={projectNameEdit}
                onChange={(e) => setProjectNameEdit(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveProjectName();
                  if (e.key === 'Escape') setIsEditingProjectName(false);
                }}
                onBlur={handleSaveProjectName}
                className={cn(
                  'px-2 py-1 text-sm rounded',
                  'bg-gray-800 border border-gray-600 text-white outline-none',
                  'focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                )}
                autoFocus
              />
            </div>
          ) : (
            <button
              onClick={handleStartProjectNameEdit}
              className="flex items-center gap-1 text-sm font-medium text-white hover:text-blue-400 transition-colors"
            >
              {currentProject.name}
              <Edit3 className="w-3 h-3 opacity-50" />
            </button>
          )}

          {hasUnsavedChanges && (
            <span className="w-2 h-2 rounded-full bg-yellow-500" title="Unsaved changes" />
          )}
        </div>

        <div className="w-px h-6 bg-gray-700" />

        {/* Pages tabs */}
        <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-hide">
          {currentProject.pages.map((page) => (
            <PageTab
              key={page.id}
              page={page}
              isActive={page.id === activePageId}
              onSelect={() => setActivePage(page.id)}
              onRename={(name) => renamePage(page.id, name)}
              onDuplicate={() => duplicatePage(page.id)}
              onDelete={() => setDeletePageId(page.id)}
              onSetHome={() => setHomePage(page.id)}
              canDelete={currentProject.pages.length > 1}
            />
          ))}

          {/* Add page button */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={() => setIsAddPageOpen(true)}
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg',
                  'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white',
                  'transition-colors'
                )}
              >
                <Plus className="w-4 h-4" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded-lg shadow-xl border border-gray-700"
                sideOffset={8}
              >
                Add new page
                <Tooltip.Arrow className="fill-gray-800" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>

        {/* Save button */}
        <button
          onClick={saveCurrentProject}
          disabled={isSaving || !hasUnsavedChanges}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            hasUnsavedChanges
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          )}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Dialogs */}
      <AddPageDialog
        open={isAddPageOpen}
        onOpenChange={setIsAddPageOpen}
        onAdd={handleAddPage}
      />

      <DeleteConfirmDialog
        open={!!deletePageId}
        onOpenChange={(open) => !open && setDeletePageId(null)}
        onConfirm={handleDeletePage}
        pageName={pageToDelete?.name || ''}
      />
    </Tooltip.Provider>
  );
}

export default ProjectManager;
