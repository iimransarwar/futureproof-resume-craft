
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp, FileEdit } from 'lucide-react';
import { useResume } from '@/contexts/ResumeContext';
import { parseResumeFile } from '@/utils/resumeParser';
import { toast } from 'sonner';

interface ResumeUploadCardProps {
  onUpload: () => void;
  onSkip: () => void;
}

const ResumeUploadCard = ({ onUpload, onSkip }: ResumeUploadCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { dispatch } = useResume();
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await handleFile(file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    setIsLoading(true);
    try {
      const resumeData = await parseResumeFile(file);
      dispatch({ type: 'IMPORT_RESUME', payload: resumeData as any });
      toast.success('Resume uploaded successfully!');
      onUpload();
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process your resume. Please try again or start from scratch.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card w-full max-w-lg mx-auto overflow-hidden animate-scale-in">
      <CardContent className="p-8">
        <h2 className="text-2xl font-display font-semibold text-center mb-6">
          Are you uploading an existing resume?
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Just review, edit, and update it with new information
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-primary/5'
            } ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('resume-upload')?.click()}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <FileUp className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-center">Yes, upload my resume</h3>
            <p className="text-sm text-center text-muted-foreground">
              We'll give you expert guidance to fill out your info and enhance your resume
            </p>
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInput}
              disabled={isLoading}
            />
            {isLoading && <p className="text-sm text-primary animate-pulse">Processing...</p>}
          </div>

          <div 
            className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
            onClick={onSkip}
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <FileEdit className="w-8 h-8 text-foreground" />
            </div>
            <h3 className="text-lg font-medium text-center">No, start from scratch</h3>
            <p className="text-sm text-center text-muted-foreground">
              We'll guide you through the whole process so your skills can shine
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeUploadCard;
