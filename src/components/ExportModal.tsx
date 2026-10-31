import React, { useState } from 'react';
import { X, Download, Copy, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProductConfig, LogoTransform } from '../types/mockup';
import { renderMockupToCanvas } from '../utils/mockupRenderer';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductConfig;
  productColor: string;
  logoDataUrl: string | null;
  transform: LogoTransform;
  backdrop: 'studio-light' | 'studio-dark' | 'wood-table' | 'minimal' | 'transparent';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  product,
  productColor,
  logoDataUrl,
  transform,
  backdrop,
}) => {
  const [scale, setScale] = useState<1 | 2 | 3>(2);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getExportCanvas = async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    const baseDim = 1000 * scale;
    canvas.width = baseDim;
    canvas.height = baseDim;

    let logoImg: HTMLImageElement | null = null;
    if (logoDataUrl) {
      logoImg = await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = logoDataUrl;
      });
    }

    renderMockupToCanvas(canvas, {
      product,
      productColor,
      logoImage: logoImg,
      transform,
      backdrop,
      showPrintZoneGuide: false,
    });

    return canvas;
  };

  const handleDownload = async () => {
    const canvas = await getExportCanvas();
    const mime = format === 'png' ? 'image/png' : 'image/jpeg';
    const link = document.createElement('a');
    link.download = `${product.id}-mockup-${scale}x-${Date.now()}.${format}`;
    link.href = canvas.toDataURL(mime, 0.95);
    link.click();

    // Trigger joyful confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    onClose();
  };

  const handleCopyClipboard = async () => {
    try {
      const canvas = await getExportCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }, 'image/png');
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const dimensions = 1000 * scale;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Export High-Res Mockup</h3>
              <p className="text-xs text-slate-500">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Export Resolution */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
              Resolution Scale
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { scale: 1, label: '1x Web', desc: '1000 × 1000' },
                  { scale: 2, label: '2x Retina', desc: '2000 × 2000' },
                  { scale: 3, label: '3x Print', desc: '3000 × 3000' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.scale}
                  onClick={() => setScale(opt.scale as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    scale === opt.scale
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="block text-xs font-bold">{opt.label}</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Export Format */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
              File Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFormat('png')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  format === 'png'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                PNG (Lossless / Alpha)
              </button>
              <button
                onClick={() => setFormat('jpeg')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  format === 'jpeg'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                JPEG (High Quality)
              </button>
            </div>
          </div>

          {/* Output summary */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>Estimated dimensions:</span>
            <span className="font-mono font-bold text-slate-800">
              {dimensions} × {dimensions} px
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={handleCopyClipboard}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};
