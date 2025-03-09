
import { useState } from 'react';
import { useResume, ResumeTemplate } from '@/contexts/ResumeContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MinimalTemplate from './resume-templates/MinimalTemplate';
import ModernTemplate from './resume-templates/ModernTemplate';
import ProfessionalTemplate from './resume-templates/ProfessionalTemplate';
import CreativeTemplate from './resume-templates/CreativeTemplate';

const templates: Array<{ id: ResumeTemplate; name: string }> = [
  { id: 'minimal', name: 'Minimal' },
  { id: 'modern', name: 'Modern' },
  { id: 'professional', name: 'Professional' },
  { id: 'creative', name: 'Creative' },
];

const TemplateSelector = () => {
  const { state, dispatch, showTemplateSelector, setShowTemplateSelector, selectedTemplate, setSelectedTemplate } = useResume();
  const [localSelectedTemplate, setLocalSelectedTemplate] = useState<ResumeTemplate>(state.template);

  const handleConfirm = () => {
    dispatch({ type: 'SET_TEMPLATE', payload: localSelectedTemplate });
    setSelectedTemplate(localSelectedTemplate);
    setShowTemplateSelector(false);
  };

  const getTemplatePreview = (templateId: ResumeTemplate) => {
    const previewResume = {
      ...state,
      template: templateId,
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '(123) 456-7890',
        profession: 'Software Engineer',
        location: 'New York, NY',
        website: 'johndoe.com'
      },
      workExperience: [
        {
          id: '1',
          company: 'Tech Company Inc.',
          position: 'Senior Developer',
          startDate: '2018-01-01',
          endDate: '',
          current: true,
          description: 'Led development of multiple projects and mentored junior developers.'
        }
      ],
      education: [
        {
          id: '1',
          school: 'University of Technology',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2014-01-01',
          endDate: '2018-01-01',
          description: 'Graduated with honors'
        }
      ],
      skills: [
        { id: '1', name: 'JavaScript', level: 5 },
        { id: '2', name: 'React', level: 4 },
        { id: '3', name: 'Node.js', level: 4 }
      ],
      summary: 'Experienced software engineer with 5+ years in web development specializing in JavaScript and React.'
    };

    switch (templateId) {
      case 'minimal':
        return <MinimalTemplate resume={previewResume} />;
      case 'modern':
        return <ModernTemplate resume={previewResume} />;
      case 'professional':
        return <ProfessionalTemplate resume={previewResume} />;
      case 'creative':
        return <CreativeTemplate resume={previewResume} />;
      default:
        return <MinimalTemplate resume={previewResume} />;
    }
  };

  return (
    <Dialog open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Choose a Resume Template</DialogTitle>
          <DialogDescription>
            Select a template that best represents your professional style.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {templates.map((template) => (
            <div 
              key={template.id}
              className={cn(
                "template-card overflow-hidden rounded-lg border-2 transition-all hover:shadow-md cursor-pointer",
                localSelectedTemplate === template.id ? "border-primary ring-2 ring-primary/20" : "border-gray-200"
              )}
              onClick={() => setLocalSelectedTemplate(template.id)}
            >
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium">{template.name}</h3>
              </div>
              <div className="p-2 aspect-[3/4] overflow-hidden bg-white">
                <div className="transform scale-[0.25] origin-top-left h-[400%] w-[400%]">
                  {getTemplatePreview(template.id)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm}>
            Select Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelector;
