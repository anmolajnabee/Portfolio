import React from 'react';

interface ProjectVisualProps {
  style?: 'neural' | 'network' | 'analytics' | 'terminal' | 'cyber';
  title: string;
  category: string;
  className?: string;
}

export const ProjectVisual: React.FC<ProjectVisualProps> = ({
  style = 'neural',
  title,
  category,
  className = ''
}) => {
  return (
    <div className={`relative w-full aspect-video rounded-xl overflow-hidden bg-[#0a0d14] border border-slate-800/80 group-hover:border-sky-500/40 transition-all duration-300 ${className}`}>
      {/* Background glow gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-[#07090e] pointer-events-none" />

      {/* Style 1: Neural Code AST Parser */}
      {style === 'neural' && (
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225">
          <defs>
            <linearGradient id="neural-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.2" />
            </linearGradient>
            <radialGradient id="dot-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid lines */}
          <path d="M 0 50 L 400 50 M 0 112 L 400 112 M 0 175 L 400 175" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="3 3" />
          <path d="M 100 0 L 100 225 M 200 0 L 200 225 M 300 0 L 300 225" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="3 3" />

          {/* Mock Code & AST Node Tree */}
          <rect x="25" y="25" width="160" height="175" rx="8" fill="#0d1117" stroke="#334155" strokeWidth="1" />
          <circle cx="42" cy="40" r="4" fill="#ef4444" opacity="0.6" />
          <circle cx="56" cy="40" r="4" fill="#eab308" opacity="0.6" />
          <circle cx="70" cy="40" r="4" fill="#22c55e" opacity="0.6" />

          {/* Code lines */}
          <rect x="40" y="60" width="80" height="5" rx="2" fill="#38bdf8" opacity="0.8" />
          <rect x="40" y="74" width="120" height="5" rx="2" fill="#94a3b8" opacity="0.4" />
          <rect x="55" y="88" width="90" height="5" rx="2" fill="#38bdf8" opacity="0.6" />
          <rect x="55" y="102" width="105" height="5" rx="2" fill="#94a3b8" opacity="0.4" />
          <rect x="40" y="116" width="60" height="5" rx="2" fill="#f43f5e" opacity="0.6" />
          <rect x="40" y="130" width="110" height="5" rx="2" fill="#38bdf8" opacity="0.5" />
          <rect x="40" y="144" width="70" height="5" rx="2" fill="#94a3b8" opacity="0.3" />

          {/* Graph Connection branches */}
          <path d="M 185 80 C 230 80, 240 60, 280 60" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M 185 110 C 230 110, 240 112, 280 112" fill="none" stroke="#0284c7" strokeWidth="1.5" />
          <path d="M 185 140 C 230 140, 240 165, 280 165" fill="none" stroke="#38bdf8" strokeWidth="1.5" />

          {/* Right AST Nodes */}
          <circle cx="280" cy="60" r="14" fill="#0d1117" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="280" cy="60" r="5" fill="#38bdf8" />
          <text x="305" y="64" fill="#94a3b8" fontSize="10" fontFamily="monospace">AST::CallGraph</text>

          <circle cx="280" cy="112" r="14" fill="#0d1117" stroke="#0284c7" strokeWidth="2" />
          <circle cx="280" cy="112" r="5" fill="#0284c7" />
          <text x="305" y="116" fill="#94a3b8" fontSize="10" fontFamily="monospace">Embed::Vector</text>

          <circle cx="280" cy="165" r="14" fill="#0d1117" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="280" cy="165" r="5" fill="#38bdf8" />
          <text x="305" y="169" fill="#94a3b8" fontSize="10" fontFamily="monospace">Token::Synth</text>
        </svg>
      )}

      {/* Style 2: Network Topology / Real-time Hackathon Hub */}
      {style === 'network' && (
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225">
          {/* Radial grid */}
          <circle cx="200" cy="112" r="90" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="200" cy="112" r="55" fill="none" stroke="#1e293b" strokeWidth="1" />
          <circle cx="200" cy="112" r="22" fill="#0d1117" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="200" cy="112" r="6" fill="#38bdf8" />

          {/* Connected Peripheral Nodes */}
          <g stroke="#38bdf8" strokeWidth="1.2" opacity="0.7">
            <line x1="200" y1="112" x2="110" y2="60" />
            <line x1="200" y1="112" x2="290" y2="60" />
            <line x1="200" y1="112" x2="80" y2="140" />
            <line x1="200" y1="112" x2="320" y2="140" />
            <line x1="200" y1="112" x2="200" y2="195" />
          </g>

          {/* Outer cluster pods */}
          <rect x="75" y="45" width="70" height="30" rx="6" fill="#0d1117" stroke="#38bdf8" strokeWidth="1" />
          <text x="85" y="64" fill="#e2e8f0" fontSize="9" fontFamily="monospace">Node: Go WS</text>

          <rect x="255" y="45" width="70" height="30" rx="6" fill="#0d1117" stroke="#38bdf8" strokeWidth="1" />
          <text x="265" y="64" fill="#e2e8f0" fontSize="9" fontFamily="monospace">Judge Rubric</text>

          <rect x="45" y="125" width="70" height="30" rx="6" fill="#0d1117" stroke="#0284c7" strokeWidth="1" />
          <text x="55" y="144" fill="#e2e8f0" fontSize="9" fontFamily="monospace">1.2k Active</text>

          <rect x="285" y="125" width="70" height="30" rx="6" fill="#0d1117" stroke="#0284c7" strokeWidth="1" />
          <text x="295" y="144" fill="#e2e8f0" fontSize="9" fontFamily="monospace">Postgres DB</text>

          <rect x="165" y="180" width="70" height="30" rx="6" fill="#0d1117" stroke="#38bdf8" strokeWidth="1" />
          <text x="175" y="199" fill="#e2e8f0" fontSize="9" fontFamily="monospace">gRPC Mesh</text>
        </svg>
      )}

      {/* Style 3: Terminal Low-Level / Rust Engine */}
      {style === 'terminal' && (
        <div className="w-full h-full p-4 font-mono text-[11px] leading-relaxed text-slate-300 flex flex-col justify-between bg-[#080b11]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block" />
              <span className="ml-2 text-slate-300 font-medium">hypervektor_simd.rs</span>
            </span>
            <span className="text-sky-400">AVX-512 · OPT-3</span>
          </div>
          <div className="space-y-1 text-slate-400 py-1 overflow-hidden">
            <p><span className="text-sky-400">pub fn</span> <span className="text-amber-300">compute_hnsw_distance</span>(a: &amp;[f32], b: &amp;[f32]) -&gt; f32 &#123;</p>
            <p className="pl-4 text-slate-500">// SIMD vectorized dot product with zero memory copy</p>
            <p className="pl-4"><span className="text-sky-400">let</span> v_simd = _mm512_loadu_ps(a.as_ptr());</p>
            <p className="pl-4 text-emerald-400">&gt;&gt; Indexing 1,000,000 vectors... [OK]</p>
            <p className="pl-4 text-slate-300">Throughput: <span className="text-sky-300 font-semibold tabular-nums">14,240 QPS</span> · Recall: <span className="text-emerald-300 tabular-nums">98.4%</span></p>
          </div>
          <div className="border-t border-slate-800/80 pt-1.5 flex items-center justify-between text-[10px] text-slate-500">
            <span>MEM: 384 MB</span>
            <span className="text-sky-400/90 font-medium">STATUS: RECALL_STABLE</span>
          </div>
        </div>
      )}

      {/* Style 4: Market Sentiment & Analytics */}
      {(style === 'analytics' || style === 'cyber') && (
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225">
          {/* Horizontal grid bands */}
          <line x1="40" y1="40" x2="360" y2="40" stroke="#1e293b" strokeWidth="1" />
          <line x1="40" y1="90" x2="360" y2="90" stroke="#1e293b" strokeWidth="1" />
          <line x1="40" y1="140" x2="360" y2="140" stroke="#1e293b" strokeWidth="1" />
          <line x1="40" y1="190" x2="360" y2="190" stroke="#1e293b" strokeWidth="1" />

          {/* Area waveform gradient */}
          <defs>
            <linearGradient id="area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Waveform path */}
          <path
            d="M 40 160 Q 90 120, 130 145 T 210 95 T 290 70 T 360 45 L 360 190 L 40 190 Z"
            fill="url(#area-grad)"
          />
          <path
            d="M 40 160 Q 90 120, 130 145 T 210 95 T 290 70 T 360 45"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
          />

          {/* Key inflection points */}
          <circle cx="130" cy="145" r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="210" cy="95" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="360" cy="45" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />

          <text x="50" y="32" fill="#94a3b8" fontSize="10" fontFamily="monospace">MACRO SENTIMENT INDEX</text>
          <text x="280" y="32" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">+92.4% SIGNAL</text>
        </svg>
      )}

      {/* Overlay hover badge */}
      <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-slate-700/80 text-[10px] font-mono text-sky-300">
        {category}
      </div>

      <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-slate-700/80 text-[11px] font-semibold text-slate-200">
        {title}
      </div>
    </div>
  );
};
