import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { data, setActiveView } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#top' },
    { label: 'Projects', href: '#projects' },
    { label: 'About', href: '#about' },
    { label: 'Certificates', href: '#certificates' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0C]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-6 sm:px-8 h-16">
        {/* Name Wordmark */}
        <a
          href="#top"
          className="text-sm font-semibold tracking-tight text-[#F5F5F5] hover:text-white transition-colors"
        >
          {data.profile.fullName || 'Anmol Kumar'}
        </a>

        {/* Minimal Navigation: Home, Projects, About, Contact */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#929292]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#F5F5F5] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side: Subtle Admin link */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => setActiveView('admin')}
            className="text-xs text-[#929292] hover:text-[#668CFF] transition-colors cursor-pointer"
          >
            Admin
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-[#929292] hover:text-[#F5F5F5]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#0E0E10] px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#929292] hover:text-[#F5F5F5] py-1"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-white/[0.08]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveView('admin');
              }}
              className="block text-xs text-[#668CFF] py-1"
            >
              Admin Dashboard &rarr;
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
