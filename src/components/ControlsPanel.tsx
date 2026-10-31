import React from 'react';
import { ProductConfig, LogoTransform } from '../types/mockup';
import {
  Palette,
  Maximize2,
  RotateCw,
  Move,
  Layers,
  Eye,
  Sliders,
  Sparkles,
  Sun,
  Grid,
} from 'lucide-react';

interface ControlsPanelProps {
  product: ProductConfig;
  productColor: string;
  onColorChange: (color: string) => void;
  transform: LogoTransform;
  onTransformChange: (transform: LogoTransform) => void;
  backdrop: 'studio-light' | 'studio-dark' | 'wood-table' | 'minimal' | 'transparent';
  onBackdropChange: (backdrop: 'studio-light' | 'studio-dark' | 'wood-table' | 'minimal' | 'transparent') => void;
  showPrintZoneGuide: boolean;
  onTogglePrintZoneGuide: () => void;
  onResetTransform: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  product,
  productColor,
  onColorChange,
  transform,
  onTransformChange,
  backdrop,
  onBackdropChange,
  showPrintZoneGuide,
  onTogglePrintZoneGuide,
  onResetTransform,
}) => {
  const updateTransform = (key: keyof LogoTransform, value: any) => {
    onTransformChange({
      ...transform,
      [key]: value,
    });
  };

  const effects = [
    { id: 'none', label: 'Original Color', desc: 'Standard vibrant print' },
    { id: 'white-ink', label: 'White Ink', desc: 'Crisp white ink for dark items' },
    { id: 'black-ink', label: 'Black Ink', desc: 'Monochrome black ink' },
    { id: 'gold-foil', label: 'Gold Foil', desc: 'Shimmering metallic gold' },
    { id: 'embroidery', label: 'Embroidered', desc: 'Thread stitch effect' },
    { id: 'vintage', label: 'Vintage Washed', desc: 'Distressed cracked print' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-5">
      {/* 1. Product Color Swatches */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-indigo-600" />
            <span>Product Color</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 uppercase">{productColor}</span>
            <input
              type="color"
              value={productColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border border-slate-300"
              title="Custom hex color"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {product.availableColors.map((col) => {
            const isSelected = col.hex.toLowerCase() === productColor.toLowerCase();
            return (
              <button
                key={col.hex}
                onClick={() => onColorChange(col.hex)}
                className={`w-7 h-7 rounded-full border transition-all cursor-pointer relative group flex items-center justify-center ${
                  isSelected
                    ? 'ring-2 ring-indigo-600 ring-offset-2 scale-110 shadow-sm'
                    : 'border-slate-300 hover:scale-105'
                }`}
                style={{ backgroundColor: col.hex }}
                title={`${col.name} (${col.hex})`}
              >
                {isSelected && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      col.hex === '#ffffff' || col.hex === '#fafafa' || col.hex === '#f7f4ee'
                        ? 'bg-slate-900'
                        : 'bg-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        {/* 2. Logo Size & Position Fine-Tuning */}
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Logo Placement &amp; Size</span>
          </label>
          <button
            onClick={onResetTransform}
            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
          >
            Reset
          </button>
        </div>

        <div className="space-y-3">
          {/* Scale */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-700 mb-1">
              <span className="flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-slate-400" />
                <span>Scale</span>
              </span>
              <span className="font-mono text-slate-500">{Math.round(transform.scale * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.0"
              step="0.05"
              value={transform.scale}
              onChange={(e) => updateTransform('scale', parseFloat(e.target.value))}
              className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Position X & Y */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  <Move className="w-3 h-3 text-slate-400" />
                  <span>Horizontal (X)</span>
                </span>
                <span className="font-mono text-slate-500">{Math.round(transform.x)}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={transform.x}
                onChange={(e) => updateTransform('x', parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  <Move className="w-3 h-3 text-slate-400" />
                  <span>Vertical (Y)</span>
                </span>
                <span className="font-mono text-slate-500">{Math.round(transform.y)}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={transform.y}
                onChange={(e) => updateTransform('y', parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Rotation & Opacity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  <RotateCw className="w-3 h-3 text-slate-400" />
                  <span>Rotation</span>
                </span>
                <span className="font-mono text-slate-500">{Math.round(transform.rotation)}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={transform.rotation}
                onChange={(e) => updateTransform('rotation', parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-slate-400" />
                  <span>Opacity</span>
                </span>
                <span className="font-mono text-slate-500">{Math.round(transform.opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.05"
                value={transform.opacity}
                onChange={(e) => updateTransform('opacity', parseFloat(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Print Effects & Ink Style */}
      <div className="border-t border-slate-100 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Print Finish &amp; Effects</span>
        </label>

        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {effects.map((eff) => {
            const isSelected = transform.effect === eff.id;
            return (
              <button
                key={eff.id}
                onClick={() => updateTransform('effect', eff.id)}
                className={`px-2 py-1.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                title={eff.desc}
              >
                {eff.label}
              </button>
            );
          })}
        </div>

        {/* Ink Invert & Blend Mode */}
        <div className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              checked={transform.invertColor}
              onChange={(e) => updateTransform('invertColor', e.target.checked)}
              className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
            />
            <span>Invert Colors (Dark/Light)</span>
          </label>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500">Blend:</span>
            <select
              value={transform.blendMode}
              onChange={(e) => updateTransform('blendMode', e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded px-1.5 py-1 text-slate-700 cursor-pointer"
            >
              <option value="source-over">Normal</option>
              <option value="multiply">Multiply (Ink Dye)</option>
              <option value="overlay">Overlay</option>
              <option value="screen">Screen</option>
              <option value="soft-light">Soft Light</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Backdrop & Studio Environment */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-indigo-600" />
            <span>Studio Environment</span>
          </label>
          <button
            onClick={onTogglePrintZoneGuide}
            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded cursor-pointer transition-colors ${
              showPrintZoneGuide
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Grid className="w-3 h-3" />
            <span>{showPrintZoneGuide ? 'Hide Guide' : 'Show Guide'}</span>
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
          {(
            [
              { id: 'studio-light', label: 'Studio Light' },
              { id: 'studio-dark', label: 'Dark Studio' },
              { id: 'wood-table', label: 'Cafe Wood' },
              { id: 'minimal', label: 'Clean White' },
              { id: 'transparent', label: 'Transparent' },
            ] as const
          ).map((env) => (
            <button
              key={env.id}
              onClick={() => onBackdropChange(env.id)}
              className={`px-2 py-1.5 rounded-lg border text-xs transition-all cursor-pointer font-medium text-center ${
                backdrop === env.id
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
              }`}
            >
              {env.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
