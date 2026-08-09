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
    website?: string | null;
  };
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

export interface Profile {
  schema: string;
  profile: ProfileSection;
  education: EducationEntry[];
  skills: SkillCategory[];
  projects: Project[];
  achievements: Achievement[];
  experience: ExperienceEntry[];
  certifications?: unknown[];
  interests?: string[];
  meta?: { appVersion?: number; approvedAt?: string | null; sourceFiles?: string[] };
}

export const profile: Profile = profileData as Profile;
export const projects: Project[] = profile.projects ?? [];