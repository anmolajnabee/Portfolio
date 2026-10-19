import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Database, 
  Download, 
  Copy, 
  Check, 
  Upload, 
  RotateCcw, 
  Image as ImageIcon,
  Trash2,
  ExternalLink
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const {
    data,
    seedFirestore,
    resetToDefault,
    exportDataJSON,
    isFirestoreConnected
  } = usePortfolio();

  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  const [copiedJSON, setCopiedJSON] = useState(false);
  const [copiedAssetUrl, setCopiedAssetUrl] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Simple Image Asset state
  const [newImageName, setNewImageName] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imageList, setImageList] = useState<Array<{ id: string; name: string; url: string }>>(
    data.profile.avatarUrl
      ? [{ id: '1', name: 'Personal Portrait', url: data.profile.avatarUrl }]
      : []
  );

  const handleSeed = async () => {
    setSeeding(true);
    setSeedError(null);
    try {
      await seedFirestore();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 3000);
    } catch (err: unknown) {
      setSeedError(err instanceof Error ? err.message : 'Synchronization failed');
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
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    const newAsset = {
      id: Date.now().toString(),
      name: newImageName.trim() || 'Asset',
      url: newImageUrl.trim(),
    };
    setImageList([...imageList, newAsset]);
    setNewImageName('');
    setNewImageUrl('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      const newAsset = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        url: base64Url,
      };
      setImageList((prev) => [...prev, newAsset]);
    };
    reader.readAsDataURL(file);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedAssetUrl(url);
    setTimeout(() => setCopiedAssetUrl(null), 2000);
  };

  return (
    <div className="space-y-10 max-w-3xl">
      {/* Header */}
      <div className="pb-6 border-b border-white/[0.08]">
        <h2 className="text-xl font-bold text-[#F5F5F5] tracking-tight">Settings & Utilities</h2>
        <p className="text-xs text-[#929292] mt-1">
          Database persistence, media assets, and portfolio backup management.
        </p>
      </div>

      {/* 1. Image Assets & Media Management */}
      <div className="p-6 rounded-lg bg-[#121215] border border-white/[0.08] space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-[#F5F5F5] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#668CFF]" />
            <span>Image Assets & Uploads</span>
          </h3>
          <p className="text-xs text-[#929292] mt-1">
            Upload images from your device or register image URLs for use in projects and certificates.
          </p>
        </div>

        {/* Upload & Add form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* File Upload Box */}
          <label className="p-4 rounded-md border border-dashed border-white/[0.15] hover:border-[#668CFF]/50 bg-[#151518] flex flex-col items-center justify-center text-center cursor-pointer transition-colors space-y-1.5">
            <Upload className="w-5 h-5 text-[#929292]" />
            <span className="text-xs font-medium text-[#F5F5F5]">Upload Image from Device</span>
            <span className="text-[11px] text-[#929292]">PNG, JPG, or WEBP</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {/* Add via URL Form */}
          <form onSubmit={handleAddImage} className="space-y-3">
            <Input
              label="Asset Label"
              placeholder="e.g. Project Demo Screenshot"
              value={newImageName}
              onChange={(e) => setNewImageName(e.target.value)}
            />
            <Input
              label="Image URL"
              placeholder="https://images.unsplash.com/..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <Button type="submit" variant="secondary" size="sm" className="w-full">
              Register Image URL
            </Button>
          </form>
        </div>

        {/* Assets List */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-mono uppercase text-[#929292]">Available Assets</span>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {imageList.map((img) => (
              <div
                key={img.id}
                className="p-2.5 rounded-md bg-[#161619] border border-white/[0.06] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-8 h-8 rounded object-cover border border-white/[0.1] shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://placehold.co/100x100/18181b/ffffff?text=Img';
                    }}
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-[#F5F5F5] truncate">{img.name}</p>
                    <p className="text-[10px] text-[#929292] font-mono truncate">{img.url}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyUrl(img.url)}
                    className="text-[11px] py-1 px-2"
                  >
                    {copiedAssetUrl === img.url ? (
                      <span className="text-emerald-400">Copied!</span>
                    ) : (
                      <span>Copy URL</span>
                    )}
                  </Button>
                  <button
                    onClick={() => setImageList(imageList.filter((i) => i.id !== img.id))}
                    className="p-1 text-[#929292] hover:text-red-400"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Cloud Firestore Database Synchronization */}
      <div className="p-6 rounded-lg bg-[#121215] border border-white/[0.08] space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#F5F5F5] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#668CFF]" />
              <span>Database Persistence</span>
            </h3>
            <p className="text-xs text-[#929292] mt-1">
              Synchronize documents with Cloud Firestore. All mutations are secured via Attribute-Based Access Control rules.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSeed}
            disabled={seeding}
          >
            {seedSuccess ? (
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <Check className="w-3.5 h-3.5" /> Synced
              </span>
            ) : (
              <span>{seeding ? 'Writing to Firestore...' : 'Sync Firestore'}</span>
            )}
          </Button>
        </div>

        {seedError && (
          <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-mono">
            Error: {seedError}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs font-mono text-[#929292] pt-1">
          <span
            className={`w-2 h-2 rounded-full ${
              isFirestoreConnected ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span>{isFirestoreConnected ? 'Firestore Active' : 'Connecting...'}</span>
        </div>
      </div>

      {/* 3. Export Backup JSON */}
      <div className="p-6 rounded-lg bg-[#121215] border border-white/[0.08] space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-[#F5F5F5] flex items-center gap-2">
            <Download className="w-4 h-4 text-[#668CFF]" />
            <span>Export Configuration JSON</span>
          </h3>
          <p className="text-xs text-[#929292] mt-1">
            Download or copy a portable JSON snapshot of your complete portfolio configuration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button variant="secondary" size="sm" onClick={handleDownloadJSON}>
            <Download className="w-3.5 h-3.5 mr-1 text-[#668CFF]" />
            <span>Download .json Backup</span>
          </Button>

          <Button variant="ghost" size="sm" onClick={handleCopyJSON}>
            {copiedJSON ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Copied
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Copy className="w-3.5 h-3.5" /> Copy JSON
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* 4. Reset to Initial State */}
      <div className="p-6 rounded-lg bg-[#121215] border border-white/[0.08] space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-[#F5F5F5] flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Reset Portfolio Data</span>
          </h3>
          <p className="text-xs text-[#929292] mt-1">
            Reset local state to default sample template.
          </p>
        </div>

        {confirmReset ? (
          <div className="flex items-center gap-3 pt-1">
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                resetToDefault();
                setConfirmReset(false);
              }}
            >
              Confirm Reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmReset(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setConfirmReset(true)}
          >
            Reset to Default
          </Button>
        )}
      </div>
    </div>
  );
};
