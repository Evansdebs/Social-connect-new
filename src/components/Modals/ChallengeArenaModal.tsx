import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Challenge } from '../../types';
import {
  X, Zap, Trophy, Flame, Send, MessageSquare, Users, Star,
  Clock, ChevronRight, Shield, Award, Swords
} from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  vx: number;
  vy: number;
  life: number;
  opacity: number;
}

interface ChallengeArenaModalProps {
  challenge: Challenge;
  onClose: () => void;
}

const EMOJIS = ['🔥', '⚡', '🏆', '💥', '🎯', '⭐', '🚀', '💪', '🎉', '🔥'];
const CATEGORY_COLORS: Record<string, { a: string; b: string }> = {
  Quiz: { a: 'from-blue-600 to-cyan-500', b: 'from-purple-600 to-fuchsia-500' },
  Coding: { a: 'from-emerald-600 to-teal-500', b: 'from-orange-500 to-amber-400' },
  Debate: { a: 'from-rose-600 to-pink-500', b: 'from-indigo-600 to-violet-500' },
  Sports: { a: 'from-amber-500 to-yellow-400', b: 'from-red-600 to-rose-500' },
  Dance: { a: 'from-pink-500 to-fuchsia-400', b: 'from-violet-600 to-purple-500' },
  Talent: { a: 'from-teal-500 to-cyan-400', b: 'from-amber-600 to-orange-500' },
};

export const ChallengeArenaModal: React.FC<ChallengeArenaModalProps> = ({ challenge, onClose }) => {
  const { currentUser, cheerChallenge, addChallengeHype } = useApp();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [hypeText, setHypeText] = useState('');
  const [isCheeringA, setIsCheeringA] = useState(false);
  const [isCheeringB, setIsCheeringB] = useState(false);
  const [activeSection, setActiveSection] = useState<'arena' | 'hype'>('arena');
  const [lastCheerSide, setLastCheerSide] = useState<'A' | 'B' | null>(null);
  const hypeEndRef = useRef<HTMLDivElement>(null);
  const particleId = useRef(0);

  const colors = CATEGORY_COLORS[challenge.category] || CATEGORY_COLORS.Quiz;

  const cheersA = challenge.schoolA.cheers || challenge.schoolA.votes || 0;
  const cheersB = challenge.schoolB.cheers || challenge.schoolB.votes || 0;
  const totalCheers = cheersA + cheersB;
  const pctA = totalCheers > 0 ? Math.round((cheersA / totalCheers) * 100) : 50;
  const pctB = 100 - pctA;

  useEffect(() => {
    if (activeSection === 'hype') {
      hypeEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [challenge.hypeMessages, activeSection]);

  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.25,
            life: p.life - 1,
            opacity: Math.max(0, p.life / 40),
          }))
          .filter((p) => p.life > 0)
      );
    }, 16);
    return () => clearInterval(timer);
  }, [particles.length]);

  const spawnParticles = (side: 'A' | 'B') => {
    const baseX = side === 'A' ? 20 : 80;
    const newParticles: Particle[] = Array.from({ length: 12 }, () => ({
      id: particleId.current++,
      x: baseX + (Math.random() - 0.5) * 20,
      y: 60,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: -(Math.random() * 4 + 2),
      life: 40,
      opacity: 1,
    }));
    setParticles((prev) => [...prev.slice(-30), ...newParticles]);
  };

  const handleCheer = (schoolId: string, side: 'A' | 'B') => {
    if (side === 'A') setIsCheeringA(true);
    else setIsCheeringB(true);
    cheerChallenge(challenge.id, schoolId);
    spawnParticles(side);
    setLastCheerSide(side);
    setTimeout(() => {
      if (side === 'A') setIsCheeringA(false);
      else setIsCheeringB(false);
    }, 600);
  };

  const handleSendHype = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hypeText.trim()) return;
    addChallengeHype(challenge.id, hypeText);
    setHypeText('');
  };

  const stageColor =
    challenge.stage === 'Grand Finals' ? 'bg-amber-500 text-white' :
    challenge.stage === 'Semifinals' ? 'bg-violet-500 text-white' :
    challenge.stage === 'Quarterfinals' ? 'bg-blue-500 text-white' :
    'bg-emerald-500 text-white';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Stadium Banner */}
        <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 px-5 pt-5 pb-4 overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-2 border-white" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-white" />
          </div>

          <div className="flex items-start justify-between mb-3 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {challenge.stage && (
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${stageColor}`}>
                    {challenge.stage}
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700/50">
                  {challenge.category}
                </span>
                <span className="text-[9px] text-rose-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse inline-block" />
                  LIVE
                </span>
              </div>
              <h2 className="text-sm font-black text-white mt-2 leading-tight line-clamp-2">{challenge.title}</h2>
              {challenge.prizeOrTrophy && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] text-amber-400 font-bold">{challenge.prizeOrTrophy}</span>
                </div>
              )}
            </div>
            <button onClick={onClose} className="ml-3 w-8 h-8 rounded-xl bg-slate-700/60 hover:bg-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-all flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Schools Face-off */}
          <div className="relative flex items-center gap-3 mt-2">
            <div className="flex-1 text-center">
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${colors.a} p-0.5 shadow-lg transition-transform duration-300 ${isCheeringA ? 'scale-110' : ''}`}>
                <img src={challenge.schoolA.logo} alt={challenge.schoolA.name} className="w-full h-full rounded-[14px] object-cover bg-slate-800"
                  onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${challenge.schoolA.id}`; }} />
              </div>
              <p className="text-[10px] font-bold text-white mt-1.5 leading-tight line-clamp-2 px-1">{challenge.schoolA.name}</p>
              <p className="text-xl font-black text-white mt-0.5">{cheersA.toLocaleString()}</p>
              <p className="text-[9px] text-slate-400 font-medium">cheers</p>
            </div>

            <div className="flex-shrink-0 text-center">
              <div className="w-10 h-10 bg-slate-700 border-2 border-slate-600 rounded-2xl flex items-center justify-center mx-auto">
                <Swords className="w-5 h-5 text-slate-300" />
              </div>
              <p className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-widest">VS</p>
            </div>

            <div className="flex-1 text-center">
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${colors.b} p-0.5 shadow-lg transition-transform duration-300 ${isCheeringB ? 'scale-110' : ''}`}>
                <img src={challenge.schoolB.logo} alt={challenge.schoolB.name} className="w-full h-full rounded-[14px] object-cover bg-slate-800"
                  onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${challenge.schoolB.id}`; }} />
              </div>
              <p className="text-[10px] font-bold text-white mt-1.5 leading-tight line-clamp-2 px-1">{challenge.schoolB.name}</p>
              <p className="text-xl font-black text-white mt-0.5">{cheersB.toLocaleString()}</p>
              <p className="text-[9px] text-slate-400 font-medium">cheers</p>
            </div>

            {/* Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {particles.map((p) => (
                <div key={p.id} className="absolute text-base select-none"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, opacity: p.opacity, transform: 'translate(-50%, -50%)' }}>
                  {p.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Battle Bar */}
          <div className="mt-4">
            <div className="flex h-2.5 rounded-full overflow-hidden">
              <div className={`bg-gradient-to-r ${colors.a} transition-all duration-500`} style={{ width: `${pctA}%` }} />
              <div className={`bg-gradient-to-l ${colors.b} transition-all duration-500`} style={{ width: `${pctB}%` }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] font-black text-slate-300">{pctA}%</span>
              <span className="text-[10px] text-slate-500">{challenge.totalCheeringCount.toLocaleString()} total cheers</span>
              <span className="text-[10px] font-black text-slate-300">{pctB}%</span>
            </div>
          </div>

          {/* Cheer Buttons */}
          <div className="mt-3 flex gap-2">
            <button onClick={() => handleCheer(challenge.schoolA.id, 'A')}
              className={`flex-1 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 bg-gradient-to-r ${colors.a} text-white shadow-lg hover:brightness-110`}>
              <Zap className="w-3.5 h-3.5" />
              Cheer {challenge.schoolA.name.split(' ')[0]}
            </button>
            <button onClick={() => handleCheer(challenge.schoolB.id, 'B')}
              className={`flex-1 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 bg-gradient-to-r ${colors.b} text-white shadow-lg hover:brightness-110`}>
              <Zap className="w-3.5 h-3.5" />
              Cheer {challenge.schoolB.name.split(' ')[0]}
            </button>
          </div>
          {lastCheerSide && (
            <p className="text-center text-[10px] text-emerald-400 font-bold mt-2">⚡ Your cheer is tilting the battle!</p>
          )}
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-slate-700/50 bg-slate-900 flex-shrink-0">
          {(['arena', 'hype'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveSection(tab)}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                activeSection === tab ? 'text-white border-amber-400' : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}>
              {tab === 'arena' ? <Shield className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
              {tab === 'arena' ? 'Match Info' : 'Hype Board'}
              {tab === 'hype' && (challenge.hypeMessages?.length || 0) > 0 && (
                <span className="bg-amber-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {challenge.hypeMessages!.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
          {activeSection === 'arena' && (
            <div className="p-4 space-y-3">
              <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/40">
                <p className="text-xs text-slate-300 leading-relaxed">{challenge.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: <Users className="w-4 h-4 text-blue-400" />, val: challenge.totalCheeringCount.toLocaleString(), label: 'Campus Fans' },
                  { icon: <Clock className="w-4 h-4 text-emerald-400" />, val: Math.max(0, Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / 86400000)), label: 'Days Left' },
                  { icon: <Flame className="w-4 h-4 text-orange-400" />, val: cheersA.toLocaleString(), label: `${challenge.schoolA.name.split(' ')[0]} Cheers` },
                  { icon: <Flame className="w-4 h-4 text-fuchsia-400" />, val: cheersB.toLocaleString(), label: `${challenge.schoolB.name.split(' ')[0]} Cheers` },
                ].map(({ icon, val, label }, i) => (
                  <div key={i} className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/40 text-center">
                    <div className="flex justify-center mb-1">{icon}</div>
                    <p className="text-base font-black text-white">{val}</p>
                    <p className="text-[10px] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
              {challenge.stage && (
                <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/40">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Tournament Path</h4>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['League Derby', 'Quarterfinals', 'Semifinals', 'Grand Finals'].map((stage, i) => {
                      const stages = ['League Derby', 'Quarterfinals', 'Semifinals', 'Grand Finals'];
                      const currentIdx = stages.indexOf(challenge.stage || '');
                      const isActive = stage === challenge.stage;
                      const isPassed = i < currentIdx;
                      return (
                        <React.Fragment key={stage}>
                          <div className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${isActive ? 'bg-amber-500 text-white' : isPassed ? 'bg-slate-600 text-slate-400 line-through' : 'bg-slate-700/50 text-slate-500'}`}>
                            {stage}
                          </div>
                          {i < 3 && <ChevronRight className={`w-3 h-3 flex-shrink-0 ${isPassed ? 'text-slate-500' : 'text-slate-600'}`} />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'hype' && (
            <div className="flex flex-col" style={{ minHeight: '300px' }}>
              <div className="flex-1 p-4 space-y-3">
                {(!challenge.hypeMessages || challenge.hypeMessages.length === 0) && (
                  <div className="text-center py-10">
                    <Flame className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No hype messages yet.</p>
                    <p className="text-[10px] text-slate-600 mt-1">Be the first to fire up the crowd! 🔥</p>
                  </div>
                )}
                {challenge.hypeMessages?.map((msg) => (
                  <div key={msg.id} className="flex gap-2.5">
                    <img src={msg.authorAvatar} alt={msg.authorName} className="w-7 h-7 rounded-full object-cover flex-shrink-0 ring-1 ring-slate-600"
                      onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.authorId}`; }} />
                    <div className="flex-1 min-w-0">
                      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-tl-sm p-2.5">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className="text-[10px] font-black text-white">{msg.authorName}</span>
                          <span className="text-[9px] text-slate-500">•</span>
                          <span className="text-[9px] text-slate-400">{msg.authorSchool}</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">{msg.text}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5 px-1">
                        {msg.schoolCheered !== 'Both Teams' && <Star className="w-2.5 h-2.5 text-amber-400" />}
                        <span className="text-[9px] text-slate-500">{msg.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={hypeEndRef} />
              </div>
              <div className="p-3 border-t border-slate-700/50 bg-slate-900 flex-shrink-0">
                <form onSubmit={handleSendHype} className="flex gap-2">
                  <img src={currentUser.avatar} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0 ring-1 ring-slate-600" />
                  <div className="flex-1 flex gap-2 bg-slate-800 border border-slate-700/50 rounded-2xl px-3 py-1.5">
                    <input value={hypeText} onChange={(e) => setHypeText(e.target.value)}
                      placeholder="Drop your rally cry! 🔥" maxLength={200}
                      className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 outline-none min-w-0" />
                    <button type="submit" disabled={!hypeText.trim()} className="text-amber-400 hover:text-amber-300 disabled:opacity-30 transition-colors">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
