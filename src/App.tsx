/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { RightSidebar } from './components/RightSidebar';
import { BottomNav } from './components/BottomNav';
import { Feed } from './components/Feed/Feed';
import { ReelsViewer } from './components/Reels/ReelsViewer';
import { DiscoverView } from './components/Discover/DiscoverView';
import { SchoolProfileView } from './components/Schools/SchoolProfileView';
import { CommunitiesView } from './components/Communities/CommunitiesView';
import { ChatView } from './components/Chat/ChatView';
import { EventsAndOpportunitiesView } from './components/Events/EventsAndOpportunitiesView';
import { ProfileView } from './components/Profile/ProfileView';

// Modals
import { CreateContentModal } from './components/Modals/CreateContentModal';
import { ReportModal } from './components/Modals/ReportModal';
import { ShareModal } from './components/Modals/ShareModal';
import { EditProfileModal } from './components/Modals/EditProfileModal';
import { SchoolAdminModal } from './components/Admin/SchoolAdminModal';
import { PlatformAdminModal } from './components/Admin/PlatformAdminModal';

const AppContent: React.FC = () => {
  const { activeTab, activeModal, toast } = useApp();

  return (
    <div className="min-h-screen bg-neutral-100/70 text-neutral-900 flex flex-col font-sans">
      {/* Top Fixed Header Navbar */}
      <Navbar />

      {/* Main Responsive Grid Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-6 pt-4 pb-20 md:pb-6 flex gap-5">
        {/* Left Primary Navigation Sidebar */}
        <Sidebar />

        {/* Center Dynamic Content View */}
        <main className="flex-1 min-w-0">
          {(activeTab === 'home' || activeTab === 'feed') && <Feed />}
          {activeTab === 'reels' && <ReelsViewer />}
          {activeTab === 'discover' && <DiscoverView />}
          {activeTab === 'schools' && <SchoolProfileView />}
          {activeTab === 'communities' && <CommunitiesView />}
          {activeTab === 'chat' && <ChatView />}
          {activeTab === 'events' && <EventsAndOpportunitiesView />}
          {activeTab === 'profile' && <ProfileView />}
        </main>

        {/* Right Info & Widgets Sidebar (Visible on desktop) */}
        {activeTab !== 'chat' && activeTab !== 'reels' && <RightSidebar />}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* Global Modals Manager */}
      {(activeModal === 'create_post' ||
        activeModal === 'create_reel' ||
        activeModal === 'create_story' ||
        activeModal === 'create_poll' ||
        activeModal === 'create_event') && <CreateContentModal />}

      {activeModal === 'report' && <ReportModal />}
      {activeModal === 'share' && <ShareModal />}
      {activeModal === 'edit_profile' && <EditProfileModal />}
      {activeModal === 'school_admin' && <SchoolAdminModal />}
      {activeModal === 'platform_admin' && <PlatformAdminModal />}

      {/* Toast Notifications System */}
      {toast && (
        <div className="fixed bottom-16 sm:bottom-6 right-4 z-50 flex flex-col gap-2 pointer-events-none">
          <div
            className={`pointer-events-auto px-4 py-2.5 rounded-2xl shadow-lg border text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-500 shadow-rose-500/20'
                : 'bg-neutral-900 text-white border-neutral-800 shadow-neutral-900/20'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

