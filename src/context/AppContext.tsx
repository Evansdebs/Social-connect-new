import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  School,
  Post,
  Comment,
  Story,
  Reel,
  GroupClub,
  Challenge,
  CampusEvent,
  Opportunity,
  Conversation,
  NotificationItem,
  SchoolMemoryAlbum,
  ReportItem
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SCHOOLS,
  INITIAL_POSTS,
  INITIAL_COMMENTS,
  INITIAL_STORIES,
  INITIAL_REELS,
  INITIAL_CLUBS,
  INITIAL_CHALLENGES,
  INITIAL_EVENTS,
  INITIAL_OPPORTUNITIES,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MEMORIES,
  INITIAL_REPORTS
} from '../data/initialData';

export type ActiveTab =
  | 'home'
  | 'discover'
  | 'reels'
  | 'schools'
  | 'communities'
  | 'events'
  | 'chat'
  | 'profile'
  | 'admin';

export type ModalType =
  | 'create_post'
  | 'create_reel'
  | 'create_story'
  | 'create_event'
  | 'create_poll'
  | 'report'
  | 'share'
  | 'school_admin'
  | 'platform_admin'
  | 'edit_profile';

interface AppContextType {
  currentUser: User;
  users: User[];
  switchUser: (userId: string) => void;
  updateCurrentUserProfile: (updatedData: Partial<User>) => void;
  schools: School[];
  selectedSchoolId: string | null;
  setSelectedSchoolId: (id: string | null) => void;
  activeSchool: School;
  posts: Post[];
  createPost: (post: Omit<Post, 'id' | 'likesCount' | 'likedByUser' | 'commentsCount' | 'sharesCount' | 'repostsCount' | 'createdAt'>) => void;
  likePost: (postId: string, reaction?: 'like' | 'love' | 'funny' | 'celebrate' | 'wow') => void;
  repostPost: (postId: string, comment?: string) => void;
  comments: Record<string, Comment[]>;
  addComment: (postId: string, text: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  votePoll: (postId: string, optionId: string) => void;
  savedPostIds: string[];
  toggleSavePost: (postId: string) => void;
  stories: Story[];
  createStory: (story: Omit<Story, 'id' | 'authorId' | 'authorName' | 'authorUsername' | 'authorAvatar' | 'authorSchool' | 'createdAt'>) => void;
  markStoryViewed: (storyId: string) => void;
  reels: Reel[];
  createReel: (reel: Omit<Reel, 'id' | 'creatorId' | 'creatorName' | 'creatorUsername' | 'creatorAvatar' | 'creatorSchool' | 'likesCount' | 'likedByUser' | 'commentsCount' | 'sharesCount' | 'downloadsCount' | 'createdAt'>) => void;
  likeReel: (reelId: string) => void;
  clubs: GroupClub[];
  toggleJoinClub: (clubId: string) => void;
  challenges: Challenge[];
  voteChallenge: (challengeId: string, schoolId: string) => void;
  events: CampusEvent[];
  toggleRsvpEvent: (eventId: string, status: 'interested' | 'going' | null) => void;
  opportunities: Opportunity[];
  toggleSaveOpportunity: (oppId: string) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string, mediaUrl?: string) => void;
  startDirectMessage: (user: User) => void;
  notifications: NotificationItem[];
  markNotificationRead: (notifId: string) => void;
  unreadNotifCount: number;
  schoolMemories: SchoolMemoryAlbum[];
  reports: ReportItem[];
  submitReport: (targetType: 'post' | 'reel' | 'user' | 'comment', targetId: string, reason: string, details?: string) => void;
  resolveReport: (reportId: string, status: 'resolved' | 'dismissed') => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeModal: ModalType | null;
  openModal: (modal: ModalType, targetData?: any) => void;
  closeModal: () => void;
  modalTargetData: any;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  followedUserIds: string[];
  toggleFollowUser: (userId: string) => void;
  connectedUserIds: string[];
  requestConnection: (userId: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state or default
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('cc_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('cc_current_user_id') || 'user-kwame';
  });

  const [schools, setSchools] = useState<School[]>(() => {
    const saved = localStorage.getItem('cc_schools');
    return saved ? JSON.parse(saved) : INITIAL_SCHOOLS;
  });

  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>('school-1');

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('cc_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [comments, setComments] = useState<Record<string, Comment[]>>(() => {
    const saved = localStorage.getItem('cc_comments');
    if (saved) return JSON.parse(saved);
    const initialMap: Record<string, Comment[]> = {};
    INITIAL_COMMENTS.forEach((c) => {
      if (!initialMap[c.postId]) initialMap[c.postId] = [];
      initialMap[c.postId].push(c);
    });
    return initialMap;
  });

  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('cc_saved_posts');
    return saved ? JSON.parse(saved) : ['post-2'];
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('cc_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [reels, setReels] = useState<Reel[]>(() => {
    const saved = localStorage.getItem('cc_reels');
    return saved ? JSON.parse(saved) : INITIAL_REELS;
  });

  const [clubs, setClubs] = useState<GroupClub[]>(() => {
    const saved = localStorage.getItem('cc_clubs');
    return saved ? JSON.parse(saved) : INITIAL_CLUBS;
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('cc_challenges');
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
  });

  const [events, setEvents] = useState<CampusEvent[]>(() => {
    const saved = localStorage.getItem('cc_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('cc_opportunities');
    return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('cc_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-1');

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('cc_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [schoolMemories] = useState<SchoolMemoryAlbum[]>(INITIAL_MEMORIES);

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('cc_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [followedUserIds, setFollowedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('cc_followed_users');
    return saved ? JSON.parse(saved) : ['user-ama', 'user-teacher-angela'];
  });

  const [connectedUserIds, setConnectedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('cc_connected_users');
    return saved ? JSON.parse(saved) : ['user-ama'];
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [modalTargetData, setModalTargetData] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('cc_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cc_current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('cc_schools', JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem('cc_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('cc_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('cc_saved_posts', JSON.stringify(savedPostIds));
  }, [savedPostIds]);

  useEffect(() => {
    localStorage.setItem('cc_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('cc_reels', JSON.stringify(reels));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem('cc_clubs', JSON.stringify(clubs));
  }, [clubs]);

  useEffect(() => {
    localStorage.setItem('cc_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('cc_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('cc_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('cc_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('cc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('cc_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('cc_followed_users', JSON.stringify(followedUserIds));
  }, [followedUserIds]);

  useEffect(() => {
    localStorage.setItem('cc_connected_users', JSON.stringify(connectedUserIds));
  }, [connectedUserIds]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      if (targetUser.schoolId) {
        setSelectedSchoolId(targetUser.schoolId);
      }
      showToast(`Switched account to ${targetUser.name} (${targetUser.role.replace('_', ' ')})`, 'success');
    }
  };

  const updateCurrentUserProfile = (updatedData: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updatedData } : u))
    );
    showToast('Profile updated successfully!', 'success');
  };

  const activeSchool = schools.find((s) => s.id === selectedSchoolId) || schools[0];

  const createPost = (newPostData: Omit<Post, 'id' | 'likesCount' | 'likedByUser' | 'commentsCount' | 'sharesCount' | 'repostsCount' | 'createdAt'>) => {
    const newPost: Post = {
      ...newPostData,
      id: `post-${Date.now()}`,
      likesCount: 0,
      likedByUser: false,
      commentsCount: 0,
      sharesCount: 0,
      repostsCount: 0,
      createdAt: 'Just now'
    };

    setPosts((prev) => [newPost, ...prev]);
    showToast('Post published to Campus Connect!', 'success');
  };

  const likePost = (postId: string, reaction: 'like' | 'love' | 'funny' | 'celebrate' | 'wow' = 'like') => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const alreadyLiked = p.likedByUser;
        return {
          ...p,
          likedByUser: !alreadyLiked,
          likesCount: alreadyLiked ? Math.max(0, p.likesCount - 1) : p.likesCount + 1,
          userReaction: alreadyLiked ? undefined : reaction
        };
      })
    );
  };

  const repostPost = (postId: string, commentText?: string) => {
    const originalPost = posts.find((p) => p.id === postId);
    if (!originalPost) return;

    const repostItem: Post = {
      id: `repost-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      authorSchool: currentUser.schoolName,
      authorRole: currentUser.role,
      type: 'repost',
      text: commentText || `Reposted from @${originalPost.authorUsername}`,
      repostOf: {
        originalAuthorName: originalPost.authorName,
        originalAuthorUsername: originalPost.authorUsername,
        originalAuthorAvatar: originalPost.authorAvatar,
        originalAuthorSchool: originalPost.authorSchool,
        originalText: originalPost.text,
        originalMediaUrls: originalPost.mediaUrls,
        originalDate: originalPost.createdAt
      },
      likesCount: 0,
      likedByUser: false,
      commentsCount: 0,
      sharesCount: 0,
      repostsCount: 0,
      allowDownloads: originalPost.allowDownloads,
      createdAt: 'Just now',
      tags: originalPost.tags
    };

    setPosts((prev) => [repostItem, ...prev]);
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, repostsCount: p.repostsCount + 1 } : p))
    );
    showToast('Reposted to your followers!', 'success');
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      postId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      authorSchool: currentUser.schoolName,
      text: text.trim(),
      likesCount: 0,
      likedByUser: false,
      createdAt: 'Just now'
    };

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );
    showToast('Comment added!', 'success');
  };

  const deleteComment = (postId: string, commentId: string) => {
    setComments((prev) => ({
      ...prev,
      [postId]: (prev[postId] || []).filter((c) => c.id !== commentId)
    }));
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentsCount: Math.max(0, p.commentsCount - 1) } : p))
    );
  };

  const votePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId || !p.poll) return p;
        if (p.poll.userVotedId) return p; // already voted

        const updatedOptions = p.poll.options.map((opt) =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        );

        return {
          ...p,
          poll: {
            ...p.poll,
            options: updatedOptions,
            totalVotes: p.poll.totalVotes + 1,
            userVotedId: optionId
          }
        };
      })
    );
    showToast('Your vote has been counted in the school poll!', 'success');
  };

  const toggleSavePost = (postId: string) => {
    setSavedPostIds((prev) => {
      const isSaved = prev.includes(postId);
      const updated = isSaved ? prev.filter((id) => id !== postId) : [...prev, postId];
      showToast(isSaved ? 'Removed from saved collection' : 'Saved to your profile collection', 'info');
      return updated;
    });
  };

  const createStory = (storyData: Omit<Story, 'id' | 'authorId' | 'authorName' | 'authorUsername' | 'authorAvatar' | 'authorSchool' | 'createdAt'>) => {
    const newStory: Story = {
      ...storyData,
      id: `story-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      authorSchool: currentUser.schoolName,
      createdAt: 'Just now',
      viewed: false
    };
    setStories((prev) => [newStory, ...prev]);
    showToast('Story posted (active for 24 hours)!', 'success');
  };

  const markStoryViewed = (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, viewed: true } : s))
    );
  };

  const createReel = (reelData: Omit<Reel, 'id' | 'creatorId' | 'creatorName' | 'creatorUsername' | 'creatorAvatar' | 'creatorSchool' | 'likesCount' | 'likedByUser' | 'commentsCount' | 'sharesCount' | 'downloadsCount' | 'createdAt'>) => {
    const newReel: Reel = {
      ...reelData,
      id: `reel-${Date.now()}`,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorUsername: currentUser.username,
      creatorAvatar: currentUser.avatar,
      creatorSchool: currentUser.schoolName,
      likesCount: 0,
      likedByUser: false,
      commentsCount: 0,
      sharesCount: 0,
      downloadsCount: 0,
      createdAt: 'Just now'
    };
    setReels((prev) => [newReel, ...prev]);
    showToast('Reel published to Campus Connect!', 'success');
  };

  const likeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id !== reelId) return r;
        const liked = r.likedByUser;
        return {
          ...r,
          likedByUser: !liked,
          likesCount: liked ? Math.max(0, r.likesCount - 1) : r.likesCount + 1
        };
      })
    );
  };

  const toggleJoinClub = (clubId: string) => {
    setClubs((prev) =>
      prev.map((c) => {
        if (c.id !== clubId) return c;
        const nextJoined = !c.isJoined;
        showToast(nextJoined ? `Joined ${c.name}!` : `Left ${c.name}`, 'info');
        return {
          ...c,
          isJoined: nextJoined,
          membersCount: nextJoined ? c.membersCount + 1 : Math.max(0, c.membersCount - 1)
        };
      })
    );
  };

  const voteChallenge = (challengeId: string, schoolId: string) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id !== challengeId) return ch;
        if (ch.userVotedFor) {
          showToast('You already voted in this challenge!', 'info');
          return ch;
        }

        const isA = ch.schoolA.id === schoolId;
        const updatedA = isA ? { ...ch.schoolA, votes: ch.schoolA.votes + 1 } : ch.schoolA;
        const updatedB = !isA ? { ...ch.schoolB, votes: ch.schoolB.votes + 1 } : ch.schoolB;

        showToast('Vote cheered! Your school score increased!', 'success');
        return {
          ...ch,
          schoolA: updatedA,
          schoolB: updatedB,
          userVotedFor: schoolId,
          totalCheeringCount: ch.totalCheeringCount + 1
        };
      })
    );
  };

  const toggleRsvpEvent = (eventId: string, status: 'interested' | 'going' | null) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const oldStatus = ev.userStatus;
        let newInterested = ev.interestedCount;
        let newGoing = ev.goingCount;

        if (oldStatus === 'interested') newInterested--;
        if (oldStatus === 'going') newGoing--;

        if (status === 'interested') newInterested++;
        if (status === 'going') newGoing++;

        showToast(status ? `RSVP saved as ${status}!` : 'RSVP cancelled', 'success');
        return {
          ...ev,
          interestedCount: Math.max(0, newInterested),
          goingCount: Math.max(0, newGoing),
          userStatus: status
        };
      })
    );
  };

  const toggleSaveOpportunity = (oppId: string) => {
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id !== oppId) return opp;
        const isSaved = !opp.isSaved;
        showToast(isSaved ? 'Opportunity bookmarked!' : 'Removed from bookmarks', 'info');
        return { ...opp, isSaved };
      })
    );
  };

  const sendMessage = (conversationId: string, text: string, mediaUrl?: string) => {
    if (!text.trim() && !mediaUrl) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: text.trim(),
      mediaUrl,
      timestamp: 'Just now',
      isRead: true
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== conversationId) return conv;
        return {
          ...conv,
          lastMessage: text.trim() || 'Photo attachment',
          lastMessageTime: 'Just now',
          messages: [...conv.messages, newMsg]
        };
      })
    );
  };

  const startDirectMessage = (user: User) => {
    // Check if conversation exists
    let existing = conversations.find((c) => c.participant.id === user.id);
    if (!existing) {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        participant: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          school: user.schoolName,
          isOnline: true
        },
        lastMessage: 'Started a conversation',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        messages: []
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
    } else {
      setActiveConversationId(existing.id);
    }
    setActiveTab('chat');
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  const submitReport = (
    targetType: 'post' | 'reel' | 'user' | 'comment',
    targetId: string,
    reason: string,
    details?: string
  ) => {
    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      targetType,
      targetId,
      reportedBy: currentUser.username,
      reason,
      details,
      timestamp: 'Just now',
      status: 'pending'
    };
    setReports((prev) => [newReport, ...prev]);
    showToast('Report submitted. Our moderation team will review it promptly.', 'info');
    closeModal();
  };

  const resolveReport = (reportId: string, status: 'resolved' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );
    showToast(`Report marked as ${status}`, 'success');
  };

  const openModal = (modal: ModalType, targetData?: any) => {
    setActiveModal(modal);
    setModalTargetData(targetData);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalTargetData(null);
  };

  const toggleFollowUser = (userId: string) => {
    setFollowedUserIds((prev) => {
      const isFollowing = prev.includes(userId);
      showToast(isFollowing ? 'Unfollowed user' : 'Following user updates!', 'info');
      return isFollowing ? prev.filter((id) => id !== userId) : [...prev, userId];
    });
  };

  const requestConnection = (userId: string) => {
    if (connectedUserIds.includes(userId)) {
      setConnectedUserIds((prev) => prev.filter((id) => id !== userId));
      showToast('Connection removed', 'info');
    } else {
      setConnectedUserIds((prev) => [...prev, userId]);
      showToast('Connection request sent & accepted!', 'success');
    }
  };

  const resetDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUserId('user-kwame');
    setSchools(INITIAL_SCHOOLS);
    setSelectedSchoolId('school-1');
    setPosts(INITIAL_POSTS);
    setStories(INITIAL_STORIES);
    setReels(INITIAL_REELS);
    setClubs(INITIAL_CLUBS);
    setChallenges(INITIAL_CHALLENGES);
    setEvents(INITIAL_EVENTS);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setConversations(INITIAL_CONVERSATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setReports(INITIAL_REPORTS);
    setFollowedUserIds(['user-ama', 'user-teacher-angela']);
    setConnectedUserIds(['user-ama']);
    showToast('Demo data reset to initial showcase state', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        switchUser,
        updateCurrentUserProfile,
        schools,
        selectedSchoolId,
        setSelectedSchoolId,
        activeSchool,
        posts,
        createPost,
        likePost,
        repostPost,
        comments,
        addComment,
        deleteComment,
        votePoll,
        savedPostIds,
        toggleSavePost,
        stories,
        createStory,
        markStoryViewed,
        reels,
        createReel,
        likeReel,
        clubs,
        toggleJoinClub,
        challenges,
        voteChallenge,
        events,
        toggleRsvpEvent,
        opportunities,
        toggleSaveOpportunity,
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        startDirectMessage,
        notifications,
        markNotificationRead,
        unreadNotifCount,
        schoolMemories,
        reports,
        submitReport,
        resolveReport,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        activeModal,
        openModal,
        closeModal,
        modalTargetData,
        toast,
        showToast,
        followedUserIds,
        toggleFollowUser,
        connectedUserIds,
        requestConnection,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
