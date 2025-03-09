
import { Resume } from '@/contexts/ResumeContext';
import { v4 as uuidv4 } from 'uuid';
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set the worker source manually without trying to import it
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export async function parseResumeFile(file: File): Promise<Resume> {
  try {
    const fileContent = await readFileContent(file);
    return extractResumeData(fileContent);
  } catch (error) {
    console.error('Error parsing resume file:', error);
    throw new Error('Failed to parse resume file');
  }
}

async function readFileContent(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    return readPdfContent(file);
  } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return readDocContent(file);
  } else {
    throw new Error('Unsupported file type');
  }
}

async function readPdfContent(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

async function readDocContent(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

function extractResumeData(content: string): Resume {
  // This is a simplified version - in a real app, you would use NLP or other techniques
  // to better extract structured information from the resume text.
  
  const nameMatch = content.match(/([A-Z][a-z]+)\s+([A-Z][a-z]+)/);
  const emailMatch = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = content.match(/(\+\d{1,3}\s?)?(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/);
  
  // Simple extraction of job titles and education degrees
  const possibleJobTitles = [
    'Software Engineer', 'Web Developer', 'Project Manager', 'Marketing Specialist',
    'Data Analyst', 'Product Manager', 'Designer', 'Engineer'
  ];
  
  const possibleDegrees = [
    'Bachelor', 'Master', 'PhD', 'BS', 'MS', 'BA', 'MA', 'Associate'
  ];
  
  let profession = '';
  for (const title of possibleJobTitles) {
    if (content.includes(title)) {
      profession = title;
      break;
    }
  }
  
  // Create a basic resume structure with extracted information
  return {
    id: uuidv4(),
    template: 'minimal',
    personalInfo: {
      firstName: nameMatch ? nameMatch[1] : '',
      lastName: nameMatch ? nameMatch[2] : '',
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      profession: profession,
      city: '',
      province: '',
      postalCode: '',
      location: '',
      website: '',
      photoUrl: '',
    },
    workExperience: [],
    education: [],
    skills: [],
    summary: content.substring(0, 200) + '...' // Just use the first part as a summary for now
  };
}
