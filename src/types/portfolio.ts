export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  fullStory: string;
  category: 'AI & ML' | 'Distributed Systems' | 'Full-Stack' | 'Open Source' | 'Hackathon Winner' | 'Software Development' | string;
  technologies: string[];
  metrics?: string[];
  githubUrl: string;
  demoUrl?: string;
  imageUrl?: string;
  featured: boolean;
  published: boolean;
  date: string;
  architectureNotes?: string;
  coverStyle?: 'neural' | 'network' | 'analytics' | 'terminal' | 'cyber';
  order?: number;
  repoName?: string;
  stars?: number;
  forks?: number;
  isFork?: boolean;
  language?: string;
  lastUpdated?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  proficiency: number; // 0 - 100
  level: 'Expert' | 'Advanced' | 'Proficient';
  iconName?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: SkillItem[];
  published: boolean;
  order?: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string;
  credentialId?: string;
  verifyUrl?: string;
  imageUrl?: string;
  downloadUrl?: string;
  category: string;
  highlight?: string;
  awardAmount?: string;
  published: boolean;
  order?: number;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  gpa?: string;
  status: string;
  coursework: string[];
  achievements: string[];
  published: boolean;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  email: string;
  resumeUrl: string;
  discord?: string;
}

export interface Profile {
  fullName: string;
  title: string;
  headline: string;
  subheading: string;
  introduction?: string;
  avatarUrl?: string;
  bioParagraph1: string;
  bioParagraph2: string;
  location: string;
  availabilityStatus: string;
  university: string;
  graduationYear: string;
  socials: SocialLinks;
  heroPitch: string;
  published: boolean;
  stats: {
    hackathonsWon: number;
    projectsCompleted: number;
    contributionsCount: string;
    academicGpa: string;
  };
}

export interface AppearanceSettings {
  ambientGlow: boolean;
  meshBackground: boolean;
  accentColor: 'blue' | 'cyan' | 'indigo' | 'emerald';
  cardGlassEffect: boolean;
  published: boolean;
}

export interface MediaAsset {
  id: string;
  name: string;
  type: 'avatar' | 'project_cover' | 'document';
  url: string;
  dateAdded: string;
  size?: string;
}

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skillCategories: SkillCategory[];
  certificates: Certificate[];
  education: EducationItem[];
  appearance: AppearanceSettings;
  media: MediaAsset[];
  lastPublishedAt?: string;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAuthorizedAdmin: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
  replied: boolean;
  repliedAt?: string;
}

