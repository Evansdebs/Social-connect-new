import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare, Send, Image, Search, CheckCheck, ArrowLeft,
  Hash, Users, UserPlus, Lock, X
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    currentUser,
    users,
    viewProfile,
    openAvatarPreview,
    clubChannels,
    activeChannelId,
    setActiveChannelId,
    sendGroupMessage,
    toggleJoinChannel
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const [mediaAttachment, setMediaAttachment] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [activeTab, setActiveTab] = useState<'direct' | 'groups'>('direct');
  const [showMobileChatPane, setShowMobileChatPane] = useState(Boolean(activeConversationId));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 640;
  const activeConv = conversations.find((c) => c.id === activeConversationId) || (isDesktop ? conversations[0] : undefined);
  const activeChannel = clubChannels.find((c) => c.id === activeChannelId);

  useEffect(() => {
    if (activeConversationId || activeChannelId) setShowMobileChatPane(true);
  }, [activeConversationId, activeChannelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, activeChannel?.messages]);

  const filteredConversations = conversations.filter((c) =>
    c.participant.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
    c.participant.school.toLowerCase().includes(chatSearch.toLowerCase())
  );

  const filteredChannels = clubChannels.filter((c) =>
    c.clubName.toLowerCase().includes(chatSearch.toLowerCase()) ||
    c.clubCategory.toLowerCase().includes(chatSearch.toLowerCase())
  );

  const handleSelectConv = (convId: string) => {
    setActiveConversationId(convId);
    setActiveChannelId(null);
    setShowMobileChatPane(true);
  };

  const handleSelectChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    setActiveConversationId(null);
    setShowMobileChatPane(true);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() && !mediaAttachment.trim()) return;

    if (activeTab === 'groups' && activeChannel) {
      sendGroupMessage(activeChannel.id, messageInput.trim());
    } else if (activeConv) {
      sendMessage(activeConv.id, messageInput.trim(), mediaAttachment.trim() || undefined);
    }
    setMessageInput('');
    setMediaAttachment('');
    setShowMediaInput(false);
  };

  const totalUnread = clubChannels.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden h-[calc(100vh-140px)] min-h-[550px] flex">
      {/* Left Sidebar */}
      <div className={`w-full sm:w-80 border-r border-neutral-200 flex flex-col shrink-0 ${showMobileChatPane ? 'hidden sm:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-3.5 border-b border-neutral-200 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-base text-neutral-900 tracking-tight">Messages</h2>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Campus Chat</span>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-neutral-100 rounded-xl p-0.5 gap-0.5">
            <button
              onClick={() => setActiveTab('direct')}
              className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all flex items-center justify-center gap-1 ${activeTab === 'direct' ? 'bg-white text-blue-700 shadow-xs' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              <MessageSquare className="w-3 h-3" /> Direct
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all flex items-center justify-center gap-1 relative ${activeTab === 'groups' ? 'bg-white text-purple-700 shadow-xs' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              <Hash className="w-3 h-3" /> Groups
              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{totalUnread}</span>
              )}
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              placeholder={activeTab === 'direct' ? 'Search chats...' : 'Search channels...'}
              className="w-full pl-8 pr-3 py-1.5 bg-neutral-100 rounded-full text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
          {activeTab === 'direct' && filteredConversations.map((conv) => {
            const isActive = activeConv?.id === conv.id;
            return (
              <div key={conv.id} onClick={() => handleSelectConv(conv.id)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${isActive ? 'bg-blue-50/70' : 'hover:bg-neutral-50'}`}>
                <div className="relative shrink-0">
                  <img
                    src={conv.participant.avatar}
                    alt={conv.participant.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      openAvatarPreview({
                        name: conv.participant.name,
                        username: conv.participant.username,
                        avatar: conv.participant.avatar,
                        school: conv.participant.school,
                        userId: conv.participant.id
                      });
                    }}
                    title="Tap to open profile picture"
                    className="w-10 h-10 rounded-full object-cover border border-neutral-200 cursor-pointer hover:ring-2 hover:ring-blue-400"
                  />
                  {conv.participant.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-bold text-xs text-neutral-900 truncate">{conv.participant.name}</p>
                    <span className="text-[10px] text-neutral-400 shrink-0">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-[11px] text-blue-600 font-medium truncate mb-0.5">?? {conv.participant.school}</p>
                  <p className="text-xs text-neutral-500 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">{conv.unreadCount}</span>
                )}
              </div>
            );
          })}

          {activeTab === 'groups' && filteredChannels.map((channel) => {
            const isActive = activeChannel?.id === channel.id;
            return (
              <div key={channel.id} onClick={() => handleSelectChannel(channel.id)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${isActive ? 'bg-purple-50/70' : 'hover:bg-neutral-50'}`}>
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-purple-100 flex items-center justify-center">
                  <img src={channel.coverImage} alt={channel.clubName} className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-bold text-xs text-neutral-900 truncate">{channel.clubName}</p>
                    <span className="text-[10px] text-neutral-400 shrink-0">{channel.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${channel.isJoined ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-500'}`}>
                      {channel.isJoined ? 'Member' : 'Public'}
                    </span>
                    <span className="text-[10px] text-neutral-400">{channel.membersCount} members</span>
                  </div>
                  <p className="text-xs text-neutral-500 truncate">{channel.lastMessage}</p>
                </div>
                {(channel.unreadCount || 0) > 0 && (
                  <span className="w-4 h-4 bg-purple-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">{channel.unreadCount}</span>
                )}
              </div>
            );
          })}

          {activeTab === 'direct' && filteredConversations.length === 0 && (
            <div className="p-6 text-center text-neutral-400 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
              <p>No conversations yet. Connect with students to start chatting!</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Chat/Channel Panel */}
      {(activeConv || activeChannel) ? (
        <div className={`flex-1 flex flex-col h-full bg-neutral-50/40 ${showMobileChatPane ? 'flex' : 'hidden sm:flex'}`}>
          {/* Header */}
          <div className="p-3.5 px-4 sm:px-5 bg-white border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button type="button" onClick={() => setShowMobileChatPane(false)}
                className="sm:hidden p-1.5 -ml-1 text-neutral-600 hover:bg-neutral-100 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </button>

              {activeConv && (
                <>
                  <div className="relative">
                    <img
                      src={activeConv.participant.avatar}
                      alt={activeConv.participant.name}
                      onClick={() =>
                        openAvatarPreview({
                          name: activeConv.participant.name,
                          username: activeConv.participant.username,
                          avatar: activeConv.participant.avatar,
                          school: activeConv.participant.school,
                          userId: activeConv.participant.id
                        })
                      }
                      title="Tap to open profile picture"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-neutral-200 cursor-pointer hover:ring-2 hover:ring-blue-400"
                    />
                    {activeConv.participant.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3
                      onClick={() => viewProfile(activeConv.participant.id)}
                      title="View user profile"
                      className="font-extrabold text-xs sm:text-sm text-neutral-900 truncate cursor-pointer hover:text-blue-600 hover:underline"
                    >
                      {activeConv.participant.name}
                    </h3>
                    <p
                      onClick={() => viewProfile(activeConv.participant.id)}
                      title="View user profile"
                      className="text-[11px] sm:text-xs text-blue-600 font-medium truncate cursor-pointer hover:underline"
                    >
                      🏫 {activeConv.participant.school} • @{activeConv.participant.username}
                    </p>
                  </div>
                </>
              )}

              {activeChannel && (
                <>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shrink-0">
                    <img src={activeChannel.coverImage} alt={activeChannel.clubName} className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-xs sm:text-sm text-neutral-900 truncate">{activeChannel.clubName}</h3>
                    <p className="text-[11px] sm:text-xs text-purple-600 font-medium truncate">
                      <Users className="w-3 h-3 inline mr-0.5" />
                      {activeChannel.membersCount} members • {activeChannel.clubCategory}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeConv && (
                <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Connected</span>
              )}
              {activeChannel && (
                <button onClick={() => toggleJoinChannel(activeChannel.id)}
                  className={`text-[11px] px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1 ${
                    activeChannel.isJoined
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}>
                  {activeChannel.isJoined ? (
                    <><Lock className="w-2.5 h-2.5" /> Leave</>
                  ) : (
                    <><UserPlus className="w-2.5 h-2.5" /> Join Channel</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-center my-2">
              <span className="text-[10px] uppercase font-bold text-neutral-400 bg-white border border-neutral-200 px-3 py-1 rounded-full">
                {activeConv ? 'Encrypted Campus Message Channel' : `# ${activeChannel?.clubName}`}
              </span>
            </div>

            {/* Direct messages */}
            {activeConv && (activeConv.messages || []).map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-xs md:max-w-md rounded-2xl px-3.5 py-2.5 text-xs shadow-xs ${
                    isMe ? 'bg-blue-600 text-white rounded-br-xs' : 'bg-white text-neutral-900 border border-neutral-200 rounded-bl-xs'
                  }`}>
                    {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                    {msg.mediaUrl && (
                      <div className="mt-2 rounded-xl overflow-hidden max-h-48 border border-white/20">
                        <img src={msg.mediaUrl} alt="Attachment" className="w-full h-full object-cover" />
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

            {/* Group messages */}
            {activeChannel && activeChannel.messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                  {!isMe && (
                    <img src={msg.senderAvatar} alt={msg.senderName} className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-neutral-200"
                      onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderId}`; }} />
                  )}
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} flex-1 min-w-0`}>
                    {!isMe && (
                      <div className="flex items-center gap-1.5 mb-0.5 px-1">
                        <span className="text-[10px] font-black text-neutral-800">{msg.senderName}</span>
                        <span className="text-[9px] text-purple-600 font-medium">{msg.senderSchool}</span>
                      </div>
                    )}
                    <div className={`max-w-xs md:max-w-md rounded-2xl px-3.5 py-2.5 text-xs shadow-xs ${
                      isMe ? 'bg-purple-600 text-white rounded-br-xs' : 'bg-white text-neutral-900 border border-neutral-200 rounded-bl-xs'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-neutral-400 px-1 mt-0.5">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Media input */}
          {showMediaInput && (
            <div className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2">
              <input type="text" value={mediaAttachment} onChange={(e) => setMediaAttachment(e.target.value)}
                placeholder="Paste image link to send..."
                className="flex-1 text-xs bg-neutral-100 px-3 py-2 rounded-lg outline-none" />
              <button type="button" onClick={() => setShowMediaInput(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3.5 bg-white border-t border-neutral-200 flex items-center gap-2">
            {activeConv && (
              <button type="button" onClick={() => setShowMediaInput(!showMediaInput)}
                className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 rounded-full transition-colors" title="Attach Photo">
                <Image className="w-4 h-4" />
              </button>
            )}
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={activeChannel
                ? (activeChannel.isJoined ? `Message #${activeChannel.clubName.split(' ')[0].toLowerCase()}...` : 'Join channel to send messages')
                : `Message ${activeConv?.participant.name.split(' ')[0]}...`
              }
              disabled={activeChannel ? !activeChannel.isJoined : false}
              className="flex-1 text-xs bg-neutral-100 focus:bg-white text-neutral-900 px-4 py-2.5 rounded-full border border-neutral-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button type="submit"
              disabled={(!messageInput.trim() && !mediaAttachment.trim()) || (activeChannel ? !activeChannel.isJoined : false)}
              className={`p-2.5 disabled:opacity-40 text-white rounded-full transition-colors shadow-xs ${
                activeChannel ? 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-neutral-400 text-xs">
          {activeTab === 'groups' ? (
            <>
              <Hash className="w-10 h-10 mb-2 text-neutral-300" />
              <p className="font-medium">Select a group channel to view messages</p>
              <p className="mt-1 text-neutral-300">Join channels to participate in group discussions</p>
            </>
          ) : (
            <>
              <MessageSquare className="w-10 h-10 mb-2 text-neutral-300" />
              <p>Select a student or teacher from the list to begin chatting.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
