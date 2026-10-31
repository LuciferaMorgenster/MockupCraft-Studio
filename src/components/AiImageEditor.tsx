import React, { useState } from 'react';
import { Wand2, Download, RefreshCw, Sparkles, Sliders, ArrowRight, Check, Image as ImageIcon } from 'lucide-react';
import { AiGeneratedMockup } from '../types/mockup';

interface AiImageEditorProps {
  currentCanvasSnapshot: string | null;
  currentLogoUrl: string | null;
  onSaveToGallery?: (item: AiGeneratedMockup) => void;
  onApplyAsLogo?: (url: string) => void;
}

export const AiImageEditor: React.FC<AiImageEditorProps> = ({
  currentCanvasSnapshot,
  currentLogoUrl,
  onSaveToGallery,
  onApplyAsLogo,
}) => {
  const [prompt, setPrompt] = useState(
    'Add realistic morning sunlight shining through a cafe window casting warm light across the mug, with hot subtle steam rising into the air.'
  );
  const [useCurrentSnapshot, setUseCurrentSnapshot] = useState(true);
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:3' | '3:4' | '16:9' | '9:16'>('1:1');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultCaption, setResultCaption] = useState<string>('');
  const [activeView, setActiveView] = useState<'after' | 'split'>('after');

  const editPromptChips = [
    { label: 'Hot rising steam', text: 'Add gentle, realistic wisps of hot steam rising up from the coffee mug in a cozy ambient cafe.' },
    { label: 'Vintage 90s wash', text: 'Apply a vintage 90s distressed acid-wash fade to the garment fabric with authentic faded textile grain.' },
    { label: 'Rainy window bokeh', text: 'Place in front of a rainy coffee shop window with blurry bokeh city traffic lights and raindrops.' },
    { label: 'Golden hour sunlight', text: 'Apply warm cinematic golden hour sunlight casting dramatic elongated shadows and lens flare.' },
    { label: 'Studio dark luxury', text: 'Transform into a moody, high-end Apple-style luxury commercial photoshoot with dark slate lighting.' },
    { label: 'Outdoor mountain hike', text: 'Place the product outdoors in an alpine mountain setting with pine trees and granite rocks.' },
  ];

  const handleEditOrCreate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    const sourceImage = useCurrentSnapshot
      ? currentCanvasSnapshot || currentLogoUrl
      : undefined;

    try {
      const response = await fetch('/api/edit-or-create-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          currentImageBase64: sourceImage,
          imageSize,
          aspectRatio,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to edit/create image');
      }

      setResultImage(data.imageUrl);
      setResultCaption(data.caption || '');

      if (onSaveToGallery) {
        onSaveToGallery({
          id: `edit-${Date.now()}`,
          url: data.imageUrl,
          prompt,
          model: data.modelUsed || 'gemini-nano-banana-2.1',
          size: imageSize,
          aspectRatio,
          timestamp: Date.now(),
          type: 'edit',
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while editing image with gemini-nano-banana-2.1.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const a = document.createElement('a');
    a.download = `mockup-nano-banana-2.1-${Date.now()}.png`;
    a.href = resultImage;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-sm">
                <Wand2 className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                AI Image Creation &amp; Editing Studio
              </h2>
              <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-purple-300">
                gemini-nano-banana-2.1
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Use natural language text prompts to transform, style, or generate product images and mockups using the modern <strong>gemini-nano-banana-2.1</strong> model.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5">
          {/* Source Image Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Edit Mode &amp; Source Image
              </label>

              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setUseCurrentSnapshot(true)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    useCurrentSnapshot
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Edit Current Mockup
                </button>
                <button
                  onClick={() => setUseCurrentSnapshot(false)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    !useCurrentSnapshot
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Create from Scratch
                </button>
              </div>

              {useCurrentSnapshot && (
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    {currentCanvasSnapshot ? (
                      <img
                        src={currentCanvasSnapshot}
                        alt="Canvas snapshot"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : currentLogoUrl ? (
                      <img
                        src={currentLogoUrl}
                        alt="Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Active Studio Canvas
                    </span>
                    <span className="text-[11px] text-slate-500">
                      The AI will use this mockup image as the base to modify
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Resolution and Aspect Ratio */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Resolution
                </label>
                <div className="flex items-center gap-1">
                  {(['1K', '2K', '4K'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setImageSize(sz)}
                      className={`flex-1 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        imageSize === sz
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Aspect Ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 text-slate-700 cursor-pointer"
                >
                  <option value="1:1">1:1 Square</option>
                  <option value="4:3">4:3 Landscape</option>
                  <option value="3:4">3:4 Portrait</option>
                  <option value="16:9">16:9 Widescreen</option>
                  <option value="9:16">9:16 Story</option>
                </select>
              </div>
            </div>
          </div>

          {/* Prompt input and quick chips */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Edit Prompt Instructions
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="Describe what to add, modify, or enhance (e.g., lighting, materials, weather, atmosphere)..."
                className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none transition-all resize-none"
              />
            </div>

            {/* Quick edit chips */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                Quick Edit Inspirations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {editPromptChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(chip.text)}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium border border-purple-200/60 transition-colors cursor-pointer"
                  >
                    + {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {error}
              </div>
            )}

            <button
              onClick={handleEditOrCreate}
              disabled={loading || !prompt.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-semibold text-sm shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing with gemini-nano-banana-2.1...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>
                    {useCurrentSnapshot ? 'Apply AI Edit with Nano Banana 2.1' : 'Create with Nano Banana 2.1'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Comparison Column */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm min-h-[460px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                AI Edited Result
              </h3>

              {resultImage && currentCanvasSnapshot && (
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setActiveView('after')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      activeView === 'after'
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Edited Image
                  </button>
                  <button
                    onClick={() => setActiveView('split')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      activeView === 'split'
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Before / After
                  </button>
                </div>
              )}
            </div>

            {/* Display Area */}
            <div className="flex-1 flex items-center justify-center p-2">
              {loading ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto animate-pulse">
                    <Wand2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      Transforming Image with gemini-nano-banana-2.1
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Applying natural language edit instructions while preserving product geometry and logo clarity...
                    </p>
                  </div>
                </div>
              ) : resultImage ? (
                <div className="w-full space-y-4">
                  {activeView === 'split' && currentCanvasSnapshot ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                          Original Mockup
                        </span>
                        <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square flex items-center justify-center">
                          <img
                            src={currentCanvasSnapshot}
                            alt="Original"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider block">
                          AI Edited (Nano Banana 2.1)
                        </span>
                        <div className="rounded-xl overflow-hidden border border-purple-200 bg-slate-50 aspect-square flex items-center justify-center shadow-sm">
                          <img
                            src={resultImage}
                            alt="AI Edited"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900/5 flex items-center justify-center max-h-[520px]">
                      <img
                        src={resultImage}
                        alt="AI Edited Result"
                        className="max-h-[500px] w-auto object-contain rounded-xl"
                      />
                    </div>
                  )}

                  {resultCaption && (
                    <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                      "{resultCaption}"
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Wand2 className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">No AI edits applied yet</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Choose an edit prompt chip or write custom instructions to modify the current mockup using gemini-nano-banana-2.1.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            {resultImage && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs text-slate-500">
                  Model: <strong className="text-slate-800">gemini-nano-banana-2.1</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
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
