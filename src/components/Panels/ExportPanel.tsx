'use client';

import { useState, useMemo, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import {
  X,
  Download,
  Copy,
  Check,
  FileCode,
  FileCode2,
  FolderDown,
  Code2,
  FileJson,
  Settings2,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useBuilderStore } from '@/store/builderStore';
import { useCustomizationStore } from '@/store/customizationStore';
import { useCodeGenerator } from '@/hooks/useCodeGenerator';
import { exportToFile, exportProject, copyToClipboard } from '@/utils/export';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES
// ============================================================================

interface ExportPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ExportFormat = 'jsx' | 'tsx' | 'html' | 'json';

// ============================================================================
// CONSTANTS
// ============================================================================

const FORMAT_OPTIONS = [
  {
    id: 'jsx' as const,
    name: 'JSX',
    icon: FileCode,
    description: 'React JavaScript component',
    extension: '.jsx',
  },
  {
    id: 'tsx' as const,
    name: 'TSX',
    icon: FileCode2,
    description: 'React TypeScript component',
    extension: '.tsx',
  },
  {
    id: 'html' as const,
    name: 'HTML',
    icon: Code2,
    description: 'Static HTML with Tailwind classes',
    extension: '.html',
  },
  {
    id: 'json' as const,
    name: 'JSON',
    icon: FileJson,
    description: 'Element structure as JSON',
    extension: '.json',
  },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface CodePreviewProps {
  code: string;
  language: string;
  onCopy: () => void;
  copied: boolean;
}

function CodePreview({ code, language, onCopy, copied }: CodePreviewProps) {
  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-400 font-mono uppercase">{language}</span>
        <button
          onClick={onCopy}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded text-xs',
            'transition-colors',
            copied
              ? 'bg-green-600/20 text-green-400'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          )}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre className="p-4 bg-gray-900 overflow-auto max-h-[400px] text-sm">
        <code className="text-gray-300 font-mono whitespace-pre-wrap break-words">
          {code}
        </code>
      </pre>
    </div>
  );
}

interface ExportOptionsProps {
  componentName: string;
  onComponentNameChange: (name: string) => void;
  includeComments: boolean;
  onIncludeCommentsChange: (include: boolean) => void;
  includeImports: boolean;
  onIncludeImportsChange: (include: boolean) => void;
}

function ExportOptions({
  componentName,
  onComponentNameChange,
  includeComments,
  onIncludeCommentsChange,
  includeImports,
  onIncludeImportsChange,
}: ExportOptionsProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg">
      <h4 className="flex items-center gap-2 text-sm font-medium text-white">
        <Settings2 className="w-4 h-4" />
        Export Options
      </h4>

      {/* Component name */}
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Component Name</label>
        <input
          type="text"
          value={componentName}
          onChange={(e) => onComponentNameChange(e.target.value)}
          placeholder="MyComponent"
          className={cn(
            'w-full px-3 py-2 text-sm',
            'bg-gray-800 border border-gray-700 rounded-lg',
            'text-white placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50'
          )}
        />
      </div>

      {/* Options */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={includeComments}
            onChange={(e) => onIncludeCommentsChange(e.target.checked)}
            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
          />
          Include comments
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={includeImports}
            onChange={(e) => onIncludeImportsChange(e.target.checked)}
            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
          />
          Include import statements
        </label>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ExportPanel({ open, onOpenChange }: ExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('tsx');
  const [componentName, setComponentName] = useState('GeneratedComponent');
  const [includeComments, setIncludeComments] = useState(true);
  const [includeImports, setIncludeImports] = useState(true);
  const [copied, setCopied] = useState(false);

  const { elements } = useBuilderStore();
  useCustomizationStore(); // Keep store connection for future use
  const { jsx, tsx } = useCodeGenerator(elements, componentName);

  // Generate code based on format
  const generatedCode = useMemo(() => {
    switch (selectedFormat) {
      case 'jsx':
        return jsx;
      case 'tsx':
        return tsx;
      case 'html':
        // Simple HTML conversion (would need proper implementation)
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${componentName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  ${jsx
    .replace(/className=/g, 'class=')
    .replace(/export (default )?function \w+\(\) \{[\s\S]*?return \(/m, '')
    .replace(/\);?\s*\}\s*$/, '')}
</body>
</html>`;
      case 'json':
        return JSON.stringify(elements, null, 2);
      default:
        return tsx;
    }
  }, [selectedFormat, jsx, tsx, elements, componentName]);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(generatedCode);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  }, [generatedCode]);

  // Download file
  const handleDownload = useCallback(async () => {
    const format = FORMAT_OPTIONS.find((f) => f.id === selectedFormat);
    const filename = `${componentName}${format?.extension || '.tsx'}`;

    try {
      await exportToFile(generatedCode, filename);
      toast.success(`Downloaded ${filename}`);
    } catch {
      toast.error('Failed to download file');
    }
  }, [generatedCode, componentName, selectedFormat]);

  // Download project
  const handleDownloadProject = useCallback(async () => {
    try {
      await exportProject(elements, tsx, {
        format: 'tsx',
        includeImports,
        componentName,
      });
      toast.success('Project downloaded');
    } catch {
      toast.error('Failed to download project');
    }
  }, [elements, tsx, includeImports, componentName]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-3xl max-h-[85vh] bg-gray-900 rounded-xl shadow-2xl z-50',
            'flex flex-col overflow-hidden',
            'animate-in fade-in-0 zoom-in-95 duration-200'
          )}
        >
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold text-white">
                Export Code
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1 text-gray-400 hover:text-white rounded hover:bg-gray-800">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <Tabs.Root
              value={selectedFormat}
              onValueChange={(v) => setSelectedFormat(v as ExportFormat)}
            >
              {/* Format tabs */}
              <Tabs.List className="flex gap-2 mb-6">
                {FORMAT_OPTIONS.map((format) => {
                  const Icon = format.icon;
                  return (
                    <Tabs.Trigger
                      key={format.id}
                      value={format.id}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                        'transition-colors',
                        selectedFormat === format.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {format.name}
                    </Tabs.Trigger>
                  );
                })}
              </Tabs.List>

              {/* Options panel */}
              <div className="mb-6">
                <ExportOptions
                  componentName={componentName}
                  onComponentNameChange={setComponentName}
                  includeComments={includeComments}
                  onIncludeCommentsChange={setIncludeComments}
                  includeImports={includeImports}
                  onIncludeImportsChange={setIncludeImports}
                />
              </div>

              {/* Code preview */}
              <CodePreview
                code={generatedCode}
                language={selectedFormat}
                onCopy={handleCopy}
                copied={copied}
              />
            </Tabs.Root>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-800 bg-gray-900/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {elements.length} element{elements.length !== 1 ? 's' : ''} in canvas
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadProject}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                    'border border-gray-700 text-gray-300',
                    'hover:bg-gray-800 hover:text-white transition-colors'
                  )}
                >
                  <FolderDown className="w-4 h-4" />
                  Download Project
                </button>
                <button
                  onClick={handleDownload}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                    'bg-blue-600 text-white hover:bg-blue-500 transition-colors'
                  )}
                >
                  <Download className="w-4 h-4" />
                  Download File
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ExportPanel;
