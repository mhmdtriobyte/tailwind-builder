'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import {
  X,
  Copy,
  Download,
  Check,
  FileCode,
  Package,
  Eye,
  ChevronDown,
  Minimize2,
  Archive,
} from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import { useBuilderStore } from '@/store/builderStore';
import { cn } from '@/utils/cn';
import { copyToClipboard, exportToFile } from '@/utils/export';
import {
  exportAs,
  type ExportFormat,
  type ExportResult,
} from '@/lib/exportFormats';
import { generateCSS } from '@/lib/cssGenerator';
import { generateHTML } from '@/lib/htmlGenerator';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES
// ============================================================================

type FrameworkFormat = 'react-jsx' | 'react-tsx' | 'html-tailwind-cdn' | 'vue-sfc' | 'html-external';
type StyleFormat = 'tailwind' | 'css' | 'scss';

interface ExportOptions {
  minify: boolean;
  includeComments: boolean;
  componentName: string;
  pageTitle: string;
}

interface GeneratedFile {
  filename: string;
  content: string;
  language: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const FRAMEWORK_OPTIONS: { value: FrameworkFormat; label: string; icon: string }[] = [
  { value: 'react-jsx', label: 'React JSX', icon: 'jsx' },
  { value: 'react-tsx', label: 'React TSX', icon: 'tsx' },
  { value: 'html-tailwind-cdn', label: 'HTML', icon: 'html' },
  { value: 'vue-sfc', label: 'Vue SFC', icon: 'vue' },
  { value: 'html-external', label: 'HTML + CSS', icon: 'html' },
];

const STYLE_OPTIONS: { value: StyleFormat; label: string }[] = [
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'css', label: 'Vanilla CSS' },
  { value: 'scss', label: 'SCSS' },
];

const LANGUAGE_MAP: Record<string, string> = {
  jsx: 'jsx',
  tsx: 'tsx',
  html: 'html',
  css: 'css',
  scss: 'scss',
  vue: 'html',
  js: 'javascript',
  ts: 'typescript',
};

// ============================================================================
// COMPONENT
// ============================================================================

interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportPanel({ isOpen, onClose }: ExportPanelProps) {
  const { elements } = useBuilderStore();

  // State
  const [frameworkFormat, setFrameworkFormat] = useState<FrameworkFormat>('react-jsx');
  const [styleFormat, setStyleFormat] = useState<StyleFormat>('tailwind');
  const [options, setOptions] = useState<ExportOptions>({
    minify: false,
    includeComments: false,
    componentName: 'GeneratedComponent',
    pageTitle: 'Generated Page',
  });
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Generate export result based on current settings
  const exportResult = useMemo((): ExportResult => {
    if (elements.length === 0) {
      return {
        primary: {
          filename: 'Component.jsx',
          content: '// No elements to export\nexport default function Component() {\n  return <div>Add elements to your canvas</div>;\n}',
          language: 'jsx',
        },
      };
    }

    try {
      return exportAs(frameworkFormat as ExportFormat, elements, {
        componentName: options.componentName,
        pageTitle: options.pageTitle,
        pageDescription: 'Generated with Tailwind Builder',
        includeComments: options.includeComments,
        minify: options.minify,
        typescript: frameworkFormat === 'react-tsx',
      });
    } catch (error) {
      console.error('Export error:', error);
      return {
        primary: {
          filename: 'error.txt',
          content: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          language: 'text',
        },
      };
    }
  }, [elements, frameworkFormat, options]);

  // Generate CSS based on style format
  const cssResult = useMemo(() => {
    if (elements.length === 0 || styleFormat === 'tailwind') {
      return null;
    }

    try {
      const result = generateCSS(elements, {
        minify: options.minify,
        includeComments: options.includeComments,
      });

      return styleFormat === 'scss' ? result.scss : result.css;
    } catch (error) {
      console.error('CSS generation error:', error);
      return null;
    }
  }, [elements, styleFormat, options]);

  // Combine all files
  const allFiles = useMemo((): GeneratedFile[] => {
    const files: GeneratedFile[] = [exportResult.primary];

    if (exportResult.secondary) {
      files.push(...exportResult.secondary);
    }

    // Add CSS file if using non-tailwind style
    if (cssResult && styleFormat !== 'tailwind') {
      const existingCssIndex = files.findIndex(
        (f) => f.filename.endsWith('.css') || f.filename.endsWith('.scss')
      );

      if (existingCssIndex === -1) {
        files.push({
          filename: `styles.${styleFormat}`,
          content: cssResult,
          language: styleFormat,
        });
      } else {
        files[existingCssIndex] = {
          ...files[existingCssIndex],
          content: cssResult,
        };
      }
    }

    return files;
  }, [exportResult, cssResult, styleFormat]);

  // Reset active file index when files change
  useEffect(() => {
    if (activeFileIndex >= allFiles.length) {
      setActiveFileIndex(0);
    }
  }, [allFiles.length, activeFileIndex]);

  // Copy file to clipboard
  const handleCopyFile = useCallback(async (file: GeneratedFile) => {
    try {
      await copyToClipboard(file.content);
      setCopiedFile(file.filename);
      toast.success(`Copied ${file.filename} to clipboard`);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  }, []);

  // Download single file
  const handleDownloadFile = useCallback((file: GeneratedFile) => {
    try {
      exportToFile(file.content, file.filename);
      toast.success(`Downloaded ${file.filename}`);
    } catch {
      toast.error('Failed to download file');
    }
  }, []);

  // Download all files as ZIP
  const handleDownloadZip = useCallback(async () => {
    try {
      const zip = new JSZip();

      // Add all generated files
      allFiles.forEach((file) => {
        zip.file(file.filename, file.content);
      });

      // Add package.json if dependencies exist
      if (exportResult.dependencies || exportResult.devDependencies) {
        const packageJson = {
          name: options.componentName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          version: '1.0.0',
          private: true,
          dependencies: exportResult.dependencies || {},
          devDependencies: exportResult.devDependencies || {},
        };
        zip.file('package.json', JSON.stringify(packageJson, null, 2));
      }

      // Generate and save ZIP
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${options.componentName.toLowerCase()}-export.zip`);
      toast.success('Project downloaded successfully');
    } catch {
      toast.error('Failed to create ZIP file');
    }
  }, [allFiles, exportResult, options.componentName]);

  // Update preview iframe
  useEffect(() => {
    if (showPreview && iframeRef.current) {
      const { document: doc } = generateHTML(elements, {
        pageTitle: options.pageTitle,
        minify: false,
      });
      iframeRef.current.srcdoc = doc;
    }
  }, [showPreview, elements, options.pageTitle]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeFile = allFiles[activeFileIndex] || allFiles[0];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed inset-4 md:inset-8 lg:inset-12 bg-gray-900 rounded-xl border border-gray-800 flex flex-col z-50 overflow-hidden shadow-2xl"
        role="dialog"
        aria-label="Export Panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">Export Project</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Preview toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                showPreview
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              )}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

            {/* Download ZIP */}
            <button
              onClick={handleDownloadZip}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Archive className="w-4 h-4" />
              Download ZIP
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex min-h-0">
          {/* Sidebar - Options */}
          <div className="w-64 shrink-0 border-r border-gray-800 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Export Options
            </h3>

            {/* Framework Format */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Framework</label>
              <Select.Root value={frameworkFormat} onValueChange={(v) => setFrameworkFormat(v as FrameworkFormat)}>
                <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white hover:border-gray-600 transition-colors">
                  <Select.Value />
                  <Select.Icon>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-[60]">
                    <Select.Viewport>
                      {FRAMEWORK_OPTIONS.map((opt) => (
                        <Select.Item
                          key={opt.value}
                          value={opt.value}
                          className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer outline-none data-[highlighted]:bg-gray-700 data-[highlighted]:text-white"
                        >
                          <Select.ItemText>{opt.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {/* Style Format */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Style Format</label>
              <Select.Root value={styleFormat} onValueChange={(v) => setStyleFormat(v as StyleFormat)}>
                <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white hover:border-gray-600 transition-colors">
                  <Select.Value />
                  <Select.Icon>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-[60]">
                    <Select.Viewport>
                      {STYLE_OPTIONS.map((opt) => (
                        <Select.Item
                          key={opt.value}
                          value={opt.value}
                          className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer outline-none data-[highlighted]:bg-gray-700 data-[highlighted]:text-white"
                        >
                          <Select.ItemText>{opt.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {/* Divider */}
            <hr className="border-gray-800 my-4" />

            {/* Component Name */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Component Name</label>
              <input
                type="text"
                value={options.componentName}
                onChange={(e) => setOptions({ ...options, componentName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                placeholder="ComponentName"
              />
            </div>

            {/* Page Title */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Page Title</label>
              <input
                type="text"
                value={options.pageTitle}
                onChange={(e) => setOptions({ ...options, pageTitle: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                placeholder="Page Title"
              />
            </div>

            {/* Divider */}
            <hr className="border-gray-800 my-4" />

            {/* Toggles */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.minify}
                  onChange={(e) => setOptions({ ...options, minify: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-300">Minify output</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeComments}
                  onChange={(e) => setOptions({ ...options, includeComments: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-300">Include comments</span>
              </label>
            </div>

            {/* Dependencies info */}
            {(exportResult.dependencies || exportResult.devDependencies) && (
              <>
                <hr className="border-gray-800 my-4" />
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Dependencies</h4>
                  <div className="space-y-1 text-xs text-gray-500">
                    {exportResult.dependencies &&
                      Object.entries(exportResult.dependencies).map(([name, version]) => (
                        <div key={name}>
                          {name}: {version}
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* File tabs */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-800 overflow-x-auto shrink-0">
              {allFiles.map((file, index) => (
                <button
                  key={file.filename}
                  onClick={() => setActiveFileIndex(index)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors shrink-0',
                    activeFileIndex === index
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  )}
                >
                  <FileCode className="w-4 h-4" />
                  {file.filename}
                </button>
              ))}
            </div>

            {/* Code preview / Live preview */}
            <div className="flex-1 flex min-h-0">
              {/* Code section */}
              <div className={cn('flex-1 flex flex-col min-w-0', showPreview && 'w-1/2')}>
                {/* File actions */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 shrink-0">
                  <span className="text-sm text-gray-400">
                    {activeFile.filename}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyFile(activeFile)}
                      className={cn(
                        'p-2 rounded transition-colors',
                        copiedFile === activeFile.filename
                          ? 'text-green-500 bg-green-500/10'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      )}
                      title="Copy to clipboard"
                    >
                      {copiedFile === activeFile.filename ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDownloadFile(activeFile)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Code block */}
                <div className="flex-1 overflow-auto">
                  <CodeBlock
                    code={activeFile.content}
                    language={LANGUAGE_MAP[activeFile.language] || activeFile.language}
                  />
                </div>

                {/* File stats */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-gray-800 text-xs text-gray-500 shrink-0">
                  <span>{activeFile.content.split('\n').length} lines</span>
                  <span>{new Blob([activeFile.content]).size} bytes</span>
                </div>
              </div>

              {/* Live preview */}
              {showPreview && (
                <div className="w-1/2 border-l border-gray-800 flex flex-col">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 shrink-0">
                    <span className="text-sm text-gray-400">Live Preview</span>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 bg-white overflow-auto">
                    <iframe
                      ref={iframeRef}
                      title="Preview"
                      className="w-full h-full border-0"
                      sandbox="allow-scripts"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// CODE BLOCK COMPONENT
// ============================================================================

interface CodeBlockProps {
  code: string;
  language: string;
}

function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <Highlight theme={themes.vsDark} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn(className, 'p-4 text-sm min-h-full')}
          style={{ ...style, backgroundColor: 'transparent', margin: 0 }}
        >
          <code className="block">
            {tokens.map((line, lineIndex) => {
              const lineProps = getLineProps({ line });
              return (
                <div key={lineIndex} {...lineProps} className={cn(lineProps.className, 'table-row')}>
                  <span className="table-cell pr-4 text-gray-600 select-none text-right w-10 sticky left-0 bg-gray-900">
                    {lineIndex + 1}
                  </span>
                  <span className="table-cell">
                    {line.map((token, tokenIndex) => {
                      const tokenProps = getTokenProps({ token });
                      return <span key={tokenIndex} {...tokenProps} />;
                    })}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      )}
    </Highlight>
  );
}

// ============================================================================
// EXPORT BUTTON COMPONENT
// ============================================================================

export function ExportButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        <Package className="w-4 h-4" />
        Export
      </button>
      <ExportPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
