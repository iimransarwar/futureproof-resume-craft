
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useResume } from '@/contexts/ResumeContext';
import { toast } from 'sonner';
import { Upload, File, X } from 'lucide-react';
import { parseResumeFile } from '@/utils/resumeParser';

const ResumeUploadCard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { dispatch, setCurrentStep, setShowTemplateSelector } = useResume();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        toast.error('Please upload a PDF or Word document.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      toast.loading('Parsing your resume...');
      const resumeData = await parseResumeFile(file);
      
      dispatch({ type: 'IMPORT_RESUME', payload: resumeData });
      setCurrentStep(0);
      setShowTemplateSelector(true);
      
      toast.dismiss();
      toast.success('Resume uploaded successfully!');
    } catch (error) {
      console.error('Error parsing resume:', error);
      toast.dismiss();
      toast.error('Failed to parse resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  return (
    <Card className="w-full mb-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Already have a resume?</CardTitle>
        <CardDescription>
          Upload your existing resume to get started faster.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
          {!file ? (
            <>
              <Upload className="h-10 w-10 text-gray-400 mb-3" />
              <p className="text-sm text-gray-500 mb-4 text-center">
                Drag and drop your resume, or click to browse
              </p>
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              <label htmlFor="resume-upload">
                <Button variant="outline" className="cursor-pointer" as="span">
                  Browse Files
                </Button>
              </label>
            </>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between bg-white p-3 rounded border mb-4">
                <div className="flex items-center">
                  <File className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={clearFile}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <Button 
                onClick={handleUpload} 
                disabled={isUploading} 
                className="w-full"
              >
                {isUploading ? 'Processing...' : 'Upload Resume'}
              </Button>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Supported formats: PDF, DOC, DOCX
        </p>
      </CardContent>
    </Card>
  );
};

export default ResumeUploadCard;
