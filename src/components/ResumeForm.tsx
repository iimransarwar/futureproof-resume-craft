
import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, Download } from 'lucide-react';
import PersonalInfoForm from './forms/PersonalInfoForm';
import WorkExperienceForm from './forms/WorkExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import SummaryForm from './forms/SummaryForm';
import FinalizeForm from './forms/FinalizeForm';
import { generatePDF } from '@/utils/generatePDF';
import { toast } from 'sonner';

const steps = [
  { name: 'Personal Info', component: PersonalInfoForm },
  { name: 'Work History', component: WorkExperienceForm },
  { name: 'Education', component: EducationForm },
  { name: 'Skills', component: SkillsForm },
  { name: 'Summary', component: SummaryForm },
  { name: 'Finalize', component: FinalizeForm },
];

const ResumeForm = () => {
  const { currentStep, setCurrentStep, state } = useResume();
  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDownload = async () => {
    try {
      const fileName = `${state.personalInfo.firstName}_${state.personalInfo.lastName}_Resume`.replace(/\s+/g, '_');
      await generatePDF('resume-preview', fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="w-full animate-fade-in">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8 px-4">
        <div className="hidden md:flex w-full max-w-3xl justify-between">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`progress-step ${
                index < currentStep
                  ? 'progress-step-completed'
                  : index === currentStep
                  ? 'progress-step-active'
                  : ''
              }`}
            >
              <div className="progress-step-number">
                {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <span className="mt-2 text-xs text-center">{step.name}</span>
            </div>
          ))}
        </div>
        <div className="md:hidden text-sm text-center">
          Step {currentStep + 1} of {steps.length}: <span className="font-medium">{steps[currentStep].name}</span>
        </div>
      </div>

      {/* Form */}
      <Card className="glass-card border-transparent w-full mb-6 transition-all duration-300 animate-slide-in">
        <div className="p-6">
          <CurrentStepComponent />
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-4 py-2 h-10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>

        <div className="flex gap-3">
          {isLastStep && (
            <Button
              variant="outline"
              onClick={handleDownload}
              className="px-4 py-2 h-10"
            >
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          )}
          {!isLastStep && (
            <Button
              onClick={handleNext}
              className="group px-4 py-2 h-10 transition-all"
            >
              Next <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;
