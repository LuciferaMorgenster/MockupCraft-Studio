import React, { useState, useEffect } from 'react';
import { PRODUCTS } from './data/products';
import { SAMPLE_LOGOS } from './data/sampleLogos';
import { ProductConfig, LogoTransform, AiGeneratedMockup } from './types/mockup';
import { Navbar } from './components/Navbar';
import { ProductSelector } from './components/ProductSelector';
import { LogoUploader } from './components/LogoUploader';
import { ControlsPanel } from './components/ControlsPanel';
import { MockupCanvas } from './components/MockupCanvas';
import { MultiProductGrid } from './components/MultiProductGrid';
import { AiImageGenerator } from './components/AiImageGenerator';
import { AiImageEditor } from './components/AiImageEditor';
import { ExportModal } from './components/ExportModal';
import { renderMockupToCanvas } from './utils/mockupRenderer';
import { Sparkles, Layers, Wand2, Grid3X3, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'studio' | 'collection' | 'ai-generator' | 'ai-editor'>('studio');

  // Active product & color
  const [selectedProduct, setSelectedProduct] = useState<ProductConfig>(PRODUCTS[0]); // Ceramic Coffee Mug
  const [productColor, setProductColor] = useState<string>(PRODUCTS[0].defaultColor);

  // Active logo (start with default sample logo so users immediately see a working mockup on load!)
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(SAMPLE_LOGOS[0].svgDataUrl);
  const [logoName, setLogoName] = useState<string>(SAMPLE_LOGOS[0].name);

  // Transform controls
  const initialTransform: LogoTransform = {
    x: 0,
    y: 0,
    scale: 0.95,
    rotation: 0,
    opacity: 0.95,
    blendMode: 'multiply',
    effect: 'none',
    invertColor: false,
  };
  const [transform, setTransform] = useState<LogoTransform>(initialTransform);

  // Studio environment
  const [backdrop, setBackdrop] = useState<'studio-light' | 'studio-dark' | 'wood-table' | 'minimal' | 'transparent'>('studio-light');
  const [showPrintZoneGuide, setShowPrintZoneGuide] = useState(false);

  // Snapshot for AI Editor
  const [canvasSnapshot, setCanvasSnapshot] = useState<string | null>(null);

  // Gallery of AI generated mockups
  const [gallery, setGallery] = useState<AiGeneratedMockup[]>([]);

  // Export modal
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // When product changes, update default color and adapt blend mode if needed
  const handleProductSelect = (product: ProductConfig) => {
    setSelectedProduct(product);
    setProductColor(product.defaultColor);
    // Switch to studio tab if in collection view
    if (currentTab === 'collection') {
      setCurrentTab('studio');
    }
  };

  // Generate snapshot whenever entering AI editor
  const captureCanvasSnapshot = () => {
    const offscreen = document.createElement('canvas');
    offscreen.width = 1000;
    offscreen.height = 1000;

    let logoImg: HTMLImageElement | null = null;
    if (logoDataUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        renderMockupToCanvas(offscreen, {
          product: selectedProduct,
          productColor,
          logoImage: img,
          transform,
          backdrop,
          showPrintZoneGuide: false,
        });
        setCanvasSnapshot(offscreen.toDataURL('image/png'));
      };
      img.src = logoDataUrl;
    } else {
      renderMockupToCanvas(offscreen, {
        product: selectedProduct,
        productColor,
        logoImage: null,
        transform,
        backdrop,
        showPrintZoneGuide: false,
      });
      setCanvasSnapshot(offscreen.toDataURL('image/png'));
    }
  };

  const handleTabChange = (tab: 'studio' | 'collection' | 'ai-generator' | 'ai-editor') => {
    if (tab === 'ai-editor') {
      captureCanvasSnapshot();
    }
    setCurrentTab(tab);
  };

  const handleSaveToGallery = (item: AiGeneratedMockup) => {
    setGallery((prev) => [item, ...prev]);
  };

  const handleApplyAsLogo = (url: string) => {
    setLogoDataUrl(url);
    setLogoName('AI Generated Asset');
    setCurrentTab('studio');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        onOpenExport={() => setExportModalOpen(true)}
        hasLogo={!!logoDataUrl}
        productName={selectedProduct.name}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentTab === 'studio' && (
          <div className="space-y-6">
            {/* Product Selector Bar */}
            <ProductSelector
              selectedProduct={selectedProduct}
              onSelectProduct={handleProductSelect}
            />

            {/* Studio Workspace: Left Controls, Center Canvas, Right Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Upload & Assets */}
              <div className="lg:col-span-4 space-y-6">
                <LogoUploader
                  currentLogoUrl={logoDataUrl}
                  currentLogoName={logoName}
                  onLogoSelected={(url, name) => {
                    setLogoDataUrl(url);
                    setLogoName(name);
                  }}
                  onClearLogo={() => {
                    setLogoDataUrl(null);
                    setLogoName('');
                  }}
                />

                <ControlsPanel
                  product={selectedProduct}
                  productColor={productColor}
                  onColorChange={setProductColor}
                  transform={transform}
                  onTransformChange={setTransform}
                  backdrop={backdrop}
                  onBackdropChange={setBackdrop}
                  showPrintZoneGuide={showPrintZoneGuide}
                  onTogglePrintZoneGuide={() => setShowPrintZoneGuide((v) => !v)}
                  onResetTransform={() => setTransform(initialTransform)}
                />
              </div>

              {/* Center/Right Column: Canvas Viewport */}
              <div className="lg:col-span-8 flex flex-col h-[650px] lg:h-[760px]">
                <MockupCanvas
                  product={selectedProduct}
                  productColor={productColor}
                  logoDataUrl={logoDataUrl}
                  transform={transform}
                  onTransformChange={setTransform}
                  backdrop={backdrop}
                  showPrintZoneGuide={showPrintZoneGuide}
                  onOpenExport={() => setExportModalOpen(true)}
                />

                {/* Quick AI Action Callout Banner */}
                <div className="mt-4 p-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-amber-500/10 border border-indigo-200/60 rounded-2xl flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                        Want ultra-realistic photoshoots of this mockup?
                      </h4>
                      <p className="text-xs text-slate-500">
                        Generate 1K/2K/4K scenes with Gemini 3 Pro, or use text prompts to edit with Nano Banana 2.1.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTabChange('ai-generator')}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>AI Gen (1K-4K)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleTabChange('ai-editor')}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Edit with Nano Banana 2.1</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'collection' && (
          <MultiProductGrid
            logoDataUrl={logoDataUrl}
            transform={transform}
            backdrop={backdrop}
            onSelectProduct={handleProductSelect}
          />
        )}

        {currentTab === 'ai-generator' && (
          <AiImageGenerator
            currentLogoUrl={logoDataUrl}
            onSaveToGallery={handleSaveToGallery}
            onApplyAsLogo={handleApplyAsLogo}
          />
        )}

        {currentTab === 'ai-editor' && (
          <AiImageEditor
            currentCanvasSnapshot={canvasSnapshot}
            currentLogoUrl={logoDataUrl}
            onSaveToGallery={handleSaveToGallery}
            onApplyAsLogo={handleApplyAsLogo}
          />
        )}
      </main>

      {/* Export High-Res Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        product={selectedProduct}
        productColor={productColor}
        logoDataUrl={logoDataUrl}
        transform={transform}
        backdrop={backdrop}
      />
    </div>
  );
}
