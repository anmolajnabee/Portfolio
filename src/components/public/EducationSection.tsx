import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { GraduationCap, BookOpen, CheckCircle } from 'lucide-react';

export const EducationSection: React.FC = () => {
  const { data } = usePortfolio();
  const { education } = data;

  const visibleEducation = education.filter(e => e.published !== false);

  return (
    <section id="education" className="py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-2 font-medium">
            05. Academic Foundation
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Computer Science & Engineering
          </h2>
        </div>

        {/* Education Timeline Cards */}
        <div className="space-y-8">
          {visibleEducation.map((item) => (
            <div
              key={item.id}
              className="p-8 rounded-2xl bg-[#090c13] border border-slate-800 shadow-xl"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-800/80">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                    <GraduationCap className="w-4 h-4" />
                    <span>{item.institution}</span>
                    <span className="text-slate-600" aria-hidden="true">·</span>
                    <span className="text-slate-400">{item.location}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {item.degree}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    {item.status}
                  </p>
                </div>

                {/* GPA Badge */}
                <div className="flex flex-col lg:items-end justify-center">
                  <div className="text-xs font-mono text-slate-400 mb-1">Cumulative GPA</div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
                    {item.gpa}
                  </div>
                  <div className="text-xs font-mono text-sky-400 mt-1">{item.period}</div>
                </div>
              </div>

              {/* Coursework & Extracurriculars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                {/* Key Coursework */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
                    <BookOpen className="w-4 h-4 text-sky-400" />
                    <span>Advanced Rigorous Coursework</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.coursework.map((course, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-slate-300 py-1.5 px-3 rounded-lg bg-[#0d121c] border border-slate-800/80"
                      >
                        {course}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Academic Distinctions & Leadership */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
                    <CheckCircle className="w-4 h-4 text-sky-400" />
                    <span>Leadership & Campus Distinctions</span>
                  </div>

                  <ul className="space-y-3">
                    {item.achievements.map((ach, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                        <span className="text-sky-400 mt-0.5" aria-hidden="true">▸</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
