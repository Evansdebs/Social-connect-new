import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Edit3,
  Award,
  Bookmark,
  Repeat,
  Image as ImageIcon,
  Film,
  FileText,
  Lock,
  Globe,
  Download,
  CheckCircle,
  Share2,
  Sparkles
} from 'lucide-react';
import { PostCard } from '../Feed/PostCard';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    posts,
    reels,
    savedPostIds,
    openModal,
    showToast,
    updateCurrentUserProfile
  } = useApp();

  const [activeProfileTab, setActiveProfileTab] = useState<
    'posts' | 'media' | 'reels' | 'reposts' | 'saved' | 'badges'
  >('posts');

  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  // User posts
  const myPosts = posts.filter(
    (p) => p.authorId === currentUser.id && p.type !== 'repost'
  );

  const myReposts = posts.filter(
    (p) => p.authorId === currentUser.id && p.type === 'repost'
  );

  const myMediaPosts = posts.filter(
    (p) => p.authorId === currentUser.id && (p.mediaUrls?.length || p.videoUrl)
  );

  const myReels = reels.filter((r) => r.creatorId === currentUser.id);

  const mySavedPosts = posts.filter((p) => savedPostIds.includes(p.id));

  return (
    <div className="space-y-5">
      {/* Profile Card Header (Section 90) */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs">
        {/* Cover Image */}
        <div className="h-44 sm:h-52 w-full relative bg-neutral-900">
          <img
            src={currentUser.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Profile Info Container */}
        <div className="px-5 sm:px-6 pb-6 relative">
          {/* Avatar & Controls Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 sm:-mt-16 mb-4 gap-4">
            <div className="flex items-end gap-3.5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1 shadow-lg ring-2 ring-neutral-200 shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div className="mb-1">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                    {currentUser.name}
                  </h1>
                  {currentUser.isVerified && (
                    <span className="text-blue-600 font-bold text-sm" title="Verified Creator">✓</span>
                  )}
                </div>
                <p className="text-xs font-semibold text-neutral-500">
                  @{currentUser.username} • <span className="capitalize">{currentUser.role.replace('_', ' ')}</span>
                </p>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => openModal('edit_profile')}
                className="px-4 py-2 rounded-full border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
                className="p-2 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
                title="Privacy & Safety Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* School & Class Level */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {currentUser.schoolName && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                🏫 {currentUser.schoolName}
              </span>
            )}
            {currentUser.classLevel && (
              <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-full">
                📚 {currentUser.classLevel}
              </span>
            )}
          </div>

          {/* Bio */}
          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed max-w-2xl mb-4">
            {currentUser.bio}
          </p>

          {/* Creator Talent Badges (Section 43) */}
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-1">
              Talents:
            </span>
            {(currentUser.creatorTalents || []).map((talent, idx) => (
              <span
                key={idx}
                className="text-xs bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-purple-800 px-2.5 py-0.5 rounded-full font-bold shadow-2xs"
              >
                ★ {talent}
              </span>
            ))}
          </div>

          {/* Followers / Following / Connections Counter Bar */}
          <div className="flex items-center gap-6 text-xs text-neutral-600 py-3 border-t border-neutral-100">
            <div>
              <strong className="font-extrabold text-neutral-900 text-sm">
                {currentUser.followersCount}
              </strong>{' '}
              followers
            </div>
            <div>
              <strong className="font-extrabold text-neutral-900 text-sm">
                {currentUser.followingCount}
              </strong>{' '}
              following
            </div>
            <div>
              <strong className="font-extrabold text-neutral-900 text-sm">
                {currentUser.connectionsCount}
              </strong>{' '}
              connections
            </div>
          </div>
        </div>

        {/* Profile Tabs Navigation */}
        <div className="flex items-center border-t border-neutral-200 px-4 overflow-x-auto scrollbar-none bg-neutral-50/50">
          {[
            { id: 'posts', label: `Posts (${myPosts.length})`, icon: FileText },
            { id: 'media', label: `Media (${myMediaPosts.length})`, icon: ImageIcon },
            { id: 'reels', label: `Reels (${myReels.length})`, icon: Film },
            { id: 'reposts', label: `Reposts (${myReposts.length})`, icon: Repeat },
            { id: 'saved', label: `Saved (${mySavedPosts.length})`, icon: Bookmark },
            { id: 'badges', label: `Badges (${currentUser.badges.length})`, icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeProfileTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveProfileTab(tab.id as any)}
                className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings / Privacy Drawer (Section 54 & 84) */}
      {showSettingsDrawer && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-neutral-900">Privacy & Safety Settings</h3>
            </div>
            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="text-xs text-neutral-400 hover:text-neutral-700 font-semibold"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-neutral-50 rounded-xl space-y-2">
              <span className="font-bold text-neutral-800 block">Content Download Permissions</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentUser.allowDownloads}
                  onChange={(e) =>
                    updateCurrentUserProfile({ allowDownloads: e.target.checked })
                  }
                  className="rounded text-blue-600"
                />
                <span>Allow other students to download my photos & videos</span>
              </label>
              <p className="text-[11px] text-neutral-400">
                When enabled, students can save eligible media directly to their devices.
              </p>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl space-y-2">
              <span className="font-bold text-neutral-800 block">Direct Messaging Safeguards</span>
              <select
                value={currentUser.whoCanMessage}
                onChange={(e) =>
                  updateCurrentUserProfile({ whoCanMessage: e.target.value as any })
                }
                className="w-full bg-white border border-neutral-200 rounded-lg p-1.5 text-xs outline-none"
              >
                <option value="everyone">Everyone on Campus Connect</option>
                <option value="connections">Connections Only</option>
                <option value="nobody">Nobody (Disabled)</option>
              </select>
              <p className="text-[11px] text-neutral-400">
                Controls who can initiate private message requests across schools.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Posts */}
      {activeProfileTab === 'posts' && (
        <div className="space-y-4">
          {myPosts.length > 0 ? (
            myPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200 text-neutral-500 text-xs">
              You haven’t posted any updates yet. Share your campus journey!
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Photos & Videos Media Grid */}
      {activeProfileTab === 'media' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {myMediaPosts.map((post) => (
            <div
              key={post.id}
              className="aspect-square rounded-2xl overflow-hidden bg-neutral-900 relative group cursor-pointer"
            >
              <img
                src={post.mediaUrls?.[0]}
                alt="Media"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                ❤️ {post.likesCount} • 💬 {post.commentsCount}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Reels */}
      {activeProfileTab === 'reels' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {myReels.map((reel) => (
            <div
              key={reel.id}
              className="aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-900 relative group cursor-pointer shadow-xs"
            >
              <img
                src={reel.thumbnailUrl}
                alt={reel.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                <p className="text-[11px] font-bold line-clamp-2">{reel.caption}</p>
                <span className="text-[10px] text-neutral-300 mt-1">❤️ {reel.likesCount}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Reposts */}
      {activeProfileTab === 'reposts' && (
        <div className="space-y-4">
          {myReposts.length > 0 ? (
            myReposts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200 text-neutral-500 text-xs">
              No reposted posts yet.
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Saved (Private Bookmarks) */}
      {activeProfileTab === 'saved' && (
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700" />
            <span>Only you can see your saved posts and resources.</span>
          </div>

          {mySavedPosts.length > 0 ? (
            mySavedPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200 text-neutral-500 text-xs">
              No saved posts in your collection yet.
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Badges & Achievements (Section 47) */}
      {activeProfileTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(currentUser.badges || []).map((badge, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-xs flex items-center gap-3.5"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-neutral-900">{badge}</h4>
                <p className="text-[11px] text-neutral-500">
                  Awarded for positive community contribution on Campus Connect
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
