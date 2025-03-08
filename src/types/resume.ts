
export type ResumeTemplate = 'minimal' | 'professional' | 'creative' | 'modern';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profession: string;
  city: string;
  province: string;
  postalCode: string;
  photoUrl?: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface WorkExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface Resume {
  id: string;
  template: ResumeTemplate;
  personalInfo: PersonalInfo;
  workExperience: WorkExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  summary: string;
}
