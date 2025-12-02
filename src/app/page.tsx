import Link from 'next/link';
import {
  ArrowRight,
  Layers,
  Code,
  Smartphone,
  MousePointerClick,
  Sparkles,
  Zap,
  Download,
  Github
} from 'lucide-react';

const features = [
  {
    icon: MousePointerClick,
    title: 'Drag & Drop Interface',
    description: 'Intuitive visual builder with smooth drag and drop. No coding required to get started.',
  },
  {
    icon: Layers,
    title: '50+ Pre-built Components',
    description: 'Extensive library of buttons, cards, forms, navigation, and more ready to use.',
  },
  {
    icon: Code,
    title: 'Clean Code Export',
    description: 'Generate production-ready React components with proper Tailwind CSS classes.',
  },
  {
    icon: Smartphone,
    title: 'Responsive Preview',
    description: 'Preview your designs across desktop, tablet, and mobile viewports in real-time.',
  },
];

const secondaryFeatures = [
  {
    icon: Sparkles,
    title: 'Live Preview',
    description: 'See changes instantly as you build',
  },
  {
    icon: Zap,
    title: 'Fast & Lightweight',
    description: 'Optimized for performance',
  },
  {
    icon: Download,
    title: 'Export Anywhere',
    description: 'Download and use in any project',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Tailwind Builder</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/tutorial"
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium hidden sm:block"
            >
              Tutorial
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <Link
              href="/builder"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              Open Builder
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-gray-800/50 border border-gray-700 text-sm text-gray-300">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Visual UI Builder for React + Tailwind</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Build Beautiful UIs{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              with Drag & Drop
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create stunning React components visually and export clean,
            production-ready Tailwind CSS code in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Start Building
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-lg font-medium transition-colors border border-gray-700"
            >
              Learn More
            </a>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span>No account required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Export anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50 shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 mx-4">
                <div className="max-w-md mx-auto px-4 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-400 text-center">
                  tailwind-builder.app/builder
                </div>
              </div>
            </div>

            {/* Builder preview mockup */}
            <div className="flex h-[400px] md:h-[500px]">
              {/* Left sidebar */}
              <div className="w-16 md:w-64 bg-gray-900 border-r border-gray-800 p-3 hidden sm:block">
                <div className="space-y-2">
                  <div className="h-8 bg-gray-800 rounded-lg animate-pulse" />
                  <div className="h-8 bg-gray-800 rounded-lg animate-pulse" />
                  <div className="h-8 bg-gray-800 rounded-lg animate-pulse" />
                  <div className="mt-4 space-y-2">
                    <div className="h-12 bg-gray-800 rounded-lg" />
                    <div className="h-12 bg-gray-800 rounded-lg" />
                    <div className="h-12 bg-gray-800 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Canvas area */}
              <div className="flex-1 bg-gray-950 p-4 md:p-8 flex items-center justify-center">
                <div className="w-full max-w-md space-y-4">
                  {/* Mock card component */}
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-700 rounded" />
                        <div className="h-3 w-16 bg-gray-800 rounded" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-gray-800 rounded" />
                      <div className="h-3 w-4/5 bg-gray-800 rounded" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-9 flex-1 bg-blue-600 rounded-lg" />
                      <div className="h-9 flex-1 bg-gray-800 rounded-lg border border-gray-700" />
                    </div>
                  </div>

                  {/* Drop indicator */}
                  <div className="h-20 border-2 border-dashed border-blue-500/50 rounded-xl flex items-center justify-center text-blue-400 text-sm">
                    Drop components here
                  </div>
                </div>
              </div>

              {/* Right panel */}
              <div className="w-16 md:w-72 bg-gray-900 border-l border-gray-800 p-3 hidden md:block">
                <div className="space-y-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Properties</div>
                  <div className="space-y-3">
                    <div className="h-8 bg-gray-800 rounded-lg" />
                    <div className="h-8 bg-gray-800 rounded-lg" />
                    <div className="h-20 bg-gray-800 rounded-lg" />
                    <div className="grid grid-cols-4 gap-2">
                      <div className="h-8 bg-blue-600/30 rounded border border-blue-500" />
                      <div className="h-8 bg-gray-800 rounded" />
                      <div className="h-8 bg-gray-800 rounded" />
                      <div className="h-8 bg-gray-800 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Build
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A complete toolkit for creating beautiful, responsive user interfaces
              without writing code from scratch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-6 md:p-8 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all hover:bg-gray-900/80"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Secondary features */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {secondaryFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/30 border border-gray-800"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    <p className="text-gray-500 text-sm">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Jump in and start creating beautiful UIs in minutes. No signup required.
            </p>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 rounded-xl text-lg font-semibold transition-all hover:scale-105"
            >
              Launch Builder
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">Tailwind Builder</span>
            </div>

            <div className="flex items-center gap-8 text-sm text-gray-400">
              <Link href="/builder" className="hover:text-white transition-colors">
                Builder
              </Link>
              <Link href="/tutorial" className="hover:text-white transition-colors">
                Tutorial
              </Link>
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            Built with Next.js, Tailwind CSS, and crafted with care.
          </div>
        </div>
      </footer>
    </div>
  );
}
