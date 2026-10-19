import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Check, 
  Download, 
  RotateCcw, 
  Database, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  CloudUpload,
  Sparkles
} from 'lucide-react';

export const AdminPublish: React.FC = () => {
  const {
    data,
    resetToDefault,
    exportDataJSON,
    setActiveView,
    seedFirestore,
    isFirestoreConnected
  } = usePortfolio();

  const [copiedJSON, setCopiedJSON] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedError(null);
    try {
      await seedFirestore();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 4000);
    } catch (err: any) {
      setSeedError(err.message || 'Seeding failed');
    } finally {
      setSeeding(false);
    }
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(exportDataJSON());
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2000);
  };

  const handleDownloadJSON = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-snapshot-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const publishedProjects = data.projects.filter(p => p.published).length;
  const publishedCerts = data.certificates.filter(c => c.published).length;
  const publishedCategories = data.skillCategories.filter(s => s.published).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold text-white">Publish Controls & Database Synchronization</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage persistent Cloud Firestore storage, export portable backups, or sync initial data.
        </p>
      </div>

      {/* Main Cloud Firestore Persistent Status Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c101a] to-[#07090e] border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono mb-1">
              <span className={`w-2 h-2 rounded-full ${isFirestoreConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={isFirestoreConnected ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                {isFirestoreConnected ? 'Cloud Firestore Connected & Authoritative' : 'Connecting to Firestore...'}
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Persistent Multi-Collection Database
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-lg">
              All edits to profile, projects, certificates, and skills are persisted directly to Cloud Firestore. Visitors see only items with <span className="font-mono text-sky-300">published: true</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('public')}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleSeed}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-[0_0_20px_-3px_rgba(2,132,199,0.5)] transition-all disabled:opacity-50"
            >
              {seedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Firestore Synchronized!</span>
                </>
              ) : (
                <>
                  <CloudUpload className="w-4 h-4" />
                  <span>{seeding ? 'Writing to Firestore...' : 'Re-sync / Seed Collections'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {seedError && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-200 font-mono">
            Error: {seedError}
          </div>
        )}

        {/* Live Published Counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#0d121c] border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Projects Published</span>
            <span className="text-white font-bold text-sm tabular-nums">
              {publishedProjects} / {data.projects.length}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-[#0d121c] border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Certificates Published</span>
            <span className="text-white font-bold text-sm tabular-nums">
              {publishedCerts} / {data.certificates.length}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-[#0d121c] border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Skill Groups Published</span>
            <span className="text-white font-bold text-sm tabular-nums">
              {publishedCategories} / {data.skillCategories.length}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-[#0d121c] border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Access Whitelist</span>
            <span className="text-emerald-400 font-bold text-[11px] truncate block">
              Configured & Active
            </span>
          </div>
        </div>
      </div>

      {/* Snapshot Backup & Export */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-[#090c13] border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">
            Export JSON Portfolio Snapshot
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Download your entire portfolio configuration (profile, projects, skills, awards, layout) as a portable standard JSON schema.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadJSON}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Download .json File</span>
            </button>

            <button
              onClick={handleCopyJSON}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors"
            >
              {copiedJSON ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON Payload</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Reset to Default Sample */}
        <div className="p-6 rounded-xl bg-[#090c13] border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">
            Reset to Sample CS Student Portfolio
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Reverts all edits back to the initial benchmark Computer Science Engineering showcase dataset with AST copilot, hackathon hub, and honors.
          </p>

          <div className="pt-2">
            {confirmReset ? (
              <div className="flex items-center gap-2 bg-red-950/60 p-2 rounded-lg border border-red-500/40">
                <span className="text-xs text-red-300 font-medium">Are you sure?</span>
                <button
                  onClick={() => {
                    resetToDefault();
                    setConfirmReset(false);
                  }}
                  className="px-3 py-1 text-xs font-bold text-white bg-red-700 hover:bg-red-600 rounded"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/50 border border-red-500/20 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sample Data</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security Rules Verification Details */}
      <div className="p-6 rounded-xl bg-[#090c13] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Deployed Firestore Security Policy</span>
          </h3>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded border border-emerald-500/30">
            Rules Active
          </span>
        </div>

        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
          <p>
            Your Firestore database is secured with Attribute-Based Access Control (ABAC):
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-lg bg-[#0d121c] border border-slate-800 space-y-1">
              <span className="font-mono text-sky-400 font-semibold block text-[11px]">Public Read Access</span>
              <p className="text-slate-400 text-[11px]">
                Visitors can only query and read documents where <code className="text-slate-300">published == true</code>. Draft or unpublished content is denied.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-[#0d121c] border border-slate-800 space-y-1">
              <span className="font-mono text-emerald-400 font-semibold block text-[11px]">Authorized Admin Mutations</span>
              <p className="text-slate-400 text-[11px]">
                Only authenticated Google accounts confirmed against the <code className="text-slate-300">authorizedAdmins</code> whitelist in Cloud Firestore can create, update, or delete documents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
