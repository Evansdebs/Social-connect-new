import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  FileText,
  Film,
  Sparkles,
  BarChart2,
  Calendar,
  Image as ImageIcon,
  Plus,
  Trash2,
  Send,
  Loader2
} from 'lucide-react';

export const CreateContentModal: React.FC = () => {
  const {
    currentUser,
    activeModal,
    closeModal,
    createPost,
    createReel,
    createStory,
    events,
    showToast
  } = useApp();

  const [creationType, setCreationType] = useState<
    'post' | 'reel' | 'story' | 'poll' | 'event'
  >(
    activeModal === 'create_reel'
      ? 'reel'
      : activeModal === 'create_story'
      ? 'story'
      : activeModal === 'create_poll'
      ? 'poll'
      : activeModal === 'create_event'
      ? 'event'
      : 'post'
  );

  // Form states
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [allowDownloads, setAllowDownloads] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Poll states
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['Option 1', 'Option 2']);

  // Reel specific states
  const [soundTitle, setSoundTitle] = useState('Campus Trending Beat #1');
  const [soundArtist, setSoundArtist] = useState('Campus Sounds');

  // Event specific states
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('NOV 14, 2026');
  const [eventTime, setEventTime] = useState('10:00 AM - 02:00 PM');
  const [eventLocation, setEventLocation] = useState('School Main Field / Hall');
  const [eventCategory, setEventCategory] = useState<'Sports' | 'Academics' | 'Arts'>('Sports');

  // AI Assistant generator
  const handleGenerateAiCaption = async () => {
    setIsAiLoading(true);
    try {
      const topic = caption.trim() || `${currentUser.schoolName} student event`;
      const res = await fetch('/api/ai/caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          mediaType: creationType === 'reel' ? 'reel video' : 'photo',
          tone: 'energetic'
        })
      });
      const data = await res.json();
      if (data.caption) {
        setCaption(data.caption);
        showToast('AI caption generated!', 'success');
      }
    } catch {
      setCaption(`Excited for what's coming next at ${currentUser.schoolName}! Big vibes 🚀 #CampusConnect`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (creationType === 'post') {
      if (!caption.trim() && !mediaUrl.trim()) {
        showToast('Please provide a caption or image URL', 'error');
        return;
      }
      createPost({
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorUsername: currentUser.username,
        authorAvatar: currentUser.avatar,
        authorSchool: currentUser.schoolName,
        authorRole: currentUser.role,
        type: mediaUrl.trim() ? 'photo' : 'text',
        text: caption.trim(),
        mediaUrls: mediaUrl.trim() ? [mediaUrl.trim()] : undefined,
        allowDownloads,
        tags: ['CampusConnect', currentUser.schoolName.replace(/\s+/g, '')],
        schoolId: currentUser.schoolId,
        isOfficialAnnouncement: currentUser.role === 'school_admin'
      });
    } else if (creationType === 'reel') {
      createReel({
        videoUrl:
          mediaUrl.trim() ||
          'https://assets.mixkit.co/videos/preview/mixkit-students-playing-basketball-on-an-outdoor-court-41539-large.mp4',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80',
        caption: caption.trim() || 'Check out this campus moment! 🔥 #CampusReels',
        soundTitle: soundTitle || 'Campus Original Sound',
        soundArtist: soundArtist || currentUser.name,
        hashtags: ['CampusReels', 'StudentLife', currentUser.schoolName.replace(/\s+/g, '')],
        allowDownloads
      });
    } else if (creationType === 'story') {
      createStory({
        type: mediaUrl.trim() ? 'photo' : 'text',
        mediaUrl: mediaUrl.trim() || undefined,
        caption: caption.trim() || 'Living Spring Campus moments! ✨',
        bgColor: 'from-blue-600 to-indigo-800'
      });
    } else if (creationType === 'poll') {
      if (!pollQuestion.trim()) {
        showToast('Please enter a poll question', 'error');
        return;
      }
      createPost({
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorUsername: currentUser.username,
        authorAvatar: currentUser.avatar,
        authorSchool: currentUser.schoolName,
        authorRole: currentUser.role,
        type: 'poll',
        text: caption.trim() || `Poll: ${pollQuestion.trim()}`,
        poll: {
          question: pollQuestion.trim(),
          options: pollOptions.map((opt, i) => ({
            id: `opt-${i + 1}`,
            text: opt,
            votes: 0
          })),
          totalVotes: 0
        },
        allowDownloads: false,
        tags: ['CampusPoll', 'StudentVoice'],
        schoolId: currentUser.schoolId
      });
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-neutral-900">Create on Campus Connect</h3>
          <button
            onClick={closeModal}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Creation Type Selector Bar */}
        <div className="flex border-b border-neutral-100 bg-neutral-50 px-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'post', label: 'Post', icon: FileText },
            { id: 'reel', label: 'Reel', icon: Film },
            { id: 'story', label: 'Story', icon: ImageIcon },
            { id: 'poll', label: 'Poll', icon: BarChart2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = creationType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCreationType(tab.id as any)}
                className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Author Tag */}
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border"
            />
            <div>
              <p className="text-xs font-bold text-neutral-900">{currentUser.name}</p>
              <p className="text-[10px] text-blue-600 font-medium">
                Posting to {currentUser.schoolName || 'Campus Feed'}
              </p>
            </div>
          </div>

          {/* Caption Input with AI Helper */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-neutral-700">Caption / Message</label>
              <button
                type="button"
                onClick={handleGenerateAiCaption}
                disabled={isAiLoading}
                className="text-[11px] text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1"
              >
                {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                <span>AI Caption Suggestion</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's happening on your campus?"
              className="w-full text-xs p-3 rounded-xl border border-neutral-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            />
          </div>

          {/* Media URL Input (if post, reel, or story) */}
          {(creationType === 'post' || creationType === 'reel' || creationType === 'story') && (
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                {creationType === 'reel' ? 'Video URL' : 'Image / Photo URL'}
              </label>
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder={
                  creationType === 'reel'
                    ? 'https://... (mp4 video or test sample)'
                    : 'https://images.unsplash.com/... (image link)'
                }
                className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-200 outline-none focus:border-blue-500"
              />
              <p className="text-[10px] text-neutral-400 mt-1">
                Tip: Leave blank to use authentic student demonstration clips.
              </p>
            </div>
          )}

          {/* Reel-Specific Audio Track Inputs */}
          {creationType === 'reel' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Audio Sound Title</label>
                <input
                  type="text"
                  value={soundTitle}
                  onChange={(e) => setSoundTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-200 outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Artist / Track</label>
                <input
                  type="text"
                  value={soundArtist}
                  onChange={(e) => setSoundArtist(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-200 outline-none"
                />
              </div>
            </div>
          )}

          {/* Poll-Specific Options Inputs */}
          {creationType === 'poll' && (
            <div className="space-y-2.5">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Poll Question</label>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="e.g., Which school sport should we feature this week?"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-200 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Poll Options</label>
                {pollOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const next = [...pollOptions];
                        next[i] = e.target.value;
                        setPollOptions(next);
                      }}
                      className="flex-1 text-xs px-3 py-1.5 rounded-xl border border-neutral-200 outline-none"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))}
                        className="p-1 text-neutral-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                {pollOptions.length < 5 && (
                  <button
                    type="button"
                    onClick={() => setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`])}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Option</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Download Permissions Toggle */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-neutral-800 block">Allow Media Downloads</span>
              <span className="text-[10px] text-neutral-500">
                Allow fellow students to save this media to their local device
              </span>
            </div>
            <input
              type="checkbox"
              checked={allowDownloads}
              onChange={(e) => setAllowDownloads(e.target.checked)}
              className="rounded text-blue-600"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl transition-colors shadow-md shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              <span>Publish to Campus</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
