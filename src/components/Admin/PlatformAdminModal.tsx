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
  Search,
  UserCheck,
  UserX,
  Plus,
  Shield,
  BadgeCheck,
  Sparkles,
  Lock
} from 'lucide-react';
import { UserRole, UserType, School } from '../../types';

export const PlatformAdminModal: React.FC = () => {
  const {
    closeModal,
    reports,
    dismissReport,
    schools,
    allUsers,
    posts,
    deletePost,
    showToast,
    isSuperAdmin,
    updateUserStatus,
    toggleUserVerification,
    deleteUserAccount,
    updateSchool,
    deleteSchool,
    schoolStaff,
    assignSchoolStaff,
    removeSchoolStaff,
    currentUser,
    setActiveTab: setNavTab
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reports' | 'users' | 'schools' | 'stats'>('reports');
  const [userSearch, setUserSearch] = useState('');
  const [filterUserType, setFilterUserType] = useState<'all' | UserType>('all');
  
  // School staff assignment form
  const [selectedSchoolForStaff, setSelectedSchoolForStaff] = useState<string>(schools[0]?.id || '');
  const [selectedUserForStaff, setSelectedUserForStaff] = useState<string>(allUsers[0]?.id || '');
  const [staffTitle, setStaffTitle] = useState('School Page Manager');

  // If user is not a Super Admin, block access gracefully
  if (!isSuperAdmin) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center border border-neutral-200 shadow-2xl animate-in fade-in zoom-in-95">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-neutral-900 mb-1">Super Admin Authorization Required</h3>
          <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
            Only designated platform Super Administrators have clearance to access the central safety, moderation, and user governance console.
          </p>
          <button
            onClick={closeModal}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Return to Campus Connect
          </button>
        </div>
      </div>
    );
  }

  const handleTakeDownContent = (reportId: string, targetType: string, targetId: string) => {
    if (targetType === 'post') {
      deletePost(targetId);
    }
    dismissReport(reportId);
    showToast('Content removed and violation action logged.', 'success');
  };

  const handleAssignStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchoolForStaff || !selectedUserForStaff) {
      showToast('Please select a school and a user', 'error');
      return;
    }
    assignSchoolStaff(
      selectedSchoolForStaff,
      selectedUserForStaff,
      ['post_announcements', 'edit_profile', 'manage_events'],
      staffTitle
    );
    showToast('School management permissions granted successfully!', 'success');
  };

  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.schoolName.toLowerCase().includes(userSearch.toLowerCase());
    const matchesType = filterUserType === 'all' || u.userType === filterUserType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 px-6 bg-neutral-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm leading-tight">Super Admin Platform Console</h3>
                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  SUPER_ADMIN
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Central Moderation, Account Governance & Campus Permissions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                closeModal();
                setNavTab('admin');
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors hidden sm:block"
            >
              Open Full Command Center
            </button>
            <button
              onClick={closeModal}
              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 text-xs overflow-x-auto">
          {[
            { id: 'reports', label: `Moderation Reports (${reports.filter((r) => r.status === 'pending').length})` },
            { id: 'users', label: `User Directory (${allUsers.length})` },
            { id: 'schools', label: `Campuses & Staff (${schools.length})` },
            { id: 'stats', label: 'Platform Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-neutral-900 text-neutral-900 bg-white shadow-2xs'
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
                Review submitted student and campus reports for bullying, harassment, or safety violations.
              </p>

              {reports.filter((r) => r.status === 'pending').length === 0 ? (
                <div className="p-10 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800">
                  <Check className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
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
                          <strong>Details:</strong> {rep.details || 'No additional comment provided.'}
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-1">
                          Reported by User #{rep.reportedBy || rep.reporterId} • Created: {rep.timestamp || rep.createdAt || 'Recent'}
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

          {/* Tab 2: User Governance Directory */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search users by name, username, school..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                {/* Filter by userType */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase mr-1">Type:</span>
                  {(['all', 'student', 'teacher', 'staff', 'alumni'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilterUserType(t)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] capitalize transition-colors ${
                        filterUserType === t
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users list */}
              <div className="space-y-2.5">
                {filteredUsers.map((u) => {
                  const isSuspended = u.accountStatus === 'suspended';
                  const isCurrentUser = u.id === currentUser.id;

                  return (
                    <div
                      key={u.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSuspended
                          ? 'bg-rose-50/50 border-rose-200'
                          : 'bg-neutral-50/70 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-200"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-neutral-900 truncate">{u.name}</span>
                            <span className="text-neutral-500 text-[11px]">@{u.username}</span>
                            {u.isVerified && (
                              <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                            )}
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                u.role === 'super_admin'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-neutral-200 text-neutral-800'
                              }`}
                            >
                              {u.role === 'super_admin' ? 'SUPER_ADMIN' : 'USER'}
                            </span>
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                              {u.userType || 'student'}
                            </span>
                            {isSuspended && (
                              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded">
                                SUSPENDED
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-500 truncate">
                            {u.schoolName} • {u.email}
                          </p>
                        </div>
                      </div>

                      {/* Administrative Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Toggle Verified */}
                        <button
                          onClick={() => toggleUserVerification(u.id)}
                          className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                            u.isVerified
                              ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                              : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                          }`}
                          title={u.isVerified ? 'Remove Verification' : 'Verify Account'}
                        >
                          <BadgeCheck className="w-4 h-4" />
                        </button>

                        {/* Suspend / Reactivate */}
                        {!isCurrentUser && (
                          <button
                            onClick={() =>
                              updateUserStatus(u.id, isSuspended ? 'active' : 'suspended')
                            }
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors ${
                              isSuspended
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                            }`}
                          >
                            {isSuspended ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Reactivate</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                <span>Suspend</span>
                              </>
                            )}
                          </button>
                        )}

                        {/* Delete Account */}
                        {!isCurrentUser && (
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to permanently delete user account ${u.name}?`)) {
                                deleteUserAccount(u.id);
                              }
                            }}
                            className="p-2 rounded-xl bg-neutral-100 hover:bg-rose-100 text-neutral-600 hover:text-rose-700 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Schools & Staff Permissions */}
          {activeTab === 'schools' && (
            <div className="space-y-5">
              {/* Grant School Management Permissions Form */}
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center gap-2 font-extrabold text-blue-900 text-xs">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Assign Campus Page Manager (School Staff Authorization)</span>
                </div>
                <p className="text-[11px] text-blue-700">
                  Instead of a separate role, grant specific users authorized staff permissions to post official school announcements and manage this campus profile.
                </p>

                <form onSubmit={handleAssignStaff} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Select School</label>
                    <select
                      value={selectedSchoolForStaff}
                      onChange={(e) => setSelectedSchoolForStaff(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500"
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
                      value={selectedUserForStaff}
                      onChange={(e) => setSelectedUserForStaff(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500"
                    >
                      {allUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} (@{u.username} • {u.userType})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Grant School Access</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Authorized Staff Table */}
              <div>
                <h4 className="font-extrabold text-neutral-900 mb-2">
                  Active School Staff Authorizations ({schoolStaff.length})
                </h4>
                {schoolStaff.length === 0 ? (
                  <p className="text-neutral-500 text-xs italic">No delegated school staff assigned yet.</p>
                ) : (
                  <div className="space-y-2">
                    {schoolStaff.map((st) => {
                      const school = schools.find((s) => s.id === st.schoolId);
                      const user = allUsers.find((u) => u.id === st.userId);

                      return (
                        <div
                          key={st.id}
                          className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                              {school?.name.charAt(0) || 'S'}
                            </div>
                            <div>
                              <p className="font-bold text-neutral-900">
                                {user?.name || `User #${st.userId}`} → {school?.name || st.schoolId}
                              </p>
                              <p className="text-[10px] text-neutral-500">
                                Title: {st.title || 'Staff Manager'} • Permissions: {st.permissions.join(', ')}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => removeSchoolStaff(st.id)}
                            className="text-rose-600 hover:text-rose-700 font-bold text-xs p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Revoke School Permissions"
                          >
                            Revoke
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Schools List */}
              <div className="pt-2">
                <h4 className="font-extrabold text-neutral-900 mb-2">
                  Registered Campuses ({schools.length})
                </h4>
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
                            {school.studentCount} students
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Platform Analytics */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Total Users</span>
                  <p className="text-xl font-black text-neutral-900 mt-1">{allUsers.length}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Schools</span>
                  <p className="text-xl font-black text-blue-600 mt-1">{schools.length}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Published Posts</span>
                  <p className="text-xl font-black text-indigo-600 mt-1">{posts.length}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Safety Reports</span>
                  <p className="text-xl font-black text-amber-600 mt-1">{reports.length}</p>
                </div>
              </div>

              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl">
                <h4 className="font-extrabold text-purple-900 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>Two-Role Security Model & Access Control</span>
                </h4>
                <p className="text-xs text-purple-800 leading-relaxed">
                  The system enforces strict distinction between general accounts (<strong>USER</strong>) and platform administrators (<strong>SUPER_ADMIN</strong>). School privileges are delegated granularly via the <code>schoolStaff</code> security relationship table rather than system-wide roles.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
