import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Shield,
  Megaphone,
  Users,
  CheckCircle,
  Building2,
  Send,
  Plus,
  BarChart
} from 'lucide-react';

export const SchoolAdminModal: React.FC = () => {
  const { closeModal, activeSchool, createPost, currentUser, clubs, showToast } = useApp();

  const [announcementText, setAnnouncementText] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    createPost({
      authorId: currentUser.id,
      authorName: activeSchool.name,
      authorUsername: activeSchool.username,
      authorAvatar: activeSchool.logo,
      authorSchool: activeSchool.name,
      authorRole: 'school_admin',
      type: 'text',
      text: `${priority === 'urgent' ? '🚨 [URGENT NOTICE] ' : '📢 [OFFICIAL ANNOUNCEMENT] '} ${announcementText.trim()}`,
      isOfficialAnnouncement: true,
      allowDownloads: true,
      tags: ['OfficialAnnouncement', activeSchool.username, 'SchoolNotice'],
      schoolId: activeSchool.id
    });

    showToast('Official School Announcement published to school and global campus feeds!', 'success');
    setAnnouncementText('');
  };

  const schoolClubs = clubs.filter((c) => c.schoolId === activeSchool.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 px-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm leading-tight">School Administration Portal</h3>
              <p className="text-[11px] text-blue-200">
                {activeSchool.name} • Official Control Center
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* School Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Total Followers</span>
              <p className="text-lg font-black text-neutral-900 mt-0.5">
                {activeSchool.followersCount.toLocaleString()}
              </p>
            </div>
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Enrolled Students</span>
              <p className="text-lg font-black text-blue-600 mt-0.5">
                {activeSchool.studentCount.toLocaleString()}
              </p>
            </div>
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Engagement Score</span>
              <p className="text-lg font-black text-emerald-600 mt-0.5">
                {activeSchool.rankings.popularityScore}%
              </p>
            </div>
          </div>

          {/* Broadcast Official Announcement */}
          <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-blue-900">
                <Megaphone className="w-4 h-4 text-blue-600" />
                <span>Broadcast Official School Announcement</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-semibold text-neutral-600">Urgency:</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="bg-white border border-neutral-200 rounded-lg px-2 py-0.5 text-[11px] font-bold"
                >
                  <option value="normal">Normal Announcement</option>
                  <option value="urgent">🚨 Urgent / High Priority</option>
                </select>
              </div>
            </div>

            <textarea
              rows={3}
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="Type announcement regarding examinations, sports day, school fees, or holidays..."
              className="w-full p-3 bg-white rounded-xl border border-blue-200 outline-none focus:ring-1 focus:ring-blue-500 resize-none text-xs"
            />

            <div className="flex justify-end">
              <button
                onClick={handlePublishAnnouncement}
                disabled={!announcementText.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Broadcast Notice</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* School Clubs Management */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-extrabold text-neutral-900">Official Campus Clubs ({schoolClubs.length})</h4>
            </div>

            <div className="space-y-2">
              {schoolClubs.map((club) => (
                <div
                  key={club.id}
                  className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={club.coverImage}
                      alt={club.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-bold text-neutral-900">{club.name}</p>
                      <p className="text-[10px] text-neutral-500">
                        {club.membersCount} members • Patron: {club.leadTeacherOrAdmin || 'Head of Department'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Approved
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
