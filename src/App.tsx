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
import { AdminDashboardView } from './components/Admin/AdminDashboardView';
import { StudyBuddyView } from './components/StudyBuddy/StudyBuddyView';
import { MarketplaceView } from './components/Marketplace/MarketplaceView';
import { LoginView } from './components/Auth/LoginView';
import { GraduationCap } from 'lucide-react';

// Modals
import { CreateContentModal } from './components/Modals/CreateContentModal';
import { ReportModal } from './components/Modals/ReportModal';
import { ShareModal } from './components/Modals/ShareModal';
import { EditProfileModal } from './components/Modals/EditProfileModal';
import { SchoolAdminModal } from './components/Admin/SchoolAdminModal';
import { PlatformAdminModal } from './components/Admin/PlatformAdminModal';
import { AuthModal } from './components/Modals/AuthModal';

const AppContent: React.FC = () => {
  const { isAuthenticated, isAuthChecking, activeTab, activeModal, toast } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // 1. Initial authentication status check
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-xl shadow-blue-500/25 mb-4 animate-pulse">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <p className="font-black text-lg tracking-tight text-white">Campus Connect</p>
        <p className="text-xs text-slate-400 mt-1">Verifying campus credentials...</p>
      </div>
    );
  }

  // 2. Before users can view the main page or any content, they must first login
  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        {toast && (
          <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-2 pointer-events-none">
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
      </>
    );
  }

  // 3. Authenticated user viewing the main page and content
  return (
    <div className="min-h-screen bg-neutral-100/70 text-neutral-900 flex flex-col font-sans antialiased">
      {/* Top Fixed Header Navbar */}
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] h-full bg-white shadow-2xl p-4 overflow-y-auto animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onCloseMobileMenu={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Responsive Grid Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-6 pt-3 sm:pt-4 pb-24 md:pb-6 flex gap-4 lg:gap-6">
        {/* Left Primary Navigation Sidebar (Desktop) */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Center Dynamic Content View */}
        <main className="flex-1 min-w-0 max-w-full">
          {activeTab === 'home' && <Feed />}
          {activeTab === 'reels' && <ReelsViewer />}
          {activeTab === 'discover' && <DiscoverView />}
          {activeTab === 'schools' && <SchoolProfileView />}
          {activeTab === 'communities' && <CommunitiesView />}
          {activeTab === 'chat' && <ChatView />}
          {activeTab === 'events' && <EventsAndOpportunitiesView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'admin' && <AdminDashboardView />}
          {activeTab === 'studybuddy' && <StudyBuddyView />}
          {activeTab === 'marketplace' && <MarketplaceView />}
        </main>

        {/* Right Info & Widgets Sidebar (Visible on large desktop) */}
        {activeTab !== 'chat' && activeTab !== 'reels' && activeTab !== 'admin' && activeTab !== 'studybuddy' && activeTab !== 'marketplace' && <RightSidebar />}
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
      {(activeModal === 'platform_admin' || activeModal === 'super_admin') && <PlatformAdminModal />}
      {activeModal === 'auth' && <AuthModal />}

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

