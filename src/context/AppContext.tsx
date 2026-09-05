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
  ReportItem,
  SchoolStaffRecord,
  SchoolStaffPermissions,
  AdminAuditLog,
  UserRole,
  ClubChannel,
  GroupMessage
} from '../types';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  subscribeToPosts,
  subscribeToStories,
  subscribeToReels,
  subscribeToConversations,
  subscribeToComments,
  subscribeToSchools,
  subscribeToClubs,
  subscribeToEvents,
  subscribeToUsers,
  subscribeToSchoolStaff,
  savePostToFirebase,
  updatePostInFirebase,
  deletePostFromFirebase,
  saveStoryToFirebase,
  saveReelToFirebase,
  updateReelInFirebase,
  updateClubInFirebase,
  updateChallengeInFirebase,
  updateEventInFirebase,
  saveConversationToFirebase,
  saveReportToFirebase,
  saveUserToFirebase,
  saveSchoolToFirebase,
  saveClubToFirebase,
  updateUserInFirebase,
  getUserFromFirebase,
  saveCommentToFirebase,
  deleteCommentFromFirebase,
  saveSchoolStaffToFirebase,
  deleteSchoolStaffFromFirebase,
  deleteSchoolFromFirebase,
  deleteUserFromFirebase,
  deleteReelFromFirebase,
  deleteStoryFromFirebase,
  deleteClubFromFirebase
} from '../lib/firestoreService';
import {
  DEFAULT_GUEST_USER,
  DEFAULT_BLANK_SCHOOL,
  DEMO_ADMIN_USER,
  DEMO_STUDENT_USER,
  DEMO_TEACHER_USER,
  INITIAL_DEMO_SCHOOLS,
  INITIAL_DEMO_CHALLENGES,
  INITIAL_DEMO_EVENTS,
  INITIAL_DEMO_OPPORTUNITIES
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
  | 'admin'
  | 'studybuddy'
  | 'marketplace';

export type ModalType =
  | 'create_post'
  | 'create_reel'
  | 'create_story'
  | 'create_event'
  | 'create_poll'
  | 'report'
  | 'share'
  | 'super_admin'
  | 'school_admin'
  | 'platform_admin'
  | 'edit_profile'
  | 'auth';

interface AppContextType {
  currentUser: User;
  users: User[];
  allUsers: User[];
  isFirebaseAuthActive: boolean;
  firebaseUserEmail: string | null;
  isAuthenticated: boolean;
  isAuthChecking: boolean;
  isSuperAdmin: boolean;
  setAuthUser: (user: User) => void;
  signOutUser: () => Promise<void>;
  switchUser: (userId: string) => void;
  updateCurrentUserProfile: (updatedData: Partial<User>) => void;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  toggleUserVerification: (userId: string) => void;
  deleteUserAccount: (userId: string) => void;
  schools: School[];
  selectedSchoolId: string | null;
  setSelectedSchoolId: (id: string | null) => void;
  addSchool: (school: School) => void;
  updateSchool: ((schoolId: string, partial: Partial<School>) => void) & ((school: School) => void);
  deleteSchool: (schoolId: string) => void;
  activeSchool: School;
  schoolStaff: SchoolStaffRecord[];
  isSchoolAuthorized: (schoolId?: string) => boolean;
  getSchoolPermissions: (schoolId?: string) => SchoolStaffPermissions | null;
  assignSchoolStaff: ((record: Omit<SchoolStaffRecord, 'id' | 'assignedAt'>) => void) & ((schoolId: string, userId: string, permissions?: any, title?: string) => void);
  removeSchoolStaff: (staffId: string) => void;
  dismissReport: (reportId: string) => void;
  auditLogs: AdminAuditLog[];
  addAuditLog: (action: string, target: string, details?: string) => void;
  clearAuditLogs: () => void;
  isPostsLoading: boolean;
  posts: Post[];
  createPost: (post: Omit<Post, 'id' | 'likesCount' | 'likedByUser' | 'commentsCount' | 'sharesCount' | 'repostsCount' | 'createdAt'>) => void;
  deletePost: (postId: string) => void;
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
  deleteStory: (storyId: string) => void;
  markStoryViewed: (storyId: string) => void;
  reels: Reel[];
  createReel: (reel: Omit<Reel, 'id' | 'creatorId' | 'creatorName' | 'creatorUsername' | 'creatorAvatar' | 'creatorSchool' | 'likesCount' | 'likedByUser' | 'commentsCount' | 'sharesCount' | 'downloadsCount' | 'createdAt'>) => void;
  likeReel: (reelId: string) => void;
  deleteReel: (reelId: string) => void;
  clubs: GroupClub[];
  toggleJoinClub: (clubId: string) => void;
  deleteClub: (clubId: string) => void;
  challenges: Challenge[];
  voteChallenge: (challengeId: string, schoolId: string) => void;
  cheerChallenge: (challengeId: string, schoolId: string) => void;
  addChallengeHype: (challengeId: string, text: string) => void;
  createChallenge: (challenge: Challenge) => void;
  events: CampusEvent[];
  toggleRsvpEvent: (eventId: string, status: 'interested' | 'going' | null) => void;
  checkInEvent: (eventId: string) => void;
  opportunities: Opportunity[];
  toggleSaveOpportunity: (oppId: string) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string, mediaUrl?: string) => void;
  startDirectMessage: (user: User) => void;
  clubChannels: ClubChannel[];
  activeChannelId: string | null;
  setActiveChannelId: (id: string | null) => void;
  sendGroupMessage: (channelId: string, text: string) => void;
  toggleJoinChannel: (channelId: string) => void;
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
  // Fix #16: Move localStorage purge to useEffect so it doesn't run on every render
  useEffect(() => {
    const version = localStorage.getItem('cc_clean_prod_v3');
    if (!version) {
      const keysToClean = [
        'cc_users', 'cc_current_user_id', 'cc_schools', 'cc_selected_school_id',
        'cc_posts', 'cc_comments', 'cc_saved_posts', 'cc_stories', 'cc_reels',
        'cc_clubs', 'cc_challenges', 'cc_events', 'cc_opportunities',
        'cc_conversations', 'cc_notifications', 'cc_reports',
        'cc_followed_users', 'cc_connected_users'
      ];
      keysToClean.forEach((k) => localStorage.removeItem(k));
      localStorage.setItem('cc_clean_prod_v3', 'true');
    }
  }, []);

  // Fix #5: Only user-preference state is hydrated from localStorage.
  // Firestore-backed collections (posts, stories, etc.) start empty and are
  // populated exclusively by real-time Firestore listeners — preventing the
  // stale-localStorage-overrides-fresh-Firestore conflict.
  // Base users: Start with curated demo users so initial browse works immediately
  const [users, setUsers] = useState<User[]>([
    DEMO_ADMIN_USER,
    DEMO_STUDENT_USER,
    DEMO_TEACHER_USER
  ]);

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('cc_current_user_id') || '';
  });

  const [schools, setSchools] = useState<School[]>(INITIAL_DEMO_SCHOOLS);

  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(() => {
    return localStorage.getItem('cc_selected_school_id') || INITIAL_DEMO_SCHOOLS[0].id;
  });

  // Admin audit logs tracking
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => {
    const saved = localStorage.getItem('cc_admin_audit_logs');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'init-audit-1',
            adminId: 'super-admin-1',
            adminName: 'Platform Administrator',
            action: 'System Security Console Initialized',
            target: 'Platform Governance Hub',
            details: 'Campus Connect administration console active.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
  });

  const [isPostsLoading, setIsPostsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [stories, setStories] = useState<Story[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [clubs, setClubs] = useState<GroupClub[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_DEMO_CHALLENGES);
  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_DEMO_EVENTS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_DEMO_OPPORTUNITIES);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);

  // Fix #5: Only persisted user-preference state stays in localStorage
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('cc_saved_posts');
    return saved ? JSON.parse(saved) : [];
  });

  const [followedUserIds, setFollowedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('cc_followed_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [connectedUserIds, setConnectedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('cc_connected_users');
    return saved ? JSON.parse(saved) : [];
  });

  // Fix #2: Per-user like tracking stored locally — prevents likedByUser
  // being shared across all users when Firestore snapshots update the global post doc
  const [likedPostIds, setLikedPostIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('cc_liked_posts');
    return saved ? JSON.parse(saved) : [];
  });

  const [likedReelIds, setLikedReelIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('cc_liked_reels');
    return saved ? JSON.parse(saved) : [];
  });

  const [schoolStaff, setSchoolStaff] = useState<SchoolStaffRecord[]>(() => {
    const saved = localStorage.getItem('cc_school_staff');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [clubChannels, setClubChannels] = useState<ClubChannel[]>([
    {
      id: 'channel-robotics',
      clubId: 'club-robotics',
      clubName: 'Inter-School Robotics League',
      clubCategory: 'STEM & Technology',
      coverImage: 'https://images.unsplash.com/photo-1561144257-e32e8506b5cc?w=400&auto=format&fit=crop&q=80',
      description: 'Official channel for the Inter-School Robotics League. Share builds, ideas & competition updates!',
      membersCount: 284,
      isJoined: false,
      messages: [
        { id: 'gm-1', channelId: 'channel-robotics', senderId: 'demo-student-1', senderName: 'Kwame Mensah', senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80', senderSchool: 'Achimota Senior High', text: 'Just finished the chassis for our bot! 🤖 Competition is in 2 weeks.', timestamp: '10:24 AM' },
        { id: 'gm-2', channelId: 'channel-robotics', senderId: 'demo-teacher-1', senderName: 'Dr. Evelyn Addo', senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80', senderSchool: 'PRESEC', text: 'Excellent work Kwame! Has everyone submitted their technical spec sheets?', timestamp: '10:31 AM' },
      ],
      lastMessage: 'Has everyone submitted their technical spec sheets?',
      lastMessageTime: '10:31 AM',
      unreadCount: 2
    },
    {
      id: 'channel-debate',
      clubId: 'club-debate',
      clubName: 'National Debate Society',
      clubCategory: 'Public Speaking',
      coverImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&auto=format&fit=crop&q=80',
      description: 'Official channel for the National Debate Society. Motions, practice sessions & tournament news!',
      membersCount: 156,
      isJoined: false,
      messages: [
        { id: 'gm-3', channelId: 'channel-debate', senderId: 'super-admin-1', senderName: 'Platform Administrator', senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', senderSchool: 'Campus Connect', text: '📢 New debate motion released: "AI should replace teachers in secondary schools." Prep your cases!', timestamp: '9:00 AM' },
      ],
      lastMessage: 'New debate motion released',
      lastMessageTime: '9:00 AM',
      unreadCount: 1
    },
    {
      id: 'channel-arts',
      clubId: 'club-arts',
      clubName: 'Campus Arts & Creative Collective',
      clubCategory: 'Arts & Culture',
      coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=80',
      description: 'Share your art, music, photography, poetry, and creative projects with fellow campus creators.',
      membersCount: 412,
      isJoined: false,
      messages: [
        { id: 'gm-4', channelId: 'channel-arts', senderId: 'demo-student-1', senderName: 'Kwame Mensah', senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80', senderSchool: 'Achimota Senior High', text: 'Just dropped my new digital artwork for the campus art show! 🎨', timestamp: '8:45 AM' },
      ],
      lastMessage: 'Just dropped my new digital artwork!',
      lastMessageTime: '8:45 AM',
      unreadCount: 0
    }
  ]);
  const [schoolMemories] = useState<SchoolMemoryAlbum[]>([]);


  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [modalTargetData, setModalTargetData] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Real Firebase Authentication status
  const [isFirebaseAuthActive, setIsFirebaseAuthActive] = useState<boolean>(false);
  const [firebaseUserEmail, setFirebaseUserEmail] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  // Fix #5: Only persist user-preference state to localStorage.
  // Firestore-backed content (posts, reels, etc.) must NOT be written to localStorage
  // because Firestore real-time listeners are the authoritative source and will overwrite anyway.
  useEffect(() => {
    localStorage.setItem('cc_current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('cc_saved_posts', JSON.stringify(savedPostIds));
  }, [savedPostIds]);

  useEffect(() => {
    localStorage.setItem('cc_followed_users', JSON.stringify(followedUserIds));
  }, [followedUserIds]);

  useEffect(() => {
    localStorage.setItem('cc_connected_users', JSON.stringify(connectedUserIds));
  }, [connectedUserIds]);

  useEffect(() => {
    localStorage.setItem('cc_school_staff', JSON.stringify(schoolStaff));
  }, [schoolStaff]);

  // Fix #2: Persist per-user like state locally
  useEffect(() => {
    localStorage.setItem('cc_liked_posts', JSON.stringify(likedPostIds));
  }, [likedPostIds]);

  useEffect(() => {
    localStorage.setItem('cc_liked_reels', JSON.stringify(likedReelIds));
  }, [likedReelIds]);

  useEffect(() => {
    localStorage.setItem('cc_selected_school_id', selectedSchoolId || '');
  }, [selectedSchoolId]);


  // Firestore & Firebase Auth real-time sync
  useEffect(() => {
    let safetyTimer = setTimeout(() => {
      setIsAuthChecking(false);
      setIsPostsLoading(false);
    }, 2000);

    // Listen for Firebase Auth user
    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      clearTimeout(safetyTimer);
      if (fbUser) {
        setIsFirebaseAuthActive(true);
        setFirebaseUserEmail(fbUser.email);
        try {
          const profile = await getUserFromFirebase(fbUser.uid);
          if (profile) {
            setUsers((prev) => {
              const idx = prev.findIndex((u) => u.id === profile.id);
              if (idx >= 0) {
                const copy = [...prev];
                copy[idx] = profile;
                return copy;
              }
              return [profile, ...prev];
            });
            setCurrentUserId(profile.id);
            if (profile.schoolId) {
              setSelectedSchoolId(profile.schoolId);
            }
          } else {
            // If user authenticated but profile not yet in Firestore (e.g. fresh Google Sign-in)
            const fallbackProfile: User = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Campus Member',
              username: (fbUser.displayName || fbUser.email?.split('@')[0] || 'member').toLowerCase().replace(/[^a-z0-9]/g, '_'),
              email: fbUser.email || '',
              role: 'user',
              userType: 'student',
              accountStatus: 'active',
              avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
              coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
              bio: 'Campus Connect member',
              schoolId: '',
              schoolName: 'Campus Connect',
              classLevel: 'Student',
              interests: ['Academics', 'Campus Life'],
              creatorTalents: [],
              badges: ['Verified Member'],
              followersCount: 0,
              followingCount: 0,
              connectionsCount: 0,
              isVerified: true,
              isPrivate: false,
              allowDownloads: true,
              whoCanMessage: 'everyone',
              whoCanConnect: 'everyone'
            };
            setUsers((prev) => [fallbackProfile, ...prev.filter((u) => u.id !== fallbackProfile.id)]);
            setCurrentUserId(fallbackProfile.id);
            saveUserToFirebase(fallbackProfile).catch(() => {});
          }
        } catch (err) {
          console.warn('Firebase user sync note:', err);
        }
      } else {
        setIsFirebaseAuthActive(false);
        setFirebaseUserEmail(null);
        setCurrentUserId('');
        localStorage.removeItem('cc_current_user_id');
      }
      setIsAuthChecking(false);
    });

    // Real-time live posts stream
    // Fix #2: likedByUser is resolved from local likedPostIds so each user sees their own like state
    const unsubPosts = subscribeToPosts((livePosts) => {
      setPosts(livePosts.map((lp) => ({
        ...lp,
        likedByUser: false, // will be computed via derived value below
      })));
      setIsPostsLoading(false);
    });

    // Real-time stories stream
    const unsubStories = subscribeToStories((liveStories) => {
      setStories(liveStories);
    });

    // Real-time reels stream
    const unsubReels = subscribeToReels((liveReels) => {
      setReels(liveReels);
    });

    // Real-time conversations stream
    const unsubConvs = subscribeToConversations((liveConvs) => {
      setConversations(liveConvs);
    });

    // Real-time comments stream
    const unsubComments = subscribeToComments((liveComments) => {
      setComments((prev) => {
        const updated: Record<string, Comment[]> = { ...prev };
        liveComments.forEach((c) => {
          if (!updated[c.postId]) updated[c.postId] = [];
          if (!updated[c.postId].some((e) => e.id === c.id)) {
            updated[c.postId].push(c);
          }
        });
        return updated;
      });
    });

    // Real-time schools stream
    const unsubSchools = subscribeToSchools((liveSchools) => {
      if (liveSchools.length > 0) {
        setSchools(liveSchools);
      }
    });

    // Real-time clubs stream
    const unsubClubs = subscribeToClubs((liveClubs) => {
      if (liveClubs.length > 0) {
        setClubs(liveClubs);
      }
    });

    // Real-time events stream
    const unsubEvents = subscribeToEvents((liveEvents) => {
      if (liveEvents.length > 0) {
        setEvents(liveEvents);
      }
    });

    // Real-time users stream
    const unsubUsers = subscribeToUsers((liveUsers) => {
      if (liveUsers.length > 0) {
        setUsers(liveUsers);
      }
    });

    // Real-time school staff stream
    const unsubStaff = subscribeToSchoolStaff((liveStaff) => {
      setSchoolStaff(liveStaff);
    });

    return () => {
      unsubAuth();
      unsubPosts();
      unsubStories();
      unsubReels();
      unsubConvs();
      unsubComments();
      unsubSchools();
      unsubClubs();
      unsubEvents();
      unsubUsers();
      unsubStaff();
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  const currentUser: User =
    users.find((u) => u.id === currentUserId) || DEFAULT_GUEST_USER;

  const isAuthenticated: boolean = Boolean(
    (isFirebaseAuthActive || currentUserId.startsWith('demo-') || currentUserId.startsWith('super-admin')) &&
    currentUserId &&
    currentUserId !== 'guest' &&
    currentUser &&
    currentUser.id !== 'guest'
  );

  const setAuthUser = (user: User) => {
    setUsers((prev) => {
      const idx = prev.findIndex((u) => u.id === user.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = user;
        return copy;
      }
      return [user, ...prev];
    });
    setCurrentUserId(user.id);
    localStorage.setItem('cc_current_user_id', user.id);
    if (user.schoolId) setSelectedSchoolId(user.schoolId);
    setIsFirebaseAuthActive(true);
    setFirebaseUserEmail(user.email);
    setIsAuthChecking(false);
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.warn('Sign out issue:', err);
    }
    setIsFirebaseAuthActive(false);
    setFirebaseUserEmail(null);
    setCurrentUserId('');
    localStorage.removeItem('cc_current_user_id');
    showToast('Signed out of your campus account.', 'info');
  };

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
    updateUserInFirebase(currentUser.id, updatedData);
    showToast('Profile updated & synced to Cloud Firestore!', 'success');
  };

  const isSuperAdmin = currentUser.role === 'super_admin';

  const isSchoolAuthorized = (schoolId?: string): boolean => {
    if (!schoolId) return isSuperAdmin;
    if (isSuperAdmin) return true;
    return schoolStaff.some(
      (s) => s.userId === currentUser.id && s.schoolId === schoolId
    );
  };

  const getSchoolPermissions = (schoolId?: string): SchoolStaffPermissions | null => {
    if (isSuperAdmin) {
      return {
        manageSchoolProfile: true,
        createSchoolPosts: true,
        manageSchoolEvents: true
      };
    }
    const staffRecord = schoolStaff.find(
      (s) => s.userId === currentUser.id && s.schoolId === schoolId
    );
    return staffRecord ? staffRecord.permissions : null;
  };

  const addAuditLog = (action: string, target: string, details?: string) => {
    const log: AdminAuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      action,
      target,
      details,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setAuditLogs((prev) => {
      const updated = [log, ...prev].slice(0, 100);
      try {
        localStorage.setItem('cc_admin_audit_logs', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    localStorage.removeItem('cc_admin_audit_logs');
    showToast('Audit logs cleared.', 'info');
  };

  const assignSchoolStaff = (
    recordOrSchoolId: Omit<SchoolStaffRecord, 'id' | 'assignedAt'> | string,
    userId?: string,
    permissions?: any,
    title?: string
  ) => {
    let finalRecord: SchoolStaffRecord;
    if (typeof recordOrSchoolId === 'string') {
      const sId = recordOrSchoolId;
      const uId = userId || '';
      const schoolObj = schools.find((s) => s.id === sId);
      const userObj = users.find((u) => u.id === uId);
      finalRecord = {
        id: `staff-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        schoolId: sId,
        schoolName: schoolObj?.name || sId,
        userId: uId,
        userName: userObj?.name || `User ${uId}`,
        userUsername: userObj?.username || 'staff',
        permissions:
          typeof permissions === 'object' && permissions !== null && !Array.isArray(permissions)
            ? permissions
            : {
                manageSchoolProfile: true,
                createSchoolPosts: true,
                manageSchoolEvents: true
              },
        assignedAt: new Date().toISOString()
      };
    } else {
      finalRecord = {
        ...recordOrSchoolId,
        id: `staff-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        assignedAt: new Date().toISOString()
      };
    }
    setSchoolStaff((prev) => [
      finalRecord,
      ...prev.filter((s) => !(s.userId === finalRecord.userId && s.schoolId === finalRecord.schoolId))
    ]);
    saveSchoolStaffToFirebase(finalRecord);
    addAuditLog('Assigned School Staff', `${finalRecord.userName} → ${finalRecord.schoolName}`, title);
    showToast(`Assigned ${finalRecord.userName} as representative for ${finalRecord.schoolName}!`, 'success');
  };

  const removeSchoolStaff = (staffId: string) => {
    const record = schoolStaff.find((s) => s.id === staffId);
    setSchoolStaff((prev) => prev.filter((s) => s.id !== staffId));
    deleteSchoolStaffFromFirebase(staffId);
    addAuditLog('Revoked School Staff', record?.userName || staffId, `From ${record?.schoolName || 'school'}`);
    showToast('School staff authorization revoked.', 'info');
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    updateUserInFirebase(userId, { role });
    addAuditLog('Role Updated', `User #${userId}`, `New role: ${role}`);
    showToast(`User role updated to ${role.replace('_', ' ').toUpperCase()}.`, 'success');
  };

  const updateUserStatus = (userId: string, status: 'active' | 'suspended') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, accountStatus: status } : u))
    );
    updateUserInFirebase(userId, { accountStatus: status });
    addAuditLog('Account Status Updated', `User #${userId}`, `Status set to ${status}`);
    showToast(`User account status set to ${status}.`, 'info');
  };

  const toggleUserVerification = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const newVer = !u.isVerified;
        updateUserInFirebase(userId, { isVerified: newVer });
        addAuditLog('Verification Toggled', `${u.name} (@${u.username})`, newVer ? 'Verified' : 'Unverified');
        showToast(newVer ? `Granted verified status to ${u.name}` : `Removed verified status from ${u.name}`, 'info');
        return { ...u, isVerified: newVer };
      })
    );
  };

  const deleteUserAccount = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    deleteUserFromFirebase(userId);
    addAuditLog('Deleted User Account', target?.name || userId, target?.email);
    showToast('User account removed permanently.', 'info');
  };

  const activeSchool: School =
    schools.find((s) => s.id === selectedSchoolId) || schools[0] || DEFAULT_BLANK_SCHOOL;

  const addSchool = (school: School) => {
    setSchools((prev) => {
      if (prev.some((s) => s.id === school.id)) return prev;
      return [school, ...prev];
    });
    saveSchoolToFirebase(school);
    addAuditLog('Added School', school.name, `${school.location} • ${school.studentCount} students`);
  };

  const updateSchool = (schoolIdOrSchool: string | School, partial?: Partial<School>) => {
    let schoolId: string;
    let updates: Partial<School>;
    if (typeof schoolIdOrSchool === 'string') {
      schoolId = schoolIdOrSchool;
      updates = partial || {};
    } else {
      schoolId = schoolIdOrSchool.id;
      updates = schoolIdOrSchool;
    }

    setSchools((prev) =>
      prev.map((s) => (s.id === schoolId ? { ...s, ...updates } : s))
    );
    const existing = schools.find((s) => s.id === schoolId);
    if (existing) {
      saveSchoolToFirebase({ ...existing, ...updates });
      addAuditLog('Updated School', existing.name);
    }
    showToast('School profile updated successfully.', 'success');
  };

  const deleteSchool = (schoolId: string) => {
    const target = schools.find((s) => s.id === schoolId);
    setSchools((prev) => prev.filter((s) => s.id !== schoolId));
    deleteSchoolFromFirebase(schoolId);
    if (selectedSchoolId === schoolId) {
      setSelectedSchoolId(schools[0]?.id || null);
    }
    addAuditLog('Deleted School', target?.name || schoolId);
    showToast('School removed.', 'info');
  };

  const dismissReport = (reportId: string) => {
    resolveReport(reportId, 'dismissed');
    addAuditLog('Dismissed Report', `Report #${reportId}`);
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    deletePostFromFirebase(postId);
    showToast('Post removed successfully.', 'info');
  };

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
    savePostToFirebase(newPost);
    showToast('Post published to Campus Connect!', 'success');
  };

  // Fix #2: track per-user likes in likedPostIds (localStorage) rather than relying on
  // the global Firestore post document's likedByUser field (which is shared across all users)
  const likePost = (postId: string, reaction: 'like' | 'love' | 'funny' | 'celebrate' | 'wow' = 'like') => {
    const alreadyLiked = likedPostIds.includes(postId);
    setLikedPostIds((prev) =>
      alreadyLiked ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const newCount = alreadyLiked ? Math.max(0, p.likesCount - 1) : p.likesCount + 1;
        updatePostInFirebase(postId, { likesCount: newCount });
        return {
          ...p,
          likedByUser: !alreadyLiked,
          likesCount: newCount,
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
    saveCommentToFirebase(newComment);
    updatePostInFirebase(postId, { commentsCount: (posts.find(p => p.id === postId)?.commentsCount || 0) + 1 });
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
    deleteCommentFromFirebase(commentId);
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
    saveStoryToFirebase(newStory);
    showToast('Story posted (active for 24 hours)!', 'success');
  };

  const markStoryViewed = (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, viewed: true } : s))
    );
  };

  const deleteStory = (storyId: string) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
    deleteStoryFromFirebase(storyId);
    showToast('Story removed.', 'info');
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
    saveReelToFirebase(newReel);
    showToast('Reel published to Campus Connect!', 'success');
  };

  // Fix #2: track per-user reel likes in likedReelIds
  const likeReel = (reelId: string) => {
    const alreadyLiked = likedReelIds.includes(reelId);
    setLikedReelIds((prev) =>
      alreadyLiked ? prev.filter((id) => id !== reelId) : [...prev, reelId]
    );
    setReels((prev) =>
      prev.map((r) => {
        if (r.id !== reelId) return r;
        const newLikes = alreadyLiked ? Math.max(0, r.likesCount - 1) : r.likesCount + 1;
        updateReelInFirebase(reelId, { likesCount: newLikes });
        return { ...r, likedByUser: !alreadyLiked, likesCount: newLikes };
      })
    );
  };

  const deleteReel = (reelId: string) => {
    setReels((prev) => prev.filter((r) => r.id !== reelId));
    deleteReelFromFirebase(reelId);
    showToast('Reel removed.', 'info');
  };

  const toggleJoinClub = (clubId: string) => {
    setClubs((prev) =>
      prev.map((c) => {
        if (c.id !== clubId) return c;
        const nextJoined = !c.isJoined;
        const newCount = nextJoined ? c.membersCount + 1 : Math.max(0, c.membersCount - 1);
        updateClubInFirebase(clubId, { isJoined: nextJoined, membersCount: newCount });
        showToast(nextJoined ? `Joined ${c.name}!` : `Left ${c.name}`, 'info');
        return {
          ...c,
          isJoined: nextJoined,
          membersCount: newCount
        };
      })
    );
  };

  const deleteClub = (clubId: string) => {
    setClubs((prev) => prev.filter((c) => c.id !== clubId));
    deleteClubFromFirebase(clubId);
    showToast('Club removed.', 'info');
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
        const newTotal = ch.totalCheeringCount + 1;

        updateChallengeInFirebase(challengeId, {
          schoolA: updatedA,
          schoolB: updatedB,
          userVotedFor: schoolId,
          totalCheeringCount: newTotal
        });

        showToast('Vote cheered! Your school score increased!', 'success');
        return {
          ...ch,
          schoolA: updatedA,
          schoolB: updatedB,
          userVotedFor: schoolId,
          totalCheeringCount: newTotal
        };
      })
    );
  };

  const cheerChallenge = (challengeId: string, schoolId: string) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id !== challengeId) return ch;
        const isA = ch.schoolA.id === schoolId;
        const updatedA = isA ? { ...ch.schoolA, cheers: (ch.schoolA.cheers || 0) + 1 } : ch.schoolA;
        const updatedB = !isA ? { ...ch.schoolB, cheers: (ch.schoolB.cheers || 0) + 1 } : ch.schoolB;
        const newTotal = ch.totalCheeringCount + 1;
        updateChallengeInFirebase(challengeId, { schoolA: updatedA, schoolB: updatedB, totalCheeringCount: newTotal });
        return { ...ch, schoolA: updatedA, schoolB: updatedB, totalCheeringCount: newTotal };
      })
    );
  };

  const addChallengeHype = (challengeId: string, text: string) => {
    if (!text.trim()) return;
    const hypeMsg = {
      id: `hype-${Date.now()}`,
      authorId: currentUserId,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorSchool: currentUser.schoolName,
      schoolCheered: currentUser.schoolName,
      text: text.trim(),
      timestamp: 'Just now'
    };
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id !== challengeId) return ch;
        const updated = { ...ch, hypeMessages: [...(ch.hypeMessages || []), hypeMsg] };
        updateChallengeInFirebase(challengeId, { hypeMessages: updated.hypeMessages });
        return updated;
      })
    );
  };

  const createChallenge = (challenge: Challenge) => {
    setChallenges((prev) => [challenge, ...prev]);
    updateChallengeInFirebase(challenge.id, challenge);
    showToast(`Tournament "${challenge.title}" created! 🏆`, 'success');
  };

  const sendGroupMessage = (channelId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg: GroupMessage = {
      id: `gm-${Date.now()}`,
      channelId,
      senderId: currentUserId,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderSchool: currentUser.schoolName,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setClubChannels((prev) =>
      prev.map((ch) =>
        ch.id === channelId
          ? { ...ch, messages: [...ch.messages, newMsg], lastMessage: text.trim(), lastMessageTime: newMsg.timestamp, unreadCount: 0 }
          : ch
      )
    );
  };

  const toggleJoinChannel = (channelId: string) => {
    setClubChannels((prev) =>
      prev.map((ch) => {
        if (ch.id !== channelId) return ch;
        const joining = !ch.isJoined;
        showToast(joining ? `Joined ${ch.clubName}! 🎉` : `Left ${ch.clubName}`, joining ? 'success' : 'info');
        return { ...ch, isJoined: joining, membersCount: ch.membersCount + (joining ? 1 : -1) };
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

        const finalInterested = Math.max(0, newInterested);
        const finalGoing = Math.max(0, newGoing);

        updateEventInFirebase(eventId, {
          interestedCount: finalInterested,
          goingCount: finalGoing,
          userStatus: status
        });

        showToast(status ? `RSVP saved as ${status}!` : 'RSVP cancelled', 'success');
        let updatedAttendees = ev.attendees ? [...ev.attendees] : [];
        if (status === 'going') {
          if (!updatedAttendees.some((a) => a.id === currentUser.id)) {
            updatedAttendees.unshift({
              id: currentUser.id,
              name: currentUser.name,
              username: currentUser.username,
              avatar: currentUser.avatar,
              schoolName: currentUser.schoolName || 'Campus Member',
              checkedIn: false,
              ticketCode: `${ev.eventCode || 'PASS'}-${Math.floor(1000 + Math.random() * 9000)}`
            });
          }
        } else if (oldStatus === 'going') {
          updatedAttendees = updatedAttendees.filter((a) => a.id !== currentUser.id);
        }

        return {
          ...ev,
          interestedCount: finalInterested,
          goingCount: finalGoing,
          userStatus: status,
          attendees: updatedAttendees
        };
      })
    );
  };

  const checkInEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const alreadyCheckedIn = ev.checkedInUserIds?.includes(currentUser.id);
        const newCheckedInIds = alreadyCheckedIn
          ? ev.checkedInUserIds?.filter((id) => id !== currentUser.id) || []
          : [...(ev.checkedInUserIds || []), currentUser.id];

        let updatedAttendees = ev.attendees ? [...ev.attendees] : [];
        const existingAttendeeIndex = updatedAttendees.findIndex((a) => a.id === currentUser.id);
        if (existingAttendeeIndex >= 0) {
          updatedAttendees[existingAttendeeIndex] = {
            ...updatedAttendees[existingAttendeeIndex],
            checkedIn: !alreadyCheckedIn
          };
        } else {
          updatedAttendees.unshift({
            id: currentUser.id,
            name: currentUser.name,
            username: currentUser.username,
            avatar: currentUser.avatar,
            schoolName: currentUser.schoolName || 'Campus Member',
            checkedIn: true,
            ticketCode: `${ev.eventCode || 'PASS'}-${Math.floor(1000 + Math.random() * 9000)}`
          });
        }

        showToast(
          alreadyCheckedIn
            ? 'Checked out of event pass'
            : `🎟️ Checked into ${ev.title}! Pass verified.`,
          'success'
        );

        return {
          ...ev,
          userStatus: 'going',
          goingCount: ev.userStatus === 'going' ? ev.goingCount : ev.goingCount + 1,
          checkedInUserIds: newCheckedInIds,
          attendees: updatedAttendees
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
        const updated = {
          ...conv,
          lastMessage: text.trim() || 'Photo attachment',
          lastMessageTime: 'Just now',
          messages: [...conv.messages, newMsg]
        };
        saveConversationToFirebase(updated);
        return updated;
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
    saveReportToFirebase(newReport);
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
    setUsers([]);
    setCurrentUserId('');
    setSchools([]);
    setSelectedSchoolId(null);
    setPosts([]);
    setStories([]);
    setReels([]);
    setClubs([]);
    setChallenges([]);
    setEvents([]);
    setOpportunities([]);
    setConversations([]);
    setNotifications([]);
    setReports([]);
    setFollowedUserIds([]);
    setConnectedUserIds([]);
    showToast('Local application storage cleared.', 'info');
  };

  // Fix #2: Derive posts/reels with per-user like state injected
  // This ensures likedByUser is always per-user (from localStorage) even after Firestore snapshot resets it
  const postsWithLikes = posts.map((p) => ({
    ...p,
    likedByUser: likedPostIds.includes(p.id)
  }));

  const reelsWithLikes = reels.map((r) => ({
    ...r,
    likedByUser: likedReelIds.includes(r.id)
  }));

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        allUsers: users,
        isFirebaseAuthActive,
        firebaseUserEmail,
        isAuthenticated,
        isAuthChecking,
        isSuperAdmin,
        setAuthUser,
        signOutUser,
        switchUser,
        updateCurrentUserProfile,
        updateUserStatus,
        updateUserRole,
        toggleUserVerification,
        deleteUserAccount,
        schools,
        selectedSchoolId,
        setSelectedSchoolId,
        addSchool,
        updateSchool,
        deleteSchool,
        activeSchool,
        schoolStaff,
        isSchoolAuthorized,
        getSchoolPermissions,
        assignSchoolStaff,
        removeSchoolStaff,
        dismissReport,
        auditLogs,
        addAuditLog,
        clearAuditLogs,
        isPostsLoading,
        posts: postsWithLikes,
        createPost,
        deletePost,
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
        deleteStory,
        markStoryViewed,
        reels: reelsWithLikes,
        createReel,
        likeReel,
        deleteReel,
        clubs,
        toggleJoinClub,
        deleteClub,
        challenges,
        voteChallenge,
        cheerChallenge,
        addChallengeHype,
        createChallenge,
        events,
        toggleRsvpEvent,
        checkInEvent,
        opportunities,
        toggleSaveOpportunity,
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        startDirectMessage,
        clubChannels,
        activeChannelId,
        setActiveChannelId,
        sendGroupMessage,
        toggleJoinChannel,
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
