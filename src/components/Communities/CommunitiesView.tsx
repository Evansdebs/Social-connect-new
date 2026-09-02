import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Plus, ShieldCheck, Check, Search, Sparkles, BookOpen } from 'lucide-react';

export const CommunitiesView: React.FC = () => {
  const { clubs, toggleJoinClub, openModal, currentUser } = useApp();
  const [filter, setFilter] = useState<'all' | 'official' | 'joined'>('all');
  const [search, setSearch] = useState('');

  const filteredClubs = clubs.filter((c) => {
    if (filter === 'official' && !c.isOfficialClub) return false;
    if (filter === 'joined' && !c.isJoined) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-800 via-purple-800 to-blue-800 rounded-3xl p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-indigo-200 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4 text-indigo-300" />
            <span>Campus Clubs & Cross-School Communities</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Student Societies & Groups</h2>
          <p className="text-xs text-indigo-100 max-w-lg mt-1">
            Connect with students sharing your passion for Robotics, Debate, Football, Photography, Arts, and Climate Action across schools.
          </p>
        </div>

        <button
          onClick={() => openModal('create_post')}
          className="px-4 py-2.5 bg-white text-indigo-900 rounded-full text-xs font-extrabold shadow-md hover:bg-neutral-100 transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4 text-indigo-700" />
          <span>Start Club / Group</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: `All Clubs (${clubs.length})` },
            { id: 'joined', label: 'My Joined Clubs' },
            { id: 'official', label: 'Official School Clubs' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clubs & societies..."
            className="pl-8 pr-3 py-1.5 bg-white border border-neutral-200 rounded-full text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-indigo-500 w-full sm:w-60"
          />
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClubs.map((club) => (
          <div
            key={club.id}
            className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
          >
            {/* Cover image header */}
            <div className="h-32 w-full relative bg-neutral-900">
              <img src={club.coverImage} alt={club.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute top-3 right-3">
                {club.isOfficialClub ? (
                  <span className="text-[10px] bg-blue-600/90 backdrop-blur text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3 h-3 text-sky-200" />
                    <span>Official School Club</span>
                  </span>
                ) : (
                  <span className="text-[10px] bg-neutral-900/80 backdrop-blur text-white font-bold px-2 py-0.5 rounded-full shadow-sm">
                    Cross-Campus Community
                  </span>
                )}
              </div>
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
                  {club.category}
                </span>
                <h3 className="font-extrabold text-sm sm:text-base leading-tight drop-shadow">
                  {club.name}
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                  {club.description}
                </p>

                {club.rules && club.rules.length > 0 && (
                  <div className="bg-neutral-50 rounded-xl p-2.5 border border-neutral-100 mb-3 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-700">
                      <BookOpen className="w-3 h-3 text-neutral-500" />
                      <span>Community Guidelines</span>
                    </div>
                    {club.rules.slice(0, 2).map((rule, idx) => (
                      <p key={idx} className="text-[10px] text-neutral-500">
                        • {rule}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Join Action */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-neutral-900">{club.membersCount}</span>
                  <span className="text-neutral-500 ml-1">students</span>
                  {club.schoolName && (
                    <span className="text-[11px] text-blue-600 block font-medium">
                      🏫 {club.schoolName}
                    </span>
                  )}
                </div>

                <button
                  id={`join-club-${club.id}`}
                  onClick={() => toggleJoinClub(club.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    club.isJoined
                      ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                >
                  {club.isJoined ? 'Joined ✓' : 'Join Club'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
