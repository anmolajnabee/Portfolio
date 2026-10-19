import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Plus, Trash2, Edit2, X, Check, Eye, EyeOff } from 'lucide-react';

export const AdminSkills: React.FC = () => {
  const {
    data,
    addSkill,
    updateSkill,
    deleteSkill,
    addSkillCategory,
    toggleSkillCategoryPublish
  } = usePortfolio();

  const { skillCategories } = data;

  const [activeCategoryId, setActiveCategoryId] = useState(skillCategories[0]?.id || '');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<{ id: string; name: string; proficiency: number; level: 'Expert' | 'Advanced' | 'Proficient' } | null>(null);

  // New Skill Form
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState(85);
  const [newSkillLevel, setNewSkillLevel] = useState<'Expert' | 'Advanced' | 'Proficient'>('Advanced');

  // New Category Form
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');

  const currentCategory = skillCategories.find(c => c.id === activeCategoryId) || skillCategories[0];

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    await addSkill(currentCategory.id, newSkillName.trim(), newSkillProficiency, newSkillLevel);
    setNewSkillName('');
    setIsAddingSkill(false);
  };

  const handleSaveEditSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    await updateSkill(currentCategory.id, editingSkill.id, {
      name: editingSkill.name,
      proficiency: editingSkill.proficiency,
      level: editingSkill.level
    });
    setEditingSkill(null);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    await addSkillCategory(newCategoryName.trim(), newCategoryDesc.trim());
    setNewCategoryName('');
    setNewCategoryDesc('');
    setIsAddingCategory(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white">Technical Skills Manager</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize core capabilities by architectural category, proficiency percentage, and publish status in Cloud Firestore.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingCategory(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Category</span>
          </button>
          <button
            onClick={() => setIsAddingSkill(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {skillCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
              currentCategory.id === cat.id
                ? 'bg-sky-950/60 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>{cat.name} ({cat.skills.length})</span>
            {cat.published ? (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Published" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Draft" />
            )}
          </button>
        ))}
      </div>

      {/* Category Info Box with Publish Toggle */}
      <div className="p-4 rounded-xl bg-[#090c13] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">{currentCategory.name}</h3>
            {currentCategory.published ? (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                Live on Portfolio
              </span>
            ) : (
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                Unpublished Group
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{currentCategory.description}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => toggleSkillCategoryPublish(currentCategory.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentCategory.published
                ? 'text-amber-400 bg-amber-950/30 hover:bg-amber-950/50 border border-amber-500/30'
                : 'text-emerald-400 bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-500/30'
            }`}
          >
            {currentCategory.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{currentCategory.published ? 'Unpublish Group' : 'Publish Group'}</span>
          </button>

          <button
            onClick={() => setIsAddingSkill(true)}
            className="text-xs font-mono text-sky-400 hover:underline"
          >
            + Add Skill Here
          </button>
        </div>
      </div>

      {/* Skills List in Current Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentCategory.skills.map((skill) => (
          <div
            key={skill.id}
            className="p-4 rounded-xl bg-[#090c13] border border-slate-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">{skill.name}</span>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">{skill.level}</span>
                <span className="text-slate-600">·</span>
                <span className="text-sky-400 font-bold tabular-nums">{skill.proficiency}%</span>
              </div>
            </div>

            {/* Progress gauge */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full"
                style={{ width: `${skill.proficiency}%` }}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
              <button
                onClick={() => setEditingSkill({ ...skill })}
                className="p-1.5 text-slate-400 hover:text-sky-400 rounded"
                title="Edit Skill"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteSkill(currentCategory.id, skill.id)}
                className="p-1.5 text-slate-500 hover:text-red-400 rounded"
                title="Delete Skill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Skill Modal */}
      {isAddingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#090c14] border border-slate-700 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white">
                Add Skill to {currentCategory.name}
              </h3>
              <button onClick={() => setIsAddingSkill(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Skill / Technology Name *
                </label>
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Distributed Consensus (Raft)"
                  className="w-full px-3 py-2 rounded-lg bg-[#0d121c] border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Proficiency:</span>
                  <span className="text-sky-400 font-bold">{newSkillProficiency}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(parseInt(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Mastery Level
                </label>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0d121c] border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                >
                  <option value="Expert">Expert</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Proficient">Proficient</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingSkill(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg"
                >
                  Add to Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Skill Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#090c14] border border-slate-700 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white">Edit Skill</h3>
              <button onClick={() => setEditingSkill(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0d121c] border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Proficiency:</span>
                  <span className="text-sky-400 font-bold">{editingSkill.proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={editingSkill.proficiency}
                  onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value) })}
                  className="w-full accent-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Mastery Level
                </label>
                <select
                  value={editingSkill.level}
                  onChange={(e) => setEditingSkill({ ...editingSkill, level: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0d121c] border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                >
                  <option value="Expert">Expert</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Proficient">Proficient</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update in Firestore</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#090c14] border border-slate-700 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white">Create New Skill Category</h3>
              <button onClick={() => setIsAddingCategory(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Embedded & Robotics"
                  className="w-full px-3 py-2 rounded-lg bg-[#0d121c] border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Category Scope Description
                </label>
                <textarea
                  rows={2}
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="Brief description of the domain..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0d121c] border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg"
                >
                  Create in Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
