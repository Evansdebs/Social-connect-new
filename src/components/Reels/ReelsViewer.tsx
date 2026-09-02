import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  MessageCircle,
  Repeat,
  Share2,
  Bookmark,
  Download,
  Music,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Play,
  Pause,
  UserPlus,
  Check,
  Sparkles,
  Plus
} from 'lucide-react';

export const ReelsViewer: React.FC = () => {
  const {
    reels,
    likeReel,
    followedUserIds,
    toggleFollowUser,
    savedPostIds,
    toggleSavePost,
    openModal,
    showToast
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [commentsList, setCommentsList] = useState<string[]>([
    'Incredible energy! Loving this campus vibe 🙌',
    'Living Spring representing on top 🏆',
    'Wait, is that the new lab on the west wing?!'
  ]);
  const [newComment, setNewComment] = useState('');

  const currentReel = reels[currentIndex] || reels[0];
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    if (!currentReel.allowDownloads) {
      showToast('Creator has disabled downloads for this reel', 'error');
      return;
    }
    const a = document.createElement('a');
    a.href = currentReel.videoUrl;
    a.download = `reel_${currentReel.id}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Reel video download started!', 'success');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentsList([...commentsList, newComment.trim()]);
    setNewComment('');
  };

  const isFollowing = followedUserIds.includes(currentReel?.creatorId);

  if (!currentReel) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-500">
        <p>No Reels uploaded yet.</p>
        <button
          onClick={() => openModal('create_reel')}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-semibold"
        >
          Create First Reel
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-[calc(100vh-140px)] min-h-[580px] max-h-[780px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex items-center justify-center select-none">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={currentReel.videoUrl}
        poster={currentReel.thumbnailUrl}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlayPause}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Play/Pause Overlay indicator */}
      {!isPlaying && (
        <div
          onClick={togglePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer pointer-events-auto"
        >
          <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white">
            <Play className="w-8 h-8 ml-1" />
          </div>
        </div>
      )}

      {/* Top Header: Audio Volume toggle & Create Reel */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="text-white font-extrabold text-sm drop-shadow-md tracking-wide">
            Reels
          </span>
          <span className="text-[10px] bg-red-500/80 text-white font-bold px-2 py-0.5 rounded-full backdrop-blur">
            Campus Pulse
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => openModal('create_reel')}
            className="p-2 rounded-full bg-blue-600/90 backdrop-blur text-white hover:bg-blue-600 transition-colors flex items-center gap-1 text-xs px-3 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Right Side Interaction Rail */}
      <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4 text-white">
        {/* Creator Avatar with follow badge */}
        <div className="relative mb-1">
          <img
            src={currentReel.creatorAvatar}
            alt={currentReel.creatorName}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-md"
          />
          <button
            onClick={() => toggleFollowUser(currentReel.creatorId)}
            className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shadow-sm transition-transform active:scale-125 ${
              isFollowing ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          >
            {isFollowing ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          </button>
        </div>

        {/* Like Button */}
        <div className="flex flex-col items-center">
          <button
            id="reel-like-btn"
            onClick={() => likeReel(currentReel.id)}
            className={`p-2.5 rounded-full backdrop-blur-md transition-transform active:scale-130 ${
              currentReel.likedByUser
                ? 'bg-rose-600 text-white'
                : 'bg-black/40 text-white hover:bg-black/60'
            }`}
          >
            <Heart className={`w-6 h-6 ${currentReel.likedByUser ? 'fill-current' : ''}`} />
          </button>
          <span className="text-[11px] font-bold drop-shadow mt-1">
            {currentReel.likesCount}
          </span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center">
          <button
            id="reel-comments-toggle-btn"
            onClick={() => setShowCommentsDrawer(!showCommentsDrawer)}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <span className="text-[11px] font-bold drop-shadow mt-1">
            {currentReel.commentsCount + commentsList.length - 3}
          </span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center">
          <button
            id="reel-share-btn"
            onClick={() => openModal('share', { reel: currentReel })}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
          >
            <Share2 className="w-6 h-6" />
          </button>
          <span className="text-[11px] font-bold drop-shadow mt-1">Share</span>
        </div>

        {/* Download Button (respects allowDownloads) */}
        {currentReel.allowDownloads && (
          <div className="flex flex-col items-center">
            <button
              id="reel-download-btn"
              onClick={handleDownload}
              className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
              title="Download Reel"
            >
              <Download className="w-6 h-6 text-sky-300" />
            </button>
            <span className="text-[11px] font-bold drop-shadow mt-1">Save</span>
          </div>
        )}

        {/* Rotating Sound Disc Icon */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-900 ring-2 ring-white/40 flex items-center justify-center animate-spin duration-[4000ms]">
          <Music className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Bottom Metadata: Creator info, caption, and music track */}
      <div className="absolute bottom-4 left-4 right-16 z-20 text-white space-y-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="font-extrabold text-sm text-white drop-shadow">
            @{currentReel.creatorUsername}
          </span>
          <span className="text-[11px] bg-blue-600/80 backdrop-blur px-2 py-0.5 rounded-full font-semibold">
            🏫 {currentReel.creatorSchool}
          </span>
        </div>

        <p className="text-xs text-neutral-100 font-medium line-clamp-2 drop-shadow pointer-events-auto">
          {currentReel.caption}
        </p>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1.5 pointer-events-auto">
          {(currentReel.hashtags || []).map((tag, i) => (
            <span key={i} className="text-[11px] font-bold text-sky-300 drop-shadow">
              #{tag}
            </span>
          ))}
        </div>

        {/* Music Sound Bar */}
        <div className="flex items-center gap-2 text-[11px] text-neutral-200 font-medium pointer-events-auto bg-black/40 backdrop-blur px-3 py-1 rounded-full w-fit max-w-full truncate">
          <Music className="w-3.5 h-3.5 shrink-0 text-amber-300" />
          <span className="truncate">
            {currentReel.soundTitle} • {currentReel.soundArtist}
          </span>
        </div>
      </div>

      {/* Vertical Navigation Up/Down Chevrons for Desktop / Mouse */}
      <div className="absolute right-3 top-16 z-20 flex flex-col gap-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 disabled:opacity-30 text-white transition-colors"
          title="Previous Reel"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === reels.length - 1}
          className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 disabled:opacity-30 text-white transition-colors"
          title="Next Reel"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Comments Drawer Overlay */}
      {showCommentsDrawer && (
        <div className="absolute inset-x-0 bottom-0 top-1/3 bg-white text-neutral-900 rounded-t-3xl z-30 p-4 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <span className="font-bold text-sm">Comments ({commentsList.length})</span>
            <button
              onClick={() => setShowCommentsDrawer(false)}
              className="text-xs text-neutral-400 hover:text-neutral-700 font-semibold"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2 space-y-2.5 text-xs">
            {commentsList.map((comm, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                  U{idx + 1}
                </div>
                <div className="bg-neutral-100 rounded-xl p-2 flex-1">
                  <p className="text-neutral-800">{comm}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="pt-2 border-t border-neutral-100 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 text-xs bg-neutral-100 px-3 py-2 rounded-full outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-3 py-2 bg-blue-600 disabled:opacity-40 text-white text-xs font-semibold rounded-full"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
