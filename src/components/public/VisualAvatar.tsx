import React from 'react';

interface VisualAvatarProps {
  name: string;
  className?: string;
}

export const VisualAvatar: React.FC<VisualAvatarProps> = ({ name, className = '' }) => {
  return (
    <div className={`relative aspect-square rounded-2xl overflow-hidden border border-sky-500/30 bg-[#0a0d14] shadow-[0_0_50px_-10px_rgba(14,165,233,0.25)] group ${className}`}>
      {/* Cinematic ambient electric lighting */}
      <div className="absolute inset-0 bg-radial-gradient from-sky-500/20 via-transparent to-transparent opacity-80" />
      
      {/* Background SVG grid & architectural node mesh */}
      <svg className="absolute inset-0 w-full h-full text-sky-500/10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="avatar-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.75" />
          </pattern>
          <linearGradient id="cyber-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#avatar-grid)" />

        {/* Orbiting concentric rings */}
        <circle cx="50%" cy="48%" r="38%" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="50%" cy="48%" r="28%" fill="none" stroke="rgba(14, 165, 233, 0.25)" strokeWidth="1.5" />
        <circle cx="50%" cy="48%" r="18%" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" strokeDasharray="6 3" />

        {/* Constellation lines */}
        <line x1="20%" y1="30%" x2="50%" y2="48%" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" />
        <line x1="80%" y1="30%" x2="50%" y2="48%" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" />
        <line x1="50%" y1="48%" x2="30%" y2="75%" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" />
        <line x1="50%" y1="48%" x2="70%" y2="75%" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" />

        {/* Glowing constellation nodes */}
        <circle cx="20%" cy="30%" r="3" fill="#38bdf8" />
        <circle cx="80%" cy="30%" r="3" fill="#38bdf8" />
        <circle cx="30%" cy="75%" r="3" fill="#0284c7" />
        <circle cx="70%" cy="75%" r="3" fill="#0284c7" />
      </svg>

      {/* Central Portrait Monogram & Developer Insignia */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
        <div className="relative mb-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-sky-400/40 bg-gradient-to-b from-[#111827] to-[#0b0f19] flex items-center justify-center shadow-[inset_0_0_20px_rgba(56,189,248,0.2)]">
            <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tighter bg-gradient-to-br from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          {/* Subtle electric blue halo ring */}
          <div className="absolute -inset-1 rounded-full border border-sky-400/20 animate-pulse pointer-events-none" />
        </div>

        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-widest text-sky-400 font-semibold">
            CSE · B.Tech Student
          </p>
          <p className="text-xs text-slate-400 max-w-[200px]">
            Jaipur Engineering College · Batch 2025–2029
          </p>
        </div>
      </div>

      {/* Bottom corner technical detail watermark */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-slate-500 z-10 border-t border-slate-800/80 pt-2">
        <span className="tabular-nums">37.7749° N, 122.4194° W</span>
        <span className="text-sky-400/80">CORE_SYS v2.7</span>
      </div>
    </div>
  );
};
