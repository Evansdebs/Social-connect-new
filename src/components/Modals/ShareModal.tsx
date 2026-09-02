import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Copy, Check, Send, Share2 } from 'lucide-react';

export const ShareModal: React.FC = () => {
  const { closeModal, modalData, users, currentUser, sendMessage, showToast } = useApp();

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'success');
  };

  const handleShareToUser = (targetUserId: string, targetName: string) => {
    // Send post preview message
    showToast(`Shared with ${targetName}!`, 'success');
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 px-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-sm text-neutral-900">Share Content</h3>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Direct link copy */}
          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between gap-2">
            <span className="text-neutral-600 truncate font-mono text-[11px]">
              {window.location.origin}/post/{modalData?.post?.id || modalData?.reel?.id || 'share'}
            </span>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>

          {/* Quick Share to Connections */}
          <div>
            <p className="font-bold text-neutral-800 mb-2">Send Directly to Campus Connections</p>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {users
                .filter((u) => u.id !== currentUser.id)
                .slice(0, 4)
                .map((user) => (
                  <div
                    key={user.id}
                    className="p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-neutral-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-neutral-500 truncate">🏫 {user.schoolName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleShareToUser(user.id, user.name)}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
