
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Resume, ResumeTemplate, PersonalInfo, WorkExperienceItem, EducationItem, SkillItem } from '@/types/resume';
import { v4 as uuidv4 } from 'uuid';

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
}

const ResumeContext = createContext<ResumeContextProps | undefined>(undefined);

// Define reducer
const resumeReducer = (state: Resume, action: ResumeAction): Resume => {
  switch (action.type) {
    case 'SET_TEMPLATE':
      return { ...state, template: action.payload };
    case 'SET_PERSONAL_INFO':
      return { ...state, personalInfo: { ...state.personalInfo, ...action.payload } };
    case 'ADD_WORK_EXPERIENCE':
      return { ...state, workExperience: [...state.workExperience, action.payload] };
    case 'UPDATE_WORK_EXPERIENCE':
      return {
        ...state,
        workExperience: state.workExperience.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'REMOVE_WORK_EXPERIENCE':
      return {
        ...state,
        workExperience: state.workExperience.filter((item) => item.id !== action.payload),
      };
    case 'ADD_EDUCATION':
      return { ...state, education: [...state.education, action.payload] };
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        education: state.education.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'REMOVE_EDUCATION':
      return {
        ...state,
        education: state.education.filter((item) => item.id !== action.payload),
      };
    case 'ADD_SKILL':
      return { ...state, skills: [...state.skills, action.payload] };
    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map((item) => (item.id === action.payload.id ? action.payload : item)),
      };
    case 'REMOVE_SKILL':
      return {
        ...state,
        skills: state.skills.filter((item) => item.id !== action.payload),
      };
    case 'SET_SUMMARY':
      return { ...state, summary: action.payload };
    case 'RESET_RESUME':
      return { ...initialResume, id: uuidv4() };
    case 'IMPORT_RESUME':
      return action.payload;
    default:
      return state;
  }
};

// Create provider
export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(resumeReducer, initialResume);
  const [currentStep, setCurrentStep] = React.useState(0);

  // Load from localStorage if available
  useEffect(() => {
    const savedResume = localStorage.getItem('resume');
    if (savedResume) {
      try {
        const parsedResume = JSON.parse(savedResume);
        dispatch({ type: 'IMPORT_RESUME', payload: parsedResume });
      } catch (error) {
        console.error('Failed to parse saved resume', error);
      }
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('resume', JSON.stringify(state));
  }, [state]);

  return (
    <ResumeContext.Provider value={{ state, dispatch, currentStep, setCurrentStep }}>
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
