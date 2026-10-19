import React, { useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { ProjectsSection } from './components/public/ProjectsSection';
import { About } from './components/public/About';
import { CertificatesSection } from './components/public/CertificatesSection';
import { ContactSection } from './components/public/ContactSection';
import { Footer } from './components/public/Footer';
import { AdminLayout } from './components/admin/AdminLayout';

const PortfolioContent: React.FC = () => {
  const { activeView, setActiveView } = usePortfolio();

  // Sync hash routing if user visits #admin directly or navigates back
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setActiveView('admin');
      } else if (window.location.hash === '' || window.location.hash === '#') {
        setActiveView('public');
      }
    };

    if (window.location.hash === '#admin') {
      setActiveView('admin');
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setActiveView]);

  if (activeView === 'admin') {
    return <AdminLayout />;
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F5F5] antialiased">
      <Navbar />
      <main>
        {/* Exactly: Hero → Projects → About → Certificates → Contact */}
        <Hero />
        <ProjectsSection />
        <About />
        <CertificatesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioContent />
    </PortfolioProvider>
  );
}
