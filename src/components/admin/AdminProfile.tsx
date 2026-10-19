import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Check, Save, Upload, Trash2, Camera, User, RefreshCw, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

export const AdminProfile: React.FC = () => {
  const { data, updateProfile } = usePortfolio();
  const { profile } = data;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: profile.fullName || '',
    title: profile.title || '',
    headline: profile.headline || '',
    introduction: profile.introduction || profile.subheading || '',
    avatarUrl: profile.avatarUrl || '',
    bioParagraph1: profile.bioParagraph1 || '',
    bioParagraph2: profile.bioParagraph2 || '',
    university: profile.university || '',
    graduationYear: profile.graduationYear || '',
    location: profile.location || '',
    availabilityStatus: profile.availabilityStatus || '',
    email: profile.socials?.email || '',
    github: profile.socials?.github || '',
    linkedin: profile.socials?.linkedin || '',
    twitter: profile.socials?.twitter || '',
    published: profile.published !== false,
  });

  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Handle local photograph upload & client-side optimization
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setIsProcessingImage(true);
    setImageError(null);

    const reader = new FileReader();
    reader.onerror = () => {
      setImageError('Failed to read image file.');
      setIsProcessingImage(false);
    };

    reader.onload = () => {
      const img = new Image();
      img.onerror = () => {
        setImageError('Failed to load image preview.');
        setIsProcessingImage(false);
      };

      img.onload = () => {
        try {
          // Optimize dimensions if large to keep within Firestore limits while maintaining crisp portrait fidelity
          const maxDim = 1200;
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

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.90);
            setFormData((prev) => ({ ...prev, avatarUrl: optimizedDataUrl }));
          } else {
            setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
          }
        } catch {
          setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        } finally {
          setIsProcessingImage(false);
        }
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        fullName: formData.fullName,
        title: formData.title,
        headline: formData.headline,
        introduction: formData.introduction,
        subheading: formData.introduction,
        avatarUrl: formData.avatarUrl,
        bioParagraph1: formData.bioParagraph1,
        bioParagraph2: formData.bioParagraph2,
        university: formData.university,
        graduationYear: formData.graduationYear,
        location: formData.location,
        availabilityStatus: formData.availabilityStatus,
        published: formData.published,
        socials: {
          ...profile.socials,
          email: formData.email,
          github: formData.github,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5] tracking-tight">Profile & Narrative</h2>
          <p className="text-xs text-[#929292] mt-1">
            Manage your personal portrait, public headline, two-line introduction, and social channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-mono text-[#929292] cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="accent-[#668CFF] rounded"
            />
            <span>Published on Site</span>
          </label>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saved ? (
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Changes'}
              </span>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Personal Photograph Field */}
        <div className="p-6 rounded-lg bg-[#121215] border border-white/[0.08] space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <h3 className="text-sm font-semibold text-[#F5F5F5] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#668CFF]" />
                <span>Personal Photograph (Hero Section)</span>
              </h3>
              <p className="text-xs text-[#929292] mt-0.5">
                Your actual portrait photograph featured beside your name and introduction in the Hero section.
              </p>
            </div>
            {formData.avatarUrl ? (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Custom Photo Active
              </span>
            ) : (
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                Placeholder Active
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] md:grid-cols-[180px_1fr] gap-6 items-start">
            {/* Live Portrait Preview Box */}
            <div className="space-y-2 flex flex-col items-center sm:items-start">
              <div className="w-36 h-36 sm:w-40 sm:h-40 relative rounded-full overflow-hidden border border-white/[0.15] bg-[#0E0E10] shadow-lg flex items-center justify-center ring-4 ring-white/[0.04] aspect-square">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt={formData.fullName || 'Portrait preview'}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5 text-[#929292]">
                    <User className="w-8 h-8 stroke-[1.2]" />
                    <span className="text-[10px] font-mono">No Image</span>
                  </div>
                )}

                {isProcessingImage && (
                  <div className="absolute inset-0 bg-black/75 flex items-center justify-center gap-2 text-xs text-white rounded-full">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#668CFF]" />
                    <span>Processing...</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] font-mono text-center text-[#929292] w-36 sm:w-40">
                Circular Portrait Preview
              </p>
            </div>

            {/* Upload & Replacement Controls */}
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                className="hidden"
                onChange={handleImageFileChange}
              />

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingImage}
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  <span>{formData.avatarUrl ? 'Replace Photograph' : 'Upload Photograph'}</span>
                </Button>

                {formData.avatarUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    <span>Remove Photo</span>
                  </Button>
                )}
              </div>

              {imageError && (
                <p className="text-xs text-red-400 font-mono">
                  {imageError}
                </p>
              )}

              {/* Direct URL input option */}
              <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                <label className="flex items-center gap-1.5 text-xs text-[#929292]">
                  <LinkIcon className="w-3 h-3 text-[#929292]" />
                  <span>Or specify direct image URL:</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    placeholder="https://example.com/your-portrait.jpg"
                    className="flex-1 px-3 py-1.5 rounded-md bg-[#161619] border border-white/[0.08] text-xs text-[#F5F5F5] placeholder-[#929292]/50 focus:border-[#668CFF] focus:outline-none"
                  />
                  {formData.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, avatarUrl: '' })}
                      className="text-xs text-[#929292] hover:text-[#F5F5F5] px-2 py-1"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-[#929292] leading-relaxed space-y-1 pt-1">
                <p className="text-[#F5F5F5] font-medium flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-[#668CFF]" />
                  <span>Preserving Your Authentic Appearance:</span>
                </p>
                <p>
                  Upload your actual personal photograph. The frame uses restrained, natural proportions without artificial styling, neon borders, or fictional stock replacements. Saving persists the image to Cloud Firestore and syncs instantly to your live public Hero section.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Identity */}
        <div className="p-6 rounded-lg bg-[#121215] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-semibold text-[#F5F5F5]">Hero Narrative</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />

            <Input
              label="Professional Role / Headline"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Computer Science Engineering · Systems & AI"
              required
            />
          </div>

          <Textarea
            label="Short Two-Line Introduction (Hero Section)"
            value={formData.introduction}
            onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
            rows={2}
            placeholder="A concise two-line summary of what you build and specialize in."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Availability Status"
              value={formData.availabilityStatus}
              onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
              placeholder="e.g. CSE STUDENT · CLASS OF 2029"
            />

            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Jaipur, Rajasthan, India"
            />
          </div>
        </div>

        {/* Biography */}
        <div className="p-6 rounded-lg bg-[#121215] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-semibold text-[#F5F5F5]">About Me Biography</h3>

          <Textarea
            label="Biography Paragraph 1"
            value={formData.bioParagraph1}
            onChange={(e) => setFormData({ ...formData, bioParagraph1: e.target.value })}
            rows={3}
            placeholder="Your background, engineering foundation, and technical passions."
          />

          <Textarea
            label="Biography Paragraph 2"
            value={formData.bioParagraph2}
            onChange={(e) => setFormData({ ...formData, bioParagraph2: e.target.value })}
            rows={3}
            placeholder="Learning experiences, projects, hackathons, and technology exploration."
          />
        </div>

        {/* Education */}
        <div className="p-6 rounded-lg bg-[#121215] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-semibold text-[#F5F5F5]">Education</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="University / Institution"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              placeholder="e.g. Jaipur Engineering College, Kukas, Jaipur, Rajasthan"
            />

            <Input
              label="Graduation Year / Class"
              value={formData.graduationYear}
              onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
              placeholder="e.g. Batch 2025–2029"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-lg bg-[#121215] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-semibold text-[#F5F5F5]">Contact & Socials</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@domain.com"
            />

            <Input
              label="GitHub Profile URL"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              placeholder="https://github.com/username"
            />

            <Input
              label="LinkedIn Profile URL"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/username"
            />

            <Input
              label="Twitter / X Profile URL"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              placeholder="https://x.com/username"
            />
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={saving}
          >
            {saved ? (
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <Check className="w-4 h-4" /> Changes Saved
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile Changes'}
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
