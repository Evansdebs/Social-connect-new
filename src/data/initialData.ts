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

export const DEFAULT_GUEST_USER: User = {
  id: 'guest',
  name: 'Campus Member',
  username: 'guest',
  email: '',
  role: 'user',
  userType: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
  bio: 'Sign in or register to publish your school moments, interact with campus peers, and join clubs.',
  schoolId: '',
  schoolName: 'Campus Connect',
  classLevel: 'Student',
  interests: [],
  creatorTalents: [],
  badges: [],
  followersCount: 0,
  followingCount: 0,
  connectionsCount: 0,
  isVerified: false,
  isPrivate: false,
  allowDownloads: true,
  whoCanMessage: 'everyone',
  whoCanConnect: 'everyone'
};

export const DEFAULT_BLANK_SCHOOL: School = {
  id: '',
  name: 'Campus Directory',
  username: 'campus',
  logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
  coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
  description: 'Connect with schools, student clubs, and inter-campus communities.',
  location: 'Campus Connect Network',
  region: 'National',
  website: '',
  isVerified: false,
  followersCount: 0,
  studentCount: 0,
  motto: 'Connect, Create, Discover',
  established: 2026,
  rankings: {
    activeRank: 1,
    challengeWins: 0,
    popularityScore: 0
  }
};

// All initial datasets start completely empty for real user-generated content in production
export const INITIAL_SCHOOLS: School[] = [];
export const INITIAL_USERS: User[] = [];
export const INITIAL_STORIES: Story[] = [];
export const INITIAL_POSTS: Post[] = [];
export const INITIAL_COMMENTS: Comment[] = [];
export const INITIAL_REELS: Reel[] = [];
export const INITIAL_CLUBS: GroupClub[] = [];
export const INITIAL_CHALLENGES: Challenge[] = [];
export const INITIAL_EVENTS: CampusEvent[] = [];
export const INITIAL_OPPORTUNITIES: Opportunity[] = [];
export const INITIAL_CONVERSATIONS: Conversation[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
export const INITIAL_MEMORIES: SchoolMemoryAlbum[] = [];
export const INITIAL_REPORTS: ReportItem[] = [];
