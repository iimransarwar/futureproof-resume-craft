
import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define resume types
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
  location: string;
  website?: string;
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

// Define initial state
const initialPersonalInfo: PersonalInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  profession: '',
  city: '',
  province: '',
  postalCode: '',
  location: '',
  website: '',
  photoUrl: '',
};

const initialResume: Resume = {
  id: uuidv4(),
  template: 'minimal',
  personalInfo: initialPersonalInfo,
  workExperience: [],
  education: [],
  skills: [],
  summary: '',
};

// Define action types
type ResumeAction =
  | { type: 'SET_TEMPLATE'; payload: ResumeTemplate }
  | { type: 'SET_PERSONAL_INFO'; payload: Partial<PersonalInfo> }
  | { type: 'ADD_WORK_EXPERIENCE'; payload: WorkExperienceItem }
  | { type: 'UPDATE_WORK_EXPERIENCE'; payload: WorkExperienceItem }
  | { type: 'REMOVE_WORK_EXPERIENCE'; payload: string }
  | { type: 'ADD_EDUCATION'; payload: EducationItem }
  | { type: 'UPDATE_EDUCATION'; payload: EducationItem }
  | { type: 'REMOVE_EDUCATION'; payload: string }
  | { type: 'ADD_SKILL'; payload: SkillItem }
  | { type: 'UPDATE_SKILL'; payload: SkillItem }
  | { type: 'REMOVE_SKILL'; payload: string }
  | { type: 'SET_SUMMARY'; payload: string }
  | { type: 'RESET_RESUME' }
  | { type: 'IMPORT_RESUME'; payload: Resume };

// Create context
interface ResumeContextProps {
  state: Resume;
  dispatch: React.Dispatch<ResumeAction>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  selectedTemplate: ResumeTemplate;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<ResumeTemplate>>;
  showTemplateSelector: boolean;
  setShowTemplateSelector: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResumeContext = createContext<ResumeContextProps | undefined>(undefined);

// Define reducer
const resumeReducer = (state: Resume, action: ResumeAction): Resume => {
  let newState: Resume;
  
  switch (action.type) {
    case 'SET_TEMPLATE':
      newState = { ...state, template: action.payload };
      break;
    case 'SET_PERSONAL_INFO':
      newState = { ...state, personalInfo: { ...state.personalInfo, ...action.payload } };
      break;
    case 'ADD_WORK_EXPERIENCE':
      newState = { ...state, workExperience: [...state.workExperience, action.payload] };
      break;
    case 'UPDATE_WORK_EXPERIENCE':
      newState = {
        ...state,
        workExperience: state.workExperience.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
      break;
    case 'REMOVE_WORK_EXPERIENCE':
      newState = {
        ...state,
        workExperience: state.workExperience.filter((item) => item.id !== action.payload),
      };
      break;
    case 'ADD_EDUCATION':
      newState = { ...state, education: [...state.education, action.payload] };
      break;
    case 'UPDATE_EDUCATION':
      newState = {
        ...state,
        education: state.education.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
      break;
    case 'REMOVE_EDUCATION':
      newState = {
        ...state,
        education: state.education.filter((item) => item.id !== action.payload),
      };
      break;
    case 'ADD_SKILL':
      newState = { ...state, skills: [...state.skills, action.payload] };
      break;
    case 'UPDATE_SKILL':
      newState = {
        ...state,
        skills: state.skills.map((item) => (item.id === action.payload.id ? action.payload : item)),
      };
      break;
    case 'REMOVE_SKILL':
      newState = {
        ...state,
        skills: state.skills.filter((item) => item.id !== action.payload),
      };
      break;
    case 'SET_SUMMARY':
      newState = { ...state, summary: action.payload };
      break;
    case 'RESET_RESUME':
      newState = { ...initialResume, id: uuidv4() };
      break;
    case 'IMPORT_RESUME':
      newState = action.payload;
      break;
    default:
      return state;
  }
  
  // Save updated state to localStorage
  localStorage.setItem('resumeState', JSON.stringify(newState));
  return newState;
};

// Create provider
export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load state from localStorage
  const loadInitialState = (): Resume => {
    try {
      const savedState = localStorage.getItem('resumeState');
      if (savedState) {
        return JSON.parse(savedState) as Resume;
      }
    } catch (error) {
      console.error('Error loading resume state from localStorage:', error);
    }
    return initialResume;
  };

  const [state, dispatch] = useReducer(resumeReducer, loadInitialState());
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(state.template || 'minimal');
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);

  // Update selected template when state.template changes
  useEffect(() => {
    setSelectedTemplate(state.template);
  }, [state.template]);

  return (
    <ResumeContext.Provider value={{ 
      state, 
      dispatch, 
      currentStep, 
      setCurrentStep,
      selectedTemplate,
      setSelectedTemplate,
      showTemplateSelector,
      setShowTemplateSelector
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

// Custom hook for using the resume context
export const useResume = (): ResumeContextProps => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
