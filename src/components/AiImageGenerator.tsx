import React, { useState } from 'react';
import { Sparkles, Download, Wand2, RefreshCw, Layers, Check, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { AiGeneratedMockup } from '../types/mockup';

interface AiImageGeneratorProps {
  currentLogoUrl: string | null;
  onSaveToGallery?: (item: AiGeneratedMockup) => void;
  onApplyAsLogo?: (url: string) => void;
}

export const AiImageGenerator: React.FC<AiImageGeneratorProps> = ({
  currentLogoUrl,
  onSaveToGallery,
  onApplyAsLogo,
}) => {
  const [prompt, setPrompt] = useState(
    'A photorealistic commercial product mockup of a white ceramic coffee mug with modern graphic logo, sitting on a sunlit marble cafe table next to a croissant and soft morning window light.'
  );
  // Affordance for 1K, 2K, and 4K image size
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:3' | '3:4' | '16:9' | '9:16'>('1:1');
  const [includeLogo, setIncludeLogo] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<{
    imageUrl: string;
    caption?: string;
    imageSize: string;
    aspectRatio: string;
    modelUsed: string;
  } | null>(null);

  const promptPresets = [
    {
      title: 'Coffee Mug in Sunlit Cafe',
      text: 'A luxury white ceramic coffee mug with brand logo, resting on an Italian terrazzo cafe table with warm morning sunlight casting soft shadows, bokeh espresso machine background.',
      ratio: '1:1',
    },
    {
      title: 'Streetwear T-Shirt Shoot',
      text: 'High-fashion editorial mockup of an oversized vintage washed heavyweight black cotton t-shirt with brand logo centered on the chest, hung on an industrial steel clothing rack in a bright minimalist photo studio.',
      ratio: '4:3',
    },
    {
      title: 'Enamel Camping Mug by Lake',
      text: 'A vintage speckled forest green enamel camp mug with adventure logo, placed on a weathered wooden picnic table overlooking a misty pine alpine lake at sunrise.',
      ratio: '16:9',
    },
    {
      title: 'Tote Bag & Sunglasses Flatlay',
      text: 'A natural ecru canvas tote bag printed with minimalist brand typography, arranged in an aesthetic top-down flatlay with tortoiseshell sunglasses, fresh monstera leaf, and a paperback book on a cream linen surface.',
      ratio: '1:1',
    },
    {
      title: 'Minimalist Studio Podium',
      text: 'A sleek matte insulated water tumbler with laser engraved logo, set atop a geometric concrete pedestal against a serene warm sand gradient backdrop with dramatic architectural studio lighting.',
      ratio: '3:4',
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          imageSize,
          aspectRatio,
          logoBase64: includeLogo && currentLogoUrl ? currentLogoUrl : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedResult(data);
      if (onSaveToGallery) {
        onSaveToGallery({
          id: `gen-${Date.now()}`,
          url: data.imageUrl,
          prompt,
          model: data.modelUsed || 'gemini-3-pro-image-preview',
          size: imageSize,
          aspectRatio,
          timestamp: Date.now(),
          type: 'generation',
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while generating high-quality image.');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!generatedResult) return;
    const a = document.createElement('a');
    a.download = `mockup-gemini-3-pro-${imageSize}-${Date.now()}.png`;
    a.href = generatedResult.imageUrl;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-500/20 rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                High-Quality AI Mockup Generator
              </h2>
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-300">
                gemini-3-pro-image-preview
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Generate photorealistic, studio-grade product mockups and commercial photoshoots in ultra-high resolution with configurable 1K, 2K, and 4K fidelity.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Column */}
        <div className="lg:col-span-5 space-y-5">
          {/* Resolution Affordance (1K, 2K, 4K) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Image Resolution (Size Affordance)
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Select your target output resolution for high-definition merchandise rendering:
              </p>

              <div className="grid grid-cols-3 gap-2.5">
                {(
                  [
                    { size: '1K', label: '1K Standard', desc: '1024 × 1024', popular: false },
                    { size: '2K', label: '2K High-Res', desc: '2048 × 2048', popular: true },
                    { size: '4K', label: '4K Ultra-HD', desc: '4096 × 4096', popular: false },
                  ] as const
                ).map((item) => {
                  const isSelected = imageSize === item.size;
                  return (
                    <button
                      key={item.size}
                      onClick={() => setImageSize(item.size)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/30'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {item.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-1.5 py-0.2 rounded-full">
                          Optimal
                        </span>
                      )}
                      <div className="font-bold text-sm text-slate-900">{item.size}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['1:1', '4:3', '3:4', '16:9', '9:16'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-all cursor-pointer text-center ${
                      aspectRatio === ratio
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Include Logo Toggle */}
            {currentLogoUrl && (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
                    <img src={currentLogoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-800">
                      Feature Uploaded Logo
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      Incorporate logo branding into generated scene
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLogo}
                    onChange={(e) => setIncludeLogo(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                </label>
              </div>
            )}
          </div>

          {/* Text Prompt Input */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Mockup Scene Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="Describe the product mockup, environment, lighting, and materials..."
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all resize-none"
              />
            </div>

            {/* Preset prompt inspiration */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                Scene Inspiration Prompts:
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {promptPresets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(p.text);
                      setAspectRatio(p.ratio as any);
                    }}
                    className="w-full text-left p-2 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors text-xs text-slate-700 group cursor-pointer"
                  >
                    <span className="font-semibold text-indigo-600 block text-[11px]">
                      {p.title} ({p.ratio})
                    </span>
                    <span className="line-clamp-1 text-[11px] text-slate-500">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {error}
              </div>
            )}

            {/* Generate Action Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Rendering in {imageSize} with gemini-3-pro-image-preview...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate High-Quality Mockup ({imageSize})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm min-h-[460px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Generated High-Quality Output
              </h3>
              {generatedResult && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md border border-emerald-200">
                    {generatedResult.imageSize} UHD
                  </span>
                  <span className="text-[11px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded-md">
                    {generatedResult.aspectRatio}
                  </span>
                </div>
              )}
            </div>

            {/* Main Preview Container */}
            <div className="flex-1 flex items-center justify-center p-2">
              {loading ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto animate-pulse">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      Generating High-Quality Image ({imageSize})
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Invoking gemini-3-pro-image-preview with professional commercial lighting &amp; product textures...
                    </p>
                  </div>
                </div>
              ) : generatedResult ? (
                <div className="w-full space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900/5 group flex items-center justify-center max-h-[520px]">
                    <img
                      src={generatedResult.imageUrl}
                      alt="AI Generated Mockup"
                      className="max-h-[500px] w-auto object-contain rounded-xl"
                    />
                  </div>

                  {generatedResult.caption && (
                    <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                      "{generatedResult.caption}"
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">No AI mockup generated yet</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Choose your desired resolution (1K, 2K, or 4K), type a prompt or pick an inspiration preset, and click Generate!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions for Generated Image */}
            {generatedResult && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs text-slate-500">
                  Model: <strong className="text-slate-800">{generatedResult.modelUsed}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadImage}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {imageSize} PNG</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
