'use client';

import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
import {
  Activity,
  Cpu,
  HardDrive,
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Gauge,
  Box,
  Code,
  Image as ImageIcon,
  Layers,
  X,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useBuilderStore } from '@/store/builderStore';
import {
  analyzeBundleSize,
  calculatePerformanceScore,
  applyAllOptimizations,
  formatBytes,
  estimateGzipSize,
  analyzeImages,
  type BundleAnalysis,
  type OptimizationSuggestion,
} from '@/lib/performanceOptimizer';
import { getStyleCache, getCodeCache } from '@/lib/cacheSystem';

// ============================================================================
// TYPES
// ============================================================================

interface PerformancePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  status?: 'good' | 'warning' | 'critical';
}

interface SuggestionItemProps {
  suggestion: OptimizationSuggestion;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const REFRESH_INTERVAL = 2000; // 2 seconds

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const MetricCard = memo(function MetricCard({
  icon,
  label,
  value,
  subValue,
  status = 'good',
}: MetricCardProps) {
  const statusColors = {
    good: 'text-green-400 bg-green-400/10',
    warning: 'text-yellow-400 bg-yellow-400/10',
    critical: 'text-red-400 bg-red-400/10',
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
      <div className="flex items-start justify-between">
        <div className={cn('p-2 rounded-lg', statusColors[status])}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{value}</p>
          {subValue && <p className="text-xs text-gray-400">{subValue}</p>}
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-400">{label}</p>
    </div>
  );
});

const SuggestionItem = memo(function SuggestionItem({ suggestion }: SuggestionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeIcons = {
    critical: <AlertTriangle className="w-4 h-4 text-red-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
    info: <Info className="w-4 h-4 text-blue-400" />,
  };

  const typeColors = {
    critical: 'border-red-500/30 bg-red-500/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    info: 'border-blue-500/30 bg-blue-500/5',
  };

  const impactColors = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-green-400',
  };

  return (
    <div
      className={cn(
        'rounded-lg border p-3 transition-colors cursor-pointer',
        typeColors[suggestion.type],
        'hover:bg-gray-800/30'
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-3">
        {typeIcons[suggestion.type]}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white">{suggestion.title}</h4>
            <span className={cn('text-xs font-medium', impactColors[suggestion.impact])}>
              {suggestion.impact.toUpperCase()}
            </span>
          </div>
          {isExpanded && (
            <p className="mt-2 text-sm text-gray-400">{suggestion.description}</p>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
        )}
      </div>
    </div>
  );
});

const ScoreGauge = memo(function ScoreGauge({
  score,
  grade,
}: {
  score: number;
  grade: string;
}) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const gradeColors: Record<string, string> = {
    A: 'stroke-green-400',
    B: 'stroke-lime-400',
    C: 'stroke-yellow-400',
    D: 'stroke-orange-400',
    F: 'stroke-red-400',
  };

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className={gradeColors[grade] || 'stroke-gray-400'}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-lg font-semibold text-gray-400">{grade}</span>
      </div>
    </div>
  );
});

const CacheStats = memo(function CacheStats() {
  const styleCache = getStyleCache();
  const codeCache = getCodeCache();

  const styleStats = styleCache.getStats();
  const codeStats = codeCache.getStats();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-300">Cache Statistics</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800/30 rounded-lg p-3">
          <p className="text-xs text-gray-500">Style Cache</p>
          <p className="text-lg font-semibold text-white">{styleStats.size} entries</p>
          <p className="text-xs text-gray-400">
            Hit rate: {(styleStats.hitRate * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-3">
          <p className="text-xs text-gray-500">Code Cache</p>
          <p className="text-lg font-semibold text-white">{codeStats.size} entries</p>
          <p className="text-xs text-gray-400">
            Hit rate: {(codeStats.hitRate * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const PerformancePanel = memo(function PerformancePanel({
  isOpen,
  onClose,
}: PerformancePanelProps) {
  const { elements } = useBuilderStore();
  const [analysis, setAnalysis] = useState<BundleAnalysis | null>(null);
  const [score, setScore] = useState<{
    overall: number;
    breakdown: { structure: number; css: number; images: number; complexity: number };
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
  } | null>(null);
  const [renderMetrics, setRenderMetrics] = useState({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<string[]>([]);

  const renderCountRef = useRef(0);
  const renderTimesRef = useRef<number[]>([]);

  // Analyze elements
  const runAnalysis = useCallback(() => {
    const startTime = performance.now();

    const bundleAnalysis = analyzeBundleSize(elements);
    const performanceScore = calculatePerformanceScore(elements);

    setAnalysis(bundleAnalysis);
    setScore(performanceScore);

    // Track render metrics
    const renderTime = performance.now() - startTime;
    renderCountRef.current++;
    renderTimesRef.current.push(renderTime);
    if (renderTimesRef.current.length > 10) {
      renderTimesRef.current.shift();
    }

    const avgTime =
      renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length;

    setRenderMetrics({
      renderCount: renderCountRef.current,
      lastRenderTime: renderTime,
      averageRenderTime: avgTime,
    });
  }, [elements]);

  // Run analysis on open and element changes
  useEffect(() => {
    if (isOpen) {
      runAnalysis();
    }
  }, [isOpen, elements, runAnalysis]);

  // Auto-refresh
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(runAnalysis, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [isOpen, runAnalysis]);

  // Apply optimizations
  const handleOptimize = useCallback(() => {
    setIsOptimizing(true);

    // Simulate optimization process
    setTimeout(() => {
      const { changes } = applyAllOptimizations(elements);
      setOptimizationResults(changes);
      setIsOptimizing(false);
      runAnalysis();
    }, 500);
  }, [elements, runAnalysis]);

  // Clear caches
  const handleClearCaches = useCallback(() => {
    const styleCache = getStyleCache();
    const codeCache = getCodeCache();
    styleCache.clear();
    codeCache.clear();
    runAnalysis();
  }, [runAnalysis]);

  // Image suggestions
  const imageSuggestions = useMemo(() => {
    return analyzeImages(elements);
  }, [elements]);

  // Get status for metrics
  const getComponentStatus = useCallback((count: number) => {
    if (count > 100) return 'critical';
    if (count > 50) return 'warning';
    return 'good';
  }, []);

  const getBundleStatus = useCallback((size: number) => {
    if (size > 100 * 1024) return 'critical';
    if (size > 50 * 1024) return 'warning';
    return 'good';
  }, []);

  const getDepthStatus = useCallback((depth: number) => {
    if (depth > 10) return 'critical';
    if (depth > 5) return 'warning';
    return 'good';
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-4xl max-h-[90vh] bg-gray-900 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Performance Dashboard</h2>
              <p className="text-sm text-gray-400">Real-time performance metrics and optimization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-6">
          {/* Performance Score */}
          <div className="flex items-center gap-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700/50">
            {score && <ScoreGauge score={score.overall} grade={score.grade} />}
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white mb-4">Performance Score Breakdown</h3>
              <div className="space-y-3">
                {score && (
                  <>
                    <ScoreBar label="Structure" value={score.breakdown.structure} max={25} />
                    <ScoreBar label="CSS" value={score.breakdown.css} max={25} />
                    <ScoreBar label="Images" value={score.breakdown.images} max={25} />
                    <ScoreBar label="Complexity" value={score.breakdown.complexity} max={25} />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <MetricCard
              icon={<Box className="w-5 h-5" />}
              label="Components"
              value={analysis?.componentCount ?? 0}
              status={getComponentStatus(analysis?.componentCount ?? 0)}
            />
            <MetricCard
              icon={<Layers className="w-5 h-5" />}
              label="Max Depth"
              value={analysis?.maxNestingDepth ?? 0}
              status={getDepthStatus(analysis?.maxNestingDepth ?? 0)}
            />
            <MetricCard
              icon={<Code className="w-5 h-5" />}
              label="CSS Classes"
              value={analysis?.uniqueClasses ?? 0}
              subValue={`${analysis?.duplicateClasses ?? 0} duplicates`}
            />
            <MetricCard
              icon={<HardDrive className="w-5 h-5" />}
              label="Bundle Size"
              value={formatBytes(analysis?.totalBundleSize ?? 0)}
              subValue={`Gzip: ${formatBytes(estimateGzipSize(analysis?.totalBundleSize ?? 0))}`}
              status={getBundleStatus(analysis?.totalBundleSize ?? 0)}
            />
          </div>

          {/* Render Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <MetricCard
              icon={<RefreshCw className="w-5 h-5" />}
              label="Render Count"
              value={renderMetrics.renderCount}
            />
            <MetricCard
              icon={<Gauge className="w-5 h-5" />}
              label="Last Render"
              value={`${renderMetrics.lastRenderTime.toFixed(2)}ms`}
            />
            <MetricCard
              icon={<Cpu className="w-5 h-5" />}
              label="Avg Render"
              value={`${renderMetrics.averageRenderTime.toFixed(2)}ms`}
            />
          </div>

          {/* Cache Stats */}
          <CacheStats />

          {/* Optimization Suggestions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">Optimization Suggestions</h3>
              <span className="text-xs text-gray-500">
                {analysis?.suggestions.length ?? 0} suggestions
              </span>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {analysis?.suggestions.map((suggestion, index) => (
                <SuggestionItem key={index} suggestion={suggestion} />
              ))}
            </div>
          </div>

          {/* Image Optimization */}
          {imageSuggestions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300">Image Optimization</h3>
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <ImageIcon className="w-5 h-5 text-yellow-400" />
                  <p className="text-sm text-gray-400">
                    {imageSuggestions.length} images can be optimized
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  {imageSuggestions.slice(0, 3).map((img, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span className="truncate max-w-xs">{img.src}</span>
                      <span className="text-green-400">
                        ~{img.estimatedSavings}% savings
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Optimization Results */}
          {optimizationResults.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="text-sm font-medium text-green-400">Optimizations Applied</h3>
              </div>
              <ul className="space-y-1 text-sm text-green-300">
                {optimizationResults.map((result, index) => (
                  <li key={index}>- {result}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors',
                'bg-blue-600 text-white hover:bg-blue-700',
                isOptimizing && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Zap className="w-5 h-5" />
              {isOptimizing ? 'Optimizing...' : 'Apply Optimizations'}
            </button>
            <button
              onClick={handleClearCaches}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Clear Caches
            </button>
            <button
              onClick={runAnalysis}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            >
              <Activity className="w-5 h-5" />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const percentage = (value / max) * 100;

  const getColor = () => {
    const ratio = value / max;
    if (ratio >= 0.8) return 'bg-green-400';
    if (ratio >= 0.5) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400 w-24">{label}</span>
      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', getColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-gray-400 w-12 text-right">
        {value}/{max}
      </span>
    </div>
  );
}

export default PerformancePanel;
