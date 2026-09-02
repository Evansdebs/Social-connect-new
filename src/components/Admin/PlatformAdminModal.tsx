import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  Building2,
  Users,
  AlertTriangle,
  Check,
  Trash2,
  ShieldAlert,
  Search
} from 'lucide-react';

export const PlatformAdminModal: React.FC = () => {
  const {
    closeModal,
    reports,
    dismissReport,
    schools,
    users,
    posts,
    deletePost,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reports' | 'schools' | 'stats'>('reports');

  const handleTakeDownContent = (reportId: string, targetType: string, targetId: string) => {
    if (targetType === 'post') {
      deletePost(targetId);
    }
    dismissReport(reportId);
    showToast('Content removed and violation action logged.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 px-6 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm leading-tight">Platform Safety & Moderation Console</h3>
              <p className="text-[11px] text-neutral-400">
                Campus Connect Super Administrator Authority
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 text-xs">
          {[
            { id: 'reports', label: `Flagged Reports (${reports.filter((r) => r.status === 'pending').length})` },
            { id: 'schools', label: `Verified Schools (${schools.length})` },
            { id: 'stats', label: 'Platform Health Metrics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 font-bold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-neutral-900 text-neutral-900 bg-white'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Tab 1: Moderation Queue */}
          {activeTab === 'reports' && (
            <div className="space-y-3">
              <p className="text-neutral-600">
                Review submitted student reports for bullying, harassment, inappropriate content, or school impersonation.
              </p>

              {reports.filter((r) => r.status === 'pending').length === 0 ? (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800">
                  <Check className="w-8 h-8 mx-auto mb-1 text-emerald-600" />
                  <p className="font-bold text-sm">Clean Moderation Queue</p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    No pending safety reports from students or faculty.
                  </p>
                </div>
              ) : (
                reports
                  .filter((r) => r.status === 'pending')
                  .map((rep) => (
                    <div
                      key={rep.id}
                      className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
                            {rep.reason}
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            Target: {rep.targetType} #{rep.targetId}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-700">
                          <strong>Note:</strong> {rep.details || 'No additional comment provided by reporter.'}
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-1">
                          Reported by User #{rep.reporterId} on {rep.createdAt}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => dismissReport(rep.id)}
                          className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold rounded-xl"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() =>
                            handleTakeDownContent(rep.id, rep.targetType, rep.targetId)
                          }
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-1 shadow-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Content</span>
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}

          {/* Tab 2: Schools */}
          {activeTab === 'schools' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {schools.map((school) => (
                  <div
                    key={school.id}
                    className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={school.logo}
                        alt={school.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-neutral-900 truncate">{school.name}</p>
                        <p className="text-[10px] text-neutral-500 truncate">
                          @{school.username} • {school.location}
                        </p>
                        <p className="text-[10px] text-blue-600 font-semibold">
                          {school.studentCount} verified students
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                      Verified ✓
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: System Analytics */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Total Users</span>
                <p className="text-xl font-black text-neutral-900 mt-1">{users.length + 120}</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Member Schools</span>
                <p className="text-xl font-black text-blue-600 mt-1">{schools.length}</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Published Posts</span>
                <p className="text-xl font-black text-indigo-600 mt-1">{posts.length}</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Total Reports</span>
                <p className="text-xl font-black text-amber-600 mt-1">{reports.length}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
