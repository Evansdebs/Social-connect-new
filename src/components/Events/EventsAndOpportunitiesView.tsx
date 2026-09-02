import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  ExternalLink,
  Bookmark,
  Plus,
  Award,
  CheckCircle,
  Users
} from 'lucide-react';

export const EventsAndOpportunitiesView: React.FC = () => {
  const {
    events,
    toggleRsvpEvent,
    opportunities,
    toggleSaveOpportunity,
    openModal
  } = useApp();

  const [activeSection, setActiveSection] = useState<'events' | 'opportunities'>('events');
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('All');
  const [oppTypeFilter, setOppTypeFilter] = useState<string>('All');

  const filteredEvents = events.filter((e) =>
    eventCategoryFilter === 'All' ? true : e.category === eventCategoryFilter
  );

  const filteredOpportunities = opportunities.filter((o) =>
    oppTypeFilter === 'All' ? true : o.type === oppTypeFilter
  );

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-800 via-blue-800 to-indigo-900 rounded-3xl p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-sky-200 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-sky-300" />
            <span>Campus Social Calendar & Student Opportunities</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Events, Grants & Fellowships</h2>
          <p className="text-xs text-sky-100 max-w-lg mt-1">
            Discover upcoming inter-school sports matches, debate championships, STEM fairs, and high-value scholarship opportunities.
          </p>
        </div>

        <button
          onClick={() => openModal('create_event')}
          className="px-4 py-2.5 bg-white text-blue-900 rounded-full text-xs font-extrabold shadow-md hover:bg-neutral-100 transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4 text-blue-700" />
          <span>Post Campus Event</span>
        </button>
      </div>

      {/* Segment Switcher */}
      <div className="flex items-center justify-between gap-2 border-b border-neutral-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('events')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeSection === 'events'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Campus Events ({events.length})
          </button>
          <button
            onClick={() => setActiveSection('opportunities')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeSection === 'opportunities'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Student Opportunities ({opportunities.length})
          </button>
        </div>

        {/* Filter Pills */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs">
          {activeSection === 'events' ? (
            ['All', 'Sports', 'Academics'].map((cat) => (
              <button
                key={cat}
                onClick={() => setEventCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                  eventCategoryFilter === cat
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                {cat}
              </button>
            ))
          ) : (
            ['All', 'Scholarship', 'Competition', 'Internship'].map((t) => (
              <button
                key={t}
                onClick={() => setOppTypeFilter(t)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                  oppTypeFilter === t
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                {t}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Events View */}
      {activeSection === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="relative h-44 w-full bg-neutral-900">
                <img src={ev.coverImage} alt={ev.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-xl px-2.5 py-1 text-center shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase text-blue-700 block">
                    {ev.date.split(' ')[0]}
                  </span>
                  <span className="text-sm font-black text-neutral-900 leading-none">
                    {ev.date.split(' ')[1]?.replace(',', '')}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">
                    {ev.category}
                  </span>
                  <h3 className="font-bold text-base mt-1 drop-shadow">{ev.title}</h3>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-neutral-600 leading-relaxed">{ev.description}</p>

                <div className="space-y-1.5 text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{ev.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-medium text-neutral-700">
                      {ev.goingCount} going • {ev.interestedCount} interested
                    </span>
                  </div>
                </div>

                {/* RSVP Controls */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        toggleRsvpEvent(ev.id, ev.userStatus === 'going' ? null : 'going')
                      }
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        ev.userStatus === 'going'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                      }`}
                    >
                      {ev.userStatus === 'going' ? '✓ Going' : 'Going'}
                    </button>
                    <button
                      onClick={() =>
                        toggleRsvpEvent(ev.id, ev.userStatus === 'interested' ? null : 'interested')
                      }
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        ev.userStatus === 'interested'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                      }`}
                    >
                      {ev.userStatus === 'interested' ? '★ Interested' : 'Interested'}
                    </button>
                  </div>

                  <span className="text-[11px] text-blue-600 font-semibold truncate max-w-[130px]">
                    🏫 {ev.schoolName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Opportunities Board (Section 44) */}
      {activeSection === 'opportunities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {opp.type}
                  </span>
                  <button
                    onClick={() => toggleSaveOpportunity(opp.id)}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      opp.isSaved ? 'text-amber-500 bg-amber-50' : 'text-neutral-400 hover:bg-neutral-100'
                    }`}
                    title={opp.isSaved ? 'Bookmarked' : 'Bookmark Opportunity'}
                  >
                    <Bookmark className={`w-4 h-4 ${opp.isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <h3 className="font-extrabold text-sm text-neutral-900 leading-snug mb-1">
                  {opp.title}
                </h3>
                <p className="text-xs font-semibold text-blue-600 mb-2">{opp.organization}</p>
                <p className="text-xs text-neutral-600 leading-relaxed mb-3">{opp.description}</p>
              </div>

              <div>
                <div className="py-2 border-t border-neutral-100 text-[11px] text-neutral-500 flex items-center justify-between mb-3">
                  <span>📍 {opp.location}</span>
                  <span className="font-semibold text-rose-600">Deadline: {opp.deadline}</span>
                </div>

                <a
                  href={opp.link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Apply / Learn More</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
