import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ArrowDownRight, Mail, Camera, User } from 'lucide-react';

export const Hero: React.FC = () => {
  const { data, setActiveView } = usePortfolio();
  const { profile } = data;

  const introText =
    profile.introduction ||
    profile.subheading ||
    'B.Tech CSE student at Jaipur Engineering College, Kukas, Jaipur. Exploring software development, AI, and building practical technology projects.';

  const hasPortrait = Boolean(profile.avatarUrl && profile.avatarUrl.trim().length > 0);

  // Reusable restrained portrait frame matching editorial minimalism (circular)
  const renderPortraitFrame = (isMobile: boolean = false) => (
    <div
      className={`${
        isMobile
          ? 'w-40 h-40 sm:w-48 sm:h-48'
          : 'w-56 h-56 lg:w-64 lg:h-64'
      } relative rounded-full overflow-hidden border border-white/[0.14] bg-[#121215] shadow-2xl shadow-black/60 shrink-0 aspect-square ring-4 ring-white/[0.03]`}
    >
      {hasPortrait ? (
        // Authentic Personal Photograph
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <img
            src={profile.avatarUrl}
            alt={profile.fullName || 'Personal Portrait'}
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Restrained subtle inner ring */}
          <div className="absolute inset-0 pointer-events-none rounded-full ring-1 ring-inset ring-white/[0.08]" />
        </div>
      ) : (
        // Clean Minimal Editorial Placeholder (Never a fictional or stock face)
        <div className="w-full h-full rounded-full flex flex-col items-center justify-center p-4 sm:p-5 text-center bg-[#121215] border border-dashed border-white/[0.14] space-y-2">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/[0.1] bg-white/[0.03] flex items-center justify-center text-[#929292]">
            <User className="w-5 h-5 stroke-[1.5]" />
          </div>

          <div className="space-y-0.5 max-w-[140px]">
            <p className="text-xs font-medium text-[#F5F5F5]">
              Personal Portrait
            </p>
            <p className="text-[10px] text-[#929292] leading-tight">
              Add your photo in Admin
            </p>
          </div>

          <button
            onClick={() => setActiveView('admin')}
            className="py-1 px-3 text-[10px] sm:text-[11px] font-medium text-[#668CFF] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-full border border-white/[0.08] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Camera className="w-3 h-3" />
            <span>Upload Photo</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <section id="top" className="pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-white/[0.08]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12 lg:gap-16">
          {/* Narrative & Identification */}
          <div className="flex-1 space-y-6 max-w-xl">
            {/* Availability / status note */}
            <p className="text-xs font-mono text-[#668CFF] tracking-wide uppercase">
              {profile.availabilityStatus || 'CSE STUDENT · CLASS OF 2029'}
            </p>

            {/* Name & Role */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F5F5]">
                {profile.fullName || 'Anmol Kumar'}
              </h1>
              <p className="text-lg sm:text-xl text-[#929292] font-normal leading-snug">
                {profile.title || 'Computer Science Engineering Student · Developer'}
              </p>
            </div>

            {/* On mobile: Portrait and introduction stacked elegantly */}
            <div className="block md:hidden py-1">
              {renderPortraitFrame(true)}
            </div>

            {/* Short Two-Line Introduction */}
            <p className="text-base sm:text-lg text-[#929292] leading-relaxed">
              {introText}
            </p>

            {/* Two Links: View Projects and Contact Me */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#F5F5F5] text-[#0B0B0C] rounded-md hover:bg-white transition-all shadow-sm cursor-pointer"
              >
                <span>View Projects</span>
                <ArrowDownRight className="w-4 h-4 text-[#0B0B0C]" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#141416] text-[#F5F5F5] border border-white/[0.08] hover:border-white/[0.18] rounded-md hover:bg-[#1A1A1E] transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#929292]" />
                <span>Contact Me</span>
              </a>
            </div>
          </div>

          {/* On desktop: Positioned beside name and introduction */}
          <div className="hidden md:block shrink-0 self-center">
            {renderPortraitFrame(false)}
          </div>
        </div>
      </div>
    </section>
  );
};
