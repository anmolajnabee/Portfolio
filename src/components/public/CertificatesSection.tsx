import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Certificate } from '../../types/portfolio';
import { Award, ExternalLink, Download, Image as ImageIcon, X } from 'lucide-react';

export const CertificatesSection: React.FC = () => {
  const { data, setActiveView } = usePortfolio();
  const { certificates } = data;

  const [activeImageCert, setActiveImageCert] = useState<Certificate | null>(null);

  // Filter published certificates only and sort by display order
  const publishedCertificates = certificates
    .filter((cert) => cert.published !== false)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return (
    <section id="certificates" className="py-20 sm:py-24 border-b border-white/[0.08]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#668CFF]">
              Credentials
            </h2>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F5] mt-1.5">
              Certificates
            </p>
            <p className="text-sm text-[#929292] mt-2">
              Certifications and milestones in my learning journey.
            </p>
          </div>

          <span className="text-xs font-mono text-[#929292]">
            {publishedCertificates.length > 0 ? `${publishedCertificates.length} Available` : 'Milestones'}
          </span>
        </div>

        {/* Certificates List or Grid */}
        {publishedCertificates.length === 0 ? (
          <div className="p-8 sm:p-10 rounded-xl bg-[#111114] border border-white/[0.08] text-center space-y-3">
            <div className="w-10 h-10 rounded-full border border-white/[0.1] bg-white/[0.02] flex items-center justify-center mx-auto text-[#929292]">
              <Award className="w-5 h-5" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <p className="text-sm font-medium text-[#F5F5F5]">
                Certifications in progress
              </p>
              <p className="text-xs text-[#929292] leading-relaxed">
                Certifications, verified course completions, and milestones will appear here as they are completed and published.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setActiveView('admin')}
                className="text-xs text-[#668CFF] hover:underline cursor-pointer"
              >
                Manage certificates in Admin &rarr;
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {publishedCertificates.map((cert) => {
              const hasImage = Boolean(cert.imageUrl && cert.imageUrl.trim().length > 0);
              const hasValidVerify = Boolean(cert.verifyUrl && cert.verifyUrl.trim().length > 0);
              const hasDownload = Boolean(cert.downloadUrl && cert.downloadUrl.trim().length > 0);

              return (
                <div
                  key={cert.id}
                  className="p-5 rounded-xl bg-[#111114] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    {/* Optional Thumbnail / Preview */}
                    {hasImage && (
                      <div
                        onClick={() => setActiveImageCert(cert)}
                        className="relative w-full h-36 rounded-lg overflow-hidden bg-[#0A0A0C] border border-white/[0.06] cursor-pointer group"
                        title="Click to view certificate image"
                      >
                        <img
                          src={cert.imageUrl}
                          alt={cert.title}
                          className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-white">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Preview Image</span>
                        </div>
                      </div>
                    )}

                    {/* Meta info: Issuer and Issue Date */}
                    <div className="flex items-center justify-between text-xs font-mono text-[#929292]">
                      <span className="text-[#668CFF] font-medium truncate max-w-[180px]">
                        {cert.issuer}
                      </span>
                      {cert.issueDate && (
                        <span>{cert.issueDate}</span>
                      )}
                    </div>

                    {/* Certificate Title */}
                    <h3 className="text-base font-semibold text-[#F5F5F5] leading-snug">
                      {cert.title}
                    </h3>

                    {/* Highlight / Key distinction note */}
                    {cert.highlight && (
                      <p className="text-xs text-[#929292] leading-relaxed">
                        {cert.highlight}
                      </p>
                    )}
                  </div>

                  {/* Actions: View Certificate & Download */}
                  {(hasValidVerify || hasDownload || hasImage) && (
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {hasValidVerify && (
                          <a
                            href={cert.verifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#668CFF] hover:text-white font-medium transition-colors"
                          >
                            <span>View Certificate</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {!hasValidVerify && hasImage && (
                          <button
                            onClick={() => setActiveImageCert(cert)}
                            className="inline-flex items-center gap-1.5 text-[#668CFF] hover:text-white font-medium transition-colors cursor-pointer"
                          >
                            <span>View Image</span>
                            <ImageIcon className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {hasDownload && (
                        <a
                          href={cert.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center gap-1 text-[#929292] hover:text-[#F5F5F5] transition-colors"
                          title="Download Certificate File"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Download</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal for Certificate Image */}
      {activeImageCert && activeImageCert.imageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveImageCert(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#111114] border border-white/[0.1] rounded-xl overflow-hidden p-3 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-2 pt-1">
              <div>
                <h4 className="text-sm font-semibold text-[#F5F5F5]">
                  {activeImageCert.title}
                </h4>
                <p className="text-xs text-[#929292]">
                  {activeImageCert.issuer} {activeImageCert.issueDate && `· ${activeImageCert.issueDate}`}
                </p>
              </div>
              <button
                onClick={() => setActiveImageCert(null)}
                className="p-1 text-[#929292] hover:text-white rounded hover:bg-white/[0.08]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto rounded bg-[#0A0A0C] flex items-center justify-center p-2">
              <img
                src={activeImageCert.imageUrl}
                alt={activeImageCert.title}
                className="max-h-[65vh] w-auto object-contain mx-auto rounded"
              />
            </div>

            {activeImageCert.verifyUrl && (
              <div className="px-2 pb-1 text-right">
                <a
                  href={activeImageCert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#668CFF] hover:underline"
                >
                  <span>Verify Credential Online</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
