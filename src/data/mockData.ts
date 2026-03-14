// Mock data for the platform

export interface Politician {
  id: string;
  name: string;
  photo: string;
  party: string;
  constituency: string;
  ward: string;
  province: string;
  district: string;
  municipality: string;
  accountabilityScore: number;
  transparencyScore: number;
  communityTrust: number;
  engagementPoints: number;
  totalPromises: number;
  completedPromises: number;
  delayedPromises: number;
  failedPromises: number;
  activeProjects: number;
  badges: string[];
  manifesto: string;
  verified: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  ward: string;
  politicianId: string;
  politicianName: string;
  startDate: string;
  expectedCompletion: string;
  status: "completed" | "in-progress" | "delayed" | "not-started";
  progress: number;
  category: string;
  evidenceCount: number;
  commentCount: number;
  verificationVotes: {
    completed: number;
    inProgress: number;
    delayed: number;
    notStarted: number;
  };
  milestones: {
    title: string;
    date: string;
    completed: boolean;
  }[];
  updates: {
    date: string;
    content: string;
    type: "progress" | "milestone" | "completion" | "announcement";
  }[];
}

export interface Comment {
  id: string;
  author: string;
  ward: string;
  date: string;
  content: string;
  hasEvidence: boolean;
}

export interface EducationTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  icon: string;
}

export const mockPoliticians: Politician[] = [
  {
    id: "p1",
    name: "Amara Okafor",
    photo: "",
    party: "Progressive Alliance",
    constituency: "Riverside Ward 5",
    ward: "Ward 5",
    province: "Central Province",
    district: "Metro District",
    municipality: "Riverside Municipality",
    accountabilityScore: 87,
    transparencyScore: 92,
    communityTrust: 84,
    engagementPoints: 156,
    totalPromises: 12,
    completedPromises: 8,
    delayedPromises: 2,
    failedPromises: 0,
    activeProjects: 4,
    badges: ["Open Governance", "Financial Transparency"],
    manifesto: "Building a connected community through infrastructure development, education reform, and transparent governance.",
    verified: true,
  },
  {
    id: "p2",
    name: "David Mensah",
    photo: "",
    party: "Citizens United",
    constituency: "Highland Ward 3",
    ward: "Ward 3",
    province: "Northern Province",
    district: "Highland District",
    municipality: "Summit Municipality",
    accountabilityScore: 73,
    transparencyScore: 68,
    communityTrust: 71,
    engagementPoints: 98,
    totalPromises: 15,
    completedPromises: 7,
    delayedPromises: 4,
    failedPromises: 1,
    activeProjects: 5,
    badges: ["Public Disclosure Leader"],
    manifesto: "Empowering rural communities through agricultural reform and digital connectivity.",
    verified: true,
  },
  {
    id: "p3",
    name: "Priya Sharma",
    photo: "",
    party: "Green Future",
    constituency: "Lakeside Ward 1",
    ward: "Ward 1",
    province: "Eastern Province",
    district: "Lakeside District",
    municipality: "Lakeview Municipality",
    accountabilityScore: 94,
    transparencyScore: 96,
    communityTrust: 91,
    engagementPoints: 210,
    totalPromises: 10,
    completedPromises: 9,
    delayedPromises: 1,
    failedPromises: 0,
    activeProjects: 2,
    badges: ["Open Governance", "Financial Transparency", "Public Disclosure Leader"],
    manifesto: "Sustainable development, clean energy, and protecting natural resources for future generations.",
    verified: true,
  },
  {
    id: "p4",
    name: "Carlos Rivera",
    photo: "",
    party: "Progressive Alliance",
    constituency: "Downtown Ward 7",
    ward: "Ward 7",
    province: "Central Province",
    district: "Metro District",
    municipality: "Capital Municipality",
    accountabilityScore: 62,
    transparencyScore: 55,
    communityTrust: 58,
    engagementPoints: 67,
    totalPromises: 20,
    completedPromises: 8,
    delayedPromises: 6,
    failedPromises: 3,
    activeProjects: 6,
    badges: [],
    manifesto: "Urban renewal, affordable housing, and job creation for the inner city.",
    verified: true,
  },
  {
    id: "p5",
    name: "Fatima Al-Hassan",
    photo: "",
    party: "Citizens United",
    constituency: "Greenfield Ward 2",
    ward: "Ward 2",
    province: "Western Province",
    district: "Valley District",
    municipality: "Greenfield Municipality",
    accountabilityScore: 81,
    transparencyScore: 78,
    communityTrust: 85,
    engagementPoints: 134,
    totalPromises: 8,
    completedPromises: 5,
    delayedPromises: 1,
    failedPromises: 0,
    activeProjects: 3,
    badges: ["Open Governance"],
    manifesto: "Healthcare access, women's empowerment, and community-driven development.",
    verified: true,
  },
  {
    id: "p6",
    name: "James Nduka",
    photo: "",
    party: "Green Future",
    constituency: "Eastside Ward 4",
    ward: "Ward 4",
    province: "Southern Province",
    district: "Coastal District",
    municipality: "Harbor Municipality",
    accountabilityScore: 76,
    transparencyScore: 82,
    communityTrust: 74,
    engagementPoints: 112,
    totalPromises: 14,
    completedPromises: 7,
    delayedPromises: 3,
    failedPromises: 1,
    activeProjects: 4,
    badges: ["Financial Transparency"],
    manifesto: "Maritime economy growth, environmental protection, and coastal infrastructure.",
    verified: true,
  },
];

export const mockProjects: Project[] = [
  {
    id: "proj1",
    title: "Community Health Center Construction",
    description: "Building a modern health center with 50-bed capacity, emergency ward, maternal care unit, and pharmacy to serve Ward 5 residents. The facility will include solar-powered backup and clean water systems.",
    location: "Riverside Ward 5, Block C",
    ward: "Ward 5",
    politicianId: "p1",
    politicianName: "Amara Okafor",
    startDate: "2025-03-15",
    expectedCompletion: "2026-09-30",
    status: "in-progress",
    progress: 65,
    category: "Healthcare",
    evidenceCount: 23,
    commentCount: 47,
    verificationVotes: { completed: 12, inProgress: 89, delayed: 15, notStarted: 2 },
    milestones: [
      { title: "Foundation laid", date: "2025-04-20", completed: true },
      { title: "Structure completed", date: "2025-08-15", completed: true },
      { title: "Interior finishing", date: "2026-02-01", completed: false },
      { title: "Equipment installation", date: "2026-06-15", completed: false },
      { title: "Grand opening", date: "2026-09-30", completed: false },
    ],
    updates: [
      { date: "2026-02-28", content: "Roofing work completed. Interior plastering underway.", type: "progress" },
      { date: "2025-12-10", content: "Structure phase completed ahead of schedule.", type: "milestone" },
      { date: "2025-08-15", content: "Building frame fully erected. On track.", type: "milestone" },
    ],
  },
  {
    id: "proj2",
    title: "Rural Road Rehabilitation",
    description: "Rehabilitating 12km of rural road connecting villages to the main highway, including drainage systems and pedestrian paths.",
    location: "Highland Ward 3, Route 7",
    ward: "Ward 3",
    politicianId: "p2",
    politicianName: "David Mensah",
    startDate: "2025-06-01",
    expectedCompletion: "2026-06-01",
    status: "delayed",
    progress: 35,
    category: "Infrastructure",
    evidenceCount: 15,
    commentCount: 62,
    verificationVotes: { completed: 3, inProgress: 45, delayed: 72, notStarted: 8 },
    milestones: [
      { title: "Survey completed", date: "2025-06-30", completed: true },
      { title: "First 4km paved", date: "2025-10-01", completed: true },
      { title: "Drainage systems", date: "2026-01-15", completed: false },
      { title: "Full completion", date: "2026-06-01", completed: false },
    ],
    updates: [
      { date: "2026-03-01", content: "Work resumed after rainy season delays. Currently at 4.2km.", type: "progress" },
      { date: "2025-11-20", content: "Project paused due to heavy rainfall.", type: "announcement" },
    ],
  },
  {
    id: "proj3",
    title: "Solar-Powered School Electrification",
    description: "Installing solar panels and battery systems in 8 schools across the ward, ensuring reliable electricity for computer labs and lighting.",
    location: "Lakeside Ward 1",
    ward: "Ward 1",
    politicianId: "p3",
    politicianName: "Priya Sharma",
    startDate: "2025-01-10",
    expectedCompletion: "2025-12-31",
    status: "completed",
    progress: 100,
    category: "Education",
    evidenceCount: 45,
    commentCount: 38,
    verificationVotes: { completed: 142, inProgress: 5, delayed: 3, notStarted: 1 },
    milestones: [
      { title: "Procurement done", date: "2025-02-15", completed: true },
      { title: "4 schools installed", date: "2025-06-01", completed: true },
      { title: "All 8 schools done", date: "2025-11-15", completed: true },
      { title: "Final inspection", date: "2025-12-20", completed: true },
    ],
    updates: [
      { date: "2025-12-20", content: "All 8 schools now have reliable solar power! Project completed.", type: "completion" },
    ],
  },
  {
    id: "proj4",
    title: "Affordable Housing Phase 1",
    description: "Construction of 200 affordable housing units with community spaces, playgrounds, and commercial areas for low-income residents.",
    location: "Downtown Ward 7",
    ward: "Ward 7",
    politicianId: "p4",
    politicianName: "Carlos Rivera",
    startDate: "2025-09-01",
    expectedCompletion: "2027-03-01",
    status: "in-progress",
    progress: 20,
    category: "Housing",
    evidenceCount: 8,
    commentCount: 91,
    verificationVotes: { completed: 1, inProgress: 56, delayed: 22, notStarted: 12 },
    milestones: [
      { title: "Land cleared", date: "2025-10-15", completed: true },
      { title: "Foundation work", date: "2026-03-01", completed: false },
      { title: "First 50 units", date: "2026-09-01", completed: false },
      { title: "Full completion", date: "2027-03-01", completed: false },
    ],
    updates: [
      { date: "2026-02-15", content: "Land clearing complete. Foundation work beginning.", type: "progress" },
    ],
  },
  {
    id: "proj5",
    title: "Women's Skill Training Center",
    description: "Establishing a training center offering vocational courses in tailoring, digital literacy, and small business management.",
    location: "Greenfield Ward 2",
    ward: "Ward 2",
    politicianId: "p5",
    politicianName: "Fatima Al-Hassan",
    startDate: "2025-04-01",
    expectedCompletion: "2026-04-01",
    status: "in-progress",
    progress: 78,
    category: "Empowerment",
    evidenceCount: 19,
    commentCount: 33,
    verificationVotes: { completed: 8, inProgress: 95, delayed: 5, notStarted: 1 },
    milestones: [
      { title: "Building renovated", date: "2025-07-01", completed: true },
      { title: "Equipment installed", date: "2025-10-01", completed: true },
      { title: "First batch trained", date: "2026-01-15", completed: true },
      { title: "Official launch", date: "2026-04-01", completed: false },
    ],
    updates: [
      { date: "2026-03-01", content: "120 women completed first training batch. Preparing for grand opening.", type: "progress" },
    ],
  },
  {
    id: "proj6",
    title: "Coastal Erosion Prevention",
    description: "Building sea walls and planting mangroves along 3km of coastline to protect communities from erosion and flooding.",
    location: "Eastside Ward 4, Coastline",
    ward: "Ward 4",
    politicianId: "p6",
    politicianName: "James Nduka",
    startDate: "2025-05-01",
    expectedCompletion: "2026-11-01",
    status: "in-progress",
    progress: 42,
    category: "Environment",
    evidenceCount: 12,
    commentCount: 28,
    verificationVotes: { completed: 2, inProgress: 67, delayed: 18, notStarted: 5 },
    milestones: [
      { title: "Environmental assessment", date: "2025-06-15", completed: true },
      { title: "First 1km sea wall", date: "2025-12-01", completed: true },
      { title: "Mangrove planting", date: "2026-04-01", completed: false },
      { title: "Full completion", date: "2026-11-01", completed: false },
    ],
    updates: [
      { date: "2026-02-20", content: "1.2km of sea wall completed. Mangrove nursery growing well.", type: "progress" },
    ],
  },
];

export const mockComments: Comment[] = [
  { id: "c1", author: "Sarah K.", ward: "Ward 5", date: "2026-03-10", content: "I drove past the health center today — the walls are up and they're working on the roof. Looks promising!", hasEvidence: true },
  { id: "c2", author: "Michael O.", ward: "Ward 5", date: "2026-03-08", content: "When will the center start accepting patients? My family really needs this.", hasEvidence: false },
  { id: "c3", author: "Esther N.", ward: "Ward 5", date: "2026-03-05", content: "Uploaded photos from yesterday. Progress is visible but slower than expected.", hasEvidence: true },
  { id: "c4", author: "John D.", ward: "Ward 3", date: "2026-03-09", content: "The road work stopped again near kilometer 5. No workers on site for a week.", hasEvidence: true },
  { id: "c5", author: "Grace M.", ward: "Ward 1", date: "2025-12-22", content: "Our school finally has reliable power! The children are so excited about the computer lab.", hasEvidence: true },
];

export const mockEducationTopics: EducationTopic[] = [
  { id: "e1", title: "How Democracy Works", description: "Understanding the foundations of democratic governance and citizen participation.", category: "Democracy Basics", readTime: "8 min", icon: "🏛️" },
  { id: "e2", title: "Your Local Government Explained", description: "Learn about ward, municipality, district, and province structures.", category: "Local Government", readTime: "6 min", icon: "🏢" },
  { id: "e3", title: "How Elections Are Conducted", description: "The step-by-step process of elections, from registration to results.", category: "Elections", readTime: "10 min", icon: "🗳️" },
  { id: "e4", title: "Understanding Public Budgets", description: "How government budgets are created, allocated, and spent.", category: "Public Budgeting", readTime: "12 min", icon: "💰" },
  { id: "e5", title: "Your Rights as a Citizen", description: "Fundamental rights and responsibilities in a democratic society.", category: "Citizen Rights", readTime: "7 min", icon: "⚖️" },
  { id: "e6", title: "What is Accountability?", description: "Why accountability matters and how citizens can demand it.", category: "Democracy Basics", readTime: "5 min", icon: "🔍" },
  { id: "e7", title: "How Laws Are Made", description: "The legislative process from proposal to enforcement.", category: "Democracy Basics", readTime: "9 min", icon: "📜" },
  { id: "e8", title: "Ward Development Planning", description: "How development plans are created and implemented at the ward level.", category: "Local Government", readTime: "8 min", icon: "📋" },
  { id: "e9", title: "Reading Government Reports", description: "A guide to understanding official government documents and reports.", category: "Public Budgeting", readTime: "11 min", icon: "📊" },
];

export const mockRegions = {
  provinces: [
    {
      name: "Central Province",
      districts: [
        {
          name: "Metro District",
          municipalities: [
            { name: "Riverside Municipality", wards: ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5"] },
            { name: "Capital Municipality", wards: ["Ward 6", "Ward 7", "Ward 8", "Ward 9"] },
          ],
        },
      ],
    },
    {
      name: "Northern Province",
      districts: [
        {
          name: "Highland District",
          municipalities: [
            { name: "Summit Municipality", wards: ["Ward 1", "Ward 2", "Ward 3"] },
          ],
        },
      ],
    },
    {
      name: "Eastern Province",
      districts: [
        {
          name: "Lakeside District",
          municipalities: [
            { name: "Lakeview Municipality", wards: ["Ward 1", "Ward 2"] },
          ],
        },
      ],
    },
    {
      name: "Western Province",
      districts: [
        {
          name: "Valley District",
          municipalities: [
            { name: "Greenfield Municipality", wards: ["Ward 1", "Ward 2", "Ward 3"] },
          ],
        },
      ],
    },
    {
      name: "Southern Province",
      districts: [
        {
          name: "Coastal District",
          municipalities: [
            { name: "Harbor Municipality", wards: ["Ward 1", "Ward 2", "Ward 3", "Ward 4"] },
          ],
        },
      ],
    },
  ],
};

export const getStatusColor = (status: Project["status"]) => {
  switch (status) {
    case "completed": return "bg-civic-green text-civic-green-foreground";
    case "in-progress": return "bg-accent text-accent-foreground";
    case "delayed": return "bg-civic-amber text-civic-amber-foreground";
    case "not-started": return "bg-muted text-muted-foreground";
  }
};

export const getStatusLabel = (status: Project["status"]) => {
  switch (status) {
    case "completed": return "Completed";
    case "in-progress": return "In Progress";
    case "delayed": return "Delayed";
    case "not-started": return "Not Started";
  }
};

export const getScoreColor = (score: number) => {
  if (score >= 80) return "text-civic-green";
  if (score >= 60) return "text-civic-amber";
  return "text-destructive";
};
