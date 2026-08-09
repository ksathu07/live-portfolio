import profileData from "../content/profile.json";

export interface ProfileSection {
  name: string;
  headline: string;
  tagline: string;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
  availability?: string | null;
  about?: string[];
  links?: {
    github?: string | null;
    linkedin?: string | null;
    instagram?: string | null;
    leetcode?: string | null;
    youtube?: string | null;
    vimeo?: string | null;
    behance?: string | null;
    dribbble?: string | null;
    website?: string | null;
  };
  extraLinks?: { label: string; url: string }[];
  facts?: { label: string; value: string }[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field?: string | null;
  startYear?: string | null;
  endYear?: string | null;
  grade?: string | null;
  details?: string[];
  source?: string;
}

export interface ExperienceEntry {
  organization: string;
  role: string;
  type?: string;
  startDate?: string | null;
  endDate?: string | null;
  present?: boolean;
  bullets?: string[];
  source?: string;
}

export interface Project {
  id: string;
  name: string;
  tagline?: string | null;
  description: string;
  tech: string[];
  year?: string | null;
  status?: "prototype" | "in-development" | "complete" | null;
  links?: { repo?: string | null; demo?: string | null; video?: string | null };
  highlights?: string[];
  source?: string;
}

export interface Achievement {
  title: string;
  date?: string | null;
  place?: string | null;
  details?: string | null;
  source?: string;
}

export interface SkillCategory {
  category: string;
  items: { name: string; level?: "beginner" | "intermediate" | "advanced" | "learning" | null }[];
}

export interface ProofRef {
  id?: string;
  kind?: "image" | "video" | "document" | "link" | "media";
  label?: string | null;
  path?: string | null;
  url?: string | null;
  source?: string;
}

export interface Certification {
  title: string;
  issuer?: string | null;
  date?: string | null;
  year?: string | null;
  proof?: ProofRef;
  source?: string;
}

export interface VideoPortfolioItem {
  title: string;
  description?: string | null;
  role?: string | null;
  year?: string | null;
  tools?: string[];
  links?: {
    watch?: string | null;
    youtube?: string | null;
    vimeo?: string | null;
    embed?: string | null;
  };
  proof?: ProofRef;
}

export interface VideoPortfolio {
  headline?: string;
  summary?: string;
  items: VideoPortfolioItem[];
}

export interface PortfolioSectionItem {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  year?: string | null;
  links?: { view?: string | null; download?: string | null };
  proof?: ProofRef;
}

export interface PortfolioSection {
  id: string;
  title: string;
  description?: string | null;
  items: PortfolioSectionItem[];
}

export interface Profile {
  schema: string;
  profile: ProfileSection;
  education: EducationEntry[];
  skills: SkillCategory[];
  projects: Project[];
  achievements: Achievement[];
  experience: ExperienceEntry[];
  certifications?: Certification[];
  videoPortfolio?: VideoPortfolio;
  portfolioSections?: PortfolioSection[];
  proof?: Record<string, ProofRef>;
  interests?: string[];
  meta?: {
    appVersion?: number;
    approvedAt?: string | null;
    lastIngestedAt?: string | null;
    sourceFiles?: string[];
    sources?: {
      personalRoot?: string;
      subfolders?: Array<{ name: string; path: string; fileCount?: number; mediaCount?: number; linksCount?: number }>;
    };
  };
}

export const profile: Profile = profileData as Profile;
export const projects: Project[] = profile.projects ?? [];
export const videoPortfolio: VideoPortfolio | undefined = profile.videoPortfolio;
export const portfolioSections: PortfolioSection[] = profile.portfolioSections ?? [];
export const certifications: Certification[] = profile.certifications ?? [];
export const proof: Record<string, ProofRef> = profile.proof ?? {};
