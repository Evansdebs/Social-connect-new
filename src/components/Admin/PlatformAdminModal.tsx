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
  Lock,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Mail,
  ExternalLink,
  School as SchoolIcon,
  Filter
} from 'lucide-react';
import { UserRole, UserType, School, SchoolRequest } from '../../types';

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
    addSchool,
    updateSchool,
    deleteSchool,
    schoolStaff,
    assignSchoolStaff,
    removeSchoolStaff,
    currentUser,
    setActiveTab: setNavTab,
    schoolRequests,
    approveSchoolRequest,
    rejectSchoolRequest,
    deleteSchoolRequest
  } = useApp();

  const [activeTab, setActiveTab] = useState<'schoolRequests' | 'reports' | 'users' | 'schools' | 'stats'>('schoolRequests');
  const [userSearch, setUserSearch] = useState('');
  const [filterUserType, setFilterUserType] = useState<'all' | UserType>('all');
  
  // School request filter & search
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [requestSearch, setRequestSearch] = useState('');

  // Admin Direct School Creation Form
  const [showAddSchoolForm, setShowAddSchoolForm] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolLocation, setNewSchoolLocation] = useState('');
  const [newSchoolRegion, setNewSchoolRegion] = useState('National');
  const [newSchoolWebsite, setNewSchoolWebsite] = useState('');
  const [newSchoolMotto, setNewSchoolMotto] = useState('');
  const [newSchoolDescription, setNewSchoolDescription] = useState('');

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
            Only designated platform Super Administrators have clearance to access the central safety, moderation, school approval, and user governance console.
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
    const school = schools.find((s) => s.id === selectedSchoolForStaff);
    const user = allUsers.find((u) => u.id === selectedUserForStaff);

    assignSchoolStaff({
      schoolId: selectedSchoolForStaff,
      schoolName: school?.name || '',
      userId: selectedUserForStaff,
      userName: user?.name || '',
      userUsername: user?.username || '',
      permissions: {
        manageSchoolProfile: true,
        createSchoolPosts: true,
        manageSchoolEvents: true
      },
      assignedBy: currentUser.id
    });
    showToast('School management permissions granted successfully!', 'success');
  };

  const handleCreateSchoolDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName.trim()) {
      showToast('Please enter a school name', 'error');
      return;
    }

    const schoolId = `school-${Date.now()}`;
    const cleanUsername = newSchoolName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .slice(0, 25);

    const schoolObj: School = {
      id: schoolId,
      name: newSchoolName.trim(),
      username: cleanUsername,
      location: newSchoolLocation.trim() || 'Main Campus',
      region: newSchoolRegion.trim() || 'National',
      website: newSchoolWebsite.trim() || 'https://campusconnect.edu',
      established: new Date().getFullYear(),
      studentCount: 1,
      followersCount: 1,
      logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(newSchoolName.trim())}`,
      coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
      description: newSchoolDescription.trim() || `Official campus community for ${newSchoolName.trim()}`,
      motto: newSchoolMotto.trim() || 'Knowledge, Integrity & Excellence',
      isVerified: true,
      rankings: {
        activeRank: schools.length + 1,
        challengeWins: 0,
        popularityScore: 90
      }
    };

    addSchool(schoolObj);
    showToast(`Campus "${newSchoolName.trim()}" added to the system!`, 'success');
    setNewSchoolName('');
    setNewSchoolLocation('');
    setNewSchoolRegion('National');
    setNewSchoolWebsite('');
    setNewSchoolMotto('');
    setNewSchoolDescription('');
    setShowAddSchoolForm(false);
  };

  const pendingRequestsCount = schoolRequests.filter((r) => r.status === 'pending').length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  const filteredSchoolRequests = schoolRequests.filter((r) => {
    const matchesFilter = requestFilter === 'all' || r.status === requestFilter;
    const matchesSearch =
      r.schoolName.toLowerCase().includes(requestSearch.toLowerCase()) ||
      r.location.toLowerCase().includes(requestSearch.toLowerCase()) ||
      r.requesterName.toLowerCase().includes(requestSearch.toLowerCase()) ||
      (r.requesterEmail && r.requesterEmail.toLowerCase().includes(requestSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

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
                Central Moderation, School Approvals, Campus Setup & Permissions
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
            {
              id: 'schoolRequests',
              label: 'School Requests',
              count: pendingRequestsCount,
              badgeColor: 'bg-amber-500 text-white'
            },
            {
              id: 'schools',
              label: 'Campuses & Staff',
              count: schools.length,
              badgeColor: 'bg-blue-100 text-blue-700'
            },
            {
              id: 'reports',
              label: 'Safety Reports',
              count: pendingReportsCount,
              badgeColor: 'bg-rose-500 text-white'
            },
            {
              id: 'users',
              label: 'User Directory',
              count: allUsers.length,
              badgeColor: 'bg-neutral-200 text-neutral-700'
            },
            {
              id: 'stats',
              label: 'Analytics',
              count: null,
              badgeColor: ''
            }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-neutral-900 text-neutral-900 bg-white shadow-2xs'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${tab.badgeColor}`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* TAB: School Requests */}
          {activeTab === 'schoolRequests' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200">
                <div>
                  <h4 className="font-extrabold text-neutral-900 text-sm">School Registration Requests</h4>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    Review and approve campus addition requests sent by new users during registration.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search requests..."
                      value={requestSearch}
                      onChange={(e) => setRequestSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-[11px] font-semibold flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Status:
                </span>
                {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setRequestFilter(st)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] capitalize transition-colors ${
                      requestFilter === st
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {st === 'all' ? 'All Requests' : st}
                    {st === 'pending' && pendingRequestsCount > 0 && ` (${pendingRequestsCount})`}
                  </button>
                ))}
              </div>

              {/* Request List */}
              {filteredSchoolRequests.length === 0 ? (
                <div className="p-10 text-center bg-neutral-50 rounded-2xl border border-neutral-200 text-neutral-500">
                  <SchoolIcon className="w-8 h-8 mx-auto mb-2 text-neutral-400" />
                  <p className="font-bold text-sm text-neutral-800">No School Requests Found</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {requestFilter === 'pending'
                      ? 'No pending school addition requests from students right now.'
                      : 'No requests matched your search criteria.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSchoolRequests.map((req) => (
                    <div
                      key={req.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        req.status === 'pending'
                          ? 'border-amber-200 bg-amber-50/40'
                          : req.status === 'approved'
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : 'border-neutral-200 bg-neutral-50/50'
                      } flex flex-col md:flex-row md:items-center justify-between gap-4`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-extrabold text-sm text-neutral-900">{req.schoolName}</h5>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              req.status === 'pending'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : req.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-neutral-200 text-neutral-700'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-neutral-500 text-xs flex-wrap">
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                            {req.location}
                          </span>
                          <span className="text-neutral-300">•</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-neutral-400" />
                            Requested by: <strong>{req.requesterName}</strong>
                          </span>
                          {req.requesterEmail && (
                            <>
                              <span className="text-neutral-300">•</span>
                              <span className="flex items-center gap-1 text-blue-600">
                                <Mail className="w-3.5 h-3.5 text-blue-400" />
                                {req.requesterEmail}
                              </span>
                            </>
                          )}
                          <span className="text-neutral-300">•</span>
                          <span className="text-neutral-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>

                        {req.notes && (
                          <div className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-700 text-[11px] leading-relaxed">
                            <span className="font-bold text-neutral-900">Requester Notes: </span>
                            {req.notes}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => approveSchoolRequest(req.id)}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve & Add School</span>
                            </button>
                            <button
                              onClick={() => rejectSchoolRequest(req.id)}
                              className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        {req.status !== 'pending' && (
                          <span className="text-xs text-neutral-500 italic pr-2">
                            Processed ({req.status})
                          </span>
                        )}

                        <button
                          onClick={() => deleteSchoolRequest(req.id)}
                          className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Request Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Campuses & Staff */}
          {activeTab === 'schools' && (
            <div className="space-y-5">
              {/* Add New School Form Header & Toggle */}
              <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-extrabold text-neutral-900 text-xs">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Admin Campus Directory Management</span>
                  </div>
                  <button
                    onClick={() => setShowAddSchoolForm(!showAddSchoolForm)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddSchoolForm ? 'Cancel Form' : 'Add New Campus / School'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Admins have full authority to create and publish campus institutions. Once added, students can choose this school from the registration dropdown.
                </p>

                {/* Direct School Creation Form */}
                {showAddSchoolForm && (
                  <form onSubmit={handleCreateSchoolDirect} className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3 mt-2 animate-in fade-in">
                    <h5 className="font-extrabold text-blue-950 text-xs">Create New Official School</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-neutral-700 block mb-1">School Name *</label>
                        <input
                          type="text"
                          required
                          value={newSchoolName}
                          onChange={(e) => setNewSchoolName(e.target.value)}
                          placeholder="e.g. University of Ghana"
                          className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-neutral-700 block mb-1">Location / City *</label>
                        <input
                          type="text"
                          required
                          value={newSchoolLocation}
                          onChange={(e) => setNewSchoolLocation(e.target.value)}
                          placeholder="e.g. Legon, Accra"
                          className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-neutral-700 block mb-1">Region / State</label>
                        <input
                          type="text"
                          value={newSchoolRegion}
                          onChange={(e) => setNewSchoolRegion(e.target.value)}
                          placeholder="e.g. Greater Accra"
                          className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-neutral-700 block mb-1">Website URL</label>
                        <input
                          type="url"
                          value={newSchoolWebsite}
                          onChange={(e) => setNewSchoolWebsite(e.target.value)}
                          placeholder="https://ug.edu.gh"
                          className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-bold text-neutral-700 block mb-1">Campus Motto / Slogan</label>
                        <input
                          type="text"
                          value={newSchoolMotto}
                          onChange={(e) => setNewSchoolMotto(e.target.value)}
                          placeholder="e.g. Integri Procedamus"
                          className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddSchoolForm(false)}
                        className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Publish Campus</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Grant School Management Permissions Form */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                <div className="flex items-center gap-2 font-extrabold text-neutral-900 text-xs">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Assign Campus Page Manager (School Staff Authorization)</span>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Grant specific users authorized staff permissions to post official school announcements and manage this campus profile.
                </p>

                <form onSubmit={handleAssignStaff} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Select School</label>
                    <select
                      value={selectedSchoolForStaff}
                      onChange={(e) => setSelectedSchoolForStaff(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500"
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
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500"
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
                                Assigned by: {st.assignedBy || 'Admin'}
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
                  Registered Campuses in System ({schools.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {schools.map((school) => (
                    <div
                      key={school.id}
                      className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={school.logo}
                          alt={school.name}
                          className="w-10 h-10 rounded-xl object-cover bg-white border border-neutral-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-neutral-900 truncate">{school.name}</p>
                          <p className="text-[10px] text-neutral-500 truncate">
                            @{school.username} • {school.location}
                          </p>
                          <p className="text-[10px] text-blue-600 font-semibold">
                            {school.studentCount} members
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                          Active
                        </span>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete campus "${school.name}"?`)) {
                              deleteSchool(school.id);
                              showToast(`Removed campus ${school.name}`, 'info');
                            }
                          }}
                          className="p-1 text-neutral-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Delete Campus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Moderation Queue */}
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

          {/* TAB: Member Directory */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by name, @username, or school..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                  {(['all', 'student', 'teacher', 'alumni', 'creator'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterUserType(type as any)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors ${
                        filterUserType === type
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Grid */}
              <div className="space-y-2">
                {filteredUsers.map((u) => {
                  const isUserSuperAdmin = u.role === 'super_admin';

                  return (
                    <div
                      key={u.id}
                      className="p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex items-center justify-between gap-3 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-200"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-extrabold text-neutral-900 text-xs truncate">
                              {u.name}
                            </span>
                            {u.isVerified && (
                              <BadgeCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            )}
                            {isUserSuperAdmin && (
                              <span className="bg-purple-100 text-purple-800 text-[9px] font-black px-1.5 py-0.2 rounded shrink-0">
                                SUPER_ADMIN
                              </span>
                            )}
                            {u.accountStatus === 'suspended' && (
                              <span className="bg-rose-100 text-rose-800 text-[9px] font-black px-1.5 py-0.2 rounded shrink-0">
                                SUSPENDED
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-500 truncate">
                            @{u.username} • {u.schoolName} ({u.userType})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Verify Badge Toggle */}
                        <button
                          onClick={() => toggleUserVerification(u.id)}
                          className={`p-2 rounded-xl border transition-colors ${
                            u.isVerified
                              ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                              : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-100'
                          }`}
                          title={u.isVerified ? 'Remove Verification' : 'Grant Verified Badge'}
                        >
                          <BadgeCheck className="w-4 h-4" />
                        </button>

                        {/* Status Toggle */}
                        {!isUserSuperAdmin && (
                          <button
                            onClick={() =>
                              updateUserStatus(
                                u.id,
                                u.accountStatus === 'suspended' ? 'active' : 'suspended'
                              )
                            }
                            className={`p-2 rounded-xl border transition-colors ${
                              u.accountStatus === 'suspended'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                            }`}
                            title={
                              u.accountStatus === 'suspended' ? 'Reactivate Account' : 'Suspend Account'
                            }
                          >
                            {u.accountStatus === 'suspended' ? (
                              <UserCheck className="w-4 h-4" />
                            ) : (
                              <UserX className="w-4 h-4" />
                            )}
                          </button>
                        )}

                        {/* Delete Account */}
                        {!isUserSuperAdmin && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Permanently delete @${u.username}'s account?`)) {
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

          {/* TAB: Platform Analytics */}
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
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Pending Requests</span>
                  <p className="text-xl font-black text-amber-600 mt-1">{pendingRequestsCount}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Safety Reports</span>
                  <p className="text-xl font-black text-rose-600 mt-1">{reports.length}</p>
                </div>
              </div>

              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl">
                <h4 className="font-extrabold text-purple-900 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>Admin-Gated School Registry System</span>
                </h4>
                <p className="text-xs text-purple-800 leading-relaxed">
                  The system enforces that administrators manage and add official campuses. When students register, they choose from the admin-curated list or submit a formal addition request with their school name and location for review.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
