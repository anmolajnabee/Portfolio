import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { User, FolderGit2, Award, ExternalLink, Settings, ArrowUpRight, Mail } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminOverviewProps {
  onNavigate: (tab: 'overview' | 'messages' | 'projects' | 'certificates' | 'profile' | 'settings') => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigate }) => {
  const { data, setActiveView, isFirestoreConnected, messages, unreadMessagesCount } = usePortfolio();
  const { profile, projects, certificates, skillCategories } = data;

  const publishedProjects = projects.filter((p) => p.published !== false).length;
  const publishedCerts = certificates.filter((c) => c.published !== false).length;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5] tracking-tight">Overview</h2>
          <p className="text-xs text-[#929292] mt-1">
            Status and content summary for your portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveView('public')}
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#929292]" />
          </Button>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="p-4 rounded-lg bg-[#121215] border border-white/[0.08] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isFirestoreConnected ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span className="text-[#F5F5F5] font-medium">
            {isFirestoreConnected
              ? 'Cloud Firestore Connected'
              : 'Connecting to Cloud Firestore...'}
          </span>
          <span className="text-[#929292]">· Changes sync in real-time</span>
        </div>
        <button
          onClick={() => onNavigate('settings')}
          className="text-[#668CFF] hover:underline"
        >
          Database Settings &rarr;
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Messages Card */}
        <div className="p-5 rounded-lg bg-[#121215] border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#929292] uppercase">Inbox</span>
            <Mail className="w-4 h-4 text-[#668CFF]" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-[#F5F5F5]">{messages.length}</p>
              {unreadMessagesCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#668CFF]/20 text-[#668CFF] font-semibold border border-[#668CFF]/30">
                  {unreadMessagesCount} unread
                </span>
              )}
            </div>
            <p className="text-xs text-[#929292] mt-0.5">
              {unreadMessagesCount > 0 ? `${unreadMessagesCount} pending response` : 'All inquiries reviewed'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('messages')}
            className="text-xs text-[#668CFF] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
          >
            <span>Open inbox</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Projects Card */}
        <div className="p-5 rounded-lg bg-[#121215] border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#929292] uppercase">Projects</span>
            <FolderGit2 className="w-4 h-4 text-[#668CFF]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#F5F5F5]">{projects.length}</p>
            <p className="text-xs text-[#929292] mt-0.5">
              {publishedProjects} published to live portfolio
            </p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs text-[#668CFF] hover:underline flex items-center gap-1 pt-1"
          >
            <span>Manage projects</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Certificates Card */}
        <div className="p-5 rounded-lg bg-[#121215] border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#929292] uppercase">Certificates</span>
            <Award className="w-4 h-4 text-[#668CFF]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#F5F5F5]">{certificates.length}</p>
            <p className="text-xs text-[#929292] mt-0.5">
              {publishedCerts} published
            </p>
          </div>
          <button
            onClick={() => onNavigate('certificates')}
            className="text-xs text-[#668CFF] hover:underline flex items-center gap-1 pt-1"
          >
            <span>Manage certificates</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-5 rounded-lg bg-[#121215] border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#929292] uppercase">Profile</span>
            <User className="w-4 h-4 text-[#668CFF]" />
          </div>
          <div>
            <p className="text-base font-semibold text-[#F5F5F5] truncate">
              {profile.fullName || 'Admin'}
            </p>
            <p className="text-xs text-[#929292] truncate mt-0.5">
              {profile.title || 'Role configured'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="text-xs text-[#668CFF] hover:underline flex items-center gap-1 pt-1"
          >
            <span>Edit narrative</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Quick Navigation Rows */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase text-[#929292] tracking-wider">
          Management Screens
        </h3>
        <div className="divide-y divide-white/[0.08] border border-white/[0.08] rounded-lg bg-[#121215]">
          <button
            onClick={() => onNavigate('messages')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#668CFF]" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#F5F5F5]">Inbox & Messages</p>
                  {unreadMessagesCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#668CFF]/20 text-[#668CFF] font-semibold border border-[#668CFF]/30">
                      {unreadMessagesCount} unread
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#929292]">Review visitor contact form submissions, reply via email, and manage inquiries</p>
              </div>
            </div>
            <span className="text-xs text-[#929292]">&rarr;</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-[#929292]" />
              <div>
                <p className="text-sm font-medium text-[#F5F5F5]">Profile & Narrative</p>
                <p className="text-xs text-[#929292]">Update name, role, two-line introduction, and education</p>
              </div>
            </div>
            <span className="text-xs text-[#929292]">&rarr;</span>
          </button>

          <button
            onClick={() => onNavigate('projects')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <FolderGit2 className="w-4 h-4 text-[#929292]" />
              <div>
                <p className="text-sm font-medium text-[#F5F5F5]">Projects</p>
                <p className="text-xs text-[#929292]">Add, edit, remove, and publish selected work</p>
              </div>
            </div>
            <span className="text-xs text-[#929292]">&rarr;</span>
          </button>

          <button
            onClick={() => onNavigate('certificates')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-[#929292]" />
              <div>
                <p className="text-sm font-medium text-[#F5F5F5]">Certificates & Honors</p>
                <p className="text-xs text-[#929292]">Manage credentials and hackathon accolades</p>
              </div>
            </div>
            <span className="text-xs text-[#929292]">&rarr;</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-[#929292]" />
              <div>
                <p className="text-sm font-medium text-[#F5F5F5]">Settings & Images</p>
                <p className="text-xs text-[#929292]">Manage images, database synchronization, and backup JSON</p>
              </div>
            </div>
            <span className="text-xs text-[#929292]">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
