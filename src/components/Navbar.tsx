import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Bell,
  MessageSquare,
  Plus,
  Shield,
  GraduationCap,
  Sparkles,
  RotateCcw,
  Menu,
  X,
  LogIn,
  LogOut,
  CloudCheck,
  Check,
  UserPlus
} from 'lucide-react';

export const Navbar: React.FC<{ onToggleMobileMenu?: () => void; isMobileMenuOpen?: boolean }> = ({
  onToggleMobileMenu,
  isMobileMenuOpen
}) => {
  const {
    currentUser,
    isFirebaseAuthActive,
    firebaseUserEmail,
    signOutUser,
    isSuperAdmin,
    isSchoolAuthorized,
    activeTab,
    setActiveTab,
    unreadNotifCount,
    notifications,
    markNotificationRead,
    openModal,
    searchQuery,
    setSearchQuery,
    resetDemoData,
    connectedUserIds,
    incomingConnectionRequests,
    acceptConnectionRequest,
    declineConnectionRequest
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Fix #9: refs for click-outside detection
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('discover');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-200 px-4 lg:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand & Mobile hamburger */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-toggle-btn"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            id="campus-connect-logo-btn"
            onClick={() => {
              setActiveTab('home');
              setSearchQuery('');
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 bg-clip-text text-transparent">
                Campus Connect
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-semibold tracking-wider text-neutral-400">
                Connect • Create • Discover
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md mx-4 relative items-center"
        >
          <Search className="w-4 h-4 absolute left-3.5 text-neutral-400 pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (activeTab !== 'discover') setActiveTab('discover');
            }}
            placeholder="Search students, @usernames, schools, clubs, #hashtags..."
            className="w-full bg-neutral-100 hover:bg-neutral-150 focus:bg-white text-sm text-neutral-900 pl-10 pr-4 py-2 rounded-full border border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-neutral-400 hover:text-neutral-600 text-xs"
            >
              Clear
            </button>
          )}
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Production Cloud Connection Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-700 select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cloud Firestore</span>
          </div>

          {/* Quick Sign In / Auth Button */}
          {!isFirebaseAuthActive ? (
            <button
              onClick={() => openModal('auth')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full font-bold">
              <span>Cloud Active</span>
            </div>
          )}

          {/* Quick Create Button */}
          <button
            id="quick-create-btn"
            onClick={() => openModal('create_post')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs shadow-sm transition-all shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create</span>
          </button>

          {/* Direct Messages Shortcut */}
          <button
            id="nav-chat-btn"
            onClick={() => setActiveTab('chat')}
            className={`p-2 rounded-full text-neutral-600 hover:bg-neutral-100 relative transition-colors ${
              activeTab === 'chat' ? 'bg-blue-50 text-blue-600' : ''
            }`}
            title="Messages & Cross-School Chats"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              id="nav-notifications-btn"
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className={`p-2 rounded-full text-neutral-600 hover:bg-neutral-100 relative transition-colors ${
                showNotifMenu ? 'bg-neutral-100' : ''
              }`}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1 right-1 px-1.5 py-0.2 text-[10px] font-bold bg-rose-500 text-white rounded-full ring-2 ring-white">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-800">Notifications</span>
                    {unreadNotifCount > 0 && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 font-semibold rounded-full">
                        {unreadNotifCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      notifications.forEach((n) => markNotificationRead(n.id));
                      setShowNotifMenu(false);
                    }}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-neutral-50">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-neutral-400 text-xs">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const isConnReq = n.type === 'connection_request';
                      const pendingReq = isConnReq
                        ? incomingConnectionRequests.find(
                            (r) => r.id === n.requestId || r.fromUserId === n.senderId
                          )
                        : null;
                      const isAlreadyConnected = n.senderId
                        ? connectedUserIds.includes(n.senderId)
                        : false;

                      return (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                          }}
                          className={`px-4 py-3 hover:bg-neutral-50 flex items-start gap-3 transition-colors ${
                            !n.isRead ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <img
                            src={n.senderAvatar}
                            alt={n.senderName}
                            className="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0 mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-neutral-800 leading-snug">
                              <span className="font-semibold text-neutral-900">{n.senderName}</span>{' '}
                              {n.content}
                            </p>
                            <span className="text-[10px] text-neutral-400 mt-1 block">
                              {n.timestamp}
                            </span>

                            {/* Pending connection request action buttons */}
                            {pendingReq && !isAlreadyConnected && (
                              <div className="flex items-center gap-1.5 mt-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    acceptConnectionRequest(pendingReq.id);
                                    markNotificationRead(n.id);
                                  }}
                                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1 transition-colors"
                                >
                                  <Check className="w-3 h-3" /> Accept
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    declineConnectionRequest(pendingReq.id);
                                    markNotificationRead(n.id);
                                  }}
                                  className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors"
                                >
                                  <X className="w-3 h-3" /> Decline
                                </button>
                              </div>
                            )}

                            {isConnReq && isAlreadyConnected && (
                              <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                                <Check className="w-3 h-3" /> Connected Friends
                              </div>
                            )}
                          </div>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Persona Switcher & Profile Dropdown */}
          <div className="relative" ref={userMenuRef}>
            {!isFirebaseAuthActive && currentUser.id === 'guest' ? (
              <button
                onClick={() => openModal('auth')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            ) : (
              <button
                id="user-persona-toggle-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-neutral-200 hover:border-neutral-300 bg-neutral-50 hover:bg-neutral-100 transition-all"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-blue-500/40"
                />
                <span className="hidden sm:inline text-xs font-semibold text-neutral-800 max-w-[100px] truncate">
                  {currentUser.name}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    currentUser.role === 'super_admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {currentUser.role === 'super_admin'
                    ? 'SUPER ADMIN'
                    : currentUser.userType
                    ? `USER • ${currentUser.userType.toUpperCase()}`
                    : 'USER'}
                </span>
              </button>
            )}

            {/* Persona Switcher Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-neutral-100">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-neutral-400 uppercase font-semibold">Active Account</p>
                    {isFirebaseAuthActive ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        Cloud Verified
                      </span>
                    ) : (
                      <span className="text-[10px] bg-neutral-150 text-neutral-600 font-semibold px-1.5 py-0.5 rounded">
                        {currentUser.id === 'guest' ? 'Guest' : 'Local User'}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-sm text-neutral-900 truncate">{currentUser.name}</p>
                  <p className="text-xs text-neutral-500 truncate">
                    {isFirebaseAuthActive && firebaseUserEmail ? firebaseUserEmail : `@${currentUser.username}`}
                  </p>
                  {currentUser.schoolName && (
                    <span className="inline-block mt-1 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full truncate max-w-full">
                      🏫 {currentUser.schoolName}
                    </span>
                  )}
                </div>

                {/* Auth Actions */}
                <div className="p-1 border-b border-neutral-100">
                  {isFirebaseAuthActive ? (
                    <button
                      onClick={async () => {
                        await signOutUser();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        openModal('auth');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In / Create Account</span>
                    </button>
                  )}
                </div>

                {/* Profile Link */}
                <div className="p-1 border-b border-neutral-100">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg flex items-center justify-between"
                  >
                    <span>View My Profile</span>
                    <span className="text-neutral-400 text-[10px]">@{currentUser.username}</span>
                  </button>
                  {isSchoolAuthorized(currentUser.schoolId) && (
                    <button
                      onClick={() => {
                        openModal('school_admin');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 rounded-lg flex items-center gap-1.5"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>School Staff / Page Portal</span>
                    </button>
                  )}
                  {isSuperAdmin && (
                    <button
                      onClick={() => {
                        openModal('super_admin');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50 rounded-lg flex items-center gap-1.5"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Super Admin Dashboard</span>
                    </button>
                  )}
                </div>

                {/* Reset Data */}
                <div className="pt-2 mt-1 border-t border-neutral-100 px-2">
                  <button
                    onClick={() => {
                      resetDemoData();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Local Cache</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-bar Search */}
      <div className="mt-2 md:hidden">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-neutral-400 pointer-events-none" />
          <input
            id="mobile-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (activeTab !== 'discover') setActiveTab('discover');
            }}
            placeholder="Search students, schools, clubs..."
            className="w-full bg-neutral-100 text-xs text-neutral-900 pl-9 pr-3 py-1.5 rounded-full border border-neutral-200 outline-none focus:bg-white focus:border-blue-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-neutral-400 hover:text-neutral-600 text-xs"
            >
              Clear
            </button>
          )}
        </form>
      </div>
    </header>
  );
};
