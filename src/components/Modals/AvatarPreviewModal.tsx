import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, ExternalLink, Download, Sparkles } from 'lucide-react';

export const AvatarPreviewModal: React.FC = () => {
  const { closeModal, modalTargetData, viewProfile, users } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  if (!modalTargetData || !modalTargetData.avatar) {
    return null;
  }

  const { name, username, avatar, school, userId } = modalTargetData;

  // If userId wasn't directly passed, attempt to find user by username or name
  const matchedUser = userId
    ? users.find((u) => u.id === userId)
    : users.find((u) => (username && u.username === username) || u.name === name);

  const effectiveUserId = userId || matchedUser?.id;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = avatar;
    link.download = `${username || name.toLowerCase().replace(/\s+/g, '_')}_profile.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGoToProfile = () => {
    if (effectiveUserId) {
      viewProfile(effectiveUserId);
    } else {
      closeModal();
    }
  };

  return (
    <div
      id="avatar-preview-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeModal}
    >
      <div
        id="avatar-preview-modal-content"
        className="relative max-w-sm w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="avatar-modal-close-btn"
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
          aria-label="Close photo preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Picture Frame */}
        <div className="relative mt-2 mb-4 group">
          <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden p-1.5 bg-gradient-to-tr from-blue-500 via-indigo-500 to-sky-400 shadow-xl shadow-blue-500/20">
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover rounded-full bg-neutral-800"
              onError={(e) => {
                // Fallback image if broken
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  name
                )}&background=3b82f6&color=fff&size=512`;
              }}
            />
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-1 mb-6">
          <h3 className="font-extrabold text-lg text-white tracking-tight">{name}</h3>
          {username && (
            <p className="text-xs text-neutral-400 font-medium">@{username}</p>
          )}
          {school && (
            <span className="inline-block mt-1 text-[11px] font-semibold text-blue-300 bg-blue-950/70 border border-blue-800/60 px-2.5 py-0.5 rounded-full">
              🏫 {school}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="w-full grid grid-cols-2 gap-2.5 pt-2 border-t border-neutral-800">
          <button
            id="avatar-modal-download-btn"
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-neutral-400" />
            <span>Save Photo</span>
          </button>

          {effectiveUserId && (
            <button
              id="avatar-modal-view-profile-btn"
              onClick={handleGoToProfile}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <User className="w-4 h-4" />
              <span>View Profile</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
