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
  ConnectionRequest,
  SchoolRequest
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
  deleteClubFromFirebase,
  subscribeToNotifications,
  saveNotificationToFirebase,
  updateNotificationInFirebase,
  subscribeToConnectionRequests,
  saveConnectionRequestToFirebase,
  updateConnectionRequestInFirebase,
  deleteConnectionRequestFromFirebase,
  subscribeToSchoolRequests,
  saveSchoolRequestToFirebase,
  updateSchoolRequestInFirebase,
  deleteSchoolRequestFromFirebase
} from '../lib/firestoreService';
import {
  DEFAULT_GUEST_USER,
  DEFAULT_BLANK_SCHOOL
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
  | 'super_admin'
  | 'school_admin'
  | 'platform_admin'
  | 'edit_profile'
  | 'auth'
  | 'view_avatar';

interface AppContextType {
  currentUser: User;
  users: User[];
  allUsers: User[];
  viewingUserId: string | null;
  viewProfile: (userId: string) => void;
  clearViewingUser: () => void;
  openAvatarPreview: (data: { name: string; username?: string; avatar: string; school?: string; userId?: string }) => void;
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
  toggleUserVerification: (userId: string) => void;
  deleteUserAccount: (userId: string) => void;
  schools: School[];
  selectedSchoolId: string | null;
  setSelectedSchoolId: (id: string | null) => void;
  addSchool: (school: School) => void;
  updateSchool: (schoolId: string, partial: Partial<School>) => void;
  deleteSchool: (schoolId: string) => void;
  activeSchool: School;
  schoolRequests: SchoolRequest[];
  createSchoolRequest: (data: {
    schoolName: string;
    location: string;
    notes?: string;
    requesterName?: string;
    requesterEmail?: string;
  }) => Promise<void>;
  approveSchoolRequest: (requestId: string, schoolDetails?: Partial<School>) => Promise<void>;
  rejectSchoolRequest: (requestId: string) => Promise<void>;
  deleteSchoolRequest: (requestId: string) => Promise<void>;
  schoolStaff: SchoolStaffRecord[];
  isSchoolAuthorized: (schoolId?: string) => boolean;
  getSchoolPermissions: (schoolId?: string) => SchoolStaffPermissions | null;
  assignSchoolStaff: (record: Omit<SchoolStaffRecord, 'id' | 'assignedAt'>) => void;
  removeSchoolStaff: (staffId: string) => void;
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
  connectionRequests: ConnectionRequest[];
  sentConnectionRequestUserIds: string[];
  incomingConnectionRequests: ConnectionRequest[];
  requestConnection: (userId: string) => void;
  acceptConnectionRequest: (requestIdOrUserId: string) => void;
  declineConnectionRequest: (requestIdOrUserId: string) => void;
  cancelConnectionRequest: (userId: string) => void;
  removeConnection: (userId: string) => void;
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
  const [users, setUsers] = useState<User[]>([]);

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('cc_current_user_id') || '';
  });

  const [schools, setSchools] = useState<School[]>([]);
  const [schoolRequests, setSchoolRequests] = useState<SchoolRequest[]>([]);

  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(() => {
    return localStorage.getItem('cc_selected_school_id') || null;
  });

  const [isPostsLoading, setIsPostsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [stories, setStories] = useState<Story[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [clubs, setClubs] = useState<GroupClub[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
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

  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>(() => {
    const saved = localStorage.getItem('cc_connection_requests');
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
  const [schoolMemories] = useState<SchoolMemoryAlbum[]>([]);


  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [modalTargetData, setModalTargetData] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const viewProfile = (userId: string) => {
    setViewingUserId(userId);
    setActiveTab('profile');
    setActiveModal(null);
    setModalTargetData(null);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearViewingUser = () => {
    setViewingUserId(null);
  };

  const openAvatarPreview = (data: {
    name: string;
    username?: string;
    avatar: string;
    school?: string;
    userId?: string;
  }) => {
    setActiveModal('view_avatar');
    setModalTargetData(data);
  };

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
    localStorage.setItem('cc_connection_requests', JSON.stringify(connectionRequests));
  }, [connectionRequests]);

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

    // Real-time notifications stream
    const unsubNotifs = subscribeToNotifications((liveNotifs) => {
      if (liveNotifs.length > 0) {
        setNotifications((prev) => {
          const merged = [...prev];
          liveNotifs.forEach((n) => {
            const idx = merged.findIndex((m) => m.id === n.id);
            if (idx >= 0) merged[idx] = n;
            else merged.push(n);
          });
          return merged;
        });
      }
    });

    // Real-time connection requests stream
    const unsubReqs = subscribeToConnectionRequests((liveReqs) => {
      if (liveReqs.length > 0) {
        setConnectionRequests((prev) => {
          const merged = [...prev];
          liveReqs.forEach((r) => {
            const idx = merged.findIndex((m) => m.id === r.id);
            if (idx >= 0) merged[idx] = r;
            else merged.push(r);
          });
          return merged;
        });
      }
    });

    // Real-time school addition requests stream
    const unsubSchoolReqs = subscribeToSchoolRequests((liveSchoolReqs) => {
      setSchoolRequests(liveSchoolReqs);
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
      unsubNotifs();
      unsubReqs();
      unsubSchoolReqs();
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
    isFirebaseAuthActive &&
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

  const isSuperAdmin =
    currentUser.role === 'super_admin' ||
    currentUser.email === 'evansdebrah111@gmail.com' ||
    firebaseUserEmail === 'evansdebrah111@gmail.com';

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

  const assignSchoolStaff = (record: Omit<SchoolStaffRecord, 'id' | 'assignedAt'>) => {
    const newRecord: SchoolStaffRecord = {
      ...record,
      id: `staff-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      assignedAt: new Date().toISOString()
    };
    setSchoolStaff((prev) => [newRecord, ...prev.filter(s => !(s.userId === record.userId && s.schoolId === record.schoolId))]);
    saveSchoolStaffToFirebase(newRecord);
    showToast(`Assigned ${record.userName} as representative for ${record.schoolName}!`, 'success');
  };

  const removeSchoolStaff = (staffId: string) => {
    setSchoolStaff((prev) => prev.filter((s) => s.id !== staffId));
    deleteSchoolStaffFromFirebase(staffId);
    showToast('School staff authorization revoked.', 'info');
  };

  const updateUserStatus = (userId: string, status: 'active' | 'suspended') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, accountStatus: status } : u))
    );
    updateUserInFirebase(userId, { accountStatus: status });
    showToast(`User account status set to ${status}.`, 'info');
  };

  const toggleUserVerification = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const newVer = !u.isVerified;
        updateUserInFirebase(userId, { isVerified: newVer });
        showToast(newVer ? `Granted verified status to ${u.name}` : `Removed verified status from ${u.name}`, 'info');
        return { ...u, isVerified: newVer };
      })
    );
  };

  const deleteUserAccount = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    deleteUserFromFirebase(userId);
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
    showToast(`School "${school.name}" added to the system.`, 'success');
  };

  const createSchoolRequest = async (data: {
    schoolName: string;
    location: string;
    notes?: string;
    requesterName?: string;
    requesterEmail?: string;
  }) => {
    const newRequest: SchoolRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      schoolName: data.schoolName.trim(),
      location: data.location.trim(),
      notes: data.notes?.trim() || '',
      requesterName: data.requesterName?.trim() || currentUser.name || 'Student Member',
      requesterEmail: data.requesterEmail?.trim() || currentUser.email || '',
      requesterUserId: currentUser.id || undefined,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    setSchoolRequests((prev) => [newRequest, ...prev]);
    await saveSchoolRequestToFirebase(newRequest);
    showToast('School request submitted to Platform Admin! You can proceed with registration.', 'success');
  };

  const approveSchoolRequest = async (requestId: string, schoolDetails?: Partial<School>) => {
    const req = schoolRequests.find((r) => r.id === requestId);
    if (!req) return;

    const sName = schoolDetails?.name || req.schoolName;
    const sLocation = schoolDetails?.location || req.location;
    const sUsername = (schoolDetails?.username || sName).toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newSchoolId = `school-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newSchool: School = {
      id: newSchoolId,
      name: sName,
      username: sUsername,
      location: sLocation,
      region: schoolDetails?.region || 'National',
      website: schoolDetails?.website || '',
      motto: schoolDetails?.motto || 'Knowledge, Integrity & Excellence',
      established: schoolDetails?.established || new Date().getFullYear(),
      studentCount: schoolDetails?.studentCount || 50,
      followersCount: 0,
      logo: schoolDetails?.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(sName)}`,
      coverImage: schoolDetails?.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
      description: schoolDetails?.description || `Official campus connect profile for ${sName}, ${sLocation}.`,
      isVerified: true,
      rankings: {
        activeRank: schools.length + 1,
        challengeWins: 0,
        popularityScore: 100
      }
    };

    addSchool(newSchool);
    setSchoolRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'approved' } : r))
    );
    await updateSchoolRequestInFirebase(requestId, { status: 'approved' });
    showToast(`Approved! "${sName}" has been added to official schools.`, 'success');
  };

  const rejectSchoolRequest = async (requestId: string) => {
    setSchoolRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r))
    );
    await updateSchoolRequestInFirebase(requestId, { status: 'rejected' });
    showToast('School request declined.', 'info');
  };

  const deleteSchoolRequest = async (requestId: string) => {
    setSchoolRequests((prev) => prev.filter((r) => r.id !== requestId));
    await deleteSchoolRequestFromFirebase(requestId);
    showToast('School request removed.', 'info');
  };

  const updateSchool = (schoolId: string, partial: Partial<School>) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === schoolId ? { ...s, ...partial } : s))
    );
    const existing = schools.find((s) => s.id === schoolId);
    if (existing) {
      saveSchoolToFirebase({ ...existing, ...partial });
    }
    showToast('School updated successfully.', 'success');
  };

  const deleteSchool = (schoolId: string) => {
    setSchools((prev) => prev.filter((s) => s.id !== schoolId));
    deleteSchoolFromFirebase(schoolId);
    if (selectedSchoolId === schoolId) {
      setSelectedSchoolId(null);
    }
    showToast('School removed.', 'info');
  };

  const deletePost = async (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setSavedPostIds((prev) => prev.filter((id) => id !== postId));
    setLikedPostIds((prev) => prev.filter((id) => id !== postId));
    setComments((prev) => {
      const copy = { ...prev };
      delete copy[postId];
      return copy;
    });
    await deletePostFromFirebase(postId);
    showToast('Post deleted permanently from Campus Connect.', 'info');
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

  // If user clicks like on an already liked post, unlike the user's initial like.
  const likePost = (postId: string, reaction: 'like' | 'love' | 'funny' | 'celebrate' | 'wow' = 'like') => {
    const targetPost = posts.find((p) => p.id === postId);
    const alreadyLiked =
      likedPostIds.includes(postId) ||
      Boolean(targetPost?.likedByUser) ||
      Boolean(currentUser.id && targetPost?.likedUserIds?.includes(currentUser.id));

    if (alreadyLiked) {
      // If user selected a different emotion reaction from picker (e.g. switched from 'like' to 'love')
      if (targetPost?.userReaction && targetPost.userReaction !== reaction && reaction !== 'like') {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, userReaction: reaction } : p))
        );
        showToast(`Reaction updated to ${reaction}!`, 'info');
        return;
      }

      // Otherwise, unlike the user's initial like
      setLikedPostIds((prev) => prev.filter((id) => id !== postId));
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          const newCount = Math.max(0, p.likesCount - 1);
          const newLikedUserIds = (p.likedUserIds || []).filter((uid) => uid !== currentUser.id);
          updatePostInFirebase(postId, {
            likesCount: newCount,
            likedUserIds: newLikedUserIds
          });
          return {
            ...p,
            likedByUser: false,
            likesCount: newCount,
            likedUserIds: newLikedUserIds,
            userReaction: undefined
          };
        })
      );
      showToast('Post unliked', 'info');
      return;
    }

    setLikedPostIds((prev) => (prev.includes(postId) ? prev : [...prev, postId]));
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const newCount = p.likesCount + 1;
        const newLikedUserIds = Array.from(new Set([...(p.likedUserIds || []), currentUser.id]));
        updatePostInFirebase(postId, {
          likesCount: newCount,
          likedUserIds: newLikedUserIds
        });
        return {
          ...p,
          likedByUser: true,
          likesCount: newCount,
          likedUserIds: newLikedUserIds,
          userReaction: reaction
        };
      })
    );
    showToast('Post liked!', 'success');
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
        return {
          ...ev,
          interestedCount: finalInterested,
          goingCount: finalGoing,
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

  const sentConnectionRequestUserIds = connectionRequests
    .filter((r) => r.fromUserId === currentUser.id && r.status === 'pending')
    .map((r) => r.toUserId);

  const incomingConnectionRequests = connectionRequests.filter(
    (r) => r.toUserId === currentUser.id && r.status === 'pending'
  );

  const requestConnection = (targetUserId: string) => {
    if (!currentUser.id || currentUser.id === 'guest') {
      openModal('auth');
      return;
    }

    if (targetUserId === currentUser.id) {
      showToast('You cannot connect with yourself.', 'info');
      return;
    }

    if (connectedUserIds.includes(targetUserId)) {
      showToast('You are already connected friends.', 'info');
      return;
    }

    if (sentConnectionRequestUserIds.includes(targetUserId)) {
      showToast('Connection request already sent. Waiting for acceptance.', 'info');
      return;
    }

    const incoming = incomingConnectionRequests.find((r) => r.fromUserId === targetUserId);
    if (incoming) {
      acceptConnectionRequest(incoming.id);
      return;
    }

    const targetUser = users.find((u) => u.id === targetUserId);

    const newReq: ConnectionRequest = {
      id: `req-${currentUser.id}-${targetUserId}-${Date.now()}`,
      fromUserId: currentUser.id,
      toUserId: targetUserId,
      fromUser: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
        school: currentUser.schoolName || ''
      },
      toUser: targetUser
        ? {
            id: targetUser.id,
            name: targetUser.name,
            username: targetUser.username,
            avatar: targetUser.avatar,
            school: targetUser.schoolName || ''
          }
        : undefined,
      sentAt: 'Just now',
      status: 'pending'
    };

    setConnectionRequests((prev) => [newReq, ...prev.filter((r) => r.id !== newReq.id)]);
    saveConnectionRequestToFirebase(newReq);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'connection_request',
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: 'sent you a connection request.',
      timestamp: 'Just now',
      isRead: false,
      requestId: newReq.id,
      senderId: currentUser.id,
      targetUserId: targetUserId
    };
    setNotifications((prev) => [notif, ...prev]);
    saveNotificationToFirebase(notif);

    showToast(
      `Connection request sent to ${targetUser?.name || 'user'}. They must accept it before you become connected friends.`,
      'info'
    );
  };

  const acceptConnectionRequest = (requestIdOrUserId: string) => {
    const req = connectionRequests.find(
      (r) =>
        (r.id === requestIdOrUserId || r.fromUserId === requestIdOrUserId) &&
        r.toUserId === currentUser.id &&
        r.status === 'pending'
    );
    if (!req) {
      const altReq = connectionRequests.find(
        (r) => r.fromUserId === requestIdOrUserId && r.status === 'pending'
      );
      if (!altReq) return;
      handleAccept(altReq);
      return;
    }
    handleAccept(req);

    function handleAccept(targetReq: ConnectionRequest) {
      const partnerId = targetReq.fromUserId;
      const partnerUser = users.find((u) => u.id === partnerId);

      const updatedReq: ConnectionRequest = { ...targetReq, status: 'accepted' };
      setConnectionRequests((prev) =>
        prev.map((r) => (r.id === targetReq.id ? updatedReq : r))
      );
      updateConnectionRequestInFirebase(targetReq.id, { status: 'accepted' });

      setConnectedUserIds((prev) => Array.from(new Set([...prev, partnerId])));

      const newConnectionsCount = (currentUser.connectionsCount || 0) + 1;
      updateCurrentUserProfile({ connectionsCount: newConnectionsCount });

      if (partnerUser) {
        updateUserInFirebase(partnerUser.id, {
          connectionsCount: (partnerUser.connectionsCount || 0) + 1
        });
      }

      setNotifications((prev) =>
        prev.map((n) =>
          n.requestId === targetReq.id || n.senderId === partnerId
            ? { ...n, isRead: true }
            : n
        )
      );

      const confirmNotif: NotificationItem = {
        id: `notif-acc-${Date.now()}`,
        type: 'connection_request',
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        content: 'accepted your connection request. You are now connected friends!',
        timestamp: 'Just now',
        isRead: false,
        requestId: targetReq.id,
        senderId: currentUser.id,
        targetUserId: partnerId
      };
      saveNotificationToFirebase(confirmNotif);

      showToast(
        `Connected with ${targetReq.fromUser.name}! You are now connected friends.`,
        'success'
      );
    }
  };

  const declineConnectionRequest = (requestIdOrUserId: string) => {
    const req = connectionRequests.find(
      (r) =>
        (r.id === requestIdOrUserId || r.fromUserId === requestIdOrUserId) &&
        r.toUserId === currentUser.id &&
        r.status === 'pending'
    );
    if (!req) return;

    const updatedReq: ConnectionRequest = { ...req, status: 'declined' };
    setConnectionRequests((prev) =>
      prev.map((r) => (r.id === req.id ? updatedReq : r))
    );
    updateConnectionRequestInFirebase(req.id, { status: 'declined' });

    setNotifications((prev) =>
      prev.map((n) =>
        n.requestId === req.id ? { ...n, isRead: true } : n
      )
    );
    showToast('Connection request declined.', 'info');
  };

  const cancelConnectionRequest = (targetUserId: string) => {
    const req = connectionRequests.find(
      (r) => r.fromUserId === currentUser.id && r.toUserId === targetUserId && r.status === 'pending'
    );
    if (req) {
      setConnectionRequests((prev) => prev.filter((r) => r.id !== req.id));
      deleteConnectionRequestFromFirebase(req.id);
    }
    showToast('Connection request cancelled.', 'info');
  };

  const removeConnection = (targetUserId: string) => {
    setConnectedUserIds((prev) => prev.filter((id) => id !== targetUserId));
    const newCount = Math.max(0, (currentUser.connectionsCount || 1) - 1);
    updateCurrentUserProfile({ connectionsCount: newCount });

    const existing = connectionRequests.find(
      (r) =>
        ((r.fromUserId === currentUser.id && r.toUserId === targetUserId) ||
          (r.fromUserId === targetUserId && r.toUserId === currentUser.id)) &&
        r.status === 'accepted'
    );
    if (existing) {
      deleteConnectionRequestFromFirebase(existing.id);
      setConnectionRequests((prev) => prev.filter((r) => r.id !== existing.id));
    }
    showToast('Connection removed.', 'info');
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
    setConnectionRequests([]);
    showToast('Local application storage cleared.', 'info');
  };

  // Fix #2: Derive posts/reels with per-user like state injected
  // This ensures likedByUser is always per-user (from localStorage) even after Firestore snapshot resets it
  const postsWithLikes = posts.map((p) => ({
    ...p,
    likedByUser:
      likedPostIds.includes(p.id) ||
      Boolean(currentUser.id && p.likedUserIds?.includes(currentUser.id))
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
        toggleUserVerification,
        deleteUserAccount,
        schools,
        selectedSchoolId,
        setSelectedSchoolId,
        addSchool,
        updateSchool,
        deleteSchool,
        activeSchool,
        schoolRequests,
        createSchoolRequest,
        approveSchoolRequest,
        rejectSchoolRequest,
        deleteSchoolRequest,
        schoolStaff,
        isSchoolAuthorized,
        getSchoolPermissions,
        assignSchoolStaff,
        removeSchoolStaff,
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
        viewingUserId,
        viewProfile,
        clearViewingUser,
        openAvatarPreview,
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
        connectionRequests,
        sentConnectionRequestUserIds,
        incomingConnectionRequests,
        requestConnection,
        acceptConnectionRequest,
        declineConnectionRequest,
        cancelConnectionRequest,
        removeConnection,
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
