import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Compass, Film, PlusCircle, MessageSquare, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, openModal } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-neutral-200 px-2 py-1.5 flex items-center justify-around shadow-lg select-none">
      <button
        id="bottom-nav-home"
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
          activeTab === 'home' ? 'text-blue-600' : 'text-neutral-500'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Home</span>
      </button>

      <button
        id="bottom-nav-discover"
        onClick={() => setActiveTab('discover')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
          activeTab === 'discover' ? 'text-blue-600' : 'text-neutral-500'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Discover</span>
      </button>

      {/* Central Create Button */}
      <button
        id="bottom-nav-create"
        onClick={() => openModal('create_post')}
        className="flex flex-col items-center justify-center -mt-4 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white w-12 h-12 rounded-full shadow-md shadow-blue-500/30 active:scale-95 transition-transform"
      >
        <PlusCircle className="w-7 h-7" />
      </button>

      <button
        id="bottom-nav-reels"
        onClick={() => setActiveTab('reels')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
          activeTab === 'reels' ? 'text-blue-600' : 'text-neutral-500'
        }`}
      >
        <Film className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Reels</span>
      </button>

      <button
        id="bottom-nav-chat"
        onClick={() => setActiveTab('chat')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
          activeTab === 'chat' ? 'text-blue-600' : 'text-neutral-500'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Chat</span>
      </button>

      <button
        id="bottom-nav-profile"
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
          activeTab === 'profile' ? 'text-blue-600' : 'text-neutral-500'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Profile</span>
      </button>
    </div>
  );
};
