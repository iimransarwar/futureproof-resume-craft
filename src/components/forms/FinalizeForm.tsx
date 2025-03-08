
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Download, Share2, RefreshCw } from 'lucide-react';
import { generatePDF } from '@/utils/generatePDF';
import { toast } from 'sonner';

const FinalizeForm = () => {
  const { state, dispatch } = useResume();
  const { personalInfo } = state;

  const handleDownload = async () => {
    try {
      const fileName = `${personalInfo.firstName}_${personalInfo.lastName}_Resume`.replace(/\s+/g, '_');
      await generatePDF('resume-preview', fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const handleStartOver = () => {
    if (confirm('Are you sure you want to start over? This will delete all your current resume data.')) {
      dispatch({ type: 'RESET_RESUME' });
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-slide-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Finalize Your Resume</h2>
        <p className="text-muted-foreground">
          Your resume is ready! Download it as a PDF or make any final adjustments.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <div className="w-8 h-8 text-green-500">✓</div>
        </div>
        <h3 className="text-xl font-medium text-green-800">Resume Complete!</h3>
        <p className="text-green-700">
          Congratulations! You've successfully created a professional resume that highlights your skills and experience.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Next Steps</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 border rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-medium flex items-center mb-2">
              <Download className="w-5 h-5 mr-2 text-primary" />
              Download Your Resume
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Save your resume as a PDF to use in your job applications.
            </p>
            <Button onClick={handleDownload} className="w-full">
              Download PDF
            </Button>
          </div>
          
          <div className="p-5 border rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-medium flex items-center mb-2">
              <Share2 className="w-5 h-5 mr-2 text-primary" />
              Share Your Resume
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Share your resume directly via email or social media.
            </p>
            <Button variant="outline" className="w-full" onClick={() => toast.info('Sharing feature will be available soon!')}>
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Additional Options</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="p-5 border rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-medium flex items-center mb-2">
              <RefreshCw className="w-5 h-5 mr-2 text-primary" />
              Start Fresh
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Create a new resume from scratch or with a different template.
            </p>
            <Button variant="outline" onClick={handleStartOver} className="w-full">
              Start Over
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-5">
        <h3 className="font-medium mb-3">Resume Writing Tips</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Regularly update your resume with new skills and experiences</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Tailor your resume for each job application to match keywords</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Keep your resume concise - aim for 1-2 pages maximum</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Have someone review your resume for feedback and errors</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Quantify your achievements with specific numbers and metrics</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FinalizeForm;
