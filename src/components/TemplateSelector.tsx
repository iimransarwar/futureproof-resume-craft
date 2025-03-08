
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResumeTemplate } from '@/types/resume';
import { useResume } from '@/contexts/ResumeContext';
import { ArrowRight } from 'lucide-react';

const templates: { id: ResumeTemplate; name: string; description: string }[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design with a focus on content',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Traditional layout ideal for corporate positions',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design for creative industries',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with a unique layout',
  },
];

interface TemplateSelectorProps {
  onNext: () => void;
}

const TemplateSelector = ({ onNext }: TemplateSelectorProps) => {
  const { state, dispatch } = useResume();
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(state.template);

  const handleTemplateSelect = (template: ResumeTemplate) => {
    setSelectedTemplate(template);
    dispatch({ type: 'SET_TEMPLATE', payload: template });
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <Card className="glass-card w-full max-w-4xl mx-auto overflow-hidden animate-fade-in">
      <CardContent className="p-8">
        <h2 className="text-2xl font-display font-semibold text-center mb-2">
          Choose Your Resume Style
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Select a template that suits your personal style and industry
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`template-card rounded-lg overflow-hidden ${
                selectedTemplate === template.id ? 'selected' : ''
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <div className="aspect-w-8 aspect-h-11 bg-muted">
                <div className={`w-full h-full flex items-center justify-center bg-${template.id}-preview`}>
                  <div className={`w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 p-4 flex flex-col`}>
                    <div className="h-6 w-24 bg-primary/20 rounded mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-12 w-12 bg-primary/30 rounded-full"></div>
                      <div className="flex flex-col justify-center">
                        <div className="h-3 w-24 bg-primary/20 rounded mb-1"></div>
                        <div className="h-3 w-16 bg-primary/10 rounded"></div>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-primary/10 rounded mb-2"></div>
                    <div className="h-3 w-full bg-primary/10 rounded mb-2"></div>
                    <div className="h-3 w-3/4 bg-primary/10 rounded mb-4"></div>
                    
                    <div className="h-4 w-20 bg-primary/20 rounded mb-2"></div>
                    <div className="h-3 w-full bg-primary/10 rounded mb-2"></div>
                    <div className="h-3 w-full bg-primary/10 rounded mb-2"></div>
                    <div className="h-3 w-1/2 bg-primary/10 rounded mb-4"></div>
                    
                    <div className="h-4 w-20 bg-primary/20 rounded mb-2"></div>
                    <div className="h-3 w-full bg-primary/10 rounded mb-2"></div>
                    <div className="h-3 w-3/4 bg-primary/10 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-card">
                <h3 className="font-medium text-sm">{template.name}</h3>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleNext}
            className="group text-md px-6 py-6 h-12 hover:scale-105 transition-all"
          >
            Continue <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;
