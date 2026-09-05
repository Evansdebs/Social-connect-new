import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Story } from '../../types';
import { Plus, Sparkles, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

export const StoriesBar: React.FC = () => {
  const { stories, currentUser, openModal, markStoryViewed, viewProfile, openAvatarPreview } = useApp();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyLiked, setStoryLiked] = useState(false);

  const handleOpenStory = (index: number) => {
    setActiveStoryIndex(index);
    markStoryViewed(stories[index].id);
  };

  const handleNextStory = () => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      markStoryViewed(stories[activeStoryIndex + 1].id);
      setStoryLiked(false);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setStoryLiked(false);
    }
  };

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  return (
    <>
      {/* Horizontal Stories Strip */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 shadow-xs overflow-hidden">
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {/* Add Story Button */}
          <div
            onClick={() => openModal('create_story')}
            className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 select-none group"
          >
            <div className="relative w-14 h-14 rounded-full p-0.5 border-2 border-dashed border-blue-400 group-hover:border-blue-600 transition-colors flex items-center justify-center">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full rounded-full object-cover"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white ring-2 ring-white shadow-xs group-hover:scale-110 transition-transform">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-neutral-700 max-w-[62px] truncate text-center">
              Your Story
            </span>
          </div>

          {/* User Stories List */}
          {stories.map((story, index) => {
            const hasUnviewed = !story.viewed;
            return (
              <div
                key={story.id}
                onClick={() => handleOpenStory(index)}
                className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 select-none group"
              >
                <div
                  className={`w-14 h-14 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                    hasUnviewed
                      ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-[2.5px]'
                      : 'border-2 border-neutral-200'
                  }`}
                >
                  <img
                    src={story.authorAvatar}
                    alt={story.authorName}
                    className="w-full h-full rounded-full object-cover bg-white ring-1 ring-white"
                  />
                </div>
                <span className="text-[11px] font-medium text-neutral-700 max-w-[64px] truncate text-center">
                  {story.authorName.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm h-[560px] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between text-white border border-neutral-800">
            {/* Top progress timer bars */}
            <div className="absolute top-3 left-3 right-3 flex items-center gap-1 z-20">
              {stories.map((s, idx) => (
                <div
                  key={s.id}
                  className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full bg-white transition-all duration-300 ${
                      idx < (activeStoryIndex || 0)
                        ? 'w-full'
                        : idx === activeStoryIndex
                        ? 'w-full'
                        : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Story Header */}
            <div className="relative z-20 p-4 pt-6 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeStory.authorAvatar}
                  alt={activeStory.authorName}
                  onClick={() => {
                    openAvatarPreview({
                      name: activeStory.authorName,
                      avatar: activeStory.authorAvatar,
                      school: activeStory.authorSchool,
                      userId: activeStory.authorId
                    });
                  }}
                  title="Tap to open profile picture"
                  className="w-9 h-9 rounded-full object-cover border border-white/40 cursor-pointer hover:ring-2 hover:ring-blue-400"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p
                      onClick={() => {
                        setActiveStoryIndex(null);
                        viewProfile(activeStory.authorId);
                      }}
                      title="View profile"
                      className="font-bold text-xs text-white cursor-pointer hover:underline hover:text-blue-200"
                    >
                      {activeStory.authorName}
                    </p>
                    <span className="text-[10px] text-blue-300 bg-blue-900/60 px-1.5 py-0.5 rounded">
                      {activeStory.authorSchool}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-300">{activeStory.createdAt}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveStoryIndex(null)}
                className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Main Content */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden">
              {activeStory.type === 'photo' && activeStory.mediaUrl ? (
                <img
                  src={activeStory.mediaUrl}
                  alt="Story content"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center p-6 text-center text-lg font-bold bg-gradient-to-br ${
                    activeStory.bgColor || 'from-indigo-600 to-purple-800'
                  }`}
                >
                  <p className="leading-relaxed drop-shadow-md">{activeStory.caption}</p>
                </div>
              )}

              {/* Caption Overlay for photo stories */}
              {activeStory.type === 'photo' && activeStory.caption && (
                <div className="absolute bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <p className="text-sm font-medium text-white drop-shadow">
                    {activeStory.caption}
                  </p>
                </div>
              )}

              {/* Touch/Click navigation regions */}
              <div
                onClick={handlePrevStory}
                className="absolute left-0 top-16 bottom-16 w-1/3 cursor-pointer"
                title="Previous Story"
              />
              <div
                onClick={handleNextStory}
                className="absolute right-0 top-16 bottom-16 w-1/3 cursor-pointer"
                title="Next Story"
              />
            </div>

            {/* Story Footer Controls */}
            <div className="relative z-20 p-3 bg-black/60 backdrop-blur-xs flex items-center gap-2">
              <input
                type="text"
                placeholder={`Reply to ${activeStory.authorName.split(' ')[0]}...`}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white placeholder-neutral-300 text-xs px-3 py-2 rounded-full outline-none focus:ring-1 focus:ring-white transition-all"
              />
              <button
                onClick={() => setStoryLiked(!storyLiked)}
                className={`p-2 rounded-full transition-transform active:scale-125 ${
                  storyLiked ? 'text-rose-500 bg-white/20' : 'text-white hover:bg-white/20'
                }`}
              >
                <Heart className={`w-5 h-5 ${storyLiked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleNextStory}
                className="p-2 rounded-full text-white hover:bg-white/20"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
