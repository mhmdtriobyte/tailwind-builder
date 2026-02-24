'use client';

import { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useCustomizationStore } from '@/store/customizationStore';
import { useBuilderStore } from '@/store/builderStore';

// ============================================================================
// CONSTANTS
// ============================================================================

const ANIMATION_PRESETS = [
  {
    id: 'fade-in',
    name: 'Fade In',
    category: 'entrance',
    class: 'animate-fade-in',
    keyframes: 'from { opacity: 0; } to { opacity: 1; }',
  },
  {
    id: 'fade-out',
    name: 'Fade Out',
    category: 'exit',
    class: 'animate-fade-out',
    keyframes: 'from { opacity: 1; } to { opacity: 0; }',
  },
  {
    id: 'slide-up',
    name: 'Slide Up',
    category: 'entrance',
    class: 'animate-slide-up',
    keyframes: 'from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; }',
  },
  {
    id: 'slide-down',
    name: 'Slide Down',
    category: 'entrance',
    class: 'animate-slide-down',
    keyframes: 'from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; }',
  },
  {
    id: 'slide-left',
    name: 'Slide Left',
    category: 'entrance',
    class: 'animate-slide-left',
    keyframes: 'from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; }',
  },
  {
    id: 'slide-right',
    name: 'Slide Right',
    category: 'entrance',
    class: 'animate-slide-right',
    keyframes: 'from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; }',
  },
  {
    id: 'scale-in',
    name: 'Scale In',
    category: 'entrance',
    class: 'animate-scale-in',
    keyframes: 'from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; }',
  },
  {
    id: 'bounce',
    name: 'Bounce',
    category: 'attention',
    class: 'animate-bounce',
    keyframes: '0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); }',
  },
  {
    id: 'pulse',
    name: 'Pulse',
    category: 'attention',
    class: 'animate-pulse',
    keyframes: '0%, 100% { opacity: 1; } 50% { opacity: 0.5; }',
  },
  {
    id: 'spin',
    name: 'Spin',
    category: 'loop',
    class: 'animate-spin',
    keyframes: 'from { transform: rotate(0deg); } to { transform: rotate(360deg); }',
  },
  {
    id: 'ping',
    name: 'Ping',
    category: 'attention',
    class: 'animate-ping',
    keyframes: '75%, 100% { transform: scale(2); opacity: 0; }',
  },
  {
    id: 'shake',
    name: 'Shake',
    category: 'attention',
    class: 'animate-shake',
    keyframes: '0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); }',
  },
];

const TRANSITION_DURATIONS = [
  { value: 75, label: '75ms' },
  { value: 100, label: '100ms' },
  { value: 150, label: '150ms' },
  { value: 200, label: '200ms' },
  { value: 300, label: '300ms' },
  { value: 500, label: '500ms' },
  { value: 700, label: '700ms' },
  { value: 1000, label: '1000ms' },
];

const EASING_OPTIONS = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
];

const CATEGORY_ICONS = {
  entrance: ArrowRight,
  exit: ArrowLeft,
  attention: Sparkles,
  loop: RotateCcw,
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface AnimationPreviewProps {
  animation: typeof ANIMATION_PRESETS[0];
  isPlaying: boolean;
  onTogglePlay: () => void;
}

function AnimationPreview({ animation, isPlaying, onTogglePlay }: AnimationPreviewProps) {
  return (
    <div className="relative aspect-video bg-gray-800/50 rounded-lg overflow-hidden">
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          isPlaying && animation.class
        )}
        style={{
          animationDuration: '1s',
          animationIterationCount: animation.category === 'loop' ? 'infinite' : '1',
        }}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg" />
      </div>
      <button
        onClick={onTogglePlay}
        className={cn(
          'absolute bottom-2 right-2 p-1.5 rounded-md',
          'bg-gray-900/80 text-gray-300 hover:text-white',
          'transition-colors duration-150'
        )}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
    </div>
  );
}

interface AnimationCardProps {
  animation: typeof ANIMATION_PRESETS[0];
  isSelected: boolean;
  onSelect: () => void;
}

function AnimationCard({ animation, isSelected, onSelect }: AnimationCardProps) {
  const CategoryIcon = CATEGORY_ICONS[animation.category as keyof typeof CATEGORY_ICONS];

  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex items-center gap-2 p-2 rounded-lg border transition-all duration-200',
        'text-left',
        isSelected
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-md flex items-center justify-center',
          isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-400'
        )}
      >
        <CategoryIcon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{animation.name}</p>
        <p className="text-xs text-gray-500 capitalize">{animation.category}</p>
      </div>
    </button>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AnimationPanel() {
  const { globalTransition, setGlobalTransition } = useCustomizationStore();
  const { selectedId, getElementById, updateElement } = useBuilderStore();

  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const selectedElement = selectedId ? getElementById(selectedId) : null;
  const activeAnimation = ANIMATION_PRESETS.find((a) => a.id === selectedAnimation);

  const filteredAnimations =
    categoryFilter === 'all'
      ? ANIMATION_PRESETS
      : ANIMATION_PRESETS.filter((a) => a.category === categoryFilter);

  const handleApplyAnimation = () => {
    if (!selectedElement || !activeAnimation) return;

    const currentClasses = selectedElement.styles.effects || [];
    const newClasses = [...currentClasses.filter((c) => !c.startsWith('animate-')), activeAnimation.class];

    updateElement(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        effects: newClasses,
      },
    });
  };

  const handleRemoveAnimation = () => {
    if (!selectedElement) return;

    const currentClasses = selectedElement.styles.effects || [];
    const newClasses = currentClasses.filter((c) => !c.startsWith('animate-'));

    updateElement(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        effects: newClasses,
      },
    });
    setSelectedAnimation(null);
  };

  return (
    <div className="space-y-4">
      {/* Transition Settings */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Global Transitions
        </h4>

        {/* Duration */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Duration</label>
          <select
            value={globalTransition.duration}
            onChange={(e) =>
              setGlobalTransition({ ...globalTransition, duration: Number(e.target.value) })
            }
            className={cn(
              'w-full px-3 py-2 text-sm rounded-lg',
              'bg-gray-800 border border-gray-700 text-gray-300',
              'focus:outline-none focus:border-blue-500'
            )}
          >
            {TRANSITION_DURATIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Easing */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Easing</label>
          <select
            value={globalTransition.easing}
            onChange={(e) =>
              setGlobalTransition({
                ...globalTransition,
                easing: e.target.value as typeof globalTransition.easing,
              })
            }
            className={cn(
              'w-full px-3 py-2 text-sm rounded-lg',
              'bg-gray-800 border border-gray-700 text-gray-300',
              'focus:outline-none focus:border-blue-500'
            )}
          >
            {EASING_OPTIONS.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Animation Presets
        </h4>
        <div className="flex gap-1 flex-wrap">
          {['all', 'entrance', 'exit', 'attention', 'loop'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                'px-2 py-1 text-xs rounded-md transition-colors capitalize',
                categoryFilter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Animation Preview */}
      {activeAnimation && (
        <AnimationPreview
          animation={activeAnimation}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
        />
      )}

      {/* Animation Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar">
        {filteredAnimations.map((animation) => (
          <AnimationCard
            key={animation.id}
            animation={animation}
            isSelected={selectedAnimation === animation.id}
            onSelect={() => setSelectedAnimation(animation.id)}
          />
        ))}
      </div>

      {/* Apply/Remove Buttons */}
      {selectedElement && (
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleApplyAnimation}
            disabled={!selectedAnimation}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg',
              'text-sm font-medium transition-colors duration-200',
              selectedAnimation
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            )}
          >
            <Zap className="w-4 h-4" />
            Apply
          </button>
          <button
            onClick={handleRemoveAnimation}
            className={cn(
              'py-2 px-3 rounded-lg border border-gray-700',
              'text-gray-400 hover:text-white hover:bg-gray-800',
              'text-sm font-medium transition-colors duration-200'
            )}
          >
            Remove
          </button>
        </div>
      )}

      {!selectedElement && (
        <p className="text-xs text-gray-500 text-center py-2">
          Select an element to apply animations
        </p>
      )}
    </div>
  );
}

export default AnimationPanel;
