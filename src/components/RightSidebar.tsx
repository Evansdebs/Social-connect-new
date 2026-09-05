import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Challenge } from '../types';
import { Trophy, TrendingUp, UserPlus, Check, Flame, Zap, Swords } from 'lucide-react';
import { ChallengeArenaModal } from './Modals/ChallengeArenaModal';

export const RightSidebar: React.FC = () => {
  const {
    challenges,
    cheerChallenge,
    users,
    currentUser,
    connectedUserIds,
    requestConnection,
    setActiveTab,
    setSearchQuery,
    posts
  } = useApp();

  const [arenaChallenge, setArenaChallenge] = useState<Challenge | null>(null);

  const activeChallenge = challenges.find((c) => c.status === 'active') || challenges[0];

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
    <>
      <aside className="w-80 shrink-0 hidden xl:flex flex-col gap-4 py-4 select-none">
        {/* Inter-School Arena Live Spotlight */}
        {activeChallenge && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 p-4 shadow-lg overflow-hidden relative">
            {/* Glow */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 font-black text-xs uppercase tracking-wider">Arena</span>
                </div>
                <span className="text-[9px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse inline-block" />
                  LIVE
                </span>
              </div>

              {/* Stage badge */}
              {activeChallenge.stage && (
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2 inline-block">
                  {activeChallenge.stage}
                </span>
              )}

              <h4 className="font-black text-sm text-white leading-snug mb-1 line-clamp-2">
                {activeChallenge.title}
              </h4>

              {/* Schools face-off */}
              <div className="flex items-center gap-2 my-3">
                <div className="flex-1 text-center">
                  <img src={activeChallenge.schoolA.logo} alt={activeChallenge.schoolA.name}
                    className="w-8 h-8 rounded-xl object-cover mx-auto mb-1 ring-2 ring-blue-500/40"
                    onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${activeChallenge.schoolA.id}`; }} />
                  <p className="text-[9px] text-slate-300 font-bold line-clamp-1">{activeChallenge.schoolA.name.split(' ')[0]}</p>
                  <p className="text-sm font-black text-white">{(activeChallenge.schoolA.cheers || activeChallenge.schoolA.votes).toLocaleString()}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center">
                    <Swords className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <img src={activeChallenge.schoolB.logo} alt={activeChallenge.schoolB.name}
                    className="w-8 h-8 rounded-xl object-cover mx-auto mb-1 ring-2 ring-purple-500/40"
                    onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${activeChallenge.schoolB.id}`; }} />
                  <p className="text-[9px] text-slate-300 font-bold line-clamp-1">{activeChallenge.schoolB.name.split(' ')[0]}</p>
                  <p className="text-sm font-black text-white">{(activeChallenge.schoolB.cheers || activeChallenge.schoolB.votes).toLocaleString()}</p>
                </div>
              </div>

              {/* Battle bar */}
              {(() => {
                const cA = activeChallenge.schoolA.cheers || activeChallenge.schoolA.votes || 0;
                const cB = activeChallenge.schoolB.cheers || activeChallenge.schoolB.votes || 0;
                const total = cA + cB || 1;
                const pctA = Math.round((cA / total) * 100);
                const pctB = 100 - pctA;
                return (
                  <div className="mb-3">
                    <div className="h-2 w-full rounded-full overflow-hidden flex">
                      <div style={{ width: `${pctA}%` }} className="bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500" />
                      <div style={{ width: `${pctB}%` }} className="bg-gradient-to-l from-purple-600 to-fuchsia-500 transition-all duration-500" />
                    </div>
                    <div className="flex justify-between text-[9px] font-bold mt-0.5">
                      <span className="text-blue-400">{pctA}%</span>
                      <span className="text-slate-500">{activeChallenge.totalCheeringCount.toLocaleString()} fans</span>
                      <span className="text-purple-400">{pctB}%</span>
                    </div>
                  </div>
                );
              })()}

              {/* Quick Cheer + Enter Arena */}
              <div className="grid grid-cols-2 gap-1.5 mb-2">
                <button id="sidebar-cheer-a-btn"
                  onClick={() => cheerChallenge(activeChallenge.id, activeChallenge.schoolA.id)}
                  className="py-1.5 text-[10px] font-black rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/40 transition-all flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3" /> {activeChallenge.schoolA.name.split(' ')[0]}
                </button>
                <button id="sidebar-cheer-b-btn"
                  onClick={() => cheerChallenge(activeChallenge.id, activeChallenge.schoolB.id)}
                  className="py-1.5 text-[10px] font-black rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/40 transition-all flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3" /> {activeChallenge.schoolB.name.split(' ')[0]}
                </button>
              </div>
              <button id="enter-arena-btn"
                onClick={() => setArenaChallenge(activeChallenge)}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" /> Enter Full Arena
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
                return (
                  <div key={user.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-blue-600 truncate">{user.schoolName}</p>
                        <p className="text-[10px] text-neutral-400 truncate">
                          {(user.creatorTalents || []).slice(0, 2).join(' • ')}
                        </p>
                      </div>
                    </div>

                    <button
                      id={`connect-user-${user.id}-btn`}
                      onClick={() => requestConnection(user.id)}
                      className={`p-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shrink-0 ${
                        isConnected
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-neutral-100 hover:bg-blue-600 hover:text-white text-neutral-700'
                      }`}
                      title={isConnected ? 'Connected' : 'Send Connection Request'}
                    >
                      {isConnected ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-[10px]">Connected</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3 h-3" />
                          <span className="text-[10px]">Connect</span>
                        </>
                      )}
                    </button>
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

      {/* Arena Modal */}
      {arenaChallenge && (
        <ChallengeArenaModal
          challenge={arenaChallenge}
          onClose={() => setArenaChallenge(null)}
        />
      )}
    </>
  );
};