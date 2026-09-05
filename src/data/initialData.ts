import { User, School, Challenge, CampusEvent, Opportunity } from '../types';

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


export const INITIAL_DEMO_SCHOOLS: School[] = [
  {
    id: 'school-achimota',
    name: 'Achimota Senior High',
    username: 'achimota_high',
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80',
    description: 'A legacy of excellence, leadership, and integrity. Educating the leaders of tomorrow.',
    location: 'Accra, Greater Accra',
    region: 'Greater Accra',
    website: 'https://achimota.edu.gh',
    isVerified: true,
    followersCount: 2450,
    studentCount: 3100,
    motto: 'Ut Omnes Unum Sint (That all may be one)',
    established: 1927,
    rankings: {
      activeRank: 1,
      challengeWins: 14,
      popularityScore: 98
    }
  },
  {
    id: 'school-presec',
    name: 'Presbyterian Boys Secondary (PRESEC)',
    username: 'presec_legon',
    logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
    description: 'Premier secondary school for academic rigor, science excellence, and sportsmanship.',
    location: 'Legon, Accra',
    region: 'Greater Accra',
    website: 'https://preseclegon.edu.gh',
    isVerified: true,
    followersCount: 3890,
    studentCount: 3400,
    motto: 'In Lumine Tuo Videbimus Lumen (In Thy Light we shall see Light)',
    established: 1938,
    rankings: {
      activeRank: 2,
      challengeWins: 22,
      popularityScore: 99
    }
  },
  {
    id: 'school-ug',
    name: 'University of Ghana',
    username: 'univ_of_ghana',
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
    description: 'The premier university in Ghana, leading in world-class research, culture, and academic distinction.',
    location: 'Legon, Accra',
    region: 'National',
    website: 'https://ug.edu.gh',
    isVerified: true,
    followersCount: 5200,
    studentCount: 14000,
    motto: 'Integri Procedamus (Proceed with Integrity)',
    established: 1948,
    rankings: {
      activeRank: 3,
      challengeWins: 35,
      popularityScore: 99
    }
  }
];

export const INITIAL_DEMO_CHALLENGES: Challenge[] = [
  {
    id: 'challenge-nsmq-2026',
    title: 'National Science & Maths Quiz (NSMQ) Grand Finals',
    category: 'Quiz',
    description: 'The ultimate high school clash of intellect and speed! Who will claim the bragging rights as national champions?',
    stage: 'Grand Finals',
    prizeOrTrophy: 'NSMQ Championship Cup & $10,000 STEM Grant',
    endDate: '2026-09-20',
    status: 'active',
    totalCheeringCount: 2720,
    schoolA: {
      id: 'school-achimota',
      name: 'Achimota Senior High',
      logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
      votes: 1240,
      cheers: 1350
    },
    schoolB: {
      id: 'school-presec',
      name: 'Presbyterian Boys Secondary (PRESEC)',
      logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80',
      votes: 1480,
      cheers: 1620
    },
    hypeMessages: []
  },
  {
    id: 'challenge-hackathon-2026',
    title: 'Inter-Collegiate AI & Robotics Hackathon',
    category: 'Coding',
    description: '48-hour build sprint where universities battle to create the best decentralized healthcare AI.',
    stage: 'Semifinals',
    prizeOrTrophy: 'National Tech Cup & $25,000 Seed Funding',
    endDate: '2026-09-28',
    status: 'active',
    totalCheeringCount: 1810,
    schoolA: {
      id: 'school-ug',
      name: 'University of Ghana',
      logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&auto=format&fit=crop&q=80',
      votes: 890,
      cheers: 940
    },
    schoolB: {
      id: 'school-achimota',
      name: 'Achimota Senior High Tech Team',
      logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
      votes: 920,
      cheers: 980
    },
    hypeMessages: []
  },
  {
    id: 'challenge-debate-2026',
    title: 'National Championship Debate: Future of AI in Education',
    category: 'Debate',
    description: 'Premier parliamentary debate tournament testing oratory, logic, and rapid rebuttal skills.',
    stage: 'Quarterfinals',
    prizeOrTrophy: 'National Oratory Shield & Scholarship',
    endDate: '2026-10-05',
    status: 'active',
    totalCheeringCount: 775,
    schoolA: {
      id: 'school-presec',
      name: 'Presbyterian Boys Secondary (PRESEC)',
      logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80',
      votes: 410,
      cheers: 450
    },
    schoolB: {
      id: 'school-achimota',
      name: 'Achimota Senior High',
      logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
      votes: 365,
      cheers: 410
    },
    hypeMessages: []
  }
];

export const INITIAL_DEMO_EVENTS: CampusEvent[] = [
  {
    id: 'event-nsmq-finals-2026',
    title: 'NSMQ 2026 Grand Championship Finals',
    schoolId: 'school-presec',
    schoolName: 'Presbyterian Boys Secondary (PRESEC)',
    schoolLogo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80',
    date: 'Oct 12, 2026',
    time: '2:00 PM - 6:00 PM GMT',
    location: 'National Theatre Main Auditorium, Accra',
    description: 'The premier national science and mathematics showdown. Watch the top schools compete for the coveted championship trophy and national bragging rights!',
    coverImage: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1000&auto=format&fit=crop&q=80',
    category: 'Academics',
    interestedCount: 342,
    goingCount: 188,
    userStatus: null,
    eventCode: 'NSMQ-2026-GH',
    checkedInUserIds: [],
    attendees: []
  },
  {
    id: 'event-sports-derby-2026',
    title: 'Inter-Collegiate Athletics & Sprint Invitational',
    schoolId: 'school-achimota',
    schoolName: 'Achimota Senior High',
    schoolLogo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
    date: 'Oct 18, 2026',
    time: '9:00 AM - 5:00 PM GMT',
    location: 'University of Ghana Sports Stadium, Legon',
    description: 'Track and field showdown featuring 100m sprint heats, 4x100m relay, long jump, and the legendary campus tug-of-war.',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1000&auto=format&fit=crop&q=80',
    category: 'Sports',
    interestedCount: 512,
    goingCount: 290,
    userStatus: null,
    eventCode: 'ATHL-2026-UG',
    checkedInUserIds: [],
    attendees: []
  },
  {
    id: 'event-hackathon-2026',
    title: 'West Africa Young Innovators Hackathon 2026',
    schoolId: 'school-ug',
    schoolName: 'University of Ghana',
    schoolLogo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&auto=format&fit=crop&q=80',
    date: 'Nov 05, 2026',
    time: '8:30 AM - 7:00 PM GMT',
    location: 'Tech Innovation Hub & Cedi Conference Center',
    description: '36-hour sprint creating solutions in FinTech, AgriTech, and Climate AI. $25,000 in seed prizes and mentorship from top venture funds.',
    coverImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1000&auto=format&fit=crop&q=80',
    category: 'Competition',
    interestedCount: 420,
    goingCount: 165,
    userStatus: null,
    eventCode: 'HACK-2026-UG',
    checkedInUserIds: [],
    attendees: []
  },
  {
    id: 'event-arts-festival-2026',
    title: 'Campus Music, Poetry & Culture Festival',
    schoolId: 'school-achimota',
    schoolName: 'Achimota Senior High',
    schoolLogo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
    date: 'Nov 22, 2026',
    time: '5:30 PM - 10:30 PM GMT',
    location: 'Main Amphitheatre Quadrangle',
    description: 'Live acoustic sets, spoken word poetry, traditional drumming ensembles, student art exhibitions, and food truck alley.',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80',
    category: 'Arts',
    interestedCount: 680,
    goingCount: 395,
    userStatus: null,
    eventCode: 'ARTS-2026-ACH',
    checkedInUserIds: [],
    attendees: []
  }
];

export const INITIAL_DEMO_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-google-fellowship',
    title: 'Google Africa STEM Scholars Fellowship 2026',
    organization: 'Google Research Africa',
    type: 'Scholarship',
    deadline: 'Nov 15, 2026',
    description: 'Full tuition support, $10,000 living stipend, and direct technical mentorship by Google research scientists in Accra & Nairobi.',
    location: 'Virtual / Accra Tech Lab',
    link: 'https://buildyourfuture.withgoogle.com',
    tags: ['STEM', 'AI', 'Google', 'Fellowship'],
    isSaved: true
  },
  {
    id: 'opp-mastercard-grant',
    title: 'Mastercard Foundation Youth Venture Seed Grant',
    organization: 'Mastercard Foundation',
    type: 'Competition',
    deadline: 'Oct 30, 2026',
    description: '$5,000 equity-free grants for student-led campus enterprises solving local challenges in agriculture, education, and clean energy.',
    location: 'Accra, Ghana',
    link: 'https://mastercardfdn.org',
    tags: ['Entrepreneurship', 'Grant', 'Impact'],
    isSaved: false
  },
  {
    id: 'opp-microsoft-internship',
    title: 'Microsoft AI & Cloud Engineering University Internship',
    organization: 'Microsoft Africa Development Center',
    type: 'Internship',
    deadline: 'Dec 01, 2026',
    description: '12-week paid engineering internship building next-generation language models and enterprise cloud tools.',
    location: 'Lagos / Nairobi / Remote',
    link: 'https://careers.microsoft.com',
    tags: ['Software', 'Cloud', 'Internship'],
    isSaved: false
  },
  {
    id: 'opp-un-summit',
    title: 'United Nations African Youth Climate Action Summit',
    organization: 'UNEP Regional Directorate',
    type: 'Workshop',
    deadline: 'Nov 20, 2026',
    description: 'Fully funded 3-day delegate summit to draft regional youth policy resolutions ahead of the global COP climate conference.',
    location: 'Nairobi, Kenya',
    link: 'https://www.unep.org',
    tags: ['Climate', 'Policy', 'Leadership'],
    isSaved: true
  }
];

