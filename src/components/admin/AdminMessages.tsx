import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ContactMessage } from '../../types/portfolio';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import {
  Mail,
  MailCheck,
  MailOpen,
  Trash2,
  Reply,
  Copy,
  Check,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  AlertCircle,
  Bell
} from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const {
    messages,
    unreadMessagesCount,
    markMessageAsRead,
    markMessageAsReplied,
    deleteMessage,
    isFirestoreConnected,
  } = usePortfolio();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [deleteConfirmMsg, setDeleteConfirmMsg] = useState<ContactMessage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Email Notification Server Status
  const [emailStatus, setEmailStatus] = useState<{
    configured: boolean;
    provider: string;
    targetEmail: string;
  } | null>(null);
  const [isCheckingEmailStatus, setIsCheckingEmailStatus] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsCheckingEmailStatus(true);
    fetch('/api/email-status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          setEmailStatus(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setEmailStatus({
            configured: false,
            provider: 'Resend',
            targetEmail: 'anm8789667614@gmail.com',
          });
        }
      })
      .finally(() => {
        if (isMounted) setIsCheckingEmailStatus(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReplyMailto = async (msg: ContactMessage) => {
    const subject = encodeURIComponent(`Re: Portfolio message from ${msg.name}`);
    const body = encodeURIComponent(
      `Hi ${msg.name},\n\nThank you for reaching out via my portfolio.\n\nIn response to your message:\n"${msg.message}"\n\nBest regards,\nAnmol Kumar\nComputer Science Engineering · Developer`
    );
    window.location.href = `mailto:${msg.email}?subject=${subject}&body=${body}`;

    // Automatically mark as replied
    if (!msg.replied) {
      await markMessageAsReplied(msg.id, true);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmMsg) return;
    await deleteMessage(deleteConfirmMsg.id);
    setDeleteConfirmMsg(null);
  };

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'unread') return !msg.read;
    if (filterTab === 'read') return msg.read;
    if (filterTab === 'replied') return msg.replied;
    return true;
  });

  const repliedCount = messages.filter((m) => m.replied).length;
  const readCount = messages.filter((m) => m.read).length;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-[#F5F5F5] tracking-tight">
              Messages & Inquiries
            </h2>
            {unreadMessagesCount > 0 ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#668CFF]/20 text-[#668CFF] border border-[#668CFF]/30 font-semibold animate-pulse">
                {unreadMessagesCount} Unread
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[#929292] border border-white/[0.08]">
                All Caught Up
              </span>
            )}
          </div>
          <p className="text-xs text-[#929292] mt-1">
            Private visitor submissions from your portfolio contact form. Persisted in Firestore and accessible only by you.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border ${
              isFirestoreConnected
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-950/40 text-amber-400 border-amber-500/20'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isFirestoreConnected ? 'Firestore Protected' : 'Local State'}</span>
          </span>
        </div>
      </div>

      {/* Email Notification Provider Status Card */}
      <div className="p-4 rounded-xl bg-[#121215] border border-white/[0.08] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#668CFF]" />
            <span className="font-semibold text-[#F5F5F5]">Server-side Email Notifications</span>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              emailStatus?.configured
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-950/40 text-amber-300 border-amber-500/20'
            }`}
          >
            {isCheckingEmailStatus
              ? 'Checking status...'
              : emailStatus?.configured
              ? 'Resend Active (Configured)'
              : 'Resend Setup Required'}
          </span>
        </div>
        <p className="text-xs text-[#929292] leading-relaxed">
          {emailStatus?.configured ? (
            <>
              Every incoming contact message triggers an automatic server notification to{' '}
              <span className="text-[#F5F5F5] font-mono">{emailStatus.targetEmail}</span> via Resend API.
            </>
          ) : (
            <>
              Messages are saved directly into the database. To also receive live email notifications upon form submission, add{' '}
              <code className="text-[#668CFF] font-mono text-[11px] bg-white/[0.04] px-1 py-0.5 rounded">
                RESEND_API_KEY
              </code>{' '}
              in your environment secrets.
            </>
          )}
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#121215] border border-white/[0.08] text-xs font-medium">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              filterTab === 'all'
                ? 'bg-white/[0.08] text-[#F5F5F5] font-semibold'
                : 'text-[#929292] hover:text-[#F5F5F5]'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilterTab('unread')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'unread'
                ? 'bg-white/[0.08] text-[#668CFF] font-semibold'
                : 'text-[#929292] hover:text-[#F5F5F5]'
            }`}
          >
            <span>Unread</span>
            {unreadMessagesCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#668CFF]" />
            )}
            <span className="text-[11px] font-mono">({unreadMessagesCount})</span>
          </button>
          <button
            onClick={() => setFilterTab('read')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              filterTab === 'read'
                ? 'bg-white/[0.08] text-[#F5F5F5] font-semibold'
                : 'text-[#929292] hover:text-[#F5F5F5]'
            }`}
          >
            Read ({readCount})
          </button>
          <button
            onClick={() => setFilterTab('replied')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              filterTab === 'replied'
                ? 'bg-white/[0.08] text-emerald-400 font-semibold'
                : 'text-[#929292] hover:text-[#F5F5F5]'
            }`}
          >
            Replied ({repliedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#929292]" />
          <input
            type="text"
            placeholder="Search by sender, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-3 py-1.5 text-xs rounded-lg bg-[#121215] border border-white/[0.08] text-[#F5F5F5] placeholder-[#929292] focus:outline-none focus:border-[#668CFF]"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-full border border-white/[0.1] bg-white/[0.02] flex items-center justify-center mx-auto text-[#929292]">
              <MailOpen className="w-5 h-5" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <p className="text-sm font-medium text-[#F5F5F5]">
                {messages.length === 0 ? 'No messages received yet' : 'No matching messages'}
              </p>
              <p className="text-xs text-[#929292] leading-relaxed">
                {messages.length === 0
                  ? 'When visitors submit the Contact form on your portfolio, their messages will appear here in real time.'
                  : 'Try adjusting your search query or switching to another filter tab.'}
              </p>
            </div>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const formattedDate = new Date(msg.createdAt).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            });

            return (
              <div
                key={msg.id}
                className={`p-6 rounded-xl border transition-all space-y-4 ${
                  !msg.read
                    ? 'bg-[#131418] border-[#668CFF]/30 shadow-sm shadow-[#668CFF]/5'
                    : 'bg-[#111114] border-white/[0.08] hover:border-white/[0.14]'
                }`}
              >
                {/* Message Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-semibold text-[#F5F5F5]">{msg.name}</h3>
                      {!msg.read ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#668CFF]/15 text-[#668CFF] border border-[#668CFF]/30">
                          Unread
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#929292] bg-white/[0.03] border border-white/[0.06]">
                          Read
                        </span>
                      )}

                      {msg.replied && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Replied</span>
                        </span>
                      )}
                    </div>

                    {/* Sender Email & Copy Action */}
                    <div className="flex items-center gap-2 text-xs text-[#929292]">
                      <a
                        href={`mailto:${msg.email}`}
                        className="hover:text-[#668CFF] transition-colors font-mono"
                        title="Click to write email"
                      >
                        {msg.email}
                      </a>
                      <button
                        onClick={() => handleCopyEmail(msg.email, msg.id)}
                        className="p-1 hover:text-[#F5F5F5] transition-colors rounded hover:bg-white/[0.04]"
                        title="Copy email address"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submission Timestamp */}
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#929292] shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-4 rounded-lg bg-[#0C0C0E] border border-white/[0.05] text-sm text-[#F5F5F5]/90 whitespace-pre-wrap leading-relaxed select-text font-sans">
                  {msg.message}
                </div>

                {/* Card Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06] text-xs">
                  <div className="flex items-center gap-2">
                    {/* Reply via email button */}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleReplyMailto(msg)}
                      className="inline-flex items-center gap-1.5"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </Button>

                    {/* Toggle Read/Unread */}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => markMessageAsRead(msg.id, !msg.read)}
                    >
                      {msg.read ? (
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#929292]" />
                          <span>Mark Unread</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <MailCheck className="w-3.5 h-3.5 text-[#668CFF]" />
                          <span>Mark Read</span>
                        </span>
                      )}
                    </Button>

                    {/* Toggle Replied */}
                    <button
                      onClick={() => markMessageAsReplied(msg.id, !msg.replied)}
                      className="px-2.5 py-1.5 rounded-md border border-white/[0.08] hover:border-white/[0.18] text-[#929292] hover:text-[#F5F5F5] transition-colors cursor-pointer text-xs"
                      title={msg.replied ? 'Mark as not replied' : 'Mark as replied'}
                    >
                      {msg.replied ? 'Unmark Replied' : 'Mark Replied'}
                    </button>
                  </div>

                  {/* Delete button with confirmation */}
                  <button
                    onClick={() => setDeleteConfirmMsg(msg)}
                    className="p-1.5 text-[#929292] hover:text-red-400 transition-colors rounded hover:bg-red-500/10 cursor-pointer"
                    title="Delete message"
                    aria-label="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmMsg)}
        onClose={() => setDeleteConfirmMsg(null)}
        title="Delete Contact Message"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#929292] leading-relaxed">
            Are you sure you want to permanently delete this message from{' '}
            <span className="font-semibold text-[#F5F5F5]">{deleteConfirmMsg?.name}</span> (
            <span className="text-[#668CFF] font-mono text-xs">{deleteConfirmMsg?.email}</span>)?
          </p>

          <p className="text-xs text-red-400 bg-red-950/30 p-3 rounded border border-red-500/20">
            This action cannot be undone. The message will be permanently removed from your database.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteConfirmMsg(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
            >
              Delete Message
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
