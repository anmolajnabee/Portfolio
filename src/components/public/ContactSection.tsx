import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Mail, Check, Send, Github, Linkedin, ArrowUpRight } from 'lucide-react';
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
  const { data, setActiveView, submitMessage } = usePortfolio();
  const { profile } = data;

  // Exact verified LinkedIn URL
  const verifiedLinkedInUrl =
    profile.socials?.linkedin &&
    profile.socials.linkedin !== 'https://linkedin.com' &&
    !profile.socials.linkedin.includes('alex')
      ? profile.socials.linkedin
      : 'https://www.linkedin.com/in/anmol-kumar-243412398';

  const xTwitterUrl = profile.socials?.twitter?.trim();

  const [formData, setFormData] = useState({ name: '', email: '', message: '', honeypot: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || trimmedName.length < 2) {
      errs.name = 'Please provide your full name (minimum 2 characters)';
    } else if (trimmedName.length > 100) {
      errs.name = 'Name must be 100 characters or fewer';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!trimmedEmail) {
      errs.email = 'Please provide your email address';
    } else if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 150) {
      errs.email = 'Please provide a valid email address (e.g. name@domain.com)';
    }

    if (!trimmedMessage || trimmedMessage.length < 10) {
      errs.message = 'Message must be at least 10 characters';
    } else if (trimmedMessage.length > 2000) {
      errs.message = 'Message must be 2000 characters or fewer';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot honeypot protection: silently drop automated spam
    if (formData.honeypot) {
      setStatus('sent');
      setFormData({ name: '', email: '', message: '', honeypot: '' });
      return;
    }

    if (!validate()) return;

    setStatus('sending');
    setServerError(null);

    try {
      const res = await submitMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });

      if (res.success) {
        setStatus('sent');
        setFormData({ name: '', email: '', message: '', honeypot: '' });
        setErrors({});
        setTimeout(() => setStatus('idle'), 6000);
      } else {
        setStatus('error');
        setServerError(res.error || 'Could not save message. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setServerError(msg);
    }
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
          {/* Left Column: Inquiries & Socials */}
          <div className="space-y-6">
            <p className="text-sm text-[#929292] leading-relaxed">
              Interested in collaborating on software engineering, web applications, or technology projects? Send a message through the form or connect via the profiles below.
            </p>

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
              {/* Spam protection honeypot (hidden from human visitors) */}
              <input
                type="text"
                name="user_organization_website"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <Input
                label="Your Name"
                placeholder="Anmol's Colleague"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                error={errors.name}
                required
              />

              <Input
                label="Your Email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                error={errors.email}
                required
              />

              <div className="space-y-1">
                <Textarea
                  label="Message"
                  placeholder="Tell me about your project, idea, or collaboration..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: undefined });
                  }}
                  error={errors.message}
                  required
                />
                <div className="flex justify-between items-center text-[10px] text-[#929292] font-mono px-1">
                  <span>Minimum 10 characters</span>
                  <span>{formData.message.length} / 2000</span>
                </div>
              </div>

              {/* Server-side Error Alert */}
              {serverError && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/20 text-xs text-red-400 space-y-1">
                  <p className="font-semibold">Unable to submit message</p>
                  <p className="text-[11px] text-red-300">{serverError}</p>
                </div>
              )}

              {/* Confirmed Success Alert */}
              {status === 'sent' && (
                <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-400 flex items-start gap-2.5 animate-fadeIn">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-emerald-300">Message sent successfully!</p>
                    <p className="text-[11px] text-emerald-400/80">
                      Your message has been saved to the database and delivered to the inbox. I'll get back to you soon.
                    </p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Saving message...</span>
                  </span>
                ) : status === 'sent' ? (
                  <span className="flex items-center gap-1.5 justify-center text-emerald-900 font-semibold">
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>Message Delivered</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
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
