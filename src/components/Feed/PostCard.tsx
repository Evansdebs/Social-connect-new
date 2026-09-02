import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Post, Comment } from '../../types';
import {
  Heart,
  MessageCircle,
  Repeat,
  Share2,
  Bookmark,
  Download,
  MoreHorizontal,
  Send,
  Trash2,
  BarChart2,
  CheckCircle,
  Megaphone,
  Sparkles,
  Smile,
  AlertTriangle
} from 'lucide-react';

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const {
    currentUser,
    likePost,
    repostPost,
    comments,
    addComment,
    deleteComment,
    votePoll,
    savedPostIds,
    toggleSavePost,
    openModal,
    showToast,
    setSelectedSchoolId,
    setActiveTab
  } = useApp();

  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const postComments: Comment[] = comments[post.id] || [];
  const isSaved = savedPostIds.includes(post.id);

  const reactionEmojis = {
    like: '👍',
    love: '❤️',
    funny: '😂',
    celebrate: '🎉',
    wow: '😮'
  };

  const handleReaction = (reaction: 'like' | 'love' | 'funny' | 'celebrate' | 'wow') => {
    likePost(post.id, reaction);
    setShowReactionPicker(false);
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput);
    setCommentInput('');
  };

  const handleDownloadMedia = (url?: string) => {
    if (!post.allowDownloads) {
      showToast('The author has disabled media downloads for this post.', 'error');
      return;
    }
    const targetUrl = url || post.mediaUrls?.[0] || post.videoUrl;
    if (targetUrl) {
      const a = document.createElement('a');
      a.href = targetUrl;
      a.download = `campus_connect_${post.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Media download initiated!', 'success');
    }
  };

  return (
    <article
      id={`post-${post.id}`}
      className="bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm"
    >
      {/* Official School Announcement Banner */}
      {post.isOfficialAnnouncement && (
        <div className="mb-3 -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 px-4 py-2 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white text-xs font-bold flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5 text-amber-300" />
            <span>OFFICIAL SCHOOL ANNOUNCEMENT</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Verified
          </span>
        </div>
      )}

      {/* Repost Header if applicable */}
      {post.type === 'repost' && post.repostOf && (
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold mb-2.5 pb-2 border-b border-neutral-100">
          <Repeat className="w-3.5 h-3.5 text-blue-600" />
          <span>
            Reposted by <strong className="text-neutral-800">{post.authorName}</strong>
          </span>
        </div>
      )}

      {/* Post Author Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm text-neutral-900 truncate">
                {post.authorName}
              </span>
              <span className="text-xs text-neutral-400">@{post.authorUsername}</span>
              {post.authorRole === 'school_admin' && (
                <span className="text-blue-600 text-xs" title="Verified School Page">✓</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 flex-wrap">
              <button
                onClick={() => {
                  if (post.schoolId) setSelectedSchoolId(post.schoolId);
                  setActiveTab('schools');
                }}
                className="font-medium text-blue-600 hover:underline hover:text-blue-800"
              >
                🏫 {post.authorSchool}
              </button>
              <span>•</span>
              <span className="text-neutral-400">{post.createdAt}</span>
            </div>
          </div>
        </div>

        {/* More Menu Dropdown */}
        <div className="relative">
          <button
            id={`post-menu-btn-${post.id}`}
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMoreMenu && (
            <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 z-30 animate-in fade-in slide-in-from-top-1 text-xs">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast('Post link copied to clipboard!', 'info');
                  setShowMoreMenu(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Post Link</span>
              </button>

              {post.mediaUrls && post.mediaUrls.length > 0 && post.allowDownloads && (
                <button
                  onClick={() => {
                    handleDownloadMedia();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Download Media</span>
                </button>
              )}

              <button
                onClick={() => {
                  openModal('report', { targetType: 'post', targetId: post.id });
                  setShowMoreMenu(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-rose-50 flex items-center gap-2 text-rose-600"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report Content</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Text Content */}
      <div className="mb-3 text-sm text-neutral-800 leading-relaxed break-words">
        <p>{post.text}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Repost Quoted Card if applicable */}
      {post.type === 'repost' && post.repostOf && (
        <div className="mb-3 p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={post.repostOf.originalAuthorAvatar}
              alt={post.repostOf.originalAuthorName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="font-bold text-xs text-neutral-900">
              {post.repostOf.originalAuthorName}
            </span>
            <span className="text-[11px] text-neutral-500">
              @{post.repostOf.originalAuthorUsername}
            </span>
            <span className="text-[10px] text-neutral-400">• {post.repostOf.originalDate}</span>
          </div>
          <p className="text-xs text-neutral-700 mb-2">{post.repostOf.originalText}</p>
          {post.repostOf.originalMediaUrls && post.repostOf.originalMediaUrls[0] && (
            <div className="rounded-lg overflow-hidden max-h-64 border border-neutral-200">
              <img
                src={post.repostOf.originalMediaUrls[0]}
                alt="Original media"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      )}

      {/* Media: Photos Carousel */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="relative mb-3 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 group">
          <img
            src={post.mediaUrls[0]}
            alt="Post media"
            className="w-full max-h-96 object-contain mx-auto bg-neutral-950"
          />
          {post.allowDownloads && (
            <button
              onClick={() => handleDownloadMedia(post.mediaUrls?.[0])}
              className="absolute bottom-2.5 right-2.5 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px]"
              title="Download photo"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          )}
        </div>
      )}

      {/* Media: Interactive Poll */}
      {post.type === 'poll' && post.poll && (
        <div className="mb-3.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 mb-1">
            <BarChart2 className="w-4 h-4 text-blue-600" />
            <span>{post.poll.question}</span>
          </div>

          <div className="space-y-2">
            {(post.poll.options || []).map((opt) => {
              const totalVotes = post.poll?.totalVotes || 1;
              const percent = Math.round((opt.votes / totalVotes) * 100);
              const isUserVoted = post.poll?.userVotedId === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => votePoll(post.id, opt.id)}
                  disabled={!!post.poll?.userVotedId}
                  className={`w-full relative text-left p-2.5 rounded-lg border text-xs font-medium transition-all overflow-hidden ${
                    isUserVoted
                      ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-bold'
                      : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-800'
                  }`}
                >
                  {/* Visual percentage fill bar */}
                  <div
                    style={{ width: `${percent}%` }}
                    className={`absolute top-0 bottom-0 left-0 transition-all duration-500 pointer-events-none ${
                      isUserVoted ? 'bg-blue-100/70' : 'bg-neutral-100'
                    }`}
                  />
                  <div className="relative z-10 flex items-center justify-between">
                    <span>{opt.text}</span>
                    <span className="font-bold text-neutral-600">
                      {percent}% ({opt.votes})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-neutral-400 text-right pt-1">
            {post.poll.totalVotes} total votes • {post.poll.userVotedId ? 'Vote recorded' : 'Tap to vote'}
          </p>
        </div>
      )}

      {/* Engagement Counters Strip */}
      <div className="flex items-center justify-between text-xs text-neutral-500 py-2 border-b border-neutral-100 mb-1">
        <div className="flex items-center gap-1">
          {post.likesCount > 0 && (
            <span className="flex items-center gap-1 font-semibold text-rose-600">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{post.likesCount}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span>{post.commentsCount} comments</span>
          <span>{post.repostsCount} reposts</span>
        </div>
      </div>

      {/* Interaction Action Buttons Bar */}
      <div className="flex items-center justify-between pt-1 relative">
        {/* Like & Reaction Picker Container */}
        <div className="relative">
          <button
            id={`like-post-btn-${post.id}`}
            onClick={() => likePost(post.id)}
            onMouseEnter={() => setShowReactionPicker(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              post.likedByUser
                ? 'text-rose-600 bg-rose-50'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${post.likedByUser ? 'fill-current text-rose-600' : ''}`} />
            <span>
              {post.userReaction
                ? reactionEmojis[post.userReaction]
                : post.likedByUser
                ? 'Liked'
                : 'Like'}
            </span>
          </button>

          {/* Hover Reaction Popup */}
          {showReactionPicker && (
            <div
              onMouseLeave={() => setShowReactionPicker(false)}
              className="absolute bottom-full left-0 mb-1 bg-white rounded-full shadow-lg border border-neutral-200 px-2 py-1 flex items-center gap-2 z-20 animate-in fade-in zoom-in-90 duration-100"
            >
              {(['like', 'love', 'funny', 'celebrate', 'wow'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => handleReaction(r)}
                  className="hover:scale-130 transition-transform text-lg"
                  title={r}
                >
                  {reactionEmojis[r]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment Button */}
        <button
          id={`toggle-comments-btn-${post.id}`}
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            showComments ? 'text-blue-600 bg-blue-50' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>

        {/* Repost Button */}
        <button
          id={`repost-btn-${post.id}`}
          onClick={() => repostPost(post.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
          title="Repost to your followers"
        >
          <Repeat className="w-4 h-4" />
          <span>Repost</span>
        </button>

        {/* Share Button */}
        <button
          id={`share-post-btn-${post.id}`}
          onClick={() => openModal('share', { post })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
          title="Share Post"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Bookmark Save Button */}
        <button
          id={`bookmark-post-btn-${post.id}`}
          onClick={() => toggleSavePost(post.id)}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            isSaved ? 'text-amber-600 bg-amber-50' : 'text-neutral-400 hover:bg-neutral-100'
          }`}
          title={isSaved ? 'Saved to collection' : 'Save post'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Collapsible Comments Thread */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-neutral-100 space-y-3">
          {/* Add Comment Input */}
          <form onSubmit={handleAddCommentSubmit} className="flex items-center gap-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover shrink-0"
            />
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write a comment or mention @username..."
              className="flex-1 bg-neutral-100 focus:bg-white text-xs text-neutral-900 px-3 py-2 rounded-full border border-neutral-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="p-2 rounded-full bg-blue-600 disabled:opacity-40 text-white hover:bg-blue-700 transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-2.5">
            {postComments.map((comm) => (
              <div key={comm.id} className="flex items-start gap-2.5 text-xs group">
                <img
                  src={comm.authorAvatar}
                  alt={comm.authorName}
                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="bg-neutral-100 rounded-2xl px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900">{comm.authorName}</span>
                      <span className="text-[10px] text-neutral-400">{comm.createdAt}</span>
                    </div>
                    <p className="text-neutral-800 mt-0.5">{comm.text}</p>
                  </div>

                  {/* Comment Actions: Like / Reply / Delete */}
                  <div className="flex items-center gap-3 px-2 pt-1 text-[11px] text-neutral-500">
                    <button className="hover:text-blue-600 font-medium">Like</button>
                    <button className="hover:text-blue-600 font-medium">Reply</button>
                    {comm.authorId === currentUser.id && (
                      <button
                        onClick={() => deleteComment(post.id, comm.id)}
                        className="hover:text-rose-600 text-neutral-400"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Threaded replies */}
                  {comm.replies && comm.replies.length > 0 && (
                    <div className="mt-2 pl-4 border-l-2 border-neutral-200 space-y-2">
                      {comm.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-2">
                          <img
                            src={reply.authorAvatar}
                            alt={reply.authorName}
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                          />
                          <div className="bg-neutral-100 rounded-xl px-2.5 py-1.5 text-xs">
                            <span className="font-bold text-neutral-900 block">{reply.authorName}</span>
                            <span className="text-neutral-800">{reply.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
