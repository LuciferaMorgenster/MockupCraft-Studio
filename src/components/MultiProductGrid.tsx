import React, { useEffect, useRef } from 'react';
import { PRODUCTS } from '../data/products';
import { ProductConfig, LogoTransform } from '../types/mockup';
import { renderMockupToCanvas } from '../utils/mockupRenderer';
import { Download, ExternalLink, Sparkles } from 'lucide-react';

interface MultiProductGridProps {
  logoDataUrl: string | null;
  transform: LogoTransform;
  backdrop: 'studio-light' | 'studio-dark' | 'wood-table' | 'minimal' | 'transparent';
  onSelectProduct: (product: ProductConfig) => void;
}

export const MultiProductGrid: React.FC<MultiProductGridProps> = ({
  logoDataUrl,
  transform,
  backdrop,
  onSelectProduct,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Merchandise Collection Showcase</h2>
          <p className="text-xs text-slate-500">
            See your logo automatically placed across all {PRODUCTS.length} merchandise items. Click any card to customize in Studio.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {PRODUCTS.map((product) => (
          <ProductGridCard
            key={product.id}
            product={product}
            logoDataUrl={logoDataUrl}
            transform={transform}
            backdrop={backdrop}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>
    </div>
  );
};

interface CardProps {
  product: ProductConfig;
  logoDataUrl: string | null;
  transform: LogoTransform;
  backdrop: 'studio-light' | 'studio-dark' | 'wood-table' | 'minimal' | 'transparent';
  onSelectProduct: (product: ProductConfig) => void;
}

const ProductGridCard: React.FC<CardProps> = ({
  product,
  logoDataUrl,
  transform,
  backdrop,
  onSelectProduct,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 600;
    canvas.height = 600;

    let logoImg: HTMLImageElement | null = null;
    if (logoDataUrl) {
      logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.onload = () => {
        renderMockupToCanvas(canvas, {
          product,
          productColor: product.defaultColor,
          logoImage: logoImg,
          transform,
          backdrop,
          showPrintZoneGuide: false,
        });
      };
      logoImg.src = logoDataUrl;
    } else {
      renderMockupToCanvas(canvas, {
        product,
        productColor: product.defaultColor,
        logoImage: null,
        transform,
        backdrop,
        showPrintZoneGuide: false,
      });
    }
  }, [product, logoDataUrl, transform, backdrop]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `${product.id}-mockup.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer flex flex-col"
    >
      {/* Canvas preview */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden border-b border-slate-100 flex items-center justify-center p-3">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDownload}
            className="p-1.5 bg-white/90 hover:bg-white text-slate-700 rounded-lg shadow-sm border border-slate-200 transition-colors"
            title="Download PNG"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h4>
          <span className="text-[11px] text-slate-500 capitalize">{product.category}</span>
        </div>

        <button
          onClick={() => onSelectProduct(product)}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all"
        >
          <span>Customize</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
