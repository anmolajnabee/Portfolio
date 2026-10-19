import React, { useEffect } from 'react';
import { Project } from '../../types/portfolio';
import { ProjectVisual } from './ProjectVisual';
import { X, ExternalLink, Github, CheckCircle2, Layers } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#090c14] border border-slate-700/80 rounded-2xl shadow-2xl overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090c14]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">
              {project.category}
            </span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-xs text-slate-400 font-mono">{project.date}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Visual Showcase Banner */}
          <div className="w-full">
            <ProjectVisual
              style={project.coverStyle}
              title={project.title}
              category={project.category}
              className="max-h-[320px]"
            />
          </div>

          {/* Title & Tagline */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {project.title}
            </h2>
            <p className="text-sm sm:text-base text-sky-300 font-medium">
              {project.tagline}
            </p>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 pt-2 pb-4 border-b border-slate-800">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                <Github className="w-4 h-4 text-sky-400" />
                <span>View Source Repository</span>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Launch Live Deployment</span>
              </a>
            )}
          </div>

          {/* Deep Narrative & Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-semibold">
                Overview & Engineering Challenge
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {project.fullStory}
              </p>

              {project.architectureNotes && (
                <div className="mt-4 p-4 rounded-xl bg-[#0d121c] border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-semibold mb-2">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Architectural Implementation</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {project.architectureNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Side Column: Metrics & Stack */}
            <div className="space-y-6">
              {project.metrics && project.metrics.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
                    Verified Benchmarks
                  </h4>
                  <div className="space-y-2">
                    {project.metrics.map((metric, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="font-mono tabular-nums">{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
                  Technology Stack
                </h4>
                <div className="text-xs text-slate-300 leading-relaxed font-mono">
                  {project.technologies.join(' · ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
