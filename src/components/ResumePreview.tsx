
import { Resume, ResumeTemplate } from '@/contexts/ResumeContext';
import MinimalTemplate from './resume-templates/MinimalTemplate';
import ModernTemplate from './resume-templates/ModernTemplate';
import ProfessionalTemplate from './resume-templates/ProfessionalTemplate';
import CreativeTemplate from './resume-templates/CreativeTemplate';

interface ResumePreviewProps {
  resume: Resume;
}

const ResumePreview = ({ resume }: ResumePreviewProps) => {
  const getTemplateComponent = (template: ResumeTemplate) => {
    switch (template) {
      case 'minimal':
        return <MinimalTemplate resume={resume} />;
      case 'modern':
        return <ModernTemplate resume={resume} />;
      case 'professional':
        return <ProfessionalTemplate resume={resume} />;
      case 'creative':
        return <CreativeTemplate resume={resume} />;
      default:
        return <MinimalTemplate resume={resume} />;
    }
  };

  return (
    <div 
      id="resume-preview" 
      className="bg-white shadow-lg rounded-lg overflow-hidden w-full h-full"
      style={{ 
        width: '210mm', 
        minHeight: '297mm',
        margin: '0 auto',
        transform: 'scale(0.75)', 
        transformOrigin: 'top center' 
      }}
    >
      {getTemplateComponent(resume.template)}
    </div>
  );
};

export default ResumePreview;
