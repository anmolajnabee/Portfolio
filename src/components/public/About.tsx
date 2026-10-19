import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { GraduationCap } from 'lucide-react';

export const About: React.FC = () => {
  const { data } = usePortfolio();
  const { profile, education, skillCategories } = data;

  const primaryEducation = education.filter((e) => e.published !== false)[0];

  return (
    <section id="about" className="py-20 sm:py-24 border-b border-white/[0.08]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-16">
        {/* Section Header */}
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#668CFF]">
              Background
            </h2>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F5] mt-1.5">
              About & Education
            </p>
          </div>
          <span className="text-xs font-mono text-[#929292]">
            Profile & Studies
          </span>
        </div>

        {/* 1. Short Biography */}
        <div className="space-y-4 max-w-2xl text-base text-[#929292] leading-relaxed">
          <p>
            {profile.bioParagraph1 ||
              "I’m Anmol Kumar, a Computer Science Engineering student at Jaipur Engineering College, Jaipur. I’m developing my skills in programming and software development while exploring AI, web technologies, hackathons, and entrepreneurial ideas. I enjoy learning by building practical projects and continuously improving my technical abilities."}
          </p>
          {profile.bioParagraph2 && (
            <p>{profile.bioParagraph2}</p>
          )}
        </div>

        {/* 2. Education & Technical Skills Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6 border-t border-white/[0.08]">
          {/* Education Block */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#F5F5F5]">
              <GraduationCap className="w-4 h-4 text-[#668CFF]" />
              <span>Education</span>
            </div>

            <div className="space-y-1.5 text-sm">
              <p className="font-semibold text-[#F5F5F5]">
                {primaryEducation?.degree || 'Bachelor of Technology (B.Tech)'}
              </p>
              <p className="text-xs font-mono text-[#668CFF]">
                Computer Science and Engineering (CSE)
              </p>
              <p className="text-[#929292]">
                {primaryEducation?.institution || 'Jaipur Engineering College, Kukas, Jaipur, Rajasthan'}
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-[#929292] pt-1">
                <span>Batch {primaryEducation?.period || '2025 – 2029'}</span>
                <span>·</span>
                <span className="text-emerald-400">Currently pursuing</span>
              </div>
            </div>
          </div>

          {/* Compact Technical Skills (No progress bars or fake meters) */}
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-[#F5F5F5]">
              Core Competencies
            </div>

            <div className="space-y-4 text-xs font-mono">
              {skillCategories && skillCategories.length > 0 ? (
                skillCategories
                  .filter((cat) => cat.published !== false)
                  .map((category) => (
                    <div key={category.id} className="space-y-1">
                      <span className="text-[#929292] block font-sans text-xs">
                        {category.name}
                      </span>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-300">
                        {category.skills.map((skill, sIdx) => (
                          <React.Fragment key={skill.id || skill.name}>
                            <span>{skill.name}</span>
                            {sIdx < category.skills.length - 1 && (
                              <span className="text-white/[0.2] select-none">·</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-sm text-[#929292]">
                  Software Development, Web Development, Programming Fundamentals, Problem Solving, Artificial Intelligence, Hackathons, Technology Entrepreneurship.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
