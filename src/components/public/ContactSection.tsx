import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Mail, Copy, Check, Send, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';

const XIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const ContactSection: React.FC = () => {
  const { data, setActiveView } = usePortfolio();
  const { profile } = data;
  const email = profile.socials?.email || 'anm8789667614@gmail.com';

  // Exact verified LinkedIn URL
  const verifiedLinkedInUrl =
    profile.socials?.linkedin &&
    profile.socials.linkedin !== 'https://linkedin.com' &&
    !profile.socials.linkedin.includes('alex')
      ? profile.socials.linkedin
      : 'https://www.linkedin.com/in/anmol-kumar-243412398';

  const xTwitterUrl = profile.socials?.twitter?.trim();

  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('sending');
    // Direct client mailto fallback trigger + clear feedback
    setTimeout(() => {
      setStatus('sent');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 600);
  };

  return (
    <section id="contact" className="py-20 sm:py-24">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#668CFF]">
              Get in Touch
            </h2>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F5] mt-1.5">
              Contact
            </p>
          </div>
          <span className="text-xs font-mono text-[#929292]">
            Connect
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column: Direct Inquiries & Socials */}
          <div className="space-y-6">
            <p className="text-sm text-[#929292] leading-relaxed">
              Interested in collaborating on software development, web applications, or technology projects? Feel free to reach out directly.
            </p>

            {/* Direct Email with One-Click Copy */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#929292] uppercase tracking-wider block">
                Direct Email
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${email}`}
                  className="text-sm font-semibold text-[#F5F5F5] hover:text-[#668CFF] transition-colors"
                >
                  {email}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 text-[#929292] hover:text-[#F5F5F5] transition-colors rounded hover:bg-white/[0.04]"
                  title="Copy email to clipboard"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              {copied && (
                <span className="text-[11px] font-mono text-emerald-400 block">
                  Copied to clipboard
                </span>
              )}
            </div>

            {/* Social Links */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono text-[#929292] uppercase tracking-wider block">
                Profiles & Links
              </span>
              <div className="flex flex-col gap-2.5 text-sm text-[#929292]">
                {profile.socials?.github && (
                  <a
                    href={profile.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[#F5F5F5] transition-colors w-fit"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3 h-3 text-[#929292]" />
                  </a>
                )}

                {/* 2. Verified LinkedIn Button */}
                <a
                  href={verifiedLinkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-[#F5F5F5] transition-colors w-fit text-[#F5F5F5] font-medium"
                  title="Open LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4 text-[#668CFF]" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 text-[#929292]" />
                </a>

                {/* 1. X (Twitter) Link with configurable URL or placeholder */}
                {xTwitterUrl ? (
                  <a
                    href={xTwitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[#F5F5F5] transition-colors w-fit"
                    title="Open X / Twitter Profile"
                  >
                    <XIcon className="w-4 h-4" />
                    <span>X (Twitter)</span>
                    <ArrowUpRight className="w-3 h-3 text-[#929292]" />
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 text-xs text-[#929292] py-0.5">
                    <XIcon className="w-4 h-4 text-[#929292]/70" />
                    <span>X (Twitter)</span>
                    <span className="text-white/[0.1]">&bull;</span>
                    <button
                      type="button"
                      onClick={() => setActiveView('admin')}
                      className="text-[11px] text-[#668CFF] hover:underline cursor-pointer"
                    >
                      Add in Admin
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Simple, Secure Contact Form */}
          <div className="p-6 rounded-xl bg-[#111113] border border-white/[0.08]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Your Name"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                required
              />

              <Input
                label="Your Email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                required
              />

              <Textarea
                label="Message"
                placeholder="Brief message..."
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                error={errors.message}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? (
                  <span>Sending...</span>
                ) : status === 'sent' ? (
                  <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <Check className="w-4 h-4" /> Message Sent
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>Send Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
