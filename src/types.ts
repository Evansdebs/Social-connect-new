export type UserRole = 'user' | 'super_admin';

export type UserType = 'student' | 'teacher' | 'staff' | 'alumni' | 'other';

export interface SchoolStaffPermissions {
  manageSchoolProfile: boolean;
  createSchoolPosts: boolean;
  manageSchoolEvents: boolean;
}

export interface SchoolStaffRecord {
  id: string;
  userId: string;
  userName: string;
  userUsername: string;
  userEmail?: string;
  schoolId: string;
  schoolName: string;
  permissions: SchoolStaffPermissions;
  assignedAt: string;
  assignedBy?: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  userType?: UserType;
  occupation?: string;
  accountStatus?: 'active' | 'suspended';
  avatar: string;
  coverImage: string;
  bio: string;
  schoolId: string;
  schoolName: string;
  classLevel?: string;
  interests: string[];
  creatorTalents: string[];
  badges: string[];
  followersCount: number;
  followingCount: number;
  connectionsCount: number;
  isVerified: boolean;
  isPrivate: boolean;
  allowDownloads: boolean;
  whoCanMessage: 'everyone' | 'connections' | 'nobody';
  whoCanConnect: 'everyone' | 'same_school';
  createdAt?: string;
  updatedAt?: string;
}

export interface School {
  id: string;
  name: string;
  username: string;
  logo: string;
  coverImage: string;
  description: string;
  location: string;
  region: string;
  website: string;
  isVerified: boolean;
  followersCount: number;
  studentCount: number;
  motto: string;
  established: number;
  rankings: {
    activeRank: number;
    challengeWins: number;
    popularityScore: number;
  };
}

export type PostType = 'text' | 'photo' | 'video' | 'poll' | 'announcement' | 'repost';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollData {
  question: string;
  options: PollOption[];
  userVotedId?: string;
  totalVotes: number;
}

export interface RepostInfo {
  originalAuthorName: string;
  originalAuthorUsername: string;
  originalAuthorAvatar: string;
  originalAuthorSchool: string;
  originalText: string;
  originalMediaUrls?: string[];
  originalDate: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorSchool: string;
  authorRole: UserRole;
  type: PostType;
  text: string;
  mediaUrls?: string[];
  videoUrl?: string;
  poll?: PollData;
  repostOf?: RepostInfo;
  likesCount: number;
  likedByUser: boolean;
  likedUserIds?: string[];
  userReaction?: 'like' | 'love' | 'funny' | 'celebrate' | 'wow';
  commentsCount: number;
  sharesCount: number;
  repostsCount: number;
  allowDownloads: boolean;
  createdAt: string;
  tags: string[];
  schoolId?: string;
  isOfficialAnnouncement?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorSchool: string;
  text: string;
  likesCount: number;
  likedByUser: boolean;
  createdAt: string;
  replies?: Comment[];
}

export interface Story {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorSchool: string;
  type: 'photo' | 'text' | 'video';
  mediaUrl?: string;
  caption?: string;
  bgColor?: string;
  createdAt: string;
  viewed?: boolean;
}

export interface Reel {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  creatorSchool: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  soundTitle: string;
  soundArtist: string;
  hashtags: string[];
  likesCount: number;
  likedByUser: boolean;
  commentsCount: number;
  sharesCount: number;
  downloadsCount: number;
  allowDownloads: boolean;
  createdAt: string;
}

export interface GroupClub {
  id: string;
  name: string;
  schoolId?: string;
  schoolName?: string;
  category: string;
  description: string;
  coverImage: string;
  membersCount: number;
  isJoined: boolean;
  rules: string[];
  isOfficialClub: boolean;
  leadTeacherOrAdmin?: string;
}

export interface ChallengeHypeMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorSchool: string;
  schoolCheered: string;
  text: string;
  timestamp: string;
}

export interface Challenge {
  id: string;
  title: string;
  category: 'Quiz' | 'Sports' | 'Debate' | 'Coding' | 'Dance' | 'Talent';
  description: string;
  schoolA: {
    id: string;
    name: string;
    logo: string;
    votes: number;
    cheers?: number;
  };
  schoolB: {
    id: string;
    name: string;
    logo: string;
    votes: number;
    cheers?: number;
  };
  userVotedFor?: string;
  endDate: string;
  status: 'active' | 'completed';
  totalCheeringCount: number;
  stage?: 'Grand Finals' | 'Semifinals' | 'Quarterfinals' | 'League Derby';
  prizeOrTrophy?: string;
  hypeMessages?: ChallengeHypeMessage[];
}

export interface EventAttendee {
  id: string;
  name: string;
  username: string;
  avatar: string;
  schoolName: string;
  checkedIn?: boolean;
  ticketCode?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  schoolId: string;
  schoolName: string;
  schoolLogo: string;
  date: string;
  time: string;
  location: string;
  description: string;
  coverImage: string;
  category: 'Sports' | 'Academics' | 'Arts' | 'Social' | 'Competition';
  interestedCount: number;
  goingCount: number;
  userStatus?: 'interested' | 'going' | null;
  attendees?: EventAttendee[];
  checkedInUserIds?: string[];
  eventCode?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: 'Scholarship' | 'Competition' | 'Internship' | 'Workshop' | 'Volunteer';
  deadline: string;
  description: string;
  location: string;
  link: string;
  isSaved: boolean;
  tags: string[];
}

export interface DirectMessage {
  id: string;
  senderId: string;
  text: string;
  mediaUrl?: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    school: string;
    isOnline: boolean;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: DirectMessage[];
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    school: string;
  };
  toUser?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    school: string;
  };
  sentAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'connection_request' | 'school_announcement' | 'repost' | 'challenge' | 'mention';
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  targetLink?: string;
  targetUserId?: string;
  requestId?: string;
  senderId?: string;
}

export interface SchoolMemoryAlbum {
  id: string;
  schoolId: string;
  title: string;
  year: string;
  coverUrl: string;
  photosCount: number;
  photos: { url: string; caption: string }[];
}

export interface ReportItem {
  id: string;
  targetType: 'post' | 'reel' | 'user' | 'comment';
  targetId: string;
  reportedBy: string;
  reporterId?: string;
  reason: string;
  details?: string;
  timestamp: string;
  createdAt?: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  details?: string;
  timestamp: string;
}

export interface GroupMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderSchool: string;
  text: string;
  mediaUrl?: string;
  timestamp: string;
  reactions?: { emoji: string; count: number }[];
}

export interface ClubChannel {
  id: string;
  clubId: string;
  clubName: string;
  clubCategory: string;
  coverImage: string;
  description: string;
  membersCount: number;
  isJoined: boolean;
  messages: GroupMessage[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface SchoolRequest {
  id: string;
  schoolName: string;
  location: string;
  notes?: string;
  requesterName?: string;
  requesterEmail?: string;
  requesterUserId?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface MarketItem {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerSchool: string;
  title: string;
  description: string;
  price: number;
  category: 'Textbooks' | 'Notes' | 'Electronics' | 'Uniforms' | 'Dorm' | 'Other';
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  images: string[];
  isWishlisted?: boolean;
  createdAt: string;
  location: string;
  status?: 'available' | 'sold';
}

