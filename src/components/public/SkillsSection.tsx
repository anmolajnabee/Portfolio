import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const SkillsSection: React.FC = () => {
  const { data } = usePortfolio();
  const { skillCategories } = data;

  const visibleCategories = skillCategories.filter(c => c.published !== false);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(visibleCategories[0]?.id || '');

  const activeCategory = visibleCategories.find(c => c.id === selectedCategoryId) || visibleCategories[0];

  if (!activeCategory) return null;

  return (
    <section id="skills" className="py-20 border-t border-slate-800/80 bg-[#06080d]/60 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-2 font-medium">
              02. Technical Arsenal
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Core Competencies & Stack
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Grounded in systems performance, modern type-safe architectures, and machine intelligence pipelines.
          </p>
        </div>

        {/* Category Tabs (Interactive Filter Controls - Permitted per Section 1.A) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-slate-800/80 scrollbar-none">
          {visibleCategories.map((cat) => {
            const isActive = cat.id === activeCategory.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all duration-150 ${
                  isActive
                    ? 'bg-sky-950/60 text-sky-300 border border-sky-500/40 shadow-[0_0_15px_-3px_rgba(14,165,233,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Category Description Banner */}
        <div className="mb-8 p-4 rounded-xl bg-[#090d16] border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-300">{activeCategory.description}</span>
          <span className="font-mono text-sky-400 shrink-0 ml-4 tabular-nums">
            {activeCategory.skills.length} Technologies
          </span>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeCategory.skills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-xl bg-[#090c13] border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white tracking-wide">
                  {skill.name}
                </span>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">{skill.level}</span>
                  <span className="text-slate-600" aria-hidden="true">·</span>
                  <span className="text-sky-400 font-semibold tabular-nums">{skill.proficiency}%</span>
                </div>
              </div>

              {/* Minimal Progress Track */}
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* All Categories Snapshot Summary */}
        <div className="mt-14 pt-8 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-400">
          {visibleCategories.map((cat) => (
            <div key={cat.id} className="space-y-2">
              <h4 className="font-mono text-slate-300 uppercase tracking-wider font-semibold">
                {cat.name}
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {cat.skills.map(s => s.name).join(' · ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
