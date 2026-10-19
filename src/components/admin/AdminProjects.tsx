import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types/portfolio';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Modal } from '../ui/Modal';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  RefreshCw,
  Github,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react';
import { GITHUB_USERNAME } from '../../services/githubService';

export const AdminProjects: React.FC = () => {
  const {
    data,
    addProject,
    updateProject,
    deleteProject,
    toggleProjectPublish,
    toggleProjectFeature,
    reorderProject,
    isFetchingGitHub,
    githubError,
    refreshGitHubRepos,
    rateLimitRemaining,
  } = usePortfolio();

  const { projects } = data;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    technologies: '',
    githubUrl: '',
    demoUrl: '',
    imageUrl: '',
    featured: true,
    published: true,
  });

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      tagline: '',
      description: '',
      technologies: '',
      githubUrl: `https://github.com/${GITHUB_USERNAME}/`,
      demoUrl: '',
      imageUrl: '',
      featured: true,
      published: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      tagline: project.tagline || '',
      description: project.description || '',
      technologies: project.technologies?.join(', ') || '',
      githubUrl: project.githubUrl || '',
      demoUrl: project.demoUrl || '',
      imageUrl: project.imageUrl || '',
      featured: project.featured ?? false,
      published: project.published !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProject) {
      await updateProject(editingProject.id, {
        title: formData.title,
        tagline: formData.tagline || formData.description,
        description: formData.description || formData.tagline,
        technologies: techArray,
        githubUrl: editingProject.githubUrl || formData.githubUrl, // Keep original GitHub URL intact
        demoUrl: formData.demoUrl.trim(),
        imageUrl: formData.imageUrl,
        featured: formData.featured,
        published: formData.published,
      });
    } else {
      await addProject({
        title: formData.title,
        tagline: formData.tagline || formData.description,
        description: formData.description || formData.tagline,
        fullStory: formData.description,
        category: 'Software Development',
        technologies: techArray,
        githubUrl: formData.githubUrl,
        demoUrl: formData.demoUrl.trim(),
        imageUrl: formData.imageUrl,
        featured: formData.featured,
        published: formData.published,
        date: new Date().getFullYear().toString(),
        order: projects.length,
      });
    }

    setModalOpen(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete or hide project "${title}" from portfolio?`)) {
      await deleteProject(id);
    }
  };

  const handleManualSync = async () => {
    setSyncSuccessMsg(null);
    try {
      await refreshGitHubRepos(true);
      setSyncSuccessMsg(`Repositories synchronized from GitHub @${GITHUB_USERNAME}`);
      setTimeout(() => setSyncSuccessMsg(null), 4000);
    } catch {
      // Error handled in context state
    }
  };

  // Sort projects by order
  const sortedProjects = [...projects].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#F5F5F5] tracking-tight">GitHub Projects Manager</h2>
            <span className="text-xs font-mono text-[#668CFF] bg-[#668CFF]/10 px-2 py-0.5 rounded border border-[#668CFF]/20">
              @{GITHUB_USERNAME}
            </span>
          </div>
          <p className="text-xs text-[#929292] mt-1">
            Curate, reorder, feature, and edit display descriptions and live demos for public repositories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleManualSync}
            disabled={isFetchingGitHub}
            title="Fetch latest repositories and stars from GitHub REST API"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isFetchingGitHub ? 'animate-spin text-[#668CFF]' : ''}`} />
            <span>{isFetchingGitHub ? 'Syncing...' : 'Sync from GitHub'}</span>
          </Button>

          <Button variant="primary" size="sm" onClick={handleOpenAdd}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add Project</span>
          </Button>
        </div>
      </div>

      {/* GitHub Sync Status Bar */}
      <div className="p-4 rounded-lg bg-[#121215] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <Github className="w-4 h-4 text-[#F5F5F5] shrink-0" />
          <div className="space-y-0.5">
            <span className="text-[#F5F5F5] font-medium">GitHub REST API Integration Active</span>
            <p className="text-[#929292]">
              Public repos for <strong className="text-slate-300">github.com/{GITHUB_USERNAME}</strong>
              {rateLimitRemaining !== null && ` • Rate limit: ${rateLimitRemaining} requests remaining`}
            </p>
          </div>
        </div>

        {syncSuccessMsg && (
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/20">
            <Check className="w-3 h-3" />
            <span>{syncSuccessMsg}</span>
          </span>
        )}
      </div>

      {/* Error notice if GitHub API failed */}
      {githubError && (
        <div className="p-4 rounded-lg bg-red-950/30 border border-red-500/30 flex items-center justify-between text-xs text-red-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{githubError}</span>
          </div>
          <button
            onClick={handleManualSync}
            className="text-xs font-mono text-[#668CFF] underline hover:text-white cursor-pointer ml-3 shrink-0"
          >
            Retry Sync
          </button>
        </div>
      )}

      {/* Projects List with Reordering and Controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono uppercase tracking-wider text-[#929292]">
            Repository List ({sortedProjects.length})
          </span>
          <span className="text-[11px] font-mono text-[#929292]">
            Top 3 appear on initial view • Use arrows to reorder
          </span>
        </div>

        <div className="divide-y divide-white/[0.08] border border-white/[0.08] rounded-lg bg-[#121215]">
          {sortedProjects.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <p className="text-xs text-[#929292]">
                No projects imported yet. Click &quot;Sync from GitHub&quot; above to import your public repositories.
              </p>
            </div>
          ) : (
            sortedProjects.map((project, idx) => (
              <div
                key={project.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
              >
                {/* Reordering and Project Details */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Order Index & Arrows */}
                  <div className="flex flex-col items-center shrink-0 pt-0.5 space-y-1">
                    <button
                      onClick={() => reorderProject(project.id, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded text-[#929292] hover:text-[#F5F5F5] hover:bg-white/[0.05] disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono text-[#929292]">
                      {idx + 1}
                    </span>
                    <button
                      onClick={() => reorderProject(project.id, 'down')}
                      disabled={idx === sortedProjects.length - 1}
                      className="p-1 rounded text-[#929292] hover:text-[#F5F5F5] hover:bg-white/[0.05] disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Main Project Information */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-[#F5F5F5] truncate">
                        {project.title}
                      </h3>

                      {project.repoName && (
                        <span className="text-[10px] font-mono text-[#929292] bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
                          {project.repoName}
                        </span>
                      )}

                      {/* Featured Badge */}
                      {project.featured && (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-[#668CFF]">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Featured</span>
                        </span>
                      )}

                      {/* Published State Badge */}
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          project.published !== false
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {project.published !== false ? 'Published' : 'Hidden'}
                      </span>

                      {/* Fork Badge */}
                      {project.isFork && (
                        <span className="text-[10px] font-mono text-zinc-500 border border-zinc-700/50 px-1 rounded">
                          Fork
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#929292] line-clamp-2">
                      {project.description || project.tagline || 'No description configured.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#929292] pt-1">
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span key={tech} className="text-slate-300">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {project.demoUrl && (
                        <span className="text-emerald-400/90 truncate max-w-[200px]">
                          Demo: {project.demoUrl}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.06] w-full md:w-auto justify-end">
                  {/* Feature toggle button */}
                  <button
                    onClick={() => toggleProjectFeature(project.id)}
                    className={`p-1.5 rounded transition-colors ${
                      project.featured
                        ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                        : 'text-[#929292] hover:text-[#F5F5F5] hover:bg-white/[0.05]'
                    }`}
                    title={project.featured ? 'Unfeature project' : 'Feature project'}
                  >
                    <Star className="w-4 h-4" fill={project.featured ? 'currentColor' : 'none'} />
                  </button>

                  {/* Publish/Hide toggle button */}
                  <button
                    onClick={() => toggleProjectPublish(project.id)}
                    className={`p-1.5 rounded transition-colors ${
                      project.published !== false
                        ? 'text-emerald-400 hover:bg-emerald-500/10'
                        : 'text-[#929292] hover:text-[#F5F5F5] hover:bg-white/[0.05]'
                    }`}
                    title={project.published !== false ? 'Hide from portfolio' : 'Publish to portfolio'}
                  >
                    {project.published !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* GitHub external link */}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-[#929292] hover:text-[#F5F5F5] rounded hover:bg-white/[0.05] transition-colors"
                      title="Open GitHub Repository"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {/* Edit display settings button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenEdit(project)}
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    <span>Edit Display</span>
                  </Button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    className="p-1.5 text-[#929292] hover:text-red-400 rounded hover:bg-red-500/10 transition-colors"
                    title="Remove Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Display Settings Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? `Edit Display: ${editingProject.title}` : 'Add New Project'}
        description="Customize the portfolio display title, description, technology tags, and live demo link without altering GitHub."
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Display Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Capacity Connect Training Platform"
            required
          />

          <Textarea
            label="Portfolio Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            placeholder="Concise one-sentence description explaining what this project builds or solves."
            required
          />

          <Input
            label="Technology Tags (comma-separated)"
            value={formData.technologies}
            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            placeholder="e.g. Python, Reflex, Web Development"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Verified Live Demo URL (optional)"
              value={formData.demoUrl}
              onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
              placeholder="https://your-live-demo.run/"
            />

            <Input
              label="GitHub Repository URL"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder={`https://github.com/${GITHUB_USERNAME}/repo-name`}
              readOnly={!!editingProject?.githubUrl}
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono">
            <label className="flex items-center gap-2 text-[#929292] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="accent-[#668CFF] rounded"
              />
              <span>Feature on Public Homepage (Top 3)</span>
            </label>

            <label className="flex items-center gap-2 text-[#929292] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="accent-[#668CFF] rounded"
              />
              <span>Published to Public Site</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingProject ? 'Save Display Settings' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
