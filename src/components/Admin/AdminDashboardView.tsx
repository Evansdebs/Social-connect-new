import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Building2,
  Users,
  AlertTriangle,
  CheckCircle,
  Trash2,
  ShieldAlert,
  Search,
  UserCheck,
  UserX,
  Plus,
  Shield,
  BadgeCheck,
  Sparkles,
  Megaphone,
  BarChart3,
  History,
  Radio,
  FileText,
  ExternalLink,
  ChevronRight,
  Filter,
  Send,
  Eye,
  RefreshCw,
  Award,
  Lock,
  Download,
  Check,
  X
} from 'lucide-react';
import { UserRole, UserType, School } from '../../types';

export const AdminDashboardView: React.FC = () => {
  const {
    currentUser,
    users,
    schools,
    posts,
    reels,
    events,
    clubs,
    reports,
    dismissReport,
    resolveReport,
    deletePost,
    deleteReel,
    updateUserStatus,
    updateUserRole,
    toggleUserVerification,
    deleteUserAccount,
    addSchool,
    updateSchool,
    deleteSchool,
    schoolStaff,
    assignSchoolStaff,
    removeSchoolStaff,
    auditLogs,
    addAuditLog,
    clearAuditLogs,
    createPost,
    switchUser,
    showToast,
    isSuperAdmin,
    setActiveTab
  } = useApp();

  const [currentTab, setCurrentTab] = useState<
    'overview' | 'users' | 'moderation' | 'campuses' | 'broadcasts' | 'audit'
  >('overview');

  // User search & filters
  const [userSearch, setUserSearch] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | UserType | 'super_admin' | 'suspended'>('all');

  // School search
  const [schoolSearch, setSchoolSearch] = useState('');

  // Moderation filter
  const [reportFilter, setReportFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('pending');

  // New school form state
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolMotto, setNewSchoolMotto] = useState('');
  const [newSchoolLocation, setNewSchoolLocation] = useState('');
  const [newSchoolWebsite, setNewSchoolWebsite] = useState('');
  const [newSchoolStudents, setNewSchoolStudents] = useState('1200');

  // Edit school state
  const [editingSchool, setEditingSchool] = useState<School | null>(null);

  // Staff assignment state
  const [staffSchoolId, setStaffSchoolId] = useState<string>(schools[0]?.id || '');
  const [staffUserId, setStaffUserId] = useState<string>(users[0]?.id || '');
  const [staffTitle, setStaffTitle] = useState('Campus Staff Manager');

  // Broadcast announcement state
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastPriority, setBroadcastPriority] = useState<'normal' | 'priority' | 'urgent'>('normal');
  const [broadcastTargetSchool, setBroadcastTargetSchool] = useState<'all' | string>('all');

  // If user is not super_admin, display access denied banner
  if (!isSuperAdmin) {
    return (
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-10 text-center shadow-xs">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-neutral-900 tracking-tight mb-2">
          Super Admin Authorization Required
        </h2>
        <p className="text-xs text-neutral-500 max-w-md mx-auto mb-6 leading-relaxed">
          The Central Governance Console is restricted to authorized platform administrators. You are currently logged in as{' '}
          <strong>{currentUser.name}</strong> (@{currentUser.username} • {currentUser.role}).
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
        >
          Return to Home Feed
        </button>
      </div>
    );
  }

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.schoolName && u.schoolName.toLowerCase().includes(userSearch.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase()));

      let matchesFilter = true;
      if (userTypeFilter === 'super_admin') {
        matchesFilter = u.role === 'super_admin';
      } else if (userTypeFilter === 'suspended') {
        matchesFilter = u.accountStatus === 'suspended';
      } else if (userTypeFilter !== 'all') {
        matchesFilter = u.userType === userTypeFilter;
      }

      return matchesSearch && matchesFilter;
    });
  }, [users, userSearch, userTypeFilter]);

  // Filtered schools
  const filteredSchools = useMemo(() => {
    return schools.filter(
      (s) =>
        s.name.toLowerCase().includes(schoolSearch.toLowerCase()) ||
        s.location.toLowerCase().includes(schoolSearch.toLowerCase()) ||
        s.motto.toLowerCase().includes(schoolSearch.toLowerCase())
    );
  }, [schools, schoolSearch]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (reportFilter === 'all') return true;
      return r.status === reportFilter;
    });
  }, [reports, reportFilter]);

  // Pending reports count
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  // Handle register new school
  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName.trim()) {
      showToast('Please specify the campus name', 'error');
      return;
    }
    const cleanUsername = newSchoolName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newSchoolObj: School = {
      id: `school-${Date.now()}`,
      name: newSchoolName.trim(),
      username: cleanUsername,
      logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanUsername}`,
      coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
      description: `Official campus hub for ${newSchoolName.trim()}.`,
      location: newSchoolLocation.trim() || 'Main Campus',
      region: 'National',
      website: newSchoolWebsite.trim() ? (newSchoolWebsite.startsWith('http') ? newSchoolWebsite : `https://${newSchoolWebsite}`) : 'https://campusconnect.edu',
      isVerified: true,
      followersCount: 1,
      studentCount: parseInt(newSchoolStudents) || 500,
      motto: newSchoolMotto.trim() || 'Excellence, Truth & Knowledge',
      established: new Date().getFullYear(),
      rankings: {
        activeRank: schools.length + 1,
        challengeWins: 0,
        popularityScore: 85
      }
    };

    addSchool(newSchoolObj);
    setShowAddSchool(false);
    setNewSchoolName('');
    setNewSchoolMotto('');
    setNewSchoolLocation('');
    setNewSchoolWebsite('');
  };

  // Handle take down content
  const handleTakeDownContent = (report: (typeof reports)[0]) => {
    if (report.targetType === 'post') {
      deletePost(report.targetId);
    } else if (report.targetType === 'reel') {
      deleteReel(report.targetId);
    }
    resolveReport(report.id, 'resolved');
    addAuditLog('Content Removed', `${report.targetType} #${report.targetId}`, `Reason: ${report.reason}`);
    showToast(`Violating ${report.targetType} removed and report marked as resolved.`, 'success');
  };

  // Handle delegated staff assignment
  const handleAssignStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffSchoolId || !staffUserId) {
      showToast('Please select both a campus and user', 'error');
      return;
    }
    assignSchoolStaff(staffSchoolId, staffUserId, {
      manageSchoolProfile: true,
      createSchoolPosts: true,
      manageSchoolEvents: true
    }, staffTitle);
  };

  // Handle Super Admin broadcast announcement
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) {
      showToast('Please enter announcement text', 'info');
      return;
    }

    const targetSchool = broadcastTargetSchool === 'all'
      ? null
      : schools.find((s) => s.id === broadcastTargetSchool);

    const urgencyPrefix =
      broadcastPriority === 'urgent'
        ? '🚨 [CRITICAL ALERT] '
        : broadcastPriority === 'priority'
        ? '⚡ [HIGH PRIORITY] '
        : '📢 [OFFICIAL PLATFORM NOTICE] ';

    createPost({
      authorId: currentUser.id,
      authorName: targetSchool ? targetSchool.name : 'Campus Connect Central Administration',
      authorUsername: targetSchool ? targetSchool.username : 'platform_admin',
      authorAvatar: targetSchool ? targetSchool.logo : currentUser.avatar,
      authorSchool: targetSchool ? targetSchool.name : 'Campus Connect Network',
      authorRole: 'super_admin',
      type: 'announcement',
      text: `${urgencyPrefix}${broadcastText.trim()}`,
      isOfficialAnnouncement: true,
      allowDownloads: true,
      tags: ['PlatformNotice', 'Official', 'CampusAlert'],
      schoolId: targetSchool ? targetSchool.id : undefined
    });

    addAuditLog('Broadcast Sent', targetSchool ? targetSchool.name : 'All Campuses', broadcastText.trim().substring(0, 50));
    setBroadcastText('');
    showToast('Platform announcement broadcasted to all student feeds!', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Top Super Admin Executive Header */}
      <div className="bg-gradient-to-r from-neutral-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-neutral-800 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-60 h-60 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Super Admin Command Center
                </h1>
                <span className="bg-blue-500/25 border border-blue-400/40 text-blue-300 text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wider">
                  TIER 1 ACCESS
                </span>
                <span className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live System
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Central Campus Governance, User Moderation & Inter-School Oversight
              </p>
            </div>
          </div>

          {/* Quick Admin Impersonation / Profile Switcher */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 self-start md:self-auto">
            <span className="text-[11px] font-semibold text-slate-300 shrink-0">Test As:</span>
            <select
              value={currentUser.id}
              onChange={(e) => switchUser(e.target.value)}
              className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id} className="bg-neutral-900 text-white">
                  {u.name} ({u.role === 'super_admin' ? 'SUPER_ADMIN' : u.userType || 'user'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Real-time KPI Metric Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              Total Users
            </span>
            <p className="text-2xl font-black text-white mt-1">{users.length}</p>
            <span className="text-[10px] text-slate-400">
              {users.filter((u) => u.userType === 'student').length} Students • {users.filter((u) => u.userType === 'teacher').length} Teachers
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              Campuses
            </span>
            <p className="text-2xl font-black text-white mt-1">{schools.length}</p>
            <span className="text-[10px] text-indigo-300">
              {schoolStaff.length} Delegated Staff
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Moderation Queue
            </span>
            <p className="text-2xl font-black text-amber-400 mt-1">{pendingReportsCount}</p>
            <span className="text-[10px] text-slate-400">
              {reports.length - pendingReportsCount} Resolved
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              Live Posts
            </span>
            <p className="text-2xl font-black text-white mt-1">{posts.length}</p>
            <span className="text-[10px] text-emerald-400">
              {reels.length} Reels • {events.length} Events
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-1.5 shadow-xs flex items-center gap-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
          { id: 'users', label: `User Directory (${users.length})`, icon: Users },
          { id: 'moderation', label: `Moderation Queue (${pendingReportsCount})`, icon: AlertTriangle, badge: pendingReportsCount > 0 ? String(pendingReportsCount) : undefined },
          { id: 'campuses', label: `Schools & Staff (${schools.length})`, icon: Building2 },
          { id: 'broadcasts', label: 'Campus Broadcasts', icon: Megaphone },
          { id: 'audit', label: `Audit Log (${auditLogs.length})`, icon: History }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] rounded-full font-black">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {currentTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Quick Actions Panel */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs space-y-4">
            <h2 className="text-base font-black text-neutral-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Administrative Quick Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setCurrentTab('campuses');
                  setShowAddSchool(true);
                }}
                className="p-3.5 rounded-2xl border border-neutral-200 hover:border-blue-400 bg-neutral-50 hover:bg-blue-50/50 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-neutral-900">Register New School</h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Add an accredited high school, college, or university to the network.
                </p>
              </button>

              <button
                onClick={() => setCurrentTab('broadcasts')}
                className="p-3.5 rounded-2xl border border-neutral-200 hover:border-purple-400 bg-neutral-50 hover:bg-purple-50/50 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Megaphone className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-neutral-900">Publish Official Broadcast</h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Send high-priority system announcements to all students & feeds.
                </p>
              </button>

              <button
                onClick={() => setCurrentTab('moderation')}
                className="p-3.5 rounded-2xl border border-neutral-200 hover:border-amber-400 bg-neutral-50 hover:bg-amber-50/50 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-neutral-900">Review Safety Queue</h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  {pendingReportsCount} reports requiring moderation review.
                </p>
              </button>

              <button
                onClick={() => setCurrentTab('users')}
                className="p-3.5 rounded-2xl border border-neutral-200 hover:border-emerald-400 bg-neutral-50 hover:bg-emerald-50/50 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-neutral-900">Verify Accounts & Badges</h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Issue official checkmarks to student councils and faculty.
                </p>
              </button>
            </div>

            {/* School Enrollment Breakdown */}
            <div className="pt-3 border-t border-neutral-100">
              <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider mb-2">
                Top Campuses by Network Presence
              </h3>
              <div className="space-y-2">
                {schools.slice(0, 3).map((school, i) => (
                  <div
                    key={school.id}
                    className="p-3 bg-neutral-50 rounded-2xl flex items-center justify-between border border-neutral-200/70"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-neutral-200 font-black text-[11px] flex items-center justify-center text-neutral-700 shrink-0">
                        {i + 1}
                      </span>
                      <img
                        src={school.logo}
                        alt={school.name}
                        className="w-9 h-9 rounded-xl object-cover border border-neutral-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-900 truncate">{school.name}</p>
                        <p className="text-[11px] text-neutral-500 truncate">
                          {school.location} • {school.motto}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-blue-600 shrink-0 ml-2">
                      {school.studentCount.toLocaleString()} students
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Health & Realtime Status Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs space-y-3">
              <h2 className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                System Vitality & Security
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold">Cloud Firestore</span>
                  </div>
                  <span className="font-mono text-[11px]">Operational</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-blue-50 text-blue-800 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="font-bold">Gemini AI Assistant</span>
                  </div>
                  <span className="font-mono text-[11px]">Ready</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-neutral-50 text-neutral-700 rounded-xl border border-neutral-200">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-neutral-500" />
                    <span className="font-bold">RBAC Auth Model</span>
                  </div>
                  <span className="font-mono text-[11px]">Strict</span>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900">
                <p className="font-bold mb-0.5">Two-Role Authorization</p>
                <p className="text-[11px] text-purple-700 leading-relaxed">
                  Platform maintains global <strong>USER</strong> and <strong>SUPER_ADMIN</strong> permissions. School-level privileges are granted via granular delegation records.
                </p>
              </div>
            </div>

            {/* Recent Audit Snip */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                  Recent Actions
                </h3>
                <button
                  onClick={() => setCurrentTab('audit')}
                  className="text-[11px] text-blue-600 font-bold hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-2">
                {auditLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="text-xs border-b border-neutral-100 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 text-[11px]">{log.action}</span>
                      <span className="text-[10px] text-neutral-400">{log.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 truncate">{log.target}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER GOVERNANCE DIRECTORY */}
      {currentTab === 'users' && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search name, username, school, email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {(
                [
                  { id: 'all', label: 'All Users' },
                  { id: 'student', label: 'Students' },
                  { id: 'teacher', label: 'Teachers' },
                  { id: 'staff', label: 'Staff' },
                  { id: 'super_admin', label: 'Super Admins' },
                  { id: 'suspended', label: 'Suspended' }
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setUserTypeFilter(f.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    userTypeFilter === f.id
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-bold uppercase text-[10px]">
                  <th className="pb-3 px-2">Member</th>
                  <th className="pb-3 px-2">Campus</th>
                  <th className="pb-3 px-2">Role</th>
                  <th className="pb-3 px-2">Type</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredUsers.map((u) => {
                  const isSuspended = u.accountStatus === 'suspended';
                  const isCurrent = u.id === currentUser.id;

                  return (
                    <tr key={u.id} className="hover:bg-neutral-50/70 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-neutral-900 truncate">{u.name}</span>
                              {u.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                            </div>
                            <span className="text-[11px] text-neutral-500 block truncate">
                              @{u.username} • {u.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* School */}
                      <td className="py-3 px-2 font-medium text-neutral-700">
                        {u.schoolName || 'Platform General'}
                      </td>

                      {/* System Role */}
                      <td className="py-3 px-2">
                        <button
                          onClick={() => {
                            if (isCurrent) {
                              showToast('You cannot alter your own admin status directly.', 'error');
                              return;
                            }
                            updateUserRole(u.id, u.role === 'super_admin' ? 'user' : 'super_admin');
                          }}
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                            u.role === 'super_admin'
                              ? 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                          }`}
                          title="Click to toggle Super Admin role"
                        >
                          {u.role === 'super_admin' ? 'SUPER_ADMIN' : 'USER'}
                        </button>
                      </td>

                      {/* User Type */}
                      <td className="py-3 px-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                          {u.userType || 'student'}
                        </span>
                      </td>

                      {/* Account Status */}
                      <td className="py-3 px-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                            isSuspended
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                        </span>
                      </td>

                      {/* Administrative Actions */}
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Verified */}
                          <button
                            onClick={() => toggleUserVerification(u.id)}
                            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                              u.isVerified
                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                : 'bg-white border-neutral-200 text-neutral-400 hover:text-blue-600'
                            }`}
                            title={u.isVerified ? 'Remove verified badge' : 'Grant verified badge'}
                          >
                            <BadgeCheck className="w-4 h-4" />
                          </button>

                          {/* Suspend / Reactivate */}
                          {!isCurrent && (
                            <button
                              onClick={() =>
                                updateUserStatus(u.id, isSuspended ? 'active' : 'suspended')
                              }
                              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                                isSuspended
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                              }`}
                            >
                              {isSuspended ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                              <span>{isSuspended ? 'Reactivate' : 'Suspend'}</span>
                            </button>
                          )}

                          {/* Delete Account */}
                          {!isCurrent && (
                            <button
                              onClick={() => {
                                if (confirm(`Permanently delete account for ${u.name}?`)) {
                                  deleteUserAccount(u.id);
                                }
                              }}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete user account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CONTENT MODERATION HUB */}
      {currentTab === 'moderation' && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-neutral-900 tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Community Safety & Incident Queue
              </h2>
              <p className="text-xs text-neutral-500">
                Reports filed by students and faculty regarding bullying, harassment, hate speech, or safety violations.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              {(['all', 'pending', 'resolved', 'dismissed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setReportFilter(status)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                    reportFilter === status
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="p-12 text-center bg-emerald-50/60 rounded-3xl border border-emerald-200 text-emerald-800 space-y-2">
              <CheckCircle className="w-10 h-10 mx-auto text-emerald-600" />
              <h3 className="text-base font-black">All Clear!</h3>
              <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                No active safety reports matching the selected filter. Campus environment is orderly and compliant.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((rep) => {
                const targetPost = rep.targetType === 'post' ? posts.find((p) => p.id === rep.targetId) : null;
                const reporterUser = users.find((u) => u.id === rep.reportedBy);

                return (
                  <div
                    key={rep.id}
                    className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md">
                          {rep.reason}
                        </span>
                        <span className="text-xs font-bold text-neutral-900">
                          Target: {rep.targetType.toUpperCase()} #{rep.targetId}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          rep.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : rep.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-200 text-neutral-700'
                        }`}>
                          {rep.status}
                        </span>
                      </div>

                      {rep.details && (
                        <p className="text-xs text-neutral-700 bg-white p-2.5 rounded-xl border border-neutral-200/80">
                          <strong>Reporter Note:</strong> {rep.details}
                        </p>
                      )}

                      {targetPost && (
                        <div className="text-xs bg-white/90 p-2.5 rounded-xl border border-neutral-200">
                          <p className="text-[11px] font-bold text-neutral-500 mb-0.5">
                            Reported Content by {targetPost.authorName}:
                          </p>
                          <p className="text-neutral-800 italic truncate">
                            "{targetPost.text}"
                          </p>
                        </div>
                      )}

                      <div className="text-[11px] text-neutral-400">
                        Reported by: {reporterUser?.name || rep.reportedBy} • Incident logged: {rep.timestamp || rep.createdAt || 'Recent'}
                      </div>
                    </div>

                    {/* Moderation Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {rep.status === 'pending' && (
                        <>
                          <button
                            onClick={() => dismissReport(rep.id)}
                            className="px-3.5 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => handleTakeDownContent(rep)}
                            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Content</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CAMPUSES & DELEGATED STAFF */}
      {currentTab === 'campuses' && (
        <div className="space-y-4">
          {/* Header & Register Campus Modal Trigger */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-neutral-900 tracking-tight flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Campus Governance & Delegations
              </h2>
              <p className="text-xs text-neutral-500">
                Configure registered educational institutions and authorize official school page representatives.
              </p>
            </div>

            <button
              onClick={() => setShowAddSchool(!showAddSchool)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddSchool ? 'Close Form' : 'Register New Campus'}</span>
            </button>
          </div>

          {/* New Campus Form */}
          {showAddSchool && (
            <div className="bg-white rounded-3xl border border-blue-200 p-5 shadow-sm animate-in fade-in slide-in-from-top-2">
              <h3 className="text-sm font-black text-neutral-900 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Register New Institution on Campus Connect
              </h3>
              <form onSubmit={handleCreateSchool} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Campus Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mfantsipim School or Ashesi University"
                    value={newSchoolName}
                    onChange={(e) => setNewSchoolName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Motto / Slogan</label>
                  <input
                    type="text"
                    placeholder="e.g. Dwen Hwe Kan (Think and Look Ahead)"
                    value={newSchoolMotto}
                    onChange={(e) => setNewSchoolMotto(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Location / City</label>
                  <input
                    type="text"
                    placeholder="e.g. Cape Coast, Central Region"
                    value={newSchoolLocation}
                    onChange={(e) => setNewSchoolLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Official Website</label>
                  <input
                    type="text"
                    placeholder="https://mfantsipim.edu"
                    value={newSchoolWebsite}
                    onChange={(e) => setNewSchoolWebsite(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSchool(false)}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    Register Campus
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Delegate Staff Assignment Panel */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-black text-neutral-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Delegate Official School Representative
            </h3>
            <p className="text-xs text-neutral-500">
              Grant trusted teachers, prefects, or school managers permission to manage official announcements for their campus.
            </p>

            <form onSubmit={handleAssignStaffSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Select Campus</label>
                <select
                  value={staffSchoolId}
                  onChange={(e) => setStaffSchoolId(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-500 font-medium"
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Select Member</label>
                <select
                  value={staffUserId}
                  onChange={(e) => setStaffUserId(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-500 font-medium"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} (@{u.username} • {u.userType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Staff Title</label>
                <input
                  type="text"
                  value={staffTitle}
                  onChange={(e) => setStaffTitle(e.target.value)}
                  placeholder="e.g. Faculty Patron, Head Boy"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Grant Permissions
                </button>
              </div>
            </form>

            {/* Active delegations */}
            {schoolStaff.length > 0 && (
              <div className="pt-3 border-t border-neutral-100">
                <h4 className="font-extrabold text-neutral-800 text-xs mb-2">
                  Active Delegations ({schoolStaff.length})
                </h4>
                <div className="space-y-2">
                  {schoolStaff.map((st) => (
                    <div
                      key={st.id}
                      className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">
                          {st.userName?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">
                            {st.userName} → {st.schoolName}
                          </p>
                          <p className="text-[10px] text-neutral-500">
                            Authorized Representative • Granted: {st.assignedAt ? new Date(st.assignedAt).toLocaleDateString() : 'Active'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => removeSchoolStaff(st.id)}
                        className="text-rose-600 hover:text-rose-700 text-xs font-bold px-2 py-1 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        Revoke Access
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Schools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSchools.map((school) => (
              <div
                key={school.id}
                className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <img
                      src={school.logo}
                      alt={school.name}
                      className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-neutral-900 text-xs truncate">{school.name}</h4>
                        {school.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-neutral-500 truncate">@{school.username}</p>
                      <p className="text-[11px] text-blue-600 font-medium truncate">{school.location}</p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 mt-2 line-clamp-2 italic">
                    "{school.motto || 'Excellence and Knowledge'}"
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-neutral-700">
                    {school.studentCount.toLocaleString()} Students
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingSchool(school)}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Permanently delete school ${school.name}?`)) {
                          deleteSchool(school.id);
                        }
                      }}
                      className="p-1 text-neutral-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit School Modal */}
          {editingSchool && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm text-neutral-900">Edit School Profile</h3>
                  <button onClick={() => setEditingSchool(null)} className="text-neutral-400 hover:text-neutral-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateSchool(editingSchool.id, editingSchool);
                    setEditingSchool(null);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Campus Name</label>
                    <input
                      type="text"
                      value={editingSchool.name}
                      onChange={(e) => setEditingSchool({ ...editingSchool, name: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Motto</label>
                    <input
                      type="text"
                      value={editingSchool.motto}
                      onChange={(e) => setEditingSchool({ ...editingSchool, motto: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Location</label>
                    <input
                      type="text"
                      value={editingSchool.location}
                      onChange={(e) => setEditingSchool({ ...editingSchool, location: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Official Website</label>
                    <input
                      type="text"
                      value={editingSchool.website}
                      onChange={(e) => setEditingSchool({ ...editingSchool, website: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingSchool(null)}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PLATFORM BROADCASTS */}
      {currentTab === 'broadcasts' && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-black text-neutral-900 tracking-tight flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-purple-600" />
              Central Platform Broadcast Composer
            </h2>
            <p className="text-xs text-neutral-500">
              Publish official announcements that appear at the top of all student and faculty feeds with an authoritative badge.
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Priority / Alert Type</label>
                <select
                  value={broadcastPriority}
                  onChange={(e) => setBroadcastPriority(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none font-semibold text-xs"
                >
                  <option value="normal">Standard Notice</option>
                  <option value="priority">⚡ High Priority Update</option>
                  <option value="urgent">🚨 Critical / Emergency Alert</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Target Campus</label>
                <select
                  value={broadcastTargetSchool}
                  onChange={(e) => setBroadcastTargetSchool(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none font-semibold text-xs"
                >
                  <option value="all">Global Broadcast (All Campuses)</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} only
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">Announcement Message</label>
              <textarea
                rows={4}
                required
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                placeholder="Compose the official directive, exam calendar advisory, competition notice, or campus emergency update..."
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:bg-white focus:border-purple-500 transition-colors text-xs resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!broadcastText.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Broadcast to Network</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 6: AUDIT LOGS */}
      {currentTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-neutral-900 tracking-tight flex items-center gap-2">
                <History className="w-5 h-5 text-neutral-700" />
                Administrative Paper Trail & Audit Log
              </h2>
              <p className="text-xs text-neutral-500">
                Tamper-evident chronological log of all governance actions taken across the system.
              </p>
            </div>

            {auditLogs.length > 0 && (
              <button
                onClick={clearAuditLogs}
                className="text-xs text-neutral-500 hover:text-neutral-800 font-semibold underline cursor-pointer"
              >
                Clear Local Audit History
              </button>
            )}
          </div>

          <div className="divide-y divide-neutral-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-neutral-900">{log.action}</span>
                    <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-mono">
                      {log.target}
                    </span>
                  </div>
                  {log.details && (
                    <p className="text-neutral-600 text-[11px] truncate">{log.details}</p>
                  )}
                  <p className="text-[10px] text-neutral-400">
                    Executed by: {log.adminName}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
