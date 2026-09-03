import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Post, Comment } from '../../types';
import { Send, Trash2 } from 'lucide-react';

interface PostCommentsProps {
  post: Post;
  postComments: Comment[];
}

export const PostComments: React.FC<PostCommentsProps> = ({ post, postComments }) => {
  const { currentUser, addComment, deleteComment, viewProfile, openAvatarPreview, users } = useApp();
  const [commentInput, setCommentInput] = useState('');

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput);
    setCommentInput('');
  };

  return (
    <div className="mt-3 pt-3 border-t border-neutral-100 space-y-3">
      {/* Add Comment Input */}
      <form onSubmit={handleAddCommentSubmit} className="flex items-center gap-2">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          onClick={() =>
            openAvatarPreview({
              name: currentUser.name,
              username: currentUser.username,
              avatar: currentUser.avatar,
              school: currentUser.schoolName,
              userId: currentUser.id
            })
          }
          title="Tap to open profile picture"
          className="w-7 h-7 rounded-full object-cover shrink-0 cursor-pointer hover:ring-1 hover:ring-blue-500"
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
              onClick={() =>
                openAvatarPreview({
                  name: comm.authorName,
                  avatar: comm.authorAvatar,
                  userId: comm.authorId
                })
              }
              title="Tap to open profile picture"
              className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 cursor-pointer hover:ring-1 hover:ring-blue-500"
            />
            <div className="flex-1 min-w-0">
              <div className="bg-neutral-100 rounded-2xl px-3 py-2">
                <div className="flex items-center justify-between">
                  <span
                    onClick={() => viewProfile(comm.authorId)}
                    title="View user profile"
                    className="font-bold text-neutral-900 cursor-pointer hover:text-blue-600 hover:underline"
                  >
                    {comm.authorName}
                  </span>
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
                  {comm.replies.map((reply) => {
                    const matchedReplyUser = users.find((u) => u.name === reply.authorName);
                    return (
                      <div key={reply.id} className="flex items-start gap-2">
                        <img
                          src={reply.authorAvatar}
                          alt={reply.authorName}
                          onClick={() =>
                            openAvatarPreview({
                              name: reply.authorName,
                              avatar: reply.authorAvatar,
                              userId: matchedReplyUser?.id
                            })
                          }
                          title="Tap to open profile picture"
                          className="w-5 h-5 rounded-full object-cover shrink-0 cursor-pointer hover:ring-1 hover:ring-blue-500"
                        />
                        <div className="bg-neutral-100 rounded-xl px-2.5 py-1.5 text-xs">
                          <span
                            onClick={() => {
                              if (matchedReplyUser) viewProfile(matchedReplyUser.id);
                            }}
                            title="View profile"
                            className="font-bold text-neutral-900 block cursor-pointer hover:underline hover:text-blue-600"
                          >
                            {reply.authorName}
                          </span>
                          <span className="text-neutral-800">{reply.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
