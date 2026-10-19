import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { data, setActiveView } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#0B0B0C] py-12 text-xs text-[#929292]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Attribution & Copyright */}
        <p className="text-center sm:text-left">
          &copy; {new Date().getFullYear()} {data.profile.fullName || 'Anmol Kumar'}. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex items-center gap-6">
          <button
            onClick={scrollToTop}
            className="hover:text-[#F5F5F5] transition-colors cursor-pointer"
          >
            Back to top &uarr;
          </button>
          <button
            onClick={() => setActiveView('admin')}
            className="hover:text-[#668CFF] transition-colors cursor-pointer"
          >
            Admin
          </button>
        </div>
      </div>
    </footer>
  );
};
