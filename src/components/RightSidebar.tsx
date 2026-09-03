import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, TrendingUp, UserPlus, Check, Flame, ChevronRight, Clock, X } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const {
    challenges,
    voteChallenge,
    users,
    currentUser,
    connectedUserIds,
    sentConnectionRequestUserIds,
    incomingConnectionRequests,
    requestConnection,
    acceptConnectionRequest,
    declineConnectionRequest,
    cancelConnectionRequest,
    setActiveTab,
    setSearchQuery,
    viewProfile,
    openAvatarPreview,
    posts
  } = useApp();

  const activeChallenge = challenges[0];

  const candidateUsers = users.filter(
    (u) => u.id !== currentUser.id && u.role !== 'super_admin'
  );

  const trendingTopics = useMemo(() => {
    const tagCount: Record<string, number> = {};
    posts.forEach((p) => (p.tags || []).forEach((t) => {
      const tag = t.startsWith('#') ? t : `#${t}`;
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    }));
    const dynamic = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, postsCount: `${count} post${count !== 1 ? 's' : ''}`, category: 'Trending' }));
    if (dynamic.length === 0) {
      return [
        { tag: '#InterSchoolDerby', postsCount: 'Trending', category: 'High School Sports' },
        { tag: '#RoboticsLeague', postsCount: 'Trending', category: 'STEM & Coding' },
        { tag: '#CampusConnect', postsCount: 'Trending', category: 'Platform' },
        { tag: '#StudentLife', postsCount: 'Trending', category: 'Campus' },
        { tag: '#Competitions', postsCount: 'Trending', category: 'Events' }
      ];
    }
    return dynamic;
  }, [posts]);

  return (
    <aside className="w-80 shrink-0 hidden xl:flex flex-col gap-4 py-4 select-none">
      {/* Inter-School Challenge Live Spotlight */}
      {activeChallenge && (
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Inter-School Arena</span>
            </div>
            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold animate-pulse">
              LIVE DERBY
            </span>
          </div>

          <h4 className="font-bold text-sm text-neutral-900 leading-snug mb-1">
            {activeChallenge.title}
          </h4>
          <p className="text-[11px] text-neutral-500 mb-3 line-clamp-2">
            {activeChallenge.description}
          </p>

          {/* School Faceoff Visual */}
          <div className="bg-neutral-50 rounded-xl p-2.5 border border-neutral-100 mb-3">
            <div className="flex items-center justify-between gap-2 text-xs font-semibold mb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <img
                  src={activeChallenge.schoolA.logo}
                  alt={activeChallenge.schoolA.name}
                  className="w-6 h-6 rounded-md object-cover"
                />
                <span className="truncate text-[11px] text-neutral-800">
                  {activeChallenge.schoolA.name}
                </span>
              </div>
              <span className="text-neutral-400 text-xs font-bold">VS</span>
              <div className="flex items-center gap-1.5 min-w-0 justify-end">
                <span className="truncate text-[11px] text-neutral-800">
                  {activeChallenge.schoolB.name}
                </span>
                <img
                  src={activeChallenge.schoolB.logo}
                  alt={activeChallenge.schoolB.name}
                  className="w-6 h-6 rounded-md object-cover"
                />
              </div>
            </div>

            {/* Live Cheer Progress Bar */}
            {(() => {
              const total = (activeChallenge.schoolA.votes + activeChallenge.schoolB.votes) || 1;
              const pctA = Math.round((activeChallenge.schoolA.votes / total) * 100);
              const pctB = 100 - pctA;
              return (
                <div>
                  <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${pctA}%` }}
                      className="bg-blue-600 h-full transition-all duration-500"
                    />
                    <div
                      style={{ width: `${pctB}%` }}
                      className="bg-indigo-600 h-full transition-all duration-500"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-neutral-500 mt-1">
                    <span className="text-blue-700">{pctA}% ({activeChallenge.schoolA.votes})</span>
                    <span className="text-indigo-700">{pctB}% ({activeChallenge.schoolB.votes})</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Cheering Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              id="cheer-school-a-btn"
              onClick={() => voteChallenge(activeChallenge.id, activeChallenge.schoolA.id)}
              disabled={!!activeChallenge.userVotedFor}
              className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-colors truncate ${
                activeChallenge.userVotedFor === activeChallenge.schoolA.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50'
              }`}
            >
              {activeChallenge.userVotedFor === activeChallenge.schoolA.id ? '✓ Cheered!' : 'Cheer School A'}
            </button>
            <button
              id="cheer-school-b-btn"
              onClick={() => voteChallenge(activeChallenge.id, activeChallenge.schoolB.id)}
              disabled={!!activeChallenge.userVotedFor}
              className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-colors truncate ${
                activeChallenge.userVotedFor === activeChallenge.schoolB.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50'
              }`}
            >
              {activeChallenge.userVotedFor === activeChallenge.schoolB.id ? '✓ Cheered!' : 'Cheer School B'}
            </button>
          </div>
        </div>
      )}

      {/* Trending Topics & Hashtags */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-neutral-800 font-bold text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Trending on Campus</span>
          </div>
          <Flame className="w-4 h-4 text-orange-500" />
        </div>

        <div className="space-y-2.5">
          {trendingTopics.map((topic, i) => (
            <div
              key={i}
              onClick={() => {
                setSearchQuery(topic.tag);
                setActiveTab('discover');
              }}
              className="cursor-pointer group flex flex-col p-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span>{topic.category}</span>
                <span>{topic.postsCount}</span>
              </div>
              <p className="font-bold text-xs text-neutral-900 group-hover:text-blue-600 transition-colors">
                {topic.tag}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* People You May Know (Cross-Campus Discovery) */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-xs uppercase tracking-wider text-neutral-800">
            People You May Know
          </p>
          <span className="text-[10px] text-neutral-400">Cross-Campus</span>
        </div>

        {candidateUsers.length > 0 ? (
          <div className="space-y-3">
            {candidateUsers.slice(0, 3).map((user) => {
              const isConnected = connectedUserIds.includes(user.id);
              const isPendingSent = sentConnectionRequestUserIds.includes(user.id);
              const incomingReq = incomingConnectionRequests.find(
                (r) => r.fromUserId === user.id
              );

              return (
                <div key={user.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      onClick={() =>
                        openAvatarPreview({
                          name: user.name,
                          username: user.username,
                          avatar: user.avatar,
                          school: user.schoolName,
                          userId: user.id
                        })
                      }
                      title="Tap to open profile picture"
                      className="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-500"
                    />
                    <div className="min-w-0">
                      <p
                        onClick={() => viewProfile(user.id)}
                        title="View profile"
                        className="text-xs font-bold text-neutral-900 truncate cursor-pointer hover:text-blue-600 hover:underline"
                      >
                        {user.name}
                      </p>
                      <p className="text-[10px] text-blue-600 truncate">{user.schoolName}</p>
                      <p className="text-[10px] text-neutral-400 truncate">
                        {(user.creatorTalents || []).slice(0, 2).join(' • ')}
                      </p>
                    </div>
                  </div>

                  {isConnected ? (
                    <span
                      className="p-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0"
                      title="Connected Friends"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-[10px]">Connected</span>
                    </span>
                  ) : incomingReq ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        id={`accept-conn-${user.id}-btn`}
                        onClick={() => acceptConnectionRequest(incomingReq.id)}
                        className="p-1.5 px-2 rounded-lg text-xs font-semibold flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs"
                        title="Accept Connection Request"
                      >
                        <Check className="w-3 h-3" />
                        <span className="text-[10px]">Accept</span>
                      </button>
                      <button
                        id={`decline-conn-${user.id}-btn`}
                        onClick={() => declineConnectionRequest(incomingReq.id)}
                        className="p-1.5 px-1.5 rounded-lg text-xs font-semibold flex items-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-all"
                        title="Decline"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : isPendingSent ? (
                    <button
                      id={`cancel-conn-${user.id}-btn`}
                      onClick={() => cancelConnectionRequest(user.id)}
                      className="p-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 shrink-0 transition-all"
                      title="Click to cancel pending connection request"
                    >
                      <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                      <span className="text-[10px]">Pending</span>
                    </button>
                  ) : (
                    <button
                      id={`connect-user-${user.id}-btn`}
                      onClick={() => requestConnection(user.id)}
                      className="p-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shrink-0 bg-neutral-100 hover:bg-blue-600 hover:text-white text-neutral-700"
                      title="Send Connection Request"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span className="text-[10px]">Connect</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-neutral-500 text-center py-2">
            New students joining Campus Connect will appear here.
          </p>
        )}
      </div>

      {/* Footer Meta */}
      <div className="px-2 text-[11px] text-neutral-400 space-y-1">
        <p>© 2026 Campus Connect • School Community Network</p>
        <p className="text-[10px]">Safe social media for schools, clubs, students & creators.</p>
      </div>
    </aside>
  );
};
