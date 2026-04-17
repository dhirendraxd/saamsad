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
  projectId: string;
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
    name: "Sasmit Pokharel",
    photo: "/generated/politician-portrait.webp",
    party: "Rastriya Swatantra Party (RSP)",
    constituency: "Kathmandu 5",
    ward: "Kathmandu Constituency 5",
    province: "Bagmati Province",
    district: "Kathmandu",
    municipality: "Kathmandu Metropolitan City, Tokha Municipality, Budhanilkantha Municipality",
    accountabilityScore: 88,
    transparencyScore: 92,
    communityTrust: 85,
    engagementPoints: 90,
    totalPromises: 12,
    completedPromises: 1,
    delayedPromises: 0,
    failedPromises: 0,
    activeProjects: 4,
    badges: ["Youth Leader", "Policy Expert", "Tech-Savvy", "Digital Governance"],
    manifesto: "A former advisor to Mayor Balen Shah and urban planning expert, Pokharel focuses on digital transformation, education reform, and transparent governance. He currently serves as the Minister for Education, Science, and Technology and the official government spokesperson.",
    verified: true,
  },
  {
    id: "p2",
    name: "Dipendra Gurung",
    photo: "/generated/politician-portrait.webp",
    party: "CPN-UML",
    constituency: "Pokhara Ward 3",
    ward: "Ward 3",
    province: "Gandaki Province",
    district: "Kaski",
    municipality: "Pokhara Metropolitan City",
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
    manifesto: "Improving road connectivity for hill communities, tourism hubs, and farmer market access.",
    verified: true,
  },
  {
    id: "p3",
    name: "Manisha Rai",
    photo: "https://i.pravatar.cc/320?u=p3",
    party: "Rastriya Swatantra Party",
    constituency: "Biratnagar Ward 1",
    ward: "Ward 1",
    province: "Koshi Province",
    district: "Morang",
    municipality: "Biratnagar Metropolitan City",
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
    manifesto: "Expanding digital classrooms, clean energy in public schools, and open local budgeting.",
    verified: true,
  },
  {
    id: "p4",
    name: "Ramesh Yadav",
    photo: "https://i.pravatar.cc/320?u=p4",
    party: "Janata Samajbadi Party",
    constituency: "Janakpur Ward 7",
    ward: "Ward 7",
    province: "Madhesh Province",
    district: "Dhanusha",
    municipality: "Janakpurdham Sub-Metropolitan City",
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
    manifesto: "Urban sanitation upgrades, affordable housing expansion, and local youth employment programs.",
    verified: true,
  },
  {
    id: "p5",
    name: "Nirmala Thapa",
    photo: "https://i.pravatar.cc/320?u=p5",
    party: "Nepali Congress",
    constituency: "Butwal Ward 2",
    ward: "Ward 2",
    province: "Lumbini Province",
    district: "Rupandehi",
    municipality: "Butwal Sub-Metropolitan City",
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
    manifesto: "Improving maternal healthcare access, women's entrepreneurship, and community-led ward planning.",
    verified: true,
  },
  {
    id: "p6",
    name: "Tashi Lama",
    photo: "https://i.pravatar.cc/320?u=p6",
    party: "CPN (Maoist Centre)",
    constituency: "Dhangadhi Ward 4",
    ward: "Ward 4",
    province: "Sudurpashchim Province",
    district: "Kailali",
    municipality: "Dhangadhi Sub-Metropolitan City",
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
    manifesto: "Flood resilience, river embankment protection, and climate-adaptive agriculture support.",
    verified: true,
  },
  {
    id: "p7",
    name: "Pradip Paudel",
    photo: "/generated/past-politician.webp",
    party: "Nepali Congress",
    constituency: "Kathmandu 5",
    ward: "Kathmandu Constituency 5",
    province: "Lumbini Province",
    district: "Rupandehi",
    municipality: "Butwal Sub-Metropolitan City",
    accountabilityScore: 74,
    transparencyScore: 78,
    communityTrust: 78,
    engagementPoints: 116,
    totalPromises: 11,
    completedPromises: 5,
    delayedPromises: 3,
    failedPromises: 1,
    activeProjects: 2,
    badges: ["Former Representative"],
    manifesto: "Service period: 2079-2082 (2022-2026). Former Health Minister who focused on hospital digitalization and youth-led party reforms.",
    verified: true,
  },
  {
    id: "p8",
    name: "Ishwar Pokharel",
    photo: "/generated/past-politician.webp",
    party: "CPN-UML",
    constituency: "Kathmandu 5",
    ward: "Kathmandu Constituency 5",
    province: "Bagmati Province",
    district: "Kathmandu",
    municipality: "Kathmandu Metropolitan City",
    accountabilityScore: 62,
    transparencyScore: 55,
    communityTrust: 77,
    engagementPoints: 132,
    totalPromises: 9,
    completedPromises: 5,
    delayedPromises: 1,
    failedPromises: 0,
    activeProjects: 2,
    badges: ["Former Representative"],
    manifesto: "Service period: 2074-2079 (2017-2022). Senior UML leader and former Deputy Prime Minister with a long history in the constituency.",
    verified: true,
  },
  {
    id: "p9",
    name: "Narahari Acharya",
    photo: "/generated/past-politician.webp",
    party: "Nepali Congress",
    constituency: "Kathmandu 5",
    ward: "Kathmandu Constituency 5",
    province: "Bagmati Province",
    district: "Kathmandu",
    municipality: "Kathmandu Metropolitan City",
    accountabilityScore: 72,
    transparencyScore: 75,
    communityTrust: 71,
    engagementPoints: 92,
    totalPromises: 10,
    completedPromises: 4,
    delayedPromises: 3,
    failedPromises: 1,
    activeProjects: 1,
    badges: ["Past Representative"],
    manifesto: "Service period: 2064-2074 (2008-2017). Prominent intellectual and democratic leader who served multiple terms from this seat.",
    verified: true,
  },
  {
    id: "p10",
    name: "Nisha Bhandari",
    photo: "/generated/past-politician.webp",
    party: "Democratic Citizens Forum",
    constituency: "Kathmandu Constituency 5",
    ward: "Kathmandu Constituency 5",
    province: "Bagmati Province",
    district: "Kathmandu",
    municipality: "Kathmandu Metropolitan City",
    accountabilityScore: 70,
    transparencyScore: 69,
    communityTrust: 74,
    engagementPoints: 86,
    totalPromises: 13,
    completedPromises: 5,
    delayedPromises: 3,
    failedPromises: 2,
    activeProjects: 1,
    badges: [],
    manifesto: "Dummy profile focused on accessibility, sanitation, and public grievance response.",
    verified: true,
  },
];

export const mockProjects: Project[] = [
  {
    id: "proj1",
    title: "Digital Nepal Transformation Project",
    description: "Scaling up digital infrastructure and sustainable finance across the constituency as part of a national $185M initiative.",
    location: "Constituency-wide",
    ward: "Kathmandu Constituency 5",
    politicianId: "p1",
    politicianName: "Sasmit Pokharel",
    startDate: "2026-04-12",
    expectedCompletion: "2029-06-30",
    status: "in-progress",
    progress: 10,
    category: "Technology & Economy",
    evidenceCount: 3,
    commentCount: 12,
    verificationVotes: { completed: 0, inProgress: 45, delayed: 2, notStarted: 0 },
    milestones: [
      { title: "Budget approval", date: "2026-04-12", completed: true },
      { title: "Ward-level connectivity audit", date: "2026-06-15", completed: false },
    ],
    updates: [
      { date: "2026-04-12", content: "Government accepted $185M loan for digital transformation.", type: "announcement" },
    ],
  },
  {
    id: "proj2",
    title: "Hill Road Rehabilitation",
    description: "Rehabilitating 12km of hill road connecting settlements to Pokhara's arterial routes, including drainage systems and pedestrian walkways.",
    location: "Pokhara Metropolitan City, Ward 3",
    ward: "Ward 3",
    politicianId: "p2",
    politicianName: "Dipendra Gurung",
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
    description: "Installing solar panels and battery systems in 8 schools across Biratnagar Ward 1, ensuring reliable electricity for computer labs and classrooms.",
    location: "Biratnagar Metropolitan City, Ward 1",
    ward: "Ward 1",
    politicianId: "p3",
    politicianName: "Manisha Rai",
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
    location: "Janakpurdham Sub-Metropolitan City, Ward 7",
    ward: "Ward 7",
    politicianId: "p4",
    politicianName: "Ramesh Yadav",
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
    description: "Establishing a training center offering vocational courses in tailoring, digital literacy, and small business management for Butwal Ward 2.",
    location: "Butwal Sub-Metropolitan City, Ward 2",
    ward: "Ward 2",
    politicianId: "p5",
    politicianName: "Nirmala Thapa",
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
    title: "Riverbank Erosion Prevention",
    description: "Building river embankments and bioengineering protections along 3km of vulnerable riverbanks to protect settlements from monsoon erosion and flooding.",
    location: "Dhangadhi Sub-Metropolitan City, Ward 4",
    ward: "Ward 4",
    politicianId: "p6",
    politicianName: "Tashi Lama",
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
      { title: "First 1km embankment", date: "2025-12-01", completed: true },
      { title: "Bioengineering plantation", date: "2026-04-01", completed: false },
      { title: "Full completion", date: "2026-11-01", completed: false },
    ],
    updates: [
      { date: "2026-02-20", content: "1.2km of embankment completed. Bamboo and vetiver plantation prep underway.", type: "progress" },
    ],
  },
  {
    id: "proj7",
    title: "Ring Road Second Phase Expansion (Narayan Gopal Chowk)",
    description: "Coordination for the completion of the Ring Road expansion specifically focusing on underpasses at Narayan Gopal Chowk.",
    location: "Maharajgunj / Narayan Gopal Chowk",
    ward: "Kathmandu Constituency 5",
    politicianId: "p1",
    politicianName: "Sasmit Pokharel",
    startDate: "2023-01-15",
    expectedCompletion: "2027-12-31",
    status: "in-progress",
    progress: 45,
    category: "Infrastructure",
    evidenceCount: 15,
    commentCount: 28,
    verificationVotes: { completed: 0, inProgress: 88, delayed: 32, notStarted: 0 },
    milestones: [
      { title: "Site clearance at Maharajgunj", date: "2024-11-20", completed: true },
      { title: "Underpass construction start", date: "2026-05-01", completed: false },
    ],
    updates: [
      { date: "2026-03-28", content: "Construction coordination review completed with urban road teams.", type: "progress" },
    ],
  },
  {
    id: "proj8",
    title: "Book Free Friday Scale-up",
    description: "Implementing the project-based learning model used in KMC schools to all community schools in the constituency.",
    location: "All Ward Schools (KMC & Tokha)",
    ward: "Kathmandu Constituency 5",
    politicianId: "p1",
    politicianName: "Sasmit Pokharel",
    startDate: "2026-03-20",
    expectedCompletion: "2026-12-31",
    status: "in-progress",
    progress: 30,
    category: "Education",
    evidenceCount: 5,
    commentCount: 9,
    verificationVotes: { completed: 0, inProgress: 25, delayed: 1, notStarted: 0 },
    milestones: [
      { title: "Curriculum alignment with Tokha Municipality", date: "2026-04-05", completed: true },
      { title: "Training of 150 local teachers", date: "2026-07-10", completed: false },
    ],
    updates: [
      { date: "2026-04-22", content: "Pilot implementation started in selected schools across KMC and Tokha.", type: "progress" },
    ],
  },
];

export const mockComments: Comment[] = [
  { id: "c1", projectId: "proj1", author: "Ramesh K.C.", ward: "Resident (Ward 4)", date: "2026-04-15", content: "Finally seeing a leader who talks about tech with actual implementation plans. Hope this isn't just paper talk.", hasEvidence: false },
  { id: "c2", projectId: "proj7", author: "Sunita Mahat", ward: "Business Owner (Maharajgunj)", date: "2026-03-28", content: "The dust from the stalled construction is unbearable. We need the new MP to push the contractors harder.", hasEvidence: true },
  { id: "c3", projectId: "proj8", author: "Mina P.", ward: "Resident (Tokha)", date: "2026-04-18", content: "Great to see project-based learning included in local schools. Please publish school-wise rollout dates.", hasEvidence: false },
  { id: "c4", projectId: "proj2", author: "Tek B.", ward: "Ward 3", date: "2026-03-09", content: "Road work near kilometer 5 paused again. Please publish the updated schedule for the monsoon window.", hasEvidence: true },
  { id: "c5", projectId: "proj3", author: "Anju R.", ward: "Ward 1", date: "2025-12-22", content: "Our school now has stable power. Students are finally using computers during regular class hours.", hasEvidence: true },
];

export const mockEducationTopics: EducationTopic[] = [
  {
    id: "e1",
    title: "Federalism & Local Governance",
    description: "Understand Nepal's three-tier government so citizens know where to demand services and accountability.",
    category: "Local Governance",
    readTime: "10 min",
    icon: "🏛️",
  },
  {
    id: "e2",
    title: "Digital Rights & Freedom of Expression",
    description: "Help young citizens protect free expression and understand digital safety, privacy, and cyber law basics.",
    category: "Digital Rights",
    constituency: "Butwal 2",
    ward: "Ward 2",
  },
  {
    id: "e3",
    title: "Anti-Corruption & Transparency",
    description: "Learn practical ways to spot abuse of power and hold public officials accountable through transparent records.",
    category: "Anti-Corruption",
    readTime: "9 min",
    icon: "⚖️",
  },
  {
    id: "e4",
    title: "The Electoral System",
    description: "Understand how FPTP and PR seats are formed in Nepal and why inclusive representation matters.",
    category: "Electoral System",
    readTime: "12 min",
    icon: "🗳️",
  },
];

export const mockRegions = {
  provinces: [
    {
      name: "Koshi Province",
      districts: [
        {
          name: "Morang",
          municipalities: [
            { name: "Biratnagar Metropolitan City", wards: ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5"] },
            { name: "Sundarharaicha Municipality", wards: ["Ward 6", "Ward 7", "Ward 8", "Ward 9"] },
          ],
        },
      ],
    },
    {
      name: "Madhesh Province",
      districts: [
        {
          name: "Dhanusha",
          municipalities: [
            { name: "Janakpurdham Sub-Metropolitan City", wards: ["Ward 1", "Ward 2", "Ward 3"] },
          ],
        },
      ],
    },
    {
      name: "Bagmati Province",
      districts: [
        {
          name: "Kathmandu",
          municipalities: [
            { name: "Kathmandu Metropolitan City", wards: ["Kathmandu Constituency 5", "Ward 1", "Ward 2"] },
            { name: "Tokha Municipality", wards: ["Kathmandu Constituency 5", "Ward 3", "Ward 4"] },
            { name: "Budhanilkantha Municipality", wards: ["Kathmandu Constituency 5", "Ward 5", "Ward 6"] },
          ],
        },
      ],
    },
    {
      name: "Gandaki Province",
      districts: [
        {
          name: "Kaski",
          municipalities: [
            { name: "Pokhara Metropolitan City", wards: ["Ward 1", "Ward 2", "Ward 3"] },
          ],
        },
      ],
    },
    {
      name: "Lumbini Province",
      districts: [
        {
          name: "Rupandehi",
          municipalities: [
            { name: "Butwal Sub-Metropolitan City", wards: ["Ward 1", "Ward 2", "Ward 3", "Ward 4"] },
          ],
        },
      ],
    },
    {
      name: "Karnali Province",
      districts: [
        {
          name: "Surkhet",
          municipalities: [
            { name: "Birendranagar Municipality", wards: ["Ward 1", "Ward 2", "Ward 3"] },
          ],
        },
      ],
    },
    {
      name: "Sudurpashchim Province",
      districts: [
        {
          name: "Kailali",
          municipalities: [
            { name: "Dhangadhi Sub-Metropolitan City", wards: ["Ward 1", "Ward 2", "Ward 3", "Ward 4"] },
          ],
        },
      ],
    },
  ],
};

export const getStatusColor = (status: Project["status"]) => {
  switch (status) {
    case "completed": return "border border-civic-green/30 text-civic-green";
    case "in-progress": return "border border-accent/30 text-accent";
    case "delayed": return "border border-civic-amber/30 text-civic-amber";
    case "not-started": return "border border-border text-muted-foreground";
  }
};

const projectCoverImageById: Record<string, string> = {
  proj1: "/generated/project-drainage.webp",
  proj7: "/generated/project-drainage.webp",
  proj8: "/generated/project-water-kiosk.webp",
};

export const getProjectCoverImage = (projectId: string) => projectCoverImageById[projectId] ?? "";

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
  if (score >= 60) return "text-civic-green";
  return "text-destructive";
};
