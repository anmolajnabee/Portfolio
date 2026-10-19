import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Certificate } from '../../types/portfolio';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Modal } from '../ui/Modal';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  Check,
  FileCheck,
  FileText
} from 'lucide-react';

export const AdminCertificates: React.FC = () => {
  const {
    data,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    toggleCertificatePublish,
    reorderCertificate,
    isFirestoreConnected,
  } = usePortfolio();

  const { certificates } = data;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    highlight: '',
    verifyUrl: '',
    imageUrl: '',
    downloadUrl: '',
    category: 'Certificate',
    published: true,
  });

  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAdd = () => {
    setEditingCert(null);
    setFormData({
      title: '',
      issuer: '',
      issueDate: '',
      highlight: '',
      verifyUrl: '',
      imageUrl: '',
      downloadUrl: '',
      category: 'Certificate',
      published: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cert: Certificate) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate || '',
      highlight: cert.highlight || '',
      verifyUrl: cert.verifyUrl || '',
      imageUrl: cert.imageUrl || '',
      downloadUrl: cert.downloadUrl || '',
      category: cert.category || 'Certificate',
      published: cert.published !== false,
    });
    setModalOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, or WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image file size must be less than 2MB.');
      return;
    }

    setIsProcessingFile(true);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setFormData((prev) => ({ ...prev, imageUrl: compressed }));
        }
        setIsProcessingFile(false);
      };
      img.onerror = () => {
        setIsProcessingFile(false);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDocFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Certificate file size must be less than 2MB.');
      return;
    }

    setIsProcessingFile(true);
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, downloadUrl: reader.result as string }));
      setIsProcessingFile(false);
    };
    reader.onerror = () => setIsProcessingFile(false);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCert) {
      await updateCertificate(editingCert.id, {
        title: formData.title.trim(),
        issuer: formData.issuer.trim(),
        issueDate: formData.issueDate.trim(),
        highlight: formData.highlight.trim(),
        verifyUrl: formData.verifyUrl.trim(),
        imageUrl: formData.imageUrl.trim(),
        downloadUrl: formData.downloadUrl.trim(),
        category: formData.category || 'Certificate',
        published: formData.published,
      });
    } else {
      await addCertificate({
        title: formData.title.trim(),
        issuer: formData.issuer.trim(),
        issueDate: formData.issueDate.trim(),
        highlight: formData.highlight.trim(),
        verifyUrl: formData.verifyUrl.trim(),
        imageUrl: formData.imageUrl.trim(),
        downloadUrl: formData.downloadUrl.trim(),
        category: formData.category || 'Certificate',
        published: formData.published,
      });
    }
    setModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    await deleteCertificate(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#F5F5F5] tracking-tight">
              Certificates Manager
            </h2>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isFirestoreConnected
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-950/40 text-amber-400 border-amber-500/20'
              }`}
            >
              {isFirestoreConnected ? 'Firestore Connected' : 'Local State'}
            </span>
          </div>
          <p className="text-xs text-[#929292] mt-1">
            Manage verified credentials, courses, and milestones displayed on the public Certificates section.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenAdd}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Add Certificate</span>
        </Button>
      </div>

      {/* Certificates List */}
      <div className="divide-y divide-white/[0.08] border border-white/[0.08] rounded-lg bg-[#121215] overflow-hidden">
        {certificates.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-10 h-10 rounded-full border border-white/[0.1] bg-white/[0.02] flex items-center justify-center mx-auto text-[#929292]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#F5F5F5]">No certificates configured yet</p>
              <p className="text-xs text-[#929292] max-w-md mx-auto">
                Click &quot;Add Certificate&quot; to publish your verified certifications, courses, or hackathon honors.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleOpenAdd}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add Your First Certificate</span>
            </Button>
          </div>
        ) : (
          certificates.map((cert, index) => (
            <div
              key={cert.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
            >
              {/* Order Controls & Thumbnail */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => reorderCertificate(cert.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-[#929292] hover:text-[#F5F5F5] disabled:opacity-30 disabled:hover:text-[#929292] rounded"
                    title="Move up in order"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => reorderCertificate(cert.id, 'down')}
                    disabled={index === certificates.length - 1}
                    className="p-1 text-[#929292] hover:text-[#F5F5F5] disabled:opacity-30 disabled:hover:text-[#929292] rounded"
                    title="Move down in order"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {cert.imageUrl ? (
                  <div className="w-14 h-14 rounded-md overflow-hidden bg-[#0A0A0C] border border-white/[0.08] shrink-0">
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-md bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-[#929292] shrink-0">
                    <FileText className="w-6 h-6 stroke-[1.2]" />
                  </div>
                )}

                {/* Details */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#F5F5F5] truncate max-w-sm">
                      {cert.title}
                    </h3>
                    <button
                      onClick={() => toggleCertificatePublish(cert.id)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        cert.published !== false
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                      }`}
                      title="Click to toggle published status"
                    >
                      {cert.published !== false ? 'Published' : 'Draft / Hidden'}
                    </button>
                  </div>

                  <p className="text-xs text-[#929292]">
                    <span className="text-[#668CFF]">{cert.issuer}</span>
                    {cert.issueDate && ` · ${cert.issueDate}`}
                  </p>

                  {cert.highlight && (
                    <p className="text-[11px] text-[#929292] truncate max-w-md">
                      {cert.highlight}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {cert.verifyUrl && (
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-[#929292] hover:text-[#668CFF] rounded transition-colors"
                    title="Open verification link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={() => toggleCertificatePublish(cert.id)}
                  className="p-1.5 text-[#929292] hover:text-[#F5F5F5] rounded transition-colors"
                  title={cert.published !== false ? 'Unpublish certificate' : 'Publish certificate'}
                >
                  {cert.published !== false ? (
                    <Eye className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-amber-400" />
                  )}
                </button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleOpenEdit(cert)}
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  <span>Edit</span>
                </Button>

                <button
                  onClick={() => setDeleteConfirmId(cert.id)}
                  className="p-1.5 text-[#929292] hover:text-red-400 rounded transition-colors"
                  title="Delete certificate"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCert ? 'Edit Certificate' : 'Add New Certificate'}
        description="Provide details, verification link, and upload an optional certificate badge or image."
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Certificate Title / Credential Name"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Meta Front-End Developer Professional Certificate"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Issuing Organization"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              placeholder="e.g. Coursera / Meta, HackerRank, etc."
              required
            />

            <Input
              label="Issue Date / Year (optional)"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              placeholder="e.g. October 2025"
            />
          </div>

          <Textarea
            label="Highlight / Key Learnings (optional)"
            value={formData.highlight}
            onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
            rows={2}
            placeholder="e.g. Comprehensive hands-on mastery of modern web architecture and programming."
          />

          <Input
            label="Credential Verification URL (optional)"
            value={formData.verifyUrl}
            onChange={(e) => setFormData({ ...formData, verifyUrl: e.target.value })}
            placeholder="https://..."
          />

          {/* Certificate Image / Thumbnail Upload */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-medium text-[#F5F5F5] block">
              Certificate Image / Badge (optional)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 rounded-lg bg-[#0E0E10] border border-white/[0.08]">
              {formData.imageUrl ? (
                <div className="w-20 h-16 rounded overflow-hidden bg-black/40 border border-white/[0.1] shrink-0">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-16 rounded bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-[#929292] shrink-0">
                  <ImageIcon className="w-6 h-6 stroke-[1.2]" />
                </div>
              )}

              <div className="space-y-1.5 flex-1 min-w-0">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                  onChange={handleImageFileChange}
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isProcessingFile}
                  >
                    <Upload className="w-3.5 h-3.5 mr-1" />
                    <span>{formData.imageUrl ? 'Replace Image' : 'Upload Image'}</span>
                  </Button>
                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="text-xs text-[#929292] hover:text-white px-2 py-1"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-[#929292]">
                  PNG, JPG, or WebP up to 2MB. Stored directly with the certificate record.
                </p>
              </div>
            </div>
          </div>

          {/* Optional Downloadable Certificate File */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-medium text-[#F5F5F5] block">
              Downloadable File (PDF or Document) (optional)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 rounded-lg bg-[#0E0E10] border border-white/[0.08]">
              <input
                ref={docInputRef}
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={handleDocFileChange}
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => docInputRef.current?.click()}
                  disabled={isProcessingFile}
                >
                  <Upload className="w-3.5 h-3.5 mr-1" />
                  <span>{formData.downloadUrl ? 'Replace File' : 'Upload Certificate File'}</span>
                </Button>
                {formData.downloadUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, downloadUrl: '' })}
                    className="text-xs text-[#929292] hover:text-white px-2 py-1"
                  >
                    Remove File
                  </button>
                )}
              </div>
              <span className="text-[11px] text-[#929292]">
                {formData.downloadUrl ? 'File attached' : 'Optional PDF download link for visitors.'}
              </span>
            </div>
          </div>

          {/* Published Toggle */}
          <label className="flex items-center gap-2 pt-2 text-xs font-mono text-[#F5F5F5] cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="accent-[#668CFF] rounded w-4 h-4 cursor-pointer"
            />
            <span>Publish on public portfolio immediately</span>
          </label>

          {/* Dialog Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isProcessingFile}>
              <Check className="w-3.5 h-3.5 mr-1" />
              <span>{editingCert ? 'Save Changes' : 'Add Certificate'}</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirmId(null)}
          title="Confirm Certificate Deletion"
          description="Are you sure you want to delete this certificate? This action cannot be undone."
          maxWidth="sm"
        >
          <div className="space-y-4 pt-2">
            <p className="text-xs text-[#929292]">
              The certificate record will be removed from your portfolio and Firestore database.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-500 transition-colors"
              >
                Delete Certificate
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
