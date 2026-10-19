import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Github, ExternalLink, ArrowUpRight, ChevronDown, ChevronUp, RefreshCw, AlertCircle, Star } from 'lucide-react';
import { GITHUB_USERNAME } from '../../services/githubService';

export const ProjectsSection: React.FC = () => {
  const { data, isFetchingGitHub, githubError, refreshGitHubRepos } = usePortfolio();
  const [showAll, setShowAll] = useState(false);

  // Filter published projects and exclude forked repos by default unless explicitly featured
  const eligibleProjects = data.projects.filter(
    (p) => p.published !== false && (p.isFork !== true || p.featured === true)
  );

  // Sort by manual order if specified
  const sortedProjects = [...eligibleProjects].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  // Top 3 featured / primary projects
  const topProjects = sortedProjects.slice(0, 3);
  const remainingProjects = sortedProjects.slice(3);
  const displayProjects = showAll ? sortedProjects : topProjects;

  return (
    <section id="projects" className="py-20 sm:py-24 border-b border-white/[0.08]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#668CFF]">
                Selected Work
              </h2>
              <span className="text-white/[0.15]">/</span>
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-[#929292] hover:text-[#F5F5F5] transition-colors flex items-center gap-1"
                title="View GitHub Profile"
              >
                <Github className="w-3 h-3" />
                <span>@{GITHUB_USERNAME}</span>
              </a>
            </div>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F5] mt-1.5">
              Projects & Repositories
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isFetchingGitHub && (
              <span className="flex items-center gap-1.5 text-xs font-mono text-[#929292]">
                <RefreshCw className="w-3 h-3 animate-spin text-[#668CFF]" />
                <span>Syncing GitHub...</span>
              </span>
            )}
            <span className="text-xs font-mono text-[#929292]">
              {displayProjects.length} of {sortedProjects.length} Listed
            </span>
          </div>
        </div>

        {/* GitHub API Notice / Rate Limit Error State */}
        {githubError && (
          <div className="mb-8 p-4 rounded-lg bg-red-950/20 border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#929292]">
            <div className="flex items-center gap-2 text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{githubError}</span>
            </div>
            <button
              onClick={() => refreshGitHubRepos(true)}
              className="inline-flex items-center gap-1.5 text-[#668CFF] hover:text-white px-2.5 py-1 rounded border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] transition-colors shrink-0 cursor-pointer self-start sm:self-auto font-mono"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Fetch</span>
            </button>
          </div>
        )}

        {/* Projects List */}
        <div className="divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
          {isFetchingGitHub && sortedProjects.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#668CFF]" />
              <p className="text-xs font-mono text-[#929292]">
                Connecting to GitHub API for @{GITHUB_USERNAME}...
              </p>
            </div>
          ) : sortedProjects.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-sm text-[#929292]">
                No public repositories found.
              </p>
              <button
                onClick={() => refreshGitHubRepos(true)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono text-[#668CFF] bg-white/[0.04] hover:bg-white/[0.08] rounded border border-white/[0.08] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Check GitHub Again</span>
              </button>
            </div>
          ) : (
            displayProjects.map((project) => {
              const hasValidDemo = Boolean(
                project.demoUrl &&
                project.demoUrl.trim().length > 0 &&
                project.demoUrl.startsWith('http')
              );

              return (
                <article
                  key={project.id}
                  className="py-8 sm:py-9 group transition-colors hover:bg-white/[0.01]"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                    {/* Title, Year, and Stars */}
                    <div className="md:w-1/3 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-[#F5F5F5] group-hover:text-[#668CFF] transition-colors flex items-center gap-1.5">
                          <span>{project.title}</span>
                          {hasValidDemo && (
                            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#668CFF]" />
                          )}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-[#929292]">
                        {project.date && <span>{project.date}</span>}
                        {project.stars !== undefined && project.stars > 0 && (
                          <>
                            <span className="text-white/[0.2]">·</span>
                            <span className="inline-flex items-center gap-0.5 text-amber-400/90">
                              <Star className="w-3 h-3 fill-current" />
                              <span>{project.stars}</span>
                            </span>
                          </>
                        )}
                        {project.isFork && (
                          <>
                            <span className="text-white/[0.2]">·</span>
                            <span className="text-[10px] text-[#929292] uppercase">Fork</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Description, Tech Tags, and Action Buttons */}
                    <div className="md:w-2/3 space-y-3">
                      <p className="text-sm text-[#929292] leading-relaxed">
                        {project.description || project.tagline || 'No description provided.'}
                      </p>

                      {/* Clean Unboxed Technology Tags */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-[#929292]">
                          {project.technologies.slice(0, 5).map((tech, idx) => (
                            <React.Fragment key={tech}>
                              <span className="text-slate-300">{tech}</span>
                              {idx < Math.min(project.technologies.length, 5) - 1 && (
                                <span className="text-white/[0.2] select-none">·</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      )}

                      {/* Action Links */}
                      <div className="flex items-center gap-5 pt-1 text-xs">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#929292] hover:text-[#F5F5F5] transition-colors cursor-pointer"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>GitHub</span>
                          </a>
                        )}

                        {hasValidDemo && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#668CFF] hover:underline transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Live Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* View All Projects / Toggle View */}
        {remainingProjects.length > 0 && (
          <div className="pt-8 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-mono text-[#F5F5F5] bg-[#121215] hover:bg-[#18181D] border border-white/[0.1] hover:border-white/[0.2] rounded-md transition-all cursor-pointer"
            >
              {showAll ? (
                <>
                  <span>Show Top 3 Projects</span>
                  <ChevronUp className="w-3.5 h-3.5 text-[#668CFF]" />
                </>
              ) : (
                <>
                  <span>View All Projects ({sortedProjects.length})</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#668CFF]" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
