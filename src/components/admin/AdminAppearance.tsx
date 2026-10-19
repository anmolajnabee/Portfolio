import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Check } from 'lucide-react';

export const AdminAppearance: React.FC = () => {
  const { data, updateAppearance } = usePortfolio();
  const { appearance } = data;

  const accentOptions: Array<{ id: 'blue' | 'cyan' | 'indigo' | 'emerald'; name: string; class: string }> = [
    { id: 'blue', name: 'Electric Sky Blue', class: 'bg-sky-500' },
    { id: 'cyan', name: 'Cyber Cyan', class: 'bg-cyan-400' },
    { id: 'indigo', name: 'Deep Indigo', class: 'bg-indigo-500' },
    { id: 'emerald', name: 'Terminal Emerald', class: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold text-white">Visual Appearance & Lighting</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure cinematic lighting, background mesh intensity, and accent color grading.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Accent Color Palette */}
        <div className="p-6 rounded-xl bg-[#090c13] border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">
            Primary Accent Lighting Tone
          </h3>
          <p className="text-xs text-slate-400">
            Select the dominant accent hue applied to interactive buttons, borders, and ambient halos.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {accentOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateAppearance({ accentColor: opt.id })}
                className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                  appearance.accentColor === opt.id
                    ? 'border-sky-500 bg-sky-950/40 text-white'
                    : 'border-slate-800 bg-[#0d121c] text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-3.5 h-3.5 rounded-full ${opt.class}`} />
                  <span className="text-xs font-medium">{opt.name}</span>
                </div>
                {appearance.accentColor === opt.id && (
                  <Check className="w-3.5 h-3.5 text-sky-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cinematic Atmospheric Toggles */}
        <div className="p-6 rounded-xl bg-[#090c13] border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">
            Atmospheric & Render Effects
          </h3>

          <div className="space-y-4 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={appearance.ambientGlow}
                onChange={(e) => updateAppearance({ ambientGlow: e.target.checked })}
                className="mt-0.5 rounded border-slate-700 text-sky-600 focus:ring-sky-500"
              />
              <div>
                <span className="text-xs font-medium text-white block">
                  Top Atmospheric Radial Glow
                </span>
                <span className="text-[11px] text-slate-400">
                  Subtle 800px electric radial glow anchored behind the hero headline.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={appearance.meshBackground}
                onChange={(e) => updateAppearance({ meshBackground: e.target.checked })}
                className="mt-0.5 rounded border-slate-700 text-sky-600 focus:ring-sky-500"
              />
              <div>
                <span className="text-xs font-medium text-white block">
                  Cinematic Gradient Mesh Canvas
                </span>
                <span className="text-[11px] text-slate-400">
                  Three-point dispersed subtle ambient gradient layers in the deep charcoal field.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={appearance.cardGlassEffect}
                onChange={(e) => updateAppearance({ cardGlassEffect: e.target.checked })}
                className="mt-0.5 rounded border-slate-700 text-sky-600 focus:ring-sky-500"
              />
              <div>
                <span className="text-xs font-medium text-white block">
                  Backdrop Blur & Glassmorphism
                </span>
                <span className="text-[11px] text-slate-400">
                  Glassmorphic navbar and subtle hairline card borders with backdrop-blur.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Preview Strip */}
      <div className="p-6 rounded-xl bg-[#07090e] border border-slate-800">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
          Live Render Lighting Sample
        </h4>
        <div className="p-4 rounded-lg bg-[#090c13] border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-sky-950/60 border border-sky-500/40 flex items-center justify-center font-mono text-sky-400 font-bold">
              &gt;_
            </div>
            <div>
              <span className="text-white font-semibold block">Cinematic Lighting Pipeline</span>
              <span className="text-slate-400 text-[11px]">Active Accent: {appearance.accentColor.toUpperCase()}</span>
            </div>
          </div>
          <span className="font-mono text-sky-400 bg-sky-950/40 px-2 py-1 rounded border border-sky-500/30 text-[11px]">
            ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
};
