import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { VisualAvatar } from '../public/VisualAvatar';
import { ProjectVisual } from '../public/ProjectVisual';
import { Plus, Image, Check, X } from 'lucide-react';

export const AdminMedia: React.FC = () => {
  const { data } = usePortfolio();
  const [mediaList, setMediaList] = useState(data.media);
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaType, setNewMediaType] = useState<'avatar' | 'project_cover' | 'document'>('project_cover');

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaName) return;
    const item = {
      id: `media-${Date.now()}`,
      name: newMediaName,
      type: newMediaType,
      url: 'custom-asset',
      dateAdded: new Date().toISOString().split('T')[0],
      size: 'Local SVG / Asset'
    };
    setMediaList([item, ...mediaList]);
    setNewMediaName('');
    setIsAddingMedia(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white">Media & Asset Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your vector avatar, project cover canvases, and visual documentation.
          </p>
        </div>

        <button
          onClick={() => setIsAddingMedia(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register Asset</span>
        </button>
      </div>

      {/* Primary Visual Assets Inspection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Avatar Inspector */}
        <div className="p-6 rounded-xl bg-[#090c13] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-semibold text-white">
              Hero Visual Avatar
            </h3>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30">
              Generative Vector
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            <div className="w-36 h-36 shrink-0">
              <VisualAvatar name={data.profile.fullName} />
            </div>
            <div className="text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-white">
                Engineered Developer Insignia
              </p>
              <p className="text-slate-400 leading-relaxed">
                Rendered with SVG constellation lines, ambient electric blue rim lighting, and coordinate telemetry. Immune to broken external host URLs.
              </p>
              <div className="text-[11px] font-mono text-slate-500">
                Format: Vector SVG · Dynamic Initials
              </div>
            </div>
          </div>
        </div>

        {/* Project Visual Canvas Inspector */}
        <div className="p-6 rounded-xl bg-[#090c13] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-semibold text-white">
              Project Cover Styles
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              Ready
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <ProjectVisual style="neural" title="SynapseCode" category="AI" />
              <div className="text-[10px] font-mono text-slate-400 text-center">Neural AST</div>
            </div>
            <div className="space-y-1">
              <ProjectVisual style="network" title="NexusHack" category="Infra" />
              <div className="text-[10px] font-mono text-slate-400 text-center">Network Hub</div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Inventory List */}
      <div className="p-6 rounded-xl bg-[#090c13] border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-white border-b border-slate-800/80 pb-3">
          Registered Media Catalog
        </h3>

        <div className="divide-y divide-slate-800/80">
          {mediaList.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400">
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">{item.name}</span>
                  <span className="text-[11px] font-mono text-slate-500">{item.type} · Added {item.dateAdded}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span>{item.size}</span>
                <span className="text-emerald-400">Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Media Modal */}
      {isAddingMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#090c14] border border-slate-700 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white">Register Asset Metadata</h3>
              <button onClick={() => setIsAddingMedia(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedia} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Asset Name *
                </label>
                <input
                  type="text"
                  required
                  value={newMediaName}
                  onChange={(e) => setNewMediaName(e.target.value)}
                  placeholder="e.g. Distributed Consensus Diagram"
                  className="w-full px-3 py-2 rounded-lg bg-[#0d121c] border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Asset Category
                </label>
                <select
                  value={newMediaType}
                  onChange={(e) => setNewMediaType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0d121c] border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                >
                  <option value="project_cover">Project Cover Asset</option>
                  <option value="avatar">Profile Avatar</option>
                  <option value="document">Technical Document</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingMedia(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
