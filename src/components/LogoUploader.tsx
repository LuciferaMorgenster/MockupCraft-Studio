import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles, X, Check } from 'lucide-react';
import { SAMPLE_LOGOS } from '../data/sampleLogos';
import { SampleLogo } from '../types/mockup';

interface LogoUploaderProps {
  currentLogoUrl: string | null;
  currentLogoName: string;
  onLogoSelected: (dataUrl: string, name: string) => void;
  onClearLogo: () => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  currentLogoUrl,
  currentLogoName,
  onLogoSelected,
  onClearLogo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, SVG, JPG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onLogoSelected(result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSampleClick = (sample: SampleLogo) => {
    onLogoSelected(sample.svgDataUrl, sample.name);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Upload className="w-4 h-4 text-indigo-600" />
          <span>Upload Brand Logo</span>
        </h3>
        {currentLogoUrl && (
          <button
            onClick={onClearLogo}
            className="text-xs text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Main Drag-Drop Box or Active Logo Preview */}
      {currentLogoUrl ? (
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative group">
            {/* Checkerboard transparency background */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)',
                backgroundSize: '10px 10px',
                backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
              }}
            />
            <img
              src={currentLogoUrl}
              alt={currentLogoName}
              className="max-w-full max-h-full object-contain relative z-10"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs mb-0.5">
              <Check className="w-3.5 h-3.5" />
              <span>Logo Active on Canvas</span>
            </div>
            <p className="text-xs font-medium text-slate-800 truncate" title={currentLogoName}>
              {currentLogoName}
            </p>
            <p className="text-[11px] text-slate-500">Drag directly on canvas to reposition</p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-xs font-medium text-slate-700 rounded-lg shadow-2xs hover:bg-slate-50 cursor-pointer"
          >
            Replace
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-600 bg-indigo-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/60'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-800">
            Drop your logo here, or <span className="text-indigo-600 underline">browse</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Supports transparent PNG, SVG vector, JPG, WEBP
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/svg+xml,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {/* Preset Sample Logos (Instant 1-Click Try) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Or try with sample brand logos:
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {SAMPLE_LOGOS.map((sample) => {
            const isSelected = currentLogoName === sample.name;
            return (
              <button
                key={sample.id}
                onClick={() => handleSampleClick(sample)}
                className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white'
                }`}
                title={sample.name}
              >
                <div className="w-9 h-9 flex items-center justify-center p-0.5">
                  <img
                    src={sample.svgDataUrl}
                    alt={sample.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <span className="text-[10px] text-slate-700 font-medium truncate w-full text-center">
                  {sample.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
