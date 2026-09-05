import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CampusEvent, EventAttendee } from '../../types';
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
  Users,
  QrCode,
  Download,
  Share2,
  Check,
  X,
  MessageSquare,
  ShieldCheck,
  Ticket,
  CalendarPlus,
  ChevronRight
} from 'lucide-react';

export const EventsAndOpportunitiesView: React.FC = () => {
  const {
    events,
    toggleRsvpEvent,
    checkInEvent,
    currentUser,
    opportunities,
    toggleSaveOpportunity,
    openModal,
    startDirectMessage,
    users
  } = useApp();

  const [activeSection, setActiveSection] = useState<'events' | 'opportunities'>('events');
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('All');
  const [oppTypeFilter, setOppTypeFilter] = useState<string>('All');

  // Modal States
  const [selectedPassEvent, setSelectedPassEvent] = useState<CampusEvent | null>(null);
  const [selectedAttendeesEvent, setSelectedAttendeesEvent] = useState<CampusEvent | null>(null);
  const [attendeeFilter, setAttendeeFilter] = useState<'all' | 'checkedIn'>('all');
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);

  const filteredEvents = events.filter((e) =>
    eventCategoryFilter === 'All' ? true : e.category === eventCategoryFilter
  );

  const filteredOpportunities = opportunities.filter((o) =>
    oppTypeFilter === 'All' ? true : o.type === oppTypeFilter
  );

  // Helper: Download standard .ics file
  const downloadIcs = (event: CampusEvent) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Campus Connect//Campus Social Network//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id}@campusconnect.edu`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, ' ')}`,
      `LOCATION:${event.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper: Generate Google Calendar Link
  const getGoogleCalendarUrl = (event: CampusEvent) => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.description}\n\nOrganized by: ${event.schoolName}\nPowered by Campus Connect`);
    const location = encodeURIComponent(event.location);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  // Helper: Copy event link
  const copyEventLink = (event: CampusEvent) => {
    navigator.clipboard.writeText(`${window.location.origin}/#event-${event.id}`);
    setCopiedEventId(event.id);
    setTimeout(() => setCopiedEventId(null), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-800 via-blue-800 to-indigo-900 rounded-3xl p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-sky-200 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-sky-300" />
            <span>Campus Social Calendar & Opportunities</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Events, Passes & Fellowships</h2>
          <p className="text-xs text-sky-100 max-w-lg mt-1">
            Browse inter-school sports matches, hackathons, and symposiums. RSVP to generate your dynamic Digital Event Pass and export to your personal calendar.
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
            ['All', 'Sports', 'Academics', 'Arts', 'Competition'].map((cat) => (
              <button
                key={cat}
                onClick={() => setEventCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  eventCategoryFilter === cat
                    ? 'bg-neutral-900 text-white dark:bg-blue-600'
                    : 'text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                {cat}
              </button>
            ))
          ) : (
            ['All', 'Scholarship', 'Competition', 'Internship', 'Workshop'].map((t) => (
              <button
                key={t}
                onClick={() => setOppTypeFilter(t)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  oppTypeFilter === t
                    ? 'bg-neutral-900 text-white dark:bg-blue-600'
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
        filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredEvents.map((ev) => {
            const isUserGoing = ev.userStatus === 'going';
            const isUserCheckedIn = ev.checkedInUserIds?.includes(currentUser.id);
            const attendeesList = ev.attendees || [];

            return (
              <div
                key={ev.id}
                className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Event Image Banner */}
                <div className="relative h-48 w-full bg-neutral-900 overflow-hidden">
                  <img
                    src={ev.coverImage}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Date Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-2xl px-3 py-1.5 text-center shadow-md">
                    <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider block">
                      {ev.date.split(' ')[0]}
                    </span>
                    <span className="text-base font-black text-neutral-900 leading-none">
                      {ev.date.split(' ')[1]?.replace(',', '')}
                    </span>
                  </div>

                  {/* Top Right Quick Actions */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => copyEventLink(ev)}
                      className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-all text-xs"
                      title="Share / Copy Link"
                    >
                      {copiedEventId === ev.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setSelectedPassEvent(ev)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/90 hover:bg-blue-600 backdrop-blur-md rounded-full text-white text-xs font-bold shadow-md transition-all"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Event Pass</span>
                    </button>
                  </div>

                  {/* Bottom Header Meta */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] bg-blue-600/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {ev.category}
                    </span>
                    <h3 className="font-extrabold text-lg mt-1 drop-shadow-md leading-snug line-clamp-1">{ev.title}</h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">{ev.description}</p>

                  {/* Time & Venue */}
                  <div className="space-y-1.5 text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="font-medium text-neutral-700">{ev.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="font-medium text-neutral-700">{ev.location}</span>
                    </div>
                  </div>

                  {/* "Who's Going" Facepile Bar */}
                  <div
                    onClick={() => setSelectedAttendeesEvent(ev)}
                    className="p-2.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-150 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex -space-x-2 overflow-hidden">
                        {attendeesList.slice(0, 4).map((att) => (
                          <img
                            key={att.id}
                            src={att.avatar}
                            alt={att.name}
                            title={att.name}
                            className="w-7 h-7 rounded-full object-cover border-2 border-white ring-1 ring-neutral-200"
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-neutral-800">
                        {ev.goingCount} going • {ev.interestedCount} interested
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
                      <span>Guest List</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* RSVP & Calendar Export Toolbar */}
                  <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleRsvpEvent(ev.id, isUserGoing ? null : 'going')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isUserGoing
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                        }`}
                      >
                        {isUserGoing ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Going</span>
                          </>
                        ) : (
                          'Going'
                        )}
                      </button>

                      <button
                        onClick={() =>
                          toggleRsvpEvent(ev.id, ev.userStatus === 'interested' ? null : 'interested')
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          ev.userStatus === 'interested'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                        }`}
                      >
                        {ev.userStatus === 'interested' ? '★ Interested' : 'Interested'}
                      </button>
                    </div>

                    {/* Calendar Dropdown / Export Links */}
                    <div className="flex items-center gap-1.5">
                      <a
                        href={getGoogleCalendarUrl(ev)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                        title="Add to Google Calendar"
                      >
                        <CalendarPlus className="w-3.5 h-3.5 text-blue-600" />
                        <span className="hidden sm:inline text-[11px]">Google</span>
                      </a>

                      <button
                        onClick={() => downloadIcs(ev)}
                        className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                        title="Download .ics Calendar File"
                      >
                        <Download className="w-3.5 h-3.5 text-neutral-600" />
                        <span className="hidden sm:inline text-[11px]">.ics</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm text-neutral-800 mb-1">No campus events found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
              No events match the selected category. Check back soon or switch categories to explore other activities.
            </p>
            <button
              onClick={() => setEventCategoryFilter('All')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              View All Campus Events
            </button>
          </div>
        )
      )}

      {/* Opportunities Board */}
      {activeSection === 'opportunities' && (
        filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-150">
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

                <h3 className="font-extrabold text-sm text-neutral-900 leading-snug mb-1.5 line-clamp-2">
                  {opp.title}
                </h3>
                <p className="text-xs text-blue-700 font-semibold mb-2">{opp.organization}</p>
                <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-4">
                  {opp.description}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">
                  Deadline: <strong className="text-neutral-700">{opp.deadline}</strong>
                </span>
                <a
                  href={opp.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  <span>Apply</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm text-neutral-800 mb-1">No opportunities found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
              Explore scholarships, grants, and internships across all categories.
            </p>
            <button
              onClick={() => setOppTypeFilter('All')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              View All Opportunities
            </button>
          </div>
        )
      )}

      {/* ================= MODAL 1: DIGITAL EVENT PASS & CHECK-IN TICKET ================= */}
      {selectedPassEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-150">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 p-6 text-white relative">
              <button
                onClick={() => setSelectedPassEvent(null)}
                className="absolute top-4 right-4 p-1.5 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                  Campus Digital Pass
                </span>
                <span className="text-xs text-blue-200">•</span>
                <span className="text-xs text-blue-100 font-semibold">{selectedPassEvent.category}</span>
              </div>

              <h2 className="text-xl font-black leading-snug">{selectedPassEvent.title}</h2>
              <p className="text-xs text-sky-100 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{selectedPassEvent.location}</span>
              </p>
            </div>

            {/* Ticket Body with Notched Edges */}
            <div className="p-6 space-y-5 relative">
              {/* Notches */}
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-neutral-900 rounded-full" />
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-neutral-900 rounded-full" />

              {/* Attendee Info Card */}
              <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      Ticket Holder
                    </span>
                    <h4 className="font-black text-sm text-neutral-900">{currentUser.name}</h4>
                    <span className="text-xs text-neutral-500">@{currentUser.username} • {currentUser.schoolName || 'Campus'}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Pass Code
                  </span>
                  <span className="font-mono font-black text-blue-600 text-xs">
                    {selectedPassEvent.eventCode || 'PASS-9821'}
                  </span>
                </div>
              </div>

              {/* QR Code Graphic & Verification Stamp */}
              <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-neutral-50 to-neutral-100 rounded-2xl border-2 border-dashed border-neutral-300 relative">
                {/* SVG QR Code Simulation */}
                <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-inner flex items-center justify-center border border-neutral-200">
                  <QrCode className="w-32 h-32 text-neutral-800" />
                </div>

                <div className="mt-3 text-center">
                  <p className="font-mono text-xs font-bold text-neutral-600 tracking-widest">
                    #{selectedPassEvent.eventCode || 'PASS'}-{currentUser.id.substring(0, 6).toUpperCase()}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Scan at Campus Gate Entrance</p>
                </div>

                {/* Status Stamp */}
                {selectedPassEvent.checkedInUserIds?.includes(currentUser.id) ? (
                  <div className="mt-3 px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full flex items-center gap-1.5 text-xs font-extrabold animate-in bounce-in duration-300">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>VERIFIED & ADMITTED</span>
                  </div>
                ) : (
                  <div className="mt-3 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full flex items-center gap-1.5 text-xs font-semibold">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>READY FOR ADMISSION</span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Check In & Calendar */}
              <div className="space-y-2.5">
                <button
                  onClick={() => checkInEvent(selectedPassEvent.id)}
                  className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                    selectedPassEvent.checkedInUserIds?.includes(currentUser.id)
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                  }`}
                >
                  {selectedPassEvent.checkedInUserIds?.includes(currentUser.id) ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>Undo Check-in</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Check In Now at Venue</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={getGoogleCalendarUrl(selectedPassEvent)}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Google Cal</span>
                  </a>

                  <button
                    onClick={() => downloadIcs(selectedPassEvent)}
                    className="py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Download .ics</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: "WHO'S GOING" ATTENDEE GUEST LIST ================= */}
      {selectedAttendeesEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="font-extrabold text-base text-neutral-900">Guest List & Attendees</h3>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">{selectedAttendeesEvent.title}</p>
              </div>

              <button
                onClick={() => setSelectedAttendeesEvent(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Sub-nav */}
            <div className="px-5 py-2.5 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAttendeeFilter('all')}
                  className={`px-3 py-1 rounded-full font-bold transition-all ${
                    attendeeFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-600'
                  }`}
                >
                  All ({selectedAttendeesEvent.attendees?.length || 0})
                </button>
                <button
                  onClick={() => setAttendeeFilter('checkedIn')}
                  className={`px-3 py-1 rounded-full font-bold transition-all ${
                    attendeeFilter === 'checkedIn'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-600'
                  }`}
                >
                  Checked In ({selectedAttendeesEvent.attendees?.filter((a) => a.checkedIn).length || 0})
                </button>
              </div>

              <span className="text-[11px] text-neutral-400 font-medium">
                {selectedAttendeesEvent.goingCount} RSVPs recorded
              </span>
            </div>

            {/* Attendees List */}
            <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y divide-neutral-100">
              {(selectedAttendeesEvent.attendees || [])
                .filter((att) => (attendeeFilter === 'checkedIn' ? att.checkedIn : true))
                .map((att) => (
                  <div
                    key={att.id}
                    className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 hover:bg-neutral-50 p-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        <img
                          src={att.avatar}
                          alt={att.name}
                          className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                        />
                        {att.checkedIn && (
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"
                            title="Checked In"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs text-neutral-900 truncate">{att.name}</h4>
                          {att.checkedIn && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded">
                              CHECKED IN
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate">
                          @{att.username} • {att.schoolName}
                        </p>
                      </div>
                    </div>

                    {/* Quick DM Button if not self */}
                    {att.id !== currentUser.id && (
                      <button
                        onClick={() => {
                          const targetUser = users.find((u) => u.id === att.id);
                          if (targetUser) {
                            startDirectMessage(targetUser);
                            setSelectedAttendeesEvent(null);
                          }
                        }}
                        className="p-2 rounded-full hover:bg-blue-50 text-blue-600 transition-colors shrink-0"
                        title={`Message ${att.name}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

              {(selectedAttendeesEvent.attendees || []).length === 0 && (
                <div className="text-center py-10 text-neutral-400 text-xs">
                  No attendees have RSVP'd yet. Be the first to join!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
