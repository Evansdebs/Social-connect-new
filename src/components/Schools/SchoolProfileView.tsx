import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Trophy,
  Calendar,
  Image as ImageIcon,
  Flame,
  CheckCircle2,
  Share2,
  Shield,
  Plus
} from 'lucide-react';
import { PostCard } from '../Feed/PostCard';

export const SchoolProfileView: React.FC = () => {
  const {
    activeSchool,
    schools,
    setSelectedSchoolId,
    posts,
    clubs,
    events,
    challenges,
    schoolMemories,
    currentUser,
    openModal,
    showToast
  } = useApp();

  const [activeSchoolTab, setActiveSchoolTab] = useState<
    'feed' | 'clubs' | 'events' | 'memories' | 'challenges'
  >('feed');

  const [isFollowingSchool, setIsFollowingSchool] = useState(false);

  // Filter school-specific data
  const schoolPosts = posts.filter(
    (p) => p.schoolId === activeSchool.id || p.authorSchool === activeSchool.name
  );

  const schoolClubs = clubs.filter(
    (c) => c.schoolId === activeSchool.id || c.schoolName === activeSchool.name
  );

  const schoolEvents = events.filter((e) => e.schoolId === activeSchool.id);

  const schoolAlbums = schoolMemories.filter((m) => m.schoolId === activeSchool.id);

  const schoolChallenges = challenges.filter(
    (ch) => ch.schoolA.id === activeSchool.id || ch.schoolB.id === activeSchool.id
  );

  return (
    <div className="space-y-5">
      {/* School Switcher Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
          Select School:
        </span>
        {schools.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSchoolId(s.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeSchool.id === s.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <img src={s.logo} alt={s.name} className="w-4 h-4 rounded-full object-cover" />
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      {/* Official School Header Card (Section 28 & 89) */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs">
        {/* Cover Photo */}
        <div className="h-44 sm:h-56 w-full relative bg-neutral-800">
          <img
            src={activeSchool.coverImage}
            alt={activeSchool.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Profile Details Container */}
        <div className="px-5 sm:px-6 pb-6 relative">
          {/* School Crest Logo */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 sm:-mt-16 mb-4 gap-4">
            <div className="flex items-end gap-3.5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1.5 shadow-lg border-2 border-white ring-1 ring-neutral-200 shrink-0">
                <img
                  src={activeSchool.logo}
                  alt={activeSchool.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                    {activeSchool.name}
                  </h1>
                  <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-50" />
                </div>
                <p className="text-xs font-semibold text-neutral-500">
                  @{activeSchool.username} • Est. {activeSchool.established}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsFollowingSchool(!isFollowingSchool);
                  showToast(
                    isFollowingSchool
                      ? `Unfollowed ${activeSchool.name}`
                      : `Now following official updates from ${activeSchool.name}!`,
                    'success'
                  );
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                  isFollowingSchool
                    ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isFollowingSchool ? 'Following School' : '+ Follow School'}
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast('School profile link copied to clipboard!', 'info');
                }}
                className="p-2 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
                title="Share School Page"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {currentUser.role === 'school_admin' && (
                <button
                  onClick={() => openModal('school_admin')}
                  className="px-3 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </button>
              )}
            </div>
          </div>

          {/* Motto & Description */}
          <div className="space-y-2 mb-4">
            <p className="text-xs font-bold text-blue-700 italic">
              "{activeSchool.motto}"
            </p>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed max-w-3xl">
              {activeSchool.description}
            </p>
          </div>

          {/* Location & Website Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mb-5">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{activeSchool.location}, {activeSchool.region}</span>
            </div>
            <a
              href={activeSchool.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{activeSchool.website.replace('https://', '')}</span>
            </a>
          </div>

          {/* School Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Campus Rank</p>
              <p className="text-base font-black text-blue-700">#{activeSchool.rankings.activeRank}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">School Followers</p>
              <p className="text-base font-black text-neutral-800">{activeSchool.followersCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Students Enrolled</p>
              <p className="text-base font-black text-neutral-800">{activeSchool.studentCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Derby Trophies</p>
              <p className="text-base font-black text-amber-600">{activeSchool.rankings.challengeWins} 🏆</p>
            </div>
          </div>
        </div>

        {/* School Tabs Navigation */}
        <div className="flex items-center border-t border-neutral-200 px-4 overflow-x-auto scrollbar-none bg-neutral-50/50">
          {[
            { id: 'feed', label: `School Feed (${schoolPosts.length})` },
            { id: 'clubs', label: `Official Clubs (${schoolClubs.length})` },
            { id: 'events', label: `Campus Events (${schoolEvents.length})` },
            { id: 'memories', label: `School Memories (${schoolAlbums.length})` },
            { id: 'challenges', label: `Derbies (${schoolChallenges.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSchoolTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeSchoolTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: School Feed & Announcements */}
      {activeSchoolTab === 'feed' && (
        <div className="space-y-4">
          {currentUser.role === 'school_admin' && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-semibold">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>You are managing {activeSchool.name} official announcements.</span>
              </div>
              <button
                onClick={() => openModal('create_post')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg"
              >
                + Announcement
              </button>
            </div>
          )}

          {schoolPosts.length > 0 ? (
            schoolPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200 text-neutral-500 text-xs">
              No posts from this school yet.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: School Clubs & Societies (Section 31) */}
      {activeSchoolTab === 'clubs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schoolClubs.map((club) => (
            <div
              key={club.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden p-4 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  <img
                    src={club.coverImage}
                    alt={club.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900 leading-snug">
                      {club.name}
                    </h4>
                    <p className="text-[11px] text-blue-600 font-medium">{club.category}</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-600 line-clamp-2 mb-3">
                  {club.description}
                </p>
                {club.leadTeacherOrAdmin && (
                  <p className="text-[10px] text-neutral-400 font-medium mb-3">
                    Faculty Patron: {club.leadTeacherOrAdmin}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                <span className="text-neutral-500 font-medium">{club.membersCount} active members</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Official Club
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Campus Events */}
      {activeSchoolTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schoolEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs flex flex-col"
            >
              <img src={ev.coverImage} alt={ev.title} className="h-36 w-full object-cover" />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 font-bold mb-1">
                    <span className="text-blue-600">{ev.category}</span>
                    <span>{ev.date}</span>
                  </div>
                  <h4 className="font-bold text-sm text-neutral-900 mb-1">{ev.title}</h4>
                  <p className="text-xs text-neutral-600 line-clamp-2 mb-2">{ev.description}</p>
                </div>
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                  <span>📍 {ev.location}</span>
                  <span className="font-semibold text-neutral-700">{ev.goingCount} attending</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: School Memories (Section 42) */}
      {activeSchoolTab === 'memories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {schoolAlbums.map((album) => (
            <div
              key={album.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs group"
            >
              <div className="relative h-44 w-full bg-neutral-900 overflow-hidden">
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <span className="text-[10px] bg-blue-600 font-bold px-2 py-0.5 rounded uppercase">
                      Memory Album • {album.year}
                    </span>
                    <h4 className="font-bold text-sm mt-1">{album.title}</h4>
                    <p className="text-[11px] text-neutral-300">{album.photosCount} photos archived</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Inter-School Challenges for this School */}
      {activeSchoolTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schoolChallenges.map((ch) => (
            <div
              key={ch.id}
              className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-xs"
            >
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase">
                {ch.category} Derby
              </span>
              <h4 className="font-bold text-sm text-neutral-900 mt-2 mb-1">{ch.title}</h4>
              <p className="text-xs text-neutral-500 mb-3">{ch.description}</p>
              <div className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between text-xs font-semibold">
                <span>{ch.schoolA.name} ({ch.schoolA.votes})</span>
                <span className="text-neutral-400 font-bold">VS</span>
                <span>{ch.schoolB.name} ({ch.schoolB.votes})</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
