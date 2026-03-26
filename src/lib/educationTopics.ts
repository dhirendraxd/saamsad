export interface EducationTopicDetail {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  sections: Array<{
    heading: string;
    points: string[];
  }>;
  citizenActions: string[];
}

export const educationTopicDetails: EducationTopicDetail[] = [
  {
    id: "e1",
    slug: "federalism-local-governance",
    title: "Federalism & Local Governance",
    category: "Local Governance",
    readTime: "10 min",
    summary:
      "Nepal's federal structure has three tiers: federal, provincial, and local government. Knowing which tier is responsible for services helps citizens ask the right office for action.",
    sections: [
      {
        heading: "How Power Is Shared",
        points: [
          "Federal government handles national policy, defense, and foreign affairs.",
          "Provinces manage regional roads, hospitals, and provincial planning.",
          "Local governments are closest to people and handle local roads, sanitation, and many basic services.",
        ],
      },
      {
        heading: "Where To Raise Local Issues",
        points: [
          "Ward office for immediate community concerns and local records.",
          "Municipality or rural municipality for larger budgets, service projects, and planning.",
          "Provincial ministry when the issue crosses municipal boundaries.",
        ],
      },
    ],
    citizenActions: [
      "Track annual municipal budgets and ask for public hearing dates.",
      "Use ward meetings to record service gaps in writing.",
      "Follow up on unresolved complaints with document references.",
    ],
  },
  {
    id: "e2",
    slug: "digital-rights-freedom-expression",
    title: "Digital Rights & Freedom of Expression",
    category: "Digital Rights",
    readTime: "8 min",
    summary:
      "Digital rights protect your expression, privacy, and safety online. Citizens can stay active online while reducing risks from misuse of personal data and harmful online behavior.",
    sections: [
      {
        heading: "Core Digital Rights",
        points: [
          "Freedom of expression applies online, with responsibility to avoid harmful misinformation.",
          "Privacy includes secure handling of personal data and consent-aware sharing.",
          "Access rights mean digital services should be usable and understandable for all citizens.",
        ],
      },
      {
        heading: "Digital Safety Basics",
        points: [
          "Use strong unique passwords with two-factor authentication.",
          "Verify suspicious links before opening them.",
          "Store evidence and report serious harassment through official channels.",
        ],
      },
    ],
    citizenActions: [
      "Enable 2FA on social and email accounts.",
      "Review app permissions every month.",
      "Report abuse with screenshots and timestamps.",
    ],
  },
  {
    id: "e3",
    slug: "anti-corruption-transparency",
    title: "Anti-Corruption & Transparency",
    category: "Anti-Corruption",
    readTime: "9 min",
    summary:
      "Transparency allows citizens to inspect public decisions and spending. Anti-corruption work becomes stronger when communities document issues and request records consistently.",
    sections: [
      {
        heading: "Common Warning Signs",
        points: [
          "Unclear project timelines and repeated unexplained delays.",
          "Large budget changes without public explanation.",
          "Public procurement details that are hard to access.",
        ],
      },
      {
        heading: "Practical Transparency Tools",
        points: [
          "Ask for procurement notices and implementation reports.",
          "Compare announced milestones with on-site evidence.",
          "Use documented community feedback to push for correction.",
        ],
      },
    ],
    citizenActions: [
      "Keep a dated evidence log for local projects.",
      "Attend public hearings and ask one specific budget question.",
      "Submit concise written complaints with references.",
    ],
  },
  {
    id: "e4",
    slug: "electoral-system-nepal",
    title: "The Electoral System",
    category: "Electoral System",
    readTime: "12 min",
    summary:
      "Nepal uses both First-Past-The-Post (FPTP) and Proportional Representation (PR). Understanding both systems helps citizens evaluate representation and accountability after elections.",
    sections: [
      {
        heading: "Two Voting Approaches",
        points: [
          "FPTP elects the candidate with the highest votes in a constituency.",
          "PR allocates seats to parties based on overall vote share.",
          "Combined design balances local representation and broader inclusion.",
        ],
      },
      {
        heading: "Why It Matters",
        points: [
          "Different systems influence who gets represented and how.",
          "Seat distribution affects coalition building and policy direction.",
          "Informed citizens can better evaluate mandates and promises.",
        ],
      },
    ],
    citizenActions: [
      "Review candidate and party commitments before voting.",
      "Track elected representatives after results, not only before elections.",
      "Promote issue-based discussion in your ward.",
    ],
  },
];

const topicById = new Map(educationTopicDetails.map((topic) => [topic.id, topic]));
const topicBySlug = new Map(educationTopicDetails.map((topic) => [topic.slug, topic]));

export function getEducationTopicById(topicId: string) {
  return topicById.get(topicId);
}

export function getEducationTopicBySlug(topicSlug: string) {
  return topicBySlug.get(topicSlug);
}

export function getEducationTopicHref(topicId: string) {
  const topic = getEducationTopicById(topicId);
  return topic ? `/education/${topic.slug}` : "/education";
}