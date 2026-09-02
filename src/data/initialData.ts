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

export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'school-1',
    name: 'Living Spring School',
    username: 'livingspringschool',
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80',
    description: 'Nurturing excellence, leadership and innovation in future global changemakers. Home of champions!',
    location: 'Airport Residential, Accra',
    region: 'Greater Accra',
    website: 'https://livingspringschool.edu',
    isVerified: true,
    followersCount: 4820,
    studentCount: 1250,
    motto: 'Excellence in Truth and Service',
    established: 1994,
    rankings: {
      activeRank: 1,
      challengeWins: 14,
      popularityScore: 98
    }
  },
  {
    id: 'school-2',
    name: 'Achimota School',
    username: 'achimotaschool',
    logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
    description: 'That all may be one. Developing character, intellect and African heritage since 1927.',
    location: 'Achimota, Accra',
    region: 'Greater Accra',
    website: 'https://achimota.edu.gh',
    isVerified: true,
    followersCount: 9240,
    studentCount: 2800,
    motto: 'Ut Omnes Unum Sint',
    established: 1927,
    rankings: {
      activeRank: 2,
      challengeWins: 22,
      popularityScore: 96
    }
  },
  {
    id: 'school-3',
    name: 'Presbyterian Boys’ Sec (PRESEC)',
    username: 'preseclegon',
    logo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
    description: 'In Lumine Tuo Videbimus Lumen. 8-time NSMQ Champions and leader in academic excellence.',
    location: 'Legon, Accra',
    region: 'Greater Accra',
    website: 'https://preseclegon.edu.gh',
    isVerified: true,
    followersCount: 11400,
    studentCount: 3100,
    motto: 'In Lumine Tuo Videbimus Lumen',
    established: 1938,
    rankings: {
      activeRank: 3,
      challengeWins: 28,
      popularityScore: 99
    }
  },
  {
    id: 'school-4',
    name: 'Wesley Girls’ High School',
    username: 'wesleygirls',
    logo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1200&auto=format&fit=crop&q=80',
    description: 'Live pure, speak true, right wrong, follow the king. Empowering young women leaders of Africa.',
    location: 'Cape Coast',
    region: 'Central Region',
    website: 'https://weygils.edu.gh',
    isVerified: true,
    followersCount: 8650,
    studentCount: 2300,
    motto: 'Live Pure, Speak True, Right Wrong',
    established: 1836,
    rankings: {
      activeRank: 4,
      challengeWins: 19,
      popularityScore: 94
    }
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-kwame',
    name: 'Kwame Mensah',
    username: 'kwame123',
    email: 'kwame.mensah@student.livingspring.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1000&auto=format&fit=crop&q=80',
    bio: 'SHS 2 Science major | Robotics Club Lead & Debate Society | Building smart sensors & loving inter-school football ⚽🤖',
    schoolId: 'school-1',
    schoolName: 'Living Spring School',
    classLevel: 'SHS 2 - Science A',
    interests: ['Robotics', 'Debate', 'Football', 'Science', 'Music'],
    creatorTalents: ['Debater', 'Tech Innovator', 'Student Creator'],
    badges: ['First Post', 'Rising Creator', 'Challenge Winner', 'School Ambassador'],
    followersCount: 542,
    followingCount: 184,
    connectionsCount: 312,
    isVerified: true,
    isPrivate: false,
    allowDownloads: true,
    whoCanMessage: 'everyone',
    whoCanConnect: 'everyone'
  },
  {
    id: 'user-ama',
    name: 'Ama Serwaa',
    username: 'ama_lens',
    email: 'ama.serwaa@achimota.edu.gh',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000&auto=format&fit=crop&q=80',
    bio: 'Visual story-teller & campus photojournalist 📸 | Achimota Arts Society | Capturing high school moments and campus architecture 🎨',
    schoolId: 'school-2',
    schoolName: 'Achimota School',
    classLevel: 'Form 3 - Visual Arts',
    interests: ['Photography', 'Visual Arts', 'Architecture', 'Podcasting'],
    creatorTalents: ['Photographer', 'Visual Storyteller'],
    badges: ['Photographer', 'Rising Creator', 'Popular Creator'],
    followersCount: 890,
    followingCount: 220,
    connectionsCount: 405,
    isVerified: false,
    isPrivate: false,
    allowDownloads: true,
    whoCanMessage: 'everyone',
    whoCanConnect: 'everyone'
  },
  {
    id: 'user-teacher-angela',
    name: 'Dr. Angela Osei',
    username: 'dr_angela',
    email: 'a.osei@livingspring.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&auto=format&fit=crop&q=80',
    bio: 'Biology & Environmental Science Faculty | Patron, Science & Robotics Club | Passionate about mentorship and student innovation 🌱🔬',
    schoolId: 'school-1',
    schoolName: 'Living Spring School',
    classLevel: 'Faculty Patron',
    interests: ['STEM Mentorship', 'Biology', 'Sustainability', 'Youth Leadership'],
    creatorTalents: ['Faculty Advisor', 'STEM Mentor'],
    badges: ['Community Contributor', 'School Ambassador'],
    followersCount: 1240,
    followingCount: 95,
    connectionsCount: 210,
    isVerified: true,
    isPrivate: false,
    allowDownloads: true,
    whoCanMessage: 'everyone',
    whoCanConnect: 'everyone'
  },
  {
    id: 'user-school-admin',
    name: 'Living Spring School (Official)',
    username: 'livingspringschool',
    email: 'admin@livingspring.edu',
    role: 'school_admin',
    avatar: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1000&auto=format&fit=crop&q=80',
    bio: 'Official digital page for Living Spring School. Announcements, achievements, club events and campus news.',
    schoolId: 'school-1',
    schoolName: 'Living Spring School',
    interests: ['Education', 'Sports', 'Inter-School Competitions', 'Student Life'],
    creatorTalents: ['Official Institution'],
    badges: ['School Ambassador'],
    followersCount: 4820,
    followingCount: 32,
    connectionsCount: 1250,
    isVerified: true,
    isPrivate: false,
    allowDownloads: true,
    whoCanMessage: 'connections',
    whoCanConnect: 'same_school'
  },
  {
    id: 'user-platform-admin',
    name: 'Campus Connect Team',
    username: 'campus_admin',
    email: 'moderation@campusconnect.app',
    role: 'platform_admin',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80',
    bio: 'Official Campus Connect Platform Moderator & Verification Desk. Keeping campus social spaces safe, positive and connected.',
    schoolId: '',
    schoolName: 'Campus Connect Platform',
    interests: ['Safety', 'Inter-School Community', 'Innovation'],
    creatorTalents: ['Platform Safety'],
    badges: ['Community Contributor'],
    followersCount: 15300,
    followingCount: 12,
    connectionsCount: 990,
    isVerified: true,
    isPrivate: false,
    allowDownloads: true,
    whoCanMessage: 'everyone',
    whoCanConnect: 'everyone'
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story-1',
    authorId: 'user-kwame',
    authorName: 'Kwame Mensah',
    authorUsername: 'kwame123',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    authorSchool: 'Living Spring School',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=80',
    caption: 'Testing our robotic arm for the upcoming Inter-School STEM Challenge! 🤖⚡',
    createdAt: '2 hours ago',
    viewed: false
  },
  {
    id: 'story-2',
    authorId: 'user-ama',
    authorName: 'Ama Serwaa',
    authorUsername: 'ama_lens',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    authorSchool: 'Achimota School',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    caption: 'Golden hour on the Achimota administration block. Campus is peaceful today ✨',
    createdAt: '4 hours ago',
    viewed: false
  },
  {
    id: 'story-3',
    authorId: 'user-school-admin',
    authorName: 'Living Spring School',
    authorUsername: 'livingspringschool',
    authorAvatar: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80',
    authorSchool: 'Living Spring School',
    type: 'text',
    caption: '📢 REMINDER: Inter-House Debate finals kick off tomorrow at 2:00 PM in the Main Assembly Hall!',
    bgColor: 'from-amber-600 to-orange-700',
    createdAt: '6 hours ago',
    viewed: false
  },
  {
    id: 'story-4',
    authorId: 'user-teacher-angela',
    authorName: 'Dr. Angela Osei',
    authorUsername: 'dr_angela',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    authorSchool: 'Living Spring School',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    caption: 'Excited about the seedlings our environmental club planted in the school eco-garden! 🌱',
    createdAt: '8 hours ago',
    viewed: true
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    authorId: 'user-kwame',
    authorName: 'Kwame Mensah',
    authorUsername: 'kwame123',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    authorSchool: 'Living Spring School',
    authorRole: 'student',
    type: 'photo',
    text: 'Our Robotics Team just passed the circuit benchmarks for the 2026 Greater Accra STEM League! Big shoutout to Dr. Angela for staying with us after school in the lab. Watch out @preseclegon, Living Spring is bringing the heat this year! 🚀🔥',
    mediaUrls: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&auto=format&fit=crop&q=80'
    ],
    likesCount: 142,
    likedByUser: false,
    commentsCount: 28,
    sharesCount: 12,
    repostsCount: 9,
    allowDownloads: true,
    createdAt: '35 minutes ago',
    tags: ['RoboticsLeague', 'LivingSpring', 'STEM2026', 'InterSchoolChallenge']
  },
  {
    id: 'post-2',
    authorId: 'user-school-admin',
    authorName: 'Living Spring School (Official)',
    authorUsername: 'livingspringschool',
    authorAvatar: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80',
    authorSchool: 'Living Spring School',
    authorRole: 'school_admin',
    type: 'poll',
    text: '🏆 INTER-SCHOOL DERBY POLL: The annual Inter-School Invitational Tournament happens this Saturday against Achimota School! Which sport are our students most eager to cheer on from the stands?',
    poll: {
      question: 'Which sport should receive the live school band coverage?',
      options: [
        { id: 'opt-1', text: 'Boys Football ⚽', votes: 240 },
        { id: 'opt-2', text: 'Girls Basketball 🏀', votes: 195 },
        { id: 'opt-3', text: 'Track & 4x100m Relay 🏃‍♂️', votes: 142 },
        { id: 'opt-4', text: 'Inter-School Debate 🗣️', votes: 88 }
      ],
      totalVotes: 665
    },
    likesCount: 310,
    likedByUser: true,
    userReaction: 'love',
    commentsCount: 45,
    sharesCount: 24,
    repostsCount: 18,
    allowDownloads: false,
    createdAt: '2 hours ago',
    tags: ['InterSchoolDerby', 'SportsDay', 'SchoolSpirit'],
    isOfficialAnnouncement: true
  },
  {
    id: 'post-3',
    authorId: 'user-ama',
    authorName: 'Ama Serwaa',
    authorUsername: 'ama_lens',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    authorSchool: 'Achimota School',
    authorRole: 'student',
    type: 'photo',
    text: 'Snapped these candids during choir rehearsals today. Music connects people from every corner. Drop your favorite school song in the comments below! 🎶🎷 #CampusVibes',
    mediaUrls: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&auto=format&fit=crop&q=80'
    ],
    likesCount: 204,
    likedByUser: false,
    commentsCount: 31,
    sharesCount: 15,
    repostsCount: 7,
    allowDownloads: true,
    createdAt: '5 hours ago',
    tags: ['CampusVibes', 'StudentPhotography', 'AchimotaChoir']
  },
  {
    id: 'post-4',
    authorId: 'user-kwame',
    authorName: 'Kwame Mensah',
    authorUsername: 'kwame123',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    authorSchool: 'Living Spring School',
    authorRole: 'student',
    type: 'repost',
    text: 'Huge congratulations to our neighbors at Achimota! Worth celebrating excellence across all schools.',
    repostOf: {
      originalAuthorName: 'Achimota School',
      originalAuthorUsername: 'achimotaschool',
      originalAuthorAvatar: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&auto=format&fit=crop&q=80',
      originalAuthorSchool: 'Achimota School',
      originalText: 'We are proud to announce our Senior Debate Society has qualified for the Pan-African Youth Parliamentary Debate tournament in Nairobi! Congratulations to our delegates!',
      originalMediaUrls: ['https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=900&auto=format&fit=crop&q=80'],
      originalDate: 'Yesterday at 4:15 PM'
    },
    likesCount: 98,
    likedByUser: false,
    commentsCount: 14,
    sharesCount: 8,
    repostsCount: 4,
    allowDownloads: true,
    createdAt: '8 hours ago',
    tags: ['Debate', 'InterSchoolRespect', 'YouthExcellence']
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    postId: 'post-1',
    authorId: 'user-ama',
    authorName: 'Ama Serwaa',
    authorUsername: 'ama_lens',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    authorSchool: 'Achimota School',
    text: 'This looks so high-tech Kwame! Are you guys showcasing this at the National Science Fair next month?',
    likesCount: 12,
    likedByUser: false,
    createdAt: '22 minutes ago',
    replies: [
      {
        id: 'comm-1-1',
        postId: 'post-1',
        authorId: 'user-kwame',
        authorName: 'Kwame Mensah',
        authorUsername: 'kwame123',
        authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
        authorSchool: 'Living Spring School',
        text: 'Yes Ama! We have a live demonstration slot at 11am. Hope the Achimota team stops by our booth!',
        likesCount: 8,
        likedByUser: false,
        createdAt: '15 minutes ago'
      }
    ]
  },
  {
    id: 'comm-2',
    postId: 'post-1',
    authorId: 'user-teacher-angela',
    authorName: 'Dr. Angela Osei',
    authorUsername: 'dr_angela',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    authorSchool: 'Living Spring School',
    text: 'So proud of your persistence on the servo calibration yesterday team! Let’s keep up this momentum for Friday’s test.',
    likesCount: 19,
    likedByUser: true,
    createdAt: '18 minutes ago'
  }
];

export const INITIAL_REELS: Reel[] = [
  {
    id: 'reel-1',
    creatorId: 'user-kwame',
    creatorName: 'Kwame Mensah',
    creatorUsername: 'kwame123',
    creatorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    creatorSchool: 'Living Spring School',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-working-in-a-robotics-lab-42795-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    caption: 'POV: When your autonomous robot finally clears the obstacle track on attempt #47 🤖🎉 #RoboticsLife #LivingSpring #TechTok',
    soundTitle: 'Campus High Energy Beat (Original)',
    soundArtist: 'DJ Student Beats',
    hashtags: ['RoboticsLife', 'LivingSpring', 'TechTok', 'HighSchoolSTEM'],
    likesCount: 1420,
    likedByUser: false,
    commentsCount: 168,
    sharesCount: 84,
    downloadsCount: 52,
    allowDownloads: true,
    createdAt: '1 day ago'
  },
  {
    id: 'reel-2',
    creatorId: 'user-ama',
    creatorName: 'Ama Serwaa',
    creatorUsername: 'ama_lens',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    creatorSchool: 'Achimota School',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-walking-with-a-camera-in-the-park-41584-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    caption: 'Day in the life of a high school campus photographer 📷 From assembly to the art studio. What school should I visit next? #CampusPhotographer #Achimota',
    soundTitle: 'Acoustic Vibes - Golden Hour',
    soundArtist: 'Ama’s Lens Track',
    hashtags: ['CampusPhotographer', 'Achimota', 'DayInTheLife', 'Arts'],
    likesCount: 2310,
    likedByUser: true,
    commentsCount: 245,
    sharesCount: 190,
    downloadsCount: 88,
    allowDownloads: true,
    createdAt: '2 days ago'
  },
  {
    id: 'reel-3',
    creatorId: 'user-school-admin',
    creatorName: 'Living Spring School',
    creatorUsername: 'livingspringschool',
    creatorAvatar: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80',
    creatorSchool: 'Living Spring School',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-students-playing-basketball-on-an-outdoor-court-41539-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80',
    caption: 'Championship game buzzer beater! Listen to the student cheer section! 🏀🏆 Living Spring triumphs in the Invitational!',
    soundTitle: 'School Stadium Roar & Brass',
    soundArtist: 'Living Spring Marching Band',
    hashtags: ['GameWinner', 'BuzzerBeater', 'HighSchoolBasketball', 'SchoolPride'],
    likesCount: 3840,
    likedByUser: false,
    commentsCount: 312,
    sharesCount: 420,
    downloadsCount: 140,
    allowDownloads: true,
    createdAt: '3 days ago'
  }
];

export const INITIAL_CLUBS: GroupClub[] = [
  {
    id: 'club-1',
    name: 'Living Spring Robotics & Coding Club',
    schoolId: 'school-1',
    schoolName: 'Living Spring School',
    category: 'STEM & Technology',
    description: 'Building micro-controllers, competing in national STEM leagues, and learning Python, C++ & 3D prototyping.',
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    membersCount: 84,
    isJoined: true,
    rules: [
      'Respect all member project contributions',
      'Safety protocols mandatory in hardware workshop',
      'Encourage peer code reviews and knowledge sharing'
    ],
    isOfficialClub: true,
    leadTeacherOrAdmin: 'Dr. Angela Osei'
  },
  {
    id: 'club-2',
    name: 'Inter-School Debate & Oratory League',
    category: 'Public Speaking & Debate',
    description: 'Cross-campus debaters discussing governance, technology ethics, economics and international relations.',
    coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
    membersCount: 420,
    isJoined: true,
    rules: [
      'Constructive critique only during mock debates',
      'Strict adherence to Parliamentary debate timing',
      'Open to students from all registered schools'
    ],
    isOfficialClub: false
  },
  {
    id: 'club-3',
    name: 'Ghana Student Photographers & Creators',
    category: 'Arts & Media',
    description: 'Community for student photographers, videographers, editors, graphic designers and creative storytellers.',
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
    membersCount: 650,
    isJoined: false,
    rules: [
      'Give credit to original photographers',
      'No unsolicited commercial ads',
      'Weekly photo challenges open to all'
    ],
    isOfficialClub: false
  },
  {
    id: 'club-4',
    name: 'Achimota Environmental Action Society',
    schoolId: 'school-2',
    schoolName: 'Achimota School',
    category: 'Environment & Climate',
    description: 'Tree planting, solar technology advocacy, plastic recycling drives and campus sustainability projects.',
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    membersCount: 112,
    isJoined: false,
    rules: [
      'Active participation in bi-weekly clean-ups',
      'Share verifiable climate data and eco-tips'
    ],
    isOfficialClub: true
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'chal-1',
    title: 'National Science & Maths Quiz: Inter-Campus Derby',
    category: 'Quiz',
    description: 'Who wins the head-to-head speed race in Physics, Chemistry & Pure Mathematics problem-solving?',
    schoolA: {
      id: 'school-1',
      name: 'Living Spring School',
      logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
      votes: 1240
    },
    schoolB: {
      id: 'school-3',
      name: 'PRESEC Legon',
      logo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=150&auto=format&fit=crop&q=80',
      votes: 1890
    },
    userVotedFor: 'school-1',
    endDate: 'In 3 Days',
    status: 'active',
    totalCheeringCount: 3130
  },
  {
    id: 'chal-2',
    title: 'Inter-School Football Championship: Golden Boot Clash',
    category: 'Sports',
    description: 'Living Spring Strikers clash with Achimota Lions in the semi-finals on neutral grounds!',
    schoolA: {
      id: 'school-1',
      name: 'Living Spring School',
      logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
      votes: 945
    },
    schoolB: {
      id: 'school-2',
      name: 'Achimota School',
      logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80',
      votes: 1102
    },
    endDate: 'Tomorrow at 4:00 PM',
    status: 'active',
    totalCheeringCount: 2047
  }
];

export const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'event-1',
    title: 'Greater Accra Inter-School STEM Fair & Robotics Expo',
    schoolId: 'school-1',
    schoolName: 'Living Spring School',
    schoolLogo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
    date: 'OCT 12, 2026',
    time: '09:30 AM - 04:00 PM',
    location: 'Main Science Auditorium, Living Spring Campus',
    description: 'Over 20 schools presenting working robotics prototypes, clean energy solutions, mobile apps, and drone flight demonstrations.',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    category: 'Academics',
    interestedCount: 380,
    goingCount: 195,
    userStatus: 'going'
  },
  {
    id: 'event-2',
    title: 'Annual High School Cross-Country & Track Relays',
    schoolId: 'school-2',
    schoolName: 'Achimota School',
    schoolLogo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80',
    date: 'OCT 24, 2026',
    time: '08:00 AM - 02:00 PM',
    location: 'Achimota Sports Complex',
    description: 'Cheer on sprint stars in the 100m, 200m, 4x100m relays, and the traditional 5km campus cross-country.',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    category: 'Sports',
    interestedCount: 512,
    goingCount: 270,
    userStatus: 'interested'
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'National High School Future Tech Innovators Grant',
    organization: 'Ministry of Communications & Digital Tech',
    type: 'Scholarship',
    deadline: 'NOV 15, 2026',
    description: 'GH₵ 25,000 grant and mentorship package for student hardware & software projects addressing local environmental and agricultural challenges.',
    location: 'Open Nationally (Ghana)',
    link: 'https://techgrants.edu.gh',
    isSaved: true,
    tags: ['Tech', 'STEM', 'Grant', 'HighSchool']
  },
  {
    id: 'opp-2',
    title: 'All-Africa Youth Parliamentary Debate Cup',
    organization: 'African Debate Institute',
    type: 'Competition',
    deadline: 'OCT 30, 2026',
    description: 'Top high school debaters represent their schools in an international parliamentary debate simulation in Nairobi, fully sponsored.',
    location: 'Accra Qualifier / Nairobi Finals',
    link: 'https://africandebatecup.org',
    isSaved: false,
    tags: ['Debate', 'Oratory', 'International']
  },
  {
    id: 'opp-3',
    title: 'Summer Student Journalism & Media Apprentice Fellowship',
    organization: 'Graphic Youth Media Lab',
    type: 'Internship',
    deadline: 'DEC 01, 2026',
    description: 'Hands-on training in photography, audio recording, digital podcasting and fact-checking for senior high school students.',
    location: 'Accra, Ghana',
    link: 'https://youthmedialab.org',
    isSaved: false,
    tags: ['Media', 'Photography', 'Internship']
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participant: {
      id: 'user-ama',
      name: 'Ama Serwaa',
      username: 'ama_lens',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      school: 'Achimota School',
      isOnline: true
    },
    lastMessage: 'Let me send you the high-res photos from the robotics lab session!',
    lastMessageTime: '12m ago',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-1',
        senderId: 'user-ama',
        text: 'Hey Kwame! Saw your post about the circuit testing. Really impressive!',
        timestamp: '1:45 PM',
        isRead: true
      },
      {
        id: 'msg-2',
        senderId: 'user-kwame',
        text: 'Thanks Ama! Dr. Angela helped us debug the motor drivers until 6pm yesterday.',
        timestamp: '1:47 PM',
        isRead: true
      },
      {
        id: 'msg-3',
        senderId: 'user-ama',
        text: 'Let me send you the high-res photos from the robotics lab session!',
        timestamp: '2:10 PM',
        isRead: false
      }
    ]
  },
  {
    id: 'conv-2',
    participant: {
      id: 'user-teacher-angela',
      name: 'Dr. Angela Osei',
      username: 'dr_angela',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      school: 'Living Spring School',
      isOnline: false
    },
    lastMessage: 'Don’t forget to pack the extra rechargeable battery packs for Saturday.',
    lastMessageTime: '3h ago',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-4',
        senderId: 'user-teacher-angela',
        text: 'Kwame, remember to submit the team project sheet before Friday assembly.',
        timestamp: '9:30 AM',
        isRead: true
      },
      {
        id: 'msg-5',
        senderId: 'user-kwame',
        text: 'Submitted it on the school portal this morning Dr. Angela!',
        timestamp: '9:45 AM',
        isRead: true
      },
      {
        id: 'msg-6',
        senderId: 'user-teacher-angela',
        text: 'Don’t forget to pack the extra rechargeable battery packs for Saturday.',
        timestamp: '11:15 AM',
        isRead: true
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'connection_request',
    senderName: 'Kofi Boateng (@kofi_tech)',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content: 'sent you a connection request from PRESEC Legon.',
    timestamp: '15 minutes ago',
    isRead: false
  },
  {
    id: 'notif-2',
    type: 'like',
    senderName: 'Ama Serwaa',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: 'liked your post: "Our Robotics Team just passed the circuit benchmarks..."',
    timestamp: '1 hour ago',
    isRead: false
  },
  {
    id: 'notif-3',
    type: 'school_announcement',
    senderName: 'Living Spring School',
    senderAvatar: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
    content: 'posted an official poll: "Which sport are our students most eager to cheer on?"',
    timestamp: '2 hours ago',
    isRead: true
  },
  {
    id: 'notif-4',
    type: 'challenge',
    senderName: 'Campus Connect Arena',
    senderAvatar: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
    content: 'Living Spring School just passed 1,200 cheering votes in the NSMQ Inter-Campus Derby!',
    timestamp: '4 hours ago',
    isRead: true
  }
];

export const INITIAL_MEMORIES: SchoolMemoryAlbum[] = [
  {
    id: 'album-1',
    schoolId: 'school-1',
    title: 'Sports Day & Athletic Championships 2026',
    year: '2026',
    coverUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    photosCount: 24,
    photos: [
      { url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80', caption: 'Senior 4x100m gold medal relay sprint' },
      { url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80', caption: 'Basketball finalists celebration with school trophy' }
    ]
  },
  {
    id: 'album-2',
    schoolId: 'school-1',
    title: 'Cultural Heritage Day & Arts Festival',
    year: '2025',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    photosCount: 38,
    photos: [
      { url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80', caption: 'Traditional drumming and brass ensemble' }
    ]
  }
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    targetType: 'post',
    targetId: 'post-99',
    reportedBy: 'user-ama',
    reason: 'Spam / Commercial advertising without authorization',
    details: 'User was posting non-educational sneaker sales links in the science feed.',
    timestamp: '2 hours ago',
    status: 'pending'
  }
];
