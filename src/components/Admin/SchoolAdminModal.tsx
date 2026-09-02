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
  BarChart,
  ShieldAlert,
  Edit,
  Globe,
  MapPin
} from 'lucide-react';

export const SchoolAdminModal: React.FC = () => {
  const {
    closeModal,
    activeSchool,
    createPost,
    currentUser,
    clubs,
    showToast,
    isSchoolAuthorized,
    schoolStaff,
    assignSchoolStaff,
    removeSchoolStaff,
    allUsers,
    updateSchool
  } = useApp();

  const [activeTab, setActiveTab] = useState<'broadcast' | 'staff' | 'profile'>('broadcast');
  const [announcementText, setAnnouncementText] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');

  // Edit School Profile states
  const [motto, setMotto] = useState(activeSchool.motto || '');
  const [location, setLocation] = useState(activeSchool.location || '');
  const [website, setWebsite] = useState(activeSchool.website || '');
  const [description, setDescription] = useState(activeSchool.description || '');

  // Add staff member state
  const [newStaffUserId, setNewStaffUserId] = useState(allUsers[0]?.id || '');
  const [newStaffTitle, setNewStaffTitle] = useState('Faculty Coordinator');

  // Permission check
  const isAuthorized = isSchoolAuthorized(activeSchool.id);

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center border border-neutral-200 shadow-2xl animate-in fade-in zoom-in-95">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-neutral-900 mb-1">School Authorization Required</h3>
          <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
            You do not have administrative clearance for <strong>{activeSchool.name}</strong>. Only Super Administrators or authorized staff members assigned to this campus can manage official announcements and settings.
          </p>
          <button
            onClick={closeModal}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Close Portal
          </button>
        </div>
      </div>
    );
  }

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    createPost({
      authorId: currentUser.id,
      authorName: activeSchool.name,
      authorUsername: activeSchool.username,
      authorAvatar: activeSchool.logo,
      authorSchool: activeSchool.name,
      authorRole: currentUser.role,
      type: 'text',
      text: `${priority === 'urgent' ? '🚨 [URGENT NOTICE] ' : '📢 [OFFICIAL ANNOUNCEMENT] '} ${announcementText.trim()}`,
      isOfficialAnnouncement: true,
      allowDownloads: true,
      tags: ['OfficialAnnouncement', activeSchool.username, 'SchoolNotice'],
      schoolId: activeSchool.id
    });

    showToast('Official School Announcement broadcasted successfully!', 'success');
    setAnnouncementText('');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchool({
      ...activeSchool,
      motto: motto.trim(),
      location: location.trim(),
      website: website.trim(),
      description: description.trim()
    });
    showToast('School profile details updated successfully!', 'success');
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffUserId) return;
    assignSchoolStaff(
      activeSchool.id,
      newStaffUserId,
      ['post_announcements', 'edit_profile', 'manage_events'],
      newStaffTitle
    );
    showToast('Staff member authorized to manage this school page!', 'success');
  };

  const currentSchoolStaff = schoolStaff.filter((s) => s.schoolId === activeSchool.id);
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
              <h3 className="font-extrabold text-sm leading-tight">Campus Management Portal</h3>
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

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 text-xs">
          {[
            { id: 'broadcast', label: 'Broadcast Announcements' },
            { id: 'staff', label: `Staff Permissions (${currentSchoolStaff.length})` },
            { id: 'profile', label: 'School Page Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 font-bold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700 bg-white shadow-2xs'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Tab 1: Broadcast */}
          {activeTab === 'broadcast' && (
            <div className="space-y-5">
              {/* Metrics */}
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
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Clubs Active</span>
                  <p className="text-lg font-black text-emerald-600 mt-0.5">
                    {schoolClubs.length}
                  </p>
                </div>
              </div>

              {/* Broadcast Form */}
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-extrabold text-blue-900">
                    <Megaphone className="w-4 h-4 text-blue-600" />
                    <span>Broadcast Official Campus Notice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-semibold text-neutral-600">Urgency:</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="bg-white border border-neutral-200 rounded-lg px-2 py-0.5 text-[11px] font-bold"
                    >
                      <option value="normal">Standard Notice</option>
                      <option value="urgent">🚨 Urgent / High Priority</option>
                    </select>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="Type an announcement regarding exams, campus events, timetable updates, or notices..."
                  className="w-full p-3 bg-white rounded-xl border border-blue-200 outline-none focus:ring-1 focus:ring-blue-500 resize-none text-xs"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handlePublishAnnouncement}
                    disabled={!announcementText.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span>Broadcast to Campus</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Staff Permissions */}
          {activeTab === 'staff' && (
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                <h4 className="font-extrabold text-neutral-900 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Assign New Campus Staff Member</span>
                </h4>
                <p className="text-neutral-500 text-[11px]">
                  Authorize students, teachers, or administrators to post announcements and manage {activeSchool.name}.
                </p>

                <form onSubmit={handleAddStaff} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Select Member</label>
                    <select
                      value={newStaffUserId}
                      onChange={(e) => setNewStaffUserId(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-xl outline-none text-xs font-semibold"
                    >
                      {allUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} (@{u.username})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Role Title</label>
                    <input
                      type="text"
                      value={newStaffTitle}
                      onChange={(e) => setNewStaffTitle(e.target.value)}
                      placeholder="e.g. Faculty Patron, Head Boy/Girl"
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-xl outline-none text-xs"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Authorize</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* List of current authorized staff */}
              <div>
                <h4 className="font-extrabold text-neutral-900 mb-2">
                  Authorized School Managers ({currentSchoolStaff.length})
                </h4>
                {currentSchoolStaff.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic">No specific staff delegated yet. Only Super Admins have default control.</p>
                ) : (
                  <div className="space-y-2">
                    {currentSchoolStaff.map((st) => {
                      const user = allUsers.find((u) => u.id === st.userId);
                      return (
                        <div
                          key={st.id}
                          className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                              {user?.name.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-neutral-900">
                                {user?.name || `User #${st.userId}`}
                              </p>
                              <p className="text-[10px] text-neutral-500">
                                {st.title || 'Staff Manager'} • Permissions: {st.permissions.join(', ')}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => removeSchoolStaff(st.id)}
                            className="text-rose-600 hover:text-rose-700 font-bold text-xs p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: School Profile Settings */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-3.5">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Motto / Slogan</label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Campus Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Official Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">School Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
