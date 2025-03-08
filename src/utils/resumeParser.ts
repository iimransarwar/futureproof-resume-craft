
import { Resume } from '@/types/resume';
import { v4 as uuidv4 } from 'uuid';
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';

// Import necessary PDF.js worker
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function parseResumeFile(file: File): Promise<Partial<Resume>> {
  try {
    const fileType = file.type;
    let text = '';

    if (fileType === 'application/pdf') {
      text = await parsePdfFile(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword'
    ) {
      text = await parseDocFile(file);
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or Word document.');
    }

    // Extract relevant information from the text
    return extractResumeInfo(text);
  } catch (error) {
    console.error('Error parsing resume file:', error);
    throw error;
  }
}

async function parsePdfFile(file: File): Promise<string> {
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

async function parseDocFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

function extractResumeInfo(text: string): Partial<Resume> {
  // This is a simple implementation - in a real app, you'd use more
  // sophisticated NLP techniques to extract structured data
  
  // Find name (assume it's at the beginning, first line)
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const possibleName = lines[0].trim();
  const nameParts = possibleName.split(' ');
  
  // Try to find email
  const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : '';
  
  // Try to find phone
  const phoneRegex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : '';
  
  // For simplicity, look for education keywords
  const educationKeywords = ['education', 'university', 'college', 'degree', 'bachelor', 'master', 'phd'];
  const educationLines = lines.filter(line => 
    educationKeywords.some(keyword => line.toLowerCase().includes(keyword))
  );
  
  // Look for work experience keywords
  const workKeywords = ['experience', 'employment', 'work history', 'job', 'position'];
  const workLines = lines.filter(line => 
    workKeywords.some(keyword => line.toLowerCase().includes(keyword))
  );
  
  // Look for skills
  const skillsKeywords = ['skills', 'proficiencies', 'technologies', 'tools'];
  const skillsLines = lines.filter(line => 
    skillsKeywords.some(keyword => line.toLowerCase().includes(keyword))
  );
  
  // Create a basic resume structure with what we found
  return {
    id: uuidv4(),
    template: 'minimal',
    personalInfo: {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: email,
      phone: phone,
      profession: '',
      city: '',
      province: '',
      postalCode: '',
    },
    workExperience: workLines.length > 0 ? [
      {
        id: uuidv4(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: workLines.join('\n')
      }
    ] : [],
    education: educationLines.length > 0 ? [
      {
        id: uuidv4(),
        school: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        description: educationLines.join('\n')
      }
    ] : [],
    skills: skillsLines.length > 0 ? 
      skillsLines.join(' ').split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0)
        .map(skill => ({
          id: uuidv4(),
          name: skill,
          level: 3
        })) : [],
    summary: lines.slice(1, 5).join('\n') // Take a few lines after the name for the summary
  };
}
