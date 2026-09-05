import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Trophy,
  Building2,
  Users,
  Compass,
  Flame,
  Award,
  ChevronRight,
  ExternalLink,
  Film,
  Calendar,
  Sparkles,
  Check,
  Clock,
  UserPlus,
  X
} from 'lucide-react';
import { PostCard } from '../Feed/PostCard';

export const DiscoverView: React.FC = () => {
  const {
    currentUser,
    searchQuery,
    setSearchQuery,
    users,
    schools,
    posts,
    reels,
    clubs,
    events,
    challenges,
    voteChallenge,
    setSelectedSchoolId,
    setActiveTab,
    viewProfile,
    openAvatarPreview,
    requestConnection,
    connectedUserIds,
    sentConnectionRequestUserIds,
    incomingConnectionRequests,
    acceptConnectionRequest,
    declineConnectionRequest,
    cancelConnectionRequest
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<
    'all' | 'people' | 'schools' | 'clubs' | 'posts' | 'reels' | 'events'
  >('all');

  const query = searchQuery.toLowerCase().trim();

  // Search filter logic - Exclude current user from discover/explore user list
  const filteredUsers = users.filter(
    (u) =>
      u.id !== currentUser.id &&
      (u.name.toLowerCase().includes(query) ||
        u.username.toLowerCase().includes(query) ||
        u.schoolName.toLowerCase().includes(query) ||
        u.creatorTalents.some((t) => t.toLowerCase().includes(query)))
  );

  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(query) ||
      s.username.toLowerCase().includes(query) ||
      s.location.toLowerCase().includes(query)
  );

  const filteredClubs = clubs.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query)
  );

  const filteredPosts = posts.filter(
    (p) =>
      p.text.toLowerCase().includes(query) ||
      p.tags.some((t) => t.toLowerCase().includes(query)) ||
      p.authorName.toLowerCase().includes(query)
  );

  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(query) ||
      e.schoolName.toLowerCase().includes(query) ||
      e.category.toLowerCase().includes(query)
  );

  return (
    <div className="space-y-5">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2 text-sky-200 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-sky-300" />
            <span>Campus Explore & Global Search</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mb-2">
            Discover Schools, Creators & Communities
          </h2>
          <p className="text-xs text-blue-100 mb-4 leading-relaxed">
            Find student innovators from other schools, join cross-campus clubs, cheer in inter-school derbies, and explore campus culture.
          </p>

          {/* Search bar inside explore */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across students, @usernames, schools, #hashtags..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white text-neutral-900 placeholder-neutral-400 text-xs font-medium border-0 shadow-lg outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(
          [
            { id: 'all', label: 'All Results' },
            { id: 'schools', label: `Schools (${filteredSchools.length})` },
            { id: 'people', label: `Students & Teachers (${filteredUsers.length})` },
            { id: 'clubs', label: `Clubs & Groups (${filteredClubs.length})` },
            { id: 'posts', label: `Posts (${filteredPosts.length})` },
            { id: 'events', label: `Events (${filteredEvents.length})` }
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Inter-School Rankings Leaderboard (Section 34) */}
      {(activeFilter === 'all' || activeFilter === 'schools') && !query && (
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-sm text-neutral-900">
                School Rankings & Social Leaderboard
              </h3>
            </div>
            <span className="text-[11px] text-neutral-400 font-medium">Updated live by engagement</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {schools.map((school, index) => (
              <div
                key={school.id}
                onClick={() => {
                  setSelectedSchoolId(school.id);
                  setActiveTab('schools');
                }}
                className="p-3.5 rounded-xl border border-neutral-200 hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer bg-neutral-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        index === 0
                          ? 'bg-amber-100 text-amber-800'
                          : index === 1
                          ? 'bg-neutral-200 text-neutral-700'
                          : index === 2
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {school.rankings.popularityScore}% Activity
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={school.logo}
                      alt={school.name}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-neutral-200"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-neutral-900 truncate">{school.name}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{school.location}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>{school.followersCount.toLocaleString()} followers</span>
                  <span className="font-semibold text-amber-600">
                    {school.rankings.challengeWins} Derby Wins 🏆
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inter-School Challenge Faceoff Arena (Section 33) */}
      {(activeFilter === 'all' || activeFilter === 'events') && (
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h3 className="font-extrabold text-sm text-neutral-900">
                Inter-School Challenges & Derby Arena
              </h3>
            </div>
            <span className="text-xs text-neutral-500">Vote & support your campus</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((ch) => {
              const total = (ch.schoolA.votes + ch.schoolB.votes) || 1;
              const pctA = Math.round((ch.schoolA.votes / total) * 100);
              const pctB = 100 - pctA;

              return (
                <div
                  key={ch.id}
                  className="p-4 rounded-xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white"
                >
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                    <span className="font-bold uppercase tracking-wider text-blue-600 text-[10px] bg-blue-50 px-2 py-0.5 rounded">
                      {ch.category} Derby
                    </span>
                    <span className="font-medium text-[11px] text-neutral-400">{ch.endDate}</span>
                  </div>

                  <h4 className="font-bold text-sm text-neutral-900 mb-1">{ch.title}</h4>
                  <p className="text-xs text-neutral-500 mb-3 line-clamp-2">{ch.description}</p>

                  {/* School Comparison Bar */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-blue-700">{ch.schoolA.name}</span>
                      <span className="text-indigo-700">{ch.schoolB.name}</span>
                    </div>
                    <div className="h-2.5 w-full bg-neutral-200 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${pctA}%` }}
                        className="bg-blue-600 h-full transition-all duration-500"
                      />
                      <div
                        style={{ width: `${pctB}%` }}
                        className="bg-indigo-600 h-full transition-all duration-500"
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-neutral-500">
                      <span>{pctA}% ({ch.schoolA.votes} cheers)</span>
                      <span>{pctB}% ({ch.schoolB.votes} cheers)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => voteChallenge(ch.id, ch.schoolA.id)}
                      disabled={!!ch.userVotedFor}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-colors truncate ${
                        ch.userVotedFor === ch.schoolA.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50'
                      }`}
                    >
                      {ch.userVotedFor === ch.schoolA.id ? '✓ Cheered' : `Cheer ${ch.schoolA.name.split(' ')[0]}`}
                    </button>
                    <button
                      onClick={() => voteChallenge(ch.id, ch.schoolB.id)}
                      disabled={!!ch.userVotedFor}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-colors truncate ${
                        ch.userVotedFor === ch.schoolB.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50'
                      }`}
                    >
                      {ch.userVotedFor === ch.schoolB.id ? '✓ Cheered' : `Cheer ${ch.schoolB.name.split(' ')[0]}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Schools Search Results */}
      {(activeFilter === 'all' || activeFilter === 'schools') && filteredSchools.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <h3 className="font-extrabold text-sm text-neutral-900 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Verified Schools & Campus Communities</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSchools.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  setSelectedSchoolId(s.id);
                  setActiveTab('schools');
                }}
                className="p-3.5 rounded-xl border border-neutral-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={s.logo}
                    alt={s.name}
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-neutral-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-xs text-neutral-900 truncate">{s.name}</p>
                      <span className="text-blue-600 text-xs font-bold">✓</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate">@{s.username} • {s.location}</p>
                    <p className="text-[10px] text-blue-600 font-medium mt-0.5">
                      {s.followersCount.toLocaleString()} followers • {s.studentCount} students
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Students & Creators Search Results */}
      {(activeFilter === 'all' || activeFilter === 'people') && filteredUsers.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <h3 className="font-extrabold text-sm text-neutral-900 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Students, Creators & Faculty</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredUsers.map((u) => {
              if (u.id === currentUser.id) return null;
              const isConnected = connectedUserIds.includes(u.id);
              const isPendingSent = sentConnectionRequestUserIds.includes(u.id);
              const incomingReq = incomingConnectionRequests.find(
                (r) => r.fromUserId === u.id
              );

              return (
                <div
                  key={u.id}
                  className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-2.5 mb-2">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      onClick={() =>
                        openAvatarPreview({
                          name: u.name,
                          username: u.username,
                          avatar: u.avatar,
                          school: u.schoolName,
                          userId: u.id
                        })
                      }
                      title="Tap to open profile picture"
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-500"
                    />
                    <div className="min-w-0">
                      <p
                        onClick={() => viewProfile(u.id)}
                        title="View profile"
                        className="font-bold text-xs text-neutral-900 truncate cursor-pointer hover:text-blue-600 hover:underline"
                      >
                        {u.name}
                      </p>
                      <p
                        onClick={() => viewProfile(u.id)}
                        title="View profile"
                        className="text-[10px] text-neutral-500 truncate cursor-pointer hover:text-blue-600 hover:underline"
                      >
                        @{u.username}
                      </p>
                      <p className="text-[10px] text-blue-600 font-semibold truncate">
                        🏫 {u.schoolName}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {(u.creatorTalents || []).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-white border border-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {isConnected ? (
                    <span className="w-full py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Connected
                    </span>
                  ) : incomingReq ? (
                    <div className="flex gap-1.5 w-full">
                      <button
                        onClick={() => acceptConnectionRequest(incomingReq.id)}
                        className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1 shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        onClick={() => declineConnectionRequest(incomingReq.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-700 flex items-center justify-center transition-colors"
                        title="Decline"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : isPendingSent ? (
                    <button
                      onClick={() => cancelConnectionRequest(u.id)}
                      className="w-full py-1.5 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center gap-1 transition-colors"
                      title="Click to cancel pending connection request"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      Pending (Cancel)
                    </button>
                  ) : (
                    <button
                      onClick={() => requestConnection(u.id)}
                      className="w-full py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1 transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Connect
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Matching Posts */}
      {(activeFilter === 'all' || activeFilter === 'posts') && filteredPosts.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-extrabold text-sm text-neutral-900 px-1">
            Matching Campus Posts ({filteredPosts.length})
          </h3>
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
