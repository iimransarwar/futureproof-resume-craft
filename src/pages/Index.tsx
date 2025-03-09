
import { useResume } from '@/contexts/ResumeContext';
import TemplateSelector from '@/components/TemplateSelector';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import ResumeUploadCard from '@/components/ResumeUploadCard';
import { Button } from '@/components/ui/button';
import { Layout, LayoutTemplate, Download } from 'lucide-react';

const Index = () => {
  const { state, setShowTemplateSelector } = useResume();

  const handleTemplateChange = () => {
    setShowTemplateSelector(true);
  };

  const handleDownload = async () => {
    const fileName = `${state.personalInfo.firstName || 'My'}_${state.personalInfo.lastName || 'Resume'}`.replace(/\s+/g, '_');
    try {
      const generatePDF = (await import('@/utils/generatePDF')).generatePDF;
      await generatePDF('resume-preview', fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="py-6 px-4 border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            FutureResume Builder
          </h1>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleTemplateChange}>
              <LayoutTemplate className="h-4 w-4 mr-2" />
              Change Template
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full">
            <ResumeUploadCard />
            <ResumeForm />
          </div>
          <div className="hidden lg:block sticky top-8 h-screen pb-16 overflow-auto">
            <div className="shadow-xl rounded-lg bg-white/50 backdrop-blur-sm p-4 mb-4">
              <h2 className="font-medium flex items-center gap-2 text-gray-600">
                <Layout className="h-4 w-4" />
                Preview
              </h2>
            </div>
            <div className="flex justify-center items-start overflow-hidden">
              <ResumePreview resume={state} />
            </div>
          </div>
        </div>
      </main>

      <TemplateSelector />
    </div>
  );
};

export default Index;
