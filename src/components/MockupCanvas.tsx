import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ProductConfig, LogoTransform } from '../types/mockup';
import { renderMockupToCanvas } from '../utils/mockupRenderer';
import { ZoomIn, ZoomOut, RotateCcw, Download, Sparkles, Move, Maximize } from 'lucide-react';

interface MockupCanvasProps {
  product: ProductConfig;
  productColor: string;
  logoDataUrl: string | null;
  transform: LogoTransform;
  onTransformChange: (transform: LogoTransform) => void;
  backdrop: 'studio-light' | 'studio-dark' | 'wood-table' | 'minimal' | 'transparent';
  showPrintZoneGuide: boolean;
  onOpenExport: () => void;
}

export const MockupCanvas: React.FC<MockupCanvasProps> = ({
  product,
  productColor,
  logoDataUrl,
  transform,
  onTransformChange,
  backdrop,
  showPrintZoneGuide,
  onOpenExport,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [initialTransformOffset, setInitialTransformOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Load logo image whenever logoDataUrl changes
  useEffect(() => {
    if (!logoDataUrl) {
      setLogoImage(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setLogoImage(img);
    };
    img.src = logoDataUrl;
  }, [logoDataUrl]);

  // Main Render to Canvas
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use 1000x1000 for sharp rendering
    canvas.width = 1000;
    canvas.height = 1000;

    renderMockupToCanvas(canvas, {
      product,
      productColor,
      logoImage,
      transform,
      backdrop,
      showPrintZoneGuide,
    });
  }, [product, productColor, logoImage, transform, backdrop, showPrintZoneGuide]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  // Mouse drag handler to reposition logo directly on canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!logoImage) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialTransformOffset({ x: transform.x, y: transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    const rect = canvas.getBoundingClientRect();
    const scaleFactorX = (dx / rect.width) * 100;
    const scaleFactorY = (dy / rect.height) * 100;

    const newX = Math.max(-50, Math.min(50, initialTransformOffset.x + scaleFactorX * 1.5));
    const newY = Math.max(-50, Math.min(50, initialTransformOffset.y + scaleFactorY * 1.5));

    onTransformChange({
      ...transform,
      x: Math.round(newX),
      y: Math.round(newY),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Quick download current canvas as PNG
  const handleQuickDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${product.id}-mockup-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/5 rounded-2xl border border-slate-200/80 overflow-hidden relative shadow-inner">
      {/* Canvas Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/90 backdrop-blur border-b border-slate-200 text-xs z-10">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">{product.name}</span>
          <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full capitalize">
            {product.warpType === 'cylinder'
              ? '3D Cylinder Warp'
              : product.warpType === 'fabric'
              ? 'Cloth Displacement'
              : 'Vector Fit'}
          </span>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-slate-500 text-[11px] w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <button
            onClick={handleQuickDownload}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors font-medium cursor-pointer"
            title="Quick Download PNG"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Canvas Viewport Area */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden relative select-none"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="transition-transform duration-100 flex items-center justify-center max-w-full max-h-full"
          style={{ transform: `scale(${zoom})` }}
        >
          <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-slate-300/40 bg-white">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              className={`w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] md:w-[540px] md:h-[540px] block transition-cursor ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            />

            {/* Drag helper hint if logo exists */}
            {logoImage && !isDragging && (
              <div className="absolute bottom-3 left-3 bg-slate-900/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] flex items-center gap-1.5 pointer-events-none opacity-80 transition-opacity">
                <Move className="w-3 h-3 text-indigo-400" />
                <span>Click &amp; drag to reposition logo</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
