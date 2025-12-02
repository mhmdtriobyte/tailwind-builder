import { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react';
import { Upload, File, X, Check, AlertCircle, Image, FileText, Film, Music } from 'lucide-react';
import { cn } from '@/utils/cn';

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  preview?: string;
}

interface FileUploadProps {
  onFilesSelect?: (files: File[]) => void;
  onFileRemove?: (fileId: string) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in bytes
  multiple?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
  description?: string;
  showPreview?: boolean;
  files?: UploadedFile[];
  className?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image;
  if (type.startsWith('video/')) return Film;
  if (type.startsWith('audio/')) return Music;
  if (type.includes('pdf') || type.includes('document')) return FileText;
  return File;
};

export function FileUpload({
  onFilesSelect,
  onFileRemove,
  accept,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = true,
  disabled = false,
  error,
  helperText,
  label = 'Upload files',
  description,
  showPreview = true,
  files: externalFiles,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [internalFiles, setInternalFiles] = useState<UploadedFile[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const files = externalFiles ?? internalFiles;

  const validateFiles = useCallback((fileList: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];

    const currentCount = files.length;
    const remainingSlots = maxFiles - currentCount;

    fileList.forEach((file, index) => {
      if (index >= remainingSlots) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        return;
      }

      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds ${formatFileSize(maxSize)} limit`);
        return;
      }

      if (accept) {
        const acceptedTypes = accept.split(',').map((t) => t.trim());
        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.replace('/*', '/'));
          }
          return file.type === type;
        });

        if (!isAccepted) {
          errors.push(`${file.name} is not an accepted file type`);
          return;
        }
      }

      valid.push(file);
    });

    return { valid, errors };
  }, [accept, files.length, maxFiles, maxSize]);

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const fileArray = Array.from(fileList);
    const { valid, errors } = validateFiles(fileArray);

    if (errors.length > 0) {
      setValidationError(errors[0]);
      setTimeout(() => setValidationError(null), 5000);
    }

    if (valid.length > 0) {
      const newFiles: UploadedFile[] = valid.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        progress: 0,
        status: 'pending' as const,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));

      if (!externalFiles) {
        setInternalFiles((prev) => [...prev, ...newFiles]);
      }

      onFilesSelect?.(valid);
    }
  }, [validateFiles, externalFiles, onFilesSelect]);

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!disabled && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    }
  };

  const handleRemove = (fileId: string) => {
    if (!externalFiles) {
      setInternalFiles((prev) => {
        const file = prev.find((f) => f.id === fileId);
        if (file?.preview) {
          URL.revokeObjectURL(file.preview);
        }
        return prev.filter((f) => f.id !== fileId);
      });
    }
    onFileRemove?.(fileId);
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const defaultDescription = `Drag and drop your files here, or click to browse${
    maxSize ? `. Max ${formatFileSize(maxSize)} per file` : ''
  }`;

  return (
    <div className={cn('w-full space-y-3', className)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label={label}
        aria-disabled={disabled}
        className={cn(
          'relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-colors cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : error || validationError
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed hover:bg-gray-50 hover:border-gray-300'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          className="sr-only"
          aria-hidden="true"
        />

        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mb-4',
            isDragging ? 'bg-blue-100' : 'bg-gray-200'
          )}
        >
          <Upload
            className={cn(
              'w-6 h-6',
              isDragging ? 'text-blue-600' : 'text-gray-500'
            )}
            aria-hidden="true"
          />
        </div>

        <p className="text-sm font-medium text-gray-700">
          {isDragging ? 'Drop files here' : 'Upload files'}
        </p>
        <p className="mt-1 text-xs text-gray-500 text-center max-w-xs">
          {description || defaultDescription}
        </p>

        {accept && (
          <p className="mt-2 text-xs text-gray-400">
            Accepted: {accept}
          </p>
        )}
      </div>

      {/* Error Messages */}
      {(error || validationError) && (
        <div
          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-red-600">{error || validationError}</p>
        </div>
      )}

      {/* Helper Text */}
      {helperText && !error && !validationError && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}

      {/* File List */}
      {showPreview && files.length > 0 && (
        <ul className="space-y-2" role="list" aria-label="Uploaded files">
          {files.map((uploadedFile) => {
            const FileIcon = getFileIcon(uploadedFile.file.type);

            return (
              <li
                key={uploadedFile.id}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
              >
                {/* Preview / Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {uploadedFile.preview ? (
                    <img
                      src={uploadedFile.preview}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>

                  {/* Progress Bar */}
                  {uploadedFile.status === 'uploading' && (
                    <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${uploadedFile.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Error Message */}
                  {uploadedFile.status === 'error' && uploadedFile.error && (
                    <p className="mt-1 text-xs text-red-500">{uploadedFile.error}</p>
                  )}
                </div>

                {/* Status / Remove Button */}
                <div className="flex-shrink-0">
                  {uploadedFile.status === 'success' ? (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" aria-hidden="true" />
                    </div>
                  ) : uploadedFile.status === 'error' ? (
                    <button
                      type="button"
                      onClick={() => handleRemove(uploadedFile.id)}
                      className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Remove ${uploadedFile.file.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRemove(uploadedFile.id)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                      aria-label={`Remove ${uploadedFile.file.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
