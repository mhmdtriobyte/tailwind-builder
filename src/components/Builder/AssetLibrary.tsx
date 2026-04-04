'use client';

import {
  useState,
  useMemo,
  useCallback,
} from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Slider from '@radix-ui/react-slider';
import {
  Search,
  X,
  Image as ImageIcon,
  Grid3X3,
  Circle,
  Palette,
  ExternalLink,
  Copy,
  Check,
  Waves,
  Triangle,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  generateBlob,
  generateWave,
  generatePattern,
  generateDivider,
  getPatternTypes,
  getDividerTypes,
  type BlobConfig,
  type WaveConfig,
  type PatternType,
  type DividerType,
  type GeometricPatternConfig,
} from '@/lib/shapeGenerator';
import { GradientBuilder, generateGradientCSS, type GradientConfig } from './GradientBuilder';

// ============================================================================
// CONSTANTS
// ============================================================================

const UNSPLASH_IMAGES = [
  { id: 'photo-1506905925346-21bda4d32df4', category: 'nature', name: 'Mountains' },
  { id: 'photo-1470071459604-3b5ec3a7fe05', category: 'nature', name: 'Forest' },
  { id: 'photo-1441974231531-c6227db76b6e', category: 'nature', name: 'Sunlight Trees' },
  { id: 'photo-1469474968028-56623f02e42e', category: 'nature', name: 'Landscape' },
  { id: 'photo-1472214103451-9374bd1c798e', category: 'nature', name: 'Meadow' },
  { id: 'photo-1507003211169-0a1dd7228f2d', category: 'people', name: 'Portrait Man' },
  { id: 'photo-1494790108377-be9c29b29330', category: 'people', name: 'Portrait Woman' },
  { id: 'photo-1517841905240-472988babdf9', category: 'people', name: 'Fashion' },
  { id: 'photo-1534528741775-53994a69daeb', category: 'people', name: 'Model' },
  { id: 'photo-1506794778202-cad84cf45f1d', category: 'people', name: 'Headshot' },
  { id: 'photo-1486312338219-ce68d2c6f44d', category: 'business', name: 'Laptop Work' },
  { id: 'photo-1497032628192-86f99bcd76bc', category: 'business', name: 'Office' },
  { id: 'photo-1521737711867-e3b97375f902', category: 'business', name: 'Team Meeting' },
  { id: 'photo-1553877522-43269d4ea984', category: 'business', name: 'Startup' },
  { id: 'photo-1454165804606-c3d57bc86b40', category: 'business', name: 'Analytics' },
  { id: 'photo-1505740420928-5e560c06d30e', category: 'products', name: 'Headphones' },
  { id: 'photo-1523275335684-37898b6baf30', category: 'products', name: 'Watch' },
  { id: 'photo-1526170375885-4d8ecf77b99f', category: 'products', name: 'Camera' },
  { id: 'photo-1572635196237-14b3f281503f', category: 'products', name: 'Sunglasses' },
  { id: 'photo-1485955900006-10f4d324d411', category: 'products', name: 'Coffee' },
  { id: 'photo-1461749280684-dccba630e2f6', category: 'tech', name: 'Code' },
  { id: 'photo-1504639725590-34d0984388bd', category: 'tech', name: 'Programming' },
  { id: 'photo-1518770660439-4636190af475', category: 'tech', name: 'Circuit' },
  { id: 'photo-1531297484001-80022131f5a1', category: 'tech', name: 'Laptop' },
  { id: 'photo-1488590528505-98d2b5aba04b', category: 'tech', name: 'Computer' },
  { id: 'photo-1495562569060-2eec283d3391', category: 'abstract', name: 'Gradient' },
  { id: 'photo-1557672172-298e090bd0f1', category: 'abstract', name: 'Pink Abstract' },
  { id: 'photo-1579546929518-9e396f3cc809', category: 'abstract', name: 'Colors' },
  { id: 'photo-1550684376-efcbd6e3f031', category: 'abstract', name: 'Neon' },
  { id: 'photo-1614850523459-c2f4c699c52e', category: 'abstract', name: 'Waves' },
];

const IMAGE_CATEGORIES = ['all', 'nature', 'people', 'business', 'products', 'tech', 'abstract'];

const DEFAULT_GRADIENT_PRESETS: GradientConfig[] = [
  {
    type: 'linear',
    angle: 135,
    centerX: 50,
    centerY: 50,
    stops: [
      { id: 's1', color: '#667eea', position: 0 },
      { id: 's2', color: '#764ba2', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 90,
    centerX: 50,
    centerY: 50,
    stops: [
      { id: 's1', color: '#f093fb', position: 0 },
      { id: 's2', color: '#f5576c', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 180,
    centerX: 50,
    centerY: 50,
    stops: [
      { id: 's1', color: '#11998e', position: 0 },
      { id: 's2', color: '#38ef7d', position: 100 },
    ],
  },
  {
    type: 'radial',
    angle: 0,
    centerX: 50,
    centerY: 50,
    stops: [
      { id: 's1', color: '#a18cd1', position: 0 },
      { id: 's2', color: '#fbc2eb', position: 100 },
    ],
  },
];

// ============================================================================
// TYPES
// ============================================================================

interface AssetLibraryProps {
  onSelectImage?: (url: string) => void;
  onSelectPattern?: (svg: string) => void;
  onSelectShape?: (svg: string) => void;
  onSelectGradient?: (css: string, config: GradientConfig) => void;
  className?: string;
}

type TabValue = 'images' | 'patterns' | 'shapes' | 'gradients';

// ============================================================================
// SEARCH INPUT
// ============================================================================

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-8 pr-8 py-2 text-sm',
          'bg-gray-800 border border-gray-700 rounded-lg',
          'text-gray-200 placeholder:text-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50',
          'transition-all duration-200'
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2',
            'w-5 h-5 flex items-center justify-center rounded-full',
            'text-gray-500 hover:text-gray-300 hover:bg-gray-700',
            'transition-colors duration-150'
          )}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// ============================================================================
// IMAGE GRID
// ============================================================================

interface ImageGridProps {
  onSelect: (url: string) => void;
}

function ImageGrid({ onSelect }: ImageGridProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [copied, setCopied] = useState<string | null>(null);

  const filteredImages = useMemo(() => {
    return UNSPLASH_IMAGES.filter((img) => {
      const matchesCategory = category === 'all' || img.category === category;
      const matchesSearch = !search || img.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const getImageUrl = (id: string, width = 400) => {
    return `https://images.unsplash.com/${id}?w=${width}&auto=format&fit=crop`;
  };

  const handleCopyUrl = useCallback(async (id: string) => {
    const url = getImageUrl(id, 800);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  return (
    <div className="space-y-3">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search images..."
      />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-1">
        {IMAGE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-2 py-1 text-xs rounded-md transition-colors capitalize',
              category === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
        {filteredImages.map((img) => (
          <div
            key={img.id}
            className={cn(
              'relative aspect-square rounded-lg overflow-hidden group cursor-pointer',
              'border-2 border-transparent hover:border-blue-500',
              'transition-all duration-150'
            )}
            onClick={() => onSelect(getImageUrl(img.id, 800))}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', getImageUrl(img.id, 800));
              e.dataTransfer.setData('application/x-asset-type', 'image');
            }}
          >
            <img
              src={getImageUrl(img.id, 200)}
              alt={img.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className={cn(
                'absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100',
                'flex items-center justify-center gap-2',
                'transition-opacity duration-150'
              )}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyUrl(img.id);
                }}
                className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                title="Copy URL"
              >
                {copied === img.id ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-white" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(getImageUrl(img.id, 1200), '_blank');
                }}
                className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="absolute bottom-0 inset-x-0 px-2 py-1 bg-black/60 text-xs text-white truncate">
              {img.name}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center">
        Images from Unsplash. Click to select or drag to canvas.
      </p>
    </div>
  );
}

// ============================================================================
// PATTERNS TAB
// ============================================================================

interface PatternsTabProps {
  onSelect: (svg: string) => void;
}

function PatternsTab({ onSelect }: PatternsTabProps) {
  const [selectedType, setSelectedType] = useState<PatternType>('dots');
  const [config, setConfig] = useState<Partial<GeometricPatternConfig>>({
    spacing: 20,
    size: 4,
    color: '#3b82f6',
    fill: true,
    strokeWidth: 1,
  });
  const [copied, setCopied] = useState(false);

  const patternTypes = getPatternTypes();

  const previewSvg = useMemo(() => {
    return generatePattern({
      width: 200,
      height: 100,
      type: selectedType,
      spacing: config.spacing || 20,
      size: config.size || 4,
      color: config.color || '#3b82f6',
      fill: config.fill,
      strokeWidth: config.strokeWidth || 1,
    });
  }, [selectedType, config]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(previewSvg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [previewSvg]);

  return (
    <div className="space-y-4">
      {/* Pattern Type Selector */}
      <div className="grid grid-cols-5 gap-1 max-h-32 overflow-y-auto custom-scrollbar">
        {patternTypes.map((type) => {
          const svg = generatePattern({
            width: 40,
            height: 40,
            type,
            spacing: 10,
            size: 3,
            color: selectedType === type ? '#3b82f6' : '#6b7280',
            fill: true,
          });

          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                'aspect-square rounded-md overflow-hidden border-2',
                'transition-all duration-150',
                selectedType === type
                  ? 'border-blue-500 ring-2 ring-blue-500/30'
                  : 'border-gray-700 hover:border-gray-600'
              )}
              title={type}
            >
              <div
                className="w-full h-full bg-gray-900"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </button>
          );
        })}
      </div>

      {/* Pattern Controls */}
      <div className="space-y-3 p-3 bg-gray-800/50 rounded-lg">
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Spacing: {config.spacing}px</label>
          <Slider.Root
            value={[config.spacing || 20]}
            onValueChange={([value]) => setConfig({ ...config, spacing: value })}
            min={5}
            max={50}
            step={1}
            className="relative flex items-center w-full h-5 touch-none select-none"
          >
            <Slider.Track className="relative h-1.5 flex-1 bg-gray-700 rounded-full">
              <Slider.Range className="absolute h-full bg-blue-500 rounded-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </Slider.Root>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400">Size: {config.size}px</label>
          <Slider.Root
            value={[config.size || 4]}
            onValueChange={([value]) => setConfig({ ...config, size: value })}
            min={1}
            max={20}
            step={1}
            className="relative flex items-center w-full h-5 touch-none select-none"
          >
            <Slider.Track className="relative h-1.5 flex-1 bg-gray-700 rounded-full">
              <Slider.Range className="absolute h-full bg-blue-500 rounded-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </Slider.Root>
        </div>

        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Color</label>
            <input
              type="color"
              value={config.color || '#3b82f6'}
              onChange={(e) => setConfig({ ...config, color: e.target.value })}
              className="w-10 h-8 rounded cursor-pointer"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.fill}
              onChange={(e) => setConfig({ ...config, fill: e.target.checked })}
              className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-400">Filled</span>
          </label>
        </div>
      </div>

      {/* Preview */}
      <div
        className="h-24 rounded-lg border-2 border-gray-700 overflow-hidden bg-white"
        dangerouslySetInnerHTML={{ __html: previewSvg }}
      />

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onSelect(previewSvg)}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg',
            'bg-blue-600 text-white hover:bg-blue-500',
            'transition-colors duration-150'
          )}
        >
          <Plus className="w-4 h-4" />
          Apply Pattern
        </button>
        <button
          onClick={handleCopy}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg',
            'bg-gray-800 text-gray-300 hover:bg-gray-700',
            'transition-colors duration-150'
          )}
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// SHAPES TAB
// ============================================================================

interface ShapesTabProps {
  onSelect: (svg: string) => void;
}

function ShapesTab({ onSelect }: ShapesTabProps) {
  const [shapeType, setShapeType] = useState<'blob' | 'wave' | 'divider'>('blob');
  const [blobConfig, setBlobConfig] = useState<Partial<BlobConfig>>({
    complexity: 8,
    randomness: 0.5,
    size: 200,
    color: '#3b82f6',
  });
  const [waveConfig, setWaveConfig] = useState<Partial<WaveConfig>>({
    waves: 3,
    amplitude: 0.3,
    position: 'top',
    smooth: true,
    color: '#3b82f6',
  });
  const [dividerType, setDividerType] = useState<DividerType>('wave');
  const [seed, setSeed] = useState(Date.now());
  const [copied, setCopied] = useState(false);

  const dividerTypes = getDividerTypes();

  const previewSvg = useMemo(() => {
    if (shapeType === 'blob') {
      return generateBlob({
        complexity: blobConfig.complexity || 8,
        randomness: blobConfig.randomness || 0.5,
        size: blobConfig.size || 200,
        color: blobConfig.color || '#3b82f6',
        seed,
      });
    } else if (shapeType === 'wave') {
      return generateWave({
        width: 400,
        height: 100,
        waves: waveConfig.waves || 3,
        amplitude: waveConfig.amplitude || 0.3,
        position: waveConfig.position || 'top',
        smooth: waveConfig.smooth !== false,
        color: waveConfig.color || '#3b82f6',
      });
    } else {
      return generateDivider({
        width: 400,
        height: 80,
        type: dividerType,
        color: blobConfig.color || '#3b82f6',
      });
    }
  }, [shapeType, blobConfig, waveConfig, dividerType, seed]);

  const handleRandomize = useCallback(() => {
    setSeed(Date.now());
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(previewSvg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [previewSvg]);

  return (
    <div className="space-y-4">
      {/* Shape Type Toggle */}
      <div className="flex gap-1 p-1 bg-gray-800 rounded-lg">
        <button
          onClick={() => setShapeType('blob')}
          className={cn(
            'flex items-center gap-1.5 flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
            shapeType === 'blob'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
          )}
        >
          <Circle className="w-3.5 h-3.5" />
          Blobs
        </button>
        <button
          onClick={() => setShapeType('wave')}
          className={cn(
            'flex items-center gap-1.5 flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
            shapeType === 'wave'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
          )}
        >
          <Waves className="w-3.5 h-3.5" />
          Waves
        </button>
        <button
          onClick={() => setShapeType('divider')}
          className={cn(
            'flex items-center gap-1.5 flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
            shapeType === 'divider'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
          )}
        >
          <Triangle className="w-3.5 h-3.5" />
          Dividers
        </button>
      </div>

      {/* Shape Controls */}
      <div className="space-y-3 p-3 bg-gray-800/50 rounded-lg">
        {shapeType === 'blob' && (
          <>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Complexity: {blobConfig.complexity}</label>
              <Slider.Root
                value={[blobConfig.complexity || 8]}
                onValueChange={([value]) => setBlobConfig({ ...blobConfig, complexity: value })}
                min={3}
                max={15}
                step={1}
                className="relative flex items-center w-full h-5 touch-none select-none"
              >
                <Slider.Track className="relative h-1.5 flex-1 bg-gray-700 rounded-full">
                  <Slider.Range className="absolute h-full bg-blue-500 rounded-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Slider.Root>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400">Randomness: {Math.round((blobConfig.randomness || 0.5) * 100)}%</label>
              <Slider.Root
                value={[(blobConfig.randomness || 0.5) * 100]}
                onValueChange={([value]) => setBlobConfig({ ...blobConfig, randomness: value / 100 })}
                min={10}
                max={90}
                step={5}
                className="relative flex items-center w-full h-5 touch-none select-none"
              >
                <Slider.Track className="relative h-1.5 flex-1 bg-gray-700 rounded-full">
                  <Slider.Range className="absolute h-full bg-blue-500 rounded-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Slider.Root>
            </div>

            <button
              onClick={handleRandomize}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md',
                'bg-gray-700 text-gray-300 hover:bg-gray-600',
                'transition-colors duration-150'
              )}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Randomize
            </button>
          </>
        )}

        {shapeType === 'wave' && (
          <>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Waves: {waveConfig.waves}</label>
              <Slider.Root
                value={[waveConfig.waves || 3]}
                onValueChange={([value]) => setWaveConfig({ ...waveConfig, waves: value })}
                min={1}
                max={8}
                step={1}
                className="relative flex items-center w-full h-5 touch-none select-none"
              >
                <Slider.Track className="relative h-1.5 flex-1 bg-gray-700 rounded-full">
                  <Slider.Range className="absolute h-full bg-blue-500 rounded-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Slider.Root>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400">Amplitude: {Math.round((waveConfig.amplitude || 0.3) * 100)}%</label>
              <Slider.Root
                value={[(waveConfig.amplitude || 0.3) * 100]}
                onValueChange={([value]) => setWaveConfig({ ...waveConfig, amplitude: value / 100 })}
                min={10}
                max={80}
                step={5}
                className="relative flex items-center w-full h-5 touch-none select-none"
              >
                <Slider.Track className="relative h-1.5 flex-1 bg-gray-700 rounded-full">
                  <Slider.Range className="absolute h-full bg-blue-500 rounded-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Slider.Root>
            </div>

            <div className="flex gap-1">
              {(['top', 'bottom'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setWaveConfig({ ...waveConfig, position: pos })}
                  className={cn(
                    'flex-1 px-3 py-1.5 text-xs rounded-md capitalize transition-colors',
                    waveConfig.position === pos
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  )}
                >
                  {pos}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={waveConfig.smooth !== false}
                onChange={(e) => setWaveConfig({ ...waveConfig, smooth: e.target.checked })}
                className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-400">Smooth curves</span>
            </label>
          </>
        )}

        {shapeType === 'divider' && (
          <div className="grid grid-cols-4 gap-1 max-h-24 overflow-y-auto custom-scrollbar">
            {dividerTypes.map((type) => {
              const svg = generateDivider({
                width: 60,
                height: 30,
                type,
                color: dividerType === type ? '#3b82f6' : '#6b7280',
              });

              return (
                <button
                  key={type}
                  onClick={() => setDividerType(type)}
                  className={cn(
                    'aspect-[2/1] rounded-md overflow-hidden border-2',
                    'transition-all duration-150',
                    dividerType === type
                      ? 'border-blue-500 ring-2 ring-blue-500/30'
                      : 'border-gray-700 hover:border-gray-600'
                  )}
                  title={type}
                >
                  <div
                    className="w-full h-full bg-gray-900"
                    dangerouslySetInnerHTML={{ __html: svg }}
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Color Picker */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-700">
          <label className="text-xs text-gray-400">Color</label>
          <input
            type="color"
            value={shapeType === 'wave' ? waveConfig.color || '#3b82f6' : blobConfig.color || '#3b82f6'}
            onChange={(e) => {
              if (shapeType === 'wave') {
                setWaveConfig({ ...waveConfig, color: e.target.value });
              } else {
                setBlobConfig({ ...blobConfig, color: e.target.value });
              }
            }}
            className="w-10 h-8 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Preview */}
      <div
        className={cn(
          'rounded-lg border-2 border-gray-700 overflow-hidden bg-white flex items-center justify-center',
          shapeType === 'blob' ? 'h-32' : 'h-24'
        )}
        dangerouslySetInnerHTML={{ __html: previewSvg }}
      />

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onSelect(previewSvg)}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg',
            'bg-blue-600 text-white hover:bg-blue-500',
            'transition-colors duration-150'
          )}
        >
          <Plus className="w-4 h-4" />
          Apply Shape
        </button>
        <button
          onClick={handleCopy}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg',
            'bg-gray-800 text-gray-300 hover:bg-gray-700',
            'transition-colors duration-150'
          )}
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// GRADIENTS TAB
// ============================================================================

interface GradientsTabProps {
  onSelect: (css: string, config: GradientConfig) => void;
}

function GradientsTab({ onSelect }: GradientsTabProps) {
  const [showBuilder, setShowBuilder] = useState(false);
  const [config, setConfig] = useState<GradientConfig>(DEFAULT_GRADIENT_PRESETS[0]);

  const handlePresetSelect = useCallback(
    (preset: GradientConfig) => {
      setConfig(preset);
      onSelect(generateGradientCSS(preset), preset);
    },
    [onSelect]
  );

  const handleCustomChange = useCallback(
    (newConfig: GradientConfig) => {
      setConfig(newConfig);
      onSelect(generateGradientCSS(newConfig), newConfig);
    },
    [onSelect]
  );

  return (
    <div className="space-y-4">
      {/* Preset Gradients */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">Presets</label>
          <button
            onClick={() => setShowBuilder(!showBuilder)}
            className={cn(
              'text-xs text-blue-400 hover:text-blue-300 transition-colors'
            )}
          >
            {showBuilder ? 'Hide Builder' : 'Custom Gradient'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {DEFAULT_GRADIENT_PRESETS.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetSelect(preset)}
              className={cn(
                'h-16 rounded-lg border-2 border-gray-700',
                'hover:border-blue-500 hover:ring-2 hover:ring-blue-500/30',
                'transition-all duration-150'
              )}
              style={{ background: generateGradientCSS(preset) }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', generateGradientCSS(preset));
                e.dataTransfer.setData('application/x-asset-type', 'gradient');
              }}
            />
          ))}
        </div>
      </div>

      {/* Gradient Builder */}
      {showBuilder && (
        <div className="pt-4 border-t border-gray-800">
          <GradientBuilder value={config} onChange={handleCustomChange} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN ASSET LIBRARY COMPONENT
// ============================================================================

export function AssetLibrary({
  onSelectImage,
  onSelectPattern,
  onSelectShape,
  onSelectGradient,
  className,
}: AssetLibraryProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('images');

  const handleImageSelect = useCallback(
    (url: string) => {
      onSelectImage?.(url);
    },
    [onSelectImage]
  );

  const handlePatternSelect = useCallback(
    (svg: string) => {
      onSelectPattern?.(svg);
    },
    [onSelectPattern]
  );

  const handleShapeSelect = useCallback(
    (svg: string) => {
      onSelectShape?.(svg);
    },
    [onSelectShape]
  );

  const handleGradientSelect = useCallback(
    (css: string, config: GradientConfig) => {
      onSelectGradient?.(css, config);
    },
    [onSelectGradient]
  );

  return (
    <div className={cn('bg-gray-900 rounded-xl border border-gray-800', className)}>
      <Tabs.Root value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        {/* Tab List */}
        <Tabs.List className="flex border-b border-gray-800">
          <Tabs.Trigger
            value="images"
            className={cn(
              'flex items-center gap-1.5 flex-1 px-4 py-3 text-sm font-medium',
              'border-b-2 transition-colors duration-150',
              activeTab === 'images'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            )}
          >
            <ImageIcon className="w-4 h-4" />
            Images
          </Tabs.Trigger>
          <Tabs.Trigger
            value="patterns"
            className={cn(
              'flex items-center gap-1.5 flex-1 px-4 py-3 text-sm font-medium',
              'border-b-2 transition-colors duration-150',
              activeTab === 'patterns'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            )}
          >
            <Grid3X3 className="w-4 h-4" />
            Patterns
          </Tabs.Trigger>
          <Tabs.Trigger
            value="shapes"
            className={cn(
              'flex items-center gap-1.5 flex-1 px-4 py-3 text-sm font-medium',
              'border-b-2 transition-colors duration-150',
              activeTab === 'shapes'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            )}
          >
            <Circle className="w-4 h-4" />
            Shapes
          </Tabs.Trigger>
          <Tabs.Trigger
            value="gradients"
            className={cn(
              'flex items-center gap-1.5 flex-1 px-4 py-3 text-sm font-medium',
              'border-b-2 transition-colors duration-150',
              activeTab === 'gradients'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            )}
          >
            <Palette className="w-4 h-4" />
            Gradients
          </Tabs.Trigger>
        </Tabs.List>

        {/* Tab Content */}
        <div className="p-4">
          <Tabs.Content value="images">
            <ImageGrid onSelect={handleImageSelect} />
          </Tabs.Content>

          <Tabs.Content value="patterns">
            <PatternsTab onSelect={handlePatternSelect} />
          </Tabs.Content>

          <Tabs.Content value="shapes">
            <ShapesTab onSelect={handleShapeSelect} />
          </Tabs.Content>

          <Tabs.Content value="gradients">
            <GradientsTab onSelect={handleGradientSelect} />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}

export default AssetLibrary;
