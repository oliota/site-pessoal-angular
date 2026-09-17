export type ProjectLinkType = 'route' | 'external';
export type ProjectLinkTarget = 'same' | 'new';

export interface ProjectLink {
  label: string;
  url: string;
  type: ProjectLinkType;
  target: ProjectLinkTarget;
}

export interface HomeScreenApp {
  enabled: boolean;
  name: string;
  shortName: string;
  description?: string;
  startUrl: string;
  scope?: string;
  themeColor?: string;
  backgroundColor?: string;
  icon?: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  status?: string;
  link?: ProjectLink;
  homeScreenApp?: HomeScreenApp;
}

export interface Profile {
  name: string;
  headline: string;
  location: string;
  summary: string;
  email?: string;
  github?: string;
  linkedin?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location?: string;
  description: string;
  technologies: string[];
}

export interface Teaching {
  title: string;
  organization: string;
  period: string;
  topics: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}
