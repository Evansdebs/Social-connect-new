import React from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import {
  Home,
  Compass,
  Film,
  Building2,
  Users,
  Calendar,
  MessageSquare,
  UserCheck,
  ShieldCheck,
  Trophy,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC<{ onCloseMobileMenu?: () => void }> = ({ onCloseMobileMenu }) => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    activeSchool,
    setSelectedSchoolId,
    clubs,
    openModal
  } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'home', label: 'Home Feed', icon: Home },
    { id: 'discover', label: 'Discover & Explore', icon: Compass },
    { id: 'reels', label: 'Campus Reels', icon: Film, badge: 'Viral' },
    { id: 'schools', label: 'School Hub', icon: Building2 },
    { id: 'communities', label: 'Clubs & Societies', icon: Users },
    { id: 'events', label: 'Events & Grants', icon: Calendar },
    { id: 'chat', label: 'Direct Messages', icon: MessageSquare },
    { id: 'profile', label: 'My Profile', icon: UserCheck }
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  const joinedClubs = clubs.filter((c) => c.isJoined);

  return (
    <aside className="w-64 shrink-0 flex flex-col gap-5 py-4 select-none">
      {/* Primary Navigation Menu */}
      <nav className="bg-white rounded-2xl border border-neutral-200/80 p-2 shadow-xs space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Conditional Admin Shortcuts */}
        {currentUser.role === 'school_admin' && (
          <button
            id="sidebar-school-admin-btn"
            onClick={() => openModal('school_admin')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>School Admin</span>
            </div>
            <span className="text-[10px] bg-amber-100 px-2 py-0.5 rounded-full font-bold">MANAGE</span>
          </button>
        )}

        {currentUser.role === 'platform_admin' && (
          <button
            id="sidebar-platform-admin-btn"
            onClick={() => openModal('platform_admin')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-rose-600" />
              <span>Platform Desk</span>
            </div>
            <span className="text-[10px] bg-rose-100 px-2 py-0.5 rounded-full font-bold">ADMIN</span>
          </button>
        )}
      </nav>

      {/* "My School" Quick Card */}
      {activeSchool && (
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3 mb-2.5">
            <img
              src={activeSchool.logo}
              alt={activeSchool.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/30 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="font-bold text-sm truncate text-white">{activeSchool.name}</p>
                <span className="text-sky-300 text-xs">✓</span>
              </div>
              <p className="text-[11px] text-blue-200">@{activeSchool.username}</p>
            </div>
          </div>

          <p className="text-xs text-blue-100/90 line-clamp-2 italic mb-3">
            "{activeSchool.motto}"
          </p>

          <div className="grid grid-cols-2 gap-2 bg-white/10 rounded-xl p-2 text-center text-xs mb-3">
            <div>
              <p className="text-[10px] text-blue-200 uppercase font-semibold">Campus Rank</p>
              <p className="font-extrabold text-sky-300">#{activeSchool.rankings.activeRank}</p>
            </div>
            <div>
              <p className="text-[10px] text-blue-200 uppercase font-semibold">Derby Wins</p>
              <p className="font-extrabold text-amber-300">{activeSchool.rankings.challengeWins} 🏆</p>
            </div>
          </div>

          <button
            id="view-school-profile-sidebar-btn"
            onClick={() => {
              setSelectedSchoolId(activeSchool.id);
              setActiveTab('schools');
              if (onCloseMobileMenu) onCloseMobileMenu();
            }}
            className="w-full py-1.5 px-3 bg-white/20 hover:bg-white/30 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <span>Visit Official School Page</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* My Clubs & Societies Quick List */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            My Campus Clubs
          </p>
          <button
            onClick={() => {
              setActiveTab('communities');
              if (onCloseMobileMenu) onCloseMobileMenu();
            }}
            className="text-[11px] text-blue-600 hover:underline font-semibold"
          >
            Explore All
          </button>
        </div>

        <div className="space-y-1.5">
          {joinedClubs.length > 0 ? (
            joinedClubs.slice(0, 3).map((club) => (
              <div
                key={club.id}
                onClick={() => {
                  setActiveTab('communities');
                  if (onCloseMobileMenu) onCloseMobileMenu();
                }}
                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors"
              >
                <img
                  src={club.coverImage}
                  alt={club.name}
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-neutral-800 truncate">{club.name}</p>
                  <p className="text-[10px] text-neutral-400">{club.membersCount} members</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-neutral-400 py-1">No clubs joined yet.</p>
          )}
        </div>
      </div>
    </aside>
  );
};
