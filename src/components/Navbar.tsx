import React from 'react';
import { Layers, Grid3X3, Sparkles, Wand2, Download, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  currentTab: 'studio' | 'collection' | 'ai-generator' | 'ai-editor';
  onSelectTab: (tab: 'studio' | 'collection' | 'ai-generator' | 'ai-editor') => void;
  onOpenExport: () => void;
  hasLogo: boolean;
  productName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenExport,
  hasLogo,
  productName,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-lg tracking-tight">MockupCraft</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200/60">
                Studio
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Instant Merchandise &amp; Product Mockups</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70">
          <button
            onClick={() => onSelectTab('studio')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'studio'
                ? 'bg-white text-indigo-600 shadow-sm shadow-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => onSelectTab('collection')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'collection'
                ? 'bg-white text-indigo-600 shadow-sm shadow-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            <span className="hidden md:inline">Full</span> Collection
          </button>

          <button
            onClick={() => onSelectTab('ai-generator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'ai-generator'
                ? 'bg-white text-indigo-600 shadow-sm shadow-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
            title="High-Quality AI Generation with gemini-3-pro-image-preview (1K/2K/4K)"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Gen</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded hidden sm:inline">
              1K-4K
            </span>
          </button>

          <button
            onClick={() => onSelectTab('ai-editor')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'ai-editor'
                ? 'bg-white text-indigo-600 shadow-sm shadow-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
            title="Create & Edit with gemini-nano-banana-2.1"
          >
            <Wand2 className="w-4 h-4 text-purple-500" />
            <span>AI Editor</span>
            <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-1.5 py-0.2 rounded hidden sm:inline">
              2.1
            </span>
          </button>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs sm:text-sm font-medium rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Mockup</span>
          </button>
        </div>
      </div>
    </header>
  );
};
