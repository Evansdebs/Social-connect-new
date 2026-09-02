import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  Image,
  Search,
  CheckCheck,
  Smile,
  Shield,
  Phone,
  Video,
  MoreVertical,
  X
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    currentUser,
    users
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const [mediaAttachment, setMediaAttachment] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);

  const activeConv =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const filteredConversations = conversations.filter((c) =>
    c.participant.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
    c.participant.school.toLowerCase().includes(chatSearch.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() && !mediaAttachment.trim()) return;
    if (!activeConv) return;

    sendMessage(activeConv.id, messageInput.trim(), mediaAttachment.trim() || undefined);
    setMessageInput('');
    setMediaAttachment('');
    setShowMediaInput(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden h-[calc(100vh-140px)] min-h-[550px] flex">
      {/* Left Conversations Sidebar */}
      <div className="w-full sm:w-80 border-r border-neutral-200 flex flex-col shrink-0">
        <div className="p-3.5 border-b border-neutral-200 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-base text-neutral-900 tracking-tight">Direct Chats</h2>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
              Cross-School
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              placeholder="Search chat or school..."
              className="w-full pl-8 pr-3 py-1.5 bg-neutral-100 rounded-full text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
          {filteredConversations.map((conv) => {
            const isActive = activeConv?.id === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                  isActive ? 'bg-blue-50/70' : 'hover:bg-neutral-50'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.participant.avatar}
                    alt={conv.participant.name}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                  />
                  {conv.participant.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-bold text-xs text-neutral-900 truncate">
                      {conv.participant.name}
                    </p>
                    <span className="text-[10px] text-neutral-400 shrink-0">
                      {conv.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-600 font-medium truncate mb-0.5">
                    🏫 {conv.participant.school}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">{conv.lastMessage}</p>
                </div>

                {conv.unreadCount > 0 && (
                  <span className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Chat Window */}
      {activeConv ? (
        <div className="hidden sm:flex flex-1 flex-col h-full bg-neutral-50/40">
          {/* Chat Header */}
          <div className="p-3.5 px-5 bg-white border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeConv.participant.avatar}
                  alt={activeConv.participant.name}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                />
                {activeConv.participant.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-neutral-900">
                  {activeConv.participant.name}
                </h3>
                <p className="text-xs text-blue-600 font-medium">
                  🏫 {activeConv.participant.school} • @{activeConv.participant.username}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-neutral-500">
              <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                Connected
              </span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-center my-2">
              <span className="text-[10px] uppercase font-bold text-neutral-400 bg-white border border-neutral-200 px-3 py-1 rounded-full">
                Encrypted Campus Message Channel
              </span>
            </div>

            {(activeConv.messages || []).map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md rounded-2xl px-3.5 py-2.5 text-xs shadow-xs ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : 'bg-white text-neutral-900 border border-neutral-200 rounded-bl-xs'
                    }`}
                  >
                    {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                    {msg.mediaUrl && (
                      <div className="mt-2 rounded-xl overflow-hidden max-h-48 border border-white/20">
                        <img
                          src={msg.mediaUrl}
                          alt="Attachment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-neutral-400 px-1">
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-blue-600" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Attachment URL preview input if open */}
          {showMediaInput && (
            <div className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2">
              <input
                type="text"
                value={mediaAttachment}
                onChange={(e) => setMediaAttachment(e.target.value)}
                placeholder="Paste image link to send in chat..."
                className="flex-1 text-xs bg-neutral-100 px-3 py-2 rounded-lg outline-none"
              />
              <button
                type="button"
                onClick={() => setShowMediaInput(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Message Input Box */}
          <form
            onSubmit={handleSend}
            className="p-3.5 bg-white border-t border-neutral-200 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => setShowMediaInput(!showMediaInput)}
              className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 rounded-full transition-colors"
              title="Attach Photo"
            >
              <Image className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={`Message ${activeConv.participant.name.split(' ')[0]}...`}
              className="flex-1 text-xs bg-neutral-100 focus:bg-white text-neutral-900 px-4 py-2.5 rounded-full border border-neutral-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
            />

            <button
              type="submit"
              disabled={!messageInput.trim() && !mediaAttachment.trim()}
              className="p-2.5 bg-blue-600 disabled:opacity-40 text-white hover:bg-blue-700 active:bg-blue-800 rounded-full transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-neutral-400 text-xs">
          <MessageSquare className="w-10 h-10 mb-2 text-neutral-300" />
          <p>Select a student or teacher from the list to begin chatting.</p>
        </div>
      )}
    </div>
  );
};
