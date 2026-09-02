import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Image,
  BarChart2,
  Film,
  Calendar,
  Sparkles,
  Download,
  Send,
  Loader2,
  X
} from 'lucide-react';

export const CreatePostCard: React.FC = () => {
  const { currentUser, createPost, openModal, showToast } = useApp();
  const [text, setText] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [allowDownloads, setAllowDownloads] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showMediaInput, setShowMediaInput] = useState(false);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !mediaUrl.trim()) {
      showToast('Please type a caption or attach media', 'info');
      return;
    }

    // Extract hashtags from text
    const tags = text.match(/#[a-zA-Z0-9_]+/g)?.map((t) => t.replace('#', '')) || [];

    createPost({
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      authorSchool: currentUser.schoolName,
      authorRole: currentUser.role,
      type: mediaUrl.trim() ? 'photo' : 'text',
      text: text.trim(),
      mediaUrls: mediaUrl.trim() ? [mediaUrl.trim()] : undefined,
      allowDownloads,
      tags: tags.length ? tags : ['CampusConnect', currentUser.schoolName.replace(/\s+/g, '')],
      schoolId: currentUser.schoolId,
      isOfficialAnnouncement: currentUser.role === 'school_admin'
    });

    setText('');
    setMediaUrl('');
    setShowMediaInput(false);
  };

  // Call Server-side AI Caption Generator
  const handleGenerateAiCaption = async () => {
    setIsAiLoading(true);
    try {
      const topic = text.trim() || `${currentUser.schoolName} campus activity`;
      const res = await fetch('/api/ai/caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          mediaType: mediaUrl ? 'photo' : 'update',
          tone: 'energetic'
        })
      });
      const data = await res.json();
      if (data.caption) {
        setText(data.caption);
        showToast(data.isFallback ? 'AI suggested a campus caption' : 'Gemini AI generated your caption!', 'success');
      }
    } catch (err) {
      setText(`Big vibes at ${currentUser.schoolName} today! Working hard and striving for the best 🚀🙌 #CampusConnect #${currentUser.schoolName.replace(/\s+/g, '')}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs">
      <div className="flex items-start gap-3 mb-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <textarea
            id="create-post-textarea"
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Share what’s happening at ${currentUser.schoolName || 'campus'}, ${currentUser.name.split(' ')[0]}...`}
            className="w-full resize-none text-sm text-neutral-900 placeholder-neutral-400 outline-none bg-transparent"
          />

          {/* Optional Media URL preview / input */}
          {showMediaInput && (
            <div className="mt-2 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                <span className="font-semibold">Photo/Image Web Link</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowMediaInput(false);
                    setMediaUrl('');
                  }}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                id="post-media-url-input"
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="Paste image URL (e.g., Unsplash or school CDN link)..."
                className="w-full text-xs bg-white px-3 py-1.5 rounded-lg border border-neutral-200 outline-none focus:border-blue-500"
              />
              {mediaUrl && (
                <div className="mt-2 relative rounded-lg overflow-hidden max-h-48 border border-neutral-200">
                  <img src={mediaUrl} alt="Preview" className="w-full h-auto object-cover" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toolbar & Actions */}
      <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
        {/* Media Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowMediaInput(!showMediaInput)}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showMediaInput ? 'bg-blue-50 text-blue-600' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
            title="Attach Image"
          >
            <Image className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Photo</span>
          </button>

          <button
            type="button"
            onClick={() => openModal('create_poll')}
            className="p-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 flex items-center gap-1.5 transition-colors"
            title="Create Student Poll"
          >
            <BarChart2 className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Poll</span>
          </button>

          <button
            type="button"
            onClick={() => openModal('create_reel')}
            className="p-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 flex items-center gap-1.5 transition-colors"
            title="Create Campus Reel"
          >
            <Film className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">Reel</span>
          </button>

          <button
            type="button"
            onClick={() => openModal('create_event')}
            className="p-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 flex items-center gap-1.5 transition-colors"
            title="Create Event"
          >
            <Calendar className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">Event</span>
          </button>

          {/* AI Caption Assistant */}
          <button
            type="button"
            onClick={handleGenerateAiCaption}
            disabled={isAiLoading}
            className="p-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 flex items-center gap-1.5 transition-colors"
            title="AI Caption Assistant (Gemini)"
          >
            {isAiLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <Sparkles className="w-4 h-4 text-blue-600" />
            )}
            <span className="hidden md:inline">AI Caption</span>
          </button>
        </div>

        {/* Right side: allow download toggle & publish button */}
        <div className="flex items-center gap-3">
          <label className="hidden sm:flex items-center gap-1.5 text-[11px] text-neutral-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allowDownloads}
              onChange={(e) => setAllowDownloads(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Allow media download</span>
          </label>

          <button
            id="publish-post-btn"
            onClick={handlePublish}
            disabled={!text.trim() && !mediaUrl.trim()}
            className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm shadow-blue-500/25 transition-all"
          >
            <span>Post</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
