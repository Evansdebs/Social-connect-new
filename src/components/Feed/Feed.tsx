import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StoriesBar } from './StoriesBar';
import { CreatePostCard } from './CreatePostCard';
import { PostCard } from './PostCard';
import { Globe, Building2, Users, Megaphone, Sparkles } from 'lucide-react';

export const Feed: React.FC = () => {
  const { posts, isPostsLoading, currentUser, followedUserIds, connectedUserIds } = useApp();
  
  // Fix #15: Persist feedFilter across tab switches in sessionStorage
  const [feedFilter, setFeedFilterState] = useState<
    'global' | 'my_school' | 'network' | 'announcements'
  >(() => {
    return (sessionStorage.getItem('cc_feed_filter') as any) || 'global';
  });

  const setFeedFilter = (filter: 'global' | 'my_school' | 'network' | 'announcements') => {
    setFeedFilterState(filter);
    sessionStorage.setItem('cc_feed_filter', filter);
  };

  // Filter posts based on selected feed tab
  const filteredPosts = posts.filter((post) => {
    if (feedFilter === 'my_school') {
      return (
        post.schoolId === currentUser.schoolId ||
        post.authorSchool === currentUser.schoolName
      );
    }
    if (feedFilter === 'network') {
      return (
        followedUserIds.includes(post.authorId) ||
        connectedUserIds.includes(post.authorId) ||
        post.authorId === currentUser.id
      );
    }
    if (feedFilter === 'announcements') {
      return post.isOfficialAnnouncement;
    }
    return true; // 'global' returns all
  });

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* 24h Campus Stories Bar */}
      <StoriesBar />

      {/* Quick Post Composer */}
      <CreatePostCard />

      {/* Feed Scope Switcher Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-x-auto scrollbar-none">
        {[
          { id: 'global', label: 'Global Campus', icon: Globe },
          {
            id: 'my_school',
            label: currentUser.schoolName ? `${currentUser.schoolName.split(' ')[0]}` : 'My School',
            icon: Building2
          },
          { id: 'network', label: 'Connections', icon: Users },
          { id: 'announcements', label: 'Announcements', icon: Megaphone }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = feedFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFeedFilter(tab.id as any)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Posts Stream */}
      {isPostsLoading ? (
        // Fix #10: Post loading skeleton to prevent false empty-state flicker
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-28 h-3.5 bg-neutral-200 rounded" />
                  <div className="w-40 h-2.5 bg-neutral-150 rounded" />
                </div>
              </div>
              <div className="space-y-2 pt-1">
                <div className="w-full h-3 bg-neutral-200 rounded" />
                <div className="w-4/5 h-3 bg-neutral-200 rounded" />
                <div className="w-1/2 h-3 bg-neutral-200 rounded" />
              </div>
              <div className="h-44 bg-neutral-150 rounded-xl" />
              <div className="flex justify-between pt-2 border-t border-neutral-100">
                <div className="w-16 h-4 bg-neutral-200 rounded" />
                <div className="w-16 h-4 bg-neutral-200 rounded" />
                <div className="w-16 h-4 bg-neutral-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-10 text-center text-xs text-neutral-500 shadow-xs space-y-2">
          <p className="font-bold text-sm text-neutral-800">No posts in this stream yet</p>
          <p className="max-w-xs mx-auto text-neutral-500">
            Be the first student to post an update, share a moment from your campus, or switch to Global Campus feed.
          </p>
        </div>
      )}
    </div>
  );
};
