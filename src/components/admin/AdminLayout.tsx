import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { AdminOverview } from './AdminOverview';
import { AdminProfile } from './AdminProfile';
import { AdminProjects } from './AdminProjects';
import { AdminCertificates } from './AdminCertificates';
import { AdminMessages } from './AdminMessages';
import { AdminSettings } from './AdminSettings';
import { withAdminAuth } from './withAdminAuth';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Award,
  Mail,
  Settings,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  Database
} from 'lucide-react';
import { Button } from '../ui/Button';

type AdminTab = 'overview' | 'messages' | 'projects' | 'certificates' | 'profile' | 'settings';

const AdminLayoutBase: React.FC = () => {
  const {
    data,
    setActiveView,
    adminUser,
    signOutAdminSession,
    isFirestoreConnected,
    unreadMessagesCount,
    messages
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Clean management screens with Messages inbox
  const navItems: Array<{
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    highlightCount?: boolean;
  }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'messages',
      label: 'Messages',
      icon: Mail,
      count: unreadMessagesCount > 0 ? unreadMessagesCount : messages.length,
      highlightCount: unreadMessagesCount > 0,
    },
    { id: 'projects', label: 'Projects', icon: FolderGit2, count: data.projects.length },
    { id: 'certificates', label: 'Certificates', icon: Award, count: data.certificates.length },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview onNavigate={(tab) => setActiveTab(tab)} />;
      case 'messages':
        return <AdminMessages />;
      case 'profile':
        return <AdminProfile />;
      case 'projects':
        return <AdminProjects />;
      case 'certificates':
        return <AdminCertificates />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F5F5] flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#101012]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#F5F5F5]">Admin Console</span>
          <span className="text-xs text-[#929292]">/</span>
          <span className="text-xs font-mono text-[#668CFF] capitalize">{activeTab}</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-[#929292] hover:text-[#F5F5F5]"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Clean Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 border-r border-white/[0.08] bg-[#0E0E10] shrink-0 flex flex-col justify-between z-30`}
      >
        <div className="p-6 space-y-6">
          {/* Brand & Auth Status */}
          <div className="space-y-1">
            <h1 className="text-sm font-semibold tracking-tight text-[#F5F5F5]">
              Portfolio Admin
            </h1>
            <p className="text-xs text-[#929292] truncate">
              {adminUser?.displayName || 'Administrator'}
            </p>
          </div>

          {/* 5 Clean Navigation Screens */}
          <nav className="space-y-1 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#18181D] text-[#F5F5F5] border border-white/[0.08]'
                      : 'text-[#929292] hover:text-[#F5F5F5] hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#668CFF]' : 'text-[#929292]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        item.highlightCount
                          ? 'bg-[#668CFF]/20 text-[#668CFF] border border-[#668CFF]/30 font-semibold'
                          : 'text-[#929292] bg-white/[0.04]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/[0.08] space-y-3 bg-[#0B0B0C]">
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#929292]">
            <Database className="w-3 h-3 text-[#668CFF]" />
            <span className={isFirestoreConnected ? 'text-emerald-400' : 'text-amber-400'}>
              {isFirestoreConnected ? 'Firestore Active' : 'Connecting...'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              onClick={() => setActiveView('public')}
              className="text-[#929292] hover:text-[#F5F5F5] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public site</span>
            </button>

            <button
              onClick={signOutAdminSession}
              className="text-[#929292] hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Screen Content */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 max-w-5xl overflow-y-auto">
        {/* Top Breadcrumb bar on desktop */}
        <div className="hidden md:flex items-center justify-between pb-6 mb-8 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#929292]">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#668CFF] font-medium capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveView('public')}
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back to Portfolio</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={signOutAdminSession}
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Render Selected Screen */}
        {renderActiveScreen()}
      </main>
    </div>
  );
};

// Export wrapped with HOC for secure Firestore whitelist verification
export const AdminLayout = withAdminAuth(AdminLayoutBase);
